// ===== LOT TYPES =====
export interface Lot {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  characteristics: Characteristic[];
  cooperationLink: string;    // Cooperation sayitga havola
  cooperationPrice?: number;  // Cooperation dagi narx (avtomatik sinxron)
  stock: number;
  minOrder: number;
  maxOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Characteristic {
  key: string;
  value: string;
}

// ===== ORDER TYPES =====
export interface Order {
  id: string;
  lotId: string;
  lotTitle: string;
  quantity: number;
  totalPrice: number;
  customerPhone: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

// ===== AUTH TYPES =====
export interface AdminUser {
  id: string;
  phone: string;
  name: string;
  role: 'admin' | 'superadmin';
}

export interface SMSVerification {
  phone: string;
  code: string;
  expiresAt: number;
}

// ===== STATS =====
export interface Analytics {
  lotId: string;
  views: number;
  clicks: number;   // "Buyurtma berish" bosilgani
  date: string;
}

export interface DashboardStats {
  totalLots: number;
  activeLots: number;
  totalViews: number;
  totalClicks: number;
  topLots: { lotId: string; title: string; views: number; clicks: number }[];
}
