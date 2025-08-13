import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const colorPresets = [
  { name: "Professional Blue", primary: "222.2 84% 4.9%", secondary: "210 40% 96%" },
  { name: "Forest Green", primary: "142.1 76.2% 36.3%", secondary: "138.5 76.5% 96.7%" },
  { name: "Warm Orange", primary: "24.6 95% 53.1%", secondary: "60 4.8% 95.9%" },
  { name: "Royal Purple", primary: "262.1 83.3% 57.8%", secondary: "270 20% 98%" },
  { name: "Crimson Red", primary: "346.8 77.2% 49.8%", secondary: "355.7 100% 97.3%" },
  { name: "Ocean Blue", primary: "221.2 83.2% 53.3%", secondary: "214.3 31.8% 91.4%" },
];

type ColorPaletteProps = {
  onColorSelect: (primary: string, secondary: string) => void;
};

export default function ColorPalette({ onColorSelect }: ColorPaletteProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Presets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {colorPresets.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => onColorSelect(preset.primary, preset.secondary)}
            >
              <div className="flex gap-2 w-full">
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: `hsl(${preset.primary})` }}
                />
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: `hsl(${preset.secondary})` }}
                />
              </div>
              <span className="text-xs text-center">{preset.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}