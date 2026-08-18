// app/(public)/desa-wisata/pedoman-administrasi/page.tsx

import type { Metadata } from 'next';

import Link from 'next/link';

import {
  ArrowLeft,
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  ShieldCheck,
} from 'lucide-react';

import { notFound } from 'next/navigation';

import { supabaseAdmin } from '@/lib/supabase-admin';

export const metadata: Metadata = {
  title:
    'Pedoman Administrasi Desa Wisata Keji | SIJI',

  description:
    'Buku Pedoman Administrasi sebagai panduan tata kelola administrasi Desa Wisata Keji.',
};

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

/* =========================================================
   TYPES
========================================================= */

interface PedomanAdministrasi {
  judul: string;

  deskripsi: string;

  coverUrl: string;

  pdfUrl: string;

  tahun: number;

  aktif: boolean;
}

/* =========================================================
   FALLBACK
========================================================= */

const fallbackPedoman:
  PedomanAdministrasi = {
  judul:
    'Pedoman Administrasi',

  deskripsi:
    'Buku pedoman administrasi sebagai panduan pengelolaan administrasi dalam mendukung tata kelola Desa Wisata Keji yang tertib dan terstruktur.',

  coverUrl:
    '/desa-wisata/Cover Pokdarwis.png',

  pdfUrl:
    '/desa-wisata/Green White Modern Agriculture Company Profile Booklet.pdf',

  tahun:
    2026,

  aktif:
    true,
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

function normalizeResourceUrl(
  value: unknown,
  fallback: string
) {
  const raw =
    safeString(value);

  if (!raw) {
    return fallback;
  }

  if (
    raw.startsWith('/') &&
    !raw.startsWith('//')
  ) {
    return raw;
  }

  try {
    const url =
      new URL(raw);

    if (
      url.protocol ===
        'https:' ||
      url.protocol ===
        'http:'
    ) {
      return url.toString();
    }

    return fallback;
  } catch {
    return fallback;
  }
}

function normalizePedoman(
  value: unknown
): PedomanAdministrasi {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(value)
  ) {
    return fallbackPedoman;
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  const tahun =
    Number(
      row.tahun
    );

  return {
    judul:
      safeString(
        row.judul
      ) ||
      fallbackPedoman.judul,

    deskripsi:
      safeString(
        row.deskripsi
      ) ||
      fallbackPedoman.deskripsi,

    coverUrl:
      normalizeResourceUrl(
        row.cover_url,
        fallbackPedoman.coverUrl
      ),

    pdfUrl:
      normalizeResourceUrl(
        row.pdf_url,
        fallbackPedoman.pdfUrl
      ),

    tahun:
      Number.isInteger(
        tahun
      )
        ? tahun
        : fallbackPedoman.tahun,

    aktif:
      row.aktif === null ||
      row.aktif === undefined
        ? fallbackPedoman.aktif
        : Boolean(
            row.aktif
          ),
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function PedomanAdministrasiPage() {
  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from(
        'desa_wisata_pedoman_administrasi_settings'
      )
      .select(`
        judul,
        deskripsi,
        cover_url,
        pdf_url,
        tahun,
        aktif
      `)
      .eq(
        'setting_key',
        'utama'
      )
      .maybeSingle();

  if (error) {
    console.error(
      'Gagal mengambil Pedoman Administrasi:',
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

  const pedoman =
    normalizePedoman(
      data
    );

  if (
    !pedoman.aktif
  ) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',

            backgroundSize:
              '27px 27px',
          }}
        />

        <div className="pointer-events-none absolute -right-32 -top-32 h-[430px] w-[430px] rounded-full border-[75px] border-white/[0.04]" />

        <div className="pointer-events-none absolute -bottom-40 -left-24 h-[400px] w-[400px] rounded-full bg-emerald-300/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <Link
            href="/desa-wisata"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-emerald-200 transition hover:text-white"
          >
            <ArrowLeft
              size={15}
            />

            Desa Wisata
          </Link>

          <div className="mt-8 flex max-w-4xl items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <BookOpen
                size={27}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
                Panduan & Pedoman
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                {pedoman.judul}
              </h1>

              <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80 sm:text-base">
                Panduan administrasi
                untuk mendukung tata
                kelola Desa Wisata
                Keji yang tertib,
                terstruktur, dan
                berkelanjutan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BOOK SECTION
      ===================================================== */}

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-xl shadow-slate-900/[0.06]">
          <div className="grid lg:grid-cols-[370px_minmax(0,1fr)]">
            {/* =================================================
                COVER
            ================================================= */}

            <a
              href={
                pedoman.pdfUrl
              }
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Buka ${pedoman.judul}`}
              className="group relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-7 sm:p-9"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-35"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(6,78,59,0.16) 1px, transparent 1px)',

                  backgroundSize:
                    '22px 22px',
                }}
              />

              <div className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl bg-white shadow-2xl transition duration-500 group-hover:-translate-y-1 group-hover:shadow-emerald-950/20">
                <img
                  src={
                    pedoman.coverUrl
                  }
                  alt={`Cover ${pedoman.judul}`}
                  className="h-auto w-full object-contain"
                />
              </div>

              <div className="pointer-events-none absolute inset-x-6 bottom-6 flex justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-950/90 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg backdrop-blur">
                  <BookOpen
                    size={15}
                  />

                  Buka Pedoman
                </span>
              </div>
            </a>

            {/* =================================================
                INFORMASI
            ================================================= */}

            <div className="relative flex flex-col p-6 sm:p-8 lg:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-100/70 blur-3xl"
              />

              <div className="relative flex flex-1 flex-col">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <FileText
                    size={23}
                  />
                </div>

                <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-700">
                  Pedoman Desa Wisata
                </p>

                <h2 className="mt-3 text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
                  {pedoman.judul}
                </h2>

                <p className="mt-5 flex-1 whitespace-pre-line text-sm font-medium leading-8 text-slate-600 sm:text-base">
                  {
                    pedoman.deskripsi
                  }
                </p>

                {/* Badge */}

                <div className="mt-7 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                    Administrasi
                  </span>

                  <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                    Dokumen PDF
                  </span>

                  <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                    {pedoman.tahun}
                  </span>
                </div>

                {/* Buttons */}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={
                      pedoman.pdfUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white shadow-md transition hover:bg-emerald-800"
                  >
                    <BookOpen
                      size={18}
                    />

                    Baca Pedoman

                    <ExternalLink
                      size={15}
                    />
                  </a>

                  <a
                    href={
                      pedoman.pdfUrl
                    }
                    download
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-6 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <Download
                      size={17}
                    />

                    Unduh PDF
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            INFO
        =================================================== */}

        <section className="mt-8 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck
                size={21}
              />
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                Tata Kelola Desa Wisata
              </p>

              <h2 className="mt-1 text-lg font-black text-slate-900">
                Pedoman Administrasi
                Desa Wisata Keji
              </h2>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-slate-500">
                Dokumen ini digunakan
                sebagai bahan panduan
                dalam mendukung
                administrasi dan
                pengelolaan kegiatan
                Desa Wisata Keji.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}