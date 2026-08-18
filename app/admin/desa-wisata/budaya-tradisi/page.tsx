// app/admin/desa-wisata/budaya-tradisi/page.tsx

import {
  Landmark,
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
  hapusBudayaAction,
  tambahBudayaAction,
  toggleBudayaAction,
  ubahBudayaAction,
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

export default async function AdminBudayaTradisiPage({
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
          'desa_wisata_budaya'
        )
        .select(`
          id,
          nama,
          kategori,
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
      'Gagal mengambil budaya dan tradisi:',
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
          'Budaya & Tradisi',

        description:
          'Kelola budaya, tradisi, kesenian, dan kuliner lokal Desa Keji beserta foto dan status publikasinya.',

        publicHref:
          '/desa-wisata/budaya-tradisi',

        nameLabel:
          'Nama Budaya / Kesenian / Kuliner',

        categoryLabel:
          'Kategori',

        itemName:
          'Budaya & Tradisi',

        icon:
          Landmark,
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
          ? 'Data budaya dan tradisi gagal dimuat.'
          : undefined
      }
      addAction={
        tambahBudayaAction
      }
      updateAction={
        ubahBudayaAction
      }
      toggleAction={
        toggleBudayaAction
      }
      deleteAction={
        hapusBudayaAction
      }
    />
  );
}