
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LeadModal from "@/components/LeadModal";
import { type Product, formatCurrency } from "@/data/products";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function ProductDetailsDialog({ product, children }: { product: Product; children: React.ReactNode }) {
  const discounted = product.discountPercent
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : product.price;

  const { data: specs = [], isLoading: specsLoading } = useQuery({
    queryKey: ["product_specs", product.id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("product_specs")
        .select("id,label,value,sort_order")
        .eq("product_id", product.id)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: details } = useQuery({
    queryKey: ["product_details", product.id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("products")
        .select("description")
        .eq("id", product.id)
        .single();
      if (error) throw error;
      return data as { description: string | null };
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[92vw] md:w-auto max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <img
            src={product.image}
            alt={`${product.name} large image`}
            className="w-full h-48 object-cover rounded-md border"
            loading="lazy"
            decoding="async"
          />

          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              {product.discountPercent ? (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.price)}
                </span>
              ) : null}
              <span className="text-base font-semibold">{formatCurrency(discounted)}</span>
              {product.discountPercent ? (
                <span className="inline-flex items-center rounded-full bg-destructive text-destructive-foreground font-bold px-2 py-0.5 text-[11px] md:text-xs">
                  -{product.discountPercent}%
                </span>
              ) : null}
            </div>
            <div className="text-sm text-muted-foreground">
              Prices shown are inclusive of standard offers. Contact us for exact quote.
            </div>
          </div>

          <div className="grid gap-1">
            <h4 className="font-semibold">Prices</h4>
            <div className="flex items-center justify-between text-sm">
              <span>With battery exchange</span>
              <span className="font-medium">{formatCurrency(discounted)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Without battery exchange (MRP)</span>
              <span className="font-medium">{formatCurrency(product.price)}</span>
            </div>
          </div>

          {details?.description && (
            <div className="grid gap-1">
              <h4 className="font-semibold">Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{details.description}</p>
            </div>
          )}

          <div className="grid gap-1">
            <h4 className="font-semibold">Specifications</h4>
            {specsLoading ? (
              <div className="text-sm text-muted-foreground">Loading…</div>
            ) : specs.length > 0 ? (
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                {specs.map((s: any) => (
                  <li key={s.id}>
                    <span className="font-medium text-foreground">{s.label}:</span> {s.value}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Brand-certified product with warranty</li>
                <li>Professional installation and support</li>
                <li>Fast delivery available in your area</li>
              </ul>
            )}
          </div>

          <LeadModal productName={product.name}>
            <div className="grid gap-2">
              <button className="w-full inline-flex items-center justify-center h-10 rounded-md border bg-primary text-primary-foreground font-medium">
                Buy / Enquire
              </button>
            </div>
          </LeadModal>
        </div>
      </DialogContent>
    </Dialog>
  );
}
