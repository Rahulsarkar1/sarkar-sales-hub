
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LeadModal from "@/components/LeadModal";
import ProductDetailsDialog from "@/components/ProductDetailsDialog";
import { Product } from "@/data/products";
import { formatCurrency } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  const discounted = product.discountPercent
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : product.price;

  return (
    <Card className="p-4 glass-card animate-fade-in">
      <div className="flex items-start gap-3">
        <ProductDetailsDialog product={product}>
          <div className="flex items-start gap-3 cursor-pointer">
            <img
              src={product.image}
              alt={`${product.name} product image`}
              loading="lazy"
              decoding="async"
              className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-md border"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold leading-snug mb-1">{product.name}</h3>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {product.discountPercent ? (
                  <>
                    <span className="text-muted-foreground line-through text-sm">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="font-bold">{formatCurrency(discounted)}</span>
                    <span className="inline-flex items-center rounded-full bg-destructive text-destructive-foreground font-bold px-2 py-0.5 text-[10px] md:text-xs">
                      -{product.discountPercent}%
                    </span>
                  </>
                ) : (
                  <span className="font-bold">{formatCurrency(product.price)}</span>
                )}
              </div>
              <LeadModal productName={product.name}>
                <Button variant="hero" className="w-full" onClick={(e) => e.stopPropagation()}>Buy / Enquire</Button>
              </LeadModal>
            </div>
          </div>
        </ProductDetailsDialog>

      </div>
    </Card>
  );
}
