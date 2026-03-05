'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/components/WishlistProvider';

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR');
}

export default function WishlistPage() {
  const { items, removeFromWishlist, totalCount } = useWishlist();

  return (
    <div className="max-w-[680px] mx-auto px-[20px] py-[32px] pb-[120px]">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-[28px]">
        <div className="flex items-center gap-[12px]">
          <Link href="/mypage" className="text-[14px] text-gray-6 hover:text-gray-10 transition-colors shrink-0">
            ← 마이페이지
          </Link>
          <span className="text-gray-3">|</span>
          <h1 className="text-[20px] font-bold text-gray-10">
            찜 목록
            {totalCount > 0 && (
              <span className="ml-[8px] text-[16px] font-medium text-gray-5">{totalCount}</span>
            )}
          </h1>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => items.forEach((item) => removeFromWishlist(item.goodsNo || item.id))}
            className="text-[13px] text-gray-5 hover:text-red-5 transition-colors"
          >
            전체 삭제
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <>
          <div className="flex flex-col items-center justify-center py-[72px] gap-[16px]">
            <div className="w-[72px] h-[72px] rounded-full bg-gray-2 flex items-center justify-center">
              <svg className="w-[36px] h-[36px] text-gray-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[16px] font-semibold text-gray-10 mb-[6px]">아직 찜한 상품이 없습니다</p>
              <p className="text-[13px] text-gray-5">상품 카드의 하트를 눌러 찜해보세요</p>
            </div>
            <Link href="/store" className="mt-[8px] px-[24px] py-[12px] bg-blue-7 text-white text-[14px] font-medium rounded-[8px] hover:bg-blue-6 transition-colors">
              쇼핑하러 가기
            </Link>
          </div>
        </>
      ) : (
        <ul className="flex flex-col gap-[12px]">
          {items.map((product) => {
            const discount =
              product.fixedPrice > product.goodsPrice
                ? Math.round(((product.fixedPrice - product.goodsPrice) / product.fixedPrice) * 100)
                : 0;

            return (
              <li key={product.goodsNo || product.id} className="flex items-center gap-[14px] p-[14px] border border-gray-3 rounded-[14px] bg-gray-1 hover:border-blue-4 transition-colors">
                <Link href={`/store/product/${product.goodsNo || product.id}`} className="shrink-0">
                  <div className="relative w-[72px] h-[72px] rounded-[10px] overflow-hidden border border-gray-2" style={{ background: '#F5F1EB' }}>
                    <Image src={product.imageUrl} alt={product.goodsNm} fill className="object-contain p-[6px]" sizes="72px" />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-blue-7 uppercase tracking-wider mb-[3px]">{product.brandName}</p>
                  <Link href={`/store/product/${product.goodsNo || product.id}`}>
                    <p className="text-[13px] font-medium text-gray-9 line-clamp-2 leading-[1.45] mb-[8px] hover:text-blue-7 transition-colors">
                      {product.goodsNm}
                    </p>
                  </Link>
                  <div className="flex items-baseline gap-[5px]">
                    {discount > 0 && (
                      <>
                        <span className="text-[11px] font-bold text-red-5">{discount}%</span>
                        <span className="text-[11px] text-gray-4 line-through">{formatPrice(product.fixedPrice)}</span>
                      </>
                    )}
                    <span className="text-[15px] font-extrabold text-gray-10">
                      {formatPrice(product.goodsPrice)}
                      <span className="text-[11px] font-medium ml-[1px]">원</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeFromWishlist(product.goodsNo || product.id)}
                  className="shrink-0 w-[32px] h-[32px] flex items-center justify-center rounded-full text-red-4 hover:text-red-6 hover:bg-red-5/10 transition-colors"
                  aria-label="찜 해제"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={0}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
