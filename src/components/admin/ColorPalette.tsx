import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const colorPresets = [
  { name: "Electric Blue", primary: "220 91% 15%", secondary: "220 60% 96%" },
  { name: "Battery Green", primary: "142 76% 36%", secondary: "138 77% 97%" },
  { name: "Power Orange", primary: "25 95% 53%", secondary: "60 5% 96%" },
  { name: "Deep Purple", primary: "262 83% 58%", secondary: "270 20% 98%" },
  { name: "Energy Red", primary: "347 77% 50%", secondary: "356 100% 97%" },
  { name: "Tech Teal", primary: "180 100% 25%", secondary: "180 100% 97%" },
  { name: "Industrial Gray", primary: "215 25% 27%", secondary: "210 17% 95%" },
  { name: "Inverter Yellow", primary: "48 100% 47%", secondary: "48 100% 97%" },
];

type ColorPaletteProps = {
  onColorSelect: (primary: string, secondary: string) => void;
};

const applyColorsInstantly = (primary: string, secondary: string) => {
  const root = document.documentElement;
  root.style.setProperty('--primary', primary);
  root.style.setProperty('--secondary', secondary);
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
              onClick={() => {
                applyColorsInstantly(preset.primary, preset.secondary);
                onColorSelect(preset.primary, preset.secondary);
              }}
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