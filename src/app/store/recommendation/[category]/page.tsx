import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import {
  RECOMMENDATION_CATEGORIES,
  getCategoryByKey,
  getProductsByRecommendationCategory,
  getCategoryKeyLabel,
} from '@/lib/products';

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return RECOMMENDATION_CATEGORIES.map((cat) => ({
    category: cat.key,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: categoryKey } = await params;
  const category = getCategoryByKey(categoryKey);

  if (!category) {
    return { title: '카테고리를 찾을 수 없습니다' };
  }

  return {
    title: `${category.label} 추천 - 스마트홈딜`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categoryKey } = await params;
  const category = getCategoryByKey(categoryKey);

  if (!category) {
    notFound();
  }

  const products = getProductsByRecommendationCategory(categoryKey);

  // 서브카테고리별 그룹화
  const subGroups = category.keys
    .map((key) => ({
      key,
      label: getCategoryKeyLabel(key),
      products: products.filter((p) => p.productCategoryKey === key),
    }))
    .filter((g) => g.products.length > 0);

  return (
    <div className="mx-auto max-w-[1200px] px-[20px] pb-[150px] pt-[30px] lg:px-[30px]">
      {/* 페이지 헤더 */}
      <div className="mb-[24px]">
        <div className="flex items-center gap-[8px]">
          <span className="text-[24px] lg:text-[28px]">{category.icon}</span>
          <h1 className="text-[22px] font-extrabold text-gray-10 lg:text-[28px]">
            {category.label} 추천
          </h1>
        </div>
        <p className="mt-[4px] text-[13px] text-gray-7 lg:text-[15px]">
          {category.description}
        </p>
        <p className="mt-[2px] text-[12px] text-gray-6">
          총 {products.length}개 상품
        </p>
      </div>

      {/* 카테고리 필터 */}
      <div className="mb-[30px]">
        <CategoryFilter activeCategory={categoryKey} />
      </div>

      {/* 서브카테고리 빠른 이동 */}
      {subGroups.length > 1 && (
        <div className="mb-[24px] flex flex-wrap gap-[6px]">
          {subGroups.map((group) => (
            <a
              key={group.key}
              href={`#${group.key}`}
              className="rounded-full border border-gray-3 bg-white px-[12px] py-[6px] text-[12px] font-medium text-gray-9 transition-colors hover:border-blue-7 hover:text-blue-7 lg:text-[13px]"
            >
              {group.label} ({group.products.length})
            </a>
          ))}
        </div>
      )}

      {/* 서브카테고리별 섹션 */}
      {subGroups.map((group) => (
        <section key={group.key} id={group.key} className="mb-[50px]">
          <div className="mb-[16px] flex items-center gap-[8px]">
            <div
              className="h-[4px] w-[4px] rounded-full"
              style={{ backgroundColor: '#E8701A' }}
            />
            <h2 className="text-[16px] font-bold text-gray-10 lg:text-[20px]">
              {group.label}
            </h2>
            <span className="text-[12px] text-gray-6 lg:text-[13px]">
              {group.products.length}개
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-[16px] gap-y-[30px] lg:grid-cols-4 lg:gap-x-[20px] lg:gap-y-[50px]">
            {group.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}

      {/* 상품 없음 */}
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-[80px]">
          <p className="text-[16px] font-bold text-gray-6">
            해당 카테고리에 상품이 없습니다
          </p>
          <p className="mt-[8px] text-[13px] text-gray-5">
            다른 카테고리를 확인해보세요
          </p>
        </div>
      )}
    </div>
  );
}
