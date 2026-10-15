'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Minus, Plus, Package, CheckCircle, Info, ChevronRight, Send } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { apiGetLot, apiRecordView, apiRecordOrder } from '@/lib/api';
import { Lot } from '@/types';
import { formatPrice as fmtPrice } from '@/lib/data';
import { getExchange, ExchangeIcon } from '@/lib/exchanges';

const TELEGRAM_USERNAME = 'JavakhirYoldashov';

export default function LotDetailPage() {
  const params = useParams();
  const [lot, setLot] = useState<Lot | null | undefined>(undefined);
  const [qtyText, setQtyText] = useState('1');
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    apiGetLot(params.id as string).then((found) => {
      setLot(found);
      if (found) { apiRecordView(found.id); setQtyText(String(found.minOrder || 1)); }
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

  const minQty = lot.minOrder && lot.minOrder > 0 ? lot.minOrder : 1;
  const maxQty = lot.maxOrder && lot.maxOrder >= minQty ? lot.maxOrder : 1000000000;
  const clamp = (n: number) => Math.min(maxQty, Math.max(minQty, n));

  const typed = parseInt(qtyText.replace(/\D/g, ''), 10);
  const qty = isNaN(typed) ? minQty : clamp(typed);
  const outOfRange = !isNaN(typed) && (typed < minQty || typed > maxQty);
  const totalPrice = lot.price * qty;

  const exchange = getExchange(lot.category);
  const exchangeName = exchange ? exchange.name : 'sayt';

  function commitQty() { setQtyText(String(qty)); }

  function handleOrder() {
    apiRecordOrder(lot!.id);
    if (lot!.cooperationLink) window.open(lot!.cooperationLink, '_blank');
  }

  function handleTelegramContact() {
    apiRecordOrder(lot!.id);
    const lines = [
      'Assalomu alaykum! Buyurtma bermoqchiman:',
      '',
      'Mahsulot: ' + lot!.title,
      exchange ? 'Birja: ' + exchange.name : '',
      'Miqdor: ' + qty + ' ta',
      'Narx (1 ta): ' + fmtPrice(lot!.price),
      'Jami: ' + fmtPrice(totalPrice),
      '',
      typeof window !== 'undefined' ? window.location.href : '',
    ].filter((l, i, arr) => !(l === '' && i > 0 && arr[i - 1] === ''));
    window.open('https://t.me/' + TELEGRAM_USERNAME + '?text=' + encodeURIComponent(lines.join('\n')), '_blank');
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 13, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
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
                    border: '2px solid ' + (i === activeImg ? 'var(--accent)' : 'var(--border)'),
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
            <span className="badge badge-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, width: 'fit-content', marginBottom: 12 }}>
              {exchange ? <ExchangeIcon exchange={exchange} size={18} /> : null}
              {lot.category}
            </span>
            <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>{lot.title}</h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24 }}>{lot.description}</p>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
                <span className="gradient-text-gold font-display" style={{ fontSize: 'clamp(22px, 6vw, 32px)', fontWeight: 700, whiteSpace: 'nowrap' }}>{fmtPrice(lot.price)}</span>
                <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>1 ta uchun</span>
              </div>
              {lot.cooperationPrice && lot.cooperationPrice !== lot.price && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                  <Info size={12} /> {exchangeName} saytidagi narx: <strong>{fmtPrice(lot.cooperationPrice)}</strong>
                </div>
              )}
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: 'var(--text-muted)' }}>MIQDOR TANLASH</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                <button className="btn-outline" style={{ padding: '8px 14px', minWidth: 42 }} onClick={() => setQtyText(String(clamp(qty - 1)))}>
                  <Minus size={16} />
                </button>
                <input
                  type="text" inputMode="numeric" value={qtyText}
                  onChange={(e) => setQtyText(e.target.value.replace(/\D/g, ''))}
                  onBlur={commitQty}
                  onKeyDown={(e) => { if (e.key === 'Enter') commitQty(); }}
                  className="input" style={{ textAlign: 'center', width: 150, fontWeight: 700, fontSize: 18 }}
                />
                <button className="btn-outline" style={{ padding: '8px 14px', minWidth: 42 }} onClick={() => setQtyText(String(clamp(qty + 1)))}>
                  <Plus size={16} />
                </button>
                <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                  (min: {minQty}{maxQty < 1000000000 ? ', max: ' + maxQty : ''})
                </span>
              </div>
              {outOfRange && (
                <div style={{ fontSize: 12, color: '#f59e0b', marginBottom: 8 }}>
                  Miqdor {minQty} dan {maxQty < 1000000000 ? maxQty + ' gacha' : 'yuqori'} bo&apos;lishi kerak. Hisob {qty} ta bo&apos;yicha.
                </div>
              )}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Jami ({qty} ta):</span>
                <span className="gradient-text-gold font-display" style={{ fontSize: 'clamp(17px, 4.5vw, 22px)', fontWeight: 700, whiteSpace: 'nowrap' }}>{fmtPrice(totalPrice)}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
              {lot.cooperationLink ? (
                <button
                  className="btn-gold"
                  onClick={handleOrder}
                  style={{ justifyContent: 'center', fontSize: 15, padding: '15px', borderRadius: 12, gap: 10 }}
                >
                  {exchange ? <ExchangeIcon exchange={exchange} size={22} /> : null}
                  {exchange ? exchange.name + ' orqali' : 'Saytda buyurtma berish'} <ExternalLink size={15} />
                </button>
              ) : null}
              <button
                className="btn-outline"
                onClick={handleTelegramContact}
                style={{ justifyContent: 'center', fontSize: 15, padding: '15px', borderRadius: 12, gap: 10 }}
              >
                <Send size={18} /> Telegram orqali bog&apos;lanish
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12, color: 'var(--text-dim)', marginTop: 10, justifyContent: 'center', textAlign: 'center' }}>
              <CheckCircle size={12} color="var(--success)" style={{ marginTop: 2, flexShrink: 0 }} />
              <span>
                {lot.cooperationLink ? 'Buyurtma ' + (exchange ? exchange.name : 'tashqi') + ' saytida rasmiylashtiriladi. ' : ''}
                Telegram orqali — to&apos;g&apos;ridan-to&apos;g&apos;ri biz bilan bog&apos;lanasiz.
              </span>
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
