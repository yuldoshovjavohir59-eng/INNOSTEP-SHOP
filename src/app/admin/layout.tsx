import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — Kansler Shop',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
