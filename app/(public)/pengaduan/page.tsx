// app/(public)/pengaduan/page.tsx

import type { Metadata } from 'next';
import Link from 'next/link';

import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileWarning,
  HelpCircle,
  LockKeyhole,
  Mail,
  MapPin,
  Megaphone,
  MessageSquareText,
  SearchCheck,
  ShieldCheck,
  UserCheck,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';

import FormPengaduan from '@/components/FormPengaduan';

export const metadata: Metadata = {
  title:
    'Pengaduan Masyarakat | SIJI',

  description:
    'Saluran resmi pengaduan, aspirasi, kritik, dan saran masyarakat Desa Keji.',
};

interface KategoriPengaduan {
  nama: string;
  deskripsi: string;
  icon: LucideIcon;
}

interface TahapPengaduan {
  nomor: string;
  nama: string;
  deskripsi: string;
  icon: LucideIcon;
}

const kategoriPengaduan:
  KategoriPengaduan[] = [
  {
    nama:
      'Pelayanan Administrasi',

    deskripsi:
      'Laporan mengenai proses, waktu, prosedur, atau kendala pelayanan administrasi desa.',

    icon:
      FileCheck2,
  },
  {
    nama:
      'Pembangunan Desa',

    deskripsi:
      'Masukan atau laporan mengenai kegiatan, fasilitas, dan pembangunan di wilayah desa.',

    icon:
      Building2,
  },
  {
    nama:
      'Lingkungan dan Ketertiban',

    deskripsi:
      'Laporan mengenai kebersihan, fasilitas umum, ketertiban, dan kondisi lingkungan.',

    icon:
      UsersRound,
  },
  {
    nama:
      'Aspirasi dan Saran',

    deskripsi:
      'Usulan, kritik, dan saran untuk peningkatan pelayanan serta penyelenggaraan desa.',

    icon:
      MessageSquareText,
  },
];

const tahapPengaduan:
  TahapPengaduan[] = [
  {
    nomor: '01',
    nama:
      'Pengaduan Disampaikan',

    deskripsi:
      'Pelapor menyampaikan kronologi, lokasi, waktu, serta bukti pendukung bila tersedia.',

    icon:
      Megaphone,
  },
  {
    nomor: '02',
    nama:
      'Verifikasi Awal',

    deskripsi:
      'Petugas memeriksa kelengkapan informasi dan memastikan laporan dapat ditindaklanjuti.',

    icon:
      SearchCheck,
  },
  {
    nomor: '03',
    nama:
      'Disposisi dan Tindak Lanjut',

    deskripsi:
      'Laporan diteruskan kepada perangkat atau pihak terkait sesuai bidang penanganannya.',

    icon:
      ClipboardCheck,
  },
  {
    nomor: '04',
    nama:
      'Penyampaian Hasil',

    deskripsi:
      'Informasi tindak lanjut disampaikan melalui kontak yang diberikan pelapor.',

    icon:
      CheckCircle2,
  },
];

const panduanLaporan = [
  'Tuliskan pokok masalah secara singkat dan jelas.',
  'Cantumkan waktu dan lokasi kejadian bila relevan.',
  'Jelaskan kronologi secara berurutan.',
  'Lampirkan foto atau dokumen pendukung apabila tersedia.',
  'Gunakan identitas dan kontak yang dapat dihubungi.',
];

export default function PengaduanPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-slate-50">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-emerald-950 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/images/pengaduan/hero-pengaduan.jpg'), url('/background.png')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#021b16] via-emerald-950/92 to-emerald-900/48" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#021b16] via-transparent to-black/25" />

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

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 md:pb-28 md:pt-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-100 backdrop-blur">
                <ShieldCheck size={15} />

                Kanal Resmi Pemerintah Desa
              </div>

              <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-300">
                Aspirasi dan Pengaduan
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
                Pengaduan Masyarakat
              </h1>

              <p className="mt-6 max-w-3xl text-sm font-medium leading-7 text-emerald-50/85 md:text-base md:leading-8">
                Sampaikan laporan, kritik, saran, dan
                aspirasi kepada Pemerintah Desa Keji
                melalui saluran resmi agar dapat
                diverifikasi dan ditindaklanjuti.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#form-pengaduan"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-6 text-sm font-extrabold text-emerald-950 shadow-xl transition hover:-translate-y-0.5 hover:bg-emerald-200"
                >
                  <MessageSquareText
                    size={18}
                  />

                  Buat Pengaduan Online
                </Link>

                <a
                  href="mailto:desakeji01@gmail.com?subject=Pengaduan%20Masyarakat%20Desa%20Keji"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/15"
                >
                  <Mail size={18} />

                  Kirim Email
                </a>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-white/15 bg-black/25 p-6 shadow-2xl backdrop-blur-xl md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-300">
                    Komitmen Pelayanan
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-white">
                    Laporan Ditangani Secara Terarah
                  </h2>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-emerald-200">
                  <UserCheck size={26} />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <CommitmentItem
                  title="Tanpa Pungutan"
                  description="Penyampaian pengaduan tidak dipungut biaya."
                  icon={BadgeCheck}
                />

                <CommitmentItem
                  title="Diverifikasi"
                  description="Laporan diperiksa sebelum diteruskan."
                  icon={SearchCheck}
                />

                <CommitmentItem
                  title="Ditindaklanjuti"
                  description="Informasi lengkap memudahkan proses penanganan."
                  icon={ClipboardCheck}
                />
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200/15 bg-amber-300/10 p-4">
                <LockKeyhole
                  size={19}
                  className="mt-0.5 shrink-0 text-amber-200"
                />

                <p className="text-xs font-semibold leading-5 text-amber-50/75">
                  Hindari mengirim NIK, nomor KK, kata
                  sandi, atau data sensitif yang tidak
                  diperlukan.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Ringkasan */}
      <section className="relative z-20 -mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 sm:grid-cols-2 lg:grid-cols-4">
            <FloatingStat
              label="Saluran Resmi"
              value="2"
              description="Formulir online dan email"
              icon={MessageSquareText}
              primary
            />

            <FloatingStat
              label="Kategori"
              value="5"
              description="Jenis laporan masyarakat"
              icon={FileCheck2}
            />

            <FloatingStat
              label="Tahapan"
              value="4"
              description="Verifikasi hingga tindak lanjut"
              icon={ClipboardCheck}
            />

            <FloatingStat
              label="Biaya"
              value="Gratis"
              description="Tanpa pungutan pelayanan"
              icon={BadgeCheck}
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8">
        {/* Formulir online */}
        <section className="mb-12">
          <FormPengaduan />
        </section>

        {/* Kategori */}
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-white p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                <HelpCircle size={23} />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                  Jenis Laporan
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  Kategori Pengaduan
                </h2>

                <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500">
                  Pilih kategori yang paling sesuai agar
                  laporan dapat diarahkan kepada pihak yang
                  menangani.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 md:p-8">
            {kategoriPengaduan.map(
              (item) => (
                <KategoriCard
                  key={item.nama}
                  item={item}
                />
              )
            )}
          </div>
        </section>

        {/* Tahapan */}
        <section className="mt-12">
          <div className="mb-7">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
              Proses Penanganan
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900 md:text-3xl">
              Tahapan Inti Prosedur Pengaduan
            </h2>

            <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500">
              Pengaduan dapat disampaikan secara langsung
              maupun online dan akan melalui proses
              verifikasi serta tindak lanjut.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {tahapPengaduan.map(
              (item) => (
                <TahapCard
                  key={item.nomor}
                  item={item}
                />
              )
            )}
          </div>
        </section>

        {/* Panduan */}
        <section className="mt-12 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-800 text-white">
                  <ClipboardCheck
                    size={23}
                  />
                </div>

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                    Panduan Pelapor
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-slate-900">
                    Informasi yang Perlu Disiapkan
                  </h2>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6 md:p-8">
              {panduanLaporan.map(
                (item, index) => (
                  <div
                    key={item}
                    className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-sm font-black text-white">
                      {index + 1}
                    </div>

                    <p className="pt-1 text-sm font-semibold leading-6 text-slate-600">
                      {item}
                    </p>
                  </div>
                )
              )}
            </div>
          </article>

          <aside className="space-y-5">
            <article className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white">
                  <FileWarning
                    size={23}
                  />
                </div>

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-amber-700">
                    Perlindungan Data
                  </p>

                  <h2 className="mt-2 text-xl font-black text-amber-950">
                    Kirim data secukupnya
                  </h2>

                  <p className="mt-3 text-sm font-semibold leading-7 text-amber-900/80">
                    Jangan mengirim dokumen pribadi yang
                    tidak berkaitan dengan pokok pengaduan.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                  <Clock3 size={23} />
                </div>

                <div className="w-full">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                    Waktu Penyelesaian
                  </p>

                  <h2 className="mt-2 text-xl font-black text-emerald-950">
                    Menyesuaikan jenis masalah
                  </h2>

                  <p className="mt-3 text-sm font-semibold leading-7 text-emerald-900/80">
                    Waktu tindak lanjut disesuaikan dengan
                    tingkat kesulitan dan pihak yang berkaitan
                    dengan pengaduan.
                  </p>
                </div>
              </div>
            </article>
          </aside>
        </section>

        {/* CTA */}
        <section className="relative mt-12 overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-7 text-white shadow-xl md:p-9">
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                <Megaphone size={25} />
              </div>

              <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
                Suara Masyarakat
              </p>

              <h2 className="mt-2 max-w-3xl text-2xl font-black md:text-3xl">
                Sampaikan laporan melalui saluran resmi
                Desa Keji
              </h2>

              <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                Laporan yang jelas dan dapat diverifikasi
                membantu Pemerintah Desa menangani persoalan
                secara tepat.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="#form-pengaduan"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-900 transition hover:bg-emerald-50"
              >
                <MessageSquareText
                  size={17}
                />

                Buat Pengaduan
              </Link>

              <Link
                href="/kontak"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white transition hover:bg-white/15"
              >
                <MapPin size={17} />

                Kontak Pemerintah Desa
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function CommitmentItem({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.08] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-300/15 text-emerald-200">
          <Icon size={19} />
        </div>

        <div>
          <h3 className="text-sm font-black text-white">
            {title}
          </h3>

          <p className="mt-1 text-xs font-medium leading-5 text-emerald-50/70">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}

function FloatingStat({
  label,
  value,
  description,
  icon: Icon,
  primary = false,
}: {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  primary?: boolean;
}) {
  return (
    <article
      className={`min-h-[170px] p-6 ${
        primary
          ? 'bg-emerald-800 text-white'
          : 'bg-white text-slate-900'
      }`}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          primary
            ? 'bg-white/10 text-emerald-100'
            : 'bg-emerald-100 text-emerald-700'
        }`}
      >
        <Icon size={21} />
      </div>

      <p
        className={`mt-5 text-[10px] font-extrabold uppercase tracking-[0.15em] ${
          primary
            ? 'text-emerald-200'
            : 'text-slate-500'
        }`}
      >
        {label}
      </p>

      <p className="mt-2 text-2xl font-black">
        {value}
      </p>

      <p
        className={`mt-2 text-xs font-semibold leading-5 ${
          primary
            ? 'text-emerald-100/75'
            : 'text-slate-500'
        }`}
      >
        {description}
      </p>
    </article>
  );
}

function KategoriCard({
  item,
}: {
  item: KategoriPengaduan;
}) {
  const Icon = item.icon;

  return (
    <article className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-200 hover:bg-emerald-50/50">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
        <Icon size={22} />
      </div>

      <div>
        <h3 className="font-black text-slate-900">
          {item.nama}
        </h3>

        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
          {item.deskripsi}
        </p>
      </div>
    </article>
  );
}

function TahapCard({
  item,
}: {
  item: TahapPengaduan;
}) {
  const Icon = item.icon;

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
      <div className="pointer-events-none absolute -right-8 -top-8 text-[90px] font-black text-emerald-950/[0.035]">
        {item.nomor}
      </div>

      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
            <Icon size={23} />
          </div>

          <span className="text-xs font-black text-emerald-700">
            {item.nomor}
          </span>
        </div>

        <h3 className="mt-5 text-lg font-black text-slate-900">
          {item.nama}
        </h3>

        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
          {item.deskripsi}
        </p>
      </div>
    </article>
  );
}