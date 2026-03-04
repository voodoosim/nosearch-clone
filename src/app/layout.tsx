import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import AuthProvider from "@/components/AuthProvider";
import { CartProvider } from "@/components/CartProvider";
import ChatWidget from "@/components/ChatWidget";
import "./globals.css";

const pretendard = localFont({
  src: [
    { path: '../fonts/Pretendard-Regular.custom.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Pretendard-Bold.custom.woff2', weight: '700', style: 'normal' },
    { path: '../fonts/Pretendard-ExtraBold.custom.woff2', weight: '800', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-pretendard',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "스마트홈딜 - 스마트한 소비자들의 최종 선택",
  description: "가전제품, 생활용품, 스마트홈 제품까지 최저가 비교, 추천, 구매까지 한 번에 결정하세요!",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    siteName: "스마트홈딜",
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
    <html lang="ko" className={pretendard.variable}>
      <body className={pretendard.className}>
        <AuthProvider>
          <CartProvider>
            {children}
            <ChatWidget />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
