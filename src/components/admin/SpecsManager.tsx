import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SpecsManager({ productId }:{ productId: string }) {
  const qc = useQueryClient();
  const { data: specs = [], isLoading } = useQuery({
    queryKey: ["product_specs", productId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("product_specs")
        .select("id,label,value,sort_order")
        .eq("product_id", productId)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const insertMut = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await (supabase as any).from("product_specs").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product_specs", productId] }),
  });

  const updateMut = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: any }) => {
      const { error } = await (supabase as any).from("product_specs").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product_specs", productId] }),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("product_specs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product_specs", productId] }),
  });

  const [newSpec, setNewSpec] = useState({ label: "", value: "", sort_order: 0 });

  return (
    <div className="rounded border p-2 bg-muted/30">
      <h4 className="font-medium mb-2">Specifications</h4>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-2">
        <Input placeholder="Label" value={newSpec.label} onChange={(e)=>setNewSpec({...newSpec, label:e.target.value})} className="md:col-span-2" />
        <Input placeholder="Value" value={newSpec.value} onChange={(e)=>setNewSpec({...newSpec, value:e.target.value})} className="md:col-span-3" />
        <Input type="number" placeholder="Sort" value={newSpec.sort_order} onChange={(e)=>setNewSpec({...newSpec, sort_order:Number(e.target.value)})} />
        <div className="md:col-span-6 flex justify-end">
          <Button
            disabled={!newSpec.label || !newSpec.value || insertMut.isPending}
            onClick={()=>insertMut.mutate({ product_id: productId, ...newSpec })}
          >Add Spec</Button>
        </div>
      </div>

      <div className="space-y-2">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {specs.map((s:any) => (
          <SpecRow key={s.id} spec={s} onSave={(patch)=>updateMut.mutate({ id: s.id, patch })} onDelete={()=>deleteMut.mutate(s.id)} />
        ))}
        {!isLoading && specs.length===0 && <p className="text-sm text-muted-foreground">No specs yet.</p>}
      </div>
    </div>
  );
}

function SpecRow({ spec, onSave, onDelete }:{ spec:any; onSave:(patch:any)=>void; onDelete:()=>void; }) {
  const [label, setLabel] = useState(spec.label);
  const [value, setValue] = useState(spec.value);
  const [sort, setSort] = useState<number>(spec.sort_order || 0);
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-2 border rounded p-2">
      <div className="md:col-span-2 grid gap-1">
        <Label>Label</Label>
        <Input value={label} onChange={(e)=>setLabel(e.target.value)} />
      </div>
      <div className="md:col-span-3 grid gap-1">
        <Label>Value</Label>
        <Input value={value} onChange={(e)=>setValue(e.target.value)} />
      </div>
      <div className="grid gap-1">
        <Label>Sort</Label>
        <Input type="number" value={sort} onChange={(e)=>setSort(Number(e.target.value))} />
      </div>
      <div className="md:col-span-6 flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={()=>onSave({ label, value, sort_order: sort })}>Save</Button>
        <Button size="sm" variant="destructive" onClick={onDelete}>Delete</Button>
      </div>
    </div>
  );
}
