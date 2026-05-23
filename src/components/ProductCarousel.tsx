import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/ProductCard";
import { type Category, type Product } from "@/lib/products";

type ProductCarouselProps = {
  title: string;
  subtitle?: string;
  products: Product[];
  category?: Category;
};

export function ProductCarousel({ title, subtitle, products, category }: ProductCarouselProps) {
  if (products.length === 0) return null;

  return (
    <section className="relative">
      {(title || subtitle || category) && (
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            {title && <h2 className="font-display text-2xl sm:text-3xl font-bold">{title}</h2>}
            {subtitle && <p className={`text-sm text-muted-foreground ${title ? "mt-1" : ""}`}>{subtitle}</p>}
          </div>
          {category && title && (
            <Link
              to="/shop"
              search={{ category }}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline shrink-0"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}

      <Carousel
        opts={{ align: "start", dragFree: true }}
        className="w-full"
      >
        <CarouselContent className="-ml-3 md:-ml-4">
          {products.map(product => (
            <CarouselItem
              key={product.id}
              className="pl-3 md:pl-4 basis-[85%] sm:basis-[48%] lg:basis-[32%] xl:basis-[24%]"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-4 lg:-left-5 border-0 bg-card shadow-soft" />
        <CarouselNext className="hidden md:flex -right-4 lg:-right-5 border-0 bg-card shadow-soft" />
      </Carousel>

      {category && (
        <Link
          to="/shop"
          search={{ category }}
          className="sm:hidden mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary"
        >
          View all {category} bears <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </section>
  );
}
