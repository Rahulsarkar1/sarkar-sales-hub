import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { site as defaults } from "@/config/site";

export type SiteSettings = {
  key: string;
  site_name: string;
  tagline: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  email: string | null;
  address: string | null;
  map_embed_src: string | null;
  city: string | null;
  canonical_url: string | null;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  base_font_size: number | null;
  festive_enabled: boolean | null;
  festive_image_url: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  contact_info: string | null;
  about_us: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  hero_background_image: string | null;
  privacy_policy: string | null;
  terms_conditions: string | null;
};

interface SiteSettingsContextValue {
  settings: SiteSettings | null;
  loading: boolean;
  refresh: () => Promise<void>;
  updateSettings: (patch: Partial<SiteSettings>) => Promise<Error | null>;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | undefined>(
  undefined
);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("key", "default")
      .maybeSingle();
    if (!error && data) setSettings({
      ...data,
      privacy_policy: (data as any).privacy_policy || null,
      terms_conditions: (data as any).terms_conditions || null
    } as SiteSettings);
    setLoading(false);
  };

  useEffect(() => {
    // Initial load
    load();
  }, []);

  useEffect(() => {
    // Apply base font size from settings if available
    if (settings?.base_font_size && Number.isFinite(settings.base_font_size)) {
      document.documentElement.style.fontSize = `${settings.base_font_size}px`;
    }
  }, [settings?.base_font_size]);

  useEffect(() => {
    const root = document.documentElement;
    if (settings?.primary_color) {
      root.style.setProperty("--primary", settings.primary_color);
    }
    if (settings?.secondary_color) {
      root.style.setProperty("--secondary", settings.secondary_color);
    }
  }, [settings?.primary_color, settings?.secondary_color]);

  const updateSettings = async (patch: Partial<SiteSettings>) => {
    const next = { ...(settings ?? { key: "default" }), ...patch } as SiteSettings;
    const { error } = await supabase.from("site_settings").upsert(next);
    if (!error) {
      setSettings(next);
      // Trigger a refresh to ensure all components get updated data
      setTimeout(() => load(), 100);
    }
    return error ?? null;
  };

  const value = useMemo<SiteSettingsContextValue>(
    () => ({ settings, loading, refresh: load, updateSettings }),
    [settings, loading]
  );

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  return ctx;
}
