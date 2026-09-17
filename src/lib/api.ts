// ===== CLIENT-SIDE API HELPER =====
// Barcha so'rovlar server API ga ketadi → barcha brauzerlar bir xil ko'radi

import { Lot } from '@/types';

export interface SiteStats {
  totalViews: number;
  totalOrders: number;
  lotViews: Record<string, number>;
  lotOrders: Record<string, number>;
}

// ---- LOTS ----
export async function apiGetLots(): Promise<Lot[]> {
  const res = await fetch('/api/lots', { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export async function apiGetLot(id: string): Promise<Lot | null> {
  const res = await fetch(`/api/lots/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export async function apiAddLot(lot: Lot): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch('/api/lots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lot),
  });
  if (res.ok) return { ok: true };
  const data = await res.json().catch(() => ({}));
  return { ok: false, error: data.error || `HTTP ${res.status}` };
}

export async function apiUpdateLot(lot: Lot): Promise<boolean> {
  const res = await fetch(`/api/lots/${lot.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lot),
  });
  return res.ok;
}

export async function apiDeleteLot(id: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`/api/lots/${id}`, { method: 'DELETE' });
  if (res.ok) return { ok: true };
  try {
    const data = await res.json();
    return { ok: false, error: data.error };
  } catch {
    return { ok: false };
  }
}

export async function apiToggleLot(id: string): Promise<boolean> {
  const res = await fetch(`/api/lots/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _action: 'toggle' }),
  });
  return res.ok;
}

// ---- STATS ----
export async function apiGetStats(): Promise<SiteStats> {
  const res = await fetch('/api/stats', { cache: 'no-store' });
  if (!res.ok) return { totalViews: 0, totalOrders: 0, lotViews: {}, lotOrders: {} };
  return res.json();
}

export async function apiRecordView(lotId: string) {
  fetch('/api/stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'view', lotId }),
  }).catch(() => {});
}

export async function apiRecordOrder(lotId: string) {
  fetch('/api/stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'order', lotId }),
  }).catch(() => {});
}

// ---- AUTH (localStorage da saqlanadi — bu OK, har kim o'z sessionida) ----
const AUTH_KEY = 'innostep_admin_auth';
const ADMIN_PASSWORD = 'admin123';

export function adminLogin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_KEY, '1');
    return true;
  }
  return false;
}

export function adminLogout() {
  localStorage.removeItem(AUTH_KEY);
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_KEY) === '1';
}

// ---- IMAGE UPLOAD ----
export async function apiUploadImage(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.url;
}
