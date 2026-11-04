// Helpers shared by every game's 9:16 result card

export const CARD_W = 1080;
export const CARD_H = 1920;

// Google Fonts splits Korean fonts into small chunks and only downloads the ones
// the page actually shows. Text that only exists on the canvas never triggers a download,
// so document.fonts.ready isn't enough — load each font for the exact text first.
export async function loadFontsFor(text: string) {
  const families = ['"Black Han Sans"', "Jua", '"Gowun Dodum"'];
  try {
    await Promise.all(families.map((f) => document.fonts.load(`40px ${f}`, text)));
  } catch {
    // worst case the card uses a fallback font, still fine
  }
}

export function wrapText(c: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (c.measureText(test).width > maxW && line) {
      c.fillText(line, x, yy);
      line = w;
      yy += lineH;
    } else {
      line = test;
    }
  }
  c.fillText(line, x, yy);
}

// night-market background + striped awning, same as the hub
export function startCard() {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const c = canvas.getContext("2d")!;

  c.fillStyle = "#221a1d";
  c.fillRect(0, 0, CARD_W, CARD_H);
  for (let x = 0; x < CARD_W; x += 120) {
    c.fillStyle = (x / 120) % 2 ? "#f3e6cf" : "#c8432f";
    c.fillRect(x, 0, 120, 110);
    c.beginPath();
    c.arc(x + 60, 110, 60, 0, Math.PI);
    c.fill();
  }
  c.textAlign = "center";
  return { canvas, c };
}

export function glowAt(c: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const g = c.createRadialGradient(x, y, 40, x, y, r);
  g.addColorStop(0, "rgba(245,176,65,0.35)");
  g.addColorStop(1, "rgba(245,176,65,0)");
  c.fillStyle = g;
  c.fillRect(x - r, y - r, r * 2, r * 2);
}

export function toPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png");
  });
}
