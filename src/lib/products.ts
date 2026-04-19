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
}

// Unsplash teddy/plush images
export const products: Product[] = [
  {
    id: "sweetie-bear",
    name: "Sweetie Bear",
    price: 1500,
    category: "Small",
    size: "Small",
    occasion: ["Birthday", "Just Because"],
    image: "https://images.unsplash.com/photo-1559454403-b8fb88521f00?auto=format&fit=crop&w=900&q=80",
    description: "A pocket-sized pink cuddle, perfect for sweet little surprises.",
    rating: 5,
  },
  {
    id: "huggy-blue",
    name: "Huggy Blue",
    price: 2200,
    category: "Medium",
    size: "Medium",
    occasion: ["Anniversary", "Birthday"],
    image: "https://images.unsplash.com/photo-1530712606469-c39c1f7d62cd?auto=format&fit=crop&w=900&q=80",
    description: "A soft baby-blue bear holding a tiny embroidered heart.",
    rating: 5,
  },
  {
    id: "king-kong",
    name: "King Kong",
    price: 8000,
    category: "Giant",
    size: "Giant",
    occasion: ["Anniversary", "Surprise"],
    image: "https://images.unsplash.com/photo-1584155828260-3f126cd6e7d3?auto=format&fit=crop&w=900&q=80",
    description: "A 1-metre brown giant — the hug that never lets go.",
    rating: 5,
  },
  {
    id: "personalized-cuddles",
    name: "Personalized Cuddles",
    price: 3500,
    category: "Personalized",
    size: "Medium",
    occasion: ["Baby Shower", "Birthday"],
    image: "https://images.unsplash.com/photo-1558877385-81a1c7e67d72?auto=format&fit=crop&w=900&q=80",
    description: "Custom embroidered name on a plush cream bear. Truly one-of-a-kind.",
    rating: 5,
  },
  {
    id: "valentine-duo",
    name: "Valentine Duo",
    price: 4000,
    category: "Gift Sets",
    size: "Medium",
    occasion: ["Valentines", "Anniversary"],
    image: "https://images.unsplash.com/photo-1612870398040-d23c1a4ed9d3?auto=format&fit=crop&w=900&q=80",
    description: "Two darling bears clutching velvet hearts — a love story in plush.",
    rating: 5,
  },
  {
    id: "babys-first-bear",
    name: "Baby's First Bear",
    price: 1200,
    category: "Small",
    size: "Small",
    occasion: ["Baby Shower", "Newborn"],
    image: "https://images.unsplash.com/photo-1606248897732-2c5ffe759c04?auto=format&fit=crop&w=900&q=80",
    description: "Tiny, hypoallergenic and impossibly soft. The very first cuddle.",
    rating: 5,
  },
];

export const categories: { name: Category; blurb: string; image: string }[] = [
  { name: "Small", blurb: "Pocket-sized hugs", image: "https://images.unsplash.com/photo-1559454403-b8fb88521f00?auto=format&fit=crop&w=600&q=80" },
  { name: "Medium", blurb: "Just-right cuddles", image: "https://images.unsplash.com/photo-1530712606469-c39c1f7d62cd?auto=format&fit=crop&w=600&q=80" },
  { name: "Giant", blurb: "Bear hugs, literally", image: "https://images.unsplash.com/photo-1584155828260-3f126cd6e7d3?auto=format&fit=crop&w=600&q=80" },
  { name: "Personalized", blurb: "Add a name", image: "https://images.unsplash.com/photo-1558877385-81a1c7e67d72?auto=format&fit=crop&w=600&q=80" },
  { name: "Gift Sets", blurb: "Bundles of love", image: "https://images.unsplash.com/photo-1612870398040-d23c1a4ed9d3?auto=format&fit=crop&w=600&q=80" },
];

export const formatKsh = (n: number) => `KSh ${n.toLocaleString("en-KE")}`;
