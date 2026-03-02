import type { Metadata } from 'next';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/components/ProductCard';
import products from '@/data/products-best.json';

export const metadata: Metadata = {
  title: '기획전',
  description: '스마트홈딜 기획전 특가 상품을 만나보세요!',
};

interface Exhibition {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  categoryKeys: string[];
  categoryNames: string[];
  bgFrom: string;
  bgTo: string;
}

const EXHIBITIONS: Exhibition[] = [
  {
    id: 'winter-heating',
    title: '겨울 난방 가전 특가',
    subtitle: '추운 겨울을 따뜻하게 보내세요',
    badge: '겨울 특가',
    badgeColor: '#E8701A',
    categoryKeys: ['fan_heater', 'bathroom_heater', 'electric_mattress'],
    categoryNames: ['온풍기', '욕실난방기', '전기매트/전기요'],
    bgFrom: '#FFF5EB',
    bgTo: '#FFE8CC',
  },
  {
    id: 'clean-home',
    title: '쾌적한 실내 환경 완성',
    subtitle: '가습기와 제습기로 완벽한 실내 환경을',
    badge: '홈케어 기획',
    badgeColor: '#10B981',
    categoryKeys: ['humidifier', 'dehumidifier', 'air_circulator'],
    categoryNames: ['가습기', '제습기', '서큘레이터'],
    bgFrom: '#ECFDF5',
    bgTo: '#D1FAE5',
  },
  {
    id: 'smart-kitchen',
    title: '스마트 주방 가전 모음',
    subtitle: '요리가 즐거워지는 주방 가전 특가전',
    badge: '주방 기획',
    badgeColor: '#C45A0F',
    categoryKeys: ['blender', 'air_fryer', 'dish_washer', 'electric_pot'],
    categoryNames: ['블렌더/믹서기', '에어프라이어', '식기세척기', '전기포트/멀티포트'],
    bgFrom: '#FFF5EB',
    bgTo: '#FFECD4',
  },
  {
    id: 'clean-living',
    title: '청결한 생활을 위한 가전',
    subtitle: '청소기부터 구강세정기까지 위생 가전 한번에',
    badge: '위생 특가',
    badgeColor: '#8B5CF6',
    categoryKeys: [
      'cordless_vacuum_cleaner',
      'robotic_vacuum_cleaner',
      'mop_cleaner',
      'water_toothpick',
    ],
    categoryNames: ['무선청소기', '로봇청소기', '물걸레청소기', '구강세정기'],
    bgFrom: '#F5F3FF',
    bgTo: '#EDE9FE',
  },
];

function getProductsForExhibition(exhibition: Exhibition): Product[] {
  const all = products as Product[];
  return all.filter(
    (p) =>
      exhibition.categoryKeys.includes(p.productCategoryKey || '') ||
      exhibition.categoryNames.includes(p.categoryName),
  );
}

interface ExhibitionCardProps {
  exhibition: Exhibition;
  products: Product[];
  index: number;
}

function ExhibitionSection({ exhibition, products: sectionProducts, index }: ExhibitionCardProps) {
  if (sectionProducts.length === 0) return null;

  const displayProducts = sectionProducts.slice(0, 4);

  return (
    <section className="mb-[60px]">
      {/* 섹션 헤더 */}
      <div
        className="mb-[24px] rounded-[16px] px-[24px] py-[28px]"
        style={{
          background: `linear-gradient(135deg, ${exhibition.bgFrom} 0%, ${exhibition.bgTo} 100%)`,
        }}
      >
        <div className="flex items-start gap-[16px]">
          <div className="flex-1">
            <div className="mb-[8px] flex items-center gap-[8px]">
              <span
                className="inline-flex items-center rounded-full px-[10px] py-[4px] text-[12px] font-bold text-white"
                style={{ backgroundColor: exhibition.badgeColor }}
              >
                {exhibition.badge}
              </span>
              <span className="text-[12px] font-medium text-gray-5">
                #{String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <h2 className="text-[22px] font-extrabold text-gray-10 lg:text-[26px]">
              {exhibition.title}
            </h2>
            <p className="mt-[6px] text-[14px] text-gray-7">{exhibition.subtitle}</p>
          </div>
          <div className="hidden shrink-0 items-center gap-[6px] lg:flex">
            {exhibition.categoryNames.slice(0, 3).map((name) => (
              <span
                key={name}
                className="rounded-full border border-gray-3 bg-white px-[10px] py-[4px] text-[12px] font-medium text-gray-7"
              >
                {name}
              </span>
            ))}
            {exhibition.categoryNames.length > 3 && (
              <span className="text-[12px] text-gray-5">
                +{exhibition.categoryNames.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 상품 그리드 */}
      <div className="grid grid-cols-2 gap-x-[16px] gap-y-[24px] lg:grid-cols-4 lg:gap-x-[20px] lg:gap-y-[40px]">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* 더보기 버튼 */}
      {sectionProducts.length > 4 && (
        <div className="mt-[24px] flex justify-center">
          <button className="flex h-[44px] w-full max-w-[300px] items-center justify-center gap-[6px] rounded-[10px] border border-gray-3 bg-white text-[14px] font-semibold text-gray-8 hover:border-gray-5 hover:bg-gray-1 transition-colors">
            {exhibition.title} 더보기
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}

export default function ExhibitionPage() {
  const exhibitionsWithProducts = EXHIBITIONS.map((exhibition) => ({
    exhibition,
    products: getProductsForExhibition(exhibition),
  })).filter(({ products: p }) => p.length > 0);

  return (
    <div>
      {/* 히어로 배너 */}
      <div className="relative h-[160px] w-full overflow-hidden bg-gradient-to-r from-gray-10 to-gray-8 lg:h-[210px]">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[3px] text-gray-4">
            Special Exhibition
          </p>
          <h1 className="mt-[8px] text-[28px] font-extrabold text-white lg:text-[36px]">
            기획전
          </h1>
          <p className="mt-[6px] text-[14px] text-gray-4">테마별 엄선 상품, 특가로 만나보세요</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-[20px] pb-[150px] pt-[40px] lg:px-[30px]">
        {/* 기획전 탭 네비 */}
        <div className="scrollbar-hide mb-[40px] flex items-center gap-[8px] overflow-x-auto pb-[4px]">
          {EXHIBITIONS.map((exhibition) => (
            <button
              key={exhibition.id}
              className="shrink-0 rounded-full border border-gray-3 bg-white px-[14px] py-[8px] text-[13px] font-medium text-gray-7 hover:border-gray-6 hover:text-gray-10 transition-colors first:border-gray-10 first:bg-gray-10 first:text-white"
            >
              {exhibition.title}
            </button>
          ))}
        </div>

        {/* 기획전 섹션 목록 */}
        {exhibitionsWithProducts.map(({ exhibition, products: sectionProducts }, index) => (
          <ExhibitionSection
            key={exhibition.id}
            exhibition={exhibition}
            products={sectionProducts}
            index={index}
          />
        ))}

        {/* 기획전이 없는 경우 */}
        {exhibitionsWithProducts.length === 0 && (
          <div className="flex items-center justify-center py-[100px]">
            <div className="text-center">
              <div className="mx-auto flex h-[120px] w-[120px] items-center justify-center rounded-full bg-gray-1 lg:h-[160px] lg:w-[160px]">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L12 22M2 12L22 12" stroke="#D9D9D9" strokeWidth="2" />
                </svg>
              </div>
              <p className="mt-[20px] text-[14px] text-gray-7">현재 진행 중인 기획전이 없습니다.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
