/**
 * Fetches teddy product images from Kilimall search (kilimall.co.ke).
 * Run: npm run fetch-kilimall-images
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images");
const manifestPath = path.join(outDir, "manifest.json");
const UA = "Mozilla/5.0 (compatible; TeddyBearsKenya/1.0)";
const TARGET = Number(process.argv[2] ?? 20);
const PAGES = Number(process.argv[3] ?? 4);

const SKIP_TITLE =
  /\b(boy doll|girl doll|doll accessories|phone case|charger|cable|panda(?!.*teddy)|dinosaur|unicorn pillow|keychain|balloon only|rose box only|chocolate|flower bouquet|led light only)\b/i;

const HUMAN_TITLE =
  /\b(person|people|child|children|kid|kids|boy wearing|girl wearing|holding|wearing|with (a |the )?(man|woman|girl|boy|child)|portrait|selfie|human)\b/i;

function revive(payload, index, seen = new Set()) {
  if (index === null || index === undefined) return index;
  if (typeof index !== "number") return index;
  if (index < 0 || index >= payload.length) return index;
  if (seen.has(index)) return payload[index];
  seen.add(index);

  const val = payload[index];
  if (val && typeof val === "object" && !Array.isArray(val)) {
    const out = {};
    for (const [k, v] of Object.entries(val)) out[k] = revive(payload, v, seen);
    return out;
  }
  if (Array.isArray(val)) return val.map(v => revive(payload, v, new Set(seen)));
  return val;
}

function imageUrl(raw) {
  if (!raw || typeof raw !== "string") return null;
  const u = raw.split("#")[0];
  if (u.includes("x-image-process")) {
    return u.replace(/resize,w_\d+/, "resize,w_900").replace(/format,webp/, "format,jpg");
  }
  return u;
}

function isTeddyListing(title) {
  const t = title.toLowerCase();
  if (HUMAN_TITLE.test(t)) return false;
  if (SKIP_TITLE.test(t)) return false;
  return /teddy|plush bear|teddybear|big love teddy|stuffed bear/i.test(t);
}

function extractListings(html) {
  const m = html.match(/<script type="application\/json" id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return [];
  const payload = JSON.parse(m[1]);
  const listings = [];

  for (let i = 0; i < payload.length; i++) {
    const node = payload[i];
    if (!node || typeof node !== "object" || Array.isArray(node)) continue;
    if (!("listingId" in node && "image" in node && "title" in node)) continue;

    const item = revive(payload, i);
    if (!item?.title || !item?.image) continue;

    listings.push({
      listingId: item.listingId,
      title: String(item.title).replace(/\s+/g, " ").trim(),
      priceKsh: Math.round(Number(item.minPrice ?? item.price ?? 0)),
      image: imageUrl(item.image),
    });
  }

  return listings;
}

async function fetchSearchPage(page) {
  const url =
    page <= 1
      ? "https://www.kilimall.co.ke/search?q=teddybear"
      : `https://www.kilimall.co.ke/search?q=teddybear&page=${page}`;
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" } });
  if (!res.ok) throw new Error(`page ${page}: HTTP ${res.status}`);
  return res.text();
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error(`too small (${buf.length}b)`);
  fs.writeFileSync(dest, buf);
  return buf.length;
}

function displayName(title) {
  return title
    .replace(/Local fast delivery/gi, "")
    .replace(/Fulfilled By Kilimall/gi, "")
    .replace(/Preferred Store/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const existing = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : [];
  const startIndex = existing.reduce((m, e) => Math.max(m, e.index), 0) + 1;
  const usedImages = new Set(existing.map(e => e.url?.split("?")[0]).filter(Boolean));

  const all = [];
  for (let page = 1; page <= PAGES; page++) {
    const html = await fetchSearchPage(page);
    const listings = extractListings(html);
    console.log(`Page ${page}: ${listings.length} listings parsed`);
    for (const l of listings) {
      if (!l.image || usedImages.has(l.image)) continue;
      if (!isTeddyListing(l.title)) continue;
      usedImages.add(l.image);
      all.push(l);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n${all.length} unique teddy listings after filters`);

  const picked = all.slice(0, TARGET);
  const newEntries = [];
  let index = startIndex;

  for (const item of picked) {
    const file = `bear-${String(index).padStart(2, "0")}.jpg`;
    const dest = path.join(outDir, file);
    try {
      const bytes = await download(item.image, dest);
      newEntries.push({
        index,
        file,
        source: "kilimall.co.ke",
        listingId: item.listingId,
        name: displayName(item.title),
        priceKsh: item.priceKsh > 0 ? item.priceKsh : undefined,
        url: item.image,
        productUrl: `https://www.kilimall.co.ke/search?q=teddybear`,
      });
      console.log(`✓ ${file} ← ${displayName(item.title).slice(0, 50)} (KSh ${item.priceKsh || "—"}, ${(bytes / 1024).toFixed(0)} KB)`);
      index++;
      await new Promise(r => setTimeout(r, 400));
    } catch (err) {
      console.warn(`✗ skip ${item.title.slice(0, 40)}: ${err.message}`);
    }
  }

  if (newEntries.length === 0) {
    console.error("No images downloaded.");
    process.exit(1);
  }

  const merged = [...existing, ...newEntries].sort((a, b) => a.index - b.index);
  fs.writeFileSync(manifestPath, JSON.stringify(merged, null, 2));
  console.log(`\nDone — added ${newEntries.length} Kilimall images. Manifest: ${merged.length} total.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
