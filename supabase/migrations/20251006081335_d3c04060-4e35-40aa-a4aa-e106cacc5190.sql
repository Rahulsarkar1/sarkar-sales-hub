-- Add gradient animation and visibility controls to site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS hero_gradient_animated boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS hero_gradient_visible boolean DEFAULT true;