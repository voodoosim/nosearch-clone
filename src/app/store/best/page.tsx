import type { Metadata } from "next";
import StoreBanner from "@/components/StoreBanner";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/components/ProductCard";
import products from "@/data/products-best.json";

export const metadata: Metadata = {
  title: "이번주 인기 상품",
  description: "이번주 가장 인기있는 상품을 확인하세요!",
};

export default function BestPage() {
  return (
    <div>
      <StoreBanner type="best" />
      <div className="mx-auto max-w-[1200px] px-[20px] pb-[150px] pt-[30px] lg:px-[30px]">
        <div className="mb-[20px]">
          <p className="text-[22px] font-extrabold text-gray-10 lg:text-[28px]">
            이번주 인기
          </p>
          <p className="text-[14px] text-gray-7 mt-[4px]">
            이번주 가장 많이 팔린 인기 상품
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-[16px] gap-y-[30px] lg:grid-cols-4 lg:gap-x-[20px] lg:gap-y-[50px]">
          {(products as Product[]).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
