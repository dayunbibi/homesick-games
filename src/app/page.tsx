import GameCard from "@/components/GameCard";
import { GAMES, GITHUB_URL, THREADS_URL } from "@/data/games";

export default function Home() {
  return (
    <>
      <div className="awning" aria-hidden="true" />

      <main className="mx-auto flex max-w-[760px] flex-col gap-10 px-4 pt-10 pb-12">
        <header className="flex flex-col gap-3">
          <p className="m-0 font-ui text-sm tracking-wide text-ink-dim">토론토에서 한국 그리워서 만드는 웹게임</p>
          <h1 className="m-0 font-sign text-5xl leading-none font-normal text-balance sm:text-6xl">
            <span className="text-lamp">향수병</span> 게임즈
          </h1>
          <p className="m-0 max-w-[52ch] leading-relaxed text-ink-dim">
            캐나다엔 붕어빵도, 호떡 리어카도, 군고구마 드럼통도 없어서 직접 만들었어요. 로그인 없이 바로, 한 판에 1분이면 끝나요.
          </p>
        </header>

        <section className="flex flex-col gap-4" aria-labelledby="menu-title">
          <div className="flex items-end justify-between gap-3 border-b-2 border-line pb-2">
            <h2 id="menu-title" className="m-0 font-sign text-2xl font-normal">
              오늘의 메뉴
            </h2>
            <span className="font-ui text-sm text-ink-dim">전 메뉴 무료</span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {GAMES.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}

            {/* end of the winter snack series */}
            <article className="flex flex-col justify-center gap-3 rounded-xl border-2 border-dashed border-line p-6 text-center sm:col-span-2">
              <p className="m-0 font-ui text-lg">
                겨울 간식 시리즈 <span className="text-lamp">완결</span> 🎉
              </p>
              <p className="m-0 text-ink-dim">다음엔 완전히 새로운 걸 만드는 중이에요. 소식은 쓰레드에서!</p>
              <a href={THREADS_URL} className="btn btn-ghost self-center">
                @anab.uilds 팔로우하기
              </a>
            </article>
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-sm text-ink-dim">
          <span>만든 사람 · 토론토의 개발 공부생</span>
          <span className="flex gap-4">
            <a href={THREADS_URL} className="text-ink underline decoration-lamp decoration-2 underline-offset-4">
              Threads
            </a>
            <a href={GITHUB_URL} className="text-ink underline decoration-lamp decoration-2 underline-offset-4">
              GitHub
            </a>
          </span>
        </footer>
      </main>
    </>
  );
}
