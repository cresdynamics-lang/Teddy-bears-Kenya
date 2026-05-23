/**
 * Downloads teddy-bear product images from Teddy Bear Haven (teddybearhaven.co.ke).
 * Run: npm run fetch-haven-images
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images");
const UA = "TeddyBearsKenya/1.0 (storefront sync)";
const API = "https://teddybearhaven.co.ke/wp-json/wc/store/products?per_page=100";

const SKIP_NAME = /flower|bouquet|rose box|chocolate|bloom|gift card|customi|name and|heartfelt gifts|stunning gifts|valentine.*gift(?!.*teddy)/i;
const SKIP_CAT = /flower|chocolate|rose|gift card|customi/i;
const SKIP_PRODUCT = /elephant|mickey|mini mouse/i;

function isTeddyProduct(p) {
  const name = p.name.replace(/&#8211;/g, "-");
  if (SKIP_NAME.test(name)) return false;
  if (SKIP_PRODUCT.test(name)) return false;
  const cats = (p.categories ?? []).map(c => `${c.name} ${c.slug}`).join(" ");
  if (SKIP_CAT.test(cats) && !/teddy|plush|bear|panda/.test(cats + name)) return false;
  return /teddy|plush bear|panda|giant.*bear|big.*bear/i.test(name + cats);
}

function cleanImageUrl(src) {
  const u = new URL(src);
  u.search = "fit=960%2C960&ssl=1";
  return u.toString();
}

function extFromUrl(url, contentType) {
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("png")) return "png";
  const m = url.pathname.match(/\.(jpe?g|webp|png)$/i);
  return m ? m[1].toLowerCase().replace("jpeg", "jpg") : "jpg";
}

async function download(url, dest) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    if (res.status === 429 && attempt < 3) {
      await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 5000) throw new Error(`too small (${buf.length}b)`);
    fs.writeFileSync(dest, buf);
    return { bytes: buf.length, contentType: res.headers.get("content-type") ?? "" };
  }
  throw new Error("failed after retries");
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const res = await fetch(API, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const products = await res.json();

  const teddy = products.filter(isTeddyProduct).filter(p => p.images?.[0]?.src);
  const seen = new Set();
  const unique = [];
  for (const p of teddy) {
    const src = p.images[0].src.split("?")[0];
    if (seen.has(src)) continue;
    seen.add(src);
    unique.push({
      name: p.name.replace(/&#8211;/g, "-").replace(/<[^>]+>/g, ""),
      price: p.prices?.price ? Math.round(Number(p.prices.price) / 100) : null,
      slug: p.slug,
      src: p.images[0].src,
    });
  }

  console.log(`Found ${unique.length} unique teddy images from Teddy Bear Haven`);

  const manifest = [];
  let index = 1;

  for (const item of unique) {
    const url = cleanImageUrl(item.src);
    const tmpExt = extFromUrl(new URL(item.src));
    const file = `bear-${String(index).padStart(2, "0")}.${tmpExt}`;
    const dest = path.join(outDir, file);

    try {
      const { bytes, contentType } = await download(url, dest);
      const ext = extFromUrl(new URL(item.src), contentType);
      const finalFile = `bear-${String(index).padStart(2, "0")}.${ext}`;
      const finalDest = path.join(outDir, finalFile);
      if (finalFile !== file) {
        fs.renameSync(dest, finalDest);
      }
      manifest.push({
        index,
        file: finalFile,
        source: "teddybearhaven.co.ke",
        slug: item.slug,
        name: item.name,
        priceKsh: item.price,
      });
      console.log(`✓ ${finalFile} ← ${item.name.slice(0, 50)}… (${(bytes / 1024).toFixed(0)} KB)`);
      index++;
      await new Promise(r => setTimeout(r, 400));
    } catch (err) {
      console.warn(`✗ skip ${item.name.slice(0, 40)}: ${err.message}`);
    }
  }

  // Fill remaining slots from existing commons images if we have bear-XX already beyond haven count
  const TARGET = 40;
  const existing = fs.readdirSync(outDir).filter(f => /^bear-\d+\.(jpe?g|webp|png)$/i.test(f));
  const usedIndices = new Set(manifest.map(m => m.index));

  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`\nSaved ${manifest.length} Haven images. manifest.json updated.`);
  console.log(`Assign products to bear-01 … bear-${String(manifest.length).padStart(2, "0")} in products.ts`);
  if (manifest.length < TARGET) {
    console.log(`Tip: run npm run fetch-images ${TARGET} to fill ${TARGET - manifest.length} more from Wikimedia`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
