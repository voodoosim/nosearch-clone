import type { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import { getAudioProducts } from '@/lib/products';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '음향기기관 — 스마트홈딜',
  description: '소니 WH-1000XM5 · 에어팟 프로 · 보스 · 젠하이저 — 프리미엄 음향기기 최저가',
};

export default async function AudioPage() {
  const products = await getAudioProducts();

  return (
    <div className="mx-auto max-w-[1200px] pb-[80px] pt-[28px] px-[20px] lg:px-[30px]">
      {/* 헤더 */}
      <div className="mb-[36px]">
        <p className="text-[11px] font-bold tracking-[0.2em] text-blue-7 uppercase mb-[6px]">AUDIO</p>
        <h1 className="text-[28px] font-extrabold text-gray-10 tracking-tight leading-tight mb-[8px]">
          음향기기관
        </h1>
        <p className="text-[14px] text-gray-6">Sony · Apple · Bose · Sennheiser — 프리미엄 헤드폰·이어폰·스피커</p>
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
