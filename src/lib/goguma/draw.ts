// Looking down into a 드럼통 roaster with sweet potatoes on the grill.
import { makeColorScale } from "../shared/steam";

type Ctx = CanvasRenderingContext2D;

export type Potato = {
  x: number; // 0..1 of canvas width
  y: number; // 0..1 of canvas height
  rot: number;
  d: number; // doneness, 0 = raw, 120 = charcoal
  rate: number; // each one cooks at its own speed
  taken: boolean;
  out: number; // 0 → 1 while it lifts out
};

// where the 5 potatoes sit on the grill: [x, y, rotation]
export const SPOTS: [number, number, number][] = [
  [0.3, 0.36, -0.35],
  [0.56, 0.3, 0.15],
  [0.74, 0.5, -0.55],
  [0.48, 0.63, 0.2],
  [0.26, 0.65, 0.45],
];

export const skinAt = makeColorScale([
  [0, "#9a4466"],
  [40, "#7a3150"],
  [65, "#5e2638"],
  [85, "#3f1b24"],
  [100, "#22141a"],
  [120, "#141010"],
]);

export function potatoSize(W: number) {
  return W * 0.095;
}

function potatoPath(c: Ctx) {
  c.beginPath();
  c.moveTo(-1, 0);
  c.bezierCurveTo(-0.95, -0.35, -0.5, -0.48, 0, -0.45);
  c.bezierCurveTo(0.5, -0.42, 0.95, -0.3, 1, 0);
  c.bezierCurveTo(0.95, 0.32, 0.5, 0.46, 0, 0.44);
  c.bezierCurveTo(-0.5, 0.42, -0.95, 0.33, -1, 0);
  c.closePath();
}

// one sweet potato. Honey cracks open around 55+, black patches past 88.
export function drawPotato(c: Ctx, x: number, y: number, s: number, rot: number, d: number) {
  c.save();
  c.translate(x, y);
  c.rotate(rot);
  c.scale(s, s);

  c.fillStyle = "rgba(0,0,0,0.4)";
  c.beginPath();
  c.ellipse(0.06, 0.12, 1.02, 0.46, 0, 0, Math.PI * 2);
  c.fill();

  // root tips
  c.strokeStyle = skinAt(d + 10);
  c.lineWidth = 0.06;
  c.lineCap = "round";
  c.beginPath();
  c.moveTo(-0.98, 0);
  c.lineTo(-1.18, -0.05);
  c.moveTo(0.98, 0);
  c.lineTo(1.15, 0.06);
  c.stroke();

  const skin = c.createLinearGradient(0, -0.45, 0, 0.45);
  skin.addColorStop(0, skinAt(d - 12));
  skin.addColorStop(1, skinAt(d + 12));
  c.fillStyle = skin;
  potatoPath(c);
  c.fill();

  c.save();
  potatoPath(c);
  c.clip();

  // split showing the yellow inside, wider as it roasts
  if (d >= 50) {
    const open = Math.min(1, (d - 50) / 25);
    c.fillStyle = d > 95 ? "#5a3414" : "#f1b84a";
    c.beginPath();
    c.ellipse(0.05, -0.08, 0.55 * open + 0.1, 0.07 + 0.08 * open, -0.05, 0, Math.PI * 2);
    c.fill();

    // honey drips
    c.fillStyle = "rgba(214,124,28,0.85)";
    const drips = Math.floor(open * 4);
    for (let i = 0; i < drips; i++) {
      c.beginPath();
      c.ellipse(-0.4 + i * 0.3, 0.12 + (i % 2) * 0.1, 0.09, 0.06, 0, 0, Math.PI * 2);
      c.fill();
    }
  }

  // charred spots
  if (d > 88) {
    c.fillStyle = `rgba(10,8,8,${Math.min(0.85, (d - 88) / 32)})`;
    for (const [px, py, pr] of [
      [-0.6, 0.15, 0.22],
      [0.55, -0.2, 0.2],
      [0.1, 0.28, 0.18],
      [-0.2, -0.3, 0.16],
    ]) {
      c.beginPath();
      c.arc(px, py, pr, 0, Math.PI * 2);
      c.fill();
    }
  }
  c.restore();

  // skin shine
  c.fillStyle = "rgba(255,255,255,0.12)";
  c.beginPath();
  c.ellipse(-0.3, -0.22, 0.35, 0.07, -0.1, 0, Math.PI * 2);
  c.fill();

  c.restore();
}

// fixed ember dots so they don't jump around
const EMBERS: [number, number, number][] = Array.from({ length: 70 }, (_, i) => {
  const a = i * 2.399;
  const r = Math.sqrt((i + 0.5) / 70) * 0.9;
  return [Math.cos(a) * r, Math.sin(a) * r, 0.006 + ((i * 7) % 5) * 0.002];
});

export function drawDrum(c: Ctx, W: number, H: number, t: number) {
  const cx = W / 2;
  const cy = H * 0.5;
  const rx = W * 0.47;
  const ry = H * 0.46;

  // metal rim
  const rim = c.createLinearGradient(0, cy - ry, 0, cy + ry);
  rim.addColorStop(0, "#77706a");
  rim.addColorStop(1, "#3a3532");
  c.fillStyle = rim;
  c.beginPath();
  c.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  c.fill();

  // inside: charcoal with a glow that breathes a little
  const irx = rx * 0.9;
  const iry = ry * 0.88;
  c.fillStyle = "#1b1312";
  c.beginPath();
  c.ellipse(cx, cy, irx, iry, 0, 0, Math.PI * 2);
  c.fill();

  c.save();
  c.beginPath();
  c.ellipse(cx, cy, irx, iry, 0, 0, Math.PI * 2);
  c.clip();

  const pulse = 0.4 + Math.sin(t * 1.7) * 0.05;
  const glow = c.createRadialGradient(cx, cy, 10, cx, cy, irx);
  glow.addColorStop(0, `rgba(255,110,30,${pulse})`);
  glow.addColorStop(1, "rgba(255,110,30,0.05)");
  c.fillStyle = glow;
  c.fillRect(cx - irx, cy - iry, irx * 2, iry * 2);

  for (const [ex, ey, er] of EMBERS) {
    c.fillStyle = er > 0.01 ? "rgba(255,170,60,0.5)" : "rgba(220,70,30,0.45)";
    c.beginPath();
    c.arc(cx + ex * irx, cy + ey * iry, er * W, 0, Math.PI * 2);
    c.fill();
  }

  // grill bars
  c.strokeStyle = "#2c2622";
  c.lineWidth = 4;
  for (let x = cx - irx; x < cx + irx; x += W * 0.07) {
    c.beginPath();
    c.moveTo(x, cy - iry);
    c.lineTo(x, cy + iry);
    c.stroke();
  }
  c.restore();
}

// which potato did the pointer land on? returns the index or -1
export function hitPotato(potatoes: Potato[], px: number, py: number, W: number, H: number) {
  const s = potatoSize(W);
  let best = -1;
  let bestDist = Infinity;
  potatoes.forEach((p, i) => {
    if (p.taken) return;
    const dx = px - p.x * W;
    const dy = py - p.y * H;
    // rotate into the potato's own space
    const lx = dx * Math.cos(-p.rot) - dy * Math.sin(-p.rot);
    const ly = dx * Math.sin(-p.rot) + dy * Math.cos(-p.rot);
    // a bit bigger than the drawing so it's easy to tap on a phone
    const dist = (lx / (s * 1.3)) ** 2 + (ly / (s * 0.75)) ** 2;
    if (dist <= 1 && dist < bestDist) {
      best = i;
      bestDist = dist;
    }
  });
  return best;
}
