// components/public/JenisKelaminCharts.tsx

'use client';

import {
  useMemo,
  useState,
} from 'react';

import {
  BarChart3,
  CircleHelp,
  Download,
  Mars,
  PieChart,
  Printer,
  Venus,
} from 'lucide-react';

export interface StatistikDusunJenisKelamin {
  dusun: string;
  total: number;
  lakiLaki: number;
  perempuan: number;
  belumMengisi: number;
}

interface JenisKelaminChartsProps {
  tahunData: number;
  totalPenduduk: number;
  lakiLaki: number;
  perempuan: number;
  belumMengisi: number;
  statistikDusun: StatistikDusunJenisKelamin[];
}

type ChartMode =
  | 'donut'
  | 'bar';

const WARNA_LAKI_LAKI =
  '#0284c7';

const WARNA_PEREMPUAN =
  '#ec4899';

const WARNA_BELUM_MENGISI =
  '#94a3b8';

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

export default function JenisKelaminCharts({
  tahunData,
  totalPenduduk,
  lakiLaki,
  perempuan,
  belumMengisi,
  statistikDusun,
}: JenisKelaminChartsProps) {
  const [
    chartMode,
    setChartMode,
  ] = useState<ChartMode>(
    'donut'
  );

  const nilaiTerbesarDusun =
    useMemo(() => {
      return Math.max(
        ...statistikDusun.map(
          (item) =>
            item.total
        ),
        1
      );
    }, [statistikDusun]);

  const donutBackground =
    useMemo(() => {
      if (totalPenduduk === 0) {
        return '#e2e8f0';
      }

      const persenLakiLaki =
        (
          lakiLaki /
          totalPenduduk
        ) *
        100;

      const persenPerempuan =
        (
          perempuan /
          totalPenduduk
        ) *
        100;

      const batasPerempuan =
        persenLakiLaki +
        persenPerempuan;

      return `conic-gradient(
        ${WARNA_LAKI_LAKI}
          0%
          ${persenLakiLaki}%,
        ${WARNA_PEREMPUAN}
          ${persenLakiLaki}%
          ${batasPerempuan}%,
        ${WARNA_BELUM_MENGISI}
          ${batasPerempuan}%
          100%
      )`;
    }, [
      totalPenduduk,
      lakiLaki,
      perempuan,
    ]);

  function downloadCsv() {
    const ringkasan = [
      [
        'Kelompok',
        'Jumlah Jiwa',
        'Persentase',
      ],
      [
        'Laki-laki',
        lakiLaki,
        formatPersentase(
          lakiLaki,
          totalPenduduk
        ),
      ],
      [
        'Perempuan',
        perempuan,
        formatPersentase(
          perempuan,
          totalPenduduk
        ),
      ],
      [
        'Belum Mengisi',
        belumMengisi,
        formatPersentase(
          belumMengisi,
          totalPenduduk
        ),
      ],
      [
        'Total',
        totalPenduduk,
        formatPersentase(
          totalPenduduk,
          totalPenduduk
        ),
      ],
    ];

    const perDusun = [
      [],
      [
        'Dusun',
        'Total Penduduk',
        'Laki-laki',
        'Perempuan',
        'Belum Mengisi',
        'Persentase Laki-laki',
        'Persentase Perempuan',
      ],
      ...statistikDusun.map(
        (item) => [
          item.dusun,
          item.total,
          item.lakiLaki,
          item.perempuan,
          item.belumMengisi,
          formatPersentase(
            item.lakiLaki,
            item.total
          ),
          formatPersentase(
            item.perempuan,
            item.total
          ),
        ]
      ),
    ];

    const csvContent = [
      ...ringkasan,
      ...perDusun,
    ]
      .map((row) =>
        row
          .map((value) => {
            const text =
              String(
                value ?? ''
              );

            return `"${text.replace(
              /"/g,
              '""'
            )}"`;
          })
          .join(',')
      )
      .join('\n');

    const blob =
      new Blob(
        [
          `\uFEFF${csvContent}`,
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
      `jenis-kelamin-desa-keji-${tahunData}.csv`;

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
      {/* Header Grafik */}
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Grafik Jenis Kelamin
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-500">
            Komposisi penduduk aktif
            Desa Keji tahun{' '}
            {tahunData}.
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
            <BarChart3 size={15} />
            Grafik Batang
          </button>

          <button
            type="button"
            onClick={() =>
              window.print()
            }
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-amber-600"
          >
            <Printer size={15} />
            Cetak
          </button>

          <button
            type="button"
            onClick={downloadCsv}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-emerald-800"
          >
            <Download size={15} />
            Unduh
          </button>
        </div>
      </div>

      {/* Area Grafik */}
      <div className="px-5 py-8 sm:px-6">
        {totalPenduduk === 0 ? (
          <div className="flex min-h-[360px] items-center justify-center text-center">
            <div>
              <PieChart
                size={50}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 font-extrabold text-slate-700">
                Data belum tersedia
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Belum ada data warga
                aktif yang dapat
                ditampilkan.
              </p>
            </div>
          </div>
        ) : chartMode ===
          'donut' ? (
          <div className="grid gap-10 xl:grid-cols-[390px_1fr] xl:items-center">
            {/* Donut */}
            <div className="flex items-center justify-center">
              <div
                className="relative h-[270px] w-[270px] rounded-full shadow-inner sm:h-[340px] sm:w-[340px]"
                style={{
                  background:
                    donutBackground,
                }}
              >
                <div className="absolute inset-[62px] flex flex-col items-center justify-center rounded-full bg-white shadow-lg sm:inset-[82px]">
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

            {/* Legenda */}
            <div className="space-y-3">
              <LegendItem
                icon={Mars}
                label="Laki-laki"
                value={lakiLaki}
                percentage={formatPersentase(
                  lakiLaki,
                  totalPenduduk
                )}
                backgroundColor={
                  WARNA_LAKI_LAKI
                }
              />

              <LegendItem
                icon={Venus}
                label="Perempuan"
                value={perempuan}
                percentage={formatPersentase(
                  perempuan,
                  totalPenduduk
                )}
                backgroundColor={
                  WARNA_PEREMPUAN
                }
              />

              <LegendItem
                icon={CircleHelp}
                label="Belum Mengisi"
                value={belumMengisi}
                percentage={formatPersentase(
                  belumMengisi,
                  totalPenduduk
                )}
                backgroundColor={
                  WARNA_BELUM_MENGISI
                }
              />
            </div>
          </div>
        ) : (
          /* Grafik Batang Per Dusun */
          <div className="space-y-7 py-3">
            {statistikDusun.map(
              (item) => {
                const lebarTotal =
                  (
                    item.total /
                    nilaiTerbesarDusun
                  ) *
                  100;

                const persenLakiLaki =
                  item.total > 0
                    ? (
                        item.lakiLaki /
                        item.total
                      ) *
                      100
                    : 0;

                const persenPerempuan =
                  item.total > 0
                    ? (
                        item.perempuan /
                        item.total
                      ) *
                      100
                    : 0;

                const persenBelumMengisi =
                  item.total > 0
                    ? (
                        item.belumMengisi /
                        item.total
                      ) *
                      100
                    : 0;

                return (
                  <div
                    key={item.dusun}
                  >
                    <div className="mb-2 flex items-end justify-between gap-4">
                      <div>
                        <p className="font-extrabold text-slate-800">
                          {item.dusun}
                        </p>

                        <p className="mt-1 text-xs font-medium text-slate-400">
                          Laki-laki:{' '}
                          {formatAngka(
                            item.lakiLaki
                          )}
                          {' · '}
                          Perempuan:{' '}
                          {formatAngka(
                            item.perempuan
                          )}
                        </p>
                      </div>

                      <p className="text-sm font-black text-slate-700">
                        {formatAngka(
                          item.total
                        )}{' '}
                        jiwa
                      </p>
                    </div>

                    <div className="h-9 overflow-hidden rounded-xl bg-slate-100">
                      {item.total > 0 ? (
                        <div
                          className="flex h-full min-w-[3px] overflow-hidden rounded-xl"
                          style={{
                            width: `${lebarTotal}%`,
                          }}
                        >
                          <div
                            className="h-full"
                            style={{
                              width: `${persenLakiLaki}%`,
                              backgroundColor:
                                WARNA_LAKI_LAKI,
                            }}
                            title={`Laki-laki: ${item.lakiLaki}`}
                          />

                          <div
                            className="h-full"
                            style={{
                              width: `${persenPerempuan}%`,
                              backgroundColor:
                                WARNA_PEREMPUAN,
                            }}
                            title={`Perempuan: ${item.perempuan}`}
                          />

                          <div
                            className="h-full"
                            style={{
                              width: `${persenBelumMengisi}%`,
                              backgroundColor:
                                WARNA_BELUM_MENGISI,
                            }}
                            title={`Belum mengisi: ${item.belumMengisi}`}
                          />
                        </div>
                      ) : (
                        <div className="flex h-full items-center px-3 text-xs font-bold text-slate-400">
                          Belum ada data
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            )}

            <div className="flex flex-wrap gap-5 border-t border-slate-100 pt-5 text-xs font-bold text-slate-500">
              <GrafikLegend
                label="Laki-laki"
                backgroundColor={
                  WARNA_LAKI_LAKI
                }
              />

              <GrafikLegend
                label="Perempuan"
                backgroundColor={
                  WARNA_PEREMPUAN
                }
              />

              <GrafikLegend
                label="Belum Mengisi"
                backgroundColor={
                  WARNA_BELUM_MENGISI
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Tabel Ringkasan */}
      <div className="border-t border-slate-100 px-5 py-6 sm:px-6">
        <h2 className="text-xl font-black text-slate-900">
          Tabel Jenis Kelamin
        </h2>

        <p className="mt-1 text-sm font-medium text-slate-500">
          Rekap keseluruhan penduduk
          berdasarkan jenis kelamin.
        </p>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[580px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-700 text-white">
                <th className="w-[70px] border-r border-slate-500 px-4 py-4 text-center text-xs font-extrabold uppercase">
                  No
                </th>

                <th className="border-r border-slate-500 px-5 py-4 text-xs font-extrabold uppercase">
                  Kelompok
                </th>

                <th className="border-r border-slate-500 px-4 py-4 text-center text-xs font-extrabold uppercase">
                  Jumlah Jiwa
                </th>

                <th className="px-4 py-4 text-center text-xs font-extrabold uppercase">
                  Persentase
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              <SummaryRow
                number={1}
                label="Laki-laki"
                value={lakiLaki}
                percentage={formatPersentase(
                  lakiLaki,
                  totalPenduduk
                )}
              />

              <SummaryRow
                number={2}
                label="Perempuan"
                value={perempuan}
                percentage={formatPersentase(
                  perempuan,
                  totalPenduduk
                )}
              />

              <SummaryRow
                number={3}
                label="Belum Mengisi"
                value={belumMengisi}
                percentage={formatPersentase(
                  belumMengisi,
                  totalPenduduk
                )}
              />
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
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Tabel Per Dusun */}
      <div className="border-t border-slate-100 px-5 py-6 sm:px-6">
        <h2 className="text-xl font-black text-slate-900">
          Jenis Kelamin per Dusun
        </h2>

        <p className="mt-1 text-sm font-medium text-slate-500">
          Perbandingan jumlah
          laki-laki dan perempuan
          pada setiap dusun.
        </p>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-700 text-white">
                <th className="w-[70px] border-r border-slate-500 px-4 py-4 text-center text-xs font-extrabold uppercase">
                  No
                </th>

                <th className="border-r border-slate-500 px-5 py-4 text-xs font-extrabold uppercase">
                  Dusun
                </th>

                <th className="border-r border-slate-500 px-4 py-4 text-center text-xs font-extrabold uppercase">
                  Total
                </th>

                <th className="border-r border-slate-500 px-4 py-4 text-center text-xs font-extrabold uppercase">
                  Laki-laki
                </th>

                <th className="border-r border-slate-500 px-4 py-4 text-center text-xs font-extrabold uppercase">
                  Perempuan
                </th>

                <th className="border-r border-slate-500 px-4 py-4 text-center text-xs font-extrabold uppercase">
                  Belum Diisi
                </th>

                <th className="px-4 py-4 text-center text-xs font-extrabold uppercase">
                  Rasio L : P
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
                    key={item.dusun}
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
                        item.total
                      )}
                    </td>

                    <td className="px-4 py-4 text-center text-sm font-semibold text-sky-700">
                      {formatAngka(
                        item.lakiLaki
                      )}
                    </td>

                    <td className="px-4 py-4 text-center text-sm font-semibold text-pink-700">
                      {formatAngka(
                        item.perempuan
                      )}
                    </td>

                    <td className="px-4 py-4 text-center text-sm font-semibold text-slate-500">
                      {formatAngka(
                        item.belumMengisi
                      )}
                    </td>

                    <td className="px-4 py-4 text-center text-sm font-bold text-slate-700">
                      {item.perempuan > 0
                        ? `${new Intl.NumberFormat(
                            'id-ID',
                            {
                              maximumFractionDigits: 2,
                            }
                          ).format(
                            item.lakiLaki /
                              item.perempuan
                          )} : 1`
                        : item.lakiLaki > 0
                          ? `${item.lakiLaki} : 0`
                          : '0 : 0'}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function LegendItem({
  icon: Icon,
  label,
  value,
  percentage,
  backgroundColor,
}: {
  icon: typeof Mars;
  label: string;
  value: number;
  percentage: string;
  backgroundColor: string;
}) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
        style={{
          backgroundColor,
        }}
      >
        <Icon size={21} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-extrabold text-slate-700">
          {label}
        </p>

        <p className="mt-1 text-xs font-medium text-slate-400">
          {formatAngka(value)} jiwa
        </p>
      </div>

      <p className="text-sm font-black text-slate-700">
        {percentage}
      </p>
    </article>
  );
}

function GrafikLegend({
  label,
  backgroundColor,
}: {
  label: string;
  backgroundColor: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-3 w-3 rounded-sm"
        style={{
          backgroundColor,
        }}
      />

      {label}
    </div>
  );
}

function SummaryRow({
  number,
  label,
  value,
  percentage,
}: {
  number: number;
  label: string;
  value: number;
  percentage: string;
}) {
  return (
    <tr className="transition hover:bg-cyan-50/60">
      <td className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
        {number}
      </td>

      <td className="px-5 py-4 text-sm font-extrabold text-slate-700">
        {label}
      </td>

      <td className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
        {formatAngka(value)}
      </td>

      <td className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
        {percentage}
      </td>
    </tr>
  );
}