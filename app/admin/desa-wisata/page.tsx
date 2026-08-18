// app/admin/desa-wisata/page.tsx

import Link from 'next/link';

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Camera,
  ClipboardCheck,
  Compass,
  ExternalLink,
  FileText,
  Landmark,
  MapPinned,
  PlayCircle,
  Settings2,
  ShoppingBag,
  Sparkles,
  Store,
  type LucideIcon,
} from 'lucide-react';

/* =========================================================
   TYPES
========================================================= */

interface MenuDesaWisata {
  title: string;

  description: string;

  href: string;

  icon: LucideIcon;

  eyebrow: string;

  status?: string;

  external?: boolean;
}

/* =========================================================
   MENU ADMIN
========================================================= */

const menuDesaWisata:
  MenuDesaWisata[] = [
    {
      title:
        'Destinasi & Potensi',

      description:
        'Kelola informasi destinasi, potensi lokal, lokasi, deskripsi, dan konten yang ditampilkan pada halaman destinasi Desa Wisata Keji.',

      href:
        '/admin/desa-wisata/destinasi',

      icon:
        Compass,

      eyebrow:
        'Destinasi',
    },

    {
      title:
        'Budaya & Tradisi',

      description:
        'Kelola informasi budaya, tradisi masyarakat, kesenian, serta berbagai warisan lokal Desa Keji.',

      href:
        '/admin/desa-wisata/budaya-tradisi',

      icon:
        Landmark,

      eyebrow:
        'Budaya Desa',
    },

    {
      title:
        'Kuliner & UMKM',

      description:
        'Kelola produk UMKM, kuliner lokal, katalog produk, panduan berjualan, dan informasi pelaku usaha Desa Keji.',

      href:
        '/admin/umkm',

      icon:
        ShoppingBag,

      eyebrow:
        'Ekonomi Lokal',
    },

    {
      title:
        'Agenda Wisata',

      description:
        'Kelola agenda kegiatan, acara budaya, kegiatan masyarakat, dan jadwal wisata yang dapat dilihat pengunjung.',

      href:
        '/admin/desa-wisata/agenda',

      icon:
        CalendarDays,

      eyebrow:
        'Agenda Desa',
    },

    {
      title:
        'Galeri Desa',

      description:
        'Kelola album dan dokumentasi foto Desa Keji yang digunakan pada Galeri Desa maupun Galeri Desa Wisata.',

      href:
        '/admin/galeri',

      icon:
        Camera,

      eyebrow:
        'Dokumentasi',
    },

    {
      title:
        'Survei Kepuasan Wisatawan',

      description:
        'Kelola kuesioner, pengaturan publikasi, validasi respons wisatawan, dan dashboard hasil survei.',

      href:
        '/admin/desa-wisata/survei-kepuasan',

      icon:
        ClipboardCheck,

      eyebrow:
        'Evaluasi Wisata',
    },

    {
      title:
        'Informasi Kunjungan',

      description:
        'Kelola informasi lokasi, petunjuk kunjungan, fasilitas, kontak pengelola, serta panduan wisatawan.',

      href:
        '/admin/desa-wisata/informasi-kunjungan',

      icon:
        MapPinned,

      eyebrow:
        'Panduan Kunjungan',
    },

    {
      title:
        'Video Tutorial',

      description:
        'Kelola video tutorial dan materi visual untuk mendukung pelayanan serta pengembangan Desa Wisata Keji.',

      href:
        '/admin/desa-wisata/video-tutorial',

      icon:
        PlayCircle,

      eyebrow:
        'Panduan Visual',
    },

    {
      title:
        'Panduan Pelayanan Wisata',

      description:
        'Kelola Hospitality Pocket Book dan informasi panduan pelayanan bagi pengelola serta pelaku wisata Desa Keji.',

      href:
        '/admin/desa-wisata/panduan-pelayanan',

      icon:
        BookOpen,

      eyebrow:
        'Hospitality',
    },

    {
      title:
        'Buku Pedoman Administrasi',

      description:
        'Kelola judul, deskripsi, cover, dokumen PDF, tahun publikasi, dan status Buku Pedoman Administrasi Desa Wisata.',

      href:
        '/admin/desa-wisata/pedoman-administrasi',

      icon:
        FileText,

      eyebrow:
        'Pedoman Pengelolaan',
    },

    {
      title:
        'Paket Wisata',

      description:
        'Kelola informasi Paket Wisata Desa Keji, tautan menuju laman paket wisata, serta status publikasinya.',

      href:
        '/admin/desa-wisata/paket-wisata',

      icon:
        Store,

      eyebrow:
        'Produk Wisata',
    },
  ];

/* =========================================================
   PAGE
========================================================= */

export default function AdminDesaWisataPage() {
  return (
    <div className="mx-auto max-w-[1450px] space-y-8">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 px-6 py-8 text-white shadow-xl sm:px-8 lg:px-10 lg:py-10">
        {/* Pattern */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',

            backgroundSize:
              '27px 27px',
          }}
        />

        {/* Decoration */}

        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border-[58px] border-white/[0.04]" />

        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-emerald-300/10 blur-[90px]" />

        {/* Content */}

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur">
              <Settings2
                size={27}
              />
            </div>

            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-200">
              Pengelolaan Website
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Desa Wisata Keji
            </h1>

            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80 sm:text-base">
              Kelola seluruh informasi
              destinasi, budaya,
              kuliner, agenda,
              kunjungan, survei,
              panduan, dan paket wisata
              Desa Keji melalui satu
              halaman.
            </p>
          </div>

          <Link
            href="/desa-wisata"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/20"
          >
            Lihat Halaman Publik

            <ExternalLink
              size={16}
            />
          </Link>
        </div>
      </section>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          icon={
            Compass
          }
          value="10"
          label="Modul Desa Wisata"
          description="Pusat pengelolaan konten wisata"
        />

        <SummaryCard
          icon={
            BarChart3
          }
          value="Terintegrasi"
          label="Survei Wisatawan"
          description="Form, respons, dan dashboard"
        />

        <SummaryCard
          icon={
            Sparkles
          }
          value="Publik"
          label="Informasi Desa"
          description="Konten terhubung ke halaman wisata"
        />
      </section>

      {/* =====================================================
          SECTION TITLE
      ===================================================== */}

      <section>
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
            <Settings2
              size={21}
            />
          </div>

          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">
              Menu Pengelolaan
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-900">
              Kelola Desa Wisata
            </h2>

            <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-slate-500">
              Pilih modul yang ingin
              dikelola. Perubahan pada
              setiap modul akan
              disinkronkan dengan
              halaman publik yang
              berkaitan.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          MANAGEMENT CARDS
      ===================================================== */}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {menuDesaWisata.map(
          (
            item,
            index
          ) => (
            <MenuCard
              key={
                item.href
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
      </section>

      {/* =====================================================
          PUBLIC STRUCTURE
      ===================================================== */}

      <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-sm">
        <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-white px-6 py-5 sm:px-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-emerald-700">
            Struktur Publik
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-900">
            Navigasi Desa Wisata
          </h2>

          <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
            Struktur halaman publik
            Desa Wisata Keji yang
            terhubung dengan modul
            pengelolaan.
          </p>
        </div>

        <div className="grid gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-3">
          <PublicLink
            number="01"
            label="Jelajah Desa Keji"
            href="/desa-wisata"
          />

          <PublicLink
            number="02"
            label="Destinasi & Potensi"
            href="/desa-wisata/destinasi"
          />

          <PublicLink
            number="03"
            label="Budaya & Tradisi"
            href="/desa-wisata/budaya-tradisi"
          />

          <PublicLink
            number="04"
            label="Kuliner & UMKM"
            href="/desa-wisata/kuliner-umkm"
          />

          <PublicLink
            number="05"
            label="Agenda Wisata"
            href="/desa-wisata/agenda"
          />

          <PublicLink
            number="06"
            label="Galeri Desa"
            href="/desa-wisata/galeri"
          />

          <PublicLink
            number="07"
            label="Informasi Kunjungan"
            href="/desa-wisata/informasi-kunjungan"
          />

          <PublicLink
            number="08"
            label="Survei Kepuasan"
            href="/desa-wisata/survei-kepuasan"
          />

          <PublicLink
            number="09"
            label="Hasil Survei"
            href="/desa-wisata/hasil-survei"
          />

          <PublicLink
            number="10"
            label="Video Tutorial"
            href="/desa-wisata/video-tutorial"
          />

          <PublicLink
            number="11"
            label="Panduan Pelayanan Wisata"
            href="/desa-wisata/panduan-pelayanan"
          />

          <PublicLink
            number="12"
            label="Buku Pedoman Administrasi"
            href="/desa-wisata/pedoman-administrasi"
          />

          <PublicLink
            number="13"
            label="Paket Wisata"
            href="/desa-wisata/paket-wisata"
          />
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   MENU CARD
========================================================= */

function MenuCard({
  item,
  index,
}: {
  item:
    MenuDesaWisata;

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
      className="group relative flex min-h-[270px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/[0.07]"
    >
      {/* Decoration */}

      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-100/70 transition duration-500 group-hover:scale-125" />

      {/* Header */}

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition duration-300 group-hover:bg-emerald-700 group-hover:text-white">
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

      {/* Content */}

      <div className="relative mt-6 flex flex-1 flex-col">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">
          {
            item.eyebrow
          }
        </p>

        <h3 className="mt-2 text-xl font-black leading-7 text-slate-900 transition group-hover:text-emerald-800">
          {
            item.title
          }
        </h3>

        <p className="mt-3 flex-1 text-sm font-medium leading-7 text-slate-500">
          {
            item.description
          }
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-emerald-100 pt-4">
          <span className="text-xs font-extrabold text-emerald-700">
            Kelola Modul
          </span>

          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* =========================================================
   SUMMARY
========================================================= */

function SummaryCard({
  icon: Icon,
  value,
  label,
  description,
}: {
  icon:
    LucideIcon;

  value:
    string;

  label:
    string;

  description:
    string;
}) {
  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <Icon
            size={20}
          />
        </div>

        <div>
          <p className="text-lg font-black text-emerald-950">
            {value}
          </p>

          <p className="mt-1 text-xs font-extrabold text-slate-700">
            {label}
          </p>

          <p className="mt-1 text-[10px] font-medium leading-5 text-slate-400">
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
   PUBLIC LINK
========================================================= */

function PublicLink({
  number,
  label,
  href,
}: {
  number:
    string;

  label:
    string;

  href:
    string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-h-[90px] items-center gap-4 bg-white p-5 transition hover:bg-emerald-50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[10px] font-black text-emerald-700">
        {number}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-black text-slate-800 transition group-hover:text-emerald-800">
          {label}
        </p>

        <p className="mt-1 text-[10px] font-semibold text-slate-400">
          Halaman publik
        </p>
      </div>

      <ExternalLink
        size={15}
        className="shrink-0 text-slate-300 transition group-hover:text-emerald-700"
      />
    </Link>
  );
}