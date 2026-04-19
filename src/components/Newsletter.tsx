import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-20">
      <div className="relative overflow-hidden rounded-[2.5rem] gradient-hero p-8 sm:p-14 text-center">
        <div className="absolute inset-0 bg-paw opacity-30" aria-hidden />
        <div className="relative">
          <p className="text-xs font-semibold tracking-widest uppercase text-cocoa/70">Bear Mail</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-balance">
            Sweet deals, delivered with a hug.
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Join our cuddle club for first dibs on new arrivals & secret discounts.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); toast.success("You're in! 🧸 Check your inbox."); setEmail(""); }}
            className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <Input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="h-12 rounded-full bg-background/90 border-0 px-5"
            />
            <Button type="submit" className="h-12 rounded-full bg-cocoa text-cream hover:bg-cocoa/90 px-6">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
