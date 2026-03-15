"use client";

import { useState } from "react";
import ExhibitionSectionClient from "./ExhibitionSectionClient";
import type { Product } from "@/components/ProductCard";

interface Exhibition {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  categoryKeys: string[];
  categoryNames: string[];
  bgFrom: string;
  bgTo: string;
}

interface ExhibitionWithProducts {
  exhibition: Exhibition;
  products: Product[];
}

interface Props {
  items: ExhibitionWithProducts[];
}

export default function ExhibitionTabsClient({ items }: Props) {
  const [activeId, setActiveId] = useState<string>(
    items[0]?.exhibition.id ?? "",
  );

  const active = items.find((i) => i.exhibition.id === activeId) ?? items[0];

  return (
    <>
      {/* 탭 네비 */}
      <div className="scrollbar-hide mb-[40px] flex items-center gap-[8px] overflow-x-auto pb-[4px]">
        {items.map(({ exhibition }) => (
          <button
            key={exhibition.id}
            onClick={() => setActiveId(exhibition.id)}
            className={`shrink-0 rounded-full border px-[14px] py-[8px] text-[13px] font-medium transition-colors ${
              activeId === exhibition.id
                ? "border-blue-7 bg-blue-7 text-white"
                : "border-gray-3 bg-gray-2 text-gray-7 hover:border-gray-6 hover:text-gray-10"
            }`}
          >
            {exhibition.title}
          </button>
        ))}
      </div>

      {/* 선택된 기획전 섹션 */}
      {active && (
        <ExhibitionSectionClient
          key={active.exhibition.id}
          exhibition={active.exhibition}
          products={active.products}
          index={items.indexOf(active)}
        />
      )}
    </>
  );
}
