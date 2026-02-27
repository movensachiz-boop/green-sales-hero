import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, AlertTriangle, TrendingUp, ArrowRight, Download } from "lucide-react";
import { generateReport } from "@/lib/generateReport";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CITIES = ["Harare", "Bulawayo", "Mutare", "Gweru", "Kwekwe", "Masvingo", "Chinhoyi", "Marondera", "Kadoma", "Chegutu"];

type CityInventory = {
  id: string;
  city: string;
  product_name: string;
  current_stock: number;
  min_stock_level: number;
};

type Sale = {
  city: string;
  amount: number;
  quantity: number;
};

const Cities = () => {
  const navigate = useNavigate();

  const { data: cityInventory } = useQuery({
    queryKey: ["city-inventory"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("city_inventory").select("*");
      if (error) throw error;
      return data as CityInventory[];
    },
  });

  const { data: salesData } = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("sales").select("city, amount, quantity");
      if (error) throw error;
      return data as Sale[];
    },
  });

  const { data: mainInventory } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("inventory").select("product_name");
      if (error) throw error;
      return data as { product_name: string }[];
    },
  });

  const allProducts = mainInventory?.map(i => i.product_name) || [];

  const cityStats = CITIES.map(city => {
    const items = cityInventory?.filter(ci => ci.city === city) || [];
    const totalStock = items.reduce((sum, i) => sum + i.current_stock, 0);
    const productCount = items.length;
    const lowStock = items.filter(i => i.current_stock > 0 && i.current_stock <= i.min_stock_level);
    const outOfStock = items.filter(i => i.current_stock <= 0);
    const missingProducts = allProducts.filter(p => !items.find(i => i.product_name === p));
    const citySales = salesData?.filter(s => s.city.toLowerCase() === city.toLowerCase()) || [];
    const totalSales = citySales.reduce((sum, s) => sum + Number(s.amount), 0);

    return { city, totalStock, productCount, lowStock, outOfStock, missingProducts, totalSales };
  });

  // Sort: cities with most issues first
  const sortedCities = [...cityStats].sort((a, b) =>
    (b.missingProducts.length + b.outOfStock.length + b.lowStock.length) -
    (a.missingProducts.length + a.outOfStock.length + a.lowStock.length)
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">City Performance</h1>
            <p className="text-muted-foreground mt-1">Stock levels & sales across Zimbabwe</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                generateReport({
                  title: "City Performance Report",
                  subtitle: `Stock & sales across Zimbabwe — ${new Date().toLocaleDateString()}`,
                  tables: [{
                    columns: ["City", "Products", "Total Stock", "Sales ($)", "Missing", "Low Stock", "Status"],
                    rows: sortedCities.map(c => [
                      c.city,
                      `${c.productCount}/${allProducts.length}`,
                      c.totalStock,
                      c.totalSales.toFixed(0),
                      c.missingProducts.length,
                      c.lowStock.length,
                      (c.missingProducts.length + c.outOfStock.length + c.lowStock.length) === 0 ? "OK" : "Needs Stock",
                    ]),
                  }],
                });
              }}
            >
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
            <Button onClick={() => navigate("/dashboard/city-stock")} className="rounded-xl font-semibold gap-2">
              <Package className="h-4 w-4" /> Distribute Stock <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Overview cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {sortedCities.slice(0, 5).map(city => {
            const issues = city.missingProducts.length + city.outOfStock.length + city.lowStock.length;
            return (
              <Card key={city.city} className={`rounded-2xl shadow-sm border-border/60 ${issues > 0 ? "border-destructive/30" : ""}`}>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-display font-bold text-foreground">{city.city}</span>
                    </div>
                    {issues > 0 && <AlertTriangle className="h-4 w-4 text-destructive" />}
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Products</span>
                      <span className="font-semibold">{city.productCount}/{allProducts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Units</span>
                      <span className="font-display font-semibold">{city.totalStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sales</span>
                      <span className="font-semibold text-success">${city.totalSales.toFixed(0)}</span>
                    </div>
                    {city.missingProducts.length > 0 && (
                      <Badge variant="destructive" className="rounded-lg text-xs mt-1">
                        {city.missingProducts.length} products missing
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed city table */}
        <Card className="rounded-2xl shadow-sm border-border/60">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              All Cities Report
            </CardTitle>
            <CardDescription>Complete overview of stock distribution and sales per city</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-border/60 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead>City</TableHead>
                    <TableHead className="text-right">Products</TableHead>
                    <TableHead className="text-right">Total Stock</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                    <TableHead className="text-right">Missing</TableHead>
                    <TableHead className="text-right">Low Stock</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCities.map(city => {
                    const issues = city.missingProducts.length + city.outOfStock.length + city.lowStock.length;
                    return (
                      <TableRow key={city.city}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            <span className="font-medium">{city.city}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-display font-semibold">{city.productCount}/{allProducts.length}</TableCell>
                        <TableCell className="text-right font-display font-semibold">{city.totalStock}</TableCell>
                        <TableCell className="text-right font-semibold text-success">${city.totalSales.toFixed(0)}</TableCell>
                        <TableCell className="text-right">
                          {city.missingProducts.length > 0 ? (
                            <Badge variant="destructive" className="rounded-lg">{city.missingProducts.length}</Badge>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {city.lowStock.length > 0 ? (
                            <Badge className="bg-warning/10 text-warning border-warning/20 rounded-lg">{city.lowStock.length}</Badge>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {issues === 0 ? (
                            <Badge className="bg-success/10 text-success border-success/20 rounded-lg">OK</Badge>
                          ) : (
                            <Badge variant="destructive" className="rounded-lg">Needs Stock</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Cities;
