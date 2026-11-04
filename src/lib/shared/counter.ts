// "오늘 n번째" — stored per browser and per game, resets every day

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function getTodayCount(key: string) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "{}");
    return saved.day === today() ? (saved.n as number) : 0;
  } catch {
    return 0;
  }
}

export function bumpTodayCount(key: string) {
  const n = getTodayCount(key) + 1;
  try {
    localStorage.setItem(key, JSON.stringify({ day: today(), n }));
  } catch {
    // private mode etc. — not a big deal
  }
  return n;
}
