import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Reviews } from "@/components/Reviews";
import { Newsletter } from "@/components/Newsletter";
import { products, categories } from "@/lib/products";
import { ArrowRight, Truck, ShieldCheck, Sparkles, Heart } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Teddy Bears Kenya — Send a Hug Today 🧸" },
      { name: "description", content: "Adorable teddy bears delivered same-day in Nairobi. Personalised, giant & gift-set bears. M-Pesa accepted." },
      { property: "og:title", content: "Teddy Bears Kenya — Send a Hug Today" },
      { property: "og:description", content: "Kenya's #1 teddy gift shop. Same-day Nairobi delivery." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1608043152266-33a8b8d67997?auto=format&fit=crop&w=1200&q=80" },
      { name: "twitter:image", content: "https://images.unsplash.com/photo-1608043152266-33a8b8d67997?auto=format&fit=crop&w=1200&q=80" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" aria-hidden />
        <div className="absolute inset-0 bg-paw opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/70 backdrop-blur text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Hugs in Every Bear
            </span>
            <h1 className="mt-4 font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-balance">
              Send <span className="text-primary">hugs</span><br />today.
            </h1>
            <p className="mt-5 text-lg text-foreground/70 max-w-md">
              Handpicked, irresistibly soft teddy bears delivered the same day across Nairobi. Made for moments that matter.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/shop">
                <Button size="lg" className="rounded-full bg-cocoa text-cream hover:bg-cocoa/90 h-12 px-7">
                  Shop Bears <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="rounded-full h-12 px-7 border-cocoa/20 bg-background/70">
                  Our Story
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-foreground/70">
              <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-primary" /> Same-day Nairobi</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-primary" /> M-Pesa & COD</span>
              <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-primary fill-current" /> 100% Cuddly</span>
            </div>
          </div>

          <div className="relative">
            <div className="relative animate-float">
              <img
                src="https://images.unsplash.com/photo-1608043152266-33a8b8d67997?auto=format&fit=crop&w=900&q=80"
                alt="Pile of adorable teddy bears"
                className="w-full aspect-square object-cover rounded-[2.5rem] shadow-glow"
              />
              <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-soft px-4 py-3 flex items-center gap-3">
                <div className="grid place-items-center w-10 h-10 rounded-full bg-secondary"><Heart className="w-4 h-4 fill-current" /></div>
                <div className="text-xs">
                  <p className="font-semibold">2,400+ hugs</p>
                  <p className="text-muted-foreground">delivered nationwide</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-cocoa text-cream rounded-2xl shadow-soft px-4 py-3 text-xs font-semibold">
                🇰🇪 Proudly Kenyan
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-primary">Find your bear</p>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold">Shop by category</h2>
          </div>
          <Link to="/shop" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium hover:text-primary">
            All bears <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map(c => (
            <Link
              key={c.name}
              to="/shop"
              search={{ category: c.name }}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-soft"
            >
              <img src={c.image} alt={c.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa/80 via-cocoa/20 to-transparent" />
              <div className="absolute inset-0 p-4 flex flex-col justify-end text-cream">
                <p className="font-display text-lg font-bold">{c.name}</p>
                <p className="text-[11px] opacity-80">{c.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary">Featured</p>
          <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-balance">Six bears, six little love stories</h2>
          <p className="mt-3 text-muted-foreground">Our most-hugged picks this season.</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center bg-card rounded-[2.5rem] p-8 sm:p-12 shadow-soft">
          <img
            src="https://images.unsplash.com/photo-1581012184459-48ba1d4f8c2c?auto=format&fit=crop&w=900&q=80"
            alt="A cozy bear"
            className="rounded-3xl aspect-[4/3] object-cover w-full"
          />
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-primary">Why Kenya loves us</p>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-balance">Bears that feel like home.</h2>
            <p className="mt-4 text-muted-foreground">
              From a tiny studio in Westlands, we hand-pick every bear, gift-wrap with love, and rush it to your loved one — anywhere in Kenya. Because hugs shouldn't have to wait.
            </p>
            <Link to="/about" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Read our story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Reviews />
      <Newsletter />
    </>
  );
}
