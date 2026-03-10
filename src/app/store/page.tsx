import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import StoreBanner from "@/components/StoreBanner";
import { getDealProducts, getBestProducts, getTimedealProducts } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "스마트홈딜 스토어",
  description: "스마트홈딜이 엄선한 최고의 제품을 만나보세요!",
};

const STORE_CATEGORIES = [
  {
    label: "주방",
    href: "/store/category/kitchen",
    bg: "#C0392B",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path d="M7 5v6a4 4 0 004 4h0a4 4 0 004-4V5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M11 5v16M15 5v16" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
        <path d="M19 7c0 0 1 2 1 5s-1 5-1 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      </svg>
    ),
  },
  {
    label: "청소",
    href: "/store/category/cleaning",
    bg: "#2980B9",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="13" r="7" stroke="white" strokeWidth="1.6"/>
        <circle cx="13" cy="13" r="3.5" stroke="white" strokeWidth="1.4" opacity="0.6"/>
        <path d="M13 4v2M13 20v2M4 13h2M20 13h2" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
  },
  {
    label: "TV·모니터",
    href: "/store/category/tv",
    bg: "#1A1A2E",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <rect x="3" y="5" width="20" height="13" rx="2" stroke="white" strokeWidth="1.6"/>
        <path d="M9 21h8M13 18v3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7 10h5M7 13h3" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.6"/>
        <rect x="15" y="9" width="5" height="5" rx="1" stroke="white" strokeWidth="1.2" opacity="0.7"/>
      </svg>
    ),
  },
  {
    label: "생활가전",
    href: "/store/category/living",
    bg: "#117A65",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path d="M13 4c-4 3-6 6-6 9a6 6 0 0012 0c0-3-2-6-6-9z" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M13 14v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
        <path d="M10 17h6" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
  },
  {
    label: "헬스·뷰티",
    href: "/store/category/health",
    bg: "#7D3C98",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path d="M13 6c0 0-2-3-5-2s-4 4-3 6 3 3 5 3l3 8 3-8c2 0 4-1 5-3s0-5-3-6-5 2-5 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "애플관",
    href: "/store/apple",
    bg: "#1C1C1E",
    icon: (
      <svg width="22" height="22" viewBox="0 0 28 28" fill="white">
        <path d="M22.5 17.9c-.5 1.1-1 2.1-1.8 3-.9 1.1-1.8 1.7-2.8 1.7-.7 0-1.6-.4-2.5-.8-.9-.4-1.8-.8-2.9-.8s-2 .4-2.9.8c-.9.4-1.8.8-2.6.8-1 0-2-.6-2.9-1.8-.9-1.1-1.7-2.6-2.2-4.2-.5-1.7-.8-3.3-.8-4.9 0-1.9.4-3.5 1.2-4.8.8-1.3 2-2 3.4-2 .8 0 1.7.4 2.7.8.9.4 1.6.6 2.1.6.5 0 1.2-.2 2.1-.7 1-.5 1.9-.7 2.8-.6 2.2.2 3.8 1.3 4.8 3.3-1.9 1.2-2.9 2.9-2.9 5.1 0 1.7.6 3.1 1.8 4.2.5.5 1.1.9 1.7 1.1-.1.4-.3.8-.5 1.2zM17.5 1c0 1.3-.5 2.5-1.4 3.6-.9 1-2 1.7-3.1 1.6 0-.1 0-.3 0-.5 0-1.2.5-2.4 1.4-3.4.9-1 2-1.5 3.1-1.5 0 .1 0 .1 0 .2z"/>
      </svg>
    ),
  },
  {
    label: "삼성관",
    href: "/store/samsung",
    bg: "#1034A6",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <rect x="6" y="5" width="14" height="16" rx="2" stroke="white" strokeWidth="1.6"/>
        <path d="M9 9h8M9 12h8M9 15h5" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.7"/>
        <circle cx="13" cy="18" r="0.8" fill="white" fillOpacity="0.6"/>
      </svg>
    ),
  },
  {
    label: "해외직구",
    href: "/store/overseas",
    bg: "#0D3B4A",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="13" r="9" stroke="white" strokeWidth="1.6"/>
        <path d="M13 4c0 0-4 3-4 9s4 9 4 9M13 4c0 0 4 3 4 9s-4 9-4 9" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.7"/>
        <path d="M4 13h18" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
        <path d="M5 9h16M5 17h16" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
  },
  {
    label: "전체보기",
    href: "/store/best",
    bg: "#636366",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <rect x="5" y="5" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.85"/>
        <rect x="15" y="5" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.85"/>
        <rect x="5" y="15" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.85"/>
        <rect x="15" y="15" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.85"/>
      </svg>
    ),
  },
];

export default async function StoreHomePage() {
  const [dealProducts, bestProducts, timedealProducts] = await Promise.all([
    getDealProducts(),
    getBestProducts(),
    getTimedealProducts(),
  ]);

  const SECTIONS = [
    {
      title: "공동구매",
      description: "스마트홈딜이 먼저 써보고 추천하는 최저가 공동구매",
      href: "/store/deal",
      products: dealProducts,
      accent: "특가",
    },
    {
      title: "이번주 인기",
      description: "이번주 가장 많이 팔린 인기 상품",
      href: "/store/best",
      products: bestProducts,
      accent: "인기",
    },
  ];

  return (
    <div>
      <StoreBanner type="storeHome" />
    <div className="mx-auto max-w-[1200px] pb-[80px] pt-[28px]">
      {/* 카테고리 아이콘 */}
      <div className="mb-[44px] px-[20px] lg:px-[30px]">
        <div className="mb-[16px] flex items-center justify-between">
          <p className="text-[11px] font-bold text-blue-7 tracking-[0.18em] uppercase">카테고리</p>
          <Link href="/store/best" className="text-[11px] text-gray-5 hover:text-blue-7 transition-colors">전체 →</Link>
        </div>
        <div className="scrollbar-hide flex gap-[16px] overflow-x-auto pb-[4px] lg:gap-[24px] lg:justify-center">
          {STORE_CATEGORIES.map(cat => (
            <Link key={cat.href} href={cat.href} className="shrink-0">
              <div className="flex flex-col items-center gap-[10px] group">
                <div
                  className="w-[64px] h-[64px] lg:w-[72px] lg:h-[72px] rounded-[18px] flex items-center justify-center transition-all duration-200 group-hover:scale-[1.06] group-hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.28)]"
                  style={{ background: cat.bg }}
                >
                  {cat.icon}
                </div>
                <span className="text-[11px] lg:text-[12px] font-semibold text-gray-7 text-center leading-tight group-hover:text-blue-7 transition-colors w-[64px] lg:w-[72px]">{cat.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 타임딜 미니 섹션 */}
      {timedealProducts.length > 0 && (
        <div className="mb-[56px]">
          <div className="mx-[20px] lg:mx-[30px] rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #1A0505 0%, #4A0E0E 60%, #7B1616 100%)' }}>
            {/* 헤더 */}
            <div className="flex items-center justify-between px-[20px] py-[20px] lg:px-[28px] lg:py-[24px]">
              <div className="flex items-center gap-[14px]">
                <div className="flex h-[44px] w-[44px] items-center justify-center rounded-xl bg-red-5/30">
                  <svg width="22" height="22" fill="none" stroke="#FF4D4D" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-[8px] mb-[2px]">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-red-4 uppercase">Limited</span>
                    <span className="px-[7px] py-[1px] rounded-full bg-red-5 text-[9px] font-bold text-white">오늘마감</span>
                  </div>
                  <h2 className="text-[22px] font-extrabold text-white tracking-tight leading-none lg:text-[26px]">타임딜</h2>
                </div>
              </div>
              <Link href="/store/timedeal" className="flex items-center gap-[4px] group">
                <span className="text-[13px] text-white/50 group-hover:text-white transition-colors">전체보기</span>
                <svg className="w-[13px] h-[13px] text-white/40 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>

            {/* 상품 그리드 */}
            <div className="grid grid-cols-2 gap-x-[8px] gap-y-[8px] px-[16px] pb-[20px] lg:grid-cols-4 lg:gap-x-[12px] lg:px-[20px] lg:pb-[24px]">
              {timedealProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 상품 섹션들 */}
      {SECTIONS.map((section) => (
        <div key={section.title} className="mb-[56px]">
          {/* 섹션 헤더 */}
          <div className="mb-[20px] px-[20px] lg:px-[30px] flex items-center justify-between">
            <div className="flex items-center gap-[14px]">
              <div className="w-[4px] h-[44px] rounded-full bg-blue-7 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-blue-7 tracking-[0.2em] uppercase mb-[3px]">
                  {section.accent}
                </p>
                <h2 className="text-[22px] font-extrabold text-gray-10 lg:text-[26px] tracking-tight leading-none">
                  {section.title}
                </h2>
              </div>
            </div>
            <Link href={section.href}>
              <div className="flex items-center gap-[4px] group pb-[2px]">
                <span className="text-[13px] text-gray-5 group-hover:text-blue-7 transition-colors">전체보기</span>
                <svg className="w-[13px] h-[13px] text-gray-4 group-hover:text-blue-7 transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>

          {/* 상품 그리드 */}
          <div className="grid grid-cols-2 gap-x-[10px] gap-y-[12px] px-[20px] lg:grid-cols-4 lg:gap-x-[16px] lg:gap-y-[20px] lg:px-[30px]">
            {section.products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}

      {/* 기획전 + 렌탈 배너 (2열) */}
      <div className="mb-[56px] px-[20px] lg:px-[30px] grid grid-cols-1 gap-[16px] lg:grid-cols-2">
        {/* 기획전 배너 */}
        <Link href="/store/exhibition" className="group">
          <div className="relative overflow-hidden rounded-2xl h-[160px] lg:h-[180px]" style={{ background: 'linear-gradient(135deg, #1A0E05 0%, #3D2009 100%)' }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #F5A623 0%, transparent 60%)' }} />
            <div className="absolute inset-0 flex flex-col justify-center px-[28px]">
              <span className="inline-flex items-center px-[10px] py-[4px] bg-amber-500 text-[11px] font-bold text-white rounded-full w-fit mb-[12px]">
                Special Exhibition
              </span>
              <h3 className="text-[22px] font-extrabold text-white leading-tight mb-[6px]">
                테마별 기획전
              </h3>
              <p className="text-[13px] text-gray-4">MacBook Pro · Mac Studio · Mac Pro 특가전</p>
            </div>
            <div className="absolute right-[20px] bottom-[20px] flex items-center gap-[4px] text-amber-400 group-hover:translate-x-[3px] transition-transform">
              <span className="text-[13px] font-semibold">보러가기</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* 렌탈 배너 */}
        <Link href="/store/rental" className="group">
          <div className="relative overflow-hidden rounded-2xl h-[160px] lg:h-[180px]" style={{ background: 'linear-gradient(135deg, #0D3822 0%, #1E6B3E 100%)' }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #6BE8A0 0%, transparent 60%)' }} />
            <div className="absolute inset-0 flex flex-col justify-center px-[28px]">
              <span className="inline-flex items-center px-[10px] py-[4px] bg-emerald-500 text-[11px] font-bold text-white rounded-full w-fit mb-[12px]">
                Rental
              </span>
              <h3 className="text-[22px] font-extrabold text-white leading-tight mb-[6px]">
                렌탈로 부담 없이
              </h3>
              <p className="text-[13px] text-emerald-200">월 소액 · 무상 AS · 무료 설치</p>
            </div>
            <div className="absolute right-[20px] bottom-[20px] flex items-center gap-[4px] text-emerald-300 group-hover:translate-x-[3px] transition-transform">
              <span className="text-[13px] font-semibold">보러가기</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* 브랜드관 섹션 */}
      <div className="mb-[56px] px-[20px] lg:px-[30px]">
        <div className="mb-[20px]">
          <p className="text-[11px] font-bold text-blue-7 tracking-[0.18em] uppercase mb-[6px]">BRAND</p>
          <h2 className="text-[24px] font-extrabold text-gray-10 lg:text-[28px] tracking-tight leading-none">
            브랜드관
          </h2>
          <p className="text-[13px] text-gray-5 mt-[6px]">브랜드별 전용관에서 특가 상품을 확인하세요</p>
        </div>
        <div className="grid grid-cols-2 gap-[12px] lg:grid-cols-4">
          {/* Apple */}
          <Link href="/store/apple" className="group">
            <div className="relative overflow-hidden rounded-2xl h-[120px] lg:h-[140px]" style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #2C2C2E 100%)' }}>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #5E5CE6 0%, transparent 60%)' }} />
              <div className="absolute inset-0 flex flex-col justify-end px-[16px] pb-[14px]">
                <svg width="22" height="22" viewBox="0 0 28 28" fill="white" className="mb-[8px] opacity-90">
                  <path d="M22.5 17.9c-.5 1.1-1 2.1-1.8 3-.9 1.1-1.8 1.7-2.8 1.7-.7 0-1.6-.4-2.5-.8-.9-.4-1.8-.8-2.9-.8s-2 .4-2.9.8c-.9.4-1.8.8-2.6.8-1 0-2-.6-2.9-1.8-.9-1.1-1.7-2.6-2.2-4.2-.5-1.7-.8-3.3-.8-4.9 0-1.9.4-3.5 1.2-4.8.8-1.3 2-2 3.4-2 .8 0 1.7.4 2.7.8.9.4 1.6.6 2.1.6.5 0 1.2-.2 2.1-.7 1-.5 1.9-.7 2.8-.6 2.2.2 3.8 1.3 4.8 3.3-1.9 1.2-2.9 2.9-2.9 5.1 0 1.7.6 3.1 1.8 4.2.5.5 1.1.9 1.7 1.1-.1.4-.3.8-.5 1.2zM17.5 1c0 1.3-.5 2.5-1.4 3.6-.9 1-2 1.7-3.1 1.6 0-.1 0-.3 0-.5 0-1.2.5-2.4 1.4-3.4.9-1 2-1.5 3.1-1.5 0 .1 0 .1 0 .2z"/>
                </svg>
                <p className="text-[15px] font-extrabold text-white">Apple</p>
                <p className="text-[11px] text-white/50 group-hover:text-white/70 transition-colors">MacBook · Mac</p>
              </div>
            </div>
          </Link>

          {/* Samsung */}
          <Link href="/store/samsung" className="group">
            <div className="relative overflow-hidden rounded-2xl h-[120px] lg:h-[140px]" style={{ background: 'linear-gradient(135deg, #0A1628 0%, #1034A6 100%)' }}>
              <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #42A5F5 0%, transparent 60%)' }} />
              <div className="absolute inset-0 flex flex-col justify-end px-[16px] pb-[14px]">
                <div className="w-[22px] h-[22px] mb-[8px] opacity-90 flex items-center">
                  <svg width="22" height="13" viewBox="0 0 50 14" fill="white">
                    <text x="0" y="12" fontFamily="sans-serif" fontSize="14" fontWeight="bold">SAMSUNG</text>
                  </svg>
                </div>
                <p className="text-[15px] font-extrabold text-white">Samsung</p>
                <p className="text-[11px] text-white/50 group-hover:text-white/70 transition-colors flex items-center gap-[4px]">Galaxy · TV
                  <span className="px-[5px] py-[1px] bg-white/20 rounded text-[9px]">준비중</span>
                </p>
              </div>
            </div>
          </Link>

          {/* 해외직구 */}
          <Link href="/store/overseas" className="group">
            <div className="relative overflow-hidden rounded-2xl h-[120px] lg:h-[140px]" style={{ background: 'linear-gradient(135deg, #0D1F2D 0%, #1A3A4A 100%)' }}>
              <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #26C6DA 0%, transparent 60%)' }} />
              <div className="absolute inset-0 flex flex-col justify-end px-[16px] pb-[14px]">
                <svg width="22" height="22" fill="none" stroke="white" strokeWidth={1.5} viewBox="0 0 24 24" className="mb-[8px] opacity-90">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[15px] font-extrabold text-white">해외직구</p>
                <p className="text-[11px] text-white/50 group-hover:text-white/70 transition-colors flex items-center gap-[4px]">미국·일본·유럽
                  <span className="px-[5px] py-[1px] bg-white/20 rounded text-[9px]">준비중</span>
                </p>
              </div>
            </div>
          </Link>

          {/* 전체보기 */}
          <Link href="/store/recommendation" className="group">
            <div className="relative overflow-hidden rounded-2xl h-[120px] lg:h-[140px] border-2 border-dashed border-gray-3 bg-gray-1 hover:border-blue-5 hover:bg-blue-1/30 transition-colors">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="text-gray-5 mb-[8px] group-hover:text-blue-7 transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <p className="text-[13px] font-semibold text-gray-6 group-hover:text-blue-7 transition-colors">전체 카테고리</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 왜 스마트홈딜? 섹션 */}
      <div className="mb-[56px] px-[20px] lg:px-[30px]">
        <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #0C1B2E 0%, #0F2A4A 60%, #0E3460 100%)' }}>
          <div className="px-[24px] py-[32px] lg:px-[48px] lg:py-[44px]">
            <div className="mb-[28px]">
              <p className="text-[10px] font-bold tracking-[0.22em] text-blue-4 uppercase mb-[8px]">WHY SMARTHOMDEAL</p>
              <h2 className="text-[22px] font-extrabold text-white lg:text-[26px] tracking-tight leading-tight">
                스마트홈딜을<br className="lg:hidden"/> 선택하는 이유
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-[12px] lg:grid-cols-4 lg:gap-[20px]">
              {[
                {
                  stat: '100%',
                  title: '정품 보장',
                  desc: '공식 인증 정품만 취급',
                  color: '#3B82F6',
                },
                {
                  stat: '최저가',
                  title: '가격 도전',
                  desc: '가격 비교 후 최저가 제공',
                  color: '#10B981',
                },
                {
                  stat: '당일',
                  title: '발송 보장',
                  desc: '오전 주문 시 당일 출고',
                  color: '#F59E0B',
                },
                {
                  stat: '24시',
                  title: '전문 상담',
                  desc: '구매 후 전담 AS 연결',
                  color: '#8B5CF6',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl px-[16px] py-[18px] lg:px-[20px] lg:py-[20px]" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <p className="text-[26px] font-extrabold mb-[4px] lg:text-[28px]" style={{ color: item.color }}>{item.stat}</p>
                  <p className="text-[13px] font-bold text-white mb-[3px]">{item.title}</p>
                  <p className="text-[11px] text-white/50 leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
