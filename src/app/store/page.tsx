import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getDealProducts, getBestProducts } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "스마트홈딜 스토어",
  description: "스마트홈딜이 엄선한 최고의 제품을 만나보세요!",
};

const STORE_CATEGORIES = [
  { label: "주방가전", href: "/store/recommendation/kitchen", emoji: "🍳" },
  { label: "청소가전", href: "/store/recommendation/cleaning", emoji: "🧹" },
  { label: "생활가전", href: "/store/recommendation/living", emoji: "💧" },
  { label: "계절가전", href: "/store/recommendation/seasonal", emoji: "🌡️" },
  { label: "건강·뷰티", href: "/store/recommendation/health", emoji: "💆" },
  { label: "전체보기", href: "/store/recommendation", emoji: "☰" },
];

export default async function StoreHomePage() {
  const [dealProducts, bestProducts] = await Promise.all([
    getDealProducts(),
    getBestProducts(),
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
    <div className="mx-auto max-w-[1200px] pb-[80px] pt-[28px]">
      {/* 카테고리 아이콘 그리드 */}
      <div className="mb-[40px] px-[20px] lg:px-[30px]">
        <p className="text-[11px] font-bold text-blue-7 tracking-[0.18em] uppercase mb-[14px]">카테고리</p>
        <div className="grid grid-cols-6 gap-[8px] lg:gap-[12px]">
          {STORE_CATEGORIES.map(cat => (
            <Link key={cat.href} href={cat.href}>
              <div className="flex flex-col items-center gap-[8px] rounded-2xl border border-gray-3 bg-gray-1 py-[14px] px-[4px] transition-all hover:-translate-y-[2px] hover:border-blue-5 hover:shadow-[0_4px_12px_-2px_rgba(30,107,62,0.1)]">
                <span className="text-[22px] lg:text-[26px]">{cat.emoji}</span>
                <span className="text-[10px] lg:text-[12px] font-semibold text-gray-7 text-center leading-tight whitespace-nowrap">{cat.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

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
    </div>
  );
}
