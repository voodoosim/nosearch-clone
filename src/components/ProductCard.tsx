import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "./CountdownTimer";

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
      return { label: "PREMIUM", className: "text-white", style: "background:#B8860B" };
    default:
      return null;
  }
}

export default function ProductCard({ product }: { product: Product }) {
  const isSoldOut = product.soldOutFl === "y";
  const badge = getPickBadge(product.pickType);
  const discount = product.fixedPrice > product.goodsPrice
    ? Math.round(((product.fixedPrice - product.goodsPrice) / product.fixedPrice) * 100)
    : 0;

  const href = `/store/product/${product.goodsNo || product.id}`;

  return (
    <Link href={href} className="block group">
      <article className="w-full overflow-hidden bg-white rounded-xl border border-gray-3/70 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:border-blue-5/30">
        {/* 이미지 영역 */}
        <div className="relative w-full bg-gray-1 overflow-hidden" style={{ aspectRatio: "1 / 1" }}>
          <Image
            src={product.imageUrl}
            alt={product.goodsNm}
            fill
            className={`object-contain p-[14px] transition-transform duration-300 group-hover:scale-[1.04] ${isSoldOut ? "opacity-35" : ""}`}
            sizes="(max-width: 1024px) 50vw, 300px"
          />

          {/* 뱃지 */}
          {badge && !isSoldOut && (
            <span
              className={`absolute top-[10px] left-[10px] px-[7px] py-[3px] text-[10px] font-bold tracking-wider rounded-sm ${badge.className}`}
              style={(badge as { label: string; className: string; style?: string }).style ? { background: '#B8860B' } : undefined}
            >
              {badge.label}
            </span>
          )}

          {/* 할인율 뱃지 */}
          {discount >= 5 && !isSoldOut && (
            <span className="absolute top-[10px] right-[10px] px-[7px] py-[3px] text-[10px] font-extrabold text-white rounded-sm bg-red-5">
              {discount}%
            </span>
          )}

          {/* 타이머 */}
          {!isSoldOut && product.periodDiscountEnd && (
            <div className="absolute bottom-0 left-0 right-0 bg-gray-10/80 py-[5px] text-center">
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
        </div>

        {/* 정보 영역 */}
        <div className="px-[12px] pt-[10px] pb-[14px] lg:px-[16px] lg:pt-[12px] lg:pb-[18px]">
          {/* 브랜드 */}
          <p className="text-[11px] font-medium text-blue-5 uppercase tracking-wide mb-[4px]">
            {product.brandName}
          </p>

          {/* 상품명 */}
          <p className="text-[13px] lg:text-[15px] font-semibold text-gray-9 leading-[1.45] line-clamp-2 mb-[10px] group-hover:text-blue-7 transition-colors">
            {product.goodsNm}
          </p>

          {/* 리뷰 */}
          {product.reviewCnt > 0 && (
            <div className="flex items-center gap-[4px] mb-[8px]">
              <span className="text-[11px] text-amber-500 font-bold">★ {product.reviewAvg.toFixed(1)}</span>
              <span className="text-[11px] text-gray-5">({product.reviewCnt.toLocaleString()})</span>
            </div>
          )}

          {/* 가격 */}
          <div className="flex items-baseline gap-[6px]">
            {discount > 0 && (
              <span className="text-[12px] text-gray-5 line-through">
                {formatPrice(product.fixedPrice)}원
              </span>
            )}
            <span className="text-[18px] lg:text-[20px] font-extrabold text-gray-10 leading-none">
              {formatPrice(product.goodsPrice)}
              <span className="text-[13px] font-semibold ml-[1px]">원</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export type { Product };
