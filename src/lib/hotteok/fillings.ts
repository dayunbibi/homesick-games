export type FillingKey = "sugar" | "seed" | "cheese";

export type Filling = {
  name: string;
  type: string; // fun label on the result card
  color: string; // also the color that leaks out if it bursts
};

export const FILLINGS: Record<FillingKey, Filling> = {
  sugar: { name: "꿀설탕", type: "정통파", color: "#8a4210" },
  seed: { name: "씨앗", type: "부산파", color: "#b88a4e" },
  cheese: { name: "치즈", type: "신세대파", color: "#f2c94c" },
};

export const FILLING_KEYS = Object.keys(FILLINGS) as FillingKey[];
