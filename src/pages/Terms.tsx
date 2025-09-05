import { Helmet, HelmetProvider } from "react-helmet-async";
import { site } from "@/config/site";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function Terms() {
  const { settings } = useSiteSettings();
  
  return (
    <HelmetProvider>
      <Helmet>
        <title>Terms & Conditions | {site.name}</title>
        <meta name="description" content={`${site.name} Terms & Conditions`} />
        <link rel="canonical" href={`${site.canonicalUrl}terms`} />
      </Helmet>
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          {settings?.terms_conditions ? (
            <div 
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: settings.terms_conditions.replace(/\n/g, '<br/>') }}
            />
          ) : (
            <>
              <h2>General</h2>
              <p>By using this website, you agree to the following terms and conditions. Please read them carefully.</p>
              <h2>Pricing & Availability</h2>
              <p>Prices and product availability are subject to change without notice. Offers may vary by location.</p>
              <h2>Warranty & Installation</h2>
              <p>Warranties are as provided by the manufacturer. Installation and service terms will be communicated during purchase.</p>
              <h2>Contact</h2>
              <p>For any concerns regarding these terms, contact us at {settings?.email || site.email}.</p>
            </>
          )}
        </article>
      </main>
    </HelmetProvider>
  );
}
