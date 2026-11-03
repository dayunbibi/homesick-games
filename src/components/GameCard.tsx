import Image from "next/image";
import type { Game } from "@/data/games";

// One item on the "menu board"
export default function GameCard({ game }: { game: Game }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line bg-night-2">
      <a href={game.url} className="block overflow-hidden" aria-label={`${game.name} 하러 가기`}>
        <Image
          src={`/games/${game.slug}.png`}
          alt=""
          width={1200}
          height={630}
          className="aspect-[1200/630] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </a>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* menu-board row: name ........ price */}
        <div className="flex items-baseline gap-2 font-ui text-lg">
          <span className="shrink-0 text-lamp">{game.part}탄</span>
          <h2 className="m-0 min-w-0 font-normal">
            {game.emoji} {game.name}
          </h2>
          <span className="mb-1 min-w-4 flex-1 border-b-2 border-dotted border-line" aria-hidden="true" />
          <span className="shrink-0 text-ink-dim">0원</span>
        </div>

        <p className="m-0 text-[15px] leading-relaxed text-ink-dim">{game.blurb}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-ink-dim">{game.control}</span>
          <a href={game.url} className="btn">
            하러 가기 →
          </a>
        </div>
      </div>
    </article>
  );
}
