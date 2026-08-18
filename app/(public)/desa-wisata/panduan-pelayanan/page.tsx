// app/(public)/desa-wisata/panduan-pelayanan/page.tsx

import type {
  Metadata,
} from 'next';

import Link from 'next/link';

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookMarked,
  BookOpen,
  CheckCircle2,
  Download,
  ExternalLink,
  Eye,
  FileText,
  HandHeart,
  Leaf,
  LibraryBig,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';

import SapaKejiCoverDialog from '@/components/public/SapaKejiCoverDialog';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

export const metadata: Metadata = {
  title:
    'SAPA KEJI — Panduan Pelayanan Wisatawan | SIJI',

  description:
    'SAPA KEJI merupakan panduan pelayanan wisatawan bagi pengelola, pelaku wisata, UMKM, dan masyarakat Desa Wisata Keji.',
};

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

const JENIS_DOKUMEN =
  'hospitality-pocket-book';

const SAPA_KEJI_COVER_URL =
  '/desa-wisata/sapa-keji/cover-sapa-keji.png';

const SAPA_KEJI_FILE_URL =
  '/desa-wisata/sapa-keji/sapa-keji-panduan-pelayanan-wisatawan.pdf';

interface PanduanPelayananPublik {
  id: string;
  judul: string;
  deskripsi: string;
  penyusun: string;

  tahun:
    | number
    | null;

  jumlah_halaman:
    | number
    | null;

  file_url: string;

  cover_url:
    | string
    | null;

  urutan: number;
}

interface NilaiPanduan {
  title: string;
  description: string;
  icon: LucideIcon;
}

const SAPA_KEJI_DEFAULT:
  PanduanPelayananPublik = {
  id:
    'sapa-keji-panduan-pelayanan',

  judul:
    'SAPA KEJI — Panduan Pelayanan Wisatawan Desa Keji',

  deskripsi:
    'SAPA KEJI merupakan panduan praktis untuk membantu pengelola destinasi, pemandu, pelaku UMKM, kelompok sadar wisata, dan masyarakat Desa Keji memberikan pelayanan yang ramah, tertib, informatif, serta berkesan kepada wisatawan.',

  penyusun:
    'Tim Penyusun SAPA KEJI',

  tahun: 2026,

  jumlah_halaman: null,

  file_url:
    SAPA_KEJI_FILE_URL,

  cover_url:
    SAPA_KEJI_COVER_URL,

  urutan: 0,
};

const nilaiPanduan:
  NilaiPanduan[] = [
  {
    title:
      'Ramah kepada Wisatawan',

    description:
      'Membangun interaksi yang sopan, terbuka, dan memberikan rasa nyaman kepada setiap pengunjung.',

    icon: HandHeart,
  },
  {
    title:
      'Informasi yang Jelas',

    description:
      'Menyampaikan informasi destinasi, kegiatan, produk, dan pelayanan secara mudah dipahami.',

    icon: MessageCircle,
  },
  {
    title:
      'Pelayanan yang Tertib',

    description:
      'Mendorong proses pelayanan yang terarah, konsisten, dan dapat diterapkan oleh pelaku wisata.',

    icon: ShieldCheck,
  },
  {
    title:
      'Pengalaman yang Berkesan',

    description:
      'Menciptakan pengalaman kunjungan yang positif dan memperkuat citra Desa Wisata Keji.',

    icon: Sparkles,
  },
];

function safeString(
  value: unknown
): string {
  return String(
    value ?? ''
  ).trim();
}

function safeInteger(
  value: unknown,
  fallback = 0
): number {
  const number =
    Number(value);

  if (
    !Number.isInteger(
      number
    ) ||
    number < 0
  ) {
    return fallback;
  }

  return number;
}

function safePositiveInteger(
  value: unknown
): number | null {
  const number =
    Number(value);

  if (
    !Number.isInteger(
      number
    ) ||
    number <= 0
  ) {
    return null;
  }

  return number;
}

function safeYear(
  value: unknown
): number | null {
  const year =
    Number(value);

  if (
    !Number.isInteger(
      year
    ) ||
    year < 1900 ||
    year > 2200
  ) {
    return null;
  }

  return year;
}

function getSafePublicUrl(
  value: unknown
): string | null {
  const url =
    safeString(value);

  if (!url) {
    return null;
  }

  if (
    url.startsWith('/') &&
    !url.startsWith('//')
  ) {
    return url;
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

function normalizeUrlKey(
  value: string
): string {
  let decodedValue =
    value;

  try {
    decodedValue =
      decodeURIComponent(
        value
      );
  } catch {
    decodedValue =
      value;
  }

  return decodedValue
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function isSapaKeji(
  panduan:
    PanduanPelayananPublik
): boolean {
  const title =
    panduan.judul
      .toLowerCase();

  const fileKey =
    normalizeUrlKey(
      panduan.file_url
    );

  return (
    title.includes(
      'sapa keji'
    ) ||
    fileKey.includes(
      'sapa-keji-panduan-pelayanan-wisatawan.pdf'
    ) ||
    fileKey.includes(
      'sapa keji panduan pelayanan wisatawan desa keji.pdf'
    )
  );
}

function normalizePanduan(
  value: unknown
): PanduanPelayananPublik | null {
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

  const fileUrl =
    getSafePublicUrl(
      row.file_url
    );

  if (
    !id ||
    !judul ||
    !fileUrl
  ) {
    return null;
  }

  return {
    id,

    judul,

    deskripsi:
      safeString(
        row.deskripsi
      ) ||
      'Panduan pelayanan wisata bagi pengelola dan pelaku Desa Wisata Keji.',

    penyusun:
      safeString(
        row.penyusun
      ) ||
      'Pengelola Desa Wisata Keji',

    tahun:
      safeYear(
        row.tahun
      ),

    jumlah_halaman:
      safePositiveInteger(
        row.jumlah_halaman
      ),

    file_url:
      fileUrl,

    cover_url:
      getSafePublicUrl(
        row.cover_url
      ),

    urutan:
      safeInteger(
        row.urutan
      ),
  };
}

function mergePanduan(
  databasePanduan:
    PanduanPelayananPublik[]
): PanduanPelayananPublik[] {
  const databaseSapaKeji =
    databasePanduan.find(
      isSapaKeji
    );

  const panduanUtama:
    PanduanPelayananPublik =
    databaseSapaKeji
      ? {
          ...SAPA_KEJI_DEFAULT,

          ...databaseSapaKeji,

          file_url:
            SAPA_KEJI_FILE_URL,

          cover_url:
            SAPA_KEJI_COVER_URL,

          urutan: 0,
        }
      : {
          ...SAPA_KEJI_DEFAULT,
        };

  const panduanTambahan =
    databasePanduan
      .filter(
        (item) =>
          !isSapaKeji(
            item
          )
      )
      .sort(
        (
          first,
          second
        ) =>
          first.urutan -
          second.urutan
      );

  return [
    panduanUtama,
    ...panduanTambahan,
  ];
}

async function getPanduanPelayanan():
  Promise<
    PanduanPelayananPublik[]
  > {
  const {
    data,
    error,
  } = await supabaseAdmin
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
      JENIS_DOKUMEN
    )
    .eq(
      'aktif',
      true
    )
    .order(
      'urutan',
      {
        ascending: true,
        nullsFirst: false,
      }
    )
    .order(
      'tahun',
      {
        ascending: false,
        nullsFirst: false,
      }
    );

  if (error) {
    console.error(
      'Gagal mengambil panduan pelayanan wisata:',
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

    return [
      {
        ...SAPA_KEJI_DEFAULT,
      },
    ];
  }

  const daftarDatabase =
    (
      data ?? []
    )
      .map(
        normalizePanduan
      )
      .filter(
        (
          item
        ): item is PanduanPelayananPublik =>
          item !== null
      );

  return mergePanduan(
    daftarDatabase
  );
}

function formatAngka(
  value: number
): string {
  return new Intl.NumberFormat(
    'id-ID'
  ).format(
    Number.isFinite(value)
      ? value
      : 0
  );
}

export default async function PanduanPelayananPage() {
  const daftarPanduan =
    await getPanduanPelayanan();

  const panduanUtama =
    daftarPanduan[0] ??
    SAPA_KEJI_DEFAULT;

  const panduanTambahan =
    daftarPanduan.slice(1);

  const coverUtama =
    panduanUtama.cover_url ??
    SAPA_KEJI_COVER_URL;

  const fileUtama =
    panduanUtama.file_url;

  const pdfPreviewUrl =
    `${fileUtama}#toolbar=1&navpanes=0&view=FitH`;

  return (
    <div className="min-h-screen overflow-x-clip bg-slate-50">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-emerald-950 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/background.png')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#021b16] via-emerald-950/95 to-emerald-900/70" />

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

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-36 -top-36 h-[440px] w-[440px] rounded-full bg-emerald-300/10 blur-[120px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-44 right-0 h-[520px] w-[520px] rounded-full bg-emerald-400/[0.08] blur-[130px]"
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 sm:pb-28 sm:pt-14 lg:px-8 lg:pb-32 lg:pt-16">
          <Link
            href="/desa-wisata"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-100/80 transition hover:text-white"
          >
            <ArrowLeft
              size={15}
            />

            Kembali ke Desa Wisata
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.17em] text-emerald-100 backdrop-blur sm:text-xs">
                <Leaf
                  size={15}
                />

                Desa Wisata Keji
              </div>

              <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-300">
                Hospitality Pocket Book
              </p>

              <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                SAPA KEJI
              </h1>

              <p className="mt-3 text-xl font-extrabold leading-snug text-emerald-100 sm:text-2xl">
                Panduan Pelayanan
                Wisatawan Desa Keji
              </p>

              <p className="mt-6 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80 sm:text-base sm:leading-8">
                Panduan praktis untuk
                membantu pengelola,
                pemandu, pelaku UMKM,
                dan masyarakat
                memberikan pelayanan
                wisata yang ramah,
                tertib, informatif,
                dan berkesan.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#dokumen-panduan"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-extrabold text-emerald-800 transition hover:bg-emerald-50"
                >
                  <BookOpen
                    size={18}
                  />

                  Lihat Buku
                </a>

                <a
                  href={fileUtama}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/15"
                >
                  <Eye
                    size={18}
                  />

                  Baca PDF

                  <ExternalLink
                    size={14}
                  />
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[460px]">
  <div
    aria-hidden="true"
    className="absolute -inset-8 rounded-[2.75rem] bg-emerald-300/15 blur-3xl"
  />

  <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-3 shadow-2xl shadow-black/40 backdrop-blur">
    <div className="overflow-hidden rounded-[1.45rem] bg-white">
      <img
        src={coverUtama}
        alt={`Sampul ${panduanUtama.judul}`}
        className="h-auto w-full object-contain"
      />
    </div>
  </div>
</div>
          </div>
        </div>
      </section>

      {/* Ringkasan */}
      <section className="relative z-20 -mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-2xl shadow-slate-900/10 sm:grid-cols-2 lg:grid-cols-4">
            <RingkasanItem
              icon={BookMarked}
              label="Buku Utama"
              value="SAPA KEJI"
              description="Panduan pelayanan wisatawan"
              primary
            />

            <RingkasanItem
              icon={FileText}
              label="Format Dokumen"
              value="PDF"
              description="Dapat dibaca dan diunduh"
            />

            <RingkasanItem
              icon={LibraryBig}
              label="Dokumen Aktif"
              value={formatAngka(
                daftarPanduan.length
              )}
              description="Panduan wisata dipublikasikan"
            />

            <RingkasanItem
              icon={BadgeCheck}
              label="Akses"
              value="Gratis"
              description="Terbuka bagi masyarakat"
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8">
        {/* Pengantar */}
        <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 p-7 text-white shadow-xl sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(255,255,255,0.24) 1px, transparent 1px)',

                backgroundSize:
                  '24px 24px',
              }}
            />

            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                <BookOpen
                  size={27}
                />
              </div>

              <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
                Tentang Panduan
              </p>

              <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
                Standar pelayanan untuk
                mendukung Desa Wisata
                Keji
              </h2>

              <p className="mt-4 text-sm font-medium leading-7 text-emerald-50/80">
                SAPA KEJI menjadi media
                pendukung bagi pihak yang
                terlibat dalam
                penyambutan dan pelayanan
                wisatawan di Desa Keji.
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-700">
              Pelayanan Wisata
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Pelayanan yang ramah,
              informatif, dan konsisten
            </h2>

            <p className="mt-5 max-w-3xl text-sm font-medium leading-8 text-slate-600 sm:text-base">
              Pelayanan merupakan bagian
              penting dari pengalaman
              wisatawan. Panduan ini
              dapat digunakan sebagai
              referensi bersama oleh
              pengelola destinasi,
              pemandu, pelaku UMKM,
              kelompok sadar wisata,
              serta masyarakat Desa
              Keji.
            </p>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-emerald-700"
              />

              <p className="text-sm font-semibold leading-7 text-emerald-900">
                Klik gambar sampul untuk
                melihat informasi lengkap
                buku dan mengakses file
                PDF.
              </p>
            </div>
          </div>
        </section>

        {/* Nilai Panduan */}
        <section className="mt-14">
          <SectionHeading
            eyebrow="Arah Pelayanan"
            title="Pelayanan wisata yang berorientasi pada pengunjung"
            description="Prinsip dasar yang dapat diterapkan dalam interaksi dengan wisatawan dan pelayanan destinasi."
          />

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {nilaiPanduan.map(
              (item) => (
                <NilaiCard
                  key={
                    item.title
                  }
                  item={item}
                />
              )
            )}
          </div>
        </section>

        {/* Dokumen Utama */}
        <section
          id="dokumen-panduan"
          className="scroll-mt-28 pt-14"
        >
          <SectionHeading
            eyebrow="Dokumen Utama"
            title="SAPA KEJI"
            description="Baca panduan melalui browser atau unduh PDF untuk digunakan sebagai referensi pelayanan wisata."
          />

          <article className="mt-8 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-xl shadow-slate-900/[0.06]">
            <div className="grid lg:grid-cols-[360px_minmax(0,1fr)]">
              <div className="relative bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 p-6 sm:p-8">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-15"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, rgba(255,255,255,0.45) 1px, transparent 1px)',

                    backgroundSize:
                      '24px 24px',
                  }}
                />

                <div className="relative mx-auto max-w-[300px] overflow-hidden rounded-2xl bg-white shadow-2xl">
                  <SapaKejiCoverDialog
                    title={
                      panduanUtama.judul
                    }
                    description={
                      panduanUtama.deskripsi
                    }
                    author={
                      panduanUtama.penyusun
                    }
                    year={
                      panduanUtama.tahun
                    }
                    pageCount={
                      panduanUtama.jumlah_halaman
                    }
                    coverUrl={
                      coverUtama
                    }
                    fileUrl={
                      fileUtama
                    }
                    className="w-full"
                    imageClassName="h-auto w-full object-contain"
                  />
                </div>
              </div>

              <div className="flex flex-col p-6 sm:p-8 lg:p-10">
                <div className="flex flex-wrap gap-2">
                  {panduanUtama.tahun && (
                    <MetadataBadge
                      label={`Tahun ${panduanUtama.tahun}`}
                    />
                  )}

                  {panduanUtama.jumlah_halaman && (
                    <MetadataBadge
                      label={`${formatAngka(
                        panduanUtama.jumlah_halaman
                      )} halaman`}
                    />
                  )}

                  <MetadataBadge
                    label="Format PDF"
                  />

                  <MetadataBadge
                    label="Akses Gratis"
                  />
                </div>

                <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-700">
                  Panduan Pelayanan
                  Wisatawan
                </p>

                <h2 className="mt-3 text-2xl font-black leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
                  {panduanUtama.judul}
                </h2>

                <p className="mt-4 text-sm font-extrabold text-slate-500">
                  Disusun oleh{' '}
                  <span className="text-emerald-700">
                    {
                      panduanUtama.penyusun
                    }
                  </span>
                </p>

                <p className="mt-6 flex-1 text-sm font-medium leading-8 text-slate-600 sm:text-base">
                  {
                    panduanUtama.deskripsi
                  }
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <a
                    href={fileUtama}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800"
                  >
                    <Eye
                      size={18}
                    />

                    Baca Buku

                    <ExternalLink
                      size={14}
                    />
                  </a>

                  <a
                    href={fileUtama}
                    download
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-6 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <Download
                      size={18}
                    />

                    Unduh PDF
                  </a>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* Pratinjau PDF */}
        <section className="mt-14 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-sm">
          <div className="flex flex-col gap-5 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                <FileText
                  size={23}
                />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                  Pratinjau Dokumen
                </p>

                <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
                  Baca SAPA KEJI
                  langsung di website
                </h2>

                <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                  Gunakan navigasi PDF
                  untuk berpindah halaman,
                  memperbesar tampilan,
                  atau mencetak dokumen.
                </p>
              </div>
            </div>

            <a
              href={fileUtama}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-50"
            >
              Buka Layar Penuh

              <ExternalLink
                size={16}
              />
            </a>
          </div>

          <div className="bg-slate-100 p-3 sm:p-5">
            <object
              data={pdfPreviewUrl}
              type="application/pdf"
              className="h-[620px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white sm:h-[760px] lg:h-[850px]"
            >
              <div className="flex h-full min-h-[500px] flex-col items-center justify-center p-8 text-center">
                <FileText
                  size={48}
                  className="text-emerald-300"
                />

                <h3 className="mt-5 text-lg font-black text-slate-900">
                  Pratinjau PDF tidak
                  tersedia
                </h3>

                <p className="mt-2 max-w-md text-sm font-medium leading-7 text-slate-500">
                  Browser ini tidak dapat
                  menampilkan PDF secara
                  langsung. Buka file
                  melalui tombol berikut.
                </p>

                <a
                  href={fileUtama}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white transition hover:bg-emerald-800"
                >
                  Buka PDF

                  <ExternalLink
                    size={16}
                  />
                </a>
              </div>
            </object>
          </div>
        </section>

        {/* Dokumen Tambahan */}
        {panduanTambahan.length >
          0 && (
          <section className="mt-14">
            <SectionHeading
              eyebrow="Dokumen Tambahan"
              title="Panduan Desa Wisata Lainnya"
              description="Dokumen tambahan yang telah diaktifkan melalui halaman administrator Desa Wisata."
            />

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {panduanTambahan.map(
                (
                  panduan,
                  index
                ) => (
                  <PanduanTambahanCard
                    key={
                      panduan.id
                    }
                    panduan={
                      panduan
                    }
                    nomor={
                      index + 2
                    }
                  />
                )
              )}
            </div>
          </section>
        )}

        {/* Penutup */}
        <section className="relative mt-14 overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 p-7 text-white shadow-xl sm:p-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',

              backgroundSize:
                '25px 25px',
            }}
          />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                <UsersRound
                  size={27}
                />
              </div>

              <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
                Desa Wisata Keji
              </p>

              <h2 className="mt-2 max-w-3xl text-2xl font-black sm:text-3xl">
                Wujudkan pelayanan wisata
                yang ramah dan berkesan
              </h2>

              <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                Gunakan SAPA KEJI
                sebagai referensi bersama
                untuk meningkatkan
                kualitas penyambutan,
                komunikasi, dan pelayanan
                kepada wisatawan.
              </p>
            </div>

            <Link
              href="/desa-wisata"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-extrabold text-emerald-800 transition hover:bg-emerald-50"
            >
              <ArrowLeft
                size={17}
              />

              Kembali ke Desa Wisata
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function RingkasanItem({
  icon: Icon,
  label,
  value,
  description,
  primary = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
  primary?: boolean;
}) {
  return (
    <article
      className={`min-h-[170px] border-b border-emerald-100 p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 ${
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
        <Icon size={21} />
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

      <p className="mt-2 break-words text-xl font-black">
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

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-700">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
        {title}
      </h2>

      <p className="mt-4 text-sm font-medium leading-7 text-slate-500 sm:text-base">
        {description}
      </p>
    </div>
  );
}

function NilaiCard({
  item,
}: {
  item: NilaiPanduan;
}) {
  const Icon =
    item.icon;

  return (
    <article className="group rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
        <Icon size={23} />
      </div>

      <h3 className="mt-5 font-black leading-7 text-slate-900">
        {item.title}
      </h3>

      <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
        {item.description}
      </p>
    </article>
  );
}

function MetadataBadge({
  label,
}: {
  label: string;
}) {
  return (
    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
      {label}
    </span>
  );
}

function PanduanTambahanCard({
  panduan,
  nomor,
}: {
  panduan:
    PanduanPelayananPublik;

  nomor: number;
}) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition hover:border-emerald-300 hover:shadow-lg">
      <div className="grid sm:grid-cols-[170px_minmax(0,1fr)]">
        <div className="relative min-h-[230px] bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700">
          {panduan.cover_url ? (
            <img
              src={
                panduan.cover_url
              }
              alt={`Sampul ${panduan.judul}`}
              loading="lazy"
              className="h-full min-h-[230px] w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[230px] items-center justify-center text-white">
              <BookOpen
                size={50}
              />
            </div>
          )}

          <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-black text-white backdrop-blur">
            {String(
              nomor
            ).padStart(
              2,
              '0'
            )}
          </span>
        </div>

        <div className="flex flex-col p-5 sm:p-6">
          <h3 className="text-xl font-black leading-7 text-slate-900">
            {panduan.judul}
          </h3>

          <p className="mt-2 text-xs font-extrabold text-emerald-700">
            {panduan.penyusun}
          </p>

          <p className="mt-4 flex-1 text-sm font-medium leading-7 text-slate-500">
            {panduan.deskripsi}
          </p>

          <a
            href={
              panduan.file_url
            }
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-emerald-700 transition group-hover:text-emerald-900"
          >
            Baca Dokumen

            <ArrowRight
              size={16}
            />
          </a>
        </div>
      </div>
    </article>
  );
}