// app/(public)/desa-wisata/agenda/page.tsx

import type { Metadata } from 'next';

import Link from 'next/link';

import {
  ArrowRight,
  CalendarDays,
  Camera,
  Clock3,
  HeartHandshake,
  Info,
  Landmark,
  MapPin,
  Sparkles,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';

export const metadata: Metadata = {
  title:
    'Agenda Wisata Desa Keji | SIJI',

  description:
    'Informasi agenda budaya, tradisi, dan kegiatan kesenian Desa Wisata Keji.',
};

/* =========================================================
   TYPES
========================================================= */

interface AgendaItem {
  title: string;
  category: string;
  schedule: string;
  location?: string;
  description: string;
  imageUrl: string | null;
  icon: LucideIcon;
}

/* =========================================================
   DATA

   imageUrl null dulu.
   Nanti admin mengisi gambar_url.
========================================================= */

const agendaDesa: AgendaItem[] = [
  {
    title:
      'Iriban Banyu Kemloso',

    category:
      'Tradisi Tahunan',

    schedule:
      'Agustus · Sabtu Pahing',

    location:
      'Sumber Mata Air Kemloso, Dusun Suruhan',

    imageUrl:
      null,

    icon:
      HeartHandshake,

    description:
      'Tradisi tahunan sebagai bentuk rasa syukur masyarakat atas keberadaan sumber air sekaligus upaya menjaga kelestarian Sumber Mata Air Kemloso. Kegiatan diawali dengan pembersihan kawasan sumber dan dilanjutkan rangkaian tradisi serta kirab sesaji.',
  },

  {
    title:
      'Peringatan Maulid Nabi',

    category:
      'Budaya & Keagamaan',

    schedule:
      'Menyesuaikan agenda masyarakat',

    imageUrl:
      null,

    icon:
      Landmark,

    description:
      'Peringatan Maulid Nabi menjadi salah satu kegiatan budaya dan keagamaan yang masih dilaksanakan oleh masyarakat Desa Keji.',
  },

  {
    title:
      'Kesenian Gamelan',

    category:
      'Kesenian Tradisional',

    schedule:
      'Menyesuaikan kegiatan masyarakat',

    imageUrl:
      null,

    icon:
      Sparkles,

    description:
      'Gamelan menjadi salah satu kesenian yang masih terdapat dan dilestarikan oleh masyarakat sebagai bagian dari warisan seni Desa Keji.',
  },

  {
    title:
      'Kesenian Kuda Debog',

    category:
      'Kesenian Tradisional',

    schedule:
      'Menyesuaikan kegiatan budaya',

    location:
      'Desa Keji / DWK Wono Sesaji',

    imageUrl:
      null,

    icon:
      Sparkles,

    description:
      'Kuda Debog merupakan salah satu kesenian tradisional Desa Keji. Kesenian ini juga menjadi bagian dari kegiatan budaya yang dapat berlangsung di kawasan DWK Wono Sesaji.',
  },

  {
    title:
      'Kesenian Kuda Lumping',

    category:
      'Kesenian Tradisional',

    schedule:
      'Menyesuaikan kegiatan masyarakat',

    imageUrl:
      null,

    icon:
      Sparkles,

    description:
      'Kuda Lumping menjadi salah satu bentuk kesenian yang masih ada dan terus dilestarikan oleh masyarakat Desa Keji.',
  },

  {
    title:
      'Kegiatan Sanggar Tari Budi Utomo',

    category:
      'Seni Tari',

    schedule:
      'Menyesuaikan kegiatan sanggar',

    location:
      'Sanggar Tari Budi Utomo',

    imageUrl:
      null,

    icon:
      UsersRound,

    description:
      'Sanggar Tari Budi Utomo menjadi ruang pelestarian seni tari serta tempat generasi muda berlatih dan mempersembahkan pertunjukan kesenian Desa Keji.',
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function AgendaWisataPage() {
  const agendaUtama =
    agendaDesa[0];

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

        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <CalendarDays
                size={27}
              />
            </div>

            <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-300">
              Desa Wisata Keji
            </p>

            <h1 className="mt-3 text-4xl font-black sm:text-5xl lg:text-6xl">
              Agenda Wisata

              <span className="block text-emerald-300">
                Desa Keji
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-sm font-medium leading-8 text-emerald-50/85 sm:text-base">
              Temukan tradisi,
              kegiatan budaya, dan
              kesenian yang menjadi
              bagian dari kehidupan
              masyarakat Desa Keji.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/desa-wisata/budaya-tradisi"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-sm font-extrabold text-emerald-950"
              >
                <Landmark size={17} />

                Budaya & Tradisi
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
          <div className="grid overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-xl lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-gradient-to-br from-emerald-900 to-teal-700 p-8 text-white">
              <Clock3
                size={30}
                className="text-emerald-300"
              />

              <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-300">
                Kalender Budaya
              </p>

              <h2 className="mt-3 text-2xl font-black">
                Kegiatan yang hidup
                bersama masyarakat
              </h2>

              <p className="mt-4 text-sm font-medium leading-7 text-emerald-50/80">
                Sebagian kegiatan
                mengikuti tradisi dan
                agenda masyarakat,
                sehingga jadwal
                pelaksanaan dapat
                menyesuaikan kondisi
                serta penyelenggara.
              </p>
            </div>

            <div className="grid gap-px bg-slate-100 sm:grid-cols-3">
              <MiniInfo
                value="Tahunan"
                label="Iriban Kemloso"
              />

              <MiniInfo
                value="3"
                label="Jenis Kesenian"
              />

              <MiniInfo
                value="Budaya"
                label="Berbasis Masyarakat"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED IRIBAN + FOTO
      ===================================================== */}

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-emerald-950 text-white shadow-xl">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <AgendaImage
                src={
                  agendaUtama.imageUrl
                }
                alt={
                  agendaUtama.title
                }
                featured
              />

              <div className="relative p-7 sm:p-9 lg:p-10">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-[0.1]"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',

                    backgroundSize:
                      '25px 25px',
                  }}
                />

                <div className="relative">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-300">
                    Agenda Utama
                  </p>

                  <h2 className="mt-3 text-3xl font-black">
                    Iriban Banyu Kemloso
                  </h2>

                  <p className="mt-4 text-sm font-medium leading-7 text-emerald-50/75">
                    Tradisi tahunan yang
                    berkaitan erat
                    dengan keberadaan
                    Sumber Mata Air
                    Kemloso serta menjadi
                    wujud rasa syukur
                    masyarakat Desa Keji.
                  </p>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    <FeaturedInfo
                      title="Pelaksanaan"
                      value="Agustus · Sabtu Pahing"
                    />

                    <FeaturedInfo
                      title="Lokasi"
                      value="Dusun Suruhan"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          LIST AGENDA + FOTO
      ===================================================== */}

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">
              Kegiatan Desa
            </p>

            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              Agenda budaya dan
              kesenian Desa Keji
            </h2>

            <p className="mt-4 text-sm font-medium leading-7 text-slate-500">
              Informasi jadwal selain
              Iriban Banyu Kemloso
              menyesuaikan kegiatan
              masyarakat dan
              penyelenggara.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {agendaDesa.map(
              (
                item,
                index
              ) => (
                <AgendaCard
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
          NOTICE
      ===================================================== */}

      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-400">
                Sebelum Datang
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Pastikan jadwal
                kegiatan terlebih
                dahulu
              </h2>

              <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-slate-300">
                Kegiatan masyarakat
                dapat mengalami
                perubahan waktu.
                Wisatawan disarankan
                memeriksa informasi
                terbaru sebelum
                merencanakan
                kunjungan.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
              <Info
                size={24}
                className="text-emerald-300"
              />

              <p className="mt-4 text-sm font-medium leading-7 text-slate-300">
                Informasi agenda,
                tanggal, lokasi, dan
                dokumentasi dapat
                diperbarui melalui
                sistem pengelolaan Desa
                Wisata ketika jadwal
                telah ditetapkan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-8 text-white">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
              Rencanakan Kunjungan
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Temukan pengalaman
              budaya Desa Keji
            </h2>

            <Link
              href="/desa-wisata/informasi-kunjungan"
              className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-extrabold text-emerald-900"
            >
              Informasi Kunjungan

              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   IMAGE
========================================================= */

function AgendaImage({
  src,
  alt,
  featured = false,
}: {
  src: string | null;
  alt: string;
  featured?: boolean;
}) {
  const heightClass =
    featured
      ? 'min-h-[350px] lg:min-h-[430px]'
      : 'aspect-[16/10]';

  if (src) {
    return (
      <div
        className={`overflow-hidden ${heightClass}`}
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
      className={`flex ${heightClass} items-center justify-center bg-gradient-to-br from-emerald-100 via-emerald-50 to-white`}
    >
      <div className="p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-white">
          <Camera size={25} />
        </div>

        <p className="mt-4 text-xs font-extrabold text-emerald-900">
          Foto {alt}
        </p>

        <p className="mt-1 text-[10px] font-medium text-slate-400">
          Foto dapat ditambahkan
          melalui admin
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   AGENDA CARD
========================================================= */

function AgendaCard({
  item,
  index,
}: {
  item: AgendaItem;
  index: number;
}) {
  const Icon =
    item.icon;

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl">
      <AgendaImage
        src={item.imageUrl}
        alt={item.title}
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

        <div className="mt-4 flex items-start gap-2 text-xs font-bold text-emerald-700">
          <CalendarDays
            size={14}
            className="mt-0.5 shrink-0"
          />

          {item.schedule}
        </div>

        {item.location && (
          <div className="mt-2 flex items-start gap-2 text-xs font-semibold text-slate-500">
            <MapPin
              size={14}
              className="mt-0.5 shrink-0"
            />

            {item.location}
          </div>
        )}

        <p className="mt-5 text-sm font-medium leading-7 text-slate-500">
          {item.description}
        </p>
      </div>
    </article>
  );
}

function MiniInfo({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="flex min-h-[170px] flex-col justify-center bg-white p-7">
      <p className="text-2xl font-black text-emerald-800">
        {value}
      </p>

      <p className="mt-2 text-xs font-extrabold text-slate-600">
        {label}
      </p>
    </div>
  );
}

function FeaturedInfo({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-300">
        {title}
      </p>

      <p className="mt-2 text-sm font-black text-white">
        {value}
      </p>
    </div>
  );
}