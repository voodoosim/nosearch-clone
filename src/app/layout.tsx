import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "노써치 - 똑똑한 소비자들의 최종 선택",
  description: "정보의 홍수에 지친 소비자들을 위한 필수 앱! 비싸서 고민되는 가전제품, 육아용품, 매일 쓰는 생활용품까지 성능비교, 추천, 구매까지 한 번에 결정하세요!",
  openGraph: {
    siteName: "노써치",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
        />
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.5/dist/web/static/pretendard-dynamic-subset.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
