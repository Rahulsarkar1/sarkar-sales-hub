import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2, Upload, Eye, EyeOff } from "lucide-react";

interface HeroSlide {
  id: string;
  image_url: string;
  duration_seconds: number;
  sort_order: number;
  visible: boolean;
  created_at: string;
}

export default function HeroSlidesManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [gradientDuration, setGradientDuration] = useState(5);
  const [gradientAnimated, setGradientAnimated] = useState(true);
  const [gradientVisible, setGradientVisible] = useState(true);

  useEffect(() => {
    loadSlides();
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("hero_gradient_duration, hero_gradient_animated, hero_gradient_visible")
      .eq("key", "default")
      .single();

    if (data) {
      if (data.hero_gradient_duration) {
        setGradientDuration(data.hero_gradient_duration);
      }
      if (data.hero_gradient_animated !== undefined) {
        setGradientAnimated(data.hero_gradient_animated);
      }
      if (data.hero_gradient_visible !== undefined) {
        setGradientVisible(data.hero_gradient_visible);
      }
    }
  };

  const loadSlides = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      toast.error("Failed to load slides");
      console.error(error);
    } else {
      setSlides(data || []);
    }
    setLoading(false);
  };

  const updateGradientDuration = async (duration: number) => {
    const { error } = await supabase
      .from("site_settings")
      .update({ hero_gradient_duration: duration })
      .eq("key", "default");

    if (error) {
      toast.error("Failed to update gradient duration");
      console.error(error);
    } else {
      toast.success("Gradient duration updated");
      setGradientDuration(duration);
    }
  };

  const updateGradientAnimated = async (animated: boolean) => {
    const { error } = await supabase
      .from("site_settings")
      .update({ hero_gradient_animated: animated })
      .eq("key", "default");

    if (error) {
      toast.error("Failed to update gradient animation");
      console.error(error);
    } else {
      setGradientAnimated(animated);
      toast.success(animated ? "Gradient animation enabled" : "Gradient animation disabled");
    }
  };

  const updateGradientVisible = async (visible: boolean) => {
    const { error } = await supabase
      .from("site_settings")
      .update({ hero_gradient_visible: visible })
      .eq("key", "default");

    if (error) {
      toast.error("Failed to update gradient visibility");
      console.error(error);
    } else {
      setGradientVisible(visible);
      toast.success(visible ? "Gradient slide enabled" : "Gradient slide hidden");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `hero-slides/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("branding")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("branding")
        .getPublicUrl(filePath);

      // Create new slide record
      const maxSort = slides.length > 0 ? Math.max(...slides.map(s => s.sort_order)) : -1;
      const { error: insertError } = await supabase
        .from("hero_slides")
        .insert({
          image_url: publicUrl,
          duration_seconds: 5,
          sort_order: maxSort + 1,
          visible: true,
        });

      if (insertError) throw insertError;

      toast.success("Slide added successfully");
      loadSlides();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload slide");
      console.error(error);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const updateSlide = async (id: string, updates: Partial<HeroSlide>) => {
    const { error } = await supabase
      .from("hero_slides")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast.error("Failed to update slide");
      console.error(error);
    } else {
      toast.success("Slide updated");
      loadSlides();
    }
  };

  const deleteSlide = async (id: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;

    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from("hero_slides")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      // Try to delete from storage (optional, may fail if file doesn't exist)
      const path = imageUrl.split("/branding/")[1];
      if (path) {
        await supabase.storage.from("branding").remove([`hero-slides/${path}`]);
      }

      toast.success("Slide deleted");
      loadSlides();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete slide");
      console.error(error);
    }
  };

  const moveSlide = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === slides.length - 1) return;

    const newSlides = [...slides];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];

    // Update sort_order for both slides
    const updates = newSlides.map((slide, i) => ({
      id: slide.id,
      sort_order: i,
    }));

    try {
      for (const update of updates) {
        await supabase
          .from("hero_slides")
          .update({ sort_order: update.sort_order })
          .eq("id", update.id);
      }
      toast.success("Slide order updated");
      loadSlides();
    } catch (error) {
      toast.error("Failed to reorder slides");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="p-4 rounded-lg border glass-card">
        <h2 className="font-semibold mb-4">Hero Slideshow</h2>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg border glass-card">
      <h2 className="font-semibold mb-2">Hero Slideshow</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Manage background images for the hero section. Images will auto-rotate based on the duration you set.
      </p>

      {/* Gradient Settings */}
      <div className="mb-6 p-4 border rounded-lg bg-muted/30 space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-3">Gradient Slide Settings</h3>
          
          {/* Show Gradient */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="gradientVisible" className="text-sm">Show Gradient Slide</Label>
              <p className="text-xs text-muted-foreground">
                Display the gradient background in the hero slideshow
              </p>
            </div>
            <Switch
              id="gradientVisible"
              checked={gradientVisible}
              onCheckedChange={updateGradientVisible}
            />
          </div>

          {/* Animated Gradient */}
          <div className="flex items-center justify-between py-2 border-t mt-2 pt-2">
            <div className="space-y-0.5">
              <Label htmlFor="gradientAnimated" className="text-sm">Enable Animated Gradient</Label>
              <p className="text-xs text-muted-foreground">
                Use smooth color-changing animation or static gradient
              </p>
            </div>
            <Switch
              id="gradientAnimated"
              checked={gradientAnimated}
              onCheckedChange={updateGradientAnimated}
              disabled={!gradientVisible}
            />
          </div>

          {/* Gradient Duration */}
          <div className="border-t mt-2 pt-3">
            <Label htmlFor="gradientDuration" className="text-sm font-medium mb-2 block">
              Gradient Slide Duration (seconds)
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="gradientDuration"
                type="number"
                min="1"
                max="60"
                value={gradientDuration}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 5;
                  updateGradientDuration(val);
                }}
                className="w-24"
                disabled={!gradientVisible}
              />
              <p className="text-xs text-muted-foreground">
                How long the gradient stays before switching to promotional slides
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Label htmlFor="slideUpload" className="cursor-pointer">
          <div className="flex items-center gap-2 p-3 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
            <Upload className="w-5 h-5" />
            <span>{uploading ? "Uploading..." : "Upload New Slide"}</span>
          </div>
        </Label>
        <Input
          id="slideUpload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Recommended: 1920x600px or larger. Max 5MB. JPG, PNG, or WEBP.
        </p>
      </div>

      {slides.length === 0 ? (
        <div className="text-center p-6 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No slides yet. Upload your first slide above!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, index) => (
            <div key={slide.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-start gap-4">
                <img
                  src={slide.image_url}
                  alt={`Slide ${index + 1}`}
                  className="w-32 h-20 object-cover rounded"
                />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Duration (seconds):</Label>
                    <Input
                      type="number"
                      min="1"
                      max="60"
                      value={slide.duration_seconds}
                      onChange={(e) =>
                        updateSlide(slide.id, {
                          duration_seconds: parseInt(e.target.value) || 5,
                        })
                      }
                      className="w-20"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={slide.visible}
                      onCheckedChange={(checked) =>
                        updateSlide(slide.id, { visible: checked })
                      }
                    />
                    <Label className="text-xs flex items-center gap-1">
                      {slide.visible ? (
                        <>
                          <Eye className="w-3 h-3" /> Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" /> Hidden
                        </>
                      )}
                    </Label>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveSlide(index, "up")}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveSlide(index, "down")}
                    disabled={index === slides.length - 1}
                  >
                    ↓
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteSlide(slide.id, slide.image_url)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
