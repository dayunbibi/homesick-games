// little white puffs rising from hot food. x/y are 0..1 of the canvas.
export type Steam = { x: number; y: number; r: number; life: number };

export function updateSteam(steam: Steam[], dt: number) {
  for (const st of steam) {
    st.y -= dt * 0.18;
    st.x += Math.sin(st.y * 20) * 0.001;
    st.life -= dt * 0.7;
  }
  return steam.filter((st) => st.life > 0);
}

export function drawSteam(c: CanvasRenderingContext2D, W: number, H: number, steam: Steam[]) {
  c.fillStyle = "#ffffff";
  for (const st of steam) {
    c.globalAlpha = st.life * 0.22;
    c.beginPath();
    c.arc(st.x * W, st.y * H, st.r * (1.6 - st.life), 0, Math.PI * 2);
    c.fill();
  }
  c.globalAlpha = 1;
}

// blend between color stops, used for "how cooked is it"
export function makeColorScale(stops: [number, string][]) {
  const rgb = stops.map(([d, hex]) => {
    const n = parseInt(hex.slice(1), 16);
    return [d, (n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
  });
  return (d: number) => {
    d = Math.max(rgb[0][0], Math.min(rgb[rgb.length - 1][0], d));
    for (let i = 0; i < rgb.length - 1; i++) {
      const a = rgb[i];
      const b = rgb[i + 1];
      if (d <= b[0]) {
        const t = (d - a[0]) / (b[0] - a[0]);
        const mix = (k: 1 | 2 | 3) => Math.round(a[k] + (b[k] - a[k]) * t);
        return `rgb(${mix(1)},${mix(2)},${mix(3)})`;
      }
    }
    const last = rgb[rgb.length - 1];
    return `rgb(${last[1]},${last[2]},${last[3]})`;
  };
}
