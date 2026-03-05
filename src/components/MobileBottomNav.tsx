'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWishlist } from '@/components/WishlistProvider';

const NAV_ITEMS = [
  {
    label: '홈',
    href: '/',
    exact: true,
    icon: (active: boolean) => (
      <svg
        className={`w-[22px] h-[22px] ${active ? 'text-blue-7' : 'text-gray-5'}`}
        fill={active ? 'currentColor' : 'none'}
        stroke='currentColor'
        strokeWidth={active ? 0 : 1.8}
        viewBox='0 0 24 24'
      >
        <path strokeLinecap='round' strokeLinejoin='round' d='M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H5a1 1 0 01-1-1V9.75z' />
        <path strokeLinecap='round' strokeLinejoin='round' d='M9 22V12h6v10' />
      </svg>
    ),
  },
  {
    label: '스토어',
    href: '/store',
    exact: false,
    icon: (active: boolean) => (
      <svg
        className={`w-[22px] h-[22px] ${active ? 'text-blue-7' : 'text-gray-5'}`}
        fill={active ? 'currentColor' : 'none'}
        stroke='currentColor'
        strokeWidth={active ? 0 : 1.8}
        viewBox='0 0 24 24'
      >
        <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z' />
      </svg>
    ),
  },
  {
    label: '찜',
    href: '/mypage/wishlist',
    exact: false,
    wishlist: true,
    icon: (active: boolean) => (
      <svg
        className={`w-[22px] h-[22px] ${active ? 'text-red-5' : 'text-gray-5'}`}
        fill={active ? 'currentColor' : 'none'}
        stroke='currentColor'
        strokeWidth={active ? 0 : 1.8}
        viewBox='0 0 24 24'
      >
        <path strokeLinecap='round' strokeLinejoin='round' d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' />
      </svg>
    ),
  },
  {
    label: '고객센터',
    href: '/store/contents',
    exact: false,
    icon: (active: boolean) => (
      <svg
        className={`w-[22px] h-[22px] ${active ? 'text-blue-7' : 'text-gray-5'}`}
        fill={active ? 'currentColor' : 'none'}
        stroke='currentColor'
        strokeWidth={active ? 0 : 1.8}
        viewBox='0 0 24 24'
      >
        <path strokeLinecap='round' strokeLinejoin='round' d='M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z' />
      </svg>
    ),
  },
  {
    label: '마이페이지',
    href: '/mypage',
    exact: false,
    icon: (active: boolean) => (
      <svg
        className={`w-[22px] h-[22px] ${active ? 'text-blue-7' : 'text-gray-5'}`}
        fill={active ? 'currentColor' : 'none'}
        stroke='currentColor'
        strokeWidth={active ? 0 : 1.8}
        viewBox='0 0 24 24'
      >
        <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' />
      </svg>
    ),
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalCount: wishlistCount } = useWishlist();

  function isActive(item: typeof NAV_ITEMS[0]) {
    if (item.exact) return pathname === item.href;
    if (item.href === '/store') return pathname.startsWith('/store') && !pathname.startsWith('/mypage');
    if (item.href === '/mypage/wishlist') return pathname === '/mypage/wishlist';
    if (item.href === '/mypage') return pathname.startsWith('/mypage') && pathname !== '/mypage/wishlist';
    return pathname.startsWith(item.href);
  }

  return (
    <nav className='lg:hidden'>
      <ul
        className='fixed bottom-0 z-[999] flex w-full items-center justify-around border-t border-gray-3'
        style={{ background: '#FAF7F2', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          return (
            <li key={item.label} className='flex-1'>
              <Link href={item.href}>
                <div className='relative flex min-h-[58px] flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform select-none py-[8px]'>
                  {item.icon(active)}
                  {/* 찜 배지 */}
                  {item.wishlist && wishlistCount > 0 && (
                    <span className="absolute top-[8px] left-1/2 translate-x-[2px] min-w-[14px] h-[14px] flex items-center justify-center rounded-full bg-red-5 text-white text-[9px] font-bold px-[3px]">
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </span>
                  )}
                  <p className={`mt-[2px] select-none text-[10px] ${active ? 'font-bold text-blue-7' : 'font-medium text-gray-5'} ${item.wishlist && active ? 'text-red-5' : ''}`}>
                    {item.label}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
