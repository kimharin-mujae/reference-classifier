import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "레퍼런스 자동 분류 도우미",
  description: "UI/UX 레퍼런스 이미지를 자동으로 분류하고 Notion에 저장합니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
