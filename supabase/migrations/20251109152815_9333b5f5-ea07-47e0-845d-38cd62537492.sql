-- Add notification content fields to site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS notification_title text DEFAULT 'Stay updated!',
ADD COLUMN IF NOT EXISTS notification_message text DEFAULT 'Check out our latest offers and products!',
ADD COLUMN IF NOT EXISTS notification_image_url text,
ADD COLUMN IF NOT EXISTS notification_action_url text DEFAULT '/';

COMMENT ON COLUMN site_settings.notification_title IS 'Title for browser push notifications and permission popup';
COMMENT ON COLUMN site_settings.notification_message IS 'Message body for browser push notifications and permission popup';
COMMENT ON COLUMN site_settings.notification_image_url IS 'Optional image URL for rich notifications';
COMMENT ON COLUMN site_settings.notification_action_url IS 'URL to open when user clicks notification';