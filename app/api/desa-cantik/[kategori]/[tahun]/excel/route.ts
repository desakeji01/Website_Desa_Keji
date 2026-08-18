// app/api/desa-cantik/[kategori]/[tahun]/excel/route.ts

import ExcelJS from 'exceljs';

import {
  getKategoriDesaCantik,
  isKategoriDesaCantik,
  isTahunDesaCantik,
} from '@/lib/desa-cantik';

import {
  getDesaCantikDataset,
} from '@/lib/desa-cantik-db';

import type {
  KategoriDesaCantik,
  TahunDesaCantik,
} from '@/types/desa-cantik';

export const runtime =
  'nodejs';

export const dynamic =
  'force-dynamic';

/* =========================================================
   TYPES
========================================================= */

interface RouteContext {
  params: Promise<{
    kategori: string;
    tahun: string;
  }>;
}

interface GenericColumn {
  key: string;
  label: string;
}

interface GenericDataRow {
  label?: string;
  rw?: string;

  nilai?: Record<
    string,
    number
  >;
}

interface GenericTable {
  id?: string;

  nomor?: string;

  judul?: string;

  kelompok?: string;

  labelBaris?: string;

  satuan?: string;

  kolom?: GenericColumn[];

  baris?: GenericDataRow[];

  jumlah?: Record<
    string,
    number
  >;

  catatan?: string;
}

interface PendudukValue {
  lakiLaki: number;

  perempuan: number;

  jumlah: number;
}

interface PendudukRow {
  kelompokUmur: string;

  rw01: PendudukValue;

  rw02: PendudukValue;

  rw03: PendudukValue;

  total: PendudukValue;
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

function isObject(
  value: unknown
): value is Record<
  string,
  unknown
> {
  return (
    Boolean(value) &&
    typeof value ===
      'object' &&
    !Array.isArray(value)
  );
}

/* =========================================================
   SHEET NAME
========================================================= */

function sanitizeSheetName(
  value: string
) {
  const cleaned =
    value
      .replace(
        /[\\/*?:[\]]/g,
        '-'
      )
      .trim();

  return (
    cleaned.slice(
      0,
      31
    ) ||
    'Data'
  );
}

function uniqueSheetName(
  workbook:
    ExcelJS.Workbook,

  value:
    string
) {
  const base =
    sanitizeSheetName(
      value
    );

  let name =
    base;

  let counter =
    2;

  while (
    workbook.getWorksheet(
      name
    )
  ) {
    const suffix =
      `-${counter}`;

    const availableLength =
      Math.max(
        1,
        31 -
          suffix.length
      );

    name =
      sanitizeSheetName(
        `${base.slice(
          0,
          availableLength
        )}${suffix}`
      );

    counter +=
      1;
  }

  return name;
}

/* =========================================================
   STYLE
========================================================= */

function applyHeaderStyle(
  row:
    ExcelJS.Row
) {
  row.height =
    24;

  row.eachCell(
    (cell) => {
      cell.font = {
        bold: true,

        color: {
          argb:
            'FFFFFFFF',
        },
      };

      cell.fill = {
        type:
          'pattern',

        pattern:
          'solid',

        fgColor: {
          argb:
            'FF047857',
        },
      };

      cell.alignment = {
        vertical:
          'middle',

        horizontal:
          'center',

        wrapText:
          true,
      };

      cell.border = {
        top: {
          style:
            'thin',

          color: {
            argb:
              'FFD1FAE5',
          },
        },

        left: {
          style:
            'thin',

          color: {
            argb:
              'FFD1FAE5',
          },
        },

        bottom: {
          style:
            'thin',

          color: {
            argb:
              'FFD1FAE5',
          },
        },

        right: {
          style:
            'thin',

          color: {
            argb:
              'FFD1FAE5',
          },
        },
      };
    }
  );
}

function applyTotalStyle(
  row:
    ExcelJS.Row
) {
  row.eachCell(
    (cell) => {
      cell.font = {
        bold:
          true,

        color: {
          argb:
            'FFFFFFFF',
        },
      };

      cell.fill = {
        type:
          'pattern',

        pattern:
          'solid',

        fgColor: {
          argb:
            'FF065F46',
        },
      };

      cell.alignment = {
        vertical:
          'middle',

        horizontal:
          'center',

        wrapText:
          true,
      };

      cell.border = {
        top: {
          style:
            'thin',

          color: {
            argb:
              'FFD1FAE5',
          },
        },

        left: {
          style:
            'thin',

          color: {
            argb:
              'FFD1FAE5',
          },
        },

        bottom: {
          style:
            'thin',

          color: {
            argb:
              'FFD1FAE5',
          },
        },

        right: {
          style:
            'thin',

          color: {
            argb:
              'FFD1FAE5',
          },
        },
      };
    }
  );
}

/* =========================================================
   AUTO SIZE COLUMN
========================================================= */

function autoSizeColumns(
  worksheet:
    ExcelJS.Worksheet
) {
  worksheet.columns.forEach(
    (column) => {
      let maximum =
        10;

      /*
       * ExcelJS mendefinisikan
       * eachCell sebagai optional
       * pada Column.
       *
       * Karena itu gunakan optional
       * chaining agar TypeScript
       * tidak menghasilkan:
       *
       * Cannot invoke an object which
       * is possibly 'undefined'.
       */
      column.eachCell?.(
        {
          includeEmpty:
            true,
        },
        (cell) => {
          const value =
            cell.value;

          let text =
            '';

          if (
            value === null ||
            value === undefined
          ) {
            text =
              '';
          } else if (
            typeof value ===
            'object'
          ) {
            try {
              text =
                JSON.stringify(
                  value
                );
            } catch {
              text =
                safeString(
                  value
                );
            }
          } else {
            text =
              safeString(
                value
              );
          }

          maximum =
            Math.max(
              maximum,
              text.length
            );
        }
      );

      column.width =
        Math.min(
          Math.max(
            maximum +
              2,
            12
          ),
          42
        );
    }
  );
}

/* =========================================================
   METADATA SHEET
========================================================= */

function addMetadataSheet({
  workbook,
  kategori,
  tahun,
  sumber,
}: {
  workbook:
    ExcelJS.Workbook;

  kategori:
    string;

  tahun:
    number;

  sumber:
    string;
}) {
  const worksheet =
    workbook.addWorksheet(
      'Informasi'
    );

  worksheet.addRow([
    'INFORMASI DATA DESA CANTIK',
  ]);

  worksheet.mergeCells(
    'A1:B1'
  );

  const titleCell =
    worksheet.getCell(
      'A1'
    );

  titleCell.font = {
    bold:
      true,

    size:
      16,

    color: {
      argb:
        'FFFFFFFF',
    },
  };

  titleCell.fill = {
    type:
      'pattern',

    pattern:
      'solid',

    fgColor: {
      argb:
        'FF065F46',
    },
  };

  titleCell.alignment = {
    vertical:
      'middle',

    horizontal:
      'center',

    wrapText:
      true,
  };

  worksheet.getRow(
    1
  ).height =
    30;

  worksheet.addRow(
    []
  );

  worksheet.addRow([
    'Desa',
    'Desa Keji',
  ]);

  worksheet.addRow([
    'Kecamatan',
    'Ungaran Barat',
  ]);

  worksheet.addRow([
    'Kabupaten',
    'Semarang',
  ]);

  worksheet.addRow([
    'Kategori',
    kategori,
  ]);

  worksheet.addRow([
    'Tahun',
    tahun,
  ]);

  worksheet.addRow([
    'Sumber',
    sumber,
  ]);

  worksheet.addRow([
    'Sistem',
    'SIJI - Sistem Informasi Desa Keji',
  ]);

  worksheet.getColumn(
    1
  ).width =
    23;

  worksheet.getColumn(
    2
  ).width =
    70;

  for (
    let rowIndex =
      3;
    rowIndex <=
    9;
    rowIndex +=
      1
  ) {
    const labelCell =
      worksheet.getCell(
        rowIndex,
        1
      );

    labelCell.font = {
      bold:
        true,

      color: {
        argb:
          'FF065F46',
      },
    };

    labelCell.fill = {
      type:
        'pattern',

      pattern:
        'solid',

      fgColor: {
        argb:
          'FFD1FAE5',
      },
    };

    labelCell.alignment = {
      vertical:
        'middle',
    };

    const valueCell =
      worksheet.getCell(
        rowIndex,
        2
      );

    valueCell.alignment = {
      vertical:
        'middle',

      wrapText:
        true,
    };
  }
}

/* =========================================================
   CHECK PENDUDUK
========================================================= */

function isPendudukValue(
  value: unknown
): value is PendudukValue {
  if (
    !isObject(value)
  ) {
    return false;
  }

  return (
    typeof value.lakiLaki ===
      'number' &&
    typeof value.perempuan ===
      'number' &&
    typeof value.jumlah ===
      'number'
  );
}

function isPendudukData(
  data: unknown[]
): data is PendudukRow[] {
  if (
    data.length ===
    0
  ) {
    return false;
  }

  return data.every(
    (item) => {
      if (
        !isObject(item)
      ) {
        return false;
      }

      return (
        typeof item.kelompokUmur ===
          'string' &&
        isPendudukValue(
          item.rw01
        ) &&
        isPendudukValue(
          item.rw02
        ) &&
        isPendudukValue(
          item.rw03
        ) &&
        isPendudukValue(
          item.total
        )
      );
    }
  );
}

/* =========================================================
   PENDUDUK SHEET
========================================================= */

function addPendudukSheet(
  workbook:
    ExcelJS.Workbook,

  rows:
    PendudukRow[],

  tahun:
    number,

  sumber:
    string
) {
  const worksheet =
    workbook.addWorksheet(
      'Penduduk'
    );

  const title =
    `Data Penduduk Desa Keji Tahun ${tahun}`;

  worksheet.addRow([
    title,
  ]);

  worksheet.mergeCells(
    1,
    1,
    1,
    13
  );

  const titleCell =
    worksheet.getCell(
      1,
      1
    );

  titleCell.font = {
    bold:
      true,

    size:
      15,

    color: {
      argb:
        'FFFFFFFF',
    },
  };

  titleCell.fill = {
    type:
      'pattern',

    pattern:
      'solid',

    fgColor: {
      argb:
        'FF065F46',
    },
  };

  titleCell.alignment = {
    vertical:
      'middle',

    horizontal:
      'center',

    wrapText:
      true,
  };

  worksheet.getRow(
    1
  ).height =
    30;

  worksheet.addRow(
    []
  );

  const headers = [
    'Kelompok Umur',

    'RW 01 Laki-laki',
    'RW 01 Perempuan',
    'RW 01 Jumlah',

    'RW 02 Laki-laki',
    'RW 02 Perempuan',
    'RW 02 Jumlah',

    'RW 03 Laki-laki',
    'RW 03 Perempuan',
    'RW 03 Jumlah',

    'Total Laki-laki',
    'Total Perempuan',
    'Total Penduduk',
  ];

  const headerRow =
    worksheet.addRow(
      headers
    );

  applyHeaderStyle(
    headerRow
  );

  const grandTotal = {
    rw01: {
      lakiLaki:
        0,

      perempuan:
        0,

      jumlah:
        0,
    },

    rw02: {
      lakiLaki:
        0,

      perempuan:
        0,

      jumlah:
        0,
    },

    rw03: {
      lakiLaki:
        0,

      perempuan:
        0,

      jumlah:
        0,
    },

    total: {
      lakiLaki:
        0,

      perempuan:
        0,

      jumlah:
        0,
    },
  };

  rows.forEach(
    (row) => {
      worksheet.addRow([
        row.kelompokUmur,

        row.rw01
          .lakiLaki,

        row.rw01
          .perempuan,

        row.rw01
          .jumlah,

        row.rw02
          .lakiLaki,

        row.rw02
          .perempuan,

        row.rw02
          .jumlah,

        row.rw03
          .lakiLaki,

        row.rw03
          .perempuan,

        row.rw03
          .jumlah,

        row.total
          .lakiLaki,

        row.total
          .perempuan,

        row.total
          .jumlah,
      ]);

      grandTotal.rw01
        .lakiLaki +=
        row.rw01
          .lakiLaki;

      grandTotal.rw01
        .perempuan +=
        row.rw01
          .perempuan;

      grandTotal.rw01
        .jumlah +=
        row.rw01
          .jumlah;

      grandTotal.rw02
        .lakiLaki +=
        row.rw02
          .lakiLaki;

      grandTotal.rw02
        .perempuan +=
        row.rw02
          .perempuan;

      grandTotal.rw02
        .jumlah +=
        row.rw02
          .jumlah;

      grandTotal.rw03
        .lakiLaki +=
        row.rw03
          .lakiLaki;

      grandTotal.rw03
        .perempuan +=
        row.rw03
          .perempuan;

      grandTotal.rw03
        .jumlah +=
        row.rw03
          .jumlah;

      grandTotal.total
        .lakiLaki +=
        row.total
          .lakiLaki;

      grandTotal.total
        .perempuan +=
        row.total
          .perempuan;

      grandTotal.total
        .jumlah +=
        row.total
          .jumlah;
    }
  );

  const totalRow =
    worksheet.addRow([
      'JUMLAH',

      grandTotal.rw01
        .lakiLaki,

      grandTotal.rw01
        .perempuan,

      grandTotal.rw01
        .jumlah,

      grandTotal.rw02
        .lakiLaki,

      grandTotal.rw02
        .perempuan,

      grandTotal.rw02
        .jumlah,

      grandTotal.rw03
        .lakiLaki,

      grandTotal.rw03
        .perempuan,

      grandTotal.rw03
        .jumlah,

      grandTotal.total
        .lakiLaki,

      grandTotal.total
        .perempuan,

      grandTotal.total
        .jumlah,
    ]);

  applyTotalStyle(
    totalRow
  );

  worksheet.addRow(
    []
  );

  const sumberRow =
    worksheet.addRow([
      `Sumber: ${sumber}`,
    ]);

  worksheet.mergeCells(
    sumberRow.number,
    1,
    sumberRow.number,
    13
  );

  sumberRow.getCell(
    1
  ).font = {
    italic:
      true,

    color: {
      argb:
        'FF64748B',
    },
  };

  worksheet.views = [
    {
      state:
        'frozen',

      ySplit:
        3,

      xSplit:
        1,
    },
  ];

  worksheet.autoFilter = {
    from: {
      row:
        3,

      column:
        1,
    },

    to: {
      row:
        3,

      column:
        headers.length,
    },
  };

  autoSizeColumns(
    worksheet
  );
}

/* =========================================================
   GENERIC TABLE HELPERS
========================================================= */

function normalizeGenericColumns(
  value: unknown
): GenericColumn[] {
  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value
    .filter(
      (
        item
      ): item is Record<
        string,
        unknown
      > =>
        isObject(item)
    )
    .map(
      (item) => ({
        key:
          safeString(
            item.key
          ),

        label:
          safeString(
            item.label
          ),
      })
    )
    .filter(
      (item) =>
        Boolean(
          item.key &&
          item.label
        )
    );
}

function normalizeGenericRows(
  value: unknown
): GenericDataRow[] {
  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value
    .filter(
      (
        item
      ): item is Record<
        string,
        unknown
      > =>
        isObject(item)
    )
    .map(
      (item) => {
        const rawNilai =
          isObject(
            item.nilai
          )
            ? item.nilai
            : {};

        const nilai:
          Record<
            string,
            number
          > = {};

        Object.entries(
          rawNilai
        ).forEach(
          ([
            key,
            rawValue,
          ]) => {
            const numberValue =
              Number(
                rawValue ??
                  0
              );

            nilai[key] =
              Number.isFinite(
                numberValue
              )
                ? numberValue
                : 0;
          }
        );

        return {
          label:
            safeString(
              item.label
            ) ||
            undefined,

          rw:
            safeString(
              item.rw
            ) ||
            undefined,

          nilai,
        };
      }
    );
}

function normalizeJumlah(
  value: unknown
): Record<
  string,
  number
> {
  if (
    !isObject(value)
  ) {
    return {};
  }

  const result:
    Record<
      string,
      number
    > = {};

  Object.entries(
    value
  ).forEach(
    ([
      key,
      rawValue,
    ]) => {
      const numberValue =
        Number(
          rawValue ??
            0
        );

      result[key] =
        Number.isFinite(
          numberValue
        )
          ? numberValue
          : 0;
    }
  );

  return result;
}

/* =========================================================
   GENERIC TABLE SHEETS
========================================================= */

function addGenericTables({
  workbook,
  data,
  sumber,
}: {
  workbook:
    ExcelJS.Workbook;

  data:
    unknown[];

  sumber:
    string;
}) {
  let created =
    0;

  data.forEach(
    (
      raw,
      index
    ) => {
      if (
        !isObject(raw)
      ) {
        return;
      }

      const columns =
        normalizeGenericColumns(
          raw.kolom
        );

      const rows =
        normalizeGenericRows(
          raw.baris
        );

      const jumlah =
        normalizeJumlah(
          raw.jumlah
        );

      if (
        columns.length ===
          0 ||
        rows.length ===
          0
      ) {
        return;
      }

      const nomor =
        safeString(
          raw.nomor
        );

      const id =
        safeString(
          raw.id
        );

      const judul =
        safeString(
          raw.judul
        );

      const labelBaris =
        safeString(
          raw.labelBaris
        ) ||
        'Wilayah / Kategori';

      const satuan =
        safeString(
          raw.satuan
        );

      const catatan =
        safeString(
          raw.catatan
        );

      const suggestedName =
        nomor ||
        id ||
        `Tabel ${index + 1}`;

      const sheetName =
        uniqueSheetName(
          workbook,
          suggestedName
        );

      const worksheet =
        workbook.addWorksheet(
          sheetName
        );

      /* =====================================================
         TITLE
      ===================================================== */

      const titleText =
        [
          nomor,
          judul,
        ]
          .filter(
            Boolean
          )
          .join(
            ' - '
          ) ||
        `Tabel ${index + 1}`;

      worksheet.addRow([
        titleText,
      ]);

      worksheet.mergeCells(
        1,
        1,
        1,
        columns.length +
          1
      );

      const titleCell =
        worksheet.getCell(
          1,
          1
        );

      titleCell.font = {
        bold:
          true,

        size:
          14,

        color: {
          argb:
            'FFFFFFFF',
        },
      };

      titleCell.fill = {
        type:
          'pattern',

        pattern:
          'solid',

        fgColor: {
          argb:
            'FF065F46',
        },
      };

      titleCell.alignment = {
        vertical:
          'middle',

        horizontal:
          'center',

        wrapText:
          true,
      };

      worksheet.getRow(
        1
      ).height =
        34;

      /* =====================================================
         SUB INFO
      ===================================================== */

      if (
        satuan
      ) {
        worksheet.addRow([
          `Satuan: ${satuan}`,
        ]);

        worksheet.mergeCells(
          2,
          1,
          2,
          columns.length +
            1
        );

        const satuanCell =
          worksheet.getCell(
            2,
            1
          );

        satuanCell.font = {
          italic:
            true,

          color: {
            argb:
              'FF64748B',
          },
        };
      } else {
        worksheet.addRow(
          []
        );
      }

      /* =====================================================
         HEADER
      ===================================================== */

      const headerRow =
        worksheet.addRow([
          labelBaris,

          ...columns.map(
            (column) =>
              column.label
          ),
        ]);

      applyHeaderStyle(
        headerRow
      );

      /* =====================================================
         ROWS
      ===================================================== */

      rows.forEach(
        (row) => {
          const label =
            safeString(
              row.label
            ) ||
            safeString(
              row.rw
            );

          const nilai =
            row.nilai ??
            {};

          worksheet.addRow([
            label,

            ...columns.map(
              (column) => {
                const value =
                  Number(
                    nilai[
                      column.key
                    ] ??
                      0
                  );

                return Number.isFinite(
                  value
                )
                  ? value
                  : 0;
              }
            ),
          ]);
        }
      );

      /* =====================================================
         TOTAL
      ===================================================== */

      if (
        Object.keys(
          jumlah
        ).length >
        0
      ) {
        const totalRow =
          worksheet.addRow([
            'Jumlah',

            ...columns.map(
              (column) =>
                jumlah[
                  column.key
                ] ??
                0
            ),
          ]);

        applyTotalStyle(
          totalRow
        );
      }

      /* =====================================================
         NOTE
      ===================================================== */

      if (
        catatan
      ) {
        worksheet.addRow(
          []
        );

        const noteRow =
          worksheet.addRow([
            `Catatan: ${catatan}`,
          ]);

        worksheet.mergeCells(
          noteRow.number,
          1,
          noteRow.number,
          columns.length +
            1
        );

        noteRow.getCell(
          1
        ).font = {
          italic:
            true,

          color: {
            argb:
              'FF64748B',
          },
        };

        noteRow.getCell(
          1
        ).alignment = {
          wrapText:
            true,
        };
      }

      /* =====================================================
         SOURCE
      ===================================================== */

      worksheet.addRow(
        []
      );

      const sourceRow =
        worksheet.addRow([
          `Sumber: ${sumber}`,
        ]);

      worksheet.mergeCells(
        sourceRow.number,
        1,
        sourceRow.number,
        columns.length +
          1
      );

      sourceRow.getCell(
        1
      ).font = {
        italic:
          true,

        color: {
          argb:
            'FF64748B',
        },
      };

      sourceRow.getCell(
        1
      ).alignment = {
        wrapText:
          true,
      };

      /* =====================================================
         FREEZE + FILTER
      ===================================================== */

      worksheet.views = [
        {
          state:
            'frozen',

          ySplit:
            3,

          xSplit:
            1,
        },
      ];

      worksheet.autoFilter = {
        from: {
          row:
            3,

          column:
            1,
        },

        to: {
          row:
            3,

          column:
            columns.length +
            1,
        },
      };

      autoSizeColumns(
        worksheet
      );

      created +=
        1;
    }
  );

  return created;
}

/* =========================================================
   RAW FALLBACK SHEET
========================================================= */

function addRawSheet(
  workbook:
    ExcelJS.Workbook,

  data:
    unknown[]
) {
  const worksheet =
    workbook.addWorksheet(
      'Data'
    );

  worksheet.addRow([
    'No',
    'Data JSON',
  ]);

  applyHeaderStyle(
    worksheet.getRow(
      1
    )
  );

  data.forEach(
    (
      item,
      index
    ) => {
      worksheet.addRow([
        index +
          1,

        JSON.stringify(
          item
        ),
      ]);
    }
  );

  worksheet.getColumn(
    1
  ).width =
    8;

  worksheet.getColumn(
    2
  ).width =
    100;

  worksheet.views = [
    {
      state:
        'frozen',

      ySplit:
        1,
    },
  ];
}

/* =========================================================
   ROUTE GET
========================================================= */

export async function GET(
  _request:
    Request,

  {
    params,
  }:
    RouteContext
) {
  const {
    kategori:
      kategoriParam,

    tahun:
      tahunParam,
  } =
    await params;

  const tahun =
    Number(
      tahunParam
    );

  /* =======================================================
     VALIDATE ROUTE
  ======================================================= */

  if (
    !isKategoriDesaCantik(
      kategoriParam
    ) ||
    !isTahunDesaCantik(
      tahun
    )
  ) {
    return Response.json(
      {
        message:
          'Kategori atau tahun Desa Cantik tidak valid.',
      },
      {
        status:
          400,
      }
    );
  }

  const kategori =
    kategoriParam as
      KategoriDesaCantik;

  const tahunValid =
    tahun as
      TahunDesaCantik;

  /* =======================================================
     GET DATA
  ======================================================= */

  const dataset =
    await getDesaCantikDataset(
      kategori,
      tahunValid,
      {
        includeInactive:
          false,

        /*
         * 2025 maupun 2026 tetap
         * dapat didownload walaupun
         * proses migrasi Supabase
         * belum dijalankan.
         */
        allowFallback:
          true,
      }
    );

  if (
    !dataset ||
    dataset.data.length ===
      0
  ) {
    return Response.json(
      {
        message:
          `Data ${kategori} Desa Keji tahun ${tahun} belum tersedia untuk diunduh.`,
      },
      {
        status:
          404,
      }
    );
  }

  const kategoriInfo =
    getKategoriDesaCantik(
      kategori
    );

  const namaKategori =
    kategoriInfo?.nama ??
    kategori;

  /* =======================================================
     WORKBOOK
  ======================================================= */

  const workbook =
    new ExcelJS.Workbook();

  workbook.creator =
    'SIJI - Sistem Informasi Desa Keji';

  workbook.lastModifiedBy =
    'Pemerintah Desa Keji';

  workbook.company =
    'Pemerintah Desa Keji';

  workbook.subject =
    `Data ${namaKategori} Desa Keji Tahun ${tahun}`;

  workbook.title =
    `Desa Cantik ${namaKategori} ${tahun}`;

  workbook.description =
    `Data Desa Cantik kategori ${namaKategori} Desa Keji tahun ${tahun}.`;

  workbook.created =
    new Date();

  workbook.modified =
    new Date();

  /* =======================================================
     INFORMATION
  ======================================================= */

  addMetadataSheet({
    workbook,

    kategori:
      namaKategori,

    tahun,

    sumber:
      dataset.sumber,
  });

  /* =======================================================
     DATA SHEETS
  ======================================================= */

  if (
    kategori ===
      'penduduk' &&
    isPendudukData(
      dataset.data
    )
  ) {
    addPendudukSheet(
      workbook,
      dataset.data,
      tahun,
      dataset.sumber
    );
  } else {
    const numberOfSheets =
      addGenericTables({
        workbook,

        data:
          dataset.data,

        sumber:
          dataset.sumber,
      });

    /*
     * Safety fallback apabila format
     * data baru belum dikenali.
     */
    if (
      numberOfSheets ===
      0
    ) {
      addRawSheet(
        workbook,
        dataset.data
      );
    }
  }

  /* =======================================================
     WRITE XLSX
  ======================================================= */

  const excelBuffer =
    await workbook.xlsx
      .writeBuffer();

  const bytes =
    new Uint8Array(
      excelBuffer
    );

  const fileName =
    `data-${kategori}-desa-keji-${tahun}.xlsx`;

  /* =======================================================
     RESPONSE
  ======================================================= */

  return new Response(
    bytes,
    {
      status:
        200,

      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

        'Content-Disposition':
          `attachment; filename="${fileName}"`,

        'Cache-Control':
          'no-store, max-age=0',

        'X-Content-Type-Options':
          'nosniff',
      },
    }
  );
}