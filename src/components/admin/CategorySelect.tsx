'use client';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check, Plus } from 'lucide-react';
import { apiGetLots } from '@/lib/api';

const OTHER = '__boshqa__';

export default function CategorySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    apiGetLots().then((lots) => {
      const unique = Array.from(new Set(lots.map((l) => l.category).filter(Boolean)));
      setCategories(unique);
      setLoaded(true);
    });
  }, []);

  // Tahrirlash sahifasida mavjud lot kategoriyasi ro'yxatda bo'lmasligi mumkin
  useEffect(() => {
    if (loaded && value && !categories.includes(value)) setCustomMode(true);
  }, [loaded, value, categories]);

  // Tashqariga bosilganda ro'yxatni yopish
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 10,
    border: '1px solid var(--border)', background: 'var(--bg-secondary, transparent)',
    color: 'var(--text)', fontSize: 14, fontFamily: 'inherit',
  };

  if (customMode) {
    return (
      <div>
        <input
          className="input"
          style={inputStyle}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Yangi kategoriya nomi"
          autoFocus
        />
        {categories.length > 0 && (
          <button
            type="button"
            onClick={() => { setCustomMode(false); onChange(''); }}
            style={{ marginTop: 6, fontSize: 12, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Ro'yxatdan tanlash
          </button>
        )}
      </div>
    );
  }

  const displayLabel = categories.includes(value) ? value : (loaded ? 'Kategoriyani tanlang' : 'Yuklanmoqda...');

  return (
    <div ref={boxRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          ...inputStyle,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          cursor: 'pointer', textAlign: 'left',
          color: categories.includes(value) ? 'var(--text)' : 'var(--text-dim)',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayLabel}</span>
        <ChevronDown size={15} style={{ flexShrink: 0, transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none', color: 'var(--text-dim)' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 30,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 12, boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
          padding: 6, maxHeight: 260, overflowY: 'auto',
        }}>
          {categories.map((c) => {
            const isActive = c === value;
            return (
              <button
                key={c}
                type="button"
                onClick={() => { onChange(c); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                  width: '100%', textAlign: 'left', background: isActive ? 'var(--bg-elevated)' : 'transparent',
                  border: 'none', borderRadius: 8, cursor: 'pointer',
                  color: isActive ? 'var(--text)' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 500, fontSize: 13,
                  fontFamily: 'inherit', padding: '10px 12px',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                {c}
                {isActive && <Check size={14} color="var(--accent)" />}
              </button>
            );
          })}

          {categories.length > 0 && <div style={{ height: 1, background: 'var(--border)', margin: '6px 4px' }} />}

          <button
            type="button"
            onClick={() => { setCustomMode(true); onChange(''); setOpen(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', textAlign: 'left', background: 'transparent',
              border: 'none', borderRadius: 8, cursor: 'pointer',
              color: 'var(--accent)', fontWeight: 600, fontSize: 13,
              fontFamily: 'inherit', padding: '10px 12px',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Plus size={14} /> Boshqa (yangi kategoriya)
          </button>
        </div>
      )}
    </div>
  );
}
