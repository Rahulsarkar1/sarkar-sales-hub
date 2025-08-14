import { MessageCircle, Phone } from "lucide-react";
import { site } from "@/config/site";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function StickyActions() {
  const { settings } = useSiteSettings();
  const phone = settings?.phone || site.phone;
  const whatsapp = settings?.whatsapp_number || site.whatsappNumber;

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-50">
      <a
        href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hello Sarkar Sales! I want to buy a battery/inverter.")}`}
        aria-label="Chat on WhatsApp"
        target="_blank"
        rel="noreferrer"
        className="h-12 w-12 rounded-full bg-secondary border flex items-center justify-center hover-scale"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <a
        href={`tel:${phone}`}
        aria-label="Call Sarkar Sales"
        className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover-scale"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}
