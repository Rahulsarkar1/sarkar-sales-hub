import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import SpecsManager from "@/components/admin/SpecsManager";

export default function ProductsManager() {
  const qc = useQueryClient();
  const { data: segments = [] } = useQuery({
    queryKey: ["segments"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("segments")
        .select("id,name,sort_order,visible")
        .eq("visible", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const [selected, setSelected] = useState<string>("");
  useEffect(() => {
    if (!selected && segments.length > 0) setSelected(segments[0].id);
  }, [segments, selected]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", selected],
    queryFn: async () => {
      if (!selected) return [];
      const { data, error } = await (supabase as any)
        .from("products")
        .select("id,name,image_url,price_mrp,discount_percent,sort_order,visible")
        .eq("segment_id", selected)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!selected,
  });

  const insertMut = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await (supabase as any).from("products").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products", selected] }),
  });

  const updateMut = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: any }) => {
      const { error } = await (supabase as any).from("products").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products", selected] }),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products", selected] }),
  });

  const [newProd, setNewProd] = useState({ name: "", image_url: "", price_mrp: 0, discount_percent: 0, sort_order: 0, visible: true });

  const segmentOptions = useMemo(() => segments.map((s:any) => ({ id: s.id, name: s.name })), [segments]);

  return (
    <div className="p-4 rounded-lg border glass-card">
      <h2 className="font-semibold mb-2">Products</h2>
      <p className="text-sm text-muted-foreground mb-4">Manage products per segment. Click Specs to edit specifications.</p>

      <div className="flex items-center gap-3 mb-4">
        <Label>Segment</Label>
        <select className="border rounded px-2 py-1" value={selected} onChange={(e)=>setSelected(e.target.value)}>
          {segmentOptions.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {selected && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-3">
            <Input placeholder="Name" value={newProd.name} onChange={(e)=>setNewProd({...newProd, name:e.target.value})} className="md:col-span-2" />
            <Input placeholder="Image URL" value={newProd.image_url} onChange={(e)=>setNewProd({...newProd, image_url:e.target.value})} className="md:col-span-2" />
            <Input type="number" placeholder="MRP" value={newProd.price_mrp} onChange={(e)=>setNewProd({...newProd, price_mrp:Number(e.target.value)})} />
            <Input type="number" placeholder="Discount %" value={newProd.discount_percent} onChange={(e)=>setNewProd({...newProd, discount_percent:Number(e.target.value)})} />
            <div className="flex items-center justify-between md:col-span-6">
              <div className="flex items-center gap-2">
                <Label>Sort</Label>
                <Input type="number" className="w-24" value={newProd.sort_order} onChange={(e)=>setNewProd({...newProd, sort_order:Number(e.target.value)})} />
                <div className="flex items-center gap-2 ml-2">
                  <Switch checked={newProd.visible} onCheckedChange={(v)=>setNewProd({...newProd, visible:v})} />
                  <span className="text-sm">Visible</span>
                </div>
              </div>
              <Button
                disabled={!newProd.name || insertMut.isPending}
                onClick={()=>insertMut.mutate({ ...newProd, segment_id: selected })}
              >Add Product</Button>
            </div>
          </div>

          <div className="space-y-3">
            {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
            {products.map((p:any) => (
              <ProductRow key={p.id} product={p} onSave={(patch)=>updateMut.mutate({ id: p.id, patch })} onDelete={()=>deleteMut.mutate(p.id)} />
            ))}
            {!isLoading && products.length===0 && (
              <p className="text-sm text-muted-foreground">No products yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ProductRow({ product, onSave, onDelete }:{ product:any; onSave:(patch:any)=>void; onDelete:()=>void; }) {
  const [name, setName] = useState(product.name);
  const [image, setImage] = useState(product.image_url || "");
  const [mrp, setMrp] = useState<number>(product.price_mrp || 0);
  const [disc, setDisc] = useState<number>(product.discount_percent || 0);
  const [sort, setSort] = useState<number>(product.sort_order || 0);
  const [visible, setVisible] = useState<boolean>(!!product.visible);
  const [showSpecs, setShowSpecs] = useState(false);

  return (
    <div className="border rounded p-2 space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
        <Input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} className="md:col-span-2" />
        <Input placeholder="Image URL" value={image} onChange={(e)=>setImage(e.target.value)} className="md:col-span-2" />
        <Input type="number" placeholder="MRP" value={mrp} onChange={(e)=>setMrp(Number(e.target.value))} />
        <Input type="number" placeholder="Discount %" value={disc} onChange={(e)=>setDisc(Number(e.target.value))} />
        <div className="flex items-center justify-between md:col-span-6">
          <div className="flex items-center gap-2">
            <Label>Sort</Label>
            <Input type="number" className="w-24" value={sort} onChange={(e)=>setSort(Number(e.target.value))} />
            <div className="flex items-center gap-2 ml-2">
              <Switch checked={visible} onCheckedChange={setVisible} />
              <span className="text-sm">Visible</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={()=>onSave({ name, image_url: image, price_mrp: mrp, discount_percent: disc, sort_order: sort, visible })}>Save</Button>
            <Button size="sm" onClick={()=>setShowSpecs((v)=>!v)} variant="secondary">{showSpecs? 'Hide Specs':'Specs'}</Button>
            <Button size="sm" variant="destructive" onClick={onDelete}>Delete</Button>
          </div>
        </div>
      </div>
      {showSpecs && <SpecsManager productId={product.id} />}
    </div>
  );
}
