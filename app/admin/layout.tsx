// app/admin/layout.tsx

import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/server';
import AdminShell from '@/components/admin/AdminShell';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  const email =
    user.email ?? 'Email tidak tersedia';

  const metadataName =
    typeof user.user_metadata?.full_name ===
    'string'
      ? user.user_metadata.full_name.trim()
      : '';

  const displayName =
    metadataName || 'Admin';

  return (
    <AdminShell
      email={email}
      displayName={displayName}
    >
      {children}
    </AdminShell>
  );
}