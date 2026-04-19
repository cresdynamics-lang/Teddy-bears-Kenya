import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatKsh } from "@/lib/products";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { whatsappLink, site } from "@/lib/site";

export function CartDrawer() {
  const { items, isOpen, close, setQty, remove, total, clear } = useCart();

  const checkoutMsg = items.length
    ? `Hi ${site.name}! I'd like to order:\n\n${items.map(i => `• ${i.qty} × ${i.product.name} (${formatKsh(i.product.price * i.qty)})`).join("\n")}\n\nTotal: ${formatKsh(total)}\n\nPlease confirm availability & delivery 🧸`
    : "";

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && close()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="font-display text-xl">Your Hug Basket</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 grid place-items-center text-center px-6">
            <div>
              <div className="mx-auto w-16 h-16 rounded-full bg-muted grid place-items-center">
                <ShoppingBag className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="mt-4 font-display text-lg">No bears yet</p>
              <p className="text-sm text-muted-foreground">Pick a cuddly friend to get started.</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-3">
                <img src={product.image} alt={product.name} className="w-20 h-20 rounded-2xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <p className="font-medium truncate">{product.name}</p>
                    <button onClick={() => remove(product.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">{formatKsh(product.price)}</p>
                  <div className="mt-2 inline-flex items-center rounded-full border">
                    <button onClick={() => setQty(product.id, qty - 1)} className="p-1.5 hover:bg-muted rounded-l-full"><Minus className="w-3 h-3" /></button>
                    <span className="px-3 text-sm font-medium tabular-nums">{qty}</span>
                    <button onClick={() => setQty(product.id, qty + 1)} className="p-1.5 hover:bg-muted rounded-r-full"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="border-t px-6 py-4 space-y-3 bg-muted/40">
            <div className="flex justify-between font-display text-lg">
              <span>Total</span>
              <span className="text-primary font-bold">{formatKsh(total)}</span>
            </div>
            <p className="text-xs text-muted-foreground">M-Pesa · Card · Cash on Delivery</p>
            <a href={whatsappLink(checkoutMsg)} target="_blank" rel="noreferrer" className="block">
              <Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-11">
                Checkout via WhatsApp
              </Button>
            </a>
            <Button onClick={clear} variant="ghost" className="w-full rounded-full text-muted-foreground">Clear basket</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
