'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, TrendingUp, Package, BarChart2, Award } from 'lucide-react';
import { apiGetLots, apiGetStats, isAdminLoggedIn, SiteStats } from '@/lib/api';
import { formatPrice } from '@/lib/data';
import { Lot } from '@/types';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminStatsPage() {
  const router = useRouter();
  const [lots, setLots] = useState<Lot[]>([]);
  const [stats, setStats] = useState<SiteStats>({ totalViews: 0, totalOrders: 0, lotViews: {}, lotOrders: {} });

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push('/admin/login'); return; }
    Promise.all([apiGetLots(), apiGetStats()]).then(([l, s]) => { setLots(l); setStats(s); });
  }, [router]);

  const lotsWithStats = lots.map(lot => ({
    ...lot,
    views: stats.lotViews[lot.id] || 0,
    orders: stats.lotOrders[lot.id] || 0,
  })).sort((a, b) => b.views - a.views);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main className="admin-main-content" style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Statistika</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Mahsulotlar ko'rilishi va buyurtmalar</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 28 }}>
          {[
            { icon: <Package size={18} />, label: 'Jami mahsulot', value: lots.length, color: 'var(--accent)' },
            { icon: <Eye size={18} />, label: "Jami ko'rish", value: stats.totalViews, color: 'var(--gold)' },
            { icon: <TrendingUp size={18} />, label: 'Jami buyurtma', value: stats.totalOrders, color: '#f97316' },
            { icon: <Award size={18} />, label: 'Aktiv lotlar', value: lots.filter(l => l.isActive).length, color: 'var(--success)' },
          ].map((s) => (
            <div key={s.label} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Unbounded', sans-serif", color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart2 size={16} color="var(--accent)" />
            <span style={{ fontWeight: 600, fontSize: 14 }}>Mahsulotlar statistikasi</span>
          </div>

          <div className="admin-table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['#', 'Mahsulot', 'Kategoriya', "Ko'rishlar", 'Buyurtmalar', 'Konversiya'].map((h) => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lotsWithStats.map((lot, i) => (
                  <tr key={lot.id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '10px 14px', color: 'var(--text-dim)', fontSize: 13 }}>{i + 1}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', background: 'var(--bg-elevated)', flexShrink: 0 }}>
                          {lot.images[0] ? <img src={lot.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={16} color="var(--text-dim)" /></div>}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{lot.title}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatPrice(lot.price)}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px' }}><span className="badge badge-accent" style={{ fontSize: 11 }}>{lot.category}</span></td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Eye size={13} color="var(--gold)" />
                        <span style={{ fontWeight: 700, color: 'var(--gold)' }}>{lot.views}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <TrendingUp size={13} color="#f97316" />
                        <span style={{ fontWeight: 700, color: '#f97316' }}>{lot.orders}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--success)', fontSize: 13 }}>
                        {lot.views > 0 ? `${Math.round((lot.orders / lot.views) * 100)}%` : '0%'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-cards-wrap" style={{ display: 'none', padding: 12, flexDirection: 'column', gap: 10 }}>
            {lotsWithStats.map((lot, i) => (
              <div key={lot.id} style={{ background: 'var(--bg-elevated)', borderRadius: 10, padding: 14, border: '1px solid var(--border)', display: 'flex', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', background: 'var(--bg-card)', flexShrink: 0 }}>
                  {lot.images[0] ? <img src={lot.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={18} color="var(--text-dim)" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{i + 1}. {lot.title}</div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}><Eye size={11} /> {lot.views} ko'rish</span>
                    <span style={{ fontSize: 12, color: '#f97316', fontWeight: 600 }}><TrendingUp size={11} /> {lot.orders} buyurtma</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
