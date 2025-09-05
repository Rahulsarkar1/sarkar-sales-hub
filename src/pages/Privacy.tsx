import { Helmet, HelmetProvider } from "react-helmet-async";
import { site } from "@/config/site";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function Privacy() {
  const { settings } = useSiteSettings();
  
  return (
    <HelmetProvider>
      <Helmet>
        <title>Privacy Policy | {site.name}</title>
        <meta name="description" content={`${site.name} Privacy Policy`} />
        <link rel="canonical" href={`${site.canonicalUrl}privacy`} />
      </Helmet>
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          {settings?.privacy_policy ? (
            <div 
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: settings.privacy_policy.replace(/\n/g, '<br/>') }}
            />
          ) : (
            <>
              <p>We respect your privacy. This policy explains what data we collect and how we use it to serve you better.</p>
              <h2>Information We Collect</h2>
              <p>Contact details you provide (such as name and phone) when you enquire or place an order.</p>
              <h2>How We Use Your Information</h2>
              <p>We use your information to respond to enquiries, fulfill orders, and provide support. We do not sell your data.</p>
              <h2>Contact</h2>
              <p>If you have any questions about this policy, contact us at {settings?.email || site.email}.</p>
            </>
          )}
        </article>
      </main>
    </HelmetProvider>
  );
}
