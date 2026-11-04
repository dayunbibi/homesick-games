// honey zone for each sweet potato is 60 ~ 80
export const HONEY_MIN = 60;
export const HONEY_MAX = 80;

export type Verdict = { title: string; line: string; score: number; honey: number; burnt: number };

export function potatoLabel(d: number) {
  if (d < 45) return "생";
  if (d < HONEY_MIN) return "덜 익음";
  if (d <= HONEY_MAX) return "꿀";
  if (d <= 92) return "진한 맛";
  return "숯";
}

// 5 potatoes × 20 points
function potatoPts(d: number) {
  if (d >= HONEY_MIN && d <= HONEY_MAX) return 20;
  const off = d < HONEY_MIN ? HONEY_MIN - d : d - HONEY_MAX;
  return Math.max(0, 20 - off * 1.2);
}

export function judge(ds: number[]): Verdict {
  const score = Math.round(ds.reduce((sum, d) => sum + potatoPts(d), 0));
  const honey = ds.filter((d) => d >= HONEY_MIN && d <= HONEY_MAX).length;
  const burnt = ds.filter((d) => d > 92).length;
  const raw = ds.filter((d) => d < 45).length;
  const base = { score, honey, burnt };

  if (honey === ds.length) return { ...base, title: "꿀고구마 장인", line: "군고구마 트럭 사장님 하셔도 돼요." };
  if (burnt >= 2) return { ...base, title: "숯고구마 한 봉지", line: "겉은 숯, 속은… 그래도 숯." };
  if (raw >= 2) return { ...base, title: "생고구마 한 봉지", line: "오도독. 이건 그냥 고구마예요." };
  if (score >= 70) return { ...base, title: "꿀 반 봉지", line: "몇 개는 꿀, 몇 개는 아쉬움." };
  return { ...base, title: "동네 군고구마", line: "호일 벗기고 호호 불어 먹는 맛." };
}
