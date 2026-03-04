import type { Metadata } from "next";
import StoreBanner from "@/components/StoreBanner";
import ProductCard from "@/components/ProductCard";
import { getDealProducts } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "스마트홈딜이 먼저 써보고 추천하는 가전제품 최저가 공동구매!",
  description: "온라인 최저가 이하 특가상품 가전제품 공동구매 기회를 놓치지 마세요!",
};

export default async function NosearchDealPage() {
  const products = await getDealProducts();
  const dealProducts = products.slice(0, 6);

  return (
    <div>
      <StoreBanner type="nosearchDeal" />

      {/* 스마트홈딜 공동구매 버튼 */}
      <div className="mx-auto max-w-[1200px] px-[20px] pt-[20px]">
        <button className="mx-auto flex h-[44px] w-full max-w-[650px] items-center justify-center rounded-[10px] border border-blue-7 bg-white text-[15px] font-bold text-blue-7">
          스마트홈딜 공동구매
        </button>
      </div>

      {/* 상품 그리드 */}
      <div className="mx-auto max-w-[1200px] px-[20px] pb-[150px] pt-[30px]">
        <div
          className="grid grid-cols-1 gap-y-[30px] lg:grid-cols-2 lg:gap-x-[40px]"
        >
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* 스마트홈딜 MD 추천상품 섹션 */}
      <div className="mx-auto max-w-[1200px] px-[20px] pb-[100px]">
        <div className="border-t border-gray-3 pt-[40px]">
          <p className="text-[20px] font-extrabold text-blue-7">스마트홈딜 MD 추천상품</p>
          <p className="mt-[4px] text-[14px] text-gray-7">
            가전 전문가 스마트홈딜MD가 선정한 이번주 추천 상품은?
          </p>

          <div className="mt-[20px] flex items-center gap-[10px]">
            <button className="flex h-[44px] items-center justify-center rounded-[10px] border border-blue-7 bg-white px-[13px] text-[15px] font-bold text-blue-7">
              스마트홈딜 MD 추천상품
            </button>
            <div className="scrollbar-hide flex items-center gap-[8px] overflow-x-auto">
              {["전체", "비데", "전기밥솥", "빔프로젝터", "전기매트/전기요", "구강세정기/칫솔살균기"].map((label, i) => (
                <button
                  key={label}
                  className={`shrink-0 rounded-full px-[14px] py-[8px] text-[13px] font-medium ${
                    i === 0
                      ? "bg-gray-10 text-white"
                      : "bg-white text-gray-10 border border-gray-3"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
