// app/(public)/desa-wisata/budaya-tradisi/page.tsx

import type { Metadata } from 'next';

import Link from 'next/link';

import {
  ArrowRight,
  BookOpen,
  Camera,
  Coffee,
  HeartHandshake,
  Landmark,
  Leaf,
  MapPin,
  Sparkles,
  UsersRound,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';

export const metadata: Metadata = {
  title:
    'Budaya dan Tradisi Desa Keji | SIJI',

  description:
    'Mengenal Iriban Banyu Kemloso, kesenian, kuliner tradisional, dan budaya masyarakat Desa Keji.',
};

/* =========================================================
   TYPES
========================================================= */

interface CultureItem {
  title: string;
  category: string;
  description: string;
  imageUrl: string | null;
  icon: LucideIcon;
}

/* =========================================================
   TRADISI
========================================================= */

const tradisi: CultureItem[] = [
  {
    title:
      'Iriban Banyu Kemloso',

    category:
      'Tradisi Desa',

    imageUrl:
      null,

    icon:
      Leaf,

    description:
      'Iriban Banyu Kemloso merupakan tradisi tahunan masyarakat Desa Keji yang dilaksanakan di sekitar Sumber Mata Air Kemloso. Kegiatan ini menjadi bentuk rasa syukur masyarakat atas keberadaan sumber air sekaligus bagian dari upaya menjaga dan melestarikan lingkungan di sekitar sumber.',
  },

  {
    title:
      'Maulid Nabi',

    category:
      'Tradisi Keagamaan',

    imageUrl:
      null,

    icon:
      HeartHandshake,

    description:
      'Peringatan Maulid Nabi menjadi salah satu kegiatan budaya dan keagamaan yang masih dilaksanakan serta dijaga oleh masyarakat Desa Keji.',
  },
];

/* =========================================================
   KESENIAN
========================================================= */

const kesenian: CultureItem[] = [
  {
    title:
      'Gamelan',

    category:
      'Kesenian Tradisional',

    imageUrl:
      null,

    icon:
      Sparkles,

    description:
      'Gamelan menjadi salah satu bentuk kesenian tradisional yang masih terdapat dan terus dilestarikan oleh masyarakat Desa Keji.',
  },

  {
    title:
      'Kuda Debog',

    category:
      'Kesenian Tradisional',

    imageUrl:
      null,

    icon:
      Sparkles,

    description:
      'Kuda Debog merupakan salah satu kesenian yang masih dijaga di Desa Keji dan menjadi bagian dari kegiatan seni tradisional masyarakat, termasuk kegiatan yang berlangsung di kawasan DWK Wono Sesaji.',
  },

  {
    title:
      'Kuda Lumping',

    category:
      'Kesenian Tradisional',

    imageUrl:
      null,

    icon:
      Sparkles,

    description:
      'Kuda Lumping merupakan salah satu kesenian tradisional yang masih ada dan dilestarikan sebagai bagian dari kekayaan budaya Desa Keji.',
  },
];

/* =========================================================
   KULINER
========================================================= */

const kuliner: CultureItem[] = [
  {
    title:
      'Tetek Melek',

    category:
      'Kuliner Tradisional',

    imageUrl:
      null,

    icon:
      Coffee,

    description:
      'Tetek Melek merupakan makanan khas Desa Keji berbahan dasar singkong. Singkong diparut dan diperas, kemudian diberi garam dan gula jawa sebelum dikukus. Setelah matang, makanan ini disajikan bersama parutan kelapa dan serundeng.',
  },

  {
    title:
      'Pecel Gablok',

    category:
      'Kuliner Tradisional',

    imageUrl:
      null,

    icon:
      UtensilsCrossed,

    description:
      'Gablok merupakan makanan berbahan dasar beras dengan bentuk yang menyerupai lontong. Gablok biasanya disajikan bersama pecel berupa rebusan sayuran, sambal kacang, dan gorengan.',
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function BudayaTradisiPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-emerald-950 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('/background.png')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/90 to-emerald-800/55" />

        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',

            backgroundSize:
              '28px 28px',
          }}
        />

        <div className="relative mx-auto flex min-h-[540px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <Landmark size={27} />
            </div>

            <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-300">
              Warisan Desa Keji
            </p>

            <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Budaya dan Tradisi

              <span className="block text-emerald-300">
                Desa Keji
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-sm font-medium leading-8 text-emerald-50/85 sm:text-base">
              Tradisi, kesenian, dan
              kuliner masyarakat
              menjadi bagian dari
              identitas Desa Keji yang
              masih terus dijaga dan
              diperkenalkan kepada
              generasi berikutnya.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/desa-wisata/agenda"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-sm font-extrabold text-emerald-950"
              >
                <Sparkles size={17} />

                Lihat Agenda Budaya
              </Link>

              <Link
                href="/desa-wisata/galeri"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-extrabold"
              >
                <Camera size={17} />

                Lihat Galeri
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="relative z-10 -mt-12 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-gradient-to-br from-emerald-900 to-teal-700 p-8 text-white">
              <BookOpen
                size={30}
                className="text-emerald-300"
              />

              <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-300">
                Identitas Desa
              </p>

              <h2 className="mt-3 text-2xl font-black">
                Budaya yang tumbuh
                bersama masyarakat
              </h2>

              <p className="mt-4 text-sm font-medium leading-7 text-emerald-50/80">
                Budaya Desa Keji
                tercermin melalui
                tradisi, kesenian,
                kuliner, dan kegiatan
                masyarakat yang masih
                dilaksanakan hingga
                sekarang.
              </p>
            </div>

            <div className="grid gap-px bg-slate-100 sm:grid-cols-3">
              <SummaryCard
                value="2"
                label="Tradisi"
              />

              <SummaryCard
                value="3"
                label="Kesenian"
              />

              <SummaryCard
                value="2"
                label="Kuliner Lokal"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TRADISI
      ===================================================== */}

      <CultureSection
        eyebrow="Potensi Budaya"
        title="Tradisi masyarakat Desa Keji"
        description="Beberapa tradisi tetap dilaksanakan dan menjadi bagian dari kehidupan sosial serta budaya masyarakat."
        items={tradisi}
      />

      {/* =====================================================
          IRIBAN FEATURE + FOTO BESAR
      ===================================================== */}

      <section className="bg-slate-900 py-24 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8">
          <WisataImage
            src={
              tradisi[0].imageUrl
            }
            alt="Iriban Banyu Kemloso"
            dark
          />

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-400">
              Tradisi Tahunan
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Iriban Banyu Kemloso
            </h2>

            <p className="mt-5 text-sm font-medium leading-8 text-slate-300 sm:text-base">
              Iriban Banyu Kemloso
              dilaksanakan setiap tahun
              pada bulan Agustus,
              tepatnya pada Sabtu
              Pahing. Menjelang
              pelaksanaan ritual,
              masyarakat membersihkan
              area di sekitar sumber
              mata air.
            </p>

            <p className="mt-4 text-sm font-medium leading-8 text-slate-300 sm:text-base">
              Kegiatan kemudian
              dilaksanakan dengan
              rangkaian tradisi dan
              kirab sesaji menuju
              sumber air. Bagi
              masyarakat, kegiatan ini
              merupakan wujud rasa
              syukur sekaligus bagian
              dari upaya pelestarian
              Sumber Mata Air Kemloso.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <InfoDark
                title="Waktu"
                description="Agustus · Sabtu Pahing"
              />

              <InfoDark
                title="Lokasi"
                description="Mata Air Kemloso, Dusun Suruhan"
              />

              <InfoDark
                title="Makna"
                description="Rasa syukur dan pelestarian sumber air"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          KESENIAN
      ===================================================== */}

      <CultureSection
        eyebrow="Potensi Kesenian"
        title="Kesenian yang masih dilestarikan"
        description="Kesenian Desa Keji menjadi bagian dari upaya menjaga warisan budaya dan memperkenalkannya kepada generasi muda."
        items={kesenian}
        gray
      />

      {/* =====================================================
          SANGGAR + FOTO
      ===================================================== */}

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-sm lg:grid-cols-[420px_minmax(0,1fr)]">
            <WisataImage
              src={null}
              alt="Sanggar Tari Budi Utomo"
              ratioClass="min-h-[340px]"
            />

            <div className="p-7 sm:p-9">
              <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-700">
                Pelestarian Seni Tari
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Sanggar Tari Budi Utomo
              </h2>

              <p className="mt-4 max-w-4xl text-sm font-medium leading-8 text-slate-500">
                Sanggar Tari Budi Utomo
                menjadi pusat
                pelestarian seni tari
                di Desa Keji. Tempat
                ini digunakan untuk
                melatih generasi muda
                sekaligus menjadi ruang
                pertunjukan kesenian
                yang dapat
                memperkenalkan seni
                tari tradisional Desa
                Keji kepada pengunjung.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          KULINER + FOTO
      ===================================================== */}

      <CultureSection
        eyebrow="Potensi Kuliner"
        title="Kuliner lokal Desa Keji"
        description="Kuliner tradisional menjadi bagian lain dari kekayaan budaya yang tumbuh dalam kehidupan masyarakat."
        items={kuliner}
      />

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-8 text-white sm:p-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
              Jelajahi Desa Keji
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Kenali budaya melalui
              pengalaman langsung
            </h2>

            <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-emerald-50/80">
              Temukan agenda kegiatan,
              kuliner, dan berbagai
              potensi lain yang menjadi
              bagian dari Desa Wisata
              Keji.
            </p>

            <Link
              href="/desa-wisata/agenda"
              className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-extrabold text-emerald-900"
            >
              Lihat Agenda Wisata

              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   CULTURE SECTION
========================================================= */

function CultureSection({
  eyebrow,
  title,
  description,
  items,
  gray = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: CultureItem[];
  gray?: boolean;
}) {
  return (
    <section
      className={`py-24 ${
        gray
          ? 'bg-slate-100'
          : 'bg-slate-50'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">
            {eyebrow}
          </p>

          <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
            {title}
          </h2>

          <p className="mt-4 text-sm font-medium leading-7 text-slate-500 sm:text-base">
            {description}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map(
            (item) => (
              <CultureCard
                key={item.title}
                item={item}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CULTURE CARD
========================================================= */

function CultureCard({
  item,
}: {
  item: CultureItem;
}) {
  const Icon =
    item.icon;

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl">
      <WisataImage
        src={item.imageUrl}
        alt={item.title}
      />

      <div className="p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <Icon size={21} />
        </div>

        <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">
          {item.category}
        </p>

        <h3 className="mt-2 text-xl font-black text-slate-900">
          {item.title}
        </h3>

        <p className="mt-3 text-sm font-medium leading-7 text-slate-500">
          {item.description}
        </p>
      </div>
    </article>
  );
}

/* =========================================================
   IMAGE
========================================================= */

function WisataImage({
  src,
  alt,
  ratioClass =
    'aspect-[16/10]',
  dark = false,
}: {
  src: string | null;
  alt: string;
  ratioClass?: string;
  dark?: boolean;
}) {
  if (src) {
    return (
      <div
        className={`overflow-hidden ${ratioClass}`}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex ${ratioClass} items-center justify-center ${
        dark
          ? 'rounded-3xl border border-white/10 bg-white/[0.05]'
          : 'bg-gradient-to-br from-emerald-50 to-white'
      }`}
    >
      <div className="p-6 text-center">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
            dark
              ? 'bg-emerald-400/15 text-emerald-300'
              : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          <Camera size={25} />
        </div>

        <p
          className={`mt-4 text-xs font-extrabold ${
            dark
              ? 'text-slate-300'
              : 'text-emerald-800'
          }`}
        >
          Foto {alt}
        </p>

        <p className="mt-1 text-[10px] font-medium text-slate-400">
          Dapat ditambahkan melalui
          admin
        </p>
      </div>
    </div>
  );
}

function SummaryCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="flex min-h-[180px] flex-col justify-center bg-white p-7">
      <p className="text-3xl font-black text-emerald-800">
        {value}
      </p>

      <p className="mt-2 text-sm font-extrabold text-slate-700">
        {label}
      </p>
    </div>
  );
}

function InfoDark({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
      <p className="text-xs font-black text-emerald-300">
        {title}
      </p>

      <p className="mt-2 text-xs font-medium leading-5 text-slate-300">
        {description}
      </p>
    </div>
  );
}