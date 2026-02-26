import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, TrendingUp, TrendingDown, Package } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Sale = {
  id: string;
  agent_id: string;
  product_name: string;
  quantity: number;
  amount: number;
  sale_date: string;
  city: string;
  created_at: string;
};

type Inventory = {
  id: string;
  product_name: string;
  current_stock: number;
  min_stock_level: number;
};

type StockEntry = {
  id: string;
  product_name: string;
  quantity: number;
  created_at: string;
};

const Analytics = () => {
  const { data: salesData } = useQuery({
    queryKey: ["sales-analytics"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("sales").select("*");
      if (error) throw error;
      return data as Sale[];
    },
  });

  const { data: inventory } = useQuery({
    queryKey: ["inventory-analytics"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("inventory").select("*");
      if (error) throw error;
      return data as Inventory[];
    },
  });

  const { data: stockEntries } = useQuery({
    queryKey: ["stock-entries-analytics"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("stock_entries").select("*");
      if (error) throw error;
      return data as StockEntry[];
    },
  });

  // Calculate best selling product
  const bestSellingProduct = salesData?.reduce((acc, sale) => {
    const existing = acc.find(p => p.product === sale.product_name);
    if (existing) {
      existing.quantity += sale.quantity;
      existing.revenue += Number(sale.amount);
    } else {
      acc.push({
        product: sale.product_name,
        quantity: sale.quantity,
        revenue: Number(sale.amount),
      });
    }
    return acc;
  }, [] as Array<{ product: string; quantity: number; revenue: number }>)
    .sort((a, b) => b.quantity - a.quantity)[0];

  const salesTrend = [
    { month: "Jan", sales: 12000, target: 15000 },
    { month: "Feb", sales: 15500, target: 15000 },
    { month: "Mar", sales: 18200, target: 16000 },
    { month: "Apr", sales: 21000, target: 18000 },
    { month: "May", sales: 19800, target: 20000 },
    { month: "Jun", sales: 24500, target: 22000 },
  ];

  const cityPerformance = [
    { city: "Harare", sales: 48200 },
    { city: "Bulawayo", sales: 38500 },
    { city: "Mutare", sales: 32100 },
    { city: "Gweru", sales: 28400 },
    { city: "Kwekwe", sales: 24800 },
    { city: "Masvingo", sales: 21200 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sales Analytics</h1>
            <p className="text-muted-foreground">Comprehensive performance insights</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {bestSellingProduct && (
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Best Selling Product</CardTitle>
                  <CardDescription>Top performer by quantity sold</CardDescription>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-3xl font-bold text-foreground">{bestSellingProduct.product}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Units Sold</p>
                    <p className="text-2xl font-semibold text-foreground">{bestSellingProduct.quantity}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-semibold text-foreground">${bestSellingProduct.revenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Sales Trend Analysis</CardTitle>
            <CardDescription>Monthly sales performance vs. targets</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem"
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Actual Sales ($)"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Target ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" /> Stock Movement Analysis
            </CardTitle>
            <CardDescription>Products ranked by sales velocity — what's moving and what's not</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              // Build movement data: total sold per product vs current stock
              const productMovement = (inventory || []).map(item => {
                const totalSold = (salesData || [])
                  .filter(s => s.product_name.toLowerCase() === item.product_name.toLowerCase())
                  .reduce((sum, s) => sum + s.quantity, 0);
                const totalStocked = (stockEntries || [])
                  .filter(e => e.product_name.toLowerCase() === item.product_name.toLowerCase())
                  .reduce((sum, e) => sum + e.quantity, 0);
                const turnoverRate = totalStocked > 0 ? (totalSold / totalStocked) * 100 : 0;
                return {
                  product: item.product_name,
                  totalSold,
                  currentStock: item.current_stock,
                  totalStocked,
                  turnoverRate,
                };
              }).sort((a, b) => b.turnoverRate - a.turnoverRate);

              if (!productMovement.length) {
                return <p className="text-muted-foreground text-center py-8">Add inventory and make sales to see movement analytics.</p>;
              }

              const fastMoving = productMovement.filter(p => p.turnoverRate >= 50);
              const slowMoving = productMovement.filter(p => p.turnoverRate < 50);

              return (
                <div className="space-y-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={productMovement}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="product" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem" }} />
                      <Legend />
                      <Bar dataKey="totalSold" fill="hsl(var(--primary))" name="Units Sold" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="currentStock" fill="hsl(var(--muted-foreground))" name="Current Stock" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2 text-foreground">
                        <TrendingUp className="h-4 w-4 text-primary" /> Fast Moving
                      </h4>
                      {fastMoving.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No fast-moving products yet</p>
                      ) : (
                        fastMoving.map(p => (
                          <div key={p.product} className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
                            <span className="font-medium text-foreground">{p.product}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">{p.totalSold} sold</span>
                              <Badge variant="secondary" className="bg-primary/10 text-primary">{p.turnoverRate.toFixed(0)}%</Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2 text-foreground">
                        <TrendingDown className="h-4 w-4 text-destructive" /> Slow Moving
                      </h4>
                      {slowMoving.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No slow-moving products</p>
                      ) : (
                        slowMoving.map(p => (
                          <div key={p.product} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                            <span className="font-medium text-foreground">{p.product}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">{p.totalSold} sold</span>
                              <Badge variant="destructive">{p.turnoverRate.toFixed(0)}%</Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
