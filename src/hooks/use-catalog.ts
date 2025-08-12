import { useLocalUi } from "@/context/LocalUiContext";
import { categories as defaultCategories, productsByCategory as defaultProductsByCategory, type Product } from "@/data/products";

export function useCatalog() {
  const { settings } = useLocalUi();

  const categoriesList = (settings.catalogCategories && settings.catalogCategories.length > 0)
    ? (settings.catalogCategories as readonly string[])
    : defaultCategories;

  const productsByCategory: Record<string, Product[]> = {};
  categoriesList.forEach((c) => {
    const override = settings.catalogProducts?.[c];
    productsByCategory[c] = override && override.length > 0
      ? override
      : (defaultProductsByCategory as Record<string, Product[]>)[c] ?? [];
  });

  return { categoriesList, productsByCategory } as const;
}
