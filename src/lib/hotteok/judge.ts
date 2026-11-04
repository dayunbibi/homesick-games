// f = how flat it got (0 = ball, 1 = perfect). Past BURST_AT the sugar leaks out.
export const PRESS_MAX = 1.3;
export const BURST_AT = 1.08;

export type Verdict = { title: string; line: string; score: number };

export function sideLabel(d: number) {
  if (d < 45) return "덜 익음";
  if (d < 55) return "노릇 직전";
  if (d <= 75) return "황금빛";
  if (d <= 90) return "진한 갈색";
  return "탐";
}

export function pressLabel(f: number, burst: boolean) {
  if (burst) return "꿀 터짐";
  if (f < 0.55) return "동글동글";
  if (f < 0.75) return "도톰";
  if (f <= 1.0) return "딱 좋음";
  return "얇게 쫙";
}

export function judge(f: number, dA: number, dB: number, burst: boolean): Verdict {
  let pressPts: number;
  if (burst) pressPts = 5;
  else if (f >= 0.75 && f <= 1.0) pressPts = 40;
  else if (f > 1.0) pressPts = 32;
  else if (f >= 0.55) pressPts = 28;
  else pressPts = 12;

  const sidePts = (d: number) => Math.max(0, 30 - Math.abs(d - 65));
  const score = Math.round(pressPts + sidePts(dA) + sidePts(dB));
  const golden = (d: number) => d >= 55 && d <= 75;

  // the worst problem wins the title
  if (burst) return { score, title: "꿀 터진 호떡", line: "입천장 조심. 설탕이 용암이 됐어요." };
  if (dA > 90 || dB > 90) return { score, title: "숯불 호떡", line: "겉바속숯. 그래도 속은 달아요." };
  if (dA < 45 || dB < 45) return { score, title: "말랑말랑 생호떡", line: "반죽이 아직 쫀득을 넘어 출렁해요." };
  if (f < 0.55) return { score, title: "공 모양 호떡", line: "누르개 힘이 부족했어요. 이건 거의 찐빵." };
  if (golden(dA) && golden(dB) && f >= 0.75) {
    return { score, title: "시장 1등 호떡", line: "줄 서서 먹는 그 집 맛이에요." };
  }
  return { score, title: "동네 호떡", line: "종이컵에 접어서 호호 불어 먹는 맛." };
}
