import manifest from "../../public/images/manifest.json";

type ManifestEntry = {
  index: number;
  file: string;
  source?: string;
  name?: string;
  priceKsh?: number;
};

const entries = manifest as ManifestEntry[];

/** Product photo by index (supports .jpg / .webp from manifest). */
export function bearImage(index: number) {
  const entry = entries.find(e => e.index === index);
  return `/images/${entry?.file ?? `bear-${String(index).padStart(2, "0")}.jpg`}`;
}

export function bearMeta(index: number) {
  return entries.find(e => e.index === index);
}

/** Hero carousel — darker backgrounds so cream hero copy stays readable. */
export const heroSlides = [
  { src: bearImage(29), alt: "Golden teddy bear in a warm workshop display", caption: "Handcrafted classics" },
  { src: bearImage(67), alt: "Two giant teddy bears on a dark backdrop", caption: "Giant hugs delivered" },
  { src: bearImage(60), alt: "Colourful teddy bears against a deep purple wall", caption: "Every colour of love" },
  { src: bearImage(51), alt: "Polar bear plush on a black studio background", caption: "Collector edition" },
  { src: bearImage(79), alt: "Teddy bear on dark wood shelves", caption: "Gift-ready" },
] as const;

export { entries as imageManifest };
