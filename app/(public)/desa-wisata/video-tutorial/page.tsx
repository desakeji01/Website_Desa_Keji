// app/(public)/desa-wisata/video-tutorial/page.tsx

import type {
  Metadata,
} from 'next';

import Link from 'next/link';

import {
  ArrowLeft,
  ExternalLink,
  Film,
  Leaf,
  PlayCircle,
  ShieldCheck,
} from 'lucide-react';

import { supabaseAdmin } from '@/lib/supabase-admin';

export const metadata: Metadata = {
  title:
    'Video Tutorial Desa Wisata Keji | SIJI',

  description:
    'Kumpulan video tutorial, panduan, dan edukasi untuk mendukung pengembangan Desa Wisata Keji.',
};

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

interface VideoTutorialPublik {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: string;
  youtube_url: string;
  youtube_id: string;
  urutan: number;
  created_at: string;
}

function safeString(
  value: unknown
) {
  return String(
    value ?? ''
  ).trim();
}

function isValidYoutubeId(
  value: string
) {
  return /^[A-Za-z0-9_-]{11}$/.test(
    value
  );
}

function normalizeVideo(
  value: unknown
): VideoTutorialPublik | null {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return null;
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  const id =
    safeString(row.id);

  const judul =
    safeString(row.judul);

  const deskripsi =
    safeString(
      row.deskripsi
    );

  const kategori =
    safeString(
      row.kategori
    );

  const youtubeUrl =
    safeString(
      row.youtube_url
    );

  const youtubeId =
    safeString(
      row.youtube_id
    );

  const urutan =
    Number(
      row.urutan ?? 0
    );

  if (
    !id ||
    !judul ||
    !deskripsi ||
    !kategori ||
    !youtubeUrl ||
    !isValidYoutubeId(
      youtubeId
    ) ||
    !Number.isInteger(
      urutan
    )
  ) {
    return null;
  }

  return {
    id,
    judul,
    deskripsi,
    kategori,

    youtube_url:
      youtubeUrl,

    youtube_id:
      youtubeId,

    urutan,

    created_at:
      safeString(
        row.created_at
      ),
  };
}

function getThumbnailUrl(
  youtubeId: string
) {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

async function getVideoTutorial():
  Promise<VideoTutorialPublik[]> {
  const { data, error } =
    await supabaseAdmin
      .from(
        'desa_wisata_video'
      )
      .select(`
        id,
        judul,
        deskripsi,
        kategori,
        youtube_url,
        youtube_id,
        urutan,
        created_at
      `)
      .eq('aktif', true)
      .order('urutan', {
        ascending: true,
      })
      .order('created_at', {
        ascending: false,
      });

  if (error) {
    console.error(
      'Gagal mengambil video tutorial Desa Wisata:',
      {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }
    );

    return [];
  }

  return (
    data ?? []
  )
    .map(normalizeVideo)
    .filter(
      (
        item
      ): item is VideoTutorialPublik =>
        item !== null
    );
}

export default async function VideoTutorialPage() {
  const daftarVideo =
    await getVideoTutorial();

  const jumlahKategori =
    new Set(
      daftarVideo.map(
        (item) =>
          item.kategori
            .trim()
            .toLowerCase()
      )
    ).size;

  return (
    <div className="min-h-screen overflow-x-clip bg-slate-50">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-emerald-950 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/background.png')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#021b16] via-emerald-950/90 to-emerald-900/45" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#021b16] via-transparent to-black/20" />

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

        <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full border-[72px] border-white/[0.035]" />

        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[390px] w-[390px] rounded-full bg-emerald-300/10 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <Link
            href="/desa-wisata"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-100/80 transition hover:text-white"
          >
            <ArrowLeft
              size={15}
            />

            Kembali ke Desa Wisata
          </Link>

          <div className="mt-7 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.17em] text-emerald-100 backdrop-blur sm:text-xs">
                <Leaf size={15} />

                Desa Wisata Keji
              </div>

              <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-300">
                Panduan Visual
              </p>

              <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Video Tutorial
                Desa Wisata
              </h1>

              <p className="mt-5 max-w-3xl text-sm font-medium leading-7 text-emerald-50/85 sm:text-base">
                Kumpulan video panduan,
                edukasi, dan tutorial
                untuk mendukung
                pelayanan, pengelolaan,
                promosi, dan
                pengembangan Desa
                Wisata Keji.
              </p>
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-3">
              <HeroStat
                value={
                  String(
                    daftarVideo.length
                  )
                }
                label="Video Aktif"
              />

              <HeroStat
                value={
                  String(
                    jumlahKategori
                  )
                }
                label="Kategori"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Konten */}
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-700">
              Belajar melalui video
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
              Panduan Desa Wisata
              Keji
            </h2>

            <p className="mt-4 text-sm font-medium leading-7 text-slate-500 sm:text-base">
              Pilih video untuk
              mempelajari informasi,
              pelayanan, pengelolaan,
              dan potensi Desa Wisata
              Keji.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-extrabold text-slate-600 shadow-sm">
            <ShieldCheck
              size={16}
              className="text-emerald-700"
            />

            Video resmi Desa Keji
          </div>
        </div>

        {daftarVideo.length >
        0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {daftarVideo.map(
              (video, index) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  nomor={index + 1}
                />
              )
            )}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <Film
              size={50}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-5 text-xl font-black text-slate-800">
              Video sedang disiapkan
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-7 text-slate-500">
              Video tutorial akan
              ditampilkan setelah
              ditambahkan dan
              dipublikasikan melalui
              halaman administrator.
            </p>
          </div>
        )}
      </main>

      {/* Penutup */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
  <PlayCircle size={20} />
</div>

          <h2 className="mt-6 text-2xl font-black text-slate-900 sm:text-3xl">
            Saksikan panduan lengkap
            melalui YouTube
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-500">
            Seluruh video tetap
            disimpan di YouTube.
            Website Desa Keji
            menyediakan akses yang
            lebih terstruktur dan mudah
            ditemukan.
          </p>

          <Link
            href="/desa-wisata"
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800"
          >
            <ArrowLeft size={17} />

            Kembali ke Desa Wisata
          </Link>
        </div>
      </section>
    </div>
  );
}

function VideoCard({
  video,
  nomor,
}: {
  video: VideoTutorialPublik;
  nomor: number;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">
      <a
        href={video.youtube_url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video overflow-hidden bg-slate-900"
        aria-label={`Tonton ${video.judul} di YouTube`}
      >
        <img
          src={getThumbnailUrl(
            video.youtube_id
          )}
          alt={`Thumbnail ${video.judul}`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white shadow-xl backdrop-blur transition duration-300 group-hover:scale-110 group-hover:bg-red-600">
            <PlayCircle
              size={34}
            />
          </span>
        </div>

        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold text-emerald-700 shadow-sm">
          {video.kategori}
        </span>

        <span className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-black text-white backdrop-blur">
          {String(nomor).padStart(
            2,
            '0'
          )}
        </span>
      </a>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <PlayCircle size={20} />
          </div>

          <h3 className="min-w-0 flex-1 text-lg font-black leading-7 text-slate-900 transition group-hover:text-emerald-800">
            {video.judul}
          </h3>
        </div>

        <p className="mt-4 flex-1 text-sm font-medium leading-7 text-slate-500">
          {video.deskripsi}
        </p>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <a
            href={video.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-extrabold text-white transition hover:bg-red-700"
          >
            <PlayCircle size={17} />

            Tonton di YouTube

            <ExternalLink
              size={14}
            />
          </a>
        </div>
      </div>
    </article>
  );
}

function HeroStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <article className="min-w-28 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
      <p className="text-2xl font-black text-white">
        {value}
      </p>

      <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.13em] text-emerald-200">
        {label}
      </p>
    </article>
  );
}