import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface SettingsContextValue {
  baseFontSize: number;
  setBaseFontSize: (v: number) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);
const KEY = "ui-base-font";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [baseFontSize, setBaseFontSizeState] = useState<number>(() => {
    const saved = Number(localStorage.getItem(KEY));
    return Number.isFinite(saved) && saved >= 12 && saved <= 20 ? saved : 16;
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${baseFontSize}px`;
    localStorage.setItem(KEY, String(baseFontSize));
  }, [baseFontSize]);

  const value = useMemo<SettingsContextValue>(() => ({
    baseFontSize,
    setBaseFontSize: setBaseFontSizeState,
  }), [baseFontSize]);

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
