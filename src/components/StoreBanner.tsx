const BANNERS: Record<string, {
  label: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  badges: string[];
  stat: string;
  statLabel: string;
  bg: string;
  accent: string;
  accentDim: string;
  accentGlow: string;
}> = {
  storeHome: {
    label: 'SMART HOME DEAL',
    eyebrow: '스마트홈딜 공식 스토어',
    title: '스마트홈딜',
    subtitle: '가전 전문가가 직접 검증하고 선별한\n최고의 제품을 합리적인 가격에',
    badges: ['전문가 검증', '최저가 보장', '안심 결제'],
    stat: '14,200',
    statLabel: '누적 구매 고객',
    bg: 'linear-gradient(135deg, #08101A 0%, #0E1E30 50%, #0A1824 100%)',
    accent: '#5B9CF6',
    accentDim: 'rgba(91,156,246,0.08)',
    accentGlow: 'rgba(91,156,246,0.16)',
  },
  deal: {
    label: 'JOINT PURCHASE',
    eyebrow: '스마트홈딜 공동구매',
    title: '공동구매',
    subtitle: '직접 써보고 검증한 제품만\n온라인 최저가로 제공합니다',
    badges: ['품질 직접 검증', '최저가 보장', '안심 구매'],
    stat: '2,847',
    statLabel: '이번달 구매 완료',
    bg: 'linear-gradient(135deg, #061810 0%, #0A2818 50%, #0C3020 100%)',
    accent: '#3ECF6E',
    accentDim: 'rgba(62,207,110,0.08)',
    accentGlow: 'rgba(62,207,110,0.18)',
  },
  reviewTem: {
    label: 'EXPERT REVIEW',
    eyebrow: '전문가 추천 리뷰템',
    title: '리뷰템',
    subtitle: '전문가가 직접 사용하고\n솔직하게 추천하는 제품',
    badges: ['전문가 실사용', '객관적 평가', '평점 4.8+'],
    stat: '1,204',
    statLabel: '이번달 리뷰 등록',
    bg: 'linear-gradient(135deg, #160E00 0%, #281A00 50%, #1E1200 100%)',
    accent: '#F5A623',
    accentDim: 'rgba(245,166,35,0.08)',
    accentGlow: 'rgba(245,166,35,0.18)',
  },
  timedeal: {
    label: 'LIMITED OFFER',
    eyebrow: '한정 수량 타임딜',
    title: '타임딜',
    subtitle: '지금 이 순간만 가능한\n특별한 가격을 놓치지 마세요',
    badges: ['한정 수량', '시간 한정', '최대 70% 할인'],
    stat: '312',
    statLabel: '현재 남은 수량',
    bg: 'linear-gradient(135deg, #160606 0%, #280A0A 50%, #200808 100%)',
    accent: '#F06060',
    accentDim: 'rgba(240,96,96,0.08)',
    accentGlow: 'rgba(240,96,96,0.18)',
  },
  best: {
    label: 'WEEKLY BEST',
    eyebrow: '실구매 기반 인기 순위',
    title: '이번주 인기',
    subtitle: '실제 구매자들의 선택으로\n집계된 이번주 베스트 상품',
    badges: ['실구매 기반', '주간 집계', '리뷰 검증'],
    stat: '9,631',
    statLabel: '이번주 누적 구매',
    bg: 'linear-gradient(135deg, #060E1C 0%, #0C1A30 50%, #081424 100%)',
    accent: '#5B9CF6',
    accentDim: 'rgba(91,156,246,0.08)',
    accentGlow: 'rgba(91,156,246,0.18)',
  },
  rental: {
    label: 'RENTAL SERVICE',
    eyebrow: '프리미엄 렌탈 서비스',
    title: '렌탈',
    subtitle: '초기 비용 없이 프리미엄 가전을\n월 소액으로 경험하세요',
    badges: ['무료 설치', 'AS 전담 보장', '월 소액 납부'],
    stat: '4,100',
    statLabel: '현재 렌탈 이용 중',
    bg: 'linear-gradient(135deg, #0C0C16 0%, #141424 50%, #10101C 100%)',
    accent: '#9B7CF8',
    accentDim: 'rgba(155,124,248,0.08)',
    accentGlow: 'rgba(155,124,248,0.18)',
  },
  exhibition: {
    label: 'CURATION',
    eyebrow: '테마별 특별 기획전',
    title: '기획전',
    subtitle: '테마별로 엄선한\n스마트홈딜 특별 기획 상품',
    badges: ['테마 큐레이션', '특별 혜택', '한정 구성'],
    stat: '580',
    statLabel: '기획전 참여 상품',
    bg: 'linear-gradient(135deg, #080E08 0%, #101A10 50%, #0C1410 100%)',
    accent: '#2EC4A0',
    accentDim: 'rgba(46,196,160,0.08)',
    accentGlow: 'rgba(46,196,160,0.18)',
  },
};

/* 체크마크 SVG */
function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <circle cx="5.5" cy="5.5" r="5.5" fill={color} fillOpacity="0.2" />
      <path d="M3 5.5l1.8 1.8L8 3.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* 대각선 스트라이프 패턴 ID */
const PATTERN_ID = 'banner-diagonal';

export default function StoreBanner({ type }: { type: string }) {
  const b = BANNERS[type];
  if (!b) return null;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: b.bg,
        minHeight: '200px',
        height: 'clamp(200px, 30vw, 320px)',
      }}
    >
      {/* SVG 패턴 정의 */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <pattern
            id={PATTERN_ID}
            x="0" y="0"
            width="24" height="24"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="24" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
          </pattern>
        </defs>
      </svg>

      {/* 대각선 라인 패턴 */}
      <div className="absolute inset-0" style={{ background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cline x1='0' y1='0' x2='24' y2='24' stroke='rgba(255,255,255,0.03)' stroke-width='1'/%3E%3C/svg%3E")` }} />

      {/* 상단 얇은 accent 라인 */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(to right, transparent, ${b.accent}60, ${b.accent}40, transparent)` }}
      />

      {/* 왼쪽 radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at -5% 60%, ${b.accentGlow} 0%, transparent 55%)` }}
      />

      {/* 오른쪽 장식 — 기하학적 링 */}
      <div
        className="absolute -right-[50px] top-1/2 -translate-y-1/2 rounded-full border pointer-events-none"
        style={{
          width: 'clamp(220px, 38vw, 440px)',
          height: 'clamp(220px, 38vw, 440px)',
          borderColor: `${b.accent}14`,
          borderWidth: '1px',
        }}
      />
      <div
        className="absolute right-[2%] top-1/2 -translate-y-1/2 rounded-full border pointer-events-none"
        style={{
          width: 'clamp(130px, 22vw, 280px)',
          height: 'clamp(130px, 22vw, 280px)',
          borderColor: `${b.accent}10`,
          borderWidth: '1px',
        }}
      />
      {/* 가장 안쪽 채워진 원 */}
      <div
        className="absolute right-[10%] top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: 'clamp(60px, 10vw, 120px)',
          height: 'clamp(60px, 10vw, 120px)',
          background: b.accentDim,
        }}
      />

      {/* 콘텐츠 */}
      <div
        className="relative z-10 h-full flex flex-col justify-center"
        style={{ padding: 'clamp(24px, 4vw, 40px) clamp(24px, 5vw, 56px)' }}
      >
        {/* 아이웨이브 라벨 */}
        <div className="flex items-center gap-[8px] mb-[10px]">
          <div
            className="h-[1px] w-[24px]"
            style={{ background: b.accent }}
          />
          <span
            className="text-[10px] font-bold tracking-[0.28em] uppercase"
            style={{ color: b.accent }}
          >
            {b.label}
          </span>
        </div>

        {/* 타이틀 */}
        <h1
          className="font-extrabold text-white mb-[8px]"
          style={{
            fontSize: 'clamp(30px, 5.5vw, 52px)',
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
          }}
        >
          {b.title}
        </h1>

        {/* 서브타이틀 */}
        <p
          className="whitespace-pre-line mb-[20px]"
          style={{
            fontSize: 'clamp(12px, 1.5vw, 14px)',
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.7,
          }}
        >
          {b.subtitle}
        </p>

        {/* 하단 행: 뱃지 + 통계 */}
        <div className="flex flex-wrap items-center justify-between gap-[12px]">
          {/* 신뢰 뱃지 */}
          <div className="flex flex-wrap gap-[6px]">
            {b.badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-[5px] rounded-full px-[10px] py-[4px] text-[11px] font-semibold"
                style={{
                  background: b.accentDim,
                  color: b.accent,
                  border: `1px solid ${b.accent}28`,
                }}
              >
                <CheckIcon color={b.accent} />
                {badge}
              </span>
            ))}
          </div>

          {/* 통계 */}
          <div
            className="shrink-0 rounded-[8px] px-[14px] py-[8px] hidden sm:block"
            style={{
              background: 'rgba(0,0,0,0.28)',
              border: `1px solid rgba(255,255,255,0.07)`,
              backdropFilter: 'blur(8px)',
            }}
          >
            <p
              className="font-bold text-white text-right"
              style={{ fontSize: 'clamp(16px, 2.2vw, 20px)', lineHeight: 1 }}
            >
              {b.stat}
              <span className="text-[11px] font-semibold ml-[2px]" style={{ color: b.accent }}>건</span>
            </p>
            <p
              className="text-[10px] mt-[2px] text-right"
              style={{ color: 'rgba(255,255,255,0.38)' }}
            >
              {b.statLabel}
            </p>
          </div>
        </div>
      </div>

      {/* 하단 미세 페이드 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[60px] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.25))' }}
      />
    </div>
  );
}
