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
          className="w-full py-[16px] text-[16px] font-bold text-gray-5 bg-gray-3 rounded-[8px] cursor-not-allowed"
        >
          품절
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[10px]">
      <button className="w-full py-[16px] text-[16px] font-bold text-white bg-blue-7 rounded-[8px] hover:bg-blue-6 active:bg-blue-7 transition-colors">
        구매하기
      </button>
      <button
        onClick={handleAdd}
        className={`w-full py-[14px] text-[15px] font-semibold rounded-[8px] transition-colors ${
          added
            ? 'text-white bg-blue-7'
            : 'text-blue-7 border-2 border-blue-7 hover:bg-blue-1'
        }`}
      >
        {added ? '장바구니에 담았습니다' : '장바구니'}
      </button>
    </div>
  );
}
