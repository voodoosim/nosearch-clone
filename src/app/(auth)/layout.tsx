import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[100dvh] items-start justify-center overflow-y-auto lg:items-center" style={{ background: 'linear-gradient(135deg, #3D1A00 0%, #6B2E00 50%, #3D1A00 100%)' }}>
      {/* 배경 오버레이 */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(232,112,26,0.15) 0%, rgba(0,0,0,0.5) 100%)' }} />

      {/* 콘텐츠 */}
      <div className="relative z-10 w-full max-w-[400px] px-[20px] py-[40px]">
        {/* 로고 */}
        <div className="mb-[32px] text-center">
          <p className="mb-[8px] text-[14px] text-white/70">전자제품 고민될 땐?</p>
          <Link href="/">
            <span className="text-[36px] font-extrabold text-white">스마트홈딜</span>
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
