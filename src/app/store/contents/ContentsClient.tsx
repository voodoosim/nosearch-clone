"use client";

import { useState } from "react";
import Link from "next/link";
import type { ContentItem } from "./page";

const CATEGORIES = ["전체", "구매가이드", "비교분석", "사용팁", "트렌드"];

const CATEGORY_COLORS: Record<string, string> = {
  "구매가이드": "bg-blue-7 text-white",
  "비교분석": "bg-blue-8 text-white",
  "사용팁": "bg-blue-5 text-gray-10",
  "트렌드": "bg-blue-6 text-white",
};

const THUMBNAIL_GRADIENTS: Record<string, string> = {
  "구매가이드": "from-[#FFF5EB] to-[#F5A855]",
  "비교분석": "from-[#FFF5EB] to-[#E8701A]",
  "사용팁": "from-[#FFF5EB] to-[#F28C28]",
  "트렌드": "from-[#FEE2D5] to-[#C45A0F]",
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

function ContentCard({ item }: { item: ContentItem }) {
  const gradient = THUMBNAIL_GRADIENTS[item.category] || "from-[#FFF5EB] to-[#F5A855]";
  const badgeClass = CATEGORY_COLORS[item.category] || "bg-gray-3 text-gray-9";

  return (
    <Link href={`/store/contents/${item.id}`} className="block group">
      <article className="overflow-hidden bg-white transition-shadow duration-200 group-hover:shadow-md group-hover:ring-1 group-hover:ring-blue-7/20 card-hover">
        {/* 썸네일 */}
        <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <div className="text-center px-[16px]">
                <div className="text-[28px] lg:text-[36px] mb-[4px]">
                  {item.category === "구매가이드" && (
                    <span className="text-blue-7 font-bold">GUIDE</span>
                  )}
                  {item.category === "비교분석" && (
                    <span className="text-blue-8 font-bold">VS</span>
                  )}
                  {item.category === "사용팁" && (
                    <span className="text-blue-6 font-bold">TIP</span>
                  )}
                  {item.category === "트렌드" && (
                    <span className="text-blue-8 font-bold">TREND</span>
                  )}
                </div>
                <p className="text-[11px] lg:text-[12px] text-gray-7 font-medium">
                  {item.category}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 본문 */}
        <div className="p-[12px] lg:p-[16px]">
          <span className={`inline-block px-[8px] py-[2px] text-[11px] font-medium rounded-full ${badgeClass}`}>
            {item.category}
          </span>

          <h3 className="mt-[8px] text-[14px] lg:text-[16px] font-bold leading-[1.4] text-gray-10 line-clamp-2 group-hover:text-blue-7 transition-colors">
            {item.title}
          </h3>

          <p className="mt-[6px] text-[12px] lg:text-[13px] leading-[1.5] text-gray-7 line-clamp-2">
            {item.summary}
          </p>

          <div className="mt-[10px] flex items-center gap-[8px] text-[11px] text-gray-6">
            <span>{item.date}</span>
            <span className="text-gray-4">|</span>
            <span>조회 {formatViews(item.views)}</span>
            <span className="text-gray-4">|</span>
            <span>{item.readTime} 읽기</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function ContentsClient({ contents }: { contents: ContentItem[] }) {
  const [activeCategory, setActiveCategory] = useState("전체");

  const filtered = activeCategory === "전체"
    ? contents
    : contents.filter((c) => c.category === activeCategory);

  return (
    <div className="mx-auto max-w-[1200px] pb-[150px] pt-[30px]">
      {/* 히어로 섹션 */}
      <div className="px-[20px] lg:px-[30px] mb-[30px]">
        <div className="bg-gradient-to-r from-[#FFF5EB] to-[#FEE2D5] rounded-[12px] px-[24px] py-[30px] lg:px-[40px] lg:py-[40px]">
          <p className="text-[24px] lg:text-[32px] font-extrabold text-gray-10">
            스마트홈딜 가이드
          </p>
          <p className="mt-[8px] text-[14px] lg:text-[16px] text-gray-7">
            전문가가 알려주는 가전제품 구매 가이드
          </p>
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className="px-[20px] lg:px-[30px] mb-[24px]">
        <div className="flex gap-[8px] overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-[16px] py-[8px] rounded-full text-[13px] lg:text-[14px] font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-blue-7 text-white"
                  : "bg-gray-2 text-gray-7 hover:bg-gray-3"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 콘텐츠 그리드 */}
      <div className="px-[20px] lg:px-[30px]">
        <div className="grid grid-cols-1 gap-[20px] lg:grid-cols-3 lg:gap-[24px]">
          {filtered.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-[60px] text-center">
            <p className="text-[14px] text-gray-6">해당 카테고리의 콘텐츠가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
