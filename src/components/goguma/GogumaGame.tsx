"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { drawDrum, drawPotato, hitPotato, potatoSize, SPOTS, type Potato } from "@/lib/goguma/draw";
import { judge, potatoLabel, HONEY_MAX, HONEY_MIN } from "@/lib/goguma/judge";
import { PAIRINGS, PAIRING_KEYS, type PairingKey } from "@/lib/goguma/pairings";
import { makeResultImage } from "@/lib/goguma/resultImage";
import { drawSteam, updateSteam, type Steam } from "@/lib/shared/steam";
import { bumpTodayCount, getTodayCount } from "@/lib/shared/counter";
import ResultCard from "@/components/shared/ResultCard";
import Steps from "@/components/shared/Steps";

type Phase = "pick" | "roast" | "done";

const COOK_MAX = 120;
const COUNTER_KEY = "goguma";

function newPotatoes(): Potato[] {
  return SPOTS.map(([x, y, rot]) => ({
    x,
    y,
    rot,
    d: Math.random() * 18, // some went in a bit earlier
    rate: 7 + Math.random() * 6,
    taken: false,
    out: 0,
  }));
}

type Result = { url: string; blob: Blob; title: string; score: number };

export default function GogumaGame() {
  const [phase, setPhaseState] = useState<Phase>("pick");
  const [pairing, setPairing] = useState<PairingKey | null>(null);
  const [bag, setBag] = useState<number[]>([]); // doneness of each potato taken out, in order
  const [result, setResult] = useState<Result | null>(null);
  const [count, setCount] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const potatoes = useRef<Potato[]>(newPotatoes());
  const steam = useRef<Steam[]>([]);
  const phaseRef = useRef<Phase>("pick");
  const pairingRef = useRef<PairingKey | null>(null);
  const size = useRef({ W: 0, H: 0, dpr: 1 });

  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);

  useEffect(() => {
    setCount(getTodayCount(COUNTER_KEY));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      size.current = { W: rect.width, H: rect.height, dpr };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [result]);

  const finish = useCallback(async () => {
    const ds = potatoes.current.map((p) => p.d);
    const verdict = judge(ds);
    const n = bumpTodayCount(COUNTER_KEY);
    setCount(n);
    const blob = await makeResultImage({ verdict, ds, pairing: pairingRef.current ?? "dongchimi", count: n });
    setResult({ url: URL.createObjectURL(blob), blob, title: verdict.title, score: verdict.score });
  }, []);

  // main loop
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let t = 0;

    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      const p = phaseRef.current;

      for (const pt of potatoes.current) {
        if (p === "roast" && !pt.taken) {
          pt.d = Math.min(COOK_MAX, pt.d + dt * pt.rate);
          // hotter potatoes steam more
          if (pt.d > 35 && Math.random() < pt.d / 900) {
            steam.current.push({ x: pt.x + (Math.random() - 0.5) * 0.06, y: pt.y, r: 6 + Math.random() * 8, life: 1 });
          }
        }
        if (pt.taken && pt.out < 1) pt.out = Math.min(1, pt.out + dt * 3);
      }
      steam.current = updateSteam(steam.current, dt);

      if (!(p === "done")) render(t);
      raf = requestAnimationFrame(tick);
    }

    function render(t: number) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      const { W, H, dpr } = size.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      drawDrum(ctx, W, H, t);
      const s = potatoSize(W);
      for (const pt of potatoes.current) {
        if (pt.out >= 1) continue;
        // taken ones float up and fade out
        ctx.globalAlpha = 1 - pt.out;
        drawPotato(ctx, pt.x * W, pt.y * H - pt.out * H * 0.15, s, pt.rot, pt.d);
        ctx.globalAlpha = 1;
      }
      drawSteam(ctx, W, H, steam.current);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ---------- actions ----------

  function pickPairing(key: PairingKey) {
    if (pairingRef.current) return;
    pairingRef.current = key;
    setPairing(key);
    setTimeout(() => setPhase("roast"), 800);
  }

  function take(i: number) {
    const pt = potatoes.current[i];
    if (!pt || pt.taken) return;
    pt.taken = true;
    const takenCount = potatoes.current.filter((x) => x.taken).length;
    setBag((b) => [...b, pt.d]);
    if (takenCount === potatoes.current.length) {
      setPhase("done");
      finish();
    }
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (phaseRef.current !== "roast") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const i = hitPotato(potatoes.current, e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height);
    if (i >= 0) take(i);
  }

  function again() {
    if (result) URL.revokeObjectURL(result.url);
    potatoes.current = newPotatoes();
    steam.current = [];
    pairingRef.current = null;
    setPairing(null);
    setBag([]);
    setResult(null);
    setPhase("pick");
  }

  // ---------- UI ----------

  const stepIndex = { pick: 0, roast: 1, done: 2 }[phase];
  const left = potatoes.current.length - bag.length;

  let hint: React.ReactNode = null;
  if (phase === "pick") {
    hint = pairing ? (
      `${PAIRINGS[pairing].name} 준비 완료. 드럼통 여는 중…`
    ) : (
      <>
        군고구마는 뭐랑 먹어요?
        <small>고르면 바로 굽기 시작해요</small>
      </>
    );
  } else if (phase === "roast") {
    hint = (
      <>
        꿀이 흐르면 탭해서 꺼내기 · 남은 고구마 {left}개
        <small>고구마마다 익는 속도가 달라요. 까맣게 되기 전에!</small>
      </>
    );
  } else if (!result) {
    hint = "봉투에 담는 중…";
  }

  // keyboard fallback: one button per potato still in the drum
  const inDrum = potatoes.current.map((p, i) => ({ i, taken: p.taken }));

  return (
    <div className="flex flex-col gap-[18px]">
      <Steps labels={["같이 먹을 거", "굽기", "봉투 담기"]} current={stepIndex} />

      {result ? (
        <ResultCard
          imageUrl={result.url}
          imageBlob={result.blob}
          title={result.title}
          score={result.score}
          fileName="goguma.png"
          shareText={`${result.title} ${result.score}점! 꿀고구마 몇 개 나와? 🍠`}
          againLabel="한 봉지 더 굽기"
          onAgain={again}
        />
      ) : (
        <>
          <canvas
            ref={canvasRef}
            aria-label="드럼통 속 고구마 5개. 익은 고구마를 탭해서 꺼내요"
            className="block aspect-[4/3] w-full cursor-pointer touch-none"
            onPointerDown={onPointerDown}
          />

          <p className="hint">{hint}</p>

          {phase === "roast" && (
            <>
              {/* what's in the bag so far */}
              <div className="flex min-h-9 flex-wrap items-center justify-center gap-2" aria-live="polite">
                {bag.length === 0 && <span className="text-sm text-ink-dim">봉투가 비어 있어요</span>}
                {bag.map((d, i) => {
                  const label = potatoLabel(d);
                  const good = d >= HONEY_MIN && d <= HONEY_MAX;
                  return (
                    <span
                      key={i}
                      className={`rounded-full border px-3 py-1 font-ui text-sm ${
                        good ? "border-lamp text-lamp" : label === "숯" ? "border-bad text-bad" : "border-line text-ink-dim"
                      }`}
                    >
                      🍠 {label}
                    </span>
                  );
                })}
              </div>

              <div className="flex flex-wrap justify-center gap-1.5" aria-label="키보드로 꺼내기">
                {inDrum.map(({ i, taken }) => (
                  <button key={i} className="sr-only focus:not-sr-only btn btn-ghost" disabled={taken} onClick={() => take(i)}>
                    {i + 1}번 고구마 꺼내기
                  </button>
                ))}
              </div>
            </>
          )}

          {phase === "pick" && (
            <div className="flex flex-wrap justify-center gap-2.5">
              {PAIRING_KEYS.map((key) => (
                <button
                  key={key}
                  className={`btn btn-chip grow basis-[40%] ${pairing === key ? "picked" : ""}`}
                  disabled={!!pairing}
                  onClick={() => pickPairing(key)}
                >
                  {PAIRINGS[key].name}
                  <small>{PAIRINGS[key].type}</small>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {count > 0 && <p className="text-center text-[13px] tabular-nums text-ink-dim">오늘 구운 군고구마 {count}봉지</p>}
    </div>
  );
}
