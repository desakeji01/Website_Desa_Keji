// app/(public)/data-desa/populasi-wilayah/page.tsx

import {
  Fragment,
} from 'react';

import {
  BarChart3,
  Database,
  Info,
  MapPinned,
  Mars,
  Users,
  Venus,
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

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

interface WargaWilayahRow {
  dusun: string | null;
  rw: string | null;
  rt: string | null;

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

interface StatistikWilayah {
  jumlahKk: number;
  jumlahPenduduk: number;
  lakiLaki: number;
  perempuan: number;
}

interface KelompokDusun {
  dusun: string;
  rows: WargaWilayahRow[];
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

async function getAllWargaWilayah():
  Promise<WargaWilayahRow[]> {
  const result:
    WargaWilayahRow[] = [];

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
        rw,
        rt,
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
        'Gagal mengambil data populasi wilayah:',
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
      ) as WargaWilayahRow[];

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

function hitungStatistik(
  rows: WargaWilayahRow[]
): StatistikWilayah {
  const daftarKk =
    new Set<string>();

  let lakiLaki = 0;
  let perempuan = 0;

  rows.forEach((row) => {
    const noKk =
      safeString(
        row.no_kk_hash
      );

    if (noKk) {
      daftarKk.add(noKk);
    }

    if (
      row.jenis_kelamin ===
      'L'
    ) {
      lakiLaki += 1;
    }

    if (
      row.jenis_kelamin ===
      'P'
    ) {
      perempuan += 1;
    }
  });

  return {
    jumlahKk:
      daftarKk.size,

    jumlahPenduduk:
      rows.length,

    lakiLaki,
    perempuan,
  };
}

function kelompokkanDusun(
  rows: WargaWilayahRow[]
): KelompokDusun[] {
  const daftarNamaDusun = [
    ...new Set(
      rows.map((row) =>
        normalizeNamaDusun(
          row.dusun
        )
      )
    ),
  ];

  const dusunUtama =
    URUTAN_DUSUN.filter(
      (dusun) =>
        daftarNamaDusun.includes(
          dusun
        )
    );

  const dusunTambahan =
    daftarNamaDusun
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
  ].map((dusun) => ({
    dusun,

    rows: rows.filter(
      (row) =>
        normalizeNamaDusun(
          row.dusun
        ) === dusun
    ),
  }));
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

function formatKodeWilayah(
  value: string | null
) {
  const rawValue =
    safeString(value);

  if (!rawValue) {
    return '-';
  }

  const number =
    Number(rawValue);

  if (
    Number.isNaN(number)
  ) {
    return rawValue;
  }

  return String(number);
}

function urutkanKodeWilayah(
  first: string,
  second: string
) {
  return first.localeCompare(
    second,
    'id-ID',
    {
      numeric: true,
    }
  );
}

export default async function PopulasiWilayahPage() {
  const [
    wargaRows,
    layananResult,
    profilResult,
  ] = await Promise.all([
    getAllWargaWilayah(),

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
      'Gagal mengambil layanan:',
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

  const statistikDesa =
    hitungStatistik(
      wargaRows
    );

  const kelompokDusun =
    kelompokkanDusun(
      wargaRows
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
              <MapPinned
                size={24}
              />
            </div>

            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
              Data Desa Keji
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Populasi Per Wilayah
            </h1>

            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80 sm:text-base">
              Informasi jumlah keluarga dan
              penduduk berdasarkan dusun, RW,
              dan RT di Desa Keji pada tahun{' '}
              {tahunData}.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <HeaderBadge
                label={`${formatAngka(
                  statistikDesa.jumlahPenduduk
                )} penduduk`}
              />

              <HeaderBadge
                label={`${formatAngka(
                  statistikDesa.jumlahKk
                )} kartu keluarga`}
              />

              <HeaderBadge
                label={`${kelompokDusun.length} wilayah dusun`}
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
                label="Kartu Keluarga"
                value={
                  statistikDesa.jumlahKk
                }
                description="KK terdata"
                icon={Database}
              />

              <StatistikCard
                label="Total Penduduk"
                value={
                  statistikDesa.jumlahPenduduk
                }
                description="Warga aktif"
                icon={Users}
              />

              <StatistikCard
                label="Laki-laki"
                value={
                  statistikDesa.lakiLaki
                }
                description="Penduduk laki-laki"
                icon={Mars}
              />

              <StatistikCard
                label="Perempuan"
                value={
                  statistikDesa.perempuan
                }
                description="Penduduk perempuan"
                icon={Venus}
              />
            </section>

            {/* Informasi Data */}
            <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
                  <Info size={21} />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Informasi Data
                  </p>

                  <h2 className="mt-1 font-black text-emerald-950">
                    Demografi Berdasarkan
                    Wilayah
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-emerald-800">
                    Jumlah penduduk dihitung
                    secara otomatis dari data
                    warga aktif. Jumlah kartu
                    keluarga dihitung berdasarkan
                    nomor KK terenkripsi yang
                    tersimpan pada sistem.
                  </p>
                </div>
              </div>
            </section>

            {/* Tabel Populasi */}
            <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
              <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white px-5 py-5 sm:px-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
                    <BarChart3
                      size={21}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                      Rekapitulasi Wilayah
                    </p>

                    <h2 className="mt-1 text-lg font-black text-slate-900">
                      Demografi Dusun, RW,
                      dan RT
                    </h2>

                    <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                      Tabel jumlah keluarga,
                      penduduk, laki-laki, dan
                      perempuan.
                    </p>
                  </div>
                </div>
              </div>

              {wargaRows.length ===
              0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-300">
                    <Users
                      size={34}
                    />
                  </div>

                  <h3 className="mt-5 font-black text-slate-800">
                    Data belum tersedia
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
                    Data populasi akan tampil
                    setelah administrator
                    menambahkan data warga yang
                    lengkap.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[780px] border-collapse text-left">
                    <thead>
                      <tr className="bg-emerald-900 text-white">
                        <th
                          scope="col"
                          className="w-[70px] px-4 py-4 text-center text-xs font-extrabold uppercase tracking-wider"
                        >
                          No
                        </th>

                        <th
                          scope="col"
                          className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider"
                        >
                          Wilayah
                        </th>

                        <th
                          scope="col"
                          className="w-[90px] px-4 py-4 text-center text-xs font-extrabold uppercase tracking-wider"
                        >
                          KK
                        </th>

                        <th
                          scope="col"
                          className="w-[90px] px-4 py-4 text-center text-xs font-extrabold uppercase tracking-wider"
                        >
                          L + P
                        </th>

                        <th
                          scope="col"
                          className="w-[90px] px-4 py-4 text-center text-xs font-extrabold uppercase tracking-wider"
                        >
                          L
                        </th>

                        <th
                          scope="col"
                          className="w-[90px] px-4 py-4 text-center text-xs font-extrabold uppercase tracking-wider"
                        >
                          P
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200">
                      {kelompokDusun.map(
                        (
                          kelompok,
                          dusunIndex
                        ) => {
                          const statistikDusun =
                            hitungStatistik(
                              kelompok.rows
                            );

                          const daftarRw = [
                            ...new Set(
                              kelompok.rows
                                .map(
                                  (row) =>
                                    safeString(
                                      row.rw
                                    )
                                )
                                .filter(
                                  Boolean
                                )
                            ),
                          ].sort(
                            urutkanKodeWilayah
                          );

                          return (
                            <Fragment
                              key={
                                kelompok.dusun
                              }
                            >
                              {/* Baris Dusun */}
                              <tr className="bg-emerald-100/80">
                                <td className="px-4 py-4 text-center text-sm font-black text-emerald-900">
                                  {dusunIndex +
                                    1}
                                </td>

                                <td className="px-5 py-4 text-sm font-black uppercase tracking-wide text-emerald-950">
                                  {
                                    kelompok.dusun
                                  }
                                </td>

                                <DataCell
                                  value={
                                    statistikDusun.jumlahKk
                                  }
                                  variant="dusun"
                                />

                                <DataCell
                                  value={
                                    statistikDusun.jumlahPenduduk
                                  }
                                  variant="dusun"
                                />

                                <DataCell
                                  value={
                                    statistikDusun.lakiLaki
                                  }
                                  variant="dusun"
                                />

                                <DataCell
                                  value={
                                    statistikDusun.perempuan
                                  }
                                  variant="dusun"
                                />
                              </tr>

                              {daftarRw.map(
                                (
                                  rw,
                                  rwIndex
                                ) => {
                                  const rowsRw =
                                    kelompok.rows.filter(
                                      (
                                        row
                                      ) =>
                                        safeString(
                                          row.rw
                                        ) ===
                                        rw
                                    );

                                  const statistikRw =
                                    hitungStatistik(
                                      rowsRw
                                    );

                                  const daftarRt =
                                    [
                                      ...new Set(
                                        rowsRw
                                          .map(
                                            (
                                              row
                                            ) =>
                                              safeString(
                                                row.rt
                                              )
                                          )
                                          .filter(
                                            Boolean
                                          )
                                      ),
                                    ].sort(
                                      urutkanKodeWilayah
                                    );

                                  return (
                                    <Fragment
                                      key={`${kelompok.dusun}-${rw}`}
                                    >
                                      {/* Baris RW */}
                                      <tr className="bg-slate-100/90">
                                        <td className="px-4 py-3.5 text-center text-sm font-bold text-slate-500">
                                          {`${dusunIndex + 1}.${rwIndex + 1}`}
                                        </td>

                                        <td className="px-5 py-3.5 pl-10 text-sm font-extrabold text-slate-700">
                                          RW{' '}
                                          {formatKodeWilayah(
                                            rw
                                          )}
                                        </td>

                                        <DataCell
                                          value={
                                            statistikRw.jumlahKk
                                          }
                                        />

                                        <DataCell
                                          value={
                                            statistikRw.jumlahPenduduk
                                          }
                                        />

                                        <DataCell
                                          value={
                                            statistikRw.lakiLaki
                                          }
                                        />

                                        <DataCell
                                          value={
                                            statistikRw.perempuan
                                          }
                                        />
                                      </tr>

                                      {daftarRt.map(
                                        (
                                          rt,
                                          rtIndex
                                        ) => {
                                          const rowsRt =
                                            rowsRw.filter(
                                              (
                                                row
                                              ) =>
                                                safeString(
                                                  row.rt
                                                ) ===
                                                rt
                                            );

                                          const statistikRt =
                                            hitungStatistik(
                                              rowsRt
                                            );

                                          return (
                                            <tr
                                              key={`${kelompok.dusun}-${rw}-${rt}`}
                                              className="bg-white transition hover:bg-emerald-50/70"
                                            >
                                              <td className="px-4 py-3.5 text-center text-xs font-semibold text-slate-400">
                                                {`${dusunIndex + 1}.${rwIndex + 1}.${rtIndex + 1}`}
                                              </td>

                                              <td className="px-5 py-3.5 pl-16 text-sm font-semibold text-slate-600">
                                                RT{' '}
                                                {formatKodeWilayah(
                                                  rt
                                                )}
                                              </td>

                                              <DataCell
                                                value={
                                                  statistikRt.jumlahKk
                                                }
                                              />

                                              <DataCell
                                                value={
                                                  statistikRt.jumlahPenduduk
                                                }
                                              />

                                              <DataCell
                                                value={
                                                  statistikRt.lakiLaki
                                                }
                                              />

                                              <DataCell
                                                value={
                                                  statistikRt.perempuan
                                                }
                                              />
                                            </tr>
                                          );
                                        }
                                      )}
                                    </Fragment>
                                  );
                                }
                              )}
                            </Fragment>
                          );
                        }
                      )}
                    </tbody>

                    <tfoot>
                      <tr className="bg-emerald-950 text-white">
                        <td
                          colSpan={2}
                          className="px-5 py-4 text-sm font-black uppercase tracking-wide"
                        >
                          Total Desa Keji
                        </td>

                        <DataCell
                          value={
                            statistikDesa.jumlahKk
                          }
                          variant="footer"
                        />

                        <DataCell
                          value={
                            statistikDesa.jumlahPenduduk
                          }
                          variant="footer"
                        />

                        <DataCell
                          value={
                            statistikDesa.lakiLaki
                          }
                          variant="footer"
                        />

                        <DataCell
                          value={
                            statistikDesa.perempuan
                          }
                          variant="footer"
                        />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
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
    <article className="group rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black text-slate-900">
            {formatAngka(value)}
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

function DataCell({
  value,
  variant = 'normal',
}: {
  value: number;
  variant?:
    | 'normal'
    | 'dusun'
    | 'footer';
}) {
  const className = {
    normal:
      'font-semibold text-slate-600',

    dusun:
      'font-black text-emerald-950',

    footer:
      'font-black text-white',
  }[variant];

  return (
    <td
      className={`px-4 py-3.5 text-center text-sm ${className}`}
    >
      {formatAngka(value)}
    </td>
  );
}