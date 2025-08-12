import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SegmentsManager() {
  const qc = useQueryClient();
  const { data: segments = [], isLoading } = useQuery({
    queryKey: ["segments"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("segments")
        .select("id,key,name,sort_order,visible")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const insertMut = useMutation({
    mutationFn: async (payload: { key: string; name: string; sort_order: number; visible: boolean; }) => {
      const { error } = await (supabase as any).from("segments").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["segments"] }),
  });

  const updateMut = useMutation({
    mutationFn: async (payload: { id: string; name: string; sort_order: number; visible: boolean; }) => {
      const { id, ...patch } = payload;
      const { error } = await (supabase as any).from("segments").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["segments"] }),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("segments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["segments"] }),
  });

  const [newSeg, setNewSeg] = useState({ key: "", name: "", sort: 0, visible: true });

  return (
    <div className="p-4 rounded-lg border glass-card">
      <h2 className="font-semibold mb-2">Segments</h2>
      <p className="text-sm text-muted-foreground mb-4">Add/edit/delete site segments. Visible segments show on the homepage.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="grid gap-1">
          <Label htmlFor="seg-key">Key</Label>
          <Input id="seg-key" value={newSeg.key} onChange={(e)=>setNewSeg({...newSeg, key:e.target.value})} placeholder="ex: exide" />
        </div>
        <div className="grid gap-1 md:col-span-2">
          <Label htmlFor="seg-name">Name</Label>
          <Input id="seg-name" value={newSeg.name} onChange={(e)=>setNewSeg({...newSeg, name:e.target.value})} placeholder="Exide Home/Inverter Batteries" />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="seg-sort">Sort</Label>
          <Input id="seg-sort" type="number" value={newSeg.sort} onChange={(e)=>setNewSeg({...newSeg, sort:Number(e.target.value)})} />
        </div>
        <div className="flex items-end justify-between gap-2 md:col-span-4">
          <div className="flex items-center gap-2">
            <Switch checked={newSeg.visible} onCheckedChange={(v)=>setNewSeg({...newSeg, visible: v})} />
            <span className="text-sm">Visible</span>
          </div>
          <Button
            disabled={!newSeg.key || !newSeg.name || insertMut.isPending}
            onClick={()=>insertMut.mutate({ key: newSeg.key, name: newSeg.name, sort_order: newSeg.sort, visible: newSeg.visible })}
          >
            Add Segment
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {segments.map((s:any) => (
          <SegmentRow key={s.id} seg={s} onSave={(patch)=>updateMut.mutate({ id: s.id, ...patch })} onDelete={()=>deleteMut.mutate(s.id)} />
        ))}
        {!isLoading && segments.length===0 && (
          <p className="text-sm text-muted-foreground">No segments yet.</p>
        )}
      </div>
    </div>
  );
}

function SegmentRow({ seg, onSave, onDelete }:{ seg:any; onSave:(p:{name:string;sort_order:number;visible:boolean})=>void; onDelete:()=>void; }) {
  const [name, setName] = useState(seg.name);
  const [sort, setSort] = useState<number>(seg.sort_order ?? 0);
  const [visible, setVisible] = useState<boolean>(!!seg.visible);
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-2 border rounded p-2">
      <div className="md:col-span-2 grid gap-1">
        <Label>Key</Label>
        <Input value={seg.key} disabled />
      </div>
      <div className="md:col-span-2 grid gap-1">
        <Label>Name</Label>
        <Input value={name} onChange={(e)=>setName(e.target.value)} />
      </div>
      <div className="grid gap-1">
        <Label>Sort</Label>
        <Input type="number" value={sort} onChange={(e)=>setSort(Number(e.target.value))} />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Switch checked={visible} onCheckedChange={setVisible} />
          <span className="text-sm">Visible</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={()=>onSave({ name, sort_order: sort, visible })}>Save</Button>
          <Button size="sm" variant="destructive" onClick={onDelete}>Delete</Button>
        </div>
      </div>
    </div>
  );
}
