import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/components/ProductCard";
import contents from "@/data/contents.json";
import dealProducts from "@/data/products-deal.json";

interface ContentItem {
  id: string;
  category: string;
  title: string;
  summary: string;
  thumbnail: string;
  date: string;
  views: number;
  readTime: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "구매가이드": "bg-blue-1 text-blue-7",
  "비교분석": "bg-blue-1 text-blue-7",
  "사용팁": "bg-blue-1 text-blue-7",
  "트렌드": "bg-blue-1 text-blue-7",
};

function formatViews(views: number): string {
  if (views >= 10000) {
    const v = (views / 10000).toFixed(1);
    return `${v.endsWith('.0') ? v.slice(0, -2) : v}만`;
  }
  if (views >= 1000) {
    const v = (views / 1000).toFixed(1);
    return `${v.endsWith('.0') ? v.slice(0, -2) : v}천`;
  }
  return views.toLocaleString("ko-KR");
}

export async function generateStaticParams() {
  return (contents as ContentItem[]).map((item) => ({
    id: item.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = (contents as ContentItem[]).find((c) => c.id === id);
  if (!item) return { title: "콘텐츠를 찾을 수 없습니다" };
  return {
    title: `${item.title} - 스마트홈딜 가이드`,
    description: item.summary,
  };
}

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = (contents as ContentItem[]).find((c) => c.id === id);
  if (!item) notFound();

  const badgeClass = CATEGORY_COLORS[item.category] || "bg-gray-3 text-gray-9";
  const relatedProducts = (dealProducts as Product[]).slice(0, 4);

  return (
    <div className="mx-auto max-w-[1200px] pb-[150px] pt-[30px]">
      {/* 상단 네비게이션 */}
      <div className="px-[20px] lg:px-[30px] mb-[20px]">
        <div className="flex items-center gap-[6px] text-[12px] text-gray-6">
          <Link href="/store/contents" className="text-gray-6 hover:text-blue-7 transition-colors">
            가이드
          </Link>
          <span>&gt;</span>
          <span className="text-gray-9">{item.category}</span>
        </div>
      </div>

      {/* 글 헤더 */}
      <div className="px-[20px] lg:px-[30px] mb-[30px]">
        <span className={`inline-block px-[10px] py-[3px] text-[12px] font-medium rounded-full ${badgeClass}`}>
          {item.category}
        </span>
        <h1 className="mt-[12px] text-[22px] lg:text-[28px] font-extrabold leading-[1.4] text-gray-10">
          {item.title}
        </h1>
        <div className="mt-[12px] flex items-center gap-[10px] text-[13px] text-gray-6">
          <span>{item.date}</span>
          <span className="text-gray-4">|</span>
          <span>조회 {formatViews(item.views)}</span>
          <span className="text-gray-4">|</span>
          <span>{item.readTime} 읽기</span>
        </div>
      </div>

      {/* 본문 */}
      <div className="px-[20px] lg:px-[30px] mb-[50px]">
        <div className="border-t border-gray-3 pt-[30px] max-w-[780px]">
          {/* 핵심 요약 */}
          <div className="mb-[32px] border-l-[3px] border-blue-7 pl-[18px] py-[4px]">
            <p className="text-[15px] lg:text-[16px] leading-[1.7] text-gray-9 font-medium">
              {item.summary}
            </p>
          </div>

          {/* 본문 단락 */}
          <div className="flex flex-col gap-[20px] text-[14px] lg:text-[15px] leading-[1.85] text-gray-8">
            <p>
              가전제품을 구매할 때 가장 중요한 것은 <strong className="text-gray-10 font-semibold">나의 생활 패턴에 맞는 제품</strong>을 고르는 것입니다.
              스펙이 아무리 높아도 사용 환경과 맞지 않으면 효과가 절반으로 줄어듭니다.
              스마트홈딜 전문 에디터가 수십 개 모델을 직접 사용하며 얻은 인사이트를 정리했습니다.
            </p>

            {/* 포인트 카드 */}
            <div className="rounded-[14px] bg-blue-1 border border-blue-3 p-[20px] my-[8px]">
              <p className="text-[13px] font-bold text-blue-7 uppercase tracking-wide mb-[12px]">핵심 체크포인트</p>
              <ul className="flex flex-col gap-[8px]">
                {['가격 대비 성능(가성비) 우선순위 확인', '브랜드 AS 기간 및 서비스센터 위치', '실사용 리뷰 100개 이상 제품 선택', '에너지효율 등급 — 연간 전기료 차이 큼', '설치/배송 조건 (무료설치 여부)'].map((point, i) => (
                  <li key={i} className="flex items-start gap-[8px] text-[14px] text-blue-8">
                    <span className="shrink-0 w-[20px] h-[20px] rounded-full bg-blue-7 text-white text-[11px] font-bold flex items-center justify-center mt-[1px]">{i + 1}</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <p>
              특히 최신 제품일수록 스마트폰 연동·앱 제어 기능이 강화되어 있습니다. 초기 설정 난이도와 앱 완성도도 중요한 선택 기준이 되었습니다.
              실제로 동일 가격대에서 앱 품질 차이만으로 만족도가 크게 갈리는 경우를 많이 목격했습니다.
            </p>

            {/* 이미지 플레이스홀더 */}
            <div className="w-full rounded-[12px] overflow-hidden border border-gray-3 my-[8px]" style={{ background: 'linear-gradient(135deg, #FFF5EB 0%, #FEE2D5 100%)', minHeight: '220px' }}>
              <div className="flex flex-col items-center justify-center h-[220px] gap-[10px]">
                <svg className="w-[40px] h-[40px] text-gray-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M6.75 18h10.5M3.375 4.5h17.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125H3.375A1.125 1.125 0 012.25 16.875V5.625c0-.621.504-1.125 1.125-1.125z" />
                </svg>
                <p className="text-[13px] text-gray-5">{item.title} — 비교 이미지</p>
              </div>
            </div>

            <p>
              가격은 구매 시점에 따라 10~30% 이상 차이가 날 수 있습니다. 타임딜·공동구매를 적극 활용하면 동일 제품을 훨씬 저렴하게 구입할 수 있습니다.
              스마트홈딜에서는 매주 최저가 이하 공동구매를 진행하니 찜 기능을 활용해 알림을 받아보세요.
            </p>
          </div>

          {/* 하단 태그 */}
          <div className="mt-[32px] pt-[20px] border-t border-gray-3 flex flex-wrap gap-[6px]">
            {['가전', item.category, '구매팁', '스마트홈딜'].map((tag) => (
              <span key={tag} className="px-[10px] py-[4px] rounded-full bg-gray-2 text-[12px] font-medium text-gray-6">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 관련 상품 추천 */}
      <div className="px-[20px] lg:px-[30px]">
        <div className="border-t border-gray-3 pt-[30px]">
          <div className="mb-[20px]">
            <p className="text-[18px] lg:text-[22px] font-extrabold text-blue-7">
              관련 추천 상품
            </p>
            <p className="text-[12px] text-gray-7 mt-[4px]">
              이 글과 관련된 스마트홈딜 추천 상품
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-[16px] gap-y-[30px] lg:grid-cols-4 lg:gap-x-[20px] lg:gap-y-[50px]">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
