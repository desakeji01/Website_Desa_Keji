// app/admin/permohonan/page.tsx

import {
  createHmac,
} from 'node:crypto';

import Link from 'next/link';

import type {
  ReactNode,
} from 'react';

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  CircleEllipsis,
  Clock3,
  FileCheck2,
  FileText,
  Filter,
  MessageCircle,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  UserRound,
  XCircle,
  type LucideIcon,
} from 'lucide-react';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import {
  ubahStatusPermohonan,
} from './actions';

/* =========================================================
   CONFIG
========================================================= */

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

/*
 * Maksimal 20 baris
 * dalam satu halaman.
 */
const ITEM_PER_PAGE =
  20;

/* =========================================================
   TYPES
========================================================= */

type StatusPermohonan =
  | 'Menunggu'
  | 'Diproses'
  | 'Selesai'
  | 'Ditolak';

interface PageProps {
  searchParams:
    Promise<{
      q?: string;

      status?: string;

      layanan?: string;

      page?: string;
    }>;
}

interface PermohonanDatabase {
  id: number;

  warga_nik: string;

  layanan_id: number;

  no_wa: string;

  status: string;

  created_at: string;
}

interface WargaDatabase {
  nik_hash: string;

  nama_lengkap: string;

  dusun:
    | string
    | null;

  rw:
    | string
    | null;

  rt:
    | string
    | null;
}

interface LayananDatabase {
  id: number;

  nama: string;
}

interface PermohonanView {
  id: number;

  namaPemohon: string;

  nikLast4: string;

  wilayah: string;

  layananId: number;

  layanan: string;

  noWa: string;

  status:
    StatusPermohonan;

  createdAt: string;
}

interface StatistikItem {
  label: string;

  value: number;

  description: string;

  icon: LucideIcon;

  className: string;
}

/* =========================================================
   PAGE HELPERS
========================================================= */

function parsePage(
  value:
    | string
    | undefined
) {
  const parsed =
    Number.parseInt(
      value ??
        '1',
      10
    );

  if (
    !Number.isFinite(
      parsed
    ) ||
    parsed <
      1
  ) {
    return 1;
  }

  return parsed;
}

function normalisasiNik(
  value: string
) {
  return value
    .replace(
      /\D/g,
      ''
    )
    .slice(
      0,
      16
    );
}

function hashNik(
  nik: string,
  secret: string
) {
  return createHmac(
    'sha256',
    secret
  )
    .update(
      nik
    )
    .digest(
      'hex'
    );
}

function normalisasiStatus(
  value: string
):
  StatusPermohonan {
  const normalized =
    value
      .trim()
      .toLowerCase();

  if (
    normalized ===
    'diproses'
  ) {
    return 'Diproses';
  }

  if (
    normalized ===
    'selesai'
  ) {
    return 'Selesai';
  }

  if (
    normalized ===
    'ditolak'
  ) {
    return 'Ditolak';
  }

  return 'Menunggu';
}

function formatTanggal(
  value: string
) {
  const date =
    new Date(
      value
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
        'short',

      year:
        'numeric',

      hour:
        '2-digit',

      minute:
        '2-digit',

      timeZone:
        'Asia/Jakarta',
    }
  ).format(
    date
  );
}

function formatNomorWhatsApp(
  value: string
) {
  const digits =
    value.replace(
      /\D/g,
      ''
    );

  if (
    digits.startsWith(
      '0'
    )
  ) {
    return `62${digits.slice(1)}`;
  }

  if (
    digits.startsWith(
      '8'
    )
  ) {
    return `62${digits}`;
  }

  return digits;
}

function formatWilayah(
  warga:
    | WargaDatabase
    | undefined
) {
  if (!warga) {
    return 'Wilayah tidak tersedia';
  }

  const wilayah = [
    warga.dusun,

    warga.rt
      ? `RT ${warga.rt}`
      : null,

    warga.rw
      ? `RW ${warga.rw}`
      : null,
  ].filter(
    Boolean
  );

  return (
    wilayah.join(
      ' · '
    ) ||
    'Wilayah belum dilengkapi'
  );
}

/* =========================================================
   PAGINATION URL
========================================================= */

function buildPageUrl(
  current: {
    q: string;

    status: string;

    layanan: string;
  },
  page: number
) {
  const params =
    new URLSearchParams();

  if (
    current.q
  ) {
    params.set(
      'q',
      current.q
    );
  }

  if (
    current.status &&
    current.status !==
      'semua'
  ) {
    params.set(
      'status',
      current.status
    );
  }

  if (
    current.layanan
  ) {
    params.set(
      'layanan',
      current.layanan
    );
  }

  params.set(
    'page',
    String(
      page
    )
  );

  return `/admin/permohonan?${params.toString()}`;
}

/* =========================================================
   PAGE NUMBERS
========================================================= */

function getPageNumbers(
  currentPage: number,
  totalPages: number
) {
  if (
    totalPages <=
    7
  ) {
    return Array.from(
      {
        length:
          totalPages,
      },
      (
        _,
        index
      ) =>
        index +
        1
    );
  }

  const pages =
    new Set<
      number
    >([
      1,
      totalPages,
      currentPage,
      currentPage - 1,
      currentPage + 1,
    ]);

  if (
    currentPage <=
    3
  ) {
    pages.add(
      2
    );

    pages.add(
      3
    );

    pages.add(
      4
    );
  }

  if (
    currentPage >=
    totalPages -
      2
  ) {
    pages.add(
      totalPages -
        1
    );

    pages.add(
      totalPages -
        2
    );

    pages.add(
      totalPages -
        3
    );
  }

  return Array.from(
    pages
  )
    .filter(
      (
        page
      ) =>
        page >=
          1 &&
        page <=
          totalPages
    )
    .sort(
      (
        a,
        b
      ) =>
        a -
        b
    );
}

/* =========================================================
   PAGE
========================================================= */

export default async function AdminPermohonanPage({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;

  /* =======================================================
     PARAMETER
  ======================================================= */

  const q =
    String(
      params.q ??
        ''
    )
      .trim()
      .toLowerCase();

  const statusFilter =
    String(
      params.status ??
        'semua'
    ).toLowerCase();

  const layananFilter =
    String(
      params.layanan ??
        ''
    );

  const currentPage =
    parsePage(
      params.page
    );

  /* =======================================================
     FETCH
  ======================================================= */

  const [
    permohonanResult,
    layananResult,
  ] =
    await Promise.all([
      supabaseAdmin
        .from(
          'permohonan'
        )
        .select(`
          id,
          warga_nik,
          layanan_id,
          no_wa,
          status,
          created_at
        `)
        .order(
          'created_at',
          {
            ascending:
              false,
          }
        ),

      supabaseAdmin
        .from(
          'layanan'
        )
        .select(`
          id,
          nama
        `)
        .order(
          'urutan',
          {
            ascending:
              true,
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
     ERROR
  ======================================================= */

  if (
    permohonanResult.error
  ) {
    console.error(
      'Gagal mengambil data permohonan:',
      {
        message:
          permohonanResult
            .error
            .message,

        code:
          permohonanResult
            .error
            .code,

        details:
          permohonanResult
            .error
            .details,

        hint:
          permohonanResult
            .error
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

  const permohonanRows =
    (
      permohonanResult.data ??
      []
    ) as PermohonanDatabase[];

  const daftarLayanan =
    (
      layananResult.data ??
      []
    ) as LayananDatabase[];

  /* =======================================================
     HASH NIK
  ======================================================= */

  const secret =
    process.env
      .NIK_HASH_SECRET;

  const nikHashMap =
    new Map<
      string,
      string
    >();

  if (
    !secret ||
    secret.length <
      32
  ) {
    console.error(
      'NIK_HASH_SECRET belum tersedia atau kurang dari 32 karakter.'
    );
  } else {
    permohonanRows.forEach(
      (
        item
      ) => {
        const nik =
          normalisasiNik(
            item.warga_nik
          );

        if (
          /^\d{16}$/.test(
            nik
          )
        ) {
          nikHashMap.set(
            nik,
            hashNik(
              nik,
              secret
            )
          );
        }
      }
    );
  }

  const daftarNikHash = [
    ...new Set(
      Array.from(
        nikHashMap.values()
      )
    ),
  ];

  /* =======================================================
     WARGA
  ======================================================= */

  let wargaRows:
    WargaDatabase[] = [];

  if (
    daftarNikHash.length >
    0
  ) {
    const wargaResult =
      await supabaseAdmin
        .from(
          'warga'
        )
        .select(`
          nik_hash,
          nama_lengkap,
          dusun,
          rw,
          rt
        `)
        .in(
          'nik_hash',
          daftarNikHash
        );

    if (
      wargaResult.error
    ) {
      console.error(
        'Gagal mengambil data warga pemohon:',
        {
          message:
            wargaResult
              .error
              .message,

          code:
            wargaResult
              .error
              .code,

          details:
            wargaResult
              .error
              .details,

          hint:
            wargaResult
              .error
              .hint,
        }
      );
    } else {
      wargaRows =
        (
          wargaResult.data ??
          []
        ) as WargaDatabase[];
    }
  }

  /* =======================================================
     MAP
  ======================================================= */

  const wargaMap =
    new Map(
      wargaRows.map(
        (
          warga
        ) => [
          warga.nik_hash,
          warga,
        ]
      )
    );

  const layananMap =
    new Map(
      daftarLayanan.map(
        (
          layanan
        ) => [
          Number(
            layanan.id
          ),
          layanan.nama,
        ]
      )
    );

  /* =======================================================
     NORMALIZE
  ======================================================= */

  const seluruhPermohonan:
    PermohonanView[] =
    permohonanRows.map(
      (
        item
      ) => {
        const nik =
          normalisasiNik(
            item.warga_nik
          );

        const nikHash =
          nikHashMap.get(
            nik
          ) ??
          '';

        const warga =
          wargaMap.get(
            nikHash
          );

        return {
          id:
            Number(
              item.id
            ),

          namaPemohon:
            warga
              ?.nama_lengkap ??
            'Warga tidak ditemukan',

          nikLast4:
            nik.length >=
            4
              ? nik.slice(
                  -4
                )
              : '----',

          wilayah:
            formatWilayah(
              warga
            ),

          layananId:
            Number(
              item.layanan_id
            ),

          layanan:
            layananMap.get(
              Number(
                item.layanan_id
              )
            ) ??
            'Layanan tidak ditemukan',

          noWa:
            String(
              item.no_wa ??
                ''
            ),

          status:
            normalisasiStatus(
              item.status
            ),

          createdAt:
            item.created_at,
        };
      }
    );

  /* =======================================================
     STATISTIK
  ======================================================= */

  const totalPermohonan =
    seluruhPermohonan.length;

  const totalMenunggu =
    seluruhPermohonan.filter(
      (
        item
      ) =>
        item.status ===
        'Menunggu'
    ).length;

  const totalDiproses =
    seluruhPermohonan.filter(
      (
        item
      ) =>
        item.status ===
        'Diproses'
    ).length;

  const totalSelesai =
    seluruhPermohonan.filter(
      (
        item
      ) =>
        item.status ===
        'Selesai'
    ).length;

  const totalDitolak =
    seluruhPermohonan.filter(
      (
        item
      ) =>
        item.status ===
        'Ditolak'
    ).length;

  /* =======================================================
     FILTER
  ======================================================= */

  const permohonanFiltered =
    seluruhPermohonan.filter(
      (
        item
      ) => {
        const cocokPencarian =
          !q ||
          item.namaPemohon
            .toLowerCase()
            .includes(
              q
            ) ||
          item.noWa
            .toLowerCase()
            .includes(
              q
            ) ||
          item.nikLast4.includes(
            q.replace(
              /\D/g,
              ''
            )
          ) ||
          item.layanan
            .toLowerCase()
            .includes(
              q
            );

        const cocokStatus =
          statusFilter ===
            'semua' ||
          item.status
            .toLowerCase() ===
            statusFilter;

        const cocokLayanan =
          !layananFilter ||
          String(
            item.layananId
          ) ===
            layananFilter;

        return (
          cocokPencarian &&
          cocokStatus &&
          cocokLayanan
        );
      }
    );

  /* =======================================================
     PAGINATION 20 PER PAGE
  ======================================================= */

  const totalFiltered =
    permohonanFiltered.length;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalFiltered /
          ITEM_PER_PAGE
      )
    );

  const safeCurrentPage =
    Math.min(
      currentPage,
      totalPages
    );

  const from =
    (
      safeCurrentPage -
      1
    ) *
    ITEM_PER_PAGE;

  const to =
    from +
    ITEM_PER_PAGE;

  const permohonan =
    permohonanFiltered.slice(
      from,
      to
    );

  const firstItem =
    totalFiltered ===
    0
      ? 0
      : from +
        1;

  const lastItem =
    Math.min(
      from +
        permohonan.length,
      totalFiltered
    );

  const pageNumbers =
    getPageNumbers(
      safeCurrentPage,
      totalPages
    );

  /* =======================================================
     STATS CONFIG
  ======================================================= */

  const statistik:
    StatistikItem[] = [
      {
        label:
          'Total Permohonan',

        value:
          totalPermohonan,

        description:
          'Seluruh pengajuan layanan',

        icon:
          FileText,

        className:
          'bg-slate-100 text-slate-700',
      },

      {
        label:
          'Menunggu',

        value:
          totalMenunggu,

        description:
          'Belum mulai diproses',

        icon:
          Clock3,

        className:
          'bg-amber-100 text-amber-700',
      },

      {
        label:
          'Diproses',

        value:
          totalDiproses,

        description:
          'Sedang ditangani admin',

        icon:
          CircleEllipsis,

        className:
          'bg-blue-100 text-blue-700',
      },

      {
        label:
          'Selesai',

        value:
          totalSelesai,

        description:
          'Pelayanan telah selesai',

        icon:
          CheckCircle2,

        className:
          'bg-emerald-100 text-emerald-700',
      },
    ];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      {/* ===================================================
          HEADER
      =================================================== */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] px-6 py-7 text-white shadow-xl shadow-emerald-950/10 sm:px-8 sm:py-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(
                circle,
                rgba(255,255,255,0.13) 1.5px,
                transparent 1.5px
              )
            `,

            backgroundSize:
              '26px 26px',
          }}
        />

        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border-[40px] border-white/[0.04]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-emerald-50 backdrop-blur-md">
              <ShieldCheck
                size={14}
              />

              Administrasi pelayanan
              warga
            </div>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Permohonan Layanan
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-emerald-50/80 sm:text-base">
              Pantau permohonan yang
              dikirim warga melalui
              Layanan Cepat, hubungi
              pemohon, dan ubah status
              penanganan pelayanan.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/layanan"
              target="_blank"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/15"
            >
              <FileCheck2
                size={17}
              />

              Halaman Publik
            </Link>

            <Link
              href="/admin/permohonan"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-800 transition hover:bg-emerald-50"
            >
              <RefreshCw
                size={17}
              />

              Segarkan
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================
          STATISTIK
      =================================================== */}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statistik.map(
          (
            item
          ) => {
            const Icon =
              item.icon;

            return (
              <article
                key={
                  item.label
                }
                className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_12px_35px_rgba(6,78,59,0.07)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                      {
                        item.label
                      }
                    </p>

                    <p className="mt-4 text-4xl font-black text-slate-900">
                      {item.value.toLocaleString(
                        'id-ID'
                      )}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.className}`}
                  >
                    <Icon
                      size={23}
                    />
                  </div>
                </div>

                <p className="mt-5 border-t border-slate-100 pt-4 text-sm font-medium text-slate-500">
                  {
                    item.description
                  }
                </p>
              </article>
            );
          }
        )}
      </section>

      {/* ===================================================
          FILTER
      =================================================== */}

      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-[0_12px_35px_rgba(6,78,59,0.07)] sm:p-6">
        <form
          method="get"
          className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_260px_auto]"
        >
          {/* SEARCH */}

          <div>
            <label
              htmlFor="q"
              className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500"
            >
              Pencarian
            </label>

            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="q"
                name="q"
                defaultValue={
                  params.q ??
                  ''
                }
                placeholder="Cari nama, WhatsApp, layanan, atau 4 digit NIK..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* STATUS */}

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              defaultValue={
                statusFilter
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="semua">
                Semua Status
              </option>

              <option value="menunggu">
                Menunggu
              </option>

              <option value="diproses">
                Diproses
              </option>

              <option value="selesai">
                Selesai
              </option>

              <option value="ditolak">
                Ditolak
              </option>
            </select>
          </div>

          {/* LAYANAN */}

          <div>
            <label
              htmlFor="layanan"
              className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500"
            >
              Jenis Layanan
            </label>

            <select
              id="layanan"
              name="layanan"
              defaultValue={
                layananFilter
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="">
                Semua Layanan
              </option>

              {daftarLayanan.map(
                (
                  layanan
                ) => (
                  <option
                    key={
                      layanan.id
                    }
                    value={
                      layanan.id
                    }
                  >
                    {
                      layanan.nama
                    }
                  </option>
                )
              )}
            </select>
          </div>

          {/* BUTTON */}

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white transition hover:bg-emerald-800"
            >
              <Filter
                size={17}
              />

              Terapkan
            </button>

            <Link
              href="/admin/permohonan"
              title="Hapus filter"
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <XCircle
                size={18}
              />
            </Link>
          </div>
        </form>
      </section>

      {/* ===================================================
          TABLE
      =================================================== */}

      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_12px_35px_rgba(6,78,59,0.07)]">
        {/* HEADER */}

        <div className="flex flex-col gap-3 border-b border-emerald-50 bg-gradient-to-r from-emerald-50/70 to-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <h2 className="text-lg font-black text-slate-900 sm:text-xl">
              Daftar Permohonan
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-500">
              {totalFiltered >
              0 ? (
                <>
                  Menampilkan data{' '}
                  <strong className="text-slate-700">
                    {firstItem}
                    –
                    {lastItem}
                  </strong>{' '}
                  dari{' '}
                  <strong className="text-slate-700">
                    {
                      totalFiltered
                    }
                  </strong>{' '}
                  permohonan.
                </>
              ) : (
                'Tidak ada data yang sesuai.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-100 bg-white px-4 py-2 text-xs font-extrabold text-emerald-700">
              <FileText
                size={14}
              />

              Maks. 20 / halaman
            </span>

            <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-100 bg-white px-4 py-2 text-xs font-extrabold text-red-700">
              <CircleAlert
                size={15}
              />

              Ditolak:{' '}
              {
                totalDitolak
              }
            </span>
          </div>
        </div>

        {/* EMPTY */}

        {permohonan.length ===
        0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 ring-1 ring-emerald-100">
              <FileText
                size={28}
              />
            </div>

            <h3 className="mt-5 text-base font-extrabold text-slate-800">
              Belum ada permohonan
            </h3>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
              Permohonan yang dikirim
              melalui formulir
              Layanan Cepat akan
              otomatis muncul pada
              halaman ini.
            </p>
          </div>
        ) : (
          /* TABLE */

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] border-collapse">
              <thead>
                <tr className="bg-slate-50/80">
                  <TableHead>
                    Tanggal
                  </TableHead>

                  <TableHead>
                    Pemohon
                  </TableHead>

                  <TableHead>
                    Layanan
                  </TableHead>

                  <TableHead>
                    WhatsApp
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead>
                    Tindakan
                  </TableHead>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {permohonan.map(
                  (
                    item
                  ) => (
                    <tr
                      key={
                        item.id
                      }
                      className="align-top transition hover:bg-emerald-50/30"
                    >
                      {/* DATE */}

                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="flex items-start gap-2">
                          <CalendarDays
                            size={16}
                            className="mt-0.5 shrink-0 text-emerald-600"
                          />

                          <div>
                            <p className="text-sm font-bold text-slate-700">
                              {formatTanggal(
                                item.createdAt
                              )}
                            </p>

                            <p className="mt-1 text-[10px] font-semibold text-slate-400">
                              ID #
                              {
                                item.id
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* USER */}

                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                            <UserRound
                              size={18}
                            />
                          </div>

                          <div>
                            <p className="font-extrabold text-slate-800">
                              {
                                item.namaPemohon
                              }
                            </p>

                            <p className="mt-1 text-xs font-semibold text-slate-500">
                              NIK ••••{' '}
                              {
                                item.nikLast4
                              }
                            </p>

                            <p className="mt-1 text-xs font-medium text-slate-400">
                              {
                                item.wilayah
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SERVICE */}

                      <td className="px-6 py-5">
                        <span className="inline-flex max-w-[230px] rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-extrabold leading-5 text-emerald-800">
                          {
                            item.layanan
                          }
                        </span>
                      </td>

                      {/* WA */}

                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-slate-700">
                          {
                            item.noWa
                          }
                        </p>

                        <a
                          href={`https://wa.me/${formatNomorWhatsApp(
                            item.noWa
                          )}?text=${encodeURIComponent(
                            `Halo ${item.namaPemohon}, permohonan layanan ${item.layanan} Anda sedang kami tindak lanjuti oleh Pemerintah Desa Keji.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 hover:text-emerald-900"
                        >
                          <MessageCircle
                            size={14}
                          />

                          Hubungi
                        </a>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">
                        <StatusBadge
                          status={
                            item.status
                          }
                        />
                      </td>

                      {/* ACTION */}

                      <td className="px-6 py-5">
                        <form
                          action={
                            ubahStatusPermohonan
                          }
                          className="flex w-[245px] gap-2"
                        >
                          <input
                            type="hidden"
                            name="id"
                            value={
                              item.id
                            }
                          />

                          <select
                            name="status"
                            defaultValue={
                              item.status
                            }
                            className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                          >
                            <option value="Menunggu">
                              Menunggu
                            </option>

                            <option value="Diproses">
                              Diproses
                            </option>

                            <option value="Selesai">
                              Selesai
                            </option>

                            <option value="Ditolak">
                              Ditolak
                            </option>
                          </select>

                          <button
                            type="submit"
                            title="Simpan status"
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white transition hover:bg-emerald-800"
                          >
                            <Save
                              size={16}
                            />
                          </button>
                        </form>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* =================================================
            PAGINATION
        ================================================= */}

        {totalPages >
          1 && (
          <div className="border-t border-slate-100 px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              {/* INFO */}

              <div>
                <p className="text-sm font-semibold text-slate-600">
                  Halaman{' '}
                  <strong className="font-black text-slate-900">
                    {
                      safeCurrentPage
                    }
                  </strong>{' '}
                  dari{' '}
                  <strong className="font-black text-slate-900">
                    {
                      totalPages
                    }
                  </strong>
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Maksimal 20
                  permohonan pada
                  setiap halaman.
                </p>
              </div>

              {/* CONTROLS */}

              <div className="flex flex-wrap items-center gap-2">
                {/* PREVIOUS */}

                {safeCurrentPage >
                1 ? (
                  <Link
                    href={buildPageUrl(
                      {
                        q:
                          params.q ??
                          '',

                        status:
                          statusFilter,

                        layanan:
                          layananFilter,
                      },
                      safeCurrentPage -
                        1
                    )}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <ArrowLeft
                      size={15}
                    />

                    Sebelumnya
                  </Link>
                ) : (
                  <span className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 text-xs font-extrabold text-slate-300">
                    <ArrowLeft
                      size={15}
                    />

                    Sebelumnya
                  </span>
                )}

                {/* PAGE NUMBERS */}

                <div className="flex flex-wrap items-center gap-1.5">
                  {pageNumbers.map(
                    (
                      page,
                      index
                    ) => {
                      const previousPage =
                        pageNumbers[
                          index -
                            1
                        ];

                      const showDots =
                        previousPage &&
                        page -
                          previousPage >
                          1;

                      return (
                        <div
                          key={
                            page
                          }
                          className="flex items-center gap-1.5"
                        >
                          {showDots && (
                            <span className="px-1 text-xs font-bold text-slate-300">
                              ...
                            </span>
                          )}

                          {page ===
                          safeCurrentPage ? (
                            <span className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-emerald-700 px-3 text-xs font-black text-white shadow-sm">
                              {
                                page
                              }
                            </span>
                          ) : (
                            <Link
                              href={buildPageUrl(
                                {
                                  q:
                                    params.q ??
                                    '',

                                  status:
                                    statusFilter,

                                  layanan:
                                    layananFilter,
                                },
                                page
                              )}
                              className="flex h-10 min-w-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              {
                                page
                              }
                            </Link>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>

                {/* NEXT */}

                {safeCurrentPage <
                totalPages ? (
                  <Link
                    href={buildPageUrl(
                      {
                        q:
                          params.q ??
                          '',

                        status:
                          statusFilter,

                        layanan:
                          layananFilter,
                      },
                      safeCurrentPage +
                        1
                    )}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-800"
                  >
                    Berikutnya

                    <ArrowRight
                      size={15}
                    />
                  </Link>
                ) : (
                  <span className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-xl bg-slate-100 px-4 text-xs font-extrabold text-slate-300">
                    Berikutnya

                    <ArrowRight
                      size={15}
                    />
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   TABLE HEAD
========================================================= */

function TableHead({
  children,
}: {
  children:
    ReactNode;
}) {
  return (
    <th className="px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500">
      {children}
    </th>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}: {
  status:
    StatusPermohonan;
}) {
  if (
    status ===
    'Selesai'
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
        <CheckCircle2
          size={13}
        />

        Selesai
      </span>
    );
  }

  if (
    status ===
    'Diproses'
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-700">
        <CircleEllipsis
          size={13}
        />

        Diproses
      </span>
    );
  }

  if (
    status ===
    'Ditolak'
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-700">
        <XCircle
          size={13}
        />

        Ditolak
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-extrabold text-amber-700">
      <Clock3
        size={13}
      />

      Menunggu
    </span>
  );
}