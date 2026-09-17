export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { dbGetLots, dbAddLot } from '@/lib/db';

export async function GET() {
  try {
    const lots = await dbGetLots();
    return NextResponse.json(lots);
  } catch (e) {
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const lot = await req.json();
    await dbAddLot(lot);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('[POST /api/lots]', message, e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
