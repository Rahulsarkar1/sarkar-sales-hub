import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-is-mobile";

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function CategorySection({
  title,
  products,
  accent,
  fullProducts,
}: {
  title: string;
  products: Product[];
  accent: "exide" | "car" | "bike" | "microtek";
  fullProducts?: Product[];
}) {
  const isMobile = useIsMobile();
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
          {/* On mobile: remove fixed height and avoid trapping scroll by not forcing vertical carousel height */}
          {!isMobile ? (
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
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {(products.slice(0, 3)).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          <div className="mt-4 text-right">
            {/* Mobile: Drawer to avoid fullscreen dialog scroll lock */}
            <div className="inline-block md:hidden">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="sm">View all</Button>
                </DrawerTrigger>
                <DrawerContent className="max-h-[85vh]">
                  <div className="overflow-y-auto flex-1">
                  <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                  </DrawerHeader>
                    <div className="px-4 pb-6 grid grid-cols-1 gap-4">
                      {(fullProducts ?? products).map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
            {/* Desktop: keep dialog with capped size and internal scroll */}
            <div className="hidden md:inline-block">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">View all</Button>
                </DialogTrigger>
                <DialogContent className="w-[92vw] max-w-3xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(fullProducts ?? products).map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
