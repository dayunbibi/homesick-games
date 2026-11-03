// To add a new game: add an entry here and drop its thumbnail (1200x630) in public/games/
export type Game = {
  slug: string;
  part: number; // 1탄, 2탄 …
  emoji: string;
  name: string;
  blurb: string;
  control: string; // what you actually do in the game
  url: string;
  repo: string;
};

export const GAMES: Game[] = [
  {
    slug: "bungeoppang",
    part: 1,
    emoji: "🐟",
    name: "온라인 붕어빵 굽기",
    blurb: "반죽 붓고, 속 넣고, 타이밍 맞춰 뒤집기. 꼬리까지 바삭한 황금 붕어빵에 도전해요.",
    control: "꾹 누르기 · 타이밍",
    url: "https://bungeoppang-seven.vercel.app",
    repo: "https://github.com/dayunbibi/bungeoppang",
  },
  {
    slug: "kimjang",
    part: 2,
    emoji: "🥬",
    name: "온라인 김장하기",
    blurb: "비법 재료 하나 고르고, 12초 안에 배추에 양념 바르기. 대야에 튀면 감점이에요.",
    control: "문지르기",
    url: "https://kimjang-five.vercel.app",
    repo: "https://github.com/dayunbibi/kimjang",
  },
];

// ideas for the next one, shown on the "준비 중" card
export const NEXT_UP = ["🥞 호떡 뒤집기", "🍠 군고구마 굽기"];

export const THREADS_URL = "https://www.threads.com/@anab.uilds";
export const GITHUB_URL = "https://github.com/dayunbibi";
