// app/admin/page.tsx

import {
  createHmac,
} from 'node:crypto';

import {
  revalidatePath,
} from 'next/cache';

import Link from 'next/link';

import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  Database,
  Eye,
  FileText,
  LayoutGrid,
  ListChecks,
  MessageCircle,
  Newspaper,
  RefreshCw,
  ShoppingCart,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';

import {
  publicContentModules,
  type AdminNavigationItem,
} from '@/lib/admin-navigation';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

/* =========================================================
   CONFIG
========================================================= */

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

const MAX_PERMOHONAN_DASHBOARD =
  5;

/* =========================================================
   TYPES
========================================================= */

interface PermohonanRow {
  id:
    number;

  warga_nik:
    string;

  layanan_id:
    number;

  no_wa:
    string;

  status:
    string;

  created_at:
    | string
    | null;
}

interface WargaRow {
  nik_hash:
    string;

  nama_lengkap:
    string;
}

interface LayananRow {
  id:
    number;

  nama:
    string;
}

interface PermohonanTerbaru {
  id:
    number;

  namaPemohon:
    string;

  nikLast4:
    string;

  namaLayanan:
    string;

  noWa:
    string;

  status:
    string;

  createdAt:
    | string
    | null;
}

interface DashboardData {
  totalPenduduk:
    number;

  totalBerita:
    number;

  totalLayanan:
    number;

  totalUmkm:
    number;

  totalPermohonan:
    number;

  totalMenunggu:
    number;

  permohonanTerbaru:
    PermohonanTerbaru[];
}

interface StatistikDashboard {
  title:
    string;

  value:
    string;

  description:
    string;

  icon:
    LucideIcon;

  href?:
    string;
}

interface QueryError {
  message?:
    string;

  code?:
    string;

  details?:
    string;

  hint?:
    string;
}

/* =========================================================
   HELPERS
========================================================= */

function logQueryError(
  title:
    string,

  error:
    | QueryError
    | null
) {
  if (
    !error
  ) {
    return;
  }

  console.error(
    title,
    JSON.stringify(
      {
        message:
          error.message,

        code:
          error.code,

        details:
          error.details,

        hint:
          error.hint,
      },
      null,
      2
    )
  );
}

function normalisasiNik(
  value:
    string
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
  nik:
    string,

  secret:
    string
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

function formatTanggal(
  value:
    | string
    | null
) {
  if (
    !value
  ) {
    return '-';
  }

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

function getWhatsAppNumber(
  nomor:
    string
) {
  const digits =
    nomor.replace(
      /\D/g,
      ''
    );

  if (
    digits.startsWith(
      '0'
    )
  ) {
    return `62${digits.slice(
      1
    )}`;
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

/* =========================================================
   DASHBOARD DATA
========================================================= */

async function getDashboardData():
  Promise<DashboardData> {
  const [
    pendudukResult,
    beritaResult,
    layananResult,
    umkmResult,
    permohonanResult,
    permohonanMenungguResult,
    permohonanTerbaruResult,
  ] =
    await Promise.all([
      /* =====================================================
         WARGA AKTIF
      ===================================================== */

      supabaseAdmin
        .from(
          'warga'
        )
        .select(
          'id',
          {
            count:
              'exact',

            head:
              true,
          }
        )
        .eq(
          'aktif',
          true
        ),

      /* =====================================================
         BERITA
      ===================================================== */

      supabaseAdmin
        .from(
          'berita'
        )
        .select(
          'id',
          {
            count:
              'exact',

            head:
              true,
          }
        ),

      /* =====================================================
         LAYANAN AKTIF
      ===================================================== */

      supabaseAdmin
        .from(
          'layanan'
        )
        .select(
          'id',
          {
            count:
              'exact',

            head:
              true,
          }
        )
        .eq(
          'aktif',
          true
        ),

      /* =====================================================
         PRODUK UMKM
      ===================================================== */

      supabaseAdmin
        .from(
          'produk_umkm'
        )
        .select(
          'id',
          {
            count:
              'exact',

            head:
              true,
          }
        ),

      /* =====================================================
         TOTAL SEMUA PERMOHONAN
      ===================================================== */

      supabaseAdmin
        .from(
          'permohonan'
        )
        .select(
          'id',
          {
            count:
              'exact',

            head:
              true,
          }
        ),

      /* =====================================================
         TOTAL MENUNGGU
      ===================================================== */

      supabaseAdmin
        .from(
          'permohonan'
        )
        .select(
          'id',
          {
            count:
              'exact',

            head:
              true,
          }
        )
        .eq(
          'status',
          'Menunggu'
        ),

      /* =====================================================
         5 PERMOHONAN TERBARU
         HANYA YANG BELUM DISENTUH / MENUNGGU
      ===================================================== */

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
        .eq(
          'status',
          'Menunggu'
        )
        .order(
          'created_at',
          {
            ascending:
              false,
          }
        )
        .limit(
          MAX_PERMOHONAN_DASHBOARD
        ),
    ]);

  /* =======================================================
     ERROR LOG
  ======================================================= */

  logQueryError(
    'Gagal mengambil jumlah warga aktif:',
    pendudukResult.error
  );

  logQueryError(
    'Gagal mengambil jumlah berita:',
    beritaResult.error
  );

  logQueryError(
    'Gagal mengambil jumlah layanan:',
    layananResult.error
  );

  logQueryError(
    'Gagal mengambil jumlah produk UMKM:',
    umkmResult.error
  );

  logQueryError(
    'Gagal mengambil jumlah permohonan:',
    permohonanResult.error
  );

  logQueryError(
    'Gagal mengambil jumlah permohonan menunggu:',
    permohonanMenungguResult.error
  );

  logQueryError(
    'Gagal mengambil permohonan terbaru:',
    permohonanTerbaruResult.error
  );

  /* =======================================================
     PERMOHONAN
  ======================================================= */

  const permohonanRows =
    (
      permohonanTerbaruResult.data ??
      []
    ) as PermohonanRow[];

  /* =======================================================
     DAFTAR NIK
  ======================================================= */

  const daftarNik = [
    ...new Set(
      permohonanRows
        .map(
          (
            item
          ) =>
            normalisasiNik(
              String(
                item.warga_nik ??
                  ''
              )
            )
        )
        .filter(
          (
            nik
          ) =>
            /^\d{16}$/.test(
              nik
            )
        )
    ),
  ];

  /* =======================================================
     HASH NIK
  ======================================================= */

  const nikHashMap =
    new Map<
      string,
      string
    >();

  const secret =
    process.env
      .NIK_HASH_SECRET;

  if (
    !secret ||
    secret.length <
      32
  ) {
    console.error(
      'NIK_HASH_SECRET belum tersedia atau kurang dari 32 karakter. Nama warga pada permohonan tidak dapat dicocokkan.'
    );
  } else {
    daftarNik.forEach(
      (
        nik
      ) => {
        nikHashMap.set(
          nik,
          hashNik(
            nik,
            secret
          )
        );
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
     LAYANAN ID
  ======================================================= */

  const daftarLayananId = [
    ...new Set(
      permohonanRows
        .map(
          (
            item
          ) =>
            Number(
              item.layanan_id
            )
        )
        .filter(
          (
            id
          ) =>
            Number.isInteger(
              id
            ) &&
            id >
              0
        )
    ),
  ];

  let wargaRows:
    WargaRow[] = [];

  let layananRows:
    LayananRow[] = [];

  /* =======================================================
     AMBIL NAMA WARGA
  ======================================================= */

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
          nama_lengkap
        `)
        .in(
          'nik_hash',
          daftarNikHash
        );

    logQueryError(
      'Gagal mengambil nama warga pemohon:',
      wargaResult.error
    );

    wargaRows =
      (
        wargaResult.data ??
        []
      ) as WargaRow[];
  }

  /* =======================================================
     AMBIL NAMA LAYANAN
  ======================================================= */

  if (
    daftarLayananId.length >
    0
  ) {
    const layananNamaResult =
      await supabaseAdmin
        .from(
          'layanan'
        )
        .select(`
          id,
          nama
        `)
        .in(
          'id',
          daftarLayananId
        );

    logQueryError(
      'Gagal mengambil nama layanan:',
      layananNamaResult.error
    );

    layananRows =
      (
        layananNamaResult.data ??
        []
      ) as LayananRow[];
  }

  /* =======================================================
     MAP WARGA
  ======================================================= */

  const wargaMap =
    new Map(
      wargaRows.map(
        (
          warga
        ) => [
          String(
            warga.nik_hash
          ),

          warga.nama_lengkap,
        ]
      )
    );

  /* =======================================================
     MAP LAYANAN
  ======================================================= */

  const layananMap =
    new Map(
      layananRows.map(
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
     NORMALIZE PERMOHONAN
  ======================================================= */

  const permohonanTerbaru:
    PermohonanTerbaru[] =
    permohonanRows.map(
      (
        item
      ) => {
        const nik =
          normalisasiNik(
            String(
              item.warga_nik ??
                ''
            )
          );

        const nikHash =
          nikHashMap.get(
            nik
          ) ??
          '';

        return {
          id:
            Number(
              item.id
            ),

          namaPemohon:
            wargaMap.get(
              nikHash
            ) ??
            'Warga Desa Keji',

          nikLast4:
            nik.length >=
            4
              ? nik.slice(
                  -4
                )
              : '----',

          namaLayanan:
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
            String(
              item.status ??
                'Menunggu'
            ),

          createdAt:
            item.created_at,
        };
      }
    );

  /* =======================================================
     RETURN
  ======================================================= */

  return {
    totalPenduduk:
      pendudukResult.error
        ? 0
        : pendudukResult.count ??
          0,

    totalBerita:
      beritaResult.error
        ? 0
        : beritaResult.count ??
          0,

    totalLayanan:
      layananResult.error
        ? 0
        : layananResult.count ??
          0,

    totalUmkm:
      umkmResult.error
        ? 0
        : umkmResult.count ??
          0,

    totalPermohonan:
      permohonanResult.error
        ? 0
        : permohonanResult.count ??
          0,

    totalMenunggu:
      permohonanMenungguResult.error
        ? 0
        : permohonanMenungguResult.count ??
          0,

    permohonanTerbaru,
  };
}

/* =========================================================
   REFRESH
========================================================= */

async function refreshDashboard() {
  'use server';

  revalidatePath(
    '/admin'
  );

  revalidatePath(
    '/admin/permohonan'
  );
}

/* =========================================================
   PAGE
========================================================= */

export default async function AdminDashboardPage() {
  const dashboard =
    await getDashboardData();

  /* =======================================================
     MODULE STATS
  ======================================================= */

  const totalModul =
    publicContentModules.length;

  const totalModulAktif =
    publicContentModules.filter(
      (
        item
      ) =>
        item.enabled
    ).length;

  const totalModulBelumAktif =
    totalModul -
    totalModulAktif;

  const persentaseModul =
    totalModul ===
    0
      ? 0
      : Math.round(
          (
            totalModulAktif /
            totalModul
          ) *
            100
        );

  /* =======================================================
     STATISTIK DASHBOARD
  ======================================================= */

  const statistik:
    StatistikDashboard[] = [
      {
        title:
          'Warga Terdaftar',

        value:
          dashboard.totalPenduduk.toLocaleString(
            'id-ID'
          ),

        description:
          'Warga aktif dalam database',

        href:
          '/admin/warga',

        icon:
          Users,
      },

      {
        title:
          'Permohonan Masuk',

        value:
          dashboard.totalPermohonan.toLocaleString(
            'id-ID'
          ),

        description:
          `${dashboard.totalMenunggu.toLocaleString(
            'id-ID'
          )} belum ditangani`,

        href:
          '/admin/permohonan',

        icon:
          FileText,
      },

      {
        title:
          'Total Berita',

        value:
          dashboard.totalBerita.toLocaleString(
            'id-ID'
          ),

        description:
          'Artikel dalam sistem',

        href:
          '/admin/berita',

        icon:
          Newspaper,
      },

      {
        title:
          'Layanan Aktif',

        value:
          dashboard.totalLayanan.toLocaleString(
            'id-ID'
          ),

        description:
          'Layanan publik yang aktif',

        icon:
          ListChecks,
      },

      {
        title:
          'Produk UMKM',

        value:
          dashboard.totalUmkm.toLocaleString(
            'id-ID'
          ),

        description:
          'Produk pada Lapak UMKM',

        icon:
          ShoppingCart,
      },

      {
        title:
          'Modul Publik',

        value:
          totalModul.toLocaleString(
            'id-ID'
          ),

        description:
          `${totalModulAktif} modul admin telah aktif`,

        icon:
          LayoutGrid,
      },
    ];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] px-6 py-7 text-white shadow-xl shadow-emerald-950/10 sm:px-8 sm:py-8">
        <div
          aria-hidden="true"
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

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border-[40px] border-white/[0.04]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-32 h-52 w-52 rounded-full bg-emerald-300/10 blur-3xl"
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}

          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-emerald-50 backdrop-blur-md">
              <CalendarDays
                size={14}
              />

              Pusat administrasi dan
              publikasi
            </div>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Dashboard Admin Desa
              Keji
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-emerald-50/80 sm:text-base">
              Kelola data warga,
              permohonan layanan,
              berita, galeri,
              informasi publik,
              pembangunan, dan
              seluruh konten website
              Desa Keji melalui satu
              dashboard.
            </p>
          </div>

          {/* ACTION */}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/15"
            >
              <Eye
                size={17}
              />

              Lihat Website Publik

              <ArrowUpRight
                size={15}
              />
            </Link>

            <form
              action={
                refreshDashboard
              }
            >
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white px-4 py-3 text-sm font-extrabold text-emerald-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50"
              >
                <RefreshCw
                  size={17}
                />

                Segarkan Data
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATISTIK UTAMA
      ===================================================== */}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {statistik.map(
          (
            item
          ) => (
            <StatistikCard
              key={
                item.title
              }
              item={
                item
              }
            />
          )
        )}
      </section>

      {/* =====================================================
          PERMOHONAN + PROGRES MODUL
      ===================================================== */}

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        {/* ===================================================
            PERMOHONAN TERBARU
        =================================================== */}

        <article className="min-w-0 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_12px_35px_rgba(6,78,59,0.07)]">
          {/* HEADER */}

          <div className="flex flex-col gap-4 border-b border-emerald-50 bg-gradient-to-r from-emerald-50/80 via-white to-white px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                  Administrasi Warga
                </p>

                {dashboard.totalMenunggu >
                  0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-amber-700">
                    <Clock3
                      size={11}
                    />

                    {
                      dashboard.totalMenunggu
                    }{' '}
                    Menunggu
                  </span>
                )}
              </div>

              <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
                Permohonan Layanan
                Terbaru
              </h2>

              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
                Maksimal lima
                permohonan terbaru yang
                belum ditangani.
                Permohonan otomatis
                hilang dari dashboard
                setelah statusnya
                diubah dari Menunggu.
              </p>
            </div>

            <Link
              href="/admin/permohonan?status=menunggu"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white transition hover:bg-emerald-800"
            >
              Kelola Semua

              <ArrowUpRight
                size={16}
              />
            </Link>
          </div>

          {/* =================================================
              EMPTY
          ================================================= */}

          {dashboard
            .permohonanTerbaru
            .length ===
          0 ? (
            <div className="flex min-h-[340px] flex-col items-center justify-center px-6 py-14 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                <CheckCircle2
                  size={29}
                />
              </div>

              <h3 className="mt-5 text-base font-extrabold text-slate-800">
                Tidak ada permohonan
                baru
              </h3>

              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                Seluruh permohonan yang
                masuk sudah mulai
                ditangani. Permohonan
                baru dengan status
                Menunggu akan muncul
                otomatis di sini.
              </p>

              <Link
                href="/admin/permohonan"
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-100"
              >
                <FileText
                  size={16}
                />

                Lihat Riwayat
                Permohonan
              </Link>
            </div>
          ) : (
            /* =================================================
                SLIDER
            ================================================= */

            <div className="p-5 sm:p-6">
              {/* Slider info */}

              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <ChevronLeft
                    size={15}
                    className="text-emerald-600"
                  />

                  Geser untuk melihat
                  permohonan lainnya

                  <ChevronRight
                    size={15}
                    className="text-emerald-600"
                  />
                </div>

                <span className="w-fit rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-extrabold text-emerald-700">
                  Menampilkan{' '}
                  {
                    dashboard
                      .permohonanTerbaru
                      .length
                  }{' '}
                  dari maksimal 5
                </span>
              </div>

              {/* Horizontal slider */}

              <div
                className="
                  flex
                  snap-x
                  snap-mandatory
                  gap-4
                  overflow-x-auto
                  scroll-smooth
                  pb-3
                  [scrollbar-color:#a7f3d0_transparent]
                  [scrollbar-width:thin]
                "
              >
                {dashboard.permohonanTerbaru.map(
                  (
                    item,
                    index
                  ) => (
                    <PermohonanSlideCard
                      key={
                        item.id
                      }
                      item={
                        item
                      }
                      index={
                        index
                      }
                      total={
                        dashboard
                          .permohonanTerbaru
                          .length
                      }
                    />
                  )
                )}
              </div>

              {/* Pagination indicator */}

              {dashboard
                .permohonanTerbaru
                .length >
                1 && (
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  {dashboard.permohonanTerbaru.map(
                    (
                      item,
                      index
                    ) => (
                      <a
                        key={
                          item.id
                        }
                        href={`#permohonan-dashboard-${item.id}`}
                        aria-label={`Lihat permohonan ${index + 1}`}
                        className="flex h-8 min-w-8 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 px-2 text-[10px] font-extrabold text-emerald-700 transition hover:border-emerald-700 hover:bg-emerald-700 hover:text-white"
                      >
                        {index +
                          1}
                      </a>
                    )
                  )}
                </div>
              )}

              {/* Remaining pending */}

              {dashboard.totalMenunggu >
                MAX_PERMOHONAN_DASHBOARD && (
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                  <CircleAlert
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="text-xs font-extrabold">
                      Masih ada{' '}
                      {(
                        dashboard.totalMenunggu -
                        MAX_PERMOHONAN_DASHBOARD
                      ).toLocaleString(
                        'id-ID'
                      )}{' '}
                      permohonan lain
                      yang belum
                      ditangani.
                    </p>

                    <p className="mt-1 text-[11px] font-medium leading-5 text-amber-700">
                      Dashboard hanya
                      menampilkan lima
                      permohonan terbaru.
                      Buka halaman
                      Permohonan Layanan
                      untuk melihat
                      seluruh antrean.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </article>

        {/* ===================================================
            PROGRES MODUL
        =================================================== */}

        <article className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_12px_35px_rgba(6,78,59,0.07)] sm:p-7">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                Status Integrasi
              </p>

              <h2 className="mt-2 text-xl font-black text-slate-900">
                Progres Modul Admin
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <CheckCircle2
                size={23}
              />
            </div>
          </div>

          <p className="mt-6 text-5xl font-black tracking-tight text-slate-900">
            {persentaseModul}%
          </p>

          <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
            {totalModulAktif} dari{' '}
            {totalModul} modul publik
            telah memiliki halaman
            pengelolaan admin.
          </p>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-emerald-50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-800"
              style={{
                width:
                  `${persentaseModul}%`,
              }}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-2xl font-black text-emerald-700">
                {
                  totalModulAktif
                }
              </p>

              <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-emerald-800">
                Sudah aktif
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="text-2xl font-black text-amber-700">
                {
                  totalModulBelumAktif
                }
              </p>

              <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-amber-800">
                Belum dibuat
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <CircleAlert
                size={18}
                className="mt-0.5 shrink-0 text-amber-700"
              />

              <p className="text-xs font-semibold leading-5 text-amber-900">
                Modul berlabel
                &quot;Segera&quot;
                pada sidebar belum
                memiliki halaman
                admin.
              </p>
            </div>
          </div>
        </article>
      </section>

      {/* =====================================================
          PUSAT PENGELOLAAN KONTEN
      ===================================================== */}

      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_12px_35px_rgba(6,78,59,0.07)]">
        <div className="flex flex-col gap-5 border-b border-emerald-50 bg-gradient-to-r from-emerald-50/80 via-white to-white px-6 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-7">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
              Konten Website Publik
            </p>

            <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
              Pusat Pengelolaan
              Konten
            </h2>

            <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500">
              Seluruh bagian pada
              website publik
              ditampilkan di sini.
              Modul aktif dapat
              langsung dikelola.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
            <Database
              size={22}
              className="text-emerald-700"
            />

            <div>
              <p className="text-xl font-black text-slate-900">
                {totalModul}
              </p>

              <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                Modul publik
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7 xl:grid-cols-3 2xl:grid-cols-4">
          {publicContentModules.map(
            (
              module
            ) => (
              <ModuleCard
                key={
                  module.id
                }
                module={
                  module
                }
              />
            )
          )}
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   STATISTIK CARD
========================================================= */

function StatistikCard({
  item,
}: {
  item:
    StatistikDashboard;
}) {
  const Icon =
    item.icon;

  const content = (
    <article className="group relative h-full overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_12px_35px_rgba(6,78,59,0.07)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_45px_rgba(6,78,59,0.12)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-600 to-emerald-800" />

      <div className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-emerald-50" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
            {
              item.title
            }
          </p>

          <p className="mt-4 text-4xl font-black tracking-tight text-slate-900">
            {
              item.value
            }
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 transition group-hover:bg-emerald-600 group-hover:text-white">
          <Icon
            size={23}
            strokeWidth={
              2.1
            }
          />
        </div>
      </div>

      <div className="relative mt-5 flex items-center justify-between border-t border-emerald-50 pt-4">
        <p className="text-sm font-medium text-slate-500">
          {
            item.description
          }
        </p>

        {item.href && (
          <ArrowUpRight
            size={17}
            className="shrink-0 text-emerald-300 transition group-hover:text-emerald-700"
          />
        )}
      </div>
    </article>
  );

  if (
    !item.href
  ) {
    return content;
  }

  return (
    <Link
      href={
        item.href
      }
      className="block h-full"
    >
      {content}
    </Link>
  );
}

/* =========================================================
   PERMOHONAN SLIDE CARD
========================================================= */

function PermohonanSlideCard({
  item,
  index,
  total,
}: {
  item:
    PermohonanTerbaru;

  index:
    number;

  total:
    number;
}) {
  const whatsappNumber =
    getWhatsAppNumber(
      item.noWa
    );

  const message =
    encodeURIComponent(
      `Halo ${item.namaPemohon}, permohonan layanan ${item.namaLayanan} Anda sedang kami tindak lanjuti oleh Pemerintah Desa Keji.`
    );

  return (
    <article
      id={`permohonan-dashboard-${item.id}`}
      className="min-w-full snap-center overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm"
    >
      {/* TOP */}

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-50 bg-gradient-to-r from-emerald-50 to-white px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-[10px] font-black text-white">
            {index +
              1}
          </span>

          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-emerald-700">
            Permohonan Baru
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-amber-700">
            <Clock3
              size={11}
            />

            Menunggu
          </span>

          <span className="text-[10px] font-bold text-slate-400">
            {index +
              1}{' '}
            / {total}
          </span>
        </div>
      </div>

      {/* BODY */}

      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          {/* USER ICON */}

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <UserRound
              size={21}
            />
          </div>

          {/* USER INFO */}

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-black text-slate-900">
              {
                item.namaPemohon
              }
            </h3>

            <p className="mt-2 text-sm font-extrabold leading-6 text-emerald-700">
              {
                item.namaLayanan
              }
            </p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
              <span>
                NIK ••••{' '}
                {
                  item.nikLast4
                }
              </span>

              <span>
                {formatTanggal(
                  item.createdAt
                )}
              </span>

              <span>
                {
                  item.noWa ||
                  '-'
                }
              </span>
            </div>
          </div>
        </div>

        {/* INFO */}

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <Clock3
            size={17}
            className="mt-0.5 shrink-0 text-amber-700"
          />

          <p className="text-xs font-semibold leading-5 text-amber-800">
            Permohonan ini belum
            ditangani. Setelah status
            diubah menjadi Diproses,
            Selesai, atau Ditolak,
            permohonan tidak lagi
            tampil pada dashboard.
          </p>
        </div>

        {/* ACTION */}

        <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
          {whatsappNumber ? (
            <a
              href={`https://wa.me/${whatsappNumber}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-100"
            >
              <MessageCircle
                size={15}
              />

              WhatsApp
            </a>
          ) : (
            <span className="inline-flex min-h-10 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-extrabold text-slate-400">
              <MessageCircle
                size={15}
              />

              WhatsApp
            </span>
          )}

          <Link
            href={`/admin/permohonan?status=menunggu&q=${encodeURIComponent(
              item.namaPemohon
            )}`}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-800"
          >
            Kelola Permohonan

            <ArrowUpRight
              size={14}
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   MODULE CARD
========================================================= */

function ModuleCard({
  module,
}: {
  module:
    AdminNavigationItem;
}) {
  const Icon =
    module.icon;

  return (
    <article className="group flex min-h-[275px] min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
      {/* TOP */}

      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition ${
            module.enabled
              ? 'bg-emerald-700 text-white'
              : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-700'
          }`}
        >
          <Icon
            size={23}
          />
        </div>

        <span
          className={`rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] ${
            module.enabled
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {module.enabled
            ? 'Aktif'
            : 'Belum dibuat'}
        </span>
      </div>

      {/* CONTENT */}

      <h3 className="mt-5 text-lg font-black text-slate-900">
        {
          module.label
        }
      </h3>

      <p className="mt-2 flex-1 text-sm font-medium leading-6 text-slate-500">
        {
          module.description
        }
      </p>

      {/* ACTION */}

      <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
        {module.enabled ? (
          <Link
            href={
              module.href
            }
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 text-xs font-extrabold text-white transition hover:bg-emerald-800"
          >
            Kelola

            <ArrowUpRight
              size={14}
            />
          </Link>
        ) : (
          <div className="inline-flex min-h-10 items-center justify-center rounded-xl bg-slate-100 px-3 text-center text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-400">
            Tahap berikutnya
          </div>
        )}

        {module.publicHref ? (
          <Link
            href={
              module.publicHref
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Eye
              size={14}
            />

            Publik
          </Link>
        ) : (
          <div />
        )}
      </div>
    </article>
  );
}