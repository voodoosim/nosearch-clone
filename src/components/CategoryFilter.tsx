'use client';

import { useRouter, usePathname } from 'next/navigation';
import { RECOMMENDATION_CATEGORIES } from '@/lib/products';

export default function CategoryFilter({
  activeCategory,
}: {
  activeCategory: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (key: string) => {
    if (key === 'all') {
      router.push('/store/recommendation');
    } else {
      router.push(`/store/recommendation/${key}`);
    }
  };

  const isAll =
    activeCategory === 'all' || pathname === '/store/recommendation';

  return (
    <div className="scrollbar-hide flex gap-[8px] overflow-x-auto pb-[4px]">
      <button
        onClick={() => handleClick('all')}
        className={`shrink-0 rounded-full border px-[16px] py-[8px] text-[13px] lg:text-[15px] font-medium transition-colors ${
          isAll
            ? 'border-blue-7 bg-blue-7 text-white'
            : 'border-gray-3 bg-white text-gray-9 hover:border-gray-5'
        }`}
      >
        전체
      </button>
      {RECOMMENDATION_CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.key;
        return (
          <button
            key={cat.key}
            onClick={() => handleClick(cat.key)}
            className={`shrink-0 rounded-full border px-[16px] py-[8px] text-[13px] lg:text-[15px] font-medium transition-colors ${
              isActive
                ? 'border-blue-7 bg-blue-7 text-white'
                : 'border-gray-3 bg-white text-gray-9 hover:border-gray-5'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
