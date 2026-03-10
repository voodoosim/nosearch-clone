'use client';

import { useWishlist } from '@/components/WishlistProvider';
import type { Product } from '@/components/ProductCard';

export default function WishlistButton({ product }: { product: Product }) {
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.goodsNo || product.id);

  return (
    <button
      onClick={() => toggle(product)}
      className={`w-full flex items-center justify-center gap-[8px] h-[52px] rounded-xl border text-[15px] font-bold transition-all ${
        wishlisted
          ? 'border-red-4 bg-red-5/10 text-red-5'
          : 'border-gray-3 bg-gray-1 text-gray-7 hover:border-red-4 hover:text-red-5'
      }`}
      aria-label={wishlisted ? '찜 해제' : '찜하기'}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={wishlisted ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {wishlisted ? '찜 완료' : '찜하기'}
    </button>
  );
}
