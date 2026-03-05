import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/products';
import AddToCartButton from './AddToCartButton';
import TabSection from './TabSection';
import StickyCartButtons from './StickyCartButtons';
import TrackRecentlyViewed from './TrackRecentlyViewed';

export const revalidate = 60;

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
      return 'bg-blue-7 text-white';
    case 'plus':
      return 'bg-gray-9 text-white';
    case 'premium':
      return 'bg-gold text-white';
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
                <stop offset="50%" stopColor="#E2D8CC" />
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
  const product = await getProductById(id);

  if (!product) notFound();

  const isSoldOut = product.soldOutFl === 'y';
  const discount =
    product.fixedPrice > product.goodsPrice
      ? Math.round(((product.fixedPrice - product.goodsPrice) / product.fixedPrice) * 100)
      : 0;
  const pickLabel = getPickLabel(product.pickType);
  const pickColor = getPickColor(product.pickType);

  return (
    <div className="mx-auto max-w-[1200px] px-[20px] py-[24px] pb-[100px] lg:px-[30px] lg:py-[40px] lg:pb-[40px]">
      {/* 최근 본 상품 자동 기록 */}
      <TrackRecentlyViewed product={product} />

      {/* 브레드크럼 */}
      <nav className="mb-[20px] flex items-center gap-[6px] text-[13px] text-gray-6">
        <Link href="/store" className="hover:text-blue-7 transition-colors">
          스토어
        </Link>
        <span>/</span>
        <span className="text-gray-9">{product.categoryName}</span>
      </nav>

      {/* 메인 콘텐츠 */}
      <div className="flex flex-col gap-[24px] lg:flex-row lg:gap-[48px]">
        {/* 이미지 영역 */}
        <div className="w-full lg:w-[520px] lg:shrink-0">
          <div
            className="relative w-full rounded-2xl border border-gray-3 overflow-hidden"
            style={{ aspectRatio: '1 / 1', backgroundColor: '#F5F1EB' }}
          >
            <Image
              src={product.imageUrl}
              alt={product.goodsNm}
              fill
              className={`object-contain p-[32px] ${isSoldOut ? 'opacity-40' : ''}`}
              sizes="(max-width: 1024px) 100vw, 520px"
              priority
            />
            {isSoldOut && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl">
                <span className="text-[24px] font-bold text-white tracking-widest">SOLD OUT</span>
              </div>
            )}
            {/* 픽 뱃지 — 이미지 좌상단 */}
            {pickLabel && (
              <div className="absolute top-[14px] left-[14px]">
                <span className={`inline-flex items-center px-[10px] py-[4px] text-[11px] font-bold rounded-md shadow-sm ${pickColor}`}>
                  {pickLabel}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 상품 정보 영역 */}
        <div className="flex flex-1 flex-col">
          {/* 카테고리 + 태그 */}
          <div className="flex items-center gap-[8px] mb-[8px] flex-wrap">
            <span className="text-[13px] text-gray-6">{product.categoryName}</span>
            {product.isTimedeal && (
              <span className="inline-flex items-center px-[8px] py-[2px] text-[11px] font-bold rounded-sm bg-red-5 text-white">
                타임딜
              </span>
            )}
          </div>

          {/* 브랜드명 */}
          <p className="text-[14px] font-semibold text-blue-7 mb-[6px] tracking-wide uppercase">
            {product.brandName}
          </p>

          {/* 상품명 */}
          <h1 className="text-[20px] font-bold leading-[1.4] text-gray-10 mb-[14px] lg:text-[22px]">
            {product.goodsNm}
          </h1>

          {/* 리뷰 */}
          {product.reviewCnt > 0 && (
            <div className="mb-[16px]">
              <StarRating avg={product.reviewAvg} cnt={product.reviewCnt} />
            </div>
          )}

          {/* 구분선 + 가격 */}
          <div className="border-t border-gray-3 pt-[20px] mb-[20px]">
            {discount > 0 && (
              <div className="flex items-center gap-[8px] mb-[6px]">
                <span className="inline-flex items-center px-[8px] py-[3px] text-[12px] font-extrabold text-white bg-red-5 leading-none rounded-sm">
                  {discount}% 할인
                </span>
                <span className="text-[15px] text-gray-5 line-through">
                  {formatPrice(product.fixedPrice)}원
                </span>
              </div>
            )}
            <p className="text-[34px] font-extrabold text-gray-10 leading-none">
              {formatPrice(product.goodsPrice)}
              <span className="text-[20px] font-bold ml-[3px]">원</span>
            </p>
            {discount > 0 && (
              <p className="mt-[6px] text-[13px] text-blue-7 font-medium">
                최저가 이하 공동구매 특가
              </p>
            )}
          </div>

          {/* 배송 정보 박스 */}
          <div className="bg-gray-1 rounded-xl border border-gray-3 p-[16px] mb-[20px]">
            <dl className="flex flex-col gap-[10px]">
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[52px] font-medium">배송</dt>
                <dd className="text-[13px] text-gray-10 font-semibold">무료배송 · 오늘 출발</dd>
              </div>
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[52px] font-medium">도착</dt>
                <dd className="text-[13px] text-gray-10">내일(평일 기준) 도착 예정</dd>
              </div>
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[52px] font-medium">반품</dt>
                <dd className="text-[13px] text-gray-10">수령 후 7일 이내 무료반품</dd>
              </div>
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[52px] font-medium">브랜드</dt>
                <dd className="text-[13px] text-gray-10">{product.brandName}</dd>
              </div>
            </dl>
          </div>

          {/* 구매하기 + 장바구니 버튼 */}
          <AddToCartButton
            goodsNo={product.goodsNo || product.id}
            goodsNm={product.goodsNm}
            imageUrl={product.imageUrl}
            goodsPrice={product.goodsPrice}
            fixedPrice={product.fixedPrice}
            isSoldOut={isSoldOut}
          />

          {/* 신뢰 배지 3개 */}
          <div className="mt-[20px] grid grid-cols-3 gap-[8px]">
            <div className="flex flex-col items-center gap-[6px] bg-gray-1 border border-gray-3 rounded-xl p-[12px]">
              <svg className="w-[22px] h-[22px] text-blue-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span className="text-[11px] font-semibold text-gray-8 text-center leading-tight">정품보증</span>
            </div>
            <div className="flex flex-col items-center gap-[6px] bg-gray-1 border border-gray-3 rounded-xl p-[12px]">
              <svg className="w-[22px] h-[22px] text-blue-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              <span className="text-[11px] font-semibold text-gray-8 text-center leading-tight">무료반품</span>
            </div>
            <div className="flex flex-col items-center gap-[6px] bg-gray-1 border border-gray-3 rounded-xl p-[12px]">
              <svg className="w-[22px] h-[22px] text-blue-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span className="text-[11px] font-semibold text-gray-8 text-center leading-tight">안전결제</span>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 + 콘텐츠 섹션 */}
      <TabSection product={product} discount={discount} />

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

      {/* 하단 sticky 구매 바 (모바일) */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[998] bg-gray-1 border-t border-gray-3 lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="px-[16px] py-[12px]">
          {!isSoldOut ? (
            <StickyCartButtons
              goodsNo={product.goodsNo || product.id}
              goodsNm={product.goodsNm}
              imageUrl={product.imageUrl}
              goodsPrice={product.goodsPrice}
              fixedPrice={product.fixedPrice}
            />
          ) : (
            <button
              disabled
              className="w-full h-[52px] text-[16px] font-bold text-gray-5 bg-gray-3 rounded-xl cursor-not-allowed"
            >
              품절
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
