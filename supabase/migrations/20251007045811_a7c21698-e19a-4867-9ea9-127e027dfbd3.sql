-- Add gradient hero font color and site theme settings
ALTER TABLE site_settings
ADD COLUMN hero_gradient_font_color text DEFAULT '#FFFFFF',
ADD COLUMN site_theme text DEFAULT 'light' CHECK (site_theme IN ('light', 'dark', 'system'));