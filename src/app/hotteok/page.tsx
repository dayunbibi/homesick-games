import type { Metadata } from "next";
import GameShell from "@/components/shared/GameShell";
import HotteokGame from "@/components/hotteok/HotteokGame";

export const metadata: Metadata = {
  title: "온라인 호떡 굽기",
  description: "속 고르고, 뒤집고, 누르개로 꾹. 너무 세게 누르면 꿀이 터져요.",
  openGraph: {
    title: "온라인 호떡 굽기",
    description: "누르개로 꾹! 꿀 안 터지게 시장 1등 호떡 도전",
    locale: "ko_KR",
    type: "website",
  },
};

export default function HotteokPage() {
  return (
    <GameShell
      accent="호떡"
      rest="굽기"
      price={
        <>
          호떡 1장 <b className="font-normal text-tarp">1,500원</b>
        </>
      }
    >
      <HotteokGame />
    </GameShell>
  );
}
