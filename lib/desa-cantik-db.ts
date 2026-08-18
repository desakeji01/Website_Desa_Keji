// lib/desa-cantik-db.ts

import 'server-only';

import {
  getDataPenduduk,
  SUMBER_DATA_PENDUDUK_2025,
} from '@/lib/desa-cantik';

import {
  getDataKesehatan,
  SUMBER_DATA_KESEHATAN_2025,
  SUMBER_DATA_KESEHATAN_2026,
} from '@/lib/desa-cantik-kesehatan';

import {
  getDataPendidikan,
  SUMBER_DATA_PENDIDIKAN_2025,
  SUMBER_DATA_PENDIDIKAN_2026,
} from '@/lib/desa-cantik-pendidikan';

import {
  getDataPenduduk2026,
  SUMBER_DATA_PENDUDUK_2026,
} from '@/lib/desa-cantik-penduduk-2026';

import {
  getDataPerekonomian,
  SUMBER_DATA_PEREKONOMIAN_2025,
  SUMBER_DATA_PEREKONOMIAN_2026,
} from '@/lib/desa-cantik-perekonomian';

import {
  getDataPerumahan,
  SUMBER_DATA_PERUMAHAN_2025,
  SUMBER_DATA_PERUMAHAN_2026,
} from '@/lib/desa-cantik-perumahan';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  KategoriDesaCantik,
  TahunDesaCantik,
} from '@/types/desa-cantik';

/* =========================================================
   TYPES
========================================================= */

export interface DesaCantikDataset {
  id: string | null;

  kategori: KategoriDesaCantik;

  tahun: TahunDesaCantik;

  sumber: string;

  data: unknown[];

  infografisUrl: string | null;

  infografisPath: string | null;

  aktif: boolean;

  asal: 'supabase' | 'fallback';
}

interface DatasetOptions {
  includeInactive?: boolean;

  allowFallback?: boolean;
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

function normalizeData(
  value: unknown
): unknown[] {
  return Array.isArray(value)
    ? value
    : [];
}

/* =========================================================
   DATA LAMA / STATIC
========================================================= */

export function getStaticDesaCantikDataset(
  kategori: KategoriDesaCantik,
  tahun: TahunDesaCantik
): {
  data: unknown[];
  sumber: string;
} {
  if (
    kategori === 'penduduk'
  ) {
    if (
      tahun === 2025
    ) {
      return {
        data:
          getDataPenduduk(
            'penduduk',
            2025
          ) as unknown[],

        sumber:
          SUMBER_DATA_PENDUDUK_2025,
      };
    }

    return {
      data:
        getDataPenduduk2026(
          'penduduk',
          2026
        ) as unknown[],

      sumber:
        SUMBER_DATA_PENDUDUK_2026,
    };
  }

  if (
    kategori === 'pendidikan'
  ) {
    return {
      data:
        getDataPendidikan(
          'pendidikan',
          tahun
        ) as unknown[],

      sumber:
        tahun === 2025
          ? SUMBER_DATA_PENDIDIKAN_2025
          : SUMBER_DATA_PENDIDIKAN_2026,
    };
  }

  if (
    kategori === 'kesehatan'
  ) {
    return {
      data:
        getDataKesehatan(
          'kesehatan',
          tahun
        ) as unknown[],

      sumber:
        tahun === 2025
          ? SUMBER_DATA_KESEHATAN_2025
          : SUMBER_DATA_KESEHATAN_2026,
    };
  }

  if (
    kategori === 'perumahan'
  ) {
    return {
      data:
        getDataPerumahan(
          'perumahan',
          tahun
        ) as unknown[],

      sumber:
        tahun === 2025
          ? SUMBER_DATA_PERUMAHAN_2025
          : SUMBER_DATA_PERUMAHAN_2026,
    };
  }

  if (
    kategori === 'perekonomian'
  ) {
    return {
      data:
        getDataPerekonomian(
          'perekonomian',
          tahun
        ) as unknown[],

      sumber:
        tahun === 2025
          ? SUMBER_DATA_PEREKONOMIAN_2025
          : SUMBER_DATA_PEREKONOMIAN_2026,
    };
  }

  return {
    data: [],
    sumber: '',
  };
}

/* =========================================================
   SUPABASE DATASET
========================================================= */

export async function getDesaCantikDataset(
  kategori: KategoriDesaCantik,
  tahun: TahunDesaCantik,
  options: DatasetOptions = {}
): Promise<DesaCantikDataset | null> {
  const {
    includeInactive = false,
    allowFallback = true,
  } = options;

  const {
    data: row,
    error,
  } =
    await supabaseAdmin
      .from(
        'desa_cantik_data'
      )
      .select(`
        id,
        kategori,
        tahun,
        sumber,
        data,
        infografis_url,
        infografis_path,
        aktif
      `)
      .eq(
        'kategori',
        kategori
      )
      .eq(
        'tahun',
        tahun
      )
      .maybeSingle();

  if (error) {
    console.error(
      'Data Desa Cantik Supabase gagal dimuat:',
      {
        kategori,
        tahun,
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
  }

  /*
   * Jika row memang dinonaktifkan admin,
   * jangan tampilkan fallback.
   */
  if (
    row &&
    !Boolean(
      row.aktif
    ) &&
    !includeInactive
  ) {
    return null;
  }

  const databaseData =
    normalizeData(
      row?.data
    );

  /*
   * Jika data JSON Supabase sudah tersedia,
   * gunakan Supabase sebagai source of truth.
   */
  if (
    row &&
    databaseData.length > 0
  ) {
    return {
      id:
        safeString(
          row.id
        ) ||
        null,

      kategori,

      tahun,

      sumber:
        safeString(
          row.sumber
        ),

      data:
        databaseData,

      infografisUrl:
        safeString(
          row.infografis_url
        ) ||
        null,

      infografisPath:
        safeString(
          row.infografis_path
        ) ||
        null,

      aktif:
        Boolean(
          row.aktif
        ),

      asal:
        'supabase',
    };
  }

  /*
   * Transitional fallback.
   * Berguna sebelum tombol migrasi pertama kali ditekan.
   */
  if (
    allowFallback
  ) {
    const fallback =
      getStaticDesaCantikDataset(
        kategori,
        tahun
      );

    if (
      fallback.data.length > 0
    ) {
      return {
        id:
          safeString(
            row?.id
          ) ||
          null,

        kategori,

        tahun,

        sumber:
          safeString(
            row?.sumber
          ) ||
          fallback.sumber,

        data:
          fallback.data,

        infografisUrl:
          safeString(
            row?.infografis_url
          ) ||
          null,

        infografisPath:
          safeString(
            row?.infografis_path
          ) ||
          null,

        aktif:
          row
            ? Boolean(
                row.aktif
              )
            : true,

        asal:
          'fallback',
      };
    }
  }

  if (
    row &&
    (
      includeInactive ||
      Boolean(
        row.aktif
      )
    )
  ) {
    return {
      id:
        safeString(
          row.id
        ) ||
        null,

      kategori,

      tahun,

      sumber:
        safeString(
          row.sumber
        ),

      data: [],

      infografisUrl:
        safeString(
          row.infografis_url
        ) ||
        null,

      infografisPath:
        safeString(
          row.infografis_path
        ) ||
        null,

      aktif:
        Boolean(
          row.aktif
        ),

      asal:
        'supabase',
    };
  }

  return null;
}