import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
        <div className="max-w-md p-4 rounded-lg border glass-card">
          <h2 className="font-semibold mb-2">Change Password</h2>
          <div className="flex gap-2">
            <Input type="password" placeholder="New password" value={pass} onChange={(e) => setPass(e.target.value)} />
            <Button onClick={() => { localStorage.setItem(PASS_KEY, pass); alert("Password updated"); }}>Save</Button>
          </div>
        </div>
      </div>
    </main>
  );
}
