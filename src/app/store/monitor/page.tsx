import type { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import { getMonitorProducts } from '@/lib/products';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '모니터관 — 스마트홈딜',
  description: '삼성 오디세이 G9 · LG UltraGear · ASUS ROG — 게이밍/전문가용 모니터 최저가',
};

export default async function MonitorPage() {
  const products = await getMonitorProducts();

  return (
    <div className="mx-auto max-w-[1200px] pb-[80px] pt-[28px] px-[20px] lg:px-[30px]">
      {/* 헤더 */}
      <div className="mb-[36px]">
        <p className="text-[11px] font-bold tracking-[0.2em] text-blue-7 uppercase mb-[6px]">MONITOR</p>
        <h1 className="text-[28px] font-extrabold text-gray-10 tracking-tight leading-tight mb-[8px]">
          모니터관
        </h1>
        <p className="text-[14px] text-gray-6">오디세이 G9 · UltraGear · ROG — 게이밍부터 전문가용까지</p>
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
