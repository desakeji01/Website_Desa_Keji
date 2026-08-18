// app/(public)/desa-cantik/page.tsx

import type { Metadata } from 'next';

import Link from 'next/link';

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Download,
  ExternalLink,
  FileDown,
  FileText,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  LibraryBig,
  Users,
  type LucideIcon,
} from 'lucide-react';

import Se2026Slideshow, {
  type Se2026Slide,
} from '@/components/desa-cantik/Se2026Slideshow';

import {
  KATEGORI_DESA_CANTIK,
  TAHUN_DESA_CANTIK,
  type KategoriDesaCantik,
} from '@/types/desa-cantik';

export const metadata: Metadata = {
  title: 'Desa Cantik Desa Keji | SIJI',
  description:
    'Pusat data statistik, publikasi Desa Keji Dalam Angka, dan informasi Sensus Ekonomi 2026 Desa Keji.',
};

const ikonKategori: Record<KategoriDesaCantik, LucideIcon> = {
  penduduk: Users,
  pendidikan: GraduationCap,
  kesehatan: HeartPulse,
  perumahan: Home,
  perekonomian: Landmark,
};

interface DokumenDesaCantik {
  tahun: number;
  judul: string;
  deskripsi: string;
  fileUrl: string;
}

const posterSe2026: Se2026Slide[] = [
  {
    src: '/desa-cantik/1.jpeg',
    title: 'Kenali SE2026 dan Isi Datanya',
    description:
      'Ajakan kepada seluruh masyarakat, pelaku usaha, dan UMKM untuk mengenal Sensus Ekonomi 2026 serta memberikan data secara lengkap dan benar.',
  },
  {
    src: '/desa-cantik/2.jpeg',
    title: 'Informasi Sensus Ekonomi 2026',
    description:
      'Sensus Ekonomi 2026 merupakan program nasional untuk menyediakan data dasar seluruh kegiatan ekonomi di Indonesia.',
  },
  {
    src: '/desa-cantik/3.jpeg',
    title: 'Sukseskan SE2026 dengan TIR',
    description:
      'Terima petugas SE2026, isi data dengan benar, dan pastikan kerahasiaan informasi tetap terjaga.',
  },
  {
    src: '/desa-cantik/4.jpeg',
    title: 'Pendataan Door-to-Door SE2026',
    description:
      'Petugas Sensus Ekonomi 2026 akan melakukan pendataan langsung kepada masyarakat dan pelaku usaha pada 15 Juni hingga 31 Agustus 2026.',
  },
];

const dokumenDesaCantik: DokumenDesaCantik[] = [
  {
    tahun: 2025,
    judul: 'Publikasi Desa Keji Dalam Angka Tahun 2025',
    deskripsi:
      'Publikasi statistik yang menyajikan gambaran kondisi penduduk, pendidikan, kesehatan, perumahan, dan perekonomian Desa Keji pada tahun 2025.',
    fileUrl:
      '/desa-cantik/Publikasi%20Desa%20Keji%20Dalam%20Angka%20Tahun%202025.pdf',
  },
  {
    tahun: 2026,
    judul: 'Publikasi Desa Keji Dalam Angka Tahun 2026',
    deskripsi:
      'Publikasi statistik terbaru yang menyajikan data dan informasi Desa Keji tahun 2026 secara ringkas, terstruktur, dan mudah dipahami.',
    fileUrl:
      '/desa-cantik/Publikasi%20Desa%20Keji%20Dalam%20Angka%20Tahun%202026.pdf',
  },
];

export default function DesaCantikPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Desa Cantik */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 px-6 py-10 text-white shadow-xl md:px-10 md:py-14">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-24 right-24 h-64 w-64 rounded-full bg-emerald-400/20"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)',
              backgroundSize: '25px 25px',
            }}
          />

          <div className="relative z-10 max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] backdrop-blur-sm">
              <BarChart3 size={16} />
              Data Statistik Desa
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              Desa Cantik Desa Keji
            </h1>

            <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-emerald-50 sm:text-base">
              Pusat data statistik Desa Keji yang menyajikan informasi
              kependudukan, pendidikan, kesehatan, perumahan, dan perekonomian
              secara ringkas, menarik, dan mudah dipahami.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {TAHUN_DESA_CANTIK.map((tahun) => (
                <Link
                  key={tahun}
                  href={`/desa-cantik/penduduk/${tahun}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
                >
                  <BookOpen size={17} />
                  Data Tahun {tahun}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Slideshow SE2026 */}
        <section className="mt-10">
          <div className="mb-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
  Publikasi BPS
</p>

            <h2 className="mt-2 text-2xl font-black text-slate-900 md:text-3xl">
              Sosialisasi Sensus Ekonomi 2026
            </h2>

            <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-slate-600">
              Informasi mengenai jadwal, tujuan, keamanan data, dan pelaksanaan
              Sensus Ekonomi 2026.
            </p>
          </div>

          <Se2026Slideshow slides={posterSe2026} interval={5000} />
        </section>

        {/* Caption Dukungan SE2026 */}
<section className="mt-12">
  <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
      Dukungan Sensus Ekonomi 2026
    </p>

    <h2 className="mt-3 text-2xl font-black leading-tight text-slate-900 md:text-3xl">
      Pemerintah Desa Keji Mendukung Penuh Pelaksanaan SE2026
    </h2>

    <div className="mt-6 space-y-5 border-t border-slate-200 pt-6 text-sm font-medium leading-8 text-slate-600 md:text-base">
      <p>
        Pemerintah Desa Keji, Kecamatan Ungaran Barat, Kabupaten
        Semarang, menyatakan dukungan penuh terhadap pelaksanaan{' '}
        <strong className="font-extrabold text-slate-800">
          Sensus Ekonomi 2026 (SE2026)
        </strong>{' '}
        yang diselenggarakan oleh Badan Pusat Statistik (BPS).
      </p>

      <p>
        Kepala Desa Keji,{' '}
        <strong className="font-extrabold text-slate-800">
          Siswanto
        </strong>
        , berharap pelaksanaan Sensus Ekonomi 2026 dapat memberikan
        gambaran nyata mengenai kondisi usaha dan perekonomian
        masyarakat desa. Menurutnya, data yang lengkap dan akurat akan
        sangat membantu pemerintah dalam menentukan program pembangunan
        ekonomi, pemberdayaan UMKM, peningkatan kesejahteraan
        masyarakat, hingga membuka peluang investasi yang lebih baik di
        wilayah desa.
      </p>

      <p>
        Siswanto juga mengajak seluruh masyarakat, pelaku UMKM,
        pedagang, pengusaha, dan seluruh warga Desa Keji untuk mendukung
        dan berpartisipasi aktif dalam pelaksanaan sensus tersebut. Ia
        menegaskan bahwa kejujuran dalam memberikan data kepada petugas
        sensus akan berdampak besar bagi kemajuan ekonomi daerah dan
        nasional.
      </p>

      <p>
        Sensus Ekonomi 2026 sendiri merupakan program nasional yang
        dilaksanakan BPS setiap sepuluh tahun sekali untuk mendata
        seluruh pelaku usaha di Indonesia, mulai dari usaha kecil,
        menengah, hingga perusahaan besar. Hasil sensus nantinya akan
        menjadi dasar penting dalam penyusunan kebijakan ekonomi
        nasional dan daerah.
      </p>

      <p>
        Pelaksanaan Sensus Ekonomi 2026 dijadwalkan berlangsung pada{' '}
        <strong className="font-extrabold text-slate-800">
          15 Juni–31 Agustus 2026
        </strong>{' '}
        dengan tujuan menghadirkan data ekonomi yang akurat, terpercaya,
        dan komprehensif. Pemerintah berharap seluruh lapisan masyarakat
        dapat mendukung kegiatan ini demi terciptanya kebijakan ekonomi
        yang tepat dan pembangunan Indonesia yang semakin maju.
      </p>
    </div>
  </article>
</section>

        {/* Kategori Data */}
        <section className="mt-14">
          <div className="mb-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
              Kategori Data
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900 md:text-3xl">
              Jelajahi Data Desa Keji
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-600">
              Pilih kategori dan tahun data yang ingin ditampilkan.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {KATEGORI_DESA_CANTIK.map((kategori) => {
              const Icon = ikonKategori[kategori.slug];

              return (
                <article
                  key={kategori.slug}
                  className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
                      <Icon size={25} />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-600">
                      {TAHUN_DESA_CANTIK.length} Tahun
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-black text-slate-900">
                    {kategori.nama}
                  </h3>

                  <p className="mt-2 flex-1 text-sm font-medium leading-6 text-slate-600">
                    {kategori.deskripsi}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {TAHUN_DESA_CANTIK.map((tahun) => (
                      <Link
                        key={tahun}
                        href={`/desa-cantik/${kategori.slug}/${tahun}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-extrabold text-emerald-800 transition hover:border-emerald-700 hover:bg-emerald-700 hover:text-white"
                      >
                        {tahun}
                        <ArrowRight size={15} />
                      </Link>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Dokumen Publikasi */}
        <section className="mt-14">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
              <LibraryBig size={15} />
              Dokumen Statistik Desa
            </div>

            <h2 className="mt-4 text-2xl font-black text-slate-900 md:text-3xl">
              Publikasi Desa Keji Dalam Angka
            </h2>

            <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-slate-600">
              Akses publikasi statistik Desa Keji tahun 2025 dan 2026 dalam
              format PDF. Dokumen dapat dibaca langsung melalui browser atau
              diunduh untuk digunakan sebagai referensi.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {dokumenDesaCantik.map((dokumen) => (
              <DokumenPublikasiCard
                key={dokumen.tahun}
                dokumen={dokumen}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function DokumenPublikasiCard({
  dokumen,
}: {
  dokumen: DokumenDesaCantik;
}) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl">
      <div className="grid h-full sm:grid-cols-[190px_minmax(0,1fr)]">
        <div className="relative flex min-h-[240px] items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 p-6 text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full border-[28px] border-white/[0.06]"
          />

          <div className="relative text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <FileDown size={27} />
            </div>

            <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-200">
              Desa Keji Dalam Angka
            </p>

            <p className="mt-2 text-4xl font-black">{dokumen.tahun}</p>

            <span className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-100">
              Dokumen PDF
            </span>
          </div>
        </div>

        <div className="flex flex-col p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">
              Publikasi {dokumen.tahun}
            </span>

            <FileText
              size={20}
              className="shrink-0 text-emerald-600"
            />
          </div>

          <h3 className="mt-5 text-xl font-black leading-7 text-slate-900">
            {dokumen.judul}
          </h3>

          <p className="mt-3 flex-1 text-sm font-medium leading-7 text-slate-600">
            {dokumen.deskripsi}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href={dokumen.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-extrabold text-white transition hover:bg-emerald-800"
            >
              <BookOpen size={17} />
              Baca Dokumen
              <ExternalLink size={13} />
            </a>

            <a
              href={dokumen.fileUrl}
              download
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-100"
            >
              <Download size={17} />
              Unduh PDF
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}