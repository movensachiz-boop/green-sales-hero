import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Minus } from "lucide-react";
import { ImageCapture } from "@/components/ImageCapture";

type Inventory = {
  id: string;
  product_name: string;
  current_stock: number;
  min_stock_level: number;
};

export function RemoveStockForm({ inventory }: { inventory?: Inventory[] }) {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadImage = async (file: File) => {
    const ext = file.name.split(".").pop();
    const path = `removals/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("stock-images").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("stock-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const removeStockMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const qty = parseInt(quantity);

      const existing = inventory?.find(i => i.product_name.toLowerCase() === productName.toLowerCase());
      if (!existing) throw new Error("Product not found in inventory");
      if (existing.current_stock < qty) throw new Error("Not enough stock to remove");

      let imageUrl: string | null = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const { error } = await (supabase as any).from("inventory").update({ current_stock: existing.current_stock - qty }).eq("id", existing.id);
      if (error) throw error;

      const { error: removalError } = await (supabase as any).from("stock_removals").insert({
        product_name: productName,
        quantity: qty,
        reason: reason || null,
        image_url: imageUrl,
        removed_by: user.id,
      });
      if (removalError) throw removalError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["stock-removals"] });
      setProductName(""); setQuantity(""); setReason(""); setImageFile(null);
      toast({ title: "Stock removed", description: "Inventory updated with stock out record." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !quantity) return;
    removeStockMutation.mutate();
  };

  return (
    <Card className="rounded-2xl shadow-sm border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
            <Minus className="h-5 w-5" />
          </div>
          Remove Stock
        </CardTitle>
        <CardDescription>Record stock removals with photo evidence</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rm-product">Product Name</Label>
            <Input id="rm-product" value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g. Solar Panel 300W" required className="rounded-xl h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rm-qty">Quantity Removed</Label>
            <Input id="rm-qty" type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" required className="rounded-xl h-11" />
          </div>
          <div className="space-y-2">
            <Label>Photo of Stock Out List</Label>
            <ImageCapture
              onImageSelected={setImageFile}
              onClear={() => setImageFile(null)}
              label="Capture Stock Out"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rm-reason">Reason (optional)</Label>
            <Textarea id="rm-reason" value={reason} onChange={e => setReason(e.target.value)} placeholder="Sold, damaged, distributed, etc." className="rounded-xl" />
          </div>
          <Button type="submit" variant="destructive" className="w-full rounded-xl h-11 font-semibold" disabled={removeStockMutation.isPending}>
            {removeStockMutation.isPending ? "Removing..." : "Remove Stock"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
