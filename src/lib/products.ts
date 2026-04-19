import bearSweetie from "@/assets/bear-sweetie.jpg";
import bearHuggy from "@/assets/bear-huggy.jpg";
import bearKing from "@/assets/bear-king.jpg";
import bearPersonalized from "@/assets/bear-personalized.jpg";
import bearValentine from "@/assets/bear-valentine.jpg";
import bearBaby from "@/assets/bear-baby.jpg";

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

export const products: Product[] = [
  {
    id: "sweetie-bear",
    name: "Sweetie Bear",
    price: 1500,
    category: "Small",
    size: "Small",
    occasion: ["Birthday", "Just Because"],
    image: bearSweetie,
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
    image: bearHuggy,
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
    image: bearKing,
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
    image: bearPersonalized,
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
    image: bearValentine,
    description: "Two darling bears clutching a velvet heart — a love story in plush.",
    rating: 5,
  },
  {
    id: "babys-first-bear",
    name: "Baby's First Bear",
    price: 1200,
    category: "Small",
    size: "Small",
    occasion: ["Baby Shower", "Newborn"],
    image: bearBaby,
    description: "Tiny, hypoallergenic and impossibly soft. The very first cuddle.",
    rating: 5,
  },
];

export const categories: { name: Category; blurb: string; image: string }[] = [
  { name: "Small", blurb: "Pocket-sized hugs", image: bearSweetie },
  { name: "Medium", blurb: "Just-right cuddles", image: bearHuggy },
  { name: "Giant", blurb: "Bear hugs, literally", image: bearKing },
  { name: "Personalized", blurb: "Add a name", image: bearPersonalized },
  { name: "Gift Sets", blurb: "Bundles of love", image: bearValentine },
];

export const formatKsh = (n: number) => `KSh ${n.toLocaleString("en-KE")}`;
