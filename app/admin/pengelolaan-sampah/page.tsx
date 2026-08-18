// app/admin/pengelolaan-sampah/page.tsx

import Link from 'next/link';

import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileText,
  Info,
  Link2,
  MapPin,
  MapPinned,
  Navigation,
  Recycle,
  Save,
  Trash2,
  type LucideIcon,
} from 'lucide-react';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import {
  simpanBookletPengelolaanSampahAction,
  simpanLokasiPengelolaanSampahAction,
} from './actions';

/* =========================================================
   CONFIG
========================================================= */

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

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

type JenisLokasi =
  | 'TPS'
  | 'Pengepul';

interface LokasiAdmin {
  id:
    string;

  kode:
    string;

  nama:
    string;

  jenis:
    JenisLokasi;

  mapsUrl:
    string;

  keterangan:
    string;

  aktif:
    boolean;

  urutan:
    number;
}

interface BookletAdmin {
  judul:
    string;

  deskripsi:
    string;

  aktif:
    boolean;
}

interface PageProps {
  searchParams:
    Promise<{
      success?:
        string;

      error?:
        string;
    }>;
}

/* =========================================================
   DEFAULT
========================================================= */

const DEFAULT_BOOKLET:
  BookletAdmin = {
  judul:
    'Booklet Informasi Pengepul Desa Keji',

  deskripsi:
    'Booklet digital yang menyediakan informasi mengenai pengepul di Desa Keji sebagai bagian dari penyediaan informasi pengelolaan sampah dan lingkungan desa.',

  aktif:
    true,
};

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

/* =========================================================
   NORMALIZE LOCATION
========================================================= */

function normalizeLokasi(
  value:
    unknown
): LokasiAdmin | null {
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

  const jenisRaw =
    safeString(
      row.jenis
    );

  if (
    !id ||
    !kode ||
    !nama ||
    (
      jenisRaw !==
        'TPS' &&
      jenisRaw !==
        'Pengepul'
    )
  ) {
    return null;
  }

  const urutan =
    Number(
      row.urutan ??
        0
    );

  return {
    id,

    kode,

    nama,

    jenis:
      jenisRaw,

    mapsUrl:
      safeString(
        row.maps_url
      ),

    keterangan:
      safeString(
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
): BookletAdmin {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(
      value
    )
  ) {
    return (
      DEFAULT_BOOKLET
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
      DEFAULT_BOOKLET
        .judul,

    deskripsi:
      safeString(
        row.booklet_deskripsi
      ) ||
      DEFAULT_BOOKLET
        .deskripsi,

    aktif:
      row.booklet_aktif ===
        null ||
      row.booklet_aktif ===
        undefined
        ? true
        : Boolean(
            row.booklet_aktif
          ),
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function AdminPengelolaanSampahPage({
  searchParams,
}: PageProps) {
  const [
    params,
    lokasiResult,
    settingsResult,
  ] =
    await Promise.all([
      searchParams,

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
          urutan,
          created_at,
          updated_at
        `)
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
          booklet_aktif,
          updated_at
        `)
        .eq(
          'setting_key',
          SETTINGS_KEY
        )
        .maybeSingle(),
    ]);

  /* =======================================================
     ERRORS
  ======================================================= */

  if (
    lokasiResult.error
  ) {
    console.error(
      'Gagal mengambil data pengelolaan sampah:',
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
      'Gagal mengambil pengaturan Booklet Pengepul:',
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
     DATA
  ======================================================= */

  const items =
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
        ): item is LokasiAdmin =>
          item !==
          null
      );

  const booklet =
    normalizeBooklet(
      settingsResult.data
    );

  /* =======================================================
     STATISTICS
  ======================================================= */

  const jumlahAktif =
    items.filter(
      (
        item
      ) =>
        item.aktif
    ).length;

  const jumlahMaps =
    items.filter(
      (
        item
      ) =>
        Boolean(
          item.mapsUrl
        )
    ).length;

  const jumlahTps =
    items.filter(
      (
        item
      ) =>
        item.jenis ===
        'TPS'
    ).length;

  const jumlahPengepul =
    items.filter(
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
    <div className="mx-auto max-w-[1500px] space-y-7">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 px-6 py-8 text-white shadow-xl sm:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,.5) 1px, transparent 1px)',

            backgroundSize:
              '26px 26px',
          }}
        />

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[52px] border-white/[0.05]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <Recycle
                size={27}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-200">
                Pengelolaan Website
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                Pengelolaan Sampah
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                Kelola titik TPS,
                pengepul, tautan
                Google Maps, Booklet
                Informasi Pengepul,
                dan Flipbook Pengepul
                Desa Keji.
              </p>
            </div>
          </div>

          <Link
            href="/pengelolaan-sampah"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold transition hover:bg-white/15"
          >
            Lihat Halaman Publik

            <ExternalLink
              size={16}
            />
          </Link>
        </div>
      </section>

      {/* =====================================================
          MESSAGE
      ===================================================== */}

      {params.success && (
        <Message
          type="success"
          text={
            params.success
          }
        />
      )}

      {params.error && (
        <Message
          type="error"
          text={
            params.error
          }
        />
      )}

      {lokasiResult.error && (
        <Message
          type="error"
          text="Data lokasi gagal dimuat. Pastikan tabel pengelolaan_sampah_lokasi sudah dibuat."
        />
      )}

      {settingsResult.error && (
        <Message
          type="error"
          text="Pengaturan booklet gagal dimuat. Pastikan tabel pengelolaan_sampah_settings sudah dibuat."
        />
      )}

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Lokasi Aktif"
          value={
            jumlahAktif
          }
          icon={
            MapPinned
          }
        />

        <StatCard
          label="Google Maps Terisi"
          value={
            jumlahMaps
          }
          icon={
            Navigation
          }
        />

        <StatCard
          label="TPS"
          value={
            jumlahTps
          }
          icon={
            Trash2
          }
        />

        <StatCard
          label="Pengepul"
          value={
            jumlahPengepul
          }
          icon={
            Recycle
          }
        />
      </section>

      {/* =====================================================
          PETA PREVIEW
      ===================================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <MapPinned
                size={21}
              />
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                Peta Publik
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                Peta Persebaran TPS
                dan Pengepul
              </h2>

              <p className="mt-1 max-w-3xl text-xs font-medium leading-5 text-slate-500">
                Peta menggunakan file
                tetap dari folder
                public. Admin dapat
                mengatur enam titik
                lokasi, nama, jenis,
                tautan Google Maps,
                keterangan, urutan,
                dan status publikasi.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-slate-100 p-4 sm:p-6">
          <div className="mx-auto min-w-[800px] max-w-[1100px] overflow-hidden rounded-2xl bg-white shadow">
            <img
              src={
                MAP_IMAGE
              }
              alt="Peta Persebaran TPS dan Pengepul Desa Keji"
              className="block h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          BOOKLET PENGEPUL
      ===================================================== */}

      <section
        id="booklet-pengepul"
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-white p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
              <BookOpen
                size={23}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                Dokumen Informasi
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                Booklet Pengepul
              </h2>

              <p className="mt-1 max-w-3xl text-sm font-medium leading-6 text-slate-500">
                Kelola judul,
                deskripsi, dan status
                publikasi Booklet
                Informasi Pengepul
                Desa Keji.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* COVER */}

          <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#eef7bf] via-[#fffde7] to-emerald-50 p-6 sm:p-8">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(6,78,59,0.15) 1px, transparent 1px)',

                backgroundSize:
                  '22px 22px',
              }}
            />

            <div className="relative w-full max-w-[220px] overflow-hidden rounded-2xl bg-white shadow-xl">
              <img
                src={
                  BOOKLET_COVER
                }
                alt="Cover Booklet Pengepul Desa Keji"
                className="h-auto w-full"
              />
            </div>
          </div>

          {/* FORM */}

          <form
            action={
              simpanBookletPengelolaanSampahAction
            }
            className="p-6 sm:p-7"
          >
            <label className="block">
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Judul Booklet

                <span className="ml-1 text-red-500">
                  *
                </span>
              </span>

              <input
                name="booklet_judul"
                type="text"
                required
                maxLength={200}
                defaultValue={
                  booklet.judul
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Deskripsi

                <span className="ml-1 text-red-500">
                  *
                </span>
              </span>

              <textarea
                name="booklet_deskripsi"
                rows={6}
                required
                maxLength={1500}
                defaultValue={
                  booklet.deskripsi
                }
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium leading-7 text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />

              <p className="mt-2 text-[10px] font-medium text-slate-400">
                Maksimal 1.500
                karakter.
              </p>
            </label>

            {/* FILE INFO */}

            <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <FileText
                  size={18}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <div>
                  <p className="text-xs font-extrabold text-blue-900">
                    Dokumen Booklet
                  </p>

                  <p className="mt-1 text-xs font-medium leading-5 text-blue-700">
                    Cover dan PDF
                    menggunakan file
                    tetap dari folder
                    public. Versi
                    flipbook menggunakan
                    Heyzine.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={
                        BOOKLET_COVER
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-[10px] font-extrabold text-blue-700"
                    >
                      <ExternalLink
                        size={12}
                      />

                      Lihat Cover
                    </a>

                    <a
                      href={
                        BOOKLET_PDF
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-[10px] font-extrabold text-blue-700"
                    >
                      <BookOpen
                        size={12}
                      />

                      Buka PDF
                    </a>

                    <a
                      href={
                        FLIPBOOK_URL
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-[10px] font-extrabold text-emerald-700"
                    >
                      <BookOpen
                        size={12}
                      />

                      Buka Flipbook

                      <ExternalLink
                        size={11}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* STATUS */}

            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <input
                type="checkbox"
                name="booklet_aktif"
                value="true"
                defaultChecked={
                  booklet.aktif
                }
                className="mt-1 h-4 w-4 accent-emerald-700"
              />

              <span>
                <span className="block text-sm font-extrabold text-emerald-900">
                  Tampilkan Booklet
                  dan Flipbook
                </span>

                <span className="mt-1 block text-xs font-medium leading-5 text-emerald-800/70">
                  Jika aktif, booklet
                  PDF dan Flipbook
                  Heyzine akan tampil
                  pada halaman publik.
                </span>
              </span>
            </label>

            {/* ACTION */}

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <a
                  href={
                    BOOKLET_PDF
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-100"
                >
                  <BookOpen
                    size={15}
                  />

                  Preview PDF
                </a>

                <a
                  href={
                    FLIPBOOK_URL
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 text-xs font-extrabold text-blue-700 transition hover:bg-blue-100"
                >
                  <ExternalLink
                    size={15}
                  />

                  Preview Flipbook
                </a>
              </div>

              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800"
              >
                <Save
                  size={16}
                />

                Simpan Booklet
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* =====================================================
          FLIPBOOK PREVIEW
      ===================================================== */}

      <section
        id="flipbook-pengepul"
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <div className="flex flex-col gap-5 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
              <BookOpen
                size={23}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                Flipbook Digital
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                Preview Flipbook
                Pengepul
              </h2>

              <p className="mt-1 max-w-3xl text-sm font-medium leading-6 text-slate-500">
                Tampilan berikut sama
                dengan flipbook yang
                akan ditampilkan pada
                halaman publik.
              </p>
            </div>
          </div>

          <a
            href={
              FLIPBOOK_URL
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-50"
          >
            Buka Heyzine

            <ExternalLink
              size={13}
            />
          </a>
        </div>

        <div className="bg-slate-100 p-4 sm:p-6">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            <div className="aspect-[16/10] w-full">
              <iframe
                src={
                  FLIPBOOK_URL
                }
                title="Flipbook Booklet Pengepul Desa Keji"
                loading="lazy"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 px-6 py-4">
          <p className="text-xs font-medium leading-5 text-slate-500">
            Flipbook menggunakan
            layanan Heyzine dan
            membutuhkan koneksi
            internet untuk dimuat.
          </p>
        </div>
      </section>

      {/* =====================================================
          INFORMATION
      ===================================================== */}

      <section className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-blue-800">
        <Info
          size={20}
          className="mt-0.5 shrink-0"
        />

        <div>
          <p className="text-sm font-extrabold">
            Pengaturan Google Maps
          </p>

          <p className="mt-1 text-xs font-medium leading-6">
            Masukkan tautan hasil
            Google Maps atau Google
            Maps Share untuk
            masing-masing titik.
            Tautan dapat berupa
            maps.app.goo.gl maupun
            google.com/maps. Kolom
            dapat dikosongkan jika
            titik Google Maps belum
            tersedia.
          </p>
        </div>
      </section>

      {/* =====================================================
          LOCATION LIST
      ===================================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                Titik Peta
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                TPS dan Pengepul
              </h2>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500">
                Enam data berikut
                mewakili enam foto
                lokasi TPS dan
                pengepul yang berada
                di dalam gambar peta.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <MapPinned
                size={17}
                className="text-emerald-700"
              />

              <p className="text-xs font-extrabold text-emerald-800">
                {items.length}{' '}
                titik tersimpan
              </p>
            </div>
          </div>
        </div>

        {items.length ===
        0 ? (
          <div className="px-6 py-16 text-center">
            <MapPin
              size={38}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-black text-slate-700">
              Data belum tersedia
            </h3>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Jalankan SQL seed enam
              lokasi terlebih dahulu.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map(
              (
                item,
                index
              ) => (
                <LocationForm
                  key={
                    item.id
                  }
                  item={
                    item
                  }
                  number={
                    index +
                    1
                  }
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   LOCATION FORM
========================================================= */

function LocationForm({
  item,
  number,
}: {
  item:
    LokasiAdmin;

  number:
    number;
}) {
  const hasMaps =
    Boolean(
      item.mapsUrl
    );

  const isTps =
    item.jenis ===
    'TPS';

  return (
    <form
      action={
        simpanLokasiPengelolaanSampahAction
      }
      className="p-5 sm:p-6"
    >
      <input
        type="hidden"
        name="id"
        value={
          item.id
        }
      />

      <div className="grid gap-6 xl:grid-cols-[190px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              isTps
                ? 'bg-red-100 text-red-600'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
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

          <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
            Titik{' '}
            {String(
              number
            ).padStart(
              2,
              '0'
            )}
          </p>

          <h3 className="mt-2 font-black text-slate-900">
            {item.nama}
          </h3>

          <p className="mt-2 break-all text-[10px] font-semibold text-slate-400">
            {item.kode}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span
              className={`inline-flex rounded-full px-3 py-1.5 text-[9px] font-extrabold uppercase ${
                isTps
                  ? 'bg-red-100 text-red-600'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {
                item.jenis
              }
            </span>

            {hasMaps ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-[9px] font-extrabold uppercase text-emerald-700">
                <CheckCircle2
                  size={12}
                />

                Maps Tersedia
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-[9px] font-extrabold uppercase text-amber-700">
                <AlertCircle
                  size={12}
                />

                Maps Kosong
              </span>
            )}
          </div>
        </aside>

        <div className="grid gap-5 md:grid-cols-2">
          <TextInput
            name="nama"
            label="Nama Lokasi"
            value={
              item.nama
            }
          />

          <label className="block">
            <span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Jenis

              <span className="ml-1 text-red-500">
                *
              </span>
            </span>

            <select
              name="jenis"
              required
              defaultValue={
                item.jenis
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            >
              <option value="TPS">
                TPS
              </option>

              <option value="Pengepul">
                Pengepul
              </option>
            </select>
          </label>

          <div className="md:col-span-2">
            <label className="block">
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Link Google Maps
              </span>

              <div className="relative">
                <Link2
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  name="maps_url"
                  type="url"
                  defaultValue={
                    item.mapsUrl
                  }
                  placeholder="https://maps.app.goo.gl/..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <p className="mt-2 text-[10px] font-medium text-slate-400">
                Tautan ini digunakan
                ketika pengguna
                mengklik foto lokasi
                pada peta publik dan
                tombol Google Maps
                pada kartu lokasi.
              </p>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block">
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Keterangan
              </span>

              <textarea
                name="keterangan"
                rows={4}
                defaultValue={
                  item.keterangan
                }
                placeholder="Informasi singkat mengenai lokasi..."
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium leading-7 text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </label>
          </div>

          <TextInput
            name="urutan"
            label="Urutan"
            value={String(
              item.urutan
            )}
            type="number"
            min="0"
          />

          <label className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <input
              type="checkbox"
              name="aktif"
              value="true"
              defaultChecked={
                item.aktif
              }
              className="mt-1 h-4 w-4 accent-emerald-700"
            />

            <span>
              <span className="block text-sm font-extrabold text-emerald-900">
                Aktif
              </span>

              <span className="mt-1 block text-xs font-medium text-emerald-800/70">
                Tampilkan titik pada
                halaman publik dan
                aktifkan area klik
                pada peta.
              </span>
            </span>
          </label>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 md:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {hasMaps ? (
                <a
                  href={
                    item.mapsUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-100"
                >
                  <Navigation
                    size={14}
                  />

                  Coba Google Maps

                  <ExternalLink
                    size={12}
                  />
                </a>
              ) : (
                <span className="text-xs font-semibold text-slate-400">
                  Google Maps belum
                  diisi.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800"
            >
              <Save
                size={16}
              />

              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

/* =========================================================
   TEXT INPUT
========================================================= */

function TextInput({
  name,
  label,
  value,
  type =
    'text',
  min,
}: {
  name:
    string;

  label:
    string;

  value:
    string;

  type?:
    string;

  min?:
    string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
        {label}

        <span className="ml-1 text-red-500">
          *
        </span>
      </span>

      <input
        name={
          name
        }
        type={
          type
        }
        min={
          min
        }
        required
        defaultValue={
          value
        }
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  icon:
    Icon,
}: {
  label:
    string;

  value:
    number;

  icon:
    LucideIcon;
}) {
  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black text-emerald-950">
            {value.toLocaleString(
              'id-ID'
            )}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <Icon
            size={20}
          />
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   MESSAGE
========================================================= */

function Message({
  type,
  text,
}: {
  type:
    | 'success'
    | 'error';

  text:
    string;
}) {
  const success =
    type ===
    'success';

  const Icon =
    success
      ? CheckCircle2
      : AlertCircle;

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 ${
        success
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-red-200 bg-red-50 text-red-700'
      }`}
    >
      <Icon
        size={19}
        className="mt-0.5 shrink-0"
      />

      <p className="text-sm font-semibold">
        {text}
      </p>
    </div>
  );
}