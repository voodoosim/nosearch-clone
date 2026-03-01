"use client";

import Link from "next/link";

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
  return (
    <header>
      <div className="sticky top-0 z-[500]">
        <div className="flex h-[50px] items-center border-b border-gray-3 bg-white px-[20px] lg:h-[90px]">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="32"
              viewBox="0 0 500 162"
              fill="none"
            >
              <path d="M436.087 0.718529H370.017V23.0031H436.087V0.718529Z" fill="#256FFF" />
              <path d="M160.856 134.316V156.965H0V134.316H66.5222V103.741H93.759V134.316H160.856ZM8.16881 4.63151H34.267V65.4278H154.445V88.1767H8.16881V4.63151Z" fill="#256FFF" />
              <path d="M309.387 79.6321H287.6V56.1095H309.387V0.718529H335.065V160.79H309.387V79.6321Z" fill="#256FFF" />
              <path d="M454.038 36.4778V56.3748H417.759C417.483 64.4237 416.693 72.4467 415.394 80.3949C424.856 103.685 442.011 127.153 463.301 144.795L443.194 158.435C428.371 145.51 415.723 130.286 405.733 113.346C397.832 131.421 386.146 147.592 371.466 160.768L348.783 149.283C377.777 124.323 390.788 94.1459 391.772 56.3748H356.233V36.4778H454.038Z" fill="#256FFF" />
              <path d="M500 0H474.333V161.575H500V0Z" fill="#256FFF" />
              <path d="M305.209 134.526C280.967 115.933 278.348 76.7692 278.348 60.7963V0.420053H253.941V60.7963C253.941 78.991 251.509 103.619 240.554 121.913C229.501 103.122 227.069 78.7036 227.069 60.7963V0.420053H202.64V60.7963C202.64 76.5481 200.042 115.259 175.922 134.57L172.529 137.289L188.9 156.423L192.083 153.815C201.601 146.077 209.139 134.57 214.589 119.603C219.828 135.498 227.743 147.945 237.868 156.081L240.477 158.159L243.097 156.103C253.277 148.111 261.07 135.918 266.365 119.713C271.892 134.824 279.541 146.431 289.357 154.323L292.673 156.954L308.702 137.201L305.209 134.526Z" fill="#256FFF" />
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
                <div className="flex w-full flex-1 items-center justify-center bg-gray-1 px-[16px] h-[36px] lg:h-[40px] lg:rounded-[5px] lg:border lg:border-gray-2 rounded-full">
                  <input
                    placeholder="검색어를 입력하세요"
                    className="h-full w-full bg-gray-1 text-[12px] placeholder:text-gray-7 focus:outline-none"
                  />
                  <div className="pl-[10px]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="10.5" cy="10.5" r="8" stroke="#1A1A1A" strokeWidth="1" />
                      <path d="M16 16L22 22" stroke="#1A1A1A" strokeWidth="1" />
                    </svg>
                  </div>
                </div>
              </div>
            </section>

            {/* Right Actions */}
            <section className="hidden items-center lg:flex">
              <ul className="flex h-[30px] items-center divide-x divide-gray-4">
                <li>
                  <Link href="/cart">
                    <div className="flex items-center pr-[14px] cursor-pointer">
                      <svg width="24" height="24" viewBox="0 0 24 25" fill="none">
                        <path d="M3.47169 1.33325V0.833252H3.89323L3.9645 1.24872L3.47169 1.33325ZM4.27221 5.99992L3.78082 6.09264L3.77941 6.08445L4.27221 5.99992ZM21.3776 16.8726L21.8669 16.9756L21.3776 16.8726ZM6.31994 16.852L6.81127 16.7593L6.31994 16.852ZM7.3026 17.1666H20.3991V18.1666H7.3026V17.1666Z" fill="#1A1A1A" />
                        <circle r="1.83333" cx="18.9999" cy="22.3333" stroke="#1A1A1A" />
                        <circle r="1.83333" cx="8.49992" cy="22.3333" stroke="#1A1A1A" />
                      </svg>
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
                  <Link href="/login" className="cursor-pointer">
                    <p className="text-[14px] font-bold text-gray-10">
                      회원가입 | 로그인
                    </p>
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </header>
  );
}
