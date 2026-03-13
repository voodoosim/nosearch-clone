import type { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import { getHomeProducts } from '@/lib/products';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '가전관 — 스마트홈딜',
  description: '다이슨 청소기 · LG 트롬 · 삼성 비스포크 — 프리미엄 가전 최저가',
};

export default async function HomePage() {
  const products = await getHomeProducts();

  return (
    <div className="mx-auto max-w-[1200px] pb-[80px] pt-[28px] px-[20px] lg:px-[30px]">
      {/* 헤더 */}
      <div className="mb-[36px]">
        <p className="text-[11px] font-bold tracking-[0.2em] text-blue-7 uppercase mb-[6px]">HOME APPLIANCE</p>
        <h1 className="text-[28px] font-extrabold text-gray-10 tracking-tight leading-tight mb-[8px]">
          가전관
        </h1>
        <p className="text-[14px] text-gray-6">Dyson · LG · Samsung — 청소기·건조기·에어컨·냉장고</p>
      </div>

      {/* 상품 그리드 */}
      <div className="grid grid-cols-2 gap-x-[10px] gap-y-[12px] lg:grid-cols-4 lg:gap-x-[16px] lg:gap-y-[20px]">
        {products.map((product, idx) => (
          <ProductCard key={product.id} product={product} rank={idx < 3 ? idx + 1 : undefined} />
        ))}
      </div>
    </div>
  );
}
