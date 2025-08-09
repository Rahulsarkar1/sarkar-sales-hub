import { sections, site } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Search, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

type HeaderProps = {
  onSearch: (q: string) => void;
};

export default function Header({ onSearch }: HeaderProps) {
  const [q, setQ] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(q), 250);
    return () => clearTimeout(timeout);
  }, [q, onSearch]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
      <div className="container mx-auto flex items-center justify-between py-3 gap-4">
        <a href="#" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary/10 border border-border flex items-center justify-center" aria-hidden>
            <span className="text-sm font-bold">SS</span>
          </div>
          <div className="leading-tight">
            <div className="font-bold">{site.name}</div>
            <div className="text-xs text-muted-foreground">{site.tagline}</div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a className="story-link" href={`#${sections.products}`}>Products</a>
          <a className="story-link" href={`#${sections.whyUs}`}>Why Us</a>
          <a className="story-link" href={`#${sections.reviews}`}>Reviews</a>
          <a className="story-link" href={`#${sections.offers}`}>Offers</a>
          <a className="story-link" href={`#${sections.contact}`}>Contact</a>
        </nav>

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
          </div>
          <Button asChild variant="secondary">
            <a href={`tel:${site.phone}`} aria-label="Call Sarkar Sales">
              <Phone className="mr-1" /> Call
            </a>
          </Button>
          <Button asChild variant="hero">
            <a
              href={`https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent("Hello Sarkar Sales! I have a quick question.")}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="mr-1" /> WhatsApp
            </a>
          </Button>
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
        </div>
      </div>
    </header>
  );
}
