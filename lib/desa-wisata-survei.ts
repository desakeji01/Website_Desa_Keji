// lib/desa-wisata-survei.ts

/* =========================================================
   OPTIONS
========================================================= */

export const ASAL_WISATAWAN_OPTIONS = [
  'Ungaran',
  'Kota Semarang',
  'Luar Kota',
  'Mancanegara',
] as const;

export const JENIS_KUNJUNGAN_OPTIONS = [
  'Individu',
  'Keluarga',
  'Rombongan sekolah',
  'Rombongan komunitas/instansi',
  'Lainnya',
] as const;

export const PAKET_WISATA_OPTIONS = [
  'Paket 1 - Sedina Nyawiji (One Day Tour)',
  'Paket 2 - Kangen Deso (Overnight)',
  'Lainnya',
] as const;

/* =========================================================
   TYPES
========================================================= */

export type AsalWisatawan =
  (typeof ASAL_WISATAWAN_OPTIONS)[number];

export type JenisKunjungan =
  (typeof JENIS_KUNJUNGAN_OPTIONS)[number];

export type PaketWisata =
  (typeof PAKET_WISATA_OPTIONS)[number];

export interface SurveiRespon {
  id: string;

  email: string;

  nama: string;

  tanggalKunjungan: string;

  asal: string;

  jenisKunjungan: string;

  jenisKunjunganLainnya:
    | string
    | null;

  kunjunganPertama: boolean;

  paketAktivitas: string;

  paketLainnya:
    | string
    | null;

  kebersihan: number;

  keramahan: number;

  fasilitas: number;

  kesesuaianEkspektasi:
    | number
    | null;

  kepuasanKeseluruhan: number;

  merekomendasikan: boolean;

  palingDisukai: string;

  saran: string;

  bolehDihubungi: boolean;

  nomorWa:
    | string
    | null;

  valid: boolean;

  createdAt: string;
}

export interface DistributionItem {
  label: string;

  count: number;

  percentage: number;
}

export interface TrendItem {
  label: string;

  value: number;

  monthIndex: number;
}

export interface DashboardSurvei {
  totalResponden: number;

  rataKepuasan: number;

  rataKebersihan: number;

  rataKeramahan: number;

  rataFasilitas: number;

  rataEkspektasi: number;

  jumlahEkspektasi: number;

  persentaseRekomendasi: number;

  trend: TrendItem[];

  paket: DistributionItem[];

  asal: DistributionItem[];

  jenis: DistributionItem[];

  proyeksi: number;

  labelProyeksi: string;

  tahunTrend: number;
}

/* =========================================================
   HELPERS
========================================================= */

function safeString(
  value: unknown
) {
  return String(
    value ?? ''
  ).trim();
}

function nullableString(
  value: unknown
) {
  const result =
    safeString(
      value
    );

  return (
    result ||
    null
  );
}

function safeNumber(
  value: unknown,
  fallback = 0
) {
  const number =
    Number(
      value
    );

  return Number.isFinite(
    number
  )
    ? number
    : fallback;
}

function safeNullableNumber(
  value: unknown
) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null;
  }

  const number =
    Number(
      value
    );

  if (
    !Number.isFinite(
      number
    )
  ) {
    return null;
  }

  return number;
}

/* =========================================================
   VALIDATORS
========================================================= */

export function isAsalWisatawan(
  value: string
): value is AsalWisatawan {
  return (
    ASAL_WISATAWAN_OPTIONS as readonly string[]
  ).includes(
    value
  );
}

export function isJenisKunjungan(
  value: string
): value is JenisKunjungan {
  return (
    JENIS_KUNJUNGAN_OPTIONS as readonly string[]
  ).includes(
    value
  );
}

export function isPaketWisata(
  value: string
): value is PaketWisata {
  return (
    PAKET_WISATA_OPTIONS as readonly string[]
  ).includes(
    value
  );
}

/* =========================================================
   NORMALIZE DATABASE ROW
========================================================= */

export function normalizeSurveiRow(
  value: unknown
): SurveiRespon | null {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(
      value
    )
  ) {
    return null;
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  const id =
    safeString(
      row.id
    );

  const email =
    safeString(
      row.email
    );

  const nama =
    safeString(
      row.nama
    );

  const tanggalKunjungan =
    safeString(
      row.tanggal_kunjungan
    );

  if (
    !id ||
    !email ||
    !nama ||
    !tanggalKunjungan
  ) {
    return null;
  }

  return {
    id,

    email,

    nama,

    tanggalKunjungan,

    asal:
      safeString(
        row.asal
      ),

    jenisKunjungan:
      safeString(
        row.jenis_kunjungan
      ),

    jenisKunjunganLainnya:
      nullableString(
        row.jenis_kunjungan_lainnya
      ),

    kunjunganPertama:
      Boolean(
        row.kunjungan_pertama
      ),

    paketAktivitas:
      safeString(
        row.paket_aktivitas
      ),

    paketLainnya:
      nullableString(
        row.paket_lainnya
      ),

    kebersihan:
      safeNumber(
        row.kebersihan
      ),

    keramahan:
      safeNumber(
        row.keramahan
      ),

    fasilitas:
      safeNumber(
        row.fasilitas
      ),

    kesesuaianEkspektasi:
      safeNullableNumber(
        row.kesesuaian_ekspektasi
      ),

    kepuasanKeseluruhan:
      safeNumber(
        row.kepuasan_keseluruhan
      ),

    merekomendasikan:
      Boolean(
        row.merekomendasikan
      ),

    palingDisukai:
      safeString(
        row.paling_disukai
      ),

    saran:
      safeString(
        row.saran
      ),

    bolehDihubungi:
      Boolean(
        row.boleh_dihubungi
      ),

    nomorWa:
      nullableString(
        row.nomor_wa
      ),

    valid:
      row.valid === null ||
      row.valid ===
        undefined
        ? true
        : Boolean(
            row.valid
          ),

    createdAt:
      safeString(
        row.created_at
      ),
  };
}

/* =========================================================
   AVERAGE
========================================================= */

function average(
  values: number[]
) {
  if (
    values.length ===
    0
  ) {
    return 0;
  }

  const total =
    values.reduce(
      (
        sum,
        value
      ) =>
        sum +
        value,
      0
    );

  return (
    total /
    values.length
  );
}

/* =========================================================
   DISTRIBUTION
========================================================= */

function buildDistribution(
  rows:
    SurveiRespon[],

  options:
    readonly string[],

  getter: (
    row: SurveiRespon
  ) => string
): DistributionItem[] {
  const total =
    rows.length;

  return options.map(
    (
      label
    ) => {
      const count =
        rows.filter(
          (
            row
          ) =>
            getter(
              row
            ) ===
            label
        ).length;

      return {
        label,

        count,

        percentage:
          total >
          0
            ? Math.round(
                (
                  count /
                  total
                ) *
                  100
              )
            : 0,
      };
    }
  );
}

/* =========================================================
   PROYEKSI TAHUNAN
========================================================= */

function calculateYearProjection({
  values,
  lastMonth,
}: {
  values:
    number[];

  lastMonth:
    number;
}) {
  if (
    values.length ===
    0
  ) {
    return 0;
  }

  /*
   * Jumlah respons aktual
   * yang sudah terkumpul.
   */

  const actualTotal =
    values.reduce(
      (
        total,
        value
      ) =>
        total +
        value,
      0
    );

  /*
   * Jika data baru tersedia
   * satu bulan, gunakan jumlah
   * bulan tersebut sebagai
   * estimasi rata-rata hingga
   * bulan Desember.
   */

  if (
    values.length ===
    1
  ) {
    const remainingMonths =
      Math.max(
        0,
        11 -
          lastMonth
      );

    return Math.max(
      actualTotal,
      Math.round(
        actualTotal +
          values[0] *
            remainingMonths
      )
    );
  }

  /*
   * Linear regression
   * sederhana berdasarkan
   * tren jumlah respons
   * per bulan.
   */

  const n =
    values.length;

  let sumX = 0;

  let sumY = 0;

  let sumXY = 0;

  let sumXX = 0;

  values.forEach(
    (
      value,
      index
    ) => {
      sumX +=
        index;

      sumY +=
        value;

      sumXY +=
        index *
        value;

      sumXX +=
        index *
        index;
    }
  );

  const denominator =
    n *
      sumXX -
    sumX *
      sumX;

  /*
   * Fallback apabila
   * regresi tidak dapat
   * dihitung.
   */

  if (
    denominator ===
    0
  ) {
    const averageMonthly =
      actualTotal /
      values.length;

    const remainingMonths =
      Math.max(
        0,
        11 -
          lastMonth
      );

    return Math.max(
      actualTotal,
      Math.round(
        actualTotal +
          averageMonthly *
            remainingMonths
      )
    );
  }

  const slope =
    (
      n *
        sumXY -
      sumX *
        sumY
    ) /
    denominator;

  const intercept =
    (
      sumY -
      slope *
        sumX
    ) /
    n;

  /*
   * Hitung jumlah bulan
   * setelah bulan terakhir
   * hingga Desember.
   *
   * Januari = 0
   * Desember = 11
   */

  const remainingMonths =
    Math.max(
      0,
      11 -
        lastMonth
    );

  let futureTotal =
    0;

  for (
    let offset = 0;
    offset <
    remainingMonths;
    offset += 1
  ) {
    const nextIndex =
      n +
      offset;

    const prediction =
      intercept +
      slope *
        nextIndex;

    /*
     * Prediksi tidak boleh
     * bernilai negatif.
     */

    futureTotal +=
      Math.max(
        0,
        prediction
      );
  }

  return Math.max(
    actualTotal,
    Math.round(
      actualTotal +
        futureTotal
    )
  );
}

/* =========================================================
   DASHBOARD CALCULATION
========================================================= */

export function hitungDashboardSurvei(
  rows:
    SurveiRespon[]
): DashboardSurvei {
  const totalResponden =
    rows.length;

  /* =======================================================
     EXPECTATION
  ======================================================= */

  const expectationValues =
    rows
      .map(
        (
          row
        ) =>
          row.kesesuaianEkspektasi
      )
      .filter(
        (
          value
        ): value is number =>
          value !==
          null
      );

  /* =======================================================
     TAHUN DATA
  ======================================================= */

  const years =
    rows
      .map(
        (
          row
        ) =>
          Number(
            row.tanggalKunjungan.slice(
              0,
              4
            )
          )
      )
      .filter(
        (
          year
        ) =>
          Number.isInteger(
            year
          ) &&
          year >
            2000
      );

  const tahunTrend =
    years.length >
    0
      ? Math.max(
          ...years
        )
      : new Date()
          .getFullYear();

  /* =======================================================
     DATA TAHUN TERBARU
  ======================================================= */

  const rowsTahun =
    rows.filter(
      (
        row
      ) =>
        Number(
          row.tanggalKunjungan.slice(
            0,
            4
          )
        ) ===
        tahunTrend
    );

  /* =======================================================
     BULAN YANG MEMILIKI DATA
  ======================================================= */

  const months =
    rowsTahun
      .map(
        (
          row
        ) =>
          Number(
            row.tanggalKunjungan.slice(
              5,
              7
            )
          ) -
          1
      )
      .filter(
        (
          month
        ) =>
          Number.isInteger(
            month
          ) &&
          month >=
            0 &&
          month <=
            11
      );

  let trend:
    TrendItem[] =
    [];

  let lastMonth =
    new Date()
      .getMonth();

  /* =======================================================
     BUILD TREND
  ======================================================= */

  if (
    months.length >
    0
  ) {
    const firstMonth =
      Math.min(
        ...months
      );

    lastMonth =
      Math.max(
        ...months
      );

    trend =
      Array.from(
        {
          length:
            lastMonth -
            firstMonth +
            1,
        },
        (
          _,
          offset
        ) => {
          const monthIndex =
            firstMonth +
            offset;

          const value =
            rowsTahun.filter(
              (
                row
              ) =>
                Number(
                  row.tanggalKunjungan.slice(
                    5,
                    7
                  )
                ) -
                  1 ===
                monthIndex
            ).length;

          const label =
            new Intl.DateTimeFormat(
              'id-ID',
              {
                month:
                  'short',

                timeZone:
                  'UTC',
              }
            ).format(
              new Date(
                Date.UTC(
                  tahunTrend,
                  monthIndex,
                  1
                )
              )
            );

          return {
            label,

            value,

            monthIndex,
          };
        }
      );
  }

  /* =======================================================
     PROYEKSI TAHUNAN
  ======================================================= */

  const labelProyeksi =
    String(
      tahunTrend
    );

  const proyeksi =
    calculateYearProjection({
      values:
        trend.map(
          (
            item
          ) =>
            item.value
        ),

      lastMonth,
    });

  /* =======================================================
     RETURN DASHBOARD
  ======================================================= */

  return {
    totalResponden,

    rataKepuasan:
      average(
        rows.map(
          (
            row
          ) =>
            row.kepuasanKeseluruhan
        )
      ),

    rataKebersihan:
      average(
        rows.map(
          (
            row
          ) =>
            row.kebersihan
        )
      ),

    rataKeramahan:
      average(
        rows.map(
          (
            row
          ) =>
            row.keramahan
        )
      ),

    rataFasilitas:
      average(
        rows.map(
          (
            row
          ) =>
            row.fasilitas
        )
      ),

    rataEkspektasi:
      average(
        expectationValues
      ),

    jumlahEkspektasi:
      expectationValues.length,

    persentaseRekomendasi:
      totalResponden >
      0
        ? Math.round(
            (
              rows.filter(
                (
                  row
                ) =>
                  row.merekomendasikan
              ).length /
              totalResponden
            ) *
              100
          )
        : 0,

    trend,

    paket:
      buildDistribution(
        rows,

        PAKET_WISATA_OPTIONS,

        (
          row
        ) =>
          row.paketAktivitas
      ),

    asal:
      buildDistribution(
        rows,

        ASAL_WISATAWAN_OPTIONS,

        (
          row
        ) =>
          row.asal
      ),

    jenis:
      buildDistribution(
        rows,

        JENIS_KUNJUNGAN_OPTIONS,

        (
          row
        ) =>
          row.jenisKunjungan
      ),

    proyeksi,

    labelProyeksi,

    tahunTrend,
  };
}