import { ShieldCheck, Truck, BadgeCheck, Zap } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "Genuine & Warranty", desc: "Only original, brand-new units with full manufacturer warranty." },
  { icon: Truck, title: "Fast Delivery", desc: "Quick doorstep delivery and installation in your city." },
  { icon: BadgeCheck, title: "Best Prices", desc: "Transparent pricing with seasonal discounts." },
  { icon: Zap, title: "Expert Support", desc: "Right capacity guidance for your home, car or bike." },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Why Choose Sarkar Sales?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-5 rounded-lg border glass-card hover-scale">
              <Icon className="mb-3 h-6 w-6 text-primary" />
              <div className="font-semibold mb-1">{title}</div>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
