-- Add hero_gradient_animation_duration column to site_settings
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS hero_gradient_animation_duration integer NOT NULL DEFAULT 90;

COMMENT ON COLUMN public.site_settings.hero_gradient_animation_duration IS 'Duration in seconds for gradient color transition animation (10-300s)';