import Link from "next/link";

type Props = {
  accent: string; // the food name, shown in lamp color
  rest: string; // "굽기" etc.
  price: React.ReactNode; // little price board, like a real stall
  children: React.ReactNode;
};

// Page frame for every game that lives inside the hub
export default function GameShell({ accent, rest, price, children }: Props) {
  return (
    <>
      <div className="awning" aria-hidden="true" />
      <main className="mx-auto flex max-w-[460px] flex-col gap-[18px] px-4 pt-6 pb-10">
        <Link href="/" className="self-start font-ui text-sm text-ink-dim hover:text-ink">
          ← 향수병 게임즈
        </Link>

        <header className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="m-0 font-sign text-[34px] leading-[1.05] font-normal tracking-tight text-balance">
            온라인
            <br />
            <span className="text-lamp">{accent}</span> {rest}
          </h1>
          <div className="-rotate-3 rounded bg-tarp-light px-2.5 py-1.5 font-ui whitespace-nowrap text-night shadow-[2px_3px_0_rgba(0,0,0,0.35)]">
            {price}
          </div>
        </header>

        {children}

        <footer className="mt-4 border-t border-line pt-4 text-center text-sm text-ink-dim">
          다른 겨울 간식도 있어요{" "}
          <Link href="/" className="font-ui text-ink underline decoration-lamp decoration-2 underline-offset-4">
            메뉴판 보러 가기
          </Link>
        </footer>
      </main>
    </>
  );
}
