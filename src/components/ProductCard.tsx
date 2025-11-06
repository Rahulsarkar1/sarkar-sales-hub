
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LeadModal from "@/components/LeadModal";
import ProductDetailsDialog from "@/components/ProductDetailsDialog";
import { Product } from "@/data/products";
import { formatCurrency } from "@/data/products";
import { trackProductClick } from "@/lib/analytics";

export default function ProductCard({ product }: { product: Product }) {
  const discounted = product.discountPercent
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : product.price;

  return (
    <Card className="p-4 glass-card animate-fade-in">
      <div className="flex items-start gap-3">
        <ProductDetailsDialog product={product}>
          <div 
            className="flex items-start gap-3 cursor-pointer"
            onClick={() => trackProductClick(product.name)}
          >
            <div className="w-24 md:w-28 aspect-square">
              <img
                src={product.image}
                alt={`${product.name} product image`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain rounded-md border"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold leading-snug mb-1">{product.name}</h3>
              <div className="flex items-center gap-1.5 mb-2">
                {product.discountPercent ? (
                  <>
                    <span className="text-muted-foreground line-through text-sm">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="font-bold">{formatCurrency(discounted)}</span>
                    <span className="inline-flex items-center rounded-full bg-destructive text-destructive-foreground font-bold px-1.5 py-0.5 text-[9px] whitespace-nowrap">
                      -{product.discountPercent}%
                    </span>
                  </>
                ) : (
                  <span className="font-bold">{formatCurrency(product.price)}</span>
                )}
              </div>
              <LeadModal productName={product.name}>
                <Button variant="hero" className="min-w-[140px]" onClick={(e) => e.stopPropagation()}>Buy / Enquire</Button>
              </LeadModal>
            </div>
          </div>
        </ProductDetailsDialog>

      </div>
    </Card>
  );
}
