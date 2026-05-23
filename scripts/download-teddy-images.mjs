/**
 * Downloads unique teddy-bear-only images from Wikimedia Commons (no people).
 * Usage: node scripts/download-teddy-images.mjs [count] [startIndex]
 *   startIndex: number, or "auto" to append after manifest (default auto)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images");
const manifestPath = path.join(outDir, "manifest.json");
const UA = "TeddyBearsKenya/1.0 (educational storefront; contact: hello@teddybears.co.ke)";
const TARGET = Number(process.argv[2] ?? 20);
const START_ARG = process.argv[3] ?? "auto";
const WIDTH = 960;

/** Reject titles likely to show people holding/wearing bears. */
const BLOCKED =
  /\b(person|people|human|humans|child|children|kid|kids|boy|girl|boys|girls|baby|babies|toddler|infant|family|families|woman|women|man|men|male|female|lady|ladies|gentleman|couple|couples|friend|friends|parent|parents|mother|father|mom|dad|grandma|grandpa|sibling|brother|sister|holding|holds|held|hugged|hugging|carrying|carried|wearing|wears|worn|wear|dressed|model|models|lifestyle|photoshoot|portrait|portraits|selfie|face|faces|hand|hands|arm|arms|lap|shoulder|player|actor|actress|celebr|politician|president|princess|prince|queen|king|visitor|visitors|tourist|crowd|audience|nurse|doctor|patient|wedding|bride|groom|graduation|school|classroom|kindergarten|sleepover|story time|fortepan|jana|foerster|mit | mit\.|la jana|with (a |the |his |her )?(man|woman|girl|boy|child|kid|baby|person|people)|in (a |the )?hand|on (a |the )?(lap|shoulder)|next to (a |the )?(man|woman|child)|sitting (on|with) (a )?(man|woman|person|child))\b/i;

const BLOCKED_EXTRA = /(lifestyle|lookbook|unboxing|review|instagram|tiktok|snapchat|fan meet|red carpet|press conference|award ceremony)/i;

const CATEGORIES = [
  "Category:Teddy_bears",
  "Category:Individual_teddy_bears",
  "Category:Brown_teddy_bears",
  "Category:Pink_teddy_bears",
  "Category:White_teddy_bears",
  "Category:Steiff_teddy_bears",
  "Category:Black_teddy_bears",
  "Category:Blue_teddy_bears",
  "Category:Red_teddy_bears",
  "Category:Miniature_teddy_bears",
  "Category:Teddy_bear_shops",
];

const SEARCHES = [
  "teddy bear plush stuffed toy product -person -child -holding -wearing",
  "steiff teddy bear studio -person -child",
  "brown teddy bear isolated -person -child -hand",
  "pink teddy bear plush -person -girl -boy",
  "giant teddy bear display store -person -child",
  "vintage teddy bear collectible -person -portrait",
];

function loadManifest() {
  if (!fs.existsSync(manifestPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch {
    return [];
  }
}

function resolveStart(manifest) {
  if (START_ARG !== "auto" && !Number.isNaN(Number(START_ARG))) return Number(START_ARG);
  const max = manifest.reduce((m, e) => Math.max(m, e.index), 0);
  return max + 1;
}

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
    } while (cmcontinue && titles.size < 400);
  }

  for (const srsearch of SEARCHES) {
    let sroffset = 0;
    for (let page = 0; page < 3; page++) {
      const data = await commonsApi({
        action: "query",
        list: "search",
        srsearch,
        srnamespace: "6",
        srlimit: "50",
        ...(sroffset ? { sroffset: String(sroffset) } : {}),
      });
      for (const hit of data.query?.search ?? []) {
        titles.add(`File:${hit.title}`);
      }
      sroffset = data.continue?.sroffset;
      if (!sroffset) break;
    }
  }

  return [...titles];
}

function isTeddyOnly(title) {
  const name = title.replace(/^File:/, "");
  if (BLOCKED.test(name) || BLOCKED_EXTRA.test(name)) return false;
  if (!/teddy|plush|stuffed|steiff|bear/i.test(name)) return false;
  if (/logo|icon|svg|diagram|map|chart|video|\.gif|stamp|coin|medal|patch|emblem|banner|poster|advert|ad |label|packaging|box only|museum sign|shop front|storefront|building|interior wide/i.test(name))
    return false;
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
    await new Promise(r => setTimeout(r, 250));
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
  const existingManifest = loadManifest();
  const START = resolveStart(existingManifest);

  const usedTitles = new Set(
    existingManifest
      .filter(e => e.source === "wikimedia.commons" && e.name)
      .map(e => `File:${e.name}`),
  );
  const usedUrls = new Set(existingManifest.map(e => e.url).filter(Boolean));

  console.log(`Searching Wikimedia Commons (target: ${TARGET}, start: bear-${String(START).padStart(2, "0")})…`);
  const titles = await searchCommonsImages();
  let candidates = await resolveThumbUrls(titles);

  const seen = new Set();
  candidates = candidates.filter(c => {
    if (usedTitles.has(c.title) || usedUrls.has(c.url)) return false;
    const key = c.url.split("/").slice(-2).join("/");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`Found ${candidates.length} new candidates (no people in title metadata)`);

  if (candidates.length === 0) {
    console.error("No new suitable images found.");
    process.exit(1);
  }

  const picked = candidates.slice(0, TARGET);
  const newEntries = [];

  for (let i = 0; i < picked.length; i++) {
    const index = START + i;
    const file = `bear-${String(index).padStart(2, "0")}.jpg`;
    const dest = path.join(outDir, file);

    try {
      const bytes = await downloadOne(picked[i].url, dest);
      newEntries.push({
        index,
        file,
        source: "wikimedia.commons",
        name: picked[i].title.replace(/^File:/, ""),
        commons: `https://commons.wikimedia.org/wiki/${encodeURIComponent(picked[i].title)}`,
        url: picked[i].url,
      });
      console.log(`✓ ${file} ← ${picked[i].title.replace(/^File:/, "").slice(0, 55)}… (${(bytes / 1024).toFixed(0)} KB)`);
      await new Promise(r => setTimeout(r, 700));
    } catch (err) {
      console.warn(`✗ skip ${picked[i].title}: ${err.message}`);
    }
  }

  if (newEntries.length === 0) {
    console.error("All downloads failed.");
    process.exit(1);
  }

  const merged = [
    ...existingManifest.filter(e => !newEntries.some(n => n.index === e.index)),
    ...newEntries,
  ].sort((a, b) => a.index - b.index);

  fs.writeFileSync(manifestPath, JSON.stringify(merged, null, 2));
  console.log(
    `\nDone — added ${newEntries.length} images (bear-${String(START).padStart(2, "0")} …). manifest.json has ${merged.length} entries.`,
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
