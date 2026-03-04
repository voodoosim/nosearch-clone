"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const STORE_TABS = [
  { label: "스토어홈", href: "/store" },
  { label: "공동구매", href: "/store/deal" },
  { label: "리뷰템", href: "/store/reviewTem" },
  { label: "타임딜", href: "/store/timedeal" },
  { label: "이번주 인기", href: "/store/best" },
  { label: "기획전", href: "/store/exhibition" },
  { label: "렌탈", href: "/store/rental" },
  { label: "가이드", href: "/store/contents" },
];

export default function StoreSubNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-[50px] z-[100] lg:top-[90px]">
      <ul className="scrollbar-hide flex w-full overflow-auto bg-white px-[20px] lg:min-h-[48px] lg:px-[30px] gap-x-[10px] lg:gap-x-[20px]" style={{ minHeight: '48px' }}>
        {STORE_TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <li key={tab.href} className="flex">
              <Link href={tab.href} className="flex">
                <div className="relative flex cursor-pointer items-center whitespace-nowrap px-[6px] text-center lg:px-[20px] flex-1 justify-center min-h-[44px]">
                  <div className="relative flex items-center gap-x-[8px]">
                    <p
                      className={
                        isActive
                          ? "text-[15px] font-bold text-blue-7"
                          : "text-[15px] font-medium text-gray-10"
                      }
                    >
                      {tab.label}
                    </p>
                  </div>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 h-[3px] w-full bg-blue-7" />
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
