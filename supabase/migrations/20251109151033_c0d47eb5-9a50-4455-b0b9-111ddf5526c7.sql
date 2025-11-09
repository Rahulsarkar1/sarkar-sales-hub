-- Add notification popup settings to site_settings table
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS notification_popup_enabled boolean DEFAULT false;

COMMENT ON COLUMN site_settings.notification_popup_enabled IS 'Enable/disable the notification permission popup feature';