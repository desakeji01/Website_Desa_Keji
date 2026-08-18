// app/(public)/profil/data/page.tsx

import {
  AtSign,
  Building2,
  Calendar,
  Compass,
  Eye,
  Globe,
  Mail,
  Map as MapIcon,
  MapPin,
  Phone,
  Share2,
  User,
  Users,
} from 'lucide-react';

import SidebarLayanan from '@/components/SidebarLayanan';
import SidebarTilikArkeji from '@/components/SidebarTilikArkeji';

import { supabaseAdmin } from '@/lib/supabase-admin';

import type { PilihanLayanan } from '@/types/layanan';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PROFIL_KEY = 'utama';

interface ProfilDesaDatabase {
  jumlah_laki_laki: number | null;
  jumlah_perempuan: number | null;
  jumlah_dusun: number | null;
  jumlah_rw: number | null;
  jumlah_rt: number | null;
  tahun_data: number | null;
  updated_at: string | null;
}

interface ProfilDesaData {
  jumlah_laki_laki: number;
  jumlah_perempuan: number;
  jumlah_dusun: number;
  jumlah_rw: number;
  jumlah_rt: number;
  tahun_data: number;
  updated_at: string;
}

interface LayananDatabase {
  id: number | string | null;
  nama: string | null;
  slug: string | null;
}

const fallbackProfil: ProfilDesaData = {
  jumlah_laki_laki: 0,
  jumlah_perempuan: 0,
  jumlah_dusun: 0,
  jumlah_rw: 0,
  jumlah_rt: 0,
  tahun_data: new Date().getFullYear(),
  updated_at: '',
};

function safeString(value: unknown) {
  return String(value ?? '').trim();
}

function formatAngka(value: number) {
  return new Intl.NumberFormat('id-ID').format(
    Number.isFinite(value) ? value : 0
  );
}

function formatTanggal(value: string) {
  if (!value) {
    return 'Belum diperbarui';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Belum diperbarui';
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(date);
}

export default async function ProfilWilayahPage() {
  const [profilResult, layananResult] =
    await Promise.all([
      supabaseAdmin
        .from('profil_desa')
        .select(`
          jumlah_laki_laki,
          jumlah_perempuan,
          jumlah_dusun,
          jumlah_rw,
          jumlah_rt,
          tahun_data,
          updated_at
        `)
        .eq('profil_key', PROFIL_KEY)
        .maybeSingle(),

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
        })
        .order('nama', {
          ascending: true,
        }),
    ]);

  if (profilResult.error) {
    console.error(
      'Gagal mengambil data profil desa:',
      {
        message: profilResult.error.message,
        code: profilResult.error.code,
        details: profilResult.error.details,
        hint: profilResult.error.hint,
      }
    );
  }

  if (layananResult.error) {
    console.error(
      'Gagal mengambil daftar layanan:',
      {
        message: layananResult.error.message,
        code: layananResult.error.code,
        details: layananResult.error.details,
        hint: layananResult.error.hint,
      }
    );
  }

  const profilDatabase =
    profilResult.data as ProfilDesaDatabase | null;

  const profilDesa: ProfilDesaData =
    profilDatabase
      ? {
          jumlah_laki_laki: Number(
            profilDatabase.jumlah_laki_laki ?? 0
          ),

          jumlah_perempuan: Number(
            profilDatabase.jumlah_perempuan ?? 0
          ),

          jumlah_dusun: Number(
            profilDatabase.jumlah_dusun ?? 0
          ),

          jumlah_rw: Number(
            profilDatabase.jumlah_rw ?? 0
          ),

          jumlah_rt: Number(
            profilDatabase.jumlah_rt ?? 0
          ),

          tahun_data: Number(
            profilDatabase.tahun_data ??
              new Date().getFullYear()
          ),

          updated_at: safeString(
            profilDatabase.updated_at
          ),
        }
      : fallbackProfil;

  const layananDatabase =
    (layananResult.data ??
      []) as LayananDatabase[];

  const daftarLayanan: PilihanLayanan[] =
    layananDatabase
      .map((layanan) => ({
        id: Number(layanan.id),

        nama: safeString(
          layanan.nama
        ),

        slug: safeString(
          layanan.slug
        ),
      }))
      .filter(
        (layanan) =>
          Number.isInteger(layanan.id) &&
          layanan.id > 0 &&
          layanan.nama.length > 0 &&
          layanan.slug.length > 0
      );

  const totalPenduduk =
    profilDesa.jumlah_laki_laki +
    profilDesa.jumlah_perempuan;

  const persentaseLakiLaki =
    totalPenduduk > 0
      ? (
          (profilDesa.jumlah_laki_laki /
            totalPenduduk) *
          100
        ).toFixed(1)
      : '0';

  const persentasePerempuan =
    totalPenduduk > 0
      ? (
          (profilDesa.jumlah_perempuan /
            totalPenduduk) *
          100
        ).toFixed(1)
      : '0';

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Teks Berjalan */}
        <div className="relative mb-6 flex items-center gap-3 overflow-hidden rounded-xl bg-emerald-800 px-4 py-2 text-sm font-medium text-white shadow-sm">
          <div className="z-10 shrink-0 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold shadow-md">
            Sekilas Info
          </div>

          <style
            dangerouslySetInnerHTML={{
              __html: `
                @keyframes scrolling-profile-info {
                  0% {
                    transform: translateX(100%);
                  }

                  100% {
                    transform: translateX(-100%);
                  }
                }

                .animate-scrolling-profile-info {
                  display: inline-block;
                  white-space: nowrap;
                  animation: scrolling-profile-info 24s linear infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                  .animate-scrolling-profile-info {
                    animation: none;
                  }
                }
              `,
            }}
          />

          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="animate-scrolling-profile-info">
              Untuk permohonan informasi silakan masuk ke
              menu PPID website ini. *** Profil Wilayah,
              Demografi, dan Administrasi Desa Keji,
              Kecamatan Ungaran Barat, Kabupaten Semarang
              ***
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Konten Utama */}
          <main className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:w-2/3">
            {/* Header Halaman */}
            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 px-6 py-8 text-white md:px-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,0.16) 1.5px, transparent 1.5px)',

                  backgroundSize:
                    '25px 25px',
                }}
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[45px] border-white/[0.05]"
              />

              <div className="relative">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                  Profil Wilayah Desa
                </p>

                <h1 className="mt-2 text-2xl font-black leading-tight md:text-3xl">
                  Profil Desa Keji
                </h1>

                <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-emerald-50/80">
                  Informasi mengenai pemerintahan, kondisi
                  geografis, jumlah penduduk, dan pembagian
                  wilayah administrasi Desa Keji.
                </p>

                {/* Metadata */}
                <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-emerald-50/80">
                  <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2">
                    <Calendar size={14} />

                    Diperbarui{' '}
                    {formatTanggal(
                      profilDesa.updated_at
                    )}
                  </span>

                  <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2">
                    <User size={14} />

                    Admin Desa
                  </span>

                  <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2">
                    <Eye size={14} />

                    Informasi Publik
                  </span>
                </div>
              </div>
            </section>

            <div className="space-y-10 p-6 md:p-8">
              {/* Informasi Pemerintahan */}
              <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white shadow-sm">
                <div className="flex items-start gap-4 border-b border-emerald-100 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-md">
                    <Building2 size={24} />
                  </div>

                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                      Pemerintahan Desa
                    </p>

                    <h2 className="mt-1 text-xl font-black text-slate-900">
                      Pemerintah Desa Keji
                    </h2>

                    <p className="mt-2 text-justify text-sm font-medium leading-7 text-slate-600">
                      Pemerintah Desa Keji berperan dalam
                      memberikan pelayanan publik secara
                      profesional, transparan, akuntabel,
                      dan mudah diakses oleh seluruh
                      masyarakat Desa Keji.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 p-6 md:grid-cols-2">
                  <ContactInfo
                    icon={MapPin}
                    label="Alamat Kantor"
                    value={
                      <>
                        Jl. Bima Sakti Raya No. 12
                        <br />
                        Desa Keji
                      </>
                    }
                  />

                  <div className="space-y-4">
                    <ContactInfo
                      icon={Phone}
                      label="Telepon"
                      value="024-76914580"
                    />

                    <ContactInfo
                      icon={Mail}
                      label="Email"
                      value="desakeji01@gmail.com"
                      breakText
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 border-t border-emerald-100 bg-white/70 p-5">
                  <a
                    href="https://keji-ungaranbarat.semarangkab.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-800"
                  >
                    <Globe size={15} />

                    Website Resmi
                  </a>

                  <span className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-xs font-extrabold text-emerald-700">
                    <AtSign size={15} />

                    @desakeji
                  </span>

                  <span className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-xs font-extrabold text-emerald-700">
                    <Share2 size={15} />

                    Desa Keji
                  </span>
                </div>
              </section>

              {/* Kondisi Geografis */}
              <section>
                <SectionTitle
                  icon={MapPin}
                  label="Informasi Wilayah"
                  title="Kondisi Geografis"
                  description="Letak dan batas wilayah administratif Desa Keji."
                />

                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-justify text-sm font-medium leading-7 text-slate-600">
                    Secara geografis, Desa Keji terletak di
                    wilayah dataran tinggi lereng Gunung
                    Ungaran dengan suhu rata-rata yang
                    sejuk. Sebagian besar lahan
                    diperuntukkan sebagai permukiman, area
                    Kampoeng Seni, serta lahan pertanian dan
                    perkebunan.
                  </p>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <BoundaryCard
                    title="Sebelah Utara"
                    description="Berbatasan dengan Kelurahan Bandarjo"
                  />

                  <BoundaryCard
                    title="Sebelah Selatan"
                    description="Berbatasan dengan Desa Lerep"
                  />

                  <BoundaryCard
                    title="Sebelah Timur"
                    description="Berbatasan dengan Kelurahan Ungaran"
                  />

                  <BoundaryCard
                    title="Sebelah Barat"
                    description="Berbatasan dengan Desa Kalisidi"
                  />
                </div>
              </section>

              {/* Statistik Penduduk */}
              <section>
                <SectionTitle
                  icon={Users}
                  label={`Data Tahun ${profilDesa.tahun_data}`}
                  title="Statistik Penduduk"
                  description="Ringkasan jumlah penduduk berdasarkan jenis kelamin."
                />

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-5 text-white shadow-lg">
                    <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border-[20px] border-white/[0.05]" />

                    <div className="relative">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                        Total Penduduk
                      </p>

                      <p className="mt-3 text-3xl font-black">
                        {formatAngka(
                          totalPenduduk
                        )}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-emerald-100/70">
                        Jiwa
                      </p>
                    </div>
                  </article>

                  <PopulationCard
                    label="Laki-laki"
                    value={
                      profilDesa.jumlah_laki_laki
                    }
                    percentage={
                      persentaseLakiLaki
                    }
                  />

                  <PopulationCard
                    label="Perempuan"
                    value={
                      profilDesa.jumlah_perempuan
                    }
                    percentage={
                      persentasePerempuan
                    }
                  />
                </div>
              </section>

              {/* Wilayah Administrasi */}
              <section>
                <SectionTitle
                  icon={MapIcon}
                  label="Pembagian Wilayah"
                  title="Wilayah Administrasi"
                  description="Jumlah dusun, rukun warga, dan rukun tetangga di Desa Keji."
                />

                <div className="mt-5 grid gap-4 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 sm:grid-cols-3">
                  <AdministrationCard
                    value={
                      profilDesa.jumlah_dusun
                    }
                    label="Dusun"
                  />

                  <AdministrationCard
                    value={
                      profilDesa.jumlah_rw
                    }
                    label="Rukun Warga"
                    abbreviation="RW"
                  />

                  <AdministrationCard
                    value={
                      profilDesa.jumlah_rt
                    }
                    label="Rukun Tetangga"
                    abbreviation="RT"
                  />
                </div>
              </section>
            </div>
          </main>

          {/* Sidebar Kanan */}
<aside className="min-w-0 lg:w-1/3">
  <div className="flex flex-col gap-8">
    <SidebarLayanan
      daftarLayanan={daftarLayanan}
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

interface SectionTitleProps {
  icon: typeof Users;
  label: string;
  title: string;
  description: string;
}

function SectionTitle({
  icon: Icon,
  label,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
        <Icon
          size={22}
          strokeWidth={2.4}
        />
      </div>

      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">
          {label}
        </p>

        <h2 className="mt-1 text-xl font-black text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

interface ContactInfoProps {
  icon: typeof MapPin;
  label: string;
  value: React.ReactNode;
  breakText?: boolean;
}

function ContactInfo({
  icon: Icon,
  label,
  value,
  breakText = false,
}: ContactInfoProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-emerald-700">
          {label}
        </p>

        <div
          className={`mt-1 text-sm font-semibold leading-6 text-slate-700 ${
            breakText
              ? 'break-all'
              : ''
          }`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

interface BoundaryCardProps {
  title: string;
  description: string;
}

function BoundaryCard({
  title,
  description,
}: BoundaryCardProps) {
  return (
    <article className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:bg-emerald-50/50 hover:shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-emerald-600 transition group-hover:bg-emerald-100">
        <Compass size={21} />
      </div>

      <div>
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
          {title}
        </h3>

        <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
          {description}
        </p>
      </div>
    </article>
  );
}

interface PopulationCardProps {
  label: string;
  value: number;
  percentage: string;
}

function PopulationCard({
  label,
  value,
  percentage,
}: PopulationCardProps) {
  return (
    <article className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-slate-900">
        {formatAngka(value)}
      </p>

      <div className="mt-2 flex items-center justify-between gap-3 text-xs font-semibold">
        <span className="text-slate-500">
          Jiwa
        </span>

        <span className="rounded-full bg-white px-2.5 py-1 text-emerald-700 shadow-sm">
          {percentage}%
        </span>
      </div>
    </article>
  );
}

interface AdministrationCardProps {
  value: number;
  label: string;
  abbreviation?: string;
}

function AdministrationCard({
  value,
  label,
  abbreviation,
}: AdministrationCardProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 text-center shadow-sm">
      <div className="absolute left-0 top-0 h-1 w-full bg-emerald-600" />

      <span className="text-4xl font-black text-emerald-700">
        {formatAngka(value)}
      </span>

      <p className="mt-3 text-xs font-extrabold uppercase tracking-wide text-slate-700">
        {label}
      </p>

      {abbreviation && (
        <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-emerald-700">
          {abbreviation}
        </span>
      )}
    </article>
  );
}