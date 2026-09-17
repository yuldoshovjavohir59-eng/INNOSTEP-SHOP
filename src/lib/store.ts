// ===== CLIENT STORE — API orqali server bilan ishlaydi =====
// localStorage emas, server /data/lots.json da saqlanadi
// Barcha browserlar bir xil ma'lumot ko'radi

import { Lot } from '@/types';

// ===== LOTS =====
export async function getLots(): Promise<Lot[]> {
  const res = await fetch('/api/lots', { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export async function getLot(id: string): Promise<Lot | null> {
  const res = await fetch(`/api/lots/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export async function addLot(lot: Lot): Promise<void> {
  await fetch('/api/lots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lot),
  });
}

export async function updateLot(lot: Lot): Promise<void> {
  await fetch(`/api/lots/${lot.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lot),
  });
}

export async function deleteLot(id: string): Promise<void> {
  await fetch(`/api/lots/${id}`, { method: 'DELETE' });
}

export async function toggleActive(id: string): Promise<void> {
  await fetch(`/api/lots/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _action: 'toggle' }),
  });
}

// ===== STATS =====
export interface SiteStats {
  totalViews: number;
  totalOrders: number;
  lotViews: Record<string, number>;
  lotOrders: Record<string, number>;
}

export async function getStats(): Promise<SiteStats> {
  const res = await fetch('/api/stats', { cache: 'no-store' });
  if (!res.ok) return { totalViews: 0, totalOrders: 0, lotViews: {}, lotOrders: {} };
  return res.json();
}

export async function recordView(lotId: string): Promise<void> {
  await fetch('/api/stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'view', lotId }),
  });
}

export async function recordOrder(lotId: string): Promise<void> {
  await fetch('/api/stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'order', lotId }),
  });
}

// ===== ADMIN AUTH (localStorage — faqat session uchun) =====
const AUTH_KEY = 'innostep_admin_auth';
const ADMIN_PASSWORD = 'admin123';

export function adminLogin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_KEY, '1');
    return true;
  }
  return false;
}

export function adminLogout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_KEY) === '1';
}
