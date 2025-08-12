import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ProductLite = {
  id: string;
  name: string;
  image: string;
  price: number;
  discountPercent?: number;
};

export type LocalUiSettings = {
  logoDataUrl?: string | null;
  siteName?: string;
  tagline?: string;
  social?: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
  primary?: string; // HSL string like "222.2 47.4% 11.2%"
  secondary?: string; // HSL string
  radius?: number; // rem units in px number, will map to rem
  festiveEnabled?: boolean;
  festiveImageUrl?: string;
  // Local catalog overrides
  catalogCategories?: string[];
  catalogProducts?: Record<string, ProductLite[]>;
};

const DEFAULTS: LocalUiSettings = {};
const LS_KEY = "local-ui-settings";

type Ctx = {
  settings: LocalUiSettings;
  update: (patch: Partial<LocalUiSettings>) => void;
  reset: () => void;
};

const LocalUiContext = createContext<Ctx | undefined>(undefined);

export function LocalUiProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<LocalUiSettings>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    // Apply design tokens to :root when provided
    const root = document.documentElement;
    if (settings.primary) root.style.setProperty("--primary", settings.primary);
    if (settings.secondary) root.style.setProperty("--secondary", settings.secondary);
    if (typeof settings.radius === "number") root.style.setProperty("--radius", `${settings.radius}px`);
  }, [settings.primary, settings.secondary, settings.radius]);

  const value = useMemo<Ctx>(() => ({
    settings,
    update: (patch) => setSettings((prev) => ({ ...prev, ...patch })),
    reset: () => setSettings(DEFAULTS),
  }), [settings]);

  return <LocalUiContext.Provider value={value}>{children}</LocalUiContext.Provider>;
}

export function useLocalUi() {
  const ctx = useContext(LocalUiContext);
  if (!ctx) throw new Error("useLocalUi must be used within LocalUiProvider");
  return ctx;
}
