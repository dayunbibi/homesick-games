import { CARD_W, glowAt, loadFontsFor, startCard, toPng, wrapText } from "../shared/card";
import { drawHotteok, type Leak } from "./draw";
import { FILLINGS, type FillingKey } from "./fillings";
import { pressLabel, sideLabel, type Verdict } from "./judge";

type CardInput = {
  verdict: Verdict;
  f: number;
  dA: number;
  dB: number;
  burst: boolean;
  leaks: Leak[];
  filling: FillingKey;
  count: number;
};

export async function makeResultImage({ verdict, f, dA, dB, burst, leaks, filling, count }: CardInput) {
  const fl = FILLINGS[filling];
  const sides = `윗면 ${sideLabel(dA)} · 바닥 ${sideLabel(dB)}`;
  const detail = `납작함 ${pressLabel(f, burst)} · 속: ${fl.name} (${fl.type})`;
  const footer = count ? `온라인 호떡 굽기 · 오늘 ${count}번째` : "온라인 호떡 굽기";
  await loadFontsFor(["오늘의 호떡", verdict.title, verdict.line, sides, detail, `${verdict.score}점`, footer].join(""));

  const { canvas, c } = startCard();
  const mid = CARD_W / 2;

  c.fillStyle = "#b9a99c";
  c.font = "44px Jua, sans-serif";
  c.fillText("오늘의 호떡", mid, 330);
  c.fillStyle = "#f5b041";
  c.font = '100px "Black Han Sans", sans-serif';
  wrapText(c, verdict.title, mid, 450, 960, 110);

  glowAt(c, mid, 900, 520);
  // keep it inside the card even when it's pressed very thin
  const R = Math.min(330, 200 * (1 + f * 0.85));
  drawHotteok(c, mid, 900, R, { d: dA, f, rimD: dB, leaks: burst ? leaks : [], leakColor: fl.color });

  c.fillStyle = "#f6ece0";
  c.font = '48px "Gowun Dodum", sans-serif';
  wrapText(c, verdict.line, mid, 1340, 900, 64);

  c.fillStyle = "#b9a99c";
  c.font = "42px Jua, sans-serif";
  c.fillText(sides, mid, 1480);
  c.fillText(detail, mid, 1550);

  c.fillStyle = "#f5b041";
  c.font = '140px "Black Han Sans", sans-serif';
  c.fillText(`${verdict.score}점`, mid, 1740);

  c.fillStyle = "#7d6d70";
  c.font = "34px Jua, sans-serif";
  c.fillText(footer, mid, 1860);

  return toPng(canvas);
}
