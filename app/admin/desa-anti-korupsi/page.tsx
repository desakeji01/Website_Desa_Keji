// app/admin/desa-anti-korupsi/page.tsx

import Link from 'next/link';

import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileText,
  FolderKanban,
  Landmark,
  LayoutDashboard,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ModulSlug =
  | 'tata-laksana'
  | 'pengawasan'
  | 'pelayanan-publik'
  | 'partisipasi-masyarakat'
  | 'kearifan-lokal';

interface IndikatorRow {
  id: string;
  sub_slug: string;
  aktif: boolean;
}

interface DokumenRow {
  id: string;
  indikator_id: string;
  aktif: boolean;
}

interface ModulAntiKorupsi {
  nomor: string;
  slug: ModulSlug;
  judul: string;
  deskripsi: string;
  adminHref: string;
  publicHref: string;
  icon: LucideIcon;
}

interface StatistikModul {
  totalIndikator: number;
  indikatorAktif: number;
  totalDokumen: number;
  dokumenAktif: number;
}

const DAFTAR_MODUL: ModulAntiKorupsi[] = [
  {
    nomor: 'I',
    slug: 'tata-laksana',
    judul: 'Tata Laksana',
    deskripsi:
      'Kelola indikator dan dokumen penguatan sistem, prosedur, regulasi, serta tata kelola Pemerintah Desa Keji.',
    adminHref:
      '/admin/desa-anti-korupsi/tata-laksana',
    publicHref:
      '/desa-anti-korupsi/tata-laksana',
    icon: ClipboardCheck,
  },
  {
    nomor: 'II',
    slug: 'pengawasan',
    judul: 'Pengawasan',
    deskripsi:
      'Kelola bukti pengawasan, evaluasi kinerja, tindak lanjut pemeriksaan, dan pencegahan tindak pidana korupsi.',
    adminHref:
      '/admin/desa-anti-korupsi/pengawasan',
    publicHref:
      '/desa-anti-korupsi/pengawasan',
    icon: ShieldCheck,
  },
  {
    nomor: 'III',
    slug: 'pelayanan-publik',
    judul: 'Kualitas Layanan Publik',
    deskripsi:
      'Kelola indikator pelayanan publik yang terbuka, mudah diakses, sesuai prosedur, dan tanpa pungutan.',
    adminHref:
      '/admin/desa-anti-korupsi/pelayanan-publik',
    publicHref:
      '/desa-anti-korupsi/pelayanan-publik',
    icon: BadgeCheck,
  },
  {
    nomor: 'IV',
    slug: 'partisipasi-masyarakat',
    judul: 'Partisipasi Masyarakat',
    deskripsi:
      'Kelola dokumen keterlibatan masyarakat dalam perencanaan, pengawasan, pengaduan, dan pembangunan desa.',
    adminHref:
      '/admin/desa-anti-korupsi/partisipasi-masyarakat',
    publicHref:
      '/desa-anti-korupsi/partisipasi-masyarakat',
    icon: Users,
  },
  {
    nomor: 'V',
    slug: 'kearifan-lokal',
    judul: 'Kearifan Lokal',
    deskripsi:
      'Kelola bukti penerapan nilai budaya, kebiasaan, dan kearifan lokal sebagai penguatan integritas Desa Keji.',
    adminHref:
      '/admin/desa-anti-korupsi/kearifan-lokal',
    publicHref:
      '/desa-anti-korupsi/kearifan-lokal',
    icon: Landmark,
  },
];

function safeString(value: unknown) {
  return String(value ?? '').trim();
}

function normalizeIndikator(
  value: unknown
): IndikatorRow | null {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return null;
  }

  const row = value as Record<
    string,
    unknown
  >;

  const id = safeString(row.id);

  const subSlug = safeString(
    row.sub_slug
  );

  if (!id || !subSlug) {
    return null;
  }

  return {
    id,
    sub_slug: subSlug,
    aktif: Boolean(row.aktif),
  };
}

function normalizeDokumen(
  value: unknown
): DokumenRow | null {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return null;
  }

  const row = value as Record<
    string,
    unknown
  >;

  const id = safeString(row.id);

  const indikatorId = safeString(
    row.indikator_id
  );

  if (!id || !indikatorId) {
    return null;
  }

  return {
    id,
    indikator_id: indikatorId,
    aktif: Boolean(row.aktif),
  };
}

function buatStatistikKosong(): Record<
  ModulSlug,
  StatistikModul
> {
  return {
    'tata-laksana': {
      totalIndikator: 0,
      indikatorAktif: 0,
      totalDokumen: 0,
      dokumenAktif: 0,
    },

    pengawasan: {
      totalIndikator: 0,
      indikatorAktif: 0,
      totalDokumen: 0,
      dokumenAktif: 0,
    },

    'pelayanan-publik': {
      totalIndikator: 0,
      indikatorAktif: 0,
      totalDokumen: 0,
      dokumenAktif: 0,
    },

    'partisipasi-masyarakat': {
      totalIndikator: 0,
      indikatorAktif: 0,
      totalDokumen: 0,
      dokumenAktif: 0,
    },

    'kearifan-lokal': {
      totalIndikator: 0,
      indikatorAktif: 0,
      totalDokumen: 0,
      dokumenAktif: 0,
    },
  };
}

function isModulSlug(
  value: string
): value is ModulSlug {
  return DAFTAR_MODUL.some(
    (modul) => modul.slug === value
  );
}

export default async function AdminDesaAntiKorupsiPage() {
  const [
    indikatorResult,
    dokumenResult,
  ] = await Promise.all([
    supabaseAdmin
      .from(
        'anti_korupsi_indikator'
      )
      .select(`
        id,
        sub_slug,
        aktif
      `),

    supabaseAdmin
      .from(
        'anti_korupsi_dokumen'
      )
      .select(`
        id,
        indikator_id,
        aktif
      `),
  ]);

  if (indikatorResult.error) {
    console.error(
      'Gagal mengambil indikator Desa Anti Korupsi:',
      {
        message:
          indikatorResult.error
            .message,

        code:
          indikatorResult.error
            .code,

        details:
          indikatorResult.error
            .details,

        hint:
          indikatorResult.error
            .hint,
      }
    );
  }

  if (dokumenResult.error) {
    console.error(
      'Gagal mengambil dokumen Desa Anti Korupsi:',
      {
        message:
          dokumenResult.error
            .message,

        code:
          dokumenResult.error
            .code,

        details:
          dokumenResult.error
            .details,

        hint:
          dokumenResult.error
            .hint,
      }
    );
  }

  const daftarIndikator = (
    indikatorResult.data ?? []
  )
    .map(normalizeIndikator)
    .filter(
      (
        item
      ): item is IndikatorRow =>
        item !== null
    );

  const daftarDokumen = (
    dokumenResult.data ?? []
  )
    .map(normalizeDokumen)
    .filter(
      (
        item
      ): item is DokumenRow =>
        item !== null
    );

  const statistik =
    buatStatistikKosong();

  const indikatorKeSlug =
    new Map<
      string,
      ModulSlug
    >();

  for (
    const indikator of
      daftarIndikator
  ) {
    if (
      !isModulSlug(
        indikator.sub_slug
      )
    ) {
      continue;
    }

    statistik[
      indikator.sub_slug
    ].totalIndikator += 1;

    if (indikator.aktif) {
      statistik[
        indikator.sub_slug
      ].indikatorAktif += 1;
    }

    indikatorKeSlug.set(
      indikator.id,
      indikator.sub_slug
    );
  }

  for (
    const dokumen of
      daftarDokumen
  ) {
    const subSlug =
      indikatorKeSlug.get(
        dokumen.indikator_id
      );

    if (!subSlug) {
      continue;
    }

    statistik[
      subSlug
    ].totalDokumen += 1;

    if (dokumen.aktif) {
      statistik[
        subSlug
      ].dokumenAktif += 1;
    }
  }

  const totalIndikator =
    Object.values(
      statistik
    ).reduce(
      (total, item) =>
        total +
        item.totalIndikator,
      0
    );

  const totalIndikatorAktif =
    Object.values(
      statistik
    ).reduce(
      (total, item) =>
        total +
        item.indikatorAktif,
      0
    );

  const totalDokumen =
    Object.values(
      statistik
    ).reduce(
      (total, item) =>
        total +
        item.totalDokumen,
      0
    );

  const totalDokumenAktif =
    Object.values(
      statistik
    ).reduce(
      (total, item) =>
        total +
        item.dokumenAktif,
      0
    );

  const databaseError =
    indikatorResult.error ||
    dokumenResult.error;

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      {/* Hero admin */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 px-6 py-8 text-white shadow-xl sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.15) 1.5px, transparent 1.5px)',

            backgroundSize:
              '26px 26px',
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[52px] border-white/[0.05]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-36 left-1/3 h-80 w-80 rounded-full bg-emerald-300/10 blur-[100px]"
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur">
              <LayoutDashboard
                size={28}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-200">
                Dashboard Pengelolaan
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                Desa Anti Korupsi
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                Kelola indikator dan
                dokumen bukti dukung
                Desa Anti Korupsi dalam
                lima bidang utama. Semua
                dokumen publik
                menggunakan tautan
                Google Drive.
              </p>
            </div>
          </div>

          <Link
            href="/desa-anti-korupsi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/15"
          >
            Lihat Halaman Publik

            <ExternalLink
              size={16}
            />
          </Link>
        </div>
      </section>

      {/* Peringatan database */}
      {databaseError && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-amber-700"
            />

            <div>
              <p className="text-sm font-extrabold text-amber-900">
                Data belum dapat dimuat
                sepenuhnya
              </p>

              <p className="mt-1 text-xs font-semibold leading-5 text-amber-700">
                Pastikan tabel
                anti_korupsi_indikator
                dan anti_korupsi_dokumen
                sudah tersedia di
                Supabase.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Statistik keseluruhan */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Bidang Utama"
          value={
            DAFTAR_MODUL.length
          }
          description="Modul Desa Anti Korupsi"
          icon={FolderKanban}
        />

        <StatCard
          label="Total Indikator"
          value={totalIndikator}
          description={`${totalIndikatorAktif} indikator aktif`}
          icon={ClipboardCheck}
        />

        <StatCard
          label="Total Dokumen"
          value={totalDokumen}
          description={`${totalDokumenAktif} dokumen aktif`}
          icon={FileText}
        />

        <StatCard
          label="Dokumen Nonaktif"
          value={
            totalDokumen -
            totalDokumenAktif
          }
          description="Tidak tampil di publik"
          icon={CheckCircle2}
        />
      </section>

      {/* Lima modul */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white px-6 py-5 sm:px-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
              <FolderKanban
                size={23}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                Lima Bidang
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                Modul Desa Anti Korupsi
              </h2>

              <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
                Pilih salah satu bidang
                untuk mengelola
                indikator dan dokumen
                Google Drive.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-2 xl:grid-cols-3">
          {DAFTAR_MODUL.map(
            (modul) => (
              <ModulCard
                key={modul.slug}
                modul={modul}
                statistik={
                  statistik[
                    modul.slug
                  ]
                }
              />
            )
          )}
        </div>
      </section>
    </div>
  );
}

function ModulCard({
  modul,
  statistik,
}: {
  modul: ModulAntiKorupsi;
  statistik: StatistikModul;
}) {
  const Icon = modul.icon;

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl">
      <div className="relative flex-1 overflow-hidden p-5 sm:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-100 opacity-60 transition group-hover:scale-110"
        />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-md">
              <Icon size={24} />
            </div>

            <span className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-emerald-700">
              Indikator {modul.nomor}
            </span>
          </div>

          <h3 className="mt-5 text-xl font-black text-slate-900">
            {modul.judul}
          </h3>

          <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
            {modul.deskripsi}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <MiniStat
              label="Indikator"
              value={
                statistik.totalIndikator
              }
              activeValue={
                statistik.indikatorAktif
              }
            />

            <MiniStat
              label="Dokumen"
              value={
                statistik.totalDokumen
              }
              activeValue={
                statistik.dokumenAktif
              }
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-4">
        <Link
          href={modul.adminHref}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-800"
        >
          Kelola Modul

          <ArrowRight
            size={15}
          />
        </Link>

        <Link
          href={modul.publicHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-extrabold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
        >
          Lihat Publik

          <ExternalLink
            size={14}
          />
        </Link>
      </div>
    </article>
  );
}

function MiniStat({
  label,
  value,
  activeValue,
}: {
  label: string;
  value: number;
  activeValue: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-[10px] font-bold text-emerald-700">
        {activeValue} aktif
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: number;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-4xl font-black text-slate-900">
            {value}
          </p>

          <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Icon size={22} />
        </div>
      </div>
    </article>
  );
}