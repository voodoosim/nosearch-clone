import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-[24px]"
      style={{ background: '#F0EAE0' }}
    >
      {/* 로고 */}
      <Link href="/" className="mb-[40px]">
        <svg
          width="140"
          height="32"
          viewBox="0 0 140 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="스마트홈딜"
        >
          <rect width="28" height="28" rx="6" y="2" fill="#1E6B3E" />
          <path d="M8 16h12M14 10v12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <text
            x="36"
            y="21"
            fontFamily="'Inter', sans-serif"
            fontWeight="800"
            fontSize="15"
            fill="#1a1a1a"
          >
            스마트홈딜
          </text>
        </svg>
      </Link>

      {/* 404 숫자 */}
      <p className="text-[80px] font-extrabold leading-none text-gray-3 select-none">404</p>

      {/* 제목 */}
      <h1 className="mt-[16px] text-[20px] font-bold text-gray-10 text-center">
        페이지를 찾을 수 없어요
      </h1>

      {/* 설명 */}
      <p className="mt-[10px] text-[14px] text-gray-5 text-center leading-[1.6]">
        요청하신 페이지가 삭제됐거나 주소가 변경됐어요
      </p>

      {/* 버튼 2개 */}
      <div className="mt-[36px] flex flex-col sm:flex-row items-center gap-[12px] w-full max-w-[320px]">
        <Link
          href="/store"
          className="w-full text-center px-[24px] py-[13px] rounded-[10px] bg-blue-7 text-white text-[14px] font-semibold hover:opacity-90 transition-opacity"
        >
          스토어 홈
        </Link>
        <button
          type="button"
          onClick={() => history.back()}
          className="w-full text-center px-[24px] py-[13px] rounded-[10px] border border-gray-3 text-gray-9 text-[14px] font-semibold hover:bg-gray-2 transition-colors"
          style={{ background: '#FAF7F2' }}
        >
          이전 페이지
        </button>
      </div>
    </div>
  );
}
