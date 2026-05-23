import { useState } from "react";
import { Star, Eye, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type Product, formatKsh } from "@/lib/products";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [quick, setQuick] = useState(false);

  return (
    <>
      <article className="group relative bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <button
            onClick={() => setQuick(true)}
            className="absolute top-3 right-3 grid place-items-center w-10 h-10 rounded-full bg-background/90 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-0.5 text-honey">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < product.rating ? "fill-current" : ""}`} />
            ))}
          </div>
          <h3 className="mt-1 font-display text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="font-display text-xl font-bold text-primary">{formatKsh(product.price)}</span>
            <Button
              onClick={() => add(product)}
              size="sm"
              className="rounded-full bg-foreground text-background hover:bg-cocoa"
            >
              <ShoppingBag className="w-4 h-4" /> Add
            </Button>
          </div>
        </div>
      </article>

      <Dialog open={quick} onOpenChange={setQuick}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <div className="grid sm:grid-cols-2">
            <img src={product.image} alt={product.name} className="w-full h-64 sm:h-full object-cover" />
            <div className="p-6">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{product.name}</DialogTitle>
              </DialogHeader>
              <div className="mt-1 flex items-center gap-0.5 text-honey">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < product.rating ? "fill-current" : ""}`} />
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{product.description}</p>
              <p className="mt-4 font-display text-3xl font-bold text-primary">{formatKsh(product.price)}</p>
              <ul className="mt-3 text-xs text-muted-foreground space-y-1">
                <li>• Size: {product.size}</li>
                <li>• Best for: {product.occasion.join(", ")}</li>
                <li>• Nairobi same-day delivery available</li>
              </ul>
              <Button onClick={() => { add(product); setQuick(false); }} className="mt-5 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-11">
                Add to basket
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
