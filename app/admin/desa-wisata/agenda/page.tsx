// app/admin/desa-wisata/agenda/page.tsx

import {
  CalendarDays,
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
  hapusAgendaAction,
  tambahAgendaAction,
  toggleAgendaAction,
  ubahAgendaAction,
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

export default async function AdminAgendaPage({
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
          'desa_wisata_agenda'
        )
        .select(`
          id,
          nama,
          kategori,
          jadwal,
          tanggal,
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
      'Gagal mengambil agenda wisata:',
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
          'Agenda Wisata',

        description:
          'Kelola kegiatan, kategori, jadwal, tanggal, lokasi, deskripsi, poster atau foto, status publikasi, dan urutan agenda.',

        publicHref:
          '/desa-wisata/agenda',

        nameLabel:
          'Nama Kegiatan',

        categoryLabel:
          'Kategori',

        itemName:
          'Agenda Wisata',

        icon:
          CalendarDays,

        showLocation:
          true,

        showSchedule:
          true,

        showDate:
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
          ? 'Data agenda wisata gagal dimuat.'
          : undefined
      }
      addAction={
        tambahAgendaAction
      }
      updateAction={
        ubahAgendaAction
      }
      toggleAction={
        toggleAgendaAction
      }
      deleteAction={
        hapusAgendaAction
      }
    />
  );
}