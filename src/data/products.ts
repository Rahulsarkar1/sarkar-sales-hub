import exideInverter from "@/assets/exide-inverter-battery.jpg";
import carBattery from "@/assets/car-battery.jpg";
import bikeBattery from "@/assets/bike-battery.jpg";
import microtekInverter from "@/assets/microtek-inverter.jpg";

export type Product = {
  id: string;
  name: string;
  image: string;
  price: number; // MRP
  discountPercent?: number; // e.g., 10 => 10%
};

export const categories = [
  "Exide Home/Inverter Batteries",
  "Car Batteries",
  "Bike Batteries",
  "Microtek Inverters",
] as const;

export type Category = (typeof categories)[number];

function p(id: string, name: string, image: string, price: number, discountPercent?: number): Product {
  return { id, name, image, price, discountPercent };
}

export const productsByCategory: Record<Category, Product[]> = {
  "Exide Home/Inverter Batteries": [
    p("exide-850", "Exide Inva Queen 850VA", exideInverter, 10999, 12),
    p("exide-1100", "Exide Inva Master 1100VA", exideInverter, 13999, 15),
    p("exide-150ah", "Exide 150Ah Tubular", exideInverter, 16499, 10),
    p("exide-220ah", "Exide 220Ah Tall Tubular", exideInverter, 21999, 12),
    p("exide-250ah", "Exide 250Ah Tall Tubular", exideInverter, 27999, 14),
  ],
  "Car Batteries": [
    p("car-35ah", "Car Battery 35Ah (Maintenance Free)", carBattery, 4999, 10),
    p("car-45ah", "Car Battery 45Ah (MF)", carBattery, 5999, 12),
    p("car-65ah", "Car Battery 65Ah (Premium)", carBattery, 7999, 15),
    p("car-80ah", "Car Battery 80Ah (High Crank)", carBattery, 10499, 18),
  ],
  "Bike Batteries": [
    p("bike-4ah", "Bike Battery 4Ah (MF)", bikeBattery, 1499, 10),
    p("bike-8ah", "Bike Battery 8Ah (Premium)", bikeBattery, 2499, 12),
    p("bike-12ah", "Bike Battery 12Ah (Premium)", bikeBattery, 3299, 15),
  ],
  "Microtek Inverters": [
    p("microtek-800", "Microtek 800VA UPS", microtekInverter, 7999, 12),
    p("microtek-1100", "Microtek 1100VA UPS", microtekInverter, 9999, 15),
    p("microtek-1600", "Microtek 1600VA UPS", microtekInverter, 13999, 12),
  ],
};

export function formatCurrency(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}
