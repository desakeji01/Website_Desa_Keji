// components/public/RentangUmurCharts.tsx

'use client';

import {
  useMemo,
  useState,
} from 'react';

import {
  BarChart3,
  Download,
  PieChart,
  Printer,
} from 'lucide-react';

export interface StatistikRentangUmur {
  key: string;
  label: string;
  jumlah: number;
  lakiLaki: number;
  perempuan: number;
}

interface RentangUmurChartsProps {
  data: StatistikRentangUmur[];
  totalPenduduk: number;
  totalLakiLaki: number;
  totalPerempuan: number;
  tahunData: number;
}

type ChartMode =
  | 'donut'
  | 'bar';

const WARNA_GRAFIK = [
  '#047857',
  '#0f766e',
  '#0891b2',
  '#2563eb',
  '#4f46e5',
  '#7c3aed',
  '#a21caf',
  '#be123c',
  '#e11d48',
  '#f97316',
  '#d97706',
  '#ca8a04',
  '#65a30d',
  '#16a34a',
  '#059669',
  '#14b8a6',
  '#64748b',
  '#334155',
];

function formatAngka(
  value: number
) {
  return new Intl.NumberFormat(
    'id-ID'
  ).format(value);
}

function formatPersentase(
  value: number,
  total: number
) {
  if (total === 0) {
    return '0,00%';
  }

  return `${new Intl.NumberFormat(
    'id-ID',
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(
    (value / total) * 100
  )}%`;
}

export default function RentangUmurCharts({
  data,
  totalPenduduk,
  totalLakiLaki,
  totalPerempuan,
  tahunData,
}: RentangUmurChartsProps) {
  const [
    chartMode,
    setChartMode,
  ] = useState<ChartMode>(
    'donut'
  );

  const dataAktif =
    useMemo(
      () =>
        data.filter(
          (item) =>
            item.jumlah > 0
        ),
      [data]
    );

  const nilaiTerbesar =
    useMemo(
      () =>
        Math.max(
          ...data.map(
            (item) =>
              item.jumlah
          ),
          1
        ),
      [data]
    );

  const donutBackground =
    useMemo(() => {
      if (
        totalPenduduk === 0
      ) {
        return '#e2e8f0';
      }

      let posisiAwal = 0;

      const bagian =
        dataAktif.map(
          (item, index) => {
            const persentase =
              (
                item.jumlah /
                totalPenduduk
              ) *
              100;

            const posisiAkhir =
              posisiAwal +
              persentase;

            const warna =
              WARNA_GRAFIK[
                index %
                  WARNA_GRAFIK.length
              ];

            const gradient =
              `${warna} ${posisiAwal}% ${posisiAkhir}%`;

            posisiAwal =
              posisiAkhir;

            return gradient;
          }
        );

      return `conic-gradient(${bagian.join(
        ', '
      )})`;
    }, [
      dataAktif,
      totalPenduduk,
    ]);

  function downloadCsv() {
    const header = [
      'No',
      'Kelompok Umur',
      'Jumlah Jiwa',
      'Persentase',
      'Laki-laki',
      'Persentase Laki-laki',
      'Perempuan',
      'Persentase Perempuan',
    ];

    const rows = data.map(
      (item, index) => [
        index + 1,
        item.label,
        item.jumlah,
        formatPersentase(
          item.jumlah,
          totalPenduduk
        ),
        item.lakiLaki,
        formatPersentase(
          item.lakiLaki,
          totalPenduduk
        ),
        item.perempuan,
        formatPersentase(
          item.perempuan,
          totalPenduduk
        ),
      ]
    );

    const totalRow = [
      '',
      'Jumlah',
      totalPenduduk,
      formatPersentase(
        totalPenduduk,
        totalPenduduk
      ),
      totalLakiLaki,
      formatPersentase(
        totalLakiLaki,
        totalPenduduk
      ),
      totalPerempuan,
      formatPersentase(
        totalPerempuan,
        totalPenduduk
      ),
    ];

    const csv = [
      header,
      ...rows,
      totalRow,
    ]
      .map((row) =>
        row
          .map((value) => {
            const text =
              String(value);

            return `"${text.replace(
              /"/g,
              '""'
            )}"`;
          })
          .join(',')
      )
      .join('\n');

    const blob = new Blob(
      [
        `\uFEFF${csv}`,
      ],
      {
        type: 'text/csv;charset=utf-8;',
      }
    );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        'a'
      );

    link.href = url;

    link.download =
      `rentang-umur-desa-keji-${tahunData}.csv`;

    document.body.appendChild(
      link
    );

    link.click();
    link.remove();

    URL.revokeObjectURL(
      url
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Grafik Rentang Umur
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-500">
            Persebaran umur
            penduduk aktif Desa
            Keji tahun {tahunData}.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              setChartMode('bar')
            }
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
              chartMode === 'bar'
                ? 'bg-cyan-700 text-white shadow-md'
                : 'border border-slate-200 bg-white text-slate-500 hover:border-cyan-200 hover:text-cyan-700'
            }`}
          >
            <BarChart3
              size={15}
            />

            Grafik Batang
          </button>

          <button
            type="button"
            onClick={() =>
              setChartMode(
                'donut'
              )
            }
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
              chartMode ===
              'donut'
                ? 'bg-cyan-700 text-white shadow-md'
                : 'border border-slate-200 bg-white text-slate-500 hover:border-cyan-200 hover:text-cyan-700'
            }`}
          >
            <PieChart size={15} />

            Diagram Lingkaran
          </button>

          <button
            type="button"
            onClick={() =>
              window.print()
            }
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-amber-600"
          >
            <Printer size={15} />

            Cetak
          </button>

          <button
            type="button"
            onClick={
              downloadCsv
            }
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-emerald-800"
          >
            <Download size={15} />

            Unduh
          </button>
        </div>
      </div>

      {/* Area Grafik */}
      <div className="px-5 py-8 sm:px-6">
        {totalPenduduk === 0 ? (
          <div className="flex min-h-[320px] items-center justify-center text-center">
            <div>
              <PieChart
                size={48}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 font-extrabold text-slate-700">
                Data belum tersedia
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Admin belum
                menambahkan data
                tanggal lahir warga.
              </p>
            </div>
          </div>
        ) : chartMode ===
          'donut' ? (
          <div className="grid gap-8 xl:grid-cols-[380px_1fr] xl:items-center">
            <div className="flex items-center justify-center">
              <div
                className="relative h-[270px] w-[270px] rounded-full shadow-inner sm:h-[330px] sm:w-[330px]"
                style={{
                  background:
                    donutBackground,
                }}
              >
                <div className="absolute inset-[62px] flex flex-col items-center justify-center rounded-full bg-white shadow-lg sm:inset-[78px]">
                  <p className="text-4xl font-black text-slate-900">
                    {formatAngka(
                      totalPenduduk
                    )}
                  </p>

                  <p className="mt-1 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Total Jiwa
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {dataAktif.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={item.key}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
                  >
                    <span
                      className="h-3.5 w-3.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          WARNA_GRAFIK[
                            index %
                              WARNA_GRAFIK.length
                          ],
                      }}
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-extrabold text-slate-700">
                        {item.label}
                      </p>

                      <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                        {formatAngka(
                          item.jumlah
                        )}{' '}
                        jiwa
                      </p>
                    </div>

                    <p className="text-xs font-black text-slate-700">
                      {formatPersentase(
                        item.jumlah,
                        totalPenduduk
                      )}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {data.map(
              (
                item,
                index
              ) => {
                const lebar =
                  (
                    item.jumlah /
                    nilaiTerbesar
                  ) *
                  100;

                const jumlahLain =
                  item.jumlah -
                  item.lakiLaki -
                  item.perempuan;

                const persenLaki =
                  item.jumlah > 0
                    ? (
                        item.lakiLaki /
                        item.jumlah
                      ) *
                      100
                    : 0;

                const persenPerempuan =
                  item.jumlah > 0
                    ? (
                        item.perempuan /
                        item.jumlah
                      ) *
                      100
                    : 0;

                const persenLain =
                  item.jumlah > 0
                    ? (
                        jumlahLain /
                        item.jumlah
                      ) *
                      100
                    : 0;

                return (
                  <div
                    key={item.key}
                  >
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <p className="text-sm font-extrabold text-slate-700">
                        {item.label}
                      </p>

                      <p className="text-sm font-black text-slate-700">
                        {formatAngka(
                          item.jumlah
                        )}{' '}
                        jiwa
                      </p>
                    </div>

                    <div className="h-7 overflow-hidden rounded-lg bg-slate-100">
                      <div
                        className="flex h-full min-w-[2px] overflow-hidden rounded-lg"
                        style={{
                          width: `${lebar}%`,
                        }}
                      >
                        <div
                          className="h-full bg-emerald-700"
                          style={{
                            width: `${persenLaki}%`,
                          }}
                          title={`Laki-laki: ${item.lakiLaki}`}
                        />

                        <div
                          className="h-full bg-amber-500"
                          style={{
                            width: `${persenPerempuan}%`,
                          }}
                          title={`Perempuan: ${item.perempuan}`}
                        />

                        {jumlahLain >
                          0 && (
                          <div
                            className="h-full bg-slate-400"
                            style={{
                              width: `${persenLain}%`,
                            }}
                            title={`Belum mengisi jenis kelamin: ${jumlahLain}`}
                          />
                        )}
                      </div>
                    </div>

                    <div className="mt-1.5 flex justify-between text-[10px] font-semibold text-slate-400">
                      <span>
                        L:{' '}
                        {
                          item.lakiLaki
                        }
                      </span>

                      <span>
                        P:{' '}
                        {
                          item.perempuan
                        }
                      </span>
                    </div>
                  </div>
                );
              }
            )}

            <div className="flex flex-wrap gap-5 border-t border-slate-100 pt-5 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-emerald-700" />
                Laki-laki
              </div>

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-amber-500" />
                Perempuan
              </div>

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-slate-400" />
                Belum Diisi
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabel */}
      <div className="border-t border-slate-100 px-5 py-6 sm:px-6">
        <h2 className="text-xl font-black text-slate-900">
          Tabel Rentang Umur
        </h2>

        <p className="mt-1 text-sm font-medium text-slate-500">
          Rekap penduduk berdasarkan
          rentang umur dan jenis
          kelamin.
        </p>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-700 text-white">
                <th
                  rowSpan={2}
                  className="w-[70px] border-r border-slate-500 px-4 py-3 text-center text-xs font-extrabold uppercase"
                >
                  No
                </th>

                <th
                  rowSpan={2}
                  className="border-r border-slate-500 px-5 py-3 text-xs font-extrabold uppercase"
                >
                  Kelompok
                </th>

                <th
                  colSpan={2}
                  className="border-r border-slate-500 px-4 py-3 text-center text-xs font-extrabold uppercase"
                >
                  Jumlah
                </th>

                <th
                  colSpan={2}
                  className="border-r border-slate-500 px-4 py-3 text-center text-xs font-extrabold uppercase"
                >
                  Laki-laki
                </th>

                <th
                  colSpan={2}
                  className="px-4 py-3 text-center text-xs font-extrabold uppercase"
                >
                  Perempuan
                </th>
              </tr>

              <tr className="bg-slate-600 text-white">
                <th className="border-r border-slate-500 px-3 py-3 text-center text-xs font-bold">
                  Jiwa
                </th>

                <th className="border-r border-slate-500 px-3 py-3 text-center text-xs font-bold">
                  %
                </th>

                <th className="border-r border-slate-500 px-3 py-3 text-center text-xs font-bold">
                  Jiwa
                </th>

                <th className="border-r border-slate-500 px-3 py-3 text-center text-xs font-bold">
                  %
                </th>

                <th className="border-r border-slate-500 px-3 py-3 text-center text-xs font-bold">
                  Jiwa
                </th>

                <th className="px-3 py-3 text-center text-xs font-bold">
                  %
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {data.map(
                (
                  item,
                  index
                ) => (
                  <tr
                    key={item.key}
                    className="transition hover:bg-cyan-50/60"
                  >
                    <td className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                      {index + 1}
                    </td>

                    <td className="px-5 py-4 text-sm font-extrabold text-slate-700">
                      {item.label}
                    </td>

                    <td className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                      {formatAngka(
                        item.jumlah
                      )}
                    </td>

                    <td className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                      {formatPersentase(
                        item.jumlah,
                        totalPenduduk
                      )}
                    </td>

                    <td className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                      {formatAngka(
                        item.lakiLaki
                      )}
                    </td>

                    <td className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                      {formatPersentase(
                        item.lakiLaki,
                        totalPenduduk
                      )}
                    </td>

                    <td className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                      {formatAngka(
                        item.perempuan
                      )}
                    </td>

                    <td className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                      {formatPersentase(
                        item.perempuan,
                        totalPenduduk
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>

            <tfoot>
              <tr className="bg-slate-800 text-white">
                <td />

                <td className="px-5 py-4 text-sm font-black uppercase">
                  Jumlah
                </td>

                <td className="px-4 py-4 text-center text-sm font-black">
                  {formatAngka(
                    totalPenduduk
                  )}
                </td>

                <td className="px-4 py-4 text-center text-sm font-black">
                  {formatPersentase(
                    totalPenduduk,
                    totalPenduduk
                  )}
                </td>

                <td className="px-4 py-4 text-center text-sm font-black">
                  {formatAngka(
                    totalLakiLaki
                  )}
                </td>

                <td className="px-4 py-4 text-center text-sm font-black">
                  {formatPersentase(
                    totalLakiLaki,
                    totalPenduduk
                  )}
                </td>

                <td className="px-4 py-4 text-center text-sm font-black">
                  {formatAngka(
                    totalPerempuan
                  )}
                </td>

                <td className="px-4 py-4 text-center text-sm font-black">
                  {formatPersentase(
                    totalPerempuan,
                    totalPenduduk
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
}