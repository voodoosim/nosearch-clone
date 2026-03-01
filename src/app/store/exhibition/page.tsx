import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "기획전",
  description: "노써치 기획전 특가 상품을 만나보세요!",
};

export default function ExhibitionPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-[20px] pb-[150px] pt-[30px] lg:px-[30px]">
      <div className="mb-[20px]">
        <p className="text-[22px] font-extrabold text-gray-10 lg:text-[28px]">
          기획전
        </p>
        <p className="text-[14px] text-gray-7 mt-[4px]">
          노써치 기획전 특가 상품
        </p>
      </div>
      <div className="flex items-center justify-center py-[100px]">
        <div className="text-center">
          <div className="relative mx-auto h-[120px] w-[120px] lg:h-[160px] lg:w-[160px]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-1">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L12 22M2 12L22 12" stroke="#D9D9D9" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <p className="mt-[20px] text-[14px] text-gray-7">
            현재 진행 중인 기획전이 없습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
