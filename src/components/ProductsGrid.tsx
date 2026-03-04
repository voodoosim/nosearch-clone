'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import type { Product } from './ProductCard';
import { RECOMMENDATION_CATEGORIES } from '@/lib/products';

interface ProductsGridProps {
  products: Product[];
  showRanking?: boolean;
}

export default function ProductsGrid({ products, showRanking = false }: ProductsGridProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const availableCategories = RECOMMENDATION_CATEGORIES.filter(cat =>
    products.some(p => cat.keys.includes(p.productCategoryKey || ''))
  );

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => {
        const cat = RECOMMENDATION_CATEGORIES.find(c => c.key === activeCategory);
        return cat ? cat.keys.includes(p.productCategoryKey || '') : false;
      });

  return (
    <div>
      {/* 카테고리 필터 */}
      {availableCategories.length > 1 && (
        <div className="scrollbar-hide flex gap-[8px] overflow-x-auto pb-[4px] mb-[20px]">
          <button
            onClick={() => setActiveCategory('all')}
            className={`shrink-0 rounded-full px-[16px] py-[7px] text-[13px] font-semibold transition-all border ${
              activeCategory === 'all'
                ? 'bg-blue-7 text-white border-blue-7'
                : 'bg-gray-1 text-gray-7 border-gray-3 hover:border-gray-5 hover:text-gray-10'
            }`}
          >
            전체 <span className={`text-[11px] ml-[2px] ${activeCategory === 'all' ? 'opacity-70' : 'text-gray-5'}`}>{products.length}</span>
          </button>
          {availableCategories.map(cat => {
            const count = products.filter(p => cat.keys.includes(p.productCategoryKey || '')).length;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`shrink-0 rounded-full px-[16px] py-[7px] text-[13px] font-semibold transition-all border ${
                  activeCategory === cat.key
                    ? 'bg-blue-7 text-white border-blue-7'
                    : 'bg-gray-1 text-gray-7 border-gray-3 hover:border-gray-5 hover:text-gray-10'
                }`}
              >
                {cat.label} <span className={`text-[11px] ml-[2px] ${activeCategory === cat.key ? 'opacity-70' : 'text-gray-5'}`}>{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 상품 수 */}
      <p className="text-[12px] text-gray-5 mb-[20px]">
        총 <span className="font-semibold text-gray-7">{filtered.length}</span>개 상품
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-[12px] gap-y-[20px] lg:grid-cols-4 lg:gap-x-[20px] lg:gap-y-[36px]">
          {filtered.map((product, index) => (
            <ProductCard
              key={product.id}
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
