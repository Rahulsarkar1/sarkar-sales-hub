-- Add hero font size controls to site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS hero_title_font_size integer DEFAULT 72,
ADD COLUMN IF NOT EXISTS hero_subtitle_font_size integer DEFAULT 24;

COMMENT ON COLUMN site_settings.hero_title_font_size IS 'Hero title font size in pixels for desktop (mobile is 60% of this value)';
COMMENT ON COLUMN site_settings.hero_subtitle_font_size IS 'Hero subtitle font size in pixels for desktop (mobile is 75% of this value)';