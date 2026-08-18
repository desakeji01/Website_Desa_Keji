// app/(public)/data-desa/jenis-kelamin/page.tsx

import {
  CircleAlert,
  Database,
  Info,
  Mars,
  Scale,
  ShieldCheck,
  Users,
  Venus,
  type LucideIcon,
} from 'lucide-react';

import SidebarLayanan from '@/components/SidebarLayanan';
import SidebarTilikArkeji from '@/components/SidebarTilikArkeji';

import JenisKelaminCharts, {
  type StatistikDusunJenisKelamin,
} from '@/components/public/JenisKelaminCharts';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  PilihanLayanan,
} from '@/types/layanan';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

interface WargaJenisKelaminRow {
  id:
    | string
    | number
    | null;

  dusun:
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
    | string
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

async function getAllWargaJenisKelamin():
  Promise<WargaJenisKelaminRow[]> {
  const result:
    WargaJenisKelaminRow[] = [];

  const pageSize = 1000;

  let from = 0;

  while (true) {
    const {
      data,
      error,
    } = await supabaseAdmin
      .from('warga')
      .select(`
        id,
        dusun,
        jenis_kelamin
      `)
      .eq('aktif', true)
      .order('id', {
        ascending: true,
      })
      .range(
        from,
        from + pageSize - 1
      );

    if (error) {
      console.error(
        'Gagal mengambil data jenis kelamin:',
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
      ) as WargaJenisKelaminRow[];

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

function formatDesimal(
  value: number
) {
  return new Intl.NumberFormat(
    'id-ID',
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  ).format(
    Number.isFinite(value)
      ? value
      : 0
  );
}

function formatPersentase(
  value: number,
  total: number
) {
  if (
    total <= 0 ||
    !Number.isFinite(total)
  ) {
    return '0,00%';
  }

  const persentase =
    (
      value /
      total
    ) * 100;

  return `${new Intl.NumberFormat(
    'id-ID',
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(persentase)}%`;
}

function getUrutanDusun(
  wargaRows:
    WargaJenisKelaminRow[]
) {
  const daftarDusun = [
    ...new Set(
      wargaRows.map((warga) =>
        normalizeNamaDusun(
          warga.dusun
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

export default async function JenisKelaminPage() {
  const [
    wargaRows,
    layananResult,
    profilResult,
  ] = await Promise.all([
    getAllWargaJenisKelamin(),

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

  const tahunDataRaw =
    Number(
      profilData
        ?.tahun_data
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

  const totalPenduduk =
    wargaRows.length;

  const lakiLaki =
    wargaRows.filter(
      (warga) =>
        warga.jenis_kelamin ===
        'L'
    ).length;

  const perempuan =
    wargaRows.filter(
      (warga) =>
        warga.jenis_kelamin ===
        'P'
    ).length;

  const belumMengisi =
    Math.max(
      totalPenduduk -
        lakiLaki -
        perempuan,
      0
    );

  const dataTerisi =
    lakiLaki +
    perempuan;

  const daftarDusun =
    getUrutanDusun(
      wargaRows
    );

  const statistikDusun:
    StatistikDusunJenisKelamin[] =
    daftarDusun.map(
      (dusun) => {
        const wargaDusun =
          wargaRows.filter(
            (warga) =>
              normalizeNamaDusun(
                warga.dusun
              ) === dusun
          );

        const lakiLakiDusun =
          wargaDusun.filter(
            (warga) =>
              warga.jenis_kelamin ===
              'L'
          ).length;

        const perempuanDusun =
          wargaDusun.filter(
            (warga) =>
              warga.jenis_kelamin ===
              'P'
          ).length;

        return {
          dusun,

          total:
            wargaDusun.length,

          lakiLaki:
            lakiLakiDusun,

          perempuan:
            perempuanDusun,

          belumMengisi:
            Math.max(
              wargaDusun.length -
                lakiLakiDusun -
                perempuanDusun,
              0
            ),
        };
      }
    );

  const rasioJenisKelamin =
    perempuan > 0
      ? (
          lakiLaki /
          perempuan
        ) * 100
      : 0;

  const kelengkapanData =
    totalPenduduk > 0
      ? (
          dataTerisi /
          totalPenduduk
        ) * 100
      : 0;

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
              <Scale
                size={24}
              />
            </div>

            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
              Data Desa Keji
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Data Jenis Kelamin
            </h1>

            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80 sm:text-base">
              Informasi komposisi
              penduduk laki-laki dan
              perempuan Desa Keji
              berdasarkan data warga
              aktif tahun {tahunData}.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <HeaderBadge
                label={`${formatAngka(
                  totalPenduduk
                )} penduduk`}
              />

              <HeaderBadge
                label={`${formatAngka(
                  lakiLaki
                )} laki-laki`}
              />

              <HeaderBadge
                label={`${formatAngka(
                  perempuan
                )} perempuan`}
              />

              <HeaderBadge
                label={`${daftarDusun.length} wilayah dusun`}
              />
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Konten Utama */}
          <main className="min-w-0 space-y-7 lg:w-2/3">
            {/* Statistik */}
            <section className="grid gap-4 sm:grid-cols-2">
              <StatistikCard
                label="Total Penduduk"
                value={formatAngka(
                  totalPenduduk
                )}
                description="Seluruh warga aktif"
                icon={Users}
              />

              <StatistikCard
                label="Laki-laki"
                value={formatAngka(
                  lakiLaki
                )}
                description={formatPersentase(
                  lakiLaki,
                  totalPenduduk
                )}
                icon={Mars}
              />

              <StatistikCard
                label="Perempuan"
                value={formatAngka(
                  perempuan
                )}
                description={formatPersentase(
                  perempuan,
                  totalPenduduk
                )}
                icon={Venus}
              />

              <StatistikCard
                label="Belum Mengisi"
                value={formatAngka(
                  belumMengisi
                )}
                description="Data perlu dilengkapi"
                icon={CircleAlert}
              />
            </section>

            {/* Informasi Integrasi */}
            <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
                  <Database
                    size={21}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Informasi Sistem
                  </p>

                  <h2 className="mt-1 font-black text-emerald-950">
                    Data Jenis Kelamin
                    Terintegrasi
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-emerald-800">
                    Statistik dihitung
                    otomatis dari data warga
                    aktif. Penambahan,
                    perubahan, maupun
                    penonaktifan data warga
                    melalui halaman
                    administrator akan
                    langsung memengaruhi
                    ringkasan, grafik, dan
                    tabel pada halaman ini.
                  </p>
                </div>
              </div>
            </section>

            {/* Ringkasan Rasio */}
            <section className="grid gap-4 sm:grid-cols-2">
              <SummaryCard
                icon={Scale}
                label="Rasio Jenis Kelamin"
                value={
                  formatDesimal(
                    rasioJenisKelamin
                  )
                }
                description="Jumlah laki-laki untuk setiap 100 penduduk perempuan."
              />

              <SummaryCard
                icon={Info}
                label="Kelengkapan Data"
                value={`${formatDesimal(
                  kelengkapanData
                )}%`}
                description="Persentase warga dengan data jenis kelamin yang sudah terisi."
              />
            </section>

            {/* Grafik dan Tabel */}
            <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-6 flex items-start gap-4 border-b border-emerald-100 pb-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
                  <Scale
                    size={21}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Visualisasi Data
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-900">
                    Statistik Jenis
                    Kelamin Penduduk
                  </h2>

                  <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                    Perbandingan penduduk
                    laki-laki dan perempuan
                    berdasarkan wilayah
                    dusun.
                  </p>
                </div>
              </div>

              <JenisKelaminCharts
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
                belumMengisi={
                  belumMengisi
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
                    Sumber dan Privasi
                  </p>

                  <h2 className="mt-1 font-black text-slate-900">
                    Data Administrasi
                    Warga Desa Keji
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                    Halaman publik hanya
                    menampilkan jumlah dan
                    persentase penduduk.
                    Identitas pribadi seperti
                    nama, NIK, nomor KK,
                    alamat, tanggal lahir, dan
                    nomor WhatsApp tidak
                    ditampilkan kepada
                    publik.
                  </p>
                </div>
              </div>
            </section>

            {/* Catatan Data */}
            {belumMengisi > 0 && (
              <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                    <CircleAlert
                      size={21}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                      Catatan Data
                    </p>

                    <h2 className="mt-1 font-black text-emerald-950">
                      Data Jenis Kelamin
                      Belum Lengkap
                    </h2>

                    <p className="mt-2 text-sm font-medium leading-7 text-emerald-800">
                      Sebanyak{' '}
                      {formatAngka(
                        belumMengisi
                      )}{' '}
                      warga belum memiliki
                      data jenis kelamin yang
                      lengkap dan perlu
                      diperbarui melalui
                      halaman administrator.
                    </p>
                  </div>
                </div>
              </section>
            )}
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
  description,
  icon: Icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-emerald-50"
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
            {label}
          </p>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
            <Icon size={20} />
          </div>
        </div>

        <p className="mt-3 text-3xl font-black text-slate-900">
          {value}
        </p>

        <p className="mt-2 text-xs font-semibold text-slate-500">
          {description}
        </p>
      </div>
    </article>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <article className="group rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
          <Icon size={22} />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-black text-slate-900">
            {value}
          </p>

          <p className="mt-2 text-xs font-semibold leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}