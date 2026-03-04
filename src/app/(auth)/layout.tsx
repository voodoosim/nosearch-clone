import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex min-h-[100dvh] items-start justify-center overflow-y-auto lg:items-center"
      style={{ background: 'linear-gradient(160deg, #0D2B1E 0%, #1A4A30 40%, #0F3020 100%)' }}
    >
      {/* 배경 패턴 */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />
      {/* 배경 그라디언트 오버레이 */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(74,144,112,0.2) 0%, transparent 60%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 80%, rgba(26,85,64,0.3) 0%, transparent 60%)' }} />

      {/* 콘텐츠 */}
      <div className="relative z-10 w-full max-w-[420px] px-[20px] py-[48px]">
        {/* 로고 */}
        <div className="mb-[36px] text-center">
          <Link href="/" className="inline-flex items-center gap-[10px] mb-[16px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 40 40" fill="none">
              <path d="M4 20 L20 4 L36 20" stroke="#4A9070" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="8" y="20" width="24" height="16" rx="1.5" stroke="#4A9070" strokeWidth="2.8" />
              <rect x="14.5" y="26" width="11" height="10" rx="1" fill="#4A9070" />
            </svg>
            <span className="text-[32px] font-extrabold text-white tracking-tight">스마트홈딜</span>
          </Link>
          <p className="text-[14px] leading-[1.7] text-white/50">
            스마트한 소비자들의 최종 선택
          </p>
        </div>

        {/* 폼 카드 */}
        <div
          className="rounded-2xl p-[28px] lg:p-[36px]"
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
