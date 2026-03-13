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

const PAGE_SIZE = 12;

export default function ProductsGrid({ products, showRanking = false }: ProductsGridProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('popular');
  const [page, setPage] = useState(1);

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
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 카테고리/정렬 바뀌면 1페이지로 복귀
  const handleCategory = (key: string) => { setActiveCategory(key); setPage(1); };
  const handleSort = (key: SortKey) => { setSortKey(key); setPage(1); };

  // 페이지 번호 범위 계산
  const pageRange = () => {
    const delta = 2;
    const range: number[] = [];
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) range.push(i);
    return range;
  };

  return (
    <div>
      {/* 카테고리 필터 + 정렬 */}
      <div className="flex items-center justify-between gap-[8px] mb-[20px]">
        {availableCategories.length > 1 ? (
          <div className="scrollbar-hide flex gap-[8px] overflow-x-auto pb-[4px] flex-1">
            <button
              onClick={() => handleCategory('all')}
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
                  onClick={() => handleCategory(cat.key)}
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
        {!showRanking && <SortDropdown value={sortKey} onChange={handleSort} />}
      </div>

      {/* 상품 수 */}
      <p className="text-[12px] text-gray-5 mb-[16px]">
        총 <span className="font-semibold text-gray-7">{sorted.length}</span>개 상품
        {totalPages > 1 && (
          <span className="ml-[8px] text-gray-4">· {page}/{totalPages} 페이지</span>
        )}
      </p>

      {paginated.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-x-[12px] gap-y-[20px] lg:grid-cols-4 lg:gap-x-[20px] lg:gap-y-[36px]">
            {paginated.map((product, index) => (
              <ProductCard
                key={product.goodsNo || product.id}
                product={product}
                rank={showRanking ? (page - 1) * PAGE_SIZE + index + 1 : undefined}
              />
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-[40px] flex items-center justify-center gap-[6px]">
              {/* 이전 */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-gray-3 bg-gray-2 text-gray-6 transition-colors hover:border-blue-7 hover:text-blue-7 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* 첫 페이지 */}
              {pageRange()[0] > 1 && (
                <>
                  <button onClick={() => setPage(1)} className="flex h-[36px] min-w-[36px] items-center justify-center rounded-[8px] border border-gray-3 bg-gray-2 px-[10px] text-[13px] font-medium text-gray-6 hover:border-blue-7 hover:text-blue-7 transition-colors">1</button>
                  {pageRange()[0] > 2 && <span className="text-gray-5 text-[12px] px-[2px]">...</span>}
                </>
              )}

              {/* 페이지 번호 */}
              {pageRange().map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`flex h-[36px] min-w-[36px] items-center justify-center rounded-[8px] border px-[10px] text-[13px] font-semibold transition-colors ${
                    n === page
                      ? 'border-blue-7 bg-blue-7 text-white'
                      : 'border-gray-3 bg-gray-2 text-gray-6 hover:border-blue-7 hover:text-blue-7'
                  }`}
                >
                  {n}
                </button>
              ))}

              {/* 마지막 페이지 */}
              {pageRange()[pageRange().length - 1] < totalPages && (
                <>
                  {pageRange()[pageRange().length - 1] < totalPages - 1 && <span className="text-gray-5 text-[12px] px-[2px]">...</span>}
                  <button onClick={() => setPage(totalPages)} className="flex h-[36px] min-w-[36px] items-center justify-center rounded-[8px] border border-gray-3 bg-gray-2 px-[10px] text-[13px] font-medium text-gray-6 hover:border-blue-7 hover:text-blue-7 transition-colors">{totalPages}</button>
                </>
              )}

              {/* 다음 */}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-gray-3 bg-gray-2 text-gray-6 transition-colors hover:border-blue-7 hover:text-blue-7 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-[100px] text-center">
          <div className="w-[64px] h-[64px] rounded-full bg-gray-2 flex items-center justify-center mb-[16px]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="10.5" cy="10.5" r="8" stroke="#888898" strokeWidth="1.5" />
              <path d="M16 16L22 22" stroke="#888898" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-[14px] text-gray-5">해당 카테고리 상품이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
