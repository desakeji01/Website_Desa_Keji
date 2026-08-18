// app/admin/desa-cantik/[kategori]/[tahun]/page.tsx

import Link from 'next/link';

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Database,
  ExternalLink,
  FileSpreadsheet,
} from 'lucide-react';

import {
  notFound,
} from 'next/navigation';

import {
  migrasikanDataStatisDesaCantikAction,
} from '@/app/admin/desa-cantik/actions';

import DesaCantikDataEditor from '@/components/admin/desa-cantik/DesaCantikDataEditor';

import DesaCantikMediaForm from '@/components/admin/desa-cantik/DesaCantikMediaForm';

import {
  getKategoriDesaCantik,
  isKategoriDesaCantik,
  isTahunDesaCantik,
} from '@/lib/desa-cantik';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  DesaCantikAdminRecord,
} from '@/types/desa-cantik-admin';

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

interface PageProps {
  params:
    Promise<{
      kategori:
        string;

      tahun:
        string;
    }>;

  searchParams:
    Promise<{
      success?:
        string;

      error?:
        string;
    }>;
}

/* =========================================================
   PAGE
========================================================= */

export default async function AdminDesaCantikDetailPage({
  params,
  searchParams,
}: PageProps) {
  const [
    routeParams,
    queryParams,
  ] =
    await Promise.all([
      params,
      searchParams,
    ]);

  const {
    kategori,
    tahun:
      tahunParam,
  } =
    routeParams;

  const tahun =
    Number(
      tahunParam
    );

  if (
    !isKategoriDesaCantik(
      kategori
    ) ||
    !isTahunDesaCantik(
      tahun
    )
  ) {
    notFound();
  }

  const kategoriInfo =
    getKategoriDesaCantik(
      kategori
    );

  if (
    !kategoriInfo
  ) {
    notFound();
  }

  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from(
        'desa_cantik_data'
      )
      .select(`
        id,
        kategori,
        tahun,
        sumber,
        data,
        infografis_url,
        infografis_path,
        aktif,
        created_at,
        updated_at
      `)
      .eq(
        'kategori',
        kategori
      )
      .eq(
        'tahun',
        tahun
      )
      .maybeSingle();

  if (error) {
    console.error(
      'Data admin Desa Cantik gagal dimuat:',
      {
        message:
          error.message,

        code:
          error.code,

        details:
          error.details,

        hint:
          error.hint,
      }
    );
  }

  const record =
    data as
      | DesaCantikAdminRecord
      | null;

  const statistikData =
    Array.isArray(
      record?.data
    )
      ? record.data
      : [];

  return (
    <div className="space-y-7">
      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin/desa-cantik"
          className="inline-flex items-center gap-2 text-sm font-extrabold text-emerald-700 hover:text-emerald-900"
        >
          <ArrowLeft
            size={17}
          />

          Kembali ke Desa Cantik
        </Link>

        <div className="flex flex-wrap gap-2">
          {statistikData.length >
            0 && (
            <a
              href={`/api/desa-cantik/${kategori}/${tahun}/excel`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-100"
            >
              <FileSpreadsheet
                size={15}
              />

              Unduh Excel
            </a>
          )}

          <a
            href={`/desa-cantik/${kategori}/${tahun}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-50"
          >
            Lihat Halaman Publik

            <ExternalLink
              size={15}
            />
          </a>
        </div>
      </div>

      {/* =====================================================
          MESSAGES
      ===================================================== */}

      {queryParams.success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle2
            size={19}
            className="mt-0.5 shrink-0"
          />

          <p className="text-sm font-semibold leading-6">
            {
              queryParams.success
            }
          </p>
        </div>
      )}

      {queryParams.error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <p className="text-sm font-semibold leading-6">
            {
              queryParams.error
            }
          </p>
        </div>
      )}

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-950 via-emerald-800 to-emerald-700 p-6 text-white shadow-lg md:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,.6) 1px, transparent 1px)',

            backgroundSize:
              '24px 24px',
          }}
        />

        <div className="relative">
          <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-200">
            Desa Cantik Tahun{' '}
            {tahun}
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Kelola{' '}
            {
              kategoriInfo.nama
            }
          </h1>

          <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-emerald-50">
            Kelola sumber data,
            infografis, angka
            statistik, status
            publikasi, dan export
            Excel kategori{' '}
            {kategoriInfo.nama.toLowerCase()}{' '}
            tahun {tahun}.
          </p>
        </div>
      </section>

      {/* =====================================================
          MIGRATION
      ===================================================== */}

      {statistikData.length ===
        0 && (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white">
                <Database
                  size={23}
                />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-700">
                  Migrasi Awal
                </p>

                <h2 className="mt-1 text-lg font-black text-amber-950">
                  Data angka belum
                  tersimpan di Supabase
                </h2>

                <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-amber-800">
                  Tekan tombol ini
                  sekali untuk
                  memindahkan seluruh
                  data Desa Cantik
                  tahun 2025 dan 2026
                  dari file TypeScript
                  lama ke database
                  Supabase. Data yang
                  sudah ada tidak akan
                  ditimpa.
                </p>
              </div>
            </div>

            <form
              action={
                migrasikanDataStatisDesaCantikAction
              }
            >
              <input
                type="hidden"
                name="return_kategori"
                value={
                  kategori
                }
              />

              <input
                type="hidden"
                name="return_tahun"
                value={
                  tahun
                }
              />

              <button
                type="submit"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 text-sm font-extrabold text-white transition hover:bg-amber-700 lg:w-auto"
              >
                <Database
                  size={17}
                />

                Migrasikan Semua Data
              </button>
            </form>
          </div>
        </section>
      )}

      {/* =====================================================
          MEDIA
      ===================================================== */}

      <DesaCantikMediaForm
        kategori={
          kategori
        }
        namaKategori={
          kategoriInfo.nama
        }
        tahun={
          tahun
        }
        sumber={
          record?.sumber ??
          ''
        }
        infografisUrl={
          record
            ?.infografis_url ??
          null
        }
        aktif={
          record?.aktif ??
          true
        }
      />

      {/* =====================================================
          DATA EDITOR
      ===================================================== */}

      <DesaCantikDataEditor
        kategori={
          kategori
        }
        namaKategori={
          kategoriInfo.nama
        }
        tahun={
          tahun
        }
        data={
          statistikData
        }
      />
    </div>
  );
}