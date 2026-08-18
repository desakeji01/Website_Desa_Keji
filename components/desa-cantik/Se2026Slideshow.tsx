'use client';

import Image from 'next/image';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Megaphone,
  Pause,
  Play,
} from 'lucide-react';

export interface Se2026Slide {
  src: string;
  title: string;
  description: string;
}

interface Se2026SlideshowProps {
  slides: Se2026Slide[];
  interval?: number;
}

export default function Se2026Slideshow({
  slides,
  interval = 5000,
}: Se2026SlideshowProps) {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const [isPlaying, setIsPlaying] =
    useState(true);

  const [
    isPausedByInteraction,
    setIsPausedByInteraction,
  ] = useState(false);

  const jumlahSlide = slides.length;

  const tampilkanSlideBerikutnya =
    useCallback(() => {
      if (jumlahSlide <= 1) {
        return;
      }

      setActiveIndex(
        (currentIndex) =>
          (currentIndex + 1) %
          jumlahSlide
      );
    }, [jumlahSlide]);

  const tampilkanSlideSebelumnya =
    useCallback(() => {
      if (jumlahSlide <= 1) {
        return;
      }

      setActiveIndex(
        (currentIndex) =>
          (currentIndex -
            1 +
            jumlahSlide) %
          jumlahSlide
      );
    }, [jumlahSlide]);

  useEffect(() => {
    if (
      !isPlaying ||
      isPausedByInteraction ||
      jumlahSlide <= 1
    ) {
      return;
    }

    const timer = window.setInterval(
      tampilkanSlideBerikutnya,
      interval
    );

    return () => {
      window.clearInterval(timer);
    };
  }, [
    interval,
    isPausedByInteraction,
    isPlaying,
    jumlahSlide,
    tampilkanSlideBerikutnya,
  ]);

  useEffect(() => {
    if (jumlahSlide === 0) {
      setActiveIndex(0);
      return;
    }

    if (activeIndex >= jumlahSlide) {
      setActiveIndex(0);
    }
  }, [
    activeIndex,
    jumlahSlide,
  ]);

  if (jumlahSlide === 0) {
    return null;
  }

  const activeSlide =
    slides[activeIndex] ??
    slides[0];

  return (
    <section
      aria-label="Publikasi Sensus Ekonomi 2026"
      className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-xl shadow-slate-900/[0.06]"
      onMouseEnter={() =>
        setIsPausedByInteraction(true)
      }
      onMouseLeave={() =>
        setIsPausedByInteraction(false)
      }
      onFocusCapture={() =>
        setIsPausedByInteraction(true)
      }
      onBlurCapture={() =>
        setIsPausedByInteraction(false)
      }
    >
      <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(390px,0.75fr)]">
        {/* Informasi slideshow */}
        <div className="relative flex min-h-[440px] flex-col justify-center overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-600 p-6 text-white sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.65) 1px, transparent 1px)',
              backgroundSize:
                '24px 24px',
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full border-[55px] border-white/10"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl"
          />

          <div className="relative">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.17em] backdrop-blur-sm">
              <Megaphone size={15} />

              Publikasi SE2026
            </div>

            <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-100">
              Poster {activeIndex + 1} dari{' '}
              {jumlahSlide}
            </p>

            <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-4xl">
              {activeSlide.title}
            </h2>

            <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-emerald-50 sm:text-base">
              {activeSlide.description}
            </p>

            <a
              href={activeSlide.src}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-800 shadow-md transition hover:bg-emerald-50"
            >
              Lihat Poster Lengkap

              <ExternalLink size={15} />
            </a>

            {/* Kontrol slideshow */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={
                  tampilkanSlideSebelumnya
                }
                aria-label="Poster sebelumnya"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
              >
                <ChevronLeft size={21} />
              </button>

              <button
                type="button"
                onClick={() =>
                  setIsPlaying(
                    (currentValue) =>
                      !currentValue
                  )
                }
                aria-label={
                  isPlaying
                    ? 'Jeda slideshow'
                    : 'Putar slideshow'
                }
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/15 px-4 text-xs font-extrabold text-white backdrop-blur transition hover:bg-white/25"
              >
                {isPlaying ? (
                  <Pause size={17} />
                ) : (
                  <Play size={17} />
                )}

                {isPlaying
                  ? 'Jeda'
                  : 'Putar'}
              </button>

              <button
                type="button"
                onClick={
                  tampilkanSlideBerikutnya
                }
                aria-label="Poster berikutnya"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
              >
                <ChevronRight size={21} />
              </button>

              {/* Indikator slide */}
              <div className="ml-1 flex items-center gap-2">
                {slides.map(
                  (slide, index) => (
                    <button
                      key={slide.src}
                      type="button"
                      onClick={() =>
                        setActiveIndex(index)
                      }
                      aria-label={`Tampilkan poster ${index + 1}`}
                      aria-current={
                        activeIndex === index
                          ? 'true'
                          : undefined
                      }
                      className={`h-2.5 rounded-full transition-all ${
                        activeIndex === index
                          ? 'w-8 bg-white'
                          : 'w-2.5 bg-white/45 hover:bg-white/75'
                      }`}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Poster aktif */}
        <div className="relative flex min-h-[620px] items-center justify-center overflow-hidden bg-emerald-50 p-5 sm:p-7 lg:min-h-[690px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(5,150,105,0.13) 1px, transparent 1px)',
              backgroundSize:
                '22px 22px',
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-28 -bottom-28 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl"
          />

          <a
            href={activeSlide.src}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Lihat ${activeSlide.title}`}
            className="relative block aspect-[2/3] w-full max-w-[430px] overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-2xl shadow-emerald-950/15"
          >
            <Image
              key={activeSlide.src}
              src={activeSlide.src}
              alt={activeSlide.title}
              fill
              priority={activeIndex === 0}
              sizes="(max-width: 1024px) 90vw, 430px"
              className="object-contain"
            />
          </a>

          <div className="absolute right-7 top-7 z-10 rounded-full bg-emerald-950/85 px-4 py-2 text-xs font-extrabold text-white shadow-lg backdrop-blur">
            {String(
              activeIndex + 1
            ).padStart(2, '0')}
            {' / '}
            {String(
              jumlahSlide
            ).padStart(2, '0')}
          </div>
        </div>
      </div>
    </section>
  );
}