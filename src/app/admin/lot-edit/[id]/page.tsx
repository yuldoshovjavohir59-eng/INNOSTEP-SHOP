'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Plus, Upload, Link as LinkIcon } from 'lucide-react';
import { apiGetLot, apiUpdateLot, apiUploadImage, isAdminLoggedIn } from '@/lib/api';
import { Characteristic, Lot } from '@/types';
import AdminSidebar from '@/components/admin/AdminSidebar';
import CategorySelect from '@/components/admin/CategorySelect';

export default function AdminLotEditPage() {
  const params = useParams();
  const router = useRouter();
  const [lot, setLot] = useState<Lot | null>(null);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [minOrder, setMinOrder] = useState('1');
  const [maxOrder, setMaxOrder] = useState('100');
  const [stock, setStock] = useState('0');
  const [cooperationLink, setCooperationLink] = useState('');
  const [images, setImages] = useState<string[]>(['']);
  const [chars, setChars] = useState<Characteristic[]>([{ key: '', value: '' }]);
  const [uploading, setUploading] = useState<number | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push('/admin/login'); return; }
    apiGetLot(params.id as string).then((existing) => {
      if (existing) {
        setLot(existing); setTitle(existing.title); setDescription(existing.description);
        setPrice(String(existing.price)); setCategory(existing.category);
        setMinOrder(String(existing.minOrder)); setMaxOrder(String(existing.maxOrder));
        setStock(String(existing.stock)); setCooperationLink(existing.cooperationLink);
        setImages(existing.images.length ? existing.images : ['']);
        setChars(existing.characteristics.length ? existing.characteristics : [{ key: '', value: '' }]);
      }
    });
  }, [params.id, router]);

  function addImage() { setImages([...images, '']); }
  function removeImage(i: number) { setImages(images.filter((_, idx) => idx !== i)); }
  function setImage(i: number, val: string) { setImages(images.map((img, idx) => idx === i ? val : img)); }
  function addChar() { setChars([...chars, { key: '', value: '' }]); }
  function removeChar(i: number) { setChars(chars.filter((_, idx) => idx !== i)); }
  function setChar(i: number, field: 'key' | 'value', val: string) { setChars(chars.map((c, idx) => idx === i ? { ...c, [field]: val } : c)); }

  async function handleFileUpload(i: number, file: File) {
    setUploading(i);
    const url = await apiUploadImage(file);
    if (url) setImage(i, url);
    setUploading(null);
  }

  async function handleSave() {
    if (!lot) return;
    if (!title || !price) { alert("Nomi va Narxini kiriting"); return; }
    setSaving(true);
    await apiUpdateLot({ ...lot, title, description, price: parseInt(price) || 0, category, minOrder: parseInt(minOrder) || 1, maxOrder: parseInt(maxOrder) || 100, stock: parseInt(stock) || 0, cooperationLink, images: images.filter(Boolean), characteristics: chars.filter((c) => c.key && c.value), updatedAt: new Date().toISOString() });
    await new Promise((r) => setTimeout(r, 300));
    setSaving(false);
    router.push('/admin/lots');
  }

  const lbl = (text: string) => (
    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 8 }}>{text}</label>
  );

  if (!lot) return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: 40, textAlign: 'center' }}><p style={{ color: 'var(--text-muted)' }}>Yuklanmoqda...</p></main>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main className="admin-main-content" style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ maxWidth: 720 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <Link href="/admin/lots"><button className="btn-outline" style={{ padding: '8px 12px' }}><ArrowLeft size={16} /></button></Link>
            <div>
              <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Lotni tahrirlash</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>{lot.title}</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Asosiy ma'lumotlar</h3>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>{lbl('Nomi')}<input className="input" value={title} onChange={e => setTitle(e.target.value)} /></div>
                <div>{lbl('Tavsif')}<textarea className="input" value={description} onChange={e => setDescription(e.target.value)} style={{ minHeight: 90, resize: 'vertical' }} /></div>
                <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>{lbl('Narxi (UZS)')}<input className="input" type="number" value={price} onChange={e => setPrice(e.target.value)} /></div>
                  <div>{lbl('Kategoriya')}<CategorySelect value={category} onChange={setCategory} /></div>
                </div>
                <div className="form-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                  <div>{lbl('Omborda')}<input className="input" type="number" value={stock} onChange={e => setStock(e.target.value)} /></div>
                  <div>{lbl('Min')}<input className="input" type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)} /></div>
                  <div>{lbl('Max')}<input className="input" type="number" value={maxOrder} onChange={e => setMaxOrder(e.target.value)} /></div>
                </div>
                <div>{lbl('Cooperation link')}<input className="input" value={cooperationLink} onChange={e => setCooperationLink(e.target.value)} /></div>
              </div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700 }}>Rasmlar</h3>
                <button className="btn-outline" style={{ padding: '6px 12px', fontSize: 13 }} onClick={addImage}><Plus size={13} /> Qo'shish</button>
              </div>
              {images.map((img, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    {img && <img src={img} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)', flexShrink: 0 }} onError={e => (e.currentTarget.style.display = 'none')} />}
                    <input className="input" value={img.startsWith('data:') ? '' : img} onChange={e => setImage(i, e.target.value)} placeholder="https://..." />
                    {images.length > 1 && <button className="btn-outline" style={{ padding: '8px', flexShrink: 0 }} onClick={() => removeImage(i)}><Trash2 size={13} /></button>}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input ref={el => { fileRefs.current[i] = el; }} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(i, f); }} />
                    <button className="btn-outline" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => fileRefs.current[i]?.click()}>
                      <Upload size={13} /> {uploading === i ? 'Yuklanmoqda...' : 'Fayl yuklash'}
                    </button>
                    {img.startsWith('data:') && <span style={{ fontSize: 11, color: 'var(--success)' }}>✓ Fayl yuklandi</span>}
                    {img && !img.startsWith('data:') && <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><LinkIcon size={10} /> URL</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700 }}>Xarakteristikalar</h3>
                <button className="btn-outline" style={{ padding: '6px 12px', fontSize: 13 }} onClick={addChar}><Plus size={13} /> Qo'shish</button>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 10 }}>
                Ikkala katak ham (Xususiyat va Qiymati) to'ldirilsa saqlanadi. Faqat bittasi to'ldirilgan qator saqlanmaydi.
              </p>
              {chars.map((c, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, marginBottom: 8 }}>
                  <input className="input" value={c.key} onChange={e => setChar(i, 'key', e.target.value)} placeholder="Xususiyat" />
                  <input className="input" value={c.value} onChange={e => setChar(i, 'value', e.target.value)} placeholder="Qiymati" style={{ borderColor: c.key && !c.value ? 'var(--gold)' : undefined }} />
                  {chars.length > 1 && <button className="btn-outline" style={{ padding: '8px' }} onClick={() => removeChar(i)}><Trash2 size={13} /></button>}
                </div>
              ))}
            </div>

            <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ alignSelf: 'flex-start', fontSize: 15, padding: '12px 28px' }}>
              <Save size={16} /> {saving ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </div>
      </main>
      <style>{`
        @media (max-width: 768px) { .admin-main-content { padding: 72px 14px 24px !important; } }
      `}</style>
    </div>
  );
}
