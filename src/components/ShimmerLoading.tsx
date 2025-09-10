import { cn } from "@/lib/utils";

const Shimmer = ({ className }: { className?: string }) => (
  <div className={cn("bg-gradient-to-r from-muted/70 via-muted/30 to-muted/70 bg-[length:200%_100%] animate-shimmer", className)} />
);

const ProductCardShimmer = () => (
  <div className="p-4 rounded-lg border bg-card">
    <Shimmer className="aspect-square rounded-lg mb-4" />
    <Shimmer className="h-4 mb-2" />
    <Shimmer className="h-3 w-3/4 mb-2" />
    <Shimmer className="h-5 w-1/2 mb-3" />
    <Shimmer className="h-9 rounded-md" />
  </div>
);

const CategorySectionShimmer = () => (
  <section className="py-10">
    <div className="container mx-auto px-4">
      <Shimmer className="h-8 w-64 mb-6 rounded" />
      <div className="relative p-4 rounded-lg border glass-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProductCardShimmer key={i} />
          ))}
        </div>
        <div className="text-center">
          <Shimmer className="h-10 w-32 mx-auto rounded-md" />
        </div>
      </div>
    </div>
  </section>
);

const WhyUsSectionShimmer = () => (
  <section className="py-12">
    <div className="container mx-auto px-4">
      <Shimmer className="h-8 w-64 mb-6 rounded" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-lg border glass-card">
            <Shimmer className="h-6 w-6 mb-3 rounded" />
            <Shimmer className="h-5 w-3/4 mb-1 rounded" />
            <Shimmer className="h-4 w-full mb-1 rounded" />
            <Shimmer className="h-4 w-2/3 rounded" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TestimonialsSectionShimmer = () => (
  <section className="py-12">
    <div className="container mx-auto px-4">
      <Shimmer className="h-8 w-48 mb-6 rounded" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-6 rounded-lg border glass-card">
            <div className="flex items-center gap-3 mb-4">
              <Shimmer className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Shimmer className="h-4 w-24 mb-1 rounded" />
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Shimmer key={j} className="h-3 w-3 rounded" />
                  ))}
                </div>
              </div>
            </div>
            <Shimmer className="h-4 w-full mb-2 rounded" />
            <Shimmer className="h-4 w-full mb-2 rounded" />
            <Shimmer className="h-4 w-3/4 rounded" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ContactSectionShimmer = () => (
  <section className="py-8">
    <div className="container mx-auto px-4">
      <Shimmer className="h-8 w-40 mb-6 rounded" />
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-lg border glass-card space-y-4">
          <div className="flex items-center gap-2">
            <Shimmer className="h-4 w-4 rounded" />
            <Shimmer className="h-4 w-16 rounded" />
          </div>
          <Shimmer className="h-4 w-full rounded" />
          <Shimmer className="h-4 w-3/4 rounded" />
          
          <div className="flex items-center gap-2 pt-2">
            <Shimmer className="h-4 w-4 rounded" />
            <Shimmer className="h-4 w-12 rounded" />
          </div>
          <Shimmer className="h-4 w-32 rounded" />
          
          <div className="flex items-center gap-2 pt-2">
            <Shimmer className="h-4 w-4 rounded" />
            <Shimmer className="h-4 w-10 rounded" />
          </div>
          <Shimmer className="h-4 w-48 rounded" />
          
          <div className="flex gap-2 pt-4">
            <Shimmer className="h-10 w-20 rounded-md" />
            <Shimmer className="h-10 w-16 rounded-md" />
          </div>
        </div>
        <div className="space-y-4">
          <Shimmer className="h-64 rounded-lg" />
        </div>
      </div>
    </div>
  </section>
);

const HeaderShimmer = () => (
  <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shimmer className="h-10 w-10 rounded" />
          <div>
            <Shimmer className="h-5 w-32 mb-1 rounded" />
            <Shimmer className="h-3 w-24 rounded" />
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Shimmer className="h-10 w-64 rounded-md" />
          <Shimmer className="h-10 w-10 rounded-md" />
          <Shimmer className="h-10 w-24 rounded-md" />
        </div>
        <div className="md:hidden">
          <Shimmer className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </div>
  </header>
);

const HeroSectionShimmer = () => (
  <section className="relative md:overflow-hidden overflow-visible">
    <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} aria-hidden />
    <div className="container mx-auto px-4 py-16 md:py-24 relative">
      <Shimmer className="h-12 md:h-16 w-3/4 mb-4 rounded" />
      <Shimmer className="h-6 w-full max-w-2xl mb-2 rounded" />
      <Shimmer className="h-6 w-2/3 max-w-xl mb-6 rounded" />
      <div className="flex flex-wrap gap-3">
        <Shimmer className="h-11 w-36 rounded-md" />
        <Shimmer className="h-11 w-32 rounded-md" />
      </div>
    </div>
  </section>
);

export default function ShimmerLoading() {
  return (
    <div className="min-h-[80vh] md:min-h-screen">
      <HeaderShimmer />
      
      <main className="pb-16 overflow-visible md:overflow-hidden">
        <HeroSectionShimmer />
        
        <div>
          {Array.from({ length: 4 }).map((_, i) => (
            <CategorySectionShimmer key={i} />
          ))}
        </div>

        <WhyUsSectionShimmer />
        <TestimonialsSectionShimmer />
        <ContactSectionShimmer />
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 p-4">
        <div className="container mx-auto max-w-sm">
          <div className="flex gap-2">
            <Shimmer className="flex-1 h-12 rounded-full" />
            <Shimmer className="h-12 w-12 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
