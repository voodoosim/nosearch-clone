import type { Metadata } from "next";
import StoreBanner from "@/components/StoreBanner";
import ProductsGrid from "@/components/ProductsGrid";
import { getReviewProducts } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "스마트홈딜이 직접 써보고 추천하는 리뷰템",
  description: "스마트홈딜이 직접 사용해보고 추천하는 리뷰템을 만나보세요!",
};

export default async function ReviewTemPage() {
  const products = await getReviewProducts();

  return (
    <div>
      <StoreBanner type="reviewTem" />
      <div className="mx-auto max-w-[1200px] px-[20px] pb-[100px] pt-[32px] lg:px-[30px]">
        <ProductsGrid products={products} />
      </div>
    </div>
  );
}
