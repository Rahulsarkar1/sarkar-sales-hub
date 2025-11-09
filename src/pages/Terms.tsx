import { Helmet, HelmetProvider } from "react-helmet-async";
import { site } from "@/config/site";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import Header from "@/components/layout/Header";
import { useState } from "react";

export default function Terms() {
  const { settings } = useSiteSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (query: string) => setSearchQuery(query);
  
  return (
    <HelmetProvider>
      <Helmet>
        <title>Terms & Conditions | {site.name}</title>
        <meta name="description" content={`${site.name} Terms & Conditions`} />
        <link rel="canonical" href={`${site.canonicalUrl}terms`} />
      </Helmet>
      <Header onSearch={handleSearch} />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          {settings?.terms_conditions ? (
            <div 
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: settings.terms_conditions.replace(/\n/g, '<br/>') }}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground not-prose">
              <p className="text-lg mb-2">Terms & Conditions not yet configured</p>
              <p className="text-sm">Please contact the administrator.</p>
            </div>
          )}
        </article>
      </main>
    </HelmetProvider>
  );
}
