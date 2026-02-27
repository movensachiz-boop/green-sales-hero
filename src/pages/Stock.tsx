import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, AlertTriangle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateReport } from "@/lib/generateReport";
import { AddStockForm } from "@/components/stock/AddStockForm";
import { RemoveStockForm } from "@/components/stock/RemoveStockForm";

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
  image_url: string | null;
  added_by: string;
  created_at: string;
};

type StockRemoval = {
  id: string;
  product_name: string;
  quantity: number;
  reason: string | null;
  image_url: string | null;
  removed_by: string;
  created_at: string;
};

const Stock = () => {
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

  const { data: stockRemovals } = useQuery({
    queryKey: ["stock-removals"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("stock_removals").select("*").order("created_at", { ascending: false }).limit(20);
      if (error) throw error;
      return data as StockRemoval[];
    },
  });

  const lowStockItems = inventory?.filter(i => i.current_stock <= i.min_stock_level) || [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Stock Management</h1>
            <p className="text-muted-foreground mt-1">Track and manage your inventory</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              const tables = [];
              if (inventory?.length) {
                tables.push({
                  heading: "Current Inventory",
                  columns: ["Product", "Current Stock", "Min Level", "Status"],
                  rows: inventory.map(i => [
                    i.product_name,
                    i.current_stock,
                    i.min_stock_level,
                    i.current_stock <= 0 ? "Out of Stock" : i.current_stock <= i.min_stock_level ? "Low" : "In Stock",
                  ]),
                });
              }
              if (stockEntries?.length) {
                tables.push({
                  heading: "Recent Stock Entries",
                  columns: ["Product", "Quantity", "Date"],
                  rows: stockEntries.map(e => [e.product_name, `+${e.quantity}`, new Date(e.created_at).toLocaleDateString()]),
                });
              }
              if (stockRemovals?.length) {
                tables.push({
                  heading: "Recent Stock Removals",
                  columns: ["Product", "Quantity", "Reason", "Date"],
                  rows: stockRemovals.map(r => [r.product_name, `-${r.quantity}`, r.reason || "—", new Date(r.created_at).toLocaleDateString()]),
                });
              }
              generateReport({
                title: "Stock Report",
                subtitle: `Generated on ${new Date().toLocaleDateString()} — Greenworld Inventory Overview`,
                tables,
              });
            }}
          >
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>

        {lowStockItems.length > 0 && (
          <Card className="border-destructive/30 bg-destructive/5 rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-destructive font-display">
                <AlertTriangle className="h-5 w-5" /> Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lowStockItems.map(item => (
                  <Badge key={item.id} variant="destructive" className="rounded-lg">
                    {item.product_name}: {item.current_stock} left
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <Tabs defaultValue="add" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-xl">
                <TabsTrigger value="add" className="rounded-lg">Add Stock</TabsTrigger>
                <TabsTrigger value="remove" className="rounded-lg">Remove Stock</TabsTrigger>
              </TabsList>
              <TabsContent value="add">
                <AddStockForm inventory={inventory} />
              </TabsContent>
              <TabsContent value="remove">
                <RemoveStockForm inventory={inventory} />
              </TabsContent>
            </Tabs>
          </div>

          <Card className="lg:col-span-2 rounded-2xl shadow-sm border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Package className="h-5 w-5" />
                </div>
                Current Inventory
              </CardTitle>
              <CardDescription>All products and their stock levels</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingInventory ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : !inventory?.length ? (
                <p className="text-muted-foreground text-center py-8">No inventory yet. Add your first product.</p>
              ) : (
                <div className="rounded-xl border border-border/60 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
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
                          <TableCell className="text-right font-display font-semibold">{item.current_stock}</TableCell>
                          <TableCell className="text-right text-muted-foreground">{item.min_stock_level}</TableCell>
                          <TableCell>
                            {item.current_stock <= 0 ? (
                              <Badge variant="destructive" className="rounded-lg">Out of Stock</Badge>
                            ) : item.current_stock <= item.min_stock_level ? (
                              <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20 rounded-lg">Low</Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-success/10 text-success border-success/20 rounded-lg">In Stock</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent entries & removals */}
        <div className="grid gap-6 lg:grid-cols-2">
          {stockEntries && stockEntries.length > 0 && (
            <Card className="rounded-2xl shadow-sm border-border/60">
              <CardHeader>
                <CardTitle className="font-display">Recent Stock Entries</CardTitle>
                <CardDescription>Latest additions to inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-border/60 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead>Photo</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stockEntries.map(entry => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.product_name}</TableCell>
                          <TableCell className="text-right font-display font-semibold text-success">+{entry.quantity}</TableCell>
                          <TableCell>
                            {entry.image_url ? (
                              <a href={entry.image_url} target="_blank" rel="noopener noreferrer">
                                <img src={entry.image_url} alt="Entry" className="h-8 w-8 rounded object-cover" />
                              </a>
                            ) : "—"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{new Date(entry.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {stockRemovals && stockRemovals.length > 0 && (
            <Card className="rounded-2xl shadow-sm border-border/60">
              <CardHeader>
                <CardTitle className="font-display">Recent Stock Removals</CardTitle>
                <CardDescription>Latest stock out records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-border/60 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead>Photo</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stockRemovals.map(removal => (
                        <TableRow key={removal.id}>
                          <TableCell className="font-medium">{removal.product_name}</TableCell>
                          <TableCell className="text-right font-display font-semibold text-destructive">-{removal.quantity}</TableCell>
                          <TableCell>
                            {removal.image_url ? (
                              <a href={removal.image_url} target="_blank" rel="noopener noreferrer">
                                <img src={removal.image_url} alt="Removal" className="h-8 w-8 rounded object-cover" />
                              </a>
                            ) : "—"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{new Date(removal.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Stock;
