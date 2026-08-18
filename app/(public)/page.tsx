// app/(public)/page.tsx

'use client';

import Link from 'next/link';

import {
  useEffect,
  useState,
} from 'react';

import {
  TypeAnimation,
} from 'react-type-animation';

import {
  Archive,
  ArrowRight,
  ArrowUpRight,
  Award,
  BadgeCheck,
  BookOpen,
  Building2,
  Calendar,
  ExternalLink,
  Hammer,
  Image as ImageIcon,
  Info,
  Landmark,
  Map,
  MapPin,
  Megaphone,
  Navigation,
  Quote,
  Recycle,
  House,
  Scale,
  ShoppingCart,
  UserRound,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';

import BeritaTerbaru from '@/components/public/BeritaTerbaru';
import StatistikPenduduk from '@/components/public/StatistikPenduduk';
import WaktuRealtime from '@/components/public/WaktuRealtime';

import {
  useBerandaPublic,
} from '@/hooks/useBerandaPublic';

/* =========================================================
   TYPES
========================================================= */

interface PerangkatBeranda {
  id:
    | string
    | number;

  nama:
    string;

  jabatan:
    string;

  kelompok:
    string;

  foto_url:
    | string
    | null;

  aktif:
    boolean;

  urutan:
    number;
}

interface PemerintahanApiResponse {
  data?: {
    perangkat?:
      PerangkatBeranda[];
  };

  message?:
    string;
}

/* =========================================================
   QUICK LINKS
========================================================= */

const quickLinks = [
  {
    name:
      'Peta Desa',

    icon:
      Map,

    href:
      '/peta',
  },

  {
    name:
      'Produk Hukum',

    icon:
      Scale,

    href:
      '/informasi-publik/produk-hukum',
  },

  {
    name:
      'Informasi Publik',

    icon:
      Info,

    href:
      '/informasi-publik',
  },

  {
    name:
      'Lapak UMKM',

    icon:
      ShoppingCart,

    href:
      '/umkm',
  },

  {
    name:
      'Arsip Berita',

    icon:
      Archive,

    href:
      '/berita',
  },

  {
    name:
      'Album Galeri',

    icon:
      ImageIcon,

    href:
      '/data-desa/galeri',
  },

  {
    name:
      'Pengaduan',

    icon:
      Megaphone,

    href:
      '/pengaduan',
  },

  {
    name:
      'Pembangunan',

    icon:
      Hammer,

    href:
      '/pembangunan',
  },

  {
    name:
      'Pengelolaan Sampah',

    icon:
      Recycle,

    href:
      '/pengelolaan-sampah',
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function HomePage() {
  const {
    data: beranda,
  } =
    useBerandaPublic();

  const [
    perangkatDesa,
    setPerangkatDesa,
  ] =
    useState<
      PerangkatBeranda[]
    >([]);

  const [
    perangkatLoading,
    setPerangkatLoading,
  ] =
    useState(true);

  const [
    perangkatError,
    setPerangkatError,
  ] =
    useState<
      string | null
    >(null);

  /* =======================================================
     LOAD PERANGKAT DESA
  ======================================================= */

  useEffect(() => {
    const controller =
      new AbortController();

    let mounted =
      true;

    async function loadPerangkat() {
      try {
        setPerangkatLoading(
          true
        );

        setPerangkatError(
          null
        );

        const response =
          await fetch(
            '/api/pemerintahan',
            {
              method:
                'GET',

              cache:
                'no-store',

              signal:
                controller.signal,

              headers: {
                Accept:
                  'application/json',
              },
            }
          );

        const result =
          (await response.json()) as
            PemerintahanApiResponse;

        if (!response.ok) {
          throw new Error(
            result.message ??
              'Data perangkat desa gagal dimuat.'
          );
        }

        const daftar =
          (
            result.data
              ?.perangkat ??
            []
          )
            .filter(
              (
                item
              ) =>
                item.aktif !==
                  false &&
                item.kelompok !==
                  'Pimpinan'
            )
            .sort(
              (
                a,
                b
              ) =>
                Number(
                  a.urutan ??
                    0
                ) -
                Number(
                  b.urutan ??
                    0
                )
            );

        if (mounted) {
          setPerangkatDesa(
            daftar
          );
        }
      } catch (error) {
        if (
          error instanceof
            Error &&
          error.name ===
            'AbortError'
        ) {
          return;
        }

        console.error(
          'Gagal mengambil perangkat desa:',
          error
        );

        if (mounted) {
          setPerangkatError(
            error instanceof
              Error
              ? error.message
              : 'Data perangkat desa gagal dimuat.'
          );
        }
      } finally {
        if (mounted) {
          setPerangkatLoading(
            false
          );
        }
      }
    }

    loadPerangkat();

    return () => {
      mounted =
        false;

      controller.abort();
    };
  }, []);

  /* =======================================================
     INFORMASI BERJALAN
  ======================================================= */

  const informasiBerjalan = [
    beranda.informasi_1,
    beranda.informasi_2,
    beranda.informasi_3,
    beranda.informasi_4,
  ].filter(
    (
      value
    ) =>
      value
        .trim()
        .length >
      0
  );

  const informasiAktif =
    informasiBerjalan
      .length >
    0
      ? informasiBerjalan
      : [
          'Sistem Informasi Desa Keji',
        ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 pb-12">
      {/* ===================================================
          GLOBAL STYLE
      =================================================== */}

      <style>{`
        .hide-scroll-bar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .hide-scroll-bar::-webkit-scrollbar {
          display: none;
        }

        @keyframes public-info-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .public-info-marquee-track {
          width: max-content;

          animation:
            public-info-marquee
            34s linear infinite;
        }

        .public-info-marquee-wrapper:hover
        .public-info-marquee-track {
          animation-play-state:
            paused;
        }

        @media (
          prefers-reduced-motion:
          reduce
        ) {
          .public-info-marquee-track {
            animation: none;
          }
        }
      `}</style>

      {/* ===================================================
          HERO
      =================================================== */}

      <section
        className="
          relative
          flex
          min-h-[calc(100svh-108px)]
          flex-col
          items-center
          justify-center
          overflow-hidden
          bg-cover
          bg-center
          bg-no-repeat
          bg-scroll
          pb-28
          pt-20
          md:bg-fixed
        "
        style={{
          backgroundImage:
            `url("${beranda.background_url}")`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-emerald-950/80" />

        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[100px]" />

        <WaktuRealtime />

        <div className="relative z-10 w-full max-w-4xl px-4 text-center">
          {/* LOGO */}

          <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-2xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-md">
            <img
              src={
                beranda.logo_url
              }
              alt="Logo Desa Keji"
              className="h-full w-full object-contain drop-shadow-lg"
            />
          </div>

          {/* HERO TEXT */}

          <div className="mb-3 flex min-h-[90px] items-center justify-center md:min-h-[70px]">
            <TypeAnimation
              sequence={[
                beranda.hero_teks_1,
                2000,

                beranda.hero_teks_2,
                2000,

                beranda.hero_teks_3,
                2000,
              ]}
              wrapper="h1"
              speed={50}
              deletionSpeed={
                50
              }
              className="text-3xl font-black leading-tight tracking-tight text-white drop-shadow-xl sm:text-4xl md:text-5xl lg:text-6xl"
              repeat={
                Infinity
              }
            />
          </div>

          <p className="mb-9 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-50/90 drop-shadow-md sm:text-base md:text-lg">
            {
              beranda.hero_lokasi
            }
          </p>

          {/* SEARCH */}

          <div className="mx-auto flex w-full max-w-2xl items-center rounded-2xl border border-white/20 bg-white/95 p-1.5 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 focus-within:ring-4 focus-within:ring-emerald-300/25">
            <input
              type="search"
              placeholder={
                beranda.hero_placeholder
              }
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 sm:px-5"
            />

            <button
              type="button"
              className="shrink-0 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-emerald-800 sm:px-8"
            >
              Cari
            </button>
          </div>
        </div>

        <div className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/70 sm:flex">
          <span className="text-[9px] font-bold uppercase tracking-[0.25em]">
            Jelajahi
          </span>

          <div className="flex h-8 w-5 justify-center rounded-full border border-white/40 pt-1.5">
            <span className="h-1.5 w-1 animate-bounce rounded-full bg-white/80" />
          </div>
        </div>
      </section>

      {/* ===================================================
          QUICK LINKS
      =================================================== */}

      <section className="relative z-30 mx-auto -mt-16 w-full max-w-[95rem]">
        {/* MOBILE */}

        <div className="sm:hidden">
          <div className="hide-scroll-bar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-[14vw] pb-7 pt-2">
            {quickLinks.map(
              (
                link
              ) => {
                const Icon =
                  link.icon;

                return (
                  <Link
                    key={
                      link.href
                    }
                    href={
                      link.href
                    }
                    className="group flex h-32 w-[72vw] shrink-0 snap-center flex-col items-center justify-center gap-3 rounded-[22px] border border-emerald-100 bg-white shadow-[0_14px_35px_rgba(15,23,42,0.10)] transition active:scale-[0.98]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                      <Icon
                        size={
                          24
                        }
                      />
                    </div>

                    <span className="px-4 text-center text-sm font-black text-slate-700">
                      {
                        link.name
                      }
                    </span>

                    <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-emerald-600">
                      Buka Menu
                    </span>
                  </Link>
                );
              }
            )}
          </div>

          <div className="-mt-2 flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
            <span className="h-px w-5 bg-slate-200" />

            Geser Menu

            <span className="h-px w-5 bg-slate-200" />
          </div>
        </div>

        {/* DESKTOP */}

        <div className="hidden flex-wrap justify-center gap-4 px-6 pb-8 pt-2 sm:flex lg:px-8">
          {quickLinks.map(
            (
              link
            ) => {
              const Icon =
                link.icon;

              return (
                <Link
                  key={
                    link.href
                  }
                  href={
                    link.href
                  }
                  className="group flex h-32 w-32 shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-emerald-200/50"
                >
                  <div className="rounded-full bg-emerald-50 p-3 transition-colors group-hover:bg-emerald-100">
                    <Icon
                      size={
                        28
                      }
                      className="text-emerald-600"
                    />
                  </div>

                  <span className="px-2 text-center text-xs font-bold text-gray-700 transition group-hover:text-emerald-700">
                    {
                      link.name
                    }
                  </span>
                </Link>
              );
            }
          )}
        </div>
      </section>

      {/* ===================================================
          PEMERINTAH DESA
      =================================================== */}

      <section className="mx-auto mt-5 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADING */}

        <div className="mb-6">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-600">
            Pemerintah Desa
          </p>

          <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                Pemerintah Desa
                Keji
              </h2>

              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
                Sambutan Kepala
                Desa, perangkat
                pemerintah desa,
                serta informasi
                kependudukan Desa
                Keji.
              </p>
            </div>

            <Link
              href="/pemerintahan"
              className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-emerald-700 transition hover:text-emerald-900"
            >
              Lihat Pemerintahan

              <ArrowUpRight
                size={
                  15
                }
              />
            </Link>
          </div>
        </div>

        {/* =================================================
            SAMBUTAN + STATISTIK
        ================================================= */}

        <div className="grid gap-6 lg:grid-cols-12">
          {/* ===============================================
    SAMBUTAN KEPALA DESA - COMPACT
=============================================== */}

<article className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 shadow-[0_18px_45px_rgba(6,78,59,0.18)] lg:col-span-8">
  {/* ORNAMEN */}

  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 opacity-[0.12]"
    style={{
      backgroundImage:
        'radial-gradient(circle, rgba(255,255,255,.55) 1px, transparent 1px)',
      backgroundSize:
        '25px 25px',
    }}
  />

  <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border-[45px] border-white/[0.05]" />

  <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl" />

  {/* CONTENT */}

  <div className="relative grid gap-6 p-5 sm:p-6 md:grid-cols-[165px_minmax(0,1fr)] md:items-center lg:p-7">
    {/* ===========================================
        FOTO KEPALA DESA
    =========================================== */}

    <div className="mx-auto w-full max-w-[165px] md:mx-0">
      <div className="overflow-hidden rounded-[22px] border border-white/20 bg-white/10 p-1.5 shadow-xl shadow-emerald-950/25">
        <div className="aspect-[4/5] overflow-hidden rounded-[17px] bg-emerald-950">
          <img
            src={
              beranda.foto_kepala_desa_url
            }
            alt={`${beranda.nama_kepala_desa} - ${beranda.jabatan_kepala_desa}`}
            className="h-full w-full object-cover object-top"
          />
        </div>
      </div>
    </div>

    {/* ===========================================
        ISI SAMBUTAN
    =========================================== */}

    <div className="flex min-w-0 flex-col justify-center">
      {/* JUDUL */}

      <div>
        <h3 className="text-xl font-black leading-tight tracking-tight text-white sm:text-2xl">
          Sambutan Kepala Desa
        </h3>

        <div className="mt-2.5 h-1 w-12 rounded-full bg-emerald-300" />
      </div>

      {/* SALAM */}

      <div className="mt-4 flex items-start gap-2.5">
        <Quote
          size={25}
          strokeWidth={1.5}
          className="mt-0.5 shrink-0 text-emerald-300/60"
        />

        <p className="text-[13px] font-bold leading-6 text-white sm:text-sm">
          Assalamu&apos;alaikum
          Warahmatullahi
          Wabarakatuh.
        </p>
      </div>

      {/* TEXT */}

      <div className="mt-3 space-y-2.5 md:pl-[35px]">
        <p className="text-xs font-medium leading-6 text-emerald-50/90 sm:text-[13px]">
          Selamat datang di{' '}
          <strong className="font-extrabold text-white">
            Sistem Informasi Desa
            Keji (SIJI)
          </strong>
          .
        </p>

        <p className="text-xs font-medium leading-6 text-emerald-50/90 sm:text-[13px]">
          Dengan semangat{' '}
          <strong className="font-extrabold text-white">
            KEJI BERANI
          </strong>{' '}
          dan{' '}
          <strong className="font-extrabold text-white">
            KEJI ANTI KORUPSI
          </strong>
          , kami berkomitmen
          menghadirkan informasi
          dan layanan desa yang
          transparan, akurat, dan
          mudah diakses masyarakat.
        </p>

        <p className="text-xs font-medium leading-6 text-emerald-50/90 sm:text-[13px]">
          Semoga SIJI menjadi
          penghubung antara
          Pemerintah Desa Keji dan
          masyarakat serta
          mendukung kemajuan Desa
          Keji.
        </p>

        <p className="text-xs font-semibold leading-6 text-white sm:text-[13px]">
          Wassalamu&apos;alaikum
          Warahmatullahi
          Wabarakatuh.
        </p>
      </div>

      {/* =========================================
          IDENTITAS KADES
      ========================================= */}

      <div className="mt-4 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 shrink-0 bg-emerald-300" />

          <div>
            <p className="text-sm font-black tracking-tight text-white">
              {
                beranda.nama_kepala_desa
              }
            </p>

            <p className="mt-0.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-emerald-200">
              {
                beranda.jabatan_kepala_desa
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</article>

          {/* ===============================================
              STATISTIK
          =============================================== */}

          <StatistikPenduduk />
        </div>

        {/* =================================================
            PERANGKAT DESA
        ================================================= */}

        <div className="mt-6 overflow-hidden rounded-[30px] border border-emerald-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
          {/* HEADER */}

          <div className="flex flex-col justify-between gap-4 border-b border-emerald-50 bg-gradient-to-r from-emerald-50/80 via-white to-white p-6 sm:flex-row sm:items-center sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-900/15">
                <UsersRound
                  size={
                    23
                  }
                />
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-600">
                  Pemerintah Desa
                </p>

                <h3 className="mt-1 text-xl font-black text-slate-900">
                  Perangkat Desa
                  Keji
                </h3>

                <p className="mt-1 max-w-2xl text-xs font-medium leading-5 text-slate-500 sm:text-sm">
                  Kenali perangkat
                  Pemerintah Desa
                  Keji beserta nama
                  dan jabatannya.
                </p>
              </div>
            </div>

            <Link
              href="/pemerintahan"
              className="inline-flex shrink-0 items-center gap-2 text-xs font-extrabold uppercase tracking-[0.1em] text-emerald-700 transition hover:text-emerald-900"
            >
              Struktur Lengkap

              <ArrowRight
                size={
                  14
                }
              />
            </Link>
          </div>

          {/* =================================================
              SLIDER PERANGKAT
          ================================================= */}

          <div className="relative p-5 sm:p-6">
            {perangkatLoading ? (
              <div className="-mx-5 sm:-mx-6">
                <div className="hide-scroll-bar flex gap-4 overflow-x-auto px-5 pb-3 sm:px-6">
                  {Array.from({
                    length:
                      6,
                  }).map(
                    (
                      _,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        className="w-[44vw] max-w-[185px] shrink-0 sm:w-[180px]"
                      >
                        <PerangkatSkeleton />
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : perangkatError ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold text-amber-700">
                {
                  perangkatError
                }
              </div>
            ) : perangkatDesa.length ===
              0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                <UserRound
                  size={
                    30
                  }
                  className="text-slate-300"
                />

                <p className="mt-3 text-sm font-bold text-slate-500">
                  Data perangkat
                  desa belum
                  tersedia.
                </p>
              </div>
            ) : (
              <>
                <div className="-mx-5 sm:-mx-6">
                  <div
                    className="
                      hide-scroll-bar
                      flex
                      snap-x
                      snap-mandatory
                      gap-4
                      overflow-x-auto
                      scroll-smooth
                      px-5
                      pb-4
                      sm:px-6
                    "
                  >
                    {perangkatDesa.map(
                      (
                        perangkat
                      ) => (
                        <div
                          key={
                            perangkat.id
                          }
                          className="
                            w-[44vw]
                            max-w-[185px]
                            shrink-0
                            snap-center
                            sm:w-[180px]
                            md:w-[190px]
                          "
                        >
                          <PerangkatCard
                            perangkat={
                              perangkat
                            }
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* PETUNJUK */}

                <div className="mt-1 flex items-center justify-center gap-3">
                  <div className="h-px w-8 bg-slate-200" />

                  <p className="text-center text-[9px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                    Geser untuk
                    melihat perangkat
                    lainnya
                  </p>

                  <div className="h-px w-8 bg-slate-200" />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          TILIK ARKEJI
      =================================================== */}

      <section className="mx-auto mt-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[30px] border border-emerald-100 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="grid lg:grid-cols-[0.85fr_1.4fr]">
            {/* INTRO */}

            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 p-7 text-white sm:p-8 lg:p-9">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,.6) 1px, transparent 1px)',

                  backgroundSize:
                    '23px 23px',
                }}
              />

              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border-[42px] border-white/[0.05]" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                  <Archive
                    size={
                      27
                    }
                  />
                </div>

                <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-200">
                  Arsip Desa Keji
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                  Tilik Arkeji
                </h2>

                <p className="mt-4 max-w-md text-sm font-medium leading-7 text-emerald-50/80">
                  Menelusuri jejak
                  sejarah,
                  kepemimpinan,
                  prestasi, dan
                  dokumentasi Desa
                  Keji dari masa ke
                  masa.
                </p>

                <Link
                  href="/profil/tilik-arkeji"
                  className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 text-xs font-extrabold text-emerald-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50"
                >
                  <Landmark
                    size={
                      16
                    }
                  />

                  Jelajahi Tilik
                  Arkeji

                  <ArrowRight
                    size={
                      15
                    }
                  />
                </Link>
              </div>
            </div>

            {/* MENU */}

            <div className="grid gap-4 p-5 sm:p-7 md:grid-cols-3 lg:p-8">
              <TilikCard
                number="01"
                href="/profil/tilik-arkeji#mantan-kades"
                icon={
                  UserRound
                }
                title="Biografi Kepala Desa Keji"
                description="Mengenal tokoh-tokoh yang pernah memimpin Desa Keji."
              />

              <TilikCard
                number="02"
                href="/profil/tilik-arkeji#penghargaan"
                icon={
                  Award
                }
                title="Penghargaan Desa"
                description="Dokumentasi prestasi dan pencapaian Desa Keji."
              />

              <TilikCard
                number="03"
                href="/profil/sejarah#ebook-sejarah"
                icon={
                  BookOpen
                }
                title="Ebook Sejarah"
                description="Baca dokumentasi dan perjalanan sejarah Desa Keji."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          INFORMASI BERJALAN
      =================================================== */}

      <section className="mx-auto mt-7 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex min-h-[58px] items-stretch overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
          <div className="relative z-20 flex shrink-0 items-center gap-3 bg-gradient-to-r from-emerald-800 to-emerald-700 px-4 text-white sm:px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/10">
              <Megaphone
                size={
                  16
                }
              />
            </div>

            <div className="hidden sm:block">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-200">
                Informasi
              </p>

              <p className="text-xs font-black uppercase tracking-[0.12em]">
                Sekilas Desa
              </p>
            </div>
          </div>

          <div className="public-info-marquee-wrapper relative flex min-w-0 flex-1 items-center overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent" />

            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent" />

            <div className="public-info-marquee-track flex items-center">
              {[false, true].map(
                (
                  duplicate
                ) => (
                  <div
                    key={
                      duplicate
                        ? 'duplicate'
                        : 'primary'
                    }
                    aria-hidden={
                      duplicate
                    }
                    className="flex shrink-0 items-center gap-6 px-8"
                  >
                    {informasiAktif.map(
                      (
                        informasi,
                        index
                      ) => (
                        <div
                          key={`${duplicate}-${index}-${informasi}`}
                          className="contents"
                        >
                          <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-600">
                            {
                              informasi
                            }
                          </span>

                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </div>
                      )
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          INFORMASI PELAYANAN
      =================================================== */}

      <section className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-emerald-600">
              Informasi Pelayanan
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
              Akses Informasi
              Desa
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
              Informasi lokasi
              kantor dan jadwal
              pelayanan Pemerintah
              Desa Keji.
            </p>
          </div>

          <Link
            href="/layanan"
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-emerald-700 hover:text-emerald-900"
          >
            Lihat layanan desa

            <ArrowUpRight
              size={
                15
              }
            />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* ===============================================
              MAP
          =============================================== */}

          <article className="group relative min-h-[500px] overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)] lg:col-span-7">
            <div className="absolute inset-0">
              <iframe
                src={
                  beranda.maps_embed_url
                }
                title="Lokasi Kantor Desa Keji"
                className="h-full w-full grayscale-[15%] transition duration-500 group-hover:grayscale-0"
                style={{
                  border:
                    0,
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>

            <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-emerald-950/80 via-emerald-950/30 to-transparent" />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-emerald-950 via-emerald-950/80 to-transparent" />

            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />

            <div className="pointer-events-none absolute left-6 top-6 rounded-2xl border border-white/15 bg-emerald-950/70 p-3 text-white shadow-xl backdrop-blur-md">
              <MapPin
                size={
                  22
                }
              />
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <div className="max-w-xl">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-300">
                  Kantor Pemerintah
                  Desa
                </p>

                <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  Kantor Desa Keji
                </h3>

                <p className="mt-3 max-w-lg whitespace-pre-line text-sm font-medium leading-6 text-emerald-50/80">
                  {
                    beranda.alamat_kantor
                  }
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={
                      beranda.maps_link_url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-emerald-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50"
                  >
                    <Navigation
                      size={
                        17
                      }
                    />

                    Buka Google Maps

                    <ExternalLink
                      size={
                        14
                      }
                    />
                  </a>

                  <Link
                    href="/peta"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-extrabold text-white backdrop-blur-md transition hover:bg-white/20"
                  >
                    <Map
                      size={
                        17
                      }
                    />

                    Peta Desa
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* ===============================================
              JAM KERJA
          =============================================== */}

          <article className="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)] lg:col-span-5">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-50" />

            <div className="relative">
              <div className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50/70 to-white p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-600">
                      Pelayanan
                      Publik
                    </p>

                    <h3 className="mt-1.5 text-xl font-black text-slate-900 sm:text-2xl">
                      Jam Kerja Kantor
                    </h3>

                    <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
                      Jadwal pelayanan
                      administrasi
                      Pemerintah Desa
                      Keji.
                    </p>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-900/20">
                    <Calendar
                      size={
                        22
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6">
                <JamKerjaCard
                  hari="Senin – Kamis"
                  deskripsi="Pelayanan administrasi desa"
                  waktu={
                    beranda.jam_senin_kamis
                  }
                  aktif
                />

                <JamKerjaCard
                  hari="Jumat"
                  deskripsi="Pelayanan administrasi desa"
                  waktu={
                    beranda.jam_jumat
                  }
                  aktif
                />

                <JamKerjaCard
                  hari="Sabtu – Minggu"
                  deskripsi="Kantor tidak beroperasi"
                  waktu={
                    beranda.jam_akhir_pekan
                  }
                />

                <div className="mt-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                  <div className="flex items-start gap-3">
                    <Info
                      size={
                        19
                      }
                      className="mt-0.5 shrink-0 text-emerald-700"
                    />

                    <p className="text-xs font-semibold leading-6 text-emerald-800">
                      Untuk kebutuhan
                      pelayanan,
                      masyarakat dapat
                      melihat informasi
                      dan persyaratan
                      pada menu
                      Layanan Desa.
                    </p>
                  </div>

                  <Link
                    href="/layanan"
                    className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.1em] text-emerald-700"
                  >
                    Buka Layanan

                    <ArrowRight
                      size={
                        14
                      }
                    />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ===================================================
          BERITA
      =================================================== */}

      <BeritaTerbaru />
    </div>
  );
}

/* =========================================================
   PERANGKAT CARD
========================================================= */

function PerangkatCard({
  perangkat,
}: {
  perangkat:
    PerangkatBeranda;
}) {
  const hasFoto =
    Boolean(
      perangkat.foto_url
        ?.trim()
    );

  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-emerald-50 to-slate-100">
        {hasFoto ? (
          <img
            src={
              perangkat.foto_url ??
              ''
            }
            alt={`${perangkat.nama} - ${perangkat.jabatan}`}
            loading="lazy"
            className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
              <UserRound
                size={
                  32
                }
              />
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
      </div>

      <div className="min-h-[85px] p-3.5 text-center">
        <h4 className="text-xs font-black leading-5 text-slate-800 sm:text-sm">
          {
            perangkat.nama
          }
        </h4>

        <p className="mt-1 text-[9px] font-extrabold uppercase leading-4 tracking-[0.11em] text-emerald-700">
          {
            perangkat.jabatan
          }
        </p>
      </div>
    </article>
  );
}

/* =========================================================
   PERANGKAT SKELETON
========================================================= */

function PerangkatSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <div className="aspect-[4/5] animate-pulse bg-slate-100" />

      <div className="space-y-2 p-4">
        <div className="mx-auto h-3 w-3/4 animate-pulse rounded bg-slate-100" />

        <div className="mx-auto h-2.5 w-1/2 animate-pulse rounded bg-emerald-50" />
      </div>
    </div>
  );
}

/* =========================================================
   TILIK CARD
========================================================= */

function TilikCard({
  number,
  href,
  icon: Icon,
  title,
  description,
}: {
  number:
    string;

  href:
    string;

  icon:
    LucideIcon;

  title:
    string;

  description:
    string;
}) {
  return (
    <Link
      href={
        href
      }
      className="group relative flex min-h-[220px] flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-b from-white to-emerald-50/40 p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
    >
      <span className="absolute right-5 top-4 text-4xl font-black text-emerald-50 transition group-hover:text-emerald-100">
        {
          number
        }
      </span>

      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
        <Icon
          size={
            22
          }
        />
      </div>

      <div className="relative mt-6">
        <h3 className="text-base font-black leading-6 text-slate-900 transition group-hover:text-emerald-900">
          {
            title
          }
        </h3>

        <p className="mt-2 text-xs font-medium leading-6 text-slate-500">
          {
            description
          }
        </p>
      </div>

      <div className="relative mt-auto flex items-center gap-2 pt-5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-emerald-700">
        Lihat Arsip

        <ArrowRight
          size={
            14
          }
          className="transition group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}

/* =========================================================
   JAM KERJA CARD
========================================================= */

function JamKerjaCard({
  hari,
  deskripsi,
  waktu,
  aktif = false,
}: {
  hari:
    string;

  deskripsi:
    string;

  waktu:
    string;

  aktif?:
    boolean;
}) {
  return (
    <div
      className={
        aktif
          ? 'rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4'
          : 'rounded-2xl border border-slate-200 bg-slate-50 p-4'
      }
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-slate-800">
            {
              hari
            }
          </p>

          <p className="mt-1 text-xs font-medium leading-5 text-slate-400">
            {
              deskripsi
            }
          </p>
        </div>

        <span
          className={
            aktif
              ? 'shrink-0 rounded-xl bg-white px-3 py-2 text-xs font-black text-emerald-700 shadow-sm'
              : 'shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-wider text-slate-500'
          }
        >
          {
            waktu
          }
        </span>
      </div>
    </div>
  );
}