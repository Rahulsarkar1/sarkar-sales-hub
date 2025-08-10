import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useSettings } from "@/context/SettingsContext";

const PASS_KEY = "sarkar-admin-pass";

export default function Admin() {
  const [pass, setPass] = useState("");
  const [savedPass, setSavedPass] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setSavedPass(localStorage.getItem(PASS_KEY) || "admin123");
  }, []);

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm p-6 rounded-xl border glass-card">
          <h1 className="text-xl font-bold mb-2">Admin Sign In</h1>
          <p className="text-sm text-muted-foreground mb-4">Password protected area.</p>
          <Input type="password" placeholder="Enter password" value={pass} onChange={(e) => setPass(e.target.value)} />
          <Button className="mt-3 w-full" onClick={() => setAuthed(pass === savedPass)}>Sign In</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin Portal</h1>
        <p className="text-muted-foreground mb-6">This is a starter. Next step we will connect Supabase for full dynamic control (products, texts, colors, reviews, banners).</p>
        <div className="grid gap-6 max-w-2xl">
          <div className="p-4 rounded-lg border glass-card">
            <h2 className="font-semibold mb-2">Change Password</h2>
            <div className="flex gap-2">
              <Input type="password" placeholder="New password" value={pass} onChange={(e) => setPass(e.target.value)} />
              <Button onClick={() => { localStorage.setItem(PASS_KEY, pass); alert("Password updated"); }}>Save</Button>
            </div>
          </div>

          <UiScaleCard />
        </div>
      </div>
    </main>
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
