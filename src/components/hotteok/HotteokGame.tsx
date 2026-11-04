"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { drawGriddle, drawHotteok, drawPress, griddleSpot, hotteokRadius, type Leak } from "@/lib/hotteok/draw";
import { FILLINGS, FILLING_KEYS, type FillingKey } from "@/lib/hotteok/fillings";
import { BURST_AT, judge, pressLabel, PRESS_MAX, sideLabel } from "@/lib/hotteok/judge";
import { makeResultImage } from "@/lib/hotteok/resultImage";
import { drawSteam, updateSteam, type Steam } from "@/lib/shared/steam";
import { bumpTodayCount, getTodayCount } from "@/lib/shared/counter";
import Meter from "@/components/shared/Meter";
import ResultCard from "@/components/shared/ResultCard";
import Steps from "@/components/shared/Steps";

type Phase = "pick" | "cookA" | "flip" | "press" | "cookB" | "done";

const COOK_MAX = 120;
const COUNTER_KEY = "hotteok";

// per-frame values live in a ref so React doesn't re-render 60 times a second
type Game = {
  filling: FillingKey | null;
  dA: number; // side that cooks first
  dB: number; // side that cooks after the flip
  f: number; // flatness
  burst: boolean;
  leaks: Leak[];
  rate: number;
  flipT: number;
  steam: Steam[];
  t: number;
  pressing: boolean;
  pressY: number;
  pressF: number;
  swipe: { y: number; t: number } | null;
};

function newGame(): Game {
  return {
    filling: null,
    dA: 0,
    dB: 0,
    f: 0,
    burst: false,
    leaks: [],
    rate: 13,
    flipT: 0,
    steam: [],
    t: 0,
    pressing: false,
    pressY: 0,
    pressF: 0,
    swipe: null,
  };
}

type Result = { url: string; blob: Blob; title: string; score: number };

export default function HotteokGame() {
  const [phase, setPhaseState] = useState<Phase>("pick");
  const [filling, setFilling] = useState<FillingKey | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [count, setCount] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const needleRef = useRef<HTMLSpanElement>(null);
  const game = useRef<Game>(newGame());
  const phaseRef = useRef<Phase>("pick");
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
  }, [result]); // canvas is re-mounted after "한 판 더"

  // main loop
  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const g = game.current;
      const p = phaseRef.current;
      g.t += dt;

      if (p === "cookA") g.dA = Math.min(COOK_MAX, g.dA + dt * g.rate);
      // the bottom keeps cooking while you press, so don't take forever
      if (p === "press" || p === "cookB") g.dB = Math.min(COOK_MAX, g.dB + dt * g.rate);
      if (p === "flip") {
        g.flipT += dt / 0.45;
        if (g.flipT >= 1) {
          g.flipT = 1;
          setPhase("press");
        }
      }

      if (p === "cookA" || p === "press" || p === "cookB" || p === "flip") {
        const heat = p === "cookA" ? g.dA : g.dB;
        if (Math.random() < 0.2 + heat / 220) {
          g.steam.push({ x: 0.35 + Math.random() * 0.3, y: 0.5, r: 8 + Math.random() * 10, life: 1 });
        }
      }
      g.steam = updateSteam(g.steam, dt);

      if (p !== "done") {
        render();
        moveNeedle();
      }
      raf = requestAnimationFrame(tick);
    }

    function render() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      const { W, H, dpr } = size.current;
      const g = game.current;
      const p = phaseRef.current;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      drawGriddle(ctx, W, H);

      // before the flip you see the raw top, the edge shows the bottom browning
      const rawTop = 4 + g.dA * 0.1;
      let d = rawTop;
      let rimD = g.dA;
      let sy = 1;
      if (p === "flip") {
        sy = Math.cos(g.flipT * Math.PI);
        d = sy > 0 ? rawTop : g.dA;
        rimD = sy > 0 ? g.dA : rawTop;
      } else if (p === "press" || p === "cookB") {
        d = g.dA;
        rimD = g.dB;
      }

      const { cx, cy } = griddleSpot(W, H);
      const R = hotteokRadius(W, g.f);
      drawHotteok(ctx, cx, cy, R, {
        d,
        f: g.f,
        sy,
        rimD,
        leaks: g.leaks,
        leakColor: g.filling ? FILLINGS[g.filling].color : undefined,
        dollop: p === "pick" && g.filling ? FILLINGS[g.filling].color : null,
      });
      if (p === "press") drawPress(ctx, cx, cy, R, g.pressing);
      drawSteam(ctx, W, H, g.steam);
    }

    function moveNeedle() {
      const el = needleRef.current;
      if (!el) return;
      const g = game.current;
      const p = phaseRef.current;
      let v = g.dA;
      let max = COOK_MAX;
      if (p === "press") {
        v = g.f;
        max = PRESS_MAX;
      } else if (p === "cookB") {
        v = g.dB;
      }
      el.style.left = `${(Math.min(v, max) / max) * 100}%`;
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [setPhase]);

  // ---------- actions ----------

  function pickFilling(key: FillingKey) {
    const g = game.current;
    if (g.filling) return;
    g.filling = key;
    setFilling(key);
    setTimeout(() => {
      g.rate = 11 + Math.random() * 5; // a little different every round
      setPhase("cookA");
    }, 900);
  }

  function flip() {
    if (phaseRef.current !== "cookA") return;
    game.current.flipT = 0;
    game.current.dB = 6;
    setPhase("flip");
  }

  // pressing only goes one way, you can't un-flatten a hotteok
  function pressTo(f: number) {
    const g = game.current;
    g.f = Math.min(PRESS_MAX, Math.max(g.f, f));
    if (g.f > BURST_AT && !g.burst) {
      g.burst = true;
      const n = 5 + Math.floor(Math.random() * 4);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        g.leaks.push({ x: Math.cos(a) * 0.98, y: Math.sin(a) * 0.98, r: 0.1 + Math.random() * 0.1 });
      }
    }
  }

  function endPress() {
    const g = game.current;
    g.pressing = false;
    if (phaseRef.current === "press" && g.f > 0.1) setPhase("cookB");
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const g = game.current;
    if (phaseRef.current === "cookA") {
      g.swipe = { y: e.clientY, t: performance.now() };
    } else if (phaseRef.current === "press") {
      e.currentTarget.setPointerCapture(e.pointerId);
      g.pressing = true;
      g.pressY = e.clientY;
      g.pressF = g.f;
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const g = game.current;
    if (!g.pressing) return;
    const h = e.currentTarget.getBoundingClientRect().height;
    // dragging down half the canvas height ≈ a perfect press
    pressTo(g.pressF + ((e.clientY - g.pressY) / h) * 2);
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    const g = game.current;
    if (phaseRef.current === "cookA" && g.swipe) {
      const dy = e.clientY - g.swipe.y;
      const dt = performance.now() - g.swipe.t;
      if (dy < -40 && dt < 700) flip();
      g.swipe = null;
    }
    if (g.pressing) endPress();
  }

  // keyboard: ↑ flips, hold ↓ presses, Enter finishes the press
  function onKeyDown(e: React.KeyboardEvent<HTMLCanvasElement>) {
    if (phaseRef.current === "cookA" && e.key === "ArrowUp") {
      e.preventDefault();
      flip();
    } else if (phaseRef.current === "press" && e.key === "ArrowDown") {
      e.preventDefault();
      pressTo(game.current.f + 0.05);
    } else if (phaseRef.current === "press" && e.key === "Enter") {
      endPress();
    }
  }

  async function takeOut() {
    setPhase("done");
    const g = game.current;
    const verdict = judge(g.f, g.dA, g.dB, g.burst);
    const n = bumpTodayCount(COUNTER_KEY);
    setCount(n);
    const blob = await makeResultImage({
      verdict,
      f: g.f,
      dA: g.dA,
      dB: g.dB,
      burst: g.burst,
      leaks: g.leaks,
      filling: g.filling ?? "sugar",
      count: n,
    });
    setResult({ url: URL.createObjectURL(blob), blob, title: verdict.title, score: verdict.score });
  }

  function again() {
    if (result) URL.revokeObjectURL(result.url);
    game.current = newGame();
    setFilling(null);
    setResult(null);
    setPhase("pick");
  }

  // ---------- UI ----------

  const g = game.current;
  const stepIndex = { pick: 0, cookA: 1, flip: 2, press: 2, cookB: 3, done: 4 }[phase];

  let hint: React.ReactNode = null;
  if (phase === "pick") {
    hint = filling ? (
      `${FILLINGS[filling].name} 듬뿍 넣고 동그랗게 굴리는 중…`
    ) : (
      <>
        호떡 속은 뭘로 할까요?
        <small>하나만 고를 수 있어요</small>
      </>
    );
  } else if (phase === "cookA") {
    hint = (
      <>
        바닥이 노릇해지면 위로 휙 밀어서 뒤집기
        <small>호떡 가장자리 색을 잘 보세요</small>
      </>
    );
  } else if (phase === "flip") {
    hint = "휙!";
  } else if (phase === "press") {
    hint = (
      <>
        누르개를 아래로 꾹 끌어내리세요
        <small>너무 세게 누르면 속이 터져요. 그사이 바닥도 익고 있어요!</small>
      </>
    );
  } else if (phase === "cookB") {
    hint = (
      <>
        납작함 <b className="font-normal text-lamp">{pressLabel(g.f, g.burst)}</b>. 바닥 익으면 꺼내기
        <small>윗면은 {sideLabel(g.dA)}</small>
      </>
    );
  } else if (!result) {
    hint = "종이컵에 담는 중…";
  }

  return (
    <div className="flex flex-col gap-[18px]">
      <Steps labels={["속", "굽기", "누르기", "꺼내기"]} current={stepIndex} />

      {result ? (
        <ResultCard
          imageUrl={result.url}
          imageBlob={result.blob}
          title={result.title}
          score={result.score}
          fileName="hotteok.png"
          shareText={`${result.title} ${result.score}점! 너도 구워봐 🥞`}
          againLabel="한 장 더 굽기"
          onAgain={again}
        />
      ) : (
        <>
          <canvas
            ref={canvasRef}
            tabIndex={0}
            aria-label="철판 위 호떡. 위로 밀면 뒤집고, 아래로 끌면 눌러요"
            className="block aspect-[4/3] w-full touch-none rounded-[14px]"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
          />

          <p className="hint">{hint}</p>

          {(phase === "cookA" || phase === "cookB") && (
            <Meter
              key="cook"
              max={COOK_MAX}
              needleRef={needleRef}
              zones={[
                { from: 55, to: 75, color: "var(--color-good)" },
                { from: 75, to: 90, color: "var(--color-warn)" },
                { from: 90, to: COOK_MAX, color: "var(--color-bad)" },
              ]}
              legend={["덜 익음", "황금빛 · 진함 · 탐"]}
            />
          )}
          {(phase === "press" || phase === "flip") && (
            <Meter
              key="press"
              max={PRESS_MAX}
              needleRef={needleRef}
              zones={[
                { from: 0.75, to: 1.0, color: "var(--color-good)" },
                { from: 1.0, to: BURST_AT, color: "var(--color-warn)" },
                { from: BURST_AT, to: PRESS_MAX, color: "var(--color-bad)" },
              ]}
              legend={["동글동글", "딱 좋음 · 얇게 · 터짐"]}
            />
          )}

          <div className="flex flex-wrap justify-center gap-2.5">
            {phase === "pick" &&
              FILLING_KEYS.map((key) => (
                <button
                  key={key}
                  className={`btn btn-chip grow basis-[30%] ${filling === key ? "picked" : ""}`}
                  disabled={!!filling}
                  onClick={() => pickFilling(key)}
                >
                  <span className="mr-1.5 inline-block size-3 rounded-full align-[-1px]" style={{ background: FILLINGS[key].color }} />
                  {FILLINGS[key].name}
                  <small>{FILLINGS[key].type}</small>
                </button>
              ))}

            {/* the swipe is the main move, this is the backup */}
            {phase === "cookA" && (
              <button className="btn btn-ghost" onClick={flip}>
                버튼으로 뒤집기
              </button>
            )}

            {phase === "cookB" && (
              <button className="btn btn-big flex-1" onClick={takeOut}>
                꺼내기!
              </button>
            )}
          </div>
        </>
      )}

      {count > 0 && <p className="text-center text-[13px] tabular-nums text-ink-dim">오늘 구운 호떡 {count}장</p>}
    </div>
  );
}
