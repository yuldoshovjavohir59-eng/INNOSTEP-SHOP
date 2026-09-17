'use client';
import { useEffect, useRef, useState } from 'react';
import {
  FileText, FolderClosed, PenLine, Presentation, Printer, Armchair,
  Stamp, Coffee, Headphones, Cpu, Laptop, Package, LayoutGrid,
  Boxes, Shapes, BedDouble, Droplets, Sparkles, SprayCan, FlaskConical,
  ShoppingBag, CupSoda, ScrollText, Bath, Wrench, type LucideIcon,
} from 'lucide-react';

// Kategoriya nomiga qarab mos ikonka (eng aniqdan umumiyga qarab tekshiriladi)
function getCategoryIcon(name: string): LucideIcon {
  const c = name.toLowerCase();
  if (c.includes('barcha')) return LayoutGrid;
  if (c.includes('stakan')) return CupSoda;
  if (c.includes('salfetka')) return ScrollText;
  if (c.includes('xojatxona') || c.includes('tualet') || c.includes('hojatxona')) return Bath;
  if (c.includes('matras')) return BedDouble;
  if (c.includes('atir')) return Sparkles;
  if (c.includes('antiseptik') || c.includes('antibakt')) return FlaskConical;
  if (c.includes('suyuq') || c.includes('sovun') || c.includes('shampun')) return Droplets;
  if (c.includes('tozala') || c.includes('tozzala') || c.includes('yuvish')) return SprayCan;
  if (c.includes('paket') || c.includes('sumka') || c.includes('xalta')) return ShoppingBag;
  if (c.includes('narvon') || c.includes('asbob')) return Wrench;
  if (c.includes('nabor') || c.includes('komplekt') || c.includes("to'plam")) return Boxes;
  if (c.includes('qog') || c.includes('paper')) return FileText;
  if (c.includes('papka') || c.includes('fayl') || c.includes('folder')) return FolderClosed;
  if (c.includes('yozuv') || c.includes('ruchka') || c.includes('qalam') || c.includes('pen')) return PenLine;
  if (c.includes('doska') || c.includes('namoyish') || c.includes('present')) return Presentation;
  if (c.includes('texnika') || c.includes('printer')) return Printer;
  if (c.includes('kompyuter') || c.includes('laptop') || c.includes('noutbuk')) return Laptop;
  if (c.includes('elektron')) return Cpu;
  if (c.includes('mebel') || c.includes('stol') || c.includes('stul')) return Armchair;
  if (c.includes('muhr') || c.includes('shtamp') || c.includes('pechat')) return Stamp;
  if (c.includes('oziq') || c.includes('ovqat') || c.includes('choy') || c.includes('kofe')) return Coffee;
  if (c.includes('audio') || c.includes('quloq')) return Headphones;
  if (c.includes('boshqa') || c.includes('other')) return Shapes;
  return Package;
}

// Har bir kategoriyaga aylanma rang palitrasi (qora va oq mavzuga ham mos)
const PALETTE = [
  { bg: 'rgba(108,99,255,0.14)', fg: '#8b84ff' },
  { bg: 'rgba(245,200,66,0.16)', fg: '#e0b020' },
  { bg: 'rgba(34,197,94,0.15)',  fg: '#22c55e' },
  { bg: 'rgba(59,130,246,0.15)', fg: '#3b82f6' },
  { bg: 'rgba(236,72,153,0.15)', fg: '#ec4899' },
  { bg: 'rgba(249,115,22,0.15)', fg: '#f97316' },
  { bg: 'rgba(20,184,166,0.15)', fg: '#14b8a6' },
  { bg: 'rgba(168,85,247,0.15)', fg: '#a855f7' },
];

export default function CategoryBar({
  categories,
  active,
  onSelect,
}: {
  categories: string[];
  active: string;
  onSelect: (c: string) => void;
}) {
  const base = ['Barchasi', ...categories];
  // Uzluksiz aylanish illyuziyasi uchun ro'yxatni ikki marta takrorlaymiz
  const items = [...base, ...base];

  const trackRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef(0); // joriy siljish (px), transform orqali qo'llanadi — brauzer scrollLeft'iga bog'liq emas
  const drag = useRef({ active: false, startX: 0, startPos: 0, moved: false });
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  pausedRef.current = paused;

  function applyTransform() {
    const track = trackRef.current;
    if (track) track.style.transform = `translateX(${-posRef.current}px)`;
  }

  function wrap(half: number) {
    if (half <= 0) return;
    while (posRef.current >= half) posRef.current -= half;
    while (posRef.current < 0) posRef.current += half;
  }

  // Avtomatik silliq aylanish (GPU-accelerated transform, brauzer scroll-mexanizmiga bog'liq emas)
  useEffect(() => {
    let raf: number;
    let last = performance.now();
    const speedPerSec = 20; // px / soniya — kerak bo'lsa shu sonni o'zgartirib tezlik sozlanadi
    function tick(now: number) {
      const track = trackRef.current;
      const dt = now - last;
      last = now;
      if (track && !pausedRef.current && !drag.current.active) {
        posRef.current += (speedPerSec * dt) / 1000;
        wrap(track.scrollWidth / 2);
        applyTransform();
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [items.length]);

  function onWheel(e: React.WheelEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      posRef.current += e.deltaY;
      wrap(track.scrollWidth / 2);
      applyTransform();
      e.preventDefault();
    }
  }

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    drag.current = { active: true, startX: e.pageX, startPos: posRef.current, moved: false };
  }
  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    const track = trackRef.current;
    const dx = e.pageX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    posRef.current = drag.current.startPos - dx;
    if (track) { wrap(track.scrollWidth / 2); applyTransform(); }
  }
  function endDrag() { drag.current.active = false; }
  // Drag qilib sudralganda tugma bosilib ketmasligi uchun
  function onClickCapture(e: React.MouseEvent<HTMLDivElement>) {
    if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false; }
  }

  return (
    <div
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={() => { endDrag(); setPaused(false); }}
      onMouseEnter={() => setPaused(true)}
      onClickCapture={onClickCapture}
      style={{
        overflow: 'hidden', marginBottom: 28,
        cursor: 'grab', userSelect: 'none',
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex', gap: 6, width: 'max-content',
          paddingBottom: 10, willChange: 'transform',
        }}
      >
        {items.map((cat, i) => {
          const Icon = getCategoryIcon(cat);
          const isActive = active === cat;
          const color = PALETTE[i % PALETTE.length];
          return (
            <button
              key={cat + '-' + i}
              onClick={() => onSelect(cat)}
              title={cat}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                background: 'transparent', border: 'none', cursor: 'pointer',
                minWidth: 88, flexShrink: 0, padding: '4px 2px',
              }}
            >
              <span
                className="cat-icon"
                style={{
                  width: 64, height: 64, borderRadius: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive ? 'var(--accent)' : color.bg,
                  border: '1px solid ' + (isActive ? 'var(--accent)' : 'transparent'),
                  color: isActive ? '#ffffff' : color.fg,
                  boxShadow: isActive ? '0 8px 20px var(--accent-glow)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={26} strokeWidth={1.7} />
              </span>
              <span style={{
                fontSize: 12, lineHeight: 1.3, textAlign: 'center', maxWidth: 84,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--text)' : 'var(--text-muted)',
                fontFamily: "'Manrope', sans-serif",
              }}>{cat}</span>
            </button>
          );
        })}
      </div>

      <style>{`.cat-bar button:hover .cat-icon { transform: translateY(-3px); }`}</style>
    </div>
  );
}
