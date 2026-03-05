'use client';

import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/components/ProductCard';

interface Exhibition {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  bgFrom: string;
  bgTo: string;
  categoryNames: string[];
}

interface Props {
  exhibition: Exhibition;
  products: Product[];
  index: number;
}

const INITIAL_COUNT = 4;

export default function ExhibitionSectionClient({ exhibition, products, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const displayed = expanded ? products : products.slice(0, INITIAL_COUNT);
  const hasMore = products.length > INITIAL_COUNT;

  return (
    <section className="mb-[60px]">
      {/* 섹션 헤더 */}
      <div
        className="mb-[24px] rounded-[16px] px-[24px] py-[28px]"
        style={{ background: `linear-gradient(135deg, ${exhibition.bgFrom} 0%, ${exhibition.bgTo} 100%)` }}
      >
        <div className="flex items-start gap-[16px]">
          <div className="flex-1">
            <div className="mb-[8px] flex items-center gap-[8px]">
              <span
                className="inline-flex items-center rounded-full px-[10px] py-[4px] text-[12px] font-bold text-white"
                style={{ backgroundColor: exhibition.badgeColor }}
              >
                {exhibition.badge}
              </span>
              <span className="text-[12px] font-medium text-gray-5">
                #{String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <h2 className="text-[22px] font-extrabold text-gray-10 lg:text-[26px]">
              {exhibition.title}
            </h2>
            <p className="mt-[6px] text-[14px] text-gray-7">{exhibition.subtitle}</p>
          </div>
          <div className="hidden shrink-0 items-center gap-[6px] lg:flex">
            {exhibition.categoryNames.slice(0, 3).map((name) => (
              <span key={name} className="rounded-full border border-gray-3 bg-white px-[10px] py-[4px] text-[12px] font-medium text-gray-7">
                {name}
              </span>
            ))}
            {exhibition.categoryNames.length > 3 && (
              <span className="text-[12px] text-gray-5">+{exhibition.categoryNames.length - 3}</span>
            )}
          </div>
        </div>
      </div>

      {/* 상품 그리드 */}
      <div className="grid grid-cols-2 gap-x-[16px] gap-y-[24px] lg:grid-cols-4 lg:gap-x-[20px] lg:gap-y-[40px]">
        {displayed.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* 더보기 / 접기 버튼 */}
      {hasMore && (
        <div className="mt-[24px] flex justify-center">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex h-[44px] w-full max-w-[300px] items-center justify-center gap-[6px] rounded-[10px] border border-gray-3 bg-white text-[14px] font-semibold text-gray-8 hover:border-gray-5 hover:bg-gray-1 transition-colors"
          >
            {expanded ? (
              <>
                접기
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            ) : (
              <>
                {exhibition.title} 더보기 ({products.length - INITIAL_COUNT}개 더)
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
