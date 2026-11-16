import type { Metadata, Viewport } from "next";
import "./globals.css";

// Vercel sets VERCEL_PROJECT_PRODUCTION_URL at build time, so the domain is never hardcoded.
// metadataBase makes the OG image URL absolute, which Threads/Kakao need for the preview.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "향수병 게임즈", template: "%s | 향수병 게임즈" },
  description: "토론토에서 한국이 그리워서 만드는 포잎이의 작은 인터넷 놀이터. 붕어빵 굽기, 향수병 포차, 김장하기, 호떡, 군고구마, 내 트리를 꾸며줘, AI 엄마 잔소리.",
  openGraph: {
    title: "향수병 게임즈",
    description: "포잎이의 작은 인터넷 놀이터 🍀 설치 없이 바로 하는 한국 감성 웹게임",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf6ec",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        {/* Korean display fonts. Loaded with a link tag because next/font only preloads latin subsets */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* root layout = every page, so this rule doesn't apply in the app router */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Gowun+Dodum&family=Jua&display=swap"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
