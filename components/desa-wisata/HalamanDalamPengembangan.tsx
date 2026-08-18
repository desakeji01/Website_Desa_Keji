// components/desa-wisata/HalamanDalamPengembangan.tsx

import Link from 'next/link';

import {
  ArrowLeft,
  Construction,
  type LucideIcon,
} from 'lucide-react';

interface HalamanDalamPengembanganProps {
  judul: string;
  deskripsi: string;
  ikon: LucideIcon;
}

export default function HalamanDalamPengembangan({
  judul,
  deskripsi,
  ikon: Icon,
}: HalamanDalamPengembanganProps) {
  return (
    <div className="min-h-[75vh] bg-slate-50 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/desa-wisata"
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:text-emerald-900"
        >
          <ArrowLeft size={17} />
          Kembali ke Desa Wisata
        </Link>

        <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'radial-gradient(circle, #047857 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative flex min-h-[520px] items-center justify-center px-6 py-14 text-center sm:px-10">
            <div className="max-w-2xl">
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-emerald-200/60 blur-2xl" />

                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-700 to-teal-600 text-white shadow-xl shadow-emerald-900/20">
                  <Icon size={36} />
                </div>
              </div>

              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.15em] text-amber-700">
                <Construction size={15} />
                Masih dalam Pengembangan
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {judul}
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-7 text-slate-500 sm:text-base">
                {deskripsi}
              </p>

              <div className="mx-auto mt-8 h-1 w-32 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400" />
              </div>

              <p className="mt-4 text-xs font-semibold text-slate-400">
                Informasi akan segera tersedia di SIJI
              </p>

              <Link
                href="/desa-wisata"
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-800"
              >
                <ArrowLeft size={17} />
                Jelajahi Desa Keji
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}