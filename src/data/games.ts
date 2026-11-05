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
  {
    slug: "hotteok",
    part: 3,
    emoji: "🥞",
    name: "온라인 호떡 굽기",
    blurb: "위로 밀어서 뒤집고, 누르개로 꾹. 너무 세게 누르면 속이 터져요.",
    control: "밀어 올리기 · 끌어내리기",
    url: "/hotteok",
    repo: "https://github.com/dayunbibi/homesick-games",
  },
  {
    slug: "goguma",
    part: 4,
    emoji: "🍠",
    name: "온라인 군고구마",
    blurb: "드럼통 속 고구마 5개가 다 다르게 익어요. 꿀 흐를 때 하나씩 탭해서 꺼내기.",
    control: "골라서 탭",
    url: "/goguma",
    repo: "https://github.com/dayunbibi/homesick-games",
  },
  {
    slug: "pojangmacha",
    part: 5,
    emoji: "🍢",
    name: "향수병 포차",
    blurb: "손님 5명이 메뉴 5개를 하나씩 주문해요. 염통꼬치 굽고 김밥 말고 떡볶이 졸여서 오늘 매출 영수증 뽑기.",
    control: "문지르기 · 원 그리기 · 타이밍",
    url: "https://pojangmacha-tawny.vercel.app",
    repo: "https://github.com/dayunbibi/pojangmacha",
  },
];

export const THREADS_URL = "https://www.threads.com/@anab.uilds";
export const GITHUB_URL = "https://github.com/dayunbibi";
