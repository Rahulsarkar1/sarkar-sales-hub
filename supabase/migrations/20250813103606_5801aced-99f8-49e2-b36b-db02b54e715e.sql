-- Add new fields to site_settings table
ALTER TABLE public.site_settings 
ADD COLUMN contact_info TEXT,
ADD COLUMN about_us TEXT,
ADD COLUMN facebook_url TEXT,
ADD COLUMN instagram_url TEXT,
ADD COLUMN hero_background_image TEXT;

-- Create reviews table for customer testimonials
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on reviews table
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews table
CREATE POLICY "Anyone can read reviews" 
ON public.reviews 
FOR SELECT 
USING (visible = true);

CREATE POLICY "Admins can manage reviews" 
ON public.reviews 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates on reviews
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_column();