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
import { useLocalUi } from "@/context/LocalUiContext";

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
        <h1 className="text-2xl font-bold mb-4">Admin Portal</h1>
        <p className="text-muted-foreground mb-6">Update site-wide settings powered by Supabase.</p>
        <div className="grid gap-6 max-w-2xl">
          <SiteSettingsCard settingsState={settings} onSave={updateSettings} />
          <UiScaleCard />
          <LocalUiCard />
          <LocalCatalogCard />
        </div>
      </div>
    </main>
  );
}

function SiteSettingsCard({ settingsState, onSave }: { settingsState: any; onSave: (p: any) => Promise<Error | null>; }) {
  const [siteName, setSiteName] = useState(settingsState?.site_name ?? "");
  const [tagline, setTagline] = useState(settingsState?.tagline ?? "");
  const [phone, setPhone] = useState(settingsState?.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(settingsState?.whatsapp_number ?? "");
  const [festive, setFestive] = useState<boolean>(!!settingsState?.festive_enabled);
  const [festiveImage, setFestiveImage] = useState(settingsState?.festive_image_url ?? "");

  useEffect(() => {
    setSiteName(settingsState?.site_name ?? "");
    setTagline(settingsState?.tagline ?? "");
    setPhone(settingsState?.phone ?? "");
    setWhatsapp(settingsState?.whatsapp_number ?? "");
    setFestive(!!settingsState?.festive_enabled);
    setFestiveImage(settingsState?.festive_image_url ?? "");
  }, [settingsState]);

  const handleSave = async () => {
    const err = await onSave({
      site_name: siteName,
      tagline,
      phone,
      whatsapp_number: whatsapp,
      festive_enabled: festive,
      festive_image_url: festiveImage,
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
          <Input id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} />
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

function LocalUiCard() {
  const { settings, update, reset } = useLocalUi();
  const [siteName, setSiteName] = useState(settings.siteName ?? "");
  const [tagline, setTagline] = useState(settings.tagline ?? "");
  const [facebook, setFacebook] = useState(settings.social?.facebook ?? "");
  const [instagram, setInstagram] = useState(settings.social?.instagram ?? "");
  const [whatsapp, setWhatsapp] = useState(settings.social?.whatsapp ?? "");
  const [primary, setPrimary] = useState(settings.primary ?? "");
  const [secondary, setSecondary] = useState(settings.secondary ?? "");
  const [radius, setRadius] = useState<number>(typeof settings.radius === 'number' ? settings.radius : 12);
  const [festiveEnabled, setFestiveEnabled] = useState<boolean>(!!settings.festiveEnabled);
  const [festiveImageUrl, setFestiveImageUrl] = useState(settings.festiveImageUrl ?? "");
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(settings.logoDataUrl ?? null);

  function hexToHslString(hex: string) {
    let r = 0, g = 0, b = 0;
    const clean = hex.replace('#','');
    if (clean.length === 3) {
      r = parseInt(clean[0] + clean[0], 16);
      g = parseInt(clean[1] + clean[1], 16);
      b = parseInt(clean[2] + clean[2], 16);
    } else if (clean.length === 6) {
      r = parseInt(clean.substring(0,2), 16);
      g = parseInt(clean.substring(2,4), 16);
      b = parseInt(clean.substring(4,6), 16);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `${Math.round(h*360)} ${Math.round(s*100)}% ${Math.round(l*100)}%`;
  }

  const onLogoChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    update({
      siteName,
      tagline,
      social: { facebook, instagram, whatsapp },
      primary: primary ? (primary.startsWith('#') ? hexToHslString(primary) : primary) : undefined,
      secondary: secondary ? (secondary.startsWith('#') ? hexToHslString(secondary) : secondary) : undefined,
      radius,
      festiveEnabled,
      festiveImageUrl,
      logoDataUrl,
    });
    alert('Local UI settings saved');
  };

  return (
    <div className="p-4 rounded-lg border glass-card">
      <h2 className="font-semibold mb-4">Local UI Controls</h2>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label>Logo</Label>
          <input type="file" accept="image/*" onChange={onLogoChange} />
          {logoDataUrl ? <img src={logoDataUrl} alt="Logo preview" className="h-10 w-10 rounded border object-cover" /> : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="local-site">Site name</Label>
          <Input id="local-site" value={siteName} onChange={(e)=>setSiteName(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="local-tagline">Tagline</Label>
          <Input id="local-tagline" value={tagline} onChange={(e)=>setTagline(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="fb">Facebook URL</Label>
            <Input id="fb" value={facebook} onChange={(e)=>setFacebook(e.target.value)} placeholder="https://facebook.com/..." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ig">Instagram URL</Label>
            <Input id="ig" value={instagram} onChange={(e)=>setInstagram(e.target.value)} placeholder="https://instagram.com/..." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wa">WhatsApp Number</Label>
            <Input id="wa" value={whatsapp} onChange={(e)=>setWhatsapp(e.target.value)} placeholder="91xxxxxxxxxx" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label>Primary Color</Label>
            <input type="color" value={primary && primary.startsWith('#') ? primary : '#000000'} onChange={(e)=>setPrimary(e.target.value)} />
            <p className="text-xs text-muted-foreground">Accepts HEX or HSL string</p>
          </div>
          <div className="grid gap-2">
            <Label>Secondary Color</Label>
            <input type="color" value={secondary && secondary.startsWith('#') ? secondary : '#ffffff'} onChange={(e)=>setSecondary(e.target.value)} />
            <p className="text-xs text-muted-foreground">Accepts HEX or HSL string</p>
          </div>
          <div className="grid gap-2">
            <Label>Border Radius</Label>
            <Slider value={[radius]} min={6} max={20} step={1} onValueChange={(v)=>setRadius(v[0])} />
            <div className="text-xs text-muted-foreground"><span className="font-mono">{radius}px</span></div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <div>
            <Label className="mb-1">Festive popup</Label>
            <p className="text-xs text-muted-foreground">Enable and set an image URL</p>
          </div>
          <Switch checked={festiveEnabled} onCheckedChange={setFestiveEnabled} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="festive-local">Festive image URL</Label>
          <Input id="festive-local" value={festiveImageUrl} onChange={(e)=>setFestiveImageUrl(e.target.value)} placeholder="https://... .jpg/.jpeg" />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Button onClick={handleSave}>Save Local UI</Button>
          <Button variant="outline" onClick={reset}>Reset</Button>
        </div>
      </div>
    </div>
  );
}

function LocalCatalogCard() {
  const { settings, update } = useLocalUi();
  const [segments, setSegments] = useState<string[]>(settings.catalogCategories ?? []);
  const [selected, setSelected] = useState<string>(segments[0] ?? "");
  const [productsBySegment, setProductsBySegment] = useState<Record<string, any[]>>(settings.catalogProducts ?? {});

  useEffect(() => {
    if (!selected && segments.length) setSelected(segments[0]);
  }, [segments, selected]);

  const addSegment = () => {
    const name = prompt('New segment name');
    if (!name) return;
    if (segments.includes(name)) return alert('Segment exists');
    setSegments([...segments, name]);
  };
  const removeSegment = (name: string) => {
    const next = segments.filter((s) => s !== name);
    setSegments(next);
    const copy = { ...productsBySegment };
    delete copy[name];
    setProductsBySegment(copy);
    if (selected === name) setSelected(next[0] ?? "");
  };

  const products = productsBySegment[selected] ?? [];

  const updateProduct = (idx: number, patch: any) => {
    const list = [...products];
    list[idx] = { ...list[idx], ...patch };
    setProductsBySegment({ ...productsBySegment, [selected]: list });
  };
  const addProduct = () => {
    const list = [...products, { id: crypto.randomUUID(), name: '', image: '', price: 0, discountPercent: 0 }];
    setProductsBySegment({ ...productsBySegment, [selected]: list });
  };
  const removeProduct = (idx: number) => {
    const list = products.filter((_, i) => i !== idx);
    setProductsBySegment({ ...productsBySegment, [selected]: list });
  };

  const saveAll = () => {
    update({ catalogCategories: segments, catalogProducts: productsBySegment });
    alert('Local catalog saved');
  };

  return (
    <div className="p-4 rounded-lg border glass-card">
      <h2 className="font-semibold mb-2">Local Catalog (beta)</h2>
      <p className="text-sm text-muted-foreground mb-4">Manage segments and products locally. Later we can move this to Supabase.</p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Segments</h3>
            <Button size="sm" variant="outline" onClick={addSegment}>Add</Button>
          </div>
          <ul className="space-y-1">
            {segments.map((s) => (
              <li key={s} className={`flex items-center justify-between rounded border px-2 py-1 text-sm ${selected===s?'bg-accent/50':''}`}>
                <button className="text-left flex-1" onClick={()=>setSelected(s)}>{s}</button>
                <button className="text-destructive" onClick={()=>removeSegment(s)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Products in: <span className="font-semibold">{selected || '—'}</span></h3>
            <Button size="sm" onClick={addProduct} disabled={!selected}>Add Product</Button>
          </div>
          {selected ? (
            <div className="space-y-3">
              {products.map((p: any, idx: number) => (
                <div key={p.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 border rounded p-2">
                  <Input placeholder="Name" value={p.name} onChange={(e)=>updateProduct(idx,{name:e.target.value})} className="md:col-span-2" />
                  <Input placeholder="Image URL" value={p.image} onChange={(e)=>updateProduct(idx,{image:e.target.value})} className="md:col-span-2" />
                  <Input placeholder="Price" type="number" value={p.price} onChange={(e)=>updateProduct(idx,{price:Number(e.target.value)})} />
                  <Input placeholder="Discount %" type="number" value={p.discountPercent ?? 0} onChange={(e)=>updateProduct(idx,{discountPercent:Number(e.target.value)})} />
                  <div className="md:col-span-6 flex justify-end">
                    <Button variant="destructive" size="sm" onClick={()=>removeProduct(idx)}>Remove</Button>
                  </div>
                </div>
              ))}
              {products.length===0 && <p className="text-sm text-muted-foreground">No products yet.</p>}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a segment to manage products.</p>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-4 gap-2">
        <Button variant="outline" onClick={()=>{ setSegments(settings.catalogCategories ?? []); setProductsBySegment(settings.catalogProducts ?? {}); }}>Reset</Button>
        <Button onClick={saveAll}>Save</Button>
      </div>
    </div>
  );
}
