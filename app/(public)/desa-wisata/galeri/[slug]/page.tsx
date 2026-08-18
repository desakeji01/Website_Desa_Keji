// app/(public)/desa-wisata/galeri/[slug]/page.tsx

import type {
  Metadata,
} from 'next';

import Link from 'next/link';

import {
  ArrowLeft,
  CalendarDays,
  Camera,
  ExternalLink,
  Image as ImageIcon,
  Images,
  Info,
  MapPin,
} from 'lucide-react';

import {
  notFound,
} from 'next/navigation';

import SidebarLayanan from '@/components/SidebarLayanan';
import SidebarTilikArkeji from '@/components/SidebarTilikArkeji';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  PilihanLayanan,
} from '@/types/layanan';

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

/* =========================================================
   TYPES
========================================================= */

interface PageProps {
  params: Promise<{
    slug:
      string;
  }>;
}

interface AlbumRow {
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
}

interface AlbumPublik {
  id:
    string;

  judul:
    string;

  slug:
    string;

  deskripsi:
    string;

  kategori:
    string;

  tanggalKegiatan:
    | string
    | null;

  lokasi:
    string;

  fotoSampulUrl:
    | string
    | null;
}

interface FotoRow {
  id:
    | string
    | number
    | null;

  url_foto:
    | string
    | null;

  caption:
    | string
    | null;

  alt_text:
    | string
    | null;

  urutan:
    | number
    | string
    | null;
}

interface FotoPublik {
  id:
    string;

  urlFoto:
    string;

  caption:
    | string
    | null;

  altText:
    string;

  urutan:
    number;
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

function nullableString(
  value: unknown
) {
  const result =
    safeString(
      value
    );

  return result || null;
}

function safeInteger(
  value: unknown,
  fallback = 0
) {
  const number =
    Number(
      value
    );

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

function normalizeAlbum(
  value: unknown
): AlbumPublik | null {
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
    value as AlbumRow;

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

    tanggalKegiatan:
      nullableString(
        row.tanggal_kegiatan
      ),

    lokasi:
      safeString(
        row.lokasi
      ) ||
      'Desa Keji',

    fotoSampulUrl:
      nullableString(
        row.foto_sampul_url
      ),
  };
}

function normalizeFoto(
  value: unknown,
  judulAlbum: string
): FotoPublik | null {
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
    value as FotoRow;

  const id =
    safeString(
      row.id
    );

  const urlFoto =
    safeString(
      row.url_foto
    );

  if (
    !id ||
    !urlFoto
  ) {
    return null;
  }

  return {
    id,
    urlFoto,

    caption:
      nullableString(
        row.caption
      ),

    altText:
      safeString(
        row.alt_text
      ) ||
      `Dokumentasi ${judulAlbum}`,

    urutan:
      safeInteger(
        row.urutan
      ),
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
    Number.isFinite(
      value
    )
      ? value
      : 0
  );
}

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const {
    slug,
  } =
    await params;

  const normalizedSlug =
    decodeURIComponent(
      slug
    ).trim();

  if (
    !normalizedSlug
  ) {
    return {
      title:
        'Album Galeri Desa Wisata Keji | SIJI',

      description:
        'Dokumentasi kegiatan Desa Keji.',
    };
  }

  const {
    data,
  } =
    await supabaseAdmin
      .from(
        'album_galeri'
      )
      .select(`
        judul,
        deskripsi
      `)
      .eq(
        'slug',
        normalizedSlug
      )
      .eq(
        'aktif',
        true
      )
      .maybeSingle();

  const judul =
    safeString(
      data?.judul
    );

  const deskripsi =
    safeString(
      data?.deskripsi
    );

  return {
    title:
      judul
        ? `${judul} | Galeri Desa Wisata Keji`
        : 'Album Galeri Desa Wisata Keji | SIJI',

    description:
      deskripsi ||
      'Dokumentasi kegiatan, budaya, masyarakat, dan potensi Desa Keji.',
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function DetailAlbumDesaWisataPage({
  params,
}: PageProps) {
  const {
    slug,
  } =
    await params;

  const normalizedSlug =
    decodeURIComponent(
      slug
    ).trim();

  if (
    !normalizedSlug
  ) {
    notFound();
  }

  /* =======================================================
     FETCH ALBUM + LAYANAN
  ======================================================= */

  const [
    albumResult,
    layananResult,
  ] =
    await Promise.all([
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
          foto_sampul_url
        `)
        .eq(
          'slug',
          normalizedSlug
        )
        .eq(
          'aktif',
          true
        )
        .maybeSingle(),

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
            ascending:
              true,

            nullsFirst:
              false,
          }
        )
        .order(
          'nama',
          {
            ascending:
              true,
          }
        ),
    ]);

  if (
    albumResult.error
  ) {
    console.error(
      'Gagal mengambil detail album Desa Wisata:',
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

    notFound();
  }

  const album =
    normalizeAlbum(
      albumResult.data
    );

  if (!album) {
    notFound();
  }

  if (
    layananResult.error
  ) {
    console.error(
      'Gagal mengambil daftar layanan:',
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
     FETCH FOTO
  ======================================================= */

  const fotoResult =
    await supabaseAdmin
      .from(
        'foto_galeri'
      )
      .select(`
        id,
        url_foto,
        caption,
        alt_text,
        urutan
      `)
      .eq(
        'album_id',
        album.id
      )
      .order(
        'urutan',
        {
          ascending:
            true,

          nullsFirst:
            false,
        }
      );

  if (
    fotoResult.error
  ) {
    console.error(
      'Gagal mengambil foto album:',
      {
        message:
          fotoResult.error
            .message,

        code:
          fotoResult.error
            .code,

        details:
          fotoResult.error
            .details,

        hint:
          fotoResult.error
            .hint,
      }
    );
  }

  const daftarFoto =
    (
      fotoResult.data ??
      []
    )
      .map(
        (foto) =>
          normalizeFoto(
            foto,
            album.judul
          )
      )
      .filter(
        (
          foto
        ): foto is FotoPublik =>
          foto !== null
      );

  /* =======================================================
     SIDEBAR
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

          const layananSlug =
            safeString(
              layanan.slug
            );

          return {
            id,
            nama,

            slug:
              layananSlug,
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

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ===================================================
            BACK
        =================================================== */}

        <Link
          href="/desa-wisata/galeri"
          className="mb-6 inline-flex min-h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 text-sm font-extrabold text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900"
        >
          <ArrowLeft
            size={17}
          />

          Kembali ke Galeri
        </Link>

        {/* ===================================================
            HERO ALBUM
        =================================================== */}

        <header className="relative mb-8 overflow-hidden rounded-3xl bg-emerald-950 text-white shadow-xl">
          <div className="relative min-h-[340px] overflow-hidden sm:min-h-[400px]">
            {album.fotoSampulUrl ? (
              <img
                src={
                  album.fotoSampulUrl
                }
                alt={`Sampul album ${album.judul}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700">
                <Images
                  size={76}
                  className="text-emerald-300/60"
                />
              </div>
            )}

            {/* Overlay */}

            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/65 to-emerald-900/20" />

            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-black/20" />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)',

                backgroundSize:
                  '26px 26px',
              }}
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[52px] border-white/[0.04]"
            />

            {/* Content */}

            <div className="relative flex min-h-[340px] max-w-4xl flex-col justify-end px-6 py-8 sm:min-h-[400px] sm:px-8 sm:py-10">
              <span className="w-fit rounded-full border border-white/15 bg-emerald-700/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-white backdrop-blur">
                {album.kategori}
              </span>

              <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {album.judul}
              </h1>

              <div className="mt-6 flex flex-wrap gap-3">
                <HeroBadge
                  icon={
                    CalendarDays
                  }
                >
                  {formatTanggal(
                    album.tanggalKegiatan
                  )}
                </HeroBadge>

                <HeroBadge
                  icon={
                    MapPin
                  }
                >
                  {album.lokasi}
                </HeroBadge>

                <HeroBadge
                  icon={
                    Images
                  }
                >
                  {formatAngka(
                    daftarFoto.length
                  )}{' '}
                  foto
                </HeroBadge>
              </div>
            </div>
          </div>
        </header>

        {/* ===================================================
            LAYOUT
        =================================================== */}

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* =================================================
              MAIN
          ================================================= */}

          <main className="min-w-0 space-y-7 lg:w-2/3">
            {/* ===============================================
                DESKRIPSI
            =============================================== */}

            <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Info
                    size={21}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Tentang Album
                  </p>

                  <h2 className="mt-1 text-xl font-black text-slate-900">
                    Informasi
                    Dokumentasi
                  </h2>

                  <p className="mt-4 whitespace-pre-line text-sm font-medium leading-8 text-slate-600">
                    {
                      album.deskripsi
                    }
                  </p>
                </div>
              </div>
            </section>

            {/* ===============================================
                FOTO
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
                    Koleksi Foto
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-slate-900">
                    Dokumentasi Album
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                    Klik gambar untuk
                    membuka foto dalam
                    ukuran penuh.
                  </p>
                </div>
              </div>

              {daftarFoto.length ===
              0 ? (
                <EmptyState />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  {daftarFoto.map(
                    (
                      foto,
                      index
                    ) => (
                      <FotoCard
                        key={
                          foto.id
                        }
                        foto={
                          foto
                        }
                        nomor={
                          index +
                          1
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
   HERO BADGE
========================================================= */

function HeroBadge({
  icon: Icon,
  children,
}: {
  icon:
    typeof Images;

  children:
    React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-white/90 backdrop-blur">
      <Icon
        size={14}
      />

      {children}
    </span>
  );
}

/* =========================================================
   FOTO CARD
========================================================= */

function FotoCard({
  foto,
  nomor,
}: {
  foto:
    FotoPublik;

  nomor:
    number;
}) {
  return (
    <a
      href={
        foto.urlFoto
      }
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-emerald-50">
        <img
          src={
            foto.urlFoto
          }
          alt={
            foto.altText
          }
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/65 to-transparent" />

        <span className="absolute left-4 top-4 rounded-full bg-emerald-700/90 px-3 py-1.5 text-[10px] font-black text-white backdrop-blur">
          {String(
            nomor
          ).padStart(
            2,
            '0'
          )}
        </span>

        <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-extrabold text-white backdrop-blur">
          <ExternalLink
            size={13}
          />

          Buka Foto
        </span>
      </div>

      {foto.caption && (
        <div className="flex flex-1 items-start p-5">
          <p className="text-sm font-medium leading-7 text-slate-600">
            {
              foto.caption
            }
          </p>
        </div>
      )}
    </a>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-emerald-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-300">
        <ImageIcon
          size={34}
        />
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-800">
        Foto belum tersedia
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
        Foto dokumentasi akan tampil
        setelah ditambahkan dan
        dipublikasikan melalui halaman
        administrator.
      </p>
    </div>
  );
}