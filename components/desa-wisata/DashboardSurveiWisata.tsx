// components/desa-wisata/DashboardSurveiWisata.tsx

import type {
  ReactNode,
} from 'react';

import type {
  DashboardSurvei,
  DistributionItem,
} from '@/lib/desa-wisata-survei';

/* =========================================================
   TYPES
========================================================= */

interface Props {
  dashboard:
    DashboardSurvei;

  showHero?:
    boolean;

  periodeTahun?:
    number;

  periodeBerjalan?:
    boolean;
}

/* =========================================================
   HELPERS
========================================================= */

function formatRating(
  value: number,
  hasData: boolean
) {
  if (!hasData) {
    return '—';
  }

  return value.toFixed(
    1
  );
}

function cleanPackageLabel(
  value: string
) {
  if (
    value.startsWith(
      'Paket 1'
    )
  ) {
    return 'Sedina Nyawiji';
  }

  if (
    value.startsWith(
      'Paket 2'
    )
  ) {
    return 'Kangen Deso';
  }

  return value;
}

/* =========================================================
   DASHBOARD
========================================================= */

export default function DashboardSurveiWisata({
  dashboard,
  showHero = true,
  periodeTahun,
  periodeBerjalan = true,
}: Props) {
  const hasData =
    dashboard.totalResponden >
    0;

  const tahunTampil =
    periodeTahun ??
    dashboard.tahunTrend;

  return (
    <div>
      {/* =====================================================
          HERO
      ===================================================== */}

      {showHero && (
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-700 px-6 pb-20 pt-8 text-white shadow-xl sm:px-8">
          {/* PATTERN */}

          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.1]"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.45) 1px, transparent 1px)',

              backgroundSize:
                '27px 27px',
            }}
          />

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[48px] border-white/[0.04]" />

          {/* CONTENT */}

          <div className="relative">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
              Desa Wisata Keji
            </p>

            <h2 className="mt-2 max-w-5xl text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">
              Lihat Bagaimana Desa
              Keji Terus Berkembang
              Bersama Wisatawan
            </h2>

            <p className="mt-4 max-w-4xl text-sm font-medium leading-7 text-emerald-50/75">
              Dashboard kepuasan dan
              kunjungan tahun{' '}
              {
                tahunTampil
              }{' '}
              diperbarui otomatis
              berdasarkan respons
              survei valid dari
              wisatawan.
            </p>
          </div>
        </section>
      )}

      {/* =====================================================
          METRIC
      ===================================================== */}

      <div
        className={
          showHero
            ? '-mt-12 relative z-10 grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7'
            : 'grid gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7'
        }
      >
        {/* TOTAL */}

        <MetricCard
          label="Total Responden"
          value={
            hasData
              ? dashboard.totalResponden.toLocaleString(
                  'id-ID'
                )
              : '—'
          }
        />

        {/* KEPUASAN */}

        <MetricCard
          label="Rata-rata Kepuasan"
          value={formatRating(
            dashboard.rataKepuasan,
            hasData
          )}
          suffix="/4"
        />

        {/* KEBERSIHAN */}

        <MetricCard
          label="Rata-rata Kebersihan"
          value={formatRating(
            dashboard.rataKebersihan,
            hasData
          )}
          suffix="/4"
        />

        {/* KERAMAHAN */}

        <MetricCard
          label="Rata-rata Keramahan"
          value={formatRating(
            dashboard.rataKeramahan,
            hasData
          )}
          suffix="/4"
        />

        {/* FASILITAS */}

        <MetricCard
          label="Rata-rata Fasilitas"
          value={formatRating(
            dashboard.rataFasilitas,
            hasData
          )}
          suffix="/4"
        />

        {/* EXPECTATION */}

        <MetricCard
          label="Kesesuaian Ekspektasi"
          value={formatRating(
            dashboard.rataEkspektasi,

            dashboard.jumlahEkspektasi >
              0
          )}
          suffix="/4"
        />

        {/* REKOMENDASI */}

        <MetricCard
          label="Akan Merekomendasikan"
          value={
            hasData
              ? String(
                  dashboard.persentaseRekomendasi
                )
              : '—'
          }
          suffix="%"
        />
      </div>

      {/* =====================================================
          TREND KUNJUNGAN
      ===================================================== */}

      <section className="mt-7 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <SectionTitle>
          Tren Kunjungan Wisatawan
        </SectionTitle>

        <p className="mt-2 text-xs font-medium leading-5 text-slate-400">
          Jumlah respons berdasarkan
          tanggal kunjungan pada
          tahun{' '}
          <strong className="font-extrabold text-slate-500">
            {
              tahunTampil
            }
          </strong>
          .
        </p>

        <div className="mt-6">
          <TrendChart
            data={
              dashboard.trend
            }
          />
        </div>
      </section>

      {/* =====================================================
          PROYEKSI / RINGKASAN TAHUNAN
      ===================================================== */}

      <section className="relative mt-7 overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 px-6 py-7 text-white shadow-sm sm:px-8">
        {/* ORNAMEN */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',

            backgroundSize:
              '24px 24px',
          }}
        />

        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border-[38px] border-white/[0.04]" />

        {/* CONTENT */}

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <SectionTitle
              light
            >
              {periodeBerjalan
                ? 'Proyeksi Kunjungan'
                : `Ringkasan Tahun ${tahunTampil}`}
            </SectionTitle>

            <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-emerald-50/75">
              {periodeBerjalan ? (
                <>
                  Estimasi total respons
                  kunjungan hingga akhir{' '}
                  <strong className="font-extrabold text-white">
                    tahun{' '}
                    {
                      tahunTampil
                    }
                  </strong>
                  , berdasarkan tren data
                  kunjungan yang telah
                  terkumpul.
                </>
              ) : (
                <>
                  Total respons survei valid
                  yang tercatat berdasarkan
                  tanggal kunjungan pada tahun{' '}
                  <strong className="font-extrabold text-white">
                    {
                      tahunTampil
                    }
                  </strong>
                  .
                </>
              )}
            </p>
          </div>

          {/* NUMBER */}

          <div className="shrink-0 sm:min-w-[180px] sm:text-right">
            <p className="text-4xl font-black tracking-tight text-amber-300 sm:text-5xl">
              {hasData
                ? (periodeBerjalan
                    ? dashboard.proyeksi
                    : dashboard.totalResponden
                  ).toLocaleString(
                    'id-ID'
                  )
                : '—'}
            </p>

            <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-200">
              {periodeBerjalan
                ? 'Estimasi Respons Tahunan'
                : 'Respons Valid'}
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          DISTRIBUTIONS
      ===================================================== */}

      <div className="mt-7 grid gap-6 xl:grid-cols-3">
        {/* PAKET */}

        <DistributionCard
          title="Paket Terpopuler"
          data={
            dashboard.paket
          }
          variant="amber"
          formatLabel={
            cleanPackageLabel
          }
        />

        {/* ASAL */}

        <OriginCard
          data={
            dashboard.asal
          }
        />

        {/* JENIS */}

        <DistributionCard
          title="Jenis Kunjungan"
          data={
            dashboard.jenis
          }
          variant="emerald"
        />
      </div>
    </div>
  );
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  label,
  value,
  suffix,
}: {
  label:
    string;

  value:
    string;

  suffix?:
    string;
}) {
  return (
    <article className="min-h-[108px] rounded-2xl border border-emerald-100 bg-white p-5 shadow-lg shadow-slate-900/[0.05]">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.07em] text-slate-500">
        {
          label
        }
      </p>

      <p className="mt-4 text-2xl font-black text-emerald-950">
        {
          value
        }

        {suffix && (
          <span className="ml-1 text-sm font-medium text-slate-400">
            {
              suffix
            }
          </span>
        )}
      </p>
    </article>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  children,
  light = false,
}: {
  children:
    ReactNode;

  light?:
    boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`h-5 w-1 rounded-full ${
          light
            ? 'bg-emerald-400'
            : 'bg-emerald-700'
        }`}
      />

      <h3
        className={`font-black ${
          light
            ? 'text-white'
            : 'text-slate-900'
        }`}
      >
        {
          children
        }
      </h3>
    </div>
  );
}

/* =========================================================
   TREND CHART
========================================================= */

function TrendChart({
  data,
}: {
  data: {
    label:
      string;

    value:
      number;
  }[];
}) {
  /* =======================================================
     EMPTY
  ======================================================= */

  if (
    data.length ===
    0
  ) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-2xl bg-slate-50">
        <p className="text-sm font-semibold text-slate-400">
          Data tren belum
          tersedia.
        </p>
      </div>
    );
  }

  /* =======================================================
     CHART CONFIG
  ======================================================= */

  const width =
    1000;

  const height =
    280;

  const left =
    48;

  const right =
    20;

  const top =
    30;

  const bottom =
    48;

  const chartWidth =
    width -
    left -
    right;

  const chartHeight =
    height -
    top -
    bottom;

  /* =======================================================
     MAX VALUE
  ======================================================= */

  const maxValue =
    Math.max(
      5,

      ...data.map(
        (
          item
        ) =>
          item.value
      )
    );

  const roundedMax =
    Math.ceil(
      maxValue /
        5
    ) *
    5;

  /* =======================================================
     POINTS
  ======================================================= */

  const points =
    data.map(
      (
        item,
        index
      ) => {
        const x =
          data.length ===
          1
            ? left +
              chartWidth /
                2
            : left +
              (
                index /
                (
                  data.length -
                  1
                )
              ) *
                chartWidth;

        const y =
          top +
          chartHeight -
          (
            item.value /
            roundedMax
          ) *
            chartHeight;

        return {
          ...item,

          x,

          y,
        };
      }
    );

  const linePoints =
    points
      .map(
        (
          point
        ) =>
          `${point.x},${point.y}`
      )
      .join(
        ' '
      );

  const bottomY =
    top +
    chartHeight;

  const areaPoints =
    points.length >
    0
      ? `${points[0].x},${bottomY} ${linePoints} ${
          points[
            points.length -
              1
          ].x
        },${bottomY}`
      : '';

  /* =======================================================
     GRID
  ======================================================= */

  const gridValues =
    Array.from(
      {
        length:
          5,
      },
      (
        _,
        index
      ) =>
        (
          roundedMax /
          4
        ) *
        index
    );

  /* =======================================================
     SVG
  ======================================================= */

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Grafik tren kunjungan wisatawan"
      className="h-auto w-full overflow-visible"
    >
      {/* GRID */}

      {gridValues.map(
        (
          value,
          index
        ) => {
          const y =
            top +
            chartHeight -
            (
              value /
              roundedMax
            ) *
              chartHeight;

          return (
            <g
              key={
                index
              }
            >
              <line
                x1={
                  left
                }
                y1={
                  y
                }
                x2={
                  width -
                  right
                }
                y2={
                  y
                }
                stroke="#e7e5db"
                strokeWidth="1"
              />

              <text
                x={
                  left -
                  10
                }
                y={
                  y +
                  4
                }
                textAnchor="end"
                fontSize="11"
                fill="#94a3a8"
              >
                {Math.round(
                  value
                )}
              </text>
            </g>
          );
        }
      )}

      {/* AREA */}

      <polygon
        points={
          areaPoints
        }
        fill="#dcebe5"
        opacity="0.75"
      />

      {/* LINE */}

      {data.length >
      1 ? (
        <polyline
          points={
            linePoints
          }
          fill="none"
          stroke="#13725c"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}

      {/* POINTS */}

      {points.map(
        (
          point,
          index
        ) => (
          <g
            key={`${point.label}-${index}`}
          >
            <circle
              cx={
                point.x
              }
              cy={
                point.y
              }
              r="5.5"
              fill="#13725c"
            />

            {/* VALUE */}

            <text
              x={
                point.x
              }
              y={
                point.y -
                13
              }
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#145c4b"
            >
              {
                point.value
              }
            </text>

            {/* MONTH */}

            <text
              x={
                point.x
              }
              y={
                height -
                13
              }
              textAnchor="middle"
              fontSize="11"
              fill="#94a3a8"
            >
              {
                point.label
              }
            </text>
          </g>
        )
      )}
    </svg>
  );
}

/* =========================================================
   DISTRIBUTION CARD
========================================================= */

function DistributionCard({
  title,
  data,
  variant,
  formatLabel,
}: {
  title:
    string;

  data:
    DistributionItem[];

  variant:
    | 'emerald'
    | 'amber';

  formatLabel?: (
    value: string
  ) => string;
}) {
  const barClass =
    variant ===
    'amber'
      ? 'bg-amber-500'
      : 'bg-emerald-700';

  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <SectionTitle>
        {
          title
        }
      </SectionTitle>

      <div className="mt-7 space-y-5">
        {data.map(
          (
            item
          ) => (
            <div
              key={
                item.label
              }
            >
              {/* LABEL */}

              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-xs font-semibold leading-5 text-slate-500">
                  {formatLabel
                    ? formatLabel(
                        item.label
                      )
                    : item.label}
                </span>

                <span className="shrink-0 text-xs font-black text-slate-700">
                  {
                    item.percentage
                  }
                  %
                </span>
              </div>

              {/* BAR */}

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${barClass}`}
                  style={{
                    width:
                      `${item.percentage}%`,
                  }}
                />
              </div>
            </div>
          )
        )}
      </div>
    </article>
  );
}

/* =========================================================
   ORIGIN CARD
========================================================= */

function OriginCard({
  data,
}: {
  data:
    DistributionItem[];
}) {
  const colors = [
    '#0f5f4a',
    '#2aa17d',
    '#d39c34',
    '#87531f',
  ];

  /* =======================================================
     HAS DATA
  ======================================================= */

  const hasData =
    data.some(
      (
        item
      ) =>
        item.count >
        0
    );

  /* =======================================================
     BUILD PIE
  ======================================================= */

  let cursor =
    0;

  const gradientParts =
    data.map(
      (
        item,
        index
      ) => {
        const start =
          cursor;

        const end =
          index ===
          data.length -
            1
            ? 100
            : Math.min(
                100,

                cursor +
                  item.percentage
              );

        cursor =
          end;

        return `${colors[index]} ${start}% ${end}%`;
      }
    );

  const background =
    hasData
      ? `conic-gradient(${gradientParts.join(
          ', '
        )})`
      : '#e2e8f0';

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <SectionTitle>
        Asal Wisatawan
      </SectionTitle>

      {/* PIE */}

      <div className="mt-6 flex justify-center">
        <div
          className="relative h-48 w-48 rounded-full"
          style={{
            background,
          }}
        >
          <div className="absolute inset-[35px] flex items-center justify-center rounded-full bg-white">
            <span className="text-center text-xs font-extrabold leading-5 text-slate-500">
              Asal
              <br />
              Wisatawan
            </span>
          </div>
        </div>
      </div>

      {/* LEGEND */}

      <div className="mt-6 space-y-2.5">
        {data.map(
          (
            item,
            index
          ) => (
            <div
              key={
                item.label
              }
              className="flex items-center gap-3"
            >
              <span
                className="h-3 w-3 shrink-0 rounded"
                style={{
                  backgroundColor:
                    colors[
                      index
                    ],
                }}
              />

              <span className="min-w-0 flex-1 text-xs font-medium text-slate-600">
                {
                  item.label
                }
              </span>

              <span className="text-xs font-black text-slate-700">
                {
                  item.percentage
                }
                %
              </span>
            </div>
          )
        )}
      </div>
    </article>
  );
}