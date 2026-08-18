// app/admin/berita/[id]/edit/page.tsx

import Link from 'next/link';

import {
  notFound,
} from 'next/navigation';

import {
  ArrowLeft,
  FilePenLine,
} from 'lucide-react';

import BeritaForm from '@/components/admin/BeritaForm';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import {
  updateBeritaAction,
} from '@/app/admin/berita/actions';

import type {
  BeritaFormInitialData,
  KategoriBerita,
  StatusBerita,
} from '@/types/berita';

export const dynamic = 'force-dynamic';

interface EditBeritaPageProps {
  params: Promise<{
    id: string;
  }>;
}

const daftarKategori: KategoriBerita[] = [
  'Berita Desa',
  'PPID',
  'Laporan Anggaran',
];

function parseKategori(
  value: string | null
): KategoriBerita {
  if (
    value &&
    daftarKategori.includes(
      value as KategoriBerita
    )
  ) {
    return value as KategoriBerita;
  }

  return 'Berita Desa';
}

function parseStatus(
  value: string | null
): StatusBerita {
  return value === 'published'
    ? 'published'
    : 'draft';
}

export default async function EditBeritaPage({
  params,
}: EditBeritaPageProps) {
  const {
    id: rawId,
  } = await params;

  const id = Number(rawId);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    notFound();
  }

  const {
    data: berita,
    error,
  } = await supabaseAdmin
    .from('berita')
    .select(`
      id,
      judul,
      kategori,
      kutipan,
      konten,
      penulis,
      status,
      gambar_url
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error(
      'Gagal mengambil berita untuk diedit:',
      error.message
    );

    notFound();
  }

  if (!berita) {
    notFound();
  }

  const initialData: BeritaFormInitialData = {
    judul:
      berita.judul ?? '',

    kategori:
      parseKategori(
        berita.kategori
      ),

    kutipan:
      berita.kutipan ?? '',

    konten:
      berita.konten ?? '',

    penulis:
      berita.penulis ??
      'Admin Desa',

    status:
      parseStatus(
        berita.status
      ),

    gambar_url:
      berita.gambar_url ?? null,
  };

  /*
   * Mengikat ID berita ke Server Action.
   * Hasilnya akan menjadi action:
   * (previousState, formData) => Promise
   */
  const updateAction =
    updateBeritaAction.bind(
      null,
      id
    );

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-50" />

        <div className="pointer-events-none absolute bottom-0 right-36 h-24 w-24 rounded-t-full bg-emerald-50/50" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-900/20">
              <FilePenLine
                size={22}
                strokeWidth={2.2}
              />
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-600">
                Publikasi Desa
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Edit Berita
              </h1>

              <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
                Perbarui judul, isi, gambar,
                kategori, penulis, dan status
                publikasi berita.
              </p>
            </div>
          </div>

          <Link
            href="/admin/berita"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-600 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <ArrowLeft size={16} />
            Kembali
          </Link>
        </div>
      </section>

      {/* Form Edit */}
      <BeritaForm
        action={updateAction}
        initialData={initialData}
        submitLabel="Simpan Perubahan"
      />
    </div>
  );
}