-- Add privacy_policy and terms_conditions columns to site_settings table
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS privacy_policy text NULL,
ADD COLUMN IF NOT EXISTS terms_conditions text NULL;

-- Add comments for documentation
COMMENT ON COLUMN site_settings.privacy_policy IS 'Privacy policy content displayed on /privacy page';
COMMENT ON COLUMN site_settings.terms_conditions IS 'Terms and conditions content displayed on /terms page';