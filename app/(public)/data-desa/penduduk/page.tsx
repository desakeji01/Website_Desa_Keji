// app/(public)/data-desa/penduduk/page.tsx

import {
  Database,
  Info,
  MapPinned,
  Mars,
  ShieldCheck,
  Users,
  Venus,
  type LucideIcon,
} from 'lucide-react';

import SidebarLayanan from '@/components/SidebarLayanan';
import SidebarTilikArkeji from '@/components/SidebarTilikArkeji';

import DataPendudukCharts, {
  type StatistikDusun,
} from '@/components/public/DataPendudukCharts';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  PilihanLayanan,
} from '@/types/layanan';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

interface WargaPendudukRow {
  dusun:
    | string
    | null;

  no_kk_hash:
    | string
    | null;

  jenis_kelamin:
    | 'L'
    | 'P'
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

interface ProfilDesaRow {
  tahun_data:
    | number
    | null;
}

const URUTAN_DUSUN = [
  'Dusun Keji',
  'Dusun Suruhan',
  'Dusun Sitoyo',
];

function safeString(
  value: unknown
) {
  return String(
    value ?? ''
  ).trim();
}

function normalizeNamaDusun(
  value: unknown
) {
  const dusun =
    safeString(value);

  return (
    dusun ||
    'Wilayah Belum Diisi'
  );
}

async function getAllWargaPenduduk():
  Promise<WargaPendudukRow[]> {
  const result:
    WargaPendudukRow[] = [];

  const pageSize = 1000;

  let from = 0;

  while (true) {
    const {
      data,
      error,
    } = await supabaseAdmin
      .from('warga')
      .select(`
        dusun,
        no_kk_hash,
        jenis_kelamin
      `)
      .eq('aktif', true)
      .range(
        from,
        from + pageSize - 1
      );

    if (error) {
      console.error(
        'Gagal mengambil data penduduk:',
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

      return result;
    }

    const rows =
      (
        data ?? []
      ) as WargaPendudukRow[];

    result.push(...rows);

    if (
      rows.length <
      pageSize
    ) {
      break;
    }

    from += pageSize;
  }

  return result;
}

function hitungJumlahKk(
  rows: WargaPendudukRow[]
) {
  const daftarKk =
    new Set<string>();

  rows.forEach((row) => {
    const noKk =
      safeString(
        row.no_kk_hash
      );

    if (noKk) {
      daftarKk.add(noKk);
    }
  });

  return daftarKk.size;
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

function getUrutanDusun(
  wargaRows:
    WargaPendudukRow[]
) {
  const daftarDusun = [
    ...new Set(
      wargaRows.map((row) =>
        normalizeNamaDusun(
          row.dusun
        )
      )
    ),
  ];

  const dusunUtama =
    URUTAN_DUSUN.filter(
      (dusun) =>
        daftarDusun.includes(
          dusun
        )
    );

  const dusunTambahan =
    daftarDusun
      .filter(
        (dusun) =>
          !URUTAN_DUSUN.includes(
            dusun
          )
      )
      .sort((first, second) =>
        first.localeCompare(
          second,
          'id-ID'
        )
      );

  return [
    ...dusunUtama,
    ...dusunTambahan,
  ];
}

export default async function DataPendudukPage() {
  const [
    wargaRows,
    layananResult,
    profilResult,
  ] = await Promise.all([
    getAllWargaPenduduk(),

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

    supabaseAdmin
      .from('profil_desa')
      .select(`
        tahun_data
      `)
      .eq(
        'profil_key',
        'utama'
      )
      .maybeSingle(),
  ]);

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

  if (
    profilResult.error
  ) {
    console.error(
      'Gagal mengambil tahun data:',
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

  const profilData =
    profilResult.data as
      | ProfilDesaRow
      | null;

  const tahunData =
    Number(
      profilData
        ?.tahun_data ??
        new Date().getFullYear()
    );

  const totalPenduduk =
    wargaRows.length;

  const totalKk =
    hitungJumlahKk(
      wargaRows
    );

  const lakiLaki =
    wargaRows.filter(
      (row) =>
        row.jenis_kelamin ===
        'L'
    ).length;

  const perempuan =
    wargaRows.filter(
      (row) =>
        row.jenis_kelamin ===
        'P'
    ).length;

  const belumDiisi =
    wargaRows.filter(
      (row) =>
        row.jenis_kelamin !==
          'L' &&
        row.jenis_kelamin !==
          'P'
    ).length;

  const daftarDusun =
    getUrutanDusun(
      wargaRows
    );

  const statistikDusun:
    StatistikDusun[] =
    daftarDusun.map(
      (dusun) => {
        const wargaDusun =
          wargaRows.filter(
            (row) =>
              normalizeNamaDusun(
                row.dusun
              ) === dusun
          );

        const jumlahLakiLaki =
          wargaDusun.filter(
            (row) =>
              row.jenis_kelamin ===
              'L'
          ).length;

        const jumlahPerempuan =
          wargaDusun.filter(
            (row) =>
              row.jenis_kelamin ===
              'P'
          ).length;

        return {
          dusun,

          jumlahKk:
            hitungJumlahKk(
              wargaDusun
            ),

          jumlahPenduduk:
            wargaDusun.length,

          lakiLaki:
            jumlahLakiLaki,

          perempuan:
            jumlahPerempuan,

          belumDiisi:
            wargaDusun.length -
            jumlahLakiLaki -
            jumlahPerempuan,
        };
      }
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
              Data Desa Keji
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Data Penduduk Desa
            </h1>

            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80 sm:text-base">
              Informasi jumlah penduduk dan
              keluarga Desa Keji berdasarkan
              data warga aktif yang dikelola
              oleh Pemerintah Desa Keji pada
              tahun {tahunData}.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <HeaderBadge
                label={`${formatAngka(
                  totalPenduduk
                )} penduduk`}
              />

              <HeaderBadge
                label={`${formatAngka(
                  totalKk
                )} kartu keluarga`}
              />

              <HeaderBadge
                label={`${statistikDusun.length} wilayah dusun`}
              />
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Konten Utama */}
          <main className="min-w-0 space-y-7 lg:w-2/3">
            {/* Kartu Statistik */}
            <section className="grid gap-4 sm:grid-cols-2">
              <StatistikCard
                label="Total Penduduk"
                value={
                  totalPenduduk
                }
                suffix="Jiwa"
                description="Seluruh warga aktif"
                icon={Users}
              />

              <StatistikCard
                label="Jumlah Keluarga"
                value={totalKk}
                suffix="KK"
                description="Kartu keluarga terdata"
                icon={Database}
              />

              <StatistikCard
                label="Laki-laki"
                value={lakiLaki}
                suffix="Jiwa"
                description="Penduduk laki-laki"
                icon={Mars}
              />

              <StatistikCard
                label="Perempuan"
                value={perempuan}
                suffix="Jiwa"
                description="Penduduk perempuan"
                icon={Venus}
              />
            </section>

            {/* Informasi Integrasi */}
            <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
                  <Info size={21} />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Informasi Sistem
                  </p>

                  <h2 className="mt-1 font-black text-emerald-950">
                    Data Penduduk
                    Terintegrasi
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-emerald-800">
                    Data pada halaman ini
                    dihitung otomatis dari
                    database warga aktif yang
                    dikelola melalui halaman
                    administrator. Perubahan
                    data warga akan langsung
                    memengaruhi ringkasan,
                    grafik, dan tabel penduduk.
                  </p>
                </div>
              </div>
            </section>

            {/* Grafik dan Tabel */}
            <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-6 flex items-start gap-4 border-b border-emerald-100 pb-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
                  <MapPinned
                    size={21}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Visualisasi Data
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-900">
                    Statistik Penduduk
                    Desa Keji
                  </h2>

                  <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                    Perbandingan penduduk
                    berdasarkan jenis kelamin
                    dan wilayah dusun.
                  </p>
                </div>
              </div>

              <DataPendudukCharts
                tahunData={
                  tahunData
                }
                totalPenduduk={
                  totalPenduduk
                }
                lakiLaki={
                  lakiLaki
                }
                perempuan={
                  perempuan
                }
                belumDiisi={
                  belumDiisi
                }
                statistikDusun={
                  statistikDusun
                }
              />
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
                    Privasi dan Sumber Data
                  </p>

                  <h2 className="mt-1 font-black text-slate-900">
                    Data Administrasi
                    Warga Desa Keji
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                    Data bersumber dari
                    database administrasi
                    warga Desa Keji tahun{' '}
                    {tahunData}. Informasi
                    pribadi seperti NIK, nomor
                    KK, nama, alamat, dan nomor
                    WhatsApp tidak ditampilkan
                    pada halaman publik.
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

          <p className="mt-3 text-3xl font-black text-slate-900">
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