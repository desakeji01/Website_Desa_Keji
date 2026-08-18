// app/(public)/ppid/klasifikasi-informasi/page.tsx

import type {
  Metadata,
} from 'next';

import Link from 'next/link';

import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  BookOpenCheck,
  Clock3,
  Eye,
  FileCheck2,
  FileLock2,
  FileSearch,
  Landmark,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Users,
  type LucideIcon,
} from 'lucide-react';

import SidebarLayanan from '@/components/SidebarLayanan';
import SidebarTilikArkeji from '@/components/SidebarTilikArkeji';

import {
  getPpidSettings,
} from '@/lib/ppid-settings';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  PilihanLayanan,
} from '@/types/layanan';

export const metadata: Metadata = {
  title:
    'Klasifikasi Informasi PPID | SIJI Desa Keji',

  description:
    'Klasifikasi informasi berkala, serta merta, setiap saat, dan informasi yang dikecualikan pada PPID Desa Keji.',
};

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

interface LayananRow {
  id:
    | number
    | string
    | null;

  nama:
    | string
    | null;

  slug:
    | string
    | null;
}

interface TujuanItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface KlasifikasiItem {
  title: string;
  description?: string;
  href?: string;
}

interface KlasifikasiSectionProps {
  id: string;
  label: string;
  title: string;
  description: string;
  schedule?: string;
  icon: LucideIcon;
  items: KlasifikasiItem[];
  note?: string;
}

const tujuanKlasifikasi:
  TujuanItem[] = [
  {
    title:
      'Mempermudah Akses Informasi',

    description:
      'Masyarakat dapat mengetahui jenis informasi yang tersedia dan cara memperolehnya.',

    icon: FileSearch,
  },
  {
    title:
      'Meningkatkan Transparansi',

    description:
      'Informasi pemerintahan, pembangunan, dan pelayanan desa disampaikan secara terbuka.',

    icon: Eye,
  },
  {
    title:
      'Meningkatkan Partisipasi',

    description:
      'Masyarakat dapat menggunakan informasi publik untuk berpartisipasi dalam pembangunan desa.',

    icon: Users,
  },
  {
    title:
      'Melindungi Informasi',

    description:
      'Data pribadi dan informasi yang dikecualikan tetap dilindungi sesuai ketentuan.',

    icon: ShieldCheck,
  },
];

const informasiBerkala:
  KlasifikasiItem[] = [
  {
    title:
      'Profil Desa Keji',

    description:
      'Informasi umum mengenai kondisi, potensi, dan karakteristik Desa Keji.',

    href:
      '/profil/data',
  },
  {
    title:
      'Visi dan Misi Desa',

    description:
      'Arah, tujuan, dan prioritas Pemerintah Desa Keji.',

    href:
      '/profil/visi-misi',
  },
  {
    title:
      'Struktur Pemerintah Desa',

    description:
      'Susunan organisasi dan tata kerja Pemerintah Desa Keji.',

    href:
      '/pemerintahan',
  },
  {
    title:
      'Program dan Kegiatan Desa',

    description:
      'Informasi mengenai rencana kerja, program pembangunan, dan kegiatan desa.',

    href:
      '/informasi-publik/informasi-umum',
  },
  {
    title:
      'Informasi APBDes',

    description:
      'Informasi anggaran dan realisasi pendapatan serta belanja Desa Keji.',

    href:
      '/informasi-publik/apbdes/2026',
  },
  {
    title:
      'Laporan Pelayanan Publik',

    description:
      'Informasi pelaksanaan pelayanan administrasi dan pelayanan masyarakat.',

    href:
      '/layanan',
  },
];

const informasiSertaMerta:
  KlasifikasiItem[] = [
  {
    title:
      'Informasi Bencana',

    description:
      'Informasi mengenai banjir, tanah longsor, kebakaran, angin kencang, dan keadaan darurat lainnya.',
  },
  {
    title:
      'Informasi Gangguan Pelayanan',

    description:
      'Pemberitahuan mengenai gangguan atau perubahan sementara pelayanan Pemerintah Desa.',
  },
  {
    title:
      'Informasi Kesehatan Masyarakat',

    description:
      'Peringatan mengenai wabah, risiko kesehatan, atau kondisi yang berpotensi mengganggu masyarakat.',
  },
  {
    title:
      'Informasi Keamanan dan Ketertiban',

    description:
      'Informasi mendesak yang berkaitan dengan keselamatan, keamanan, dan ketertiban warga.',
  },
  {
    title:
      'Informasi Infrastruktur Darurat',

    description:
      'Informasi mengenai jalan rusak, jembatan bermasalah, listrik, air, atau fasilitas publik yang membahayakan.',
  },
  {
    title:
      'Pengumuman Mendesak Pemerintah Desa',

    description:
      'Pengumuman yang harus diketahui masyarakat tanpa penundaan.',

    href:
      '/berita',
  },
];

const informasiSetiapSaat:
  KlasifikasiItem[] = [
  {
    title:
      'RPJMDes dan RKPDes',

    description:
      'Dokumen perencanaan pembangunan jangka menengah dan tahunan Desa Keji.',

    href:
      '/informasi-publik/informasi-umum',
  },
  {
    title:
      'Produk Hukum Desa',

    description:
      'Peraturan Desa, Peraturan Kepala Desa, keputusan, dan dokumen hukum lainnya.',

    href:
      '/informasi-publik/produk-hukum',
  },
  {
    title:
      'APBDes dan Realisasi Anggaran',

    description:
      'Dokumen anggaran, perubahan anggaran, serta laporan realisasi APBDes.',

    href:
      '/informasi-publik/apbdes/2026',
  },
  {
    title:
      'Daftar Inventaris dan Aset Desa',

    description:
      'Informasi mengenai barang, tanah, bangunan, dan aset yang dikelola Pemerintah Desa.',
  },
  {
    title:
      'Data Kependudukan Agregat',

    description:
      'Statistik jumlah penduduk berdasarkan wilayah, umur, dan jenis kelamin tanpa menampilkan data pribadi.',

    href:
      '/data-desa/populasi-wilayah',
  },
  {
    title:
      'Informasi Pelayanan Administrasi',

    description:
      'Daftar jenis layanan, persyaratan, prosedur, waktu pelayanan, dan biaya.',

    href:
      '/layanan',
  },
  {
    title:
      'Daftar Informasi Publik',

    description:
      'Dokumen dan informasi resmi yang telah dinyatakan terbuka untuk masyarakat.',

    href:
      '/informasi-publik/informasi-umum',
  },
  {
    title:
      'Profil dan Struktur PPID',

    description:
      'Informasi mengenai kelembagaan, tugas, kontak, dan susunan pengurus PPID Desa Keji.',

    href:
      '/ppid/profil',
  },
];

const informasiDikecualikan:
  KlasifikasiItem[] = [
  {
    title:
      'Informasi yang Menghambat Penegakan Hukum',

    description:
      'Informasi yang apabila dibuka dapat menghambat penyelidikan, penyidikan, atau proses hukum.',
  },
  {
    title:
      'Informasi Hak Kekayaan Intelektual',

    description:
      'Informasi yang dapat mengganggu perlindungan kekayaan intelektual atau persaingan usaha yang sehat.',
  },
  {
    title:
      'Informasi Pertahanan dan Keamanan',

    description:
      'Informasi yang apabila dibuka dapat membahayakan pertahanan atau keamanan negara.',
  },
  {
    title:
      'Informasi Kekayaan Alam Tertentu',

    description:
      'Informasi yang menurut ketentuan tidak dapat diumumkan karena berkaitan dengan perlindungan sumber daya.',
  },
  {
    title:
      'Informasi Ketahanan Ekonomi',

    description:
      'Informasi yang apabila dibuka dapat merugikan ketahanan ekonomi atau kepentingan publik yang lebih luas.',
  },
  {
    title:
      'Informasi Hubungan Luar Negeri',

    description:
      'Informasi yang dapat merugikan kepentingan hubungan luar negeri.',
  },
  {
    title:
      'Akta Otentik, Wasiat, dan Dokumen Pribadi',

    description:
      'Dokumen yang berkaitan dengan kehendak terakhir, wasiat, atau hak privat seseorang.',
  },
  {
    title:
      'Rahasia Pribadi',

    description:
      'NIK, nomor KK, data kesehatan, kondisi keuangan, alamat rinci, nomor pribadi, dan data personal lainnya.',
  },
  {
    title:
      'Memorandum atau Surat Internal',

    description:
      'Komunikasi internal yang menurut sifatnya dirahasiakan, kecuali dinyatakan terbuka berdasarkan keputusan yang sah.',
  },
  {
    title:
      'Dokumen Pertanggungjawaban Keuangan Tertentu',

    description:
      'Dokumen pendukung SPJ, perjalanan dinas, atau dokumen rinci lain yang mengandung informasi terbatas.',
  },
  {
    title:
      'Dokumen Pengadaan yang Belum Dapat Dibuka',

    description:
      'Dokumen pengadaan barang dan jasa yang masih berada dalam tahapan yang dilindungi atau mengandung informasi rahasia.',
  },
  {
    title:
      'Dokumen Pemeriksaan dan Tindak Lanjut',

    description:
      'Dokumen pemeriksaan, reviu, dan tindak lanjut hasil pemeriksaan yang belum dapat diumumkan.',
  },
  {
    title:
      'Informasi yang Dilarang Peraturan',

    description:
      'Informasi lain yang tidak boleh diungkapkan berdasarkan undang-undang atau ketentuan yang berlaku.',
  },
];

function safeString(
  value: unknown
) {
  return String(
    value ?? ''
  ).trim();
}

async function getDaftarLayanan():
  Promise<PilihanLayanan[]> {
  const {
    data,
    error,
  } = await supabaseAdmin
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
    });

  if (error) {
    console.error(
      'Gagal mengambil daftar layanan pada halaman klasifikasi informasi:',
      {
        message:
          error.message,

        code:
          error.code,

        details:
          error.details,

        hint:
          error.hint,
      }
    );

    return [];
  }

  return (
    (
      data ?? []
    ) as LayananRow[]
  )
    .map((item) => {
      const id =
        Number(item.id);

      const nama =
        safeString(
          item.nama
        );

      const slug =
        safeString(
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
        item.nama.length >
          0 &&
        item.slug.length >
          0
    );
}

export default async function KlasifikasiInformasiPage() {
  const [
    daftarLayanan,
    ppid,
  ] = await Promise.all([
    getDaftarLayanan(),
    getPpidSettings(),
  ]);

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
              <Landmark
                size={24}
              />
            </div>

            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
              {ppid.header_label}
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              {ppid.klasifikasi_title}
            </h1>

            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80 sm:text-base">
              {ppid.klasifikasi_description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <HeaderBadge
                label="Informasi Berkala"
              />

              <HeaderBadge
                label="Informasi Serta Merta"
              />

              <HeaderBadge
                label="Informasi Setiap Saat"
              />

              <HeaderBadge
                label="Informasi Dikecualikan"
              />
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Konten Utama */}
          <main className="min-w-0 space-y-8 lg:w-2/3">
            {/* Hero */}
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
                  <BookOpenCheck
                    size={31}
                  />
                </div>

                <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-200">
                  {ppid.klasifikasi_hero_label}
                </p>

                <h2 className="mt-3 max-w-2xl text-2xl font-black leading-tight sm:text-3xl">
                  {ppid.klasifikasi_hero_title}
                </h2>

                <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/85 sm:text-base sm:leading-8">
                  {ppid.klasifikasi_hero_description}
                </p>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <HeroInfoCard
                    label="Informasi Terbuka"
                    description="Dapat diumumkan atau diberikan kepada masyarakat sesuai kategori pelayanan informasi."
                  />

                  <HeroInfoCard
                    label="Informasi Terlindungi"
                    description="Tidak dapat diberikan apabila mengandung data pribadi atau memenuhi alasan pengecualian."
                  />
                </div>
              </div>
            </section>

            {/* Tujuan */}
            <section>
              <SectionHeading
                eyebrow="Tujuan"
                title="Tujuan Klasifikasi Informasi"
                description="Klasifikasi membantu PPID menentukan cara, waktu, dan batas pemberian informasi kepada masyarakat."
              />

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {tujuanKlasifikasi.map(
                  (item) => (
                    <TujuanCard
                      key={
                        item.title
                      }
                      item={
                        item
                      }
                    />
                  )
                )}
              </div>
            </section>

            {/* Navigasi Cepat */}
            <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
                  <FileSearch
                    size={21}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Navigasi Informasi
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-900">
                    Pilih Klasifikasi
                    Informasi
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                    Gunakan menu berikut
                    untuk menuju kategori
                    informasi yang ingin
                    dibaca.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <QuickLink
                  href="#informasi-berkala"
                  label="Informasi Berkala"
                  description="Diumumkan secara rutin"
                  icon={Clock3}
                />

                <QuickLink
                  href="#informasi-serta-merta"
                  label="Informasi Serta Merta"
                  description="Diumumkan tanpa penundaan"
                  icon={Siren}
                />

                <QuickLink
                  href="#informasi-setiap-saat"
                  label="Informasi Setiap Saat"
                  description="Tersedia ketika dibutuhkan"
                  icon={FileCheck2}
                />

                <QuickLink
                  href="#informasi-dikecualikan"
                  label="Informasi Dikecualikan"
                  description="Tidak dapat dibuka secara umum"
                  icon={FileLock2}
                />
              </div>
            </section>

            {/* Informasi Berkala */}
            <KlasifikasiSection
              id="informasi-berkala"
              label="Klasifikasi A"
              title="Informasi yang Wajib Disediakan dan Diumumkan Secara Berkala"
              description="Informasi yang telah dikuasai dan didokumentasikan oleh Pemerintah Desa untuk diumumkan secara teratur kepada masyarakat."
              schedule="Diumumkan secara rutin, misalnya setiap enam bulan atau satu tahun."
              icon={Clock3}
              items={informasiBerkala}
            />

            {/* Informasi Serta Merta */}
            <KlasifikasiSection
              id="informasi-serta-merta"
              label="Klasifikasi B"
              title="Informasi yang Wajib Diumumkan Secara Serta Merta"
              description="Informasi yang berkaitan dengan keselamatan, keamanan, atau kepentingan masyarakat dan harus diumumkan tanpa penundaan."
              schedule="Disampaikan segera setelah informasi terverifikasi."
              icon={BellRing}
              items={informasiSertaMerta}
              note="Informasi darurat dapat disampaikan melalui website, media sosial resmi, pengumuman desa, perangkat wilayah, atau saluran komunikasi lain yang tersedia."
            />

            {/* Informasi Setiap Saat */}
            <KlasifikasiSection
              id="informasi-setiap-saat"
              label="Klasifikasi C"
              title="Informasi yang Wajib Tersedia Setiap Saat"
              description="Informasi yang telah dikuasai dan didokumentasikan serta dinyatakan terbuka untuk diakses oleh masyarakat."
              schedule="Tersedia melalui website atau diberikan berdasarkan permohonan."
              icon={FileCheck2}
              items={informasiSetiapSaat}
              note="Apabila dokumen belum tersedia pada website, masyarakat dapat mengajukan permohonan informasi kepada PPID Desa Keji."
            />

            {/* Informasi Dikecualikan */}
            <KlasifikasiSection
              id="informasi-dikecualikan"
              label="Klasifikasi D"
              title="Informasi yang Dikecualikan"
              description="Informasi tertentu yang tidak dapat diberikan kepada publik karena dapat menimbulkan konsekuensi yang dilindungi oleh ketentuan peraturan."
              icon={FileLock2}
              items={
                informasiDikecualikan
              }
              note="Penetapan informasi sebagai informasi yang dikecualikan dilakukan melalui pertimbangan dan uji konsekuensi oleh PPID atau Atasan PPID. Informasi tidak boleh dikecualikan hanya karena belum dipublikasikan."
            />

            {/* Perlindungan Data */}
            <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                  <ShieldAlert
                    size={23}
                  />
                </div>

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                    Perlindungan Data
                    Pribadi
                  </p>

                  <h2 className="mt-2 text-xl font-black text-emerald-950">
                    Data warga tidak
                    ditampilkan secara
                    terbuka
                  </h2>

                  <p className="mt-3 text-sm font-medium leading-7 text-emerald-800">
                    Informasi seperti NIK,
                    nomor KK, tanggal lahir
                    lengkap, alamat rinci,
                    nomor pribadi, dokumen
                    identitas, dan data
                    personal lainnya hanya
                    digunakan untuk
                    kepentingan pelayanan
                    yang sah dan tidak
                    dipublikasikan.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA */}
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
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                    Layanan PPID
                  </p>

                  <h2 className="mt-2 text-xl font-black sm:text-2xl">
                    Informasi yang Anda
                    cari belum tersedia?
                  </h2>

                  <p className="mt-2 max-w-xl text-sm font-medium leading-7 text-emerald-50/80">
                    Ajukan permohonan
                    informasi publik. Jika
                    tanggapan belum sesuai,
                    pemohon dapat mengajukan
                    keberatan.
                  </p>
                </div>

                <div className="flex shrink-0 flex-col gap-2">
                  <Link
                    href="/ppid/permohonan-informasi"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-800 transition hover:bg-emerald-50"
                  >
                    Ajukan Permohonan

                    <ArrowRight
                      size={17}
                    />
                  </Link>

                  <Link
                    href="/ppid/pengajuan-keberatan"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white transition hover:bg-white/15"
                  >
                    Ajukan Keberatan
                  </Link>
                </div>
              </div>
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

function HeroInfoCard({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
      <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold leading-7 text-white">
        {description}
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

function TujuanCard({
  item,
}: {
  item: TujuanItem;
}) {
  const Icon =
    item.icon;

  return (
    <article className="group rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
        <Icon
          size={23}
        />
      </div>

      <h3 className="mt-4 font-black text-slate-900">
        {item.title}
      </h3>

      <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
        {item.description}
      </p>
    </article>
  );
}

function QuickLink({
  href,
  label,
  description,
  icon: Icon,
}: {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <a
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-emerald-100 bg-slate-50 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
        <Icon
          size={21}
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-black text-slate-800">
          {label}
        </h3>

        <p className="mt-1 text-xs font-semibold text-slate-500">
          {description}
        </p>
      </div>

      <ArrowRight
        size={17}
        className="shrink-0 text-emerald-400 transition group-hover:translate-x-1 group-hover:text-emerald-700"
      />
    </a>
  );
}

function KlasifikasiSection({
  id,
  label,
  title,
  description,
  schedule,
  icon: Icon,
  items,
  note,
}: KlasifikasiSectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-28 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
    >
      <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-md">
            <Icon
              size={23}
            />
          </div>

          <div className="min-w-0">
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">
              {label}
            </span>

            <h2 className="mt-3 text-xl font-black leading-tight text-slate-900 sm:text-2xl">
              {title}
            </h2>

            <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
              {description}
            </p>

            {schedule && (
              <p className="mt-3 flex items-start gap-2 text-xs font-bold leading-5 text-emerald-700">
                <Clock3
                  size={15}
                  className="mt-0.5 shrink-0"
                />

                {schedule}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-8">
        <div className="grid gap-3">
          {items.map(
            (
              item,
              index
            ) => (
              <KlasifikasiItemCard
                key={`${item.title}-${index}`}
                item={item}
                nomor={
                  index + 1
                }
              />
            )
          )}
        </div>

        {note && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <AlertTriangle
              size={19}
              className="mt-0.5 shrink-0 text-emerald-700"
            />

            <p className="text-xs font-semibold leading-6 text-emerald-800">
              {note}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function KlasifikasiItemCard({
  item,
  nomor,
}: {
  item: KlasifikasiItem;
  nomor: number;
}) {
  const content = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xs font-black text-emerald-700">
        {nomor}
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="font-extrabold leading-7 text-slate-800">
          {item.title}
        </h3>

        {item.description && (
          <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
            {item.description}
          </p>
        )}

        {item.href && (
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
            Buka informasi

            <ArrowRight
              size={13}
            />
          </span>
        )}
      </div>

      {item.href && (
        <ArrowRight
          size={17}
          className="mt-1 shrink-0 text-emerald-300 transition group-hover:translate-x-1 group-hover:text-emerald-700"
        />
      )}
    </>
  );

  if (item.href) {
    return (
      <Link
        href={item.href}
        className="group flex items-start gap-4 rounded-2xl border border-emerald-100 bg-slate-50 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
      >
        {content}
      </Link>
    );
  }

  return (
    <article className="flex items-start gap-4 rounded-2xl border border-emerald-100 bg-slate-50 p-4">
      {content}
    </article>
  );
}