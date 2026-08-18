// app/admin/beranda/page.tsx

import Link from 'next/link';

import {
  ExternalLink,
  Home,
  Info,
  Settings,
} from 'lucide-react';

import FormBeranda from '@/components/admin/FormBeranda';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import {
  BERANDA_DEFAULTS,
} from '@/lib/beranda-defaults';

import type {
  BerandaPublicData,
} from '@/types/beranda';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

const BERANDA_KEY = 'utama';

export default async function AdminBerandaPage() {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from('beranda_public')
    .select(`
      beranda_key,
      hero_teks_1,
      hero_teks_2,
      hero_teks_3,
      hero_lokasi,
      hero_placeholder,
      background_url,
      logo_url,
      nama_kepala_desa,
      jabatan_kepala_desa,
      foto_kepala_desa_url,
      sambutan_kepala_desa,
      informasi_1,
      informasi_2,
      informasi_3,
      informasi_4,
      alamat_kantor,
      maps_embed_url,
      maps_link_url,
      sholat_subuh,
      sholat_dzuhur,
      sholat_ashar,
      sholat_maghrib,
      sholat_isya,
      jam_senin_kamis,
      jam_jumat,
      jam_akhir_pekan,
      updated_at
    `)
    .eq(
      'beranda_key',
      BERANDA_KEY
    )
    .maybeSingle();

  if (error) {
    console.error(
      'Gagal mengambil konfigurasi beranda:',
      {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }
    );
  }

  const initialData:
    BerandaPublicData = {
    ...BERANDA_DEFAULTS,
    ...(data ?? {}),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7">
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

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <Home size={27} />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                Publikasi Desa
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                Beranda Publik
              </h1>

              <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-emerald-50/80">
                Kelola hero, sambutan kepala desa,
                informasi berjalan, lokasi kantor,
                jadwal salat, dan jam pelayanan.
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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-900">
          <Info
            size={20}
            className="mt-0.5 shrink-0"
          />

          <p className="text-sm font-semibold leading-6">
            Statistik penduduk tetap dikelola melalui
            modul Profil dan Pengaturan. Berita terbaru
            tetap dikelola melalui modul Kelola Berita.
          </p>
        </div>

        <Link
          href="/admin/pengaturan"
          className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 transition hover:bg-emerald-100"
        >
          <div className="flex items-center gap-3">
            <Settings
              size={20}
              className="shrink-0"
            />

            <div>
              <p className="text-sm font-black">
                Statistik Penduduk
              </p>

              <p className="mt-1 text-xs font-semibold text-emerald-700">
                Buka Profil & Pengaturan
              </p>
            </div>
          </div>

          <ExternalLink size={16} />
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
          Data lama gagal dimuat. Formulir menggunakan
          konfigurasi bawaan.
        </div>
      )}

      <FormBeranda
        initialData={
          initialData
        }
      />
    </div>
  );
}