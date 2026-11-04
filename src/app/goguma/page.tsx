import type { Metadata } from "next";
import GameShell from "@/components/shared/GameShell";
import GogumaGame from "@/components/goguma/GogumaGame";

export const metadata: Metadata = {
  title: "온라인 군고구마",
  description: "드럼통 속 고구마 5개, 꿀 흐를 때 하나씩 꺼내기. 까맣게 되기 전에!",
  openGraph: {
    title: "온라인 군고구마",
    description: "꿀고구마 5개 다 건지기 도전!",
    locale: "ko_KR",
    type: "website",
  },
};

export default function GogumaPage() {
  return (
    <GameShell
      accent="군고구마"
      rest="굽기"
      price={
        <>
          한 봉지 <b className="font-normal text-tarp">5,000원</b>
        </>
      }
    >
      <GogumaGame />
    </GameShell>
  );
}
