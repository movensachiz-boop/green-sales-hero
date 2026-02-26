import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Truck, MapPin, AlertTriangle, Package, Search } from "lucide-react";

const CITIES = ["Harare", "Bulawayo", "Mutare", "Gweru", "Kwekwe", "Masvingo", "Chinhoyi", "Marondera", "Kadoma", "Chegutu"];

type CityInventory = {
  id: string;
  city: string;
  product_name: string;
  current_stock: number;
  min_stock_level: number;
  updated_at: string;
};

type Inventory = {
  id: string;
  product_name: string;
  current_stock: number;
};

const CityStock = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [distributeQty, setDistributeQty] = useState("");
  const [filterCity, setFilterCity] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cityInventory, isLoading } = useQuery({
    queryKey: ["city-inventory"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("city_inventory").select("*").order("city").order("product_name");
      if (error) throw error;
      return data as CityInventory[];
    },
  });

  const { data: mainInventory } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("inventory").select("*").order("product_name");
      if (error) throw error;
      return data as Inventory[];
    },
  });

  const distributeMutation = useMutation({
    mutationFn: async () => {
      const qty = parseInt(distributeQty);
      if (!selectedCity || !selectedProduct || !qty) throw new Error("Fill all fields");

      // Check main warehouse stock
      const mainItem = mainInventory?.find(i => i.product_name === selectedProduct);
      if (!mainItem || mainItem.current_stock < qty) {
        throw new Error(`Not enough stock in warehouse. Available: ${mainItem?.current_stock || 0}`);
      }

      // Deduct from main warehouse
      const { error: deductError } = await (supabase as any)
        .from("inventory")
        .update({ current_stock: mainItem.current_stock - qty })
        .eq("id", mainItem.id);
      if (deductError) throw deductError;

      // Upsert city inventory
      const existing = cityInventory?.find(
        ci => ci.city === selectedCity && ci.product_name === selectedProduct
      );

      if (existing) {
        const { error } = await (supabase as any)
          .from("city_inventory")
          .update({ current_stock: existing.current_stock + qty })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from("city_inventory")
          .insert({ city: selectedCity, product_name: selectedProduct, current_stock: qty });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["city-inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setDistributeQty("");
      toast({ title: "Stock Distributed", description: `${distributeQty} units of ${selectedProduct} sent to ${selectedCity}` });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleDistribute = (e: React.FormEvent) => {
    e.preventDefault();
    distributeMutation.mutate();
  };

  // Filter and search
  const filteredInventory = cityInventory?.filter(ci => {
    const cityMatch = filterCity === "all" || ci.city === filterCity;
    const searchMatch = !searchTerm || ci.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    return cityMatch && searchMatch;
  }) || [];

  // Identify missing stock per city
  const allProducts = mainInventory?.map(i => i.product_name) || [];
  const missingStockByCity = CITIES.map(city => {
    const cityItems = cityInventory?.filter(ci => ci.city === city) || [];
    const cityProductNames = cityItems.map(ci => ci.product_name);
    const missing = allProducts.filter(p => !cityProductNames.includes(p));
    const lowStock = cityItems.filter(ci => ci.current_stock <= ci.min_stock_level && ci.current_stock > 0);
    const outOfStock = cityItems.filter(ci => ci.current_stock <= 0);
    return { city, missing: missing.length, lowStock: lowStock.length, outOfStock: outOfStock.length, total: cityItems.length };
  }).filter(c => c.missing > 0 || c.lowStock > 0 || c.outOfStock > 0);

  // City summary stats
  const citySummary = CITIES.map(city => {
    const items = cityInventory?.filter(ci => ci.city === city) || [];
    const totalStock = items.reduce((sum, i) => sum + i.current_stock, 0);
    const productCount = items.length;
    const lowItems = items.filter(i => i.current_stock <= i.min_stock_level).length;
    return { city, totalStock, productCount, lowItems };
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">City Stock Distribution</h1>
          <p className="text-muted-foreground mt-1">Distribute products to cities and monitor stock levels</p>
        </div>

        {/* Missing Stock Alerts */}
        {missingStockByCity.length > 0 && (
          <Card className="border-destructive/30 bg-destructive/5 rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-destructive font-display">
                <AlertTriangle className="h-5 w-5" /> Cities Needing Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {missingStockByCity.map(c => (
                  <div key={c.city} className="flex items-center justify-between p-3 rounded-xl bg-background/80 border border-border/60">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-destructive" />
                      <span className="font-medium text-foreground">{c.city}</span>
                    </div>
                    <div className="flex gap-2">
                      {c.missing > 0 && <Badge variant="destructive" className="rounded-lg text-xs">{c.missing} missing</Badge>}
                      {c.lowStock > 0 && <Badge className="bg-warning/10 text-warning border-warning/20 rounded-lg text-xs">{c.lowStock} low</Badge>}
                      {c.outOfStock > 0 && <Badge variant="destructive" className="rounded-lg text-xs">{c.outOfStock} out</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* City Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {citySummary.slice(0, 5).map(city => (
            <Card key={city.city} className="rounded-2xl shadow-sm border-border/60">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-display font-bold text-foreground">{city.city}</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Products</span>
                    <span className="font-semibold">{city.productCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Units</span>
                    <span className="font-display font-semibold">{city.totalStock}</span>
                  </div>
                  {city.lowItems > 0 && (
                    <div className="flex justify-between">
                      <span className="text-destructive">Low Stock</span>
                      <Badge variant="destructive" className="rounded-lg text-xs h-5">{city.lowItems}</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="distribute" className="space-y-6">
          <TabsList className="rounded-xl bg-muted/50 p-1">
            <TabsTrigger value="distribute" className="rounded-lg">Distribute Stock</TabsTrigger>
            <TabsTrigger value="inventory" className="rounded-lg">City Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="distribute">
            <Card className="rounded-2xl shadow-sm border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Truck className="h-5 w-5" />
                  </div>
                  Distribute to City
                </CardTitle>
                <CardDescription>Send products from main warehouse to a city branch</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDistribute} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {CITIES.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Product</Label>
                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {mainInventory?.map(item => (
                          <SelectItem key={item.id} value={item.product_name}>
                            {item.product_name} ({item.current_stock} avail.)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={distributeQty}
                      onChange={e => setDistributeQty(e.target.value)}
                      placeholder="0"
                      required
                      className="rounded-xl h-11"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" className="w-full rounded-xl h-11 font-semibold" disabled={distributeMutation.isPending}>
                      {distributeMutation.isPending ? "Sending..." : "Distribute"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card className="rounded-2xl shadow-sm border-border/60">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 font-display">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Package className="h-5 w-5" />
                      </div>
                      City Inventory
                    </CardTitle>
                    <CardDescription className="mt-1">View stock levels across all cities</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search product..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-9 rounded-xl h-10 w-48"
                      />
                    </div>
                    <Select value={filterCity} onValueChange={setFilterCity}>
                      <SelectTrigger className="rounded-xl h-10 w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {CITIES.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-muted-foreground text-center py-8">Loading...</p>
                ) : !filteredInventory.length ? (
                  <p className="text-muted-foreground text-center py-8">No stock distributed to cities yet.</p>
                ) : (
                  <div className="rounded-xl border border-border/60 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableHead>City</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Stock</TableHead>
                          <TableHead className="text-right">Min Level</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInventory.map(item => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-primary" />
                                <span className="font-medium">{item.city}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{item.product_name}</TableCell>
                            <TableCell className="text-right font-display font-semibold">{item.current_stock}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{item.min_stock_level}</TableCell>
                            <TableCell>
                              {item.current_stock <= 0 ? (
                                <Badge variant="destructive" className="rounded-lg">Out of Stock</Badge>
                              ) : item.current_stock <= item.min_stock_level ? (
                                <Badge className="bg-warning/10 text-warning border-warning/20 rounded-lg">Low</Badge>
                              ) : (
                                <Badge className="bg-success/10 text-success border-success/20 rounded-lg">In Stock</Badge>
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CityStock;
