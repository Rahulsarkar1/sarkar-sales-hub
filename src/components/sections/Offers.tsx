import { useEffect, useMemo, useState } from "react";

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const s = Math.floor(diff / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return { d, h, m, s: sec };
}

export default function Offers() {
  const target = useMemo(() => {
    const t = new Date();
    t.setDate(t.getDate() + 10);
    t.setHours(23, 59, 59, 0);
    return t;
  }, []);
  const { d, h, m, s } = useCountdown(target);

  return (
    <section id="offers" className="py-12">
      <div className="container mx-auto px-4">
        <div className="rounded-xl border p-6 relative overflow-hidden glass-card">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-hero)" }} />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Festive Offer</h2>
            <p className="text-muted-foreground mb-4">Extra savings on inverter combos. Limited time only!</p>
            <div className="flex items-center gap-4 text-center">
              {[{ label: "Days", v: d }, { label: "Hours", v: h }, { label: "Minutes", v: m }, { label: "Seconds", v: s }].map((x) => (
                <div key={x.label} className="min-w-[70px]">
                  <div className="text-2xl font-bold">{String(x.v).padStart(2, "0")}</div>
                  <div className="text-xs text-muted-foreground">{x.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
