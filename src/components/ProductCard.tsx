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
      return { label: "PREMIUM", className: "bg-yellow-800 text-white" };
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
      <article className="w-full overflow-hidden bg-gray-1 rounded-2xl transition-all duration-200 group-hover:-translate-y-[3px] group-hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)]">
        {/* 이미지 영역 */}
        <div className="relative w-full bg-gray-2 overflow-hidden" style={{ aspectRatio: "1 / 1" }}>
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
        <div className="px-[12px] pt-[10px] pb-[14px] lg:px-[14px] lg:pt-[12px] lg:pb-[16px]">
          {/* 브랜드 */}
          <p className="text-[10px] font-semibold text-blue-7 uppercase tracking-widest mb-[4px] opacity-80">
            {product.brandName}
          </p>

          {/* 상품명 */}
          <p className="text-[13px] lg:text-[14px] font-medium text-gray-9 leading-[1.5] line-clamp-2 mb-[10px]">
            {product.goodsNm}
          </p>

          {/* 리뷰 */}
          {product.reviewCnt > 0 && (
            <div className="flex items-center gap-[3px] mb-[8px]">
              <span className="text-[11px] text-amber-500">★</span>
              <span className="text-[11px] font-semibold text-gray-7">{product.reviewAvg.toFixed(1)}</span>
              <span className="text-[11px] text-gray-5">({product.reviewCnt.toLocaleString()})</span>
            </div>
          )}

          {/* 가격 */}
          <div className="flex items-baseline gap-[5px]">
            {discount > 0 && (
              <span className="text-[11px] text-gray-4 line-through">
                {formatPrice(product.fixedPrice)}
              </span>
            )}
            <span className="text-[17px] lg:text-[18px] font-extrabold text-gray-10 leading-none">
              {formatPrice(product.goodsPrice)}
              <span className="text-[12px] font-medium ml-[1px]">원</span>
            </span>
            {discount > 0 && (
              <span className="text-[12px] font-bold text-blue-7">{discount}%</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

export type { Product };
