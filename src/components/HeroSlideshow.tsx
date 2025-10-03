import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface HeroSlide {
  id: string;
  image_url: string;
  duration_seconds: number;
  sort_order: number;
}

export default function HeroSlideshow() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .eq("visible", true)
      .order("sort_order", { ascending: true });

    if (!error && data && data.length > 0) {
      setSlides(data);
      // Preload first image
      const img = new Image();
      img.src = data[0].image_url;
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (slides.length === 0) return;

    const currentSlide = slides[currentIndex];
    const duration = (currentSlide?.duration_seconds || 5) * 1000;

    const timer = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      // Preload next image
      if (slides[nextIndex]) {
        const img = new Image();
        img.src = slides[nextIndex].image_url;
      }
      setCurrentIndex(nextIndex);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, slides]);

  // Fallback to gradient if no slides
  if (!isLoading && slides.length === 0) {
    return (
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            backgroundImage: `url(${slide.image_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      ))}
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
