import Link from 'next/link';

import {
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

import {
  notFound,
} from 'next/navigation';

import DesaCantikPublikasiForm from '@/components/admin/desa-cantik/DesaCantikPublikasiForm';

import {
  isTahunDesaCantik,
} from '@/lib/desa-cantik';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  DesaCantikPublikasiRecord,
} from '@/types/desa-cantik-admin';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

interface PageProps {
  params: Promise<{
    tahun: string;
  }>;
}

export default async function AdminPublikasiDesaCantikPage({
  params,
}: PageProps) {
  const {
    tahun: tahunParam,
  } = await params;

  const tahun =
    Number(tahunParam);

  if (
    !isTahunDesaCantik(
      tahun
    )
  ) {
    notFound();
  }

  const {
    data,
    error,
  } = await supabaseAdmin
    .from(
      'desa_cantik_publikasi'
    )
    .select(`
      id,
      tahun,
      judul,
      deskripsi,
      pdf_url,
      pdf_path,
      aktif,
      created_at,
      updated_at
    `)
    .eq(
      'tahun',
      tahun
    )
    .maybeSingle();

  if (error) {
    console.error(
      'Publikasi Desa Cantik gagal dimuat:',
      error
    );
  }

  const publication =
    data as
      | DesaCantikPublikasiRecord
      | null;

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin/desa-cantik"
          className="inline-flex items-center gap-2 text-sm font-extrabold text-emerald-700 hover:text-emerald-900"
        >
          <ArrowLeft size={17} />
          Kembali ke Desa Cantik
        </Link>

        {publication?.pdf_url ? (
          <a
            href={
              publication.pdf_url
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-50"
          >
            Buka PDF Saat Ini
            <ExternalLink size={15} />
          </a>
        ) : null}
      </div>

      <section className="rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-800 to-emerald-700 p-6 text-white shadow-lg md:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-200">
          Dokumen Statistik Desa
        </p>

        <h1 className="mt-3 text-3xl font-black">
          Publikasi Desa Keji {tahun}
        </h1>

        <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-emerald-50">
          Kelola judul, deskripsi, dokumen PDF, dan status publikasi
          Desa Keji Dalam Angka tahun {tahun}.
        </p>
      </section>

      <DesaCantikPublikasiForm
        tahun={tahun}
        judul={
          publication?.judul ??
          `Publikasi Desa Keji Dalam Angka Tahun ${tahun}`
        }
        deskripsi={
          publication?.deskripsi ??
          ''
        }
        pdfUrl={
          publication?.pdf_url ??
          null
        }
        aktif={
          publication?.aktif ??
          true
        }
      />
    </div>
  );
}