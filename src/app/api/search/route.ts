import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/products';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json([]);
  }

  const results = await searchProducts(q);
  return NextResponse.json(results);
}
