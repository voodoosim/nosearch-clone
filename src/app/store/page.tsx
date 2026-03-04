import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getDealProducts, getBestProducts } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "스마트홈딜 스토어",
  description: "스마트홈딜이 엄선한 최고의 제품을 만나보세요!",
};

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
    <div className="mx-auto max-w-[1200px] pb-[80px] pt-[32px]">
      {SECTIONS.map((section) => (
        <div key={section.title} className="mb-[60px]">
          {/* 섹션 헤더 — 초록 띠 */}
          <div className="mb-[24px] mx-[20px] lg:mx-[30px] rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #155530 0%, #257A48 100%)' }}>
            <div className="px-[20px] py-[20px] lg:px-[28px] lg:py-[24px] flex items-center justify-between">
              <div>
                <span className="inline-block text-[11px] font-bold tracking-[0.15em] uppercase mb-[6px]" style={{ color: '#86EFAC' }}>
                  {section.accent}
                </span>
                <h2 className="text-[22px] font-extrabold text-white lg:text-[26px] tracking-tight leading-none mb-[6px]">
                  {section.title}
                </h2>
                <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>{section.description}</p>
              </div>
              <Link href={section.href}>
                <div className="flex cursor-pointer items-center gap-[6px] rounded-xl px-[14px] py-[8px] transition-colors" style={{ background: 'rgba(255,255,255,0.12)' }}>
                  <p className="text-[13px] font-medium text-white">더보기</p>
                  <svg className="w-[14px] h-[14px] text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>

          {/* 상품 그리드 */}
          <div className="grid grid-cols-2 gap-x-[12px] gap-y-[16px] px-[20px] lg:grid-cols-4 lg:gap-x-[20px] lg:gap-y-[24px] lg:px-[30px]">
            {section.products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
