import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Truck, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bearImage } from "@/lib/images";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Teddy Bears Kenya" },
      { name: "description", content: "The story behind Kenya's favourite teddy bear shop. Hand-picked plush, gift-wrapped with love in Nairobi." },
      { property: "og:title", content: "About — Teddy Bears Kenya" },
      { property: "og:description", content: "Hand-picked plush, gift-wrapped with love in Nairobi." },
    ],
  }),
  component: About,
});

const values = [
  { icon: Heart, title: "Love-led", text: "Every bear is hand-inspected, brushed, and gift-wrapped with care." },
  { icon: Truck, title: "Fast hugs", text: "Same-day Nairobi delivery. 1–3 days nationwide via courier." },
  { icon: Sparkles, title: "Cuddly quality", text: "Plush, hypoallergenic, and squishably soft — built to last." },
  { icon: Users, title: "Made for Kenya", text: "Local pricing in KSh, M-Pesa checkout, COD across Nairobi." },
];

function About() {
  return (
    <>
      <section className="gradient-hero">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary">Our story</p>
          <h1 className="mt-2 font-display text-4xl sm:text-6xl font-bold text-balance">
            Bears with a Kenyan heart.
          </h1>
          <p className="mt-5 text-lg text-foreground/70">
            Teddy Bears Kenya started in 2022 with one belief: a hug should never be more than a tap away. Today we deliver thousands of cuddles across the country — birthdays, anniversaries, baby showers, just-because moments.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <img
          src={bearImage(4)}
          alt="Two teddies on a windowsill"
          className="rounded-[2.5rem] aspect-[4/5] object-cover w-full shadow-soft"
        />
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-balance">From a Westlands studio to all 47 counties.</h2>
          <p className="mt-4 text-muted-foreground">
            We're a small team of plush enthusiasts curating the cuddliest bears we can find — then handling each one like a precious package. From the first sketch of a personalised name to the final ribbon, our craft is care.
          </p>
          <p className="mt-3 text-muted-foreground">
            Whether you're 200km away or right here in Nairobi, we make sure your bear arrives ready to be hugged.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/shop"><Button className="rounded-full bg-cocoa text-cream hover:bg-cocoa/90 h-12 px-6">Shop bears</Button></Link>
            <Link to="/contact"><Button variant="outline" className="rounded-full h-12 px-6">Get in touch</Button></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map(v => (
            <div key={v.title} className="bg-card rounded-3xl p-6 shadow-soft">
              <div className="w-11 h-11 rounded-2xl bg-primary/15 grid place-items-center text-primary">
                <v.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{v.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
