import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import {
  products,
  categories,
  groupedProducts,
  type Category,
} from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X, LayoutGrid, Rows3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bearImage } from "@/lib/images";

const searchSchema = z.object({
  category: z.enum(["Small", "Medium", "Giant", "Personalized", "Gift Sets"]).optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Shop Teddy Bears — Teddy Bears Kenya" },
      { name: "description", content: "Browse teddy bears: small, medium, giant, personalized & gift sets. Filter by size, price & occasion." },
      { property: "og:title", content: "Shop Teddy Bears — Teddy Bears Kenya" },
      { property: "og:description", content: "Soft plush teddy bears with M-Pesa checkout. Same-day Nairobi delivery." },
      { property: "og:image", content: "/images/bear-07.jpg" },
    ],
  }),
  component: Shop,
});

type ViewMode = "grouped" | "grid";

function Shop() {
  const { category, q } = Route.useSearch();
  const [search, setSearch] = useState(q ?? "");
  const [size, setSize] = useState<Category | "All">(category ?? "All");
  const [maxPrice, setMaxPrice] = useState(15000);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(category ? "grid" : "grouped");

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (size !== "All" && p.category !== size) return false;
      if (p.price > maxPrice) return false;
      if (search && !`${p.name} ${p.description} ${p.occasion.join(" ")}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [size, maxPrice, search]);

  const grouped = useMemo(() => {
    if (size !== "All") {
      return [{ category: size, products: filtered }];
    }
    return groupedProducts()
      .map(g => ({ ...g, products: g.products.filter(p => filtered.some(f => f.id === p.id)) }))
      .filter(g => g.products.length > 0);
  }, [filtered, size]);

  const showGrouped = viewMode === "grouped" && size === "All" && !search;

  return (
    <>
      <section className="relative gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src={bearImage(7)}
            alt=""
            className="w-full h-full object-cover"
            aria-hidden
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary">The collection</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold">All the bears</h1>
          <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
            Filter, browse, and send a hug.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map(c => (
              <Link
                key={c.name}
                to="/shop"
                search={{ category: c.name }}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
                  size === c.name
                    ? "bg-cocoa text-cream border-cocoa"
                    : "bg-background/80 border-border hover:border-primary"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-[260px_1fr] gap-8">
        <aside
          className={`${filtersOpen ? "fixed inset-0 z-50 bg-background p-6 overflow-auto" : "hidden"} lg:block lg:static lg:p-0`}
        >
          <div className="flex justify-between items-center lg:hidden mb-4">
            <h3 className="font-display text-lg">Filters</h3>
            <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
              <X />
            </button>
          </div>
          <div className="space-y-6 lg:sticky lg:top-20">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Search</label>
              <div className="mt-2 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search bears…"
                  className="pl-9 rounded-full bg-card"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(["All", ...categories.map(c => c.name)] as const).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSize(c === "All" ? "All" : c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                      size === c
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card hover:bg-muted border-border"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Max price: <span className="text-primary">KSh {maxPrice.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min={1000}
                max={15000}
                step={500}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="mt-3 w-full accent-primary"
              />
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                setSearch("");
                setSize("All");
                setMaxPrice(15000);
                setViewMode("grouped");
              }}
              className="w-full rounded-full border"
            >
              Reset filters
            </Button>
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <p className="text-sm text-muted-foreground">
              {filtered.length} bear{filtered.length !== 1 && "s"} found
            </p>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex rounded-full border p-0.5 bg-card">
                <button
                  type="button"
                  onClick={() => setViewMode("grouped")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    viewMode === "grouped" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                  aria-pressed={viewMode === "grouped"}
                >
                  <Rows3 className="w-3.5 h-3.5" /> Grouped
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                  aria-pressed={viewMode === "grid"}
                >
                  <LayoutGrid className="w-3.5 h-3.5" /> Grid
                </button>
              </div>
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm bg-card"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl">No bears match those filters 🧸</p>
              <Link to="/shop" className="mt-3 inline-block text-primary hover:underline">
                Reset filters
              </Link>
            </div>
          ) : showGrouped ? (
            <div className="space-y-14">
              {grouped.map(({ category: cat, products: catProducts }) => {
                const meta = categories.find(c => c.name === cat)!;
                return (
                  <section key={cat} id={cat.toLowerCase().replace(/\s+/g, "-")}>
                    <div className="flex items-end gap-4 mb-6 pb-4 border-b border-border/60">
                      <img
                        src={meta.image}
                        alt=""
                        className="w-14 h-14 rounded-2xl object-cover shadow-soft hidden sm:block"
                      />
                      <div className="flex-1">
                        <h2 className="font-display text-2xl sm:text-3xl font-bold">{cat}</h2>
                        <p className="text-sm text-muted-foreground">{meta.blurb}</p>
                      </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {catProducts.map(p => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
