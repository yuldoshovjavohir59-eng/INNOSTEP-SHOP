'use client';
import { useEffect, useRef, useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { LANGS, setLang, useLang } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';

const NAMES: Record<Lang, string> = { uz: "O'zbekcha", ru: 'Русский', en: 'English' };

export default function LangDropdown() {
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent | TouchEvent) {
      if (ref.current && ref.current.contains(e.target as Node) === false) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('touchstart', onDoc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('touchstart', onDoc);
    };
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        className="btn-outline"
        onClick={() => setOpen(!open)}
        aria-label="Language"
        aria-expanded={open}
        style={{ padding: '7px 10px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}
      >
        <Globe size={15} />
        <span className="hidden-mobile" style={{ fontSize: 12, fontWeight: 700 }}>{lang.toUpperCase()}</span>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 200,
            minWidth: 160, padding: 6, borderRadius: 12,
            border: '1px solid var(--border)', background: 'var(--bg-card)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
          }}
        >
          {LANGS.map((l) => {
            const active = l.code === lang;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => { setLang(l.code); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                  width: '100%', textAlign: 'left', border: 'none', borderRadius: 8, cursor: 'pointer',
                  padding: '10px 12px', fontSize: 13, fontFamily: 'inherit',
                  fontWeight: active ? 600 : 500,
                  background: active ? 'var(--bg-elevated)' : 'transparent',
                  color: active ? 'var(--text)' : 'var(--text-muted)',
                }}
              >
                <span>{NAMES[l.code]}</span>
                {active ? <Check size={14} color="var(--accent)" /> : <span style={{ fontSize: 11, opacity: 0.6 }}>{l.label}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
