// app/(public)/desa-anti-korupsi/pelayanan-publik/page.tsx

import type {
  Metadata,
} from 'next';

import Link from 'next/link';

import {
  ArrowLeft,
  BadgeCheck,
  ShieldCheck,
} from 'lucide-react';

import PelayananPublikClient from '@/components/anti-korupsi/PelayananPublikClient';

/* =========================================================
   METADATA
========================================================= */

export const metadata:
  Metadata = {
  title:
    'Kualitas Pelayanan Publik Desa Anti Korupsi | SIJI',

  description:
    'Dokumen dan bukti dukung penguatan kualitas pelayanan publik Desa Anti Korupsi Desa Keji.',
};

/* =========================================================
   PAGE
========================================================= */

export default function PelayananPublikPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-slate-50">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative isolate overflow-hidden bg-emerald-950 text-white">
        {/* BACKGROUND */}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/images/anti-korupsi/hero-anti-korupsi.jpg'), url('/background.png')",
          }}
        />

        {/* OVERLAY */}

        <div className="absolute inset-0 bg-gradient-to-r from-[#021b16] via-emerald-950/90 to-emerald-900/45" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#021b16] via-transparent to-black/20" />

        {/* PATTERN */}

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

        {/* DECORATION */}

        <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full border-[72px] border-white/[0.035]" />

        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[390px] w-[390px] rounded-full bg-emerald-300/10 blur-[110px]" />

        {/* CONTENT */}

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <Link
            href="/desa-anti-korupsi"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-100/80 transition hover:text-white"
          >
            <ArrowLeft
              size={15}
            />

            Kembali ke Desa Anti
            Korupsi
          </Link>

          <div className="mt-7 flex min-w-0 flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            {/* LEFT */}

            <div className="min-w-0 max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.17em] text-emerald-100 backdrop-blur sm:text-xs">
                <ShieldCheck
                  size={15}
                />

                Desa Anti Korupsi
              </div>

              <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-300">
                Indikator III
              </p>

              <h1 className="mt-3 break-words text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Penguatan Kualitas
                Pelayanan Publik
              </h1>

              <p className="mt-5 max-w-3xl text-sm font-medium leading-7 text-emerald-50/85 sm:text-base">
                Dokumen Survei
                Kepuasan Masyarakat,
                media informasi
                pelayanan, publikasi
                APBDes, maklumat
                pelayanan, serta
                prosedur pengaduan
                Pemerintah Desa Keji
                sebagai bukti
                peningkatan kualitas
                pelayanan publik.
              </p>
            </div>

            {/* COUNT */}

            <div className="shrink-0">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-bold text-emerald-50 backdrop-blur">
                <BadgeCheck
                  size={16}
                />

                5 indikator pelayanan
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <PelayananPublikClient />
      </main>
    </div>
  );
}