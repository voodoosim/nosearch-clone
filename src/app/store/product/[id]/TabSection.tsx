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
  { id: 'spec', label: '제품 사양' },
  { id: 'review', label: `리뷰` },
  { id: 'shipping', label: '배송/반품' },
];

// 상품명 파싱으로 Apple 사양 추출
function parseAppleSpecs(goodsNm: string, categoryKey?: string) {
  const name = goodsNm;
  const specs: Record<string, string> = {};

  // 칩 추출
  const chipMatch = name.match(/(M\d+(?:\s+(?:Pro|Max|Ultra))?)/);
  if (chipMatch) specs['칩'] = `Apple Silicon ${chipMatch[1]}`;

  // CPU 코어 추출
  const cpuMatch = name.match(/(\d+)코어\s+CPU/);
  if (cpuMatch) specs['CPU'] = `${cpuMatch[1]}코어`;

  // GPU 코어 추출
  const gpuMatch = name.match(/(\d+)코어\s+GPU/);
  if (gpuMatch) specs['GPU'] = `${gpuMatch[1]}코어`;

  // 메모리 추출
  const memMatch = name.match(/(\d+)GB(?!\s+\d)/);
  if (memMatch) specs['통합 메모리'] = `${memMatch[1]}GB`;

  // 저장장치 추출
  const storageMatch = name.match(/(\d+(?:\.\d+)?)(TB|GB)$/);
  if (storageMatch) specs['SSD 저장 용량'] = `${storageMatch[1]}${storageMatch[2]}`;

  // 색상 추출
  if (name.includes('스페이스 블랙')) specs['색상'] = '스페이스 블랙';
  else if (name.includes('실버')) specs['색상'] = '실버';
  else if (name.includes('스페이스 그레이')) specs['색상'] = '스페이스 그레이';
  else if (name.includes('골드')) specs['색상'] = '골드';
  else if (name.includes('미드나이트')) specs['색상'] = '미드나이트';

  // 디스플레이 (카테고리 기반)
  if (categoryKey === 'macbook_pro_14' || name.includes('14"')) {
    specs['디스플레이'] = '14.2형 Liquid Retina XDR (3024 × 1964)';
    specs['배터리'] = '최대 22시간 (Apple TV 앱 동영상 재생)';
    specs['무게'] = '1.62 kg';
  } else if (categoryKey === 'macbook_pro_16' || name.includes('16"')) {
    specs['디스플레이'] = '16.2형 Liquid Retina XDR (3456 × 2234)';
    specs['배터리'] = '최대 24시간 (Apple TV 앱 동영상 재생)';
    specs['무게'] = '2.14 kg';
  } else if (categoryKey === 'mac_studio') {
    specs['연결'] = 'Thunderbolt 5 × 3, USB-A × 2, USB-C × 3, HDMI, SD카드, 오디오 잭';
    specs['크기'] = '19.7 × 19.7 × 9.5 cm';
  } else if (categoryKey === 'mac_pro') {
    specs['폼 팩터'] = '타워형 워크스테이션';
    specs['연결'] = 'Thunderbolt 4 × 6, USB-A × 2, HDMI × 2, 10Gb 이더넷 × 2';
    specs['확장 슬롯'] = 'PCIe 슬롯 × 6';
  } else if (categoryKey === 'mac_mini') {
    specs['디스플레이'] = '최대 3개 동시 연결 지원';
    specs['연결'] = 'Thunderbolt 4 × 3, USB-A × 2, HDMI, 이더넷 10Gb';
    specs['크기'] = '12.7 × 12.7 × 3.6 cm';
  }

  // MacBook Pro 공통
  if (categoryKey === 'macbook_pro_14' || categoryKey === 'macbook_pro_16') {
    specs['카메라'] = '12MP Center Stage 지원 카메라';
    specs['오디오'] = '6스피커 사운드 시스템, 공간 음향';
    specs['연결'] = 'Thunderbolt 4 × 3, HDMI, SD카드, MagSafe 3, 오디오 잭';
    specs['보안'] = 'Touch ID';
    specs['운영체제'] = 'macOS Sequoia';
  }

  return specs;
}

// 카테고리별 주요 특징
function getAppleHighlights(categoryKey?: string, chipName?: string) {
  const chip = chipName || 'Apple Silicon';

  const highlights: { title: string; desc: string }[] = [];

  if (categoryKey === 'macbook_pro_14' || categoryKey === 'macbook_pro_16') {
    highlights.push(
      { title: `${chip} 탑재`, desc: '압도적인 CPU·GPU·Neural Engine 성능으로 전문가 작업도 거침없이 처리' },
      { title: 'Liquid Retina XDR 디스플레이', desc: '1,000,000:1 명암비, ProMotion 최대 120Hz, P3 와이드 컬러 지원' },
      { title: '최대 24시간 배터리', desc: '충전 없이도 하루 종일 작업 가능한 놀라운 배터리 효율' },
      { title: 'MagSafe 3 충전', desc: '자석 방식의 안전한 충전 연결, Thunderbolt로도 충전 가능' },
      { title: '팬 없는 설계 (기본형)', desc: '완전 무음 동작으로 조용한 환경에서도 최적의 성능 발휘' },
    );
  } else if (categoryKey === 'mac_studio') {
    highlights.push(
      { title: `${chip} 탑재`, desc: '영상 편집, 3D 렌더링, 음악 프로덕션 등 크리에이티브 작업의 새 기준' },
      { title: '컴팩트한 고성능 데스크탑', desc: '손바닥 크기의 본체에 전문가급 성능 집약' },
      { title: 'Thunderbolt 5 포트', desc: '초고속 외장 스토리지 및 다중 디스플레이 연결 지원' },
      { title: '최대 5개 디스플레이 연결', desc: '넓은 작업 화면으로 멀티태스킹 극대화' },
    );
  } else if (categoryKey === 'mac_pro') {
    highlights.push(
      { title: `${chip} 탑재`, desc: '192GB 통합 메모리로 초대형 프로젝트도 거침없이 처리' },
      { title: 'PCIe 슬롯 6개', desc: '전문가용 확장 카드, 외장 GPU, 전문 오디오 인터페이스 등 무한 확장' },
      { title: '최대 6개 디스플레이 연결', desc: 'Apple Pro Display XDR 최대 6대 동시 연결 지원' },
      { title: '서버 및 영상 프로덕션용', desc: 'RED RAW 4K/8K 스트림 처리, 영화 후반 작업에 최적화' },
    );
  } else if (categoryKey === 'mac_mini') {
    highlights.push(
      { title: `${chip} 탑재`, desc: '작은 크기에 담긴 놀라운 성능, 일상부터 전문 작업까지 완벽 대응' },
      { title: '초소형 폼 팩터', desc: '12.7 × 12.7 cm의 작은 본체로 데스크 공간 절약' },
      { title: '10Gb 이더넷 내장', desc: '고속 네트워크 환경에서 빠른 파일 전송 및 서버 작업 지원' },
      { title: '최대 3대 디스플레이', desc: '다중 모니터 작업 환경 구축 가능' },
    );
  }

  return highlights;
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
  const specRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const shippingRef = useRef<HTMLDivElement>(null);

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    info: infoRef,
    spec: specRef,
    review: reviewRef,
    shipping: shippingRef,
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    const ref = sectionRefs[tabId];
    if (ref?.current) {
      const offset = 100;
      const top = ref.current.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const specs = parseAppleSpecs(product.goodsNm, product.productCategoryKey);
  const chipMatch = product.goodsNm.match(/(M\d+(?:\s+(?:Pro|Max|Ultra))?)/);
  const highlights = getAppleHighlights(product.productCategoryKey, chipMatch?.[1]);

  return (
    <div className="mt-[48px]">
      {/* 탭 바 */}
      <div className="sticky top-[100px] lg:top-[125px] z-[50] bg-[#F0EAE0] border-b border-gray-3 mb-[32px]">
        <div className="flex overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex-1 min-w-[80px] py-[14px] text-[13px] lg:text-[14px] font-semibold transition-colors relative whitespace-nowrap px-[4px] ${
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
        {/* 주요 특징 */}
        {highlights.length > 0 && (
          <div className="mb-[32px]">
            <h3 className="text-[17px] font-extrabold text-gray-10 mb-[16px] flex items-center gap-[8px]">
              <span className="w-[4px] h-[18px] bg-blue-7 rounded-full inline-block" />
              이 제품의 핵심 특징
            </h3>
            <div className="grid grid-cols-1 gap-[12px] lg:grid-cols-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex gap-[14px] bg-gray-1 rounded-xl border border-gray-3 p-[16px]">
                  <div className="shrink-0 w-[36px] h-[36px] rounded-full bg-blue-7 flex items-center justify-center mt-[2px]">
                    <span className="text-white font-extrabold text-[14px]">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-gray-10 mb-[4px]">{h.title}</p>
                    <p className="text-[13px] text-gray-6 leading-[1.6]">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 스마트홈딜 추천 박스 */}
        <div className="bg-blue-1 rounded-2xl p-[24px] lg:p-[32px] mb-[32px]">
          <div className="flex flex-col gap-[16px]">
            <div>
              <p className="text-[18px] font-extrabold text-gray-10 mb-[8px]">
                스마트홈딜이 추천하는 이유
              </p>
              <p className="text-[14px] text-gray-9 leading-[1.7]">
                {product.brandName}의 {product.categoryName}은 전문가가 직접 사용하고 엄선한 제품입니다.
                성능, 디자인, 내구성을 종합 평가하여 최고 점수를 받은 모델로,
                고가의 투자 가치가 충분한 프리미엄 제품입니다.
              </p>
            </div>

            <div className="border-t border-gray-3 pt-[16px]">
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
                  <span className="text-[14px] text-gray-9">Apple 공식 정품 인증 제품 (정품 시리얼 포함)</span>
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
                {discount >= 5 && (
                  <li className="flex items-start gap-[10px]">
                    <span className="mt-[1px] flex-shrink-0 w-[20px] h-[20px] rounded-full bg-blue-7 flex items-center justify-center">
                      <svg className="w-[11px] h-[11px] text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span className="text-[14px] text-gray-9">
                      Apple 공식가 대비 {discount}% 할인 — 공동구매 최저가 보장
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* 구매 혜택 섹션 */}
        <div className="mb-[32px]">
          <h3 className="text-[17px] font-extrabold text-gray-10 mb-[16px] flex items-center gap-[8px]">
            <span className="w-[4px] h-[18px] bg-amber-500 rounded-full inline-block" />
            구매 혜택
          </h3>
          <div className="grid grid-cols-1 gap-[10px] lg:grid-cols-2">
            {/* 무이자 할부 */}
            <div className="flex items-start gap-[14px] bg-gray-1 rounded-xl border border-gray-3 p-[16px]">
              <div className="shrink-0 w-[40px] h-[40px] rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <svg width="20" height="20" fill="none" stroke="#D97706" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-9 mb-[4px]">무이자 할부</p>
                <p className="text-[12px] text-gray-6 leading-snug">신한·삼성·현대카드 2~12개월 무이자<br />롯데·BC·하나 2~6개월 무이자</p>
              </div>
            </div>
            {/* 공동구매 특가 */}
            <div className="flex items-start gap-[14px] bg-gray-1 rounded-xl border border-gray-3 p-[16px]">
              <div className="shrink-0 w-[40px] h-[40px] rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                <svg width="20" height="20" fill="none" stroke="#3B82F6" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-9 mb-[4px]">공동구매 특가</p>
                <p className="text-[12px] text-gray-6 leading-snug">10명 이상 모이면 추가 할인<br />Apple 공식가 대비 최대 {Math.max(discount, 5)}% 절약</p>
              </div>
            </div>
            {/* 포인트 적립 */}
            <div className="flex items-start gap-[14px] bg-gray-1 rounded-xl border border-gray-3 p-[16px]">
              <div className="shrink-0 w-[40px] h-[40px] rounded-xl bg-green-50 border border-green-200 flex items-center justify-center">
                <svg width="20" height="20" fill="none" stroke="#16A34A" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-9 mb-[4px]">스마트홈딜 포인트</p>
                <p className="text-[12px] text-gray-6 leading-snug">구매금액의 1% 포인트 적립<br />다음 구매 시 현금처럼 사용</p>
              </div>
            </div>
            {/* AppleCare+ */}
            <div className="flex items-start gap-[14px] bg-gray-1 rounded-xl border border-gray-3 p-[16px]">
              <div className="shrink-0 w-[40px] h-[40px] rounded-xl bg-gray-2 border border-gray-3 flex items-center justify-center">
                <svg width="20" height="20" fill="none" stroke="#1C1C1E" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-9 mb-[4px]">AppleCare+ 동시 구매</p>
                <p className="text-[12px] text-gray-6 leading-snug">구매 시 AppleCare+ 함께 신청 가능<br />파손 수리 횟수 제한 없이 보장</p>
              </div>
            </div>
          </div>
        </div>

        {/* 성능 시각화 섹션 */}
        {(product.productCategoryKey === 'macbook_pro_14' || product.productCategoryKey === 'macbook_pro_16' || product.productCategoryKey === 'mac_studio' || product.productCategoryKey === 'mac_mini') && (
          <div className="mb-[32px]">
            <h3 className="text-[17px] font-extrabold text-gray-10 mb-[16px] flex items-center gap-[8px]">
              <span className="w-[4px] h-[18px] bg-purple-500 rounded-full inline-block" />
              성능 벤치마크
            </h3>
            <div className="bg-gray-1 rounded-xl border border-gray-3 p-[20px] lg:p-[24px]">
              <p className="text-[12px] text-gray-5 mb-[20px]">이전 세대(Intel) 동급 제품 대비</p>
              <div className="flex flex-col gap-[16px]">
                {[
                  { label: 'CPU 성능', intel: 62, apple: 100, desc: '최대 4.5배' },
                  { label: 'GPU 성능', intel: 48, apple: 100, desc: '최대 5.2배' },
                  { label: '배터리 효율', intel: 55, apple: 100, desc: '최대 2.4배' },
                  { label: 'Neural Engine (AI)', intel: 10, apple: 100, desc: '최대 38배' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-[6px]">
                      <span className="text-[13px] font-semibold text-gray-9">{item.label}</span>
                      <span className="text-[12px] font-bold text-purple-600">{item.desc}</span>
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <div className="flex items-center gap-[8px]">
                        <span className="text-[10px] text-gray-5 w-[38px] shrink-0">이전 세대</span>
                        <div className="flex-1 bg-gray-3 rounded-full h-[8px] overflow-hidden">
                          <div className="h-full bg-gray-5 rounded-full" style={{ width: `${item.intel}%` }} />
                        </div>
                        <span className="text-[10px] text-gray-5 w-[24px] shrink-0 text-right">{item.intel}</span>
                      </div>
                      <div className="flex items-center gap-[8px]">
                        <span className="text-[10px] text-gray-5 w-[38px] shrink-0">Apple M</span>
                        <div className="flex-1 bg-gray-3 rounded-full h-[8px] overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${item.apple}%`, background: 'linear-gradient(90deg, #7C3AED 0%, #A855F7 100%)' }} />
                        </div>
                        <span className="text-[10px] font-bold text-purple-600 w-[24px] shrink-0 text-right">{item.apple}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-[16px] text-[11px] text-gray-5">* Geekbench 6 / Cinebench R23 기반 상대 비교 (100점 만점 기준)</p>
            </div>
          </div>
        )}

        {/* 구성품 */}
        <div className="mb-[32px]">
          <h3 className="text-[17px] font-extrabold text-gray-10 mb-[16px] flex items-center gap-[8px]">
            <span className="w-[4px] h-[18px] bg-blue-7 rounded-full inline-block" />
            구성품
          </h3>
          <div className="bg-gray-1 rounded-xl border border-gray-3 p-[20px]">
            <ul className="grid grid-cols-2 gap-[10px] lg:grid-cols-3">
              {(product.productCategoryKey === 'macbook_pro_14' || product.productCategoryKey === 'macbook_pro_16'
                ? ['MacBook Pro 본체', 'MagSafe 3 충전 케이블 (2m)', 'USB-C to MagSafe 3 케이블', '140W USB-C 전원 어댑터', '빠른 시작 안내서']
                : product.productCategoryKey === 'mac_studio'
                ? ['Mac Studio 본체', 'USB-C to MagSafe 3 케이블 (1m)', '전원 케이블', '빠른 시작 안내서']
                : product.productCategoryKey === 'mac_pro'
                ? ['Mac Pro 본체', '전원 케이블', 'Magic Keyboard (Touch ID)', 'Magic Mouse', 'USB-C 충전 케이블']
                : product.productCategoryKey === 'mac_mini'
                ? ['Mac mini 본체', '전원 케이블', '빠른 시작 안내서']
                : ['본체', '전원 어댑터', '케이블', '빠른 시작 안내서']
              ).map((item, i) => (
                <li key={i} className="flex items-center gap-[8px]">
                  <svg className="w-[14px] h-[14px] text-blue-7 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-[13px] text-gray-9">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 제품 사양 섹션 */}
      <div ref={specRef} id="section-spec" className="mt-[48px]">
        <div className="border-b border-gray-3 mb-[24px]">
          <div className="inline-block border-b-2 border-gray-10 pb-[12px]">
            <span className="text-[16px] font-bold text-gray-10">제품 사양</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-3">
          <table className="w-full text-[14px]">
            <tbody>
              {Object.entries(specs).map(([key, val], i) => (
                <tr key={key} className={i % 2 === 0 ? 'bg-gray-1' : 'bg-white'}>
                  <td className="px-[16px] py-[13px] font-semibold text-gray-7 w-[130px] lg:w-[180px] align-top border-r border-gray-3">
                    {key}
                  </td>
                  <td className="px-[16px] py-[13px] text-gray-10">
                    {val}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-1">
                <td className="px-[16px] py-[13px] font-semibold text-gray-7 border-r border-gray-3">운영체제</td>
                <td className="px-[16px] py-[13px] text-gray-10">macOS Sequoia (최신 버전)</td>
              </tr>
              <tr>
                <td className="px-[16px] py-[13px] font-semibold text-gray-7 border-r border-gray-3">보증</td>
                <td className="px-[16px] py-[13px] text-gray-10">Apple 1년 제한 보증 포함 (AppleCare+ 별도 구매 가능)</td>
              </tr>
              <tr className="bg-gray-1">
                <td className="px-[16px] py-[13px] font-semibold text-gray-7 border-r border-gray-3">정품 여부</td>
                <td className="px-[16px] py-[13px] text-gray-10 font-medium text-green-600">Apple Korea 정품 (한국 공식 유통 제품)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Apple 공식 사이트 링크 안내 */}
        <div className="mt-[16px] flex items-center gap-[8px] bg-gray-1 rounded-xl border border-gray-3 p-[14px]">
          <svg className="w-[16px] h-[16px] text-blue-7 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p className="text-[12px] text-gray-7">
            상세 기술 사양은 <span className="font-semibold text-blue-7">apple.com/kr</span>에서 확인하실 수 있습니다.
          </p>
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
          <div>
            {/* 별점 요약 */}
            <div className="bg-gray-1 rounded-2xl border border-gray-3 p-[24px] lg:p-[32px] mb-[24px]">
              <div className="flex flex-col items-center gap-[12px] sm:flex-row sm:gap-[32px]">
                <div className="text-center">
                  <p className="text-[56px] font-extrabold text-gray-10 leading-none">{product.reviewAvg.toFixed(1)}</p>
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
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${cappedPct}%` }} />
                        </div>
                        <span className="text-[11px] text-gray-5 w-[30px] shrink-0">{cappedPct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 샘플 리뷰 카드 */}
            <div className="flex flex-col gap-[12px]">
              {[
                { name: '김**', rating: 5, date: '2026.02.15', text: '정말 최고의 성능입니다. 영상 편집이 이렇게 빠르고 부드럽게 되는건 처음이에요. M 칩 진짜 대단합니다.' },
                { name: '박**', rating: 5, date: '2026.02.08', text: '배터리가 진짜 오래 갑니다. 하루 종일 써도 여유롭네요. 디스플레이도 너무 아름답고요. 가격이 비싸지만 그 이상의 가치가 있습니다.' },
                { name: '이**', rating: 4, date: '2026.01.22', text: '스마트홈딜 공동구매로 정가보다 저렴하게 구입했습니다. 빠른 배송, 정품 확인 완료. 만족합니다!' },
              ].map((review, i) => (
                <div key={i} className="bg-gray-1 rounded-xl border border-gray-3 p-[18px]">
                  <div className="flex items-center justify-between mb-[10px]">
                    <div className="flex items-center gap-[8px]">
                      <div className="w-[32px] h-[32px] rounded-full bg-blue-1 flex items-center justify-center">
                        <span className="text-[12px] font-bold text-blue-7">{review.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-gray-9">{review.name}</p>
                        <p className="text-[11px] text-gray-5">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <svg key={j} className="w-[13px] h-[13px] text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-[14px] text-gray-9 leading-[1.6]">{review.text}</p>
                  <div className="mt-[10px] flex items-center gap-[12px]">
                    <button className="flex items-center gap-[4px] text-[12px] text-gray-6 hover:text-blue-7 transition-colors">
                      <svg className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                      </svg>
                      도움이 됨 (12)
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-[16px] text-[12px] text-gray-5 text-center border-t border-gray-3 pt-[16px]">
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
                <dd className="text-[13px] text-gray-10 font-semibold text-green-600">무료배송</dd>
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
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">포장</dt>
                <dd className="text-[13px] text-gray-10">Apple 공식 박스 미개봉 상태 밀봉 배송</dd>
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
                <dd className="text-[13px] text-gray-10">무료 (단순 변심 제외 — 왕복 배송비 소비자 부담)</dd>
              </div>
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">불가사유</dt>
                <dd className="text-[13px] text-gray-10">사용 후, 박스 개봉 후 구성품 설치/등록, 스크래치/흠집 발생 시</dd>
              </div>
            </dl>
          </div>

          {/* AS 안내 */}
          <div className="bg-gray-1 rounded-xl border border-gray-3 p-[20px]">
            <h3 className="text-[14px] font-bold text-gray-9 mb-[12px] flex items-center gap-[6px]">
              <svg className="w-[16px] h-[16px] text-blue-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
              Apple 공식 보증 안내
            </h3>
            <dl className="flex flex-col gap-[8px]">
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">기본 보증</dt>
                <dd className="text-[13px] text-gray-10">Apple 1년 제한 보증</dd>
              </div>
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">Apple AS</dt>
                <dd className="text-[13px] text-gray-10">전국 Apple 공인 서비스 센터 이용 가능</dd>
              </div>
              <div className="flex gap-[16px]">
                <dt className="text-[13px] text-gray-6 shrink-0 w-[64px]">추가 보증</dt>
                <dd className="text-[13px] text-gray-10">AppleCare+ 가입 시 2년 연장 (별도 구매)</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
