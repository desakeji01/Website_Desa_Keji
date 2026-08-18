'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import {
  ExternalLink,
  Image as ImageIcon,
  X,
} from 'lucide-react';

interface DesaCantikInfografisPopupProps {
  src: string;
  title: string;
  alt: string;
  triggerLabel?: string;
  autoOpen?: boolean;
}

export default function DesaCantikInfografisPopup({
  src,
  title,
  alt,
  triggerLabel = 'Lihat Infografis',
  autoOpen = true,
}: DesaCantikInfografisPopupProps) {
  const [isOpen, setIsOpen] =
    useState(autoOpen);

  const [imageFailed, setImageFailed] =
    useState(false);

  const titleId = useId();

  const closeButtonRef =
    useRef<HTMLButtonElement | null>(
      null
    );

  function openPopup() {
    setImageFailed(false);
    setIsOpen(true);
  }

  function closePopup() {
    setIsOpen(false);
  }

  useEffect(() => {
    setImageFailed(false);
    setIsOpen(autoOpen);
  }, [autoOpen, src]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === 'Escape') {
        closePopup();
      }
    }

    document.body.style.overflow =
      'hidden';

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    const focusTimer =
      window.setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 0);

    return () => {
      window.clearTimeout(focusTimer);

      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [isOpen]);

  return (
    <>
      {/* Tombol membuka kembali popup */}
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={openPopup}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 text-sm font-extrabold text-emerald-800 shadow-sm transition hover:border-emerald-700 hover:bg-emerald-700 hover:text-white"
        >
          <ImageIcon size={17} />

          {triggerLabel}
        </button>
      </div>

      {isOpen ? (
        <div
          role="presentation"
          className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closePopup();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="flex max-h-[90svh] w-full max-w-3xl flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white shadow-2xl shadow-black/40"
          >
            {/* Header */}
            <header className="relative flex shrink-0 items-center justify-between gap-4 overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-800 to-emerald-700 px-5 py-4 text-white sm:px-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/10"
              />

              <div className="relative min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-emerald-200">
                  Desa Cantik Desa Keji
                </p>

                <h2
                  id={titleId}
                  className="mt-1 line-clamp-2 text-base font-black leading-6 sm:text-lg"
                >
                  {title}
                </h2>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={closePopup}
                aria-label="Tutup infografis"
                className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <X size={20} />
              </button>
            </header>

            {/* Area infografis */}
            <div className="min-h-0 flex-1 overflow-auto bg-emerald-50/70 p-3 sm:p-5">
              {!imageFailed ? (
                <div className="mx-auto flex min-h-full w-full max-w-[680px] items-center justify-center">
                  <img
                    key={src}
                    src={src}
                    alt={alt}
                    onError={() =>
                      setImageFailed(true)
                    }
                    className="h-auto max-h-[calc(90svh-150px)] w-auto max-w-full rounded-2xl border border-emerald-100 bg-white object-contain shadow-lg shadow-emerald-950/10"
                  />
                </div>
              ) : (
                <div className="mx-auto flex min-h-[360px] w-full max-w-xl flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-white px-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <ImageIcon size={27} />
                  </div>

                  <h3 className="mt-4 text-lg font-black text-slate-800">
                    Infografis belum ditemukan
                  </h3>

                  <p className="mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
                    Periksa kembali nama file dan
                    pastikan gambar berada di folder{' '}
                    <span className="font-bold text-slate-700">
                      public/desa-cantik
                    </span>
                    .
                  </p>

                  <p className="mt-3 max-w-full break-all rounded-xl bg-slate-100 px-4 py-2 text-xs font-medium text-slate-500">
                    {src}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-200 bg-white px-5 py-3 sm:px-6">
              <button
                type="button"
                onClick={closePopup}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100"
              >
                Tutup
              </button>

              {!imageFailed ? (
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-800"
                >
                  Lihat Penuh

                  <ExternalLink size={14} />
                </a>
              ) : null}
            </footer>
          </section>
        </div>
      ) : null}
    </>
  );
}