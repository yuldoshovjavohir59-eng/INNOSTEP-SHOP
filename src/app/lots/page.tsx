'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Search, ChevronDown, ArrowUpDown, Check, Filter, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import LotCard from '@/components/lot/LotCard';
import { apiGetLots } from '@/lib/api';
import { Lot } from '@/types';

function LotsContent() {
  const searchParams = useSearchParams();
  const [allLots, setAllLots] = useState<Lot[]>([]);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState('Barchasi');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('new');
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    apiGetLots().then(all => setAllLots(all.filter(l => l.isActive)));
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearch(q);
  }, [searchParams]);

  // Tashqariga bosilganda saralash ro'yxatini yopish
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const categories = useMemo(() => ['Barchasi', ...Array.from(new Set(allLots.map((l) => l.category)))], [allLots]);

  const lots = useMemo(() => {
    let filtered = allLots;
    if (activeCategory !== 'Barchasi') filtered = filtered.filter((l) => l.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q)
      );
    }
    const min = parseInt(minPrice);
    const max = parseInt(maxPrice);
    if (!isNaN(min)) filtered = filtered.filter((l) => l.price >= min);
    if (!isNaN(max)) filtered = filtered.filter((l) => l.price <= max);

    if (sort === 'price-asc') return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...filtered].sort((a, b) => b.price - a.price);
    return [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [allLots, search, activeCategory, minPrice, maxPrice, sort]);

  const sortOptions: { value: string; label: string }[] = [
    { value: 'new', label: 'Yangi birinchi' },
    { value: 'price-asc', label: 'Arzondan qimmatga' },
    { value: 'price-desc', label: 'Qimmatdan arzonga' },
  ];
  const currentSortLabel = sortOptions.find((o) => o.value === sort)?.label ?? '';

  function clearFilters() {
    setActiveCategory('Barchasi');
    setMinPrice('');
    setMaxPrice('');
    setSearch('');
  }

  const hasActiveFilters = activeCategory !== 'Barchasi' || minPrice !== '' || maxPrice !== '' || search !== '';

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          <h1 className="font-display" style={{ fontSize: 36, fontWeight: 700 }}>
            Barcha <span className="gradient-text">lotlar</span>
          </h1>
          <span className="badge badge-accent" style={{ fontSize: 12, padding: '4px 12px' }}>
            {lots.length} ta mahsulot
          </span>
        </div>

        <div className="lots-layout" style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          {/* Chap panel — Filtrlar */}
          <aside className="lots-sidebar" style={{
            width: 260, flexShrink: 0, background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 14, padding: 20, position: 'sticky', top: 84,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Filter size={16} color="var(--accent)" />
                <span style={{ fontSize: 15, fontWeight: 700 }}>Filtrlar</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none',
                    color: 'var(--text-dim)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  <X size={12} /> Tozalash
                </button>
              )}
            </div>

            {/* Kategoriya ro'yxati */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                Kategoriya
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      style={{
                        display: 'flex', alignItems: 'center', textAlign: 'left',
                        background: isActive ? 'var(--bg-elevated)' : 'transparent',
                        border: 'none', borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                        borderRadius: 6, padding: '8px 10px', cursor: 'pointer',
                        color: isActive ? 'var(--text)' : 'var(--text-muted)',
                        fontWeight: isActive ? 600 : 500, fontSize: 13, fontFamily: 'inherit',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Narx oralig'i */}
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                Narx oralig'i
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <label style={{ fontSize: 11, color: 'var(--text-dim)', display: 'block', marginBottom: 4 }}>Narx dan</label>
                  <input
                    className="input" type="number" placeholder="0" value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    style={{ width: '100%', height: 38, fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'var(--text-dim)', display: 'block', marginBottom: 4 }}>Narx gacha</label>
                  <input
                    className="input" type="number" placeholder="1 000 000" value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={{ width: '100%', height: 38, fontSize: 13 }}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* O'ng tomon — qidiruv, saralash, mahsulotlar */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Qidiruv + saralash */}
            <div style={{
              display: 'flex', alignItems: 'stretch', marginBottom: 24,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 14, overflow: 'visible',
            }}>
              <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                <Search size={16} style={{ position: 'absolute', left: 16, color: 'var(--text-dim)', pointerEvents: 'none' }} />
                <input
                  placeholder="Mahsulot qidirish..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: '100%', height: 46, background: 'transparent', border: 'none',
                    paddingLeft: 42, paddingRight: 12, color: 'var(--text)', fontSize: 14,
                    fontFamily: "'Manrope', sans-serif", outline: 'none',
                  }}
                />
              </div>
              <div style={{ width: 1, background: 'var(--border)', margin: '10px 0' }} />

              <div ref={sortRef} style={{ position: 'relative', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => setSortOpen((v) => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: 13, fontFamily: "'Manrope', sans-serif",
                    padding: '0 16px', height: 46, whiteSpace: 'nowrap',
                  }}
                >
                  <ArrowUpDown size={13} style={{ flexShrink: 0 }} />
                  {currentSortLabel}
                  <ChevronDown
                    size={14}
                    style={{ flexShrink: 0, transition: 'transform 0.15s', transform: sortOpen ? 'rotate(180deg)' : 'none' }}
                  />
                </button>

                {sortOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 30,
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 12, boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
                    minWidth: 220, overflow: 'hidden', padding: 6,
                  }}>
                    {sortOptions.map((opt) => {
                      const isActive = opt.value === sort;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { setSort(opt.value); setSortOpen(false); }}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                            width: '100%', textAlign: 'left', background: isActive ? 'var(--bg-elevated)' : 'transparent',
                            border: 'none', borderRadius: 8, cursor: 'pointer',
                            color: isActive ? 'var(--text)' : 'var(--text-muted)',
                            fontWeight: isActive ? 600 : 500, fontSize: 13,
                            fontFamily: "'Manrope', sans-serif", padding: '10px 12px',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                          onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                        >
                          {opt.label}
                          {isActive && <Check size={14} color="var(--accent)" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Lots grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, alignItems: 'stretch' }}>
              {lots.map((lot) => <LotCard key={lot.id} lot={lot} />)}
            </div>

            {lots.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-dim)', fontSize: 16 }}>
                {hasActiveFilters ? "Filtrlarga mos mahsulot topilmadi" : "Hozircha lotlar yo'q"}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default function LotsPage() {
  return <Suspense fallback={null}><LotsContent /></Suspense>;
}
