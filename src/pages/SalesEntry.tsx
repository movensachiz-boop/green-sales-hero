import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const SalesEntry = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    amount: "",
    city: "",
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Sale Recorded",
      description: "Your sale has been successfully recorded.",
    });
    setFormData({
      product: "",
      quantity: "",
      amount: "",
      city: "",
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Record New Sale</h1>
          <p className="text-muted-foreground">Enter sale details to track performance</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sale Information</CardTitle>
            <CardDescription>Fill in all fields to record a new sale</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product Name</Label>
                <Input
                  id="product"
                  placeholder="e.g., Herbal Capsules A"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="harare">Harare</SelectItem>
                    <SelectItem value="bulawayo">Bulawayo</SelectItem>
                    <SelectItem value="mutare">Mutare</SelectItem>
                    <SelectItem value="gweru">Gweru</SelectItem>
                    <SelectItem value="kwekwe">Kwekwe</SelectItem>
                    <SelectItem value="masvingo">Masvingo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Record Sale
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalesEntry;
