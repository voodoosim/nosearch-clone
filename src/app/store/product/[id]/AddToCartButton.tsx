'use client';

import { useState } from 'react';
import { useCart } from '@/components/CartProvider';

interface Props {
  goodsNo: string;
  goodsNm: string;
  imageUrl: string;
  goodsPrice: number;
  fixedPrice: number;
  isSoldOut: boolean;
}

export default function AddToCartButton({
  goodsNo,
  goodsNm,
  imageUrl,
  goodsPrice,
  fixedPrice,
  isSoldOut,
}: Props) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({ goodsNo, goodsNm, imageUrl, goodsPrice, fixedPrice });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isSoldOut) {
    return (
      <div className="flex flex-col gap-[10px]">
        <button
          disabled
          className="w-full h-[52px] text-[16px] font-bold text-gray-5 bg-gray-3 rounded-xl cursor-not-allowed"
        >
          품절
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[10px]">
      <button className="w-full h-[52px] text-[16px] font-bold text-white bg-blue-7 rounded-xl hover:bg-blue-6 active:bg-blue-8 transition-colors btn-press">
        구매하기
      </button>
      <button
        onClick={handleAdd}
        className={`w-full h-[52px] text-[15px] font-semibold rounded-xl transition-colors btn-press ${
          added
            ? 'text-white bg-blue-7'
            : 'text-blue-7 border border-blue-7 bg-gray-1 hover:bg-blue-1'
        }`}
      >
        {added ? '장바구니에 담았습니다 ✓' : '장바구니 담기'}
      </button>
    </div>
  );
}
