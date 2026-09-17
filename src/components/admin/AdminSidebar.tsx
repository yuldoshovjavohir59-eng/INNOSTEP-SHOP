'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Package, Plus, LogOut, Zap, Menu, X, BarChart2 } from 'lucide-react';
import { adminLogout } from '@/lib/api';

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    adminLogout();
    router.push('/admin/login');
  }

  const navItems = [
    { href: '/admin/lots', icon: <Package size={16} />, label: 'Lotlar' },
    { href: '/admin/lot-new', icon: <Plus size={16} />, label: 'Yangi lot' },
    { href: '/admin/stats', icon: <BarChart2 size={16} />, label: 'Statistika' },
  ];

  const SidebarContent = () => (
    <>
      <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent), #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={14} color="white" fill="white" />
          </div>
          <span className="font-display" style={{ fontSize: 14, fontWeight: 700 }}>Admin Panel</span>
        </div>
      </div>
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }} onClick={() => setOpen(false)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, color: pathname === item.href ? 'white' : 'var(--text)', fontSize: 14, fontWeight: 500, background: pathname === item.href ? 'var(--accent)' : 'var(--bg-elevated)', marginBottom: 4, transition: 'background 0.2s' }}>
              <span style={{ color: pathname === item.href ? 'white' : 'var(--accent)' }}>{item.icon}</span>
              {item.label}
            </div>
          </Link>
        ))}
      </nav>
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button className="btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '8px 12px' }}>Saytga qaytish</button>
        </Link>
        <button className="btn-outline" onClick={handleLogout} style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '8px 12px', color: 'var(--danger)', borderColor: 'var(--danger)' }}>
          <LogOut size={14} /> Chiqish
        </button>
      </div>
    </>
  );

  return (
    <>
      <div style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '12px 16px', alignItems: 'center', justifyContent: 'space-between' }} className="admin-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, var(--accent), #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={12} color="white" fill="white" />
          </div>
          <span className="font-display" style={{ fontSize: 13, fontWeight: 700 }}>Admin Panel</span>
        </div>
        <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: 4 }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && <div onClick={() => setOpen(false)} style={{ display: 'none', position: 'fixed', inset: 0, zIndex: 150, background: 'rgba(0,0,0,0.5)' }} className="admin-overlay" />}
      <aside style={{ width: 260, background: 'var(--bg-card)', borderRight: '1px solid var(--border)', padding: '24px 0', display: 'none', flexDirection: 'column', position: 'fixed', top: 0, left: open ? 0 : -260, bottom: 0, zIndex: 200, transition: 'left 0.3s' }} className="admin-drawer">
        <SidebarContent />
      </aside>
      <aside style={{ width: 240, background: 'var(--bg-card)', borderRight: '1px solid var(--border)', padding: '24px 0', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }} className="admin-sidebar-desktop">
        <SidebarContent />
      </aside>
      <style>{`
        @media (max-width: 768px) {
          .admin-topbar { display: flex !important; }
          .admin-drawer { display: flex !important; }
          .admin-overlay { display: block !important; }
          .admin-sidebar-desktop { display: none !important; }
          .admin-main-content { padding-top: 56px !important; }
        }
      `}</style>
    </>
  );
}
