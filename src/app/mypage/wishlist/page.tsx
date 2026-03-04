import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '찜 목록 | 스마트홈딜',
  description: '찜한 상품 목록을 확인하세요.',
};

export default function WishlistPage() {
  return (
    <div className="max-w-[600px] mx-auto px-[20px] py-[32px] pb-[100px]">
      {/* 상단 헤더 */}
      <div className="flex items-center gap-[12px] mb-[28px]">
        <Link
          href="/mypage"
          className="text-[14px] text-gray-6 hover:text-gray-10 transition-colors shrink-0"
        >
          ← 마이페이지
        </Link>
        <span className="text-gray-3">|</span>
        <h1 className="text-[20px] font-bold text-gray-10">찜 목록</h1>
      </div>

      {/* 빈 상태 */}
      <div className="flex flex-col items-center justify-center py-[72px] gap-[16px]">
        <div className="w-[72px] h-[72px] rounded-full bg-gray-2 flex items-center justify-center">
          <svg
            className="w-[36px] h-[36px] text-gray-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-[16px] font-semibold text-gray-10 mb-[6px]">
            아직 찜한 상품이 없습니다
          </p>
          <p className="text-[13px] text-gray-5">
            마음에 드는 상품을 찜해두면 여기서 확인할 수 있어요
          </p>
        </div>
        <Link
          href="/store"
          className="mt-[8px] px-[24px] py-[12px] bg-blue-7 text-white text-[14px] font-medium rounded-[8px] hover:bg-blue-8 transition-colors"
        >
          쇼핑하러 가기
        </Link>
      </div>

      {/* 하단 안내 카드 */}
      <div className="mt-[8px] p-[16px] bg-gray-1 border border-gray-3 rounded-[12px]">
        <div className="flex items-start gap-[10px]">
          <svg
            className="w-[18px] h-[18px] text-blue-7 mt-[1px] shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
          <p className="text-[13px] text-gray-7 leading-[1.6]">
            상품 페이지에서 하트를 눌러 찜할 수 있어요.
            <br />
            찜한 상품은 이 페이지에서 모아볼 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
