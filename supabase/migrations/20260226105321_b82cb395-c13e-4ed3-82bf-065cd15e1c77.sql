
-- Create storage bucket for stock images
INSERT INTO storage.buckets (id, name, public) VALUES ('stock-images', 'stock-images', true);

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload stock images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'stock-images' AND auth.uid() IS NOT NULL);

-- Allow everyone to view stock images
CREATE POLICY "Anyone can view stock images"
ON storage.objects FOR SELECT
USING (bucket_id = 'stock-images');

-- Allow admins to delete stock images
CREATE POLICY "Admins can delete stock images"
ON storage.objects FOR DELETE
USING (bucket_id = 'stock-images' AND public.is_admin(auth.uid()));

-- Add image_url column to stock_entries
ALTER TABLE public.stock_entries ADD COLUMN image_url text;

-- Create stock_removals table for tracking stock out
CREATE TABLE public.stock_removals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name text NOT NULL,
  quantity integer NOT NULL,
  reason text,
  image_url text,
  removed_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.stock_removals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage stock removals"
ON public.stock_removals FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Agents can insert stock removals"
ON public.stock_removals FOR INSERT
WITH CHECK (auth.uid() = removed_by);

CREATE POLICY "Agents can view stock removals"
ON public.stock_removals FOR SELECT
USING (true);
