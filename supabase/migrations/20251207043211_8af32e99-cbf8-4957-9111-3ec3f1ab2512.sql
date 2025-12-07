-- Create analytics_events table for tracking all user interactions
CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  event_name text,
  page_path text,
  referrer text,
  source text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text,
  segment_name text,
  user_agent text,
  device_type text,
  browser text,
  country text,
  city text,
  session_id text,
  visitor_id text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for fast queries
CREATE INDEX idx_analytics_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX idx_analytics_event_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_source ON public.analytics_events(source);
CREATE INDEX idx_analytics_product_id ON public.analytics_events(product_id);
CREATE INDEX idx_analytics_visitor_id ON public.analytics_events(visitor_id);

-- Create analytics_daily_summary for pre-aggregated stats
CREATE TABLE public.analytics_daily_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  total_visits integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  page_views integer DEFAULT 0,
  product_views integer DEFAULT 0,
  call_clicks integer DEFAULT 0,
  whatsapp_clicks integer DEFAULT 0,
  desktop_visits integer DEFAULT 0,
  mobile_visits integer DEFAULT 0,
  tablet_visits integer DEFAULT 0,
  direct_traffic integer DEFAULT 0,
  organic_traffic integer DEFAULT 0,
  social_traffic integer DEFAULT 0,
  referral_traffic integer DEFAULT 0,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_daily_summary ENABLE ROW LEVEL SECURITY;

-- Anyone can INSERT analytics events (anonymous tracking)
CREATE POLICY "Anyone can insert analytics events"
ON public.analytics_events
FOR INSERT
WITH CHECK (true);

-- Only admins can READ analytics events
CREATE POLICY "Admins can read analytics events"
ON public.analytics_events
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can manage daily summary
CREATE POLICY "Admins can manage daily summary"
ON public.analytics_daily_summary
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));