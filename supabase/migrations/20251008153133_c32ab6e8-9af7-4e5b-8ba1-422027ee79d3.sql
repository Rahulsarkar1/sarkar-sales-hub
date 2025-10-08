-- Add hero content position setting to site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS hero_content_position TEXT DEFAULT 'bottom' CHECK (hero_content_position IN ('top', 'center', 'bottom'));