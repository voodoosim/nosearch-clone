import Header from "@/components/Header";
import StoreSubNav from "@/components/StoreSubNav";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <StoreSubNav />
      <main>{children}</main>
      <footer className="pb-[80px] lg:pb-[50px]">
        <div className="mx-auto max-w-[1200px] px-[20px] pt-[50px] lg:px-[30px]">
          <div className="border-t border-gray-3 pt-[30px]">
            <div className="flex flex-col gap-[10px] lg:flex-row lg:justify-between">
              <div>
                <p className="text-[14px] font-bold text-gray-10">노써치</p>
                <p className="text-[14px] text-gray-7 mt-[4px]">
                  뭐 살지 고민될 땐? 검색하지 말고 노써치 하자!
                </p>
              </div>
              <div className="flex gap-[20px]">
                <p className="text-[12px] text-gray-7">이용약관</p>
                <p className="text-[12px] font-bold text-gray-9">개인정보처리방침</p>
                <p className="text-[12px] text-gray-7">사업자정보</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-5 mt-[20px]">
              (주)노써치 | 대표: 서영준 | 사업자등록번호: 000-00-00000
            </p>
            <p className="text-[11px] text-gray-5 mt-[4px]">
              Copyright 2024 NoSearch. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      <MobileBottomNav />
    </div>
  );
}
