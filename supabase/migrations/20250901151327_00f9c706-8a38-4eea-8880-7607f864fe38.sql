-- Add flexible pricing display options to products table
ALTER TABLE public.products 
ADD COLUMN show_exchange_price boolean DEFAULT false,
ADD COLUMN show_without_exchange_price boolean DEFAULT false,
ADD COLUMN special_price integer,
ADD COLUMN show_special_price boolean DEFAULT false;