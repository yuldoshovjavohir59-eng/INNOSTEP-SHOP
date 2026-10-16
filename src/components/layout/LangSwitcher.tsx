'use client';
import { LANGS, setLang, useLang } from '@/lib/i18n';

export default function LangSwitcher() {
  const lang = useLang();
  return (
    <div
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 2, padding: 2,
        borderRadius: 999, border: '1px solid var(--border)', background: 'var(--bg-card)',
      }}
    >
      {LANGS.map((l) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            aria-label={l.label}
            style={{
              border: 'none', cursor: 'pointer', borderRadius: 999,
              padding: '4px 9px', fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
              fontFamily: 'inherit',
              background: active ? 'var(--accent)' : 'transparent',
              color: active ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.15s',
            }}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
