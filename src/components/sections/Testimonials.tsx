import { Star } from "lucide-react";

type Review = { name: string; text: string; rating: number };

const reviews: Review[] = [
  { name: "Ravi", text: "Super quick delivery and professional installation.", rating: 5 },
  { name: "Ayesha", text: "Best price in town for my car battery.", rating: 5 },
  { name: "Kunal", text: "Explained clearly and helped choose the right inverter.", rating: 5 },
];

export default function Testimonials() {
  return (
    <section id="reviews" className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <article key={r.name} className="p-5 rounded-lg border glass-card animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-2">“{r.text}”</p>
              <div className="text-sm font-semibold">{r.name}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
