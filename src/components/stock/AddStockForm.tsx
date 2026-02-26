import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { ImageCapture } from "@/components/ImageCapture";

type Inventory = {
  id: string;
  product_name: string;
  current_stock: number;
  min_stock_level: number;
};

export function AddStockForm({ inventory }: { inventory?: Inventory[] }) {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minStock, setMinStock] = useState("10");
  const [notes, setNotes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadImage = async (file: File, prefix: string) => {
    const ext = file.name.split(".").pop();
    const path = `${prefix}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("stock-images").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("stock-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const addStockMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const qty = parseInt(quantity);

      let imageUrl: string | null = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "entries");
      }

      const existing = inventory?.find(i => i.product_name.toLowerCase() === productName.toLowerCase());
      if (existing) {
        const { error } = await (supabase as any).from("inventory").update({ current_stock: existing.current_stock + qty, min_stock_level: parseInt(minStock) }).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from("inventory").insert({ product_name: productName, current_stock: qty, min_stock_level: parseInt(minStock) });
        if (error) throw error;
      }
      const { error: entryError } = await (supabase as any).from("stock_entries").insert({ product_name: productName, quantity: qty, notes: notes || null, added_by: user.id, image_url: imageUrl });
      if (entryError) throw entryError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["stock-entries"] });
      setProductName(""); setQuantity(""); setMinStock("10"); setNotes(""); setImageFile(null);
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

  return (
    <Card className="rounded-2xl shadow-sm border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Plus className="h-5 w-5" />
          </div>
          Add Stock
        </CardTitle>
        <CardDescription>Add new or restock existing products</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Product Name</Label>
            <Input id="product" value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g. Solar Panel 300W" required className="rounded-xl h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qty">Quantity</Label>
            <Input id="qty" type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" required className="rounded-xl h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minStock">Min Stock Level</Label>
            <Input id="minStock" type="number" min="0" value={minStock} onChange={e => setMinStock(e.target.value)} className="rounded-xl h-11" />
          </div>
          <div className="space-y-2">
            <Label>Photo (optional)</Label>
            <ImageCapture
              onImageSelected={setImageFile}
              onClear={() => setImageFile(null)}
              label="Take Photo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Supplier, batch number, etc." className="rounded-xl" />
          </div>
          <Button type="submit" className="w-full rounded-xl h-11 font-semibold" disabled={addStockMutation.isPending}>
            {addStockMutation.isPending ? "Adding..." : "Add Stock"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
