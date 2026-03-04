import type { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import {
  getProductsGroupedByCategory,
  getCategoryKeyLabel,
} from '@/lib/products';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '스마트홈딜 추천',
  description:
    '스마트홈딜이 카테고리별로 엄선한 추천 상품을 만나보세요.',
};

export default async function RecommendationPage() {
  const groups = await getProductsGroupedByCategory();

  return (
    <div className="mx-auto max-w-[1200px] px-[20px] pb-[150px] pt-[30px] lg:px-[30px]">
      {/* 페이지 헤더 */}
      <div className="mb-[24px]">
        <h1 className="text-[22px] font-extrabold text-gray-10 lg:text-[28px]">
          스마트홈딜 추천
        </h1>
        <p className="mt-[4px] text-[13px] text-gray-7 lg:text-[15px]">
          전문가가 직접 써보고 추천하는 카테고리별 인기 가전
        </p>
      </div>

      {/* 카테고리 필터 */}
      <div className="mb-[30px]">
        <CategoryFilter activeCategory="all" />
      </div>

      {/* 카테고리별 섹션 */}
      {groups.map(({ category, products }) => (
        <section key={category.key} className="mb-[50px]">
          {/* 카테고리 헤더 */}
          <div className="mb-[16px] flex items-center justify-between">
            <div className="flex items-center gap-[8px]">
              <span className="text-[20px] lg:text-[24px]">
                {category.icon}
              </span>
              <h2 className="text-[18px] font-extrabold text-gray-10 lg:text-[22px]">
                {category.label}
              </h2>
              <span className="text-[13px] text-gray-6 lg:text-[14px]">
                {products.length}개 상품
              </span>
            </div>
            <Link
              href={`/store/recommendation/${category.key}`}
              className="flex items-center gap-[4px] text-[13px] text-gray-9 hover:text-blue-7 lg:text-[15px]"
            >
              더보기
              <span className="text-[12px] text-gray-7">&gt;</span>
            </Link>
          </div>

          {/* 카테고리 설명 */}
          <p className="mb-[16px] text-[12px] text-gray-6 lg:text-[14px]">
            {category.description}
          </p>

          {/* 서브카테고리 태그 */}
          <div className="mb-[16px] flex flex-wrap gap-[6px]">
            {category.keys.map((key) => {
              const count = products.filter(
                (p) => p.productCategoryKey === key
              ).length;
              if (count === 0) return null;
              return (
                <span
                  key={key}
                  className="rounded-full bg-blue-1 px-[10px] py-[4px] text-[11px] font-medium text-blue-7 lg:text-[13px]"
                >
                  {getCategoryKeyLabel(key)} ({count})
                </span>
              );
            })}
          </div>

          {/* 상품 그리드 */}
          <div className="grid grid-cols-2 gap-x-[16px] gap-y-[30px] lg:grid-cols-4 lg:gap-x-[20px] lg:gap-y-[50px]">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
