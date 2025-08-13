import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type Review = {
  id: string;
  name: string;
  text: string;
  rating: number;
  sort_order: number;
  visible: boolean;
};

export default function ReviewsManager() {
  const [newReview, setNewReview] = useState({
    name: "",
    text: "",
    rating: 5,
    sort_order: 0,
    visible: true,
  });

  const queryClient = useQueryClient();

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Review[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (review: Omit<Review, "id">) => {
      const { error } = await supabase.from("reviews").insert([review]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      setNewReview({ name: "", text: "", rating: 5, sort_order: 0, visible: true });
      toast.success("Review added successfully!");
    },
    onError: () => toast.error("Failed to add review"),
  });

  const updateMutation = useMutation({
    mutationFn: async (review: Review) => {
      const { error } = await supabase
        .from("reviews")
        .update(review)
        .eq("id", review.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review updated successfully!");
    },
    onError: () => toast.error("Failed to update review"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review deleted successfully!");
    },
    onError: () => toast.error("Failed to delete review"),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Review Form */}
        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="font-semibold">Add New Review</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-name">Customer Name</Label>
              <Input
                id="new-name"
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                placeholder="Customer name"
              />
            </div>
            <div>
              <Label htmlFor="new-rating">Rating</Label>
              <Select
                value={newReview.rating.toString()}
                onValueChange={(value) => setNewReview({ ...newReview, rating: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ (5 stars)</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ (4 stars)</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ (3 stars)</SelectItem>
                  <SelectItem value="2">⭐⭐ (2 stars)</SelectItem>
                  <SelectItem value="1">⭐ (1 star)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="new-text">Review Text</Label>
            <Textarea
              id="new-text"
              value={newReview.text}
              onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
              placeholder="Customer review..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-sort">Sort Order</Label>
              <Input
                id="new-sort"
                type="number"
                value={newReview.sort_order}
                onChange={(e) => setNewReview({ ...newReview, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={newReview.visible}
                onCheckedChange={(checked) => setNewReview({ ...newReview, visible: checked })}
              />
              <Label>Visible</Label>
            </div>
          </div>
          <Button
            onClick={() => addMutation.mutate(newReview)}
            disabled={!newReview.name || !newReview.text}
          >
            Add Review
          </Button>
        </div>

        {/* Existing Reviews */}
        <div className="space-y-4">
          <h3 className="font-semibold">Existing Reviews</h3>
          {reviews.map((review) => (
            <ReviewRow
              key={review.id}
              review={review}
              onSave={(updatedReview) => updateMutation.mutate(updatedReview)}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewRow({
  review,
  onSave,
  onDelete,
}: {
  review: Review;
  onSave: (review: Review) => void;
  onDelete: (id: string) => void;
}) {
  const [editedReview, setEditedReview] = useState(review);

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Customer Name</Label>
          <Input
            value={editedReview.name}
            onChange={(e) => setEditedReview({ ...editedReview, name: e.target.value })}
          />
        </div>
        <div>
          <Label>Rating</Label>
          <Select
            value={editedReview.rating.toString()}
            onValueChange={(value) => setEditedReview({ ...editedReview, rating: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">⭐⭐⭐⭐⭐ (5 stars)</SelectItem>
              <SelectItem value="4">⭐⭐⭐⭐ (4 stars)</SelectItem>
              <SelectItem value="3">⭐⭐⭐ (3 stars)</SelectItem>
              <SelectItem value="2">⭐⭐ (2 stars)</SelectItem>
              <SelectItem value="1">⭐ (1 star)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Review Text</Label>
        <Textarea
          value={editedReview.text}
          onChange={(e) => setEditedReview({ ...editedReview, text: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Sort Order</Label>
          <Input
            type="number"
            value={editedReview.sort_order}
            onChange={(e) => setEditedReview({ ...editedReview, sort_order: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={editedReview.visible}
            onCheckedChange={(checked) => setEditedReview({ ...editedReview, visible: checked })}
          />
          <Label>Visible</Label>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onSave(editedReview)}>
            Save
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(review.id)}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
