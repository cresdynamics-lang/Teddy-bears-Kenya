import manifest from "../../public/images/manifest.json";
import { bearImage } from "@/lib/images";

export type Category = "Small" | "Medium" | "Giant" | "Personalized" | "Gift Sets";

export interface Product {
  id: string;
  name: string;
  price: number; // KSh
  category: Category;
  size: "Small" | "Medium" | "Giant";
  occasion: string[];
  image: string;
  description: string;
  rating: number;
  featured?: boolean;
}

type ManifestEntry = {
  index: number;
  file: string;
  source?: string;
  slug?: string;
  name?: string;
  priceKsh?: number;
  category?: Category;
  size?: Product["size"];
  description?: string;
  featured?: boolean;
};

/** Friendly labels for Wikimedia-sourced photos (29–40). */
const WIKI_PRODUCTS: Record<
  number,
  { name: string; price: number; category: Category; size: Product["size"]; description: string; featured?: boolean }
> = {
  29: { name: "Steiff Museum Classic", price: 3200, category: "Personalized", size: "Medium", description: "Heritage Steiff-style bear inspired by museum classics.", featured: true },
  30: { name: "Vintage Steiff Ruderer", price: 2900, category: "Medium", size: "Medium", description: "Vintage jointed bear with timeless European charm." },
  31: { name: "Berlin Display Giant", price: 8500, category: "Giant", size: "Giant", description: "Showroom-scale plush — a statement piece for any room." },
  32: { name: "Polar Plush Bear", price: 2400, category: "Medium", size: "Medium", description: "Snow-white plush bear with the softest Arctic-cream fur." },
  33: { name: "Online Bestseller Bear", price: 2200, category: "Medium", size: "Medium", description: "Our crowd-pleasing mid-size bear — soft, classic, always in stock." },
  34: { name: "Poolside Snuggler", price: 2100, category: "Small", size: "Small", description: "Playful summer bear — light, cheerful, and gift-ready." },
  35: { name: "Julia Handmade Bear", price: 3400, category: "Personalized", size: "Medium", description: "Hand-finished plush with artisan stitching details." },
  36: { name: "Handmade Honey Bear", price: 1900, category: "Small", size: "Small", description: "Small-batch handmade bear with honey-brown fur." },
  37: { name: "Holland Tomato Teddy", price: 2300, category: "Gift Sets", size: "Medium", description: "Quirky collector bear — a fun surprise in every hug.", featured: true },
  38: { name: "Travel Companion Bear", price: 2500, category: "Medium", size: "Medium", description: "Adventure-ready plush that tags along anywhere." },
  39: { name: "Garden Daydream Bear", price: 2600, category: "Medium", size: "Medium", description: "Soft bear with a dreamy pastel palette — nursery perfect." },
  40: { name: "Holiday Ornament Bear", price: 1800, category: "Gift Sets", size: "Small", description: "Festive mini bear — ideal for Christmas and celebrations." },
};

function cleanName(name: string) {
  return name
    .replace(/\.(jpe?g|webp|png)$/i, "")
    .replace(/\s*-\s*Buy Teddy Bear.*$/i, "")
    .replace(/\s*-\s*Snuggle Up.*$/i, "")
    .trim();
}

function inferSize(name: string): Product["size"] {
  const n = name.toLowerCase();
  if (/\b180cm|\b160cm|\b150cm|\b140cm|\b130cm|\b120cm|\b110cm|\b100cm|life-sized|giant|big 120|big teddy bear doll|big teddy bears kenya|sweet love giant|panda giant/i.test(n))
    return "Giant";
  if (/\b65cm|\b70cm|\b50cm|100cm sweet|royal purple|ultimate giant plush|cuddle companion/i.test(n)) return "Medium";
  if (/\b25cm|\b35cm|everyday joy|25 cm|35 cm|sitting height/i.test(n) && !/\b50cm|\b65cm|\b100cm|\b120cm/i.test(n))
    return "Small";
  if (/panda/i.test(n) && !/giant/i.test(n)) return "Medium";
  return "Medium";
}

function inferCategory(name: string, size: Product["size"]): Category {
  const n = name.toLowerCase();
  if (/personaliz|custom|monogram|embroid|name/i.test(n)) return "Personalized";
  if (/duo|bundle|pair|gift box|bloom|choco/i.test(n)) return "Gift Sets";
  if (/collection|ultimate giant plush|everyday joy/i.test(n) && size !== "Giant") return "Gift Sets";
  if (size === "Small") return "Small";
  if (size === "Giant") return "Giant";
  return "Medium";
}

function inferOccasion(name: string, category: Category): string[] {
  const n = name.toLowerCase();
  if (/valentine|love|heart|red/i.test(n)) return ["Valentines", "Anniversary"];
  if (/birthday|120cm.*birthday/i.test(n)) return ["Birthday", "Surprise"];
  if (/baby|newborn/i.test(n)) return ["Baby Shower", "Newborn"];
  if (/panda|collection|gift/i.test(n)) return ["Birthday", "Just Because"];
  if (category === "Giant") return ["Anniversary", "Surprise"];
  if (category === "Personalized") return ["Birthday", "Anniversary"];
  return ["Birthday", "Just Because"];
}

function buildFromManifest(entry: ManifestEntry): Product {
  const wiki = WIKI_PRODUCTS[entry.index];
  const rawName = entry.name ?? `Teddy Bear #${entry.index}`;
  const name =
    wiki?.name ??
    (entry.source === "amazon.co.uk" || entry.source === "kavsi.co.ke" ? rawName : cleanName(rawName));
  const size = wiki?.size ?? entry.size ?? inferSize(rawName);
  const category = wiki?.category ?? entry.category ?? inferCategory(rawName, size);
  const price = wiki?.price ?? entry.priceKsh ?? (size === "Giant" ? 7000 : size === "Small" ? 1800 : 3500);

  const sourceDesc =
    entry.source === "teddybearhaven.co.ke"
      ? `Premium plush from our Kenya collection — ${name}. Same-day Nairobi delivery.`
      : entry.source === "amazon.co.uk"
        ? `${entry.description ?? name} Premium collector plush — Nairobi delivery available.`
        : entry.source === "kavsi.co.ke"
          ? entry.description ?? `${name} — adorable plush teddy, delivered with love in Nairobi.`
          : `Soft, cuddly, and gift-ready. ${name} — delivered with love across Kenya.`;

  return {
    id: entry.slug ?? `bear-${entry.index}`,
    name,
    price,
    category,
    size,
    occasion: inferOccasion(rawName, category),
    image: bearImage(entry.index),
    description: wiki?.description ?? entry.description ?? sourceDesc,
    rating: entry.index % 5 === 0 ? 4 : 5,
    featured: wiki?.featured ?? entry.featured ?? [1, 5, 7, 8, 13, 23, 41, 45, 47].includes(entry.index),
  };
}

export const products: Product[] = (manifest as ManifestEntry[]).map(buildFromManifest);

export const categories: { name: Category; blurb: string; image: string }[] = [
  { name: "Small", blurb: "Pocket-sized hugs from KSh 1,100", image: bearImage(23) },
  { name: "Medium", blurb: "Just-right cuddles from KSh 2,000", image: bearImage(2) },
  { name: "Giant", blurb: "Life-size giants up to 180 cm", image: bearImage(5) },
  { name: "Personalized", blurb: "Collector mohair & custom bears", image: bearImage(41) },
  { name: "Gift Sets", blurb: "Curated bundles, ready to gift", image: bearImage(6) },
];

export const formatKsh = (n: number) => `KSh ${n.toLocaleString("en-KE")}`;

export const categoryOrder: Category[] = ["Small", "Medium", "Giant", "Personalized", "Gift Sets"];

export function productsByCategory(category: Category) {
  return products.filter(p => p.category === category);
}

export function groupedProducts() {
  return categoryOrder.map(name => ({
    category: name,
    products: productsByCategory(name),
  }));
}

export const featuredProducts = products.filter(p => p.featured);
