-- Add column for price without exchange
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS price_without_exchange integer;

-- Add hero title/subtitle to site settings
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS hero_title text,
ADD COLUMN IF NOT EXISTS hero_subtitle text;

-- Prefill hero texts for default row if empty
UPDATE public.site_settings
SET 
  hero_title = COALESCE(hero_title, 'Power You Can Trust'),
  hero_subtitle = COALESCE(hero_subtitle, 'Exide home/inverter batteries, car & bike batteries, and Microtek inverters with fast delivery, expert installation, and the best prices.')
WHERE key = 'default';