'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, RefreshCw, Package, Phone, Send, Clock, Truck, MessageCircle, Camera } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { useT } from '@/lib/i18n';
import LotCard from '@/components/lot/LotCard';
import CategoryBar from '@/components/lot/CategoryBar';
import { apiGetLots } from '@/lib/api';
import { Lot } from '@/types';

function useColumns() {
  const [cols, setCols] = useState(5);
  useEffect(() => {
    function calc() {
      const w = Math.min(1280, window.innerWidth) - 48;
      setCols(Math.max(2, Math.floor((w + 16) / 236)));
    }
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  return cols;
}

export default function HomePage() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Barchasi');
  const cols = useColumns();
  const t = useT();

  useEffect(() => {
    apiGetLots().then((all) => {
      setLots(all.filter((l) => l.isActive));
      setLoading(false);
    });
  }, []);

  const categories = Array.from(new Set(lots.map((l) => l.category)));
  const filtered = activeCategory === 'Barchasi' ? lots : lots.filter(l => l.category === activeCategory);
  const maxShow = cols * 4;
  const fullRows = Math.floor(Math.min(filtered.length, maxShow) / cols) * cols;
  const displayLots = filtered.slice(0, fullRows > 0 ? fullRows : Math.min(filtered.length, maxShow));

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
                <Zap size={12} /> {t('hero.badge')}
              </span>
              <h1 className="font-display" style={{ fontSize: 'clamp(36px, 5vw, 72px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>
                {t('hero.h1a')}{' '}<span className="gradient-text">{t('hero.h1b')}</span>{' '}{t('hero.h1c')}
              </h1>
              <p style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 40, maxWidth: 520 }}>
                {t('hero.p')}
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/lots"><button className="btn-gold" style={{ fontSize: 16 }}>{t('btn.lots')} <ArrowRight size={18} /></button></Link>
                <Link href="/lots"><button className="btn-outline" style={{ fontSize: 16 }}>{t('btn.cats')}</button></Link>
              </div>
              <div style={{ display: 'flex', gap: 40, marginTop: 60, flexWrap: 'wrap' }}>
                {[
                  { value: lots.length + '+', label: t('stat.lots') },
                  { value: categories.length + '+', label: t('stat.cats') },
                  { value: '100%', label: t('stat.guar') },
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
                { icon: <Package size={22} />, title: t('f1.t'), desc: t('f1.d') },
                { icon: <RefreshCw size={22} />, title: t('f2.t'), desc: t('f2.d') },
                { icon: <Zap size={22} />, title: t('f3.t'), desc: t('f3.d') },
                { icon: <Shield size={22} />, title: t('f4.t'), desc: t('f4.d') },
                { icon: <Truck size={22} />, title: t('f5.t'), desc: t('f5.d') },
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
              <h2 className="font-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>{t('btn.lots')}</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{loading ? t('lots.loading') : t('lots.showing', { n: displayLots.length })}</p>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + cols + ', minmax(0, 1fr))', gap: cols <= 2 ? 10 : 16, alignItems: 'stretch' }}>
                {displayLots.map((lot) => <LotCard key={lot.id} lot={lot} />)}
              </div>
            )}

            {lots.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                <Link href="/lots">
                  <button className="btn-outline" style={{ padding: '14px 40px', fontSize: 15 }}>
                    {t('lots.viewall')} <ArrowRight size={16} />
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
              <img src="/logo-crown.png" alt="Luxury Market" width={30} height={30} style={{ borderRadius: 8, display: 'block' }} />
              <span className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
                LUXURY MARKET
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, maxWidth: 320 }}>
              {t('footer.desc')}
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t('footer.links')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <FooterLink href="/">{t('nav.home')}</FooterLink>
              <FooterLink href="/lots">{t('nav.lots')}</FooterLink>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t('footer.contact')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <FooterLink href="tel:+998500370708" icon={<Phone size={14} />}>+998 50 037 07 08</FooterLink>
              <FooterLink href="tel:+998951149988" icon={<Phone size={14} />}>+998 95 114 99 88</FooterLink>
              <FooterLink href="https://wa.me/998500370708" external icon={<MessageCircle size={14} />}>WhatsApp</FooterLink>
              <FooterLink href="https://www.instagram.com/javakhir_yoldoshov/" external icon={<Camera size={14} />}>Instagram</FooterLink>
              <FooterLink href="https://t.me/JavakhirYoldashov" external icon={<Send size={14} />}>@JavakhirYoldashov</FooterLink>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                <Clock size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                {t('footer.h1')}<br />{t('footer.h2')}
              </span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', padding: '16px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-dim)', fontSize: 12 }}>{t('footer.rights')}</p>
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
