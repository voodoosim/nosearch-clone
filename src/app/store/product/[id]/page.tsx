import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import bestProducts from '@/data/products-best.json';
import dealProducts from '@/data/products-deal.json';
import timedealProducts from '@/data/products-timedeal.json';
import reviewProducts from '@/data/products-review.json';

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

function getAllProducts(): Product[] {
  const all = [
    ...(bestProducts as Product[]),
    ...(dealProducts as Product[]),
    ...(timedealProducts as Product[]),
    ...(reviewProducts as Product[]),
  ];
  const seen = new Set<string>();
  return all.filter((p) => {
    const key = p.goodsNo || p.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR');
}

function getPickLabel(pickType: string): string {
  switch (pickType) {
    case 'best':
      return '베스트픽';
    case 'cost_effective':
      return '가성비픽';
    case 'plus':
      return 'PLUS픽';
    case 'premium':
      return '프리미엄픽';
    default:
      return '';
  }
}

function getPickColor(pickType: string): string {
  switch (pickType) {
    case 'best':
      return 'bg-blue-7 text-white';
    case 'cost_effective':
      return 'bg-green-600 text-white';
    case 'plus':
      return 'bg-purple-600 text-white';
    case 'premium':
      return 'bg-amber-600 text-white';
    default:
      return '';
  }
}

function StarRating({ avg, cnt }: { avg: number; cnt: number }) {
  if (cnt === 0) return null;
  const fullStars = Math.floor(avg);
  const hasHalf = avg - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-[6px]">
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <svg key={`full-${i}`} className="w-[16px] h-[16px] text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {hasHalf && (
          <svg className="w-[16px] h-[16px] text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
            <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <svg key={`empty-${i}`} className="w-[16px] h-[16px] text-gray-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-[14px] font-bold text-amber-500">{avg.toFixed(1)}</span>
      <span className="text-[13px] text-gray-6">({cnt.toLocaleString('ko-KR')}개 리뷰)</span>
    </div>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const products = getAllProducts();
  const product = products.find((p) => p.goodsNo === id || p.id === id);

  if (!product) notFound();

  const isSoldOut = product.soldOutFl === 'y';
  const discount =
    product.fixedPrice > product.goodsPrice
      ? Math.round(((product.fixedPrice - product.goodsPrice) / product.fixedPrice) * 100)
      : 0;
  const pickLabel = getPickLabel(product.pickType);
  const pickColor = getPickColor(product.pickType);

  return (
    <div className="mx-auto max-w-[1200px] px-[20px] py-[24px] pb-[80px] lg:px-[30px] lg:py-[40px] lg:pb-[40px]">
      {/* 브레드크럼 */}
      <nav className="mb-[20px] flex items-center gap-[6px] text-[13px] text-gray-6">
        <Link href="/store" className="hover:text-blue-7 transition-colors">
          스토어
        </Link>
        <span>/</span>
        <span className="text-gray-9">{product.categoryName}</span>
      </nav>

      {/* 메인 콘텐츠 — 모바일: 1컬럼, 데스크탑: 2컬럼 */}
      <div className="flex flex-col gap-[24px] lg:flex-row lg:gap-[48px]">
        {/* 이미지 영역 */}
        <div className="w-full lg:w-[520px] lg:shrink-0">
          <div className="relative w-full bg-white border border-gray-3" style={{ aspectRatio: '1 / 1' }}>
            <Image
              src={product.imageUrl}
              alt={product.goodsNm}
              fill
              className={`object-contain p-[24px] ${isSoldOut ? 'opacity-40' : ''}`}
              sizes="(max-width: 1024px) 100vw, 520px"
              priority
            />
            {isSoldOut && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="text-[24px] font-bold text-white">SOLD OUT</span>
              </div>
            )}
          </div>
        </div>

        {/* 상품 정보 영역 */}
        <div className="flex flex-1 flex-col">
          {/* 카테고리 + 픽 뱃지 */}
          <div className="flex items-center gap-[8px] mb-[8px]">
            <span className="text-[13px] text-gray-6">{product.categoryName}</span>
            {pickLabel && (
              <span className={`inline-flex items-center px-[8px] py-[2px] text-[11px] font-bold rounded-sm ${pickColor}`}>
                {pickLabel}
              </span>
            )}
            {product.isTimedeal && (
              <span className="inline-flex items-center px-[8px] py-[2px] text-[11px] font-bold rounded-sm bg-red-5 text-white">
                타임딜
              </span>
            )}
          </div>

          {/* 브랜드명 */}
          <p className="text-[15px] font-semibold text-blue-7 mb-[4px]">{product.brandName}</p>

          {/* 상품명 */}
          <h1 className="text-[20px] font-bold leading-[1.4] text-gray-10 mb-[16px] lg:text-[22px]">
            {product.goodsNm}
          </h1>

          {/* 리뷰 */}
          {product.reviewCnt > 0 && (
            <div className="mb-[16px]">
              <StarRating avg={product.reviewAvg} cnt={product.reviewCnt} />
            </div>
          )}

          {/* 구분선 */}
          <div className="border-t border-gray-3 pt-[20px] mb-[20px]">
            {/* 가격 영역 */}
            {discount > 0 && (
              <div className="flex items-center gap-[8px] mb-[6px]">
                <span
                  className="inline-flex items-center px-[8px] py-[3px] text-[12px] font-extrabold text-white leading-none"
                  style={{ backgroundColor: '#FF455B' }}
                >
                  {discount}% 할인
                </span>
                <span className="text-[15px] text-gray-5 line-through">
                  {formatPrice(product.fixedPrice)}원
                </span>
              </div>
            )}
            <p className="text-[32px] font-extrabold text-gray-10 leading-none">
              {formatPrice(product.goodsPrice)}
              <span className="text-[20px] font-bold ml-[2px]">원</span>
            </p>
            {discount > 0 && (
              <p className="mt-[6px] text-[13px] text-gray-6">
                최저가 이하 공동구매 특가
              </p>
            )}
          </div>

          {/* 상품 기본 정보 */}
          <div className="bg-gray-1 rounded-[8px] px-[16px] py-[14px] mb-[24px]">
            <dl className="flex flex-col gap-[8px]">
              <div className="flex gap-[12px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[56px]">브랜드</dt>
                <dd className="text-[13px] text-gray-10 font-medium">{product.brandName}</dd>
              </div>
              <div className="flex gap-[12px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[56px]">카테고리</dt>
                <dd className="text-[13px] text-gray-10">{product.categoryName}</dd>
              </div>
              {product.productCategoryKey && (
                <div className="flex gap-[12px]">
                  <dt className="text-[13px] text-gray-6 shrink-0 w-[56px]">상품코드</dt>
                  <dd className="text-[13px] text-gray-10">{product.goodsNo}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* 구매하기 버튼 */}
          <div className="flex flex-col gap-[10px]">
            {isSoldOut ? (
              <button
                disabled
                className="w-full py-[16px] text-[16px] font-bold text-gray-5 bg-gray-3 rounded-[8px] cursor-not-allowed"
              >
                품절
              </button>
            ) : (
              <button className="w-full py-[16px] text-[16px] font-bold text-white bg-blue-7 rounded-[8px] hover:bg-blue-6 active:bg-blue-7 transition-colors">
                구매하기
              </button>
            )}
            <button className="w-full py-[14px] text-[15px] font-semibold text-blue-7 border-2 border-blue-7 rounded-[8px] hover:bg-blue-1 transition-colors">
              찜하기
            </button>
          </div>

          {/* 배송 안내 */}
          <div className="mt-[20px] pt-[20px] border-t border-gray-3">
            <dl className="flex flex-col gap-[8px]">
              <div className="flex gap-[12px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[56px]">배송</dt>
                <dd className="text-[13px] text-gray-10">무료배송 · 오늘 출발</dd>
              </div>
              <div className="flex gap-[12px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[56px]">반품</dt>
                <dd className="text-[13px] text-gray-10">수령 후 7일 이내</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* 상품 설명 섹션 */}
      <div className="mt-[48px]">
        <div className="border-b border-gray-3 mb-[32px]">
          <div className="inline-block border-b-2 border-gray-10 pb-[12px]">
            <span className="text-[16px] font-bold text-gray-10">상품 설명</span>
          </div>
        </div>

        <div className="bg-blue-1 rounded-[12px] p-[24px] lg:p-[32px]">
          <div className="flex flex-col gap-[16px]">
            <div>
              <p className="text-[18px] font-extrabold text-gray-10 mb-[8px]">
                스마트홈딜이 추천하는 {product.categoryName}
              </p>
              <p className="text-[15px] text-gray-9 leading-[1.7]">
                전문가가 직접 사용하고 엄선한 {product.brandName}의 {product.categoryName} 제품입니다.
                수많은 제품 중 성능, 가성비, 내구성을 종합 평가하여 추천합니다.
              </p>
            </div>

            <div className="border-t border-gray-3 pt-[16px]">
              <p className="text-[14px] font-bold text-gray-9 mb-[10px]">이 상품을 추천하는 이유</p>
              <ul className="flex flex-col gap-[8px]">
                <li className="flex items-start gap-[8px]">
                  <span className="mt-[2px] text-blue-7 shrink-0">&#10003;</span>
                  <span className="text-[14px] text-gray-9">스마트홈딜 전문가 직접 테스트 및 검증 완료</span>
                </li>
                <li className="flex items-start gap-[8px]">
                  <span className="mt-[2px] text-blue-7 shrink-0">&#10003;</span>
                  <span className="text-[14px] text-gray-9">합리적인 가격 대비 뛰어난 성능</span>
                </li>
                {product.reviewCnt > 0 && (
                  <li className="flex items-start gap-[8px]">
                    <span className="mt-[2px] text-blue-7 shrink-0">&#10003;</span>
                    <span className="text-[14px] text-gray-9">
                      실제 구매자 {product.reviewCnt.toLocaleString('ko-KR')}명의 평균 {product.reviewAvg.toFixed(1)}점 높은 만족도
                    </span>
                  </li>
                )}
                {discount >= 20 && (
                  <li className="flex items-start gap-[8px]">
                    <span className="mt-[2px] text-blue-7 shrink-0">&#10003;</span>
                    <span className="text-[14px] text-gray-9">
                      정가 대비 {discount}% 할인된 공동구매 특가
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 리뷰 섹션 */}
      {product.reviewCnt > 0 && (
        <div className="mt-[48px]">
          <div className="border-b border-gray-3 mb-[24px]">
            <div className="inline-block border-b-2 border-gray-10 pb-[12px]">
              <span className="text-[16px] font-bold text-gray-10">
                리뷰 {product.reviewCnt.toLocaleString('ko-KR')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-[24px] bg-gray-1 rounded-[12px] p-[24px]">
            <div className="text-center">
              <p className="text-[36px] lg:text-[48px] font-extrabold text-gray-10 leading-none">{product.reviewAvg.toFixed(1)}</p>
              <div className="mt-[8px]">
                <StarRating avg={product.reviewAvg} cnt={product.reviewCnt} />
              </div>
              <p className="mt-[4px] text-[12px] text-gray-6">총 {product.reviewCnt.toLocaleString('ko-KR')}개 리뷰</p>
            </div>
          </div>
        </div>
      )}

      {/* 뒤로가기 */}
      <div className="mt-[48px] flex justify-center">
        <Link
          href="/store"
          className="inline-flex items-center gap-[6px] text-[14px] text-gray-7 hover:text-gray-10 transition-colors"
        >
          <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
