'use client';

import Link from 'next/link';

const NAV_ITEMS = [
  {
    label: '홈',
    href: '/',
    icon: (active: boolean) => (
      <svg
        className={`w-[22px] h-[22px] ${active ? 'text-blue-7' : 'text-gray-5'}`}
        fill={active ? 'currentColor' : 'none'}
        stroke='currentColor'
        strokeWidth={active ? 0 : 1.8}
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H5a1 1 0 01-1-1V9.75z'
        />
        <path strokeLinecap='round' strokeLinejoin='round' d='M9 22V12h6v10' />
      </svg>
    ),
  },
  {
    label: '카테고리',
    href: '/recommendation/item-list',
    icon: (active: boolean) => (
      <svg
        className={`w-[22px] h-[22px] ${active ? 'text-blue-7' : 'text-gray-5'}`}
        fill={active ? 'currentColor' : 'none'}
        stroke='currentColor'
        strokeWidth={active ? 0 : 1.8}
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z'
        />
      </svg>
    ),
  },
  {
    label: '구매가이드',
    href: '/contents/guide?selected-tab=all',
    icon: (active: boolean) => (
      <svg
        className={`w-[22px] h-[22px] ${active ? 'text-blue-7' : 'text-gray-5'}`}
        fill={active ? 'currentColor' : 'none'}
        stroke='currentColor'
        strokeWidth={active ? 0 : 1.8}
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z'
        />
      </svg>
    ),
  },
  {
    label: '스토어',
    href: '/store',
    active: true,
    icon: (active: boolean) => (
      <svg
        className={`w-[22px] h-[22px] ${active ? 'text-blue-7' : 'text-gray-5'}`}
        fill={active ? 'currentColor' : 'none'}
        stroke='currentColor'
        strokeWidth={active ? 0 : 1.8}
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
        />
      </svg>
    ),
  },
  {
    label: '마이페이지',
    href: '/mypage',
    icon: (active: boolean) => (
      <svg
        className={`w-[22px] h-[22px] ${active ? 'text-blue-7' : 'text-gray-5'}`}
        fill={active ? 'currentColor' : 'none'}
        stroke='currentColor'
        strokeWidth={active ? 0 : 1.8}
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
        />
      </svg>
    ),
  },
];

export default function MobileBottomNav() {
  return (
    <nav className='lg:hidden'>
      <ul
        className='fixed bottom-0 z-[999] flex w-full items-center justify-around border-t border-gray-3 bg-gray-1/97'
        style={{ backdropFilter: 'blur(12px)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {NAV_ITEMS.map((item) => (
          <li key={item.label} className='flex-1'>
            <Link href={item.href}>
              <div className='flex min-h-[58px] flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform select-none py-[8px]'>
                {item.icon(!!item.active)}
                <p
                  className={`mt-[2px] select-none text-[11px] ${
                    item.active ? 'font-bold text-blue-7' : 'font-medium text-gray-6'
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
  );
}
