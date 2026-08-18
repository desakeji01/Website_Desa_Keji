// app/(public)/profil/sejarah/page.tsx

import Link from 'next/link';

import {
  ArrowRight,
  BookOpen,
  Calendar,
  Download,
  Droplets,
  ExternalLink,
  Eye,
  FileText,
  Landmark,
  Map,
  Music2,
  ShoppingBag,
  Sparkles,
  User,
  Utensils,
  type LucideIcon,
} from 'lucide-react';

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

const SETTINGS_KEY =
  'utama';

const JENIS_EBOOK =
  'ebook-sejarah';

const EBOOK_UTAMA_PDF =
  '/BUKU%20SEJARAH%20DESA%20KEJI.pdf';

const EBOOK_UTAMA_COVER =
  '/cover%20sejarah.png';

/* =========================================================
   TYPES
========================================================= */

interface LayananDatabase {
  id:
    number |
    string |
    null;

  nama:
    string |
    null;

  slug:
    string |
    null;
}

interface SejarahSettings {
  judul_halaman: string;

  tanggal_publikasi: string;

  penulis: string;

  kategori: string;

  gambar_url: string;

  pengantar_utama: string;

  pengantar_kedua: string;

  ebook_label: string;

  ebook_judul: string;

  ebook_deskripsi: string;

  ebook_empty_judul: string;

  ebook_empty_deskripsi: string;
}

interface EbookSejarahPublik {
  id: string;

  judul: string;

  deskripsi: string;

  penyusun: string;

  tahun:
    number | null;

  jumlah_halaman:
    number | null;

  file_url: string;

  cover_url:
    string | null;

  urutan: number;
}

/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const DEFAULT_SETTINGS:
  SejarahSettings = {
  judul_halaman:
    'Sejarah dan Potensi Desa Keji',

  tanggal_publikasi:
    '2026-07-05',

  penulis:
    'Admin Desa',

  kategori:
    'Informasi Publik',

  gambar_url:
    '/background.png',

  pengantar_utama:
    'Desa Keji merupakan salah satu desa yang berada di Kecamatan Ungaran Barat, Kabupaten Semarang. Letaknya di kawasan lereng Gunung Ungaran memberikan Desa Keji potensi alam, budaya, kesenian, kuliner, usaha masyarakat, dan wisata yang beragam.',

  pengantar_kedua:
    'Berbagai potensi tersebut masih dipertahankan dan dikembangkan oleh masyarakat. Selain menjadi bagian dari kehidupan sehari-hari warga, potensi tersebut juga menjadi identitas Desa Keji dan modal pengembangan Desa Wisata Keji.',

  ebook_label:
    'Arsip Digital',

  ebook_judul:
    'Ebook Sejarah Desa Keji',

  ebook_deskripsi:
    'Baca dan unduh dokumentasi sejarah Desa Keji dalam bentuk buku digital.',

  ebook_empty_judul:
    'Ebook sejarah sedang disiapkan',

  ebook_empty_deskripsi:
    'Ebook akan ditampilkan setelah ditambahkan dan dipublikasikan melalui halaman administrator.',
};

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

function formatTanggalPublikasi(
  value: string
) {
  const date =
    new Date(
      `${value}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return '05 Juli 2026';
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
    }
  ).format(date);
}

/* =========================================================
   NORMALIZE EBOOK
========================================================= */

function normalizeEbook(
  value: unknown
): EbookSejarahPublik | null {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(value)
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

  const judul =
    safeString(
      row.judul
    );

  const deskripsi =
    safeString(
      row.deskripsi
    );

  const penyusun =
    safeString(
      row.penyusun
    );

  const fileUrl =
    safeString(
      row.file_url
    );

  const urutan =
    Number(
      row.urutan ??
        0
    );

  if (
    !id ||
    !judul ||
    !deskripsi ||
    !penyusun ||
    !fileUrl ||
    !Number.isInteger(
      urutan
    )
  ) {
    return null;
  }

  const tahun =
    row.tahun ===
      null ||
    row.tahun ===
      undefined
      ? null
      : Number(
          row.tahun
        );

  const jumlahHalaman =
    row.jumlah_halaman ===
      null ||
    row.jumlah_halaman ===
      undefined
      ? null
      : Number(
          row.jumlah_halaman
        );

  return {
    id,

    judul,

    deskripsi,

    penyusun,

    tahun:
      tahun !== null &&
      Number.isInteger(
        tahun
      )
        ? tahun
        : null,

    jumlah_halaman:
      jumlahHalaman !==
        null &&
      Number.isInteger(
        jumlahHalaman
      )
        ? jumlahHalaman
        : null,

    file_url:
      fileUrl,

    cover_url:
      safeString(
        row.cover_url
      ) ||
      null,

    urutan,
  };
}

/* =========================================================
   DATA SETTINGS
========================================================= */

async function getSejarahSettings():
  Promise<SejarahSettings> {
  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from(
        'profil_sejarah_settings'
      )
      .select(`
        judul_halaman,
        tanggal_publikasi,
        penulis,
        kategori,
        gambar_url,
        pengantar_utama,
        pengantar_kedua,
        ebook_label,
        ebook_judul,
        ebook_deskripsi,
        ebook_empty_judul,
        ebook_empty_deskripsi
      `)
      .eq(
        'setting_key',
        SETTINGS_KEY
      )
      .maybeSingle();

  if (error) {
    console.error(
      'Gagal mengambil pengaturan halaman sejarah:',
      {
        message:
          error.message,

        code:
          error.code,

        details:
          error.details,

        hint:
          error.hint,
      }
    );

    return DEFAULT_SETTINGS;
  }

  if (!data) {
    return DEFAULT_SETTINGS;
  }

  return {
    judul_halaman:
      safeString(
        data.judul_halaman
      ) ||
      DEFAULT_SETTINGS
        .judul_halaman,

    tanggal_publikasi:
      safeString(
        data.tanggal_publikasi
      ) ||
      DEFAULT_SETTINGS
        .tanggal_publikasi,

    penulis:
      safeString(
        data.penulis
      ) ||
      DEFAULT_SETTINGS
        .penulis,

    kategori:
      safeString(
        data.kategori
      ) ||
      DEFAULT_SETTINGS
        .kategori,

    gambar_url:
      safeString(
        data.gambar_url
      ) ||
      DEFAULT_SETTINGS
        .gambar_url,

    pengantar_utama:
      safeString(
        data.pengantar_utama
      ) ||
      DEFAULT_SETTINGS
        .pengantar_utama,

    pengantar_kedua:
      safeString(
        data.pengantar_kedua
      ) ||
      DEFAULT_SETTINGS
        .pengantar_kedua,

    ebook_label:
      safeString(
        data.ebook_label
      ) ||
      DEFAULT_SETTINGS
        .ebook_label,

    ebook_judul:
      safeString(
        data.ebook_judul
      ) ||
      DEFAULT_SETTINGS
        .ebook_judul,

    ebook_deskripsi:
      safeString(
        data.ebook_deskripsi
      ) ||
      DEFAULT_SETTINGS
        .ebook_deskripsi,

    ebook_empty_judul:
      safeString(
        data.ebook_empty_judul
      ) ||
      DEFAULT_SETTINGS
        .ebook_empty_judul,

    ebook_empty_deskripsi:
      safeString(
        data.ebook_empty_deskripsi
      ) ||
      DEFAULT_SETTINGS
        .ebook_empty_deskripsi,
  };
}

/* =========================================================
   DATA LAYANAN
========================================================= */

async function getDaftarLayanan():
  Promise<PilihanLayanan[]> {
  const {
    data,
    error,
  } =
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
        }
      )
      .order(
        'nama',
        {
          ascending:
            true,
        }
      );

  if (error) {
    console.error(
      'Gagal mengambil layanan pada halaman sejarah:',
      {
        message:
          error.message,

        code:
          error.code,

        details:
          error.details,

        hint:
          error.hint,
      }
    );

    return [];
  }

  const rows =
    (
      data ??
      []
    ) as LayananDatabase[];

  return rows
    .map(
      (
        layanan
      ) => ({
        id:
          Number(
            layanan.id
          ),

        nama:
          safeString(
            layanan.nama
          ),

        slug:
          safeString(
            layanan.slug
          ),
      })
    )
    .filter(
      (
        layanan
      ) =>
        Number.isInteger(
          layanan.id
        ) &&
        layanan.id >
          0 &&
        layanan.nama
          .length >
          0 &&
        layanan.slug
          .length >
          0
    );
}

/* =========================================================
   DATA EBOOK
========================================================= */

async function getEbookSejarah():
  Promise<EbookSejarahPublik[]> {
  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from(
        'desa_wisata_dokumen'
      )
      .select(`
        id,
        judul,
        deskripsi,
        penyusun,
        tahun,
        jumlah_halaman,
        file_url,
        cover_url,
        urutan
      `)
      .eq(
        'jenis',
        JENIS_EBOOK
      )
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
        'tahun',
        {
          ascending:
            false,

          nullsFirst:
            false,
        }
      );

  if (error) {
    console.error(
      'Gagal mengambil Ebook Sejarah:',
      {
        message:
          error.message,

        code:
          error.code,

        details:
          error.details,

        hint:
          error.hint,
      }
    );

    return [];
  }

  return (
    data ??
    []
  )
    .map(
      normalizeEbook
    )
    .filter(
      (
        ebook
      ): ebook is EbookSejarahPublik =>
        ebook !== null
    );
}

/* =========================================================
   PAGE
========================================================= */

export default async function SejarahDesaPage() {
  const [
    daftarLayanan,
    settings,
    daftarEbook,
  ] =
    await Promise.all([
      getDaftarLayanan(),

      getSejarahSettings(),

      getEbookSejarah(),
    ]);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ===================================================
            TEKS BERJALAN
        =================================================== */}

        <div className="relative mb-6 flex items-center gap-3 overflow-hidden rounded-xl bg-emerald-800 px-4 py-2 text-sm font-medium text-white shadow-sm">
          <div className="z-10 shrink-0 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold shadow-md">
            Sekilas Info
          </div>

          <style
            dangerouslySetInnerHTML={{
              __html: `
                @keyframes scrolling-sejarah-info {
                  0% {
                    transform: translateX(100%);
                  }

                  100% {
                    transform: translateX(-100%);
                  }
                }

                .animate-scrolling-sejarah-info {
                  display: inline-block;
                  animation: scrolling-sejarah-info 22s linear infinite;
                  white-space: nowrap;
                }

                @media (prefers-reduced-motion: reduce) {
                  .animate-scrolling-sejarah-info {
                    animation: none;
                  }
                }
              `,
            }}
          />

          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="animate-scrolling-sejarah-info">
              Untuk permohonan
              informasi silakan masuk
              ke menu PPID website ini.
              *** Potensi alam,
              budaya, kesenian,
              kuliner, UMKM, dan
              wisata Desa Keji,
              Kecamatan Ungaran
              Barat, Kabupaten
              Semarang ***
            </div>
          </div>
        </div>

        {/* ===================================================
            LAYOUT
        =================================================== */}

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* =================================================
              KONTEN
          ================================================= */}

          <main className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 lg:w-2/3">
            {/* ===============================================
                TITLE
            =============================================== */}

            <div className="mb-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                Profil Desa Keji
              </p>

              <h1 className="mt-2 text-2xl font-extrabold leading-tight text-gray-800 md:text-3xl">
                {
                  settings.judul_halaman
                }
              </h1>
            </div>

            {/* ===============================================
                METADATA
            =============================================== */}

            <div className="mb-6 flex flex-wrap gap-4 border-b border-gray-100 pb-4 text-xs font-semibold text-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar
                  size={14}
                  className="text-emerald-500"
                />

                {formatTanggalPublikasi(
                  settings.tanggal_publikasi
                )}
              </span>

              <span className="flex items-center gap-1.5">
                <User
                  size={14}
                  className="text-emerald-500"
                />

                {
                  settings.penulis
                }
              </span>

              <span className="flex items-center gap-1.5">
                <Eye
                  size={14}
                  className="text-emerald-500"
                />

                {
                  settings.kategori
                }
              </span>
            </div>

            {/* ===============================================
                GAMBAR UTAMA
            =============================================== */}

            <div className="mb-8 h-[300px] w-full overflow-hidden rounded-xl bg-slate-100 shadow-sm md:h-[400px]">
              <img
                src={
                  settings.gambar_url
                }
                alt={
                  settings.judul_halaman
                }
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* ===============================================
                PENGANTAR
            =============================================== */}

            <div className="prose prose-emerald max-w-none text-justify leading-relaxed text-gray-700">
              <p className="mb-5 text-lg font-medium text-gray-800">
                {
                  settings.pengantar_utama
                }
              </p>

              <p>
                {
                  settings.pengantar_kedua
                }
              </p>
            </div>

            {/* ===============================================
                EBOOK SEJARAH
            =============================================== */}

            <section
              id="ebook-sejarah"
              className="mt-10 scroll-mt-28"
            >
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                  <BookOpen
                    size={23}
                  />
                </div>

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                    {
                      settings.ebook_label
                    }
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-slate-900">
                    {
                      settings.ebook_judul
                    }
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                    {
                      settings.ebook_deskripsi
                    }
                  </p>
                </div>
              </div>

              {/* EBOOK UTAMA BAWAAN */}

              <EbookUtamaSejarahCard />

              {/* EBOOK TAMBAHAN DARI ADMIN */}

              {daftarEbook.length > 0 && (
                <div className="mt-8">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-px flex-1 bg-slate-200" />

                    <span className="rounded-full bg-slate-100 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
                      Ebook Sejarah Lainnya
                    </span>

                    <span className="h-px flex-1 bg-slate-200" />
                  </div>

                  <div className="space-y-5">
                    {daftarEbook.map(
                      (
                        ebook,
                        index
                      ) => (
                        <EbookSejarahCard
                          key={
                            ebook.id
                          }
                          ebook={
                            ebook
                          }
                          nomor={
                            index +
                            2
                          }
                        />
                      )
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* ===============================================
                BAB 5
            =============================================== */}

            <section className="mt-12">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-6 text-white sm:p-8">
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

                <div className="relative">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
                    Bab 5
                  </p>

                  <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                    Potensi Desa
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-emerald-50/80">
                    Potensi Desa Keji
                    meliputi potensi
                    alam, budaya,
                    kesenian, kuliner,
                    UMKM, dan wisata
                    yang masih hidup
                    serta dikembangkan
                    oleh masyarakat.
                  </p>
                </div>
              </div>
            </section>

            {/* ===============================================
                5.1 POTENSI ALAM
            =============================================== */}

            <PotensiHeading
              number="5.1"
              title="Potensi Alam"
              icon={
                Droplets
              }
            />

            <div className="prose prose-emerald max-w-none text-justify leading-relaxed text-gray-700">
              <h4 className="text-lg font-black text-emerald-800">
                5.1.1 Sumber Mata Air
                Kemloso
              </h4>

              <p>
                Sumber Mata Air
                Kemloso merupakan
                sumber mata air yang
                terletak di{' '}
                <strong>
                  Dusun Suruhan
                </strong>
                . Sumber mata air ini
                digunakan oleh
                penduduk Desa Keji
                sebagai jaringan air
                bersih untuk memenuhi
                kebutuhan air
                sehari-hari.
              </p>

              <p>
                Air dari Sumber Mata
                Air Kemloso
                didistribusikan
                menggunakan pipa.
                Sebelum dialirkan ke
                masyarakat, air
                ditampung terlebih
                dahulu pada tampungan
                air besar maupun
                tampungan air kecil
                yang dimiliki oleh
                masing-masing RT.
              </p>

              <p>
                Setiap tahun
                masyarakat
                melaksanakan ritual{' '}
                <strong>
                  Iriban Banyu Kemloso
                </strong>
                . Perayaan ini
                dilaksanakan pada
                bulan Agustus,
                tepatnya pada{' '}
                <strong>
                  Sabtu Pahing
                </strong>
                , dan biasanya
                diselenggarakan
                dengan kirab sesaji
                menuju sumber mata
                air.
              </p>

              <p>
                Sebelum ritual
                dimulai, lokasi di
                sekitar sumber mata
                air dibersihkan.
                Terdapat pula prosesi
                pemotongan ayam dan
                penetesan darah
                pertama pada sumber
                air yang keluar dari
                semak-semak di lereng
                bukit.
              </p>

              <p>
                Menurut salah satu
                sesepuh Desa Keji,
                ritual tersebut
                merupakan bentuk rasa
                syukur masyarakat
                sekaligus upaya
                pelestarian sumber
                air.
              </p>
            </div>

            {/* ===============================================
                5.2 POTENSI BUDAYA
            =============================================== */}

            <PotensiHeading
              number="5.2"
              title="Potensi Budaya"
              icon={
                Landmark
              }
            />

            <div className="prose prose-emerald max-w-none text-justify leading-relaxed text-gray-700">
              <p>
                Desa Keji memiliki
                beberapa kebudayaan
                yang masih ada dan
                dilestarikan oleh
                masyarakat hingga
                sekarang.
              </p>
            </div>

            <PotensiList
              items={[
                'Iriban Banyu Kemloso',
                'Maulid Nabi',
              ]}
            />

            {/* ===============================================
                5.3 POTENSI KESENIAN
            =============================================== */}

            <PotensiHeading
              number="5.3"
              title="Potensi Kesenian"
              icon={
                Music2
              }
            />

            <div className="prose prose-emerald max-w-none text-justify leading-relaxed text-gray-700">
              <p>
                Kesenian yang
                terdapat di Desa Keji
                masih terus
                dilestarikan hingga
                saat ini. Beberapa
                kesenian yang masih
                ada dan dikembangkan
                oleh masyarakat antara
                lain:
              </p>
            </div>

            <PotensiList
              items={[
                'Gamelan',
                'Kuda Debog',
                'Kuda Lumping',
              ]}
            />

            <SectionLinkCard
              href="/desa-wisata/destinasi"
              icon={
                Sparkles
              }
              label="Dokumentasi Budaya"
              title="Lihat Destinasi dan Potensi Desa Keji"
              description="Temukan dokumentasi Iriban Banyu Kemloso, kesenian, tradisi, potensi alam, serta berbagai destinasi Desa Wisata Keji."
              buttonText="Lihat Destinasi & Potensi"
              color="emerald"
            />

            {/* ===============================================
                5.4 POTENSI KULINER
            =============================================== */}

            <PotensiHeading
              number="5.4"
              title="Potensi Kuliner"
              icon={
                Utensils
              }
            />

            <div className="space-y-5">
              <article className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 sm:p-6">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                  5.4.1
                </p>

                <h4 className="mt-2 text-xl font-black text-emerald-950">
                  Tetek Melek
                </h4>

                <div className="mt-4 space-y-4 text-justify text-sm font-medium leading-7 text-slate-600">
                  <p>
                    Tetek Melek
                    merupakan makanan
                    khas Desa Keji
                    yang berbahan
                    dasar singkong.
                    Makanan ini
                    memiliki kemiripan
                    dengan kue
                    tradisional
                    jongkong, tetapi
                    memiliki perbedaan
                    pada cara
                    pengemasannya.
                  </p>

                  <p>
                    Proses
                    pembuatannya
                    dimulai dengan
                    singkong yang
                    telah dikupas dan
                    dibersihkan,
                    kemudian diparut.
                    Setelah itu,
                    singkong diperas
                    untuk mengurangi
                    kadar air.
                  </p>

                  <p>
                    Parutan singkong
                    kemudian diberi
                    garam dan gula
                    jawa, lalu
                    dikukus. Setelah
                    matang dan dingin,
                    makanan dipotong
                    dan disajikan
                    bersama parutan
                    kelapa dan
                    serundeng.
                  </p>
                </div>
              </article>

              <article className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 sm:p-6">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                  5.4.2
                </p>

                <h4 className="mt-2 text-xl font-black text-emerald-950">
                  Pecel Gablok
                </h4>

                <div className="mt-4 space-y-4 text-justify text-sm font-medium leading-7 text-slate-600">
                  <p>
                    Gablok merupakan
                    makanan berbahan
                    dasar beras yang
                    memiliki kemiripan
                    dengan lontong,
                    tetapi berbeda
                    pada cara
                    pembungkusannya.
                  </p>

                  <p>
                    Beras dimasukkan
                    ke dalam plastik
                    kemudian direbus
                    hingga matang.
                    Proses memasak
                    membutuhkan waktu
                    kurang lebih satu
                    jam sampai gablok
                    siap disantap.
                  </p>

                  <p>
                    Gablok biasanya
                    disajikan bersama
                    pecel yang terdiri
                    dari rebusan
                    sayuran, sambal
                    kacang, serta
                    gorengan.
                  </p>
                </div>
              </article>
            </div>

            {/* ===============================================
                5.5 POTENSI UMKM
            =============================================== */}

            <PotensiHeading
              number="5.5"
              title="Potensi UMKM"
              icon={
                ShoppingBag
              }
            />

            <div className="prose prose-emerald max-w-none text-justify leading-relaxed text-gray-700">
              <p>
                Terdapat banyak
                pelaku UMKM di Desa
                Keji. Salah satu
                usaha yang berkembang
                adalah produksi
                berbagai jenis
                keripik yang dibuat
                secara langsung oleh
                masyarakat desa dan
                dapat bertahan selama
                beberapa hari.
              </p>

              <p>
                Selain produk keripik,
                terdapat pula
                pengolahan susu sapi
                perah. Sapi
                dikembangbiakkan dan
                dipelihara dengan
                baik, kemudian susu
                diolah melalui proses
                yang steril sebelum
                diedarkan secara luas,
                termasuk hingga
                Tembalang dan
                Salatiga.
              </p>
            </div>

            <SectionLinkCard
              href="/umkm"
              icon={
                ShoppingBag
              }
              label="Produk Lokal Desa"
              title="Temukan Produk UMKM Desa Keji"
              description="Lihat berbagai produk makanan, minuman, dan usaha masyarakat Desa Keji melalui halaman UMKM."
              buttonText="Lihat UMKM"
              color="emerald"
            />

            {/* ===============================================
                5.6 POTENSI WISATA
            =============================================== */}

            <PotensiHeading
              number="5.6"
              title="Potensi Wisata"
              icon={
                Map
              }
            />

            <div className="prose prose-emerald max-w-none text-justify leading-relaxed text-gray-700">
              <p>
                Desa Keji atau{' '}
                <strong>
                  Desa Wisata Keji
                </strong>{' '}
                memiliki potensi
                wisata kebudayaan dan
                alam yang menarik.
                Potensi wisata budaya
                yang dimiliki antara
                lain{' '}
                <strong>
                  DWK Wono Sesaji
                </strong>{' '}
                dan{' '}
                <strong>
                  Sanggar Tari Budi
                  Utomo
                </strong>
                .
              </p>

              <p>
                Kedua tempat tersebut
                menjadi bagian dari
                ikon kebudayaan Desa
                Wisata Keji. DWK Wono
                Sesaji merupakan
                kawasan yang sarat
                dengan nilai budaya
                dan sering digunakan
                untuk berbagai
                kegiatan seni
                tradisional Desa
                Keji, salah satunya
                Kuda Debog.
              </p>

              <p>
                Sanggar Tari Budi
                Utomo menjadi salah
                satu pusat
                pelestarian seni
                tari. Tempat ini
                digunakan untuk
                melatih generasi muda
                menari sekaligus
                mempersembahkan
                pertunjukan kesenian
                khas Desa Keji.
              </p>

              <p>
                Keberadaan sanggar
                tidak hanya berperan
                dalam melestarikan
                warisan budaya, tetapi
                juga berpotensi
                menjadi wisata
                edukatif bagi
                pengunjung yang ingin
                mengenal lebih dekat
                seni tari tradisional
                Desa Keji.
              </p>

              <p>
                Selain kekayaan
                budaya, posisi Desa
                Keji di lereng Gunung
                Ungaran memberikan
                potensi alam yang
                menarik. Salah
                satunya adalah{' '}
                <strong>
                  Sumber Mata Air
                  Kemloso
                </strong>
                , yang memiliki peran
                penting sebagai
                penyedia air bersih
                bagi masyarakat.
              </p>

              <p>
                Lingkungan sekitar
                sumber mata air yang
                dikelilingi pepohonan
                dan area pertanian
                menciptakan suasana
                sejuk. Setiap tahun,
                masyarakat juga
                mengadakan ritual{' '}
                <strong>
                  Iriban Banyu Kemloso
                </strong>{' '}
                sebagai bentuk rasa
                syukur atas
                keberlimpahan air.
              </p>
            </div>

            <SectionLinkCard
              href="/desa-wisata/destinasi"
              icon={
                Map
              }
              label="Desa Wisata Keji"
              title="Jelajahi Destinasi dan Potensi Desa Keji"
              description="Lihat informasi lebih lanjut mengenai wisata budaya, wisata alam, destinasi, serta potensi yang dimiliki Desa Wisata Keji."
              buttonText="Lihat Destinasi"
              color="dark"
            />
          </main>

          {/* =================================================
              SIDEBAR
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
   EBOOK CARD
========================================================= */

function EbookUtamaSejarahCard() {
  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-[#f7f1e8] via-white to-emerald-50 shadow-[0_20px_55px_rgba(6,78,59,0.10)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(6,78,59,0.32) 1px, transparent 1px)',

          backgroundSize:
            '24px 24px',
        }}
      />

      <div className="relative grid lg:grid-cols-[290px_minmax(0,1fr)]">
        {/* COVER */}

        <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#efe7dc] via-[#f9f4ed] to-emerald-50 p-7 sm:p-9">
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-amber-200/30 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-emerald-300/25 blur-3xl" />

          <a
            href={
              EBOOK_UTAMA_PDF
            }
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buka Buku Sejarah Desa Keji"
            className="relative block w-full max-w-[240px]"
          >
            <div className="absolute -bottom-4 left-1/2 h-8 w-[78%] -translate-x-1/2 rounded-full bg-emerald-950/20 blur-xl" />

            <div className="relative overflow-hidden rounded-[1.4rem] bg-white p-2 shadow-[0_22px_55px_rgba(15,23,42,0.22)] transition duration-500 group-hover:-translate-y-1">
              <img
                src={
                  EBOOK_UTAMA_COVER
                }
                alt="Cover Sejarah Desa Keji Kabupaten Semarang"
                loading="lazy"
                className="h-auto w-full rounded-[1rem] object-contain"
              />
            </div>
          </a>
        </div>

        {/* CONTENT */}

        <div className="relative flex flex-col p-6 sm:p-8 lg:p-9">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-700 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.13em] text-white">
              Ebook Utama
            </span>

            <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.13em] text-emerald-700">
              Sejarah Desa
            </span>

            <span className="rounded-full bg-amber-100 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.13em] text-amber-700">
              PDF Digital
            </span>
          </div>

          <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
            Desa Keji · Kabupaten Semarang
          </p>

          <h3 className="mt-2 max-w-2xl text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
            Sejarah Desa Keji
          </h3>

          <p className="mt-2 text-sm font-extrabold text-emerald-700">
            Mengungkap Jejak Sejarah,
            Budaya, dan Perkembangan
            Desa
          </p>

          <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-600">
            Buku digital yang
            mendokumentasikan sejarah,
            budaya, dan perkembangan
            Desa Keji sebagai bagian
            dari arsip serta
            dokumentasi pengetahuan
            desa yang dapat dibaca
            oleh masyarakat secara
            terbuka.
          </p>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white/80 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <User
                size={18}
              />
            </div>

            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                Disusun oleh
              </p>

              <p className="mt-1 text-sm font-black text-slate-800">
                Umi Nurhabibah
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 border-t border-emerald-100 pt-6 sm:flex-row">
            <a
              href={
                EBOOK_UTAMA_PDF
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-800"
            >
              <BookOpen
                size={17}
              />

              Baca Ebook

              <ExternalLink
                size={14}
              />
            </a>

            <a
              href={
                EBOOK_UTAMA_PDF
              }
              download="BUKU SEJARAH DESA KEJI.pdf"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-6 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-100"
            >
              <Download
                size={17}
              />

              Unduh PDF
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   EBOOK CARD DATABASE
========================================================= */

function EbookSejarahCard({
  ebook,
  nomor,
}: {
  ebook:
    EbookSejarahPublik;

  nomor:
    number;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-lg">
      <div className="grid sm:grid-cols-[200px_minmax(0,1fr)]">
        {/* COVER */}

        <div className="relative min-h-72 overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700">
          {ebook.cover_url ? (
            <img
              src={
                ebook.cover_url
              }
              alt={`Cover ${ebook.judul}`}
              loading="lazy"
              className="h-full min-h-72 w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-72 flex-col items-center justify-center p-6 text-center text-white">
              <BookOpen
                size={52}
              />

              <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                Ebook Sejarah
              </p>

              <p className="mt-2 text-xl font-black">
                Desa Keji
              </p>
            </div>
          )}

          <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-black text-white backdrop-blur">
            {String(
              nomor
            ).padStart(
              2,
              '0'
            )}
          </span>
        </div>

        {/* CONTENT */}

        <div className="flex flex-col p-6">
          <div className="flex flex-wrap gap-2">
            {ebook.tahun && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-emerald-700">
                Tahun{' '}
                {
                  ebook.tahun
                }
              </span>
            )}

            {ebook.jumlah_halaman && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-[10px] font-extrabold text-blue-700">
                {
                  ebook.jumlah_halaman
                }{' '}
                halaman
              </span>
            )}
          </div>

          <h3 className="mt-4 text-2xl font-black leading-tight text-slate-900">
            {
              ebook.judul
            }
          </h3>

          <p className="mt-2 text-xs font-extrabold uppercase tracking-wider text-emerald-700">
            Disusun oleh{' '}
            {
              ebook.penyusun
            }
          </p>

          <p className="mt-4 flex-1 text-sm font-medium leading-7 text-slate-600">
            {
              ebook.deskripsi
            }
          </p>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
            <a
              href={
                ebook.file_url
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white transition hover:bg-emerald-800"
            >
              <FileText
                size={16}
              />

              Baca Ebook

              <ExternalLink
                size={13}
              />
            </a>

            <a
              href={
                ebook.file_url
              }
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-100"
            >
              <Download
                size={16}
              />

              Unduh PDF
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   POTENSI HEADING
========================================================= */

function PotensiHeading({
  number,
  title,
  icon:
    Icon,
}: {
  number: string;

  title: string;

  icon: LucideIcon;
}) {
  return (
    <div className="mb-5 mt-10 border-b-2 border-emerald-100 pb-3">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <Icon
            size={21}
          />
        </div>

        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-600">
            {
              number
            }
          </p>

          <h3 className="mt-0.5 text-xl font-black text-gray-800">
            {
              title
            }
          </h3>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   POTENSI LIST
========================================================= */

function PotensiList({
  items,
}: {
  items: string[];
}) {
  return (
    <div className="not-prose mt-5 grid gap-3 sm:grid-cols-2">
      {items.map(
        (
          item,
          index
        ) => (
          <article
            key={
              item
            }
            className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-xs font-black text-white">
              {index +
                1}
            </span>

            <p className="text-sm font-extrabold text-emerald-950">
              {
                item
              }
            </p>
          </article>
        )
      )}
    </div>
  );
}

/* =========================================================
   LINK CARD
========================================================= */

function SectionLinkCard({
  href,
  icon:
    Icon,
  label,
  title,
  description,
  buttonText,
  color,
}: {
  href: string;

  icon: LucideIcon;

  label: string;

  title: string;

  description: string;

  buttonText: string;

  color:
    | 'emerald'
    | 'dark';
}) {
  const isDark =
    color ===
    'dark';

  return (
    <div
      className={`not-prose mt-6 rounded-2xl border p-5 sm:p-6 ${
        isDark
          ? 'border-emerald-800 bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 text-white'
          : 'border-emerald-100 bg-gradient-to-r from-emerald-50 to-white'
      }`}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              isDark
                ? 'border border-white/15 bg-white/10 text-white'
                : 'bg-emerald-700 text-white'
            }`}
          >
            <Icon
              size={20}
            />
          </div>

          <div>
            <p
              className={`text-xs font-extrabold uppercase tracking-[0.14em] ${
                isDark
                  ? 'text-emerald-200'
                  : 'text-emerald-700'
              }`}
            >
              {
                label
              }
            </p>

            <h4
              className={`mt-2 text-lg font-black ${
                isDark
                  ? 'text-white'
                  : 'text-slate-900'
              }`}
            >
              {
                title
              }
            </h4>

            <p
              className={`mt-2 max-w-xl text-sm font-medium leading-6 ${
                isDark
                  ? 'text-emerald-50/80'
                  : 'text-slate-500'
              }`}
            >
              {
                description
              }
            </p>
          </div>
        </div>

        <Link
          href={
            href
          }
          className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold transition ${
            isDark
              ? 'bg-white text-emerald-900 hover:bg-emerald-50'
              : 'bg-emerald-700 text-white hover:bg-emerald-800'
          }`}
        >
          {
            buttonText
          }

          <ArrowRight
            size={15}
          />
        </Link>
      </div>
    </div>
  );
}