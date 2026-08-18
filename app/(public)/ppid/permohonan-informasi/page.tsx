// app/(public)/ppid/permohonan-informasi/page.tsx

import type {
  Metadata,
} from 'next';

import Link from 'next/link';

import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileCheck2,
  FileDown,
  FileText,
  Info,
  Landmark,
  Mail,
  MapPin,
  SearchCheck,
  Send,
  ShieldCheck,
  UserCheck,
  type LucideIcon,
} from 'lucide-react';

import SidebarLayanan from '@/components/SidebarLayanan';
import SidebarTilikArkeji from '@/components/SidebarTilikArkeji';

import {
  getPpidSettings,
} from '@/lib/ppid-settings';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  PilihanLayanan,
} from '@/types/layanan';

export const metadata: Metadata = {
  title:
    'Permohonan Informasi PPID | SIJI Desa Keji',

  description:
    'Prosedur, persyaratan, poster, dan formulir permohonan informasi publik PPID Desa Keji.',
};

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

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

interface LangkahPermohonanItem {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const langkahPermohonan:
  LangkahPermohonanItem[] = [
  {
    number: '01',

    title:
      'Mengajukan Permohonan',

    description:
      'Pemohon informasi publik mengajukan permohonan kepada PPID Desa Keji secara langsung, melalui surat, atau surat elektronik.',

    icon: Send,
  },
  {
    number: '02',

    title:
      'Mengisi Formulir',

    description:
      'Pemohon mengisi formulir dengan mencantumkan identitas, alamat, nomor telepon, informasi yang diminta, bentuk informasi, dan cara penyampaiannya.',

    icon: FileText,
  },
  {
    number: '03',

    title:
      'Pemeriksaan Permohonan',

    description:
      'Petugas PPID menerima dan memeriksa kelengkapan permohonan serta memastikan informasi yang diminta bukan termasuk informasi yang dikecualikan.',

    icon: SearchCheck,
  },
  {
    number: '04',

    title:
      'Penyampaian Informasi',

    description:
      'Petugas PPID menyampaikan informasi kepada pemohon sesuai dengan permohonan dan ketentuan pelayanan informasi publik.',

    icon: UserCheck,
  },
];

const persyaratan = [
  'Formulir permohonan informasi publik yang telah diisi.',

  'Salinan kartu identitas pemohon yang masih berlaku.',

  'Informasi yang diminta dituliskan secara jelas dan spesifik.',

  'Mencantumkan bentuk informasi yang diinginkan.',

  'Mencantumkan cara penerimaan informasi.',

  'Nomor telepon atau alamat kontak yang dapat dihubungi.',
];

const catatanPelayanan = [
  'Formulir harus diisi secara lengkap, benar, dan dapat dipertanggungjawabkan.',

  'Petugas PPID dapat menghubungi pemohon apabila terdapat data atau persyaratan yang belum lengkap.',

  'Informasi yang termasuk dalam kategori informasi dikecualikan tidak dapat diberikan kepada pemohon.',

  'Data identitas pemohon hanya digunakan untuk proses pelayanan informasi publik.',
];

function safeString(
  value: unknown
) {
  return String(
    value ?? ''
  ).trim();
}

function getSafePublicUrl(
  value: unknown
) {
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

async function getDaftarLayanan():
  Promise<PilihanLayanan[]> {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from('layanan')
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
        ascending: true,
        nullsFirst: false,
      }
    )
    .order(
      'nama',
      {
        ascending: true,
      }
    );

  if (error) {
    console.error(
      'Gagal mengambil daftar layanan pada halaman permohonan informasi:',
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
    (
      data ?? []
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
}

export default async function PermohonanInformasiPage() {
  const [
    daftarLayanan,
    ppid,
  ] = await Promise.all([
    getDaftarLayanan(),
    getPpidSettings(),
  ]);

  const posterUrl =
    getSafePublicUrl(
      ppid.permohonan_poster_url
    );

  const formulirUrl =
    getSafePublicUrl(
      ppid.permohonan_form_url
    );

  const posterAlt =
    safeString(
      ppid.permohonan_poster_alt
    ) ||
    'Infografis alur permohonan informasi publik PPID Desa Keji';

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Halaman */}
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
              <Landmark
                size={24}
              />
            </div>

            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
              {ppid.header_label}
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              {ppid.permohonan_title}
            </h1>

            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80 sm:text-base">
              {ppid.permohonan_description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <HeaderBadge
                label="Pengajuan Langsung"
              />

              <HeaderBadge
                label="Surat dan Surat Elektronik"
              />

              <HeaderBadge
                label="Pelayanan PPID Desa Keji"
              />
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Konten Utama */}
          <main className="min-w-0 space-y-8 lg:w-2/3">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 p-6 text-white shadow-xl sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,0.24) 1px, transparent 1px)',

                  backgroundSize:
                    '25px 25px',
                }}
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[52px] border-white/[0.05]"
              />

              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur">
                  <FileCheck2
                    size={31}
                  />
                </div>

                <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-200">
                  {ppid.permohonan_hero_label}
                </p>

                <h2 className="mt-3 max-w-2xl text-2xl font-black leading-tight sm:text-3xl">
                  {ppid.permohonan_hero_title}
                </h2>

                <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/85 sm:text-base sm:leading-8">
                  {ppid.permohonan_hero_description}
                </p>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <HeroInfoCard
                    icon={Mail}
                    label="Pengajuan Tidak Langsung"
                    description="Melalui surat, surat elektronik, atau saluran resmi Pemerintah Desa."
                  />

                  <HeroInfoCard
                    icon={MapPin}
                    label="Pengajuan Langsung"
                    description="Datang ke Kantor Pemerintah Desa Keji dengan membawa persyaratan."
                  />
                </div>
              </div>
            </section>

            {/* Poster */}
            <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
              <div className="flex items-start gap-4 border-b border-emerald-100 p-6 sm:p-8">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <ClipboardCheck
                    size={23}
                  />
                </div>

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                    Infografis
                  </p>

                  <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
                    Alur Permohonan
                    Informasi
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                    Perhatikan tahapan dan
                    persyaratan sebelum
                    mengajukan permohonan
                    informasi publik.
                  </p>
                </div>
              </div>

              {posterUrl ? (
                <>
                  <div className="bg-emerald-50 p-3 sm:p-5">
                    <a
                      href={posterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-2xl bg-white shadow-sm"
                    >
                      <img
                        src={posterUrl}
                        alt={posterAlt}
                        loading="lazy"
                        className="h-auto w-full object-contain"
                      />
                    </a>
                  </div>

                  <div className="border-t border-emerald-100 p-5">
                    <a
                      href={posterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-extrabold text-emerald-700 transition hover:text-emerald-900"
                    >
                      Lihat poster ukuran
                      penuh

                      <ArrowRight
                        size={16}
                      />
                    </a>
                  </div>
                </>
              ) : (
                <PosterEmptyState />
              )}
            </section>

            {/* Tahapan */}
            <section>
              <SectionHeading
                eyebrow="Prosedur Pelayanan"
                title="Langkah Permohonan Informasi Publik"
                description="Permohonan informasi diproses melalui empat tahapan utama."
              />

              <div className="mt-6 space-y-4">
                {langkahPermohonan.map(
                  (item) => (
                    <LangkahCard
                      key={
                        item.number
                      }
                      item={item}
                    />
                  )
                )}
              </div>
            </section>

            {/* Persyaratan */}
            <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
              <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-md">
                    <ShieldCheck
                      size={23}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                      Kelengkapan
                      Permohonan
                    </p>

                    <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
                      Persyaratan yang
                      Perlu Disiapkan
                    </h2>

                    <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                      Lengkapi identitas,
                      rincian informasi,
                      dan cara penerimaan
                      informasi.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-8">
                {persyaratan.map(
                  (
                    item,
                    index
                  ) => (
                    <NumberedItem
                      key={item}
                      number={
                        index + 1
                      }
                      text={item}
                    />
                  )
                )}
              </div>
            </section>

            {/* Catatan */}
            <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                  <Info
                    size={23}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                    Perhatian
                  </p>

                  <h2 className="mt-2 text-xl font-black text-emerald-950">
                    Ketentuan Permohonan
                    Informasi
                  </h2>

                  <div className="mt-5 space-y-3">
                    {catatanPelayanan.map(
                      (item) => (
                        <CatatanItem
                          key={item}
                          text={item}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Formulir */}
            <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm">
              <div className="border-l-4 border-emerald-700 bg-emerald-50/50 p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <FileDown
                        size={24}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                        Dokumen Lampiran
                      </p>

                      <h2 className="mt-2 text-xl font-black text-slate-900">
                        Formulir Permohonan
                        Informasi Publik
                      </h2>

                      <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                        Unduh formulir,
                        lengkapi data
                        pemohon, kemudian
                        serahkan kepada
                        petugas PPID Desa
                        Keji.
                      </p>
                    </div>
                  </div>

                  {formulirUrl ? (
                    <a
                      href={formulirUrl}
                      download
                      className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white shadow-md transition hover:bg-emerald-800"
                    >
                      <Download
                        size={18}
                      />

                      Unduh Formulir
                    </a>
                  ) : (
                    <span className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 px-5 text-sm font-bold text-slate-400">
                      Formulir belum tersedia
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Akses Informasi */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 p-6 text-white shadow-xl sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,0.24) 1px, transparent 1px)',

                  backgroundSize:
                    '25px 25px',
                }}
              />

              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                    Sebelum Mengajukan
                  </p>

                  <h2 className="mt-2 text-xl font-black sm:text-2xl">
                    Periksa informasi yang
                    telah tersedia
                  </h2>

                  <p className="mt-2 max-w-xl text-sm font-medium leading-7 text-emerald-50/80">
                    Informasi yang Anda
                    butuhkan mungkin sudah
                    tersedia pada halaman
                    Informasi Umum, Produk
                    Hukum, atau APBDes.
                  </p>
                </div>

                <div className="flex shrink-0 flex-col gap-2">
                  <Link
                    href="/informasi-publik/informasi-umum"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-800 transition hover:bg-emerald-50"
                  >
                    Informasi Umum

                    <ArrowRight
                      size={17}
                    />
                  </Link>

                  <Link
                    href="/ppid/pengajuan-keberatan"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white transition hover:bg-white/15"
                  >
                    Pengajuan Keberatan
                  </Link>
                </div>
              </div>
            </section>
          </main>

          {/* Sidebar Kanan */}
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

function HeroInfoCard({
  icon: Icon,
  label,
  description,
}: {
  icon: LucideIcon;
  label: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
      <Icon
        size={20}
        className="text-emerald-200"
      />

      <p className="mt-3 text-xs font-extrabold uppercase tracking-wider text-emerald-200">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold leading-7 text-white">
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
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-black text-slate-900">
        {title}
      </h2>

      <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function LangkahCard({
  item,
}: {
  item: LangkahPermohonanItem;
}) {
  const Icon =
    item.icon;

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md sm:p-6">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-6 text-8xl font-black text-emerald-50"
      >
        {item.number}
      </span>

      <div className="relative flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
          <Icon
            size={23}
          />
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
            Langkah{' '}
            {Number(
              item.number
            )}
          </p>

          <h3 className="mt-2 text-lg font-black text-slate-900">
            {item.title}
          </h3>

          <p className="mt-2 text-sm font-medium leading-7 text-slate-600">
            {item.description}
          </p>
        </div>
      </div>
    </article>
  );
}

function NumberedItem({
  number,
  text,
}: {
  number: number;
  text: string;
}) {
  return (
    <article className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-slate-50 p-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xs font-black text-emerald-700">
        {number}
      </span>

      <p className="pt-1 text-sm font-semibold leading-6 text-slate-600">
        {text}
      </p>
    </article>
  );
}

function CatatanItem({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2
        size={18}
        className="mt-0.5 shrink-0 text-emerald-700"
      />

      <p className="text-sm font-semibold leading-6 text-emerald-900">
        {text}
      </p>
    </div>
  );
}

function PosterEmptyState() {
  return (
    <div className="px-6 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-300">
        <ClipboardCheck
          size={34}
        />
      </div>

      <h3 className="mt-5 font-black text-slate-800">
        Poster belum tersedia
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
        Poster alur permohonan informasi
        belum ditambahkan melalui halaman
        administrator.
      </p>
    </div>
  );
}