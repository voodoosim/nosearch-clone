'use client';

import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "./CountdownTimer";
import { useWishlist } from "./WishlistProvider";

interface Product {
  id: string;
  goodsNo: string;
  goodsNm: string;
  brandName: string;
  categoryName: string;
  goodsPrice: number;
  fixedPrice: number;
  imageUrl: string;
  pickType: string;
  soldOutFl: string;
  reviewAvg: number;
  reviewCnt: number;
  productCategoryKey?: string;
  periodDiscountEnd?: string;
  isTimedeal?: boolean;
}

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}

function getPickBadge(pickType: string): { label: string; className: string } | null {
  switch (pickType) {
    case "best":
      return { label: "BEST", className: "bg-blue-7 text-white" };
    case "cost_effective":
      return { label: "가성비", className: "bg-emerald-600 text-white" };
    case "plus":
      return { label: "PLUS", className: "bg-violet-600 text-white" };
    case "premium":
      return { label: "PREMIUM", className: "bg-yellow-800 text-white" };
    default:
      return null;
  }
}

export default function ProductCard({ product, rank }: { product: Product; rank?: number }) {
  const isSoldOut = product.soldOutFl === "y";
  const badge = getPickBadge(product.pickType);
  const discount = product.fixedPrice > product.goodsPrice
    ? Math.round(((product.fixedPrice - product.goodsPrice) / product.fixedPrice) * 100)
    : 0;

  const href = `/store/product/${product.goodsNo || product.id}`;
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.goodsNo || product.id);

  return (
    <Link href={href} className="block group">
      <article className="w-full overflow-hidden bg-white rounded-2xl border border-gray-2 transition-all duration-200 group-hover:-translate-y-[4px] group-hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.14)] group-hover:border-blue-4">
        {/* 이미지 영역 */}
        <div className="relative w-full bg-[#F7F5F0] overflow-hidden" style={{ aspectRatio: "1 / 1" }}>
          <Image
            src={product.imageUrl}
            alt={product.goodsNm}
            fill
            className={`object-contain p-[14px] transition-transform duration-300 group-hover:scale-[1.04] ${isSoldOut ? "opacity-35" : ""}`}
            sizes="(max-width: 1024px) 50vw, 300px"
          />

          {/* 랭킹 번호 */}
          {rank && !isSoldOut && (
            <div
              className="absolute top-[8px] left-[8px] w-[26px] h-[26px] flex items-center justify-center rounded-full text-[11px] font-extrabold text-white"
              style={{ background: rank <= 3 ? '#1E6B3E' : '#2A1F14' }}
            >
              {rank}
            </div>
          )}

          {/* 픽 뱃지 */}
          {badge && !isSoldOut && !rank && (
            <span className={`absolute top-[10px] left-[10px] px-[7px] py-[3px] text-[10px] font-bold tracking-wider rounded-sm ${badge.className}`}>
              {badge.label}
            </span>
          )}

          {/* 할인율 뱃지 */}
          {discount >= 10 && !isSoldOut && (
            <span className="absolute top-[10px] right-[10px] px-[8px] py-[3px] text-[11px] font-extrabold text-white rounded-md shadow-sm" style={{ background: '#C0392B' }}>
              -{discount}%
            </span>
          )}

          {/* 타이머 */}
          {!isSoldOut && product.periodDiscountEnd && (
            <div className="absolute bottom-0 left-0 right-0 py-[5px] text-center" style={{ background: 'rgba(42,31,20,0.82)' }}>
              <span className="text-[11px] font-bold text-white">
                <CountdownTimer endDate={product.periodDiscountEnd} />
              </span>
            </div>
          )}

          {/* 품절 */}
          {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
              <span className="text-[16px] font-bold text-white tracking-widest">SOLD OUT</span>
            </div>
          )}

          {/* 찜 버튼 */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(product);
            }}
            aria-label={wishlisted ? "찜 해제" : "찜하기"}
            className="absolute bottom-[8px] right-[8px] w-[32px] h-[32px] flex items-center justify-center rounded-full transition-all duration-150 hover:scale-110"
            style={{
              background: wishlisted ? 'rgba(220,38,38,0.12)' : 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={wishlisted ? '#DC2626' : 'none'}
              stroke={wishlisted ? '#DC2626' : '#9CA3AF'}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* 정보 영역 */}
        <div className="px-[12px] pt-[11px] pb-[14px] lg:px-[14px] lg:pt-[13px] lg:pb-[16px] border-t border-gray-1">
          {/* 브랜드 */}
          <p className="text-[10px] font-bold text-blue-6 uppercase tracking-widest mb-[4px]">
            {product.brandName}
          </p>

          {/* 상품명 */}
          <p className="text-[13px] lg:text-[14px] font-medium text-gray-9 leading-[1.45] line-clamp-2 mb-[9px]">
            {product.goodsNm}
          </p>

          {/* 리뷰 */}
          {product.reviewCnt > 0 && (
            <div className="flex items-center gap-[3px] mb-[8px]">
              <span className="text-[11px] text-amber-500">★</span>
              <span className="text-[11px] font-semibold text-gray-7">{product.reviewAvg.toFixed(1)}</span>
              <span className="text-[11px] text-gray-4">({product.reviewCnt.toLocaleString()})</span>
            </div>
          )}

          {/* 가격 */}
          <div className="flex items-baseline gap-[5px] flex-wrap">
            {discount > 0 && (
              <span className="text-[11px] text-gray-4 line-through">
                {formatPrice(product.fixedPrice)}
              </span>
            )}
            <span className={`text-[18px] lg:text-[19px] font-extrabold leading-none ${discount >= 20 ? 'text-red-5' : 'text-gray-10'}`}>
              {formatPrice(product.goodsPrice)}
              <span className="text-[12px] font-semibold ml-[1px] text-gray-7">원</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export type { Product };
