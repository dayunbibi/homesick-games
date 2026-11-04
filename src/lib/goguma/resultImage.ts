import { CARD_W, glowAt, loadFontsFor, startCard, toPng, wrapText } from "../shared/card";
import { drawPotato } from "./draw";
import { PAIRINGS, type PairingKey } from "./pairings";
import type { Verdict } from "./judge";

type CardInput = { verdict: Verdict; ds: number[]; pairing: PairingKey; count: number };

// kraft paper bag with the potatoes poking out the top
function drawBag(c: CanvasRenderingContext2D, x: number, y: number, ds: number[]) {
  const w = 520;
  const h = 460;

  // back of the bag
  c.fillStyle = "#9c7144";
  c.fillRect(x - w / 2 + 20, y - 40, w - 40, 60);

  // potatoes sticking out, fanned
  ds.forEach((d, i) => {
    const px = x - 180 + i * 90;
    const py = y - 80 + Math.abs(i - 2) * 22; // middle one sticks out the most
    drawPotato(c, px, py, 100, Math.PI / 2 + (i - 2) * 0.32, d);
  });

  // front of the bag
  c.fillStyle = "#b98a55";
  c.beginPath();
  c.moveTo(x - w / 2, y);
  c.lineTo(x + w / 2, y);
  c.lineTo(x + w / 2 - 30, y + h);
  c.lineTo(x - w / 2 + 30, y + h);
  c.closePath();
  c.fill();

  // folded top edge
  c.fillStyle = "#a57a48";
  c.fillRect(x - w / 2, y, w, 34);

  c.fillStyle = "#6e4a26";
  c.font = '64px "Black Han Sans", sans-serif';
  c.fillText("군고구마", x, y + 200);
  c.font = "38px Jua, sans-serif";
  c.fillText("한 봉지 5,000원", x, y + 270);
}

export async function makeResultImage({ verdict, ds, pairing, count }: CardInput) {
  const pr = PAIRINGS[pairing];
  const stats = `꿀고구마 ${verdict.honey}/${ds.length} · 숯 ${verdict.burnt}개`;
  const pairLine = `같이 먹을 거: ${pr.name} (${pr.type})`;
  const footer = count ? `온라인 군고구마 · 오늘 ${count}번째` : "온라인 군고구마";
  await loadFontsFor(
    ["오늘의 군고구마", verdict.title, verdict.line, stats, pairLine, `${verdict.score}점`, footer, "군고구마한봉지5,000원"].join(""),
  );

  const { canvas, c } = startCard();
  const mid = CARD_W / 2;

  c.fillStyle = "#b9a99c";
  c.font = "44px Jua, sans-serif";
  c.fillText("오늘의 군고구마", mid, 330);
  c.fillStyle = "#f5b041";
  c.font = '100px "Black Han Sans", sans-serif';
  wrapText(c, verdict.title, mid, 450, 960, 110);

  glowAt(c, mid, 860, 520);
  drawBag(c, mid, 760, ds);

  c.fillStyle = "#f6ece0";
  c.font = '48px "Gowun Dodum", sans-serif';
  wrapText(c, verdict.line, mid, 1340, 900, 64);

  c.fillStyle = "#b9a99c";
  c.font = "42px Jua, sans-serif";
  c.fillText(stats, mid, 1480);
  c.fillText(pairLine, mid, 1550);

  c.fillStyle = "#f5b041";
  c.font = '140px "Black Han Sans", sans-serif';
  c.fillText(`${verdict.score}점`, mid, 1740);

  c.fillStyle = "#7d6d70";
  c.font = "34px Jua, sans-serif";
  c.fillText(footer, mid, 1860);

  return toPng(canvas);
}
