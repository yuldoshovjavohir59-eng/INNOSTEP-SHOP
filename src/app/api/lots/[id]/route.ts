export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { dbGetLot, dbUpdateLot, dbDeleteLot, dbToggleActive } from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const lot = await dbGetLot(params.id);
  if (!lot) return NextResponse.json({ error: 'Topilmadi' }, { status: 404 });
  return NextResponse.json(lot);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    if (body._action === 'toggle') {
      await dbToggleActive(params.id);
    } else {
      await dbUpdateLot({ ...body, id: params.id });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbDeleteLot(params.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('[DELETE /api/lots/:id]', message, e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
