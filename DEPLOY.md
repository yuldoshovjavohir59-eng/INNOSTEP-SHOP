# 🚀 INNOSTEP SHOP — Deploy qilish yo'riqnomasi

## Kerakli narsalar (barchasi BEPUL)
- GitHub account — kod saqlash uchun
- Vercel account — hosting uchun (vercel.com)
- Supabase account — database uchun (supabase.com)

---

## 1-QADAM: Supabase database yaratish

1. **supabase.com** ga kiring → "Start your project"
2. Yangi project yarating (nom, parol yozing, region: Singapore)
3. Project tayyor bo'lgach (1-2 daqiqa):
   - Chap menyu → **Settings** → **Database**
   - Pastga tushing → **Connection string** bo'limi
   - **URI** tabini tanlang
   - Ikki URL ni ko'chirib oling:
     - `DATABASE_URL` → "Connection pooling" URL (port 6543)
     - `DIRECT_URL` → "Direct connection" URL (port 5432)

---

## 2-QADAM: GitHub ga yuklash

```bash
# Terminal oching, papka ichida:
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/SIZNING_USERNAME/innostep-shop.git
git push -u origin main
```

---

## 3-QADAM: Vercel ga deploy

1. **vercel.com** ga kiring → "Add New Project"
2. GitHub repo ni tanlang
3. **Environment Variables** qo'shing:
   ```
   DATABASE_URL = postgresql://... (6543 portli)
   DIRECT_URL   = postgresql://... (5432 portli)
   ```
4. **Deploy** bosing

---

## 4-QADAM: Database jadvalni yaratish

Deploy bo'lgach Vercel terminal yoki local da:

```bash
npm install
npx prisma db push
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

Yoki Vercel dashboard → Functions → Run:
```
npx prisma db push
```

---

## Natija

✅ Barcha brauzerlar bir xil data ko'radi
✅ Admin panel orqali lot qo'shilsa — hamma ko'radi
✅ Ko'rishlar va buyurtmalar haqiqiy hisoblanadi

## Admin panel
URL: `https://sizning-site.vercel.app/admin/login`
Parol: `admin123`

> ⚠️ Parolni o'zgartirish: `src/lib/api.ts` da `ADMIN_PASSWORD` ni o'zgartiring
