// app/(public)/desa-wisata/page.tsx

import Image from 'next/image';

import Link from 'next/link';

import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Camera,
  ChevronRight,
  Coffee,
  Compass,
  HeartHandshake,
  Landmark,
  Leaf,
  MapPin,
  PlayCircle,
  Route,
  ShoppingBag,
  Sparkles,
  Store,
  TreePine,
  UsersRound,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';

import SosialMediaDesaWisataPopup from '@/components/desa-wisata/SosialMediaDesaWisataPopup';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  ProdukUmkm,
} from '@/types/umkm';

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

/* =========================================================
   DESA WISATA IDENTITY
========================================================= */

const LOGO_DWK =
  '/desa-wisata/Logo%20DWK.png';

const INSTAGRAM_DESA_WISATA =
  'https://www.instagram.com/desa.wisatakeji?igsh=OHhtanAweGxxamQ0';

/* =========================================================
   TYPES
========================================================= */

interface PotensiWisata {
  title: string;

  description: string;

  href: string;

  icon: LucideIcon;

  label: string;
}

interface BudayaDesa {
  title: string;

  description: string;

  category: string;

  icon: LucideIcon;
}

interface PedomanAdministrasiPreview {
  judul: string;

  deskripsi: string;

  aktif: boolean;
}

/* =========================================================
   DATA POTENSI
========================================================= */

const potensiWisata:
  PotensiWisata[] = [
    {
      title:
        'Budaya dan Tradisi',

      description:
        'Mengenal tradisi, kegiatan sosial, dan nilai budaya yang tetap dijaga oleh masyarakat Desa Keji.',

      href:
        '/desa-wisata/budaya-tradisi',

      icon:
        Landmark,

      label:
        'Warisan Desa',
    },

    {
      title:
        'Kuliner dan UMKM',

      description:
        'Temukan kuliner lokal, produk rumahan, serta usaha masyarakat dari berbagai dusun di Desa Keji.',

      href:
        '/desa-wisata/kuliner-umkm',

      icon:
        UtensilsCrossed,

      label:
        'Produk Lokal',
    },

    {
      title:
        'Destinasi dan Potensi',

      description:
        'Jelajahi lokasi, kegiatan, sentra budaya, serta berbagai potensi yang dapat dikembangkan sebagai daya tarik desa.',

      href:
        '/desa-wisata/destinasi',

      icon:
        Compass,

      label:
        'Jelajah Desa',
    },

    {
      title:
        'Agenda Wisata',

      description:
        'Lihat jadwal kegiatan budaya, kesenian, Pasar Leginan, dan agenda masyarakat Desa Keji.',

      href:
        '/desa-wisata/agenda',

      icon:
        CalendarDays,

      label:
        'Agenda Desa',
    },

    {
      title:
        'Galeri Desa',

      description:
        'Nikmati dokumentasi suasana desa, budaya, kuliner, kegiatan masyarakat, dan kehidupan sehari-hari warga.',

      href:
        '/desa-wisata/galeri',

      icon:
        Camera,

      label:
        'Cerita Visual',
    },

    {
      title:
        'Informasi Kunjungan',

      description:
        'Temukan lokasi, petunjuk arah, kontak, fasilitas, dan panduan sebelum berkunjung ke Desa Keji.',

      href:
        '/desa-wisata/informasi-kunjungan',

      icon:
        Route,

      label:
        'Panduan Wisata',
    },

    {
      title:
        'Video Tutorial',

      description:
        'Tonton kumpulan video panduan dan edukasi untuk mendukung pelayanan, pengelolaan, dan pengembangan Desa Wisata Keji.',

      href:
        '/desa-wisata/video-tutorial',

      icon:
        PlayCircle,

      label:
        'Panduan Visual',
    },

    {
      title:
        'Panduan Pelayanan Wisata',

      description:
        'Akses Hospitality Pocket Book sebagai panduan pelayanan bagi pelaku dan pengelola wisata Desa Keji.',

      href:
        '/desa-wisata/panduan-pelayanan',

      icon:
        BookOpen,

      label:
        'Pocket Book',
    },
  ];

/* =========================================================
   DATA BUDAYA
========================================================= */

const budayaDesa:
  BudayaDesa[] = [
    {
      title:
        'Tethek Melek',

      description:
        'Pangan lokal khas Desa Keji yang menjadi bagian dari identitas kuliner dan cerita masyarakat desa.',

      category:
        'Kuliner Tradisional',

      icon:
        Coffee,
    },

    {
      title:
        'Tradisi Wajik',

      description:
        'Tradisi pembuatan dan pembagian wajik yang tumbuh dalam kegiatan sosial dan keagamaan masyarakat.',

      category:
        'Tradisi Masyarakat',

      icon:
        HeartHandshake,
    },

    {
      title:
        'Kesenian Desa',

      description:
        'Karawitan, drum blek, dan kuda lumping menjadi ruang ekspresi sekaligus pelestarian budaya masyarakat.',

      category:
        'Seni Pertunjukan',

      icon:
        Sparkles,
    },

    {
      title:
        'Pasar Leginan',

      description:
        'Ruang promosi produk lokal, kuliner, UMKM, dan interaksi masyarakat yang menghidupkan perekonomian desa.',

      category:
        'Ekonomi Kreatif',

      icon:
        Store,
    },
  ];

/* =========================================================
   DATA DUSUN
========================================================= */

const dusunDesa = [
  {
    name:
      'Dusun Keji',

    description:
      'Wilayah yang menjadi bagian penting dari pusat kegiatan pemerintahan, sosial, dan kehidupan masyarakat Desa Keji.',
  },

  {
    name:
      'Dusun Suruhan',

    description:
      'Wilayah dengan kegiatan masyarakat, potensi budaya, kesenian, dan kehidupan lingkungan yang terus berkembang.',
  },

  {
    name:
      'Dusun Sitoyo',

    description:
      'Wilayah dengan suasana pedesaan, kegiatan warga, serta potensi lokal yang menjadi bagian dari identitas Desa Keji.',
  },
];

/* =========================================================
   HELPERS
========================================================= */

function formatRupiah(
  value: number
) {
  return new Intl.NumberFormat(
    'id-ID',
    {
      style:
        'currency',

      currency:
        'IDR',

      minimumFractionDigits:
        0,

      maximumFractionDigits:
        0,
    }
  ).format(
    value
  );
}

function normalizeProduk(
  row: Record<
    string,
    unknown
  >
): ProdukUmkm {
  return {
    id:
      String(
        row.id ??
          ''
      ),

    nama_produk:
      String(
        row.nama_produk ??
          ''
      ).trim(),

    slug:
      String(
        row.slug ??
          ''
      ).trim(),

    kategori:
      String(
        row.kategori ??
          'Lainnya'
      ).trim(),

    harga:
      Number(
        row.harga ??
          0
      ),

    satuan:
      String(
        row.satuan ??
          'pcs'
      ).trim(),

    deskripsi:
      row.deskripsi
        ? String(
            row.deskripsi
          )
        : null,

    nama_penjual:
      String(
        row.nama_penjual ??
          ''
      ).trim(),

    nomor_whatsapp:
      row.nomor_whatsapp
        ? String(
            row.nomor_whatsapp
          )
        : null,

    alamat:
      row.alamat
        ? String(
            row.alamat
          )
        : null,

    lokasi_url:
      row.lokasi_url
        ? String(
            row.lokasi_url
          )
        : null,

    gambar_url:
      row.gambar_url
        ? String(
            row.gambar_url
          )
        : null,

    terverifikasi:
      Boolean(
        row.terverifikasi
      ),

    aktif:
      Boolean(
        row.aktif
      ),

    urutan:
      Number(
        row.urutan ??
          0
      ),

    created_at:
      String(
        row.created_at ??
          ''
      ),

    updated_at:
      String(
        row.updated_at ??
          ''
      ),
  };
}

/* =========================================================
   DATA PRODUK UNGGULAN
========================================================= */

async function getProdukUnggulan():
  Promise<ProdukUmkm[]> {
  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from(
        'produk_umkm'
      )
      .select(`
        id,
        nama_produk,
        slug,
        kategori,
        harga,
        satuan,
        deskripsi,
        nama_penjual,
        nomor_whatsapp,
        alamat,
        lokasi_url,
        gambar_url,
        terverifikasi,
        aktif,
        urutan,
        created_at,
        updated_at
      `)
      .eq(
        'aktif',
        true
      )
      .order(
        'terverifikasi',
        {
          ascending:
            false,
        }
      )
      .order(
        'urutan',
        {
          ascending:
            true,
        }
      )
      .order(
        'created_at',
        {
          ascending:
            false,
        }
      )
      .limit(4);

  if (error) {
    console.error(
      'Gagal mengambil produk unggulan untuk Desa Wisata:',
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
      data ??
      []
    ) as Record<
      string,
      unknown
    >[]
  )
    .map(
      normalizeProduk
    )
    .filter(
      (item) =>
        item.id.length >
          0 &&
        item.nama_produk
          .length >
          0 &&
        item.nama_penjual
          .length >
          0
    );
}

/* =========================================================
   PEDOMAN ADMINISTRASI
========================================================= */

async function getPedomanAdministrasi():
  Promise<PedomanAdministrasiPreview> {
  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from(
        'desa_wisata_pedoman_administrasi_settings'
      )
      .select(`
        judul,
        deskripsi,
        aktif
      `)
      .eq(
        'setting_key',
        'utama'
      )
      .maybeSingle();

  if (error) {
    console.error(
      'Gagal mengambil Pedoman Administrasi untuk Desa Wisata:',
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

    return {
      judul:
        'Pedoman Administrasi',

      deskripsi:
        'Akses buku pedoman administrasi sebagai panduan tata kelola dan pengelolaan administrasi Desa Wisata Keji.',

      aktif:
        true,
    };
  }

  return {
    judul:
      String(
        data?.judul ??
          'Pedoman Administrasi'
      ).trim() ||
      'Pedoman Administrasi',

    deskripsi:
      String(
        data?.deskripsi ??
          'Akses buku pedoman administrasi sebagai panduan tata kelola dan pengelolaan administrasi Desa Wisata Keji.'
      ).trim() ||
      'Akses buku pedoman administrasi sebagai panduan tata kelola dan pengelolaan administrasi Desa Wisata Keji.',

    aktif:
      data?.aktif ===
        undefined ||
      data?.aktif ===
        null
        ? true
        : Boolean(
            data.aktif
          ),
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function DesaWisataPage() {
  const [
    produkUnggulan,
    pedomanAdministrasi,
  ] =
    await Promise.all([
      getProdukUnggulan(),
      getPedomanAdministrasi(),
    ]);

  /* =======================================================
     POTENSI + PEDOMAN ADMINISTRASI
  ======================================================= */

  const daftarPotensiWisata:
    PotensiWisata[] =
    pedomanAdministrasi.aktif
      ? [
          ...potensiWisata,

          {
            title:
              pedomanAdministrasi.judul,

            description:
              pedomanAdministrasi.deskripsi,

            href:
              '/desa-wisata/pedoman-administrasi',

            icon:
              BookOpen,

            label:
              'Pedoman Pengelolaan',
          },
        ]
      : potensiWisata;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          POPUP SOSIAL MEDIA
      ===================================================== */}

      <SosialMediaDesaWisataPopup />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative isolate overflow-hidden bg-emerald-950 text-white">
        {/* Background */}

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/background.png')",
          }}
        />

        {/* Overlay */}

        <div className="absolute inset-0 bg-gradient-to-r from-[#031f18] via-emerald-950/92 to-emerald-800/55" />

        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-black/10" />

        {/* Pattern */}

        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.28) 1.2px, transparent 1.2px)',

            backgroundSize:
              '28px 28px',
          }}
        />

        {/* Decorations */}

        <div className="pointer-events-none absolute -right-36 -top-36 h-[520px] w-[520px] rounded-full border-[88px] border-white/[0.04]" />

        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[420px] w-[420px] rounded-full bg-emerald-300/[0.07] blur-[110px]" />

        {/* Content */}

        <div className="relative mx-auto flex min-h-[720px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid w-full gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            {/* =================================================
                LEFT
            ================================================= */}

            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-100 backdrop-blur">
                <Leaf
                  size={15}
                />

                Desa Wisata Keji
              </div>

              <p className="mt-8 text-sm font-extrabold uppercase tracking-[0.24em] text-emerald-300">
                Ungaran Barat ·
                Kabupaten Semarang
              </p>

              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Jelajahi Pesona

                <span className="block text-emerald-300">
                  Desa Keji
                </span>
              </h1>

              <p className="mt-7 max-w-3xl text-base font-medium leading-8 text-emerald-50/90 md:text-lg md:leading-9">
                Temukan kekayaan
                budaya, kuliner lokal,
                kesenian, kegiatan
                masyarakat, dan
                suasana pedesaan yang
                tumbuh melalui
                semangat kebersamaan
                serta pelestarian
                potensi lokal.
              </p>

              {/* CTA */}

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/desa-wisata/destinasi"
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 text-sm font-extrabold text-emerald-950 shadow-xl shadow-black/15 transition hover:-translate-y-0.5 hover:bg-emerald-300"
                >
                  <Compass
                    size={18}
                  />

                  Jelajahi Desa Keji
                </Link>

                <Link
                  href="/desa-wisata/informasi-kunjungan"
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 text-sm font-extrabold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  <MapPin
                    size={18}
                  />

                  Rencanakan Kunjungan
                </Link>
              </div>

              {/* Stats */}

              <div className="mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
                <HeroStat
                  value="3"
                  label="Dusun"
                />

                <HeroStat
                  value="Beragam"
                  label="Budaya & Tradisi"
                />

                <HeroStat
                  value="Lokal"
                  label="Kuliner & UMKM"
                />
              </div>
            </div>

            {/* =================================================
                RIGHT - LOGO DESA WISATA
            ================================================= */}

            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[430px]">
                {/* Glow */}

                <div className="pointer-events-none absolute inset-10 rounded-full bg-emerald-300/20 blur-[80px]" />

                {/* Card */}

                <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/[0.08] p-6 shadow-[0_35px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-7">
                  {/* Pattern */}

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-[0.1]"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',

                      backgroundSize:
                        '23px 23px',
                    }}
                  />

                  <div className="relative">
                    {/* Logo */}

                    <div className="mx-auto flex aspect-square max-w-[290px] items-center justify-center rounded-[2rem] border border-white/10 bg-black/10 p-4 sm:max-w-[310px] sm:p-5">
                      <Image
                        src={
                          LOGO_DWK
                        }
                        alt="Logo Desa Wisata Keji"
                        width={380}
                        height={380}
                        priority
                        className="h-full w-full object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.28)]"
                      />
                    </div>

                    {/* Identity */}

                    <div className="mt-6 text-center">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-300">
                        Identitas Desa
                        Wisata
                      </p>

                      <h2 className="mt-2 text-2xl font-black text-white">
                        Desa Wisata Keji
                      </h2>

                      <p className="mt-3 text-sm font-medium leading-6 text-emerald-50/70">
                        Kekayaan alam,
                        budaya,
                        kesenian, dan
                        kehidupan
                        masyarakat
                        dalam satu
                        pengalaman desa
                        wisata.
                      </p>
                    </div>

                    {/* Instagram */}

                    <a
                      href={
                        INSTAGRAM_DESA_WISATA
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-6 flex min-h-12 items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 transition hover:bg-white/15"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-800">
                          <InstagramIcon
                            className="h-[18px] w-[18px]"
                          />
                        </div>

                        <div className="min-w-0 text-left">
                          <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-emerald-300">
                            Instagram
                          </p>

                          <p className="truncate text-xs font-extrabold text-white">
                            @desa.wisatakeji
                          </p>
                        </div>
                      </div>

                      <ArrowUpRight
                        size={17}
                        className="shrink-0 text-emerald-200 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PENGANTAR
      ===================================================== */}

      <section className="relative z-10 -mt-16 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              {/* Intro kiri */}

              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 p-7 text-white md:p-10">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, rgba(255,255,255,0.3) 1.2px, transparent 1.2px)',

                    backgroundSize:
                      '24px 24px',
                  }}
                />

                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                    <TreePine
                      size={28}
                    />
                  </div>

                  <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-200">
                    Mengenal Desa Keji
                  </p>

                  <h2 className="mt-3 text-2xl font-black leading-tight md:text-3xl">
                    Desa yang tumbuh
                    melalui budaya,
                    kebersamaan, dan
                    potensi masyarakat
                  </h2>

                  <p className="mt-5 text-sm font-medium leading-7 text-emerald-50/85">
                    Desa Keji bukan
                    hanya sebuah
                    wilayah, tetapi
                    ruang hidup
                    masyarakat yang
                    menjaga tradisi,
                    membangun usaha
                    lokal, dan
                    mengembangkan
                    potensi desa secara
                    bersama-sama.
                  </p>
                </div>
              </div>

              {/* Dusun */}

              <div className="grid gap-px bg-slate-200 sm:grid-cols-3">
                {dusunDesa.map(
                  (
                    dusun,
                    index
                  ) => (
                    <article
                      key={
                        dusun.name
                      }
                      className="group bg-white p-6 transition hover:bg-emerald-50 md:p-7"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-sm font-black text-emerald-700">
                        {index +
                          1}
                      </span>

                      <h3 className="mt-5 text-lg font-black text-slate-900">
                        {
                          dusun.name
                        }
                      </h3>

                      <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
                        {
                          dusun.description
                        }
                      </p>
                    </article>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          POTENSI
      ===================================================== */}

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Jelajah berdasarkan minat"
            title="Temukan pengalaman di Desa Keji"
            description="Pilih pengalaman yang ingin dijelajahi, mulai dari budaya, kuliner, produk lokal, hingga informasi untuk merencanakan kunjungan."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {daftarPotensiWisata.map(
              (
                item,
                index
              ) => (
                <PotensiCard
                  key={`${item.href}-${index}`}
                  item={
                    item
                  }
                  index={
                    index
                  }
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          BUDAYA
      ===================================================== */}

      <section className="overflow-hidden bg-slate-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-400">
                Warisan yang tetap
                hidup
              </p>

              <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight md:text-4xl">
                Budaya dan tradisi
                yang membentuk
                identitas Desa Keji
              </h2>

              <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-slate-300 md:text-base">
                Tradisi dan kesenian
                Desa Keji menjadi
                ruang kebersamaan,
                pelestarian nilai,
                serta penguatan
                identitas masyarakat.
              </p>
            </div>

            <Link
              href="/desa-wisata/budaya-tradisi"
              className="inline-flex w-fit items-center gap-2 text-sm font-extrabold text-emerald-400 transition hover:text-emerald-300"
            >
              Lihat seluruh budaya

              <ArrowRight
                size={17}
              />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {budayaDesa.map(
              (
                item,
                index
              ) => (
                <BudayaCard
                  key={
                    item.title
                  }
                  item={
                    item
                  }
                  index={
                    index
                  }
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          UMKM
      ===================================================== */}

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Kuliner dan produk lokal"
              title="Dukung UMKM masyarakat Desa Keji"
              description="Kenali produk masyarakat, temukan kuliner lokal, dan hubungi pelaku usaha secara langsung melalui Lapak Desa."
              compact
            />

            <Link
              href="/umkm"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-emerald-800"
            >
              <ShoppingBag
                size={17}
              />

              Kunjungi Lapak Desa
            </Link>
          </div>

          {produkUnggulan.length >
          0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {produkUnggulan.map(
                (
                  produk
                ) => (
                  <ProdukWisataCard
                    key={
                      produk.id
                    }
                    produk={
                      produk
                    }
                  />
                )
              )}
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <ShoppingBag
                size={44}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 text-lg font-black text-slate-800">
                Produk unggulan
                sedang disiapkan
              </h3>

              <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-6 text-slate-500">
                Data kuliner dan UMKM
                akan tampil setelah
                produk ditambahkan
                melalui pengelolaan
                Lapak Desa.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          RENCANA KUNJUNGAN
      ===================================================== */}

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-7 text-white shadow-2xl md:p-10 lg:p-12">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(255,255,255,0.28) 1.2px, transparent 1.2px)',

                backgroundSize:
                  '27px 27px',
              }}
            />

            <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border-[58px] border-white/[0.05]" />

            <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-200">
                  Rencanakan kunjungan
                </p>

                <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight md:text-4xl">
                  Datang, mengenal,
                  dan menjadi bagian
                  dari cerita Desa
                  Keji
                </h2>

                <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-emerald-50/85 md:text-base">
                  Temukan informasi
                  lokasi, agenda,
                  produk lokal,
                  budaya, dan panduan
                  sebelum berkunjung.
                  Hormati kehidupan
                  masyarakat serta
                  jaga kebersihan
                  selama berada di
                  desa.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/desa-wisata/informasi-kunjungan"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-900 transition hover:bg-emerald-50"
                  >
                    <Route
                      size={17}
                    />

                    Informasi
                    Kunjungan
                  </Link>

                  <Link
                    href="/kontak"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white transition hover:bg-white/15"
                  >
                    <UsersRound
                      size={17}
                    />

                    Hubungi Desa Keji
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <VisitFeature
                  icon={
                    MapPin
                  }
                  title="Petunjuk arah"
                  description="Akses lokasi Desa Keji dan titik kunjungan melalui peta digital."
                />

                <VisitFeature
                  icon={
                    CalendarDays
                  }
                  title="Agenda kegiatan"
                  description="Periksa jadwal kegiatan budaya, kesenian, dan agenda masyarakat."
                />

                <VisitFeature
                  icon={
                    HeartHandshake
                  }
                  title="Etika berkunjung"
                  description="Hormati adat, lingkungan, dan aktivitas masyarakat selama kunjungan."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INSTAGRAM DESA WISATA
      ===================================================== */}

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-sm">
            <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
              {/* LOGO */}

              <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#052e24] via-emerald-900 to-emerald-700 p-8">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',

                    backgroundSize:
                      '24px 24px',
                  }}
                />

                <div className="pointer-events-none absolute inset-14 rounded-full bg-emerald-300/15 blur-[60px]" />

                <Image
                  src={
                    LOGO_DWK
                  }
                  alt="Logo Desa Wisata Keji"
                  width={300}
                  height={300}
                  className="relative h-[230px] w-[230px] object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.28)]"
                />
              </div>

              {/* CONTENT */}

              <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <InstagramIcon
                    className="h-6 w-6"
                  />
                </div>

                <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">
                  Instagram Resmi
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
                  Ikuti perjalanan
                  Desa Wisata Keji
                </h2>

                <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-slate-500 sm:text-base">
                  Temukan dokumentasi
                  kegiatan, budaya,
                  destinasi, kuliner,
                  kesenian, dan kabar
                  terbaru Desa Wisata
                  Keji melalui akun
                  Instagram resmi.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={
                      INSTAGRAM_DESA_WISATA
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800"
                  >
                    <InstagramIcon
                      className="h-[18px] w-[18px]"
                    />

                    @desa.wisatakeji

                    <ArrowUpRight
                      size={16}
                      className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>

                  <span className="text-xs font-semibold text-slate-400">
                    Desa Wisata Keji ·
                    Ungaran Barat
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PENUTUP
      ===================================================== */}

      <section className="border-t border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 p-2">
            <Image
              src={
                LOGO_DWK
              }
              alt="Logo Desa Wisata Keji"
              width={100}
              height={100}
              className="h-full w-full object-contain"
            />
          </div>

          <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">
            Desa Wisata Keji
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Mari berkunjung ke
            Desa Keji
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-500 md:text-base">
            Nikmati suasana
            pedesaan, kenali budaya
            masyarakat, temukan
            kuliner lokal, dan
            dukung pertumbuhan UMKM
            Desa Keji.
          </p>

          <Link
            href="/desa-wisata/destinasi"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-800"
          >
            Mulai Jelajah

            <ArrowRight
              size={17}
            />
          </Link>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   HERO STAT
========================================================= */

function HeroStat({
  value,
  label,
}: {
  value: string;

  label: string;
}) {
  return (
    <article className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
      <p className="text-xl font-black text-white">
        {value}
      </p>

      <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-200">
        {label}
      </p>
    </article>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  eyebrow,
  title,
  description,
  compact = false,
}: {
  eyebrow: string;

  title: string;

  description: string;

  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? 'max-w-3xl'
          : 'max-w-4xl'
      }
    >
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
        {title}
      </h2>

      <p className="mt-4 text-sm font-medium leading-7 text-slate-500 md:text-base">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   POTENSI CARD
========================================================= */

function PotensiCard({
  item,
  index,
}: {
  item:
    PotensiWisata;

  index:
    number;
}) {
  const Icon =
    item.icon;

  return (
    <Link
      href={
        item.href
      }
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-100 opacity-60 transition duration-300 group-hover:scale-125" />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-5">
          <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
            <Icon
              size={24}
            />
          </div>

          <span className="text-xs font-black text-slate-300">
            {String(
              index +
                1
            ).padStart(
              2,
              '0'
            )}
          </span>
        </div>

        <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-600">
          {
            item.label
          }
        </p>

        <h3 className="mt-2 text-xl font-black text-slate-900">
          {
            item.title
          }
        </h3>

        <p className="mt-3 flex-1 text-sm font-medium leading-6 text-slate-500">
          {
            item.description
          }
        </p>

        <span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-emerald-700">
          Jelajahi

          <ChevronRight
            size={17}
            className="transition group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}

/* =========================================================
   BUDAYA CARD
========================================================= */

function BudayaCard({
  item,
  index,
}: {
  item:
    BudayaDesa;

  index:
    number;
}) {
  const Icon =
    item.icon;

  return (
    <article className="group relative min-h-[300px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.09]">
      <div className="absolute -bottom-16 -right-16 h-44 w-44 rounded-full border-[34px] border-white/[0.03]" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
            <Icon
              size={23}
            />
          </div>

          <span className="text-xs font-black text-white/20">
            {String(
              index +
                1
            ).padStart(
              2,
              '0'
            )}
          </span>
        </div>

        <p className="mt-8 text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-400">
          {
            item.category
          }
        </p>

        <h3 className="mt-2 text-xl font-black text-white">
          {
            item.title
          }
        </h3>

        <p className="mt-4 text-sm font-medium leading-7 text-slate-300">
          {
            item.description
          }
        </p>
      </div>
    </article>
  );
}

/* =========================================================
   PRODUK WISATA CARD
========================================================= */

function ProdukWisataCard({
  produk,
}: {
  produk:
    ProdukUmkm;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">
      {/* Image */}

      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {produk.gambar_url ? (
          <img
            src={
              produk.gambar_url
            }
            alt={
              produk.nama_produk
            }
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-slate-300">
            <ShoppingBag
              size={42}
            />

            <span className="mt-2 text-xs font-bold">
              Belum ada foto
            </span>
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700 shadow-sm">
          {
            produk.kategori
          }
        </span>
      </div>

      {/* Content */}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-2">
          <h3 className="min-w-0 flex-1 text-lg font-black leading-snug text-slate-900">
            {
              produk.nama_produk
            }
          </h3>

          {produk.terverifikasi && (
            <BadgeCheck
              size={19}
              className="shrink-0 fill-emerald-500 text-white"
            />
          )}
        </div>

        <p className="mt-2 text-lg font-black text-emerald-800">
          {formatRupiah(
            produk.harga
          )}

          <span className="ml-1 text-xs font-semibold text-slate-400">
            /{' '}
            {
              produk.satuan
            }
          </span>
        </p>

        {produk.deskripsi && (
          <p className="mt-3 line-clamp-3 text-sm font-medium leading-6 text-slate-500">
            {
              produk.deskripsi
            }
          </p>
        )}

        <div className="mt-auto pt-5">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            {
              produk.nama_penjual
            }
          </p>

          <Link
            href="/umkm"
            className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-emerald-700 transition hover:text-emerald-900"
          >
            Lihat di Lapak Desa

            <ArrowRight
              size={15}
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   VISIT FEATURE
========================================================= */

function VisitFeature({
  icon: Icon,
  title,
  description,
}: {
  icon:
    LucideIcon;

  title:
    string;

  description:
    string;
}) {
  return (
    <article className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-200">
          <Icon
            size={21}
          />
        </div>

        <div>
          <h3 className="font-black text-white">
            {title}
          </h3>

          <p className="mt-2 text-xs font-medium leading-6 text-emerald-50/75">
            {
              description
            }
          </p>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   INSTAGRAM ICON
========================================================= */

function InstagramIcon({
  className = '',
}: {
  className?:
    string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={
        className
      }
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="17.5"
        cy="6.5"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}