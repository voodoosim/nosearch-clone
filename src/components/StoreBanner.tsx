"use client";

import { useState, useEffect } from "react";

type BannerConfig = {
  label: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  badges: string[];
  stat: string;
  statUnit: string;
  statLabel: string;
  bg: string;
  accent: string;
  accentDim: string;
  accentGlow: string;
  special?: "countdown" | "rating" | "progress" | "verified";
  rating?: number;
  progress?: number;
  progressLabel?: string;
};

const BANNERS: Record<string, BannerConfig> = {
  storeHome: {
    label: "OFFICIAL STORE",
    eyebrow: "스마트홈딜 공식 스토어",
    title: "스마트홈딜",
    subtitle: "가전 전문가가 직접 검증하고 선별한\n최고의 제품을 합리적인 가격에",
    badges: ["전문가 검증", "최저가 보장", "안심 결제"],
    stat: "14,200",
    statUnit: "명",
    statLabel: "누적 구매 고객",
    bg: "linear-gradient(135deg, #0A0800 0%, #1A1200 45%, #0F0C00 100%)",
    accent: "#C9A227",
    accentDim: "rgba(201,162,39,0.10)",
    accentGlow: "rgba(201,162,39,0.20)",
    special: "verified",
  },
  deal: {
    label: "JOINT PURCHASE",
    eyebrow: "스마트홈딜 공동구매",
    title: "공동구매",
    subtitle: "직접 써보고 검증한 제품만\n온라인 최저가로 제공합니다",
    badges: ["품질 직접 검증", "최저가 보장", "안심 구매"],
    stat: "2,847",
    statUnit: "명",
    statLabel: "이번달 구매 완료",
    bg: "linear-gradient(135deg, #0A0800 0%, #1A1200 45%, #0F0C00 100%)",
    accent: "#C9A227",
    accentDim: "rgba(201,162,39,0.10)",
    accentGlow: "rgba(201,162,39,0.18)",
    special: "progress",
    progress: 74,
    progressLabel: "이번 공동구매 달성률",
  },
  reviewTem: {
    label: "EXPERT REVIEW",
    eyebrow: "전문가 추천 리뷰템",
    title: "리뷰템",
    subtitle: "전문가가 직접 사용하고\n솔직하게 추천하는 제품",
    badges: ["전문가 실사용", "객관적 평가", "평점 4.8+"],
    stat: "1,204",
    statUnit: "건",
    statLabel: "이번달 리뷰 등록",
    bg: "linear-gradient(135deg, #130A00 0%, #201400 45%, #2A1A00 100%)",
    accent: "#F5A623",
    accentDim: "rgba(245,166,35,0.10)",
    accentGlow: "rgba(245,166,35,0.20)",
    special: "rating",
    rating: 4.8,
  },
  timedeal: {
    label: "LIMITED OFFER",
    eyebrow: "한정 수량 타임딜",
    title: "타임딜",
    subtitle: "지금 이 순간만 가능한\n특별한 가격을 놓치지 마세요",
    badges: ["한정 수량", "시간 한정", "최대 70% 할인"],
    stat: "312",
    statUnit: "개",
    statLabel: "현재 남은 수량",
    bg: "linear-gradient(135deg, #140404 0%, #220606 45%, #2A0808 100%)",
    accent: "#F05050",
    accentDim: "rgba(240,80,80,0.10)",
    accentGlow: "rgba(240,80,80,0.20)",
    special: "countdown",
  },
  best: {
    label: "WEEKLY BEST",
    eyebrow: "실구매 기반 인기 순위",
    title: "이번주 인기",
    subtitle: "실제 구매자들의 선택으로\n집계된 이번주 베스트 상품",
    badges: ["실구매 기반", "주간 집계", "리뷰 검증"],
    stat: "9,631",
    statUnit: "건",
    statLabel: "이번주 누적 구매",
    bg: "linear-gradient(135deg, #0A0800 0%, #1A1200 45%, #0F0C00 100%)",
    accent: "#C9A227",
    accentDim: "rgba(201,162,39,0.10)",
    accentGlow: "rgba(201,162,39,0.18)",
  },
  rental: {
    label: "RENTAL SERVICE",
    eyebrow: "프리미엄 렌탈 서비스",
    title: "렌탈",
    subtitle: "초기 비용 없이 프리미엄 가전을\n월 소액으로 경험하세요",
    badges: ["무료 설치", "AS 전담 보장", "월 소액 납부"],
    stat: "4,100",
    statUnit: "건",
    statLabel: "현재 렌탈 이용 중",
    bg: "linear-gradient(135deg, #0A0800 0%, #1A1200 45%, #0F0C00 100%)",
    accent: "#C9A227",
    accentDim: "rgba(201,162,39,0.10)",
    accentGlow: "rgba(201,162,39,0.20)",
  },
  exhibition: {
    label: "CURATION",
    eyebrow: "테마별 특별 기획전",
    title: "기획전",
    subtitle: "테마별로 엄선한\n스마트홈딜 특별 기획 상품",
    badges: ["테마 큐레이션", "특별 혜택", "한정 구성"],
    stat: "580",
    statUnit: "개",
    statLabel: "기획전 참여 상품",
    bg: "linear-gradient(135deg, #0A0800 0%, #1A1200 45%, #0F0C00 100%)",
    accent: "#C9A227",
    accentDim: "rgba(201,162,39,0.10)",
    accentGlow: "rgba(201,162,39,0.20)",
  },
};

/* 카운트다운 훅 — 매일 자정까지 */
function useCountdown() {
  const [time, setTime] = useState({ h: "00", m: "00", s: "00" });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime({
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
        s: String(s).padStart(2, "0"),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="6" fill={color} fillOpacity="0.2" />
      <path d="M3.5 6l1.8 1.8L8.5 4" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon({ filled, color }: { filled: boolean; color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 1.5L11 7H17L12.5 10.5L14 16L9 12.5L4 16L5.5 10.5L1 7H7L9 1.5Z"
        fill={filled ? color : "none"}
        fillOpacity={filled ? 0.9 : 0}
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* 오른쪽 특화 비주얼 컴포넌트 */
function BannerRight({ b }: { b: BannerConfig }) {
  const countdown = useCountdown();

  if (b.special === "countdown") {
    return (
      <div className="hidden lg:flex flex-col items-center justify-center gap-[10px]">
        <p
          className="text-[9px] font-bold tracking-[0.25em] uppercase"
          style={{ color: "rgba(255,255,255,0.38)" }}
        >
          오늘 자정까지 남은 시간
        </p>
        <div className="flex items-center gap-[5px]">
          {[
            { val: countdown.h, label: "시간" },
            { val: countdown.m, label: "분" },
            { val: countdown.s, label: "초" },
          ].map(({ val, label }, i) => (
            <div key={i} className="flex items-center gap-[5px]">
              <div
                className="rounded-[10px] px-[12px] py-[10px] text-center"
                style={{
                  background: "rgba(0,0,0,0.50)",
                  border: `1px solid ${b.accent}30`,
                  backdropFilter: "blur(8px)",
                  minWidth: "52px",
                }}
              >
                <p
                  className="font-extrabold text-white"
                  style={{
                    fontSize: "28px",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {val}
                </p>
                <p
                  className="text-[9px] mt-[3px] font-semibold tracking-[0.1em]"
                  style={{ color: b.accent }}
                >
                  {label}
                </p>
              </div>
              {i < 2 && (
                <span
                  className="font-extrabold pb-[10px]"
                  style={{ fontSize: "22px", color: `${b.accent}60` }}
                >
                  :
                </span>
              )}
            </div>
          ))}
        </div>
        <div
          className="rounded-full px-[16px] py-[5px]"
          style={{
            background: b.accentDim,
            border: `1px solid ${b.accent}30`,
          }}
        >
          <p className="text-[11px] font-bold" style={{ color: b.accent }}>
            마감 임박 — 서두르세요
          </p>
        </div>
      </div>
    );
  }

  if (b.special === "rating" && b.rating !== undefined) {
    const floorRating = Math.floor(b.rating);
    return (
      <div className="hidden lg:flex flex-col items-center justify-center">
        <div
          className="rounded-[18px] px-[32px] py-[24px] text-center"
          style={{
            background: "rgba(0,0,0,0.42)",
            border: `1px solid ${b.accent}20`,
            backdropFilter: "blur(10px)",
          }}
        >
          <p
            className="font-extrabold text-white mb-[10px]"
            style={{ fontSize: "52px", lineHeight: 1, letterSpacing: "-0.03em" }}
          >
            {b.rating}
            <span className="text-[22px] font-semibold" style={{ color: b.accent, marginLeft: "2px" }}>
              /5
            </span>
          </p>
          <div className="flex justify-center gap-[3px] mb-[10px]">
            {[1, 2, 3, 4, 5].map((s) => (
              <StarIcon key={s} filled={s <= floorRating} color={b.accent} />
            ))}
          </div>
          <p className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.40)" }}>
            전문가 평균 평점
          </p>
        </div>
      </div>
    );
  }

  if (b.special === "progress" && b.progress !== undefined) {
    return (
      <div className="hidden lg:flex flex-col justify-center gap-[14px]" style={{ minWidth: "210px" }}>
        <p
          className="text-[9px] font-bold tracking-[0.2em] uppercase"
          style={{ color: "rgba(255,255,255,0.38)" }}
        >
          {b.progressLabel}
        </p>
        <div>
          <p
            className="font-extrabold text-white mb-[8px]"
            style={{ fontSize: "42px", lineHeight: 1, letterSpacing: "-0.02em" }}
          >
            {b.progress}
            <span className="text-[20px] font-semibold ml-[2px]" style={{ color: b.accent }}>
              %
            </span>
          </p>
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: "5px", background: "rgba(255,255,255,0.10)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${b.progress}%`,
                background: `linear-gradient(to right, ${b.accent}70, ${b.accent})`,
              }}
            />
          </div>
        </div>
        <div
          className="rounded-[10px] px-[16px] py-[12px]"
          style={{
            background: "rgba(0,0,0,0.40)",
            border: `1px solid ${b.accent}18`,
            backdropFilter: "blur(8px)",
          }}
        >
          <p
            className="font-bold text-white"
            style={{ fontSize: "22px", lineHeight: 1 }}
          >
            {b.stat}
            <span className="text-[13px] font-semibold ml-[2px]" style={{ color: b.accent }}>
              {b.statUnit}
            </span>
          </p>
          <p className="text-[10px] mt-[3px]" style={{ color: "rgba(255,255,255,0.36)" }}>
            {b.statLabel}
          </p>
        </div>
      </div>
    );
  }

  if (b.special === "verified") {
    return (
      <div className="hidden lg:flex flex-col items-center justify-center gap-[14px]">
        <div
          className="rounded-[20px] px-[32px] py-[26px] text-center"
          style={{
            background: "rgba(0,0,0,0.42)",
            border: `1px solid ${b.accent}18`,
            backdropFilter: "blur(12px)",
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            className="mx-auto mb-[14px]"
          >
            <circle cx="24" cy="24" r="23" stroke={b.accent} strokeWidth="1.2" strokeOpacity="0.35" />
            <circle cx="24" cy="24" r="17" fill={b.accent} fillOpacity="0.07" />
            <path
              d="M15 24l6 6L33 17"
              stroke={b.accent}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p
            className="font-extrabold text-white"
            style={{ fontSize: "28px", lineHeight: 1 }}
          >
            {b.stat}
            <span className="text-[14px] font-semibold ml-[2px]" style={{ color: b.accent }}>
              {b.statUnit}
            </span>
          </p>
          <p className="text-[11px] mt-[5px]" style={{ color: "rgba(255,255,255,0.38)" }}>
            {b.statLabel}
          </p>
        </div>
        <p
          className="text-[9px] font-bold tracking-[0.22em] uppercase"
          style={{ color: `${b.accent}65` }}
        >
          공식 인증 스토어
        </p>
      </div>
    );
  }

  /* 기본 통계 박스 */
  return (
    <div className="hidden lg:flex flex-col items-center justify-center">
      <div
        className="rounded-[14px] px-[28px] py-[22px] text-center"
        style={{
          background: "rgba(0,0,0,0.40)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(8px)",
        }}
      >
        <p
          className="font-extrabold text-white"
          style={{ fontSize: "38px", lineHeight: 1, letterSpacing: "-0.02em" }}
        >
          {b.stat}
          <span className="text-[16px] font-semibold ml-[2px]" style={{ color: b.accent }}>
            {b.statUnit}
          </span>
        </p>
        <p className="text-[11px] mt-[4px]" style={{ color: "rgba(255,255,255,0.36)" }}>
          {b.statLabel}
        </p>
      </div>
    </div>
  );
}

export default function StoreBanner({ type }: { type: string }) {
  const b = BANNERS[type];
  if (!b) return null;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: b.bg,
        minHeight: "240px",
        height: "clamp(240px, 34vw, 400px)",
      }}
    >
      {/* 배경 그리드 패턴 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "48px 48px",
        }}
      />

      {/* 상단 accent 라인 */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: "2px",
          background: `linear-gradient(to right, transparent 0%, ${b.accent}80 25%, ${b.accent}55 75%, transparent 100%)`,
        }}
      />

      {/* 좌측 glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at -8% 55%, ${b.accentGlow} 0%, transparent 58%)` }}
      />

      {/* 우측 glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 108% 45%, ${b.accentGlow} 0%, transparent 58%)` }}
      />

      {/* 장식 링 — 대 */}
      <div
        className="absolute -right-[70px] top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: "clamp(300px, 48vw, 560px)",
          height: "clamp(300px, 48vw, 560px)",
          border: `1px solid ${b.accent}0E`,
        }}
      />
      {/* 장식 링 — 중 */}
      <div
        className="absolute right-[3%] top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: "clamp(180px, 28vw, 340px)",
          height: "clamp(180px, 28vw, 340px)",
          border: `1px solid ${b.accent}08`,
        }}
      />

      {/* 메인 콘텐츠 */}
      <div
        className="relative z-10 h-full flex items-center justify-between"
        style={{ padding: "clamp(28px, 4.5vw, 52px) clamp(24px, 5.5vw, 68px)" }}
      >
        {/* 좌측: 텍스트 */}
        <div className="flex-1" style={{ maxWidth: "580px" }}>
          {/* 라벨 */}
          <div className="flex items-center gap-[10px] mb-[14px]">
            <div className="h-[1px] w-[28px]" style={{ background: b.accent }} />
            <span
              className="text-[10px] font-bold tracking-[0.3em] uppercase"
              style={{ color: b.accent }}
            >
              {b.label}
            </span>
          </div>

          {/* eyebrow */}
          <p
            className="font-medium mb-[6px]"
            style={{
              fontSize: "clamp(11px, 1.1vw, 13px)",
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.04em",
            }}
          >
            {b.eyebrow}
          </p>

          {/* 메인 타이틀 */}
          <h1
            className="font-extrabold text-white mb-[10px]"
            style={{
              fontSize: "clamp(32px, 5.5vw, 58px)",
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
            }}
          >
            {b.title}
          </h1>

          {/* 서브타이틀 */}
          <p
            className="whitespace-pre-line mb-[22px]"
            style={{
              fontSize: "clamp(12px, 1.35vw, 14px)",
              color: "rgba(255,255,255,0.40)",
              lineHeight: 1.78,
            }}
          >
            {b.subtitle}
          </p>

          {/* 신뢰 뱃지 */}
          <div className="flex flex-wrap gap-[7px]">
            {b.badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-[5px] rounded-full px-[12px] py-[5px] text-[11px] font-semibold"
                style={{
                  background: b.accentDim,
                  color: b.accent,
                  border: `1px solid ${b.accent}22`,
                }}
              >
                <CheckIcon color={b.accent} />
                {badge}
              </span>
            ))}
          </div>

          {/* 모바일 통계 (lg 미만) */}
          <div
            className="mt-[18px] inline-flex lg:hidden items-center gap-[8px] rounded-[8px] px-[12px] py-[7px]"
            style={{
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p className="font-bold text-white text-[15px]">
              {b.stat}
              <span className="text-[11px] ml-[1px]" style={{ color: b.accent }}>
                {b.statUnit}
              </span>
            </p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.36)" }}>
              {b.statLabel}
            </p>
          </div>
        </div>

        {/* 우측: 특화 비주얼 */}
        <div className="ml-[40px] shrink-0">
          <BannerRight b={b} />
        </div>
      </div>

      {/* 하단 페이드 */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "80px",
          background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.28))",
        }}
      />
    </div>
  );
}
