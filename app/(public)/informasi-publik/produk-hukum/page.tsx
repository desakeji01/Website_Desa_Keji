// app/(public)/informasi-publik/produk-hukum/page.tsx

import type {
  Metadata,
} from 'next';

import Link from 'next/link';

import {
  CalendarDays,
  Download,
  Eye,
  FileSearch,
  FileText,
  Filter,
  Scale,
  Search,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

import {
  redirect,
} from 'next/navigation';

import BukuPanduanWebsite from '@/components/BukuPanduanWebsite';
import SidebarLayanan from '@/components/SidebarLayanan';
import SidebarTilikArkeji from '@/components/SidebarTilikArkeji';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  PilihanLayanan,
} from '@/types/layanan';

import type {
  ProdukHukum,
} from '@/types/produk-hukum';

/* =========================================================
   METADATA
========================================================= */

export const metadata:
  Metadata = {
  title:
    'Produk Hukum Desa Keji | SIJI',

  description:
    'Daftar peraturan, keputusan, dan dokumen hukum resmi Pemerintah Desa Keji.',
};

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

/* =========================================================
   TYPES
========================================================= */

interface PageProps {
  searchParams: Promise<{
    q?: string;
    tahun?: string;
    jenis?: string;
    page?: string;
    limit?: string;
  }>;
}

interface ProdukHukumMetadata {
  tahun:
    | number
    | string
    | null;

  jenis:
    | string
    | null;
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
   CONFIG
========================================================= */

const DEFAULT_LIMIT =
  10;

const ALLOWED_LIMITS = [
  5,
  10,
  20,
  50,
];

/* =========================================================
   HELPERS
========================================================= */

function safeString(
  value: unknown
) {
  return String(
    value ?? ''
  ).trim();
}

function sanitizeSearch(
  value: string
) {
  return value
    .normalize('NFKC')
    .replace(
      /[^\p{L}\p{N}\s\-/]/gu,
      ' '
    )
    .replace(
      /\s+/g,
      ' '
    )
    .trim()
    .slice(
      0,
      100
    );
}

function sanitizeJenis(
  value: string
) {
  return value
    .normalize('NFKC')
    .replace(
      /[^\p{L}\p{N}\s\-_/]/gu,
      ''
    )
    .trim()
    .slice(
      0,
      100
    );
}

function parsePositiveInteger(
  value:
    | string
    | undefined,
  fallback: number
) {
  const number =
    Number(value);

  if (
    !Number.isInteger(
      number
    ) ||
    number < 1
  ) {
    return fallback;
  }

  return number;
}

function getSafeDocumentUrl(
  value: unknown
) {
  const url =
    safeString(
      value
    );

  if (!url) {
    return null;
  }

  try {
    const parsedUrl =
      new URL(
        url
      );

    if (
      parsedUrl.protocol !==
        'https:' &&
      parsedUrl.protocol !==
        'http:'
    ) {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
}

function formatTanggal(
  value:
    | string
    | null
) {
  if (!value) {
    return '-';
  }

  const date =
    new Date(
      `${value}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return '-';
  }

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day:
        '2-digit',

      month:
        'long',

      year:
        'numeric',

      timeZone:
        'Asia/Jakarta',
    }
  ).format(
    date
  );
}

function formatAngka(
  value: number
) {
  return new Intl.NumberFormat(
    'id-ID'
  ).format(
    Number.isFinite(
      value
    )
      ? value
      : 0
  );
}

/* =========================================================
   URL PAGINATION
========================================================= */

function buildPageUrl({
  q,
  tahun,
  jenis,
  limit,
  page,
}: {
  q: string;
  tahun: string;
  jenis: string;
  limit: number;
  page: number;
}) {
  const params =
    new URLSearchParams();

  if (q) {
    params.set(
      'q',
      q
    );
  }

  if (tahun) {
    params.set(
      'tahun',
      tahun
    );
  }

  if (jenis) {
    params.set(
      'jenis',
      jenis
    );
  }

  params.set(
    'limit',
    String(
      limit
    )
  );

  params.set(
    'page',
    String(
      page
    )
  );

  return `/informasi-publik/produk-hukum?${params.toString()}`;
}

/* =========================================================
   PAGINATION ITEMS
========================================================= */

function getPaginationItems(
  currentPage: number,
  totalPages: number
) {
  const items:
    (
      | number
      | 'ellipsis'
    )[] = [];

  for (
    let page = 1;
    page <= totalPages;
    page += 1
  ) {
    const shouldShow =
      page === 1 ||
      page ===
        totalPages ||
      Math.abs(
        page -
          currentPage
      ) <= 1;

    if (
      !shouldShow
    ) {
      continue;
    }

    const previousItem =
      items[
        items.length -
          1
      ];

    if (
      typeof previousItem ===
        'number' &&
      page -
        previousItem >
        1
    ) {
      items.push(
        'ellipsis'
      );
    }

    items.push(
      page
    );
  }

  return items;
}

/* =========================================================
   PAGE
========================================================= */

export default async function ProdukHukumPage({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;

  /* =======================================================
     SEARCH PARAMS
  ======================================================= */

  const q =
    sanitizeSearch(
      params.q ??
        ''
    );

  const tahunRaw =
    safeString(
      params.tahun
    );

  const tahun =
    /^\d{4}$/.test(
      tahunRaw
    )
      ? tahunRaw
      : '';

  const jenis =
    sanitizeJenis(
      params.jenis ??
        ''
    );

  const page =
    parsePositiveInteger(
      params.page,
      1
    );

  const requestedLimit =
    parsePositiveInteger(
      params.limit,
      DEFAULT_LIMIT
    );

  const limit =
    ALLOWED_LIMITS.includes(
      requestedLimit
    )
      ? requestedLimit
      : DEFAULT_LIMIT;

  const from =
    (page - 1) *
    limit;

  const to =
    from +
    limit -
    1;

  /* =======================================================
     QUERY PRODUK HUKUM
  ======================================================= */

  let produkQuery =
    supabaseAdmin
      .from(
        'produk_hukum'
      )
      .select(
        `
          id,
          judul,
          nomor,
          jenis,
          tahun,
          tanggal_penetapan,
          deskripsi,
          file_url,
          file_path,
          aktif,
          created_at,
          updated_at
        `,
        {
          count:
            'exact',
        }
      )
      .eq(
        'aktif',
        true
      );

  if (q) {
    produkQuery =
      produkQuery.ilike(
        'judul',
        `%${q}%`
      );
  }

  if (tahun) {
    produkQuery =
      produkQuery.eq(
        'tahun',
        Number(
          tahun
        )
      );
  }

  if (jenis) {
    produkQuery =
      produkQuery.eq(
        'jenis',
        jenis
      );
  }

  produkQuery =
    produkQuery
      .order(
        'tahun',
        {
          ascending:
            false,
        }
      )
      .order(
        'created_at',
        {
          ascending:
            false,
        }
      )
      .range(
        from,
        to
      );

  /* =======================================================
     FETCH DATA
  ======================================================= */

  const [
    produkResult,
    metadataResult,
    layananResult,
  ] =
    await Promise.all([
      produkQuery,

      supabaseAdmin
        .from(
          'produk_hukum'
        )
        .select(`
          tahun,
          jenis
        `)
        .eq(
          'aktif',
          true
        ),

      supabaseAdmin
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
        ),
    ]);

  /* =======================================================
     ERROR HANDLING
  ======================================================= */

  if (
    produkResult.error
  ) {
    console.error(
      'Gagal mengambil produk hukum:',
      {
        message:
          produkResult
            .error
            .message,

        code:
          produkResult
            .error
            .code,

        details:
          produkResult
            .error
            .details,

        hint:
          produkResult
            .error
            .hint,
      }
    );
  }

  if (
    metadataResult.error
  ) {
    console.error(
      'Gagal mengambil filter produk hukum:',
      {
        message:
          metadataResult
            .error
            .message,

        code:
          metadataResult
            .error
            .code,

        details:
          metadataResult
            .error
            .details,

        hint:
          metadataResult
            .error
            .hint,
      }
    );
  }

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

  /* =======================================================
     PRODUK HUKUM
  ======================================================= */

  const daftarProdukHukum =
    (
      produkResult.data ??
      []
    ) as ProdukHukum[];

  const totalData =
    Number(
      produkResult.count ??
        0
    );

  const totalPages =
    Math.max(
      Math.ceil(
        totalData /
          limit
      ),
      1
    );

  /* =======================================================
     REDIRECT PAGE INVALID
  ======================================================= */

  if (
    page >
    totalPages
  ) {
    redirect(
      buildPageUrl({
        q,
        tahun,
        jenis,
        limit,

        page:
          totalPages,
      })
    );
  }

  /* =======================================================
     METADATA FILTER
  ======================================================= */

  const metadata =
    (
      metadataResult.data ??
      []
    ) as ProdukHukumMetadata[];

  const daftarTahun = [
    ...new Set(
      metadata
        .map(
          (item) =>
            Number(
              item.tahun
            )
        )
        .filter(
          (item) =>
            Number.isInteger(
              item
            ) &&
            item >=
              1900 &&
            item <=
              2200
        )
    ),
  ].sort(
    (
      first,
      second
    ) =>
      second -
      first
  );

  const daftarJenis = [
    ...new Set(
      metadata
        .map(
          (item) =>
            safeString(
              item.jenis
            )
        )
        .filter(
          Boolean
        )
    ),
  ].sort(
    (
      first,
      second
    ) =>
      first.localeCompare(
        second,
        'id-ID'
      )
  );

  /* =======================================================
     LAYANAN SIDEBAR
  ======================================================= */

  const daftarLayanan:
    PilihanLayanan[] =
    (
      (
        layananResult.data ??
        []
      ) as LayananRow[]
    )
      .map(
        (item) => {
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
        (item) =>
          Number.isInteger(
            item.id
          ) &&
          item.id >
            0 &&
          item.nama
            .length >
            0 &&
          item.slug
            .length >
            0
      );

  /* =======================================================
     PAGE INFO
  ======================================================= */

  const hasActiveFilter =
    Boolean(
      q ||
        tahun ||
        jenis
    );

  const startEntry =
    totalData ===
    0
      ? 0
      : from + 1;

  const endEntry =
    Math.min(
      from +
        daftarProdukHukum
          .length,
      totalData
    );

  const paginationItems =
    getPaginationItems(
      page,
      totalPages
    );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ===================================================
            HEADER HALAMAN
        =================================================== */}

        <header className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 px-6 py-8 text-white shadow-lg sm:px-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',

              backgroundSize:
                '25px 25px',
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[52px] border-white/[0.04]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-emerald-400/[0.06] blur-2xl"
          />

          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <Scale
                size={24}
              />
            </div>

            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
              Informasi Publik
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Produk Hukum
            </h1>

            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80 sm:text-base">
              Daftar peraturan,
              keputusan, dan dokumen
              hukum resmi Pemerintah
              Desa Keji yang dapat
              diakses oleh masyarakat.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <HeaderBadge
                label={`${formatAngka(
                  totalData
                )} dokumen`}
              />

              <HeaderBadge
                label={`${formatAngka(
                  daftarTahun.length
                )} tahun data`}
              />

              <HeaderBadge
                label={`${formatAngka(
                  daftarJenis.length
                )} jenis dokumen`}
              />
            </div>
          </div>
        </header>

        {/* ===================================================
            MAIN GRID
        =================================================== */}

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* =================================================
              KONTEN UTAMA
          ================================================= */}

          <main className="min-w-0 space-y-7 lg:w-2/3">
            {/* ===============================================
                BUKU PANDUAN WEBSITE
            =============================================== */}

            <BukuPanduanWebsite />

            {/* ===============================================
                INFORMASI PENCARIAN
            =============================================== */}

            <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
                  <FileSearch
                    size={21}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Pencarian Dokumen
                  </p>

                  <h2 className="mt-1 font-black text-emerald-950">
                    Dokumen Hukum Desa
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-emerald-800">
                    Gunakan filter
                    tahun, jenis
                    dokumen, atau kata
                    kunci judul untuk
                    menemukan produk
                    hukum yang
                    dibutuhkan.
                  </p>
                </div>
              </div>
            </section>

            {/* ===============================================
                FILTER
            =============================================== */}

            <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
              <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
                    <Filter
                      size={21}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                      Penyaringan Data
                    </p>

                    <h2 className="mt-1 text-lg font-black text-slate-900">
                      Filter Produk
                      Hukum
                    </h2>

                    <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                      Pilih tahun,
                      jenis, atau
                      masukkan judul
                      dokumen.
                    </p>
                  </div>
                </div>
              </div>

              <form
                action="/informasi-publik/produk-hukum"
                className="grid gap-4 p-5 sm:p-6 md:grid-cols-2"
              >
                {/* TAHUN */}

                <FilterField
                  label="Tahun"
                  htmlFor="tahun"
                >
                  <select
                    id="tahun"
                    name="tahun"
                    defaultValue={
                      tahun
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">
                      Semua Tahun
                    </option>

                    {daftarTahun.map(
                      (item) => (
                        <option
                          key={
                            item
                          }
                          value={
                            item
                          }
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </FilterField>

                {/* JENIS */}

                <FilterField
                  label="Jenis Dokumen"
                  htmlFor="jenis"
                >
                  <select
                    id="jenis"
                    name="jenis"
                    defaultValue={
                      jenis
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">
                      Semua Jenis
                    </option>

                    {daftarJenis.map(
                      (item) => (
                        <option
                          key={
                            item
                          }
                          value={
                            item
                          }
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </FilterField>

                {/* SEARCH */}

                <div className="md:col-span-2">
                  <FilterField
                    label="Pencarian Judul"
                    htmlFor="q"
                  >
                    <div className="relative">
                      <Search
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="q"
                        name="q"
                        type="search"
                        defaultValue={
                          q
                        }
                        placeholder="Cari judul produk hukum..."
                        autoComplete="off"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                  </FilterField>
                </div>

                <input
                  type="hidden"
                  name="limit"
                  value={
                    limit
                  }
                />

                {/* BUTTON */}

                <div className="flex flex-col gap-3 sm:flex-row md:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white transition hover:bg-emerald-800"
                  >
                    <Search
                      size={17}
                    />

                    Terapkan Filter
                  </button>

                  {hasActiveFilter && (
                    <Link
                      href="/informasi-publik/produk-hukum"
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-200 bg-white px-5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
                    >
                      Reset Filter
                    </Link>
                  )}
                </div>
              </form>
            </section>

            {/* ===============================================
                DAFTAR DOKUMEN
            =============================================== */}

            <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
              {/* Header daftar */}

              <div className="flex flex-col gap-4 border-b border-emerald-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Arsip Dokumen
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-900">
                    Daftar Produk
                    Hukum
                  </h2>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Menampilkan{' '}

                    {formatAngka(
                      startEntry
                    )}

                    –

                    {formatAngka(
                      endEntry
                    )}{' '}

                    dari{' '}

                    {formatAngka(
                      totalData
                    )}{' '}

                    dokumen
                  </p>
                </div>

                {/* Limit */}

                <form className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="text-xs font-semibold">
                    Tampilkan
                  </span>

                  <select
                    name="limit"
                    defaultValue={String(
                      limit
                    )}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500"
                  >
                    {ALLOWED_LIMITS.map(
                      (item) => (
                        <option
                          key={
                            item
                          }
                          value={
                            item
                          }
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>

                  <span className="text-xs font-semibold">
                    entri
                  </span>

                  {q && (
                    <input
                      type="hidden"
                      name="q"
                      value={
                        q
                      }
                    />
                  )}

                  {tahun && (
                    <input
                      type="hidden"
                      name="tahun"
                      value={
                        tahun
                      }
                    />
                  )}

                  {jenis && (
                    <input
                      type="hidden"
                      name="jenis"
                      value={
                        jenis
                      }
                    />
                  )}

                  <button
                    type="submit"
                    className="rounded-lg bg-emerald-100 px-3 py-2 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-200"
                  >
                    Terapkan
                  </button>
                </form>
              </div>

              {/* =============================================
                  EMPTY / DATA
              ============================================= */}

              {daftarProdukHukum.length ===
              0 ? (
                <EmptyState
                  hasFilter={
                    hasActiveFilter
                  }
                />
              ) : (
                <>
                  {/* =========================================
                      MOBILE
                  ========================================= */}

                  <div className="divide-y divide-emerald-100 md:hidden">
                    {daftarProdukHukum.map(
                      (
                        item,
                        index
                      ) => (
                        <ProdukHukumMobileCard
                          key={
                            item.id
                          }
                          item={
                            item
                          }
                          nomor={
                            from +
                            index +
                            1
                          }
                        />
                      )
                    )}
                  </div>

                  {/* =========================================
                      DESKTOP
                  ========================================= */}

                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[820px] border-collapse text-left">
                      <thead>
                        <tr className="bg-emerald-950 text-white">
                          <th
                            scope="col"
                            className="w-[70px] px-4 py-4 text-center text-xs font-extrabold uppercase tracking-wider"
                          >
                            No
                          </th>

                          <th
                            scope="col"
                            className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider"
                          >
                            Produk
                            Hukum
                          </th>

                          <th
                            scope="col"
                            className="w-[180px] px-4 py-4 text-xs font-extrabold uppercase tracking-wider"
                          >
                            Jenis
                          </th>

                          <th
                            scope="col"
                            className="w-[90px] px-4 py-4 text-center text-xs font-extrabold uppercase tracking-wider"
                          >
                            Tahun
                          </th>

                          <th
                            scope="col"
                            className="w-[150px] px-4 py-4 text-center text-xs font-extrabold uppercase tracking-wider"
                          >
                            Aksi
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-200">
                        {daftarProdukHukum.map(
                          (
                            item,
                            index
                          ) => (
                            <ProdukHukumTableRow
                              key={
                                item.id
                              }
                              item={
                                item
                              }
                              nomor={
                                from +
                                index +
                                1
                              }
                            />
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* =============================================
                  PAGINATION
              ============================================= */}

              {totalPages >
                1 && (
                <Pagination
                  q={
                    q
                  }
                  tahun={
                    tahun
                  }
                  jenis={
                    jenis
                  }
                  limit={
                    limit
                  }
                  page={
                    page
                  }
                  totalPages={
                    totalPages
                  }
                  items={
                    paginationItems
                  }
                />
              )}
            </section>

            {/* ===============================================
                CATATAN
            =============================================== */}

            <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <ShieldCheck
                    size={21}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Informasi Dokumen
                  </p>

                  <h2 className="mt-1 font-black text-slate-900">
                    Dokumen Resmi
                    Pemerintah Desa
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                    Dokumen yang
                    ditampilkan
                    merupakan produk
                    hukum yang telah
                    diaktifkan dan
                    dipublikasikan
                    melalui halaman
                    administrator
                    website Desa Keji.
                  </p>
                </div>
              </div>
            </section>
          </main>

          {/* =================================================
              SIDEBAR KANAN
          ================================================= */}

          <aside className="min-w-0 lg:w-1/3">
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
      </div>
    </div>
  );
}

/* =========================================================
   HEADER BADGE
========================================================= */

function HeaderBadge({
  label,
}: {
  label:
    string;
}) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-emerald-50 backdrop-blur">
      {label}
    </span>
  );
}

/* =========================================================
   FILTER FIELD
========================================================= */

function FilterField({
  label,
  htmlFor,
  children,
}: {
  label:
    string;

  htmlFor:
    string;

  children:
    React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={
          htmlFor
        }
        className="mb-2 block text-sm font-bold text-slate-700"
      >
        {label}
      </label>

      {children}
    </div>
  );
}

/* =========================================================
   TABLE ROW
========================================================= */

function ProdukHukumTableRow({
  item,
  nomor,
}: {
  item:
    ProdukHukum;

  nomor:
    number;
}) {
  const fileUrl =
    getSafeDocumentUrl(
      item.file_url
    );

  return (
    <tr className="transition odd:bg-white even:bg-slate-50/80 hover:bg-emerald-50/70">
      {/* NO */}

      <td className="px-4 py-4 text-center text-sm font-semibold text-slate-500">
        {nomor}
      </td>

      {/* PRODUK HUKUM */}

      <td className="px-5 py-4">
        <p className="font-bold leading-7 text-slate-900">
          {item.judul}
        </p>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-400">
          <span>
            {safeString(
              item.nomor
            ) ||
              'Nomor tidak dicantumkan'}
          </span>

          {item.tanggal_penetapan && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays
                size={13}
              />

              {formatTanggal(
                item.tanggal_penetapan
              )}
            </span>
          )}
        </div>
      </td>

      {/* JENIS */}

      <td className="px-4 py-4">
        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
          {item.jenis}
        </span>
      </td>

      {/* TAHUN */}

      <td className="px-4 py-4 text-center text-sm font-black text-slate-700">
        {item.tahun}
      </td>

      {/* AKSI */}

      <td className="px-4 py-4">
        <DocumentActions
          fileUrl={
            fileUrl
          }
        />
      </td>
    </tr>
  );
}

/* =========================================================
   MOBILE CARD
========================================================= */

function ProdukHukumMobileCard({
  item,
  nomor,
}: {
  item:
    ProdukHukum;

  nomor:
    number;
}) {
  const fileUrl =
    getSafeDocumentUrl(
      item.file_url
    );

  return (
    <article className="p-5">
      <div className="flex items-start gap-4">
        {/* Nomor */}

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm font-black text-emerald-700">
          {nomor}
        </div>

        <div className="min-w-0 flex-1">
          {/* Jenis */}

          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold text-emerald-700">
            {item.jenis}
          </span>

          {/* Judul */}

          <h3 className="mt-3 font-black leading-7 text-slate-900">
            {item.judul}
          </h3>

          {/* Nomor Dokumen */}

          <p className="mt-2 text-xs font-semibold text-slate-500">
            {safeString(
              item.nomor
            ) ||
              'Nomor tidak dicantumkan'}
          </p>

          {/* Metadata */}

          <div className="mt-2 flex flex-wrap gap-3 text-xs font-medium text-slate-400">
            <span>
              Tahun{' '}
              {item.tahun}
            </span>

            {item.tanggal_penetapan && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays
                  size={13}
                />

                {formatTanggal(
                  item.tanggal_penetapan
                )}
              </span>
            )}
          </div>

          {/* Action */}

          <div className="mt-4">
            <DocumentActions
              fileUrl={
                fileUrl
              }
            />
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   DOCUMENT ACTIONS
========================================================= */

function DocumentActions({
  fileUrl,
}: {
  fileUrl:
    | string
    | null;
}) {
  if (
    !fileUrl
  ) {
    return (
      <div className="flex justify-center">
        <span className="inline-flex min-h-10 items-center justify-center rounded-xl bg-slate-100 px-3 text-xs font-bold text-slate-400">
          File tidak tersedia
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {/* LIHAT */}

      <a
        href={
          fileUrl
        }
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 text-xs font-extrabold text-white transition hover:bg-emerald-800"
      >
        <Eye
          size={15}
        />

        Lihat
      </a>

      {/* DOWNLOAD */}

      <a
        href={
          fileUrl
        }
        download
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-white text-emerald-700 transition hover:bg-emerald-50"
        title="Unduh dokumen"
        aria-label="Unduh dokumen"
      >
        <Download
          size={16}
        />
      </a>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  hasFilter,
}: {
  hasFilter:
    boolean;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-300">
        <FileText
          size={34}
        />
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-800">
        {hasFilter
          ? 'Dokumen tidak ditemukan'
          : 'Produk hukum belum tersedia'}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
        {hasFilter
          ? 'Tidak ada produk hukum yang sesuai dengan filter atau kata kunci pencarian.'
          : 'Dokumen produk hukum akan tampil setelah dipublikasikan oleh administrator.'}
      </p>
    </div>
  );
}

/* =========================================================
   PAGINATION
========================================================= */

function Pagination({
  q,
  tahun,
  jenis,
  limit,
  page,
  totalPages,
  items,
}: {
  q:
    string;

  tahun:
    string;

  jenis:
    string;

  limit:
    number;

  page:
    number;

  totalPages:
    number;

  items:
    (
      | number
      | 'ellipsis'
    )[];
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-emerald-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      {/* INFO */}

      <p className="text-xs font-semibold text-slate-400">
        Halaman{' '}

        {formatAngka(
          page
        )}{' '}

        dari{' '}

        {formatAngka(
          totalPages
        )}
      </p>

      {/* NAV */}

      <nav
        aria-label="Navigasi halaman produk hukum"
        className="flex flex-wrap gap-2"
      >
        {/* PREVIOUS */}

        {page >
          1 && (
          <Link
            href={buildPageUrl({
              q,
              tahun,
              jenis,
              limit,

              page:
                page - 1,
            })}
            className="inline-flex min-h-9 items-center justify-center rounded-xl border border-emerald-200 bg-white px-4 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50"
          >
            Sebelumnya
          </Link>
        )}

        {/* PAGE ITEMS */}

        {items.map(
          (
            item,
            index
          ) => {
            if (
              item ===
              'ellipsis'
            ) {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-9 min-w-9 items-center justify-center text-xs font-black text-slate-400"
                >
                  …
                </span>
              );
            }

            return (
              <Link
                key={
                  item
                }
                href={buildPageUrl({
                  q,
                  tahun,
                  jenis,
                  limit,

                  page:
                    item,
                })}
                aria-current={
                  item ===
                  page
                    ? 'page'
                    : undefined
                }
                className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-xs font-extrabold transition ${
                  item ===
                  page
                    ? 'bg-emerald-700 text-white'
                    : 'border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                {item}
              </Link>
            );
          }
        )}

        {/* NEXT */}

        {page <
          totalPages && (
          <Link
            href={buildPageUrl({
              q,
              tahun,
              jenis,
              limit,

              page:
                page + 1,
            })}
            className="inline-flex min-h-9 items-center justify-center rounded-xl border border-emerald-200 bg-white px-4 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50"
          >
            Selanjutnya
          </Link>
        )}
      </nav>
    </div>
  );
}