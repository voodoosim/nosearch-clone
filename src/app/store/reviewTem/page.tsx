import type { Metadata } from "next";
import StoreBanner from "@/components/StoreBanner";
import ProductCard from "@/components/ProductCard";
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
      <div className="mx-auto max-w-[1200px] px-[20px] pb-[150px] pt-[30px] lg:px-[30px]">
        <div className="mb-[20px]">
          <p className="text-[22px] font-extrabold text-gray-10 lg:text-[28px]">
            리뷰템
          </p>
          <p className="text-[14px] text-gray-7 mt-[4px]">
            스마트홈딜이 직접 사용해보고 추천하는 리뷰템
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-[16px] gap-y-[30px] lg:grid-cols-4 lg:gap-x-[20px] lg:gap-y-[50px]">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
