'use client';

import { useState, useRef } from 'react';

interface Product {
  goodsNm: string;
  brandName: string;
  categoryName: string;
  goodsNo: string;
  id: string;
  reviewAvg: number;
  reviewCnt: number;
  goodsPrice: number;
  fixedPrice: number;
  pickType: string;
  soldOutFl: string;
  imageUrl: string;
  productCategoryKey?: string;
  periodDiscountEnd?: string;
  isTimedeal?: boolean;
}

interface Props {
  product: Product;
  discount: number;
}

const TABS = [
  { id: 'info', label: '상품정보' },
  { id: 'review', label: '리뷰' },
  { id: 'shipping', label: '배송/반품' },
];

function StarRating({ avg, cnt }: { avg: number; cnt: number }) {
  if (cnt === 0) return null;
  const fullStars = Math.floor(avg);
  const hasHalf = avg - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-[6px]">
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <svg key={`full-${i}`} className="w-[18px] h-[18px] text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {hasHalf && (
          <svg className="w-[18px] h-[18px] text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <svg key={`empty-${i}`} className="w-[18px] h-[18px] text-gray-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-[15px] font-bold text-amber-500">{avg.toFixed(1)}</span>
      <span className="text-[13px] text-gray-6">({cnt.toLocaleString('ko-KR')}개)</span>
    </div>
  );
}

export default function TabSection({ product, discount }: Props) {
  const [activeTab, setActiveTab] = useState('info');
  const infoRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const shippingRef = useRef<HTMLDivElement>(null);

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    info: infoRef,
    review: reviewRef,
    shipping: shippingRef,
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    const ref = sectionRefs[tabId];
    if (ref?.current) {
      const offset = 80;
      const top = ref.current.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-[48px]">
      {/* 탭 바 */}
      <div className="sticky top-[60px] z-[50] bg-[#F0EAE0] border-b border-gray-3 mb-[32px]">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex-1 py-[14px] text-[14px] font-semibold transition-colors relative ${
                activeTab === tab.id
                  ? 'text-blue-7'
                  : 'text-gray-6 hover:text-gray-9'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-7 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 상품정보 섹션 */}
      <div ref={infoRef} id="section-info">
        <div className="bg-blue-1 rounded-2xl p-[24px] lg:p-[32px]">
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
              <p className="text-[14px] font-bold text-gray-9 mb-[12px]">이 상품을 추천하는 이유</p>
              <ul className="flex flex-col gap-[10px]">
                <li className="flex items-start gap-[10px]">
                  <span className="mt-[1px] flex-shrink-0 w-[20px] h-[20px] rounded-full bg-blue-7 flex items-center justify-center">
                    <svg className="w-[11px] h-[11px] text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  <span className="text-[14px] text-gray-9">스마트홈딜 전문가 직접 테스트 및 검증 완료</span>
                </li>
                <li className="flex items-start gap-[10px]">
                  <span className="mt-[1px] flex-shrink-0 w-[20px] h-[20px] rounded-full bg-blue-7 flex items-center justify-center">
                    <svg className="w-[11px] h-[11px] text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  <span className="text-[14px] text-gray-9">합리적인 가격 대비 뛰어난 성능</span>
                </li>
                {product.reviewCnt > 0 && (
                  <li className="flex items-start gap-[10px]">
                    <span className="mt-[1px] flex-shrink-0 w-[20px] h-[20px] rounded-full bg-blue-7 flex items-center justify-center">
                      <svg className="w-[11px] h-[11px] text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span className="text-[14px] text-gray-9">
                      실제 구매자 {product.reviewCnt.toLocaleString('ko-KR')}명의 평균 {product.reviewAvg.toFixed(1)}점 높은 만족도
                    </span>
                  </li>
                )}
                {discount >= 20 && (
                  <li className="flex items-start gap-[10px]">
                    <span className="mt-[1px] flex-shrink-0 w-[20px] h-[20px] rounded-full bg-blue-7 flex items-center justify-center">
                      <svg className="w-[11px] h-[11px] text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
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
      <div ref={reviewRef} id="section-review" className="mt-[48px]">
        <div className="border-b border-gray-3 mb-[24px]">
          <div className="inline-block border-b-2 border-gray-10 pb-[12px]">
            <span className="text-[16px] font-bold text-gray-10">
              리뷰
              {product.reviewCnt > 0 && (
                <span className="ml-[6px] text-blue-7">{product.reviewCnt.toLocaleString('ko-KR')}</span>
              )}
            </span>
          </div>
        </div>

        {product.reviewCnt > 0 ? (
          <div className="bg-gray-1 rounded-2xl border border-gray-3 p-[24px] lg:p-[32px]">
            <div className="flex flex-col items-center gap-[12px] sm:flex-row sm:gap-[32px]">
              <div className="text-center">
                <p className="text-[52px] font-extrabold text-gray-10 leading-none">{product.reviewAvg.toFixed(1)}</p>
                <div className="mt-[10px] flex justify-center">
                  <StarRating avg={product.reviewAvg} cnt={product.reviewCnt} />
                </div>
                <p className="mt-[6px] text-[13px] text-gray-6">총 {product.reviewCnt.toLocaleString('ko-KR')}개 리뷰</p>
              </div>
              <div className="flex-1 w-full">
                {[5, 4, 3, 2, 1].map((star) => {
                  const pct = star === Math.round(product.reviewAvg) ? 65 : star > product.reviewAvg ? Math.max(5, 30 - (star - product.reviewAvg) * 15) : Math.max(5, 20 + (product.reviewAvg - star) * 10);
                  const cappedPct = Math.min(pct, 90);
                  return (
                    <div key={star} className="flex items-center gap-[8px] mb-[6px]">
                      <span className="text-[12px] text-gray-6 w-[12px] text-right shrink-0">{star}</span>
                      <svg className="w-[12px] h-[12px] text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <div className="flex-1 bg-gray-3 rounded-full h-[6px] overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${cappedPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="mt-[20px] text-[13px] text-gray-6 text-center border-t border-gray-3 pt-[16px]">
              실제 구매자 리뷰를 기반으로 집계된 평점입니다.
            </p>
          </div>
        ) : (
          <div className="bg-gray-1 rounded-2xl border border-gray-3 p-[40px] text-center">
            <p className="text-[15px] text-gray-6">아직 등록된 리뷰가 없습니다.</p>
            <p className="mt-[6px] text-[13px] text-gray-5">첫 번째 리뷰를 남겨보세요!</p>
          </div>
        )}
      </div>

      {/* 배송/반품 섹션 */}
      <div ref={shippingRef} id="section-shipping" className="mt-[48px]">
        <div className="border-b border-gray-3 mb-[24px]">
          <div className="inline-block border-b-2 border-gray-10 pb-[12px]">
            <span className="text-[16px] font-bold text-gray-10">배송/반품</span>
          </div>
        </div>

        <div className="flex flex-col gap-[12px]">
          <div className="bg-gray-1 rounded-xl border border-gray-3 p-[20px]">
            <h3 className="text-[14px] font-bold text-gray-9 mb-[12px] flex items-center gap-[6px]">
              <svg className="w-[16px] h-[16px] text-blue-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              배송 안내
            </h3>
            <dl className="flex flex-col gap-[8px]">
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">배송비</dt>
                <dd className="text-[13px] text-gray-10">무료배송</dd>
              </div>
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">출발</dt>
                <dd className="text-[13px] text-gray-10">오늘 오후 2시 이전 주문 시 당일 발송</dd>
              </div>
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">도착</dt>
                <dd className="text-[13px] text-gray-10">평일 기준 익일 도착 예정</dd>
              </div>
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">택배사</dt>
                <dd className="text-[13px] text-gray-10">CJ대한통운 / 로젠택배</dd>
              </div>
            </dl>
          </div>

          <div className="bg-gray-1 rounded-xl border border-gray-3 p-[20px]">
            <h3 className="text-[14px] font-bold text-gray-9 mb-[12px] flex items-center gap-[6px]">
              <svg className="w-[16px] h-[16px] text-blue-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              반품/교환 안내
            </h3>
            <dl className="flex flex-col gap-[8px]">
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">기간</dt>
                <dd className="text-[13px] text-gray-10">수령 후 7일 이내</dd>
              </div>
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">반품비</dt>
                <dd className="text-[13px] text-gray-10">무료 (단순 변심 제외)</dd>
              </div>
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">불가사유</dt>
                <dd className="text-[13px] text-gray-10">사용 후, 포장 훼손, 구성품 누락</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
