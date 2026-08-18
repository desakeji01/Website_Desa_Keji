// app/admin/data-desa/page.tsx

import Link from 'next/link';

import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Database,
  ExternalLink,
  FileText,
  Images,
  Map,
  Mars,
  Settings,
  ShieldCheck,
  Target,
  UserCheck,
  Users,
  Venus,
  type LucideIcon,
} from 'lucide-react';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

const PROFIL_KEY = 'utama';

interface WargaDataDesaRow {
  id: string;

  no_kk_hash:
    | string
    | null;

  jenis_kelamin:
    | 'L'
    | 'P'
    | null;

  tanggal_lahir:
    | string
    | null;

  status_penduduk:
    | 'TETAP'
    | 'TIDAK_TETAP'
    | null;

  dusun:
    | string
    | null;

  rw:
    | string
    | null;

  rt:
    | string
    | null;

  updated_at:
    | string
    | null;
}

interface ProfilDesaRow {
  jumlah_laki_laki:
    | number
    | null;

  jumlah_perempuan:
    | number
    | null;

  jumlah_dusun:
    | number
    | null;

  jumlah_rw:
    | number
    | null;

  jumlah_rt:
    | number
    | null;

  tahun_data:
    | number
    | null;

  updated_at:
    | string
    | null;
}

interface AlbumRingkasRow {
  id: string;

  updated_at:
    | string
    | null;
}

interface SdgsRingkasRow {
  id: number;

  updated_at:
    | string
    | null;
}

interface AdminModule {
  title: string;
  description: string;
  statistic: string;
  adminHref: string;
  publicHref: string;
  icon: LucideIcon;
}

interface PublicDataMenu {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

async function getAllWargaDataDesa(): Promise<
  WargaDataDesaRow[]
> {
  const result:
    WargaDataDesaRow[] = [];

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
        no_kk_hash,
        jenis_kelamin,
        tanggal_lahir,
        status_penduduk,
        dusun,
        rw,
        rt,
        updated_at
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
        'Gagal mengambil data warga untuk dashboard Data Desa:',
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
      (data ??
        []) as WargaDataDesaRow[];

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
  ).format(value);
}

function formatTanggal(
  value:
    | string
    | null
    | undefined
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

function hitungPersentase(
  value: number,
  total: number
) {
  if (total === 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      (value / total) * 100
    )
  );
}

function formatPersentase(
  value: number
) {
  return new Intl.NumberFormat(
    'id-ID',
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }
  ).format(value);
}

function isFilled(
  value:
    | string
    | null
    | undefined
) {
  return (
    typeof value ===
      'string' &&
    value.trim().length > 0
  );
}

export default async function AdminDataDesaPage() {
  const [
    wargaRows,
    profilResult,
    albumResult,
    fotoResult,
    sdgsResult,
  ] = await Promise.all([
    getAllWargaDataDesa(),

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
      .from('album_galeri')
      .select(
        `
          id,
          updated_at
        `,
        {
          count: 'exact',
        }
      )
      .eq('aktif', true)
      .order('updated_at', {
        ascending: false,
        nullsFirst: false,
      })
      .limit(1),

    supabaseAdmin
      .from('foto_galeri')
      .select(
        'id',
        {
          count: 'exact',
          head: true,
        }
      ),

    supabaseAdmin
      .from('sdgs_desa')
      .select(
        `
          id,
          updated_at
        `,
        {
          count: 'exact',
        }
      )
      .eq('aktif', true)
      .order('updated_at', {
        ascending: false,
        nullsFirst: false,
      })
      .limit(1),
  ]);

  if (profilResult.error) {
    console.error(
      'Gagal mengambil profil desa:',
      profilResult.error
    );
  }

  if (albumResult.error) {
    console.error(
      'Gagal mengambil ringkasan galeri:',
      albumResult.error
    );
  }

  if (fotoResult.error) {
    console.error(
      'Gagal menghitung foto galeri:',
      fotoResult.error
    );
  }

  if (sdgsResult.error) {
    console.error(
      'Gagal mengambil ringkasan SDGs:',
      sdgsResult.error
    );
  }

  const profil =
    profilResult.data as
      | ProfilDesaRow
      | null;

  const albumTerbaru =
    (
      albumResult.data ??
      []
    )[0] as
      | AlbumRingkasRow
      | undefined;

  const sdgsTerbaru =
    (
      sdgsResult.data ??
      []
    )[0] as
      | SdgsRingkasRow
      | undefined;

  const totalWarga =
    wargaRows.length;

  const jumlahKk =
    new Set(
      wargaRows
        .map(
          (warga) =>
            warga.no_kk_hash
        )
        .filter(
          (
            noKk
          ): noKk is string =>
            isFilled(noKk)
        )
    ).size;

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

  const jenisKelaminTerisi =
    lakiLaki +
    perempuan;

  const tanggalLahirTerisi =
    wargaRows.filter(
      (warga) =>
        isFilled(
          warga.tanggal_lahir
        )
    ).length;

  const statusTerisi =
    wargaRows.filter(
      (warga) =>
        warga.status_penduduk ===
          'TETAP' ||
        warga.status_penduduk ===
          'TIDAK_TETAP'
    ).length;

  const wilayahTerisi =
    wargaRows.filter(
      (warga) =>
        isFilled(warga.dusun) &&
        isFilled(warga.rw) &&
        isFilled(warga.rt)
    ).length;

  const jumlahProfilLaki =
    Number(
      profil?.jumlah_laki_laki ??
        0
    );

  const jumlahProfilPerempuan =
    Number(
      profil
        ?.jumlah_perempuan ??
        0
    );

  const totalProfil =
    jumlahProfilLaki +
    jumlahProfilPerempuan;

  const tahunData =
    Number(
      profil?.tahun_data ??
        new Date()
          .getFullYear()
    );

  const jumlahDusun =
    Number(
      profil?.jumlah_dusun ??
        0
    );

  const jumlahRw =
    Number(
      profil?.jumlah_rw ??
        0
    );

  const jumlahRt =
    Number(
      profil?.jumlah_rt ??
        0
    );

  const profilSinkron =
    totalProfil ===
    totalWarga;

  const persentaseJenisKelamin =
    hitungPersentase(
      jenisKelaminTerisi,
      totalWarga
    );

  const persentaseTanggalLahir =
    hitungPersentase(
      tanggalLahirTerisi,
      totalWarga
    );

  const persentaseStatus =
    hitungPersentase(
      statusTerisi,
      totalWarga
    );

  const persentaseWilayah =
    hitungPersentase(
      wilayahTerisi,
      totalWarga
    );

  const rataRataKelengkapan =
    (
      persentaseJenisKelamin +
      persentaseTanggalLahir +
      persentaseStatus +
      persentaseWilayah
    ) / 4;

  const adminModules:
    AdminModule[] = [
    {
      title:
        'Database Warga',

      description:
        'Kelola data individu warga yang menjadi sumber statistik penduduk, wilayah, umur, status, dan jenis kelamin.',

      statistic:
        `${formatAngka(
          totalWarga
        )} warga aktif`,

      adminHref:
        '/admin/warga',

      publicHref:
        '/data-desa/penduduk',

      icon:
        Users,
    },
    {
      title:
        'Profil dan Wilayah Desa',

      description:
        'Kelola tahun data, jumlah penduduk ringkas, jumlah dusun, RW, dan RT yang tampil pada ringkasan Data Desa.',

      statistic:
        `Tahun data ${tahunData}`,

      adminHref:
        '/admin/pengaturan',

      publicHref:
        '/data-desa',

      icon:
        Settings,
    },
    {
      title:
        'Galeri Desa',

      description:
        'Kelola album kegiatan, foto sampul, kategori, lokasi, tanggal kegiatan, serta dokumentasi desa.',

      statistic:
        `${formatAngka(
          albumResult.count ??
            0
        )} album aktif`,

      adminHref:
        '/admin/galeri',

      publicHref:
        '/data-desa/galeri',

      icon:
        Images,
    },
    {
      title:
        'SDGs Desa',

      description:
        'Kelola skor, tahun data, warna, status publikasi, dan capaian 18 tujuan pembangunan berkelanjutan.',

      statistic:
        `${formatAngka(
          sdgsResult.count ??
            0
        )} goal aktif`,

      adminHref:
        '/admin/sdgs',

      publicHref:
        '/data-desa/sdgs',

      icon:
        Target,
    },
  ];

  const publicDataMenus:
    PublicDataMenu[] = [
    {
      title:
        'Populasi Per Wilayah',

      description:
        'Rekap penduduk berdasarkan dusun, RW, dan RT.',

      href:
        '/data-desa/populasi-wilayah',

      icon:
        Map,
    },
    {
      title:
        'Data Penduduk',

      description:
        'Jumlah penduduk, keluarga, laki-laki, dan perempuan.',

      href:
        '/data-desa/penduduk',

      icon:
        Users,
    },
    {
      title:
        'Rentang Umur',

      description:
        'Persebaran penduduk berdasarkan interval umur.',

      href:
        '/data-desa/rentang-umur',

      icon:
        CalendarDays,
    },
    {
      title:
        'Kategori Umur',

      description:
        'Balita, anak, dewasa, pra-lansia, dan lansia.',

      href:
        '/data-desa/kategori-umur',

      icon:
        BarChart3,
    },
    {
      title:
        'Status Penduduk',

      description:
        'Penduduk tetap, tidak tetap, dan data yang belum terisi.',

      href:
        '/data-desa/status-penduduk',

      icon:
        UserCheck,
    },
    {
      title:
        'Jenis Kelamin',

      description:
        'Komposisi penduduk laki-laki dan perempuan.',

      href:
        '/data-desa/jenis-kelamin',

      icon:
        Mars,
    },
    {
      title:
        'Galeri Desa',

      description:
        'Dokumentasi kegiatan dan potensi Desa Keji.',

      href:
        '/data-desa/galeri',

      icon:
        Images,
    },
    {
      title:
        'SDGs Desa',

      description:
        'Capaian tujuan pembangunan berkelanjutan desa.',

      href:
        '/data-desa/sdgs',

      icon:
        Target,
    },
  ];

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] px-6 py-7 text-white shadow-xl shadow-emerald-950/10 sm:px-8 sm:py-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.13) 1.5px, transparent 1.5px)',

            backgroundSize:
              '26px 26px',
          }}
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <Database
                size={27}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                Data dan Pemerintahan
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                Data Desa
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                Pantau integrasi data warga, profil
                desa, demografi, galeri, dan SDGs yang
                ditampilkan pada website publik Desa
                Keji.
              </p>
            </div>
          </div>

          <Link
            href="/data-desa"
            target="_blank"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white transition hover:bg-white/15"
          >
            Lihat Data Publik

            <ExternalLink
              size={16}
            />
          </Link>
        </div>
      </section>

      {/* Peringatan sinkronisasi */}
      {!profilSinkron && (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <AlertTriangle
                size={22}
              />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-black">
                Ringkasan profil belum sinkron
              </h2>

              <p className="mt-2 text-sm font-semibold leading-6 text-amber-800">
                Database warga memiliki{' '}
                <strong>
                  {formatAngka(
                    totalWarga
                  )}{' '}
                  warga aktif
                </strong>
                , sedangkan ringkasan pada tabel
                profil_desa berjumlah{' '}
                <strong>
                  {formatAngka(
                    totalProfil
                  )}{' '}
                  jiwa
                </strong>
                .
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/admin/warga"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 text-xs font-extrabold text-white transition hover:bg-amber-800"
                >
                  Periksa Data Warga
                  <ArrowRight
                    size={14}
                  />
                </Link>

                <Link
                  href="/admin/pengaturan"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-4 text-xs font-extrabold text-amber-800 transition hover:bg-amber-100"
                >
                  Perbarui Ringkasan
                  <Settings
                    size={14}
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {profilSinkron && (
        <section className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0"
          />

          <p className="text-sm font-semibold leading-6">
            Jumlah penduduk pada profil desa sudah
            sesuai dengan jumlah warga aktif, yaitu{' '}
            {formatAngka(
              totalWarga
            )}{' '}
            jiwa.
          </p>
        </section>
      )}

      {/* Statistik utama */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatistikCard
          label="Warga Aktif"
          value={formatAngka(
            totalWarga
          )}
          description="Database warga"
          icon={Users}
        />

        <StatistikCard
          label="Kartu Keluarga"
          value={formatAngka(
            jumlahKk
          )}
          description="Nomor KK unik"
          icon={FileText}
        />

        <StatistikCard
          label="Laki-laki"
          value={formatAngka(
            lakiLaki
          )}
          description={`${formatPersentase(
            hitungPersentase(
              lakiLaki,
              totalWarga
            )
          )}% penduduk`}
          icon={Mars}
        />

        <StatistikCard
          label="Perempuan"
          value={formatAngka(
            perempuan
          )}
          description={`${formatPersentase(
            hitungPersentase(
              perempuan,
              totalWarga
            )
          )}% penduduk`}
          icon={Venus}
        />
      </section>

      {/* Informasi profil */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MiniStatCard
          label="Tahun Data"
          value={String(
            tahunData
          )}
        />

        <MiniStatCard
          label="Jumlah Dusun"
          value={formatAngka(
            jumlahDusun
          )}
        />

        <MiniStatCard
          label="Jumlah RW"
          value={formatAngka(
            jumlahRw
          )}
        />

        <MiniStatCard
          label="Jumlah RT"
          value={formatAngka(
            jumlahRt
          )}
        />
      </section>

      {/* Kelengkapan data */}
      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_12px_35px_rgba(6,78,59,0.07)]">
        <div className="flex flex-col gap-4 border-b border-emerald-50 bg-gradient-to-r from-emerald-50/80 to-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
              Kualitas Data
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-900">
              Kelengkapan Database Warga
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Persentase dihitung dari seluruh warga
              aktif.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-white px-5 py-3 text-center">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Rata-rata
            </p>

            <p className="mt-1 text-2xl font-black text-emerald-700">
              {formatPersentase(
                rataRataKelengkapan
              )}
              %
            </p>
          </div>
        </div>

        <div className="grid gap-5 p-6 sm:p-7 lg:grid-cols-2">
          <KelengkapanCard
            label="Jenis Kelamin"
            filled={
              jenisKelaminTerisi
            }
            total={totalWarga}
            percentage={
              persentaseJenisKelamin
            }
          />

          <KelengkapanCard
            label="Tanggal Lahir"
            filled={
              tanggalLahirTerisi
            }
            total={totalWarga}
            percentage={
              persentaseTanggalLahir
            }
          />

          <KelengkapanCard
            label="Status Penduduk"
            filled={statusTerisi}
            total={totalWarga}
            percentage={
              persentaseStatus
            }
          />

          <KelengkapanCard
            label="Dusun, RW, dan RT"
            filled={wilayahTerisi}
            total={totalWarga}
            percentage={
              persentaseWilayah
            }
          />
        </div>
      </section>

      {/* Modul pengelolaan */}
      <section>
        <div className="mb-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
            Pengelolaan Data
          </p>

          <h2 className="mt-1 text-2xl font-black text-slate-900">
            Modul Terintegrasi
          </h2>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Gunakan modul berikut untuk memperbarui data
            yang ditampilkan pada halaman publik.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {adminModules.map(
            (module) => (
              <AdminModuleCard
                key={
                  module.title
                }
                module={module}
              />
            )
          )}
        </div>
      </section>

      {/* Halaman publik */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
            Pratinjau Website
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-900">
            Halaman Data Publik
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-500">
            Buka setiap halaman untuk memeriksa hasil
            pengolahan data.
          </p>
        </div>

        <div className="grid gap-4 p-5 sm:p-7 md:grid-cols-2 xl:grid-cols-4">
          {publicDataMenus.map(
            (item) => (
              <PublicPageCard
                key={item.href}
                item={item}
              />
            )
          )}
        </div>
      </section>

      {/* Waktu pembaruan */}
      <section className="grid gap-4 md:grid-cols-3">
        <UpdateCard
          label="Profil Desa"
          value={formatTanggal(
            profil?.updated_at
          )}
        />

        <UpdateCard
          label="Galeri Desa"
          value={formatTanggal(
            albumTerbaru
              ?.updated_at
          )}
          secondary={`${formatAngka(
            fotoResult.count ?? 0
          )} foto tersimpan`}
        />

        <UpdateCard
          label="SDGs Desa"
          value={formatTanggal(
            sdgsTerbaru
              ?.updated_at
          )}
        />
      </section>
    </div>
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
    <article className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_12px_35px_rgba(6,78,59,0.06)]">
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-emerald-50" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
            {label}
          </p>

          <p className="mt-4 text-3xl font-black tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-2 text-xs font-bold text-emerald-700">
            {description}
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Icon
            size={22}
          />
        </div>
      </div>
    </article>
  );
}

function MiniStatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-slate-400">
        {label}
      </p>

      <p className="mt-3 text-2xl font-black text-slate-900">
        {value}
      </p>
    </article>
  );
}

function KelengkapanCard({
  label,
  filled,
  total,
  percentage,
}: {
  label: string;
  filled: number;
  total: number;
  percentage: number;
}) {
  const complete =
    percentage >= 100;

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black text-slate-800">
            {label}
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-500">
            {formatAngka(
              filled
            )}{' '}
            dari{' '}
            {formatAngka(
              total
            )}{' '}
            warga
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            complete
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {complete ? (
            <CheckCircle2
              size={20}
            />
          ) : (
            <AlertTriangle
              size={20}
            />
          )}
        </div>
      </div>

      <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all ${
            complete
              ? 'bg-emerald-600'
              : 'bg-amber-500'
          }`}
          style={{
            width:
              `${percentage}%`,
          }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs font-bold">
        <span className="text-slate-400">
          Kelengkapan
        </span>

        <span
          className={
            complete
              ? 'text-emerald-700'
              : 'text-amber-700'
          }
        >
          {formatPersentase(
            percentage
          )}
          %
        </span>
      </div>
    </article>
  );
}

function AdminModuleCard({
  module,
}: {
  module: AdminModule;
}) {
  const Icon =
    module.icon;

  return (
    <article className="group rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
          <Icon
            size={22}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-black text-slate-900">
            {module.title}
          </h3>

          <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
            {module.description}
          </p>

          <span className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
            {module.statistic}
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link
          href={
            module.adminHref
          }
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-800"
        >
          Kelola Data

          <ArrowRight
            size={14}
          />
        </Link>

        <Link
          href={
            module.publicHref
          }
          target="_blank"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
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

function PublicPageCard({
  item,
}: {
  item: PublicDataMenu;
}) {
  const Icon =
    item.icon;

  return (
    <Link
      href={item.href}
      target="_blank"
      className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-emerald-200 hover:bg-emerald-50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
          <Icon size={20} />
        </div>

        <ExternalLink
          size={15}
          className="text-slate-300 transition group-hover:text-emerald-600"
        />
      </div>

      <h3 className="mt-4 text-sm font-black text-slate-800">
        {item.title}
      </h3>

      <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
        {item.description}
      </p>
    </Link>
  );
}

function UpdateCard({
  label,
  value,
  secondary,
}: {
  label: string;
  value: string;
  secondary?: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <ShieldCheck
            size={19}
          />
        </div>

        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-slate-400">
            Terakhir diperbarui
          </p>

          <h3 className="mt-1 font-black text-slate-800">
            {label}
          </h3>

          <p className="mt-2 text-xs font-bold text-emerald-700">
            {value}
          </p>

          {secondary && (
            <p className="mt-1 text-xs font-medium text-slate-400">
              {secondary}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}