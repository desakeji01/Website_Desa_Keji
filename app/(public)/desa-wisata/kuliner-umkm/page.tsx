// app/(public)/desa-wisata/kuliner-umkm/page.tsx

import type {
  Metadata,
} from 'next';

import LapakDesaClient from '@/components/umkm/LapakDesaClient';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  ProdukUmkm,
} from '@/types/umkm';

/* =========================================================
   METADATA
========================================================= */

export const metadata:
  Metadata = {
  title:
    'Kuliner dan UMKM Desa Wisata Keji | SIJI',

  description:
    'Temukan kuliner lokal, produk UMKM, pelaku usaha, E-Catalog, dan panduan UMKM masyarakat Desa Keji.',
};

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

/* =========================================================
   CONFIG
========================================================= */

const ECATALOG_COVER_URL =
  '/cover-ecatalog.png';

const DEFAULT_PANDUAN_IMAGE =
  '/images/umkm/Panduan Sukses Berjualan.png';

/* =========================================================
   TYPES
========================================================= */

interface UmkmSettingsDatabase {
  /* E-Catalog */

  ecatalog_judul:
    | string
    | null;

  ecatalog_deskripsi:
    | string
    | null;

  ecatalog_url:
    | string
    | null;

  ecatalog_aktif:
    | boolean
    | null;

  /* Panduan UMKM */

  panduan_umkm_judul:
    | string
    | null;

  panduan_umkm_deskripsi:
    | string
    | null;

  panduan_umkm_gambar_url:
    | string
    | null;

  panduan_umkm_aktif:
    | boolean
    | null;
}

interface EcatalogUmkm {
  judul: string;

  deskripsi: string;

  url: string;

  coverUrl: string;
}

interface PanduanUmkm {
  judul: string;

  deskripsi: string;

  gambarUrl: string;
}

/* =========================================================
   HELPERS
========================================================= */

function safeString(
  value: unknown
): string {
  return String(
    value ?? ''
  ).trim();
}

function safeNumber(
  value: unknown,
  fallback = 0
): number {
  const number =
    Number(value);

  return Number.isFinite(
    number
  )
    ? number
    : fallback;
}

function normalizeOptionalString(
  value: unknown
): string | null {
  const text =
    safeString(
      value
    );

  return text || null;
}

/* =========================================================
   URL
========================================================= */

function normalizeExternalUrl(
  value: unknown
): string | null {
  const rawUrl =
    safeString(
      value
    );

  if (!rawUrl) {
    return null;
  }

  try {
    const url =
      new URL(
        rawUrl
      );

    if (
      url.protocol !==
        'https:' &&
      url.protocol !==
        'http:'
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function normalizePublicUrl(
  value: unknown
): string | null {
  const rawUrl =
    safeString(
      value
    );

  if (!rawUrl) {
    return null;
  }

  /* =======================================================
     LOCAL PUBLIC PATH
  ======================================================= */

  if (
    rawUrl.startsWith(
      '/'
    ) &&
    !rawUrl.startsWith(
      '//'
    )
  ) {
    return rawUrl;
  }

  /* =======================================================
     EXTERNAL URL
  ======================================================= */

  return normalizeExternalUrl(
    rawUrl
  );
}

/* =========================================================
   NORMALIZE PRODUK
========================================================= */

function normalizeProduk(
  row: Record<
    string,
    unknown
  >
): ProdukUmkm {
  return {
    id:
      safeString(
        row.id
      ),

    nama_produk:
      safeString(
        row.nama_produk
      ),

    slug:
      safeString(
        row.slug
      ),

    kategori:
      safeString(
        row.kategori
      ) ||
      'Lainnya',

    harga:
      Math.max(
        safeNumber(
          row.harga
        ),
        0
      ),

    satuan:
      safeString(
        row.satuan
      ) ||
      'pcs',

    deskripsi:
      normalizeOptionalString(
        row.deskripsi
      ),

    nama_penjual:
      safeString(
        row.nama_penjual
      ),

    nomor_whatsapp:
      normalizeOptionalString(
        row.nomor_whatsapp
      ),

    alamat:
      normalizeOptionalString(
        row.alamat
      ),

    lokasi_url:
      normalizeExternalUrl(
        row.lokasi_url
      ),

    gambar_url:
      normalizePublicUrl(
        row.gambar_url
      ),

    terverifikasi:
      Boolean(
        row.terverifikasi
      ),

    aktif:
      Boolean(
        row.aktif
      ),

    urutan:
      Math.max(
        safeNumber(
          row.urutan
        ),
        0
      ),

    created_at:
      safeString(
        row.created_at
      ),

    updated_at:
      safeString(
        row.updated_at
      ),
  };
}

/* =========================================================
   NORMALIZE E-CATALOG
========================================================= */

function normalizeEcatalog(
  value:
    | UmkmSettingsDatabase
    | null
): EcatalogUmkm | null {
  if (
    !value ||
    value.ecatalog_aktif !==
      true
  ) {
    return null;
  }

  const url =
    normalizeExternalUrl(
      value.ecatalog_url
    );

  if (!url) {
    return null;
  }

  return {
    judul:
      safeString(
        value.ecatalog_judul
      ) ||
      'E-Catalog UMKM Desa Keji',

    deskripsi:
      safeString(
        value.ecatalog_deskripsi
      ) ||
      'Jelajahi katalog digital yang memuat produk makanan, kerajinan, dan usaha lokal masyarakat Desa Keji.',

    url,

    coverUrl:
      ECATALOG_COVER_URL,
  };
}

/* =========================================================
   NORMALIZE PANDUAN UMKM
========================================================= */

function normalizePanduanUmkm(
  value:
    | UmkmSettingsDatabase
    | null
): PanduanUmkm | null {
  if (
    !value ||
    value.panduan_umkm_aktif !==
      true
  ) {
    return null;
  }

  const gambarUrl =
    normalizePublicUrl(
      value.panduan_umkm_gambar_url
    ) ||
    DEFAULT_PANDUAN_IMAGE;

  return {
    judul:
      safeString(
        value.panduan_umkm_judul
      ) ||
      'Panduan Sukses Berjualan',

    deskripsi:
      safeString(
        value.panduan_umkm_deskripsi
      ) ||
      'Pelajari langkah sederhana dalam menata display produk agar lebih menarik serta memberikan pelayanan yang ramah dan profesional kepada konsumen.',

    gambarUrl,
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function KulinerUmkmPage() {
  const [
    produkResult,
    settingsResult,
  ] =
    await Promise.all([
      /* =====================================================
         PRODUK UMKM
      ===================================================== */

      supabaseAdmin
        .from(
          'produk_umkm'
        )
        .select(`
          id,
          nama_produk,
          slug,
          kategori,
          harga,
          satuan,
          deskripsi,
          nama_penjual,
          nomor_whatsapp,
          alamat,
          lokasi_url,
          gambar_url,
          terverifikasi,
          aktif,
          urutan,
          created_at,
          updated_at
        `)
        .eq(
          'aktif',
          true
        )
        .order(
          'urutan',
          {
            ascending:
              true,

            nullsFirst:
              false,
          }
        )
        .order(
          'created_at',
          {
            ascending:
              false,
          }
        ),

      /* =====================================================
         E-CATALOG + PANDUAN UMKM
      ===================================================== */

      supabaseAdmin
        .from(
          'paket_wisata_settings'
        )
        .select(`
          ecatalog_judul,
          ecatalog_deskripsi,
          ecatalog_url,
          ecatalog_aktif,
          panduan_umkm_judul,
          panduan_umkm_deskripsi,
          panduan_umkm_gambar_url,
          panduan_umkm_aktif
        `)
        .eq(
          'setting_key',
          'utama'
        )
        .maybeSingle(),
    ]);

  /* =======================================================
     ERROR PRODUK
  ======================================================= */

  if (
    produkResult.error
  ) {
    console.error(
      'Gagal mengambil produk UMKM untuk Desa Wisata:',
      {
        message:
          produkResult.error
            .message,

        code:
          produkResult.error
            .code,

        details:
          produkResult.error
            .details,

        hint:
          produkResult.error
            .hint,
      }
    );
  }

  /* =======================================================
     ERROR SETTINGS
  ======================================================= */

  if (
    settingsResult.error
  ) {
    console.error(
      'Gagal mengambil settings UMKM untuk Desa Wisata:',
      {
        message:
          settingsResult.error
            .message,

        code:
          settingsResult.error
            .code,

        details:
          settingsResult.error
            .details,

        hint:
          settingsResult.error
            .hint,
      }
    );
  }

  /* =======================================================
     NORMALIZE PRODUK
  ======================================================= */

  const produk =
    (
      (
        produkResult.data ??
        []
      ) as Record<
        string,
        unknown
      >[]
    )
      .map(
        normalizeProduk
      )
      .filter(
        (item) =>
          item.id.length >
            0 &&
          item.nama_produk
            .length >
            0 &&
          item.nama_penjual
            .length >
            0
      );

  /* =======================================================
     KATEGORI
  ======================================================= */

  const kategori =
    Array.from(
      new Set(
        produk
          .map(
            (item) =>
              item.kategori
          )
          .filter(
            (
              item
            ): item is string =>
              item.length >
              0
          )
      )
    ).sort(
      (
        first,
        second
      ) =>
        first.localeCompare(
          second,
          'id-ID'
        )
    );

  /* =======================================================
     SETTINGS
  ======================================================= */

  const settings =
    settingsResult.data as
      | UmkmSettingsDatabase
      | null;

  const ecatalog =
    normalizeEcatalog(
      settings
    );

  const panduanUmkm =
    normalizePanduanUmkm(
      settings
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <LapakDesaClient
      produk={
        produk
      }
      kategori={
        kategori
      }
      ecatalog={
        ecatalog
      }
      panduanUmkm={
        panduanUmkm
      }
    />
  );
}