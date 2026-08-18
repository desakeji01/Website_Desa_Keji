// app/(public)/informasi-publik/informasi-umum/page.tsx

import type { Metadata } from 'next';

import Link from 'next/link';

import {
  Download,
  Eye,
  FileSearch,
  FileText,
  Filter,
  Info,
  Search,
  ShieldCheck,
} from 'lucide-react';

import { redirect } from 'next/navigation';

import SidebarLayanan from '@/components/SidebarLayanan';
import SidebarTilikArkeji from '@/components/SidebarTilikArkeji';

import { supabaseAdmin } from '@/lib/supabase-admin';

import type {
  InformasiUmumItem,
} from '@/types/informasi-publik';

import type {
  PilihanLayanan,
} from '@/types/layanan';

export const metadata: Metadata = {
  title:
    'Informasi Umum Desa Keji | SIJI',

  description:
    'Dokumen pemerintahan, pembangunan, pelayanan, dan informasi umum Desa Keji.',
};

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    q?: string;
    kategori?: string;
    tahun?: string;
    page?: string;
  }>;
}

interface InformasiMetadataRow {
  kategori:
    | string
    | null;

  tahun:
    | number
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

const LIMIT = 10;

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
    .slice(0, 100);
}

function sanitizeKategori(
  value: string
) {
  return value
    .normalize('NFKC')
    .replace(
      /[^\p{L}\p{N}\s\-_/]/gu,
      ''
    )
    .trim()
    .slice(0, 100);
}

function parsePage(
  value:
    | string
    | undefined
) {
  const number =
    Number(value);

  return Number.isInteger(
    number
  ) &&
    number > 0
    ? number
    : 1;
}

function getSafeDocumentUrl(
  value: unknown
) {
  const url =
    safeString(value);

  if (!url) {
    return null;
  }

  try {
    const parsedUrl =
      new URL(url);

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

function formatAngka(
  value: number
) {
  return new Intl.NumberFormat(
    'id-ID'
  ).format(
    Number.isFinite(value)
      ? value
      : 0
  );
}

function buildUrl({
  q,
  kategori,
  tahun,
  page,
}: {
  q: string;
  kategori: string;
  tahun: string;
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

  if (kategori) {
    params.set(
      'kategori',
      kategori
    );
  }

  if (tahun) {
    params.set(
      'tahun',
      tahun
    );
  }

  params.set(
    'page',
    String(page)
  );

  return `/informasi-publik/informasi-umum?${params.toString()}`;
}

function getPaginationItems(
  currentPage: number,
  totalPages: number
) {
  const items:
    Array<
      number | 'ellipsis'
    > = [];

  for (
    let page = 1;
    page <= totalPages;
    page += 1
  ) {
    const shouldShow =
      page === 1 ||
      page === totalPages ||
      Math.abs(
        page -
          currentPage
      ) <= 1;

    if (!shouldShow) {
      continue;
    }

    const previousItem =
      items[
        items.length - 1
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

    items.push(page);
  }

  return items;
}

export default async function InformasiUmumPage({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;

  const q =
    sanitizeSearch(
      params.q ?? ''
    );

  const kategori =
    sanitizeKategori(
      params.kategori ?? ''
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

  const page =
    parsePage(
      params.page
    );

  const from =
    (page - 1) *
    LIMIT;

  const to =
    from +
    LIMIT -
    1;

  let informasiQuery =
    supabaseAdmin
      .from(
        'informasi_umum'
      )
      .select(
        '*',
        {
          count: 'exact',
        }
      )
      .eq('aktif', true);

  if (q) {
    informasiQuery =
      informasiQuery.ilike(
        'judul',
        `%${q}%`
      );
  }

  if (kategori) {
    informasiQuery =
      informasiQuery.eq(
        'kategori',
        kategori
      );
  }

  if (tahun) {
    informasiQuery =
      informasiQuery.eq(
        'tahun',
        Number(tahun)
      );
  }

  informasiQuery =
    informasiQuery
      .order('urutan', {
        ascending: true,
        nullsFirst: false,
      })
      .order('tahun', {
        ascending: false,
      })
      .order('created_at', {
        ascending: false,
      })
      .range(from, to);

  const [
    informasiResult,
    metadataResult,
    layananResult,
  ] = await Promise.all([
    informasiQuery,

    supabaseAdmin
      .from(
        'informasi_umum'
      )
      .select(`
        kategori,
        tahun
      `)
      .eq('aktif', true),

    supabaseAdmin
      .from('layanan')
      .select(`
        id,
        nama,
        slug
      `)
      .eq('aktif', true)
      .order('urutan', {
        ascending: true,
        nullsFirst: false,
      })
      .order('nama', {
        ascending: true,
      }),
  ]);

  if (
    informasiResult.error
  ) {
    console.error(
      'Gagal mengambil informasi umum:',
      {
        message:
          informasiResult.error
            .message,

        code:
          informasiResult.error
            .code,

        details:
          informasiResult.error
            .details,

        hint:
          informasiResult.error
            .hint,
      }
    );
  }

  if (
    metadataResult.error
  ) {
    console.error(
      'Gagal mengambil metadata informasi umum:',
      {
        message:
          metadataResult.error
            .message,

        code:
          metadataResult.error
            .code,

        details:
          metadataResult.error
            .details,

        hint:
          metadataResult.error
            .hint,
      }
    );
  }

  if (
    layananResult.error
  ) {
    console.error(
      'Gagal mengambil daftar layanan:',
      {
        message:
          layananResult.error
            .message,

        code:
          layananResult.error
            .code,

        details:
          layananResult.error
            .details,

        hint:
          layananResult.error
            .hint,
      }
    );
  }

  const daftarInformasi =
    (
      informasiResult.data ??
      []
    ) as InformasiUmumItem[];

  const totalData =
    Number(
      informasiResult.count ??
        0
    );

  const totalPages =
    Math.max(
      Math.ceil(
        totalData /
          LIMIT
      ),
      1
    );

  if (
    page >
    totalPages
  ) {
    redirect(
      buildUrl({
        q,
        kategori,
        tahun,
        page:
          totalPages,
      })
    );
  }

  const metadata =
    (
      metadataResult.data ??
      []
    ) as InformasiMetadataRow[];

  const kategoriList = [
    ...new Set(
      metadata
        .map((item) =>
          safeString(
            item.kategori
          )
        )
        .filter(Boolean)
    ),
  ].sort(
    (first, second) =>
      first.localeCompare(
        second,
        'id-ID'
      )
  );

  const tahunList = [
    ...new Set(
      metadata
        .map((item) =>
          Number(
            item.tahun
          )
        )
        .filter(
          (item) =>
            Number.isInteger(
              item
            ) &&
            item >= 1900 &&
            item <= 2200
        )
    ),
  ].sort(
    (first, second) =>
      second - first
  );

  const daftarLayanan:
    PilihanLayanan[] = (
      (
        layananResult.data ??
        []
      ) as LayananRow[]
    )
      .map((item) => {
        const id =
          Number(item.id);

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
      })
      .filter(
        (item) =>
          Number.isInteger(
            item.id
          ) &&
          item.id > 0 &&
          item.nama.length >
            0 &&
          item.slug.length >
            0
      );

  const hasActiveFilter =
    Boolean(
      q ||
        kategori ||
        tahun
    );

  const startEntry =
    totalData === 0
      ? 0
      : from + 1;

  const endEntry =
    Math.min(
      from +
        daftarInformasi.length,
      totalData
    );

  const paginationItems =
    getPaginationItems(
      page,
      totalPages
    );

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
              <Info size={24} />
            </div>

            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
              Informasi Publik
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Informasi Umum
            </h1>

            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80 sm:text-base">
              Dokumen pemerintahan,
              pembangunan, pelayanan,
              dan informasi umum resmi
              Pemerintah Desa Keji.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <HeaderBadge
                label={`${formatAngka(
                  totalData
                )} dokumen`}
              />

              <HeaderBadge
                label={`${formatAngka(
                  kategoriList.length
                )} kategori`}
              />

              <HeaderBadge
                label={`${formatAngka(
                  tahunList.length
                )} tahun data`}
              />
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Konten utama */}
          <main className="min-w-0 space-y-7 lg:w-2/3">
            {/* Informasi */}
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
                    Dokumen Informasi
                    Desa
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-emerald-800">
                    Gunakan kategori,
                    tahun, dan kata kunci
                    judul untuk menemukan
                    informasi publik yang
                    dibutuhkan.
                  </p>
                </div>
              </div>
            </section>

            {/* Filter */}
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
                      Filter Informasi
                    </h2>

                    <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                      Pilih kategori,
                      tahun, atau cari
                      berdasarkan judul.
                    </p>
                  </div>
                </div>
              </div>

              <form
                action="/informasi-publik/informasi-umum"
                className="grid gap-4 p-5 sm:p-6 md:grid-cols-2"
              >
                <FilterField
                  label="Kategori"
                  htmlFor="kategori"
                >
                  <select
                    id="kategori"
                    name="kategori"
                    defaultValue={
                      kategori
                    }
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">
                      Semua Kategori
                    </option>

                    {kategoriList.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </FilterField>

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
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">
                      Semua Tahun
                    </option>

                    {tahunList.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </FilterField>

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
                        defaultValue={q}
                        placeholder="Cari informasi..."
                        autoComplete="off"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                  </FilterField>
                </div>

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
                      href="/informasi-publik/informasi-umum"
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-200 bg-white px-5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
                    >
                      Reset Filter
                    </Link>
                  )}
                </div>
              </form>
            </section>

            {/* Daftar informasi */}
            <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
              <div className="border-b border-emerald-100 px-5 py-5 sm:px-6">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                  Arsip Informasi
                </p>

                <h2 className="mt-1 text-lg font-black text-slate-900">
                  Daftar Informasi Umum
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

              {daftarInformasi.length ===
              0 ? (
                <EmptyState
                  hasFilter={
                    hasActiveFilter
                  }
                />
              ) : (
                <div className="divide-y divide-emerald-100">
                  {daftarInformasi.map(
                    (item) => (
                      <InformasiCard
                        key={item.id}
                        item={item}
                      />
                    )
                  )}
                </div>
              )}

              {totalPages > 1 && (
                <Pagination
                  q={q}
                  kategori={
                    kategori
                  }
                  tahun={tahun}
                  page={page}
                  totalPages={
                    totalPages
                  }
                  items={
                    paginationItems
                  }
                />
              )}
            </section>

            {/* Catatan */}
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
                    Dokumen yang tampil
                    merupakan informasi
                    yang telah diaktifkan
                    dan dipublikasikan
                    melalui halaman
                    administrator website
                    Desa Keji.
                  </p>
                </div>
              </div>
            </section>
          </main>

          {/* Sidebar kanan */}
          <aside className="min-w-0 lg:w-1/3">
            <div className="flex flex-col gap-8 lg:sticky lg:top-24">
              <SidebarLayanan
                daftarLayanan={
                  daftarLayanan
                }
                sticky={false}
              />

              <SidebarTilikArkeji />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function HeaderBadge({
  label,
}: {
  label: string;
}) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-emerald-50 backdrop-blur">
      {label}
    </span>
  );
}

function FilterField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-bold text-slate-700"
      >
        {label}
      </label>

      {children}
    </div>
  );
}

function InformasiCard({
  item,
}: {
  item: InformasiUmumItem;
}) {
  const fileUrl =
    getSafeDocumentUrl(
      item.file_url
    );

  const judul =
    safeString(
      item.judul
    ) ||
    'Informasi Desa Keji';

  const kategori =
    safeString(
      item.kategori
    ) ||
    'Informasi Umum';

  const tahun =
    Number(
      item.tahun
    );

  const deskripsi =
    safeString(
      item.deskripsi
    ) ||
    'Dokumen informasi publik Pemerintah Desa Keji.';

  return (
    <article className="p-5 transition hover:bg-emerald-50/40 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-emerald-700">
              {kategori}
            </span>

            {Number.isInteger(
              tahun
            ) && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-extrabold text-slate-500">
                {tahun}
              </span>
            )}
          </div>

          <h2 className="mt-3 text-lg font-black leading-7 text-slate-900">
            {judul}
          </h2>

          <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
            {deskripsi}
          </p>
        </div>

        <DocumentActions
          fileUrl={fileUrl}
        />
      </div>
    </article>
  );
}

function DocumentActions({
  fileUrl,
}: {
  fileUrl:
    | string
    | null;
}) {
  if (!fileUrl) {
    return (
      <span className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 px-4 text-xs font-bold text-slate-400">
        File tidak tersedia
      </span>
    );
  }

  return (
    <div className="flex shrink-0 gap-2">
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-800"
      >
        <Eye size={15} />
        Lihat
      </a>

      <a
        href={fileUrl}
        download
        aria-label="Unduh dokumen"
        title="Unduh dokumen"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-white text-emerald-700 transition hover:bg-emerald-50"
      >
        <Download
          size={16}
        />
      </a>
    </div>
  );
}

function EmptyState({
  hasFilter,
}: {
  hasFilter: boolean;
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
          : 'Informasi belum tersedia'}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
        {hasFilter
          ? 'Tidak ada dokumen yang sesuai dengan filter atau kata kunci pencarian.'
          : 'Informasi umum akan tampil setelah dipublikasikan oleh administrator.'}
      </p>
    </div>
  );
}

function Pagination({
  q,
  kategori,
  tahun,
  page,
  totalPages,
  items,
}: {
  q: string;
  kategori: string;
  tahun: string;
  page: number;
  totalPages: number;

  items: Array<
    number | 'ellipsis'
  >;
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-emerald-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-xs font-semibold text-slate-400">
        Halaman{' '}
        {formatAngka(page)}{' '}
        dari{' '}
        {formatAngka(
          totalPages
        )}
      </p>

      <nav
        aria-label="Navigasi halaman informasi umum"
        className="flex flex-wrap gap-2"
      >
        {page > 1 && (
          <Link
            href={buildUrl({
              q,
              kategori,
              tahun,
              page:
                page - 1,
            })}
            className="inline-flex min-h-9 items-center justify-center rounded-xl border border-emerald-200 bg-white px-4 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50"
          >
            Sebelumnya
          </Link>
        )}

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
                key={item}
                href={buildUrl({
                  q,
                  kategori,
                  tahun,
                  page: item,
                })}
                aria-current={
                  item === page
                    ? 'page'
                    : undefined
                }
                className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-xs font-extrabold transition ${
                  item === page
                    ? 'bg-emerald-700 text-white'
                    : 'border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                {item}
              </Link>
            );
          }
        )}

        {page <
          totalPages && (
          <Link
            href={buildUrl({
              q,
              kategori,
              tahun,
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