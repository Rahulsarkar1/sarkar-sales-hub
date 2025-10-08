import { Helmet, HelmetProvider } from "react-helmet-async";
import Header from "@/components/layout/Header";
import CategorySection from "@/components/sections/CategorySection";
import WhyUs from "@/components/sections/WhyUs";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import StickyActions from "@/components/StickyActions";
import FestivePopup from "@/components/FestivePopup";
import HeroSlideshow from "@/components/HeroSlideshow";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { sections, site } from "@/config/site";
import { useCatalog } from "@/hooks/use-catalog";
import type { Product } from "@/data/products";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import ShimmerLoading from "@/components/ShimmerLoading";
import { trackCTAClick } from "@/lib/analytics";

export default function Index() {
  const [q, setQ] = useState("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [heroGradientFontColor, setHeroGradientFontColor] = useState("#FFFFFF");
  const { categoriesList, productsByCategory, isLoading: catalogLoading } = useCatalog();
  const { settings, loading: settingsLoading } = useSiteSettings();

  const isLoading = catalogLoading || settingsLoading;

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return productsByCategory;
    const out: Record<string, Product[]> = {};
    (categoriesList as readonly string[]).forEach((c) => {
      const list = productsByCategory[c] ?? [];
      out[c] = list.filter((p: Product) => p.name.toLowerCase().includes(query));
    });
    return out;
  }, [q, categoriesList, productsByCategory]);

  const accentFor = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("microtek")) return "microtek" as const;
    if (n.includes("car")) return "car" as const;
    if (n.includes("bike")) return "bike" as const;
    return "exide" as const;
  };

  const heroTitle = settings?.hero_title || "";
  const heroSubtitle = settings?.hero_subtitle || "";
  const heroContentPosition = settings?.hero_content_position || "bottom";
  
  const getPositionClass = () => {
    switch (heroContentPosition) {
      case 'top':
        return 'items-start';
      case 'center':
        return 'items-center';
      case 'bottom':
      default:
        return 'items-end';
    }
  };
  
  if (isLoading) {
    return <ShimmerLoading />;
  }
  
  return (
    <HelmetProvider>
      <Helmet>
        <title>Sarkar Sales | Exide Batteries & Microtek Inverters</title>
        <meta name="description" content="Exide inverter/home, car & bike batteries and Microtek inverters. Fast delivery, installation and best prices in your city." />
        <link rel="canonical" href={site.canonicalUrl} />
        <meta property="og:title" content="Sarkar Sales | Exide Batteries & Microtek Inverters" />
        <meta property="og:description" content="Exide inverter/home, car & bike batteries and Microtek inverters." />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: site.name,
            url: site.canonicalUrl,
            contactPoint: [{ '@type': 'ContactPoint', telephone: site.phone, contactType: 'sales' }],
          })}
        </script>
      </Helmet>
      <div className="min-h-[80vh] md:min-h-screen">
        <Header onSearch={setQ} />
        <FestivePopup />

        <main className="pb-16 overflow-visible md:overflow-hidden">
          {/* Hero */}
          <section className="relative h-[400px] md:h-[500px] overflow-hidden">
            <HeroSlideshow 
              onSlideChange={setCurrentSlideIndex} 
              onFontColorLoad={setHeroGradientFontColor}
            />
            
            {/* Hero Content - TEXT ONLY - positioned dynamically */}
            <div className={`absolute inset-0 flex ${getPositionClass()} pointer-events-none`}>
              <div className="container mx-auto px-4 py-8 md:py-12 w-full">
                <div className="max-w-3xl space-y-6">
                  {/* Only show hero text on gradient slide (index 0) */}
                  {currentSlideIndex === 0 && (
                    <>
                      <h1 
                        className="text-4xl md:text-5xl font-bold drop-shadow-lg"
                        style={{ color: heroGradientFontColor }}
                      >
                        {heroTitle}
                      </h1>
                      <p 
                        className="text-lg md:text-xl max-w-2xl drop-shadow-lg"
                        style={{ color: heroGradientFontColor }}
                      >
                        {heroSubtitle}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Buttons - FIXED at bottom - always visible on all slides */}
            <div className="absolute bottom-8 left-0 w-full pointer-events-auto">
              <div className="container mx-auto px-4">
                <div className="flex flex-wrap gap-3">
                  <Button variant="hero" asChild>
                    <a 
                      href={`#${sections.products}`}
                      onClick={() => trackCTAClick('Browse Products', 'hero')}
                    >
                      Browse Products
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        trackCTAClick('Get Best Price', 'hero');
                        const text = encodeURIComponent('Hi! I want the best price for an inverter/battery.');
                        const url = `https://wa.me/${settings?.whatsapp_number || site.whatsappNumber}?text=${text}`;
                        
                        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                          window.location.href = url;
                        } else {
                          window.open(url, '_blank');
                        }
                      }}
                    >
                      Get Best Price
                    </button>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Products */}
          <div id={sections.products} />
          {categoriesList.map((c) => (
            <CategorySection
              key={c}
              title={c}
              products={filtered[c] ?? []}
              accent={accentFor(c)}
              fullProducts={productsByCategory[c] ?? []}
            />
          ))}

          <WhyUs />
          <Testimonials />
          <Contact />
        </main>

        <StickyActions />
      </div>
    </HelmetProvider>
  );
}
