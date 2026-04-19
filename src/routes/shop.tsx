import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { products, categories, type Category } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const searchSchema = z.object({
  category: z.enum(["Small", "Medium", "Giant", "Personalized", "Gift Sets"]).optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Shop Teddy Bears — Teddy Bears Kenya" },
      { name: "description", content: "Browse our full collection of teddy bears: small, medium, giant, personalized & gift sets. Filter by size, price & occasion." },
      { property: "og:title", content: "Shop Teddy Bears — Teddy Bears Kenya" },
      { property: "og:description", content: "Filter by size, price & occasion. M-Pesa accepted." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category, q } = Route.useSearch();
  const [search, setSearch] = useState(q ?? "");
  const [size, setSize] = useState<Category | "All">(category ?? "All");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (size !== "All" && p.category !== size) return false;
      if (p.price > maxPrice) return false;
      if (search && !`${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [size, maxPrice, search]);

  return (
    <>
      {/* Page header */}
      <section className="gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary">The collection</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold">All the bears</h1>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">Find the perfect cuddle for every moment.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-[260px_1fr] gap-8">
        {/* Filters - desktop */}
        <aside className={`${filtersOpen ? "fixed inset-0 z-50 bg-background p-6 overflow-auto" : "hidden"} lg:block lg:static lg:p-0`}>
          <div className="flex justify-between items-center lg:hidden mb-4">
            <h3 className="font-display text-lg">Filters</h3>
            <button onClick={() => setFiltersOpen(false)}><X /></button>
          </div>
          <div className="space-y-6 lg:sticky lg:top-20">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Search</label>
              <div className="mt-2 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bears…" className="pl-9 rounded-full bg-card" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(["All", ...categories.map(c => c.name)] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setSize(c as any)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                      size === c ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted border-border"
                    }`}
                  >{c}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Max price: <span className="text-primary">KSh {maxPrice.toLocaleString()}</span>
              </label>
              <input
                type="range" min={1000} max={10000} step={500}
                value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-3 w-full accent-primary"
              />
            </div>
            <Button
              variant="ghost"
              onClick={() => { setSearch(""); setSize("All"); setMaxPrice(10000); }}
              className="w-full rounded-full border"
            >
              Reset filters
            </Button>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-muted-foreground">{filtered.length} bear{filtered.length !== 1 && "s"} found</p>
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl">No bears match those filters 🧸</p>
              <Link to="/shop" className="mt-3 inline-block text-primary hover:underline">Reset filters</Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
