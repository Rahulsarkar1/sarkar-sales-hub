-- Add gradient animation duration setting
ALTER TABLE public.site_settings 
ADD COLUMN hero_gradient_animation_duration integer NOT NULL DEFAULT 90;