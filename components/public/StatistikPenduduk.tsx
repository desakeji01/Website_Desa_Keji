// components/public/StatistikPenduduk.tsx

'use client';

import {
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';

import {
  ArrowUpRight,
  User,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';

import type {
  ProfilDesa,
} from '@/types/profil-desa';

const fallbackData: ProfilDesa = {
  id: '',
  profil_key: 'utama',
  jumlah_laki_laki: 0,
  jumlah_perempuan: 0,
  jumlah_dusun: 0,
  jumlah_rw: 0,
  jumlah_rt: 0,
  tahun_data: new Date().getFullYear(),
  updated_at: '',
};

interface ProfilDesaApiResponse {
  data?: Partial<ProfilDesa> | null;
  message?: string;
}

function formatAngka(value: number) {
  return new Intl.NumberFormat(
    'id-ID'
  ).format(value);
}

export default function StatistikPenduduk() {
  const [data, setData] =
    useState<ProfilDesa>(
      fallbackData
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  useEffect(() => {
    const controller =
      new AbortController();

    let isMounted = true;

    async function loadProfilDesa() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await fetch(
          '/api/profil-desa',
          {
            method: 'GET',
            cache: 'no-store',
            signal: controller.signal,
            headers: {
              Accept: 'application/json',
            },
          }
        );

        const result =
          (await response.json()) as ProfilDesaApiResponse;

        if (!response.ok) {
          throw new Error(
            result.message ??
              'Data kependudukan gagal dimuat.'
          );
        }

        if (!result.data) {
          throw new Error(
            'Data kependudukan belum tersedia.'
          );
        }

        if (!isMounted) {
          return;
        }

        const profil = result.data;

        setData({
          id: String(profil.id ?? ''),

          profil_key: String(
            profil.profil_key ?? 'utama'
          ),

          jumlah_laki_laki: Number(
            profil.jumlah_laki_laki ?? 0
          ),

          jumlah_perempuan: Number(
            profil.jumlah_perempuan ?? 0
          ),

          jumlah_dusun: Number(
            profil.jumlah_dusun ?? 0
          ),

          jumlah_rw: Number(
            profil.jumlah_rw ?? 0
          ),

          jumlah_rt: Number(
            profil.jumlah_rt ?? 0
          ),

          tahun_data: Number(
            profil.tahun_data ??
              new Date().getFullYear()
          ),

          updated_at: String(
            profil.updated_at ?? ''
          ),
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === 'AbortError'
        ) {
          return;
        }

        console.error(
          'Gagal mengambil statistik penduduk:',
          error
        );

        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Data kependudukan gagal dimuat.'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfilDesa();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const totalPenduduk =
    data.jumlah_laki_laki +
    data.jumlah_perempuan;

  return (
    <aside
      aria-busy={isLoading}
      className="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-7 lg:col-span-4"
    >
      {/* Ornamen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-50"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-tr-full bg-emerald-50/60"
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-emerald-600">
              Data Kependudukan
            </p>

            <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900">
              Statistik Penduduk
            </h2>

            <p className="mt-1 text-xs font-medium text-slate-400">
              Data Desa Keji tahun{' '}
              {data.tahun_data}
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-900/20">
            <Users size={21} />
          </div>
        </div>

        {/* Total Penduduk */}
        <div className="mt-7 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 p-5 text-white shadow-lg">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200">
            Total Penduduk
          </p>

          <div className="mt-2 flex items-end justify-between">
            {isLoading ? (
              <div className="h-10 w-28 animate-pulse rounded-lg bg-white/15" />
            ) : (
              <p className="text-4xl font-black tracking-tight">
                {formatAngka(
                  totalPenduduk
                )}
              </p>
            )}

            <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold text-emerald-100">
              Jiwa
            </span>
          </div>
        </div>

        {/* Laki-laki dan Perempuan */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <StatCard
            icon={User}
            value={
              data.jumlah_laki_laki
            }
            label="Laki-laki"
            loading={isLoading}
          />

          <StatCard
            icon={UserPlus}
            value={
              data.jumlah_perempuan
            }
            label="Perempuan"
            loading={isLoading}
          />
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
            <p className="text-[11px] font-semibold leading-relaxed text-amber-700">
              {errorMessage}
            </p>
          </div>
        )}

        <Link
          href="/profil/data"
          className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.1em] text-emerald-700 transition hover:text-emerald-900"
        >
          Lihat data selengkapnya
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </aside>
  );
}

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  loading: boolean;
}

function StatCard({
  icon: Icon,
  value,
  label,
  loading,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
        <Icon size={17} />
      </div>

      {loading ? (
        <div className="mt-4 h-8 w-20 animate-pulse rounded-lg bg-emerald-100" />
      ) : (
        <p className="mt-4 text-2xl font-black text-slate-900">
          {formatAngka(value)}
        </p>
      )}

      <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.13em] text-slate-500">
        {label}
      </p>
    </div>
  );
}