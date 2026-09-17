'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, EyeOff, BarChart2, Package, TrendingUp, Activity } from 'lucide-react';
import { apiGetLots, apiToggleLot, apiDeleteLot, apiGetStats, isAdminLoggedIn, SiteStats } from '@/lib/api';
import { formatPrice } from '@/lib/data';
import { Lot } from '@/types';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLotsPage() {
  const router = useRouter();
  const [lots, setLots] = useState<Lot[]>([]);
  const [stats, setStats] = useState<SiteStats>({ totalViews: 0, totalOrders: 0, lotViews: {}, lotOrders: {} });

  async function reload() {
    const [l, s] = await Promise.all([apiGetLots(), apiGetStats()]);
    setLots(l); setStats(s);
  }

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push('/admin/login'); return; }
    reload();
  }, [router]);

  async function handleToggle(id: string) { await apiToggleLot(id); reload(); }
  async function handleDelete(id: string) {
    if (confirm("Bu lotni o'chirishni tasdiqlaysizmi?")) {
      const result = await apiDeleteLot(id);
      if (!result.ok) { alert(`Xatolik: ${result.error || "O'chirib bo'lmadi"}`); return; }
      reload();
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main className="admin-main-content" style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Lotlar boshqaruvi</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Jami {lots.length} ta lot</p>
          </div>
          <Link href="/admin/lot-new"><button className="btn-primary"><Plus size={16} /> Yangi lot</button></Link>
        </div>
        {/* Tor ekranda doim ko'rinib turadigan suzuvchi tugma */}
        <Link href="/admin/lot-new" className="fab-add-mobile" aria-label="Yangi lot qo'shish">
          <Plus size={24} />
        </Link>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { icon: <Package size={16} />, label: 'Jami lotlar', value: lots.length, color: 'var(--accent)' },
            { icon: <Activity size={16} />, label: 'Aktiv', value: lots.filter(l => l.isActive).length, color: 'var(--success)' },
            { icon: <Eye size={16} />, label: "Ko'rishlar", value: stats.totalViews, color: 'var(--gold)' },
            { icon: <TrendingUp size={16} />, label: 'Buyurtmalar', value: stats.totalOrders, color: '#f97316' },
          ].map((s) => (
            <div key={s.label} className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ color: s.color }}>{s.icon}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Unbounded', sans-serif", color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart2 size={16} color="var(--accent)" />
            <span style={{ fontWeight: 600, fontSize: 14 }}>Barcha lotlar</span>
          </div>
          <div className="admin-table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Rasm', 'Nomi', 'Kategoriya', 'Narxi', 'Holat', 'Amallar'].map((h) => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lots.map((lot) => (
                  <tr key={lot.id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', background: 'var(--bg-elevated)' }}>
                        {lot.images[0] ? <img src={lot.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={18} color="var(--text-dim)" /></div>}
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px' }}><div style={{ fontSize: 13, fontWeight: 600, maxWidth: 180 }}>{lot.title}</div></td>
                    <td style={{ padding: '10px 14px' }}><span className="badge badge-accent" style={{ fontSize: 11 }}>{lot.category}</span></td>
                    <td style={{ padding: '10px 14px' }}><span style={{ fontWeight: 700, color: 'var(--gold)', fontFamily: "'Unbounded', sans-serif", fontSize: 12 }}>{formatPrice(lot.price)}</span></td>
                    <td style={{ padding: '10px 14px' }}>
                      <button onClick={() => handleToggle(lot.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: lot.isActive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: lot.isActive ? 'var(--success)' : 'var(--danger)', border: 'none', borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: "'Manrope', sans-serif" }}>
                        {lot.isActive ? <Eye size={11} /> : <EyeOff size={11} />}{lot.isActive ? 'Aktiv' : 'Yashirin'}
                      </button>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link href={`/admin/lot-edit/${lot.id}`}><button className="btn-outline" style={{ padding: '6px 10px' }}><Edit size={13} /></button></Link>
                        <button className="btn-outline" style={{ padding: '6px 10px', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleDelete(lot.id)}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-cards-wrap" style={{ display: 'none', padding: 12, flexDirection: 'column', gap: 10 }}>
            {lots.map((lot) => (
              <div key={lot.id} style={{ background: 'var(--bg-elevated)', borderRadius: 10, padding: 14, border: '1px solid var(--border)', display: 'flex', gap: 12 }}>
                <div style={{ width: 52, height: 52, borderRadius: 8, overflow: 'hidden', background: 'var(--bg-card)', flexShrink: 0 }}>
                  {lot.images[0] ? <img src={lot.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={18} color="var(--text-dim)" /></div>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lot.title}</div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                    <span className="badge badge-accent" style={{ fontSize: 10 }}>{lot.category}</span>
                    <span style={{ fontWeight: 700, color: 'var(--gold)', fontSize: 11, fontFamily: "'Unbounded', sans-serif" }}>{formatPrice(lot.price)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => handleToggle(lot.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: lot.isActive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: lot.isActive ? 'var(--success)' : 'var(--danger)', border: 'none', borderRadius: 20, padding: '3px 8px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                      {lot.isActive ? <Eye size={10} /> : <EyeOff size={10} />}{lot.isActive ? 'Aktiv' : 'Yashirin'}
                    </button>
                    <Link href={`/admin/lot-edit/${lot.id}`}><button className="btn-outline" style={{ padding: '4px 8px', fontSize: 12 }}><Edit size={12} /></button></Link>
                    <button className="btn-outline" style={{ padding: '4px 8px', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleDelete(lot.id)}><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {lots.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-dim)' }}>Lotlar yo'q. <Link href="/admin/lot-new" style={{ color: 'var(--accent)' }}>Yangi lot qo'shish</Link></div>}
        </div>
      </main>
      <style>{`
        @media (max-width: 768px) {
          .admin-main-content { padding: 72px 14px 24px !important; }
          .admin-table-wrap { display: none !important; }
          .admin-cards-wrap { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
