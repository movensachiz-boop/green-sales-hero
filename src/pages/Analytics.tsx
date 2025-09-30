import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp } from "lucide-react";
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

const Analytics = () => {
  const { data: salesData } = useQuery({
    queryKey: ["sales-analytics"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("sales")
        .select("*");
      
      if (error) throw error;
      return data as Sale[];
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
            <CardTitle>City Performance Comparison</CardTitle>
            <CardDescription>Total sales by city this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={cityPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="city" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem"
                  }} 
                />
                <Legend />
                <Bar 
                  dataKey="sales" 
                  fill="hsl(var(--primary))" 
                  name="Total Sales ($)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
