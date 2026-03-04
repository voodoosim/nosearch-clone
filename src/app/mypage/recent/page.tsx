import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '최근 본 상품 | 스마트홈딜',
  description: '최근 본 상품 목록을 확인하세요.',
};

export default function RecentPage() {
  return (
    <div className="max-w-[600px] mx-auto px-[20px] py-[32px] pb-[100px]">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between mb-[28px]">
        <div className="flex items-center gap-[12px]">
          <Link
            href="/mypage"
            className="text-[14px] text-gray-6 hover:text-gray-10 transition-colors shrink-0"
          >
            ← 마이페이지
          </Link>
          <span className="text-gray-3">|</span>
          <h1 className="text-[20px] font-bold text-gray-10">최근 본 상품</h1>
        </div>
        <button
          className="text-[13px] text-gray-5 hover:text-gray-10 transition-colors"
          disabled
        >
          전체 삭제
        </button>
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
              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-[16px] font-semibold text-gray-10 mb-[6px]">
            최근 본 상품이 없습니다
          </p>
          <p className="text-[13px] text-gray-5">
            상품을 둘러보면 여기에 기록됩니다
          </p>
        </div>
        <Link
          href="/store"
          className="mt-[8px] px-[24px] py-[12px] bg-blue-7 text-white text-[14px] font-medium rounded-[8px] hover:bg-blue-8 transition-colors"
        >
          쇼핑하러 가기
        </Link>
      </div>
    </div>
  );
}
