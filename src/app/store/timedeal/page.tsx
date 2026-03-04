import type { Metadata } from "next";
import StoreBanner from "@/components/StoreBanner";
import ProductsGrid from "@/components/ProductsGrid";
import { getTimedealProducts } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "놓치면 후회할 타임딜",
  description: "한정 시간 특가! 놓치면 후회할 타임딜 상품을 확인하세요.",
};

export default async function TimedealPage() {
  const products = await getTimedealProducts();

  return (
    <div>
      <StoreBanner type="timedeal" />
      <div className="mx-auto max-w-[1200px] px-[20px] pb-[100px] pt-[32px] lg:px-[30px]">
        <ProductsGrid products={products} />
      </div>
    </div>
  );
}
