import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-10">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/60" />

      {/* 콘텐츠 */}
      <div className="relative z-10 w-full max-w-[400px] px-[20px] py-[40px]">
        {/* 로고 */}
        <div className="mb-[32px] text-center">
          <p className="mb-[8px] text-[14px] text-white/70">전자제품 고민될 땐?</p>
          <Link href="/">
            <span className="text-[36px] font-extrabold text-white">노써치</span>
          </Link>
          <p className="mt-[8px] text-[14px] leading-[22px] text-white/70">
            지금 가입하고 나에게 딱 맞는<br />
            가전제품 추천받고 다양한 혜택을 받아보세요.
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
