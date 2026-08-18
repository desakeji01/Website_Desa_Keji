// components/desa-wisata/SosialMediaDesaWisataPopup.tsx

'use client';

import Image from 'next/image';

import {
  useEffect,
  useState,
} from 'react';

import {
  ArrowUpRight,
  MapPin,
  Sparkles,
  X,
} from 'lucide-react';

/* =========================================================
   CONFIG
========================================================= */

const INSTAGRAM_DESA_WISATA =
  'https://www.instagram.com/desa.wisatakeji?igsh=OHhtanAweGxxamQ0';

const LOGO_DWK =
  '/desa-wisata/Logo%20DWK.png';

/* =========================================================
   COMPONENT
========================================================= */

export default function SosialMediaDesaWisataPopup() {
  const [
    isOpen,
    setIsOpen,
  ] = useState(true);

  /* =========================================================
     ESC + SCROLL LOCK
  ========================================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow =
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
        originalOverflow;

      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [
    isOpen,
  ]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="social-media-desa-wisata-title"
    >
      {/* =====================================================
          BACKDROP
      ===================================================== */}

      <button
        type="button"
        aria-label="Tutup popup sosial media"
        onClick={() =>
          setIsOpen(false)
        }
        className="absolute inset-0 cursor-default bg-emerald-950/80 backdrop-blur-[6px]"
      />

      {/* =====================================================
          MODAL WRAPPER

          Wrapper tidak ikut scroll supaya tombol close
          selalu terlihat.
      ===================================================== */}

      <div className="relative z-10 w-full max-w-[490px]">
        {/* ===================================================
            CLOSE BUTTON
        =================================================== */}

        <button
          type="button"
          onClick={() =>
            setIsOpen(false)
          }
          aria-label="Tutup"
          className="absolute right-3 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-emerald-950/50 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-emerald-950/80 sm:right-4 sm:top-4"
        >
          <X
            size={18}
            strokeWidth={2.5}
          />
        </button>

        {/* ===================================================
            SCROLLABLE MODAL
        =================================================== */}

        <div className="max-h-[calc(100dvh-24px)] overflow-y-auto rounded-[1.75rem] border border-white/20 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.4)] sm:max-h-[calc(100dvh-32px)]">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="relative overflow-hidden bg-gradient-to-br from-[#052e24] via-emerald-900 to-emerald-700 px-5 pb-6 pt-5 text-white sm:px-7 sm:pb-7 sm:pt-6">
            {/* Pattern */}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.13]"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',

                backgroundSize:
                  '24px 24px',
              }}
            />

            {/* Glow kanan */}

            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-300/15 blur-3xl" />

            {/* Glow kiri */}

            <div className="pointer-events-none absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-amber-300/[0.08] blur-3xl" />

            {/* Decorative Circle */}

            <div className="pointer-events-none absolute -right-16 bottom-0 h-44 w-44 rounded-full border-[32px] border-white/[0.04]" />

            {/* ===============================================
                CONTENT HEADER
            =============================================== */}

            <div className="relative flex flex-col items-center text-center">
              {/* LOGO */}

              <div className="relative flex h-[105px] w-[105px] items-center justify-center rounded-[1.5rem] border border-white/15 bg-white/[0.08] p-3 shadow-2xl backdrop-blur sm:h-[120px] sm:w-[120px]">
                <div className="pointer-events-none absolute inset-2 rounded-[1.2rem] border border-white/[0.08]" />

                <Image
                  src={
                    LOGO_DWK
                  }
                  alt="Logo Desa Wisata Keji"
                  width={160}
                  height={160}
                  priority
                  className="relative h-full w-full object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.28)]"
                />
              </div>

              {/* BADGE */}

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                <Sparkles
                  size={12}
                  className="text-emerald-300"
                />

                <span className="text-[9px] font-extrabold uppercase tracking-[0.17em] text-emerald-100">
                  Sosial Media Resmi
                </span>
              </div>

              {/* JUDUL */}

              <h2
                id="social-media-desa-wisata-title"
                className="mt-3 text-xl font-black leading-tight tracking-tight sm:text-2xl"
              >
                Ikuti Cerita

                <span className="block text-emerald-300">
                  Desa Wisata Keji
                </span>
              </h2>

              {/* DESKRIPSI */}

              <p className="mt-3 max-w-sm text-xs font-medium leading-6 text-emerald-50/80 sm:text-[13px]">
                Temukan dokumentasi
                wisata, budaya,
                kesenian, kuliner,
                agenda kegiatan, serta
                berbagai cerita dari
                Desa Wisata Keji melalui
                Instagram resmi.
              </p>
            </div>
          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="p-4 sm:p-5">
            {/* ===============================================
                INSTAGRAM CARD
            =============================================== */}

            <a
              href={
                INSTAGRAM_DESA_WISATA
              }
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-3.5">
                {/* ICON */}

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-md">
                  <InstagramIcon
                    className="h-[21px] w-[21px]"
                  />
                </div>

                {/* TEXT */}

                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-emerald-600">
                    Instagram
                  </p>

                  <h3 className="mt-0.5 text-sm font-black text-emerald-950">
                    @desa.wisatakeji
                  </h3>

                  <p className="mt-0.5 text-[11px] font-medium text-emerald-700">
                    Instagram resmi
                    Desa Wisata Keji
                  </p>
                </div>

                {/* ARROW */}

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm transition group-hover:bg-emerald-700 group-hover:text-white">
                  <ArrowUpRight
                    size={15}
                  />
                </div>
              </div>
            </a>

            {/* ===============================================
                LOCATION
            =============================================== */}

            <div className="mt-3 flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <MapPin
                  size={15}
                />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-black text-slate-700">
                  Desa Wisata Keji
                </p>

                <p className="mt-0.5 text-[10px] font-medium leading-5 text-slate-500 sm:text-[11px]">
                  Kecamatan Ungaran
                  Barat, Kabupaten
                  Semarang, Jawa Tengah
                </p>
              </div>
            </div>

            {/* ===============================================
                INSTAGRAM BUTTON
            =============================================== */}

            <a
              href={
                INSTAGRAM_DESA_WISATA
              }
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-xs font-extrabold text-white shadow-md transition hover:bg-emerald-800"
            >
              <InstagramIcon
                className="h-[17px] w-[17px]"
              />

              Kunjungi Instagram

              <ArrowUpRight
                size={15}
                className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>

            {/* ===============================================
                CLOSE BUTTON BOTTOM
            =============================================== */}

            <button
              type="button"
              onClick={() =>
                setIsOpen(false)
              }
              className="mt-2 flex min-h-10 w-full items-center justify-center rounded-xl text-[11px] font-extrabold text-slate-500 transition hover:bg-slate-50 hover:text-emerald-700"
            >
              Lanjut Jelajahi Desa Wisata
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INSTAGRAM ICON
========================================================= */

function InstagramIcon({
  className = '',
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={
        className
      }
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="17.5"
        cy="6.5"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}