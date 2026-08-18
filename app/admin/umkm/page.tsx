// app/admin/umkm/page.tsx

import Link from 'next/link';

import {
  AlertCircle,
  BadgeCheck,
  CheckCircle2,
  ExternalLink,
  FileText,
  ImageIcon,
  Lightbulb,
  Link2,
  Package,
  Pencil,
  Power,
  Save,
  ShoppingBag,
  Store,
  Tags,
  Trash2,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';

import {
  hapusProdukUmkmAction,
  simpanEcatalogUmkmAction,
  simpanPanduanUmkmAction,
  tambahProdukUmkmAction,
  toggleAktifProdukUmkmAction,
  toggleVerifikasiProdukUmkmAction,
  ubahProdukUmkmAction,
} from '@/app/admin/umkm/actions';

import UmkmVideoTutorialAdmin from '@/components/admin/UmkmVideoTutorialAdmin';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  ProdukUmkm,
} from '@/types/umkm';

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

/* =========================================================
   TYPES
========================================================= */

interface PageProps {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
}

interface EcatalogSettings {
  ecatalog_judul: string;

  ecatalog_deskripsi:
    string;

  ecatalog_url:
    | string
    | null;

  ecatalog_aktif:
    boolean;

  updated_at:
    string;
}

interface PanduanUmkmSettings {
  panduan_umkm_judul:
    string;

  panduan_umkm_deskripsi:
    string;

  panduan_umkm_gambar_url:
    | string
    | null;

  panduan_umkm_aktif:
    boolean;

  updated_at:
    string;
}

/* =========================================================
   FALLBACK
========================================================= */

const fallbackEcatalog:
  EcatalogSettings = {
  ecatalog_judul:
    'E-Catalog Produk UMKM Desa Keji',

  ecatalog_deskripsi:
    'Jelajahi katalog digital produk makanan, minuman, kerajinan, dan usaha masyarakat Desa Keji.',

  ecatalog_url:
    null,

  ecatalog_aktif:
    false,

  updated_at:
    '',
};

const fallbackPanduanUmkm:
  PanduanUmkmSettings = {
  panduan_umkm_judul:
    'Panduan Sukses Berjualan',

  panduan_umkm_deskripsi:
    'Pelajari langkah sederhana dalam menata display produk agar lebih menarik serta memberikan pelayanan yang ramah dan profesional kepada konsumen.',

  panduan_umkm_gambar_url:
    '/images/umkm/Panduan Sukses Berjualan.png',

  panduan_umkm_aktif:
    true,

  updated_at:
    '',
};

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
  const text =
    safeString(value);

  return text || null;
}

function isExternalUrl(
  value:
    | string
    | null
) {
  if (!value) {
    return false;
  }

  try {
    const url =
      new URL(value);

    return (
      url.protocol ===
        'https:' ||
      url.protocol ===
        'http:'
    );
  } catch {
    return false;
  }
}

/* =========================================================
   NORMALIZE E-CATALOG
========================================================= */

function normalizeEcatalog(
  value: unknown
): EcatalogSettings {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(value)
  ) {
    return fallbackEcatalog;
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  return {
    ecatalog_judul:
      safeString(
        row.ecatalog_judul
      ) ||
      fallbackEcatalog
        .ecatalog_judul,

    ecatalog_deskripsi:
      safeString(
        row.ecatalog_deskripsi
      ) ||
      fallbackEcatalog
        .ecatalog_deskripsi,

    ecatalog_url:
      nullableString(
        row.ecatalog_url
      ),

    ecatalog_aktif:
      Boolean(
        row.ecatalog_aktif
      ),

    updated_at:
      safeString(
        row.updated_at
      ),
  };
}

/* =========================================================
   NORMALIZE PANDUAN
========================================================= */

function normalizePanduanUmkm(
  value: unknown
): PanduanUmkmSettings {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(value)
  ) {
    return fallbackPanduanUmkm;
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  return {
    panduan_umkm_judul:
      safeString(
        row.panduan_umkm_judul
      ) ||
      fallbackPanduanUmkm
        .panduan_umkm_judul,

    panduan_umkm_deskripsi:
      safeString(
        row.panduan_umkm_deskripsi
      ) ||
      fallbackPanduanUmkm
        .panduan_umkm_deskripsi,

    panduan_umkm_gambar_url:
      nullableString(
        row.panduan_umkm_gambar_url
      ) ||
      fallbackPanduanUmkm
        .panduan_umkm_gambar_url,

    panduan_umkm_aktif:
      row.panduan_umkm_aktif ===
      null ||
      row.panduan_umkm_aktif ===
      undefined
        ? fallbackPanduanUmkm
            .panduan_umkm_aktif
        : Boolean(
            row.panduan_umkm_aktif
          ),

    updated_at:
      safeString(
        row.updated_at
      ),
  };
}

/* =========================================================
   NORMALIZE PRODUK
========================================================= */

function normalizeProduk(
  value: unknown
): ProdukUmkm | null {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(value)
  ) {
    return null;
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  const produk:
    ProdukUmkm = {
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
      Number(
        row.harga ??
          0
      ),

    satuan:
      safeString(
        row.satuan
      ) ||
      'pcs',

    deskripsi:
      nullableString(
        row.deskripsi
      ),

    nama_penjual:
      safeString(
        row.nama_penjual
      ),

    nomor_whatsapp:
      nullableString(
        row.nomor_whatsapp
      ),

    alamat:
      nullableString(
        row.alamat
      ),

    lokasi_url:
      nullableString(
        row.lokasi_url
      ),

    gambar_url:
      nullableString(
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
      Number(
        row.urutan ??
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

  if (
    !produk.id ||
    !produk.nama_produk
  ) {
    return null;
  }

  return produk;
}

/* =========================================================
   FORMATTERS
========================================================= */

function formatRupiah(
  value: number
) {
  return new Intl.NumberFormat(
    'id-ID',
    {
      style:
        'currency',

      currency:
        'IDR',

      minimumFractionDigits:
        0,

      maximumFractionDigits:
        0,
    }
  ).format(
    Number.isFinite(value)
      ? value
      : 0
  );
}

function formatTanggal(
  value: string
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
      day:
        '2-digit',

      month:
        'long',

      year:
        'numeric',

      timeZone:
        'Asia/Jakarta',
    }
  ).format(date);
}

/* =========================================================
   PAGE
========================================================= */

export default async function AdminUmkmPage({
  searchParams,
}: PageProps) {
  const [
    params,
    produkResult,
    settingsResult,
  ] =
    await Promise.all([
      searchParams,

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
        .order(
          'urutan',
          {
            ascending:
              true,
          }
        )
        .order(
          'created_at',
          {
            ascending:
              false,
          }
        ),

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
          panduan_umkm_aktif,

          updated_at
        `)
        .eq(
          'setting_key',
          'utama'
        )
        .maybeSingle(),
    ]);

  /* =======================================================
     ERRORS
  ======================================================= */

  if (
    produkResult.error
  ) {
    console.error(
      'Gagal mengambil produk UMKM pada admin:',
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

  if (
    settingsResult.error
  ) {
    console.error(
      'Gagal mengambil pengaturan UMKM:',
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
     DATA
  ======================================================= */

  const daftarProduk =
    (
      produkResult.data ??
      []
    )
      .map(
        normalizeProduk
      )
      .filter(
        (
          item
        ): item is ProdukUmkm =>
          item !== null
      );

  const ecatalog =
    normalizeEcatalog(
      settingsResult.data
    );

  const panduanUmkm =
    normalizePanduanUmkm(
      settingsResult.data
    );

  const ecatalogUrlValid =
    isExternalUrl(
      ecatalog.ecatalog_url
    );

  const ecatalogTayang =
    ecatalog.ecatalog_aktif &&
    ecatalogUrlValid;

  const panduanTayang =
    panduanUmkm
      .panduan_umkm_aktif &&
    Boolean(
      panduanUmkm
        .panduan_umkm_gambar_url
    );

  const produkAktif =
    daftarProduk.filter(
      (item) =>
        item.aktif
    ).length;

  const produkTerverifikasi =
    daftarProduk.filter(
      (item) =>
        item.terverifikasi
    ).length;

  const totalPenjual =
    new Set(
      daftarProduk
        .map(
          (item) =>
            item.nama_penjual
              .toLowerCase()
              .trim()
        )
        .filter(Boolean)
    ).size;

  const totalKategori =
    new Set(
      daftarProduk
        .map(
          (item) =>
            item.kategori
              .toLowerCase()
              .trim()
        )
        .filter(Boolean)
    ).size;

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 px-6 py-8 text-white shadow-xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.16) 1.5px, transparent 1.5px)',

            backgroundSize:
              '26px 26px',
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[52px] border-white/[0.05]"
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <ShoppingBag
                size={27}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                Produk Lokal Desa
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                Lapak UMKM Desa Keji
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                Kelola E-Catalog,
                Panduan Sukses
                Berjualan, video
                tutorial, produk,
                penjual, harga,
                kategori, foto,
                lokasi, WhatsApp,
                verifikasi, dan
                publikasi UMKM.
              </p>
            </div>
          </div>

          <Link
            href="/umkm"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white transition hover:bg-white/15"
          >
            Lihat Lapak UMKM

            <ExternalLink
              size={16}
            />
          </Link>
        </div>
      </section>

      {/* =====================================================
          PESAN
      ===================================================== */}

      {params.success && (
        <Message
          type="success"
          text={
            params.success
          }
        />
      )}

      {params.error && (
        <Message
          type="error"
          text={
            params.error
          }
        />
      )}

      {produkResult.error && (
        <Message
          type="error"
          text="Data produk UMKM gagal dimuat."
        />
      )}

      {settingsResult.error && (
        <Message
          type="error"
          text="Pengaturan UMKM gagal dimuat. Pastikan kolom E-Catalog dan Panduan UMKM sudah tersedia."
        />
      )}

      {/* =====================================================
          STATISTIK
      ===================================================== */}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Produk"
          value={
            daftarProduk.length
          }
          description="Seluruh produk tersimpan"
          icon={Package}
        />

        <StatCard
          label="Produk Aktif"
          value={
            produkAktif
          }
          description="Tampil pada halaman publik"
          icon={CheckCircle2}
        />

        <StatCard
          label="Terverifikasi"
          value={
            produkTerverifikasi
          }
          description="Produk telah diverifikasi"
          icon={BadgeCheck}
        />

        <StatCard
          label="Penjual dan Kategori"
          value={
            totalPenjual
          }
          description={`${totalKategori} kategori produk`}
          icon={Users}
        />
      </section>

      {/* =====================================================
          E-CATALOG
      ===================================================== */}

      <form
        id="ecatalog-umkm"
        action={
          simpanEcatalogUmkmAction
        }
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white px-6 py-5 sm:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                <FileText
                  size={23}
                />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                  Katalog Digital
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900">
                  Kelola E-Catalog UMKM
                </h2>

                <p className="mt-1 max-w-3xl text-sm font-medium leading-6 text-slate-500">
                  E-Catalog ditampilkan
                  pada halaman Lapak UMKM.
                  URL dapat diganti kapan
                  saja melalui formulir
                  ini.
                </p>
              </div>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold ${
                ecatalogTayang
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {ecatalogTayang ? (
                <CheckCircle2
                  size={15}
                />
              ) : (
                <AlertCircle
                  size={15}
                />
              )}

              {ecatalogTayang
                ? 'Tayang di Publik'
                : 'Belum Tayang'}
            </span>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:p-7 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="grid gap-5">
            <TextInput
              idPrefix="ecatalog"
              name="ecatalog_judul"
              label="Judul E-Catalog"
              value={
                ecatalog
                  .ecatalog_judul
              }
              placeholder="E-Catalog Produk UMKM Desa Keji"
            />

            <TextArea
              idPrefix="ecatalog"
              name="ecatalog_deskripsi"
              label="Deskripsi E-Catalog"
              value={
                ecatalog
                  .ecatalog_deskripsi
              }
              rows={4}
            />

            <TextInput
              idPrefix="ecatalog"
              name="ecatalog_url"
              label="URL E-Catalog"
              type="url"
              value={
                ecatalog
                  .ecatalog_url ??
                ''
              }
              placeholder="https://drive.google.com/... atau https://heyzine.com/..."
              required={false}
            />

            <Checkbox
              id="ecatalog-aktif"
              name="ecatalog_aktif"
              label="Publikasikan E-Catalog"
              description="E-Catalog ditampilkan pada halaman Lapak UMKM apabila URL sudah valid."
              checked={
                ecatalog
                  .ecatalog_aktif
              }
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800 sm:w-auto"
              >
                <Save
                  size={17}
                />

                Simpan E-Catalog
              </button>
            </div>
          </div>

          {/* Pratinjau */}

          <aside className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 text-white shadow-lg">
            <div className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                <FileText
                  size={23}
                />
              </div>

              <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                Pratinjau E-Catalog
              </p>

              <h3 className="mt-2 text-xl font-black leading-7">
                {
                  ecatalog
                    .ecatalog_judul
                }
              </h3>

              <p className="mt-3 text-sm font-medium leading-7 text-emerald-50/80">
                {
                  ecatalog
                    .ecatalog_deskripsi
                }
              </p>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200">
                  Status URL
                </p>

                <div className="mt-2 flex items-start gap-2">
                  <Link2
                    size={16}
                    className="mt-0.5 shrink-0 text-emerald-200"
                  />

                  <p className="break-all text-xs font-semibold leading-5 text-emerald-50/80">
                    {ecatalog
                      .ecatalog_url ||
                      'URL belum dimasukkan'}
                  </p>
                </div>
              </div>

              {ecatalogUrlValid ? (
                <a
                  href={
                    ecatalog
                      .ecatalog_url ??
                    '#'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-900 transition hover:bg-emerald-50"
                >
                  Buka E-Catalog

                  <ExternalLink
                    size={15}
                  />
                </a>
              ) : (
                <span className="mt-6 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 text-sm font-extrabold text-emerald-100">
                  URL Belum Tersedia
                </span>
              )}

              <p className="mt-4 text-xs font-medium text-emerald-100/60">
                Diperbarui:{' '}
                {formatTanggal(
                  ecatalog
                    .updated_at
                )}
              </p>
            </div>
          </aside>
        </div>
      </form>

      {/* =====================================================
          PANDUAN SUKSES BERJUALAN
      ===================================================== */}

      <form
        id="panduan-umkm"
        action={
          simpanPanduanUmkmAction
        }
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white px-6 py-5 sm:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                <Lightbulb
                  size={23}
                />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                  Edukasi UMKM
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900">
                  Kelola Panduan Sukses
                  Berjualan
                </h2>

                <p className="mt-1 max-w-3xl text-sm font-medium leading-6 text-slate-500">
                  Atur judul,
                  deskripsi, gambar,
                  dan status publikasi
                  panduan yang tampil
                  tepat di bawah
                  E-Catalog.
                </p>
              </div>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold ${
                panduanTayang
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {panduanTayang ? (
                <CheckCircle2
                  size={15}
                />
              ) : (
                <AlertCircle
                  size={15}
                />
              )}

              {panduanTayang
                ? 'Tayang di Publik'
                : 'Belum Tayang'}
            </span>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:p-7 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Form */}

          <div className="grid gap-5">
            <TextInput
              idPrefix="panduan"
              name="panduan_umkm_judul"
              label="Judul Panduan"
              value={
                panduanUmkm
                  .panduan_umkm_judul
              }
              placeholder="Panduan Sukses Berjualan"
            />

            <TextArea
              idPrefix="panduan"
              name="panduan_umkm_deskripsi"
              label="Deskripsi Panduan"
              value={
                panduanUmkm
                  .panduan_umkm_deskripsi
              }
              rows={5}
            />

            <TextInput
              idPrefix="panduan"
              name="panduan_umkm_gambar_url"
              label="URL atau Path Gambar"
              value={
                panduanUmkm
                  .panduan_umkm_gambar_url ??
                ''
              }
              placeholder="/images/umkm/Panduan Sukses Berjualan.png"
            />

            <p className="-mt-2 text-xs font-medium leading-5 text-slate-400">
              Bisa menggunakan path dari
              folder public seperti
              /images/umkm/Panduan Sukses
              Berjualan.png atau URL
              gambar https://...
            </p>

            <Checkbox
              id="panduan-aktif"
              name="panduan_umkm_aktif"
              label="Publikasikan Panduan"
              description="Jika aktif, Panduan Sukses Berjualan akan tampil pada halaman publik tepat di bawah E-Catalog."
              checked={
                panduanUmkm
                  .panduan_umkm_aktif
              }
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800 sm:w-auto"
              >
                <Save
                  size={17}
                />

                Simpan Panduan
              </button>
            </div>
          </div>

          {/* Preview */}

          <aside className="overflow-hidden rounded-3xl border border-emerald-100 bg-slate-50 shadow-sm">
            <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-700 px-5 py-4 text-white">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                Pratinjau
              </p>

              <h3 className="mt-1 font-black">
                Panduan UMKM
              </h3>
            </div>

            {panduanUmkm
              .panduan_umkm_gambar_url ? (
              <div className="bg-gradient-to-br from-[#f8dec9] via-[#fff0e4] to-emerald-50 p-5">
                <div className="mx-auto w-full max-w-[230px] overflow-hidden rounded-2xl bg-white shadow-lg">
                  <img
                    src={
                      panduanUmkm
                        .panduan_umkm_gambar_url
                    }
                    alt={
                      panduanUmkm
                        .panduan_umkm_judul
                    }
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="flex min-h-[250px] flex-col items-center justify-center bg-slate-100 text-slate-400">
                <ImageIcon
                  size={38}
                />

                <p className="mt-2 text-xs font-bold">
                  Belum ada gambar
                </p>
              </div>
            )}

            <div className="p-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                Edukasi Pelaku UMKM
              </p>

              <h3 className="mt-2 text-lg font-black leading-6 text-slate-900">
                {
                  panduanUmkm
                    .panduan_umkm_judul
                }
              </h3>

              <p className="mt-2 line-clamp-5 text-xs font-medium leading-6 text-slate-500">
                {
                  panduanUmkm
                    .panduan_umkm_deskripsi
                }
              </p>

              <p className="mt-4 text-[11px] font-semibold text-slate-400">
                Diperbarui:{' '}
                {formatTanggal(
                  panduanUmkm
                    .updated_at
                )}
              </p>
            </div>
          </aside>
        </div>
      </form>

      {/* =====================================================
          VIDEO TUTORIAL
      ===================================================== */}

      <UmkmVideoTutorialAdmin />

      {/* =====================================================
          TAMBAH PRODUK
      ===================================================== */}

      <form
        id="tambah-produk"
        action={
          tambahProdukUmkmAction
        }
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <div className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50 to-white px-6 py-5 sm:px-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
              <ShoppingBag
                size={23}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                Produk Baru
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                Tambah Produk UMKM
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Slug dapat dikosongkan.
                Sistem akan membuat slug
                otomatis dari nama
                produk.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-7">
          <ProdukFormFields
            idPrefix="tambah"
            defaultUrutan={
              daftarProduk.length
            }
          />

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800 sm:w-auto"
            >
              <ShoppingBag
                size={17}
              />

              Tambah Produk
            </button>
          </div>
        </div>
      </form>

      {/* =====================================================
          DAFTAR PRODUK
      ===================================================== */}

      <section
        id="produk-umkm"
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-200 px-6 py-5 sm:px-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
            Daftar Produk
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-900">
            Produk UMKM Tersimpan
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-500">
            {daftarProduk.length}{' '}
            produk tersimpan dalam
            database.
          </p>
        </div>

        {daftarProduk.length ===
        0 ? (
          <div className="px-6 py-16 text-center">
            <ShoppingBag
              size={48}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-black text-slate-700">
              Belum ada produk UMKM
            </h3>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Tambahkan produk melalui
              formulir di atas.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 p-5 sm:p-7 xl:grid-cols-2">
            {daftarProduk.map(
              (produk) => (
                <ProdukAdminCard
                  key={
                    produk.id
                  }
                  produk={
                    produk
                  }
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   PRODUCT ADMIN CARD
========================================================= */

function ProdukAdminCard({
  produk,
}: {
  produk:
    ProdukUmkm;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
      <div className="grid sm:grid-cols-[180px_minmax(0,1fr)]">
        <div className="aspect-[4/3] bg-slate-200 sm:aspect-auto">
          {produk.gambar_url ? (
            <img
              src={
                produk.gambar_url
              }
              alt={
                produk.nama_produk
              }
              loading="lazy"
              className="h-full min-h-[210px] w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[210px] flex-col items-center justify-center text-slate-400">
              <ImageIcon
                size={38}
              />

              <p className="mt-2 text-xs font-bold">
                Belum ada foto
              </p>
            </div>
          )}
        </div>

        <div className="min-w-0 p-5">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700">
              {produk.kategori}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${
                produk.aktif
                  ? 'bg-cyan-100 text-cyan-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {produk.aktif
                ? 'Aktif'
                : 'Nonaktif'}
            </span>

            {produk.terverifikasi && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-[10px] font-extrabold text-blue-700">
                <BadgeCheck
                  size={13}
                />

                Terverifikasi
              </span>
            )}
          </div>

          <h3 className="mt-3 text-xl font-black text-slate-900">
            {
              produk.nama_produk
            }
          </h3>

          <p className="mt-2 text-lg font-black text-emerald-700">
            {formatRupiah(
              produk.harga
            )}

            <span className="ml-1 text-xs font-semibold text-slate-500">
              / {produk.satuan}
            </span>
          </p>

          <div className="mt-4 space-y-2 text-xs font-semibold text-slate-500">
            <p className="flex items-start gap-2">
              <UserRound
                size={15}
                className="mt-0.5 shrink-0"
              />

              <span>
                {
                  produk.nama_penjual
                }
              </span>
            </p>

            {produk.alamat && (
              <p className="flex items-start gap-2">
                <Store
                  size={15}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  {
                    produk.alamat
                  }
                </span>
              </p>
            )}

            <p className="flex items-start gap-2">
              <Tags
                size={15}
                className="mt-0.5 shrink-0"
              />

              <span>
                Slug:{' '}
                {produk.slug}
              </span>
            </p>
          </div>

          <p className="mt-4 text-[11px] font-semibold text-slate-400">
            Urutan{' '}
            {produk.urutan} ·
            Diperbarui{' '}
            {formatTanggal(
              produk.updated_at
            )}
          </p>
        </div>
      </div>

      <div className="grid gap-2 border-t border-slate-200 bg-white p-4 sm:grid-cols-3">
        <form
          action={
            toggleAktifProdukUmkmAction
          }
        >
          <input
            type="hidden"
            name="id"
            value={
              produk.id
            }
          />

          <input
            type="hidden"
            name="aktif"
            value={String(
              !produk.aktif
            )}
          />

          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-amber-100 px-3 text-xs font-extrabold text-amber-700 transition hover:bg-amber-200"
          >
            <Power
              size={15}
            />

            {produk.aktif
              ? 'Nonaktifkan'
              : 'Aktifkan'}
          </button>
        </form>

        <form
          action={
            toggleVerifikasiProdukUmkmAction
          }
        >
          <input
            type="hidden"
            name="id"
            value={
              produk.id
            }
          />

          <input
            type="hidden"
            name="terverifikasi"
            value={String(
              !produk.terverifikasi
            )}
          />

          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-100 px-3 text-xs font-extrabold text-blue-700 transition hover:bg-blue-200"
          >
            <BadgeCheck
              size={15}
            />

            {produk.terverifikasi
              ? 'Cabut Verifikasi'
              : 'Verifikasi'}
          </button>
        </form>

        <form
          action={
            hapusProdukUmkmAction
          }
        >
          <input
            type="hidden"
            name="id"
            value={
              produk.id
            }
          />

          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-red-100 px-3 text-xs font-extrabold text-red-700 transition hover:bg-red-200"
          >
            <Trash2
              size={15}
            />

            Hapus
          </button>
        </form>
      </div>

      <details className="border-t border-slate-200 bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-center gap-2 p-4 text-sm font-extrabold text-slate-700">
          <Pencil
            size={16}
          />

          Edit Produk
        </summary>

        <form
          action={
            ubahProdukUmkmAction
          }
          className="border-t border-slate-200 p-5"
        >
          <input
            type="hidden"
            name="id"
            value={
              produk.id
            }
          />

          <ProdukFormFields
            idPrefix={`edit-${produk.id}`}
            produk={
              produk
            }
          />

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-6 text-sm font-extrabold text-white transition hover:bg-slate-900 sm:w-auto"
            >
              <Save
                size={17}
              />

              Simpan Perubahan
            </button>
          </div>
        </form>
      </details>
    </article>
  );
}

/* =========================================================
   PRODUCT FORM
========================================================= */

function ProdukFormFields({
  idPrefix,
  produk,
  defaultUrutan = 0,
}: {
  idPrefix:
    string;

  produk?:
    ProdukUmkm;

  defaultUrutan?:
    number;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <TextInput
        idPrefix={
          idPrefix
        }
        name="nama_produk"
        label="Nama Produk"
        value={
          produk
            ?.nama_produk ??
          ''
        }
        placeholder="Contoh: Tethek Melek"
      />

      <TextInput
        idPrefix={
          idPrefix
        }
        name="slug"
        label="Slug"
        value={
          produk?.slug ??
          ''
        }
        placeholder="Otomatis dari nama produk"
        required={false}
      />

      <TextInput
        idPrefix={
          idPrefix
        }
        name="kategori"
        label="Kategori"
        value={
          produk?.kategori ??
          ''
        }
        placeholder="Makanan, Minuman, Kerajinan"
      />

      <TextInput
        idPrefix={
          idPrefix
        }
        name="satuan"
        label="Satuan"
        value={
          produk?.satuan ??
          'pcs'
        }
        placeholder="pcs, bungkus, botol"
      />

      <TextInput
        idPrefix={
          idPrefix
        }
        name="harga"
        label="Harga"
        type="number"
        value={String(
          produk?.harga ??
            0
        )}
        min={0}
      />

      <TextInput
        idPrefix={
          idPrefix
        }
        name="urutan"
        label="Nomor Urutan"
        type="number"
        value={String(
          produk?.urutan ??
            defaultUrutan
        )}
        min={0}
      />

      <div className="md:col-span-2">
        <TextArea
          idPrefix={
            idPrefix
          }
          name="deskripsi"
          label="Deskripsi Produk"
          value={
            produk
              ?.deskripsi ??
            ''
          }
          required={false}
          rows={4}
        />
      </div>

      <TextInput
        idPrefix={
          idPrefix
        }
        name="nama_penjual"
        label="Nama Penjual"
        value={
          produk
            ?.nama_penjual ??
          ''
        }
        placeholder="Nama pemilik UMKM"
      />

      <TextInput
        idPrefix={
          idPrefix
        }
        name="nomor_whatsapp"
        label="Nomor WhatsApp"
        value={
          produk
            ?.nomor_whatsapp ??
          ''
        }
        placeholder="Contoh: 081234567890"
        required={false}
      />

      <div className="md:col-span-2">
        <TextArea
          idPrefix={
            idPrefix
          }
          name="alamat"
          label="Alamat Penjual"
          value={
            produk?.alamat ??
            ''
          }
          required={false}
          rows={3}
        />
      </div>

      <div className="md:col-span-2">
        <TextInput
          idPrefix={
            idPrefix
          }
          name="lokasi_url"
          label="URL Google Maps"
          value={
            produk
              ?.lokasi_url ??
            ''
          }
          placeholder="https://maps.google.com/..."
          required={false}
        />
      </div>

      <div className="md:col-span-2">
        <TextInput
          idPrefix={
            idPrefix
          }
          name="gambar_url"
          label="URL atau Path Gambar"
          value={
            produk
              ?.gambar_url ??
            ''
          }
          placeholder="/images/umkm/produk.jpg atau https://..."
          required={false}
        />
      </div>

      <Checkbox
        id={`${idPrefix}-terverifikasi`}
        name="terverifikasi"
        label="Produk Terverifikasi"
        description="Tampilkan tanda verifikasi di samping nama penjual."
        checked={
          produk
            ?.terverifikasi ??
          false
        }
      />

      <Checkbox
        id={`${idPrefix}-aktif`}
        name="aktif"
        label="Produk Aktif"
        description="Produk ditampilkan pada halaman Lapak UMKM."
        checked={
          produk?.aktif ??
          true
        }
      />
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label:
    string;

  value:
    number;

  description:
    string;

  icon:
    LucideIcon;
}) {
  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-4xl font-black text-slate-900">
            {value}
          </p>

          <p className="mt-2 text-xs font-semibold text-slate-500">
            {
              description
            }
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

/* =========================================================
   MESSAGE
========================================================= */

function Message({
  type,
  text,
}: {
  type:
    | 'success'
    | 'error';

  text:
    string;
}) {
  const success =
    type ===
    'success';

  const Icon =
    success
      ? CheckCircle2
      : AlertCircle;

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 ${
        success
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-red-200 bg-red-50 text-red-700'
      }`}
    >
      <Icon
        size={20}
        className="mt-0.5 shrink-0"
      />

      <p className="text-sm font-semibold leading-6">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   INPUT
========================================================= */

function TextInput({
  idPrefix,
  name,
  label,
  value = '',
  placeholder,
  type = 'text',
  required = true,
  min,
}: {
  idPrefix:
    string;

  name:
    string;

  label:
    string;

  value?:
    string;

  placeholder?:
    string;

  type?:
    string;

  required?:
    boolean;

  min?:
    number;
}) {
  const id =
    `${idPrefix}-${name}`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        required={
          required
        }
        min={min}
        defaultValue={
          value
        }
        placeholder={
          placeholder
        }
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function TextArea({
  idPrefix,
  name,
  label,
  value = '',
  rows = 4,
  required = true,
}: {
  idPrefix:
    string;

  name:
    string;

  label:
    string;

  value?:
    string;

  rows?:
    number;

  required?:
    boolean;
}) {
  const id =
    `${idPrefix}-${name}`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <textarea
        id={id}
        name={name}
        rows={rows}
        required={
          required
        }
        defaultValue={
          value
        }
        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-7 text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}

/* =========================================================
   CHECKBOX
========================================================= */

function Checkbox({
  id,
  name,
  label,
  description,
  checked,
}: {
  id:
    string;

  name:
    string;

  label:
    string;

  description:
    string;

  checked:
    boolean;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
    >
      <input
        id={id}
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={
          checked
        }
        className="mt-1 h-4 w-4 shrink-0 accent-emerald-700"
      />

      <span>
        <span className="block text-sm font-extrabold text-slate-700">
          {label}
        </span>

        <span className="mt-1 block text-xs font-medium leading-5 text-slate-500">
          {
            description
          }
        </span>
      </span>
    </label>
  );
}