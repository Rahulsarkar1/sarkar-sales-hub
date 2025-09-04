import { useState, useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useCatalog } from "@/hooks/use-catalog";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function CategoryProducts() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const { categoriesList, productsByCategory } = useCatalog();
  const { settings } = useSiteSettings();
  
  // Convert URL-safe category name back to display name
  const displayCategoryName = categoryName?.replace(/-/g, ' ');
  
  // Find the exact category match (case-insensitive)
  const matchedCategory = categoriesList.find(
    cat => cat.toLowerCase() === displayCategoryName?.toLowerCase()
  );
  
  // If category doesn't exist, redirect to home
  if (!matchedCategory) {
    return <Navigate to="/" replace />;
  }
  
  const products = productsByCategory[matchedCategory] || [];
  
  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>{matchedCategory} - {settings?.site_name || 'Sarkar Sales'}</title>
          <meta name="description" content={`Browse our complete collection of ${matchedCategory.toLowerCase()} products. Find the perfect solution for your needs.`} />
          <meta name="keywords" content={`${matchedCategory.toLowerCase()}, batteries, inverters, ${settings?.site_name || 'Sarkar Sales'}`} />
        </Helmet>
        
        <Header onSearch={handleSearch} />
        
        <main className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{matchedCategory}</span>
          </nav>
          
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{matchedCategory}</h1>
              <p className="text-muted-foreground">
                {searchQuery ? 
                  `${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''} found for "${searchQuery}"` :
                  `${products.length} product${products.length !== 1 ? 's' : ''} available`
                }
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
          
          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {searchQuery ? 
                  `No products found for "${searchQuery}" in ${matchedCategory}` :
                  `No products available in ${matchedCategory}`
                }
              </p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery("")}
                  className="mt-4"
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </main>
      </div>
    </HelmetProvider>
  );
}