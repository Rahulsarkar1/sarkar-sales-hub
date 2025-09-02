import { site } from "@/config/site";
import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function Contact() {
  const { settings } = useSiteSettings();
  
  const address = settings?.address || site.address;
  const phone = settings?.phone || site.phone;
  const email = settings?.email || site.email;
  const mapEmbedSrc = settings?.map_embed_src || site.mapEmbedSrc;

  return (
    <section id="contact" className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Contact & Map</h2>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-lg border glass-card">
            <div className="flex items-center gap-2 mb-2"><MapPin className="h-4 w-4"/> <span className="font-semibold">Address</span></div>
            <p className="text-sm text-muted-foreground mb-4">{address}</p>
            <div className="flex items-center gap-2 mb-2"><Phone className="h-4 w-4"/> <span className="font-semibold">Phone</span></div>
            <p className="text-sm text-muted-foreground mb-4">{phone}</p>
            <div className="flex items-center gap-2 mb-2"><Mail className="h-4 w-4"/> <span className="font-semibold">Email</span></div>
            <p className="text-sm text-muted-foreground">{email}</p>
            <div className="mt-4 flex gap-2">
              <Button asChild variant="secondary"><a href={`tel:${phone}`}>Call Now</a></Button>
              <Button asChild variant="hero"><a href={`mailto:${email}`}>Email</a></Button>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border">
            <iframe
              title="Location map"
              src={mapEmbedSrc}
              className="w-full h-[320px] md:h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
