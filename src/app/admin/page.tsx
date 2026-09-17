'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/store';

export default function AdminPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace(isAdminLoggedIn() ? '/admin/lots' : '/admin/login');
  }, [router]);
  return null;
}
