import { sections, site as defaultSite } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Search, MessageCircle } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";
import { useEffect, useMemo, useRef, useState } from "react";
import { type Product, formatCurrency } from "@/data/products";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useLocalUi } from "@/context/LocalUiContext";
import { useCatalog } from "@/hooks/use-catalog";
import ProductDetailsDialog from "@/components/ProductDetailsDialog";

type HeaderProps = {
  onSearch: (q: string) => void;
};

export default function Header({ onSearch }: HeaderProps) {
  const [q, setQ] = useState("");
  const { settings } = useSiteSettings();
  const { settings: localUi } = useLocalUi();
  const siteName = localUi.siteName ?? settings?.site_name ?? defaultSite.name;
  const siteTagline = localUi.tagline ?? settings?.tagline ?? defaultSite.tagline;
  const phone = settings?.phone || defaultSite.phone;
  const whatsapp = settings?.whatsapp_number || localUi.social?.whatsapp || defaultSite.whatsappNumber;

  const logo = settings?.logo_url || localUi.logoDataUrl || null;

  const { productsByCategory } = useCatalog();

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (query.length < 2) return [] as (Product & { discounted: number })[];
    const all: Product[] = ([] as Product[]).concat(
      ...Object.values(productsByCategory)
    );
    return all
      .filter((p) => p.name.toLowerCase().includes(query))
      .map((p) => ({
        ...p,
        discounted: p.discountPercent
          ? Math.round(p.price * (1 - p.discountPercent / 100))
          : p.price,
      }));
  }, [q, productsByCategory]);

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(q), 250);
    return () => clearTimeout(timeout);
  }, [q, onSearch]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
      <div className="container mx-auto flex items-center justify-between py-3 gap-4">
        <a href="#" className="flex items-center gap-2">
          {logo ? (
            <img src={logo} alt={`${siteName} logo`} className="h-8 w-8 rounded-md border object-cover" />
          ) : (
            <div className="h-8 w-8 rounded-md bg-primary/10 border border-border flex items-center justify-center" aria-hidden>
              <span className="text-sm font-bold">SS</span>
            </div>
          )}
          <div className="leading-tight">
            <div className="font-bold">{siteName}</div>
            <div className="text-xs text-muted-foreground">{siteTagline}</div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a className="story-link" href={`#${sections.products}`}>Products</a>
          <a className="story-link" href={`#${sections.whyUs}`}>Why Us</a>
          <a className="story-link" href={`#${sections.reviews}`}>Reviews</a>
          <a className="story-link" href={`#${sections.contact}`}>Contact</a>
        </nav>

        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <div className="hidden md:flex items-center gap-2 min-w-[380px]">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              aria-label="Search products"
              placeholder="Search products…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
            {q.trim().length >= 2 && results.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-lg border bg-background shadow-xl max-h-80 overflow-auto">
                <ul role="listbox" className="divide-y">
                  {results.slice(0, 8).map((p) => (
                    <li key={p.id} role="option" className="p-3 hover:bg-accent/30">
                    <ProductDetailsDialog product={p}>
                      <div className="flex items-center gap-3 cursor-pointer">
                        <img
                          src={p.image}
                          alt={`${p.name} thumbnail`}
                          loading="lazy"
                          decoding="async"
                          className="h-12 w-12 rounded border object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{p.name}</div>
                          <div className="mt-0.5 text-xs text-muted-foreground flex items-center gap-2">
                            {p.discountPercent ? (
                              <span className="line-through">{formatCurrency(p.price)}</span>
                            ) : null}
                            <span className="font-semibold text-foreground">{formatCurrency(p.discounted)}</span>
                            {p.discountPercent ? (
                              <span className="inline-flex items-center shrink-0 rounded-full bg-destructive text-destructive-foreground text-sm md:text-xs font-bold px-2.5 py-0.5">
                                -{p.discountPercent}%
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </ProductDetailsDialog>
                    </li>
                  ))}
                  {results.length > 8 && (
                    <li className="p-2 text-xs text-muted-foreground text-center">
                      Showing top 8 of {results.length} results
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          <Button asChild variant="secondary">
            <a href={`tel:${phone}`} aria-label="Call Sarkar Sales">
              <Phone className="mr-1" /> Call
            </a>
          </Button>
          <Button asChild variant="hero">
            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hello Sarkar Sales! I have a quick question.")}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="mr-1" /> WhatsApp
            </a>
          </Button>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="container mx-auto md:hidden px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            aria-label="Search products"
            placeholder="Search products…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
          {q.trim().length >= 2 && results.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-lg border bg-background shadow-xl max-h-80 overflow-auto">
              <ul role="listbox" className="divide-y">
                {results.slice(0, 8).map((p) => (
                  <li key={p.id} role="option" className="p-3 hover:bg-accent/30">
                    <ProductDetailsDialog product={p}>
                      <div className="flex items-center gap-3 cursor-pointer">
                        <img
                          src={p.image}
                          alt={`${p.name} thumbnail`}
                          loading="lazy"
                          decoding="async"
                          className="h-12 w-12 rounded border object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{p.name}</div>
                          <div className="mt-0.5 text-xs text-muted-foreground flex items-center gap-2">
                            {p.discountPercent ? (
                              <span className="line-through">{formatCurrency(p.price)}</span>
                            ) : null}
                            <span className="font-semibold text-foreground">{formatCurrency(p.discounted)}</span>
                            {p.discountPercent ? (
                              <span className="inline-flex items-center shrink-0 rounded-full bg-destructive text-destructive-foreground text-sm md:text-xs font-bold px-2.5 py-0.5">
                                -{p.discountPercent}%
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </ProductDetailsDialog>
                  </li>
                ))}
                {results.length > 8 && (
                  <li className="p-2 text-xs text-muted-foreground text-center">
                    Showing top 8 of {results.length} results
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
