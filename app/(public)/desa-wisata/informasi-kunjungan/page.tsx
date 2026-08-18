// app/(public)/desa-wisata/informasi-kunjungan/page.tsx

import type {
  Metadata,
} from 'next';

import Link from 'next/link';

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  MapPin,
  MapPinned,
  Route,
  UsersRound,
} from 'lucide-react';

import SidebarInformasiWisata from '@/components/desa-wisata/SidebarInformasiWisata';

export const metadata:
  Metadata = {
  title:
    'Informasi Kunjungan Desa Wisata Keji | SIJI',

  description:
    'Panduan dan informasi sebelum berkunjung ke Desa Wisata Keji.',
};

const panduanKunjungan = [
  'Jaga kebersihan dan tidak meninggalkan sampah di area yang dikunjungi.',
  'Hormati kegiatan, adat, dan kehidupan masyarakat setempat.',
  'Gunakan fasilitas desa secara bertanggung jawab.',
  'Ikuti arahan pengelola atau pemandu selama mengikuti kegiatan wisata.',
];

export default function InformasiKunjunganPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-700 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',

            backgroundSize:
              '27px 27px',
          }}
        />

        <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border-[58px] border-white/[0.04]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <MapPinned
              size={24}
            />
          </div>

          <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
            Desa Wisata Keji
          </p>

          <h1 className="mt-2 max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Informasi Kunjungan
          </h1>

          <p className="mt-5 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80 sm:text-base">
            Temukan informasi dasar,
            panduan, serta akses yang
            dapat membantu Anda
            mempersiapkan kunjungan ke
            Desa Keji.
          </p>
        </div>
      </section>

      {/* =====================================================
          BODY
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar */}

          <aside>
            <div className="lg:sticky lg:top-24">
              <SidebarInformasiWisata
                activePath="/desa-wisata/informasi-kunjungan"
              />
            </div>
          </aside>

          {/* Main */}

          <main className="min-w-0 space-y-7">
            {/* Location */}

            <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
              <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
                <div className="relative overflow-hidden bg-emerald-950 p-7 text-white sm:p-8">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-[0.13]"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',

                      backgroundSize:
                        '24px 24px',
                    }}
                  />

                  <div className="relative">
                    <MapPin
                      size={31}
                      className="text-emerald-300"
                    />

                    <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-300">
                      Lokasi
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      Desa Keji
                    </h2>

                    <p className="mt-4 text-sm font-medium leading-7 text-emerald-50/75">
                      Kecamatan Ungaran
                      Barat, Kabupaten
                      Semarang,
                      Jawa Tengah.
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                    Sebelum Berkunjung
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-slate-900">
                    Rencanakan
                    pengalaman Anda
                    di Desa Keji
                  </h2>

                  <p className="mt-4 text-sm font-medium leading-7 text-slate-500">
                    Sebelum berkunjung,
                    wisatawan disarankan
                    memeriksa paket dan
                    agenda wisata yang
                    tersedia agar
                    kegiatan dapat
                    dipersiapkan dengan
                    lebih baik.
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/desa-wisata/paket-wisata"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white transition hover:bg-emerald-800"
                    >
                      <BookOpen
                        size={17}
                      />

                      Lihat Paket Wisata
                    </Link>

                    <Link
                      href="/kontak"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      <UsersRound
                        size={17}
                      />

                      Hubungi Desa
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Info cards */}

            <div className="grid gap-5 sm:grid-cols-2">
              <InfoCard
                icon={
                  Route
                }
                title="Petunjuk Kunjungan"
                description="Persiapkan rute perjalanan dan pastikan lokasi atau kegiatan yang ingin dikunjungi sudah diketahui sebelum keberangkatan."
              />

              <InfoCard
                icon={
                  CalendarDays
                }
                title="Agenda Wisata"
                description="Beberapa kegiatan wisata dan budaya mengikuti agenda masyarakat. Periksa informasi kegiatan sebelum berkunjung."
              />
            </div>

            {/* Panduan */}

            <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                Etika Berkunjung
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Panduan selama berada
                di Desa Keji
              </h2>

              <div className="mt-6 grid gap-3">
                {panduanKunjungan.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-4"
                    >
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-emerald-700"
                      />

                      <p className="text-sm font-semibold leading-6 text-emerald-950">
                        {item}
                      </p>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* Survey CTA */}

            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-7 text-white sm:p-8">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',

                  backgroundSize:
                    '25px 25px',
                }}
              />

              <div className="relative">
                <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-200">
                  Sudah Berkunjung?
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Bagikan pengalaman
                  Anda
                </h2>

                <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-emerald-50/75">
                  Masukan dari
                  wisatawan membantu
                  Desa Keji meningkatkan
                  kualitas pelayanan,
                  fasilitas, dan
                  pengalaman wisata.
                </p>

                <Link
                  href="/desa-wisata/survei-kepuasan"
                  className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-900 transition hover:bg-emerald-50"
                >
                  Isi Survei Kepuasan

                  <ArrowRight
                    size={16}
                  />
                </Link>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon:
    typeof Route;

  title: string;

  description: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
        <Icon
          size={21}
        />
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-900">
        {title}
      </h3>

      <p className="mt-3 text-sm font-medium leading-7 text-slate-500">
        {description}
      </p>
    </article>
  );
}