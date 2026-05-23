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

/** Friendly labels for Wikimedia-sourced photos (29–40, 51–75). */
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
  51: { name: "Classic Brown Plush", price: 2100, category: "Medium", size: "Medium", description: "Timeless brown teddy — soft, neutral, and gift-ready." },
  52: { name: "Honey Cuddle Bear", price: 1950, category: "Small", size: "Small", description: "Warm honey-toned plush perfect for everyday hugs." },
  53: { name: "Pastel Nursery Bear", price: 2300, category: "Medium", size: "Medium", description: "Gentle pastel plush ideal for nurseries and baby gifts." },
  54: { name: "Collector Mohair Classic", price: 4200, category: "Personalized", size: "Medium", description: "Premium mohair-style bear with heirloom quality.", featured: true },
  55: { name: "Blush Heart Teddy", price: 2400, category: "Gift Sets", size: "Medium", description: "Blush-pink bear for anniversaries and sweet surprises." },
  56: { name: "Midnight Navy Bear", price: 2200, category: "Medium", size: "Medium", description: "Deep navy plush with a sophisticated, cozy feel." },
  57: { name: "Cream Snuggle Bear", price: 1850, category: "Small", size: "Small", description: "Ivory-cream teddy — light, soft, and universally loved." },
  58: { name: "Showroom Giant Plush", price: 9200, category: "Giant", size: "Giant", description: "Oversized display bear that transforms any room." },
  59: { name: "Museum Miniature Steiff", price: 3100, category: "Personalized", size: "Small", description: "Museum-display miniature Steiff-style bear in pristine condition." },
  60: { name: "Rose Gift Teddy", price: 2600, category: "Gift Sets", size: "Medium", description: "Romantic rose-accent plush for special occasions.", featured: true },
  61: { name: "Rothenburg Giant Steiff", price: 2800, category: "Giant", size: "Giant", description: "Large Steiff-style teddy — an impressive showroom centerpiece." },
  62: { name: "Pink Display Teddy", price: 2100, category: "Medium", size: "Medium", description: "Bright pink plush bear for cheerful gifting." },
  63: { name: "Shop Window Bear", price: 2000, category: "Medium", size: "Medium", description: "Display-quality teddy from our curated shop selection." },
  64: { name: "Ribbon Valentine Bear", price: 2400, category: "Gift Sets", size: "Medium", description: "Valentine-ready bear with a personalized ribbon." },
  65: { name: "Steiff Mourning Classic", price: 3800, category: "Personalized", size: "Medium", description: "Historic Steiff-style bear with heritage stitching." },
  66: { name: "Twin Plush Set", price: 3200, category: "Gift Sets", size: "Medium", description: "Matching pair of plush bears — double the hugs." },
  67: { name: "1950s Original Style", price: 3500, category: "Personalized", size: "Medium", description: "Mid-century teddy styling with authentic proportions." },
  68: { name: "Titanic Memorial Bear", price: 4200, category: "Personalized", size: "Medium", description: "Limited memorial-edition style plush bear.", featured: true },
  69: { name: "George Collector Bear", price: 3900, category: "Personalized", size: "Medium", description: "Named collector bear with premium mohair feel." },
  70: { name: "Munich Antique Steiff", price: 4500, category: "Personalized", size: "Medium", description: "Antique-style Steiff bear from European tradition." },
  71: { name: "Heritage Jointed Bear", price: 4100, category: "Personalized", size: "Medium", description: "Jointed limbs and glass-style eyes — display worthy." },
  72: { name: "Vintage Golden Mohair", price: 4300, category: "Personalized", size: "Medium", description: "Golden mohair-tone bear with vintage character." },
  73: { name: "Classic Amber Bear", price: 4000, category: "Personalized", size: "Medium", description: "Warm amber plush with heirloom presentation." },
  74: { name: "Mini Steiff Style", price: 2200, category: "Small", size: "Small", description: "Miniature teddy with signature Steiff craftsmanship." },
  75: { name: "Basket Cuddle Duo", price: 2900, category: "Gift Sets", size: "Medium", description: "Two bears nestled in a gift basket — ready to surprise." },
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
          : entry.source === "kilimall.co.ke"
            ? `${name} — popular plush pick on Kilimall, delivered across Kenya.`
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
