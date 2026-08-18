'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  BookOpen,
  CalendarDays,
  Download,
  ExternalLink,
  FileText,
  Info,
  X,
} from 'lucide-react';

interface SapaKejiCoverDialogProps {
  title: string;
  description: string;
  author: string;

  year:
    | number
    | null;

  pageCount:
    | number
    | null;

  coverUrl: string;
  fileUrl: string;
  className?: string;
  imageClassName?: string;
  showHint?: boolean;
}

export default function SapaKejiCoverDialog({
  title,
  description,
  author,
  year,
  pageCount,
  coverUrl,
  fileUrl,
  className = '',
  imageClassName = '',
  showHint = true,
}: SapaKejiCoverDialogProps) {
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key ===
        'Escape'
      ) {
        setIsOpen(false);
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
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
      <button
        type="button"
        onClick={() =>
          setIsOpen(true)
        }
        aria-label={`Lihat detail ${title}`}
        className={`group relative block overflow-hidden text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/50 ${className}`}
      >
        <img
          src={coverUrl}
          alt={`Sampul ${title}`}
          className={`transition duration-500 group-hover:scale-[1.025] ${imageClassName}`}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

        {showHint && (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-emerald-800 shadow-lg">
              <Info size={15} />

              Lihat Detail Buku
            </span>
          </div>
        )}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sapa-keji-dialog-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm sm:p-6"
          onMouseDown={() =>
            setIsOpen(false)
          }
        >
          <div
            className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl"
            onMouseDown={(
              event
            ) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              onClick={() =>
                setIsOpen(false)
              }
              aria-label="Tutup detail buku"
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-slate-950/75 text-white shadow-lg backdrop-blur transition hover:bg-slate-950"
            >
              <X size={20} />
            </button>

            <div className="grid lg:grid-cols-[360px_minmax(0,1fr)]">
              <div className="relative bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 p-6 sm:p-8">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-15"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',

                    backgroundSize:
                      '24px 24px',
                  }}
                />

                <div className="relative mx-auto max-w-[290px] overflow-hidden rounded-2xl bg-white shadow-2xl">
                  <img
                    src={coverUrl}
                    alt={`Sampul ${title}`}
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>

              <div className="flex flex-col p-6 sm:p-8 lg:p-10">
                <div className="flex flex-wrap gap-2">
                  {year && (
                    <DetailBadge
                      icon={
                        CalendarDays
                      }
                      label={`Tahun ${year}`}
                    />
                  )}

                  {pageCount && (
                    <DetailBadge
                      icon={FileText}
                      label={`${pageCount} halaman`}
                    />
                  )}

                  <DetailBadge
                    icon={BookOpen}
                    label="Format PDF"
                  />
                </div>

                <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-700">
                  Hospitality Pocket Book
                </p>

                <h2
                  id="sapa-keji-dialog-title"
                  className="mt-3 text-2xl font-black leading-tight text-slate-900 sm:text-3xl"
                >
                  {title}
                </h2>

                <p className="mt-4 text-sm font-bold text-slate-500">
                  Disusun oleh{' '}
                  <span className="text-emerald-700">
                    {author}
                  </span>
                </p>

                <p className="mt-6 flex-1 text-sm font-medium leading-8 text-slate-600 sm:text-base">
                  {description}
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white transition hover:bg-emerald-800"
                  >
                    <BookOpen
                      size={18}
                    />

                    Baca PDF

                    <ExternalLink
                      size={14}
                    />
                  </a>

                  <a
                    href={fileUrl}
                    download
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <Download
                      size={18}
                    />

                    Unduh Buku
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DetailBadge({
  icon: Icon,
  label,
}: {
  icon: typeof BookOpen;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
      <Icon size={13} />

      {label}
    </span>
  );
}