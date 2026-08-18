// app/(public)/data-desa/pertanahan/page.tsx

import type {
  Metadata,
} from 'next';

import {
  Database,
  FolderOpen,
  Image as ImageIcon,
  Landmark,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

import {
  notFound,
} from 'next/navigation';

import PertanahanAlbumGallery from '@/components/public/PertanahanAlbumGallery';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  PertanahanAlbumWithFotos,
  PertanahanFoto,
  PertanahanSettings,
} from '@/types/pertanahan';

/* =========================================================
   METADATA
========================================================= */

export const metadata:
  Metadata = {
  title:
    'Album Pertanahan Desa Keji | SIJI',

  description:
    'Dokumentasi dan album informasi pertanahan Desa Keji, Kecamatan Ungaran Barat, Kabupaten Semarang.',
};

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

/* =========================================================
   FALLBACK
========================================================= */

const fallbackSettings:
  PertanahanSettings = {
  setting_key:
    'utama',

  judul:
    'Album Pertanahan Desa Keji',

  deskripsi:
    'Dokumentasi pertanahan dan administrasi kewilayahan Desa Keji yang disajikan dalam bentuk album foto.',

  tahun_data:
    2026,

  sumber_data:
    'Pemerintah Desa Keji',

  catatan:
    'Dokumentasi ditampilkan untuk kepentingan informasi publik dan tidak memuat data pribadi pemilik tanah.',

  peta_url:
    null,

  aktif:
    true,

  updated_at:
    '',
};

/* =========================================================
   PAGE
========================================================= */

export default async function PertanahanPage() {
  const [
    settingsResult,
    albumResult,
    fotoResult,
  ] =
    await Promise.all([
      supabaseAdmin
        .from(
          'pertanahan_settings'
        )
        .select(`
          setting_key,
          judul,
          deskripsi,
          tahun_data,
          sumber_data,
          catatan,
          peta_url,
          aktif,
          created_at,
          updated_at
        `)
        .eq(
          'setting_key',
          'utama'
        )
        .maybeSingle(),

      supabaseAdmin
        .from(
          'pertanahan_album'
        )
        .select(`
          id,
          judul,
          slug,
          deskripsi,
          tahun,
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
          'pertanahan_foto'
        )
        .select(`
          id,
          album_id,
          foto_url,
          foto_path,
          caption,
          urutan,
          aktif,
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
          }
        )
        .order(
          'created_at',
          {
            ascending:
              true,
          }
        ),
    ]);

  if (
    settingsResult.error
  ) {
    console.error(
      'Gagal mengambil settings Pertanahan:',
      settingsResult.error
    );
  }

  if (
    albumResult.error
  ) {
    console.error(
      'Gagal mengambil album Pertanahan:',
      albumResult.error
    );
  }

  if (
    fotoResult.error
  ) {
    console.error(
      'Gagal mengambil foto Pertanahan:',
      fotoResult.error
    );
  }

  const settings =
    {
      ...fallbackSettings,

      ...(settingsResult.data ??
        {}),
    } as PertanahanSettings;

  if (
    !settings.aktif
  ) {
    notFound();
  }

  const photos =
    (
      fotoResult.data ??
      []
    ) as PertanahanFoto[];

  const albums =
    (
      albumResult.data ??
      []
    )
      .map(
        (
          album
        ) => ({
          ...album,

          fotos:
            photos.filter(
              (
                foto
              ) =>
                foto.album_id ===
                album.id
            ),
        })
      ) as PertanahanAlbumWithFotos[];

  const totalFoto =
    albums.reduce(
      (
        total,
        album
      ) =>
        total +
        album.fotos.length,
      0
    );

  return (
    <div className="min-h-screen overflow-x-clip bg-slate-50">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative isolate overflow-hidden bg-emerald-950 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/background.png')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#021b16] via-emerald-950/95 to-emerald-800/65" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#021b16] via-transparent to-black/20" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',

            backgroundSize:
              '28px 28px',
          }}
        />

        <div className="pointer-events-none absolute -right-36 -top-36 h-[500px] w-[500px] rounded-full border-[80px] border-white/[0.04]" />

        <div className="pointer-events-none absolute -bottom-36 left-1/4 h-[420px] w-[420px] rounded-full bg-emerald-300/[0.07] blur-[110px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 md:pb-28 md:pt-20 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-100 backdrop-blur">
              <FolderOpen
                size={15}
              />

              Dokumentasi Desa
            </div>

            <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-300">
              Data Desa Keji
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              {
                settings.judul
              }
            </h1>

            <p className="mt-6 max-w-3xl text-sm font-medium leading-7 text-emerald-50/85 md:text-base md:leading-8">
              {
                settings.deskripsi
              }
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-bold backdrop-blur">
                <MapPin
                  size={16}
                />

                Desa Keji
              </span>

              <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-bold backdrop-blur">
                <Landmark
                  size={16}
                />

                Ungaran Barat
              </span>

              {settings.tahun_data && (
                <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-xs font-bold text-emerald-100 backdrop-blur">
                  <Database
                    size={16}
                  />

                  Data{' '}
                  {
                    settings.tahun_data
                  }
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FLOATING STATS
      ===================================================== */}

      <section className="relative z-20 -mt-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 sm:grid-cols-2 lg:grid-cols-4">
            <QuickStat
              label="Album"
              value={String(
                albums.length
              )}
              icon={
                FolderOpen
              }
              primary
            />

            <QuickStat
              label="Dokumentasi"
              value={`${totalFoto} Foto`}
              icon={
                ImageIcon
              }
            />

            <QuickStat
              label="Wilayah"
              value="Desa Keji"
              icon={
                MapPin
              }
            />

            <QuickStat
              label="Sumber"
              value={
                settings.sumber_data ??
                'Pemerintah Desa'
              }
              icon={
                ShieldCheck
              }
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
        <section>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-700">
                Dokumentasi
                Pertanahan
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-900 md:text-3xl">
                Album Foto
                Pertanahan Desa Keji
              </h2>

              <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-slate-500">
                Pilih salah satu
                album untuk melihat
                dokumentasi secara
                lengkap.
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-extrabold text-emerald-700">
              <FolderOpen
                size={15}
              />

              {albums.length}{' '}
              Album Tersedia
            </span>
          </div>

          <div className="mt-8">
            <PertanahanAlbumGallery
              albums={
                albums
              }
            />
          </div>
        </section>

        {/* ===================================================
            INFORMATION
        =================================================== */}

        <section className="relative mt-12 overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-7 text-white shadow-xl md:p-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',

              backgroundSize:
                '25px 25px',
            }}
          />

          <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <ShieldCheck
                size={23}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
                Informasi Publik
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Dokumentasi
                Pertanahan Desa
              </h2>

              <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                {settings.catatan ||
                  'Dokumentasi pertanahan ditampilkan sebagai bagian dari informasi kewilayahan Desa Keji.'}
              </p>

              {settings.sumber_data && (
                <p className="mt-4 text-xs font-bold text-emerald-200">
                  Sumber:{' '}
                  {
                    settings.sumber_data
                  }
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   QUICK STAT
========================================================= */

function QuickStat({
  label,
  value,
  icon:
    Icon,
  primary =
    false,
}: {
  label:
    string;

  value:
    string;

  icon:
    typeof FolderOpen;

  primary?:
    boolean;
}) {
  return (
    <article
      className={`min-h-[150px] p-6 ${
        primary
          ? 'bg-emerald-800 text-white'
          : 'bg-white text-slate-900'
      }`}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          primary
            ? 'bg-white/10 text-emerald-100'
            : 'bg-emerald-100 text-emerald-700'
        }`}
      >
        <Icon
          size={21}
        />
      </div>

      <p
        className={`mt-5 text-[10px] font-extrabold uppercase tracking-[0.15em] ${
          primary
            ? 'text-emerald-200'
            : 'text-slate-400'
        }`}
      >
        {label}
      </p>

      <p className="mt-2 break-words text-lg font-black">
        {value}
      </p>
    </article>
  );
}