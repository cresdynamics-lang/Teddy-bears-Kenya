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

/** Hero carousel — five distinct bears from the catalog. */
export const heroSlides = [
  { src: bearImage(41), alt: "Dean's Andrew limited edition mohair teddy", caption: "Collector edition" },
  { src: bearImage(5), alt: "Life-sized giant teddy bear", caption: "Giant hugs delivered" },
  { src: bearImage(45), alt: "Steiff Paddy golden brown teddy", caption: "Steiff classics" },
  { src: bearImage(1), alt: "Pink everyday joy teddy bear", caption: "Pocket-sized love" },
  { src: bearImage(47), alt: "Steiff Fynn teddy in suitcase", caption: "Gift-ready" },
] as const;

export { entries as imageManifest };
