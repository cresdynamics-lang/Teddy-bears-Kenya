import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { heroSlides } from "@/lib/images";
import { cn } from "@/lib/utils";

export function HeroCarousel({ className }: { className?: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const timer = setInterval(() => api.scrollNext(), 5000);
    return () => clearInterval(timer);
  }, [api]);

  return (
    <div className={cn("relative", className)}>
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {heroSlides.map((slide, i) => (
            <CarouselItem key={i}>
              <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-glow">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                  fetchPriority={i === 0 ? "high" : undefined}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa/50 via-transparent to-transparent" />
                <p className="absolute bottom-5 left-5 right-5 text-cream font-display text-lg font-semibold drop-shadow-sm">
                  {slide.caption}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3 border-0 bg-background/90 shadow-soft hover:bg-background" />
        <CarouselNext className="right-3 border-0 bg-background/90 shadow-soft hover:bg-background" />
      </Carousel>
      <div className="flex justify-center gap-1.5 mt-4">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => api?.scrollTo(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              current === i ? "w-6 bg-primary" : "w-2 bg-border hover:bg-primary/50",
            )}
          />
        ))}
      </div>
    </div>
  );
}
