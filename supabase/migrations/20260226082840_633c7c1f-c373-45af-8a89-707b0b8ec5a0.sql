
-- Create city_inventory table to track stock per city per product
CREATE TABLE public.city_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  product_name TEXT NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  min_stock_level INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(city, product_name)
);

-- Enable RLS
ALTER TABLE public.city_inventory ENABLE ROW LEVEL SECURITY;

-- Admins can manage city inventory
CREATE POLICY "Admins can manage city inventory"
ON public.city_inventory
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Agents can view city inventory
CREATE POLICY "Agents can view city inventory"
ON public.city_inventory
FOR SELECT
TO authenticated
USING (true);

-- Create city_stock_reports table for cities to report stock needs
CREATE TABLE public.city_stock_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity_distributed INTEGER NOT NULL DEFAULT 0,
  quantity_sold INTEGER NOT NULL DEFAULT 0,
  quantity_remaining INTEGER NOT NULL DEFAULT 0,
  reported_by UUID NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.city_stock_reports ENABLE ROW LEVEL SECURITY;

-- Admins can manage all reports
CREATE POLICY "Admins can manage city stock reports"
ON public.city_stock_reports
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Agents can insert their own reports
CREATE POLICY "Agents can insert stock reports"
ON public.city_stock_reports
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reported_by);

-- Agents can view reports
CREATE POLICY "Agents can view stock reports"
ON public.city_stock_reports
FOR SELECT
TO authenticated
USING (true);

-- Trigger for updated_at on city_inventory
CREATE TRIGGER update_city_inventory_updated_at
BEFORE UPDATE ON public.city_inventory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();
