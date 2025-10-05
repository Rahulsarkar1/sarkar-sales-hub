import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface HeroSlide {
  id: string;
  image_url: string;
  duration_seconds: number;
  sort_order: number;
}

export default function HeroSlideshow() {
  const [dbSlides, setDbSlides] = useState<HeroSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Gradient slide is always the first slide (index 0)
  const GRADIENT_DURATION = 5; // seconds

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
      setDbSlides(data);
      // Preload first image
      const img = new Image();
      img.src = data[0].image_url;
    }
    setIsLoading(false);
  };

  // Total slides = gradient (always first) + database slides
  const totalSlides = 1 + dbSlides.length;

  useEffect(() => {
    if (isLoading) return;

    // Determine duration based on current slide
    let duration: number;
    if (currentIndex === 0) {
      // Gradient slide
      duration = GRADIENT_DURATION * 1000;
    } else {
      // Database slide
      const dbSlideIndex = currentIndex - 1;
      duration = (dbSlides[dbSlideIndex]?.duration_seconds || 5) * 1000;
    }

    const timer = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % totalSlides;
      
      // Preload next image if it's a database slide
      if (nextIndex > 0 && dbSlides[nextIndex - 1]) {
        const img = new Image();
        img.src = dbSlides[nextIndex - 1].image_url;
      }
      
      setCurrentIndex(nextIndex);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, dbSlides, totalSlides, isLoading]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* Gradient slide - always first (index 0) */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: currentIndex === 0 ? 1 : 0,
          background: "var(--gradient-hero)",
        }}
      />
      
      {/* Database slides (index 1, 2, 3, etc.) */}
      {dbSlides.map((slide, index) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: currentIndex === index + 1 ? 1 : 0,
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
