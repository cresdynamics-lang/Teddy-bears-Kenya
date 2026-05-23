/**
 * Downloads teddy product images from Amazon.co.uk listing pages (hiRes photos).
 * Usage: node scripts/download-amazon-images.mjs [startIndex]
 * Example: node scripts/download-amazon-images.mjs 41
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images");
const manifestPath = path.join(outDir, "manifest.json");
const START = Number(process.argv[2] ?? 41);
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

/** Teddy-only ASINs from Amazon UK (related collector / plush listings). */
const ASINS = [
  {
    asin: "B0BHT7H846",
    slug: "deans-andrew-teddy-35cm",
    name: "Dean's Andrew Teddy — Limited Edition Mohair (35cm)",
    priceKsh: 14500,
    category: "Personalized",
    size: "Medium",
    description: "Fine mohair collector bear, 5-way jointed, limited to 299 pieces. Light beige, washable.",
    featured: true,
  },
  {
    asin: "B0CY2R5ZK6",
    slug: "clemens-bjorn-mohair-40cm",
    name: "Clemens Björn Mohair Teddy (40cm)",
    priceKsh: 18500,
    category: "Personalized",
    size: "Medium",
    description: "Finest German mohair, soft & cuddly, includes collector passport.",
  },
  {
    asin: "B0BVBNGQYY",
    slug: "clemens-artur-mohair-35cm",
    name: "Clemens Artur Mohair Teddy (35cm)",
    priceKsh: 17200,
    category: "Personalized",
    size: "Medium",
    description: "Limited edition movable mohair bear — heirloom gift quality.",
  },
  {
    asin: "B0BZD52Y2Q",
    slug: "clemens-quentin-mohair-26cm",
    name: "Clemens Quentin Mohair Teddy (26cm)",
    priceKsh: 13800,
    category: "Small",
    size: "Small",
    description: "Compact limited-edition mohair bear with jointed limbs.",
  },
  {
    asin: "B083RCRMDL",
    slug: "steiff-paddy-golden-brown",
    name: "Steiff Paddy Teddy Bear — Golden Brown",
    priceKsh: 10500,
    category: "Medium",
    size: "Medium",
    description: "Classic Steiff golden-brown plush — premium European craftsmanship.",
    featured: true,
  },
  {
    asin: "B0799LQTD5",
    slug: "steiff-bearzy-beige",
    name: "Steiff Soft Cuddly Friends Bearzy (Beige)",
    priceKsh: 6500,
    category: "Medium",
    size: "Medium",
    description: "Ultra-soft Steiff cuddly friend — everyday hugs in premium plush.",
  },
  {
    asin: "B000EEQ3TY",
    slug: "steiff-fynn-suitcase",
    name: "Steiff Fynn Teddy Bear in Suitcase (28cm)",
    priceKsh: 8500,
    category: "Gift Sets",
    size: "Small",
    description: "Travel-ready Steiff bear in a gift suitcase — perfect for surprises.",
    featured: true,
  },
  {
    asin: "B0BH98211K",
    slug: "steiff-soft-cuddly-friends",
    name: "Steiff Soft Cuddly Friends Teddy",
    priceKsh: 7200,
    category: "Medium",
    size: "Medium",
    description: "Gentle Steiff plush with signature quality stitching.",
  },
];

async function fetchPage(asin) {
  const res = await fetch(`https://www.amazon.co.uk/dp/${asin}`, {
    headers: { "User-Agent": UA, "Accept-Language": "en-GB,en;q=0.9" },
  });
  if (!res.ok) throw new Error(`page HTTP ${res.status}`);
  return res.text();
}

function parseHiRes(html) {
  return [
    ...new Set(
      [...html.matchAll(/"hiRes":"(https:[^"]+)"/g)].map(m => m[1].replace(/\\u002F/g, "/")),
    ),
  ];
}

function parseTitle(html) {
  return html.match(/<span id="productTitle"[^>]*>\s*([^<]+)/)?.[1]?.trim();
}

async function download(url, dest, retries = 4) {
  for (let i = 0; i <= retries; i++) {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    if (res.status === 429 && i < retries) {
      await new Promise(r => setTimeout(r, 3000 * (i + 1)));
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 8000) throw new Error(`too small (${buf.length}b)`);
    fs.writeFileSync(dest, buf);
    return buf.length;
  }
  throw new Error("download failed");
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  let manifest = [];
  if (fs.existsSync(manifestPath)) {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  }

  const usedUrls = new Set(manifest.map(e => e.url).filter(Boolean));
  let index = START;

  for (const item of ASINS) {
    console.log(`Fetching ${item.asin}…`);
    const html = await fetchPage(item.asin);
    const hiRes = parseHiRes(html);
    const title = parseTitle(html) ?? item.name;
    const url = hiRes.find(u => !usedUrls.has(u)) ?? hiRes[0];
    if (!url) {
      console.warn(`✗ no image for ${item.asin}`);
      continue;
    }

    const file = `bear-${String(index).padStart(2, "0")}.jpg`;
    const dest = path.join(outDir, file);
    const bytes = await download(url, dest);
    usedUrls.add(url);

    manifest.push({
      index,
      file,
      source: "amazon.co.uk",
      asin: item.asin,
      slug: item.slug,
      name: item.name,
      amazonTitle: title,
      priceKsh: item.priceKsh,
      category: item.category,
      size: item.size,
      description: item.description,
      featured: item.featured ?? false,
      url,
      productUrl: `https://www.amazon.co.uk/dp/${item.asin}`,
    });

    console.log(`✓ ${file} ← ${item.name.slice(0, 50)}… (${(bytes / 1024).toFixed(0)} KB)`);
    index++;
    await new Promise(r => setTimeout(r, 2000));
  }

  manifest.sort((a, b) => a.index - b.index);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nDone — manifest now has ${manifest.length} entries (added ${index - START}).`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
