import { site as defaultSite } from "@/config/site";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useLocalUi } from "@/context/LocalUiContext";

export default function Footer() {
  const { settings } = useSiteSettings();
  const { settings: localUi } = useLocalUi();
  const siteName = (localUi.siteName ?? settings?.site_name ?? defaultSite.name).toUpperCase();
  const whatsapp = localUi.social?.whatsapp ?? settings?.whatsapp_number ?? defaultSite.whatsappNumber;
  const facebook = localUi.social?.facebook ?? "#";
  const instagram = localUi.social?.instagram ?? "#";
  return (
    <footer className="border-t mt-12" role="contentinfo">
      <div className="container mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-3 gap-8">
        <section aria-labelledby="footer-brand" className="col-span-2 md:col-span-1">
          <h2 id="footer-brand" className="text-xl font-bold">{siteName}</h2>
          <p className="text-muted-foreground mt-2">Your trusted partner for all battery solutions</p>
        </section>

        <nav aria-labelledby="footer-quick-links">
          <h3 id="footer-quick-links" className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a className="hover:underline" href="/privacy">Privacy Policy</a>
            </li>
            <li>
              <a className="hover:underline" href="/terms">Terms & Conditions</a>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-follow-us">
          <h3 id="footer-follow-us" className="font-semibold mb-3">Follow Us</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a className="hover:underline" href={facebook} target="_blank" rel="noreferrer">Facebook</a>
            </li>
            <li>
              <a className="hover:underline" href={instagram} target="_blank" rel="noreferrer">Instagram</a>
            </li>
            <li>
              <a className="hover:underline" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t">
        <div className="container mx-auto px-4 py-6 space-y-2">
          <p className="text-center text-sm text-muted-foreground">© 2025 SARKAR SALES. All rights reserved.</p>
          <p className="text-center text-sm">
            <a href="/admin" className="hover:underline">Admin Portal</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
