import { MessageCircle, Phone } from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { site } from "@/config/site";

export default function StickyActions() {
  const { settings } = useSiteSettings();
  // Extract first phone number only and clean for tel: links
  const phoneRaw = settings?.phone || site.phone;
  const phone = (phoneRaw?.split(' / ')[0] || phoneRaw)?.replace(/\s/g, '');
  const whatsapp = settings?.whatsapp_number || site.whatsappNumber;

  const handleWhatsAppClick = () => {
    const text = encodeURIComponent("Hello Sarkar Sales! I want to buy a battery/inverter.");
    const url = `https://wa.me/${whatsapp}?text=${text}`;
    
    // Better desktop support - detect if mobile or desktop
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.location.href = url;
    } else {
      // For desktop, open in new tab with web.whatsapp.com fallback
      window.open(url, '_blank');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-50">
      <button
        onClick={handleWhatsAppClick}
        aria-label="Chat on WhatsApp"
        className="h-12 w-12 rounded-full bg-[hsl(var(--whatsapp))] text-[hsl(var(--whatsapp-foreground))] border border-[hsl(var(--whatsapp))] flex items-center justify-center hover-scale shadow-lg hover:shadow-xl hover:bg-[hsl(var(--whatsapp)/0.9)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--whatsapp))] focus:ring-offset-2"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
      <a
        href={`tel:${phone}`}
        aria-label="Call Sarkar Sales"
        className="h-12 w-12 rounded-full bg-primary text-primary-foreground border border-primary flex items-center justify-center hover-scale shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}
