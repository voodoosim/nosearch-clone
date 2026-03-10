import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '해외직구관 — 스마트홈딜',
  description: '미국·일본·유럽 직구 — 관부가세 포함 최저가',
};

const COUNTRIES = [
  { flag: '🇺🇸', name: '미국', desc: 'Amazon · Best Buy · B&H', color: '#B22234' },
  { flag: '🇯🇵', name: '일본', desc: 'Yodobashi · Amazon JP', color: '#BC002D' },
  { flag: '🇩🇪', name: '독일/유럽', desc: 'Amazon DE · MediaMarkt', color: '#000000' },
  { flag: '🇬🇧', name: '영국', desc: 'John Lewis · Currys', color: '#012169' },
];

export default function OverseasStorePage() {
  return (
    <div>
      {/* 히어로 배너 */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0D1F2D 0%, #1A3A4A 70%, #2A4A5A 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 35%, #26C6DA 0%, transparent 55%), radial-gradient(circle at 15% 70%, #0097A7 0%, transparent 50%)' }}
        />
        <div className="relative mx-auto max-w-[1200px] px-[20px] lg:px-[30px] py-[56px] lg:py-[80px]">
          <div className="flex items-center gap-[10px] mb-[16px]">
            <span className="text-[13px] font-semibold text-white/60 tracking-[0.2em] uppercase">Global Direct</span>
          </div>
          <h1 className="text-[32px] lg:text-[48px] font-black text-white tracking-tight leading-none mb-[12px]">
            해외직구관
          </h1>
          <p className="text-[15px] lg:text-[17px] text-white/60">
            미국 · 일본 · 유럽 — 관부가세 포함 최저가 직구
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-[20px] pb-[100px] pt-[48px] lg:px-[30px]">

        {/* 직구 국가 미리보기 */}
        <div className="mb-[48px] grid grid-cols-2 gap-[12px] lg:grid-cols-4">
          {COUNTRIES.map((c) => (
            <div
              key={c.name}
              className="rounded-2xl overflow-hidden border border-gray-3 bg-gray-1 p-[20px] opacity-60"
            >
              <div className="text-[28px] mb-[10px]">{c.flag}</div>
              <p className="text-[15px] font-bold text-gray-9 mb-[4px]">{c.name}</p>
              <p className="text-[11px] text-gray-5">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* 준비중 */}
        <div className="flex flex-col items-center py-[48px] text-center border-t border-gray-3">
          <div
            className="w-[88px] h-[88px] rounded-2xl flex items-center justify-center mb-[24px]"
            style={{ background: 'linear-gradient(135deg, #0D1F2D 0%, #1A3A4A 100%)' }}
          >
            <svg width="40" height="40" fill="none" stroke="white" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-[22px] font-extrabold text-gray-10 mb-[8px]">해외직구관 오픈 준비 중</h2>
          <p className="text-[14px] text-gray-5 mb-[32px] leading-relaxed max-w-[340px]">
            미국·일본·유럽 최저가 직구 상품을 곧 선보입니다.<br />관부가세 포함 가격으로 투명하게 안내해 드립니다.
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
