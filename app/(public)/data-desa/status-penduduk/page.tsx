// app/(public)/data-desa/status-penduduk/page.tsx

import {
  BadgeCheck,
  CircleAlert,
  Database,
  Home,
  MapPin,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';

import SidebarLayanan from '@/components/SidebarLayanan';
import SidebarTilikArkeji from '@/components/SidebarTilikArkeji';

import StatusPendudukCharts, {
  type StatistikStatusPenduduk,
} from '@/components/public/StatusPendudukCharts';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  PilihanLayanan,
} from '@/types/layanan';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

interface WargaStatusRow {
  status_penduduk:
    | 'TETAP'
    | 'TIDAK_TETAP'
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

function safeString(
  value: unknown
) {
  return String(
    value ?? ''
  ).trim();
}

async function getAllWargaStatus():
  Promise<WargaStatusRow[]> {
  const result:
    WargaStatusRow[] = [];

  const pageSize = 1000;

  let from = 0;

  while (true) {
    const {
      data,
      error,
    } = await supabaseAdmin
      .from('warga')
      .select(`
        status_penduduk,
        jenis_kelamin
      `)
      .eq('aktif', true)
      .range(
        from,
        from + pageSize - 1
      );

    if (error) {
      console.error(
        'Gagal mengambil data status penduduk:',
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
      ) as WargaStatusRow[];

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

function kelompokkanStatusPenduduk(
  wargaRows:
    WargaStatusRow[]
): StatistikStatusPenduduk[] {
  const statistik:
    StatistikStatusPenduduk[] = [
    {
      key: 'tetap',

      label:
        'Penduduk Tetap',

      jumlah: 0,

      lakiLaki: 0,

      perempuan: 0,
    },

    {
      key: 'tidak-tetap',

      label:
        'Penduduk Tidak Tetap',

      jumlah: 0,

      lakiLaki: 0,

      perempuan: 0,
    },

    {
      key: 'belum-mengisi',

      label:
        'Belum Mengisi',

      jumlah: 0,

      lakiLaki: 0,

      perempuan: 0,
    },
  ];

  wargaRows.forEach(
    (warga) => {
      let target:
        StatistikStatusPenduduk;

      if (
        warga.status_penduduk ===
        'TETAP'
      ) {
        target =
          statistik[0];
      } else if (
        warga.status_penduduk ===
        'TIDAK_TETAP'
      ) {
        target =
          statistik[1];
      } else {
        target =
          statistik[2];
      }

      target.jumlah += 1;

      if (
        warga.jenis_kelamin ===
        'L'
      ) {
        target.lakiLaki += 1;
      }

      if (
        warga.jenis_kelamin ===
        'P'
      ) {
        target.perempuan += 1;
      }
    }
  );

  return statistik;
}

function getJumlahStatus(
  statistik:
    StatistikStatusPenduduk[],
  key: StatistikStatusPenduduk['key']
) {
  return (
    statistik.find(
      (item) =>
        item.key === key
    )?.jumlah ?? 0
  );
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

export default async function StatusPendudukPage() {
  const [
    wargaRows,
    layananResult,
    profilResult,
  ] = await Promise.all([
    getAllWargaStatus(),

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
    tahunDataRaw > 1900
      ? tahunDataRaw
      : new Date()
          .getFullYear();

  const statistik =
    kelompokkanStatusPenduduk(
      wargaRows
    );

  const totalPenduduk =
    wargaRows.length;

  const pendudukTetap =
    getJumlahStatus(
      statistik,
      'tetap'
    );

  const pendudukTidakTetap =
    getJumlahStatus(
      statistik,
      'tidak-tetap'
    );

  const belumMengisi =
    getJumlahStatus(
      statistik,
      'belum-mengisi'
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
              <MapPin
                size={24}
              />
            </div>

            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
              Data Desa Keji
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Status Penduduk
            </h1>

            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80 sm:text-base">
              Informasi jumlah penduduk
              tetap, penduduk tidak tetap,
              dan status administrasi warga
              Desa Keji berdasarkan data
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
                  pendudukTetap
                )} penduduk tetap`}
              />

              <HeaderBadge
                label={`${formatAngka(
                  pendudukTidakTetap
                )} tidak tetap`}
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
                value={
                  totalPenduduk
                }
                description="Seluruh warga aktif"
                icon={Users}
              />

              <StatistikCard
                label="Penduduk Tetap"
                value={
                  pendudukTetap
                }
                description="Berdomisili tetap"
                icon={Home}
              />

              <StatistikCard
                label="Penduduk Tidak Tetap"
                value={
                  pendudukTidakTetap
                }
                description="Domisili tidak tetap"
                icon={MapPin}
              />

              <StatistikCard
                label="Belum Mengisi"
                value={
                  belumMengisi
                }
                description="Status belum dilengkapi"
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
                    Data Status Penduduk
                    Terintegrasi
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-emerald-800">
                    Status penduduk dikelola
                    melalui halaman admin
                    warga. Perubahan status
                    maupun penonaktifan warga
                    akan langsung memengaruhi
                    kartu ringkasan, grafik,
                    dan tabel statistik pada
                    halaman ini.
                  </p>
                </div>
              </div>
            </section>

            {/* Penjelasan Status */}
            <section className="grid gap-4 sm:grid-cols-2">
              <StatusInfoCard
                icon={BadgeCheck}
                title="Penduduk Tetap"
                description="Warga yang tercatat dan berdomisili tetap di wilayah administrasi Desa Keji."
              />

              <StatusInfoCard
                icon={MapPin}
                title="Penduduk Tidak Tetap"
                description="Warga yang tinggal sementara atau belum berstatus sebagai penduduk tetap Desa Keji."
              />
            </section>

            {/* Grafik dan Tabel */}
            <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-6 flex items-start gap-4 border-b border-emerald-100 pb-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
                  <Users
                    size={21}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Visualisasi Data
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-900">
                    Statistik Status
                    Penduduk
                  </h2>

                  <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                    Perbandingan status
                    penduduk berdasarkan
                    jumlah dan jenis kelamin.
                  </p>
                </div>
              </div>

              <StatusPendudukCharts
                data={statistik}
                totalPenduduk={
                  totalPenduduk
                }
                tahunData={
                  tahunData
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
                    Sumber dan Privasi Data
                  </p>

                  <h2 className="mt-1 font-black text-slate-900">
                    Administrasi Warga
                    Desa Keji
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                    Informasi pada halaman
                    ini bersumber dari
                    database warga aktif
                    Desa Keji tahun{' '}
                    {tahunData}. Data pribadi
                    seperti nama, NIK, nomor
                    KK, alamat, dan nomor
                    WhatsApp tidak ditampilkan
                    kepada publik.
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
  description,
  icon: Icon,
}: {
  label: string;
  value: number;
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

          <p className="mt-2 text-xs font-semibold text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
          <Icon size={21} />
        </div>
      </div>
    </article>
  );
}

function StatusInfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <article className="group rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md sm:p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
        <Icon size={21} />
      </div>

      <h2 className="mt-4 font-black text-slate-900">
        {title}
      </h2>

      <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
        {description}
      </p>
    </article>
  );
}