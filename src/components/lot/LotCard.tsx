import Link from 'next/link';
import { ExternalLink, Package, TrendingUp } from 'lucide-react';
import { Lot } from '@/types';
import { formatPrice } from '@/lib/data';
export default function LotCard({ lot }: { lot: Lot }) {
  const priceChanged = lot.cooperationPrice && lot.cooperationPrice !== lot.price;
  const priceDiff = lot.cooperationPrice
    ? Math.round(((lot.price - lot.cooperationPrice) / lot.cooperationPrice) * 100)
    : 0;
  return (
    <Link href={`/lot/${lot.id}`} style={{ textDecoration: 'none', display: 'flex' }}>
      <div className="card" style={{ overflow: 'hidden', cursor: 'pointer', width: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="lot-img-wrap">
          {lot.images[0] ? (
            <img src={lot.images[0]} alt={lot.title} loading="lazy" />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={40} color="var(--text-dim)" />
            </div>
          )}
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <span className="badge badge-accent">{lot.category}</span>
          </div>
          {priceChanged && (
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <span className="badge badge-gold">
                <TrendingUp size={9} />
                {priceDiff > 0 ? '+' : ''}{priceDiff}%
              </span>
            </div>
          )}
        </div>
        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h3 style={{
            fontSize: 13, fontWeight: 600, color: 'var(--text)',
            marginBottom: 8, lineHeight: 1.45,
            minHeight: '2.9em',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {lot.title}
          </h3>
          <div style={{ flex: 1 }}>
            {lot.characteristics.slice(0, 2).map((c) => (
              <div key={c.key} style={{
                display: 'flex', justifyContent: 'space-between', gap: 4,
                fontSize: 11, color: 'var(--text-muted)', marginBottom: 3,
              }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0, maxWidth: '48%' }}>{c.key}</span>
                <span style={{ color: 'var(--text)', fontWeight: 500, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '52%' }}>{c.value}</span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 10, paddingTop: 10,
            borderTop: '1px solid var(--border)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 4,
          }}>
            <div className="gradient-text-gold" style={{
              fontSize: 14, fontWeight: 700,
              fontFamily: "'Unbounded', sans-serif",
              lineHeight: 1.2, wordBreak: 'break-all',
            }}>
              {formatPrice(lot.price)}
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0,
              fontSize: 11, color: 'var(--accent)', fontWeight: 600,
            }}>
              <ExternalLink size={11} /> Batafsil
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
