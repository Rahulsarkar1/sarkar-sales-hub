import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { categories as defaultCategories, productsByCategory as defaultProductsByCategory, type Product } from "@/data/products";

export function useCatalog() {
  // Remote segments
  const { data: segments } = useQuery({
    queryKey: ["segments"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("segments")
        .select("id,key,name,sort_order,visible")
        .eq("visible", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  // Remote products
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("products")
        .select("id,segment_id,name,image_url,price_mrp,discount_percent,sort_order,visible")
        .eq("visible", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const hasRemote = (segments && segments.length > 0) && (products && products.length > 0);

  const categoriesList = hasRemote
    ? (segments!.map((s: any) => s.name) as readonly string[])
    : defaultCategories;

  const productsByCategory: Record<string, Product[]> = useMemo(() => {
    if (!hasRemote) return defaultProductsByCategory as unknown as Record<string, Product[]>;
    // Group by segment_id then map name
    const segById: Record<string, string> = Object.fromEntries(segments!.map((s: any) => [s.id, s.name]));
    const out: Record<string, Product[]> = {};
    for (const p of products as any[]) {
      const cat = segById[p.segment_id] || "Misc";
      const list = out[cat] || (out[cat] = []);
      list.push({
        id: p.id,
        name: p.name,
        image: p.image_url || "",
        price: p.price_mrp,
        discountPercent: p.discount_percent || 0,
      });
    }
    return out;
  }, [hasRemote, segments, products]);

  return { categoriesList, productsByCategory } as const;
}
