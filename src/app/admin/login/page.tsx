'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, Zap, Eye, EyeOff } from 'lucide-react';
import { adminLogin } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!password) { setError("Parolni kiriting"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    if (adminLogin(password)) {
      router.push('/admin/lots');
    } else {
      setError("Noto'g'ri parol");
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
      background: 'radial-gradient(ellipse at center, rgba(108,99,255,0.08) 0%, var(--bg) 60%)',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 32px var(--accent-glow)',
          }}>
            <Zap size={28} color="white" fill="white" />
          </div>
          <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700 }}>LUXURY-MARKET SHOP</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>Admin Panel</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(108,99,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent)',
            }}>
              <Lock size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Kirish</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Admin parolini kiriting</p>
            </div>
          </div>

          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
            PAROL
          </label>

          {/* Password field with eye toggle */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <input
              className="input"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              autoComplete="new-password"
              style={{ paddingRight: 44 }}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-dim)', display: 'flex', alignItems: 'center',
                padding: 4,
              }}
              title={showPass ? "Yashirish" : "Ko'rish"}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              ⚠️ {error}
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Kirilmoqda...' : <>Kirish <ArrowRight size={16} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
