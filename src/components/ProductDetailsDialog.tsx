import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LeadModal from "@/components/LeadModal";
import { type Product, formatCurrency } from "@/data/products";

export default function ProductDetailsDialog({ product, children }: { product: Product; children: React.ReactNode }) {
  const discounted = product.discountPercent
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : product.price;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
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
            <div className="flex items-center gap-3">
              {product.discountPercent ? (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.price)}
                </span>
              ) : null}
              <span className="text-base font-semibold">{formatCurrency(discounted)}</span>
              {product.discountPercent ? (
                <span className="inline-flex items-center rounded-full bg-destructive text-destructive-foreground text-sm md:text-xs font-bold px-2.5 py-0.5 ml-2">
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

          <div className="grid gap-1">
            <h4 className="font-semibold">Specifications</h4>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Brand-certified product with warranty</li>
              <li>Professional installation and support</li>
              <li>Fast delivery available in your area</li>
            </ul>
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
