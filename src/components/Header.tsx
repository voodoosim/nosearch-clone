"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";

const NAV_ITEMS = [
  { label: "스토어", href: "/store", active: true },
  { label: "공동구매", href: "/store/deal", active: false },
  { label: "기획전", href: "/store/exhibition", active: false },
  { label: "고객센터", href: "/store/contents", active: false },
];

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const { totalCount } = useCart();
  const { totalCount: wishlistCount } = useWishlist();

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
      <div>
        <div
          className="flex h-[56px] items-center border-b border-gray-3 bg-gray-1/95 px-[20px] lg:h-[80px]"
          style={{ backdropFilter: 'blur(12px)', boxShadow: '0 1px 6px 0 rgba(100,70,40,0.08)' }}
        >
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
              <path d="M4 18 L20 4 L36 18" stroke="#1E6B3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="8" y="18" width="24" height="16" rx="1" stroke="#1E6B3E" strokeWidth="2.5" />
              <rect x="15" y="24" width="10" height="10" rx="1" fill="#1E6B3E" />
              <rect x="26" y="8" width="4" height="8" rx="1" fill="#1E6B3E" />
              <path d="M17 13.5 Q20 11 23 13.5" stroke="#1E6B3E" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
              <circle cx="20" cy="15.5" r="1" fill="#1E6B3E" />
              <text
                x="46"
                y="28"
                fontFamily="'Pretendard', 'Noto Sans KR', sans-serif"
                fontSize="18"
                fontWeight="700"
                fill="#2A1F14"
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
              <path d="M4 20 L20 4 L36 20" stroke="#1E6B3E" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="8" y="20" width="24" height="16" rx="1.5" stroke="#1E6B3E" strokeWidth="2.8" />
              <rect x="14.5" y="26" width="11" height="10" rx="1" fill="#1E6B3E" />
              <rect x="26" y="8" width="4.5" height="9" rx="1" fill="#1E6B3E" />
              <path d="M16.5 15 Q20 12 23.5 15" stroke="#1E6B3E" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
              <circle cx="20" cy="17.5" r="1.2" fill="#1E6B3E" />
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
                            className={`text-[15px] font-semibold tracking-tight transition-colors ${
                              item.active ? "text-blue-7" : "text-gray-9 hover:text-blue-7"
                            }`}
                          >
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
            <section className="flex-1 px-[16px] lg:ml-[16px] lg:mr-[32px] lg:mt-[2px]">
              <div className="flex w-full items-center justify-center">
                <form
                  onSubmit={handleSearch}
                  className="flex w-full flex-1 items-center justify-center bg-gray-2 px-[14px] h-[40px] rounded-full border border-gray-3 transition-all focus-within:border-blue-5 focus-within:bg-gray-1"
                >
                  <input
                    name="q"
                    placeholder="어떤 제품을 찾으시나요?"
                    className="h-full w-full bg-transparent text-[14px] text-gray-9 placeholder:text-gray-5 focus:outline-none"
                  />
                  <button type="submit" className="pl-[8px] shrink-0 text-gray-5 hover:text-blue-7 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="10.5" cy="10.5" r="8" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M16 16L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </form>
              </div>
            </section>

            {/* Right Actions */}
            <section className="hidden items-center lg:flex">
              <ul className="flex h-[30px] items-center gap-[4px]">
                <li>
                  <Link href="/mypage/wishlist">
                    <div className="relative flex items-center px-[12px] py-[6px] rounded-lg hover:bg-gray-1 cursor-pointer transition-colors">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="text-gray-9">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      {wishlistCount > 0 && (
                        <span className="absolute top-[2px] right-[6px] min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-red-5 text-white text-[10px] font-bold px-[3px]">
                          {wishlistCount > 99 ? '99+' : wishlistCount}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/store/cart">
                    <div className="relative flex items-center px-[12px] py-[6px] rounded-lg hover:bg-gray-1 cursor-pointer transition-colors">
                      <svg width="22" height="22" viewBox="0 0 24 25" fill="none" className="text-gray-9">
                        <path d="M3.47169 1.33325V0.833252H3.89323L3.9645 1.24872L3.47169 1.33325ZM4.27221 5.99992L3.78082 6.09264L3.77941 6.08445L4.27221 5.99992ZM21.3776 16.8726L21.8669 16.9756L21.3776 16.8726ZM6.31994 16.852L6.81127 16.7593L6.31994 16.852ZM7.3026 17.1666H20.3991V18.1666H7.3026V17.1666Z" fill="currentColor" />
                        <circle r="1.83333" cx="18.9999" cy="22.3333" stroke="currentColor" strokeWidth="1.3" />
                        <circle r="1.83333" cx="8.49992" cy="22.3333" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                      {totalCount > 0 && (
                        <span className="absolute top-[2px] right-[6px] min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-blue-7 text-white text-[10px] font-bold px-[3px]">
                          {totalCount > 99 ? '99+' : totalCount}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mypage"
                    className="flex items-center px-[12px] py-[6px] rounded-lg hover:bg-gray-1 cursor-pointer transition-colors"
                  >
                    <p className="text-[13px] font-semibold text-gray-9">마이페이지</p>
                  </Link>
                </li>
                <li>
                  {session?.user ? (
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center px-[12px] py-[6px] rounded-lg hover:bg-gray-1 cursor-pointer transition-colors"
                    >
                      <p className="text-[13px] font-semibold text-gray-5">로그아웃</p>
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center px-[14px] py-[7px] rounded-lg bg-blue-7 hover:bg-blue-6 cursor-pointer transition-colors"
                    >
                      <p className="text-[13px] font-semibold text-white">로그인</p>
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
