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
          <div className="w-[80px] h-[80px] rounded-full bg-gray-2 flex items-center justify-center mb-[20px]">
            <svg
              className="w-[40px] h-[40px] text-gray-5"
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
          </div>
          <p className="text-[16px] text-gray-7 font-medium mb-[6px]">
            장바구니가 비어있습니다
          </p>
          <p className="text-[13px] text-gray-5 mb-[28px]">
            마음에 드는 상품을 장바구니에 담아보세요
          </p>
          <Link
            href="/store"
            className="inline-flex items-center gap-[6px] px-[24px] h-[48px] text-[14px] font-bold text-white bg-blue-7 rounded-xl hover:bg-blue-6 transition-colors btn-press"
          >
            <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            쇼핑하러 가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-[20px] py-[24px] lg:px-[30px] lg:py-[40px] pb-[200px] lg:pb-[40px]">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-[20px]">
        <h1 className="text-[20px] font-bold text-gray-10 lg:text-[24px]">
          장바구니
          <span className="ml-[8px] text-[16px] font-medium text-gray-6">{items.length}</span>
        </h1>
        <Link
          href="/store"
          className="inline-flex items-center gap-[4px] text-[13px] text-gray-6 hover:text-blue-7 transition-colors"
        >
          <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          계속 쇼핑하기
        </Link>
      </div>

      {/* 전체선택 + 선택삭제 */}
      <div className="flex items-center justify-between border-b border-gray-3 pb-[12px] mb-[16px]">
        <label className="flex items-center gap-[8px] cursor-pointer min-h-[48px]">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="w-[18px] h-[18px] cursor-pointer rounded"
            style={{ accentColor: '#1E6B3E' }}
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
          <ul className="flex flex-col">
            {items.map((item) => {
              const itemDiscount =
                item.fixedPrice > item.goodsPrice
                  ? Math.round(((item.fixedPrice - item.goodsPrice) / item.fixedPrice) * 100)
                  : 0;

              return (
                <li key={item.goodsNo} className="py-[16px] border-b border-gray-3 last:border-b-0">
                  <div className="flex items-start gap-[12px]">
                    {/* 체크박스 */}
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.goodsNo)}
                      onChange={() => toggleItem(item.goodsNo)}
                      className="w-[18px] h-[18px] mt-[22px] shrink-0 cursor-pointer rounded"
                      style={{ accentColor: '#1E6B3E' }}
                    />

                    {/* 이미지 */}
                    <div
                      className="relative w-[72px] h-[72px] shrink-0 border border-gray-3 rounded-xl overflow-hidden"
                      style={{ backgroundColor: '#F5F1EB' }}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.goodsNm}
                        fill
                        className="object-contain p-[6px]"
                        sizes="72px"
                      />
                    </div>

                    {/* 정보 */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-gray-10 leading-[1.4] line-clamp-2 mb-[10px]">
                        {item.goodsNm}
                      </p>

                      {/* 수량 조절 + 가격 */}
                      <div className="flex items-center gap-[12px] flex-wrap">
                        <div className="flex items-center border border-gray-3 rounded-lg bg-gray-1 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.goodsNo, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-[34px] h-[34px] flex items-center justify-center text-[18px] text-gray-7 hover:text-gray-10 hover:bg-gray-2 disabled:opacity-30 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-[38px] text-center text-[14px] font-semibold text-gray-10 border-x border-gray-3">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.goodsNo, item.quantity + 1)}
                            className="w-[34px] h-[34px] flex items-center justify-center text-[18px] text-gray-7 hover:text-gray-10 hover:bg-gray-2 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex flex-col items-end ml-auto">
                          {item.fixedPrice > item.goodsPrice && (
                            <div className="flex items-center gap-[6px] mb-[2px]">
                              <span className="text-[11px] font-bold text-red-5 bg-red-5/10 px-[5px] py-[1px] rounded">
                                {itemDiscount}%
                              </span>
                              <span className="text-[12px] text-gray-5 line-through">
                                {formatPrice(item.fixedPrice * item.quantity)}원
                              </span>
                            </div>
                          )}
                          <p className="text-[16px] font-bold text-gray-10">
                            {formatPrice(item.goodsPrice * item.quantity)}원
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 삭제 */}
                    <button
                      onClick={() => removeFromCart(item.goodsNo)}
                      className="shrink-0 w-[32px] h-[32px] flex items-center justify-center text-gray-4 hover:text-red-5 mt-[0px] transition-colors rounded-lg hover:bg-red-5/10"
                      aria-label="삭제"
                    >
                      <svg
                        className="w-[16px] h-[16px]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* 계속 쇼핑 링크 (하단) */}
          <div className="mt-[24px] pt-[20px] border-t border-gray-3">
            <Link
              href="/store"
              className="inline-flex items-center gap-[6px] text-[13px] text-gray-6 hover:text-blue-7 transition-colors"
            >
              <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              계속 쇼핑하기
            </Link>
          </div>
        </div>

        {/* 결제 요약 (데스크탑) */}
        <div className="hidden lg:block w-[320px] shrink-0">
          <div className="sticky top-[100px] bg-gray-1 border border-gray-3 rounded-2xl p-[24px]">
            <h2 className="text-[16px] font-bold text-gray-10 mb-[20px]">결제 요약</h2>
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
                  <dd className="text-[14px] font-semibold text-red-5">
                    -{formatPrice(totalDiscount)}원
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-[14px] text-gray-6">배송비</dt>
                <dd className="text-[14px] font-medium text-blue-7">무료</dd>
              </div>
              <div className="border-t border-gray-3 pt-[12px] flex justify-between items-end">
                <dt className="text-[15px] font-bold text-gray-10">총 결제금액</dt>
                <dd className="text-[22px] font-extrabold text-blue-7">
                  {formatPrice(totalPrice)}원
                </dd>
              </div>
            </dl>

            {selectedIds.size === 0 && (
              <p className="text-[12px] text-gray-5 text-center mb-[12px]">
                상품을 선택해주세요
              </p>
            )}

            <button
              disabled={selectedIds.size === 0}
              className="w-full h-[52px] text-[16px] font-bold text-white bg-blue-7 rounded-xl hover:bg-blue-6 disabled:bg-gray-4 disabled:cursor-not-allowed transition-colors btn-press"
            >
              결제하기 ({selectedIds.size})
            </button>

            {/* 신뢰 배지 */}
            <div className="mt-[16px] flex items-center justify-center gap-[16px]">
              <div className="flex items-center gap-[4px] text-gray-5">
                <svg className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <span className="text-[11px]">안전결제</span>
              </div>
              <div className="flex items-center gap-[4px] text-gray-5">
                <svg className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span className="text-[11px]">정품보증</span>
              </div>
              <div className="flex items-center gap-[4px] text-gray-5">
                <svg className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                <span className="text-[11px]">무료반품</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 결제 바 (모바일) */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[998] bg-gray-1 border-t border-gray-3 lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="px-[20px] py-[12px]">
          <div className="flex items-center justify-between mb-[8px]">
            <span className="text-[13px] text-gray-6">
              총 결제금액
              {selectedIds.size > 0 && (
                <span className="ml-[4px] text-gray-5">({selectedIds.size}건)</span>
              )}
            </span>
            <span className="text-[20px] font-extrabold text-blue-7">
              {formatPrice(totalPrice)}원
            </span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex items-center justify-between mb-[8px]">
              <span className="text-[12px] text-gray-5">할인</span>
              <span className="text-[13px] font-semibold text-red-5">
                -{formatPrice(totalDiscount)}원
              </span>
            </div>
          )}
          <button
            disabled={selectedIds.size === 0}
            className="w-full h-[52px] text-[16px] font-bold text-white bg-blue-7 rounded-xl hover:bg-blue-6 disabled:bg-gray-4 disabled:cursor-not-allowed transition-colors btn-press"
          >
            {selectedIds.size === 0 ? '상품을 선택해주세요' : `결제하기 (${selectedIds.size})`}
          </button>
        </div>
      </div>
    </div>
  );
}
