/**
 * Downloads unique teddy-bear-only images from Wikimedia Commons.
 * Usage: node scripts/download-teddy-images.mjs [count]
 * Default count: 40
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images");
const UA = "TeddyBearsKenya/1.0 (educational storefront; contact: hello@teddybears.co.ke)";
const TARGET = Number(process.argv[2] ?? 40);
const START = Number(process.argv[3] ?? 1);
const WIDTH = 900;

const BLOCKED =
  /\b(person|people|child|children|kid|kids|boy|girl|baby holding|holding |hugged|family|woman|man|portrait|selfie|face|hand|player|actor|politician|president|queen|king charles|obama|trump| mit | la jana|with (a |the )?(man|woman|girl|boy|child))\b/i;

const CATEGORIES = [
  "Category:Teddy_bears",
  "Category:Individual_teddy_bears",
  "Category:Brown_teddy_bears",
  "Category:Pink_teddy_bears",
  "Category:White_teddy_bears",
  "Category:Steiff_teddy_bears",
  "Category:Teddy_bear_museums",
  "Category:Teddy_bears_in_art",
];

async function commonsApi(params) {
  const url = `https://commons.wikimedia.org/w/api.php?${new URLSearchParams({
    format: "json",
    origin: "*",
    ...params,
  })}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

async function searchCommonsImages() {
  const titles = new Set();

  for (const cat of CATEGORIES) {
    let cmcontinue;
    do {
      const data = await commonsApi({
        action: "query",
        generator: "categorymembers",
        gcmtitle: cat,
        gcmtype: "file",
        gcmlimit: "50",
        ...(cmcontinue ? { gcmcontinue: cmcontinue } : {}),
      });
      for (const p of Object.values(data.query?.pages ?? {})) {
        if (p.title?.startsWith("File:")) titles.add(p.title);
      }
      cmcontinue = data.continue?.gcmcontinue;
    } while (cmcontinue && titles.size < 250);
  }

  // Text search for additional teddy-only files
  let sroffset = 0;
  for (let page = 0; page < 4; page++) {
    const data = await commonsApi({
      action: "query",
      list: "search",
      srsearch: "teddy bear plush stuffed -person -child -holding",
      srnamespace: "6",
      srlimit: "50",
      sroffset: String(sroffset),
    });
    for (const hit of data.query?.search ?? []) {
      titles.add(`File:${hit.title}`);
    }
    sroffset = data.continue?.sroffset;
    if (!sroffset) break;
  }

  return [...titles];
}

function isTeddyOnly(title) {
  const name = title.replace(/^File:/, "");
  if (BLOCKED.test(name)) return false;
  if (!/teddy|plush|stuffed|steiff|bear/i.test(name)) return false;
  if (/logo|icon|svg|diagram|map|chart|video|\.gif|stamp|coin|medal|patch|emblem/i.test(name)) return false;
  return true;
}

async function resolveThumbUrls(fileTitles) {
  const filtered = fileTitles.filter(isTeddyOnly);
  const urls = [];

  for (let i = 0; i < filtered.length; i += 50) {
    const batch = filtered.slice(i, i + 50);
    const data = await commonsApi({
      action: "query",
      titles: batch.join("|"),
      prop: "imageinfo",
      iiprop: "url|mime|size",
      iiurlwidth: String(WIDTH),
    });
    for (const p of Object.values(data.query?.pages ?? {})) {
      const info = p.imageinfo?.[0];
      if (!info?.thumburl || !info.mime?.startsWith("image/")) continue;
      if ((info.size ?? 0) < 8000) continue;
      urls.push({ title: p.title, url: info.thumburl });
    }
    await new Promise(r => setTimeout(r, 200));
  }

  return urls;
}

async function downloadOne(url, dest, retries = 4) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, {
      headers: { "User-Agent": UA },
      redirect: "follow",
    });
    if (res.status === 429 && attempt < retries) {
      await new Promise(r => setTimeout(r, 3000 * (attempt + 1)));
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 8000) throw new Error(`too small (${buf.length}b)`);
    fs.writeFileSync(dest, buf);
    return buf.length;
  }
  throw new Error("download failed after retries");
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`Searching Wikimedia Commons (target: ${TARGET})…`);
  const titles = await searchCommonsImages();
  let candidates = await resolveThumbUrls(titles);

  const seen = new Set();
  candidates = candidates.filter(c => {
    const key = c.url.split("/").slice(-2).join("/");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`Found ${candidates.length} unique candidates`);

  if (candidates.length < TARGET) {
    throw new Error(`Only ${candidates.length} suitable images found (need ${TARGET})`);
  }

  const picked = candidates.slice(0, TARGET);
  const manifestPath = path.join(outDir, "manifest.json");
  let existingManifest = [];
  if (fs.existsSync(manifestPath)) {
    try {
      existingManifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    } catch {}
  }

  for (let i = 0; i < picked.length; i++) {
    const index = START + i;
    const name = `bear-${String(index).padStart(2, "0")}.jpg`;
    const dest = path.join(outDir, name);
    const bytes = await downloadOne(picked[i].url, dest);
    console.log(`✓ ${name} ← ${picked[i].title.replace(/^File:/, "").slice(0, 55)}… (${(bytes / 1024).toFixed(0)} KB)`);
    await new Promise(r => setTimeout(r, 800));
  }

  const newEntries = picked.map((p, i) => ({
    index: START + i,
    file: `bear-${String(START + i).padStart(2, "0")}.jpg`,
    source: "wikimedia.commons",
    name: p.title.replace(/^File:/, ""),
    commons: `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title)}`,
    url: p.url,
  }));

  const merged = [
    ...existingManifest.filter(e => e.index < START || e.index >= START + picked.length),
    ...newEntries,
  ].sort((a, b) => a.index - b.index);

  fs.writeFileSync(manifestPath, JSON.stringify(merged, null, 2));
  console.log(`\nDone — ${picked.length} images (bear-${String(START).padStart(2, "0")} …). manifest.json has ${merged.length} entries.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
