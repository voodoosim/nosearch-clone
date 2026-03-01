"use client";

import Link from "next/link";

const NAV_ITEMS = [
  { label: "홈", href: "/" },
  { label: "카테고리", href: "/recommendation/item-list" },
  { label: "구매가이드", href: "/contents/guide?selected-tab=all" },
  { label: "스토어", href: "/store", active: true },
  { label: "휴대폰 비교", href: "https://bidding.nosearch.com/" },
];

export default function MobileBottomNav() {
  return (
    <nav className="lg:hidden">
      <ul className="fixed bottom-0 z-[999] flex h-[58px] w-full items-center justify-around border-t border-gray-3 bg-white">
        {NAV_ITEMS.map((item) => (
          <li key={item.label}>
            <Link href={item.href}>
              <div className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform select-none min-w-[4.3em]">
                <div className="w-[27px] h-[27px] flex items-center justify-center">
                  <div className={`w-[14px] h-[14px] rounded-full ${item.active ? 'bg-blue-7' : 'bg-gray-4'}`} />
                </div>
                <p className={`mt-[1px] select-none text-[10px] ${
                  item.active ? "font-bold text-primary" : "font-medium text-gray-10"
                }`}>
                  {item.label}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
