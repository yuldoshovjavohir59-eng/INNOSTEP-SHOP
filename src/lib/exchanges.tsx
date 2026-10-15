import React from 'react';

export type Exchange = {
  id: string;
  name: string;
  short: string;
  color: string;
};

const EXCHANGES: Record<string, Exchange> = {
  'new-cooperation': { id: 'new-cooperation', name: 'New Cooperation', short: 'NC', color: '#0ea5e9' },
  cooperation: { id: 'cooperation', name: 'Cooperation', short: 'C', color: '#2563eb' },
  'xarid-uzex': { id: 'xarid-uzex', name: 'Xarid UZEX', short: 'UX', color: '#16a34a' },
  'xt-xarid': { id: 'xt-xarid', name: 'XT Xarid', short: 'XT', color: '#dc2626' },
  'e-birja': { id: 'e-birja', name: 'E-birja', short: 'EB', color: '#7c3aed' },
};

export function getExchange(category: string | undefined | null): Exchange | null {
  const c = (category || '').toLowerCase().replace(/\s+/g, ' ').trim();
  if (!c) return null;
  if (c.indexOf('new.cooperation') >= 0 || c.indexOf('new cooperation') >= 0) return EXCHANGES['new-cooperation'];
  if (c.indexOf('cooperation') >= 0) return EXCHANGES['cooperation'];
  if (c.indexOf('uzex') >= 0 || c.indexOf('xarid uz') >= 0) return EXCHANGES['xarid-uzex'];
  if (c.indexOf('xt') === 0 || c.indexOf('xt ') >= 0) return EXCHANGES['xt-xarid'];
  if (c.indexOf('birja') >= 0) return EXCHANGES['e-birja'];
  return null;
}

export function ExchangeIcon({ exchange, size = 22 }: { exchange: Exchange; size?: number }) {
  return (
    <span
      title={exchange.name}
      style={{
        width: size, height: size, borderRadius: Math.round(size * 0.3), flexShrink: 0,
        background: exchange.color, color: '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: Math.round(size * 0.42), fontWeight: 800, letterSpacing: -0.3,
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      {exchange.short}
    </span>
  );
}
