import { Link } from "@tanstack/react-router";
import { ArrowRight, Truck, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const perks: { icon: typeof Truck; label: string; filled?: boolean }[] = [
  { icon: Truck, label: "Same-day Nairobi" },
  { icon: ShieldCheck, label: "M-Pesa & COD" },
  { icon: Heart, label: "100% Cuddly", filled: true },
];

export function HeroContent() {
  return (
    <div className="relative max-w-xl">
      <p className="hero-rise hero-rise-delay-1 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        Kenya&apos;s teddy gift shop
      </p>

      <h1 className="hero-rise hero-rise-delay-2 mt-3 font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-balance text-cream">
        Send{" "}
        <span className="hero-hugs inline-block text-primary">hugs</span>
        <br />
        today.
      </h1>

      <p className="hero-rise hero-rise-delay-3 mt-5 text-lg sm:text-xl text-cream max-w-md leading-relaxed">
        Handpicked, irresistibly soft teddy bears delivered the same day across Nairobi. From
        pocket-sized cuties to life-size giants.
      </p>

      <div className="hero-rise hero-rise-delay-4 mt-7 flex flex-wrap gap-3">
        <Link to="/shop">
          <Button
            size="lg"
            className="group rounded-full bg-cocoa text-cream hover:bg-cocoa/90 h-12 px-7 hover:scale-[1.03] transition-all duration-300"
          >
            Shop all bears
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
        <Link to="/shop" search={{ category: "Gift Sets" }}>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full h-12 px-7 border-2 border-cream/80 text-cream bg-black/20 hover:bg-cream/15 hover:text-cream hover:border-cream hover:scale-[1.03] transition-all duration-300"
          >
            Gift sets
          </Button>
        </Link>
      </div>

      <ul className="hero-rise hero-rise-delay-5 mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-cream">
        {perks.map(({ icon: Icon, label, filled }, i) => (
          <li
            key={label}
            className="flex items-center gap-2 hero-rise"
            style={{ animationDelay: `${0.55 + i * 0.08}s` }}
          >
            <span className="grid place-items-center w-8 h-8 rounded-full bg-black/30 ring-1 ring-cream/20">
              <Icon className={`w-4 h-4 text-primary ${filled ? "fill-current" : ""}`} />
            </span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
