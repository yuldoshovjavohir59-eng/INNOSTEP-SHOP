import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

// Supabase bepul rejimida baza uxlab qolmasligi uchun kuniga bir marta chaqiriladi (vercel.json)
export async function GET() {
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRawUnsafe('SELECT 1');
    return NextResponse.json({ ok: true, time: new Date().toISOString() });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
