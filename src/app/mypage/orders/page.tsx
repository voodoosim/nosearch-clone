'use client';

import { useState } from 'react';
import Link from 'next/link';

export const metadata = {
  title: '주문내역 | 스마트홈딜',
  description: '나의 주문내역을 확인하세요.',
};

type OrderStatus = '전체' | '결제완료' | '배송중' | '배송완료' | '취소환불';

const STATUS_TABS: OrderStatus[] = ['전체', '결제완료', '배송중', '배송완료', '취소환불'];

interface Order {
  id: string;
  date: string;
  productName: string;
  price: number;
  quantity: number;
  status: Exclude<OrderStatus, '전체'>;
}

const DUMMY_ORDERS: Order[] = [
  {
    id: 'ORD-2026-001234',
    date: '2026.03.02',
    productName: '에어컨 청소 전문가 방문 서비스',
    price: 59000,
    quantity: 1,
    status: '배송완료',
  },
  {
    id: 'ORD-2026-001198',
    date: '2026.02.25',
    productName: '욕실 줄눈 셀프 보수 키트 (3m²)',
    price: 23900,
    quantity: 2,
    status: '결제완료',
  },
  {
    id: 'ORD-2026-001071',
    date: '2026.02.14',
    productName: '자동 반려동물 급수기 2L',
    price: 34500,
    quantity: 1,
    status: '배송중',
  },
];

const STATUS_BADGE: Record<Exclude<OrderStatus, '전체'>, { bg: string; text: string; label: string }> = {
  결제완료: { bg: 'bg-blue-1', text: 'text-blue-7', label: '결제완료' },
  배송중: { bg: 'bg-amber-100', text: 'text-amber-700', label: '배송중' },
  배송완료: { bg: 'bg-gray-2', text: 'text-gray-6', label: '배송완료' },
  취소환불: { bg: 'bg-red-50', text: 'text-red-600', label: '취소/환불' },
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('전체');

  const filtered =
    activeTab === '전체'
      ? DUMMY_ORDERS
      : DUMMY_ORDERS.filter((o) => o.status === activeTab);

  return (
    <div className="max-w-[600px] mx-auto px-[20px] py-[32px] pb-[100px]">
      {/* 상단 헤더 */}
      <div className="flex items-center gap-[12px] mb-[28px]">
        <Link
          href="/mypage"
          className="text-[14px] text-gray-6 hover:text-gray-10 transition-colors shrink-0"
        >
          ← 마이페이지
        </Link>
        <span className="text-gray-3">|</span>
        <h1 className="text-[20px] font-bold text-gray-10">주문내역</h1>
      </div>

      {/* 상태 필터 탭 */}
      <div className="flex gap-[6px] mb-[24px] overflow-x-auto pb-[4px] scrollbar-none">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-[14px] py-[8px] rounded-full text-[13px] font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-7 text-white'
                : 'bg-gray-1 border border-gray-3 text-gray-7 hover:bg-gray-2'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 주문 목록 */}
      {filtered.length === 0 ? (
        /* 빈 상태 */
        <div className="flex flex-col items-center justify-center py-[72px] gap-[16px]">
          <div className="w-[72px] h-[72px] rounded-full bg-gray-2 flex items-center justify-center">
            <svg
              className="w-[36px] h-[36px] text-gray-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-[16px] font-semibold text-gray-10 mb-[6px]">
              아직 주문내역이 없습니다
            </p>
            <p className="text-[13px] text-gray-5">
              {activeTab === '전체' ? '첫 주문을 해보세요!' : `${activeTab} 상태의 주문이 없습니다.`}
            </p>
          </div>
          <Link
            href="/store"
            className="mt-[8px] px-[24px] py-[12px] bg-blue-7 text-white text-[14px] font-medium rounded-[8px] hover:bg-blue-8 transition-colors"
          >
            쇼핑하러 가기
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-[12px]">
          {filtered.map((order) => {
            const badge = STATUS_BADGE[order.status];
            return (
              <div
                key={order.id}
                className="bg-gray-1 border border-gray-3 rounded-[12px] p-[16px]"
              >
                {/* 주문 헤더 */}
                <div className="flex items-center justify-between mb-[12px]">
                  <div>
                    <p className="text-[12px] text-gray-5">{order.date}</p>
                    <p className="text-[12px] text-gray-5 mt-[2px]">주문번호 {order.id}</p>
                  </div>
                  <span
                    className={`px-[10px] py-[4px] rounded-full text-[12px] font-medium ${badge.bg} ${badge.text}`}
                  >
                    {badge.label}
                  </span>
                </div>

                {/* 상품 정보 */}
                <div className="flex items-center gap-[12px]">
                  {/* 썸네일 placeholder */}
                  <div className="w-[64px] h-[64px] rounded-[8px] bg-gray-2 shrink-0 flex items-center justify-center border border-gray-3">
                    <svg
                      className="w-[24px] h-[24px] text-gray-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M6.75 18h10.5M3.375 4.5h17.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125H3.375A1.125 1.125 0 012.25 16.875V5.625c0-.621.504-1.125 1.125-1.125z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-gray-10 leading-[1.4] line-clamp-2">
                      {order.productName}
                    </p>
                    <p className="text-[13px] text-gray-5 mt-[4px]">
                      수량 {order.quantity}개
                    </p>
                    <p className="text-[15px] font-bold text-gray-10 mt-[6px]">
                      {(order.price * order.quantity).toLocaleString()}원
                    </p>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-[8px] mt-[14px] pt-[12px] border-t border-gray-3">
                  <button className="flex-1 py-[8px] text-[13px] font-medium text-gray-7 border border-gray-3 rounded-[6px] hover:bg-gray-2 transition-colors">
                    주문 상세
                  </button>
                  {order.status === '배송완료' && (
                    <button className="flex-1 py-[8px] text-[13px] font-medium text-blue-7 border border-blue-7 rounded-[6px] hover:bg-blue-1 transition-colors">
                      리뷰 작성
                    </button>
                  )}
                  {order.status === '결제완료' && (
                    <button className="flex-1 py-[8px] text-[13px] font-medium text-red-500 border border-red-200 rounded-[6px] hover:bg-red-50 transition-colors">
                      주문 취소
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
