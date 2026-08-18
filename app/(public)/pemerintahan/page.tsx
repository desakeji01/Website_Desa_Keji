// app/(public)/pemerintahan/page.tsx

import Image from 'next/image';

import Link from 'next/link';

import {
  Archive,
  ArrowRight,
  Building2,
  Calendar,
  Camera,
  Eye,
  ExternalLink,
  Landmark,
  MapPin,
  ShieldCheck,
  User,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';

import SidebarLayanan from '@/components/SidebarLayanan';
import SidebarTilikArkeji from '@/components/SidebarTilikArkeji';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  PilihanLayanan,
} from '@/types/layanan';

import {
  KELOMPOK_PERANGKAT,
  type KelompokPerangkat,
  type PemerintahanDesaData,
  type PerangkatDesaData,
} from '@/types/pemerintahan';

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

/* =========================================================
   CONFIG
========================================================= */

const PEMERINTAHAN_KEY =
  'utama';

const SOTK_IMAGE =
  '/SOTK.jpeg';

/* =========================================================
   TYPES
========================================================= */

interface LayananRow {
  id:
    | number
    | string
    | null;

  nama:
    string | null;

  slug:
    string | null;
}

interface GroupConfig {
  key: KelompokPerangkat;

  title: string;

  description: string;

  icon: LucideIcon;
}

/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const defaultPemerintahan:
  PemerintahanDesaData = {
  pemerintahan_key:
    PEMERINTAHAN_KEY,

  sekilas_info:
    'Struktur Organisasi dan Tata Kerja Pemerintah Desa Keji, Kecamatan Ungaran Barat, Kabupaten Semarang.',

  judul_halaman:
    'Pemerintah Desa Keji',

  judul_sotk:
    'Struktur Organisasi dan Tata Kerja',

  lokasi_pemerintahan:
    'Kecamatan Ungaran Barat, Kabupaten Semarang',

  tanggal_publikasi:
    '2026-08-08',

  penulis:
    'Admin Desa',

  deskripsi_kepala_desa:
    'Kepala Desa memimpin penyelenggaraan pemerintahan, pembangunan, pembinaan kemasyarakatan, dan pemberdayaan masyarakat Desa Keji.',

  deskripsi_perangkat:
    'Perangkat desa membantu Kepala Desa sesuai bidang tugas dan wilayah kerjanya.',

  catatan:
    'Data struktur, nama, jabatan, dan foto perangkat desa diperbarui melalui sistem administrasi website.',

  updated_at:
    '',
};

/* =========================================================
   GROUP CONFIG
========================================================= */

const groupConfig:
  GroupConfig[] = [
    {
      key:
        'Sekretariat Desa',

      title:
        'Unsur Sekretariat Desa',

      description:
        'Membantu Kepala Desa dalam penyelenggaraan administrasi, perencanaan, dan pengelolaan pemerintahan desa.',

      icon:
        Building2,
    },

    {
      key:
        'Pelaksana Teknis',

      title:
        'Pelaksana Teknis',

      description:
        'Melaksanakan tugas operasional pemerintahan sesuai bidang pelayanan, kesejahteraan, dan pemerintahan.',

      icon:
        ShieldCheck,
    },

    {
      key:
        'Pelaksana Kewilayahan',

      title:
        'Pelaksana Kewilayahan',

      description:
        'Membantu penyelenggaraan pemerintahan dan pelayanan masyarakat pada wilayah dusun masing-masing.',

      icon:
        MapPin,
    },
  ];

/* =========================================================
   HELPERS
========================================================= */

function safeString(
  value: unknown
) {
  return String(
    value ??
      ''
  ).trim();
}

function formatTanggal(
  value: string
) {
  if (!value) {
    return '-';
  }

  const date =
    new Date(
      `${value}T00:00:00+07:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
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
  ).format(
    date
  );
}

/* =========================================================
   PAGE
========================================================= */

export default async function PemerintahanDesaPage() {
  const [
    layananResult,
    pemerintahanResult,
    perangkatResult,
  ] =
    await Promise.all([
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

      supabaseAdmin
        .from(
          'pemerintahan_desa'
        )
        .select(`
          pemerintahan_key,
          sekilas_info,
          judul_halaman,
          judul_sotk,
          lokasi_pemerintahan,
          tanggal_publikasi,
          penulis,
          deskripsi_kepala_desa,
          deskripsi_perangkat,
          catatan,
          updated_at
        `)
        .eq(
          'pemerintahan_key',
          PEMERINTAHAN_KEY
        )
        .maybeSingle(),

      supabaseAdmin
        .from(
          'perangkat_desa'
        )
        .select(`
          id,
          nama,
          jabatan,
          kelompok,
          foto_url,
          foto_path,
          nip,
          nomor_telepon,
          deskripsi,
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
          'nama',
          {
            ascending:
              true,
          }
        ),
    ]);

  /* =======================================================
     LAYANAN
  ======================================================= */

  if (
    layananResult.error
  ) {
    console.error(
      'Gagal mengambil layanan:',
      layananResult.error
    );
  }

  const daftarLayanan:
    PilihanLayanan[] =
    (
      layananResult.data ??
      []
    )
      .map(
        (
          item
        ) => {
          const layanan =
            item as LayananRow;

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

            slug:
              slug ||
              `layanan-${id}`,
          };
        }
      )
      .filter(
        (
          item
        ) =>
          Number.isInteger(
            item.id
          ) &&
          item.id >
            0 &&
          item.nama
            .length >
            0
      );

  /* =======================================================
     SETTINGS
  ======================================================= */

  if (
    pemerintahanResult.error
  ) {
    console.error(
      'Gagal mengambil informasi pemerintahan:',
      pemerintahanResult.error
    );
  }

  const pemerintahan:
    PemerintahanDesaData = {
    ...defaultPemerintahan,

    ...(pemerintahanResult.data ??
      {}),
  };

  /* =======================================================
     PERANGKAT
  ======================================================= */

  if (
    perangkatResult.error
  ) {
    console.error(
      'Gagal mengambil perangkat desa:',
      perangkatResult.error
    );
  }

  const perangkat =
    (
      perangkatResult.data ??
      []
    ) as PerangkatDesaData[];

  const pimpinan =
    perangkat.filter(
      (
        item
      ) =>
        item.kelompok ===
        'Pimpinan'
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ===================================================
            SEKILAS INFO
        =================================================== */}

        <div className="relative mb-7 flex items-center gap-3 overflow-hidden rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm">
          <div className="z-10 shrink-0 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-extrabold shadow-md">
            Sekilas Info
          </div>

          <style
            dangerouslySetInnerHTML={{
              __html: `
                @keyframes scrolling-pemerintahan {
                  0% {
                    transform: translateX(100%);
                  }

                  100% {
                    transform: translateX(-100%);
                  }
                }

                .animate-scrolling-pemerintahan {
                  display: inline-block;
                  white-space: nowrap;
                  animation:
                    scrolling-pemerintahan
                    24s linear infinite;
                }

                .animate-scrolling-pemerintahan:hover {
                  animation-play-state: paused;
                }

                @media (prefers-reduced-motion: reduce) {
                  .animate-scrolling-pemerintahan {
                    animation: none;
                  }
                }
              `,
            }}
          />

          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="animate-scrolling-pemerintahan">
              {
                pemerintahan.sekilas_info
              }
              {' *** '}
              Kenali sejarah
              kepemimpinan Desa Keji
              melalui menu Tilik
              Arkeji.
            </div>
          </div>
        </div>

        {/* ===================================================
            LAYOUT
        =================================================== */}

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* MAIN */}

          <main className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:w-2/3">
            {/* HEADER */}

            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 px-6 py-8 text-white md:px-8">
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

              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[52px] border-white/[0.04]" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                  <Landmark
                    size={24}
                  />
                </div>

                <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
                  Pemerintahan Desa
                </p>

                <h1 className="mt-2 text-2xl font-black leading-tight md:text-3xl">
                  {
                    pemerintahan.judul_halaman
                  }
                </h1>

                <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-emerald-50/80">
                  Informasi struktur
                  organisasi, nama,
                  jabatan, serta
                  perangkat Pemerintah
                  Desa Keji.
                </p>

                <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-emerald-50/80">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2">
                    <Calendar
                      size={14}
                    />

                    {formatTanggal(
                      pemerintahan.tanggal_publikasi
                    )}
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2">
                    <User
                      size={14}
                    />

                    {
                      pemerintahan.penulis
                    }
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2">
                    <Eye
                      size={14}
                    />

                    Informasi
                    Pemerintahan
                  </span>
                </div>
              </div>
            </section>

            {/* BODY */}

            <div className="space-y-10 p-6 md:p-8">
              {/* SOTK INTRO */}

              <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white px-5 py-8 text-center shadow-sm md:px-8">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                  <Landmark
                    size={28}
                  />
                </div>

                <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">
                  Struktur Organisasi
                  dan Tata Kerja
                </p>

                <h2 className="mt-2 text-xl font-black text-slate-900 md:text-2xl">
                  {
                    pemerintahan.judul_sotk
                  }
                </h2>

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {
                    pemerintahan.lokasi_pemerintahan
                  }
                </p>
              </section>

              {/* SOTK IMAGE */}

              <section>
                <SectionHeading
                  icon={
                    Landmark
                  }
                  label="Bagan Organisasi"
                  title="SOTK Pemerintah Desa Keji"
                  description="Bagan resmi Struktur Organisasi dan Tata Kerja Pemerintah Desa Keji."
                />

                <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
                  <a
                    href={
                      SOTK_IMAGE
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <div className="relative">
                      <Image
                        src={
                          SOTK_IMAGE
                        }
                        alt="Struktur Organisasi dan Tata Kerja Pemerintah Desa Keji"
                        width={
                          1280
                        }
                        height={
                          777
                        }
                        priority
                        className="h-auto w-full object-contain"
                      />

                      <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-xl bg-emerald-950/90 px-4 py-2 text-xs font-extrabold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                        Lihat ukuran penuh

                        <ExternalLink
                          size={14}
                        />
                      </span>
                    </div>
                  </a>
                </div>
              </section>

              {/* PIMPINAN */}

              {pimpinan.length >
                0 && (
                <section>
                  <SectionHeading
                    icon={
                      UsersRound
                    }
                    label="Unsur Pimpinan"
                    title="Kepala Desa"
                    description={
                      pemerintahan.deskripsi_kepala_desa
                    }
                  />

                  <div className="mt-6 grid gap-5">
                    {pimpinan.map(
                      (
                        item
                      ) => (
                        <PimpinanCard
                          key={
                            item.id
                          }
                          item={
                            item
                          }
                        />
                      )
                    )}
                  </div>
                </section>
              )}

              {/* GROUP */}

              <section>
                <SectionHeading
                  icon={
                    Building2
                  }
                  label="Perangkat Desa"
                  title="Susunan Perangkat Desa"
                  description={
                    pemerintahan.deskripsi_perangkat
                  }
                />

                <div className="mt-6 space-y-6">
                  {groupConfig.map(
                    (
                      group
                    ) => {
                      const groupItems =
                        perangkat.filter(
                          (
                            item
                          ) =>
                            item.kelompok ===
                            group.key
                        );

                      if (
                        groupItems.length ===
                        0
                      ) {
                        return null;
                      }

                      return (
                        <PerangkatGroup
                          key={
                            group.key
                          }
                          group={
                            group
                          }
                          perangkat={
                            groupItems
                          }
                        />
                      );
                    }
                  )}
                </div>
              </section>

              {/* TILIK */}

              <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 p-6 text-white shadow-lg sm:p-7">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',

                    backgroundSize:
                      '24px 24px',
                  }}
                />

                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                      <Archive
                        size={23}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                        Arsip Desa Keji
                      </p>

                      <h2 className="mt-2 text-xl font-black">
                        Tilik Arkeji
                      </h2>

                      <p className="mt-2 max-w-xl text-sm font-medium leading-7 text-emerald-50/80">
                        Telusuri sejarah
                        kepemimpinan,
                        penghargaan, dan
                        dokumentasi Desa
                        Keji.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/profil/tilik-arkeji"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-900"
                  >
                    Buka Tilik Arkeji

                    <ArrowRight
                      size={16}
                    />
                  </Link>
                </div>
              </section>

              {pemerintahan.catatan && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-medium leading-7 text-emerald-900">
                  {
                    pemerintahan.catatan
                  }
                </div>
              )}
            </div>
          </main>

          {/* SIDEBAR */}

          <aside className="min-w-0 lg:w-1/3">
            <div className="flex flex-col gap-8 lg:sticky lg:top-24">
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
   PIMPINAN
========================================================= */

function PimpinanCard({
  item,
}: {
  item:
    PerangkatDesaData;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-sm">
      <div className="grid sm:grid-cols-[190px_minmax(0,1fr)]">
        <PersonPhoto
          item={
            item
          }
          large
        />

        <div className="flex flex-col justify-center p-6 sm:p-8">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-emerald-700">
            {
              item.jabatan
            }
          </p>

          <h3 className="mt-2 text-2xl font-black uppercase text-emerald-950">
            {
              item.nama
            }
          </h3>

          {item.deskripsi && (
            <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
              {
                item.deskripsi
              }
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   GROUP
========================================================= */

function PerangkatGroup({
  group,
  perangkat,
}: {
  group:
    GroupConfig;

  perangkat:
    PerangkatDesaData[];
}) {
  const Icon =
    group.icon;

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
            <Icon
              size={20}
            />
          </div>

          <div>
            <h3 className="font-black uppercase tracking-wide text-emerald-950">
              {
                group.title
              }
            </h3>

            <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
              {
                group.description
              }
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 bg-emerald-50/30 p-5 sm:grid-cols-2 sm:p-6">
        {perangkat.map(
          (
            item
          ) => (
            <PersonCard
              key={
                item.id
              }
              item={
                item
              }
            />
          )
        )}
      </div>
    </article>
  );
}

/* =========================================================
   PERSON CARD
========================================================= */

function PersonCard({
  item,
}: {
  item:
    PerangkatDesaData;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
      <PersonPhoto
        item={
          item
        }
      />

      <div className="p-5 text-center">
        <p className="text-[9px] font-extrabold uppercase leading-5 tracking-[0.13em] text-emerald-700">
          {
            item.jabatan
          }
        </p>

        <h4 className="mt-2 text-base font-black uppercase leading-6 text-slate-900">
          {
            item.nama
          }
        </h4>

        {item.deskripsi && (
          <p className="mt-3 text-xs font-medium leading-6 text-slate-500">
            {
              item.deskripsi
            }
          </p>
        )}
      </div>
    </article>
  );
}

/* =========================================================
   PHOTO
========================================================= */

function PersonPhoto({
  item,
  large =
    false,
}: {
  item:
    PerangkatDesaData;

  large?: boolean;
}) {
  const className =
    large
      ? 'min-h-[260px] sm:min-h-full'
      : 'aspect-[4/3]';

  if (
    item.foto_url
  ) {
    return (
      <div
        className={`overflow-hidden bg-slate-100 ${className}`}
      >
        <img
          src={
            item.foto_url
          }
          alt={`Foto ${item.nama}`}
          loading="lazy"
          className="h-full w-full object-cover object-top"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-50 ${className}`}
    >
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-white">
          <Camera
            size={25}
          />
        </div>

        <p className="mt-3 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
          Foto belum tersedia
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  icon: Icon,
  label,
  title,
  description,
}: {
  icon:
    LucideIcon;

  label:
    string;

  title:
    string;

  description:
    string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
        <Icon
          size={22}
          strokeWidth={
            2.4
          }
        />
      </div>

      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
          {label}
        </p>

        <h2 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
          {title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}