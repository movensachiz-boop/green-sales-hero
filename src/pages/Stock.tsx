import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, Plus, AlertTriangle } from "lucide-react";

type Inventory = {
  id: string;
  product_name: string;
  current_stock: number;
  min_stock_level: number;
  created_at: string;
  updated_at: string;
};

type StockEntry = {
  id: string;
  product_name: string;
  quantity: number;
  notes: string | null;
  added_by: string;
  created_at: string;
};

const Stock = () => {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minStock, setMinStock] = useState("10");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: inventory, isLoading: loadingInventory } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("inventory").select("*").order("product_name");
      if (error) throw error;
      return data as Inventory[];
    },
  });

  const { data: stockEntries } = useQuery({
    queryKey: ["stock-entries"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("stock_entries").select("*").order("created_at", { ascending: false }).limit(20);
      if (error) throw error;
      return data as StockEntry[];
    },
  });

  const addStockMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const qty = parseInt(quantity);

      // Upsert inventory
      const existing = inventory?.find(i => i.product_name.toLowerCase() === productName.toLowerCase());
      if (existing) {
        const { error } = await (supabase as any)
          .from("inventory")
          .update({ current_stock: existing.current_stock + qty, min_stock_level: parseInt(minStock) })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from("inventory")
          .insert({ product_name: productName, current_stock: qty, min_stock_level: parseInt(minStock) });
        if (error) throw error;
      }

      // Log stock entry
      const { error: entryError } = await (supabase as any)
        .from("stock_entries")
        .insert({ product_name: productName, quantity: qty, notes: notes || null, added_by: user.id });
      if (entryError) throw entryError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["stock-entries"] });
      setProductName("");
      setQuantity("");
      setMinStock("10");
      setNotes("");
      toast({ title: "Stock added", description: "Inventory updated successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !quantity) return;
    addStockMutation.mutate();
  };

  const lowStockItems = inventory?.filter(i => i.current_stock <= i.min_stock_level) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stock Management</h1>
          <p className="text-muted-foreground">Track and manage your inventory</p>
        </div>

        {lowStockItems.length > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" /> Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lowStockItems.map(item => (
                  <Badge key={item.id} variant="destructive">
                    {item.product_name}: {item.current_stock} left
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" /> Add Stock
              </CardTitle>
              <CardDescription>Add new or restock existing products</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Product Name</Label>
                  <Input id="product" value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g. Solar Panel 300W" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qty">Quantity</Label>
                  <Input id="qty" type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Min Stock Level</Label>
                  <Input id="minStock" type="number" min="0" value={minStock} onChange={e => setMinStock(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Supplier, batch number, etc." />
                </div>
                <Button type="submit" className="w-full" disabled={addStockMutation.isPending}>
                  {addStockMutation.isPending ? "Adding..." : "Add Stock"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" /> Current Inventory
              </CardTitle>
              <CardDescription>All products and their stock levels</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingInventory ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : !inventory?.length ? (
                <p className="text-muted-foreground text-center py-8">No inventory yet. Add your first product.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-right">Min Level</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.product_name}</TableCell>
                        <TableCell className="text-right">{item.current_stock}</TableCell>
                        <TableCell className="text-right">{item.min_stock_level}</TableCell>
                        <TableCell>
                          {item.current_stock <= 0 ? (
                            <Badge variant="destructive">Out of Stock</Badge>
                          ) : item.current_stock <= item.min_stock_level ? (
                            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Low</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">In Stock</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {stockEntries && stockEntries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Entries</CardTitle>
              <CardDescription>Latest additions to inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Qty Added</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockEntries.map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.product_name}</TableCell>
                      <TableCell className="text-right">+{entry.quantity}</TableCell>
                      <TableCell className="text-muted-foreground">{entry.notes || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(entry.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Stock;
