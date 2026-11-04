// Top-down view of a hotteok on a hot griddle.
import { makeColorScale } from "../shared/steam";
import { PRESS_MAX } from "./judge";

type Ctx = CanvasRenderingContext2D;

// a blob of filling that leaked out, in units of the hotteok radius
export type Leak = { x: number; y: number; r: number };

// dough color by doneness: 0 = raw, 120 = charcoal
export const colorAt = makeColorScale([
  [0, "#efe2c4"],
  [35, "#e8c27a"],
  [60, "#d4903a"],
  [80, "#9c561f"],
  [95, "#5a2e12"],
  [120, "#21140e"],
]);

// toasted speckles, same spots every time so they don't flicker
const SPECKLES: [number, number][] = Array.from({ length: 46 }, (_, i) => {
  const a = i * 2.399; // golden angle spreads them out evenly
  const r = Math.sqrt((i + 0.5) / 46) * 0.88;
  return [Math.cos(a) * r, Math.sin(a) * r];
});

export function griddleSpot(W: number, H: number) {
  return { cx: W / 2, cy: H * 0.52 };
}

// a ball when f = 0, a flat disc when pressed
export function hotteokRadius(W: number, f: number) {
  return W * 0.13 * (1 + Math.min(f, PRESS_MAX) * 0.85);
}

function roundRect(c: Ctx, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

export function drawGriddle(c: Ctx, W: number, H: number) {
  const steel = c.createLinearGradient(0, 0, 0, H);
  steel.addColorStop(0, "#3d3c41");
  steel.addColorStop(1, "#222126");
  c.fillStyle = steel;
  roundRect(c, W * 0.03, H * 0.04, W * 0.94, H * 0.92, 20);
  c.fill();
  c.strokeStyle = "#57555c";
  c.lineWidth = 2;
  c.stroke();

  // heat in the middle
  const heat = c.createRadialGradient(W / 2, H * 0.52, 10, W / 2, H * 0.52, W * 0.4);
  heat.addColorStop(0, "rgba(255,120,40,0.12)");
  heat.addColorStop(1, "rgba(255,120,40,0)");
  c.fillStyle = heat;
  c.fillRect(0, 0, W, H);

  // oil shine
  c.fillStyle = "rgba(255,230,160,0.06)";
  for (const [x, y, rx, ry] of [
    [0.2, 0.25, 0.09, 0.03],
    [0.78, 0.7, 0.11, 0.035],
    [0.7, 0.2, 0.06, 0.02],
  ]) {
    c.beginPath();
    c.ellipse(x * W, y * H, rx * W, ry * W, -0.3, 0, Math.PI * 2);
    c.fill();
  }
}

type HotteokOptions = {
  d: number; // doneness of the side facing up
  f: number; // flatness
  sy?: number; // vertical scale, for the flip animation
  rimD?: number; // doneness of the side facing down (shows at the edge)
  leaks?: Leak[];
  leakColor?: string;
  dollop?: string | null; // filling shown before it's sealed
};

export function drawHotteok(c: Ctx, cx: number, cy: number, R: number, o: HotteokOptions) {
  const { d, f, sy = 1, rimD = d, leaks = [], leakColor = "#8a4210", dollop = null } = o;
  const ball = Math.max(0, 1 - f); // 1 = still a round ball

  c.save();
  c.translate(cx, cy);

  // shadow on the griddle
  c.fillStyle = "rgba(0,0,0,0.35)";
  c.beginPath();
  c.ellipse(R * 0.04, R * 0.1, R * 1.02, R * 1.02 * Math.abs(sy), 0, 0, Math.PI * 2);
  c.fill();

  // burst filling, under the dough
  for (const l of leaks) {
    c.fillStyle = leakColor;
    c.beginPath();
    c.ellipse(l.x * R, l.y * R, l.r * R * 1.3, l.r * R, Math.atan2(l.y, l.x), 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "rgba(255,255,255,0.25)";
    c.beginPath();
    c.arc(l.x * R - l.r * R * 0.3, l.y * R - l.r * R * 0.3, l.r * R * 0.25, 0, Math.PI * 2);
    c.fill();
  }

  c.scale(1, sy);

  // body: center is the top side, the rim shows the bottom browning through
  const edgeD = Math.max(d + 12, rimD * 0.95);
  const body = c.createRadialGradient(-R * 0.25, -R * 0.25, R * 0.05, 0, 0, R);
  body.addColorStop(0, colorAt(d - 10));
  body.addColorStop(0.72, colorAt(d));
  body.addColorStop(1, colorAt(edgeD));
  c.fillStyle = body;
  c.beginPath();
  c.arc(0, 0, R, 0, Math.PI * 2);
  c.fill();

  // toasted speckles appear as it cooks
  const toast = Math.min(1, Math.max(0, (d - 20) / 50));
  if (toast > 0) {
    c.fillStyle = `rgba(90,40,10,${0.35 * toast})`;
    for (const [x, y] of SPECKLES) {
      c.beginPath();
      c.arc(x * R, y * R, R * 0.028, 0, Math.PI * 2);
      c.fill();
    }
  }

  // round ball shading
  if (ball > 0) {
    const shine = c.createRadialGradient(-R * 0.3, -R * 0.35, 0, -R * 0.3, -R * 0.35, R * 0.7);
    shine.addColorStop(0, `rgba(255,255,255,${0.4 * ball})`);
    shine.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = shine;
    c.beginPath();
    c.arc(0, 0, R, 0, Math.PI * 2);
    c.fill();

    const shade = c.createRadialGradient(R * 0.35, R * 0.4, 0, R * 0.35, R * 0.4, R * 0.9);
    shade.addColorStop(0, `rgba(60,25,0,${0.25 * ball})`);
    shade.addColorStop(1, "rgba(60,25,0,0)");
    c.fillStyle = shade;
    c.beginPath();
    c.arc(0, 0, R, 0, Math.PI * 2);
    c.fill();
  }

  // ring left by the press plate
  if (f > 0.35) {
    c.strokeStyle = `rgba(60,25,0,${Math.min(0.18, f * 0.14)})`;
    c.lineWidth = R * 0.03;
    c.beginPath();
    c.arc(0, 0, R * 0.68, 0, Math.PI * 2);
    c.stroke();
  }

  if (dollop) {
    c.fillStyle = dollop;
    c.beginPath();
    c.ellipse(0, 0, R * 0.38, R * 0.3, 0.3, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "rgba(255,255,255,0.3)";
    c.beginPath();
    c.ellipse(-R * 0.12, -R * 0.1, R * 0.1, R * 0.05, 0.3, 0, Math.PI * 2);
    c.fill();
  }

  c.restore();
}

// stainless 누르개. Over the hotteok while pressing, parked at the side otherwise.
export function drawPress(c: Ctx, cx: number, cy: number, R: number, pressing: boolean) {
  const r = pressing ? R * 0.9 : R * 0.5;
  const x = pressing ? cx : cx + R * 1.25;
  const y = pressing ? cy : cy - R * 0.85;

  c.save();
  c.globalAlpha = pressing ? 0.6 : 0.95;

  // handle
  c.save();
  c.translate(x, y);
  c.rotate(-0.7);
  c.fillStyle = "#7a4a26";
  c.fillRect(r * 0.6, -r * 0.14, r * 1.3, r * 0.28);
  c.restore();

  const metal = c.createLinearGradient(x - r, y - r, x + r, y + r);
  metal.addColorStop(0, "#e6e8ea");
  metal.addColorStop(0.5, "#a9adb2");
  metal.addColorStop(1, "#d3d6d9");
  c.fillStyle = metal;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = "#6f7378";
  c.lineWidth = 2;
  c.stroke();
  c.restore();
}
