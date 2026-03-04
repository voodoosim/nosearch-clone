import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '1:1 문의 | 스마트홈딜',
  description: '1:1 문의를 통해 궁금한 점을 문의하세요.',
};

export default function InquiryPage() {
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
          <h1 className="text-[20px] font-bold text-gray-10">1:1 문의</h1>
        </div>
        <button className="px-[14px] py-[8px] bg-blue-7 text-white text-[13px] font-medium rounded-[8px] hover:bg-blue-8 transition-colors shrink-0">
          문의 접수
        </button>
      </div>

      {/* 운영 안내 카드 */}
      <div className="mb-[28px] p-[16px] bg-gray-1 border border-gray-3 rounded-[12px]">
        <div className="flex items-center gap-[8px] mb-[12px]">
          <svg
            className="w-[16px] h-[16px] text-blue-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-[14px] font-semibold text-gray-10">운영시간 안내</p>
        </div>
        <div className="flex flex-col gap-[6px]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-gray-7">평일 (월 - 금)</span>
            <span className="text-[13px] font-medium text-gray-10">10:00 - 18:00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-gray-7">주말 / 공휴일</span>
            <span className="text-[13px] font-medium text-gray-5">휴무</span>
          </div>
          <div className="mt-[8px] pt-[8px] border-t border-gray-3">
            <p className="text-[12px] text-gray-5 leading-[1.6]">
              운영시간 이후 접수된 문의는 다음 영업일에 순차적으로 답변드립니다.
            </p>
          </div>
        </div>
      </div>

      {/* 빈 상태 */}
      <div className="flex flex-col items-center justify-center py-[56px] gap-[16px]">
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
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-[16px] font-semibold text-gray-10 mb-[6px]">
            문의 내역이 없습니다
          </p>
          <p className="text-[13px] text-gray-5">
            궁금한 점이 있으시면 언제든지 문의해 주세요
          </p>
        </div>
        <button className="mt-[8px] px-[24px] py-[12px] bg-blue-7 text-white text-[14px] font-medium rounded-[8px] hover:bg-blue-8 transition-colors">
          문의하기
        </button>
      </div>
    </div>
  );
}
