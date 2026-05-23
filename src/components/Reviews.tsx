import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const reviews = [
  { name: "Wanjiku M.", text: "Got the King Kong for my fiancée — she screamed with joy! Delivered same day in Nairobi.", role: "Karen, Nairobi" },
  { name: "Brian O.", text: "Personalized Cuddles with my niece's name… absolutely beautiful stitching. 10/10.", role: "Kisumu" },
  { name: "Aisha N.", text: "The Valentine Duo arrived gift-wrapped and smelling sweet. My boyfriend cried 🥺.", role: "Mombasa" },
  { name: "Peter K.", text: "Quality is top-tier and prices fair. Will keep buying for every birthday.", role: "Westlands" },
  { name: "Grace W.", text: "The Giant collection is unreal — ordered Mega Cocoa Hug for my daughter's 18th. Worth every shilling.", role: "Nakuru" },
  { name: "James M.", text: "Browsing by category made it so easy. Picked three small bears for the office Secret Santa.", role: "Kilimani" },
];

export function Reviews() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-20">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest uppercase text-primary">Love Notes</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-balance">Why Kenya loves our bears</h2>
      </div>

      <div className="mt-10 relative px-2 sm:px-10">
        <Carousel opts={{ align: "start", loop: true }}>
          <CarouselContent className="-ml-4">
            {reviews.map((r, i) => (
              <CarouselItem key={i} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <figure className="bg-card rounded-3xl p-6 shadow-soft h-full flex flex-col">
                  <div className="flex gap-0.5 text-honey">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-3 text-sm leading-relaxed flex-1">"{r.text}"</blockquote>
                  <figcaption className="mt-4 text-xs">
                    <span className="font-semibold">{r.name}</span>
                    <span className="text-muted-foreground"> · {r.role}</span>
                  </figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-2 border-0 bg-card shadow-soft" />
          <CarouselNext className="hidden sm:flex -right-2 border-0 bg-card shadow-soft" />
        </Carousel>
      </div>
    </section>
  );
}
