// app/(public)/pengelolaan-sampah/page.tsx

import type {
  CSSProperties,
  ReactNode,
} from 'react';

import type {
  Metadata,
} from 'next';

import Link from 'next/link';

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileText,
  House,
  Leaf,
  MapPinned,
  MapPin,
  Navigation,
  PackageOpen,
  Recycle,
  ShieldCheck,
  Trash2,
  TreePine,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

/* =========================================================
   METADATA
========================================================= */

export const metadata:
  Metadata = {
  title:
    'Pengelolaan Sampah Desa Keji | SIJI',

  description:
    'Informasi persebaran TPS, pengepul, booklet dan flipbook informasi pengepul, serta pengelolaan sampah di Desa Keji.',
};

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

/* =========================================================
   CONFIG
========================================================= */

const MAP_IMAGE =
  '/Peta%20Persebaran%20TPS%20dan%20Pengepul%20Desa%20Keji.jpeg';

const BOOKLET_COVER =
  '/Cover%20Booklet%20Pengepul.png';

const BOOKLET_PDF =
  '/Booklet%20Pengepul.pdf';

const FLIPBOOK_URL =
  'https://heyzine.com/flip-book/eca71a5fa8.html';

const SETTINGS_KEY =
  'utama';

/* =========================================================
   TYPES
========================================================= */

type LokasiKode =
  | 'pengepul-keji-1'
  | 'pengepul-keji-2'
  | 'pengepul-suruhan-1'
  | 'pengepul-suruhan-2'
  | 'tps-keji'
  | 'tps-suruhan';

type JenisLokasi =
  | 'TPS'
  | 'Pengepul';

interface LokasiSampah {
  id:
    | string
    | null;

  kode:
    LokasiKode;

  nama:
    string;

  jenis:
    JenisLokasi;

  mapsUrl:
    | string
    | null;

  keterangan:
    | string
    | null;

  aktif:
    boolean;

  urutan:
    number;
}

interface ProgramItem {
  title:
    string;

  description:
    string;

  icon:
    LucideIcon;
}

interface MapArea {
  kode:
    LokasiKode;

  style:
    CSSProperties;
}

interface BookletSettings {
  judul:
    string;

  deskripsi:
    string;

  aktif:
    boolean;
}

/* =========================================================
   KODE VALID
========================================================= */

const LOKASI_CODES:
  LokasiKode[] = [
    'pengepul-keji-1',
    'pengepul-keji-2',
    'pengepul-suruhan-1',
    'pengepul-suruhan-2',
    'tps-keji',
    'tps-suruhan',
  ];

/* =========================================================
   BOOKLET DEFAULTS
========================================================= */

const BOOKLET_DEFAULTS:
  BookletSettings = {
  judul:
    'Booklet Informasi Pengepul Desa Keji',

  deskripsi:
    'Booklet digital yang menyediakan informasi mengenai pengepul di Desa Keji sebagai bagian dari penyediaan informasi pengelolaan sampah dan lingkungan desa.',

  aktif:
    true,
};

/* =========================================================
   FALLBACK LOCATIONS
========================================================= */

const FALLBACK_LOCATIONS:
  LokasiSampah[] = [
    {
      id:
        null,

      kode:
        'pengepul-keji-1',

      nama:
        'Pengepul Keji 1',

      jenis:
        'Pengepul',

      mapsUrl:
        null,

      keterangan:
        'Lokasi pengepul pertama yang berada di wilayah Keji.',

      aktif:
        true,

      urutan:
        1,
    },

    {
      id:
        null,

      kode:
        'pengepul-keji-2',

      nama:
        'Pengepul Keji 2',

      jenis:
        'Pengepul',

      mapsUrl:
        null,

      keterangan:
        'Lokasi pengepul kedua yang berada di wilayah Keji.',

      aktif:
        true,

      urutan:
        2,
    },

    {
      id:
        null,

      kode:
        'pengepul-suruhan-1',

      nama:
        'Pengepul Suruhan 1',

      jenis:
        'Pengepul',

      mapsUrl:
        null,

      keterangan:
        'Lokasi pengepul pertama yang berada di wilayah Dusun Suruhan.',

      aktif:
        true,

      urutan:
        3,
    },

    {
      id:
        null,

      kode:
        'pengepul-suruhan-2',

      nama:
        'Pengepul Suruhan 2',

      jenis:
        'Pengepul',

      mapsUrl:
        null,

      keterangan:
        'Lokasi pengepul kedua yang berada di wilayah Dusun Suruhan.',

      aktif:
        true,

      urutan:
        4,
    },

    {
      id:
        null,

      kode:
        'tps-keji',

      nama:
        'TPS Keji',

      jenis:
        'TPS',

      mapsUrl:
        null,

      keterangan:
        'Tempat Penampungan Sementara yang berada di wilayah Keji.',

      aktif:
        true,

      urutan:
        5,
    },

    {
      id:
        null,

      kode:
        'tps-suruhan',

      nama:
        'TPS Suruhan',

      jenis:
        'TPS',

      mapsUrl:
        null,

      keterangan:
        'Tempat Penampungan Sementara yang berada di wilayah Dusun Suruhan.',

      aktif:
        true,

      urutan:
        6,
    },
  ];

/* =========================================================
   MAP AREAS
========================================================= */

const MAP_AREAS:
  MapArea[] = [
    {
      kode:
        'pengepul-suruhan-1',

      style: {
        left:
          '4.6%',

        top:
          '19%',

        width:
          '16%',

        height:
          '18.8%',
      },
    },

    {
      kode:
        'pengepul-keji-2',

      style: {
        left:
          '23.1%',

        top:
          '9.2%',

        width:
          '16.3%',

        height:
          '18.9%',
      },
    },

    {
      kode:
        'tps-keji',

      style: {
        left:
          '47.6%',

        top:
          '9.2%',

        width:
          '14.3%',

        height:
          '17.2%',
      },
    },

    {
      kode:
        'pengepul-keji-1',

      style: {
        left:
          '52.6%',

        top:
          '33.7%',

        width:
          '16.3%',

        height:
          '19.1%',
      },
    },

    {
      kode:
        'tps-suruhan',

      style: {
        left:
          '43.9%',

        top:
          '54.7%',

        width:
          '15.3%',

        height:
          '18.2%',
      },
    },

    {
      kode:
        'pengepul-suruhan-2',

      style: {
        left:
          '34.3%',

        top:
          '75.2%',

        width:
          '16%',

        height:
          '18.9%',
      },
    },
  ];

/* =========================================================
   CONTENT
========================================================= */

const pengelolaanSampah:
  ProgramItem[] = [
    {
      title:
        'Pemilahan Sampah',

      description:
        'Pemilahan sampah berdasarkan jenisnya membantu proses pengumpulan dan pengelolaan sampah menjadi lebih terarah.',

      icon:
        House,
    },

    {
      title:
        'Pengurangan Sampah',

      description:
        'Pengurangan penggunaan barang sekali pakai dapat membantu mengurangi timbulan sampah dari sumbernya.',

      icon:
        PackageOpen,
    },

    {
      title:
        'Kebersihan Lingkungan',

      description:
        'Pengelolaan sampah yang baik turut mendukung terciptanya lingkungan permukiman dan fasilitas umum yang lebih bersih.',

      icon:
        TreePine,
    },

    {
      title:
        'Partisipasi Masyarakat',

      description:
        'Peran masyarakat menjadi bagian penting dalam menjaga kebersihan dan keberlanjutan pengelolaan lingkungan desa.',

      icon:
        UsersRound,
    },
  ];

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

function nullableString(
  value:
    unknown
) {
  const valueString =
    safeString(
      value
    );

  return (
    valueString ||
    null
  );
}

function isLokasiKode(
  value:
    string
): value is LokasiKode {
  return (
    LOKASI_CODES as readonly string[]
  ).includes(
    value
  );
}

function isJenisLokasi(
  value:
    string
): value is JenisLokasi {
  return (
    value ===
      'TPS' ||
    value ===
      'Pengepul'
  );
}

/* =========================================================
   NORMALIZE LOCATION
========================================================= */

function normalizeLokasi(
  value:
    unknown
): LokasiSampah | null {
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

  const kode =
    safeString(
      row.kode
    );

  const nama =
    safeString(
      row.nama
    );

  const jenis =
    safeString(
      row.jenis
    );

  const urutan =
    Number(
      row.urutan ??
        0
    );

  if (
    !id ||
    !isLokasiKode(
      kode
    ) ||
    !nama ||
    !isJenisLokasi(
      jenis
    )
  ) {
    return null;
  }

  return {
    id,

    kode,

    nama,

    jenis,

    mapsUrl:
      nullableString(
        row.maps_url
      ),

    keterangan:
      nullableString(
        row.keterangan
      ),

    aktif:
      Boolean(
        row.aktif
      ),

    urutan:
      Number.isFinite(
        urutan
      )
        ? urutan
        : 0,
  };
}

/* =========================================================
   NORMALIZE BOOKLET
========================================================= */

function normalizeBooklet(
  value:
    unknown
): BookletSettings {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(
      value
    )
  ) {
    return (
      BOOKLET_DEFAULTS
    );
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  return {
    judul:
      safeString(
        row.booklet_judul
      ) ||
      BOOKLET_DEFAULTS
        .judul,

    deskripsi:
      safeString(
        row.booklet_deskripsi
      ) ||
      BOOKLET_DEFAULTS
        .deskripsi,

    aktif:
      row.booklet_aktif ===
        undefined ||
      row.booklet_aktif ===
        null
        ? true
        : Boolean(
            row.booklet_aktif
          ),
  };
}

/* =========================================================
   MERGE FALLBACK
========================================================= */

function mergeWithFallback(
  databaseItems:
    LokasiSampah[]
) {
  const databaseMap =
    new Map(
      databaseItems.map(
        (
          item
        ) => [
          item.kode,
          item,
        ]
      )
    );

  return FALLBACK_LOCATIONS.map(
    (
      fallback
    ) =>
      databaseMap.get(
        fallback.kode
      ) ??
      fallback
  ).sort(
    (
      first,
      second
    ) =>
      first.urutan -
      second.urutan
  );
}

/* =========================================================
   PAGE
========================================================= */

export default async function PengelolaanSampahPage() {
  const [
    lokasiResult,
    settingsResult,
  ] =
    await Promise.all([
      supabaseAdmin
        .from(
          'pengelolaan_sampah_lokasi'
        )
        .select(`
          id,
          kode,
          nama,
          jenis,
          maps_url,
          keterangan,
          aktif,
          urutan
        `)
        .order(
          'urutan',
          {
            ascending:
              true,
          }
        ),

      supabaseAdmin
        .from(
          'pengelolaan_sampah_settings'
        )
        .select(`
          booklet_judul,
          booklet_deskripsi,
          booklet_aktif
        `)
        .eq(
          'setting_key',
          SETTINGS_KEY
        )
        .maybeSingle(),
    ]);

  /* =======================================================
     ERROR
  ======================================================= */

  if (
    lokasiResult.error
  ) {
    console.error(
      'Gagal mengambil data lokasi pengelolaan sampah:',
      {
        message:
          lokasiResult.error
            .message,

        code:
          lokasiResult.error
            .code,

        details:
          lokasiResult.error
            .details,

        hint:
          lokasiResult.error
            .hint,
      }
    );
  }

  if (
    settingsResult.error
  ) {
    console.error(
      'Gagal mengambil pengaturan booklet pengepul:',
      {
        message:
          settingsResult.error
            .message,

        code:
          settingsResult.error
            .code,

        details:
          settingsResult.error
            .details,

        hint:
          settingsResult.error
            .hint,
      }
    );
  }

  /* =======================================================
     LOCATIONS
  ======================================================= */

  const databaseItems =
    (
      lokasiResult.data ??
      []
    )
      .map(
        normalizeLokasi
      )
      .filter(
        (
          item
        ): item is LokasiSampah =>
          item !==
          null
      );

  const seluruhLokasi =
    mergeWithFallback(
      databaseItems
    );

  const lokasiAktif =
    seluruhLokasi.filter(
      (
        item
      ) =>
        item.aktif
    );

  const lokasiByKode =
    new Map(
      seluruhLokasi.map(
        (
          item
        ) => [
          item.kode,
          item,
        ]
      )
    );

  /* =======================================================
     BOOKLET
  ======================================================= */

  const booklet =
    normalizeBooklet(
      settingsResult.data
    );

  /* =======================================================
     SUMMARY
  ======================================================= */

  const jumlahTps =
    lokasiAktif.filter(
      (
        item
      ) =>
        item.jenis ===
        'TPS'
    ).length;

  const jumlahPengepul =
    lokasiAktif.filter(
      (
        item
      ) =>
        item.jenis ===
        'Pengepul'
    ).length;

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
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/background.png')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#021b16] via-emerald-950/95 to-emerald-800/65" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#021b16] via-transparent to-black/20" />

        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,.55) 1px, transparent 1px)',

            backgroundSize:
              '28px 28px',
          }}
        />

        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border-[52px] border-white/[0.04]" />

        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-emerald-300/[0.08] blur-[100px]" />

        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur">
              <Recycle
                size={28}
              />
            </div>

            <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-300">
              Lingkungan Desa Keji
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Pengelolaan Sampah
            </h1>

            <p className="mt-6 max-w-3xl text-sm font-medium leading-8 text-emerald-50/85 sm:text-base">
              Informasi persebaran
              Tempat Penampungan
              Sementara (TPS),
              pengepul, serta upaya
              pengelolaan sampah
              untuk mendukung
              lingkungan Desa Keji
              yang lebih bersih dan
              tertata.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <section className="relative z-10 -mt-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-2xl sm:grid-cols-3">
            <SummaryCard
              icon={
                MapPinned
              }
              value={String(
                lokasiAktif.length
              )}
              label="Titik Terdata"
              primary
            />

            <SummaryCard
              icon={
                Trash2
              }
              value={String(
                jumlahTps
              )}
              label="TPS"
            />

            <SummaryCard
              icon={
                Recycle
              }
              value={String(
                jumlahPengepul
              )}
              label="Pengepul"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8">
        {/* ===================================================
            INTRO
        =================================================== */}

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white">
              <Leaf
                size={23}
              />
            </div>

            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-700">
              Pengelolaan Lingkungan
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
              Pengelolaan sampah
              berbasis lokasi dan
              partisipasi masyarakat
            </h2>

            <p className="mt-5 text-sm font-medium leading-8 text-slate-600">
              Informasi persebaran
              TPS dan pengepul dapat
              membantu masyarakat
              mengetahui titik
              pengelolaan sampah yang
              berada di wilayah Desa
              Keji.
            </p>

            <p className="mt-4 text-sm font-medium leading-8 text-slate-600">
              Peta berikut memuat dua
              titik TPS dan empat
              titik pengepul yang
              tersebar di wilayah
              Keji dan Suruhan.
              Dokumentasi foto pada
              peta dapat digunakan
              sebagai pintasan menuju
              Google Maps apabila
              tautan lokasi telah
              tersedia.
            </p>
          </article>

          <aside className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-7 sm:p-8">
            <ShieldCheck
              size={30}
              className="text-emerald-700"
            />

            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-700">
              Cara Menggunakan Peta
            </p>

            <h2 className="mt-2 text-xl font-black text-emerald-950">
              Klik foto lokasi untuk
              membuka Google Maps
            </h2>

            <div className="mt-6 space-y-3">
              <InfoItem>
                Cari foto TPS atau
                pengepul pada peta.
              </InfoItem>

              <InfoItem>
                Arahkan kursor atau
                sentuh salah satu dari
                enam foto lokasi.
              </InfoItem>

              <InfoItem>
                Klik untuk membuka
                Google Maps apabila
                tautan telah tersedia.
              </InfoItem>
            </div>
          </aside>
        </section>

        {/* ===================================================
            PETA
        =================================================== */}

        <section className="mt-12 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-white p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                <MapPinned
                  size={23}
                />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                  Peta Persebaran
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  TPS dan Pengepul
                  Desa Keji
                </h2>

                <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500">
                  Terdapat enam foto
                  lokasi pada peta.
                  Klik foto untuk
                  membuka titik Google
                  Maps yang sudah
                  ditentukan melalui
                  administrator.
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-amber-100 bg-amber-50 px-6 py-3 text-xs font-semibold text-amber-800 md:hidden">
            Pada layar kecil, geser
            peta ke kanan atau kiri
            untuk melihat seluruh
            bagian.
          </div>

          <div className="overflow-x-auto bg-slate-100 p-3 sm:p-5 lg:p-7">
            <div className="relative mx-auto min-w-[900px] max-w-[1450px] overflow-hidden rounded-2xl bg-white shadow-lg">
              <img
                src={
                  MAP_IMAGE
                }
                alt="Peta Persebaran TPS dan Pengepul Desa Keji"
                className="block h-auto w-full select-none"
                draggable={
                  false
                }
              />

              {MAP_AREAS.map(
                (
                  area
                ) => {
                  const lokasi =
                    lokasiByKode.get(
                      area.kode
                    );

                  if (
                    !lokasi ||
                    !lokasi.aktif
                  ) {
                    return null;
                  }

                  return (
                    <MapPhotoArea
                      key={
                        area.kode
                      }
                      lokasi={
                        lokasi
                      }
                      style={
                        area.style
                      }
                    />
                  );
                }
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 p-5 md:p-6">
            <div className="flex flex-wrap gap-3">
              <LegendBadge
                label="2 TPS"
                dotClass="bg-emerald-600"
              />

              <LegendBadge
                label="4 Pengepul"
                dotClass="bg-emerald-600"
              />

              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-[10px] font-extrabold text-slate-500">
                <Navigation
                  size={13}
                />

                Foto dengan tautan
                dapat diklik
              </span>
            </div>
          </div>
        </section>

        {/* ===================================================
            BOOKLET + FLIPBOOK
        =================================================== */}

        {booklet.aktif && (
          <>
            {/* =================================================
                BOOKLET
            ================================================= */}

            <section className="mt-12 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-xl shadow-slate-900/[0.06]">
              <div className="grid lg:grid-cols-[370px_minmax(0,1fr)]">
                <a
                  href={
                    BOOKLET_PDF
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Buka ${booklet.judul}`}
                  className="group relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#eef7bf] via-[#fffde7] to-emerald-50 p-6 sm:p-8"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle, rgba(6,78,59,0.15) 1px, transparent 1px)',

                      backgroundSize:
                        '22px 22px',
                    }}
                  />

                  <div className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-lime-300/30 blur-3xl" />

                  <div className="pointer-events-none absolute -bottom-20 -right-20 h-52 w-52 rounded-full bg-emerald-300/30 blur-3xl" />

                  <div className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl bg-white shadow-2xl transition duration-500 group-hover:-translate-y-1 group-hover:shadow-emerald-950/20">
                    <img
                      src={
                        BOOKLET_COVER
                      }
                      alt={`Sampul ${booklet.judul}`}
                      loading="lazy"
                      className="h-auto w-full object-contain"
                    />
                  </div>

                  <div className="pointer-events-none absolute inset-x-6 bottom-6 flex justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-950/90 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg backdrop-blur">
                      <BookOpen
                        size={15}
                      />

                      Buka Booklet
                    </span>
                  </div>
                </a>

                <div className="relative flex flex-col p-6 sm:p-8 lg:p-10">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-100/70 blur-3xl"
                  />

                  <div className="relative flex flex-1 flex-col">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <FileText
                        size={23}
                      />
                    </div>

                    <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-700">
                      Informasi
                      Lingkungan Desa
                    </p>

                    <h2 className="mt-3 text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
                      {
                        booklet.judul
                      }
                    </h2>

                    <p className="mt-5 flex-1 whitespace-pre-line text-sm font-medium leading-8 text-slate-600 sm:text-base">
                      {
                        booklet.deskripsi
                      }
                    </p>

                    <div className="mt-7 flex flex-wrap gap-2">
                      <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                        Informasi
                        Pengepul
                      </span>

                      <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                        Dokumen Digital
                      </span>

                      <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                        Akses Gratis
                      </span>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <a
                        href={
                          BOOKLET_PDF
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-800"
                      >
                        <BookOpen
                          size={18}
                        />

                        Buka Booklet

                        <ExternalLink
                          size={15}
                        />
                      </a>

                      <a
                        href={
                          BOOKLET_PDF
                        }
                        download="Booklet Pengepul Desa Keji.pdf"
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-6 text-sm font-extrabold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                      >
                        <FileText
                          size={17}
                        />

                        Unduh PDF
                      </a>
                    </div>

                    <div className="mt-7 border-t border-slate-100 pt-5">
                      <p className="text-[11px] font-semibold leading-5 text-slate-400">
                        Klik sampul atau
                        tombol Buka
                        Booklet untuk
                        membaca dokumen
                        PDF secara
                        langsung.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                FLIPBOOK
            ================================================= */}

            <section
              id="flipbook-pengepul"
              className="mt-8 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-xl shadow-slate-900/[0.06]"
            >
              <div className="flex flex-col gap-5 border-b border-emerald-100 bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-700 p-6 text-white sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                    <BookOpen
                      size={23}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-200">
                      Baca Secara
                      Interaktif
                    </p>

                    <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                      Flipbook Informasi
                      Pengepul Desa Keji
                    </h2>

                    <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                      Baca Booklet
                      Informasi Pengepul
                      Desa Keji secara
                      interaktif dengan
                      tampilan halaman
                      digital.
                    </p>
                  </div>
                </div>

                <a
                  href={
                    FLIPBOOK_URL
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white transition hover:bg-white/15"
                >
                  Buka Layar Penuh

                  <ExternalLink
                    size={15}
                  />
                </a>
              </div>

              <div className="bg-slate-100 p-3 sm:p-5 lg:p-7">
                <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                  <div className="aspect-[16/10] min-h-[500px] w-full sm:min-h-[620px] lg:min-h-[720px]">
                    <iframe
                      src={
                        FLIPBOOK_URL
                      }
                      title="Flipbook Informasi Pengepul Desa Keji"
                      loading="lazy"
                      allowFullScreen
                      className="h-full w-full border-0"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-slate-100 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-slate-800">
                    Lebih nyaman
                    membaca di layar
                    penuh?
                  </p>

                  <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                    Gunakan tombol di
                    samping untuk
                    membuka Flipbook
                    Heyzine pada tab
                    baru.
                  </p>
                </div>

                <a
                  href={
                    FLIPBOOK_URL
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white transition hover:bg-emerald-800"
                >
                  <BookOpen
                    size={16}
                  />

                  Baca Flipbook

                  <ExternalLink
                    size={13}
                  />
                </a>
              </div>
            </section>
          </>
        )}

        {/* ===================================================
            DAFTAR TITIK
        =================================================== */}

        <section className="mt-12">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-700">
              Titik Pengelolaan
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
              Daftar TPS dan
              Pengepul
            </h2>

            <p className="mt-3 text-sm font-medium leading-7 text-slate-500">
              Informasi berikut
              menampilkan seluruh
              titik aktif yang
              dikelola melalui
              administrator website
              Desa Keji.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {lokasiAktif.map(
              (
                item
              ) => (
                <LocationCard
                  key={
                    item.kode
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
            PENGELOLAAN
        =================================================== */}

        <section className="mt-14">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-700">
              Lingkungan Bersih
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
              Upaya Pengelolaan
              Sampah
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {pengelolaanSampah.map(
              (
                item
              ) => (
                <ProgramCard
                  key={
                    item.title
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
            3R
        =================================================== */}

        <section className="mt-12 overflow-hidden rounded-[2rem] bg-slate-900 text-white">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative overflow-hidden bg-emerald-800 p-8 sm:p-10">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.1]"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,.5) 1px, transparent 1px)',

                  backgroundSize:
                    '23px 23px',
                }}
              />

              <div className="relative">
                <Recycle
                  size={38}
                  className="text-emerald-200"
                />

                <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.19em] text-emerald-200">
                  Prinsip 3R
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  Reduce, Reuse,
                  Recycle
                </h2>

                <p className="mt-4 text-sm font-medium leading-7 text-emerald-50/80">
                  Pendekatan untuk
                  mengurangi timbulan
                  sampah dan
                  meningkatkan
                  pemanfaatan kembali
                  material.
                </p>
              </div>
            </div>

            <div className="grid gap-px bg-white/10 sm:grid-cols-3">
              <ThreeRCard
                number="01"
                title="Reduce"
                description="Mengurangi penggunaan barang yang berpotensi menjadi sampah."
              />

              <ThreeRCard
                number="02"
                title="Reuse"
                description="Menggunakan kembali barang yang masih dapat dimanfaatkan."
              />

              <ThreeRCard
                number="03"
                title="Recycle"
                description="Mengolah kembali material agar memiliki nilai guna."
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            CTA
        =================================================== */}

        <section className="relative mt-12 overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-8 text-white sm:p-10">
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

          <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <Leaf
                size={28}
                className="text-emerald-300"
              />

              <h2 className="mt-5 text-2xl font-black sm:text-3xl">
                Jaga Desa Keji tetap
                bersih dan nyaman
              </h2>

              <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-emerald-50/80">
                Pengelolaan lingkungan
                merupakan bagian dari
                pembangunan desa yang
                membutuhkan
                partisipasi bersama.
              </p>
            </div>

            <Link
              href="/pembangunan"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-extrabold text-emerald-900 transition hover:bg-emerald-50"
            >
              Pembangunan Desa

              <ArrowRight
                size={16}
              />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   CLICKABLE MAP AREA
========================================================= */

function MapPhotoArea({
  lokasi,
  style,
}: {
  lokasi:
    LokasiSampah;

  style:
    CSSProperties;
}) {
  const commonClass =
    'group absolute z-10 overflow-visible rounded-lg transition duration-200';

  if (
    lokasi.mapsUrl
  ) {
    return (
      <a
        href={
          lokasi.mapsUrl
        }
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Buka lokasi ${lokasi.nama} di Google Maps`}
        title={`Buka ${lokasi.nama} di Google Maps`}
        className={`${commonClass} cursor-pointer hover:bg-emerald-400/10 hover:ring-4 hover:ring-emerald-400/90 focus:outline-none focus:ring-4 focus:ring-emerald-400`}
        style={
          style
        }
      >
        <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-white shadow-lg ring-2 ring-white">
          <MapPin
            size={15}
          />
        </span>

        <span className="pointer-events-none absolute bottom-2 left-2 max-w-[calc(100%-50px)] rounded-lg bg-emerald-950/95 px-2.5 py-1.5 text-[9px] font-extrabold leading-tight text-white opacity-0 shadow-lg transition group-hover:opacity-100">
          {lokasi.nama}
          {' · '}
          Buka Google Maps
        </span>
      </a>
    );
  }

  return (
    <div
      title={`${lokasi.nama} — Google Maps belum tersedia`}
      className={`${commonClass} cursor-not-allowed`}
      style={
        style
      }
    >
      <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-white shadow-lg ring-2 ring-white">
        <MapPin
          size={15}
        />
      </span>
    </div>
  );
}

/* =========================================================
   LOCATION CARD
========================================================= */

function LocationCard({
  item,
}: {
  item:
    LokasiSampah;
}) {
  const isTps =
    item.jenis ===
    'TPS';

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          {isTps ? (
            <Trash2
              size={22}
            />
          ) : (
            <Recycle
              size={22}
            />
          )}
        </div>

        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-emerald-700">
          {item.jenis}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-900">
        {item.nama}
      </h3>

      <p className="mt-2 flex-1 text-sm font-medium leading-7 text-slate-500">
        {item.keterangan ||
          'Informasi lokasi pengelolaan sampah Desa Keji.'}
      </p>

      <div className="mt-6 border-t border-slate-100 pt-5">
        {item.mapsUrl ? (
          <a
            href={
              item.mapsUrl
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-800"
          >
            <Navigation
              size={15}
            />

            Buka Google Maps

            <ExternalLink
              size={13}
            />
          </a>
        ) : (
          <span className="inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 text-xs font-extrabold text-emerald-700">
            <MapPin
              size={15}
            />

            Maps Belum Tersedia
          </span>
        )}
      </div>
    </article>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon:
    Icon,
  value,
  label,
  primary =
    false,
}: {
  icon:
    LucideIcon;

  value:
    string;

  label:
    string;

  primary?:
    boolean;
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

      <p className="mt-5 text-3xl font-black">
        {value}
      </p>

      <p
        className={`mt-1 text-xs font-extrabold ${
          primary
            ? 'text-emerald-100'
            : 'text-slate-500'
        }`}
      >
        {label}
      </p>
    </article>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  children,
}: {
  children:
    ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-white/70 p-4">
      <CheckCircle2
        size={17}
        className="mt-0.5 shrink-0 text-emerald-700"
      />

      <p className="text-sm font-semibold leading-6 text-emerald-900">
        {children}
      </p>
    </div>
  );
}

/* =========================================================
   PROGRAM CARD
========================================================= */

function ProgramCard({
  item,
}: {
  item:
    ProgramItem;
}) {
  const Icon =
    item.icon;

  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
        <Icon
          size={22}
        />
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-900">
        {item.title}
      </h3>

      <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
        {item.description}
      </p>
    </article>
  );
}

/* =========================================================
   3R
========================================================= */

function ThreeRCard({
  number,
  title,
  description,
}: {
  number:
    string;

  title:
    string;

  description:
    string;
}) {
  return (
    <article className="bg-slate-900 p-7">
      <span className="text-xs font-black text-emerald-400">
        {number}
      </span>

      <h3 className="mt-4 text-xl font-black">
        {title}
      </h3>

      <p className="mt-3 text-xs font-medium leading-6 text-slate-400">
        {description}
      </p>
    </article>
  );
}

/* =========================================================
   LEGEND
========================================================= */

function LegendBadge({
  label,
  dotClass,
}: {
  label:
    string;

  dotClass:
    string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-[10px] font-extrabold text-slate-600">
      <span
        className={`h-2.5 w-2.5 rounded-full ${dotClass}`}
      />

      {label}
    </span>
  );
}