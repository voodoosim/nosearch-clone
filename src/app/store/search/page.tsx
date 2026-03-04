'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect, useCallback } from 'react';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/components/ProductCard';

// 정렬 타입
type SortKey = 'popular' | 'newest' | 'price_asc' | 'price_desc';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'popular', label: '인기순' },
  { key: 'newest', label: '최신순' },
  { key: 'price_asc', label: '낮은가격순' },
  { key: 'price_desc', label: '높은가격순' },
];

const SUGGESTED_QUERIES = ['정수기', '로봇청소기', '식기세척기', '에어프라이어', '비데', '헤어드라이어'];

function sortProducts(products: Product[], sortKey: SortKey): Product[] {
  const arr = [...products];
  switch (sortKey) {
    case 'price_asc':
      return arr.sort((a, b) => a.goodsPrice - b.goodsPrice);
    case 'price_desc':
      return arr.sort((a, b) => b.goodsPrice - a.goodsPrice);
    case 'newest':
      return arr.sort((a, b) => (b.goodsNo || b.id).localeCompare(a.goodsNo || a.id));
    case 'popular':
    default:
      return arr.sort((a, b) => b.reviewCnt - a.reviewCnt);
  }
}

function SortDropdown({ value, onChange }: { value: SortKey; onChange: (key: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find((o) => o.key === value)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-[6px] rounded-xl border border-gray-3 bg-gray-1 px-[14px] py-[8px] text-[13px] font-medium text-gray-9 transition-colors hover:border-blue-5 hover:bg-gray-2"
      >
        <span>{current.label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 4l4 4 4-4" stroke="#6B5C4E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-[calc(100%+6px)] z-20 min-w-[130px] overflow-hidden rounded-xl border border-gray-3 bg-gray-1 shadow-[0_8px_24px_-6px_rgba(42,31,20,0.12)]">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  onChange(opt.key);
                  setOpen(false);
                }}
                className={`w-full px-[14px] py-[10px] text-left text-[13px] transition-colors hover:bg-gray-2 ${
                  opt.key === value ? 'font-bold text-blue-7' : 'font-medium text-gray-9'
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

function EmptyState({ query, onSuggest }: { query: string; onSuggest: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-[80px] text-center">
      {/* 아이콘 */}
      <div className="mb-[24px] flex h-[96px] w-[96px] items-center justify-center rounded-full bg-gray-2">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="18" cy="18" r="11" stroke="#A09080" strokeWidth="2.2" />
          <path d="M27 27l7 7" stroke="#A09080" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M14 18h8M18 14v8" stroke="#CEC3B4" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <p className="mb-[6px] text-[17px] font-bold text-gray-10">
        &ldquo;{query}&rdquo; 검색 결과가 없습니다
      </p>
      <p className="mb-[32px] text-[14px] leading-[1.6] text-gray-6">
        검색어를 다시 확인하거나<br />다른 검색어를 입력해보세요
      </p>

      {/* 추천 검색어 */}
      <div>
        <p className="mb-[12px] text-[12px] font-semibold uppercase tracking-widest text-gray-5">
          추천 검색어
        </p>
        <div className="flex flex-wrap justify-center gap-[8px]">
          {SUGGESTED_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => onSuggest(q)}
              className="rounded-xl border border-gray-3 bg-gray-1 px-[14px] py-[8px] text-[13px] font-medium text-gray-7 transition-colors hover:border-blue-5 hover:bg-blue-1 hover:text-blue-7"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NoQueryState() {
  return (
    <div className="flex flex-col items-center justify-center py-[80px] text-center">
      <div className="mb-[24px] flex h-[96px] w-[96px] items-center justify-center rounded-full bg-gray-2">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="18" cy="18" r="11" stroke="#A09080" strokeWidth="2.2" />
          <path d="M27 27l7 7" stroke="#A09080" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
      <p className="mb-[6px] text-[17px] font-bold text-gray-10">검색어를 입력해주세요</p>
      <p className="text-[14px] text-gray-6">상단 검색창에서 상품을 검색할 수 있습니다</p>
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q') || '';

  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('popular');

  // 검색 실행 (클라이언트에서 fetch)
  const runSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runSearch(q);
    setSortKey('popular');
  }, [q, runSearch]);

  const sorted = sortProducts(results, sortKey);

  const handleSuggest = (suggested: string) => {
    router.push(`/store/search?q=${encodeURIComponent(suggested)}`);
  };

  return (
    <div className="mx-auto max-w-[1200px] px-[20px] py-[32px]">
      {/* 헤더 영역 */}
      <div className="mb-[24px] flex flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
        <div>
          {q ? (
            <h1 className="text-[20px] font-bold text-gray-10">
              <span className="text-blue-7">&ldquo;{q}&rdquo;</span>{' '}
              <span className="text-gray-10">검색 결과</span>{' '}
              {!loading && (
                <span className="text-[15px] font-medium text-gray-6">
                  {results.length.toLocaleString()}개
                </span>
              )}
            </h1>
          ) : (
            <h1 className="text-[20px] font-bold text-gray-10">검색</h1>
          )}
        </div>

        {/* 정렬 드롭다운 — 결과가 있을 때만 */}
        {q && results.length > 0 && !loading && (
          <SortDropdown value={sortKey} onChange={setSortKey} />
        )}
      </div>

      {/* 구분선 */}
      {q && (
        <div className="mb-[24px] h-px bg-gray-3" />
      )}

      {/* 로딩 스켈레톤 */}
      {loading && (
        <div className="grid grid-cols-2 gap-[12px] lg:grid-cols-4 lg:gap-[20px]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-gray-3 bg-gray-1">
              <div className="skeleton-shimmer" style={{ aspectRatio: '1 / 1' }} />
              <div className="p-[12px]">
                <div className="skeleton-shimmer mb-[8px] h-[10px] w-[60px] rounded" />
                <div className="skeleton-shimmer mb-[6px] h-[13px] w-full rounded" />
                <div className="skeleton-shimmer h-[13px] w-[80%] rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 쿼리 없음 */}
      {!loading && !q && <NoQueryState />}

      {/* 결과 없음 */}
      {!loading && q && results.length === 0 && (
        <EmptyState query={q} onSuggest={handleSuggest} />
      )}

      {/* 결과 그리드 */}
      {!loading && sorted.length > 0 && (
        <div className="grid grid-cols-2 gap-[12px] lg:grid-cols-4 lg:gap-[20px]">
          {sorted.map((product) => (
            <ProductCard key={product.goodsNo || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1200px] px-[20px] py-[32px]">
          <div className="skeleton-shimmer mb-[24px] h-[28px] w-[240px] rounded-lg" />
          <div className="grid grid-cols-2 gap-[12px] lg:grid-cols-4 lg:gap-[20px]">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-gray-3 bg-gray-1">
                <div className="skeleton-shimmer" style={{ aspectRatio: '1 / 1' }} />
                <div className="p-[12px]">
                  <div className="skeleton-shimmer mb-[8px] h-[10px] w-[60px] rounded" />
                  <div className="skeleton-shimmer h-[26px] w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
