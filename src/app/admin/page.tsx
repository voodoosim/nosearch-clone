'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface OrderItem {
  goodsNm: string;
  goodsPrice: number;
  quantity: number;
}

interface Order {
  id: string;
  order_id: string;
  user_email: string;
  user_name: string;
  items: string | OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  memo: string;
  created: string;
}

const STATUS_LABEL: Record<string, string> = {
  pending: '대기중',
  confirmed: '확인됨',
  paid: '결제완료',
  cancelled: '취소',
};

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-600',
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMemo, setEditMemo] = useState('');

  const isAdmin = (session?.user as { role?: string })?.role === 'admin';

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (filterStatus) params.set('status', filterStatus);
      const res = await fetch(`/api/admin/orders?${params}`);
      if (!res.ok) return;
      const data = await res.json();
      setOrders(data.items || []);
      setTotalItems(data.totalItems || 0);
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated' && !isAdmin) {
      router.push('/');
      return;
    }
    if (status === 'authenticated' && isAdmin) {
      fetchOrders();
    }
  }, [status, isAdmin, fetchOrders, router]);

  const updateOrder = async (id: string, patch: { status?: string; memo?: string }) => {
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...patch }),
    });
    if (res.ok) {
      await fetchOrders();
    }
  };

  const parseItems = (raw: string | OrderItem[]): OrderItem[] => {
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw); } catch { return []; }
  };

  const totalPages = Math.ceil(totalItems / 20);

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">로딩 중...</div>;
  }

  if (!isAdmin) return null;

  const statuses = ['', 'pending', 'confirmed', 'paid', 'cancelled'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">어드민 — 주문 관리</h1>
        <span className="text-sm text-gray-500">{session?.user?.email}</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 통계 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {['pending', 'confirmed', 'paid', 'cancelled'].map((s) => {
            const count = orders.filter((o) => o.status === s).length;
            return (
              <div key={s} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold text-gray-800">{count}</div>
                <div className="text-sm text-gray-500 mt-1">{STATUS_LABEL[s]}</div>
              </div>
            );
          })}
        </div>

        {/* 필터 */}
        <div className="flex gap-2 mb-4">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => { setFilterStatus(s); setPage(1); }}
              className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${
                filterStatus === s
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
              }`}
            >
              {s ? STATUS_LABEL[s] : '전체'}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-500 self-center">총 {totalItems}건</span>
        </div>

        {/* 주문 목록 */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">불러오는 중...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-gray-400">주문이 없습니다.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">주문번호</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">고객</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">상품</th>
                  <th className="px-4 py-3 text-right text-gray-600 font-medium">합계</th>
                  <th className="px-4 py-3 text-center text-gray-600 font-medium">상태</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">메모</th>
                  <th className="px-4 py-3 text-center text-gray-600 font-medium">일시</th>
                  <th className="px-4 py-3 text-center text-gray-600 font-medium">처리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  const items = parseItems(order.items);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-700">#{order.order_id}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{order.user_name || '-'}</div>
                        <div className="text-xs text-gray-400">{order.user_email}</div>
                      </td>
                      <td className="px-4 py-3">
                        {items.map((item, i) => (
                          <div key={i} className="text-gray-700">
                            {item.goodsNm} x{item.quantity}
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-800">
                        {order.total.toLocaleString()}원
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLOR[order.status]}`}>
                          {STATUS_LABEL[order.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-[120px] truncate">
                        {editingId === order.id ? (
                          <div className="flex gap-1">
                            <input
                              className="border border-gray-300 rounded px-1 py-0.5 text-xs w-full"
                              value={editMemo}
                              onChange={(e) => setEditMemo(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  updateOrder(order.id, { memo: editMemo });
                                  setEditingId(null);
                                } else if (e.key === 'Escape') {
                                  setEditingId(null);
                                }
                              }}
                              autoFocus
                            />
                            <button
                              className="text-blue-600 hover:text-blue-800 text-xs"
                              onClick={() => { updateOrder(order.id, { memo: editMemo }); setEditingId(null); }}
                            >저장</button>
                          </div>
                        ) : (
                          <span
                            className="cursor-pointer hover:text-gray-700"
                            onClick={() => { setEditingId(order.id); setEditMemo(order.memo || ''); }}
                            title="클릭하여 메모 편집"
                          >
                            {order.memo || <span className="text-gray-300">메모 없음</span>}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-gray-400 whitespace-nowrap">
                        {order.created.slice(0, 16).replace('T', ' ')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <select
                          className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white"
                          value={order.status}
                          onChange={(e) => updateOrder(order.id, { status: e.target.value })}
                        >
                          <option value="pending">대기중</option>
                          <option value="confirmed">확인됨</option>
                          <option value="paid">결제완료</option>
                          <option value="cancelled">취소</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-40 hover:border-gray-500"
            >
              이전
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-40 hover:border-gray-500"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
