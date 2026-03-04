'use client';

import { useState } from 'react';
import { useCart } from '@/components/CartProvider';

interface Props {
  goodsNo: string;
  goodsNm: string;
  imageUrl: string;
  goodsPrice: number;
  fixedPrice: number;
}

export default function StickyCartButtons({
  goodsNo,
  goodsNm,
  imageUrl,
  goodsPrice,
  fixedPrice,
}: Props) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({ goodsNo, goodsNm, imageUrl, goodsPrice, fixedPrice });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex gap-[8px]">
      <button
        onClick={handleAdd}
        className={`flex-1 h-[52px] text-[14px] font-semibold rounded-xl border transition-colors btn-press ${
          added
            ? 'text-white bg-blue-7 border-blue-7'
            : 'text-blue-7 border-blue-7 bg-gray-1 hover:bg-blue-1'
        }`}
      >
        {added ? '담김 ✓' : '장바구니'}
      </button>
      <button className="flex-[2] h-[52px] text-[15px] font-bold text-white bg-blue-7 rounded-xl hover:bg-blue-6 active:bg-blue-8 transition-colors btn-press">
        구매하기
      </button>
    </div>
  );
}
