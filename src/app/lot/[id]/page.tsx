'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Minus, Plus, ShoppingCart, Package, CheckCircle, Info, ChevronRight, Send } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { apiGetLot, apiRecordView, apiRecordOrder } from '@/lib/api';
import { Lot } from '@/types';
import { formatPrice as fmtPrice } from '@/lib/data';

const TELEGRAM_USERNAME = 'JavakhirYoldashov';

export default function LotDetailPage() {
  const params = useParams();
  const [lot, setLot] = useState<Lot | null | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    apiGetLot(params.id as string).then((found) => {
      setLot(found);
      if (found) { apiRecordView(found.id); setQty(found.minOrder); }
    });
  }, [params.id]);

  if (lot === undefined) return null;

  if (!lot) return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '100px 24px' }}>
        <h2 style={{ fontSize: 24, marginBottom: 16 }}>Lot topilmadi</h2>
        <Link href="/lots"><button className="btn-primary">Orqaga</button></Link>
      </div>
    </>
  );

  const totalPrice = lot.price * qty;

  function handleOrder() {
    // Record order click
    apiRecordOrder(lot!.id);
    if (lot!.cooperationLink) window.open(lot!.cooperationLink, '_blank');
  }

  function handleTelegramContact() {
    apiRecordOrder(lot!.id);
    const message = `Salom! Menga "${lot!.title}" mahsulotidan ${qty} ta kerak edi. Narxi: ${fmtPrice(totalPrice)}. Buyurtma berish mumkinmi?`;
    const url = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 13, color: 'var(--text-muted)' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Bosh sahifa</Link>
          <ChevronRight size={14} />
          <Link href="/lots" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Lotlar</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text)' }}>{lot.title}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
          {/* Images */}
          <div>
            <div style={{
              borderRadius: 16, overflow: 'hidden',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              aspectRatio: '1/1', marginBottom: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {lot.images[activeImg] ? (
                <img
                  src={lot.images[activeImg]}
                  alt={lot.title}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16 }}
                />
              ) : (
                <Package size={64} color="var(--text-dim)" />
              )}
            </div>
            {lot.images.length > 1 && (
              <div style={{ display: 'flex', gap: 10 }}>
                {lot.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} style={{
                    width: 72, height: 72, borderRadius: 10, overflow: 'hidden',
                    border: `2px solid ${i === activeImg ? 'var(--accent)' : 'var(--border)'}`,
                    cursor: 'pointer', padding: 4, background: 'var(--bg-card)',
                  }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <span className="badge badge-accent" style={{ display: 'inline-flex', width: 'fit-content', marginBottom: 12 }}>{lot.category}</span>
            <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>{lot.title}</h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24 }}>{lot.description}</p>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
                <span className="gradient-text-gold font-display" style={{ fontSize: 'clamp(22px, 6vw, 32px)', fontWeight: 700, whiteSpace: 'nowrap' }}>{fmtPrice(lot.price)}</span>
                <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>1 ta uchun</span>
              </div>
              {lot.cooperationPrice && lot.cooperationPrice !== lot.price && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                  <Info size={12} /> Cooperation saytidagi narx: <strong>{fmtPrice(lot.cooperationPrice)}</strong>
                </div>
              )}
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: 'var(--text-muted)' }}>MIQDOR TANLASH</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                <button className="btn-outline" style={{ padding: '8px 14px', minWidth: 42 }} onClick={() => setQty(Math.max(lot.minOrder, qty - 1))}>
                  <Minus size={16} />
                </button>
                <input
                  type="number" value={qty} min={lot.minOrder} max={lot.maxOrder}
                  onChange={(e) => { const v = parseInt(e.target.value); if (!isNaN(v)) setQty(Math.min(lot.maxOrder, Math.max(lot.minOrder, v))); }}
                  className="input" style={{ textAlign: 'center', width: 80, fontWeight: 700, fontSize: 18 }}
                />
                <button className="btn-outline" style={{ padding: '8px 14px', minWidth: 42 }} onClick={() => setQty(Math.min(lot.maxOrder, qty + 1))}>
                  <Plus size={16} />
                </button>
                <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>(min: {lot.minOrder}, max: {lot.maxOrder})</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Jami ({qty} ta):</span>
                <span className="gradient-text-gold font-display" style={{ fontSize: 'clamp(17px, 4.5vw, 22px)', fontWeight: 700, whiteSpace: 'nowrap' }}>{fmtPrice(totalPrice)}</span>
              </div>
            </div>

            {/* Ikkita buyurtma yo'li: Cooperation orqali yoki to'g'ridan-to'g'ri Telegram orqali */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                className="btn-gold"
                onClick={handleOrder}
                style={{ flex: 1, minWidth: 220, justifyContent: 'center', fontSize: 15, padding: '16px', borderRadius: 12 }}
              >
                <ShoppingCart size={18} /> Cooperation orqali <ExternalLink size={15} />
              </button>
              <button
                className="btn-outline"
                onClick={handleTelegramContact}
                style={{ flex: 1, minWidth: 220, justifyContent: 'center', fontSize: 15, padding: '16px', borderRadius: 12 }}
              >
                <Send size={18} /> Telegram orqali bog'lanish
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-dim)', marginTop: 10, justifyContent: 'center', textAlign: 'center' }}>
              <CheckCircle size={12} color="var(--success)" /> Cooperation orqali — saytda rasmiylashtiriladi. Telegram orqali — to'g'ridan-to'g'ri biz bilan bog'lanasiz.
            </div>
          </div>
        </div>

        {lot.characteristics.length > 0 && (
          <div style={{ marginTop: 48, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px' }}>
            <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Xarakteristikalar</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
              {lot.characteristics.map((c, i) => (
                <div key={c.key} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 16px',
                  background: i % 2 === 0 ? 'var(--bg-elevated)' : 'transparent',
                  borderRadius: 8,
                }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.key}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 32 }}>
          <Link href="/lots"><button className="btn-outline"><ArrowLeft size={16} /> Orqaga</button></Link>
        </div>
      </main>
    </>
  );
}
