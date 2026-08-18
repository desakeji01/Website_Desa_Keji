// app/(public)/desa-cantik/[kategori]/page.tsx

import {
  notFound,
  redirect,
} from 'next/navigation';

import {
  isKategoriDesaCantik,
} from '@/lib/desa-cantik';

interface DesaCantikKategoriPageProps {
  params: Promise<{
    kategori: string;
  }>;
}

export default async function DesaCantikKategoriPage({
  params,
}: DesaCantikKategoriPageProps) {
  const {
    kategori,
  } = await params;

  if (
    !isKategoriDesaCantik(
      kategori
    )
  ) {
    notFound();
  }

  redirect(
    `/desa-cantik/${kategori}/2025`
  );
}