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
    label: "주방가전",
    href: "/store/recommendation/kitchen",
    bg: "#FF7A5C",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <rect x="5" y="12" width="16" height="9" rx="2" stroke="white" strokeWidth="1.6"/>
        <path d="M5 15h16" stroke="white" strokeWidth="1.3"/>
        <path d="M13 8v4M10 9.5l3-1.5 3 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 16h3M21 16h3" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "청소가전",
    href: "/store/recommendation/cleaning",
    bg: "#3DC0D1",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="17" r="5" stroke="white" strokeWidth="1.6"/>
        <path d="M13 12V5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M10 5h6" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="13" cy="17" r="2" fill="white" fillOpacity="0.35"/>
      </svg>
    ),
  },
  {
    label: "생활가전",
    href: "/store/recommendation/living",
    bg: "#34C48A",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <rect x="7" y="5" width="12" height="16" rx="2" stroke="white" strokeWidth="1.6"/>
        <rect x="10" y="8" width="6" height="4" rx="1" stroke="white" strokeWidth="1.3"/>
        <circle cx="13" cy="17" r="1.5" fill="white" fillOpacity="0.8"/>
        <path d="M10 21h6" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "계절가전",
    href: "/store/recommendation/seasonal",
    bg: "#F5A623",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="13" r="4" stroke="white" strokeWidth="1.6"/>
        <path d="M13 3v4M13 19v4M3 13h4M19 13h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6.2 6.2l2.8 2.8M17 17l2.8 2.8M6.2 19.8l2.8-2.8M17 9l2.8-2.8" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "건강·뷰티",
    href: "/store/recommendation/health",
    bg: "#C47AB0",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path d="M13 20s-8-5.5-8-10a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 4.5-8 10-8 10z" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M10 13h6M13 10v6" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "전체보기",
    href: "/store/recommendation",
    bg: "#8A9BB0",
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
        <p className="text-[11px] font-bold text-blue-7 tracking-[0.18em] uppercase mb-[16px]">카테고리</p>
        <div className="scrollbar-hide flex gap-[20px] overflow-x-auto pb-[4px] lg:justify-center">
          {STORE_CATEGORIES.map(cat => (
            <Link key={cat.href} href={cat.href} className="shrink-0">
              <div className="flex flex-col items-center gap-[10px] group">
                <div
                  className="w-[60px] h-[60px] lg:w-[68px] lg:h-[68px] rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-[1.08] group-hover:shadow-[0_6px_16px_-4px_rgba(0,0,0,0.22)]"
                  style={{ background: cat.bg }}
                >
                  {cat.icon}
                </div>
                <span className="text-[11px] lg:text-[12px] font-semibold text-gray-7 text-center leading-tight group-hover:text-blue-7 transition-colors">{cat.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 타임딜 미니 섹션 */}
      {timedealProducts.length > 0 && (
        <div className="mb-[56px] px-[20px] lg:px-[30px]">
          {/* 헤더 */}
          <div className="mb-[20px] flex items-end justify-between">
            <div>
              <p className="text-[11px] font-bold text-red-5 tracking-[0.18em] uppercase mb-[6px]">LIMITED</p>
              <h2 className="text-[24px] font-extrabold text-gray-10 lg:text-[28px] tracking-tight leading-none">
                타임딜
              </h2>
              <p className="text-[13px] text-gray-5 mt-[6px]">오늘만 이 가격, 한정 수량 특가</p>
            </div>
            <Link href="/store/timedeal">
              <div className="flex items-center gap-[4px] group pb-[2px]">
                <span className="text-[13px] text-gray-6 group-hover:text-red-5 transition-colors">전체보기</span>
                <svg className="w-[13px] h-[13px] text-gray-5 group-hover:text-red-5 transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>

          {/* D-day 띠 */}
          <div className="mb-[16px] flex items-center gap-[8px] rounded-xl bg-red-5 px-[16px] py-[10px]">
            <svg className="w-[16px] h-[16px] text-white shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" />
            </svg>
            <span className="text-[13px] font-bold text-white">오늘 자정까지 — 매일 자정 갱신</span>
            <span className="ml-auto text-[11px] font-medium text-red-1 opacity-80">수량 소진 시 조기 마감</span>
          </div>

          <div className="grid grid-cols-2 gap-x-[10px] gap-y-[12px] lg:grid-cols-4 lg:gap-x-[16px] lg:gap-y-[20px]">
            {timedealProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* 상품 섹션들 */}
      {SECTIONS.map((section) => (
        <div key={section.title} className="mb-[56px]">
          {/* 섹션 헤더 */}
          <div className="mb-[20px] px-[20px] lg:px-[30px] flex items-end justify-between">
            <div>
              <p className="text-[11px] font-bold text-blue-7 tracking-[0.18em] uppercase mb-[6px]">
                {section.accent}
              </p>
              <h2 className="text-[24px] font-extrabold text-gray-10 lg:text-[28px] tracking-tight leading-none">
                {section.title}
              </h2>
              <p className="text-[13px] text-gray-5 mt-[6px]">{section.description}</p>
            </div>
            <Link href={section.href}>
              <div className="flex items-center gap-[4px] group pb-[2px]">
                <span className="text-[13px] text-gray-6 group-hover:text-blue-7 transition-colors">전체보기</span>
                <svg className="w-[13px] h-[13px] text-gray-5 group-hover:text-blue-7 transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
            {/* 배경 패턴 */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #F5A623 0%, transparent 60%)' }} />
            <div className="absolute inset-0 flex flex-col justify-center px-[28px]">
              <span className="inline-flex items-center px-[10px] py-[4px] bg-amber-500 text-[11px] font-bold text-white rounded-full w-fit mb-[12px]">
                Special Exhibition
              </span>
              <h3 className="text-[22px] font-extrabold text-white leading-tight mb-[6px]">
                테마별 기획전
              </h3>
              <p className="text-[13px] text-gray-4">겨울 난방 · 홈케어 · 주방 특가전</p>
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
    </div>
    </div>
  );
}
