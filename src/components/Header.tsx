"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/components/CartProvider";

const NAV_ITEMS = [
  { label: "카테고리", href: "/recommendation/item-list", active: false },
  { label: "구매가이드", href: "/contents/guide", active: false },
  { label: "스토어", href: "/store", active: true },
  {
    label: "휴대폰 견적비교",
    href: "https://bidding.nosearch.com/",
    active: false,
    badge: true,
  },
];

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const { totalCount } = useCart();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('q') as HTMLInputElement;
    const query = input.value.trim();
    if (query) {
      router.push(`/store/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header>
      <div className="sticky top-0 z-[500]">
        <div className="flex h-[50px] items-center border-b border-gray-3 bg-white px-[20px] lg:h-[90px]">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            {/* Desktop logo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="160"
              height="36"
              viewBox="0 0 180 40"
              fill="none"
              className="hidden lg:block"
            >
              {/* House icon */}
              <path d="M4 18 L20 4 L36 18" stroke="#E8701A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="8" y="18" width="24" height="16" rx="1" stroke="#E8701A" strokeWidth="2.5" />
              <rect x="15" y="24" width="10" height="10" rx="1" fill="#E8701A" />
              <rect x="26" y="8" width="4" height="8" rx="1" fill="#E8701A" />
              <path d="M17 13.5 Q20 11 23 13.5" stroke="#E8701A" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
              <circle cx="20" cy="15.5" r="1" fill="#E8701A" />
              {/* Brand text */}
              <text
                x="46"
                y="28"
                fontFamily="'Pretendard', 'Noto Sans KR', sans-serif"
                fontSize="18"
                fontWeight="700"
                fill="#1e293b"
                letterSpacing="-0.5"
              >스마트홈딜</text>
            </svg>

            {/* Mobile logo (icon only) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 40 40"
              fill="none"
              className="block lg:hidden"
            >
              <path d="M4 20 L20 4 L36 20" stroke="#E8701A" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="8" y="20" width="24" height="16" rx="1.5" stroke="#E8701A" strokeWidth="2.8" />
              <rect x="14.5" y="26" width="11" height="10" rx="1" fill="#E8701A" />
              <rect x="26" y="8" width="4.5" height="9" rx="1" fill="#E8701A" />
              <path d="M16.5 15 Q20 12 23.5 15" stroke="#E8701A" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
              <circle cx="20" cy="17.5" r="1.2" fill="#E8701A" />
            </svg>
          </Link>

          <div className="flex flex-1">
            {/* Desktop Nav */}
            <section className="hidden flex-1 lg:block">
              <nav>
                <ul className="ml-[30px] flex items-center justify-evenly">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href}>
                        <div className="flex h-[44px] w-[105px] cursor-pointer items-center justify-center">
                          <p
                            className={`text-[16px] font-bold relative ${
                              item.active ? "text-blue-7" : "text-gray-10"
                            }`}
                          >
                            {item.badge && (
                              <span className="absolute -top-[2px] -right-[8px] w-[6px] h-[6px] bg-red-500 rounded-full" />
                            )}
                            {item.label}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </section>

            {/* Search Bar */}
            <section className="flex-1 px-[20px] lg:ml-[20px] lg:mr-[40px] lg:mt-[2px]">
              <div className="flex w-full items-center justify-center bg-white">
                <form onSubmit={handleSearch} className="flex w-full flex-1 items-center justify-center bg-gray-1 px-[16px] h-[44px] lg:h-[40px] lg:rounded-[5px] lg:border lg:border-gray-2 rounded-full">
                  <input
                    name="q"
                    placeholder="검색어를 입력하세요"
                    className="h-full w-full bg-gray-1 text-[16px] lg:text-[14px] placeholder:text-gray-7 focus:outline-none"
                  />
                  <button type="submit" className="pl-[10px] shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="10.5" cy="10.5" r="8" stroke="#1A1A1A" strokeWidth="1" />
                      <path d="M16 16L22 22" stroke="#1A1A1A" strokeWidth="1" />
                    </svg>
                  </button>
                </form>
              </div>
            </section>

            {/* Right Actions */}
            <section className="hidden items-center lg:flex">
              <ul className="flex h-[30px] items-center divide-x divide-gray-4">
                <li>
                  <Link href="/store/cart">
                    <div className="relative flex items-center pr-[14px] cursor-pointer">
                      <svg width="24" height="24" viewBox="0 0 24 25" fill="none">
                        <path d="M3.47169 1.33325V0.833252H3.89323L3.9645 1.24872L3.47169 1.33325ZM4.27221 5.99992L3.78082 6.09264L3.77941 6.08445L4.27221 5.99992ZM21.3776 16.8726L21.8669 16.9756L21.3776 16.8726ZM6.31994 16.852L6.81127 16.7593L6.31994 16.852ZM7.3026 17.1666H20.3991V18.1666H7.3026V17.1666Z" fill="#1A1A1A" />
                        <circle r="1.83333" cx="18.9999" cy="22.3333" stroke="#1A1A1A" />
                        <circle r="1.83333" cx="8.49992" cy="22.3333" stroke="#1A1A1A" />
                      </svg>
                      {totalCount > 0 && (
                        <span className="absolute -top-[6px] -right-[2px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-blue-7 text-white text-[11px] font-bold px-[4px]">
                          {totalCount > 99 ? '99+' : totalCount}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
                <li className="flex items-center px-[14px]">
                  <Link href="/mypage" className="cursor-pointer">
                    <p className="text-[14px] font-bold text-gray-10">
                      마이페이지
                    </p>
                  </Link>
                </li>
                <li className="flex items-center px-[14px]">
                  {session?.user ? (
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="cursor-pointer"
                    >
                      <p className="text-[14px] font-bold text-gray-10">
                        로그아웃
                      </p>
                    </button>
                  ) : (
                    <Link href="/login" className="cursor-pointer">
                      <p className="text-[14px] font-bold text-gray-10">
                        회원가입 | 로그인
                      </p>
                    </Link>
                  )}
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </header>
  );
}
