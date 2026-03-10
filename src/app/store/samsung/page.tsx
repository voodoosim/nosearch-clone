import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '삼성관 — 스마트홈딜',
  description: '삼성 갤럭시, 가전, TV — 최저가 특가',
};

export default function SamsungStorePage() {
  return (
    <div>
      {/* 히어로 배너 */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0A1628 0%, #1034A6 70%, #1565C0 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle at 75% 30%, #42A5F5 0%, transparent 55%), radial-gradient(circle at 20% 70%, #1E88E5 0%, transparent 50%)' }}
        />
        <div className="relative mx-auto max-w-[1200px] px-[20px] lg:px-[30px] py-[56px] lg:py-[80px]">
          <div className="flex items-center gap-[10px] mb-[16px]">
            <span className="text-[13px] font-semibold text-white/60 tracking-[0.2em] uppercase">Samsung Store</span>
          </div>
          <h1 className="text-[32px] lg:text-[48px] font-black text-white tracking-tight leading-none mb-[12px]">
            삼성관
          </h1>
          <p className="text-[15px] lg:text-[17px] text-white/60">
            Galaxy · QLED · 가전 · 모니터
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-[20px] pb-[100px] pt-[64px] lg:px-[30px]">
        <div className="flex flex-col items-center py-[60px] text-center">
          {/* 준비중 아이콘 */}
          <div
            className="w-[88px] h-[88px] rounded-2xl flex items-center justify-center mb-[24px]"
            style={{ background: 'linear-gradient(135deg, #1034A6 0%, #1565C0 100%)' }}
          >
            <svg width="40" height="40" fill="none" stroke="white" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-[22px] font-extrabold text-gray-10 mb-[8px]">삼성관 오픈 준비 중</h2>
          <p className="text-[14px] text-gray-5 mb-[32px] leading-relaxed max-w-[320px]">
            Galaxy · QLED TV · 삼성 냉장고 · 세탁기 · 모니터<br />최저가 특가 상품을 곧 선보입니다.
          </p>
          <Link
            href="/store"
            className="inline-flex items-center gap-[6px] px-[20px] py-[10px] rounded-full bg-gray-2 text-[13px] font-semibold text-gray-7 hover:bg-gray-3 transition-colors"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            스토어 홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
