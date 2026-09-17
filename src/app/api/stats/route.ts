export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { dbGetStats, dbRecordView, dbRecordOrder } from '@/lib/db';

export async function GET() {
  return NextResponse.json(await dbGetStats());
}

export async function POST(req: NextRequest) {
  const { type, lotId } = await req.json();
  if (type === 'view') await dbRecordView(lotId);
  if (type === 'order') await dbRecordOrder(lotId);
  return NextResponse.json({ ok: true });
}
