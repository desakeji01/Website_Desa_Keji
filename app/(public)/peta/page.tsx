// app/(public)/peta/page.tsx

import {
  Download,
  ExternalLink,
  FileText,
  Info,
  Map,
  MapPinned,
  MapPin,
  Mountain,
  Navigation,
  ZoomIn,
  type LucideIcon,
} from 'lucide-react';

import {
  PETA_DESA_DEFAULTS,
} from '@/lib/peta-defaults';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  PetaDesaData,
} from '@/types/peta';

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

const PETA_KEY =
  'utama';

/* =========================================================
   STATIC ASSETS
========================================================= */

const PETA_TOPOGRAFI =
  '/Peta%20Topografi%20Desa%20Keji.png';

const PETA_ADMINISTRASI =
  '/Administrasi%20Desa%20Keji.png';

const PETA_ADMINISTRASI_PDF =
  '/Administrasi%20Desa%20Keji.pdf';

/* =========================================================
   TYPES
========================================================= */

interface LokasiAdministrasi {
  id:
    string;

  kode:
    string;

  nama:
    string;

  kategori:
    string;

  maps_url:
    string | null;

  posisi_x:
    number;

  posisi_y:
    number;

  urutan:
    number;
}

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

function nullableString(
  value: unknown
) {
  const result =
    safeString(
      value
    );

  return (
    result ||
    null
  );
}

/* =========================================================
   NORMALIZE LOCATION
========================================================= */

function normalizeLokasi(
  value: unknown
): LokasiAdministrasi | null {
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

  const kategori =
    safeString(
      row.kategori
    );

  const posisiX =
    Number(
      row.posisi_x
    );

  const posisiY =
    Number(
      row.posisi_y
    );

  const urutan =
    Number(
      row.urutan ??
        0
    );

  if (
    !id ||
    !kode ||
    !nama ||
    !kategori ||
    !Number.isFinite(
      posisiX
    ) ||
    !Number.isFinite(
      posisiY
    )
  ) {
    return null;
  }

  return {
    id,

    kode,

    nama,

    kategori,

    maps_url:
      nullableString(
        row.maps_url
      ),

    posisi_x:
      posisiX,

    posisi_y:
      posisiY,

    urutan:
      Number.isInteger(
        urutan
      )
        ? urutan
        : 0,
  };
}

/* =========================================================
   MAPS FALLBACK

   Jika admin belum mengisi link Google Maps exact,
   lokasi tetap dapat diklik menggunakan Google Maps Search.
========================================================= */

function getMapsUrl(
  lokasi:
    LokasiAdministrasi
) {
  if (
    lokasi.maps_url
  ) {
    return lokasi.maps_url;
  }

  const query =
    `${lokasi.nama}, Desa Keji, Ungaran Barat, Kabupaten Semarang, Jawa Tengah`;

  return (
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(
      query
    )
  );
}

/* =========================================================
   FIND LOCATION BY CODE
========================================================= */

function getLokasiByKode(
  daftarLokasi:
    LokasiAdministrasi[],

  kode:
    string
) {
  return (
    daftarLokasi.find(
      (
        item
      ) =>
        item.kode ===
        kode
    ) ??
    null
  );
}

/* =========================================================
   FALLBACK MAPS DUSUN
========================================================= */

function getDusunFallbackMapsUrl(
  nama:
    string
) {
  const query =
    `${nama}, Desa Keji, Kecamatan Ungaran Barat, Kabupaten Semarang, Jawa Tengah`;

  return (
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(
      query
    )
  );
}

/* =========================================================
   PAGE
========================================================= */

export default async function PetaDesaPage() {
  const [
    petaResult,
    lokasiResult,
  ] =
    await Promise.all([
      /* ===================================================
         PETA UTAMA
      =================================================== */

      supabaseAdmin
        .from(
          'peta_desa'
        )
        .select(`
          peta_key,
          label_seksi,
          judul_halaman,
          deskripsi,
          tombol_label,
          maps_link_url,
          maps_embed_url,
          iframe_title,
          tinggi_peta,
          updated_at
        `)
        .eq(
          'peta_key',
          PETA_KEY
        )
        .maybeSingle(),

      /* ===================================================
         TITIK ADMINISTRASI
      =================================================== */

      supabaseAdmin
        .from(
          'peta_administrasi_lokasi'
        )
        .select(`
          id,
          kode,
          nama,
          kategori,
          maps_url,
          posisi_x,
          posisi_y,
          urutan
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
     ERRORS
  ======================================================= */

  if (
    petaResult.error
  ) {
    console.error(
      'Gagal mengambil peta desa:',
      {
        message:
          petaResult.error
            .message,

        code:
          petaResult.error
            .code,

        details:
          petaResult.error
            .details,

        hint:
          petaResult.error
            .hint,
      }
    );
  }

  if (
    lokasiResult.error
  ) {
    console.error(
      'Gagal mengambil lokasi peta administrasi:',
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

  /* =======================================================
     PETA DATA
  ======================================================= */

  const peta:
    PetaDesaData = {
    ...PETA_DESA_DEFAULTS,

    ...(
      petaResult.data ??
      {}
    ),
  };

  /* =======================================================
     LOCATIONS
  ======================================================= */

  const daftarLokasi =
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
        ): item is LokasiAdministrasi =>
          item !==
          null
      );

  /* =======================================================
     DUSUN
  ======================================================= */

  const dusunKeji =
    getLokasiByKode(
      daftarLokasi,
      'dusun-keji'
    );

  const dusunSuruhan =
    getLokasiByKode(
      daftarLokasi,
      'dusun-suruhan'
    );

  const dusunSetoyo =
    getLokasiByKode(
      daftarLokasi,
      'dusun-setoyo'
    );

  /* =======================================================
     PIN REGULER

     Dusun tidak perlu pin lagi karena kotak foto pada
     peta sudah menjadi hotspot yang bisa diklik.
  ======================================================= */

  const daftarPin =
    daftarLokasi.filter(
      (
        lokasi
      ) =>
        ![
          'dusun-keji',
          'dusun-suruhan',
          'dusun-setoyo',
        ].includes(
          lokasi.kode
        )
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* =================================================
            HEADER
        ================================================= */}

        <header className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700 sm:text-xs">
            <Map
              size={15}
            />

            {
              peta.label_seksi
            }
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            {
              peta.judul_halaman
            }
          </h1>

          <p className="mt-3 max-w-4xl text-sm font-medium leading-7 text-slate-500 md:text-base">
            {
              peta.deskripsi
            }{' '}

            Halaman ini juga
            menyediakan Peta
            Administrasi dan Peta
            Topografi Desa Keji
            sebagai informasi
            wilayah desa.
          </p>

          {/* ===============================================
              NAVIGATION
          =============================================== */}

          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href="#peta-interaktif"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-800"
            >
              <MapPin
                size={15}
              />

              Peta Wilayah
            </a>

            <a
              href="#peta-administrasi"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-50"
            >
              <MapPinned
                size={15}
              />

              Peta Administrasi
            </a>

            <a
              href="#peta-topografi"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-50"
            >
              <Mountain
                size={15}
              />

              Peta Topografi
            </a>
          </div>
        </header>

        {/* =================================================
            SECTION 01
            PETA INTERAKTIF
        ================================================= */}

        <section
          id="peta-interaktif"
          className="scroll-mt-28 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
        >
          {/* HEADER */}

          <div className="flex flex-col gap-5 border-b border-emerald-50 bg-gradient-to-r from-emerald-50/80 to-white p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-900/20">
                <MapPin
                  size={27}
                  strokeWidth={2.4}
                />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                  Peta Wilayah
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900 md:text-2xl">
                  Peta Interaktif
                  Desa Keji
                </h2>

                <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-slate-500">
                  Jelajahi lokasi
                  Desa Keji dan
                  wilayah di
                  sekitarnya melalui
                  Google Maps.
                </p>
              </div>
            </div>

            <a
              href={
                peta.maps_link_url
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-800"
            >
              {
                peta.tombol_label
              }

              <ExternalLink
                size={16}
              />
            </a>
          </div>

          {/* MAP */}

          <div className="p-4 sm:p-6 md:p-8">
            <div
              className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-inner"
              style={{
                height:
                  `${peta.tinggi_peta}px`,
              }}
            >
              <iframe
                src={
                  peta.maps_embed_url
                }
                className="absolute inset-0 h-full w-full"
                style={{
                  border:
                    0,
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={
                  peta.iframe_title
                }
              />
            </div>

            {/* INFO */}

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <Info
                size={18}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <p className="text-xs font-semibold leading-6 text-blue-800 sm:text-sm">
                Gunakan peta
                interaktif untuk
                melihat lokasi,
                akses jalan, dan
                wilayah sekitar
                Desa Keji secara
                langsung.
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            DIVIDER
        ================================================= */}

        <SectionDivider
          icon={
            MapPinned
          }
        />

        {/* =================================================
            SECTION 02
            PETA ADMINISTRASI
        ================================================= */}

        <section
          id="peta-administrasi"
          className="scroll-mt-28 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
        >
          {/* HEADER */}

          <div className="relative overflow-hidden border-b border-emerald-100 bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-6 text-white md:p-8">
            {/* PATTERN */}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(255,255,255,.55) 1px, transparent 1px)',

                backgroundSize:
                  '24px 24px',
              }}
            />

            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[52px] border-white/[0.04]" />

            {/* CONTENT */}

            <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                  <MapPinned
                    size={27}
                  />
                </div>

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-200">
                    Peta Administrasi
                  </p>

                  <h2 className="mt-1 text-xl font-black md:text-2xl">
                    Administrasi
                    Desa Keji
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-emerald-50/80">
                    Peta administrasi
                    menampilkan batas
                    wilayah dusun,
                    fasilitas umum,
                    tempat ibadah,
                    pendidikan,
                    potensi wisata,
                    dan lokasi penting
                    di Desa Keji.
                  </p>
                </div>
              </div>

              {/* ===========================================
                  BUTTONS
              =========================================== */}

              <div className="flex flex-col gap-2 sm:flex-row">
                <a
                  href={
                    PETA_ADMINISTRASI
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-xs font-extrabold text-emerald-900 transition hover:bg-emerald-50"
                >
                  <ZoomIn
                    size={16}
                  />

                  Ukuran Penuh
                </a>

                <a
                  href={
                    PETA_ADMINISTRASI_PDF
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-xs font-extrabold text-white transition hover:bg-white/15"
                >
                  <FileText
                    size={16}
                  />

                  Buka PDF
                </a>
              </div>
            </div>
          </div>

          {/* =================================================
              ADMINISTRATION MAP
          ================================================= */}

          <div className="p-4 sm:p-6 md:p-8">
            {/* ===============================================
                INFO KLIK
            =============================================== */}

            <div className="mb-4 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <Navigation
                size={19}
                className="mt-0.5 shrink-0 text-emerald-700"
              />

              <div>
                <p className="text-xs font-black text-emerald-900 sm:text-sm">
                  Peta Administrasi
                  Interaktif
                </p>

                <p className="mt-1 text-xs font-semibold leading-6 text-emerald-800">
                  Klik titik lokasi
                  atau foto Dusun
                  Keji, Dusun
                  Suruhan, dan Dusun
                  Setoyo untuk
                  membuka lokasinya
                  melalui Google
                  Maps.
                </p>
              </div>
            </div>

            {/* ===============================================
                IMAGE + HOTSPOTS
            =============================================== */}

            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-inner">
              {/* =============================================
                  IMAGE
              ============================================= */}

              <img
                src={
                  PETA_ADMINISTRASI
                }
                alt="Peta Administrasi Desa Keji Kecamatan Ungaran Barat Kabupaten Semarang"
                loading="lazy"
                className="block h-auto w-full select-none"
              />

              {/* =============================================
                  FOTO DUSUN SURUHAN

                  Area transparan ini berada tepat
                  di atas foto Dusun Suruhan
                  yang sudah menjadi bagian dari PNG.
              ============================================= */}

              <DusunArea
                lokasi={
                  dusunSuruhan
                }
                fallbackName="Dusun Suruhan"
                style={{
                  left:
                    '8.5%',

                  top:
                    '20.4%',

                  width:
                    '18%',

                  height:
                    '20%',
                }}
              />

              {/* =============================================
                  FOTO DUSUN KEJI
              ============================================= */}

              <DusunArea
                lokasi={
                  dusunKeji
                }
                fallbackName="Dusun Keji"
                style={{
                  left:
                    '33%',

                  top:
                    '8%',

                  width:
                    '17.5%',

                  height:
                    '20%',
                }}
              />

              {/* =============================================
                  FOTO DUSUN SETOYO
              ============================================= */}

              <DusunArea
                lokasi={
                  dusunSetoyo
                }
                fallbackName="Dusun Setoyo"
                style={{
                  left:
                    '45.2%',

                  top:
                    '57.5%',

                  width:
                    '17.7%',

                  height:
                    '20%',
                }}
              />

              {/* =============================================
                  LOCATION PINS
              ============================================= */}

              {daftarPin.map(
                (
                  lokasi
                ) => {
                  const mapsUrl =
                    getMapsUrl(
                      lokasi
                    );

                  return (
                    <a
                      key={
                        lokasi.id
                      }
                      href={
                        mapsUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Buka ${lokasi.nama} di Google Maps`}
                      title={`${lokasi.nama} - Buka Google Maps`}
                      className="group absolute z-20 -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left:
                          `${lokasi.posisi_x}%`,

                        top:
                          `${lokasi.posisi_y}%`,
                      }}
                    >
                      {/* =====================================
                          HOVER HIT AREA

                          Dibuat lebih besar dari marker supaya
                          lebih mudah diklik.
                      ===================================== */}

                      <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-12 sm:w-12" />

                      {/* =====================================
                          PULSE
                      ===================================== */}

                      <span className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 opacity-0 transition group-hover:animate-ping group-hover:opacity-100 sm:h-10 sm:w-10" />

                      {/* =====================================
                          MARKER
                      ===================================== */}

                      <span className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-700 text-white shadow-[0_3px_10px_rgba(0,0,0,0.35)] transition duration-200 group-hover:scale-125 group-hover:bg-amber-500 sm:h-8 sm:w-8">
                        <MapPin
                          size={14}
                          strokeWidth={3}
                        />
                      </span>

                      {/* =====================================
                          TOOLTIP
                      ===================================== */}

                      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden min-w-max -translate-x-1/2 rounded-xl bg-slate-950/95 px-3 py-2 text-[10px] font-extrabold text-white shadow-xl backdrop-blur group-hover:block">
                        {
                          lokasi.nama
                        }

                        <span className="mt-0.5 flex items-center justify-center gap-1 text-[8px] font-semibold text-emerald-300">
                          <Navigation
                            size={9}
                          />

                          Buka Google Maps
                        </span>
                      </span>
                    </a>
                  );
                }
              )}
            </div>

            {/* ===============================================
                MOBILE INFO
            =============================================== */}

            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:hidden">
              <p className="text-[10px] font-semibold leading-5 text-slate-500">
                Sentuh pin hijau
                atau foto dusun pada
                peta untuk membuka
                Google Maps.
              </p>
            </div>

            {/* ===============================================
                LOCATION LIST
            =============================================== */}

            {daftarLokasi.length >
              0 && (
              <div className="mt-7">
                <div className="mb-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                    Lokasi pada Peta
                  </p>

                  <h3 className="mt-1 text-xl font-black text-slate-900">
                    Titik Lokasi
                    Administrasi
                  </h3>

                  <p className="mt-2 text-xs font-medium leading-6 text-slate-500">
                    Pilih lokasi di
                    bawah untuk
                    membuka petunjuk
                    lokasi melalui
                    Google Maps.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {daftarLokasi.map(
                    (
                      lokasi,
                      index
                    ) => (
                      <LokasiCard
                        key={
                          lokasi.id
                        }
                        lokasi={
                          lokasi
                        }
                        nomor={
                          index +
                          1
                        }
                      />
                    )
                  )}
                </div>
              </div>
            )}

            {/* ===============================================
                INFO MAP
            =============================================== */}

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <InfoPeta
                label="Wilayah"
                value="Desa Keji"
              />

              <InfoPeta
                label="Kecamatan"
                value="Ungaran Barat"
              />

              <InfoPeta
                label="Skala Peta"
                value="1 : 15.000"
              />
            </div>

            {/* ===============================================
                DOWNLOAD
            =============================================== */}

            <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-slate-900">
                  Peta Administrasi
                  Desa Keji
                </p>

                <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                  KKN-T 123 Desa
                  Keji · Universitas
                  Diponegoro · 2026
                </p>
              </div>

              <a
                href={
                  PETA_ADMINISTRASI_PDF
                }
                download="Administrasi Desa Keji.pdf"
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-xs font-extrabold text-white transition hover:bg-emerald-800"
              >
                <Download
                  size={16}
                />

                Unduh PDF
              </a>
            </div>
          </div>
        </section>

        {/* =================================================
            DIVIDER
        ================================================= */}

        <SectionDivider
          icon={
            Mountain
          }
        />

        {/* =================================================
            SECTION 03
            PETA TOPOGRAFI
        ================================================= */}

        <section
          id="peta-topografi"
          className="scroll-mt-28 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
        >
          {/* ===============================================
              HEADER
          =============================================== */}

          <div className="relative overflow-hidden border-b border-emerald-100 bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-6 text-white md:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(255,255,255,.55) 1px, transparent 1px)',

                backgroundSize:
                  '24px 24px',
              }}
            />

            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[52px] border-white/[0.04]" />

            <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur">
                  <Mountain
                    size={27}
                  />
                </div>

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-200">
                    Peta Topografi
                  </p>

                  <h2 className="mt-1 text-xl font-black md:text-2xl">
                    Topografi Desa
                    Keji
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-emerald-50/80">
                    Peta topografi
                    memberikan
                    informasi
                    mengenai variasi
                    ketinggian
                    wilayah Desa
                    Keji, Kecamatan
                    Ungaran Barat,
                    Kabupaten
                    Semarang.
                  </p>
                </div>
              </div>

              {/* BUTTONS */}

              <div className="flex flex-col gap-2 sm:flex-row">
                <a
                  href={
                    PETA_TOPOGRAFI
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-xs font-extrabold text-emerald-900 transition hover:bg-emerald-50"
                >
                  <ZoomIn
                    size={16}
                  />

                  Lihat Ukuran
                  Penuh
                </a>

                <a
                  href={
                    PETA_TOPOGRAFI
                  }
                  download="Peta Topografi Desa Keji.png"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-xs font-extrabold text-white transition hover:bg-white/15"
                >
                  <Download
                    size={16}
                  />

                  Unduh Peta
                </a>
              </div>
            </div>
          </div>

          {/* ===============================================
              IMAGE
          =============================================== */}

          <div className="p-4 sm:p-6 md:p-8">
            <a
              href={
                PETA_TOPOGRAFI
              }
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
              aria-label="Buka Peta Topografi Desa Keji dalam ukuran penuh"
            >
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
                <img
                  src={
                    PETA_TOPOGRAFI
                  }
                  alt="Peta Topografi Desa Keji Kecamatan Ungaran Barat Kabupaten Semarang"
                  loading="lazy"
                  className="h-auto w-full object-contain transition duration-500 group-hover:scale-[1.01]"
                />

                {/* HOVER */}

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition duration-300 group-hover:bg-black/10 group-hover:opacity-100">
                  <div className="flex items-center gap-2 rounded-xl bg-slate-950/80 px-4 py-3 text-xs font-extrabold text-white shadow-xl backdrop-blur">
                    <ZoomIn
                      size={16}
                    />

                    Buka Ukuran
                    Penuh
                  </div>
                </div>
              </div>
            </a>

            {/* INFO */}

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <InfoPeta
                label="Wilayah"
                value="Desa Keji"
              />

              <InfoPeta
                label="Kecamatan"
                value="Ungaran Barat"
              />

              <InfoPeta
                label="Skala Peta"
                value="1 : 14.000"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="mt-5 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-5">
              <div className="flex items-start gap-3">
                <Mountain
                  size={20}
                  className="mt-0.5 shrink-0 text-emerald-700"
                />

                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Informasi
                    Topografi
                  </h3>

                  <p className="mt-2 text-sm font-medium leading-7 text-slate-600">
                    Peta ini
                    menggambarkan
                    variasi elevasi
                    wilayah Desa
                    Keji melalui
                    gradasi warna.
                    Informasi
                    topografi dapat
                    digunakan untuk
                    memberikan
                    gambaran kondisi
                    ketinggian dan
                    karakter wilayah
                    desa.
                  </p>
                </div>
              </div>
            </div>

            {/* SOURCE */}

            <div className="mt-4 flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Peta Topografi
                Desa Keji
              </span>

              <span>
                KKN Tematik 123
                Universitas
                Diponegoro · 2026
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   DUSUN HOTSPOT

   Kotak transparan di atas foto Dusun
   yang sudah tercetak pada gambar administrasi.
========================================================= */

function DusunArea({
  lokasi,
  fallbackName,
  style,
}: {
  lokasi:
    LokasiAdministrasi | null;

  fallbackName:
    string;

  style: {
    left:
      string;

    top:
      string;

    width:
      string;

    height:
      string;
  };
}) {
  const nama =
    lokasi?.nama ??
    fallbackName;

  const mapsUrl =
    lokasi
      ? getMapsUrl(
          lokasi
        )
      : getDusunFallbackMapsUrl(
          fallbackName
        );

  return (
    <a
      href={
        mapsUrl
      }
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Buka ${nama} di Google Maps`}
      title={`${nama} - Buka Google Maps`}
      className="
        group
        absolute
        z-30
        cursor-pointer
        rounded-sm
        border-2
        border-transparent
        transition
        duration-200
        hover:border-emerald-400
        hover:bg-emerald-500/10
        hover:shadow-[0_0_0_4px_rgba(16,185,129,0.18)]
      "
      style={
        style
      }
    >
      {/* =========================================
          DARK OVERLAY HOVER
      ========================================= */}

      <span className="pointer-events-none absolute inset-0 bg-emerald-950/0 transition group-hover:bg-emerald-950/10" />

      {/* =========================================
          LABEL HOVER
      ========================================= */}

      <span
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          hidden
          -translate-x-1/2
          -translate-y-1/2
          items-center
          gap-2
          whitespace-nowrap
          rounded-xl
          bg-slate-950/90
          px-3
          py-2
          text-[9px]
          font-extrabold
          text-white
          shadow-xl
          backdrop-blur
          group-hover:flex
          sm:text-[10px]
        "
      >
        <MapPin
          size={13}
          className="text-emerald-300"
        />

        {
          nama
        }

        <ExternalLink
          size={11}
          className="text-emerald-300"
        />
      </span>

      {/* =========================================
          SMALL CLICK INDICATOR
      ========================================= */}

      <span className="pointer-events-none absolute bottom-2 right-2 hidden h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-white shadow-lg group-hover:flex">
        <Navigation
          size={13}
        />
      </span>
    </a>
  );
}

/* =========================================================
   LOCATION CARD

   Semua kartu selalu bisa diklik.
   Jika maps_url kosong → Google Maps Search.
========================================================= */

function LokasiCard({
  lokasi,
  nomor,
}: {
  lokasi:
    LokasiAdministrasi;

  nomor:
    number;
}) {
  const mapsUrl =
    getMapsUrl(
      lokasi
    );

  return (
    <a
      href={
        mapsUrl
      }
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
    >
      {/* ICON */}

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
        <MapPin
          size={18}
        />
      </div>

      {/* INFO */}

      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-emerald-600">
          {String(
            nomor
          ).padStart(
            2,
            '0'
          )}{' '}

          •{' '}

          {
            lokasi.kategori
          }
        </p>

        <h4 className="mt-1 truncate text-sm font-black text-slate-800 transition group-hover:text-emerald-800">
          {
            lokasi.nama
          }
        </h4>

        <p className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-700">
          <Navigation
            size={10}
          />

          Buka Google Maps
        </p>
      </div>

      <ExternalLink
        size={14}
        className="shrink-0 text-emerald-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-700"
      />
    </a>
  );
}

/* =========================================================
   INFO PETA
========================================================= */

function InfoPeta({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-slate-400">
        {
          label
        }
      </p>

      <p className="mt-1.5 text-sm font-black text-slate-800">
        {
          value
        }
      </p>
    </div>
  );
}

/* =========================================================
   SECTION DIVIDER
========================================================= */

function SectionDivider({
  icon: Icon,
}: {
  icon:
    LucideIcon;
}) {
  return (
    <div className="my-8 flex items-center gap-4 sm:my-10">
      <div className="h-px flex-1 bg-slate-200" />

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700">
        <Icon
          size={18}
        />
      </div>

      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}