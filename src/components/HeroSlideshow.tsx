import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface HeroSlide {
  id: string;
  image_url: string;
  duration_seconds: number;
  sort_order: number;
}

interface HeroSlideshowProps {
  onSlideChange?: (index: number) => void;
  onFontColorLoad?: (color: string) => void;
}

export default function HeroSlideshow({ onSlideChange, onFontColorLoad }: HeroSlideshowProps) {
  const [dbSlides, setDbSlides] = useState<HeroSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [gradientDuration, setGradientDuration] = useState(5);
  const [gradientAnimated, setGradientAnimated] = useState(true);
  const [gradientVisible, setGradientVisible] = useState(true);
  const [gradientAnimationDuration, setGradientAnimationDuration] = useState(90);

  useEffect(() => {
    loadSlides();
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("hero_gradient_duration, hero_gradient_animated, hero_gradient_visible, hero_gradient_animation_duration, hero_gradient_font_color")
      .eq("key", "default")
      .single();

    if (data) {
      if (data.hero_gradient_duration) {
        setGradientDuration(data.hero_gradient_duration);
      }
      if (data.hero_gradient_animated !== undefined) {
        setGradientAnimated(data.hero_gradient_animated);
      }
      if (data.hero_gradient_visible !== undefined) {
        setGradientVisible(data.hero_gradient_visible);
      }
      if (data.hero_gradient_animation_duration) {
        setGradientAnimationDuration(data.hero_gradient_animation_duration);
      }
      if (data.hero_gradient_font_color) {
        onFontColorLoad?.(data.hero_gradient_font_color);
      }
    }
  };

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

  // Total slides = gradient (if visible) + database slides
  const totalSlides = (gradientVisible ? 1 : 0) + dbSlides.length;

  useEffect(() => {
    if (isLoading || totalSlides === 0) return;

    // Determine duration based on current slide
    let duration: number;
    const isGradientSlide = gradientVisible && currentIndex === 0;
    
    if (isGradientSlide) {
      // Gradient slide
      duration = gradientDuration * 1000;
    } else {
      // Database slide
      const dbSlideIndex = gradientVisible ? currentIndex - 1 : currentIndex;
      duration = (dbSlides[dbSlideIndex]?.duration_seconds || 5) * 1000;
    }

    const timer = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % totalSlides;
      
      // Preload next image if it's a database slide
      const nextDbIndex = gradientVisible ? nextIndex - 1 : nextIndex;
      if (nextDbIndex >= 0 && dbSlides[nextDbIndex]) {
        const img = new Image();
        img.src = dbSlides[nextDbIndex].image_url;
      }
      
      setCurrentIndex(nextIndex);
      onSlideChange?.(nextIndex);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, dbSlides, totalSlides, isLoading, gradientDuration, gradientVisible, onSlideChange]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* Gradient slide - first (index 0) if visible */}
      {gradientVisible && (
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            gradientAnimated ? 'gradient-animated' : 'gradient-static'
          }`}
          style={{
            opacity: currentIndex === 0 ? 1 : 0,
            animationDuration: `${gradientAnimationDuration}s`,
          }}
        />
      )}
      
      {/* Database slides */}
      {dbSlides.map((slide, index) => {
        const slideIndex = gradientVisible ? index + 1 : index;
        return (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: currentIndex === slideIndex ? 1 : 0,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${slide.image_url})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            {/* Overlay for better text readability on promotional images */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        );
      })}
      
      {/* Overlay for better text readability - only on gradient slide */}
      {gradientVisible && currentIndex === 0 && (
        <div className="absolute inset-0 bg-black/40" />
      )}
    </div>
  );
}
