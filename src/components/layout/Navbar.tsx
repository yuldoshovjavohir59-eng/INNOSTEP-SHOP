'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Zap, Settings, Sun, Moon, Home, Boxes } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Load saved theme
    const saved = localStorage.getItem('innostep_theme') as 'dark' | 'light' | null;
    const initial = saved || 'dark';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('innostep_theme', next);
  }

  function handleSearch(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && search.trim()) {
      router.push(`/lots?q=${encodeURIComponent(search.trim())}`);
      setSearchOpen(false);
      setSearch('');
    }
    if (e.key === 'Escape') { setSearchOpen(false); setSearch(''); }
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--navbar-bg)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <nav style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 20px',
        height: 62, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
            borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={16} color="white" fill="white" />
          </div>
          <span className="font-display" style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
            INNOSTEP SHOP
          </span>
        </Link>

        {/* Desktop nav links */}
        <div style={{ flex: 1, display: 'flex', gap: 4, marginLeft: 16 }} className="hidden-mobile">
          <NavLink href="/">Bosh sahifa</NavLink>
          <NavLink href="/lots">Barcha lotlar</NavLink>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div style={{ flex: 1, maxWidth: 320 }}>
            <input
              className="input"
              placeholder="Qidirish... (Enter)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              style={{ height: 38, fontSize: 13 }}
              autoFocus
              onBlur={() => { if (!search) setSearchOpen(false); }}
            />
          </div>
        )}

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'dark' ? "Yorqin rejim" : "Qorong'u rejim"}
          >
            {theme === 'dark'
              ? <><Sun size={14} /> <span className="hidden-mobile" style={{ fontSize: 12 }}>Light</span></>
              : <><Moon size={14} /> <span className="hidden-mobile" style={{ fontSize: 12 }}>Dark</span></>
            }
          </button>

          <button
            className="btn-outline"
            style={{ padding: '7px 10px', fontSize: 13 }}
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            <Search size={15} />
          </button>

          <Link href="/admin/login">
            <button
              className="btn-outline hidden-mobile"
              style={{ padding: '7px 10px', fontSize: 13 }}
              title="Admin Panel"
            >
              <Settings size={15} />
            </button>
          </Link>

          <button
            className="btn-outline"
            style={{ padding: '7px 10px', fontSize: 13 }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--bg-card)',
          borderTop: '1px solid var(--border)',
          padding: '10px 12px 16px',
          display: 'flex', flexDirection: 'column', gap: 2,
          animation: 'menuSlideDown 0.18s ease',
        }}>
          <MobileMenuItem href="/" icon={<Home size={16} />} onClick={() => setMenuOpen(false)}>
            Bosh sahifa
          </MobileMenuItem>
          <MobileMenuItem href="/lots" icon={<Boxes size={16} />} onClick={() => setMenuOpen(false)}>
            Barcha lotlar
          </MobileMenuItem>

          <div style={{ height: 1, background: 'var(--border)', margin: '8px 4px' }} />

          <MobileMenuItem href="/admin/login" icon={<Settings size={16} />} accent onClick={() => setMenuOpen(false)}>
            Admin Panel
          </MobileMenuItem>

          <button
            onClick={() => { toggleTheme(); setMenuOpen(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
              padding: '10px 12px', borderRadius: 10, width: '100%',
              fontFamily: "'Manrope', sans-serif",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{
              width: 30, height: 30, borderRadius: 9, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg-elevated)', color: 'var(--text-muted)',
            }}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </span>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)' }}>
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </span>
          </button>
        </div>
      )}

      <style>{`
        @keyframes menuSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}

function MobileMenuItem({
  href, icon, children, accent, onClick,
}: {
  href: string; icon: React.ReactNode; children: React.ReactNode; accent?: boolean; onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        textDecoration: 'none', padding: '10px 12px', borderRadius: 10,
        fontFamily: "'Manrope', sans-serif",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <span style={{
        width: 30, height: 30, borderRadius: 9, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: accent ? 'rgba(108,99,255,0.15)' : 'var(--bg-elevated)',
        color: accent ? 'var(--accent)' : 'var(--text-muted)',
      }}>
        {icon}
      </span>
      <span style={{ fontSize: 14, fontWeight: 600, color: accent ? 'var(--accent)' : 'var(--text)' }}>
        {children}
      </span>
    </Link>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        color: 'var(--text-muted)', textDecoration: 'none',
        padding: '5px 10px', borderRadius: 7,
        fontSize: 13, fontWeight: 500,
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.color = 'var(--text)';
        (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
        (e.currentTarget as HTMLElement).style.background = 'transparent';
      }}
    >
      {children}
    </Link>
  );
}
