
-- Inventory table to track current stock levels
CREATE TABLE public.inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name text NOT NULL UNIQUE,
  current_stock integer NOT NULL DEFAULT 0,
  min_stock_level integer NOT NULL DEFAULT 10,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Stock entries log (additions to stock)
CREATE TABLE public.stock_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name text NOT NULL,
  quantity integer NOT NULL,
  notes text,
  added_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.stock_entries ENABLE ROW LEVEL SECURITY;

-- RLS for inventory: admins full access, agents can view
CREATE POLICY "Admins can manage inventory" ON public.inventory FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Agents can view inventory" ON public.inventory FOR SELECT TO authenticated USING (true);

-- RLS for stock_entries: admins full access, agents can view
CREATE POLICY "Admins can manage stock entries" ON public.stock_entries FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Agents can view stock entries" ON public.stock_entries FOR SELECT TO authenticated USING (true);

-- Trigger for updated_at on inventory
CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON public.inventory
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
