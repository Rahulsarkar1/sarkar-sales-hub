import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LeadModal from "@/components/LeadModal";
import { Product } from "@/data/products";
import { formatCurrency } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  const discounted = product.discountPercent
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : product.price;

  return (
    <Card className="p-4 glass-card animate-fade-in">
      <div className="flex items-start gap-4">
        <img
          src={product.image}
          alt={`${product.name} product image`}
          loading="lazy"
          decoding="async"
          className="w-28 h-28 object-cover rounded-md border"
        />
        <div className="flex-1">
          <h3 className="font-semibold leading-snug mb-1">{product.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            {product.discountPercent ? (
              <>
                <span className="text-muted-foreground line-through text-sm">
                  {formatCurrency(product.price)}
                </span>
                <span className="font-bold">{formatCurrency(discounted)}</span>
              </>
            ) : (
              <span className="font-bold">{formatCurrency(product.price)}</span>
            )}
            {product.discountPercent ? (
              <span className="ml-auto text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded">
                -{product.discountPercent}%
              </span>
            ) : null}
          </div>
          <LeadModal productName={product.name}>
            <Button variant="hero" className="w-full">Buy / Enquire</Button>
          </LeadModal>
        </div>
      </div>
    </Card>
  );
}
