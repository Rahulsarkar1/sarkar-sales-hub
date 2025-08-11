import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useLocalUi } from "@/context/LocalUiContext";

export default function FestivePopup() {
  const { settings } = useSiteSettings();
  const { settings: localUi } = useLocalUi();

  const enabled = (localUi.festiveEnabled ?? settings?.festive_enabled) ?? false;
  const image = (localUi.festiveImageUrl ?? settings?.festive_image_url) ?? null;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (enabled && image) setOpen(true);
  }, [enabled, image]);

  if (!open || !image) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-hidden />
      <div className="relative max-w-[90vw] md:max-w-[50vw] w-full rounded-xl overflow-hidden border bg-background shadow-2xl">
        <button
          aria-label="Close festive popup"
          className="absolute right-2 top-2 z-10 rounded-full border bg-background/80 p-1 hover:bg-accent/50"
          onClick={() => setOpen(false)}
        >
          <X className="h-4 w-4" />
        </button>
        <img src={image} alt="Festive promotion" className="w-full h-auto object-contain" />
      </div>
    </div>
  );
}
