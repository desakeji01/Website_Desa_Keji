// components/umkm/UmkmVideoTutorialPublic.tsx

import {
  ExternalLink,
  Play,
  PlayCircle,
} from 'lucide-react';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  UmkmVideoTutorial,
} from '@/types/umkm-video';

/* =========================================================
   CONFIG
========================================================= */

const MAX_VIDEO_PUBLIC =
  8;

const YOUTUBE_CHANNEL_URL =
  'https://youtube.com/@kejikknt?si=QQauteO1ifT36f91';

const YOUTUBE_CHANNEL_NAME =
  '@kejikknt';

/* =========================================================
   HELPERS
========================================================= */

function thumbnailUrl(
  youtubeId: string
) {
  return (
    'https://img.youtube.com/vi/' +
    `${youtubeId}/hqdefault.jpg`
  );
}

function safeString(
  value: unknown
) {
  return String(
    value ?? ''
  ).trim();
}

/* =========================================================
   NORMALIZE
========================================================= */

function normalizeVideo(
  value: unknown
):
  | UmkmVideoTutorial
  | null {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(value)
  ) {
    return null;
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  const item:
    UmkmVideoTutorial = {
    id:
      safeString(
        row.id
      ),

    judul:
      safeString(
        row.judul
      ),

    deskripsi:
      safeString(
        row.deskripsi
      ) ||
      null,

    youtube_url:
      safeString(
        row.youtube_url
      ),

    youtube_id:
      safeString(
        row.youtube_id
      ),

    urutan:
      Number(
        row.urutan ??
          0
      ),

    aktif:
      Boolean(
        row.aktif
      ),

    created_at:
      safeString(
        row.created_at
      ),

    updated_at:
      safeString(
        row.updated_at
      ),
  };

  if (
    !item.id ||
    !item.judul ||
    !item.youtube_url ||
    !item.youtube_id
  ) {
    return null;
  }

  return item;
}

/* =========================================================
   COMPONENT
========================================================= */

export default async function UmkmVideoTutorialPublic() {
  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from(
        'umkm_video_tutorial'
      )
      .select(`
        id,
        judul,
        deskripsi,
        youtube_url,
        youtube_id,
        urutan,
        aktif,
        created_at,
        updated_at
      `)
      .eq(
        'aktif',
        true
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
            true,
        }
      )
      .limit(
        MAX_VIDEO_PUBLIC
      );

  if (error) {
    console.error(
      'Gagal mengambil video tutorial UMKM:',
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
  }

  const videos =
    (
      data ??
      []
    )
      .map(
        normalizeVideo
      )
      .filter(
        (
          item
        ): item is UmkmVideoTutorial =>
          item !== null
      );

  return (
    <section
      id="video-tutorial-umkm"
      className="border-t border-emerald-100 bg-gradient-to-b from-emerald-50/60 via-white to-white py-14 sm:py-16"
    >
      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">
        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">
              <Play
                size={14}
                fill="currentColor"
              />

              Video & Edukasi
            </div>

            <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
              Belajar Mengembangkan
              UMKM
            </h2>

            <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-slate-500">
              Akses video panduan,
              edukasi, dan publikasi
              untuk membantu pelaku
              usaha memasarkan,
              mengelola, serta
              mengembangkan produk
              UMKM secara digital.
            </p>
          </div>

          <a
            href={
              YOUTUBE_CHANNEL_URL
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-extrabold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-red-700"
          >
            <PlayCircle
              size={18}
            />

            Kunjungi{' '}
            {
              YOUTUBE_CHANNEL_NAME
            }

            <ExternalLink
              size={14}
            />
          </a>
        </div>

        {/* ===================================================
            CHANNEL CARD
        =================================================== */}

        <div className="relative mt-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-6 text-white shadow-xl sm:p-8">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,.7) 1px, transparent 1px)',

              backgroundSize:
                '25px 25px',
            }}
          />

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[50px] border-white/[0.05]" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-red-600 shadow-lg">
                <PlayCircle
                  size={29}
                />
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-emerald-200">
                  Channel YouTube
                </p>

                <h3 className="mt-2 text-xl font-black sm:text-2xl">
                  KKN-T Desa Keji
                </h3>

                <p className="mt-1 text-sm font-bold text-emerald-200">
                  {
                    YOUTUBE_CHANNEL_NAME
                  }
                </p>

                <p className="mt-3 max-w-2xl text-xs font-medium leading-6 text-emerald-50/75 sm:text-sm">
                  Temukan video
                  tutorial, publikasi,
                  dokumentasi, dan
                  konten lainnya
                  melalui channel
                  YouTube KKN-T Desa
                  Keji.
                </p>
              </div>
            </div>

            <a
              href={
                YOUTUBE_CHANNEL_URL
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-extrabold text-emerald-900 transition hover:bg-emerald-50"
            >
              <PlayCircle
                size={17}
              />

              Buka Channel

              <ExternalLink
                size={14}
              />
            </a>
          </div>
        </div>

        {/* ===================================================
            VIDEO TUTORIAL
        =================================================== */}

        {videos.length > 0 ? (
          <>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                  Video Pilihan
                </p>

                <h3 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
                  Tutorial UMKM
                </h3>

                <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
                  Video berikut
                  dipilih untuk
                  ditampilkan langsung
                  pada halaman UMKM.
                </p>
              </div>

              <span className="inline-flex w-fit rounded-full bg-white px-4 py-2 text-xs font-extrabold text-slate-500 shadow-sm ring-1 ring-slate-200">
                {videos.length}{' '}
                video ditampilkan
              </span>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videos.map(
                (
                  video,
                  index
                ) => (
                  <a
                    key={
                      video.id
                    }
                    href={
                      video.youtube_url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                  >
                    {/* THUMBNAIL */}

                    <div className="relative aspect-video overflow-hidden bg-slate-900">
                      <img
                        src={thumbnailUrl(
                          video.youtube_id
                        )}
                        alt={
                          video.judul
                        }
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/30" />

                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-xl transition duration-300 group-hover:scale-110">
                          <Play
                            size={23}
                            fill="currentColor"
                          />
                        </span>
                      </div>

                      <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-extrabold text-white backdrop-blur">
                        Video{' '}
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          '0'
                        )}
                      </span>

                      <span className="absolute bottom-3 right-3 rounded-lg bg-red-600 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow">
                        YouTube
                      </span>
                    </div>

                    {/* CONTENT */}

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-base font-black leading-6 text-slate-900 transition group-hover:text-emerald-700">
                        {
                          video.judul
                        }
                      </h3>

                      {video.deskripsi ? (
                        <p className="mt-2 line-clamp-3 flex-1 text-sm font-medium leading-6 text-slate-500">
                          {
                            video.deskripsi
                          }
                        </p>
                      ) : (
                        <div className="flex-1" />
                      )}

                      <div className="mt-5 border-t border-slate-200 pt-4">
                        <span className="inline-flex items-center gap-2 text-xs font-extrabold text-emerald-700">
                          Tonton di YouTube

                          <ExternalLink
                            size={13}
                          />
                        </span>
                      </div>
                    </div>
                  </a>
                )
              )}
            </div>

            <div className="mt-8 flex justify-center">
              <a
                href={
                  YOUTUBE_CHANNEL_URL
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-700 shadow-sm transition hover:border-red-200 hover:text-red-600"
              >
                <PlayCircle
                  size={17}
                />

                Lihat Semua Video di
                YouTube

                <ExternalLink
                  size={13}
                />
              </a>
            </div>
          </>
        ) : (
          /* =================================================
             BELUM ADA VIDEO
          ================================================= */

          <div className="mt-8 rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/60 px-6 py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm">
              <PlayCircle
                size={28}
              />
            </div>

            <h3 className="mt-4 text-lg font-black text-slate-800">
              Video pilihan sedang
              disiapkan
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-7 text-slate-500">
              Untuk sementara,
              seluruh video dapat
              dilihat langsung melalui
              channel YouTube KKN-T
              Desa Keji.
            </p>

            <a
              href={
                YOUTUBE_CHANNEL_URL
              }
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-extrabold text-white transition hover:bg-red-700"
            >
              <PlayCircle
                size={17}
              />

              Buka{' '}
              {
                YOUTUBE_CHANNEL_NAME
              }

              <ExternalLink
                size={13}
              />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}