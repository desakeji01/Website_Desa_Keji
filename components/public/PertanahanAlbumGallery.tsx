// components/public/PertanahanAlbumGallery.tsx

'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  ArrowLeft,
  ArrowRight,
  FolderOpen,
  Image as ImageIcon,
  X,
} from 'lucide-react';

import type {
  PertanahanAlbumWithFotos,
} from '@/types/pertanahan';

interface Props {
  albums:
    PertanahanAlbumWithFotos[];
}

/* =========================================================
   COMPONENT
========================================================= */

export default function PertanahanAlbumGallery({
  albums,
}: Props) {
  const [
    activeAlbumId,
    setActiveAlbumId,
  ] =
    useState<string | null>(
      null
    );

  const [
    photoIndex,
    setPhotoIndex,
  ] =
    useState(
      0
    );

  const activeAlbum =
    albums.find(
      (
        album
      ) =>
        album.id ===
        activeAlbumId
    ) ??
    null;

  const activePhoto =
    activeAlbum
      ?.fotos[
        photoIndex
      ] ??
    null;

  function openAlbum(
    id:
      string
  ) {
    setActiveAlbumId(
      id
    );

    setPhotoIndex(
      0
    );
  }

  function closeAlbum() {
    setActiveAlbumId(
      null
    );

    setPhotoIndex(
      0
    );
  }

  function previousPhoto() {
    if (
      !activeAlbum ||
      activeAlbum.fotos.length ===
        0
    ) {
      return;
    }

    setPhotoIndex(
      (
        current
      ) =>
        current ===
        0
          ? activeAlbum
              .fotos
              .length -
            1
          : current -
            1
    );
  }

  function nextPhoto() {
    if (
      !activeAlbum ||
      activeAlbum.fotos.length ===
        0
    ) {
      return;
    }

    setPhotoIndex(
      (
        current
      ) =>
        current ===
        activeAlbum
          .fotos
          .length -
          1
          ? 0
          : current +
            1
    );
  }

  useEffect(
    () => {
      if (
        !activeAlbum
      ) {
        return;
      }

      const oldOverflow =
        document.body.style
          .overflow;

      document.body.style
        .overflow =
        'hidden';

      function handleKeyDown(
        event:
          KeyboardEvent
      ) {
        if (
          event.key ===
          'Escape'
        ) {
          closeAlbum();
        }

        if (
          event.key ===
          'ArrowLeft'
        ) {
          previousPhoto();
        }

        if (
          event.key ===
          'ArrowRight'
        ) {
          nextPhoto();
        }
      }

      window.addEventListener(
        'keydown',
        handleKeyDown
      );

      return () => {
        document.body.style
          .overflow =
          oldOverflow;

        window.removeEventListener(
          'keydown',
          handleKeyDown
        );
      };
    },
    [
      activeAlbum,
      photoIndex,
    ]
  );

  if (
    albums.length ===
    0
  ) {
    return (
      <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/50 px-6 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
          <FolderOpen
            size={29}
          />
        </div>

        <h3 className="mt-5 text-lg font-black text-slate-800">
          Album Pertanahan belum
          tersedia
        </h3>

        <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-7 text-slate-500">
          Dokumentasi pertanahan
          akan ditampilkan setelah
          administrator
          mempublikasikan album.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* =====================================================
          ALBUM GRID
      ===================================================== */}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map(
          (
            album
          ) => {
            const cover =
              album.fotos[0] ??
              null;

            return (
              <button
                key={
                  album.id
                }
                type="button"
                onClick={() =>
                  openAlbum(
                    album.id
                  )
                }
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl"
              >
                {/* COVER */}

                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {cover ? (
                    <img
                      src={
                        cover.foto_url
                      }
                      alt={
                        album.judul
                      }
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-300">
                      <ImageIcon
                        size={42}
                      />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                  <span className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-extrabold text-white backdrop-blur">
                    {album.fotos.length}{' '}
                    Foto
                  </span>
                </div>

                {/* CONTENT */}

                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    {album.tahun && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-emerald-700">
                        {
                          album.tahun
                        }
                      </span>
                    )}

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-extrabold text-slate-500">
                      Album Pertanahan
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-black text-slate-900 transition group-hover:text-emerald-700">
                    {
                      album.judul
                    }
                  </h3>

                  {album.deskripsi && (
                    <p className="mt-2 line-clamp-3 text-sm font-medium leading-6 text-slate-500">
                      {
                        album.deskripsi
                      }
                    </p>
                  )}

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs font-extrabold text-emerald-700">
                      Buka Album
                    </span>

                    <ArrowRight
                      size={16}
                      className="text-emerald-700 transition group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </button>
            );
          }
        )}
      </div>

      {/* =====================================================
          POPUP
      ===================================================== */}

      {activeAlbum && (
        <div
          role="presentation"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeAlbum();
            }
          }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-sm sm:p-5"
        >
          <section
            role="dialog"
            aria-modal="true"
            className="flex max-h-[94svh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl"
          >
            {/* HEADER */}

            <header className="relative flex shrink-0 items-start justify-between gap-4 overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-700 px-5 py-5 text-white sm:px-7">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-emerald-200">
                  Album Pertanahan
                </p>

                <h2 className="mt-1 text-lg font-black sm:text-xl">
                  {
                    activeAlbum.judul
                  }
                </h2>

                {activeAlbum.tahun && (
                  <p className="mt-1 text-xs font-semibold text-emerald-100/70">
                    Tahun{' '}
                    {
                      activeAlbum.tahun
                    }
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={
                  closeAlbum
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 transition hover:bg-white/20"
                aria-label="Tutup album"
              >
                <X
                  size={20}
                />
              </button>
            </header>

            {/* MAIN PHOTO */}

            <div className="relative min-h-0 flex-1 overflow-auto bg-slate-950 p-3 sm:p-5">
              {activePhoto ? (
                <div className="relative flex min-h-[420px] items-center justify-center">
                  <img
                    src={
                      activePhoto.foto_url
                    }
                    alt={
                      activePhoto.caption ??
                      activeAlbum.judul
                    }
                    className="max-h-[65svh] max-w-full rounded-xl object-contain"
                  />

                  {activeAlbum.fotos.length >
                    1 && (
                    <>
                      <button
                        type="button"
                        onClick={
                          previousPhoto
                        }
                        aria-label="Foto sebelumnya"
                        className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75 sm:left-4"
                      >
                        <ArrowLeft
                          size={19}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={
                          nextPhoto
                        }
                        aria-label="Foto berikutnya"
                        className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75 sm:right-4"
                      >
                        <ArrowRight
                          size={19}
                        />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex min-h-[420px] items-center justify-center text-center">
                  <div>
                    <ImageIcon
                      size={42}
                      className="mx-auto text-white/25"
                    />

                    <p className="mt-4 text-sm font-bold text-white/50">
                      Album belum
                      memiliki foto.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* FOOTER */}

            {activePhoto && (
              <footer className="shrink-0 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-black text-slate-800">
                      Foto{' '}
                      {photoIndex +
                        1}{' '}
                      dari{' '}
                      {
                        activeAlbum.fotos
                          .length
                      }
                    </p>

                    {activePhoto.caption && (
                      <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                        {
                          activePhoto.caption
                        }
                      </p>
                    )}
                  </div>

                  {/* THUMBNAILS */}

                  {activeAlbum.fotos.length >
                    1 && (
                    <div className="flex max-w-full gap-2 overflow-x-auto">
                      {activeAlbum.fotos.map(
                        (
                          foto,
                          index
                        ) => (
                          <button
                            key={
                              foto.id
                            }
                            type="button"
                            onClick={() =>
                              setPhotoIndex(
                                index
                              )
                            }
                            className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                              index ===
                              photoIndex
                                ? 'border-emerald-600'
                                : 'border-transparent'
                            }`}
                          >
                            <img
                              src={
                                foto.foto_url
                              }
                              alt={
                                foto.caption ??
                                activeAlbum.judul
                              }
                              className="h-full w-full object-cover"
                            />
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </footer>
            )}
          </section>
        </div>
      )}
    </>
  );
}