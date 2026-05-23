import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductCarousel } from "@/components/ProductCarousel";
import { Reviews } from "@/components/Reviews";
import { Newsletter } from "@/components/Newsletter";
import {
  categories,
  categoryOrder,
  featuredProducts,
  productsByCategory,
} from "@/lib/products";
import { bearImage } from "@/lib/images";
import { ArrowRight, Truck, ShieldCheck, Heart, Gift, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Teddy Bears Kenya — Send a Hug Today 🧸" },
      { name: "description", content: "Adorable teddy bears delivered same-day in Nairobi. Personalised, giant & gift-set bears. M-Pesa accepted." },
      { property: "og:title", content: "Teddy Bears Kenya — Send a Hug Today" },
      { property: "og:description", content: "Kenya's #1 teddy gift shop. Same-day Nairobi delivery." },
      { property: "og:image", content: "/images/bear-07.jpg" },
      { name: "twitter:image", content: "/images/bear-07.jpg" },
    ],
  }),
  component: Home,
});

const perks = [
  { icon: Truck, label: "Same-day Nairobi", desc: "Order before 2pm" },
  { icon: ShieldCheck, label: "M-Pesa & COD", desc: "Pay your way" },
  { icon: Gift, label: "Gift wrapping", desc: "Free on all orders" },
  { icon: Star, label: "4.9★ rated", desc: "2,400+ happy hugs" },
];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" aria-hidden />
        <div className="absolute inset-0 bg-paw opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-balance">
              Send <span className="text-primary">hugs</span>
              <br />
              today.
            </h1>
            <p className="mt-5 text-lg text-foreground/70 max-w-md">
              Handpicked, irresistibly soft teddy bears delivered the same day across Nairobi. From pocket-sized cuties to life-size giants.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/shop">
                <Button size="lg" className="rounded-full bg-cocoa text-cream hover:bg-cocoa/90 h-12 px-7">
                  Shop all bears <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/shop" search={{ category: "Gift Sets" }}>
                <Button size="lg" variant="outline" className="rounded-full h-12 px-7 border-cocoa/20 bg-background/70">
                  Gift sets
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-foreground/70">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-primary" /> Same-day Nairobi
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> M-Pesa & COD
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-primary fill-current" /> 100% Cuddly
              </span>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <HeroCarousel />
          </div>
        </div>
      </section>

      {/* PERKS STRIP */}
      <section className="border-y border-border/60 bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="grid place-items-center w-10 h-10 rounded-2xl bg-secondary shrink-0">
                <Icon className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-primary">Find your bear</p>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold">Shop by category</h2>
          </div>
          <Link to="/shop" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium hover:text-primary">
            All bears <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {categories.map(c => (
            <Link
              key={c.name}
              to="/shop"
              search={{ category: c.name }}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-soft ring-1 ring-border/40 hover:ring-primary/40 transition-all hover:-translate-y-0.5"
            >
              <img
                src={c.image}
                alt={c.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa/85 via-cocoa/25 to-transparent" />
              <div className="absolute inset-0 p-4 flex flex-col justify-end text-cream">
                <p className="font-display text-lg font-bold">{c.name}</p>
                <p className="text-[11px] opacity-90 leading-snug">{c.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED CAROUSEL */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
        <div className="text-center max-w-2xl mx-auto mb-2">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary">Bestsellers</p>
          <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-balance">Customer favourites</h2>
          <p className="mt-3 text-muted-foreground">Our most-hugged picks — swipe to explore.</p>
        </div>
        <div className="mt-8">
          <ProductCarousel title="" products={featuredProducts} />
        </div>
      </section>

      {/* GROUPED BY CATEGORY */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24 space-y-14 sm:space-y-16">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary">The full collection</p>
          <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold">Browse by collection</h2>
          <p className="mt-3 text-muted-foreground">Every bear grouped by size and style — find your perfect match.</p>
        </div>

        {categoryOrder.map(cat => {
          const catMeta = categories.find(c => c.name === cat)!;
          return (
            <ProductCarousel
              key={cat}
              title={cat}
              subtitle={catMeta.blurb}
              products={productsByCategory(cat)}
              category={cat}
            />
          );
        })}
      </section>

      {/* ABOUT TEASER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center bg-card rounded-[2.5rem] p-8 sm:p-12 shadow-soft overflow-hidden">
          <img
            src={bearImage(17)}
            alt="Assorted teddy bears in a cozy display"
            className="rounded-3xl aspect-[4/3] object-cover w-full"
            loading="lazy"
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
