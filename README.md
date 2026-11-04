# 🏮 향수병 게임즈 (Homesick Games)

A small home page that collects my browser games — all about Korean food and seasons I miss while studying in Toronto.

| | Game | What you do | Code |
|---|---|---|---|
| 1 | [🐟 온라인 붕어빵 굽기](https://bungeoppang-seven.vercel.app) | Pour batter, pick a filling, flip on time | [bungeoppang](https://github.com/dayunbibi/bungeoppang) |
| 2 | [🥬 온라인 김장하기](https://kimjang-five.vercel.app) | Rub seasoning over a cabbage in 12 seconds | [kimjang](https://github.com/dayunbibi/kimjang) |
| 3 | [🥞 온라인 호떡 굽기](https://homesick-games.vercel.app/hotteok) | Swipe up to flip, drag the press down without bursting it | this repo, `src/app/hotteok` |
| 4 | [🍠 온라인 군고구마](https://homesick-games.vercel.app/goguma) | Pick each sweet potato out when it turns to honey | this repo, `src/app/goguma` |

Games 1–2 started as their own repos. Games 3–4 live inside this app as routes, sharing
`src/components/shared` (page frame, meter, result card) and `src/lib/shared` (card drawing, steam, daily counter).

## Adding a new game

1. Add an entry to `src/data/games.ts`
2. Put its 1200×630 thumbnail in `public/games/<slug>.png`

The page builds the menu board from that list, so nothing else needs to change.

## How the two new games work

- **호떡**: the press only goes one way (`f = max(f, new)`), like a real hotteok. Past `BURST_AT` the filling
  leaks out once, and the leaks are stored relative to the radius so they stay on the rim as it keeps flattening.
  The bottom keeps cooking while you press, so pressing slowly costs you.
- **군고구마**: each potato gets its own random cooking speed. Taps are hit-tested in each potato's rotated
  local space with a slightly larger ellipse than the drawing, so it's easy to tap on a phone.

## Tech

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Fully static, deployed on Vercel

## Running locally

```bash
npm install
npm run dev
```
