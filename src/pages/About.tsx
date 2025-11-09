import { useState } from "react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import Header from "@/components/layout/Header";

export default function About() {
  const { settings } = useSiteSettings();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">About Us</h1>
        
        <div className="prose prose-lg max-w-4xl">
          {settings?.about_us ? (
            <div 
              className="text-muted-foreground leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: settings.about_us.replace(/\n/g, '<br/>') }}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">Content not yet configured</p>
              <p className="text-sm">Please contact the administrator to add About Us content.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}