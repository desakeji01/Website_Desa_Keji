// app/(public)/pembangunan/page.tsx

import type {
  Metadata,
} from 'next';

import Link from 'next/link';

import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  Database,
  Gauge,
  Hammer,
  HardHat,
  Image as ImageIcon,
  Landmark,
  LineChart,
  MapPin,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import {
  STATUS_IDM_OPTIONS,
  type RiwayatIdm,
  type StatusIdm,
} from '@/types/idm';

import {
  STATUS_PEMBANGUNAN_OPTIONS,
  type ProyekPembangunan,
  type StatusPembangunan,
} from '@/types/pembangunan';

import type {
  SdgsDesa,
} from '@/types/sdgs';

/* =========================================================
   METADATA
========================================================= */

export const metadata:
  Metadata = {
  title:
    'Pembangunan Desa Keji | SIJI',

  description:
    'Informasi perencanaan, pelaksanaan, progres, hasil pembangunan, Indeks Desa Membangun, dan SDGs Desa Keji.',
};

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

/* =========================================================
   TYPES
========================================================= */

interface TahapPembangunan {
  nomor: string;

  nama: string;

  deskripsi: string;

  icon: LucideIcon;
}

interface FokusPembangunan {
  nama: string;

  deskripsi: string;

  icon: LucideIcon;
}

/* =========================================================
   STATIC DATA
========================================================= */

const tahapPembangunan:
  TahapPembangunan[] = [
    {
      nomor:
        '01',

      nama:
        'Perencanaan',

      deskripsi:
        'Usulan kebutuhan dihimpun, dibahas, dan diprioritaskan melalui proses perencanaan desa.',

      icon:
        ClipboardList,
    },

    {
      nomor:
        '02',

      nama:
        'Penganggaran',

      deskripsi:
        'Kegiatan yang disepakati dimasukkan dalam dokumen perencanaan dan penganggaran desa.',

      icon:
        CircleDollarSign,
    },

    {
      nomor:
        '03',

      nama:
        'Pelaksanaan',

      deskripsi:
        'Pekerjaan dilaksanakan sesuai jadwal, spesifikasi, anggaran, dan ketentuan yang berlaku.',

      icon:
        HardHat,
    },

    {
      nomor:
        '04',

      nama:
        'Pelaporan',

      deskripsi:
        'Progres, hasil, dokumentasi, dan penggunaan anggaran disampaikan secara terbuka.',

      icon:
        BadgeCheck,
    },
  ];

const fokusPembangunan:
  FokusPembangunan[] = [
    {
      nama:
        'Infrastruktur Desa',

      deskripsi:
        'Peningkatan jalan lingkungan, drainase, fasilitas umum, dan sarana pendukung desa.',

      icon:
        Route,
    },

    {
      nama:
        'Pelayanan Dasar',

      deskripsi:
        'Penguatan sarana pendidikan, kesehatan, administrasi, dan pelayanan masyarakat.',

      icon:
        Building2,
    },

    {
      nama:
        'Pemberdayaan Masyarakat',

      deskripsi:
        'Program peningkatan kapasitas, ekonomi produktif, dan partisipasi masyarakat.',

      icon:
        UsersRound,
    },

    {
      nama:
        'Lingkungan dan Potensi Desa',

      deskripsi:
        'Pengelolaan lingkungan, ruang publik, wisata, budaya, serta potensi unggulan desa.',

      icon:
        Sparkles,
    },
  ];

/* =========================================================
   COMMON HELPERS
========================================================= */

function safeString(
  value: unknown
) {
  return String(
    value ?? ''
  ).trim();
}

function nullableString(
  value: unknown
) {
  const text =
    safeString(
      value
    );

  return text || null;
}

/* =========================================================
   PEMBANGUNAN HELPERS
========================================================= */

function isStatusPembangunan(
  value: string
): value is StatusPembangunan {
  return (
    STATUS_PEMBANGUNAN_OPTIONS as readonly string[]
  ).includes(
    value
  );
}

function normalizePembangunan(
  value: unknown
): ProyekPembangunan | null {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(
      value
    )
  ) {
    return null;
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  const id =
    safeString(
      row.id
    );

  const nama =
    safeString(
      row.nama
    );

  const lokasi =
    safeString(
      row.lokasi
    );

  const tahun =
    Number(
      row.tahun ??
        0
    );

  const anggaran =
    Number(
      row.anggaran ??
        0
    );

  const progres =
    Number(
      row.progres ??
        0
    );

  const status =
    safeString(
      row.status
    );

  if (
    !id ||
    !nama ||
    !lokasi ||
    !Number.isInteger(
      tahun
    ) ||
    !Number.isFinite(
      anggaran
    ) ||
    !Number.isInteger(
      progres
    ) ||
    !isStatusPembangunan(
      status
    )
  ) {
    return null;
  }

  return {
    id,

    nama,

    lokasi,

    tahun,

    sumber_dana:
      safeString(
        row.sumber_dana
      ),

    anggaran,

    progres,

    status,

    deskripsi:
      safeString(
        row.deskripsi
      ),

    gambar_url:
      nullableString(
        row.gambar_url
      ),

    aktif:
      Boolean(
        row.aktif
      ),

    urutan:
      Number(
        row.urutan ??
          0
      ),

    created_at:
      safeString(
        row.created_at
      ),

    updated_at:
      safeString(
        row.updated_at
      ),
  };
}

function formatRupiah(
  value: number
) {
  return new Intl.NumberFormat(
    'id-ID',
    {
      style:
        'currency',

      currency:
        'IDR',

      minimumFractionDigits:
        0,

      maximumFractionDigits:
        0,
    }
  ).format(
    Number.isFinite(
      value
    )
      ? value
      : 0
  );
}

function getStatusClass(
  status:
    StatusPembangunan
) {
  switch (
    status
  ) {
    case 'Selesai':
      return 'bg-emerald-100 text-emerald-700';

    case 'Berjalan':
      return 'bg-cyan-100 text-cyan-700';

    case 'Perencanaan':
      return 'bg-amber-100 text-amber-700';

    default:
      return 'bg-slate-100 text-slate-700';
  }
}

/* =========================================================
   IDM HELPERS
========================================================= */

function isStatusIdm(
  value: string
): value is StatusIdm {
  return (
    STATUS_IDM_OPTIONS as readonly string[]
  ).includes(
    value
  );
}

function normalizeRiwayatIdm(
  value: unknown
): RiwayatIdm | null {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(
      value
    )
  ) {
    return null;
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  const id =
    safeString(
      row.id
    );

  const tahun =
    Number(
      row.tahun ??
        0
    );

  const nilai =
    Number(
      row.nilai ??
        0
    );

  const status =
    safeString(
      row.status
    );

  if (
    !id ||
    !Number.isInteger(
      tahun
    ) ||
    !Number.isFinite(
      nilai
    ) ||
    !isStatusIdm(
      status
    )
  ) {
    return null;
  }

  return {
    id,

    tahun,

    nilai,

    status,

    keterangan:
      nullableString(
        row.keterangan
      ),

    aktif:
      Boolean(
        row.aktif
      ),

    created_at:
      safeString(
        row.created_at
      ),

    updated_at:
      safeString(
        row.updated_at
      ),
  };
}

function formatNilaiIdm(
  value: number
) {
  return new Intl.NumberFormat(
    'id-ID',
    {
      minimumFractionDigits:
        4,

      maximumFractionDigits:
        4,
    }
  ).format(
    value
  );
}

/* =========================================================
   SDGS HELPERS
========================================================= */

function normalizeSdgs(
  value: unknown
): SdgsDesa | null {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(
      value
    )
  ) {
    return null;
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  const id =
    Number(
      row.id ??
        0
    );

  const nama =
    safeString(
      row.nama
    );

  const skor =
    Number(
      row.skor ??
        0
    );

  const warna =
    safeString(
      row.warna
    ) ||
    '#047857';

  const tahunData =
    Number(
      row.tahun_data ??
        new Date()
          .getFullYear()
    );

  if (
    !Number.isInteger(
      id
    ) ||
    id <=
      0 ||
    !nama ||
    !Number.isFinite(
      skor
    ) ||
    !Number.isInteger(
      tahunData
    )
  ) {
    return null;
  }

  return {
    id,

    nama,

    skor,

    warna,

    tahun_data:
      tahunData,

    aktif:
      Boolean(
        row.aktif
      ),

    updated_at:
      safeString(
        row.updated_at
      ),
  };
}

function formatSkorSdgs(
  value: number
) {
  return new Intl.NumberFormat(
    'id-ID',
    {
      minimumFractionDigits:
        0,

      maximumFractionDigits:
        2,
    }
  ).format(
    value
  );
}

function getKategoriSkorSdgs(
  skor: number
) {
  if (
    skor >=
    80
  ) {
    return 'Sangat Baik';
  }

  if (
    skor >=
    60
  ) {
    return 'Baik';
  }

  if (
    skor >=
    40
  ) {
    return 'Cukup';
  }

  if (
    skor >
    0
  ) {
    return 'Perlu Ditingkatkan';
  }

  return 'Belum Diisi';
}

/* =========================================================
   PAGE
========================================================= */

export default async function PembangunanPage() {
  /* =======================================================
     FETCH DATA
  ======================================================= */

  const [
    pembangunanResult,
    idmResult,
    sdgsResult,
  ] =
    await Promise.all([
      /* =====================================================
         PROYEK PEMBANGUNAN
      ===================================================== */

      supabaseAdmin
        .from(
          'proyek_pembangunan'
        )
        .select(`
          id,
          nama,
          lokasi,
          tahun,
          sumber_dana,
          anggaran,
          progres,
          status,
          deskripsi,
          gambar_url,
          aktif,
          urutan,
          created_at,
          updated_at
        `)
        .eq(
          'aktif',
          true
        )
        .order(
          'tahun',
          {
            ascending:
              false,
          }
        )
        .order(
          'urutan',
          {
            ascending:
              true,
          }
        )
        .order(
          'created_at',
          {
            ascending:
              false,
          }
        ),

      /* =====================================================
         IDM
      ===================================================== */

      supabaseAdmin
        .from(
          'idm_riwayat'
        )
        .select(`
          id,
          tahun,
          nilai,
          status,
          keterangan,
          aktif,
          created_at,
          updated_at
        `)
        .eq(
          'aktif',
          true
        )
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
        ),

      /* =====================================================
         SDGS
      ===================================================== */

      supabaseAdmin
        .from(
          'sdgs_desa'
        )
        .select(`
          id,
          nama,
          skor,
          warna,
          tahun_data,
          aktif,
          updated_at
        `)
        .eq(
          'aktif',
          true
        )
        .order(
          'id',
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
    pembangunanResult.error
  ) {
    console.error(
      'Gagal mengambil proyek pembangunan:',
      {
        message:
          pembangunanResult
            .error
            .message,

        code:
          pembangunanResult
            .error
            .code,

        details:
          pembangunanResult
            .error
            .details,

        hint:
          pembangunanResult
            .error
            .hint,
      }
    );
  }

  if (
    idmResult.error
  ) {
    console.error(
      'Gagal mengambil riwayat IDM:',
      {
        message:
          idmResult
            .error
            .message,

        code:
          idmResult
            .error
            .code,

        details:
          idmResult
            .error
            .details,

        hint:
          idmResult
            .error
            .hint,
      }
    );
  }

  if (
    sdgsResult.error
  ) {
    console.error(
      'Gagal mengambil data SDGs Desa:',
      {
        message:
          sdgsResult
            .error
            .message,

        code:
          sdgsResult
            .error
            .code,

        details:
          sdgsResult
            .error
            .details,

        hint:
          sdgsResult
            .error
            .hint,
      }
    );
  }

  /* =======================================================
     NORMALIZE PEMBANGUNAN
  ======================================================= */

  const seluruhProyek =
    (
      pembangunanResult
        .data ??
      []
    )
      .map(
        normalizePembangunan
      )
      .filter(
        (
          item
        ): item is ProyekPembangunan =>
          item !==
          null
      );

  /* =======================================================
     NORMALIZE IDM
  ======================================================= */

  const riwayatIdm =
    (
      idmResult
        .data ??
      []
    )
      .map(
        normalizeRiwayatIdm
      )
      .filter(
        (
          item
        ): item is RiwayatIdm =>
          item !==
          null
      );

  const statusIdmTerbaru =
    riwayatIdm[0] ??
    null;

  /* =======================================================
     NORMALIZE SDGS
  ======================================================= */

  const daftarSdgs =
    (
      sdgsResult.data ??
      []
    )
      .map(
        normalizeSdgs
      )
      .filter(
        (
          item
        ): item is SdgsDesa =>
          item !==
          null
      );

  const jumlahGoalSdgs =
    daftarSdgs.length;

  const rataRataSdgs =
    jumlahGoalSdgs >
    0
      ? daftarSdgs.reduce(
          (
            total,
            item
          ) =>
            total +
            item.skor,
          0
        ) /
        jumlahGoalSdgs
      : 0;

  const goalTertinggiSdgs =
    daftarSdgs.reduce<
      SdgsDesa | null
    >(
      (
        tertinggi,
        item
      ) => {
        if (
          !tertinggi ||
          item.skor >
            tertinggi.skor
        ) {
          return item;
        }

        return tertinggi;
      },
      null
    );

  const tahunSdgs =
    daftarSdgs[0]
      ?.tahun_data ??
    null;

  /* =======================================================
     PEMBANGUNAN SUMMARY
  ======================================================= */

  const tahunAktif =
    seluruhProyek[0]
      ?.tahun ??
    new Date()
      .getFullYear();

  const proyekPembangunan =
    seluruhProyek.filter(
      (
        item
      ) =>
        item.tahun ===
        tahunAktif
    );

  const totalKegiatan =
    proyekPembangunan.length;

  const kegiatanSelesai =
    proyekPembangunan.filter(
      (
        item
      ) =>
        item.status ===
        'Selesai'
    ).length;

  const kegiatanBerjalan =
    proyekPembangunan.filter(
      (
        item
      ) =>
        item.status ===
        'Berjalan'
    ).length;

  const totalAnggaran =
    proyekPembangunan.reduce(
      (
        total,
        item
      ) =>
        total +
        item.anggaran,
      0
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen overflow-x-clip bg-slate-50">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative isolate overflow-hidden bg-emerald-950 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/images/pembangunan/hero-pembangunan.jpg'), url('/background.png')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#021b16] via-emerald-950/92 to-emerald-900/48" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#021b16] via-transparent to-black/25" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',

            backgroundSize:
              '28px 28px',
          }}
        />

        <div className="pointer-events-none absolute -left-32 -top-32 h-[430px] w-[430px] rounded-full bg-emerald-300/10 blur-[115px]" />

        <div className="pointer-events-none absolute -bottom-40 right-0 h-[470px] w-[470px] rounded-full bg-amber-300/[0.07] blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 md:pb-28 md:pt-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            {/* LEFT */}

            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-100 backdrop-blur">
                <Landmark
                  size={15}
                />

                Pemerintah Desa Keji
              </div>

              <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-300">
                Program dan
                Infrastruktur
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
                Pembangunan Desa
              </h1>

              <p className="mt-6 max-w-3xl text-sm font-medium leading-7 text-emerald-50/85 md:text-base md:leading-8">
                Informasi
                perencanaan,
                pelaksanaan,
                progres, anggaran,
                hasil pembangunan,
                Indeks Desa
                Membangun, serta
                capaian pembangunan
                berkelanjutan Desa
                Keji.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-bold backdrop-blur">
                  <CalendarDays
                    size={16}
                  />

                  Tahun{' '}
                  {
                    tahunAktif
                  }
                </span>

                <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-bold backdrop-blur">
                  <MapPin
                    size={16}
                  />

                  Desa Keji
                </span>
              </div>
            </div>

            {/* RIGHT */}

            <aside className="rounded-[2rem] border border-white/15 bg-black/25 p-6 shadow-2xl backdrop-blur-xl md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-300">
                    Ringkasan
                    Pembangunan
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-white">
                    Data Tahun{' '}
                    {
                      tahunAktif
                    }
                  </h2>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-emerald-200">
                  <Hammer
                    size={26}
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <HeroMetric
                  label="Total"
                  value={
                    totalKegiatan
                  }
                />

                <HeroMetric
                  label="Berjalan"
                  value={
                    kegiatanBerjalan
                  }
                />

                <HeroMetric
                  label="Selesai"
                  value={
                    kegiatanSelesai
                  }
                />
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200/15 bg-emerald-300/10 p-4">
                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-emerald-200"
                />

                <p className="text-xs font-semibold leading-5 text-emerald-50/75">
                  Informasi kegiatan
                  hanya ditampilkan
                  setelah data resmi
                  dipublikasikan oleh
                  administrator.
                </p>
              </div>

              <Link
                href={`/informasi-publik/apbdes/${tahunAktif}`}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-900 transition hover:bg-emerald-50"
              >
                Lihat APBDes{' '}
                {
                  tahunAktif
                }

                <ArrowRight
                  size={17}
                />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {/* =====================================================
          FLOATING SUMMARY
      ===================================================== */}

      <section className="relative z-20 -mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 sm:grid-cols-2 lg:grid-cols-4">
            <FloatingStat
              label="Tahapan"
              value="4"
              description="Perencanaan hingga pelaporan"
              icon={
                ClipboardList
              }
              primary
            />

            <FloatingStat
              label="Fokus Program"
              value="4"
              description="Bidang prioritas pembangunan"
              icon={
                BarChart3
              }
            />

            <FloatingStat
              label="Kegiatan"
              value={String(
                totalKegiatan
              )}
              description={`Data tahun ${tahunAktif}`}
              icon={
                Hammer
              }
            />

            <FloatingStat
              label="Total Anggaran"
              value={
                totalKegiatan >
                0
                  ? formatRupiah(
                      totalAnggaran
                    )
                  : '-'
              }
              description="Akumulasi kegiatan terpublikasi"
              icon={
                CircleDollarSign
              }
              compact
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8">
        {/* ===================================================
            PROSES PEMBANGUNAN
        =================================================== */}

        <section>
          <div className="mb-7">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
              Alur Pelaksanaan
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900 md:text-3xl">
              Proses Pembangunan Desa
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
              Setiap kegiatan
              dilaksanakan melalui
              tahapan yang terencana,
              terukur, dan dapat
              dipertanggungjawabkan.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {tahapPembangunan.map(
              (
                item
              ) => (
                <TahapCard
                  key={
                    item.nomor
                  }
                  item={
                    item
                  }
                />
              )
            )}
          </div>
        </section>

        {/* ===================================================
            FOKUS PEMBANGUNAN
        =================================================== */}

        <section className="mt-12 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-white p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                <Building2
                  size={23}
                />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                  Prioritas Program
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  Fokus Pembangunan
                  Desa Keji
                </h2>

                <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500">
                  Bidang pembangunan
                  disesuaikan dengan
                  kebutuhan masyarakat,
                  potensi wilayah, dan
                  hasil perencanaan
                  desa.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 md:p-8">
            {fokusPembangunan.map(
              (
                item
              ) => (
                <FokusCard
                  key={
                    item.nama
                  }
                  item={
                    item
                  }
                />
              )
            )}
          </div>
        </section>

        {/* ===================================================
            STATUS IDM
        =================================================== */}

        <section
          id="status-idm"
          className="mt-12 scroll-mt-24 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-sm"
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-7 text-white md:p-9">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(255,255,255,.55) 1px, transparent 1px)',

                backgroundSize:
                  '25px 25px',
              }}
            />

            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[50px] border-white/[0.04]" />

            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                  <Gauge
                    size={23}
                  />
                </div>

                <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
                  Indeks Desa
                  Membangun
                </p>

                <h2 className="mt-2 text-2xl font-black md:text-3xl">
                  Status Pembangunan
                  Desa
                </h2>

                <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                  Informasi status dan
                  perkembangan Desa
                  Keji berdasarkan
                  data Indeks Desa
                  Membangun yang telah
                  dipublikasikan.
                </p>
              </div>

              {statusIdmTerbaru ? (
                <div className="min-w-[240px] rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-200">
                    Status Terbaru
                  </p>

                  <p className="mt-2 text-2xl font-black">
                    {
                      statusIdmTerbaru
                        .status
                    }
                  </p>

                  <p className="mt-1 text-xs font-bold text-emerald-100/70">
                    Tahun{' '}
                    {
                      statusIdmTerbaru
                        .tahun
                    }
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-sm font-bold text-emerald-50">
                  Belum ada data IDM
                </div>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8">
            {statusIdmTerbaru ? (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <IdmMetric
                    icon={
                      Gauge
                    }
                    label="Nilai IDM"
                    value={formatNilaiIdm(
                      statusIdmTerbaru
                        .nilai
                    )}
                  />

                  <IdmMetric
                    icon={
                      TrendingUp
                    }
                    label="Status Desa"
                    value={
                      statusIdmTerbaru
                        .status
                    }
                  />

                  <IdmMetric
                    icon={
                      Database
                    }
                    label="Riwayat Data"
                    value={`${riwayatIdm.length} Tahun`}
                  />
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                  <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-700 text-white">
                      <Activity
                        size={20}
                      />
                    </div>

                    <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                      Tentang IDM
                    </p>

                    <h3 className="mt-2 text-xl font-black text-slate-900">
                      Gambaran
                      perkembangan desa
                    </h3>

                    <p className="mt-3 text-sm font-medium leading-7 text-slate-500">
                      Indeks Desa
                      Membangun digunakan
                      sebagai salah satu
                      gambaran kondisi
                      pembangunan desa
                      melalui aspek
                      sosial, ekonomi,
                      dan lingkungan.
                    </p>
                  </article>

                  <article className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
                    <ShieldCheck
                      size={23}
                      className="text-emerald-700"
                    />

                    <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                      Data Terpublikasi
                    </p>

                    <h3 className="mt-2 text-xl font-black text-emerald-950">
                      Data berdasarkan
                      riwayat aktif
                    </h3>

                    <p className="mt-3 text-sm font-medium leading-7 text-emerald-900/70">
                      Nilai dan status
                      yang ditampilkan
                      berasal dari data
                      yang telah
                      dimasukkan dan
                      diaktifkan melalui
                      administrator.
                    </p>
                  </article>
                </div>

                {statusIdmTerbaru
                  .keterangan && (
                  <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                      Keterangan Data
                      Terbaru
                    </p>

                    <p className="mt-2 text-sm font-medium leading-7 text-emerald-900/80">
                      {
                        statusIdmTerbaru
                          .keterangan
                      }
                    </p>
                  </div>
                )}

                <div className="mt-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                        <LineChart
                          size={20}
                        />
                      </div>

                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                          Perkembangan
                          Tahunan
                        </p>

                        <h3 className="mt-1 text-lg font-black text-slate-900">
                          Riwayat Status
                          IDM
                        </h3>
                      </div>
                    </div>

                    <span className="w-fit rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-extrabold text-slate-600">
                      {
                        riwayatIdm.length
                      }{' '}
                      Tahun Data
                    </span>
                  </div>

                  <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full min-w-[650px] border-separate border-spacing-0">
                      <thead>
                        <tr>
                          <th className="border-b border-slate-200 bg-slate-50 px-4 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                            Tahun
                          </th>

                          <th className="border-b border-slate-200 bg-slate-50 px-4 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                            Nilai IDM
                          </th>

                          <th className="border-b border-slate-200 bg-slate-50 px-4 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                            Status
                          </th>

                          <th className="border-b border-slate-200 bg-slate-50 px-4 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                            Keterangan
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {riwayatIdm.map(
                          (
                            item
                          ) => (
                            <tr
                              key={
                                item.id
                              }
                            >
                              <td className="border-b border-slate-100 px-4 py-4 text-sm font-black text-slate-700">
                                {
                                  item.tahun
                                }
                              </td>

                              <td className="border-b border-slate-100 px-4 py-4 text-sm font-black text-emerald-700">
                                {formatNilaiIdm(
                                  item.nilai
                                )}
                              </td>

                              <td className="border-b border-slate-100 px-4 py-4">
                                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-700">
                                  {
                                    item.status
                                  }
                                </span>
                              </td>

                              <td className="border-b border-slate-100 px-4 py-4 text-sm font-medium text-slate-500">
                                {item.keterangan ??
                                  '-'}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
                <Activity
                  size={42}
                  className="mx-auto text-slate-300"
                />

                <h3 className="mt-4 text-lg font-black text-slate-800">
                  Data IDM belum
                  dipublikasikan
                </h3>

                <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-6 text-slate-500">
                  Status, nilai, dan
                  riwayat IDM akan
                  ditampilkan pada
                  bagian ini setelah
                  data dimasukkan dan
                  diaktifkan melalui
                  administrator.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ===================================================
            SDGS DESA
        =================================================== */}

        <section
          id="sdgs-desa"
          className="mt-12 scroll-mt-24 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-sm"
        >
          {/* HEADER */}

          <div className="relative overflow-hidden bg-gradient-to-br from-[#052e24] via-emerald-800 to-teal-700 p-7 text-white md:p-9">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(255,255,255,.55) 1px, transparent 1px)',

                backgroundSize:
                  '25px 25px',
              }}
            />

            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[50px] border-white/[0.04]" />

            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                  <Target
                    size={23}
                  />
                </div>

                <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
                  Sustainable
                  Development Goals
                </p>

                <h2 className="mt-2 text-2xl font-black md:text-3xl">
                  SDGs Desa Keji
                </h2>

                <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                  Gambaran capaian
                  tujuan pembangunan
                  berkelanjutan Desa
                  Keji berdasarkan
                  data SDGs Desa yang
                  telah dipublikasikan
                  melalui sistem
                  administrator.
                </p>
              </div>

              {jumlahGoalSdgs >
              0 ? (
                <div className="min-w-[230px] rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-200">
                    Skor Rata-rata
                  </p>

                  <p className="mt-2 text-4xl font-black">
                    {formatSkorSdgs(
                      rataRataSdgs
                    )}
                  </p>

                  <p className="mt-1 text-xs font-bold text-emerald-100/70">
                    {getKategoriSkorSdgs(
                      rataRataSdgs
                    )}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-sm font-bold text-emerald-50">
                  Belum ada data SDGs
                </div>
              )}
            </div>
          </div>

          {/* CONTENT */}

          <div className="p-6 md:p-8">
            {jumlahGoalSdgs >
            0 ? (
              <>
                {/* SUMMARY */}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <SdgsMetric
                    icon={
                      Target
                    }
                    label="Jumlah Goal"
                    value={String(
                      jumlahGoalSdgs
                    )}
                    description="Tujuan pembangunan aktif"
                  />

                  <SdgsMetric
                    icon={
                      Gauge
                    }
                    label="Skor Rata-rata"
                    value={formatSkorSdgs(
                      rataRataSdgs
                    )}
                    description={getKategoriSkorSdgs(
                      rataRataSdgs
                    )}
                  />

                  <SdgsMetric
                    icon={
                      CalendarDays
                    }
                    label="Tahun Data"
                    value={
                      tahunSdgs
                        ? String(
                            tahunSdgs
                          )
                        : '-'
                    }
                    description="Periode data SDGs Desa"
                  />

                  <SdgsMetric
                    icon={
                      TrendingUp
                    }
                    label="Skor Tertinggi"
                    value={
                      goalTertinggiSdgs
                        ? formatSkorSdgs(
                            goalTertinggiSdgs
                              .skor
                          )
                        : '-'
                    }
                    description={
                      goalTertinggiSdgs
                        ?.nama ??
                      'Belum tersedia'
                    }
                  />
                </div>

                {/* DESCRIPTION */}

                <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                  <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-700 text-white">
                      <Target
                        size={20}
                      />
                    </div>

                    <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                      Tentang SDGs Desa
                    </p>

                    <h3 className="mt-2 text-xl font-black text-slate-900">
                      Arah pembangunan
                      berkelanjutan
                    </h3>

                    <p className="mt-3 text-sm font-medium leading-7 text-slate-500">
                      SDGs Desa
                      digunakan untuk
                      menggambarkan
                      capaian berbagai
                      tujuan pembangunan
                      pada aspek
                      ekonomi, sosial,
                      lingkungan,
                      hukum, tata
                      kelola, serta
                      kehidupan
                      masyarakat desa.
                    </p>
                  </article>

                  <article className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
                    <ShieldCheck
                      size={23}
                      className="text-emerald-700"
                    />

                    <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                      Data Terpublikasi
                    </p>

                    <h3 className="mt-2 text-xl font-black text-emerald-950">
                      Dikelola melalui
                      administrator
                    </h3>

                    <p className="mt-3 text-sm font-medium leading-7 text-emerald-900/70">
                      Data yang
                      ditampilkan
                      berasal dari
                      tabel SDGs Desa
                      dan hanya memuat
                      goal yang sedang
                      berstatus aktif.
                    </p>
                  </article>
                </div>

                {/* GOALS */}

                <div className="mt-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                        Capaian Goal
                      </p>

                      <h3 className="mt-2 text-xl font-black text-slate-900">
                        Skor SDGs Desa
                      </h3>

                      <p className="mt-2 text-sm font-medium text-slate-500">
                        Nilai setiap
                        tujuan
                        pembangunan
                        ditampilkan pada
                        skala 0 sampai
                        100.
                      </p>
                    </div>

                    <span className="w-fit rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-extrabold text-emerald-700">
                      {
                        jumlahGoalSdgs
                      }{' '}
                      Goal Aktif
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {daftarSdgs.map(
                      (
                        item
                      ) => (
                        <SdgsGoalCard
                          key={
                            item.id
                          }
                          item={
                            item
                          }
                        />
                      )
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
                <Target
                  size={42}
                  className="mx-auto text-slate-300"
                />

                <h3 className="mt-4 text-lg font-black text-slate-800">
                  Data SDGs belum
                  dipublikasikan
                </h3>

                <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-6 text-slate-500">
                  Capaian SDGs Desa
                  akan tampil di
                  bagian ini setelah
                  data dimasukkan dan
                  diaktifkan melalui
                  administrator.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ===================================================
            PROYEK PEMBANGUNAN
        =================================================== */}

        <section
          id="proyek-pembangunan"
          className="mt-12 scroll-mt-24 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-6 md:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-800 text-white">
                  <HardHat
                    size={23}
                  />
                </div>

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                    Data Kegiatan
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-slate-900">
                    Proyek
                    Pembangunan{' '}
                    {
                      tahunAktif
                    }
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
                    Daftar kegiatan
                    pembangunan
                    beserta lokasi,
                    sumber dana,
                    anggaran, progres,
                    status, dan
                    dokumentasinya.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
                <p className="text-2xl font-black text-emerald-700">
                  {
                    totalKegiatan
                  }
                </p>

                <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.13em] text-slate-500">
                  Kegiatan
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {proyekPembangunan
              .length >
            0 ? (
              <div className="grid gap-5 lg:grid-cols-2">
                {proyekPembangunan.map(
                  (
                    item
                  ) => (
                    <ProyekCard
                      key={
                        item.id
                      }
                      item={
                        item
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                  <HardHat
                    size={30}
                  />
                </div>

                <h3 className="mt-5 text-lg font-black text-slate-900">
                  Data pembangunan
                  belum dipublikasikan
                </h3>

                <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-6 text-slate-500">
                  Informasi proyek
                  pembangunan akan
                  muncul setelah data
                  resmi dimasukkan dan
                  dipublikasikan oleh
                  administrator.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ===================================================
            TRANSPARANSI
        =================================================== */}

        <section className="relative mt-12 overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-7 text-white shadow-xl md:p-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',

              backgroundSize:
                '25px 25px',
            }}
          />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                <ShieldCheck
                  size={25}
                />
              </div>

              <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
                Transparansi
                Pembangunan
              </p>

              <h2 className="mt-2 max-w-3xl text-2xl font-black md:text-3xl">
                Masyarakat dapat ikut
                memantau pelaksanaan
                pembangunan desa
              </h2>

              <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                Informasi kegiatan,
                anggaran, progres,
                dokumentasi, IDM, dan
                SDGs dipublikasikan
                sebagai bagian dari
                keterbukaan informasi
                pembangunan Desa
                Keji.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/data-desa/galeri"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-900 transition hover:bg-emerald-50"
              >
                <ImageIcon
                  size={17}
                />

                Lihat Dokumentasi
              </Link>

              <Link
                href="/pengaduan"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/15"
              >
                Sampaikan Pengaduan

                <ArrowRight
                  size={16}
                />
              </Link>
            </div>
          </div>
        </section>

        {/* ===================================================
            RELATED LINKS
        =================================================== */}

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RelatedLink
            href={`/informasi-publik/apbdes/${tahunAktif}`}
            title={`APBDes ${tahunAktif}`}
            description="Lihat ringkasan anggaran pendapatan dan belanja desa."
            icon={
              CircleDollarSign
            }
          />

          <RelatedLink
            href="/data-desa/galeri"
            title="Album Galeri"
            description="Lihat dokumentasi kegiatan dan pembangunan Desa Keji."
            icon={
              ImageIcon
            }
          />

          <RelatedLink
            href="#status-idm"
            title="Status IDM"
            description="Lihat status dan perkembangan Indeks Desa Membangun."
            icon={
              BarChart3
            }
          />

          <RelatedLink
            href="#sdgs-desa"
            title="SDGs Desa"
            description="Lihat capaian tujuan pembangunan berkelanjutan Desa Keji."
            icon={
              Target
            }
          />
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   HERO METRIC
========================================================= */

function HeroMetric({
  label,
  value,
}: {
  label: string;

  value: number;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.08] p-4">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-200/75">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-white">
        {value}
      </p>
    </article>
  );
}

/* =========================================================
   FLOATING STAT
========================================================= */

function FloatingStat({
  label,
  value,
  description,
  icon: Icon,
  primary = false,
  compact = false,
}: {
  label: string;

  value: string;

  description: string;

  icon: LucideIcon;

  primary?: boolean;

  compact?: boolean;
}) {
  return (
    <article
      className={`min-h-[170px] p-6 ${
        primary
          ? 'bg-emerald-800 text-white'
          : 'bg-white text-slate-900'
      }`}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          primary
            ? 'bg-white/10 text-emerald-100'
            : 'bg-emerald-100 text-emerald-700'
        }`}
      >
        <Icon
          size={21}
        />
      </div>

      <p
        className={`mt-5 text-[10px] font-extrabold uppercase tracking-[0.15em] ${
          primary
            ? 'text-emerald-200'
            : 'text-slate-500'
        }`}
      >
        {label}
      </p>

      <p
        className={`mt-2 break-words font-black ${
          compact
            ? 'text-lg'
            : 'text-2xl'
        }`}
      >
        {value}
      </p>

      <p
        className={`mt-2 text-xs font-semibold leading-5 ${
          primary
            ? 'text-emerald-100/75'
            : 'text-slate-500'
        }`}
      >
        {description}
      </p>
    </article>
  );
}

/* =========================================================
   TAHAP CARD
========================================================= */

function TahapCard({
  item,
}: {
  item:
    TahapPembangunan;
}) {
  const Icon =
    item.icon;

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
      <div className="pointer-events-none absolute -right-8 -top-8 text-[90px] font-black text-emerald-950/[0.035]">
        {
          item.nomor
        }
      </div>

      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
            <Icon
              size={23}
            />
          </div>

          <span className="text-xs font-black text-emerald-700">
            {
              item.nomor
            }
          </span>
        </div>

        <h3 className="mt-5 text-lg font-black text-slate-900">
          {
            item.nama
          }
        </h3>

        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
          {
            item.deskripsi
          }
        </p>
      </div>
    </article>
  );
}

/* =========================================================
   FOKUS CARD
========================================================= */

function FokusCard({
  item,
}: {
  item:
    FokusPembangunan;
}) {
  const Icon =
    item.icon;

  return (
    <article className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-200 hover:bg-emerald-50/50">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
        <Icon
          size={22}
        />
      </div>

      <div>
        <h3 className="font-black text-slate-900">
          {
            item.nama
          }
        </h3>

        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
          {
            item.deskripsi
          }
        </p>
      </div>
    </article>
  );
}

/* =========================================================
   IDM METRIC
========================================================= */

function IdmMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;

  label: string;

  value: string;
}) {
  return (
    <article className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white">
        <Icon
          size={19}
        />
      </div>

      <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">
        {label}
      </p>

      <p className="mt-2 break-words text-xl font-black text-emerald-950">
        {value}
      </p>
    </article>
  );
}

/* =========================================================
   SDGS METRIC
========================================================= */

function SdgsMetric({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon:
    LucideIcon;

  label:
    string;

  value:
    string;

  description:
    string;
}) {
  return (
    <article className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white">
        <Icon
          size={19}
        />
      </div>

      <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">
        {label}
      </p>

      <p className="mt-2 break-words text-2xl font-black text-emerald-950">
        {value}
      </p>

      <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-slate-500">
        {description}
      </p>
    </article>
  );
}

/* =========================================================
   SDGS GOAL CARD
========================================================= */

function SdgsGoalCard({
  item,
}: {
  item:
    SdgsDesa;
}) {
  const progress =
    Math.min(
      Math.max(
        item.skor,
        0
      ),
      100
    );

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
      {/* HEADER */}

      <div
        className="relative overflow-hidden p-5 text-white"
        style={{
          backgroundColor:
            item.warna,
        }}
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border-[22px] border-white/10" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-4xl font-black text-white/35">
              {String(
                item.id
              ).padStart(
                2,
                '0'
              )}
            </p>

            <h4 className="mt-3 text-base font-black leading-6">
              {
                item.nama
              }
            </h4>
          </div>

          <Target
            size={21}
            className="shrink-0 text-white/75"
          />
        </div>
      </div>

      {/* BODY */}

      <div className="p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-3xl font-black text-slate-900">
              {formatSkorSdgs(
                item.skor
              )}
            </p>

            <p className="mt-1 text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
              Nilai
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[9px] font-extrabold text-slate-600">
            {getKategoriSkorSdgs(
              item.skor
            )}
          </span>
        </div>

        <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width:
                `${progress}%`,

              backgroundColor:
                item.warna,
            }}
          />
        </div>

        <div className="mt-2 flex justify-between text-[9px] font-bold text-slate-400">
          <span>
            0
          </span>

          <span>
            100
          </span>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
            Tahun Data
          </p>

          <p className="mt-1 text-sm font-black text-slate-700">
            {
              item.tahun_data
            }
          </p>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   PROYEK CARD
========================================================= */

function ProyekCard({
  item,
}: {
  item:
    ProyekPembangunan;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* IMAGE */}

      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {item.gambar_url ? (
          <img
            src={
              item.gambar_url
            }
            alt={
              item.nama
            }
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-300">
            <ImageIcon
              size={46}
            />

            <p className="mt-2 text-xs font-bold">
              Dokumentasi belum
              tersedia
            </p>
          </div>
        )}

        <span
          className={`absolute left-4 top-4 inline-flex rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] shadow-sm ${getStatusClass(
            item.status
          )}`}
        >
          {
            item.status
          }
        </span>
      </div>

      {/* CONTENT */}

      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-400">
            <CalendarDays
              size={15}
            />

            {
              item.tahun
            }
          </span>

          <span className="text-xs font-black text-emerald-700">
            Progres{' '}
            {
              item.progres
            }
            %
          </span>
        </div>

        <h3 className="mt-4 text-lg font-black text-slate-900">
          {
            item.nama
          }
        </h3>

        {item.deskripsi && (
          <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
            {
              item.deskripsi
            }
          </p>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ProjectMeta
            label="Lokasi"
            value={
              item.lokasi ||
              '-'
            }
          />

          <ProjectMeta
            label="Sumber Dana"
            value={
              item.sumber_dana ||
              '-'
            }
          />

          <ProjectMeta
            label="Anggaran"
            value={formatRupiah(
              item.anggaran
            )}
          />

          <ProjectMeta
            label="Progres"
            value={`${item.progres}%`}
          />
        </div>

        {/* PROGRESS */}

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider">
            <span className="text-slate-400">
              Progres Pekerjaan
            </span>

            <span className="text-emerald-700">
              {
                item.progres
              }
              %
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400"
              style={{
                width:
                  `${Math.min(
                    Math.max(
                      item.progres,
                      0
                    ),
                    100
                  )}%`,
              }}
            />
          </div>
        </div>

        {item.status ===
          'Selesai' && (
          <div className="mt-4 flex items-start gap-2 rounded-2xl bg-emerald-50 p-4 text-emerald-700">
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0"
            />

            <p className="text-xs font-bold leading-5">
              Kegiatan pembangunan
              telah selesai
              dilaksanakan.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

/* =========================================================
   PROJECT META
========================================================= */

function ProjectMeta({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-[9px] font-extrabold uppercase tracking-[0.13em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-black text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   RELATED LINK
========================================================= */

function RelatedLink({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;

  title: string;

  description: string;

  icon: LucideIcon;
}) {
  return (
    <Link
      href={
        href
      }
      className="group flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
    >
      <div className="flex min-w-0 items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
          <Icon
            size={21}
          />
        </div>

        <div className="min-w-0">
          <h3 className="font-black text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
            {
              description
            }
          </p>
        </div>
      </div>

      <ArrowRight
        size={19}
        className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-700"
      />
    </Link>
  );
}