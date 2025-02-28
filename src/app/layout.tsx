// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

// 나눔스퀘어라운드 Bold 폰트 적용
const nanumSquareRound = localFont({
  src: "../../public/fonts/NanumSquareRoundEB.ttf",
  variable: "--font-nanum-square-round",
});

export const metadata: Metadata = {
  title: "거북이 놀이터",
  description: "거북이 놀이터 공식 홈페이지",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={nanumSquareRound.variable}>
      <body>{children}</body>
    </html>
  );
}
