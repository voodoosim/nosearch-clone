import type { Metadata } from 'next';
import Image from 'next/image';
import StoreBanner from '@/components/StoreBanner';
import type { Product } from '@/components/ProductCard';
import products from '@/data/products-best.json';

export const metadata: Metadata = {
  title: '렌탈 상품',
  description: '부담 없이 시작하는 렌탈 상품을 확인하세요!',
};

// 렌탈 대상 카테고리 — 일반적으로 렌탈이 많은 품목
const RENTAL_CATEGORY_KEYS = [
  'water_purifier',
  'bidet',
  'robotic_vacuum_cleaner',
  'air_circulator',
  'humidifier',
  'dehumidifier',
  'dish_washer',
  'cordless_vacuum_cleaner',
  'beam_projector',
  'electric_mattress',
  'garbage_disposer',
];

// 렌탈 카테고리명 폴백
const RENTAL_CATEGORY_NAMES = [
  '정수기',
  '비데',
  '로봇청소기',
  '서큘레이터',
  '가습기',
  '제습기',
  '식기세척기',
  '무선청소기',
  '빔프로젝터',
  '전기매트/전기요',
  '음식물처리기',
];

const RENTAL_MONTHS = 36;

function calcMonthlyRental(price: number): number {
  return Math.ceil(price / RENTAL_MONTHS);
}

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR');
}

function getPickPrefix(pickType: string): string {
  switch (pickType) {
    case 'best':
      return '[베스트픽]';
    case 'cost_effective':
      return '[가성비픽]';
    case 'plus':
      return '[PLUS픽]';
    case 'premium':
      return '[프리미엄픽]';
    default:
      return '';
  }
}

interface RentalProduct extends Product {
  monthlyRental: number;
}

interface RentalCardProps {
  product: RentalProduct;
}

function RentalCard({ product }: RentalCardProps) {
  const isSoldOut = product.soldOutFl === 'y';
  const pickPrefix = getPickPrefix(product.pickType);
  const productName = pickPrefix ? `${pickPrefix} ${product.goodsNm}` : product.goodsNm;

  const discount =
    product.fixedPrice > product.goodsPrice
      ? Math.round(((product.fixedPrice - product.goodsPrice) / product.fixedPrice) * 100)
      : 0;

  return (
    <article className="w-full overflow-hidden rounded-[12px] border border-gray-2 bg-white transition-shadow hover:shadow-md">
      {/* 상품 이미지 */}
      <div className="relative w-full bg-gray-1" style={{ aspectRatio: '4 / 3' }}>
        <Image
          src={product.imageUrl}
          alt={product.goodsNm}
          fill
          className={`object-contain p-[16px] ${isSoldOut ? 'opacity-40' : ''}`}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 280px"
        />
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-t-[12px]">
            <span className="text-[18px] font-bold text-white">SOLD OUT</span>
          </div>
        )}
        {discount > 0 && !isSoldOut && (
          <div className="absolute left-[10px] top-[10px] rounded-[6px] bg-orange-600 px-[8px] py-[4px]">
            <span className="text-[12px] font-bold text-white">{discount}% 할인</span>
          </div>
        )}
        {/* 렌탈 뱃지 */}
        <div className="absolute right-[10px] top-[10px] rounded-[6px] bg-blue-6 px-[8px] py-[4px]">
          <span className="text-[11px] font-bold text-white">렌탈</span>
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="p-[16px]">
        <p className="mb-[4px] text-[12px] font-medium text-gray-5">{product.categoryName}</p>
        <p className="mb-[12px] line-clamp-2 text-[14px] font-semibold leading-[20px] text-gray-10">
          {productName}
        </p>

        {/* 월 렌탈료 강조 */}
        <div className="mb-[10px] rounded-[8px] bg-blue-1 px-[12px] py-[10px]">
          <p className="text-[11px] font-medium text-blue-7">월 렌탈료 ({RENTAL_MONTHS}개월)</p>
          <p className="mt-[2px] text-[16px] font-extrabold text-blue-8 lg:text-[20px]">
            월 {formatPrice(product.monthlyRental)}원~
          </p>
        </div>

        {/* 정상가 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-5">구매가</p>
            <p className="text-[15px] font-bold text-gray-10">
              {formatPrice(product.goodsPrice)}원
            </p>
          </div>
          {discount > 0 && (
            <p className="text-[12px] text-gray-4 line-through">
              {formatPrice(product.fixedPrice)}원
            </p>
          )}
        </div>

        {/* 리뷰 */}
        {product.reviewCnt > 0 && (
          <div className="mt-[10px] flex items-center gap-[4px] border-t border-gray-1 pt-[10px]">
            <span className="text-[12px] text-yellow-500">★</span>
            <span className="text-[12px] font-semibold text-gray-8">
              {product.reviewAvg.toFixed(1)}
            </span>
            <span className="text-[12px] text-gray-4">({product.reviewCnt.toLocaleString()})</span>
          </div>
        )}

        {/* 렌탈 신청 버튼 */}
        <button
          className={`mt-[12px] w-full rounded-[8px] py-[12px] text-[14px] font-bold transition-colors ${
            isSoldOut
              ? 'cursor-not-allowed bg-gray-2 text-gray-5'
              : 'bg-blue-7 text-white hover:bg-blue-8'
          }`}
          disabled={isSoldOut}
        >
          {isSoldOut ? '품절' : '렌탈 신청'}
        </button>
      </div>
    </article>
  );
}

interface RentalBenefitProps {
  icon: string;
  title: string;
  desc: string;
}

function RentalBenefit({ icon, title, desc }: RentalBenefitProps) {
  return (
    <div className="flex flex-col items-center rounded-[12px] border border-gray-2 bg-white px-[16px] py-[20px] text-center">
      <span className="mb-[8px] text-[28px]">{icon}</span>
      <p className="text-[14px] font-bold text-gray-10">{title}</p>
      <p className="mt-[4px] text-[12px] leading-[18px] text-gray-6">{desc}</p>
    </div>
  );
}

export default function RentalPage() {
  const allProducts = products as Product[];

  const rentalProducts: RentalProduct[] = allProducts
    .filter(
      (p) =>
        RENTAL_CATEGORY_KEYS.includes(p.productCategoryKey || '') ||
        RENTAL_CATEGORY_NAMES.includes(p.categoryName),
    )
    .map((p) => ({
      ...p,
      monthlyRental: calcMonthlyRental(p.goodsPrice),
    }));

  // 카테고리별 그룹핑
  const groupedByCategory = rentalProducts.reduce<Record<string, RentalProduct[]>>((acc, p) => {
    const key = p.categoryName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  const categories = Object.keys(groupedByCategory);

  const benefits: RentalBenefitProps[] = [
    {
      icon: '💳',
      title: '부담 없는 월 납부',
      desc: '목돈 없이 매달 소액으로\n이용 가능',
    },
    {
      icon: '🔧',
      title: '무상 AS 보장',
      desc: '렌탈 기간 중 고장 시\n무료 수리/교체',
    },
    {
      icon: '📦',
      title: '무료 설치',
      desc: '전문 기사가 방문하여\n무료 설치 진행',
    },
    {
      icon: '🔄',
      title: '제품 업그레이드',
      desc: '계약 만료 후\n최신 제품으로 교체 가능',
    },
  ];

  return (
    <div>
      <StoreBanner type="rental" />

      <div className="mx-auto max-w-[1200px] px-[20px] pb-[150px] pt-[30px] lg:px-[30px]">
        {/* 헤더 */}
        <div className="mb-[30px]">
          <p className="text-[22px] font-extrabold text-gray-10 lg:text-[28px]">렌탈</p>
          <p className="mt-[4px] text-[14px] text-gray-7">
            부담 없이 시작하는 가전 렌탈 — 36개월 기준
          </p>
        </div>

        {/* 렌탈 혜택 배너 */}
        <div className="mb-[40px] grid grid-cols-2 gap-[10px] lg:grid-cols-4 lg:gap-[16px]">
          {benefits.map((b) => (
            <RentalBenefit key={b.title} {...b} />
          ))}
        </div>

        {/* 렌탈 안내 띠 */}
        <div className="mb-[40px] flex items-center gap-[12px] rounded-[10px] bg-blue-1 px-[20px] py-[16px]">
          <div className="shrink-0 rounded-full bg-blue-7 p-[8px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-bold text-blue-8">렌탈료 산정 기준</p>
            <p className="text-[12px] text-blue-7">
              표시된 월 렌탈료는 판매가 기준 36개월 분할 금액입니다. 실제 렌탈료는 업체별로 다를 수
              있습니다.
            </p>
          </div>
        </div>

        {/* 카테고리별 렌탈 상품 */}
        {rentalProducts.length > 0 ? (
          categories.map((category) => {
            const catProducts = groupedByCategory[category];
            if (!catProducts || catProducts.length === 0) return null;

            return (
              <section key={category} className="mb-[50px]">
                <div className="mb-[16px] flex items-center gap-[10px]">
                  <h2 className="text-[18px] font-extrabold text-gray-10 lg:text-[20px]">
                    {category}
                  </h2>
                  <span className="rounded-full bg-gray-1 px-[8px] py-[2px] text-[12px] font-medium text-gray-6">
                    {catProducts.length}개
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-[12px] gap-y-[20px] lg:grid-cols-4 lg:gap-x-[20px] lg:gap-y-[28px]">
                  {catProducts.map((product) => (
                    <RentalCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <div className="flex items-center justify-center py-[100px]">
            <div className="text-center">
              <div className="mx-auto flex h-[120px] w-[120px] items-center justify-center rounded-full bg-gray-1 lg:h-[160px] lg:w-[160px]">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L12 22M2 12L22 12" stroke="#D9D9D9" strokeWidth="2" />
                </svg>
              </div>
              <p className="mt-[20px] text-[14px] text-gray-7">
                현재 렌탈 가능한 상품이 없습니다.
              </p>
            </div>
          </div>
        )}

        {/* 렌탈 문의 CTA */}
        <div className="mt-[20px] rounded-[16px] bg-gray-10 px-[24px] py-[32px] text-center">
          <p className="text-[18px] font-extrabold text-white lg:text-[22px]">
            렌탈 상담이 필요하신가요?
          </p>
          <p className="mt-[8px] text-[14px] text-gray-4">
            전문 상담사가 최적의 렌탈 플랜을 안내해 드립니다
          </p>
          <button className="mt-[20px] rounded-[10px] bg-white px-[28px] py-[12px] text-[15px] font-bold text-gray-10 hover:bg-gray-1 transition-colors">
            렌탈 상담 신청
          </button>
        </div>
      </div>
    </div>
  );
}
