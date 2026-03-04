const BANNERS: Record<string, {
  label: string;
  title: string;
  subtitle: string;
  badges: string[];
  bg: string;
  accent: string;
  lightAccent: string;
}> = {
  deal: {
    label: 'SPECIAL DEAL',
    title: '공동구매',
    subtitle: '스마트홈딜이 직접 써보고 엄선한\n최저가 공동구매 상품',
    badges: ['직접 검증', '최저가 보장', '안심 구매'],
    bg: 'linear-gradient(135deg, #0B2E1A 0%, #154D2C 55%, #0D3822 100%)',
    accent: '#4ADE80',
    lightAccent: 'rgba(74,222,128,0.12)',
  },
  reviewTem: {
    label: 'REVIEW PICK',
    title: '리뷰템',
    subtitle: '전문가가 직접 사용해보고\n솔직하게 추천하는 제품',
    badges: ['전문가 검증', '실사용 후기', '평점 4.8+'],
    bg: 'linear-gradient(135deg, #1C1200 0%, #332200 55%, #261A00 100%)',
    accent: '#FBBF24',
    lightAccent: 'rgba(251,191,36,0.12)',
  },
  timedeal: {
    label: 'TIME DEAL',
    title: '타임딜',
    subtitle: '지금 이 순간만 가능한\n한정 수량 특가 상품',
    badges: ['한정 수량', '시간 한정', '최대 70% 할인'],
    bg: 'linear-gradient(135deg, #1E0808 0%, #360F0F 55%, #280A0A 100%)',
    accent: '#F87171',
    lightAccent: 'rgba(248,113,113,0.12)',
  },
  best: {
    label: 'THIS WEEK',
    title: '이번주 인기',
    subtitle: '실제 구매자들이 선택한\n이번주 가장 인기 있는 상품',
    badges: ['실구매 기반', '주간 집계', '리뷰 검증'],
    bg: 'linear-gradient(135deg, #0A1628 0%, #122040 55%, #0D1A32 100%)',
    accent: '#60A5FA',
    lightAccent: 'rgba(96,165,250,0.12)',
  },
  rental: {
    label: 'RENTAL',
    title: '렌탈',
    subtitle: '초기 비용 없이 편리하게\n프리미엄 가전을 경험하세요',
    badges: ['무료 설치', 'AS 보장', '월 소액 납부'],
    bg: 'linear-gradient(135deg, #111118 0%, #1C1C2C 55%, #161620 100%)',
    accent: '#A78BFA',
    lightAccent: 'rgba(167,139,250,0.12)',
  },
  exhibition: {
    label: 'EXHIBITION',
    title: '기획전',
    subtitle: '테마별로 엄선한\n스마트홈딜 특별 기획 상품',
    badges: ['테마 큐레이션', '특별 혜택', '한정 구성'],
    bg: 'linear-gradient(135deg, #0D1C0D 0%, #162616 55%, #111C11 100%)',
    accent: '#34D399',
    lightAccent: 'rgba(52,211,153,0.12)',
  },
};

export default function StoreBanner({ type }: { type: string }) {
  const b = BANNERS[type];
  if (!b) return null;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ background: b.bg, minHeight: '180px', height: 'clamp(180px, 28vw, 300px)' }}
    >
      {/* 배경 도트 패턴 */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* 오른쪽 대형 원형 장식 */}
      <div
        className="absolute -right-[60px] top-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 'clamp(200px, 35vw, 420px)',
          height: 'clamp(200px, 35vw, 420px)',
          background: b.accent,
          opacity: 0.07,
        }}
      />
      <div
        className="absolute right-[6%] top-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 'clamp(100px, 18vw, 240px)',
          height: 'clamp(100px, 18vw, 240px)',
          background: b.accent,
          opacity: 0.05,
        }}
      />

      {/* 왼쪽 빛 번짐 */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at -10% 50%, ${b.accent}28 0%, transparent 60%)`,
        }}
      />

      {/* 콘텐츠 */}
      <div
        className="relative z-10 flex h-full flex-col justify-center px-[24px] lg:px-[52px]"
        style={{ paddingTop: '28px', paddingBottom: '28px' }}
      >
        {/* 카테고리 라벨 */}
        <p
          className="mb-[10px] text-[10px] font-bold tracking-[0.22em] lg:text-[11px]"
          style={{ color: b.accent }}
        >
          {b.label}
        </p>

        {/* 타이틀 */}
        <h1
          className="mb-[8px] font-extrabold tracking-tight text-white"
          style={{ fontSize: 'clamp(28px, 5.5vw, 48px)', lineHeight: 1.05 }}
        >
          {b.title}
        </h1>

        {/* 서브타이틀 */}
        <p
          className="mb-[20px] whitespace-pre-line leading-[1.65]"
          style={{
            fontSize: 'clamp(12px, 1.6vw, 14px)',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          {b.subtitle}
        </p>

        {/* 신뢰 뱃지 */}
        <div className="flex flex-wrap gap-[6px]">
          {b.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full px-[10px] py-[4px] text-[11px] font-semibold"
              style={{
                background: b.lightAccent,
                color: b.accent,
                border: `1px solid ${b.accent}30`,
              }}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* 하단 페이드 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[48px]"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.18))' }}
      />
    </div>
  );
}
