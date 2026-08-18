// app/admin/data-desa/penduduk/page.tsx

import Link from 'next/link';

import {
  ExternalLink,
  Info,
  UsersRound,
} from 'lucide-react';

import FormStatistikPenduduk from '@/components/admin/FormStatistikPenduduk';

import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

interface StatistikRow {
  tahun_data: number;
  jumlah_penduduk: number;
  jumlah_laki_laki: number;
  jumlah_perempuan: number;
  jumlah_kk: number;
  keterangan: string | null;
  aktif: boolean;
  updated_at: string;
}

export default async function AdminStatistikPendudukPage() {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from(
      'statistik_penduduk_beranda'
    )
    .select(`
      tahun_data,
      jumlah_penduduk,
      jumlah_laki_laki,
      jumlah_perempuan,
      jumlah_kk,
      keterangan,
      aktif,
      updated_at
    `)
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    console.error(
      'Gagal mengambil statistik penduduk:',
      {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }
    );
  }

  const statistik =
    data as StatistikRow | null;

  const initialData = {
    tahunData:
      statistik?.tahun_data ??
      new Date().getFullYear(),

    jumlahPenduduk:
      statistik?.jumlah_penduduk ??
      0,

    jumlahLakiLaki:
      statistik?.jumlah_laki_laki ??
      0,

    jumlahPerempuan:
      statistik?.jumlah_perempuan ??
      0,

    jumlahKk:
      statistik?.jumlah_kk ??
      0,

    keterangan:
      statistik?.keterangan ??
      '',

    aktif:
      statistik?.aktif ??
      true,
  };

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] px-6 py-7 text-white shadow-xl shadow-emerald-950/10 sm:px-8 sm:py-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.13) 1.5px, transparent 1.5px)',
            backgroundSize:
              '26px 26px',
          }}
        />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <UsersRound size={27} />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                Data Desa
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                Statistik Penduduk Beranda
              </h1>

              <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-emerald-50/80">
                Kelola data ringkasan penduduk yang
                ditampilkan pada halaman utama website
                Desa Keji.
              </p>
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white transition hover:bg-white/15"
          >
            Lihat Beranda

            <ExternalLink size={16} />
          </Link>
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-900">
        <Info
          size={20}
          className="mt-0.5 shrink-0"
        />

        <p className="text-sm font-semibold leading-6">
          Modul ini tidak terhubung dengan data Desa
          Cantik. Perubahan hanya memengaruhi statistik
          penduduk pada beranda publik.
        </p>
      </div>

      <FormStatistikPenduduk
        initialData={initialData}
      />
    </div>
  );
}