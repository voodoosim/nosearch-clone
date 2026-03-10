import type { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/products';

export const revalidate = 60;

const CATEGORY_MAP: Record<string, {
  label: string;
  desc: string;
  bg: string;
  accent: string;
  categoryNames: string[];
}> = {
  kitchen: {
    label: '주방',
    desc: '에어프라이어 · 전기밥솥 · 커피머신 · 식기세척기 · 주방소형가전',
    bg: 'linear-gradient(160deg, #4A0E0A 0%, #C0392B 100%)',
    accent: '#E74C3C',
    categoryNames: [
      '에어프라이어', '전기압력밥솥', '전기레인지', '캡슐커피머신', '토스터',
      '블렌더/믹서기', '식기세척기', '식기건조기', '전기포트/멀티포트',
      '주방용품기타', '주방기타', '전자저울', '밀키트',
    ],
  },
  cleaning: {
    label: '청소',
    desc: '로봇청소기 · 무선청소기 · 스팀청소기 · 물걸레청소기',
    bg: 'linear-gradient(160deg, #0A1E3A 0%, #2980B9 100%)',
    accent: '#3498DB',
    categoryNames: [
      '로봇청소기', '무선청소기', '물걸레/스팀청소기', '청소포/소모품',
    ],
  },
  tv: {
    label: 'TV·모니터',
    desc: '빔프로젝터 · 모니터 · TV · 헤드셋',
    bg: 'linear-gradient(160deg, #0A0A1A 0%, #1A1A2E 100%)',
    accent: '#4A90E2',
    categoryNames: [
      '빔프로젝터', '모니터', 'TV', '헤드셋/이어폰',
    ],
  },
  living: {
    label: '생활가전',
    desc: '공기청정기 · 가습기 · 제습기 · 선풍기 · 서큘레이터',
    bg: 'linear-gradient(160deg, #0A2A1E 0%, #117A65 100%)',
    accent: '#1ABC9C',
    categoryNames: [
      '공기청정기', '가습기', '제습기', '서큘레이터', '선풍기',
      'HEPA필터', '라디에이터', '온풍기', '욕실난방기', '욕실용품',
      '방향제', '핸드워시/디스펜서',
    ],
  },
  health: {
    label: '헬스·뷰티',
    desc: '발마사지기 · 헤어케어 · 구강케어 · 안마기',
    bg: 'linear-gradient(160deg, #2A0A3A 0%, #7D3C98 100%)',
    accent: '#9B59B6',
    categoryNames: [
      '발마사지기', '헤어케어', '구강세정기/칫솔살균기', '안마기',
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORY_MAP[slug];
  if (!cat) return { title: '스마트홈딜 스토어' };
  return {
    title: `${cat.label} — 스마트홈딜`,
    description: cat.desc,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = CATEGORY_MAP[slug];

  if (!cat) {
    return (
      <div className="flex flex-col items-center py-[80px]">
        <p className="text-[16px] text-gray-6">존재하지 않는 카테고리입니다.</p>
        <Link href="/store" className="mt-[16px] text-[14px] text-blue-7 hover:underline">스토어 홈으로</Link>
      </div>
    );
  }

  const all = await getAllProducts();
  const products = all.filter((p) =>
    cat.categoryNames.some((cn) =>
      p.categoryName === cn || p.goodsNm.includes(cn)
    )
  );

  return (
    <div>
      {/* 히어로 */}
      <div className="relative overflow-hidden" style={{ background: cat.bg }}>
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `radial-gradient(circle at 70% 40%, ${cat.accent} 0%, transparent 55%)` }} />
        <div className="relative mx-auto max-w-[1200px] px-[20px] lg:px-[30px] py-[48px] lg:py-[72px]">
          <Link href="/store" className="inline-flex items-center gap-[6px] text-[12px] text-white/50 hover:text-white/70 transition-colors mb-[16px]">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            스토어 홈
          </Link>
          <h1 className="text-[32px] lg:text-[44px] font-black text-white tracking-tight leading-none mb-[10px]">
            {cat.label}
          </h1>
          <p className="text-[14px] lg:text-[16px] text-white/60">{cat.desc}</p>
          <p className="text-[12px] text-white/40 mt-[8px]">총 {products.length}개 상품</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-[20px] pb-[100px] pt-[32px] lg:px-[30px]">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-[10px] gap-y-[12px] lg:grid-cols-4 lg:gap-x-[16px] lg:gap-y-[20px]">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-[80px] text-center">
            <div className="w-[64px] h-[64px] rounded-full bg-gray-2 flex items-center justify-center mb-[16px]">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="text-gray-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-gray-7 mb-[6px]">{cat.label} 상품 준비 중</p>
            <p className="text-[13px] text-gray-5 mb-[24px]">곧 다양한 상품이 등록됩니다.</p>
            <Link href="/store" className="inline-flex items-center gap-[6px] px-[20px] py-[10px] rounded-full bg-gray-2 text-[13px] font-semibold text-gray-7 hover:bg-gray-3 transition-colors">
              스토어 홈으로
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
