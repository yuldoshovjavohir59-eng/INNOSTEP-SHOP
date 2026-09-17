import { Lot, DashboardStats } from '@/types';

// ===== MOCK LOTS DATA =====
export const mockLots: Lot[] = [
  {
    id: '1',
    title: 'Samsung Galaxy S24 Ultra',
    description: 'Eng yangi Samsung Galaxy S24 Ultra smartfoni. 200MP kamera, AI funksiyalari, titanium korpus.',
    price: 12500000,
    currency: 'UZS',
    category: 'Elektronika',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600',
    ],
    characteristics: [
      { key: 'Ekran', value: '6.8" Dynamic AMOLED' },
      { key: 'Protsessor', value: 'Snapdragon 8 Gen 3' },
      { key: 'RAM', value: '12 GB' },
      { key: 'Xotira', value: '256 GB' },
      { key: 'Batareya', value: '5000 mAh' },
      { key: 'Kamera', value: '200 MP' },
    ],
    cooperationLink: 'https://cooperation.uz/product/samsung-s24-ultra',
    cooperationPrice: 12200000,
    stock: 50,
    minOrder: 1,
    maxOrder: 10,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'MacBook Pro M3 Pro',
    description: 'Apple MacBook Pro 14" M3 Pro chip bilan. Professional ishlar uchun eng kuchli noutbuk.',
    price: 45000000,
    currency: 'UZS',
    category: 'Kompyuter',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
      'https://images.unsplash.com/photo-1611186871525-4c47c9b18c5c?w=600',
    ],
    characteristics: [
      { key: 'Chip', value: 'Apple M3 Pro' },
      { key: 'RAM', value: '18 GB Unified Memory' },
      { key: 'SSD', value: '512 GB' },
      { key: 'Ekran', value: '14.2" Liquid Retina XDR' },
      { key: 'Batareya', value: '18 soatgacha' },
      { key: 'Ranglar', value: 'Space Black, Silver' },
    ],
    cooperationLink: 'https://cooperation.uz/product/macbook-pro-m3',
    cooperationPrice: 44500000,
    stock: 20,
    minOrder: 1,
    maxOrder: 5,
    isActive: true,
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: '3',
    title: 'Sony WH-1000XM5',
    description: 'Sony ning eng yaxshi noise-cancelling quloqchinlari. 30 soat batareya, premium ovoz sifati.',
    price: 4200000,
    currency: 'UZS',
    category: 'Audio',
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600',
    ],
    characteristics: [
      { key: 'Noise Cancelling', value: 'Industry-leading ANC' },
      { key: 'Batareya', value: '30 soat' },
      { key: 'Bluetooth', value: '5.2' },
      { key: 'Vazni', value: '250g' },
      { key: 'Mikrofon', value: '8 ta built-in' },
    ],
    cooperationLink: 'https://cooperation.uz/product/sony-wh1000xm5',
    cooperationPrice: 4100000,
    stock: 100,
    minOrder: 1,
    maxOrder: 20,
    isActive: true,
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
];

export const mockStats: DashboardStats = {
  totalLots: 3,
  activeLots: 3,
  totalViews: 1247,
  totalClicks: 89,
  topLots: [
    { lotId: '1', title: 'Samsung Galaxy S24 Ultra', views: 520, clicks: 41 },
    { lotId: '2', title: 'MacBook Pro M3 Pro', views: 480, clicks: 32 },
    { lotId: '3', title: 'Sony WH-1000XM5', views: 247, clicks: 16 },
  ],
};

// ===== HELPERS =====
export function formatPrice(price: number, currency = 'UZS'): string {
  if (currency === 'UZS') {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
