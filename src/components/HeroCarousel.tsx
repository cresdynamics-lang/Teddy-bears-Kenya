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

type HeroCarouselProps = {
  className?: string;
  variant?: "card" | "background";
};

export function HeroCarousel({ className, variant = "card" }: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const isBackground = variant === "background";

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
    <div
      className={cn(
        "relative",
        isBackground && "absolute inset-0 h-full w-full",
        className,
      )}
    >
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        className={cn("w-full", isBackground && "h-full [&>div]:h-full")}
      >
        <CarouselContent className={cn(isBackground && "-ml-0 h-full")}>
          {heroSlides.map((slide, i) => (
            <CarouselItem
              key={i}
              className={cn(isBackground && "basis-full pl-0 h-full")}
            >
              <div
                className={cn(
                  "relative overflow-hidden w-full",
                  isBackground
                    ? "h-full min-h-[85vh] sm:min-h-[90vh]"
                    : "aspect-square sm:aspect-[4/5] rounded-[2.5rem] shadow-glow",
                )}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  fetchPriority={i === 0 ? "high" : undefined}
                />
                {!isBackground && (
                  <div className="absolute inset-0 bg-gradient-to-t from-cocoa/50 via-transparent to-transparent" />
                )}
                {isBackground && (
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
                )}
                {!isBackground && (
                  <p className="absolute bottom-5 left-5 right-5 text-cream font-display text-lg font-semibold drop-shadow-sm">
                    {slide.caption}
                  </p>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {isBackground ? (
          <>
            <CarouselPrevious className="left-4 sm:left-8 border-0 bg-black/40 text-cream hover:bg-black/55 hover:text-cream" />
            <CarouselNext className="right-4 sm:right-8 border-0 bg-black/40 text-cream hover:bg-black/55 hover:text-cream" />
          </>
        ) : (
          <>
            <CarouselPrevious className="left-3 border-0 bg-background/90 shadow-soft hover:bg-background" />
            <CarouselNext className="right-3 border-0 bg-background/90 shadow-soft hover:bg-background" />
          </>
        )}
      </Carousel>
      <div
        className={cn(
          "flex justify-center gap-1.5",
          isBackground
            ? "absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
            : "mt-4",
        )}
      >
        {heroSlides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => api?.scrollTo(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              current === i
                ? cn("w-6", isBackground ? "bg-cream" : "bg-primary")
                : cn("w-2", isBackground ? "bg-cream/50 hover:bg-cream/70" : "bg-border hover:bg-primary/50"),
            )}
          />
        ))}
      </div>
    </div>
  );
}
