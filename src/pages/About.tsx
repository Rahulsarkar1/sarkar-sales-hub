import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function About() {
  const { settings } = useSiteSettings();
  
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">About Us</h1>
        
        <div className="prose prose-lg max-w-4xl">
          {settings?.about_us ? (
            <div 
              className="text-muted-foreground leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: settings.about_us.replace(/\n/g, '<br/>') }}
            />
          ) : (
            <div className="text-muted-foreground leading-relaxed">
              <p>Welcome to {settings?.site_name || 'Sarkar Sales'}, your trusted partner for all battery solutions.</p>
              <br/>
              <p>We specialize in providing high-quality batteries for cars, bikes, inverters, and more. With years of experience in the industry, we are committed to delivering reliable products and exceptional customer service.</p>
              <br/>
              <p>Our team of experts is always ready to help you find the perfect battery solution for your needs. We work with leading brands and offer competitive prices to ensure you get the best value for your money.</p>
              <br/>
              <p>Visit our store or contact us today to learn more about our products and services!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}