/**
 * Downloads / refreshes teddy images from Kavsi Limited (kavsi.co.ke).
 * Re-downloads existing Kavsi entries in manifest (bear-48+).
 * Run: npm run fetch-kavsi-images
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images");
const manifestPath = path.join(outDir, "manifest.json");
const UA = "TeddyBearsKenya/1.0 (storefront sync)";
const API = "https://www.kavsi.co.ke/collections/teddy-bears/products.json?limit=50";

function shopifyImageUrl(src) {
  const u = new URL(src);
  u.searchParams.set("width", "1200");
  if (/\.heic/i.test(src)) u.searchParams.set("format", "jpg");
  return u.toString();
}

function isTeddy(title) {
  return /teddy bear/i.test(title) && !/dinosaur|piggy/i.test(title);
}

function displayName(title) {
  return title
    .replace(/-/g, " ")
    .replace(/\biloveu\b/i, "I Love You")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());
}

function inferMeta(title, priceKsh) {
  const n = title.toLowerCase();
  const size = priceKsh <= 2000 ? "Small" : "Medium";
  let category = size === "Small" ? "Small" : "Medium";
  if (/valentine|heart|rose|love/i.test(n)) category = "Gift Sets";
  return {
    size,
    category,
    description: `${displayName(title)} — soft plush teddy from Nairobi. Gift-wrapped delivery across Kenya.`,
    featured: /valentine|heart/i.test(n),
  };
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 3000) throw new Error(`too small (${buf.length}b)`);
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  let manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : [];

  const kavsiIndices = manifest.filter(e => e.source === "kavsi.co.ke").map(e => e.index);
  manifest = manifest.filter(e => e.source !== "kavsi.co.ke");

  let index =
    kavsiIndices.length > 0 ? Math.min(...kavsiIndices) : manifest.reduce((m, e) => Math.max(m, e.index), 0) + 1;

  const res = await fetch(API, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const { products } = await res.json();

  const teddy = products.filter(p => isTeddy(p.title) && p.images?.[0]?.src);
  console.log(`Refreshing ${teddy.length} Kavsi teddy images…`);

  for (const p of teddy) {
    const src = p.images[0].src;
    const url = shopifyImageUrl(src);
    const priceKsh = Math.round(Number(p.variants?.[0]?.price ?? 1800));
    const meta = inferMeta(p.title, priceKsh);
    const file = `bear-${String(index).padStart(2, "0")}.jpg`;
    const dest = path.join(outDir, file);

    const bytes = await download(url, dest);

    manifest.push({
      index,
      file,
      source: "kavsi.co.ke",
      slug: p.handle,
      name: displayName(p.title),
      priceKsh,
      category: meta.category,
      size: meta.size,
      description: meta.description,
      featured: meta.featured,
      url,
      productUrl: `https://www.kavsi.co.ke/products/${p.handle}`,
    });

    console.log(`✓ ${file} ← ${displayName(p.title)} (KSh ${priceKsh}, ${(bytes / 1024).toFixed(0)} KB)`);
    index++;
    await new Promise(r => setTimeout(r, 300));
  }

  manifest.sort((a, b) => a.index - b.index);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nDone — ${teddy.length} Kavsi images updated. Manifest: ${manifest.length} total.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
