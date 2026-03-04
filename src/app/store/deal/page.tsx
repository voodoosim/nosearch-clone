import type { Metadata } from "next";
import StoreBanner from "@/components/StoreBanner";
import ProductsGrid from "@/components/ProductsGrid";
import { getDealProducts } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "스마트홈딜 공동구매 | 가전제품 최저가 특가",
  description: "온라인 최저가 이하 특가상품 가전제품 공동구매 기회를 놓치지 마세요!",
};

export default async function DealPage() {
  const products = await getDealProducts();

  return (
    <div>
      <StoreBanner type="deal" />
      <div className="mx-auto max-w-[1200px] px-[20px] pb-[100px] pt-[32px] lg:px-[30px]">
        <ProductsGrid products={products} />
      </div>
    </div>
  );
}
