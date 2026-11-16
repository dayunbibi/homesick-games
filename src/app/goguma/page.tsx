import type { Metadata } from "next";
import MarketGame from "@/components/market/MarketGame";
export const metadata: Metadata = {
  title: "포잎이의 군고구마 가게",
  description: "포잎이 사장님이 되어 손님 주문대로 조리하고 판매하는 가게 게임",
};
export default function Page() {
  return <MarketGame kind="goguma" />;
}
