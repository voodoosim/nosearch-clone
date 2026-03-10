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
  { label: "스마트관", href: "/store/smart" },
  { label: "애플관", href: "/store/apple" },
  { label: "삼성관", href: "/store/samsung" },
  { label: "해외직구관", href: "/store/overseas" },
  { label: "렌탈", href: "/store/rental" },
  { label: "가이드", href: "/store/contents" },
];

export default function StoreSubNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-3" style={{ background: '#FAF7F2' }}>
      <ul className="scrollbar-hide flex w-full overflow-auto px-[16px] lg:px-[30px] gap-x-[4px]" style={{ minHeight: '44px' }}>
        {STORE_TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <li key={tab.href} className="flex shrink-0">
              <Link href={tab.href} className="flex">
                <div className="relative flex cursor-pointer items-center whitespace-nowrap px-[10px] min-h-[44px] justify-center">
                  <p
                    className={`text-[13px] transition-colors ${
                      isActive
                        ? "font-bold text-blue-7"
                        : "font-medium text-gray-6 hover:text-gray-10"
                    }`}
                  >
                    {tab.label}
                  </p>
                  {isActive && (
                    <div className="absolute bottom-0 left-[10px] right-[10px] h-[2px] rounded-full bg-blue-7" />
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
