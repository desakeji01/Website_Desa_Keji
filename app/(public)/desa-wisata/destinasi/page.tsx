// app/(public)/desa-wisata/destinasi/page.tsx

import type { Metadata } from 'next';

import Link from 'next/link';

import {
  ArrowRight,
  Camera,
  Compass,
  HeartHandshake,
  Landmark,
  Leaf,
  MapPin,
  Route,
  Sparkles,
  Store,
  TreePine,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';

/* =========================================================
   METADATA
========================================================= */

export const metadata: Metadata = {
  title:
    'Destinasi dan Potensi Desa Wisata Keji | SIJI',

  description:
    'Jelajahi potensi alam, budaya, kesenian, kuliner, UMKM, dan destinasi wisata Desa Keji.',
};

/* =========================================================
   TYPES
========================================================= */

interface DestinasiItem {
  title: string;
  category: string;
  location?: string;
  description: string;
  imageUrl: string | null;
  icon: LucideIcon;
}

interface PotensiItem {
  title: string;
  description: string;
  imageUrl: string | null;
  icon: LucideIcon;
}

/* =========================================================
   DESTINASI UTAMA

   imageUrl sementara null.
   Nanti dari admin → database → gambar_url.
========================================================= */

const destinasiUtama: DestinasiItem[] = [
  {
    title:
      'Sumber Mata Air Kemloso',

    category:
      'Potensi Alam',

    location:
      'Dusun Suruhan',

    imageUrl:
      null,

    icon:
      TreePine,

    description:
      'Sumber Mata Air Kemloso merupakan salah satu sumber mata air penting di Desa Keji. Air dari sumber ini dimanfaatkan masyarakat sebagai jaringan air bersih untuk memenuhi kebutuhan sehari-hari. Air ditampung terlebih dahulu sebelum dialirkan melalui jaringan pipa ke masyarakat.',
  },

  {
    title:
      'DWK Wono Sesaji',

    category:
      'Wisata Budaya',

    imageUrl:
      null,

    icon:
      Landmark,

    description:
      'DWK Wono Sesaji merupakan kawasan yang memiliki nilai budaya dan menjadi salah satu ikon kebudayaan Desa Wisata Keji. Kawasan ini digunakan untuk berbagai kegiatan seni tradisional masyarakat, salah satunya kesenian Kuda Debog.',
  },

  {
    title:
      'Sanggar Tari Budi Utomo',

    category:
      'Wisata Edukasi & Seni',

    imageUrl:
      null,

    icon:
      Sparkles,

    description:
      'Sanggar Tari Budi Utomo menjadi salah satu ruang pelestarian seni tari di Desa Keji. Sanggar ini menjadi tempat generasi muda berlatih tari sekaligus memperkenalkan kesenian tradisional Desa Keji kepada masyarakat dan pengunjung.',
  },
];

/* =========================================================
   POTENSI PENDUKUNG
========================================================= */

const potensiPendukung: PotensiItem[] = [
  {
    title:
      'Budaya dan Tradisi',

    description:
      'Desa Keji memiliki tradisi yang masih dijaga masyarakat, di antaranya Iriban Banyu Kemloso dan peringatan Maulid Nabi.',

    imageUrl:
      null,

    icon:
      Landmark,
  },

  {
    title:
      'Kesenian Desa',

    description:
      'Kesenian yang masih dilestarikan antara lain Gamelan, Kuda Debog, dan Kuda Lumping sebagai bagian dari identitas budaya Desa Keji.',

    imageUrl:
      null,

    icon:
      Sparkles,
  },

  {
    title:
      'Kuliner Tradisional',

    description:
      'Tetek Melek dan Pecel Gablok menjadi bagian dari kekayaan kuliner lokal yang dapat diperkenalkan sebagai identitas khas Desa Keji.',

    imageUrl:
      null,

    icon:
      UtensilsCrossed,
  },

  {
    title:
      'UMKM Masyarakat',

    description:
      'Desa Keji memiliki berbagai pelaku UMKM, antara lain usaha aneka keripik serta pengolahan susu sapi perah yang dipasarkan hingga luar wilayah desa.',

    imageUrl:
      null,

    icon:
      Store,
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function DestinasiWisataPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative isolate overflow-hidden bg-emerald-950 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('/background.png')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/90 to-emerald-800/55" />

        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-black/10" />

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

        <div className="pointer-events-none absolute -right-32 -top-32 h-[430px] w-[430px] rounded-full border-[72px] border-white/[0.04]" />

        <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur">
              <Compass size={27} />
            </div>

            <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-300">
              Desa Wisata Keji
            </p>

            <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Destinasi dan Potensi

              <span className="block text-emerald-300">
                Desa Keji
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-sm font-medium leading-8 text-emerald-50/85 sm:text-base">
              Desa Keji memiliki
              potensi alam, budaya,
              kesenian, kuliner, serta
              kegiatan masyarakat yang
              dapat dikembangkan sebagai
              bagian dari pengalaman
              Desa Wisata Keji.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/desa-wisata/informasi-kunjungan"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-sm font-extrabold text-emerald-950 transition hover:bg-emerald-300"
              >
                <Route size={17} />

                Informasi Kunjungan
              </Link>

              <Link
                href="/desa-wisata/galeri"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-extrabold text-white transition hover:bg-white/15"
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

      <section className="relative z-10 -mt-14 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-2xl shadow-slate-900/[0.08]">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 p-7 text-white sm:p-9">
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
                  <Leaf
                    size={30}
                    className="text-emerald-300"
                  />

                  <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-300">
                    Potensi Desa
                  </p>

                  <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
                    Alam dan budaya
                    menjadi bagian dari
                    kehidupan masyarakat
                  </h2>

                  <p className="mt-5 text-sm font-medium leading-7 text-emerald-50/80">
                    Berada di kawasan
                    lereng Gunung
                    Ungaran, Desa Keji
                    memiliki lingkungan
                    alam yang berpadu
                    dengan budaya dan
                    kehidupan masyarakat.
                  </p>
                </div>
              </div>

              <div className="grid gap-px bg-slate-100 sm:grid-cols-3">
                <HighlightCard
                  icon={TreePine}
                  title="Potensi Alam"
                  text="Sumber Mata Air Kemloso"
                />

                <HighlightCard
                  icon={Landmark}
                  title="Potensi Budaya"
                  text="DWK Wono Sesaji"
                />

                <HighlightCard
                  icon={Sparkles}
                  title="Potensi Seni"
                  text="Sanggar Tari Budi Utomo"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          DESTINASI + FOTO
      ===================================================== */}

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Daya Tarik Desa"
            title="Potensi wisata alam dan budaya Desa Keji"
            description="Beberapa lokasi dan ruang budaya memiliki peran penting dalam kehidupan masyarakat sekaligus berpotensi menjadi daya tarik wisata."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {destinasiUtama.map(
              (
                item,
                index
              ) => (
                <DestinasiCard
                  key={item.title}
                  item={item}
                  index={index}
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          KEMLOSO FEATURE + FOTO BESAR
      ===================================================== */}

      <section className="bg-slate-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <WisataImage
              src={
                destinasiUtama[0]
                  .imageUrl
              }
              alt="Sumber Mata Air Kemloso"
              ratioClass="aspect-[4/3]"
              dark
            />

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-400">
                Potensi Alam
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                Sumber Mata Air Kemloso
              </h2>

              <p className="mt-5 text-sm font-medium leading-8 text-slate-300 sm:text-base">
                Sumber Mata Air Kemloso
                berada di Dusun Suruhan
                dan digunakan masyarakat
                Desa Keji sebagai sumber
                air bersih. Air
                ditampung kemudian
                dialirkan menggunakan
                jaringan pipa untuk
                memenuhi kebutuhan
                sehari-hari warga.
              </p>

              <p className="mt-4 text-sm font-medium leading-8 text-slate-300 sm:text-base">
                Lingkungan di sekitar
                sumber mata air
                dikelilingi pepohonan
                dan kawasan persawahan.
                Sumber ini juga memiliki
                hubungan erat dengan
                tradisi Iriban Banyu
                Kemloso.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <SmallInfo
                  title="Lokasi"
                  value="Dusun Suruhan"
                />

                <SmallInfo
                  title="Fungsi"
                  value="Sumber Air Bersih"
                />
              </div>

              <Link
                href="/desa-wisata/budaya-tradisi"
                className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-emerald-400 transition hover:text-emerald-300"
              >
                Mengenal Iriban Banyu
                Kemloso

                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          POTENSI PENDUKUNG + FOTO
      ===================================================== */}

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Potensi Pendukung"
            title="Potensi yang saling melengkapi"
            description="Budaya, kesenian, kuliner, dan kegiatan ekonomi masyarakat mendukung pengembangan Desa Wisata Keji secara terpadu."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {potensiPendukung.map(
              (item) => (
                <PotensiCard
                  key={item.title}
                  item={item}
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-7 text-white shadow-xl sm:p-9 lg:p-12">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',

                backgroundSize:
                  '26px 26px',
              }}
            />

            <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
                  Jelajahi Desa Keji
                </p>

                <h2 className="mt-3 text-3xl font-black">
                  Kenali potensi Desa
                  Keji lebih dekat
                </h2>

                <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-emerald-50/80">
                  Temukan budaya,
                  kuliner, kegiatan,
                  dan pengalaman yang
                  menjadi bagian dari
                  Desa Wisata Keji.
                </p>
              </div>

              <Link
                href="/desa-wisata/paket-wisata"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-extrabold text-emerald-900"
              >
                Lihat Paket Wisata

                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

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
    <div className="max-w-4xl">
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>

      <p className="mt-4 text-sm font-medium leading-7 text-slate-500 sm:text-base">
        {description}
      </p>
    </div>
  );
}

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
        className={`relative overflow-hidden rounded-3xl ${ratioClass}`}
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
      className={`flex ${ratioClass} items-center justify-center overflow-hidden rounded-3xl border ${
        dark
          ? 'border-white/10 bg-white/[0.05]'
          : 'border-emerald-100 bg-gradient-to-br from-emerald-50 to-white'
      }`}
    >
      <div className="px-6 text-center">
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

        <p
          className={`mt-1 text-[10px] font-medium ${
            dark
              ? 'text-slate-500'
              : 'text-slate-400'
          }`}
        >
          Dapat ditambahkan melalui
          halaman admin
        </p>
      </div>
    </div>
  );
}

function DestinasiCard({
  item,
  index,
}: {
  item: DestinasiItem;
  index: number;
}) {
  const Icon =
    item.icon;

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl">
      <WisataImage
        src={item.imageUrl}
        alt={item.title}
        ratioClass="aspect-[16/10]"
      />

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Icon size={21} />
          </div>

          <span className="text-xs font-black text-slate-300">
            {String(
              index + 1
            ).padStart(
              2,
              '0'
            )}
          </span>
        </div>

        <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">
          {item.category}
        </p>

        <h3 className="mt-2 text-xl font-black text-slate-900">
          {item.title}
        </h3>

        {item.location && (
          <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-700">
            <MapPin size={14} />

            {item.location}
          </div>
        )}

        <p className="mt-4 text-sm font-medium leading-7 text-slate-500">
          {item.description}
        </p>
      </div>
    </article>
  );
}

function PotensiCard({
  item,
}: {
  item: PotensiItem;
}) {
  const Icon =
    item.icon;

  return (
    <article className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
      <div className="grid sm:grid-cols-[180px_minmax(0,1fr)]">
        <WisataImage
          src={item.imageUrl}
          alt={item.title}
          ratioClass="min-h-[180px]"
        />

        <div className="p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Icon size={21} />
          </div>

          <h3 className="mt-4 text-lg font-black text-slate-900">
            {item.title}
          </h3>

          <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
            {item.description}
          </p>
        </div>
      </div>
    </article>
  );
}

function HighlightCard({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <article className="bg-white p-6 transition hover:bg-emerald-50 sm:p-7">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
        <Icon size={21} />
      </div>

      <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">
        {title}
      </p>

      <h3 className="mt-2 font-black text-slate-900">
        {text}
      </h3>
    </article>
  );
}

function SmallInfo({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
      <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
        {title}
      </p>

      <p className="mt-1 text-sm font-bold text-white">
        {value}
      </p>
    </div>
  );
}