'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, RefreshCw, Package, Phone, Send, Clock, Truck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import LotCard from '@/components/lot/LotCard';
import CategoryBar from '@/components/lot/CategoryBar';
import { apiGetLots } from '@/lib/api';
import { Lot } from '@/types';

export default function HomePage() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Barchasi');

  useEffect(() => {
    apiGetLots().then((all) => {
      setLots(all.filter((l) => l.isActive));
      setLoading(false);
    });
  }, []);

  const categories = Array.from(new Set(lots.map((l) => l.category)));
  const filtered = activeCategory === 'Barchasi' ? lots : lots.filter(l => l.category === activeCategory);
  const displayLots = filtered.slice(0, 18);

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: '80px 24px' }}>
          <div style={{ position: 'absolute', top: '10%', left: '15%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,200,66,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: 720 }}>
              <span className="badge badge-accent" style={{ marginBottom: 20, display: 'inline-flex' }}>
                <Zap size={12} /> Premium Mahsulotlar Katalogi
              </span>
              <h1 className="font-display" style={{ fontSize: 'clamp(36px, 5vw, 72px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>
                Sifatli{' '}<span className="gradient-text">mahsulotlar</span>{' '}eng qulay narxda
              </h1>
              <p style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 40, maxWidth: 520 }}>
                Maishiy kimyo, gigiena mahsulotlari va ofis buyumlari — sifatli, qulay va hamyonbop narxlarda. Toshkent shahri ichida bepul yetkazib berish xizmati mavjud.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/lots"><button className="btn-gold" style={{ fontSize: 16 }}>Barcha lotlar <ArrowRight size={18} /></button></Link>
                <Link href="/lots"><button className="btn-outline" style={{ fontSize: 16 }}>Kategoriyalar</button></Link>
              </div>
              <div style={{ display: 'flex', gap: 40, marginTop: 60, flexWrap: 'wrap' }}>
                {[
                  { value: lots.length + '+', label: 'Aktiv lot' },
                  { value: categories.length + '+', label: 'Kategoriya' },
                  { value: '100%', label: 'Kafolat' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-display gradient-text-gold" style={{ fontSize: 32, fontWeight: 700 }}>{s.value}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section style={{ padding: '60px 24px', borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {[
                { icon: <Package size={22} />, title: "To'liq ma'lumot", desc: "Har bir lot uchun batafsil xarakteristikalar va rasmlar" },
                { icon: <RefreshCw size={22} />, title: 'Narx sinxronizatsiyasi', desc: "Cooperation sayitidagi narxlar avtomatik yangilanib turadi" },
                { icon: <Zap size={22} />, title: 'Tezkor buyurtma', desc: "Bir bosish bilan Cooperation ga o'tib buyurtma bering" },
                { icon: <Shield size={22} />, title: 'Ishonchli', desc: 'Tasdiqlangan mahsulotlar, kafolatlangan sifat' },
                { icon: <Truck size={22} />, title: 'Bepul yetkazib berish', desc: "Toshkent shahri ichida bepul yetkazib berish xizmati mavjud" },
              ].map((f) => (
                <div key={f.title} className="card" style={{ padding: 24 }}>
                  <div style={{ width: 44, height: 44, background: 'rgba(108,99,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', marginBottom: 16 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LOTS */}
        <section style={{ padding: '60px 24px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
              <h2 className="font-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Barcha lotlar</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{loading ? 'Yuklanmoqda...' : `${displayLots.length} ta mahsulot ko'rsatilmoqda`}</p>
            </div>

            {/* Category filter — ikonkali qator */}
            <CategoryBar categories={categories} active={activeCategory} onSelect={setActiveCategory} />

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card" style={{ height: 280, opacity: 0.4, background: 'var(--bg-elevated)' }} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, alignItems: 'stretch' }}>
                {displayLots.map((lot) => <LotCard key={lot.id} lot={lot} />)}
              </div>
            )}

            {lots.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                <Link href="/lots">
                  <button className="btn-outline" style={{ padding: '14px 40px', fontSize: 15 }}>
                    Hammasini ko'rish <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer style={{ borderTop: '1px solid var(--border)', marginTop: 20 }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '48px 24px 32px',
          display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 32,
        }} className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{
                width: 30, height: 30,
                background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
                borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={15} color="white" fill="white" />
              </div>
              <span className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
                INNOSTEP SHOP
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, maxWidth: 320 }}>
              Maishiy kimyo, gigiena mahsulotlari va ofis buyumlari — sifatli, qulay va hamyonbop narxlarda ulgurji yetkazib berish. Toshkent shahri ichida bepul yetkazib berish xizmati mavjud.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Tezkor havolalar
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <FooterLink href="/">Bosh sahifa</FooterLink>
              <FooterLink href="/lots">Barcha lotlar</FooterLink>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Aloqa
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <FooterLink href="tel:+998500370708" icon={<Phone size={14} />}>+998 50 037 07 08</FooterLink>
              <FooterLink href="https://t.me/JavakhirYoldashov" external icon={<Send size={14} />}>@JavakhirYoldashov</FooterLink>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                <Clock size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                Dush–Juma 9:00–18:00<br />Shan/Yak dam olish
              </span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', padding: '16px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-dim)', fontSize: 12 }}>© 2026 INNOSTEP SHOP. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>
    </>
  );
}

function FooterLink({
  href, external, icon, children,
}: {
  href: string; external?: boolean; icon?: React.ReactNode; children: React.ReactNode;
}) {
  return (
      <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none',
        transition: 'color 0.15s', width: 'fit-content',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
    >
      {icon ? <span style={{ color: 'var(--accent)', display: 'flex', flexShrink: 0 }}>{icon}</span> : null}
      {children}
    </a>
  );
}
