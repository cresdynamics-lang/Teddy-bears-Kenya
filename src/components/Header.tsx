import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, ShoppingBag, X, Heart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { count, open } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="grid place-items-center w-9 h-9 rounded-full bg-primary text-primary-foreground shadow-soft">
            <Heart className="w-4 h-4 fill-current" />
          </span>
          <span>Teddy Bears <span className="text-primary">KE</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map(n => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "text-primary font-semibold" }}
              className="px-4 py-2 rounded-full text-sm font-medium hover:bg-muted transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            onClick={open}
            variant="ghost"
            size="icon"
            className="relative rounded-full"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid place-items-center min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                {count}
              </span>
            )}
          </Button>
          <button
            className="md:hidden p-2 rounded-full hover:bg-muted"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {nav.map(n => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                activeProps={{ className: "bg-muted text-primary font-semibold" }}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-sm"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
