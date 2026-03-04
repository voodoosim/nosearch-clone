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
      <footer className="pb-[80px] lg:pb-0">
        <div className="mx-auto max-w-[1200px] px-[20px] pt-[60px] pb-[40px] lg:px-[30px]">
          <div className="border-t border-gray-3 pt-[36px]">
            <div className="flex flex-col gap-[24px] lg:flex-row lg:justify-between lg:items-start">
              {/* 브랜드 */}
              <div>
                <div className="flex items-center gap-[8px] mb-[8px]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 40 40" fill="none">
                    <path d="M4 20 L20 4 L36 20" stroke="#7C4F2A" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="8" y="20" width="24" height="16" rx="1.5" stroke="#7C4F2A" strokeWidth="2.8" />
                    <rect x="14.5" y="26" width="11" height="10" rx="1" fill="#7C4F2A" />
                  </svg>
                  <p className="text-[15px] font-bold text-gray-10">스마트홈딜</p>
                </div>
                <p className="text-[13px] text-gray-6 leading-[1.6]">
                  뭐 살지 고민될 땐? 검색하지 말고 스마트홈딜 하자!
                </p>
              </div>
              {/* 링크 */}
              <div className="flex gap-[24px] items-center">
                <p className="text-[12px] text-gray-6 hover:text-gray-10 cursor-pointer transition-colors">이용약관</p>
                <p className="text-[12px] font-semibold text-gray-7 hover:text-blue-7 cursor-pointer transition-colors">개인정보처리방침</p>
                <p className="text-[12px] text-gray-6 hover:text-gray-10 cursor-pointer transition-colors">사업자정보</p>
              </div>
            </div>
            <div className="mt-[24px] pt-[20px] border-t border-gray-3">
              <p className="text-[11px] text-gray-5">
                (주)스마트홈딜 &nbsp;|&nbsp; 대표: 서영준 &nbsp;|&nbsp; 사업자등록번호: 000-00-00000
              </p>
              <p className="text-[11px] text-gray-5 mt-[6px]">
                Copyright 2026 스마트홈딜. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
      <MobileBottomNav />
    </div>
  );
}
