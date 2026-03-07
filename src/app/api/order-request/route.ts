import { NextResponse } from 'next/server';
import { auth } from '@/auth';

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
    return NextResponse.json({ ok: true, orderId: data.orderId });
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
