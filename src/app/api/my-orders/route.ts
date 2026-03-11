import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createAdminPB } from '@/lib/pocketbase';

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  try {
    const pb = await createAdminPB();
    const result = await pb.collection('orders').getList(1, 50, {
      filter: `user_email='${session.user.email}'`,
      sort: '-created',
    });

    return NextResponse.json({ items: result.items });
  } catch {
    return NextResponse.json({ error: '주문 조회 실패' }, { status: 500 });
  }
}
