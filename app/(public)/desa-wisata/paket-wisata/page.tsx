// app/(public)/desa-wisata/paket-wisata/page.tsx

import type {
  Metadata,
} from 'next';

import Image from 'next/image';

import Link from 'next/link';

import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Calculator,
  Compass,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Info,
  Link2,
  MapPinned,
  MessageCircle,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

/* =========================================================
   METADATA
========================================================= */

export const metadata:
  Metadata = {
  title:
    'Paket Wisata Desa Keji | SIJI',

  description:
    'Temukan informasi Paket Wisata Desa Keji serta Buku Panduan Perhitungan Harga Pokok (HPP) Paket Wisata.',
};

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

/* =========================================================
   CONFIG
========================================================= */

const PAKET_WISATA_IMAGE =
  '/desa-wisata/paket%20wisata.png';

const PAKET_WISATA_URL =
  'https://desawisatakeji.carrd.co/';

const HPP_COVER_IMAGE =
  '/desa-wisata/Cover%20HPP.png';

const HPP_GUIDE_PDF =
  '/desa-wisata/Buku%20Panduan%20Perhitungan%20Harga%20Pokok%20%28HPP%29%20Paket%20Wisata%20Desa%20Keji.pdf';

/* =========================================================
   TYPES
========================================================= */

interface PaketWisataSettings {
  judul:
    string;

  subjudul:
    string;

  deskripsi:
    string;

  linktree_url:
    | string
    | null;

  tombol_label:
    string;

  aktif:
    boolean;
}

/* =========================================================
   FALLBACK
========================================================= */

const fallbackSettings:
  PaketWisataSettings = {
  judul:
    'Paket Wisata Desa Keji',

  subjudul:
    'Temukan pengalaman wisata, budaya, dan suasana khas pedesaan di Desa Keji.',

  deskripsi:
    'Akses seluruh informasi Paket Wisata Desa Keji melalui satu tautan yang mudah digunakan untuk membantu merencanakan kunjungan Anda.',

  linktree_url:
    PAKET_WISATA_URL,

  tombol_label:
    'Lihat Paket Wisata',

  aktif:
    true,
};

/* =========================================================
   HELPERS
========================================================= */

function safeString(
  value:
    unknown
) {
  return String(
    value ??
      ''
  ).trim();
}

function normalizeExternalUrl(
  value:
    unknown
): string | null {
  const text =
    safeString(
      value
    );

  if (!text) {
    return null;
  }

  try {
    const url =
      new URL(
        text
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

function normalizeSettings(
  value:
    unknown
): PaketWisataSettings {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(
      value
    )
  ) {
    return fallbackSettings;
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
      fallbackSettings
        .judul,

    subjudul:
      safeString(
        row.subjudul
      ) ||
      fallbackSettings
        .subjudul,

    deskripsi:
      safeString(
        row.deskripsi
      ) ||
      fallbackSettings
        .deskripsi,

    linktree_url:
      normalizeExternalUrl(
        row.linktree_url
      ) ||
      PAKET_WISATA_URL,

    tombol_label:
      safeString(
        row.tombol_label
      ) ||
      fallbackSettings
        .tombol_label,

    aktif:
      row.aktif ===
        undefined ||
      row.aktif ===
        null
        ? true
        : Boolean(
            row.aktif
          ),
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function PaketWisataPage() {
  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from(
        'desa_wisata_paket_settings'
      )
      .select(`
        judul,
        subjudul,
        deskripsi,
        linktree_url,
        tombol_label,
        aktif
      `)
      .eq(
        'setting_key',
        'utama'
      )
      .maybeSingle();

  if (
    error
  ) {
    console.error(
      'Gagal mengambil pengaturan Paket Wisata:',
      {
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

  const settings =
    normalizeSettings(
      data
    );

  const linktreeUrl =
    settings.aktif
      ? settings.linktree_url ||
        PAKET_WISATA_URL
      : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-emerald-950">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-[0.09]"
        style={{
          backgroundImage:
            `url("${PAKET_WISATA_IMAGE}")`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-[#022c22] via-emerald-950/95 to-[#075f4d]/95" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.65) 1px, transparent 1px)',

          backgroundSize:
            '29px 29px',
        }}
      />

      <div className="pointer-events-none absolute -left-44 -top-44 h-[520px] w-[520px] rounded-full bg-emerald-300/10 blur-[120px]" />

      <div className="pointer-events-none absolute -bottom-52 right-0 h-[560px] w-[560px] rounded-full bg-teal-300/10 blur-[130px]" />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* ===================================================
            HERO
        =================================================== */}

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center xl:gap-16">
          {/* LEFT */}

          <section className="mx-auto w-full max-w-3xl lg:mx-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-100 shadow-lg backdrop-blur-md sm:text-xs">
              <MapPinned
                size={15}
              />

              Desa Wisata Keji
            </div>

            <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-300">
              Jelajah • Budaya •
              Pengalaman Lokal
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {
                settings.judul
              }
            </h1>

            <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-emerald-50/90 sm:text-lg">
              {
                settings.subjudul
              }
            </p>

            <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-emerald-100/70 sm:text-base">
              {
                settings.deskripsi
              }
            </p>

            {/* BADGES */}

            <div className="mt-8 flex flex-wrap gap-3">
              <InfoBadge
                text="Informasi Terpusat"
              />

              <InfoBadge
                text="Mudah Diakses"
              />

              <InfoBadge
                text="Paket Wisata Desa"
              />

              <InfoBadge
                text="Panduan HPP"
              />
            </div>

            {/* INFO */}

            <div className="mt-8 grid max-w-2xl gap-3">
              <InfoRow
                icon={
                  Compass
                }
                title="Jelajahi Desa Keji"
                text="Temukan informasi wisata, pengalaman lokal, budaya, dan potensi menarik yang dimiliki Desa Keji."
              />

              <InfoRow
                icon={
                  Sparkles
                }
                title="Informasi dalam Satu Tautan"
                text="Seluruh informasi Paket Wisata Desa Keji dapat diakses melalui satu halaman yang praktis."
              />

              <InfoRow
                icon={
                  Calculator
                }
                title="Panduan Perhitungan HPP"
                text="Tersedia buku panduan untuk membantu penyusunan Harga Pokok Paket Wisata Desa Keji secara lebih terarah."
              />

              <InfoRow
                icon={
                  Info
                }
                title="Informasi Dapat Diperbarui"
                text="Tautan Paket Wisata dapat diperbarui melalui halaman administrator tanpa mengubah kode halaman publik."
              />
            </div>

            {/* CTA */}

            <div className="mt-9 flex flex-wrap gap-3">
              {linktreeUrl && (
                <a
                  href={
                    linktreeUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-emerald-300 px-7 text-sm font-black text-emerald-950 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:bg-emerald-200"
                >
                  <Link2
                    size={19}
                  />

                  {
                    settings
                      .tombol_label
                  }

                  <ArrowUpRight
                    size={18}
                    className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              )}

              <a
                href={
                  HPP_GUIDE_PDF
                }
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-7 text-sm font-black text-white shadow-lg backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/15"
              >
                <BookOpen
                  size={19}
                />

                Buka Panduan HPP

                <ExternalLink
                  size={16}
                />
              </a>
            </div>
          </section>

          {/* =================================================
              CARD PAKET WISATA
          ================================================= */}

          <section className="relative mx-auto w-full max-w-[460px] lg:ml-auto">
            <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-emerald-300/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2.4rem] border border-white/20 bg-[#f8faf8] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.32)] sm:p-6">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <MapPinned
                    size={23}
                  />
                </div>

                <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-700">
                  Desa Wisata
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-emerald-950 sm:text-4xl">
                  Keji
                </h2>

                <div className="mx-auto mt-4 h-1 w-10 rounded-full bg-emerald-600" />
              </div>

              {/* POSTER */}

              <a
                href={
                  linktreeUrl ||
                  PAKET_WISATA_URL
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Buka Paket Wisata Desa Keji"
                className="group relative mt-7 block overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-emerald-50 p-2.5 shadow-sm transition duration-300 hover:border-emerald-300 hover:shadow-xl"
              >
                <div className="relative overflow-hidden rounded-[1.25rem]">
                  <Image
                    src={
                      PAKET_WISATA_IMAGE
                    }
                    alt="Paket Wisata Desa Keji"
                    width={
                      1000
                    }
                    height={
                      1400
                    }
                    priority
                    className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                  <div className="absolute inset-x-4 bottom-4 flex translate-y-3 justify-center opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-emerald-800 shadow-xl">
                      Lihat Paket Wisata

                      <ArrowUpRight
                        size={15}
                      />
                    </span>
                  </div>
                </div>
              </a>

              <div className="mt-6 text-center">
                <p className="text-sm font-semibold leading-7 text-slate-600">
                  {
                    settings.subjudul
                  }
                </p>

                <div className="mx-auto mt-5 inline-flex items-start gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-800">
                  <MapPinned
                    size={16}
                    className="mt-0.5 shrink-0"
                  />

                  <p className="text-xs font-bold leading-5">
                    Desa Keji,
                    Kecamatan Ungaran
                    Barat, Kabupaten
                    Semarang, Jawa
                    Tengah
                  </p>
                </div>
              </div>

              {/* LINKS */}

              <div className="mt-7 space-y-3">
                {linktreeUrl ? (
                  <a
                    href={
                      linktreeUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[60px] w-full items-center justify-between rounded-2xl bg-emerald-700 px-5 text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-800"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                        <Link2
                          size={18}
                        />
                      </span>

                      <span className="text-left">
                        <span className="block text-[9px] font-extrabold uppercase tracking-[0.14em] text-emerald-200">
                          Informasi
                          Wisata
                        </span>

                        <span className="mt-0.5 block text-sm font-black">
                          {
                            settings
                              .tombol_label
                          }
                        </span>
                      </span>
                    </span>

                    <ArrowUpRight
                      size={18}
                    />
                  </a>
                ) : (
                  <div className="flex min-h-[60px] w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-100 px-5 text-slate-400">
                    <Link2
                      size={18}
                    />

                    <span className="text-sm font-extrabold">
                      Paket wisata belum tersedia
                    </span>
                  </div>
                )}

                <DocumentActionLink
                  href={
                    HPP_GUIDE_PDF
                  }
                  icon={
                    BookOpen
                  }
                  eyebrow="Dokumen Pendukung"
                  label="Panduan Perhitungan HPP"
                />

                <ActionLink
                  href="/desa-wisata"
                  icon={
                    Globe
                  }
                  eyebrow="Desa Wisata"
                  label="Jelajahi Desa Keji"
                />

                <ActionLink
                  href="/kontak"
                  icon={
                    MessageCircle
                  }
                  eyebrow="Informasi"
                  label="Hubungi Desa Keji"
                />
              </div>

              <div className="mt-7 border-t border-emerald-100 pt-5 text-center">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                  Desa Keji
                </p>

                <p className="mt-1 text-[10px] font-semibold text-slate-400">
                  Sistem Informasi
                  Desa Keji
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* =====================================================
            HPP SECTION
        ===================================================== */}

        <section className="relative mt-20 overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/[0.08] shadow-[0_30px_80px_rgba(0,0,0,0.18)] backdrop-blur-md">
          {/* DECORATION */}

          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-300/10 blur-[80px]" />

          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-teal-300/10 blur-[80px]" />

          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,.9) 1px, transparent 1px)',

              backgroundSize:
                '25px 25px',
            }}
          />

          <div className="relative grid lg:grid-cols-[390px_minmax(0,1fr)]">
            {/* =================================================
                COVER
            ================================================= */}

            <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-100 via-[#eef7d3] to-amber-50 p-8 sm:p-10 lg:p-12">
              <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-lime-300/30 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-emerald-300/30 blur-3xl" />

              <a
                href={
                  HPP_GUIDE_PDF
                }
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full max-w-[285px]"
              >
                {/* SHADOW BOOK */}

                <div className="absolute -bottom-5 left-1/2 h-8 w-[80%] -translate-x-1/2 rounded-full bg-emerald-950/25 blur-xl" />

                <div className="relative overflow-hidden rounded-[1.6rem] bg-white p-2.5 shadow-[0_25px_60px_rgba(6,78,59,0.28)] transition duration-500 group-hover:-translate-y-2 group-hover:rotate-[-1deg]">
                  <div className="overflow-hidden rounded-[1.2rem]">
                    <Image
                      src={
                        HPP_COVER_IMAGE
                      }
                      alt="Cover Buku Panduan Perhitungan Harga Pokok HPP Paket Wisata Desa Keji"
                      width={
                        900
                      }
                      height={
                        1270
                      }
                      className="h-auto w-full object-contain"
                    />
                  </div>
                </div>

                <div className="absolute inset-x-4 bottom-4 flex justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-950/90 px-4 py-2.5 text-xs font-extrabold text-white shadow-xl backdrop-blur">
                    <BookOpen
                      size={15}
                    />

                    Buka Buku
                  </span>
                </div>
              </a>
            </div>

            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="relative p-7 text-white sm:p-10 lg:p-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-200">
                <Calculator
                  size={14}
                />

                Panduan Pengelolaan Paket Wisata
              </div>

              <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-300">
                Dokumen Pendukung
              </p>

              <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                Buku Panduan
                Perhitungan Harga
                Pokok (HPP) Paket
                Wisata Desa Keji
              </h2>

              <p className="mt-6 max-w-3xl text-sm font-medium leading-8 text-emerald-50/75 sm:text-base">
                Buku panduan ini
                disediakan sebagai
                referensi untuk
                membantu pengelola
                Desa Wisata Keji
                dalam memahami dan
                menghitung Harga
                Pokok Paket Wisata
                secara lebih
                sistematis,
                transparan, dan
                terukur.
              </p>

              {/* POINTS */}

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <FeaturePoint
                  icon={
                    Calculator
                  }
                  title="Perhitungan HPP"
                  text="Membantu menentukan komponen biaya dalam suatu paket wisata."
                />

                <FeaturePoint
                  icon={
                    FileText
                  }
                  title="Panduan Praktis"
                  text="Disusun sebagai dokumen referensi yang dapat dibaca kembali kapan saja."
                />

                <FeaturePoint
                  icon={
                    BadgeCheck
                  }
                  title="Pendukung Pengelolaan"
                  text="Mendukung pengelolaan paket wisata agar lebih terstruktur."
                />

                <FeaturePoint
                  icon={
                    BookOpen
                  }
                  title="Akses Digital"
                  text="Dapat dibaca langsung melalui browser atau diunduh dalam format PDF."
                />
              </div>

              {/* ACTION */}

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href={
                    HPP_GUIDE_PDF
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-6 text-sm font-black text-emerald-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-200"
                >
                  <BookOpen
                    size={17}
                  />

                  Baca Buku Panduan

                  <ExternalLink
                    size={14}
                  />
                </a>

                <a
                  href={
                    HPP_GUIDE_PDF
                  }
                  download="Buku Panduan Perhitungan Harga Pokok (HPP) Paket Wisata Desa Keji.pdf"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-extrabold text-white transition hover:bg-white/15"
                >
                  <Download
                    size={17}
                  />

                  Unduh PDF
                </a>
              </div>

              <div className="mt-8 border-t border-white/10 pt-5">
                <p className="text-[11px] font-semibold leading-5 text-emerald-100/50">
                  Klik cover atau
                  tombol Baca Buku
                  Panduan untuk
                  membuka dokumen
                  dalam tab baru.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   INFO BADGE
========================================================= */

function InfoBadge({
  text,
}: {
  text:
    string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.1em] text-emerald-100 backdrop-blur">
      <BadgeCheck
        size={13}
        className="text-emerald-300"
      />

      {text}
    </span>
  );
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  icon:
    Icon,
  title,
  text,
}: {
  icon:
    LucideIcon;

  title:
    string;

  text:
    string;
}) {
  return (
    <article className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm transition hover:bg-white/[0.10]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-300/15 text-emerald-200">
        <Icon
          size={19}
        />
      </div>

      <div>
        <h2 className="text-sm font-black text-white">
          {title}
        </h2>

        <p className="mt-1 text-xs font-medium leading-6 text-emerald-50/70">
          {text}
        </p>
      </div>
    </article>
  );
}

/* =========================================================
   FEATURE POINT
========================================================= */

function FeaturePoint({
  icon:
    Icon,
  title,
  text,
}: {
  icon:
    LucideIcon;

  title:
    string;

  text:
    string;
}) {
  return (
    <article className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-300/15 text-emerald-200">
        <Icon
          size={18}
        />
      </div>

      <div>
        <h3 className="text-xs font-black text-white">
          {title}
        </h3>

        <p className="mt-1 text-[11px] font-medium leading-5 text-emerald-50/60">
          {text}
        </p>
      </div>
    </article>
  );
}

/* =========================================================
   INTERNAL LINK
========================================================= */

function ActionLink({
  href,
  icon:
    Icon,
  eyebrow,
  label,
}: {
  href:
    string;

  icon:
    LucideIcon;

  eyebrow:
    string;

  label:
    string;
}) {
  return (
    <Link
      href={
        href
      }
      className="group flex min-h-[60px] w-full items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50 px-5 text-emerald-900 transition duration-300 hover:border-emerald-200 hover:bg-emerald-100"
    >
      <span className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
          <Icon
            size={18}
          />
        </span>

        <span className="text-left">
          <span className="block text-[9px] font-extrabold uppercase tracking-[0.13em] text-emerald-600">
            {eyebrow}
          </span>

          <span className="mt-0.5 block text-sm font-black">
            {label}
          </span>
        </span>
      </span>

      <ArrowRight
        size={17}
        className="text-emerald-500 transition group-hover:translate-x-1"
      />
    </Link>
  );
}

/* =========================================================
   DOCUMENT LINK
========================================================= */

function DocumentActionLink({
  href,
  icon:
    Icon,
  eyebrow,
  label,
}: {
  href:
    string;

  icon:
    LucideIcon;

  eyebrow:
    string;

  label:
    string;
}) {
  return (
    <a
      href={
        href
      }
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-h-[60px] w-full items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-5 text-emerald-950 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-100"
    >
      <span className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
          <Icon
            size={18}
          />
        </span>

        <span className="text-left">
          <span className="block text-[9px] font-extrabold uppercase tracking-[0.13em] text-emerald-600">
            {eyebrow}
          </span>

          <span className="mt-0.5 block text-sm font-black">
            {label}
          </span>
        </span>
      </span>

      <ExternalLink
        size={17}
        className="text-emerald-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
}