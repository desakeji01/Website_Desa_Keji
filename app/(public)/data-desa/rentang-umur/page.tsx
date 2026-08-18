// app/(public)/data-desa/rentang-umur/page.tsx

import {
  CalendarDays,
  CircleAlert,
  Clock3,
  Database,
  Info,
  ShieldCheck,
  UserRoundCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';

import SidebarLayanan from '@/components/SidebarLayanan';
import SidebarTilikArkeji from '@/components/SidebarTilikArkeji';

import RentangUmurCharts, {
  type StatistikRentangUmur,
} from '@/components/public/RentangUmurCharts';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  PilihanLayanan,
} from '@/types/layanan';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

interface WargaRentangUmurRow {
  tanggal_lahir:
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

interface DefinisiRentangUmur {
  key: string;
  label: string;
  min: number;
  max: number;
}

interface TanggalSekarang {
  tahun: number;
  bulan: number;
  tanggal: number;
}

const DEFINISI_RENTANG:
  DefinisiRentangUmur[] = [
  {
    key: '0-1',
    label: '0 s/d 1 Tahun',
    min: 0,
    max: 1,
  },
  {
    key: '2-4',
    label: '2 s/d 4 Tahun',
    min: 2,
    max: 4,
  },
  {
    key: '5-9',
    label: '5 s/d 9 Tahun',
    min: 5,
    max: 9,
  },
  {
    key: '10-14',
    label: '10 s/d 14 Tahun',
    min: 10,
    max: 14,
  },
  {
    key: '15-19',
    label: '15 s/d 19 Tahun',
    min: 15,
    max: 19,
  },
  {
    key: '20-24',
    label: '20 s/d 24 Tahun',
    min: 20,
    max: 24,
  },
  {
    key: '25-29',
    label: '25 s/d 29 Tahun',
    min: 25,
    max: 29,
  },
  {
    key: '30-34',
    label: '30 s/d 34 Tahun',
    min: 30,
    max: 34,
  },
  {
    key: '35-39',
    label: '35 s/d 39 Tahun',
    min: 35,
    max: 39,
  },
  {
    key: '40-44',
    label: '40 s/d 44 Tahun',
    min: 40,
    max: 44,
  },
  {
    key: '45-49',
    label: '45 s/d 49 Tahun',
    min: 45,
    max: 49,
  },
  {
    key: '50-54',
    label: '50 s/d 54 Tahun',
    min: 50,
    max: 54,
  },
  {
    key: '55-59',
    label: '55 s/d 59 Tahun',
    min: 55,
    max: 59,
  },
  {
    key: '60-64',
    label: '60 s/d 64 Tahun',
    min: 60,
    max: 64,
  },
  {
    key: '65-69',
    label: '65 s/d 69 Tahun',
    min: 65,
    max: 69,
  },
  {
    key: '70-74',
    label: '70 s/d 74 Tahun',
    min: 70,
    max: 74,
  },
  {
    key: '75-plus',
    label: '75 Tahun ke Atas',
    min: 75,
    max: 150,
  },
];

function safeString(
  value: unknown
) {
  return String(
    value ?? ''
  ).trim();
}

async function getAllWargaRentangUmur():
  Promise<WargaRentangUmurRow[]> {
  const result:
    WargaRentangUmurRow[] = [];

  const pageSize = 1000;

  let from = 0;

  while (true) {
    const {
      data,
      error,
    } = await supabaseAdmin
      .from('warga')
      .select(`
        tanggal_lahir,
        jenis_kelamin
      `)
      .eq('aktif', true)
      .range(
        from,
        from + pageSize - 1
      );

    if (error) {
      console.error(
        'Gagal mengambil data rentang umur:',
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
      ) as WargaRentangUmurRow[];

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

function getTanggalJakarta():
  TanggalSekarang {
  const bagian =
    new Intl.DateTimeFormat(
      'en-US',
      {
        timeZone:
          'Asia/Jakarta',

        year: 'numeric',

        month: '2-digit',

        day: '2-digit',
      }
    ).formatToParts(
      new Date()
    );

  function getValue(
    type:
      | 'year'
      | 'month'
      | 'day'
  ) {
    return Number(
      bagian.find(
        (item) =>
          item.type === type
      )?.value ?? 0
    );
  }

  return {
    tahun:
      getValue('year'),

    bulan:
      getValue('month'),

    tanggal:
      getValue('day'),
  };
}

function isTanggalLahirValid(
  tahun: number,
  bulan: number,
  tanggal: number
) {
  if (
    !Number.isInteger(tahun) ||
    !Number.isInteger(bulan) ||
    !Number.isInteger(tanggal) ||
    tahun < 1800 ||
    bulan < 1 ||
    bulan > 12 ||
    tanggal < 1 ||
    tanggal > 31
  ) {
    return false;
  }

  const date =
    new Date(
      Date.UTC(
        tahun,
        bulan - 1,
        tanggal
      )
    );

  return (
    date.getUTCFullYear() ===
      tahun &&
    date.getUTCMonth() ===
      bulan - 1 &&
    date.getUTCDate() ===
      tanggal
  );
}

function hitungUmur(
  tanggalLahir:
    string | null,

  tanggalSekarang:
    TanggalSekarang
) {
  const value =
    safeString(
      tanggalLahir
    );

  if (!value) {
    return null;
  }

  const bagian =
    value.split('-');

  if (
    bagian.length !== 3
  ) {
    return null;
  }

  const tahunLahir =
    Number(bagian[0]);

  const bulanLahir =
    Number(bagian[1]);

  const hariLahir =
    Number(bagian[2]);

  if (
    !isTanggalLahirValid(
      tahunLahir,
      bulanLahir,
      hariLahir
    )
  ) {
    return null;
  }

  let umur =
    tanggalSekarang.tahun -
    tahunLahir;

  const belumUlangTahun =
    tanggalSekarang.bulan <
      bulanLahir ||
    (
      tanggalSekarang.bulan ===
        bulanLahir &&
      tanggalSekarang.tanggal <
        hariLahir
    );

  if (belumUlangTahun) {
    umur -= 1;
  }

  if (
    umur < 0 ||
    umur > 150
  ) {
    return null;
  }

  return umur;
}

function kelompokkanRentangUmur(
  wargaRows:
    WargaRentangUmurRow[]
): StatistikRentangUmur[] {
  const tanggalSekarang =
    getTanggalJakarta();

  const statistik =
    DEFINISI_RENTANG.map(
      (rentang) => ({
        key: rentang.key,

        label:
          rentang.label,

        jumlah: 0,

        lakiLaki: 0,

        perempuan: 0,
      })
    );

  const belumMengisi:
    StatistikRentangUmur = {
    key: 'belum-mengisi',

    label:
      'Belum Mengisi',

    jumlah: 0,

    lakiLaki: 0,

    perempuan: 0,
  };

  wargaRows.forEach(
    (warga) => {
      const umur =
        hitungUmur(
          warga.tanggal_lahir,
          tanggalSekarang
        );

      let target:
        StatistikRentangUmur;

      if (umur === null) {
        target =
          belumMengisi;
      } else {
        const index =
          DEFINISI_RENTANG.findIndex(
            (rentang) =>
              umur >=
                rentang.min &&
              umur <=
                rentang.max
          );

        target =
          index >= 0
            ? statistik[index]
            : belumMengisi;
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

  return [
    ...statistik,
    belumMengisi,
  ];
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

export default async function RentangUmurPage() {
  const [
    wargaRows,
    layananResult,
    profilResult,
  ] = await Promise.all([
    getAllWargaRentangUmur(),

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

  const statistik =
    kelompokkanRentangUmur(
      wargaRows
    );

  const totalPenduduk =
    wargaRows.length;

  const totalLakiLaki =
    wargaRows.filter(
      (warga) =>
        warga.jenis_kelamin ===
        'L'
    ).length;

  const totalPerempuan =
    wargaRows.filter(
      (warga) =>
        warga.jenis_kelamin ===
        'P'
    ).length;

  const statistikBelumMengisi =
    statistik.find(
      (item) =>
        item.key ===
        'belum-mengisi'
    );

  const belumMengisi =
    statistikBelumMengisi
      ?.jumlah ?? 0;

  const jumlahTanggalLahirTerisi =
    Math.max(
      totalPenduduk -
        belumMengisi,
      0
    );

  const kelompokTerbanyak =
    statistik
      .filter(
        (item) =>
          item.key !==
          'belum-mengisi'
      )
      .reduce<
        | StatistikRentangUmur
        | null
      >(
        (
          terbesar,
          item
        ) => {
          if (
            !terbesar ||
            item.jumlah >
              terbesar.jumlah
          ) {
            return item;
          }

          return terbesar;
        },
        null
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
              <CalendarDays
                size={24}
              />
            </div>

            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
              Data Desa Keji
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Data Rentang Umur
            </h1>

            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80 sm:text-base">
              Informasi persebaran umur
              penduduk Desa Keji yang dihitung
              secara otomatis berdasarkan
              tanggal lahir warga aktif tahun{' '}
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
                  jumlahTanggalLahirTerisi
                )} data lengkap`}
              />

              <HeaderBadge
                label={`${formatAngka(
                  belumMengisi
                )} belum lengkap`}
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
                label="Tanggal Lahir Terisi"
                value={formatAngka(
                  jumlahTanggalLahirTerisi
                )}
                description="Data tanggal lahir valid"
                icon={
                  UserRoundCheck
                }
              />

              <StatistikCard
                label="Belum Mengisi"
                value={formatAngka(
                  belumMengisi
                )}
                description="Kosong atau tidak valid"
                icon={CircleAlert}
              />

              <StatistikCard
                label="Kelompok Terbanyak"
                value={
                  kelompokTerbanyak
                    ?.label ?? '-'
                }
                description={
                  kelompokTerbanyak
                    ? `${formatAngka(
                        kelompokTerbanyak.jumlah
                      )} jiwa`
                    : 'Belum ada data'
                }
                icon={Clock3}
                smallValue
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
                    Rentang Umur
                    Terintegrasi
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-emerald-800">
                    Rentang umur dihitung
                    otomatis berdasarkan
                    tanggal lahir warga aktif.
                    Nilai umur akan menyesuaikan
                    tanggal berjalan tanpa
                    perlu diperbarui secara
                    manual melalui halaman
                    administrator.
                  </p>
                </div>
              </div>
            </section>

            {/* Grafik dan Tabel */}
            <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-6 flex items-start gap-4 border-b border-emerald-100 pb-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
                  <Clock3
                    size={21}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Visualisasi Data
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-900">
                    Persebaran Rentang
                    Umur Penduduk
                  </h2>

                  <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                    Perbandingan jumlah
                    penduduk berdasarkan
                    kelompok umur dan jenis
                    kelamin.
                  </p>
                </div>
              </div>

              <RentangUmurCharts
                data={statistik}
                totalPenduduk={
                  totalPenduduk
                }
                totalLakiLaki={
                  totalLakiLaki
                }
                totalPerempuan={
                  totalPerempuan
                }
                tahunData={
                  tahunData
                }
              />
            </section>

            {/* Penjelasan Data */}
            <section className="grid gap-4 sm:grid-cols-2">
              <InformationCard
                icon={CalendarDays}
                title="Perhitungan Umur"
                description="Umur dihitung berdasarkan tanggal lahir warga dan tanggal berjalan pada zona waktu Asia/Jakarta."
              />

              <InformationCard
                icon={CircleAlert}
                title="Data Belum Lengkap"
                description="Tanggal lahir kosong atau tidak valid dikelompokkan ke dalam kategori Belum Mengisi."
              />
            </section>

            {/* Privasi */}
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
                    menampilkan hasil
                    pengelompokan umur. Tanggal
                    lahir lengkap, nama, NIK,
                    nomor KK, alamat, dan nomor
                    WhatsApp warga tidak
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

function StatistikCard({
  label,
  value,
  description,
  icon: Icon,
  smallValue = false,
}: {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  smallValue?: boolean;
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

        <p
          className={`mt-3 font-black text-slate-900 ${
            smallValue
              ? 'text-base leading-snug'
              : 'text-3xl'
          }`}
        >
          {value}
        </p>

        <p className="mt-2 text-xs font-semibold text-slate-500">
          {description}
        </p>
      </div>
    </article>
  );
}

function InformationCard({
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