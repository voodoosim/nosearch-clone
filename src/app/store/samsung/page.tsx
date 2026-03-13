import type { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import { getSamsungProducts } from '@/lib/products';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '삼성관 — 스마트홈딜',
  description: '삼성 비스포크·갤럭시·QLED TV — 최저가 특가',
};

const SAMSUNG_GROUPS = [
  {
    key: 'phone',
    label: '자급제폰',
    icon: '📱',
    keys: ['smartphone', 'foldable_phone'],
  },
  {
    key: 'tablet',
    label: '태블릿',
    icon: '📟',
    keys: ['tablet'],
  },
  {
    key: 'cleaning',
    label: '청소기',
    icon: '🌀',
    keys: ['cordless_vacuum_cleaner', 'robotic_vacuum_cleaner'],
  },
  {
    key: 'living',
    label: '생활가전',
    icon: '🏠',
    keys: ['air_purifier', 'induction', 'dish_washer'],
  },
  {
    key: 'it',
    label: 'IT / 웨어러블',
    icon: '⌚',
    keys: ['bluetooth_earphone', 'smart_watch', 'tv'],
  },
];

export default async function SamsungStorePage() {
  const products = await getSamsungProducts();

  const groups = SAMSUNG_GROUPS.map((g) => ({
    ...g,
    products: products.filter(
      (p) => p.productCategoryKey && g.keys.includes(p.productCategoryKey)
    ),
  })).filter((g) => g.products.length > 0);

  return (
    <div>
      {/* 히어로 배너 */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0A0800 0%, #1A1200 60%, #0F0C00 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'radial-gradient(circle at 75% 30%, #42A5F5 0%, transparent 55%), radial-gradient(circle at 15% 75%, #1565C0 0%, transparent 50%)',
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-[20px] lg:px-[30px] py-[56px] lg:py-[80px]">
          <div className="flex items-center gap-[12px] mb-[16px]">
            <span className="text-[20px] font-black text-white tracking-wider">SAMSUNG</span>
            <span className="text-[12px] font-semibold text-white/50 tracking-[0.18em] uppercase">
              Official Store
            </span>
          </div>
          <h1 className="text-[32px] lg:text-[48px] font-black text-white tracking-tight leading-none mb-[12px]">
            삼성관
          </h1>
          <p className="text-[15px] lg:text-[17px] text-white/60 mb-[8px]">
            비스포크 · 갤럭시 · QLED · 가전
          </p>
          <p className="text-[13px] text-white/40">총 {products.length}개 상품</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-[20px] pb-[100px] pt-[40px] lg:px-[30px]">
        {/* 카테고리 빠른 이동 */}
        <div className="mb-[48px] flex gap-[10px] overflow-x-auto scrollbar-hide pb-[4px]">
          {groups.map((g) => (
            <a key={g.key} href={`#cat-${g.key}`} className="shrink-0">
              <div
                className="flex items-center gap-[8px] px-[16px] py-[10px] rounded-full text-white text-[13px] font-semibold hover:opacity-80 transition-opacity"
                style={{ background: '#0A2A6E' }}
              >
                <span>{g.icon}</span>
                <span>{g.label}</span>
              </div>
            </a>
          ))}
        </div>

        {/* 카테고리별 섹션 */}
        {groups.map((g, idx) => (
          <section
            key={g.key}
            id={`cat-${g.key}`}
            className={`mb-[64px] ${idx > 0 ? 'pt-[64px] border-t border-gray-3' : ''}`}
          >
            <div className="flex items-center gap-[12px] mb-[24px]">
              <div
                className="w-[44px] h-[44px] rounded-full flex items-center justify-center text-[20px]"
                style={{ background: '#0A2A6E' }}
              >
                {g.icon}
              </div>
              <h2 className="text-[22px] font-extrabold text-gray-10 lg:text-[26px] tracking-tight">
                {g.label}
              </h2>
              <span className="text-[13px] text-gray-5">{g.products.length}개</span>
            </div>
            <div className="grid grid-cols-2 gap-x-[10px] gap-y-[12px] lg:grid-cols-4 lg:gap-x-[16px] lg:gap-y-[20px]">
              {g.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}

        {groups.length === 0 && (
          <div className="flex flex-col items-center py-[80px] text-center">
            <p className="text-[15px] font-semibold text-gray-7 mb-[8px]">상품 준비 중입니다</p>
            <p className="text-[13px] text-gray-5">곧 다양한 삼성 제품이 등록됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
