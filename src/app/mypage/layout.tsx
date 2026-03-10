import Header from "@/components/Header";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="sticky top-0 z-[500]">
        <Header />
      </div>
      <main>{children}</main>
      <footer className="pb-[80px] lg:pb-[50px]">
        <div className="mx-auto max-w-[1200px] px-[20px] pt-[50px] lg:px-[30px]">
          <div className="border-t border-gray-3 pt-[30px]">
            <div className="flex flex-col gap-[10px] lg:flex-row lg:justify-between">
              <div>
                <p className="text-[14px] font-bold text-gray-10">스마트홈딜</p>
                <p className="text-[14px] text-gray-7 mt-[4px]">
                  뭐 살지 고민될 땐? 검색하지 말고 스마트홈딜 하자!
                </p>
              </div>
              <div className="flex gap-[20px]">
                <p className="text-[12px] text-gray-7">이용약관</p>
                <p className="text-[12px] font-bold text-gray-9">개인정보처리방침</p>
                <p className="text-[12px] text-gray-7">사업자정보</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-5 mt-[20px]">
              (주)스마트홈딜 | 대표: 서영준 | 사업자등록번호: 000-00-00000
            </p>
            <p className="text-[11px] text-gray-5 mt-[4px]">
              Copyright 2026 스마트홈딜. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      <MobileBottomNav />
    </div>
  );
}
