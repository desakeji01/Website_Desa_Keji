// app/admin/layanan/[id]/edit/page.tsx

import {
  notFound,
} from 'next/navigation';

import {
  PencilLine,
} from 'lucide-react';

import LayananForm from '@/components/admin/LayananForm';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  LayananAdminData,
} from '@/types/admin-layanan';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface LayananRow {
  id: number;
  nama: string;
  slug: string;
  deskripsi: string | null;
  aktif: boolean;
  urutan: number | null;
}

interface PersyaratanRow {
  persyaratan: string;
  urutan: number;
}

export default async function EditLayananPage({
  params,
}: PageProps) {
  const {
    id: idParam,
  } =
    await params;

  const id =
    Number(idParam);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    notFound();
  }

  const [
    layananResult,
    persyaratanResult,
  ] =
    await Promise.all([
      supabaseAdmin
        .from('layanan')
        .select(`
          id,
          nama,
          slug,
          deskripsi,
          aktif,
          urutan
        `)
        .eq('id', id)
        .maybeSingle(),

      supabaseAdmin
        .from(
          'persyaratan_layanan'
        )
        .select(`
          persyaratan,
          urutan
        `)
        .eq(
          'layanan_id',
          id
        )
        .order(
          'urutan',
          {
            ascending: true,
          }
        ),
    ]);

  if (
    layananResult.error
  ) {
    console.error(
      'Gagal mengambil layanan:',
      layananResult.error
    );

    notFound();
  }

  if (
    !layananResult.data
  ) {
    notFound();
  }

  if (
    persyaratanResult.error
  ) {
    console.error(
      'Gagal mengambil persyaratan layanan:',
      persyaratanResult.error
    );
  }

  const layananRow =
    layananResult.data as LayananRow;

  const persyaratanRows =
    (
      persyaratanResult.data ??
      []
    ) as PersyaratanRow[];

  const layanan:
    LayananAdminData = {
    id:
      Number(
        layananRow.id
      ),

    nama:
      layananRow.nama,

    slug:
      layananRow.slug,

    deskripsi:
      layananRow.deskripsi ??
      '',

    aktif:
      layananRow.aktif,

    urutan:
      layananRow.urutan ??
      1,

    persyaratan:
      persyaratanRows.map(
        (item) =>
          item.persyaratan
      ),
  };

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] px-6 py-7 text-white shadow-xl sm:px-8 sm:py-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.13) 1.5px, transparent 1.5px)',
            backgroundSize:
              '26px 26px',
          }}
        />

        <div className="relative flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <PencilLine
              size={26}
            />
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
              Layanan Desa
            </p>

            <h1 className="mt-2 text-2xl font-black sm:text-3xl">
              Edit Layanan
            </h1>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-emerald-50/80">
              Perbarui informasi, status, urutan, dan persyaratan untuk layanan {layanan.nama}.
            </p>
          </div>
        </div>
      </section>

      <LayananForm
        mode="edit"
        layanan={
          layanan
        }
      />
    </div>
  );
}