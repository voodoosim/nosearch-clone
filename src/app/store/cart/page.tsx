'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR');
}

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 전체선택 상태 동기화
  const allSelected = items.length > 0 && selectedIds.size === items.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.goodsNo)));
    }
  };

  const toggleItem = (goodsNo: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(goodsNo)) {
        next.delete(goodsNo);
      } else {
        next.add(goodsNo);
      }
      return next;
    });
  };

  const deleteSelected = () => {
    selectedIds.forEach((id) => removeFromCart(id));
    setSelectedIds(new Set());
  };

  const selectedItems = useMemo(
    () => items.filter((i) => selectedIds.has(i.goodsNo)),
    [items, selectedIds]
  );

  const totalPrice = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.goodsPrice * i.quantity, 0),
    [selectedItems]
  );

  const totalDiscount = useMemo(
    () =>
      selectedItems.reduce(
        (sum, i) =>
          i.fixedPrice > i.goodsPrice
            ? sum + (i.fixedPrice - i.goodsPrice) * i.quantity
            : sum,
        0
      ),
    [selectedItems]
  );

  const totalFixed = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.fixedPrice * i.quantity, 0),
    [selectedItems]
  );

  // 빈 장바구니
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1200px] px-[20px] py-[40px] lg:px-[30px]">
        <h1 className="text-[20px] font-bold text-gray-10 mb-[40px] lg:text-[24px]">
          장바구니
        </h1>
        <div className="flex flex-col items-center justify-center py-[80px]">
          <svg
            className="w-[64px] h-[64px] text-gray-4 mb-[20px]"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          <p className="text-[16px] text-gray-6 mb-[24px]">
            장바구니가 비어있습니다
          </p>
          <Link
            href="/store"
            className="inline-flex items-center px-[24px] py-[12px] text-[14px] font-bold text-white bg-blue-7 rounded-[8px] hover:bg-blue-6 transition-colors"
          >
            쇼핑하러 가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-[20px] py-[24px] lg:px-[30px] lg:py-[40px] pb-[200px] lg:pb-[40px]">
      <h1 className="text-[20px] font-bold text-gray-10 mb-[20px] lg:text-[24px]">
        장바구니
      </h1>

      {/* 전체선택 + 선택삭제 */}
      <div className="flex items-center justify-between border-b border-gray-3 pb-[12px] mb-[16px]">
        <label className="flex items-center gap-[8px] cursor-pointer min-h-[48px]">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="w-[18px] h-[18px] cursor-pointer"
            style={{ accentColor: '#E8701A' }}
          />
          <span className="text-[14px] font-medium text-gray-10">
            전체선택 ({selectedIds.size}/{items.length})
          </span>
        </label>
        <button
          onClick={deleteSelected}
          disabled={selectedIds.size === 0}
          className="text-[13px] text-gray-6 hover:text-red-5 disabled:opacity-40 min-h-[48px] px-[8px] transition-colors"
        >
          선택삭제
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:gap-[32px]">
        {/* 상품 리스트 */}
        <div className="flex-1">
          <ul className="flex flex-col divide-y divide-gray-3">
            {items.map((item) => (
              <li key={item.goodsNo} className="py-[16px]">
                <div className="flex items-start gap-[12px]">
                  {/* 체크박스 */}
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.goodsNo)}
                    onChange={() => toggleItem(item.goodsNo)}
                    className="w-[18px] h-[18px] mt-[20px] shrink-0 cursor-pointer"
                    style={{ accentColor: '#E8701A' }}
                  />

                  {/* 이미지 */}
                  <div className="relative w-[60px] h-[60px] shrink-0 bg-white border border-gray-3 rounded-[4px] overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.goodsNm}
                      fill
                      className="object-contain p-[4px]"
                      sizes="60px"
                    />
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-gray-10 leading-[1.4] line-clamp-2 mb-[8px]">
                      {item.goodsNm}
                    </p>

                    {/* 수량 조절 */}
                    <div className="flex items-center gap-[12px]">
                      <div className="flex items-center border border-gray-3 rounded-[4px]">
                        <button
                          onClick={() =>
                            updateQuantity(item.goodsNo, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="w-[32px] h-[32px] flex items-center justify-center text-[16px] text-gray-6 hover:text-gray-10 disabled:opacity-30 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-[36px] text-center text-[14px] font-medium text-gray-10">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.goodsNo, item.quantity + 1)
                          }
                          className="w-[32px] h-[32px] flex items-center justify-center text-[16px] text-gray-6 hover:text-gray-10 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-[15px] font-bold text-gray-10">
                        {formatPrice(item.goodsPrice * item.quantity)}원
                      </p>
                    </div>

                    {/* 정가 표시 (할인 있을 때) */}
                    {item.fixedPrice > item.goodsPrice && (
                      <p className="mt-[4px] text-[12px] text-gray-5 line-through">
                        {formatPrice(item.fixedPrice * item.quantity)}원
                      </p>
                    )}
                  </div>

                  {/* 삭제 */}
                  <button
                    onClick={() => removeFromCart(item.goodsNo)}
                    className="shrink-0 w-[32px] h-[32px] flex items-center justify-center text-gray-5 hover:text-red-5 mt-[14px] transition-colors"
                    aria-label="삭제"
                  >
                    <svg
                      className="w-[18px] h-[18px]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 결제 요약 (데스크탑) */}
        <div className="hidden lg:block w-[320px] shrink-0">
          <div className="sticky top-[100px] bg-gray-1 rounded-[12px] p-[24px]">
            <h2 className="text-[16px] font-bold text-gray-10 mb-[20px]">
              결제 요약
            </h2>
            <dl className="flex flex-col gap-[12px] mb-[20px]">
              <div className="flex justify-between">
                <dt className="text-[14px] text-gray-6">상품금액</dt>
                <dd className="text-[14px] font-medium text-gray-10">
                  {formatPrice(totalFixed)}원
                </dd>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-[14px] text-gray-6">할인금액</dt>
                  <dd className="text-[14px] font-medium text-red-5">
                    -{formatPrice(totalDiscount)}원
                  </dd>
                </div>
              )}
              <div className="border-t border-gray-3 pt-[12px] flex justify-between">
                <dt className="text-[16px] font-bold text-gray-10">
                  총 결제금액
                </dt>
                <dd className="text-[20px] font-extrabold text-blue-7">
                  {formatPrice(totalPrice)}원
                </dd>
              </div>
            </dl>
            <button
              disabled={selectedIds.size === 0}
              className="w-full py-[16px] text-[16px] font-bold text-white bg-blue-7 rounded-[8px] hover:bg-blue-6 disabled:bg-gray-4 disabled:cursor-not-allowed transition-colors"
            >
              구매하기 ({selectedIds.size})
            </button>
          </div>
        </div>
      </div>

      {/* 결제 바 (모바일) */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[998] bg-white border-t border-gray-3 lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="px-[20px] py-[12px]">
          <div className="flex items-center justify-between mb-[8px]">
            <span className="text-[13px] text-gray-6">
              총 결제금액 ({selectedIds.size}건)
            </span>
            <span className="text-[18px] font-extrabold text-blue-7">
              {formatPrice(totalPrice)}원
            </span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex items-center justify-between mb-[8px]">
              <span className="text-[12px] text-gray-5">할인</span>
              <span className="text-[13px] font-medium text-red-5">
                -{formatPrice(totalDiscount)}원
              </span>
            </div>
          )}
          <button
            disabled={selectedIds.size === 0}
            className="w-full py-[14px] text-[16px] font-bold text-white bg-blue-7 rounded-[8px] hover:bg-blue-6 disabled:bg-gray-4 disabled:cursor-not-allowed transition-colors"
          >
            구매하기
          </button>
        </div>
      </div>
    </div>
  );
}
