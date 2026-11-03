# 🏮 향수병 게임즈 (Homesick Games)

A small home page that collects my browser games — all about Korean food and seasons I miss while studying in Toronto.

| | Game | What you do | Code |
|---|---|---|---|
| 1 | [🐟 온라인 붕어빵 굽기](https://bungeoppang-seven.vercel.app) | Pour batter, pick a filling, flip on time | [bungeoppang](https://github.com/dayunbibi/bungeoppang) |
| 2 | [🥬 온라인 김장하기](https://kimjang-five.vercel.app) | Rub seasoning over a cabbage in 12 seconds | [kimjang](https://github.com/dayunbibi/kimjang) |

## Adding a new game

1. Add an entry to `src/data/games.ts`
2. Put its 1200×630 thumbnail in `public/games/<slug>.png`

The page builds the menu board from that list, so nothing else needs to change.

## Tech

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Fully static, deployed on Vercel

## Running locally

```bash
npm install
npm run dev
```
