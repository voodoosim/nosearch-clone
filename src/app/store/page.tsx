import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getDealProducts, getBestProducts } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "스마트홈딜 스토어",
  description: "스마트홈딜이 엄선한 최고의 제품을 만나보세요!",
};

export default async function StoreHomePage() {
  const [dealProducts, bestProducts] = await Promise.all([
    getDealProducts(),
    getBestProducts(),
  ]);

  const SECTIONS = [
    {
      title: "공동구매",
      description: "스마트홈딜이 먼저 써보고 추천하는 최저가 공동구매",
      href: "/store/deal",
      products: dealProducts,
    },
    {
      title: "이번주 인기",
      description: "이번주 가장 많이 팔린 인기 상품",
      href: "/store/best",
      products: bestProducts,
    },
  ];

  return (
    <div className="mx-auto max-w-[1200px] pb-[150px] pt-[30px]">
      {SECTIONS.map((section) => (
        <div key={section.title} className="mb-[50px]">
          <div className="mb-[20px] flex items-center justify-between px-[20px] lg:px-[30px]">
            <div>
              <p className="text-[22px] font-extrabold text-gray-10 lg:text-[28px]">
                {section.title}
              </p>
              <p className="text-[12px] text-gray-7">{section.description}</p>
            </div>
            <Link href={section.href}>
              <div className="flex cursor-pointer items-center gap-[4px]">
                <p className="text-[13px] text-gray-9 lg:text-[15px]">더보기</p>
                <span className="text-[12px] text-gray-7">&gt;</span>
              </div>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-[16px] gap-y-[30px] px-[20px] lg:grid-cols-4 lg:gap-x-[20px] lg:gap-y-[50px] lg:px-[30px]">
            {section.products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
