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
  "구매가이드": "bg-blue-7 text-white",
  "비교분석": "bg-blue-8 text-white",
  "사용팁": "bg-blue-5 text-gray-10",
  "트렌드": "bg-blue-6 text-white",
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
          <Link href="/store/contents" className="hover:text-blue-7 transition-colors">
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

      {/* 본문 영역 (placeholder) */}
      <div className="px-[20px] lg:px-[30px] mb-[50px]">
        <div className="border-t border-gray-3 pt-[30px]">
          {/* 본문 placeholder */}
          <div className="space-y-[16px]">
            <div className="h-[12px] w-full bg-gray-2 rounded" />
            <div className="h-[12px] w-[95%] bg-gray-2 rounded" />
            <div className="h-[12px] w-[88%] bg-gray-2 rounded" />
            <div className="h-[12px] w-[92%] bg-gray-2 rounded" />
            <div className="h-[20px]" />
            <div className="h-[200px] lg:h-[300px] w-full bg-gradient-to-br from-[#FFF5EB] to-[#FEE2D5] rounded-[8px] flex items-center justify-center">
              <p className="text-[14px] text-gray-6">본문 이미지 영역</p>
            </div>
            <div className="h-[20px]" />
            <div className="h-[12px] w-full bg-gray-2 rounded" />
            <div className="h-[12px] w-[90%] bg-gray-2 rounded" />
            <div className="h-[12px] w-[85%] bg-gray-2 rounded" />
            <div className="h-[12px] w-[93%] bg-gray-2 rounded" />
            <div className="h-[12px] w-[78%] bg-gray-2 rounded" />
            <div className="h-[20px]" />
            <div className="h-[12px] w-full bg-gray-2 rounded" />
            <div className="h-[12px] w-[88%] bg-gray-2 rounded" />
            <div className="h-[12px] w-[92%] bg-gray-2 rounded" />
            <div className="h-[12px] w-[70%] bg-gray-2 rounded" />
          </div>

          {/* 요약 인용 */}
          <div className="mt-[30px] border-l-[3px] border-blue-7 pl-[16px] py-[8px]">
            <p className="text-[14px] lg:text-[15px] leading-[1.6] text-gray-9 font-medium">
              {item.summary}
            </p>
          </div>
        </div>
      </div>

      {/* 관련 상품 추천 */}
      <div className="px-[20px] lg:px-[30px]">
        <div className="border-t border-gray-3 pt-[30px]">
          <div className="mb-[20px]">
            <p className="text-[18px] lg:text-[22px] font-extrabold text-gray-10">
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
