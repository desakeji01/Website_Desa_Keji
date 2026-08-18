// app/(public)/desa-wisata/galeri/page.tsx

import type { Metadata } from 'next';

import Link from 'next/link';

import {
  ArrowRight,
  CalendarDays,
  Camera,
  Images,
  Info,
  MapPin,
} from 'lucide-react';

import SidebarLayanan from '@/components/SidebarLayanan';
import SidebarTilikArkeji from '@/components/SidebarTilikArkeji';

import { supabaseAdmin } from '@/lib/supabase-admin';

import type {
  PilihanLayanan,
} from '@/types/layanan';

export const metadata: Metadata = {
  title:
    'Galeri Desa Wisata Keji | SIJI',

  description:
    'Dokumentasi kegiatan, budaya, masyarakat, pembangunan, dan potensi wisata Desa Keji.',
};

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

/* =========================================================
   TYPES
========================================================= */

interface FotoCountRow {
  count:
    | number
    | string
    | null;
}

interface AlbumPublikRow {
  id:
    | string
    | number
    | null;

  judul:
    | string
    | null;

  slug:
    | string
    | null;

  deskripsi:
    | string
    | null;

  kategori:
    | string
    | null;

  tanggal_kegiatan:
    | string
    | null;

  lokasi:
    | string
    | null;

  foto_sampul_url:
    | string
    | null;

  foto_galeri:
    | FotoCountRow[]
    | null;
}

interface AlbumPublik {
  id: string;
  judul: string;
  slug: string;
  deskripsi: string;
  kategori: string;

  tanggal_kegiatan:
    | string
    | null;

  lokasi: string;

  foto_sampul_url:
    | string
    | null;

  jumlahFoto: number;
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

function safeInteger(
  value: unknown,
  fallback = 0
) {
  const number =
    Number(value);

  if (
    !Number.isInteger(
      number
    ) ||
    number < 0
  ) {
    return fallback;
  }

  return number;
}

function nullableString(
  value: unknown
) {
  const result =
    safeString(value);

  return result || null;
}

function normalizeAlbum(
  value: unknown
): AlbumPublik | null {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(value)
  ) {
    return null;
  }

  const row =
    value as AlbumPublikRow;

  const id =
    safeString(
      row.id
    );

  const judul =
    safeString(
      row.judul
    );

  const slug =
    safeString(
      row.slug
    );

  if (
    !id ||
    !judul ||
    !slug
  ) {
    return null;
  }

  const jumlahFoto =
    safeInteger(
      row.foto_galeri?.[0]
        ?.count
    );

  return {
    id,
    judul,
    slug,

    deskripsi:
      safeString(
        row.deskripsi
      ) ||
      'Dokumentasi kegiatan dan perkembangan Desa Keji.',

    kategori:
      safeString(
        row.kategori
      ) ||
      'Dokumentasi Desa',

    tanggal_kegiatan:
      nullableString(
        row.tanggal_kegiatan
      ),

    lokasi:
      safeString(
        row.lokasi
      ) ||
      'Desa Keji',

    foto_sampul_url:
      nullableString(
        row.foto_sampul_url
      ),

    jumlahFoto,
  };
}

function formatTanggal(
  value:
    | string
    | null
) {
  if (!value) {
    return 'Tanggal belum tersedia';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return 'Tanggal belum tersedia';
  }

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone:
        'Asia/Jakarta',
    }
  ).format(date);
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

/* =========================================================
   PAGE
========================================================= */

export default async function GaleriDesaWisataPage() {
  const [
    albumResult,
    layananResult,
  ] = await Promise.all([
    supabaseAdmin
      .from(
        'album_galeri'
      )
      .select(`
        id,
        judul,
        slug,
        deskripsi,
        kategori,
        tanggal_kegiatan,
        lokasi,
        foto_sampul_url,
        foto_galeri(count)
      `)
      .eq(
        'aktif',
        true
      )
      .order(
        'urutan',
        {
          ascending: true,
          nullsFirst: false,
        }
      )
      .order(
        'tanggal_kegiatan',
        {
          ascending: false,
          nullsFirst: false,
        }
      ),

    supabaseAdmin
      .from(
        'layanan'
      )
      .select(`
        id,
        nama,
        slug
      `)
      .eq(
        'aktif',
        true
      )
      .order(
        'urutan',
        {
          ascending: true,
          nullsFirst: false,
        }
      )
      .order(
        'nama',
        {
          ascending: true,
        }
      ),
  ]);

  /* =======================================================
     ERROR
  ======================================================= */

  if (
    albumResult.error
  ) {
    console.error(
      'Gagal mengambil Galeri Desa Wisata:',
      {
        message:
          albumResult.error
            .message,

        code:
          albumResult.error
            .code,

        details:
          albumResult.error
            .details,

        hint:
          albumResult.error
            .hint,
      }
    );
  }

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

  /* =======================================================
     ALBUM
  ======================================================= */

  const daftarAlbum =
    (
      albumResult.data ??
      []
    )
      .map(
        normalizeAlbum
      )
      .filter(
        (
          album
        ): album is AlbumPublik =>
          album !== null
      );

  /* =======================================================
     LAYANAN
  ======================================================= */

  const daftarLayanan:
    PilihanLayanan[] =
    (
      (
        layananResult.data ??
        []
      ) as LayananRow[]
    )
      .map(
        (layanan) => {
          const id =
            Number(
              layanan.id
            );

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
        }
      )
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

  /* =======================================================
     STATISTIK
  ======================================================= */

  const jumlahAlbum =
    daftarAlbum.length;

  const jumlahFoto =
    daftarAlbum.reduce(
      (
        total,
        album
      ) =>
        total +
        album.jumlahFoto,
      0
    );

  const jumlahKategori =
    new Set(
      daftarAlbum.map(
        (album) =>
          album.kategori
      )
    ).size;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ===================================================
            HEADER
        =================================================== */}

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
              <Images
                size={24}
              />
            </div>

            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
              Desa Wisata Keji
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Galeri Desa Keji
            </h1>

            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80 sm:text-base">
              Jelajahi dokumentasi
              kegiatan, budaya,
              masyarakat, pembangunan,
              dan berbagai potensi yang
              dimiliki Desa Keji.
            </p>

            {/* Statistik */}

            <div className="mt-6 flex flex-wrap gap-3">
              <HeaderBadge
                label={`${formatAngka(
                  jumlahAlbum
                )} album`}
              />

              <HeaderBadge
                label={`${formatAngka(
                  jumlahFoto
                )} foto`}
              />

              <HeaderBadge
                label={`${formatAngka(
                  jumlahKategori
                )} kategori`}
              />
            </div>
          </div>
        </header>

        {/* ===================================================
            MAIN GRID
        =================================================== */}

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* =================================================
              KONTEN UTAMA
          ================================================= */}

          <main className="min-w-0 space-y-7 lg:w-2/3">
            {/* ===============================================
                INFORMASI
            =============================================== */}

            <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
                  <Info
                    size={21}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Dokumentasi
                    Desa Wisata
                  </p>

                  <h2 className="mt-1 font-black text-emerald-950">
                    Galeri Desa Keji
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-emerald-800">
                    Pilih salah satu
                    album untuk melihat
                    kumpulan dokumentasi
                    secara lebih lengkap.
                    Galeri ini
                    menggunakan
                    dokumentasi yang
                    sama dengan Galeri
                    Desa Keji.
                  </p>
                </div>
              </div>
            </section>

            {/* ===============================================
                ALBUM
            =============================================== */}

            <section>
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
                  <Camera
                    size={21}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Koleksi Dokumentasi
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-slate-900">
                    Album Galeri Desa
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                    Dokumentasi
                    kegiatan, budaya,
                    pemerintahan,
                    pembangunan,
                    wisata, dan
                    kehidupan masyarakat
                    Desa Keji.
                  </p>
                </div>
              </div>

              {daftarAlbum.length ===
              0 ? (
                <EmptyState />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  {daftarAlbum.map(
                    (album) => (
                      <AlbumCard
                        key={
                          album.id
                        }
                        album={
                          album
                        }
                      />
                    )
                  )}
                </div>
              )}
            </section>
          </main>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="min-w-0 lg:w-1/3">
            <div className="flex flex-col gap-8">
              <SidebarLayanan
                daftarLayanan={
                  daftarLayanan
                }
                sticky={
                  false
                }
              />

              <SidebarTilikArkeji />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ALBUM CARD
========================================================= */

function AlbumCard({
  album,
}: {
  album:
    AlbumPublik;
}) {
  return (
    <Link
      href={`/desa-wisata/galeri/${album.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl"
    >
      {/* Image */}

      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-emerald-100 to-emerald-50">
        {album.foto_sampul_url ? (
          <img
            src={
              album.foto_sampul_url
            }
            alt={`Sampul album ${album.judul}`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-emerald-300">
            <Images
              size={46}
            />

            <p className="mt-3 text-xs font-extrabold uppercase tracking-wider">
              Galeri Desa
            </p>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Kategori */}

        <span className="absolute left-4 top-4 max-w-[70%] truncate rounded-full bg-emerald-700/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur">
          {album.kategori}
        </span>

        {/* Jumlah foto */}

        <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-extrabold text-white backdrop-blur">
          <Images
            size={13}
          />

          {formatAngka(
            album.jumlahFoto
          )}{' '}
          foto
        </span>
      </div>

      {/* Content */}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h2 className="text-lg font-black leading-7 text-slate-900 transition group-hover:text-emerald-700">
          {album.judul}
        </h2>

        <p className="mt-2 line-clamp-3 flex-1 text-sm font-medium leading-7 text-slate-500">
          {album.deskripsi}
        </p>

        {/* Metadata */}

        <div className="mt-5 space-y-2.5 border-t border-emerald-100 pt-4 text-xs font-semibold text-slate-500">
          <p className="flex items-center gap-2">
            <CalendarDays
              size={14}
              className="shrink-0 text-emerald-700"
            />

            <span>
              {formatTanggal(
                album.tanggal_kegiatan
              )}
            </span>
          </p>

          <p className="flex items-center gap-2">
            <MapPin
              size={14}
              className="shrink-0 text-emerald-700"
            />

            <span className="line-clamp-1">
              {album.lokasi}
            </span>
          </p>
        </div>

        {/* Action */}

        <div className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold text-emerald-700">
          Lihat Album

          <ArrowRight
            size={14}
            className="transition group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-emerald-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-300">
        <Images
          size={34}
        />
      </div>

      <h2 className="mt-5 text-lg font-black text-slate-800">
        Galeri belum tersedia
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
        Album dokumentasi akan tampil
        setelah dipublikasikan oleh
        administrator website Desa
        Keji.
      </p>
    </div>
  );
}

/* =========================================================
   HEADER BADGE
========================================================= */

function HeaderBadge({
  label,
}: {
  label:
    string;
}) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-emerald-50 backdrop-blur">
      {label}
    </span>
  );
}