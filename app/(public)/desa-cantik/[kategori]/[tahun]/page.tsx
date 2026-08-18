// /// app/(public)/desa-cantik/[kategori]/[tahun]/page.tsx

import Link from 'next/link';

import {
  ArrowLeft,
  BarChart3,
  Clock3,
  Download,
  FileSpreadsheet,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  Users,
  type LucideIcon,
} from 'lucide-react';

import {
  notFound,
} from 'next/navigation';

import DesaCantikInfografisPopup from '@/components/public/DesaCantikInfografisPopup';

import DesaCantikKesehatan from '@/components/public/DesaCantikKesehatan';

import DesaCantikPendidikan from '@/components/public/DesaCantikPendidikan';

import DesaCantikPenduduk from '@/components/public/DesaCantikPenduduk';

import DesaCantikPenduduk2026 from '@/components/public/DesaCantikPenduduk2026';

import DesaCantikPerekonomian from '@/components/public/DesaCantikPerekonomian';

import DesaCantikPerumahan from '@/components/public/DesaCantikPerumahan';

import {
  getKategoriDesaCantik,
  isKategoriDesaCantik,
  isTahunDesaCantik,
} from '@/lib/desa-cantik';

import {
  getDesaCantikDataset,
} from '@/lib/desa-cantik-db';

import type {
  TabelKesehatan,
} from '@/lib/desa-cantik-kesehatan';

import type {
  TabelPendidikan,
} from '@/lib/desa-cantik-pendidikan';

import type {
  PendudukKelompokUmur2026,
} from '@/lib/desa-cantik-penduduk-2026';

import type {
  TabelPerekonomian,
} from '@/lib/desa-cantik-perekonomian';

import type {
  TabelPerumahan,
} from '@/lib/desa-cantik-perumahan';

import {
  KATEGORI_DESA_CANTIK,
  TAHUN_DESA_CANTIK,
  type KategoriDesaCantik,
  type PendudukKelompokUmur,
} from '@/types/desa-cantik';

/* =========================================================
   PAGE CONFIG
========================================================= */

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

/* =========================================================
   TYPES
========================================================= */

interface DesaCantikDetailPageProps {
  params: Promise<{
    kategori: string;
    tahun: string;
  }>;
}

/* =========================================================
   CATEGORY ICONS
========================================================= */

const ikonKategori:
  Record<
    KategoriDesaCantik,
    LucideIcon
  > = {
  penduduk:
    Users,

  pendidikan:
    GraduationCap,

  kesehatan:
    HeartPulse,

  perumahan:
    Home,

  perekonomian:
    Landmark,
};

/* =========================================================
   PAGE
========================================================= */

export default async function DesaCantikDetailPage({
  params,
}: DesaCantikDetailPageProps) {
  const {
    kategori:
      kategoriParam,

    tahun:
      tahunParam,
  } =
    await params;

  const tahun =
    Number(
      tahunParam
    );

  /* =======================================================
     VALIDATE ROUTE
  ======================================================= */

  if (
    !isKategoriDesaCantik(
      kategoriParam
    ) ||
    !Number.isInteger(
      tahun
    ) ||
    !isTahunDesaCantik(
      tahun
    )
  ) {
    notFound();
  }

  const kategoriAktif =
    getKategoriDesaCantik(
      kategoriParam
    );

  if (
    !kategoriAktif
  ) {
    notFound();
  }

  const Icon =
    ikonKategori[
      kategoriParam
    ];

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const dataset =
    await getDesaCantikDataset(
      kategoriParam,
      tahun,
      {
        /*
         * Data yang dinonaktifkan
         * admin tidak ditampilkan.
         */
        includeInactive:
          false,

        /*
         * Tetap gunakan data lama
         * sebagai fallback apabila
         * migrasi Supabase belum
         * selesai.
         */
        allowFallback:
          true,
      }
    );

  const rawData =
    dataset?.data ??
    [];

  const sumber =
    dataset?.sumber ||
    'Sumber data belum dicantumkan.';

  const hasData =
    rawData.length >
    0;

  const infografisUrl =
    dataset?.infografisUrl ??
    null;

  /* =======================================================
     CAST DATA CATEGORY
  ======================================================= */

  const dataPenduduk =
    rawData as
      PendudukKelompokUmur[];

  const dataPenduduk2026 =
    rawData as
      PendudukKelompokUmur2026[];

  const dataPendidikan =
    rawData as
      TabelPendidikan[];

  const dataKesehatan =
    rawData as
      TabelKesehatan[];

  const dataPerumahan =
    rawData as
      TabelPerumahan[];

  const dataPerekonomian =
    rawData as
      TabelPerekonomian[];

  /* =======================================================
     DISPLAY CONDITION
  ======================================================= */

  const tampilkanPenduduk2026 =
    kategoriParam ===
      'penduduk' &&
    tahun ===
      2026 &&
    hasData;

  const tampilkanPenduduk =
    kategoriParam ===
      'penduduk' &&
    tahun ===
      2025 &&
    hasData;

  const tampilkanPendidikan =
    kategoriParam ===
      'pendidikan' &&
    hasData;

  const tampilkanKesehatan =
    kategoriParam ===
      'kesehatan' &&
    hasData;

  const tampilkanPerumahan =
    kategoriParam ===
      'perumahan' &&
    hasData;

  const tampilkanPerekonomian =
    kategoriParam ===
      'perekonomian' &&
    hasData;

  /* =======================================================
     DOWNLOAD URL
  ======================================================= */

  const excelUrl =
    `/api/desa-cantik/${kategoriParam}/${tahun}/excel`;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* =================================================
            BACK
        ================================================= */}

        <Link
          href="/desa-cantik"
          className="mb-6 inline-flex items-center gap-2 text-sm font-extrabold text-emerald-700 transition hover:text-emerald-900"
        >
          <ArrowLeft
            size={17}
          />

          Kembali ke Desa Cantik
        </Link>

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 px-6 py-9 text-white shadow-xl md:px-10 md:py-12">
          {/* Decoration */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

          <div className="pointer-events-none absolute -bottom-28 right-24 h-72 w-72 rounded-full bg-emerald-400/20" />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,.7) 1px, transparent 1px)',

              backgroundSize:
                '25px 25px',
            }}
          />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            {/* LEFT */}

            <div>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm">
                  <Icon
                    size={29}
                  />
                </div>

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                    Desa Cantik Tahun{' '}
                    {tahun}
                  </p>

                  <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                    Data{' '}
                    {
                      kategoriAktif.nama
                    }
                  </h1>

                  <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-emerald-50 sm:text-base">
                    {
                      kategoriAktif.deskripsi
                    }
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-100">
                      Desa Keji
                    </span>

                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-100">
                      Tahun {tahun}
                    </span>

                    {infografisUrl && (
                      <span className="rounded-full border border-emerald-300/25 bg-emerald-300/15 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-100">
                        Infografis Tersedia
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* DOWNLOAD */}

            {hasData && (
              <a
                href={
                  excelUrl
                }
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50"
              >
                <FileSpreadsheet
                  size={18}
                />

                Download Excel

                <Download
                  size={15}
                />
              </a>
            )}
          </div>
        </section>

        {/* =================================================
            CATEGORY NAVIGATION
        ================================================= */}

        <nav className="mt-6 overflow-x-auto">
          <div className="flex min-w-max gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            {KATEGORI_DESA_CANTIK.map(
              (
                kategori
              ) => {
                const KategoriIcon =
                  ikonKategori[
                    kategori.slug
                  ];

                const isActive =
                  kategori.slug ===
                  kategoriParam;

                return (
                  <Link
                    key={
                      kategori.slug
                    }
                    href={`/desa-cantik/${kategori.slug}/${tahun}`}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold transition ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                    }`}
                  >
                    <KategoriIcon
                      size={16}
                    />

                    {
                      kategori.nama
                    }
                  </Link>
                );
              }
            )}
          </div>
        </nav>

        {/* =================================================
            YEAR NAVIGATION
        ================================================= */}

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          {/* YEAR */}

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Pilih Tahun:
            </span>

            {TAHUN_DESA_CANTIK.map(
              (
                pilihanTahun
              ) => (
                <Link
                  key={
                    pilihanTahun
                  }
                  href={`/desa-cantik/${kategoriParam}/${pilihanTahun}`}
                  className={`rounded-xl px-4 py-2 text-sm font-extrabold transition ${
                    pilihanTahun ===
                    tahun
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                >
                  {
                    pilihanTahun
                  }
                </Link>
              )
            )}
          </div>

          {/* EXCEL */}

          {hasData && (
            <a
              href={
                excelUrl
              }
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-100"
            >
              <FileSpreadsheet
                size={16}
              />

              Data{' '}
              {
                kategoriAktif.nama
              }{' '}
              {tahun}.xlsx
            </a>
          )}
        </div>

        {/* =================================================
            INFOGRAPHIC POPUP

            Tidak ada lagi gambar infografis panjang
            di halaman.

            Jika infografis tersedia:
            - popup otomatis terbuka
            - setelah ditutup muncul tombol
              "Lihat Infografis"
            - src berasal dari Supabase
        ================================================= */}

        {infografisUrl ? (
          <div className="mt-6">
            <DesaCantikInfografisPopup
              src={
                infografisUrl
              }
              title={`Infografis ${kategoriAktif.nama} Desa Keji Tahun ${tahun}`}
              alt={`Infografis ${kategoriAktif.nama} Desa Keji tahun ${tahun}`}
              triggerLabel="Lihat Infografis"
              autoOpen
            />
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-4">
            <p className="text-xs font-semibold leading-6 text-slate-500">
              Infografis{' '}
              {kategoriAktif.nama.toLowerCase()}{' '}
              tahun {tahun} belum
              tersedia. Data tabel,
              grafik, dan file Excel
              tetap dapat diakses.
            </p>
          </div>
        )}

        {/* =================================================
            MAIN DATA
        ================================================= */}

        <main className="mt-8 min-w-0 w-full">
          {/* ===============================================
              PENDUDUK 2026
          =============================================== */}

          {tampilkanPenduduk2026 ? (
            <DesaCantikPenduduk2026
              rows={
                dataPenduduk2026
              }
              tahun={
                tahun
              }
              sumber={
                sumber
              }
            />

          /* ===============================================
             PENDUDUK 2025
          =============================================== */

          ) : tampilkanPenduduk ? (
            <DesaCantikPenduduk
              rows={
                dataPenduduk
              }
              tahun={
                tahun
              }
              sumber={
                sumber
              }
            />

          /* ===============================================
             PENDIDIKAN
          =============================================== */

          ) : tampilkanPendidikan ? (
            <DesaCantikPendidikan
              data={
                dataPendidikan
              }
              tahun={
                tahun
              }
              sumber={
                sumber
              }
            />

          /* ===============================================
             KESEHATAN
          =============================================== */

          ) : tampilkanKesehatan ? (
            <DesaCantikKesehatan
              data={
                dataKesehatan
              }
              tahun={
                tahun
              }
              sumber={
                sumber
              }
            />

          /* ===============================================
             PERUMAHAN
          =============================================== */

          ) : tampilkanPerumahan ? (
            <DesaCantikPerumahan
              data={
                dataPerumahan
              }
              tahun={
                tahun
              }
              sumber={
                sumber
              }
            />

          /* ===============================================
             PEREKONOMIAN
          =============================================== */

          ) : tampilkanPerekonomian ? (
            <DesaCantikPerekonomian
              data={
                dataPerekonomian
              }
              tahun={
                tahun
              }
              sumber={
                sumber
              }
            />

          /* ===============================================
             EMPTY
          =============================================== */

          ) : (
            <section className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Clock3
                  size={31}
                />
              </div>

              <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                Data Tahun{' '}
                {tahun}
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Data{' '}
                {
                  kategoriAktif.nama
                }{' '}
                Belum Tersedia
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-7 text-slate-600">
                Data{' '}
                {kategoriAktif.nama.toLowerCase()}{' '}
                Desa Keji tahun{' '}
                {tahun} belum
                dipublikasikan melalui
                panel administrator.
              </p>

              <Link
                href="/desa-cantik"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-800"
              >
                <BarChart3
                  size={17}
                />

                Lihat Data Lainnya
              </Link>
            </section>
          )}
        </main>

        {/* =================================================
            SOURCE
        ================================================= */}

        {hasData && (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">
              Sumber Data
            </p>

            <p className="mt-2 text-xs font-medium leading-6 text-slate-500 sm:text-sm">
              {
                sumber
              }
            </p>
          </section>
        )}
      </div>
    </div>
  );
}