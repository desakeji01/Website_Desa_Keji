// app/(public)/kontak/page.tsx

import type { Metadata } from 'next';

import Link from 'next/link';

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Headphones,
  Info,
  Landmark,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Siren,
  type LucideIcon,
} from 'lucide-react';

import SidebarLayanan from '@/components/SidebarLayanan';
import SidebarTilikArkeji from '@/components/SidebarTilikArkeji';

import {
  ETIKA_PELAYANAN_DEFAULTS,
  JADWAL_PELAYANAN_DEFAULTS,
  KONTAK_DESA_DEFAULTS,
  KONTAK_ITEM_DEFAULTS,
} from '@/lib/kontak-defaults';

import { KONTAK_ICON_MAP } from '@/lib/kontak-icons';
import { supabaseAdmin } from '@/lib/supabase-admin';

import type {
  EtikaPelayananDesa,
  JadwalPelayananDesa,
  KontakDesaItem,
  KontakDesaSettings,
} from '@/types/kontak-desa';

import type { PilihanLayanan } from '@/types/layanan';

export const metadata: Metadata = {
  title: 'Kontak Pemerintah Desa Keji | SIJI',
  description:
    'Informasi kontak, jadwal pelayanan, alamat kantor, dan layanan pengaduan Pemerintah Desa Keji.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface LayananRow {
  id: number | string | null;
  nama: string | null;
  slug: string | null;
}

function safeString(value: unknown): string {
  return String(value ?? '').trim();
}

function safeBoolean(
  value: unknown,
  fallback = false
): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    if (value === 1) {
      return true;
    }

    if (value === 0) {
      return false;
    }
  }

  if (typeof value === 'string') {
    const normalizedValue = value
      .trim()
      .toLowerCase();

    if (
      normalizedValue === 'true' ||
      normalizedValue === '1'
    ) {
      return true;
    }

    if (
      normalizedValue === 'false' ||
      normalizedValue === '0'
    ) {
      return false;
    }
  }

  return fallback;
}

function safeInteger(
  value: unknown,
  fallback = 0
): number {
  const number = Number(value);

  if (
    !Number.isInteger(number) ||
    number < 0
  ) {
    return fallback;
  }

  return number;
}

function safePositiveInteger(
  value: unknown,
  fallback: number
): number {
  const number = Number(value);

  if (
    !Number.isInteger(number) ||
    number <= 0
  ) {
    return fallback;
  }

  return number;
}

function formatAngka(value: number): string {
  return new Intl.NumberFormat('id-ID').format(
    Number.isFinite(value)
      ? value
      : 0
  );
}

function normalizeSettings(
  data: unknown
): KontakDesaSettings {
  if (
    !data ||
    typeof data !== 'object' ||
    Array.isArray(data)
  ) {
    return {
      ...KONTAK_DESA_DEFAULTS,
    };
  }

  const row = data as Record<
    string,
    unknown
  >;

  const validEntries = Object.entries(
    row
  ).filter(([, value]) => {
    if (
      value === null ||
      value === undefined
    ) {
      return false;
    }

    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    return true;
  });

  return {
    ...KONTAK_DESA_DEFAULTS,
    ...Object.fromEntries(validEntries),
  } as KontakDesaSettings;
}

function normalizeKontakItems(
  data: unknown
): KontakDesaItem[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map(
      (
        item,
        index
      ): KontakDesaItem | null => {
        if (
          !item ||
          typeof item !== 'object' ||
          Array.isArray(item)
        ) {
          return null;
        }

        const row = item as Record<
          string,
          unknown
        >;

        const nama = safeString(
          row.nama
        );

        const nomor = safeString(
          row.nomor
        );

        if (!nama || !nomor) {
          return null;
        }

        const rawIconKey = safeString(
          row.icon_key
        );

        const iconKey = (
          rawIconKey &&
          rawIconKey in KONTAK_ICON_MAP
            ? rawIconKey
            : 'phone'
        ) as KontakDesaItem['icon_key'];

        return {
          id: safePositiveInteger(
            row.id,
            index + 1
          ),

          nama,

          jabatan:
            safeString(row.jabatan) ||
            'Kontak Pelayanan',

          deskripsi:
            safeString(
              row.deskripsi
            ) ||
            'Kontak pelayanan Pemerintah Desa Keji.',

          nomor,

          icon_key: iconKey,

          featured: safeBoolean(
            row.featured,
            false
          ),

          aktif: safeBoolean(
            row.aktif,
            true
          ),

          urutan: safeInteger(
            row.urutan,
            index + 1
          ),

          created_at: safeString(
            row.created_at
          ),

          updated_at: safeString(
            row.updated_at
          ),
        };
      }
    )
    .filter(
      (
        item
      ): item is KontakDesaItem =>
        item !== null
    )
    .sort(
      (first, second) =>
        first.urutan - second.urutan
    );
}

function normalizeJadwal(
  data: unknown
): JadwalPelayananDesa[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map(
      (
        item,
        index
      ): JadwalPelayananDesa | null => {
        if (
          !item ||
          typeof item !== 'object' ||
          Array.isArray(item)
        ) {
          return null;
        }

        const row = item as Record<
          string,
          unknown
        >;

        const hari = safeString(
          row.hari
        );

        const waktu = safeString(
          row.waktu
        );

        if (!hari || !waktu) {
          return null;
        }

        return {
          id: safePositiveInteger(
            row.id,
            index + 1
          ),

          hari,

          waktu,

          is_libur: safeBoolean(
            row.is_libur,
            false
          ),

          aktif: safeBoolean(
            row.aktif,
            true
          ),

          urutan: safeInteger(
            row.urutan,
            index + 1
          ),

          created_at: safeString(
            row.created_at
          ),

          updated_at: safeString(
            row.updated_at
          ),
        };
      }
    )
    .filter(
      (
        item
      ): item is JadwalPelayananDesa =>
        item !== null
    )
    .sort(
      (first, second) =>
        first.urutan - second.urutan
    );
}

function normalizeEtika(
  data: unknown
): EtikaPelayananDesa[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map(
      (
        item,
        index
      ): EtikaPelayananDesa | null => {
        if (
          !item ||
          typeof item !== 'object' ||
          Array.isArray(item)
        ) {
          return null;
        }

        const row = item as Record<
          string,
          unknown
        >;

        const teks = safeString(
          row.teks
        );

        if (!teks) {
          return null;
        }

        return {
          id: safePositiveInteger(
            row.id,
            index + 1
          ),

          teks,

          aktif: safeBoolean(
            row.aktif,
            true
          ),

          urutan: safeInteger(
            row.urutan,
            index + 1
          ),

          created_at: safeString(
            row.created_at
          ),

          updated_at: safeString(
            row.updated_at
          ),
        };
      }
    )
    .filter(
      (
        item
      ): item is EtikaPelayananDesa =>
        item !== null
    )
    .sort(
      (first, second) =>
        first.urutan - second.urutan
    );
}

function getSafePublicUrl(
  value: unknown
): string | null {
  const url = safeString(value);

  if (!url) {
    return null;
  }

  if (
    url.startsWith('/') &&
    !url.startsWith('//')
  ) {
    return url;
  }

  try {
    const parsedUrl = new URL(url);

    if (
      parsedUrl.protocol !== 'https:' &&
      parsedUrl.protocol !== 'http:'
    ) {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
}

function normalizeWhatsAppNumber(
  nomor: string
): string | null {
  let digits = nomor.replace(
    /\D/g,
    ''
  );

  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }

  if (digits.startsWith('0')) {
    digits = `62${digits.slice(1)}`;
  } else if (
    digits.startsWith('8')
  ) {
    digits = `62${digits}`;
  }

  if (
    !digits.startsWith('62') ||
    digits.length < 10 ||
    digits.length > 16
  ) {
    return null;
  }

  return digits;
}

function getWhatsAppLink(
  kontak: KontakDesaItem
): string | null {
  const phone =
    normalizeWhatsAppNumber(
      safeString(kontak.nomor)
    );

  if (!phone) {
    return null;
  }

  const nama =
    safeString(kontak.nama) ||
    'Pemerintah Desa Keji';

  const message = encodeURIComponent(
    `Selamat datang. Saya ingin menghubungi ${nama} terkait pelayanan atau pengaduan masyarakat Desa Keji.`
  );

  return `https://wa.me/${phone}?text=${message}`;
}

export default async function KontakPage() {
  const [
    settingsResult,
    kontakResult,
    jadwalResult,
    etikaResult,
    layananResult,
  ] = await Promise.all([
    supabaseAdmin
      .from('kontak_desa')
      .select('*')
      .eq('kontak_key', 'utama')
      .maybeSingle(),

    supabaseAdmin
      .from('kontak_desa_item')
      .select('*')
      .eq('aktif', true)
      .order('urutan', {
        ascending: true,
        nullsFirst: false,
      }),

    supabaseAdmin
      .from(
        'jadwal_pelayanan_desa'
      )
      .select('*')
      .eq('aktif', true)
      .order('urutan', {
        ascending: true,
        nullsFirst: false,
      }),

    supabaseAdmin
      .from(
        'etika_pelayanan_desa'
      )
      .select('*')
      .eq('aktif', true)
      .order('urutan', {
        ascending: true,
        nullsFirst: false,
      }),

    supabaseAdmin
      .from('layanan')
      .select(`
        id,
        nama,
        slug
      `)
      .eq('aktif', true)
      .order('urutan', {
        ascending: true,
        nullsFirst: false,
      })
      .order('nama', {
        ascending: true,
      }),
  ]);

  if (settingsResult.error) {
    console.error(
      'Gagal mengambil pengaturan kontak:',
      {
        message:
          settingsResult.error.message,
        code:
          settingsResult.error.code,
        details:
          settingsResult.error.details,
        hint:
          settingsResult.error.hint,
      }
    );
  }

  if (kontakResult.error) {
    console.error(
      'Gagal mengambil daftar kontak:',
      {
        message:
          kontakResult.error.message,
        code:
          kontakResult.error.code,
        details:
          kontakResult.error.details,
        hint:
          kontakResult.error.hint,
      }
    );
  }

  if (jadwalResult.error) {
    console.error(
      'Gagal mengambil jadwal pelayanan:',
      {
        message:
          jadwalResult.error.message,
        code:
          jadwalResult.error.code,
        details:
          jadwalResult.error.details,
        hint:
          jadwalResult.error.hint,
      }
    );
  }

  if (etikaResult.error) {
    console.error(
      'Gagal mengambil etika pelayanan:',
      {
        message:
          etikaResult.error.message,
        code:
          etikaResult.error.code,
        details:
          etikaResult.error.details,
        hint:
          etikaResult.error.hint,
      }
    );
  }

  if (layananResult.error) {
    console.error(
      'Gagal mengambil daftar layanan:',
      {
        message:
          layananResult.error.message,
        code:
          layananResult.error.code,
        details:
          layananResult.error.details,
        hint:
          layananResult.error.hint,
      }
    );
  }

  const settings =
    normalizeSettings(
      settingsResult.data
    );

  const daftarKontak =
    normalizeKontakItems(
      kontakResult.error
        ? KONTAK_ITEM_DEFAULTS
        : kontakResult.data ?? []
    );

  const jadwal =
    normalizeJadwal(
      jadwalResult.error
        ? JADWAL_PELAYANAN_DEFAULTS
        : jadwalResult.data ?? []
    );

  const daftarEtika =
    normalizeEtika(
      etikaResult.error
        ? ETIKA_PELAYANAN_DEFAULTS
        : etikaResult.data ?? []
    );

  const daftarLayanan:
    PilihanLayanan[] = (
      (
        layananResult.data ?? []
      ) as LayananRow[]
    )
      .map((item) => {
        const id = Number(item.id);
        const nama = safeString(
          item.nama
        );
        const slug = safeString(
          item.slug
        );

        return {
          id,
          nama,
          slug,
        };
      })
      .filter(
        (item) =>
          Number.isInteger(
            item.id
          ) &&
          item.id > 0 &&
          item.nama.length > 0 &&
          item.slug.length > 0
      );

  const kontakDarurat =
    daftarKontak.find(
      (item) =>
        item.featured &&
        Boolean(
          getWhatsAppLink(item)
        )
    ) ??
    daftarKontak.find((item) =>
      Boolean(
        getWhatsAppLink(item)
      )
    );

  const kontakDaruratUrl =
    kontakDarurat
      ? getWhatsAppLink(
          kontakDarurat
        )
      : null;

  const posterUrl =
    getSafePublicUrl(
      settings.poster_url
    );

  const posterAlt =
    safeString(
      settings.poster_alt
    ) ||
    'Poster kontak dan pelayanan Pemerintah Desa Keji';

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Halaman */}
        <header className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 px-6 py-8 text-white shadow-lg sm:px-8">
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

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[52px] border-white/[0.04]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-emerald-400/[0.06] blur-2xl"
          />

          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <Landmark size={24} />
            </div>

            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
              {settings.label_header}
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              {settings.judul_halaman}
            </h1>

            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80 sm:text-base">
              {settings.deskripsi_halaman}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <HeaderBadge
                label={`${formatAngka(
                  daftarKontak.length
                )} kontak layanan`}
              />

              <HeaderBadge
                label={
                  settings.estimasi_pelayanan
                }
              />

              <HeaderBadge
                label={
                  settings.label_biaya
                }
              />
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Konten Utama */}
          <main className="min-w-0 space-y-8 lg:w-2/3">
            {/* Hero Kontak */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 p-6 text-white shadow-xl sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,0.24) 1px, transparent 1px)',
                  backgroundSize:
                    '25px 25px',
                }}
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[52px] border-white/[0.05]"
              />

              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur">
                  <Headphones size={31} />
                </div>

                <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-200">
                  Layanan Masyarakat
                </p>

                <h2 className="mt-3 max-w-2xl text-2xl font-black leading-tight sm:text-3xl">
                  {settings.judul_hero}
                </h2>

                <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/85 sm:text-base sm:leading-8">
                  {settings.deskripsi_hero}
                </p>

                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  <HeroStat
                    icon={Phone}
                    value={
                      daftarKontak.length
                    }
                    label="Kontak Layanan"
                  />

                  <HeroStat
                    icon={Clock3}
                    value={
                      settings.estimasi_pelayanan
                    }
                    label="Estimasi Pelayanan"
                  />

                  <HeroStat
                    icon={ShieldCheck}
                    value={
                      settings.label_biaya
                    }
                    label="Administrasi Desa"
                  />
                </div>
              </div>
            </section>

            {/* Informasi Kantor */}
            <section className="grid gap-4 sm:grid-cols-2">
              <OfficeInfoCard
                icon={MapPin}
                label="Lokasi Pelayanan"
                title="Kantor Pemerintah Desa Keji"
                description={
                  settings.alamat_kantor
                }
              />

              <OfficeInfoCard
                icon={Clock3}
                label="Waktu Operasional"
                title={
                  settings.judul_jadwal
                }
                description="Pelayanan administrasi dilaksanakan sesuai jadwal operasional Pemerintah Desa Keji."
              />
            </section>

            {/* Daftar Kontak */}
            <section>
              <SectionHeading
                eyebrow="Kontak Pelayanan"
                title={
                  settings.judul_daftar_kontak
                }
                description={
                  settings.deskripsi_daftar_kontak
                }
              />

              {daftarKontak.length ===
              0 ? (
                <KontakEmptyState />
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {daftarKontak.map(
                    (kontak) => (
                      <KontakCard
                        key={kontak.id}
                        kontak={kontak}
                      />
                    )
                  )}
                </div>
              )}
            </section>

            {/* Poster */}
            <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
              <div className="flex items-start gap-4 border-b border-emerald-100 p-6 sm:p-8">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Info size={23} />
                </div>

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                    Informasi Visual
                  </p>

                  <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
                    {settings.judul_poster}
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                    {settings.deskripsi_poster}
                  </p>
                </div>
              </div>

              {posterUrl ? (
                <>
                  <div className="bg-emerald-50 p-3 sm:p-5">
                    <a
                      href={posterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-2xl bg-white shadow-sm"
                    >
                      <img
                        src={posterUrl}
                        alt={posterAlt}
                        loading="lazy"
                        className="h-auto w-full object-contain"
                      />
                    </a>
                  </div>

                  <div className="border-t border-emerald-100 p-5">
                    <a
                      href={posterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-extrabold text-emerald-700 transition hover:text-emerald-900"
                    >
                      Lihat poster ukuran
                      penuh

                      <ExternalLink
                        size={16}
                      />
                    </a>
                  </div>
                </>
              ) : (
                <PosterEmptyState />
              )}
            </section>

            {/* Jadwal Pelayanan */}
            <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
              <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                    <Clock3 size={23} />
                  </div>

                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                      Waktu Operasional
                    </p>

                    <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
                      {settings.judul_jadwal}
                    </h2>

                    <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                      Jadwal pelayanan
                      administrasi dan
                      pengaduan masyarakat
                      Desa Keji.
                    </p>
                  </div>
                </div>
              </div>

              {jadwal.length === 0 ? (
                <JadwalEmptyState />
              ) : (
                <div className="space-y-3 p-5 sm:p-8">
                  {jadwal.map(
                    (
                      item,
                      index
                    ) => (
                      <JadwalItem
                        key={item.id}
                        item={item}
                        nomor={
                          index + 1
                        }
                      />
                    )
                  )}
                </div>
              )}
            </section>

            {/* Etika Pelayanan */}
            <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                  <Info size={23} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                    Etika Pelayanan
                  </p>

                  <h2 className="mt-2 text-xl font-black text-emerald-950">
                    {settings.judul_etika}
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-emerald-800">
                    {settings.deskripsi_etika}
                  </p>

                  {daftarEtika.length >
                  0 && (
                    <div className="mt-5 space-y-3">
                      {daftarEtika.map(
                        (item) => (
                          <EtikaItem
                            key={item.id}
                            text={item.teks}
                          />
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Kondisi Darurat */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 p-6 text-white shadow-xl sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,0.24) 1px, transparent 1px)',
                  backgroundSize:
                    '25px 25px',
                }}
              />

              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                    <Siren size={17} />

                    Kondisi Darurat
                  </div>

                  <h2 className="mt-3 text-xl font-black sm:text-2xl">
                    {settings.judul_darurat}
                  </h2>

                  <p className="mt-2 max-w-xl text-sm font-medium leading-7 text-emerald-50/80">
                    {settings.deskripsi_darurat}
                  </p>
                </div>

                {kontakDaruratUrl ? (
                  <a
                    href={
                      kontakDaruratUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-800 transition hover:bg-emerald-50"
                  >
                    <MessageCircle
                      size={18}
                    />

                    Hubungi Pemerintah Desa
                  </a>
                ) : (
                  <span className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 px-5 text-sm font-bold text-emerald-100">
                    Kontak belum tersedia
                  </span>
                )}
              </div>
            </section>

            {/* Navigasi Layanan */}
            <section className="grid gap-4 sm:grid-cols-2">
              <QuickLinkCard
                href="/layanan"
                eyebrow="Administrasi"
                title="Layanan Desa"
              />

              <QuickLinkCard
                href="/ppid/permohonan-informasi"
                eyebrow="Informasi Publik"
                title="Layanan PPID"
              />
            </section>
          </main>

          {/* Sidebar Kanan */}
          <aside className="min-w-0 lg:w-1/3">
            <div className="flex flex-col gap-8 lg:sticky lg:top-24">
              <SidebarLayanan
                daftarLayanan={
                  daftarLayanan
                }
                sticky={false}
              />

              <SidebarTilikArkeji />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function HeaderBadge({
  label,
}: {
  label: string;
}) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-emerald-50 backdrop-blur">
      {label}
    </span>
  );
}

function HeroStat({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: number | string;
  label: string;
}) {
  return (
    <article className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
      <Icon
        size={19}
        className="text-emerald-200"
      />

      <p className="mt-3 break-words text-xl font-black text-white">
        {value}
      </p>

      <p className="mt-1 text-xs font-bold text-emerald-100/80">
        {label}
      </p>
    </article>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-black text-slate-900">
        {title}
      </h2>

      <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function OfficeInfoCard({
  icon: Icon,
  label,
  title,
  description,
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <article className="group rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
        <Icon size={23} />
      </div>

      <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
        {label}
      </p>

      <h2 className="mt-2 text-lg font-black text-slate-900">
        {title}
      </h2>

      <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
        {description}
      </p>
    </article>
  );
}

function KontakCard({
  kontak,
}: {
  kontak: KontakDesaItem;
}) {
  const iconKey = safeString(
    kontak.icon_key
  );

  const Icon =
    iconKey in KONTAK_ICON_MAP
      ? KONTAK_ICON_MAP[
          iconKey as keyof typeof KONTAK_ICON_MAP
        ]
      : Phone;

  const whatsappUrl =
    getWhatsAppLink(kontak);

  return (
    <article
      className={`group rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
        kontak.featured
          ? 'border-emerald-300'
          : 'border-emerald-100 hover:border-emerald-300'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white">
          <Icon size={23} />
        </div>

        {kontak.featured && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-emerald-700">
            <ShieldCheck
              size={13}
            />

            Utama
          </span>
        )}
      </div>

      <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
        {kontak.jabatan}
      </p>

      <h3 className="mt-2 text-lg font-black text-slate-900">
        {kontak.nama}
      </h3>

      <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
        {kontak.deskripsi}
      </p>

      <p className="mt-5 break-words rounded-2xl bg-emerald-50 p-4 text-lg font-black text-emerald-950">
        {kontak.nomor}
      </p>

      {whatsappUrl ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-extrabold text-white transition hover:bg-emerald-800"
        >
          <MessageCircle
            size={17}
          />

          Hubungi melalui WhatsApp
        </a>
      ) : (
        <span className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-slate-100 px-4 text-sm font-bold text-slate-400">
          Nomor WhatsApp tidak valid
        </span>
      )}
    </article>
  );
}

function JadwalItem({
  item,
  nomor,
}: {
  item: JadwalPelayananDesa;
  nomor: number;
}) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xs font-black text-emerald-700">
          {nomor}
        </span>

        <p className="text-sm font-extrabold text-slate-700">
          {item.hari}
        </p>
      </div>

      <span
        className={`w-fit rounded-xl px-4 py-2 text-sm font-black ${
          item.is_libur
            ? 'bg-slate-200 text-slate-500'
            : 'bg-emerald-100 text-emerald-700'
        }`}
      >
        {item.waktu}
      </span>
    </article>
  );
}

function EtikaItem({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2
        size={18}
        className="mt-0.5 shrink-0 text-emerald-700"
      />

      <p className="text-sm font-semibold leading-6 text-emerald-950">
        {text}
      </p>
    </div>
  );
}

function QuickLinkCard({
  href,
  eyebrow,
  title,
}: {
  href: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
    >
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
          {eyebrow}
        </p>

        <h2 className="mt-2 font-black text-slate-900">
          {title}
        </h2>
      </div>

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
        <ArrowRight size={19} />
      </div>
    </Link>
  );
}

function KontakEmptyState() {
  return (
    <div className="mt-6 rounded-3xl border border-dashed border-emerald-200 bg-white px-6 py-14 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-300">
        <Phone size={34} />
      </div>

      <h3 className="mt-5 font-black text-slate-800">
        Kontak belum tersedia
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
        Kontak pelayanan belum
        ditambahkan atau belum
        dipublikasikan oleh
        administrator.
      </p>
    </div>
  );
}

function PosterEmptyState() {
  return (
    <div className="px-6 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-300">
        <Info size={34} />
      </div>

      <h3 className="mt-5 font-black text-slate-800">
        Poster belum tersedia
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
        Poster kontak dan pelayanan
        belum ditambahkan melalui
        halaman administrator.
      </p>
    </div>
  );
}

function JadwalEmptyState() {
  return (
    <div className="px-6 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-300">
        <Clock3 size={34} />
      </div>

      <h3 className="mt-5 font-black text-slate-800">
        Jadwal belum tersedia
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
        Jadwal pelayanan belum
        ditambahkan atau belum
        dipublikasikan oleh
        administrator.
      </p>
    </div>
  );
}