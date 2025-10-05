-- Add hero_gradient_duration column to site_settings
ALTER TABLE public.site_settings 
ADD COLUMN hero_gradient_duration integer NOT NULL DEFAULT 5;