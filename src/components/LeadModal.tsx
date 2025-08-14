import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { site } from "@/config/site";

export type LeadPayload = {
  productName: string;
};

type LeadModalProps = {
  productName: string;
  children: React.ReactNode;
};

export default function LeadModal({ productName, children }: LeadModalProps) {
  const { settings } = useSiteSettings();
  const phone = settings?.phone || site.phone;
  const whatsapp = settings?.whatsapp_number || site.whatsappNumber;

  const makeWhatsAppUrl = () => {
    const text = `Hi, I'm interested in ${productName}.`;
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[92vw] max-w-[92vw] sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quick Enquiry</DialogTitle>
          <DialogDescription>
            Contact us instantly via WhatsApp or phone call.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Interested in <strong>{productName}</strong>? Get in touch with us right away!
          </p>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="secondary" asChild>
            <a href={`tel:${phone}`} aria-label="Call now">
              Call Now
            </a>
          </Button>
          <Button
            variant="default"
            onClick={() => window.location.assign(makeWhatsAppUrl())}
          >
            WhatsApp Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
