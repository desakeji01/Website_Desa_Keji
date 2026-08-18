// app/admin/desa-wisata/destinasi/page.tsx

import {
  Compass,
} from 'lucide-react';

import AdminWisataCrud from '@/components/admin/desa-wisata/AdminWisataCrud';

import {
  normalizeWisataAdminRow,
  type WisataAdminItem,
} from '@/lib/desa-wisata-admin';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import {
  hapusDestinasiAction,
  tambahDestinasiAction,
  toggleDestinasiAction,
  ubahDestinasiAction,
} from './actions';

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

interface PageProps {
  searchParams:
    Promise<{
      success?: string;
      error?: string;
    }>;
}

export default async function AdminDestinasiPage({
  searchParams,
}: PageProps) {
  const [
    params,
    result,
  ] =
    await Promise.all([
      searchParams,

      supabaseAdmin
        .from(
          'desa_wisata_destinasi'
        )
        .select(`
          id,
          nama,
          kategori,
          lokasi,
          deskripsi,
          gambar_url,
          gambar_path,
          aktif,
          urutan,
          created_at,
          updated_at
        `)
        .order(
          'urutan',
          {
            ascending:
              true,
          }
        )
        .order(
          'created_at',
          {
            ascending:
              false,
          }
        ),
    ]);

  if (
    result.error
  ) {
    console.error(
      'Gagal mengambil destinasi:',
      result.error
    );
  }

  const items:
    WisataAdminItem[] =
    (
      result.data ??
      []
    )
      .map(
        normalizeWisataAdminRow
      )
      .filter(
        (
          item
        ): item is WisataAdminItem =>
          item !== null
      );

  return (
    <AdminWisataCrud
      config={{
        eyebrow:
          'Desa Wisata',

        title:
          'Destinasi & Potensi',

        description:
          'Kelola nama destinasi atau potensi, kategori, lokasi, deskripsi, foto, status publikasi, dan urutan tampilan.',

        publicHref:
          '/desa-wisata/destinasi',

        nameLabel:
          'Nama Destinasi / Potensi',

        categoryLabel:
          'Kategori',

        itemName:
          'Destinasi / Potensi',

        icon:
          Compass,

        showLocation:
          true,
      }}
      items={
        items
      }
      success={
        params.success
      }
      error={
        params.error
      }
      loadError={
        result.error
          ? 'Data destinasi gagal dimuat. Pastikan tabel desa_wisata_destinasi sudah dibuat.'
          : undefined
      }
      addAction={
        tambahDestinasiAction
      }
      updateAction={
        ubahDestinasiAction
      }
      toggleAction={
        toggleDestinasiAction
      }
      deleteAction={
        hapusDestinasiAction
      }
    />
  );
}