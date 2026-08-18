// app/(public)/data-desa/page.tsx

import type {
  Metadata,
} from 'next';

import Link from 'next/link';

import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Database,
  FileText,
  Images,
  Map as MapIcon,
  ShieldCheck,
  Target,
  UserCheck,
  UserRound,
  Users,
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

export const metadata: Metadata = {
  title:
    'Data Desa Keji | SIJI',

  description:
    'Pusat informasi data kependudukan, demografi, wilayah, galeri, dan pembangunan berkelanjutan Desa Keji.',
};

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

interface ProfilDesaRow {
  jumlah_laki_laki:
    | number
    | string
    | null;

  jumlah_perempuan:
    | number
    | string
    | null;

  jumlah_dusun:
    | number
    | string
    | null;

  jumlah_rw:
    | number
    | string
    | null;

  jumlah_rt:
    | number
    | string
    | null;

  tahun_data:
    | number
    | string
    | null;

  updated_at:
    | string
    | null;
}

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

interface MenuDataDesa {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

const PROFIL_KEY =
  'utama';

const menuDataDesa:
  MenuDataDesa[] = [
  {
    title:
      'Populasi per Wilayah',

    description:
      'Persebaran jumlah penduduk berdasarkan dusun, RW, RT, dan wilayah administrasi Desa Keji.',

    href:
      '/data-desa/populasi-wilayah',

    icon: MapIcon,
  },

  {
    title:
      'Data Penduduk Desa',

    description:
      'Ringkasan jumlah penduduk, keluarga, jenis kelamin, dan kondisi kependudukan Desa Keji.',

    href:
      '/data-desa/penduduk',

    icon: Users,
  },

  {
    title:
      'Data Rentang Umur',

    description:
      'Persebaran penduduk berdasarkan rentang usia yang dihitung dari tanggal lahir warga.',

    href:
      '/data-desa/rentang-umur',

    icon: CalendarDays,
  },

  {
    title:
      'Kategori Umur',

    description:
      'Informasi penduduk berdasarkan kelompok anak-anak, remaja, dewasa, dan lanjut usia.',

    href:
      '/data-desa/kategori-umur',

    icon: BarChart3,
  },

  {
    title:
      'Status Penduduk',

    description:
      'Informasi penduduk tetap, penduduk tidak tetap, dan data status yang belum dilengkapi.',

    href:
      '/data-desa/status-penduduk',

    icon: UserCheck,
  },

  {
    title:
      'Jenis Kelamin',

    description:
      'Perbandingan jumlah penduduk laki-laki dan perempuan berdasarkan data warga aktif.',

    href:
      '/data-desa/jenis-kelamin',

    icon: UserRound,
  },

  {
    title:
      'Galeri Desa',

    description:
      'Dokumentasi kegiatan, budaya, potensi wilayah, pembangunan, dan kehidupan masyarakat Desa Keji.',

    href:
      '/data-desa/galeri',

    icon: Images,
  },

  {
  title: 'SDGs Desa',
  description:
    'Informasi capaian dan arah pembangunan berkelanjutan atau Sustainable Development Goals Desa.',
  href: '/data-desa/sdgs',
  icon: Target,
},
];

function safeString(
  value: unknown
) {
  return String(
    value ?? ''
  ).trim();
}

function safeInteger(
  value: unknown,
  fallback = 0
) {
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

function formatAngka(
  value: number
) {
  return new Intl.NumberFormat(
    'id-ID'
  ).format(
    Number.isFinite(value)
      ? value
      : 0
  );
}

function formatTanggal(
  value: string
) {
  if (!value) {
    return 'Belum diperbarui';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return 'Belum diperbarui';
  }

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: '2-digit',

      month: 'long',

      year: 'numeric',

      timeZone:
        'Asia/Jakarta',
    }
  ).format(date);
}

export default async function DataDesaPage() {
  const [
    profilResult,
    layananResult,
  ] = await Promise.all([
    supabaseAdmin
      .from('profil_desa')
      .select(`
        jumlah_laki_laki,
        jumlah_perempuan,
        jumlah_dusun,
        jumlah_rw,
        jumlah_rt,
        tahun_data,
        updated_at
      `)
      .eq(
        'profil_key',
        PROFIL_KEY
      )
      .maybeSingle(),

    supabaseAdmin
      .from('layanan')
      .select(`
        id,
        nama,
        slug
      `)
      .eq('aktif', true)
      .order('urutan', {
        ascending: true,
        nullsFirst: false,
      })
      .order('nama', {
        ascending: true,
      }),
  ]);

  if (
    profilResult.error
  ) {
    console.error(
      'Gagal mengambil data profil desa:',
      {
        message:
          profilResult.error
            .message,

        code:
          profilResult.error
            .code,

        details:
          profilResult.error
            .details,

        hint:
          profilResult.error
            .hint,
      }
    );
  }

  if (
    layananResult.error
  ) {
    console.error(
      'Gagal mengambil daftar layanan:',
      {
        message:
          layananResult.error
            .message,

        code:
          layananResult.error
            .code,

        details:
          layananResult.error
            .details,

        hint:
          layananResult.error
            .hint,
      }
    );
  }

  const profil =
    profilResult.data as
      | ProfilDesaRow
      | null;

  const jumlahLakiLaki =
    safeInteger(
      profil?.jumlah_laki_laki
    );

  const jumlahPerempuan =
    safeInteger(
      profil?.jumlah_perempuan
    );

  const totalPenduduk =
    jumlahLakiLaki +
    jumlahPerempuan;

  const jumlahDusun =
    safeInteger(
      profil?.jumlah_dusun,
      3
    );

  const jumlahRw =
    safeInteger(
      profil?.jumlah_rw
    );

  const jumlahRt =
    safeInteger(
      profil?.jumlah_rt
    );

  const tahunDataRaw =
    Number(
      profil?.tahun_data
    );

  const tahunData =
    Number.isInteger(
      tahunDataRaw
    ) &&
    tahunDataRaw >= 1900 &&
    tahunDataRaw <= 2200
      ? tahunDataRaw
      : new Date()
          .getFullYear();

  const updatedAt =
    safeString(
      profil?.updated_at
    );

  const daftarLayanan:
    PilihanLayanan[] = (
      (
        layananResult.data ??
        []
      ) as LayananRow[]
    )
      .map((layanan) => {
        const id =
          Number(layanan.id);

        const nama =
          safeString(
            layanan.nama
          );

        const slug =
          safeString(
            layanan.slug
          );

        return {
          id,
          nama,
          slug,
        };
      })
      .filter(
        (layanan) =>
          Number.isInteger(
            layanan.id
          ) &&
          layanan.id > 0 &&
          layanan.nama.length >
            0 &&
          layanan.slug.length >
            0
      );

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
              <Database
                size={24}
              />
            </div>

            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
              Informasi Desa
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Data Desa Keji
            </h1>

            <p className="mt-4 max-w-4xl text-sm font-medium leading-7 text-emerald-50/80 sm:text-base">
              Pusat informasi data
              kependudukan, wilayah,
              demografi, galeri, dan
              pembangunan berkelanjutan
              Desa Keji tahun{' '}
              {tahunData}.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <HeaderBadge
                label={`${formatAngka(
                  totalPenduduk
                )} penduduk`}
              />

              <HeaderBadge
                label={`${formatAngka(
                  jumlahDusun
                )} dusun`}
              />

              <HeaderBadge
                label={`${formatAngka(
                  jumlahRw
                )} RW`}
              />

              <HeaderBadge
                label={`Diperbarui ${formatTanggal(
                  updatedAt
                )}`}
              />
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Konten Utama */}
          <main className="min-w-0 space-y-7 lg:w-2/3">
            {/* Ringkasan Statistik */}
            <section className="grid gap-4 sm:grid-cols-2">
              <StatistikCard
                label="Total Penduduk"
                value={
                  totalPenduduk
                }
                suffix="Jiwa"
                description="Laki-laki dan perempuan"
                icon={Users}
              />

              <StatistikCard
                label="Jumlah Dusun"
                value={
                  jumlahDusun
                }
                suffix="Dusun"
                description="Wilayah administrasi"
                icon={MapIcon}
              />

              <StatistikCard
                label="Jumlah RW"
                value={
                  jumlahRw
                }
                suffix="RW"
                description="Rukun warga"
                icon={Database}
              />

              <StatistikCard
                label="Jumlah RT"
                value={
                  jumlahRt
                }
                suffix="RT"
                description="Rukun tetangga"
                icon={FileText}
              />
            </section>

            {/* Informasi */}
            <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
                  <BarChart3
                    size={21}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Informasi Publik
                  </p>

                  <h2 className="mt-1 font-black text-emerald-950">
                    Penyajian Data Desa
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-emerald-800">
                    Pilih kategori data
                    untuk melihat informasi
                    secara lebih rinci.
                    Seluruh informasi
                    diperbarui oleh
                    Pemerintah Desa Keji
                    berdasarkan data
                    administrasi yang
                    tersedia.
                  </p>
                </div>
              </div>
            </section>

            {/* Daftar Menu */}
            <section>
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
                  <Database
                    size={21}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Kategori Informasi
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-slate-900">
                    Kategori Data Desa
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                    Pilih kategori untuk
                    membuka informasi,
                    statistik, grafik, dan
                    dokumentasi Desa Keji.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {menuDataDesa.map(
                  (item) => (
                    <MenuDataCard
                      key={item.href}
                      item={item}
                    />
                  )
                )}
              </div>
            </section>

            {/* Sumber Data */}
            <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <ShieldCheck
                    size={21}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Sumber dan Keamanan
                  </p>

                  <h2 className="mt-1 font-black text-slate-900">
                    Data Resmi Pemerintah
                    Desa Keji
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                    Data publik pada halaman
                    ini berasal dari informasi
                    yang dikelola melalui
                    halaman administrator.
                    Data pribadi warga seperti
                    NIK, nomor KK, alamat,
                    nomor WhatsApp, dan
                    identitas lengkap tidak
                    ditampilkan kepada publik.
                  </p>
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

function MenuDataCard({
  item,
}: {
  item: MenuDataDesa;
}) {
  const Icon =
    item.icon;

  return (
    <Link
      href={item.href}
      className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg sm:p-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-emerald-50 transition duration-500 group-hover:scale-125"
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
            <Icon
              size={23}
              strokeWidth={2}
            />
          </div>

          <div className="flex h-9 w-9 -translate-x-1 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
            <ArrowRight
              size={17}
            />
          </div>
        </div>

        <h3 className="mt-5 text-base font-black text-slate-900 transition group-hover:text-emerald-800">
          {item.title}
        </h3>

        <p className="mt-2 flex-1 text-sm font-medium leading-7 text-slate-500">
          {item.description}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold text-emerald-700">
          Lihat Data

          <ArrowRight
            size={14}
            className="transition group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}

function StatistikCard({
  label,
  value,
  suffix,
  description,
  icon: Icon,
}: {
  label: string;
  value: number;
  suffix: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-emerald-50"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">
            {formatAngka(
              value
            )}
          </p>

          <p className="mt-1 text-xs font-extrabold text-emerald-700">
            {suffix}
          </p>

          <p className="mt-2 text-xs font-semibold text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
          <Icon
            size={21}
            strokeWidth={2}
          />
        </div>
      </div>
    </article>
  );
}