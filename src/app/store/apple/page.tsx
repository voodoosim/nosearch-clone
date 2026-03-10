import type { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getProductsGroupedByCategory, getCategoryKeyLabel } from '@/lib/products';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '애플관 — 스마트홈딜',
  description: 'MacBook Pro, Mac Studio, Mac Pro, Mac mini — 애플 정품 최저가',
};

const CATEGORY_BG: Record<string, string> = {
  macbook_pro: '#1C1C1E',
  mac_studio: '#2C2C2E',
  mac_pro: '#3A3A3C',
  mac_mini: '#48484A',
};

export default async function AppleStorePage() {
  const groups = await getProductsGroupedByCategory();

  const totalCount = groups.reduce((s, g) => s + g.products.length, 0);

  return (
    <div>
      {/* 히어로 배너 */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0A0A0A 0%, #1C1C1E 60%, #2C2C2E 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 40%, #5E5CE6 0%, transparent 55%), radial-gradient(circle at 20% 80%, #30D158 0%, transparent 50%)' }}
        />
        <div className="relative mx-auto max-w-[1200px] px-[20px] lg:px-[30px] py-[56px] lg:py-[80px]">
          <div className="flex items-center gap-[10px] mb-[16px]">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="white">
              <path d="M22.5 17.9c-.5 1.1-1 2.1-1.8 3-.9 1.1-1.8 1.7-2.8 1.7-.7 0-1.6-.4-2.5-.8-.9-.4-1.8-.8-2.9-.8s-2 .4-2.9.8c-.9.4-1.8.8-2.6.8-1 0-2-.6-2.9-1.8-.9-1.1-1.7-2.6-2.2-4.2-.5-1.7-.8-3.3-.8-4.9 0-1.9.4-3.5 1.2-4.8.8-1.3 2-2 3.4-2 .8 0 1.7.4 2.7.8.9.4 1.6.6 2.1.6.5 0 1.2-.2 2.1-.7 1-.5 1.9-.7 2.8-.6 2.2.2 3.8 1.3 4.8 3.3-1.9 1.2-2.9 2.9-2.9 5.1 0 1.7.6 3.1 1.8 4.2.5.5 1.1.9 1.7 1.1-.1.4-.3.8-.5 1.2zM17.5 1c0 1.3-.5 2.5-1.4 3.6-.9 1-2 1.7-3.1 1.6 0-.1 0-.3 0-.5 0-1.2.5-2.4 1.4-3.4.9-1 2-1.5 3.1-1.5 0 .1 0 .1 0 .2z"/>
            </svg>
            <span className="text-[13px] font-semibold text-white/60 tracking-[0.2em] uppercase">Apple Store</span>
          </div>
          <h1 className="text-[32px] lg:text-[48px] font-black text-white tracking-tight leading-none mb-[12px]">
            애플관
          </h1>
          <p className="text-[15px] lg:text-[17px] text-white/60 mb-[8px]">
            MacBook Pro · Mac Studio · Mac Pro · Mac mini
          </p>
          <p className="text-[13px] text-white/40">총 {totalCount}개 상품</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-[20px] pb-[100px] pt-[40px] lg:px-[30px]">

        {/* 카테고리 빠른 이동 */}
        <div className="mb-[48px] flex gap-[10px] overflow-x-auto scrollbar-hide pb-[4px]">
          {groups.map(({ category }) => (
            <a key={category.key} href={`#cat-${category.key}`} className="shrink-0">
              <div
                className="flex items-center gap-[8px] px-[16px] py-[10px] rounded-full text-white text-[13px] font-semibold hover:opacity-80 transition-opacity"
                style={{ background: CATEGORY_BG[category.key] || '#1C1C1E' }}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </div>
            </a>
          ))}
        </div>

        {/* 카테고리별 섹션 */}
        {groups.map(({ category, products }, idx) => (
          <section key={category.key} id={`cat-${category.key}`} className={`mb-[64px] ${idx > 0 ? 'pt-[64px] border-t border-gray-3' : ''}`}>
            {/* 헤더 */}
            <div className="mb-[20px] flex items-end justify-between">
              <div>
                <div className="flex items-center gap-[10px] mb-[8px]">
                  <div
                    className="w-[44px] h-[44px] rounded-full flex items-center justify-center text-[20px]"
                    style={{ background: CATEGORY_BG[category.key] || '#1C1C1E' }}
                  >
                    {category.icon}
                  </div>
                  <h2 className="text-[22px] font-extrabold text-gray-10 lg:text-[26px] tracking-tight">
                    {category.label}
                  </h2>
                  <span className="text-[13px] text-gray-5">{products.length}개</span>
                </div>
                <p className="text-[13px] text-gray-6 ml-[54px]">{category.description}</p>
              </div>
              <Link
                href={`/store/recommendation/${category.key}`}
                className="flex items-center gap-[4px] text-[13px] text-gray-5 hover:text-blue-7 transition-colors shrink-0"
              >
                전체보기
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* 서브카테고리 태그 */}
            <div className="mb-[20px] flex flex-wrap gap-[6px] ml-[54px]">
              {category.keys.map((key) => {
                const count = products.filter((p) => p.productCategoryKey === key).length;
                if (count === 0) return null;
                return (
                  <span
                    key={key}
                    className="rounded-full bg-gray-2 px-[12px] py-[5px] text-[12px] font-medium text-gray-7"
                  >
                    {getCategoryKeyLabel(key)} ({count})
                  </span>
                );
              })}
            </div>

            {/* 상품 그리드 */}
            <div className="grid grid-cols-2 gap-x-[10px] gap-y-[12px] lg:grid-cols-4 lg:gap-x-[16px] lg:gap-y-[20px]">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}

        {/* 상품이 없을 때 */}
        {groups.length === 0 && (
          <div className="flex flex-col items-center py-[80px] text-center">
            <div className="w-[64px] h-[64px] rounded-full bg-gray-2 flex items-center justify-center mb-[16px]">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="text-gray-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-gray-7 mb-[8px]">상품 준비 중입니다</p>
            <p className="text-[13px] text-gray-5">곧 다양한 Apple 제품이 등록됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
