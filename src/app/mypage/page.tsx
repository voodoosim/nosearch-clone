'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useWishlist } from '@/components/WishlistProvider';
import { useRecentlyViewed } from '@/components/RecentlyViewedProvider';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const MENU_ITEMS: MenuItem[][] = [
  [
    {
      label: '주문내역',
      href: '/mypage/orders',
      icon: (
        <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
        </svg>
      ),
    },
    {
      label: '찜 목록',
      href: '/mypage/wishlist',
      icon: (
        <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
    },
    {
      label: '최근 본 상품',
      href: '/mypage/recent',
      icon: (
        <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ],
  [
    {
      label: '1:1 문의',
      href: '/mypage/inquiry',
      icon: (
        <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      ),
    },
    {
      label: '공지사항',
      href: '/mypage/notice',
      icon: (
        <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
        </svg>
      ),
    },
    {
      label: '설정',
      href: '/mypage/settings',
      icon: (
        <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ],
];

function ChevronRight() {
  return (
    <svg className="w-[16px] h-[16px] text-gray-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

const CHAT_API = process.env.NEXT_PUBLIC_CHAT_API || 'http://localhost:8002';

interface PointsHistory {
  amount: number;
  balance: number;
  reason: string;
  date: string;
}

export default function MyPage() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated' && !!session?.user;
  const { totalCount: wishlistCount } = useWishlist();
  const { items: recentItems } = useRecentlyViewed();
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState<PointsHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !session?.user?.email) return;
    fetch(`${CHAT_API}/api/member/points?email=${encodeURIComponent(session.user.email)}`)
      .then(r => r.json())
      .then(data => {
        setPoints(data.points || 0);
        setHistory(data.history || []);
      })
      .catch(() => {});
  }, [isLoggedIn, session?.user?.email]);

  return (
    <div className="mx-auto max-w-[1200px] px-[20px] py-[24px] pb-[100px] lg:px-[30px] lg:py-[40px] lg:pb-[40px]">
      {/* 프로필 섹션 */}
      <div className="flex items-center gap-[16px] mb-[32px] p-[20px] bg-gray-1 rounded-[12px]">
        <div className="w-[56px] h-[56px] rounded-full bg-blue-7 flex items-center justify-center shrink-0">
          {isLoggedIn ? (
            <span className="text-[22px] font-bold text-white">
              {(session.user?.name || 'U')[0].toUpperCase()}
            </span>
          ) : (
            <svg className="w-[28px] h-[28px] text-white/80" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {isLoggedIn ? (
            <>
              <p className="text-[16px] font-bold text-gray-10 truncate">
                {session.user?.name || '사용자'}
              </p>
              <p className="text-[13px] text-gray-6 truncate">
                {session.user?.email || ''}
              </p>
            </>
          ) : (
            <>
              <p className="text-[16px] font-bold text-gray-10">
                로그인이 필요합니다
              </p>
              <Link
                href="/login"
                className="inline-block mt-[6px] px-[14px] py-[6px] bg-blue-7 text-white text-[13px] font-medium rounded-xl hover:bg-blue-8 transition-colors"
              >
                로그인 / 회원가입
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 포인트 카드 */}
      {isLoggedIn && (
        <div className="mb-[24px] p-[20px] rounded-[12px] text-white" style={{ background: 'linear-gradient(135deg, #0D3822 0%, #1E6B3E 100%)' }}>
          <div className="flex items-center justify-between mb-[12px]">
            <p className="text-[14px] font-medium opacity-90">내 포인트</p>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-[12px] opacity-80 hover:opacity-100 underline"
            >
              {showHistory ? '닫기' : '내역보기'}
            </button>
          </div>
          <p className="text-[28px] font-bold">{points.toLocaleString()}P</p>

          {showHistory && history.length > 0 && (
            <div className="mt-[16px] pt-[12px] border-t border-white/20">
              <div className="flex flex-col gap-[8px] max-h-[200px] overflow-y-auto">
                {history.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-[13px]">
                    <div className="flex-1 min-w-0">
                      <span className="opacity-70 mr-[8px]">{item.date.slice(5, 10)}</span>
                      <span className="opacity-90">{item.reason}</span>
                    </div>
                    <span className={`font-bold shrink-0 ml-[8px] ${item.amount > 0 ? '' : 'opacity-70'}`}>
                      {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()}P
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showHistory && history.length === 0 && (
            <p className="mt-[12px] pt-[12px] border-t border-white/20 text-[13px] opacity-70">
              포인트 내역이 없습니다.
            </p>
          )}
        </div>
      )}

      {/* 메뉴 리스트 */}
      <div className="flex flex-col gap-[24px]">
        {MENU_ITEMS.map((group, gi) => (
          <div key={gi} className="border border-gray-3 rounded-[12px] overflow-hidden">
            {group.map((item, ii) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-[14px] px-[20px] min-h-[52px] hover:bg-gray-2 transition-colors active:bg-gray-2 ${
                  ii < group.length - 1 ? 'border-b border-gray-3' : ''
                }`}
              >
                <span className="text-blue-7 shrink-0">{item.icon}</span>
                <span className="flex-1 text-[15px] font-medium text-gray-10">
                  {item.label}
                </span>
                {item.href === '/mypage/wishlist' && wishlistCount > 0 && (
                  <span className="min-w-[20px] h-[20px] flex items-center justify-center rounded-full bg-red-5 text-white text-[11px] font-bold px-[5px] mr-[4px]">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
                {item.href === '/mypage/recent' && recentItems.length > 0 && (
                  <span className="min-w-[20px] h-[20px] flex items-center justify-center rounded-full bg-gray-5 text-white text-[11px] font-bold px-[5px] mr-[4px]">
                    {recentItems.length > 99 ? '99+' : recentItems.length}
                  </span>
                )}
                <ChevronRight />
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* 로그아웃 */}
      {isLoggedIn && (
        <div className="mt-[32px]">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full py-[14px] text-[15px] font-medium text-gray-6 border border-gray-3 rounded-[8px] hover:bg-gray-1 transition-colors"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
