import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function CategorySection({
  title,
  products,
  accent,
}: {
  title: string;
  products: Product[];
  accent: "exide" | "car" | "bike" | "microtek";
}) {
  const slides = chunk(products, 3);

  const accentHue =
    accent === "exide"
      ? "var(--brand-exide)"
      : accent === "microtek"
      ? "var(--brand-microtek)"
      : accent === "car"
      ? "var(--brand-car)"
      : "var(--brand-bike)";

  return (
    <section className="py-10" aria-labelledby={title.replace(/\s+/g, "-").toLowerCase()}>
      <div className="container mx-auto px-4">
        <h2 id={title.replace(/\s+/g, "-").toLowerCase()} className="text-2xl md:text-3xl font-bold mb-6">
          {title}
        </h2>
        <div className="relative p-4 rounded-lg border" style={{ boxShadow: "var(--shadow-elevated)" }}>
          <div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: `linear-gradient(180deg, hsl(${accentHue} / 0.08), transparent 60%)`,
            }}
            aria-hidden
          />
          <Carousel orientation="vertical" className="relative">
            <CarouselContent className="h-[560px]">
              {slides.map((group, idx) => (
                <CarouselItem key={idx} className="basis-full">
                  <div className="grid grid-cols-1 gap-4">
                    {group.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious aria-label="Previous products" />
            <CarouselNext aria-label="Next products" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
