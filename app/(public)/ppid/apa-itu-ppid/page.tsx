// app/(public)/ppid/apa-itu-ppid/page.tsx

import type {
  Metadata,
} from 'next';

import Link from 'next/link';

import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  Eye,
  FileCheck2,
  FileSearch,
  Info,
  Landmark,
  Network,
  Scale,
  ShieldCheck,
  Users,
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
    'Apa Itu PPID | SIJI Desa Keji',

  description:
    'Informasi mengenai tugas, tujuan, prinsip, dan pelayanan PPID Pemerintah Desa Keji.',
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

interface InformasiCard {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface DasarHukumItem {
  title: string;
  description: string;
  href: string;
}

const tujuanPPID:
  InformasiCard[] = [
  {
    title:
      'Menjamin Hak Informasi',

    description:
      'Memberikan akses kepada masyarakat untuk memperoleh informasi publik yang berada dalam penguasaan Pemerintah Desa.',

    icon: Eye,
  },
  {
    title:
      'Meningkatkan Transparansi',

    description:
      'Mendorong keterbukaan dalam penyelenggaraan pemerintahan, pelayanan publik, dan pembangunan desa.',

    icon: FileSearch,
  },
  {
    title:
      'Meningkatkan Partisipasi',

    description:
      'Membantu masyarakat memahami kebijakan desa sehingga dapat berpartisipasi dalam pembangunan.',

    icon: Users,
  },
  {
    title:
      'Mewujudkan Akuntabilitas',

    description:
      'Mendorong pengelolaan pemerintahan desa yang tertib, dapat dipertanggungjawabkan, dan dipercaya masyarakat.',

    icon: ShieldCheck,
  },
];

const tugasPPID = [
  'Menghimpun dan mengoordinasikan informasi serta dokumentasi dari setiap bagian Pemerintah Desa.',

  'Menyimpan, mendokumentasikan, menyediakan, dan memberikan pelayanan informasi publik.',

  'Melakukan verifikasi terhadap informasi yang akan diberikan atau diumumkan kepada masyarakat.',

  'Memutakhirkan daftar informasi publik secara berkala.',

  'Menentukan informasi yang dapat dibuka dan informasi yang dikecualikan sesuai ketentuan.',

  'Mencatat dan mengelola permohonan informasi publik serta pengajuan keberatan.',

  'Menyusun laporan pelaksanaan pelayanan informasi publik.',
];

const prinsipLayanan:
  InformasiCard[] = [
  {
    title:
      'Mudah dan Sederhana',

    description:
      'Prosedur pelayanan dibuat jelas dan mudah dipahami oleh masyarakat.',

    icon: CheckCircle2,
  },
  {
    title:
      'Cepat dan Tepat Waktu',

    description:
      'Permohonan informasi diproses sesuai jangka waktu yang berlaku.',

    icon: ClipboardCheck,
  },
  {
    title:
      'Biaya Ringan',

    description:
      'Akses informasi tidak dipungut biaya, kecuali biaya penggandaan atau pengiriman dokumen.',

    icon: FileCheck2,
  },
  {
    title:
      'Akurat dan Bertanggung Jawab',

    description:
      'Informasi yang diberikan harus benar, dapat diverifikasi, dan tidak menyesatkan.',

    icon: BookOpenCheck,
  },
];

const dasarHukum:
  DasarHukumItem[] = [
  {
    title:
      'Undang-Undang Nomor 14 Tahun 2008',

    description:
      'Tentang Keterbukaan Informasi Publik.',

    href:
      'https://peraturan.bpk.go.id/Details/39047/uu-no-14-tahun-2008',
  },
  {
    title:
      'Peraturan Pemerintah Nomor 61 Tahun 2010',

    description:
      'Tentang pelaksanaan Undang-Undang Nomor 14 Tahun 2008.',

    href:
      'https://peraturan.bpk.go.id/Details/5084/pp-no-61-tahun-2010',
  },
  {
    title:
      'Peraturan Komisi Informasi Nomor 1 Tahun 2021',

    description:
      'Tentang Standar Layanan Informasi Publik.',

    href:
      'https://komisiinformasi.go.id/pdf/20230306111128-Perki-1-2021.pdf',
  },
  {
    title:
      'Peraturan Menteri Dalam Negeri Nomor 2 Tahun 2026',

    description:
      'Tentang Pengelolaan Layanan Informasi Publik di Kementerian Dalam Negeri, Pemerintah Daerah, dan Pemerintah Desa.',

    href:
      'https://peraturan.bpk.go.id/Details/345979/permendagri-no-2-tahun-2026',
  },
];

function safeString(
  value: unknown
) {
  return String(
    value ?? ''
  ).trim();
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
      'Gagal mengambil daftar layanan pada halaman PPID:',
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

export default async function ApaItuPpidPage() {
  const [
    daftarLayanan,
    ppid,
  ] = await Promise.all([
    getDaftarLayanan(),
    getPpidSettings(),
  ]);

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
              {ppid.apa_title}
            </h1>

            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80 sm:text-base">
              {ppid.apa_description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <HeaderBadge
                label="Pelayanan Informasi Publik"
              />

              <HeaderBadge
                label="Transparansi Pemerintahan"
              />

              <HeaderBadge
                label="Pemerintah Desa Keji"
              />
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Konten Utama */}
          <main className="min-w-0 space-y-8 lg:w-2/3">
            {/* Hero PPID */}
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
                  <Info
                    size={31}
                  />
                </div>

                <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-200">
                  {ppid.apa_hero_label}
                </p>

                <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
                  {ppid.apa_hero_title}
                </h2>

                <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-emerald-50/85 sm:text-base sm:leading-8">
                  {ppid.apa_hero_description}
                </p>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <HeroInfoCard
                    label="Fokus Pelayanan"
                    description="Informasi pemerintahan, pelayanan, pembangunan, dan kebijakan desa."
                  />

                  <HeroInfoCard
                    label="Sasaran Pelayanan"
                    description="Masyarakat, kelompok, organisasi, serta badan hukum pemohon informasi."
                  />
                </div>
              </div>
            </section>

            {/* Penjelasan PPID */}
            <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Network
                    size={23}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                    {ppid.office_name}
                  </p>

                  <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
                    Pengelolaan Informasi
                    Publik di Tingkat Desa
                  </h2>

                  <div className="mt-4 space-y-4 text-sm font-medium leading-7 text-slate-600">
                    <p>
                      PPID Desa Keji menjadi
                      bagian dari Pemerintah
                      Desa yang bertugas
                      mengelola dan memberikan
                      pelayanan informasi
                      kepada masyarakat.
                    </p>

                    <p>
                      Melalui PPID, masyarakat
                      dapat memperoleh
                      informasi mengenai profil
                      desa, program
                      pembangunan, pelayanan
                      administrasi, penggunaan
                      anggaran, produk hukum,
                      dan informasi publik
                      lainnya.
                    </p>

                    <p>
                      Tidak seluruh informasi
                      dapat diberikan secara
                      terbuka. Informasi yang
                      berkaitan dengan data
                      pribadi, keamanan, atau
                      informasi lain yang
                      dikecualikan tetap
                      dilindungi berdasarkan
                      ketentuan yang berlaku.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Tujuan PPID */}
            <section>
              <SectionHeading
                eyebrow="Tujuan"
                title="Tujuan Pembentukan PPID"
                description="PPID dibentuk untuk mendukung keterbukaan informasi dan tata kelola pemerintahan desa."
              />

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {tujuanPPID.map(
                  (item) => (
                    <InfoCard
                      key={item.title}
                      item={item}
                    />
                  )
                )}
              </div>
            </section>

            {/* Tugas PPID */}
            <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
              <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-md">
                    <ClipboardCheck
                      size={23}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                      Tugas dan Tanggung
                      Jawab
                    </p>

                    <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
                      Tugas Utama PPID
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <ul className="grid gap-3">
                  {tugasPPID.map(
                    (
                      tugas,
                      index
                    ) => (
                      <li
                        key={tugas}
                        className="flex items-start gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 transition hover:border-emerald-200 hover:bg-emerald-50"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-xs font-black text-white">
                          {index + 1}
                        </span>

                        <p className="pt-1 text-sm font-semibold leading-6 text-slate-600">
                          {tugas}
                        </p>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </section>

            {/* Prinsip Pelayanan */}
            <section>
              <SectionHeading
                eyebrow="Prinsip Pelayanan"
                title="Standar Pelayanan Informasi"
                description="Pelayanan informasi publik dilaksanakan dengan prosedur yang jelas, mudah, cepat, dan bertanggung jawab."
              />

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {prinsipLayanan.map(
                  (item) => (
                    <InfoCard
                      key={item.title}
                      item={item}
                    />
                  )
                )}
              </div>
            </section>

            {/* Alur Layanan */}
            <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                  <FileSearch
                    size={23}
                  />
                </div>

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                    Alur Pelayanan
                  </p>

                  <h2 className="mt-2 text-xl font-black text-emerald-950 sm:text-2xl">
                    Cara Memperoleh
                    Informasi Publik
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-emerald-800">
                    Permohonan informasi
                    publik dapat dilakukan
                    melalui tahapan berikut.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <AlurCard
                  number="01"
                  title="Cari Informasi"
                  description="Periksa informasi yang telah tersedia pada website Desa Keji."
                />

                <AlurCard
                  number="02"
                  title="Ajukan Permohonan"
                  description="Isi formulir permohonan apabila informasi belum tersedia."
                />

                <AlurCard
                  number="03"
                  title="Verifikasi Permohonan"
                  description="Petugas PPID memeriksa identitas dan informasi yang diminta."
                />

                <AlurCard
                  number="04"
                  title="Terima Tanggapan"
                  description="Pemohon menerima informasi, pemberitahuan, atau alasan penolakan."
                />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/ppid/permohonan-informasi"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white transition hover:bg-emerald-800"
                >
                  Ajukan Permohonan

                  <ArrowRight
                    size={17}
                  />
                </Link>

                <Link
                  href="/ppid/klasifikasi-informasi"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-white px-5 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-100"
                >
                  Lihat Klasifikasi
                  Informasi
                </Link>
              </div>
            </section>

            {/* Informasi Kantor */}
            <section>
              <SectionHeading
                eyebrow="Pelayanan PPID"
                title="Kontak dan Lokasi Pelayanan"
                description="Informasi kantor yang dapat digunakan masyarakat untuk menghubungi PPID Desa Keji."
              />

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <OfficeCard
                  label="Alamat Pelayanan"
                  title={ppid.office_name}
                >
                  <p>
                    {ppid.office_address}
                  </p>
                </OfficeCard>

                <OfficeCard
                  label="Kontak dan Jam Pelayanan"
                  title={ppid.office_email}
                >
                  <p>
                    Telepon:{' '}
                    {ppid.office_phone}
                  </p>

                  <p className="mt-2">
                    {ppid.office_hours}
                  </p>
                </OfficeCard>
              </div>
            </section>

            {/* Dasar Hukum */}
            <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
              <div className="flex items-start gap-4 border-b border-emerald-100 p-6 sm:p-8">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                  <Scale
                    size={23}
                  />
                </div>

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                    Landasan Pelaksanaan
                  </p>

                  <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
                    Dasar Hukum PPID
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                    Ketentuan yang menjadi
                    dasar pelaksanaan
                    keterbukaan informasi
                    publik.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-emerald-100">
                {dasarHukum.map(
                  (
                    item,
                    index
                  ) => (
                    <a
                      key={item.title}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-4 p-5 transition hover:bg-emerald-50 sm:px-8"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xs font-black text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
                        {index + 1}
                      </span>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-extrabold leading-7 text-slate-800 transition group-hover:text-emerald-800">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
                          {item.description}
                        </p>
                      </div>

                      <ExternalLink
                        size={17}
                        className="mt-1 shrink-0 text-slate-300 transition group-hover:text-emerald-600"
                      />
                    </a>
                  )
                )}
              </div>
            </section>

            {/* CTA */}
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
                    Layanan PPID
                  </p>

                  <h2 className="mt-2 text-xl font-black sm:text-2xl">
                    Informasi yang Anda
                    cari belum tersedia?
                  </h2>

                  <p className="mt-2 max-w-xl text-sm font-medium leading-7 text-emerald-50/80">
                    Ajukan permohonan
                    informasi publik melalui
                    layanan PPID Desa Keji.
                  </p>
                </div>

                <Link
                  href="/ppid/permohonan-informasi"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-800 transition hover:bg-emerald-50"
                >
                  Permohonan Informasi

                  <ArrowRight
                    size={17}
                  />
                </Link>
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
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
      <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
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

function InfoCard({
  item,
}: {
  item: InformasiCard;
}) {
  const Icon =
    item.icon;

  return (
    <article className="group rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
        <Icon
          size={23}
        />
      </div>

      <h3 className="mt-4 text-base font-black text-slate-900">
        {item.title}
      </h3>

      <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
        {item.description}
      </p>
    </article>
  );
}

function AlurCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
      <span
        aria-hidden="true"
        className="absolute -right-2 -top-4 text-6xl font-black text-emerald-50"
      >
        {number}
      </span>

      <div className="relative">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-xs font-black text-white">
          {number}
        </span>

        <h3 className="mt-4 font-black text-slate-900">
          {title}
        </h3>

        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </article>
  );
}

function OfficeCard({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
        {label}
      </p>

      <h3 className="mt-3 break-words font-black text-slate-900">
        {title}
      </h3>

      <div className="mt-2 text-sm font-medium leading-6 text-slate-500">
        {children}
      </div>
    </article>
  );
}