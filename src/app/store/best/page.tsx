import type { Metadata } from "next";
import StoreBanner from "@/components/StoreBanner";
import ProductsGrid from "@/components/ProductsGrid";
import { getBestProducts } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "이번주 인기 상품",
  description: "이번주 가장 인기있는 상품을 확인하세요!",
};

export default async function BestPage() {
  const products = await getBestProducts();

  return (
    <div>
      <StoreBanner type="best" />
      <div className="mx-auto max-w-[1200px] px-[20px] pb-[100px] pt-[32px] lg:px-[30px]">
        <ProductsGrid products={products} showRanking />
      </div>
    </div>
  );
}
