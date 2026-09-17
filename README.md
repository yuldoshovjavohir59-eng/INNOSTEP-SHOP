# 🛍️ Kansler Shop — Next.js + TypeScript

Premium mahsulotlar katalogi. Faqat reklama uchun — buyurtmalar Cooperation saytiga yo'naltiriladi.

---

## 📁 Loyiha tuzilmasi

```
src/
├── app/
│   ├── home/page.tsx          → Bosh sahifa (hero + lotlar grid)
│   ├── lots/page.tsx          → Barcha lotlar + filter/search
│   ├── lot/[id]/page.tsx      → Lot detail: narx, xarakteristika, miqdor, buyurtma
│   ├── admin/
│   │   ├── login/page.tsx     → SMS orqali kirish
│   │   ├── lots/page.tsx      → Lotlar boshqaruvi (CRUD + statistika)
│   │   └── lot-new/page.tsx   → Yangi lot qo'shish formasi
│   ├── globals.css            → Design tokens, utility classes
│   └── layout.tsx             → Root layout
├── components/
│   ├── layout/Navbar.tsx      → Sticky navigation
│   └── lot/LotCard.tsx        → Lot card komponenti
├── lib/data.ts                → Mock data + formatPrice helper
└── types/index.ts             → TypeScript interfeyslari
```

---

## 🚀 Ishga tushirish

```bash
npm install
npm run dev
# http://localhost:3000
```

---

## 🔗 Sahifalar

| URL | Maqsad |
|-----|--------|
| `/` | `/home` ga redirect |
| `/home` | Bosh sahifa |
| `/lots` | Barcha lotlar katalogi |
| `/lot/[id]` | Lot detail + buyurtma tugmasi |
| `/admin/login` | SMS login |
| `/admin/lots` | Admin: lotlar + statistika |
| `/admin/lot-new` | Admin: yangi lot qo'shish |

---

## 🏗️ Arxitektura

### 1. Lot Detail → Cooperation
Har bir lotda `cooperationLink` maydoni bor.
"Buyurtma berish" bosilganda → `window.open(lot.cooperationLink, '_blank')`.
Foydalanuvchi kerakli miqdorni saytda belgilaydi, keyin Cooperation saytida rasmiylashtiriladi.

### 2. Narx sinxronizatsiyasi (TODO: backendda)
```ts
// Har 6 soatda bir cooperation saytidan narxni scraping
// GET /api/sync-prices → lot.cooperationPrice yangilanadi
// Agar cooperationPrice !== lot.price → front-endda ko'rsatiladi
```

### 3. SMS Login
```ts
// POST /api/auth/send-sms   → { phone } → SMS yuboradi (Eskiz/PlayMobile)
// POST /api/auth/verify-sms → { phone, code } → JWT token qaytaradi
// Admin middleware: token tekshiradi
```

### 4. Analytics (TODO)
```ts
// Har bir lotni ochganda → POST /api/analytics/view { lotId }
// "Buyurtma berish" bosilganda → POST /api/analytics/click { lotId }
// Admin dashboard → GET /api/analytics/summary
```

### 5. API Routes (TODO)
```
GET    /api/lots           → Barcha aktiv lotlar
POST   /api/lots           → Yangi lot (admin)
PUT    /api/lots/[id]      → Lotni yangilash (admin)
DELETE /api/lots/[id]      → Lotni o'chirish (admin)
POST   /api/auth/send-sms  → SMS yuborish
POST   /api/auth/verify-sms → SMS tasdiqlash
GET    /api/analytics/summary → Dashboard statistika
```

---

## 📦 Database (Prisma + PostgreSQL yoki SQLite)

```prisma
model Lot {
  id               String   @id @default(cuid())
  title            String
  description      String
  price            Int
  category         String
  images           String[] // JSON array of URLs
  characteristics  Json     // [{ key, value }]
  cooperationLink  String
  cooperationPrice Int?
  minOrder         Int      @default(1)
  maxOrder         Int      @default(100)
  stock            Int      @default(0)
  isActive         Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  analytics        Analytics[]
}

model Analytics {
  id        String   @id @default(cuid())
  lotId     String
  lot       Lot      @relation(fields: [lotId], references: [id])
  type      String   // "view" | "click"
  createdAt DateTime @default(now())
}
```

---

## 🎨 Design System

CSS variables (`globals.css`):
- `--bg`, `--bg-card`, `--bg-elevated` → background hierarchy
- `--accent` (#6c63ff) → asosiy rang
- `--gold` (#f5c842) → narx, CTA
- `--text`, `--text-muted`, `--text-dim` → typography

Utility classes: `.card`, `.btn-primary`, `.btn-gold`, `.btn-outline`, `.input`, `.badge-*`

Shriftlar: **Unbounded** (headings) + **Manrope** (body)
