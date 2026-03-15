'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type OrderStatus = '전체' | '대기중' | '확인됨' | '결제완료' | '취소';

const STATUS_TABS: OrderStatus[] = ['전체', '대기중', '확인됨', '결제완료', '취소'];

interface PbOrder {
  id: string;
  order_id: string;
  user_email: string;
  items: string;
  total: number;
  status: string;
  memo: string;
  created: string;
}

interface Order {
  id: string;
  orderId: string;
  date: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  status: string;
}

const STATUS_LABEL: Record<string, string> = {
  pending: '대기중',
  confirmed: '확인됨',
  paid: '결제완료',
  cancelled: '취소',
};

const STATUS_BADGE: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  confirmed: { bg: 'bg-blue-50', text: 'text-blue-700' },
  paid: { bg: 'bg-green-50', text: 'text-green-700' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-600' },
};

const STATUS_TO_TAB: Record<string, OrderStatus> = {
  pending: '대기중',
  confirmed: '확인됨',
  paid: '결제완료',
  cancelled: '취소',
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('전체');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/my-orders')
      .then((r) => r.json())
      .then((data: { items?: PbOrder[]; error?: string }) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        const parsed = (data.items || []).map((o) => ({
          id: o.id,
          orderId: o.order_id,
          date: new Date(o.created).toLocaleDateString('ko-KR'),
          items: (() => {
            try {
              return JSON.parse(o.items);
            } catch {
              return [];
            }
          })(),
          total: o.total,
          status: o.status,
        }));
        setOrders(parsed);
      })
      .catch(() => setError('주문 조회 중 오류가 발생했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeTab === '전체'
      ? orders
      : orders.filter((o) => STATUS_TO_TAB[o.status] === activeTab);

  return (
    <div className="min-h-screen bg-gray-1 pb-20">
      <header className="bg-white px-4 py-3 flex items-center border-b border-gray-2">
        <Link href="/mypage" className="mr-3 text-gray-8 text-lg">
          ←
        </Link>
        <h1 className="text-base font-semibold text-gray-9">주문내역</h1>
      </header>

      {/* 상태 탭 */}
      <div className="bg-white border-b border-gray-2 flex overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-7 text-blue-7'
                : 'border-transparent text-gray-500'
            }`}
          >
            {tab}
            {tab !== '전체' && (
              <span className="ml-1 text-xs text-gray-400">
                ({orders.filter((o) => STATUS_TO_TAB[o.status] === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 space-y-3">
        {loading && (
          <div className="text-center py-12 text-gray-400 text-sm">불러오는 중...</div>
        )}
        {!loading && error && (
          <div className="text-center py-12 text-red-500 text-sm">{error}</div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">주문 내역이 없습니다.</p>
            <Link
              href="/store"
              className="mt-4 inline-block px-6 py-2 bg-blue-7 text-white text-sm rounded-full"
            >
              쇼핑하러 가기
            </Link>
          </div>
        )}
        {!loading &&
          filtered.map((order) => (
            <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400">{order.date}</span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    STATUS_BADGE[order.status]?.bg || 'bg-gray-100'
                  } ${STATUS_BADGE[order.status]?.text || 'text-gray-600'}`}
                >
                  {STATUS_LABEL[order.status] || order.status}
                </span>
              </div>

              {order.items.slice(0, 2).map(
                (item: { name: string; price: number; quantity: number }, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-sm text-gray-800 truncate max-w-[200px]">
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-600 ml-2 shrink-0">
                      {(item.price * item.quantity).toLocaleString()}원
                    </span>
                  </div>
                ),
              )}
              {order.items.length > 2 && (
                <p className="text-xs text-gray-400 mt-1">
                  외 {order.items.length - 2}개 상품
                </p>
              )}

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-400">주문번호 {order.orderId}</span>
                <span className="text-sm font-semibold text-gray-900">
                  총 {order.total.toLocaleString()}원
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
