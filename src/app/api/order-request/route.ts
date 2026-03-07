import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createAdminPB } from '@/lib/pocketbase';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const body = await request.json();
  const { items, total } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: '상품 정보가 없습니다.' }, { status: 400 });
  }

  const CHAT_API = process.env.NEXT_PUBLIC_CHAT_API || 'http://10.0.0.1:8002';

  try {
    const res = await fetch(`${CHAT_API}/api/order/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: session.user.email,
        userName: session.user.name || '',
        items,
        total,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: (err as { error?: string }).error || '알림 전송 실패' }, { status: 500 });
    }

    const data = await res.json() as { orderId: string };
    const orderId = data.orderId;

    // PocketBase에 주문 저장
    try {
      const pb = await createAdminPB();
      await pb.collection('orders').create({
        order_id: orderId,
        user_email: session.user.email,
        user_name: session.user.name || '',
        items: JSON.stringify(items),
        total: Number(total),
        status: 'pending',
        memo: '',
      });
    } catch {
      // 저장 실패해도 주문 알림은 이미 보냄 — 무시
    }

    return NextResponse.json({ ok: true, orderId });
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
