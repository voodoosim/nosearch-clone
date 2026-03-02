import ProductCard, { Product } from '@/components/ProductCard';
import bestData from '@/data/products-best.json';
import dealData from '@/data/products-deal.json';
import timedeaData from '@/data/products-timedeal.json';
import reviewData from '@/data/products-review.json';

const ALL_PRODUCTS: Product[] = [
  ...(bestData as Product[]),
  ...(dealData as Product[]),
  ...(timedeaData as Product[]),
  ...(reviewData as Product[]),
];

function deduplicateProducts(products: Product[]): Product[] {
  const seen = new Set<string>();
  return products.filter((p) => {
    const key = p.goodsNo || p.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return deduplicateProducts(
    ALL_PRODUCTS.filter((p) =>
      p.goodsNm.toLowerCase().includes(q) ||
      p.brandName.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q)
    )
  );
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams;
  const results = searchProducts(q);

  return (
    <div className="mx-auto max-w-[1200px] px-[20px] py-[32px]">
      <div className="mb-[24px]">
        <h1 className="text-[20px] font-bold text-gray-10">
          {q ? (
            <>
              <span className="text-blue-7">&ldquo;{q}&rdquo;</span> 검색 결과{' '}
              <span className="text-[16px] font-medium text-gray-7">
                ({results.length}개)
              </span>
            </>
          ) : (
            '검색어를 입력해주세요'
          )}
        </h1>
      </div>

      {q && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-[80px] text-center">
          <p className="text-[18px] font-semibold text-gray-8 mb-[8px]">
            검색 결과가 없습니다
          </p>
          <p className="text-[14px] text-gray-6">
            다른 검색어를 입력해보세요
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 gap-[12px] lg:grid-cols-4 lg:gap-[20px]">
          {results.map((product) => (
            <ProductCard key={product.goodsNo || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
