import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createAdminPB } from '@/lib/pocketbase';
import type { Session } from 'next-auth';

function isAdmin(session: Session | null) {
  return (session?.user as { role?: string } | undefined)?.role === 'admin';
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') || '1');
  const status = searchParams.get('status') || '';

  try {
    const pb = await createAdminPB();
    const filter = status ? `status='${status}'` : '';
    const result = await pb.collection('orders').getList(page, 20, {
      filter,
      sort: '-created',
    });

    return NextResponse.json({
      items: result.items,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      page: result.page,
    });
  } catch {
    return NextResponse.json({ error: '조회 실패' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 });
  }

  const body = await request.json() as { id: string; status?: string; memo?: string };
  const { id, status, memo } = body;

  if (!id) {
    return NextResponse.json({ error: 'id 필요' }, { status: 400 });
  }

  try {
    const pb = await createAdminPB();
    const update: Record<string, string> = {};
    if (status) update.status = status;
    if (memo !== undefined) update.memo = memo;

    const updated = await pb.collection('orders').update(id, update);
    return NextResponse.json({ ok: true, item: updated });
  } catch {
    return NextResponse.json({ error: '업데이트 실패' }, { status: 500 });
  }
}
