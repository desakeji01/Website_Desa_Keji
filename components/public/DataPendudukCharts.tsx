// components/public/DataPendudukCharts.tsx

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

export interface StatistikDusun {
  dusun: string;
  jumlahKk: number;
  jumlahPenduduk: number;
  lakiLaki: number;
  perempuan: number;
  belumDiisi: number;
}

interface DataPendudukChartsProps {
  tahunData: number;
  totalPenduduk: number;
  lakiLaki: number;
  perempuan: number;
  belumDiisi: number;
  statistikDusun: StatistikDusun[];
}

type ChartMode =
  | 'donut'
  | 'bar';

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

  return new Intl.NumberFormat(
    'id-ID',
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(
    (value / total) * 100
  ) + '%';
}

export default function DataPendudukCharts({
  tahunData,
  totalPenduduk,
  lakiLaki,
  perempuan,
  belumDiisi,
  statistikDusun,
}: DataPendudukChartsProps) {
  const [
    chartMode,
    setChartMode,
  ] = useState<ChartMode>(
    'donut'
  );

  const persentaseLakiLaki =
    totalPenduduk > 0
      ? (
          lakiLaki /
          totalPenduduk
        ) *
        100
      : 0;

  const persentasePerempuan =
    totalPenduduk > 0
      ? (
          perempuan /
          totalPenduduk
        ) *
        100
      : 0;

  const akhirLakiLaki =
    persentaseLakiLaki;

  const akhirPerempuan =
    persentaseLakiLaki +
    persentasePerempuan;

  const donutBackground =
    totalPenduduk > 0
      ? `conic-gradient(
          #047857 0% ${akhirLakiLaki}%,
          #f59e0b ${akhirLakiLaki}% ${akhirPerempuan}%,
          #94a3b8 ${akhirPerempuan}% 100%
        )`
      : '#e2e8f0';

  const nilaiMaksimalDusun =
    useMemo(() => {
      return Math.max(
        ...statistikDusun.map(
          (item) =>
            item.jumlahPenduduk
        ),
        1
      );
    }, [statistikDusun]);

  function downloadCsv() {
    const header = [
      'Dusun',
      'Jumlah KK',
      'Jumlah Penduduk',
      'Laki-laki',
      'Perempuan',
      'Belum Diisi',
    ];

    const rows =
      statistikDusun.map(
        (item) => [
          item.dusun,
          item.jumlahKk,
          item.jumlahPenduduk,
          item.lakiLaki,
          item.perempuan,
          item.belumDiisi,
        ]
      );

    const totalRow = [
      'Total Desa Keji',
      statistikDusun.reduce(
        (
          total,
          item
        ) =>
          total +
          item.jumlahKk,
        0
      ),
      totalPenduduk,
      lakiLaki,
      perempuan,
      belumDiisi,
    ];

    const csvContent = [
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
        `\uFEFF${csvContent}`,
      ],
      {
        type: 'text/csv;charset=utf-8;',
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement(
        'a'
      );

    link.href = url;
    link.download =
      `data-penduduk-desa-keji-${tahunData}.csv`;

    document.body.appendChild(
      link
    );

    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header Grafik */}
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Grafik Data Penduduk
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-500">
            Data penduduk aktif Desa
            Keji tahun {tahunData}.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
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
              setChartMode(
                'bar'
              )
            }
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
              chartMode ===
              'bar'
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
              window.print()
            }
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-amber-600"
          >
            <Printer size={15} />
            Cetak
          </button>

          <button
            type="button"
            onClick={downloadCsv}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-emerald-800"
          >
            <Download size={15} />
            Unduh
          </button>
        </div>
      </div>

      {/* Area Grafik */}
      <div className="px-5 py-8 sm:px-6">
        {chartMode ===
        'donut' ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:items-center">
            <div className="flex min-h-[380px] items-center justify-center">
              <div
                className="relative h-[270px] w-[270px] rounded-full shadow-inner sm:h-[320px] sm:w-[320px]"
                style={{
                  background:
                    donutBackground,
                }}
              >
                <div className="absolute inset-[62px] flex flex-col items-center justify-center rounded-full bg-white shadow-lg sm:inset-[76px]">
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

            <div className="space-y-3">
              <LegendItem
                label="Laki-laki"
                value={lakiLaki}
                percentage={formatPersentase(
                  lakiLaki,
                  totalPenduduk
                )}
                className="bg-emerald-700"
              />

              <LegendItem
                label="Perempuan"
                value={
                  perempuan
                }
                percentage={formatPersentase(
                  perempuan,
                  totalPenduduk
                )}
                className="bg-amber-500"
              />

              <LegendItem
                label="Belum Diisi"
                value={belumDiisi}
                percentage={formatPersentase(
                  belumDiisi,
                  totalPenduduk
                )}
                className="bg-slate-400"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-7 py-3">
            {statistikDusun.map(
              (item) => {
                const lebarTotal =
                  (
                    item.jumlahPenduduk /
                    nilaiMaksimalDusun
                  ) *
                  100;

                const lebarLakiLaki =
                  item.jumlahPenduduk >
                  0
                    ? (
                        item.lakiLaki /
                        item.jumlahPenduduk
                      ) *
                      100
                    : 0;

                const lebarPerempuan =
                  item.jumlahPenduduk >
                  0
                    ? (
                        item.perempuan /
                        item.jumlahPenduduk
                      ) *
                      100
                    : 0;

                const lebarBelumDiisi =
                  item.jumlahPenduduk >
                  0
                    ? (
                        item.belumDiisi /
                        item.jumlahPenduduk
                      ) *
                      100
                    : 0;

                return (
                  <div
                    key={
                      item.dusun
                    }
                  >
                    <div className="mb-2 flex items-end justify-between gap-4">
                      <div>
                        <p className="font-extrabold text-slate-800">
                          {item.dusun}
                        </p>

                        <p className="mt-1 text-xs font-medium text-slate-400">
                          {
                            item.jumlahKk
                          }{' '}
                          KK
                        </p>
                      </div>

                      <p className="text-sm font-black text-slate-700">
                        {formatAngka(
                          item.jumlahPenduduk
                        )}{' '}
                        jiwa
                      </p>
                    </div>

                    <div className="h-8 overflow-hidden rounded-lg bg-slate-100">
                      <div
                        className="flex h-full min-w-[2px] overflow-hidden rounded-lg"
                        style={{
                          width: `${lebarTotal}%`,
                        }}
                      >
                        <div
                          className="h-full bg-emerald-700"
                          style={{
                            width: `${lebarLakiLaki}%`,
                          }}
                          title={`Laki-laki: ${item.lakiLaki}`}
                        />

                        <div
                          className="h-full bg-amber-500"
                          style={{
                            width: `${lebarPerempuan}%`,
                          }}
                          title={`Perempuan: ${item.perempuan}`}
                        />

                        <div
                          className="h-full bg-slate-400"
                          style={{
                            width: `${lebarBelumDiisi}%`,
                          }}
                          title={`Belum diisi: ${item.belumDiisi}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              }
            )}

            <div className="flex flex-wrap gap-4 border-t border-slate-100 pt-5 text-xs font-bold text-slate-500">
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

      {/* Tabel Data */}
      <div className="border-t border-slate-100 px-5 py-6 sm:px-6">
        <h2 className="text-xl font-black text-slate-900">
          Tabel Data Penduduk
        </h2>

        <p className="mt-1 text-sm font-medium text-slate-500">
          Rekap penduduk berdasarkan
          dusun dan jenis kelamin.
        </p>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[760px] border-collapse text-left">
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
                  Wilayah
                </th>

                <th
                  rowSpan={2}
                  className="border-r border-slate-500 px-4 py-3 text-center text-xs font-extrabold uppercase"
                >
                  KK
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
              {statistikDusun.map(
                (
                  item,
                  index
                ) => (
                  <tr
                    key={
                      item.dusun
                    }
                    className="transition hover:bg-cyan-50/60"
                  >
                    <td className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                      {index + 1}
                    </td>

                    <td className="px-5 py-4 text-sm font-extrabold text-slate-700">
                      {item.dusun}
                    </td>

                    <td className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                      {formatAngka(
                        item.jumlahKk
                      )}
                    </td>

                    <td className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                      {formatAngka(
                        item.jumlahPenduduk
                      )}
                    </td>

                    <td className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                      {formatPersentase(
                        item.jumlahPenduduk,
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
                        item.jumlahPenduduk
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
                        item.jumlahPenduduk
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
                    statistikDusun.reduce(
                      (
                        total,
                        item
                      ) =>
                        total +
                        item.jumlahKk,
                      0
                    )
                  )}
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
                    lakiLaki
                  )}
                </td>

                <td className="px-4 py-4 text-center text-sm font-black">
                  {formatPersentase(
                    lakiLaki,
                    totalPenduduk
                  )}
                </td>

                <td className="px-4 py-4 text-center text-sm font-black">
                  {formatAngka(
                    perempuan
                  )}
                </td>

                <td className="px-4 py-4 text-center text-sm font-black">
                  {formatPersentase(
                    perempuan,
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

function LegendItem({
  label,
  value,
  percentage,
  className,
}: {
  label: string;
  value: number;
  percentage: string;
  className: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <span
        className={`h-4 w-4 shrink-0 rounded-full ${className}`}
      />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-extrabold text-slate-700">
          {label}
        </p>

        <p className="mt-1 text-xs font-medium text-slate-400">
          {formatAngka(value)} jiwa
        </p>
      </div>

      <p className="text-sm font-black text-slate-700">
        {percentage}
      </p>
    </div>
  );
}