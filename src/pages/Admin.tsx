import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/context/SettingsContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import SegmentsManager from "@/components/admin/SegmentsManager";
import ProductsManager from "@/components/admin/ProductsManager";
import ReviewsManager from "@/components/admin/ReviewsManager";
import PasswordChange from "@/components/admin/PasswordChange";
import ColorPalette from "@/components/admin/ColorPalette";

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const { settings, updateSettings } = useSiteSettings();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthed(!!session?.user);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setAuthed(!!session?.user));
    return () => subscription.unsubscribe();
  }, []);

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm p-6 rounded-xl border glass-card text-center">
          <h1 className="text-xl font-bold mb-2">Admin Sign In Required</h1>
          <p className="text-sm text-muted-foreground mb-4">Please sign in to manage your site settings.</p>
          <Button asChild className="w-full"><Link to="/auth">Go to Login</Link></Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Admin Portal</h1>
            <p className="text-muted-foreground">Update site-wide settings powered by Supabase.</p>
          </div>
          <Button asChild variant="secondary" size="sm">
            <Link to="/">↩️ Return</Link>
          </Button>
        </div>
        <div className="space-y-8">
          <SiteSettingsCard settingsState={settings} onSave={updateSettings} />
          <ColorPalette onColorSelect={(primary, secondary) => updateSettings({ primary_color: primary, secondary_color: secondary })} />
          <UiScaleCard />
          <PasswordChange />
          <ReviewsManager />
          <SegmentsManager />
          <ProductsManager />
        </div>
      </div>
    </main>
  );
}

function SiteSettingsCard({ settingsState, onSave }: { settingsState: any; onSave: (p: any) => Promise<Error | null>; }) {
  const [siteName, setSiteName] = useState(settingsState?.site_name ?? "");
  const [tagline, setTagline] = useState(settingsState?.tagline ?? "");
  const [heroTitle, setHeroTitle] = useState(settingsState?.hero_title ?? "");
  const [heroSubtitle, setHeroSubtitle] = useState(settingsState?.hero_subtitle ?? "");
  const [primaryColor, setPrimaryColor] = useState(settingsState?.primary_color ?? "");
  const [secondaryColor, setSecondaryColor] = useState(settingsState?.secondary_color ?? "");
  const [phone, setPhone] = useState(settingsState?.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(settingsState?.whatsapp_number ?? "");
  const [festive, setFestive] = useState<boolean>(!!settingsState?.festive_enabled);
  const [festiveImage, setFestiveImage] = useState(settingsState?.festive_image_url ?? "");
  const [email, setEmail] = useState(settingsState?.email ?? "");
  const [address, setAddress] = useState(settingsState?.address ?? "");
  const [city, setCity] = useState(settingsState?.city ?? "");
  const [mapEmbedSrc, setMapEmbedSrc] = useState(settingsState?.map_embed_src ?? "");
  const [aboutUs, setAboutUs] = useState(settingsState?.about_us ?? "");
  const [facebookUrl, setFacebookUrl] = useState(settingsState?.facebook_url ?? "");
  const [instagramUrl, setInstagramUrl] = useState(settingsState?.instagram_url ?? "");
  const [logoUrl, setLogoUrl] = useState(settingsState?.logo_url ?? "");
  const [contactInfo, setContactInfo] = useState(settingsState?.contact_info ?? "");

  useEffect(() => {
    setSiteName(settingsState?.site_name ?? "");
    setTagline(settingsState?.tagline ?? "");
    setHeroTitle(settingsState?.hero_title ?? "");
    setHeroSubtitle(settingsState?.hero_subtitle ?? "");
    setPrimaryColor(settingsState?.primary_color ?? "");
    setSecondaryColor(settingsState?.secondary_color ?? "");
    setPhone(settingsState?.phone ?? "");
    setWhatsapp(settingsState?.whatsapp_number ?? "");
    setFestive(!!settingsState?.festive_enabled);
    setFestiveImage(settingsState?.festive_image_url ?? "");
    setEmail(settingsState?.email ?? "");
    setAddress(settingsState?.address ?? "");
    setCity(settingsState?.city ?? "");
    setMapEmbedSrc(settingsState?.map_embed_src ?? "");
    setAboutUs(settingsState?.about_us ?? "");
    setFacebookUrl(settingsState?.facebook_url ?? "");
    setInstagramUrl(settingsState?.instagram_url ?? "");
    setLogoUrl(settingsState?.logo_url ?? "");
    setContactInfo(settingsState?.contact_info ?? "");
  }, [settingsState]);

  const handleSave = async () => {
    const err = await onSave({
      site_name: siteName,
      tagline,
      phone,
      whatsapp_number: whatsapp,
      email,
      address,
      city,
      map_embed_src: mapEmbedSrc,
      about_us: aboutUs,
      facebook_url: facebookUrl,
      instagram_url: instagramUrl,
      logo_url: logoUrl,
      contact_info: contactInfo,
      festive_enabled: festive,
      festive_image_url: festiveImage,
      hero_title: heroTitle || null,
      hero_subtitle: heroSubtitle || null,
      primary_color: primaryColor || null,
      secondary_color: secondaryColor || null,
    });
    if (err) alert(`Error: ${err.message}`);
    else alert("Settings saved");
  };

  return (
    <div className="p-4 rounded-lg border glass-card">
      <h2 className="font-semibold mb-4">Site Settings</h2>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="siteName">Site name</Label>
          <Input id="siteName" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Your trusted partner for all battery solutions" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="heroTitle">Hero title</Label>
          <Input id="heroTitle" value={heroTitle} onChange={(e)=>setHeroTitle(e.target.value)} placeholder="Power You Can Trust" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="heroSubtitle">Hero subtitle</Label>
          <Input id="heroSubtitle" value={heroSubtitle} onChange={(e)=>setHeroSubtitle(e.target.value)} placeholder="Exide home/inverter batteries, car & bike batteries, and Microtek inverters..." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mapEmbedSrc">Map Embed URL</Label>
          <Input id="mapEmbedSrc" value={mapEmbedSrc} onChange={(e) => setMapEmbedSrc(e.target.value)} placeholder="Google Maps embed URL" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="logoUrl">Logo URL</Label>
          <Input id="logoUrl" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="aboutUs">About Us Content</Label>
          <textarea 
            id="aboutUs" 
            value={aboutUs} 
            onChange={(e) => setAboutUs(e.target.value)} 
            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Tell your customers about your business..."
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="facebookUrl">Facebook URL</Label>
            <Input id="facebookUrl" value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} placeholder="https://facebook.com/..." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="instagramUrl">Instagram URL</Label>
            <Input id="instagramUrl" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/..." />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="primaryColor">Primary color (HSL)</Label>
            <Input id="primaryColor" value={primaryColor ?? ""} onChange={(e)=>setPrimaryColor(e.target.value)} placeholder="e.g. 222 47% 11%" />
            <p className="text-xs text-muted-foreground">Use HSL values only (no hsl()). Example: 222 47% 11%</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="secondaryColor">Secondary color (HSL)</Label>
            <Input id="secondaryColor" value={secondaryColor ?? ""} onChange={(e)=>setSecondaryColor(e.target.value)} placeholder="e.g. 210 40% 96.1%" />
          </div>
        </div>
        <div className="flex items-center justify-between border-t pt-4">
          <div>
            <Label className="mb-1">Festive popup</Label>
            <p className="text-xs text-muted-foreground">Enable and set an image URL</p>
          </div>
          <Switch checked={festive} onCheckedChange={setFestive} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="festiveImage">Festive image URL</Label>
          <Input id="festiveImage" value={festiveImage} onChange={(e) => setFestiveImage(e.target.value)} placeholder="https://..." />
        </div>
        <div className="pt-2">
          <Button onClick={handleSave} className="w-full sm:w-auto">Save Settings</Button>
        </div>
      </div>
    </div>
  );
}

function UiScaleCard() {
  const { baseFontSize, setBaseFontSize } = useSettings();
  return (
    <div className="p-4 rounded-lg border glass-card">
      <h2 className="font-semibold mb-2">UI Scale</h2>
      <p className="text-sm text-muted-foreground mb-4">Adjust the overall size of headings, text, and spacing across the site.</p>
      <div className="flex items-center gap-4">
        <Slider
          value={[baseFontSize]}
          min={12}
          max={20}
          step={1}
          onValueChange={(v) => setBaseFontSize(v[0])}
          className="flex-1"
          aria-label="Base font size"
        />
        <div className="w-16 text-right text-sm"><span className="font-mono">{baseFontSize}px</span></div>
      </div>
      <div className="mt-4 text-sm text-muted-foreground">Tip: 16px is default. Increasing this scales most sizes proportionally.</div>
    </div>
  );
}
