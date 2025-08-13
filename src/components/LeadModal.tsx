import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";

export type LeadPayload = {
  productName: string;
};

type LeadModalProps = {
  productName: string;
  children: React.ReactNode;
};

export default function LeadModal({ productName, children }: LeadModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const makeWhatsAppUrl = () => {
    const text = `Hi Sarkar Sales, I'm interested in ${productName}.\nName: ${name}\nPhone: ${phone}`;
    return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  const canSubmit = name.trim().length >= 2 && /\d{10}/.test(phone.replace(/\D/g, ""));

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[92vw] max-w-[92vw] sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quick Enquiry</DialogTitle>
          <DialogDescription>
            Enter your details and we'll respond instantly on WhatsApp or call back.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Your name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-3"
              placeholder="10-digit mobile number"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="secondary" asChild>
            <a href={`tel:${site.phone}`} aria-label="Call now">
              Call Now
            </a>
          </Button>
          <Button
            variant="default"
            disabled={!canSubmit}
            onClick={() => window.location.assign(makeWhatsAppUrl())}
          >
            WhatsApp Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
