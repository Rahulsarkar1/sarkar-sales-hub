import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Review = { id: string; name: string; text: string; rating: number };

const fallbackReviews: Review[] = [
  { id: "1", name: "Ravi", text: "Super quick delivery and professional installation.", rating: 5 },
  { id: "2", name: "Ayesha", text: "Best price in town for my car battery.", rating: 5 },
  { id: "3", name: "Kunal", text: "Explained clearly and helped choose the right inverter.", rating: 5 },
];

export default function Testimonials() {
  const { data: reviews = [], isError } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("visible", true)
          .order("sort_order", { ascending: true });
        if (error) throw error;
        return data as Review[];
      } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
      }
    },
    retry: false, // Don't retry on error
  });

  // Use fallback reviews if database fetch failed or returned empty
  const displayReviews = (reviews && reviews.length > 0) ? reviews : fallbackReviews;

  return (
    <section id="reviews" className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {displayReviews.map((r) => (
            <article key={r.id} className="p-5 rounded-lg border glass-card animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-2">"{r.text}"</p>
              <div className="text-sm font-semibold">{r.name}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}