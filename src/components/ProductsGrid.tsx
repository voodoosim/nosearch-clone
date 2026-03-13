'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import type { Product } from './ProductCard';
import { RECOMMENDATION_CATEGORIES } from '@/lib/products';

type SortKey = 'popular' | 'newest' | 'price_asc' | 'price_desc' | 'discount';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'popular', label: '인기순' },
  { key: 'newest', label: '최신순' },
  { key: 'price_asc', label: '낮은가격' },
  { key: 'price_desc', label: '높은가격' },
  { key: 'discount', label: '높은할인율' },
];

function sortProducts(products: Product[], key: SortKey): Product[] {
  const arr = [...products];
  switch (key) {
    case 'price_asc':
      return arr.sort((a, b) => a.goodsPrice - b.goodsPrice);
    case 'price_desc':
      return arr.sort((a, b) => b.goodsPrice - a.goodsPrice);
    case 'newest':
      return arr.sort((a, b) => (b.goodsNo || b.id).localeCompare(a.goodsNo || a.id));
    case 'discount':
      return arr.sort((a, b) => {
        const da = a.fixedPrice > 0 ? (a.fixedPrice - a.goodsPrice) / a.fixedPrice : 0;
        const db = b.fixedPrice > 0 ? (b.fixedPrice - b.goodsPrice) / b.fixedPrice : 0;
        return db - da;
      });
    case 'popular':
    default:
      return arr.sort((a, b) => b.reviewCnt - a.reviewCnt);
  }
}

function SortDropdown({ value, onChange }: { value: SortKey; onChange: (k: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find((o) => o.key === value)!;

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-[5px] rounded-full border border-gray-3 bg-gray-1 px-[13px] py-[6px] text-[12px] font-semibold text-gray-7 hover:border-blue-5 hover:text-blue-7 transition-colors"
      >
        {current.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-[calc(100%+5px)] z-20 min-w-[110px] overflow-hidden rounded-xl border border-gray-3 bg-gray-1 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.5)]">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  onChange(opt.key);
                  setOpen(false);
                }}
                className={`w-full px-[14px] py-[9px] text-left text-[12px] transition-colors hover:bg-gray-1 ${
                  opt.key === value ? 'font-bold text-blue-7' : 'font-medium text-gray-8'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface ProductsGridProps {
  products: Product[];
  showRanking?: boolean;
}

export default function ProductsGrid({ products, showRanking = false }: ProductsGridProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('popular');

  const availableCategories = RECOMMENDATION_CATEGORIES.filter((cat) =>
    products.some((p) => cat.keys.includes(p.productCategoryKey || ''))
  );

  const filtered =
    activeCategory === 'all'
      ? products
      : products.filter((p) => {
          const cat = RECOMMENDATION_CATEGORIES.find((c) => c.key === activeCategory);
          return cat ? cat.keys.includes(p.productCategoryKey || '') : false;
        });

  const sorted = showRanking ? filtered : sortProducts(filtered, sortKey);

  return (
    <div>
      {/* 카테고리 필터 + 정렬 */}
      <div className="flex items-center justify-between gap-[8px] mb-[20px]">
        {/* 카테고리 칩 */}
        {availableCategories.length > 1 ? (
          <div className="scrollbar-hide flex gap-[8px] overflow-x-auto pb-[4px] flex-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`shrink-0 rounded-full px-[14px] py-[6px] text-[12px] font-semibold transition-all border ${
                activeCategory === 'all'
                  ? 'bg-blue-7 text-white border-blue-7'
                  : 'bg-gray-1 text-gray-7 border-gray-3 hover:border-gray-5 hover:text-gray-10'
              }`}
            >
              전체{' '}
              <span className={`text-[10px] ml-[1px] ${activeCategory === 'all' ? 'opacity-70' : 'text-gray-5'}`}>
                {products.length}
              </span>
            </button>
            {availableCategories.map((cat) => {
              const count = products.filter((p) => cat.keys.includes(p.productCategoryKey || '')).length;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`shrink-0 rounded-full px-[14px] py-[6px] text-[12px] font-semibold transition-all border ${
                    activeCategory === cat.key
                      ? 'bg-blue-7 text-white border-blue-7'
                      : 'bg-gray-1 text-gray-7 border-gray-3 hover:border-gray-5 hover:text-gray-10'
                  }`}
                >
                  {cat.label}{' '}
                  <span className={`text-[10px] ml-[1px] ${activeCategory === cat.key ? 'opacity-70' : 'text-gray-5'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* 정렬 드롭다운 (랭킹 모드에서는 숨김) */}
        {!showRanking && <SortDropdown value={sortKey} onChange={setSortKey} />}
      </div>

      {/* 상품 수 */}
      <p className="text-[12px] text-gray-5 mb-[16px]">
        총 <span className="font-semibold text-gray-7">{filtered.length}</span>개 상품
      </p>

      {sorted.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-[12px] gap-y-[20px] lg:grid-cols-4 lg:gap-x-[20px] lg:gap-y-[36px]">
          {sorted.map((product, index) => (
            <ProductCard
              key={product.goodsNo || product.id}
              product={product}
              rank={showRanking ? index + 1 : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-[100px] text-center">
          <div className="w-[64px] h-[64px] rounded-full bg-gray-2 flex items-center justify-center mb-[16px]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="10.5" cy="10.5" r="8" stroke="#A09080" strokeWidth="1.5" />
              <path d="M16 16L22 22" stroke="#A09080" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-[14px] text-gray-5">해당 카테고리 상품이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
