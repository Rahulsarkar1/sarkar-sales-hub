import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import SegmentsManager from "@/components/admin/SegmentsManager";
import ProductsManager from "@/components/admin/ProductsManager";
import ReviewsManager from "@/components/admin/ReviewsManager";
import PasswordChange from "@/components/admin/PasswordChange";
import ColorPalette from "@/components/admin/ColorPalette";
import HeroSlidesManager from "@/components/admin/HeroSlidesManager";

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const { settings, updateSettings } = useSiteSettings();

  useEffect(() => {
    // Force re-authentication by clearing any cached session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        setAuthed(false);
      } else {
        setAuthed(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthed(!!session?.user);
    });
    
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
          <HeroSlidesManager />
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
  const [privacyPolicy, setPrivacyPolicy] = useState(settingsState?.privacy_policy ?? "");
  const [termsConditions, setTermsConditions] = useState(settingsState?.terms_conditions ?? "");
  const [heroTitleFontSize, setHeroTitleFontSize] = useState<number>(settingsState?.hero_title_font_size ?? 72);
  const [heroSubtitleFontSize, setHeroSubtitleFontSize] = useState<number>(settingsState?.hero_subtitle_font_size ?? 24);
  const [notificationPopupEnabled, setNotificationPopupEnabled] = useState<boolean>(settingsState?.notification_popup_enabled ?? false);
  const [notificationTitle, setNotificationTitle] = useState<string>(settingsState?.notification_title ?? 'Stay updated!');
  const [notificationMessage, setNotificationMessage] = useState<string>(settingsState?.notification_message ?? 'Check out our latest offers and products!');
  const [notificationImageUrl, setNotificationImageUrl] = useState<string>(settingsState?.notification_image_url ?? '');
  const [notificationActionUrl, setNotificationActionUrl] = useState<string>(settingsState?.notification_action_url ?? '/');

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
    setPrivacyPolicy(settingsState?.privacy_policy ?? "");
    setTermsConditions(settingsState?.terms_conditions ?? "");
    setHeroTitleFontSize(settingsState?.hero_title_font_size ?? 72);
    setHeroSubtitleFontSize(settingsState?.hero_subtitle_font_size ?? 24);
    setNotificationPopupEnabled(settingsState?.notification_popup_enabled ?? false);
    setNotificationTitle(settingsState?.notification_title ?? 'Stay updated!');
    setNotificationMessage(settingsState?.notification_message ?? 'Check out our latest offers and products!');
    setNotificationImageUrl(settingsState?.notification_image_url ?? '');
    setNotificationActionUrl(settingsState?.notification_action_url ?? '/');
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
      privacy_policy: privacyPolicy || null,
      terms_conditions: termsConditions || null,
      hero_title_font_size: heroTitleFontSize,
      hero_subtitle_font_size: heroSubtitleFontSize,
      notification_popup_enabled: notificationPopupEnabled,
      notification_title: notificationTitle,
      notification_message: notificationMessage,
      notification_image_url: notificationImageUrl || null,
      notification_action_url: notificationActionUrl,
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
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Hero Font Sizes</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Control the font sizes for hero section text (desktop view)
          </p>
          
          <div className="space-y-6">
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="heroTitleFontSize">Title Font Size</Label>
                <span className="text-sm font-mono text-muted-foreground">{heroTitleFontSize}px</span>
              </div>
              <Slider
                id="heroTitleFontSize"
                min={32}
                max={96}
                step={2}
                value={[heroTitleFontSize]}
                onValueChange={([v]) => setHeroTitleFontSize(v)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Range: 32px - 96px (mobile: {Math.round(heroTitleFontSize * 0.6)}px)
              </p>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="heroSubtitleFontSize">Subtitle Font Size</Label>
                <span className="text-sm font-mono text-muted-foreground">{heroSubtitleFontSize}px</span>
              </div>
              <Slider
                id="heroSubtitleFontSize"
                min={14}
                max={36}
                step={1}
                value={[heroSubtitleFontSize]}
                onValueChange={([v]) => setHeroSubtitleFontSize(v)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Range: 14px - 36px (mobile: {Math.round(heroSubtitleFontSize * 0.75)}px)
              </p>
            </div>
          </div>
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
        <div className="border-t pt-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Label className="text-base font-semibold">Notification Permission Popup</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Show a popup asking users to enable browser notifications
              </p>
            </div>
            <Switch 
              checked={notificationPopupEnabled} 
              onCheckedChange={setNotificationPopupEnabled} 
            />
          </div>
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-xs text-muted-foreground">
              • Appears 10 seconds after user activity (first visit)
            </p>
            <p className="text-xs text-muted-foreground">
              • If dismissed, won't show again for 7 days
            </p>
            <p className="text-xs text-muted-foreground">
              • Uses browser's native notification permission API
            </p>
          </div>
          {notificationPopupEnabled && (
            <div className="mt-6 space-y-4 pl-4 border-l-2 border-primary/20">
              <div className="space-y-2">
                <Label htmlFor="notificationTitle">Popup Title</Label>
                <Input
                  id="notificationTitle"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  placeholder="Stay updated!"
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground">
                  Title shown in the permission request popup
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notificationMessage">Popup Message</Label>
                <Textarea
                  id="notificationMessage"
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  placeholder="Allow notifications for latest updates and offers."
                  rows={2}
                  maxLength={150}
                />
                <p className="text-xs text-muted-foreground">
                  Message shown in the permission request popup
                </p>
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Browser Notification Settings
                </h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Configure the actual browser push notifications sent to users who granted permission
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notificationImageUrl">Notification Image URL (Optional)</Label>
                    <Input
                      id="notificationImageUrl"
                      value={notificationImageUrl}
                      onChange={(e) => setNotificationImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      type="url"
                    />
                    <p className="text-xs text-muted-foreground">
                      Image shown in rich notifications (desktop browsers)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notificationActionUrl">Click Action URL</Label>
                    <Input
                      id="notificationActionUrl"
                      value={notificationActionUrl}
                      onChange={(e) => setNotificationActionUrl(e.target.value)}
                      placeholder="/"
                    />
                    <p className="text-xs text-muted-foreground">
                      URL to open when user clicks the notification
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        const { sendBrowserNotification, hasNotificationPermission } = await import('@/lib/notifications');
                        if (hasNotificationPermission()) {
                          const success = await sendBrowserNotification({
                            title: notificationTitle,
                            message: notificationMessage,
                            image: notificationImageUrl || undefined,
                            actionUrl: notificationActionUrl,
                          });
                          if (success) {
                            toast({ title: "Test notification sent!" });
                          } else {
                            toast({ 
                              title: "Failed to send notification", 
                              description: "Please check browser console for errors",
                              variant: "destructive"
                            });
                          }
                        } else {
                          toast({ 
                            title: "Permission required", 
                            description: "Please allow notifications first",
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Send Test Notification
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Test how the notification will appear (requires notification permission)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-2">Legal Documents</h3>
          <p className="text-sm text-muted-foreground mb-6">
            These documents will appear on /privacy and /terms pages
          </p>
          
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="privacyPolicy">Privacy Policy</Label>
              <textarea 
                id="privacyPolicy" 
                value={privacyPolicy} 
                onChange={(e) => setPrivacyPolicy(e.target.value)} 
                className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your privacy policy content..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="termsConditions">Terms & Conditions</Label>
              <textarea 
                id="termsConditions" 
                value={termsConditions} 
                onChange={(e) => setTermsConditions(e.target.value)} 
                className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your terms & conditions content..."
              />
            </div>
          </div>
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
