// app/(public)/informasi-publik/apbdes/[tahun]/page.tsx

import type {
  Metadata,
} from 'next';

import Link from 'next/link';

import {
  ArrowRight,
  CircleAlert,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  Landmark,
  ShieldCheck,
} from 'lucide-react';

import {
  notFound,
} from 'next/navigation';

import SidebarLayanan from '@/components/SidebarLayanan';
import SidebarTilikArkeji from '@/components/SidebarTilikArkeji';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  PilihanLayanan,
} from '@/types/layanan';

/* =========================================================
   CONFIG
========================================================= */

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

/* =========================================================
   TAHUN APBDES
========================================================= */

const DAFTAR_TAHUN = [
  2024,
  2025,
  2026,
] as const;

/* =========================================================
   DOKUMEN RESMI

   File:
   public/2024 PERKADES APBDES.pdf
   public/2025 PERKADES APBDES.pdf

   2026 belum tersedia.
========================================================= */

const DOKUMEN_APBDES:
  Record<
    number,
    {
      tersedia:
        boolean;

      file:
        string | null;

      nama:
        string;

      keterangan:
        string;
    }
  > = {
  2024: {
    tersedia:
      true,

    file:
      '/2024%20PERKADES%20APBDES.pdf',

    nama:
      'PERKADES APBDes Desa Keji Tahun 2024',

    keterangan:
      'Dokumen resmi Peraturan Kepala Desa terkait Anggaran Pendapatan dan Belanja Desa Keji Tahun Anggaran 2024.',
  },

  2025: {
    tersedia:
      true,

    file:
      '/2025%20PERKADES%20APBDES.pdf',

    nama:
      'PERKADES APBDes Desa Keji Tahun 2025',

    keterangan:
      'Dokumen resmi Peraturan Kepala Desa terkait Anggaran Pendapatan dan Belanja Desa Keji Tahun Anggaran 2025.',
  },

  2026: {
    tersedia:
      false,

    file:
      null,

    nama:
      'PERKADES APBDes Desa Keji Tahun 2026',

    keterangan:
      'Dokumen resmi APBDes Desa Keji Tahun Anggaran 2026 belum tersedia pada website.',
  },
};

/* =========================================================
   TYPES
========================================================= */

interface PageProps {
  params:
    Promise<{
      tahun:
        string;
    }>;
}

interface LayananRow {
  id:
    | number
    | string
    | null;

  nama:
    | string
    | null;

  slug:
    | string
    | null;
}

/* =========================================================
   HELPERS
========================================================= */

function safeString(
  value:
    unknown
) {
  return String(
    value ??
      ''
  ).trim();
}

function isValidTahun(
  tahun:
    number
) {
  return DAFTAR_TAHUN.includes(
    tahun as (
      typeof DAFTAR_TAHUN
    )[number]
  );
}

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
  params,
}: PageProps):
  Promise<Metadata> {
  const {
    tahun:
      tahunParam,
  } =
    await params;

  const tahun =
    Number(
      tahunParam
    );

  if (
    !isValidTahun(
      tahun
    )
  ) {
    return {
      title:
        'Dokumen APBDes Desa Keji | SIJI',

      description:
        'Dokumen resmi APBDes Pemerintah Desa Keji.',
    };
  }

  return {
    title:
      `Dokumen APBDes ${tahun} | SIJI Desa Keji`,

    description:
      `Dokumen resmi APBDes Desa Keji Tahun Anggaran ${tahun}.`,
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function ApbdesPublicPage({
  params,
}: PageProps) {
  const {
    tahun:
      tahunParam,
  } =
    await params;

  const tahun =
    Number(
      tahunParam
    );

  /* =======================================================
     VALIDASI
  ======================================================= */

  if (
    !/^\d{4}$/.test(
      tahunParam
    ) ||
    !isValidTahun(
      tahun
    )
  ) {
    notFound();
  }

  const dokumen =
    DOKUMEN_APBDES[
      tahun
    ];

  /* =======================================================
     SIDEBAR LAYANAN
  ======================================================= */

  const layananResult =
    await supabaseAdmin
      .from(
        'layanan'
      )
      .select(`
        id,
        nama,
        slug
      `)
      .eq(
        'aktif',
        true
      )
      .order(
        'urutan',
        {
          ascending:
            true,

          nullsFirst:
            false,
        }
      )
      .order(
        'nama',
        {
          ascending:
            true,
        }
      );

  if (
    layananResult.error
  ) {
    console.error(
      'Gagal mengambil layanan:',
      {
        message:
          layananResult
            .error
            .message,

        code:
          layananResult
            .error
            .code,

        details:
          layananResult
            .error
            .details,

        hint:
          layananResult
            .error
            .hint,
      }
    );
  }

  const daftarLayanan:
    PilihanLayanan[] =
    (
      (
        layananResult.data ??
        []
      ) as LayananRow[]
    )
      .map(
        (
          item
        ) => {
          const id =
            Number(
              item.id
            );

          const nama =
            safeString(
              item.nama
            );

          const slug =
            safeString(
              item.slug
            );

          return {
            id,
            nama,
            slug,
          };
        }
      )
      .filter(
        (
          item
        ) =>
          Number.isInteger(
            item.id
          ) &&
          item.id >
            0 &&
          item.nama.length >
            0 &&
          item.slug.length >
            0
      );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative isolate overflow-hidden bg-emerald-950 text-white">
        {/* BACKGROUND */}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/background.png')",
          }}
        />

        {/* OVERLAY */}

        <div className="absolute inset-0 bg-gradient-to-r from-[#021b16] via-emerald-950/95 to-emerald-800/65" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#021b16] via-transparent to-black/20" />

        {/* PATTERN */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,.55) 1px, transparent 1px)',

            backgroundSize:
              '28px 28px',
          }}
        />

        {/* DECORATION */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -top-28 h-[420px] w-[420px] rounded-full border-[70px] border-white/[0.035]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 left-1/4 h-[400px] w-[400px] rounded-full bg-emerald-300/[0.07] blur-[110px]"
        />

        {/* CONTENT */}

        <div className="relative mx-auto flex min-h-[480px] max-w-7xl items-center px-4 pb-24 pt-16 sm:px-6 md:pb-28 md:pt-20 lg:px-8">
          <div className="max-w-4xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur">
              <Landmark
                size={27}
              />
            </div>

            <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-300">
              Informasi Publik
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Dokumen APBDes{' '}
              {tahun}
            </h1>

            <p className="mt-6 max-w-3xl text-sm font-medium leading-8 text-emerald-50/85 sm:text-base">
              Dokumen resmi Anggaran
              Pendapatan dan Belanja
              Desa Keji Tahun
              Anggaran {tahun} sebagai
              bagian dari keterbukaan
              informasi Pemerintah
              Desa Keji.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <HeaderBadge>
                Tahun Anggaran{' '}
                {tahun}
              </HeaderBadge>

              <HeaderBadge>
                Dokumen Resmi
              </HeaderBadge>

              <HeaderBadge>
                {dokumen.tersedia
                  ? 'Tersedia'
                  : 'Belum Tersedia'}
              </HeaderBadge>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          NAVIGASI TAHUN
      ===================================================== */}

      <section className="relative z-20 -mt-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Navigasi tahun APBDes"
            className="flex flex-wrap gap-2 rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-xl sm:p-5"
          >
            {DAFTAR_TAHUN.map(
              (
                item
              ) => (
                <Link
                  key={
                    item
                  }
                  href={`/informasi-publik/apbdes/${item}`}
                  aria-current={
                    item ===
                    tahun
                      ? 'page'
                      : undefined
                  }
                  className={`inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-extrabold transition ${
                    item ===
                    tahun
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  APBDes{' '}
                  {item}
                </Link>
              )
            )}
          </nav>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="min-w-0 space-y-7">
            {/* ===============================================
                DOCUMENT INFO
            =============================================== */}

            <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-sm">
              <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-white p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-sm">
                    <FileCheck2
                      size={23}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                      Dokumen Resmi
                    </p>

                    <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
                      {dokumen.nama}
                    </h2>

                    <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-slate-500">
                      {
                        dokumen.keterangan
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* =============================================
                  AVAILABLE
              ============================================= */}

              {dokumen.tersedia &&
              dokumen.file ? (
                <>
                  {/* DOCUMENT ACTION */}

                  <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                    <a
                      href={
                        dokumen.file
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex min-h-[120px] items-center gap-4 rounded-2xl bg-emerald-700 p-5 text-white transition hover:bg-emerald-800"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                        <ExternalLink
                          size={22}
                        />
                      </div>

                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-200">
                          Buka Dokumen
                        </p>

                        <p className="mt-1 font-black">
                          Lihat PDF
                          APBDes{' '}
                          {tahun}
                        </p>
                      </div>

                      <ArrowRight
                        size={18}
                        className="ml-auto shrink-0 transition group-hover:translate-x-1"
                      />
                    </a>

                    <a
                      href={
                        dokumen.file
                      }
                      download
                      className="group flex min-h-[120px] items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900 transition hover:bg-emerald-100"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
                        <Download
                          size={22}
                        />
                      </div>

                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-600">
                          Unduh
                        </p>

                        <p className="mt-1 font-black">
                          Download PDF
                        </p>
                      </div>
                    </a>
                  </div>
                </>
              ) : (
                /* =============================================
                   DOCUMENT UNAVAILABLE
                ============================================= */

                <div className="p-6 sm:p-8">
                  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-amber-200 bg-amber-50 px-6 py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                      <CircleAlert
                        size={30}
                      />
                    </div>

                    <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-amber-700">
                      Dokumen Belum
                      Tersedia
                    </p>

                    <h3 className="mt-2 text-xl font-black text-slate-900">
                      APBDes{' '}
                      {tahun}
                    </h3>

                    <p className="mt-3 max-w-lg text-sm font-medium leading-7 text-slate-500">
                      Dokumen resmi
                      APBDes Desa Keji
                      Tahun Anggaran{' '}
                      {tahun} belum
                      tersedia pada
                      website. Dokumen
                      akan ditampilkan
                      setelah tersedia
                      dari Pemerintah
                      Desa Keji.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* ===============================================
                PDF PREVIEW
            =============================================== */}

            {dokumen.tersedia &&
              dokumen.file && (
                <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-white p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                        Pratinjau
                        Dokumen
                      </p>

                      <h2 className="mt-1 text-xl font-black text-slate-900">
                        PERKADES
                        APBDes{' '}
                        {tahun}
                      </h2>

                      <p className="mt-2 text-xs font-medium text-slate-500">
                        Dokumen dapat
                        dibaca langsung
                        pada halaman
                        berikut.
                      </p>
                    </div>

                    <a
                      href={
                        dokumen.file
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      <ExternalLink
                        size={14}
                      />

                      Buka Layar
                      Penuh
                    </a>
                  </div>

                  <div className="bg-slate-100 p-3 sm:p-5">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <iframe
                        src={
                          dokumen.file
                        }
                        title={`Dokumen APBDes Desa Keji Tahun ${tahun}`}
                        className="h-[650px] w-full sm:h-[800px] lg:h-[900px]"
                      />
                    </div>
                  </div>
                </section>
              )}

            {/* ===============================================
                TRANSPARENCY INFORMATION
            =============================================== */}

            <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-6 text-white shadow-xl sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,.5) 1px, transparent 1px)',

                  backgroundSize:
                    '24px 24px',
                }}
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[52px] border-white/[0.04]"
              />

              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-emerald-200">
                  <ShieldCheck
                    size={23}
                  />
                </div>

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                    Keterbukaan
                    Informasi
                  </p>

                  <h2 className="mt-2 text-xl font-black sm:text-2xl">
                    Dokumen Anggaran
                    Pemerintah Desa
                    Keji
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                    Publikasi dokumen
                    APBDes merupakan
                    bagian dari
                    keterbukaan
                    informasi
                    Pemerintah Desa
                    Keji kepada
                    masyarakat.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* =================================================
              SIDEBAR
              TIDAK STICKY
          ================================================= */}

          <aside className="min-w-0">
            <div className="flex flex-col gap-8">
              <SidebarLayanan
                daftarLayanan={
                  daftarLayanan
                }
                sticky={
                  false
                }
              />

              <SidebarTilikArkeji />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   HEADER BADGE
========================================================= */

function HeaderBadge({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold text-emerald-50 backdrop-blur">
      {children}
    </span>
  );
}