// app/admin/kontak/page.tsx

import Link from 'next/link';

import {
  CheckCircle2,
  ContactRound,
  ExternalLink,
  Phone,
  ShieldCheck,
} from 'lucide-react';

import FormPengaturanKontak from '@/components/admin/FormPengaturanKontak';
import KelolaEtikaKontak from '@/components/admin/KelolaEtikaKontak';
import KelolaJadwalKontak from '@/components/admin/KelolaJadwalKontak';
import KelolaKontakDesa from '@/components/admin/KelolaKontakDesa';

import {
  KONTAK_DESA_DEFAULTS,
} from '@/lib/kontak-defaults';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  EtikaPelayananDesa,
  JadwalPelayananDesa,
  KontakDesaItem,
  KontakDesaSettings,
} from '@/types/kontak-desa';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function AdminKontakPage({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;

  const [
    settingsResult,
    kontakResult,
    jadwalResult,
    etikaResult,
  ] = await Promise.all([
    supabaseAdmin
      .from('kontak_desa')
      .select('*')
      .eq(
        'kontak_key',
        'utama'
      )
      .maybeSingle(),

    supabaseAdmin
      .from(
        'kontak_desa_item'
      )
      .select('*')
      .order('urutan', {
        ascending: true,
      }),

    supabaseAdmin
      .from(
        'jadwal_pelayanan_desa'
      )
      .select('*')
      .order('urutan', {
        ascending: true,
      }),

    supabaseAdmin
      .from(
        'etika_pelayanan_desa'
      )
      .select('*')
      .order('urutan', {
        ascending: true,
      }),
  ]);

  const settings:
    KontakDesaSettings = {
    ...KONTAK_DESA_DEFAULTS,
    ...(settingsResult.data ??
      {}),
  };

  const daftarKontak =
    (
      kontakResult.data ??
      []
    ) as KontakDesaItem[];

  const jadwal =
    (
      jadwalResult.data ??
      []
    ) as JadwalPelayananDesa[];

  const daftarEtika =
    (
      etikaResult.data ??
      []
    ) as EtikaPelayananDesa[];

  const statusMessages:
    Record<string, string> = {
    'kontak-created':
      'Kontak berhasil ditambahkan.',

    'kontak-updated':
      'Kontak berhasil diperbarui.',

    'jadwal-created':
      'Jadwal berhasil ditambahkan.',

    'jadwal-updated':
      'Jadwal berhasil diperbarui.',

    'etika-created':
      'Etika pelayanan berhasil ditambahkan.',

    'etika-updated':
      'Etika pelayanan berhasil diperbarui.',
  };

  const successMessage =
    params.status
      ? statusMessages[
          params.status
        ]
      : '';

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] px-6 py-8 text-white shadow-xl">
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <ContactRound
                size={28}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                Data dan Pemerintahan
              </p>

              <h1 className="mt-2 text-3xl font-black">
                Kontak Desa
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-medium text-emerald-50/80">
                Kelola kontak perangkat, nomor WhatsApp,
                jadwal pelayanan, poster, etika
                pengaduan, dan informasi darurat.
              </p>
            </div>
          </div>

          <Link
            href="/kontak"
            target="_blank"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold"
          >
            Lihat Halaman Publik

            <ExternalLink
              size={16}
            />
          </Link>
        </div>
      </section>

      {successMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle2
            size={20}
          />

          <p className="text-sm font-semibold">
            {successMessage}
          </p>
        </div>
      )}

      <section className="grid gap-5 sm:grid-cols-3">
        <StatCard
          label="Kontak Tersimpan"
          value={
            daftarKontak.length
          }
          icon={Phone}
        />

        <StatCard
          label="Kontak Aktif"
          value={
            daftarKontak.filter(
              (item) =>
                item.aktif
            ).length
          }
          icon={ContactRound}
        />

        <StatCard
          label="Kontak Utama"
          value={
            daftarKontak.filter(
              (item) =>
                item.featured
            ).length
          }
          icon={ShieldCheck}
        />
      </section>

      <FormPengaturanKontak
        initialData={settings}
      />

      <KelolaKontakDesa
        daftarKontak={
          daftarKontak
        }
      />

      <div className="grid gap-7 xl:grid-cols-2">
        <KelolaJadwalKontak
          jadwal={jadwal}
        />

        <KelolaEtikaKontak
          daftarEtika={
            daftarEtika
          }
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Phone;
}) {
  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-4xl font-black text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Icon size={22} />
        </div>
      </div>
    </article>
  );
}