// ===== DATABASE LAYER =====
// Supabase (PostgreSQL) orqali Prisma ishlatiladi
// Barcha brauzerlar uchun bir xil ma'lumot

import { prisma } from './prisma';
import { Lot } from '@/types';

// ===== HELPERS =====
function toAppLot(raw: any): Lot {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    price: raw.price,
    currency: raw.currency,
    category: raw.category,
    images: raw.images || [],
    characteristics: Array.isArray(raw.characteristics)
      ? raw.characteristics
      : JSON.parse(raw.characteristics || '[]'),
    cooperationLink: raw.cooperationLink,
    cooperationPrice: raw.cooperationPrice ?? undefined,
    stock: raw.stock,
    minOrder: raw.minOrder,
    maxOrder: raw.maxOrder,
    isActive: raw.isActive,
    createdAt: raw.createdAt?.toISOString?.() || raw.createdAt,
    updatedAt: raw.updatedAt?.toISOString?.() || raw.updatedAt,
  };
}

// ===== LOTS =====
export async function dbGetLots(): Promise<Lot[]> {
  const rows = await prisma.lot.findMany({ orderBy: { createdAt: 'desc' } });
  return rows.map(toAppLot);
}

export async function dbGetLot(id: string): Promise<Lot | null> {
  const row = await prisma.lot.findUnique({ where: { id } });
  return row ? toAppLot(row) : null;
}

export async function dbAddLot(lot: Lot): Promise<void> {
  await prisma.lot.create({
    data: {
      id: lot.id,
      title: lot.title,
      description: lot.description,
      price: lot.price,
      currency: lot.currency || 'UZS',
      category: lot.category,
      images: lot.images,
      characteristics: lot.characteristics as any,
      cooperationLink: lot.cooperationLink || '',
      cooperationPrice: lot.cooperationPrice ?? null,
      stock: lot.stock,
      minOrder: lot.minOrder,
      maxOrder: lot.maxOrder,
      isActive: lot.isActive,
    },
  });
}

export async function dbUpdateLot(lot: Lot): Promise<void> {
  await prisma.lot.update({
    where: { id: lot.id },
    data: {
      title: lot.title,
      description: lot.description,
      price: lot.price,
      currency: lot.currency || 'UZS',
      category: lot.category,
      images: lot.images,
      characteristics: lot.characteristics as any,
      cooperationLink: lot.cooperationLink || '',
      cooperationPrice: lot.cooperationPrice ?? null,
      stock: lot.stock,
      minOrder: lot.minOrder,
      maxOrder: lot.maxOrder,
      isActive: lot.isActive,
    },
  });
}

export async function dbDeleteLot(id: string): Promise<void> {
  await prisma.lot.delete({ where: { id } });
}

export async function dbToggleActive(id: string): Promise<void> {
  const lot = await prisma.lot.findUnique({ where: { id } });
  if (lot) await prisma.lot.update({ where: { id }, data: { isActive: !lot.isActive } });
}

// ===== STATS =====
export interface DbStats {
  totalViews: number;
  totalOrders: number;
  lotViews: Record<string, number>;
  lotOrders: Record<string, number>;
}

async function ensureStats() {
  const existing = await prisma.stats.findUnique({ where: { id: 'global' } });
  if (!existing) await prisma.stats.create({ data: { id: 'global' } });
}

export async function dbGetStats(): Promise<DbStats> {
  await ensureStats();
  const s = await prisma.stats.findUnique({ where: { id: 'global' } });
  return {
    totalViews: s?.totalViews || 0,
    totalOrders: s?.totalOrders || 0,
    lotViews: (s?.lotViews as any) || {},
    lotOrders: (s?.lotOrders as any) || {},
  };
}

export async function dbRecordView(lotId: string): Promise<void> {
  await ensureStats();
  const s = await prisma.stats.findUnique({ where: { id: 'global' } });
  const views = (s?.lotViews as any) || {};
  views[lotId] = (views[lotId] || 0) + 1;
  await prisma.stats.update({
    where: { id: 'global' },
    data: { totalViews: { increment: 1 }, lotViews: views },
  });
}

export async function dbRecordOrder(lotId: string): Promise<void> {
  await ensureStats();
  const s = await prisma.stats.findUnique({ where: { id: 'global' } });
  const orders = (s?.lotOrders as any) || {};
  orders[lotId] = (orders[lotId] || 0) + 1;
  await prisma.stats.update({
    where: { id: 'global' },
    data: { totalOrders: { increment: 1 }, lotOrders: orders },
  });
}
