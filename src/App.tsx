import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import About from "./pages/About";
import Auth from "./pages/Auth";
import CategoryProducts from "./pages/CategoryProducts";
import Footer from "@/components/layout/Footer";
import { SettingsProvider } from "@/context/SettingsContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { LocalUiProvider } from "@/context/LocalUiContext";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <SiteSettingsProvider>
          <SettingsProvider>
            <LocalUiProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/category/:categoryName" element={<CategoryProducts />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Footer />
                </BrowserRouter>
              </TooltipProvider>
            </LocalUiProvider>
          </SettingsProvider>
        </SiteSettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
