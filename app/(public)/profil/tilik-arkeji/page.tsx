// app/(public)/profil/tilik-arkeji/page.tsx

import type {
  Metadata,
} from 'next';

import Link from 'next/link';

import {
  Archive,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Image as ImageIcon,
  Images,
  Landmark,
  Users,
  type LucideIcon,
} from 'lucide-react';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

/* =========================================================
   METADATA
========================================================= */

export const metadata: Metadata = {
  title:
    'Tilik Arkeji – Arsip Desa Keji | SIJI',

  description:
    'Arsip sejarah kepemimpinan, struktur organisasi, penghargaan, dan pencapaian Desa Keji.',
};

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

/* =========================================================
   TYPES
========================================================= */

interface PengaturanTilik {
  judul:
    string;

  deskripsi:
    string;
}

interface KepalaDesaPublik {
  id:
    string;

  nama:
    string;

  periode_mulai:
    number;

  periode_selesai:
    number | null;

  biografi:
    string;

  foto_url:
    string | null;

  urutan:
    number;
}

interface PenghargaanPublik {
  id:
    string;

  nama_penghargaan:
    string;

  tahun:
    number;

  tingkat:
    string;

  penyelenggara:
    string;

  deskripsi:
    string;

  foto_url:
    string | null;

  urutan:
    number;
}

interface MediaTilikPublik {
  id:
    string;

  kategori:
    'struktur-organisasi';

  judul:
    string;

  deskripsi:
    string;

  gambar_url:
    string | null;

  urutan:
    number;
}

/* =========================================================
   FALLBACK
========================================================= */

const fallbackPengaturan:
  PengaturanTilik = {
  judul:
    'Tilik Arkeji',

  deskripsi:
    'Arsip digital kepemimpinan, struktur organisasi, dan pencapaian Desa Keji.',
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
  const result =
    safeString(
      value
    );

  return (
    result ||
    null
  );
}

/* =========================================================
   NORMALIZE SETTINGS
========================================================= */

function normalizePengaturan(
  value: unknown
): PengaturanTilik {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(
      value
    )
  ) {
    return fallbackPengaturan;
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  return {
    judul:
      safeString(
        row.judul
      ) ||
      fallbackPengaturan
        .judul,

    deskripsi:
      safeString(
        row.deskripsi
      ) ||
      fallbackPengaturan
        .deskripsi,
  };
}

/* =========================================================
   NORMALIZE KEPALA DESA
========================================================= */

function normalizeKepalaDesa(
  value: unknown
): KepalaDesaPublik | null {
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

  const nama =
    safeString(
      row.nama
    );

  const biografi =
    safeString(
      row.biografi
    );

  const periodeMulai =
    Number(
      row.periode_mulai
    );

  const periodeSelesai =
    row.periode_selesai ===
      null ||
    row.periode_selesai ===
      undefined
      ? null
      : Number(
          row.periode_selesai
        );

  const urutan =
    Number(
      row.urutan ??
        0
    );

  if (
    !id ||
    !nama ||
    !biografi ||
    !Number.isInteger(
      periodeMulai
    ) ||
    !Number.isInteger(
      urutan
    )
  ) {
    return null;
  }

  return {
    id,

    nama,

    periode_mulai:
      periodeMulai,

    periode_selesai:
      periodeSelesai !==
        null &&
      Number.isInteger(
        periodeSelesai
      )
        ? periodeSelesai
        : null,

    biografi,

    foto_url:
      nullableString(
        row.foto_url
      ),

    urutan,
  };
}

/* =========================================================
   NORMALIZE PENGHARGAAN
========================================================= */

function normalizePenghargaan(
  value: unknown
): PenghargaanPublik | null {
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

  const namaPenghargaan =
    safeString(
      row.nama_penghargaan
    );

  const tahun =
    Number(
      row.tahun
    );

  const tingkat =
    safeString(
      row.tingkat
    );

  const penyelenggara =
    safeString(
      row.penyelenggara
    );

  const deskripsi =
    safeString(
      row.deskripsi
    );

  const urutan =
    Number(
      row.urutan ??
        0
    );

  if (
    !id ||
    !namaPenghargaan ||
    !tingkat ||
    !penyelenggara ||
    !deskripsi ||
    !Number.isInteger(
      tahun
    ) ||
    !Number.isInteger(
      urutan
    )
  ) {
    return null;
  }

  return {
    id,

    nama_penghargaan:
      namaPenghargaan,

    tahun,

    tingkat,

    penyelenggara,

    deskripsi,

    foto_url:
      nullableString(
        row.foto_url
      ),

    urutan,
  };
}

/* =========================================================
   NORMALIZE STRUKTUR
========================================================= */

function normalizeMedia(
  value: unknown
): MediaTilikPublik | null {
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

  const kategori =
    safeString(
      row.kategori
    );

  const judul =
    safeString(
      row.judul
    );

  const urutan =
    Number(
      row.urutan ??
        0
    );

  if (
    !id ||
    !judul ||
    kategori !==
      'struktur-organisasi' ||
    !Number.isInteger(
      urutan
    )
  ) {
    return null;
  }

  return {
    id,

    kategori:
      'struktur-organisasi',

    judul,

    deskripsi:
      safeString(
        row.deskripsi
      ),

    gambar_url:
      nullableString(
        row.gambar_url
      ),

    urutan,
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function TilikArkejiPage() {
  const [
    pengaturanResult,
    kepalaDesaResult,
    penghargaanResult,
    mediaResult,
  ] =
    await Promise.all([
      /* ===================================================
         SETTINGS
      =================================================== */

      supabaseAdmin
        .from(
          'tilik_arkeji_settings'
        )
        .select(`
          judul,
          deskripsi
        `)
        .eq(
          'setting_key',
          'utama'
        )
        .maybeSingle(),

      /* ===================================================
         KEPALA DESA
      =================================================== */

      supabaseAdmin
        .from(
          'tilik_arkeji_mantan_kades'
        )
        .select(`
          id,
          nama,
          periode_mulai,
          periode_selesai,
          biografi,
          foto_url,
          urutan
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
          }
        )
        .order(
          'periode_mulai',
          {
            ascending:
              true,
          }
        ),

      /* ===================================================
         PENGHARGAAN
      =================================================== */

      supabaseAdmin
        .from(
          'tilik_arkeji_penghargaan'
        )
        .select(`
          id,
          nama_penghargaan,
          tahun,
          tingkat,
          penyelenggara,
          deskripsi,
          foto_url,
          urutan
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
          }
        )
        .order(
          'tahun',
          {
            ascending:
              false,
          }
        ),

      /* ===================================================
         STRUKTUR ORGANISASI
      =================================================== */

      supabaseAdmin
        .from(
          'tilik_arkeji_media'
        )
        .select(`
          id,
          kategori,
          judul,
          deskripsi,
          gambar_url,
          urutan
        `)
        .eq(
          'aktif',
          true
        )
        .eq(
          'kategori',
          'struktur-organisasi'
        )
        .order(
          'urutan',
          {
            ascending:
              true,
          }
        ),
    ]);

  /* =======================================================
     ERROR HANDLING
  ======================================================= */

  if (
    pengaturanResult.error
  ) {
    console.error(
      'Gagal mengambil pengaturan Tilik Arkeji:',
      {
        message:
          pengaturanResult
            .error
            .message,

        code:
          pengaturanResult
            .error
            .code,

        details:
          pengaturanResult
            .error
            .details,

        hint:
          pengaturanResult
            .error
            .hint,
      }
    );
  }

  if (
    kepalaDesaResult.error
  ) {
    console.error(
      'Gagal mengambil biografi kepala desa:',
      {
        message:
          kepalaDesaResult
            .error
            .message,

        code:
          kepalaDesaResult
            .error
            .code,

        details:
          kepalaDesaResult
            .error
            .details,

        hint:
          kepalaDesaResult
            .error
            .hint,
      }
    );
  }

  if (
    penghargaanResult.error
  ) {
    console.error(
      'Gagal mengambil penghargaan desa:',
      {
        message:
          penghargaanResult
            .error
            .message,

        code:
          penghargaanResult
            .error
            .code,

        details:
          penghargaanResult
            .error
            .details,

        hint:
          penghargaanResult
            .error
            .hint,
      }
    );
  }

  if (
    mediaResult.error
  ) {
    console.error(
      'Gagal mengambil struktur organisasi:',
      {
        message:
          mediaResult
            .error
            .message,

        code:
          mediaResult
            .error
            .code,

        details:
          mediaResult
            .error
            .details,

        hint:
          mediaResult
            .error
            .hint,
      }
    );
  }

  /* =======================================================
     NORMALIZED DATA
  ======================================================= */

  const pengaturan =
    normalizePengaturan(
      pengaturanResult.data
    );

  const daftarKepalaDesa =
    (
      kepalaDesaResult.data ??
      []
    )
      .map(
        normalizeKepalaDesa
      )
      .filter(
        (
          item
        ): item is KepalaDesaPublik =>
          item !==
          null
      );

  const daftarPenghargaan =
    (
      penghargaanResult.data ??
      []
    )
      .map(
        normalizePenghargaan
      )
      .filter(
        (
          item
        ): item is PenghargaanPublik =>
          item !==
          null
      );

  const strukturOrganisasi =
    (
      mediaResult.data ??
      []
    )
      .map(
        normalizeMedia
      )
      .filter(
        (
          item
        ): item is MediaTilikPublik =>
          item !==
          null
      );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen overflow-x-clip bg-slate-50">
      {/* ===================================================
          HERO
      =================================================== */}

      <section className="relative isolate overflow-hidden bg-emerald-950 text-white">
        {/* BACKGROUND */}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/background.png')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#021b16] via-emerald-950/95 to-emerald-900/55" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#021b16] via-transparent to-black/20" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',

            backgroundSize:
              '28px 28px',
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full border-[72px] border-white/[0.035]"
        />

        {/* CONTENT */}

        <div className="relative mx-auto max-w-[1500px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <Link
            href="/profil/sejarah"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-100/80 transition hover:text-white"
          >
            <ArrowLeft
              size={15}
            />

            Kembali ke Sejarah Desa
          </Link>

          <div className="mt-7 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            {/* INTRO */}

            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.17em] text-emerald-100 backdrop-blur sm:text-xs">
                <Archive
                  size={15}
                />

                Arsip Desa Keji
              </div>

              <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-300">
                {
                  pengaturan.judul
                }
              </p>

              <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Menilik Sejarah dan
                Pencapaian Desa Keji
              </h1>

              <p className="mt-5 max-w-3xl text-sm font-medium leading-7 text-emerald-50/85 sm:text-base">
                {
                  pengaturan.deskripsi
                }
              </p>
            </div>

            {/* STATISTIC */}

            <div className="grid w-full grid-cols-3 gap-3 xl:w-auto">
              <HeroStat
                value={String(
                  daftarKepalaDesa.length
                )}
                label="Kepala Desa"
              />

              <HeroStat
                value={String(
                  daftarPenghargaan.length
                )}
                label="Penghargaan"
              />

              <HeroStat
                value={String(
                  strukturOrganisasi.length
                )}
                label="Struktur"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <main className="mx-auto max-w-[1500px] space-y-16 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* =================================================
            BIOGRAFI KEPALA DESA
        ================================================= */}

        <section
          id="kepala-desa"
          className="relative scroll-mt-28"
        >
          {/*
           * Anchor lama tetap ada
           * supaya link lama #mantan-kades
           * tidak langsung rusak.
           */}

          <span
            id="mantan-kades"
            className="absolute -top-28"
            aria-hidden="true"
          />

          <SectionTitle
            label="Arsip Kepemimpinan"
            title="Biografi Kepala Desa Keji"
            description="Mengenal tokoh yang pernah memimpin dan berkontribusi terhadap perkembangan Desa Keji."
            icon={
              Users
            }
          />

          {daftarKepalaDesa.length >
          0 ? (
            <div className="mt-8 space-y-6">
              {daftarKepalaDesa.map(
                (
                  item,
                  index
                ) => (
                  <KepalaDesaCard
                    key={
                      item.id
                    }
                    data={
                      item
                    }
                    nomor={
                      index +
                      1
                    }
                  />
                )
              )}
            </div>
          ) : (
            <EmptyState
              icon={
                Landmark
              }
              title="Biografi kepala desa belum tersedia"
              description="Biografi kepala desa akan ditampilkan setelah data dipublikasikan melalui halaman administrator."
            />
          )}
        </section>

        {/* =================================================
            STRUKTUR ORGANISASI
        ================================================= */}

        <section
          id="struktur-organisasi"
          className="scroll-mt-28"
        >
          <SectionTitle
            label="Pemerintahan Desa"
            title="Struktur Organisasi"
            description="Susunan organisasi dan perangkat Pemerintah Desa Keji."
            icon={
              Landmark
            }
          />

          {strukturOrganisasi.length >
          0 ? (
            <div className="mt-8 grid gap-6">
              {strukturOrganisasi.map(
                (
                  item
                ) => (
                  <MediaCard
                    key={
                      item.id
                    }
                    data={
                      item
                    }
                  />
                )
              )}
            </div>
          ) : (
            <EmptyState
              icon={
                Landmark
              }
              title="Gambar struktur organisasi belum tersedia"
              description="Struktur organisasi akan tampil setelah gambar diunggah melalui halaman administrator."
            />
          )}
        </section>

        {/* =================================================
            PENGHARGAAN
        ================================================= */}

        <section
          id="penghargaan"
          className="scroll-mt-28"
        >
          <SectionTitle
            label="Arsip Prestasi"
            title="Penghargaan Desa Keji"
            description="Catatan penghargaan, apresiasi, dan pencapaian yang pernah diraih Desa Keji."
            icon={
              BadgeCheck
            }
          />

          {daftarPenghargaan.length >
          0 ? (
            <div className="mt-8 space-y-6">
              {daftarPenghargaan.map(
                (
                  item,
                  index
                ) => (
                  <PenghargaanCard
                    key={
                      item.id
                    }
                    data={
                      item
                    }
                    nomor={
                      index +
                      1
                    }
                  />
                )
              )}
            </div>
          ) : (
            <EmptyState
              icon={
                BadgeCheck
              }
              title="Penghargaan desa belum tersedia"
              description="Catatan penghargaan akan ditampilkan setelah dipublikasikan melalui halaman administrator."
            />
          )}
        </section>

        {/* =================================================
            GALERI CTA
        ================================================= */}

        <section>
          <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 p-6 text-white shadow-lg sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.1]"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',

                backgroundSize:
                  '24px 24px',
              }}
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full border-[42px] border-white/[0.04]"
            />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                  <Images
                    size={23}
                  />
                </div>

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                    Dokumentasi Desa
                  </p>

                  <h2 className="mt-2 text-xl font-black sm:text-2xl">
                    Album Galeri Desa
                    Keji
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-emerald-50/80">
                    Dokumentasi kegiatan,
                    budaya, pemerintahan,
                    pembangunan, dan
                    berbagai aktivitas Desa
                    Keji tersedia pada
                    halaman Galeri Desa.
                  </p>
                </div>
              </div>

              <Link
                href="/data-desa/galeri"
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-xs font-extrabold text-emerald-900 transition hover:bg-emerald-50"
              >
                <Images
                  size={16}
                />

                Lihat Galeri

                <ArrowRight
                  size={14}
                />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   KEPALA DESA CARD
========================================================= */

function KepalaDesaCard({
  data,
  nomor,
}: {
  data:
    KepalaDesaPublik;

  nomor:
    number;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition duration-300 hover:border-emerald-300 hover:shadow-lg">
      <div className="grid md:grid-cols-[260px_minmax(0,1fr)]">
        {/* FOTO */}

        <div className="relative min-h-72 overflow-hidden bg-gradient-to-br from-emerald-950 to-emerald-700">
          {data.foto_url ? (
            <img
              src={
                data.foto_url
              }
              alt={`Foto ${data.nama}`}
              loading="lazy"
              className="h-full min-h-72 w-full object-cover object-top"
            />
          ) : (
            <div className="flex h-full min-h-72 flex-col items-center justify-center p-6 text-center text-white">
              <Landmark
                size={52}
              />

              <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                Kepala Desa Keji
              </p>
            </div>
          )}

          <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-black text-white backdrop-blur">
            {String(
              nomor
            ).padStart(
              2,
              '0'
            )}
          </span>
        </div>

        {/* CONTENT */}

        <div className="p-6 sm:p-8 lg:p-9">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
            Masa Jabatan
          </p>

          <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
            <CalendarDays
              size={14}
            />

            {
              data.periode_mulai
            }

            {' – '}

            {
              data.periode_selesai ??
              'Sekarang'
            }
          </p>

          <h2 className="mt-5 text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
            {
              data.nama
            }
          </h2>

          <p className="mt-5 whitespace-pre-line text-sm font-medium leading-8 text-slate-600 sm:text-[15px]">
            {
              data.biografi
            }
          </p>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   PENGHARGAAN CARD
========================================================= */

function PenghargaanCard({
  data,
  nomor,
}: {
  data:
    PenghargaanPublik;

  nomor:
    number;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition duration-300 hover:border-emerald-300 hover:shadow-lg">
      <div className="grid md:grid-cols-[260px_minmax(0,1fr)]">
        {/* FOTO */}

        <div className="relative min-h-72 overflow-hidden bg-gradient-to-br from-emerald-950 to-emerald-700">
          {data.foto_url ? (
            <img
              src={
                data.foto_url
              }
              alt={`Dokumentasi ${data.nama_penghargaan}`}
              loading="lazy"
              className="h-full min-h-72 w-full object-cover object-center"
            />
          ) : (
            <div className="flex h-full min-h-72 flex-col items-center justify-center p-6 text-center text-white">
              <BadgeCheck
                size={52}
              />

              <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                Penghargaan Desa
                Keji
              </p>
            </div>
          )}

          <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-black text-white backdrop-blur">
            {String(
              nomor
            ).padStart(
              2,
              '0'
            )}
          </span>
        </div>

        {/* CONTENT */}

        <div className="p-6 sm:p-8 lg:p-9">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
              {
                data.tahun
              }
            </span>

            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
              Tingkat{' '}
              {
                data.tingkat
              }
            </span>
          </div>

          <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
            Arsip Prestasi
          </p>

          <h2 className="mt-2 text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
            {
              data.nama_penghargaan
            }
          </h2>

          <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-emerald-600">
              Penyelenggara
            </p>

            <p className="mt-1 text-sm font-black text-emerald-900">
              {
                data.penyelenggara
              }
            </p>
          </div>

          <p className="mt-5 whitespace-pre-line text-sm font-medium leading-8 text-slate-600 sm:text-[15px]">
            {
              data.deskripsi
            }
          </p>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   STRUKTUR ORGANISASI CARD
========================================================= */

function MediaCard({
  data,
}: {
  data:
    MediaTilikPublik;
}) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition duration-300 hover:border-emerald-300 hover:shadow-lg">
      {/* IMAGE */}

      <div className="overflow-hidden bg-white">
        {data.gambar_url ? (
          <img
            src={
              data.gambar_url
            }
            alt={
              data.judul
            }
            loading="lazy"
            className="max-h-[760px] min-h-[320px] w-full bg-white object-contain p-4 transition duration-500 group-hover:scale-[1.01] sm:p-8"
          />
        ) : (
          <div className="flex min-h-[320px] flex-col items-center justify-center bg-gradient-to-br from-emerald-950 to-emerald-800 text-emerald-200">
            <ImageIcon
              size={48}
            />

            <p className="mt-3 text-xs font-extrabold uppercase tracking-wider">
              Struktur Organisasi
            </p>
          </div>
        )}
      </div>

      {/* CONTENT */}

      <div className="border-t border-emerald-100 p-5 sm:p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
          Struktur Organisasi
        </p>

        <h3 className="mt-2 text-lg font-black text-slate-900">
          {
            data.judul
          }
        </h3>

        {data.deskripsi && (
          <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
            {
              data.deskripsi
            }
          </p>
        )}
      </div>
    </article>
  );
}

/* =========================================================
   SECTION TITLE

   Tidak ada lagi Google Drive di:
   - Biografi Kepala Desa
   - Struktur Organisasi
   - Penghargaan Desa
========================================================= */

function SectionTitle({
  label,
  title,
  description,
  icon: Icon,
}: {
  label:
    string;

  title:
    string;

  description:
    string;

  icon:
    LucideIcon;
}) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-md shadow-emerald-900/10">
          <Icon
            size={23}
          />
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
            {
              label
            }
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
            {
              title
            }
          </h2>

          <p className="mt-3 max-w-4xl text-sm font-medium leading-7 text-slate-500">
            {
              description
            }
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon:
    LucideIcon;

  title:
    string;

  description:
    string;
}) {
  return (
    <div className="mt-8 rounded-3xl border border-dashed border-emerald-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-300">
        <Icon
          size={34}
        />
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-800">
        {
          title
        }
      </h3>

      <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-6 text-slate-500">
        {
          description
        }
      </p>
    </div>
  );
}

/* =========================================================
   HERO STAT
========================================================= */

function HeroStat({
  value,
  label,
}: {
  value:
    string;

  label:
    string;
}) {
  return (
    <article className="min-w-0 rounded-2xl border border-white/15 bg-white/10 px-3 py-4 backdrop-blur sm:min-w-28 sm:px-5">
      <p className="text-2xl font-black text-white">
        {
          value
        }
      </p>

      <p className="mt-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-emerald-200 sm:text-[10px]">
        {
          label
        }
      </p>
    </article>
  );
}