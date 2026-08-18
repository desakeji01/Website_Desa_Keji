// components/SplashScreen.tsx

'use client';

import {
  useEffect,
  useState,
} from 'react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] =
    useState(true);

  const [isLeaving, setIsLeaving] =
    useState(false);

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

    const fadeTimer =
      window.setTimeout(() => {
        setIsLeaving(true);
      }, 1700);

    const hideTimer =
      window.setTimeout(() => {
        setIsVisible(false);

        document.body.style.overflow =
          previousOverflow;
      }, 2350);

    /*
     * Pengaman tambahan apabila
     * timer utama terganggu.
     */
    const failSafeTimer =
      window.setTimeout(() => {
        setIsVisible(false);

        document.body.style.overflow =
          previousOverflow;
      }, 5000);

    return () => {
      window.clearTimeout(
        fadeTimer
      );

      window.clearTimeout(
        hideTimer
      );

      window.clearTimeout(
        failSafeTimer
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-label="Memuat Sistem Informasi Keji"
      className="fixed inset-0 z-[9999]"
      style={{
        /*
         * CSS tetap melepas splash
         * walaupun React gagal hydration.
         */
        animation:
          'siji-release 1ms linear 5s forwards',
      }}
    >
      <style>{`
        @keyframes siji-release {
          to {
            visibility: hidden;
            pointer-events: none;
          }
        }

        @keyframes siji-logo-enter {
          from {
            opacity: 0;
            transform:
              translateY(14px)
              scale(0.94);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes siji-text-enter {
          from {
            opacity: 0;
            transform:
              translateY(10px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
          }
        }

        @keyframes siji-loading {
          from {
            transform: scaleX(0);
          }

          to {
            transform: scaleX(1);
          }
        }

        @keyframes siji-glow {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }

          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        .siji-logo-enter {
          animation:
            siji-logo-enter
            700ms
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            both;
        }

        .siji-title-enter {
          animation:
            siji-text-enter
            650ms
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            150ms
            both;
        }

        .siji-subtitle-enter {
          animation:
            siji-text-enter
            650ms
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            260ms
            both;
        }

        .siji-loading {
          animation:
            siji-loading
            1800ms
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            both;
          transform-origin: left;
        }

        .siji-glow {
          animation:
            siji-glow
            2.8s
            ease-in-out
            infinite;
        }

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .siji-logo-enter,
          .siji-title-enter,
          .siji-subtitle-enter,
          .siji-loading,
          .siji-glow {
            animation: none;
          }
        }
      `}</style>

      <div
        className={`absolute inset-0 flex items-center justify-center overflow-hidden bg-[#031e18] px-5 transition-all duration-700 ease-out ${
          isLeaving
            ? 'scale-[1.025] opacity-0'
            : 'scale-100 opacity-100'
        }`}
      >
        {/* Motif batik */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "url('/batik-splash.png')",

            backgroundRepeat:
              'repeat',

            backgroundPosition:
              'center',

            backgroundSize:
              '420px auto',

            opacity: 0.42,

            filter:
              'contrast(1.15) brightness(1.05)',
          }}
        />

        {/* Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-emerald-950/50" />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/55" />

        {/* Cahaya tengah */}
        <div className="siji-glow pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/10 blur-[100px]" />

        {/* Bingkai */}
        <div className="pointer-events-none absolute inset-5 rounded-[30px] border border-white/[0.08] sm:inset-8" />

        {/* Konten */}
        <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center">
          <div className="siji-logo-enter relative">
            <div className="absolute inset-0 scale-125 rounded-full bg-emerald-300/15 blur-3xl" />

            <div className="relative rounded-[2rem] border border-white/15 bg-white/[0.08] p-2.5 shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-md">
              <div className="rounded-[1.6rem] border border-white/10 bg-black/15 p-2">
                <div className="flex h-28 w-28 items-center justify-center rounded-[1.25rem] bg-white p-4 shadow-inner sm:h-32 sm:w-32">
                  <img
                    src="/logodesakeji.png"
                    alt="Logo Desa Keji"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          <h1 className="siji-title-enter mt-10 text-5xl font-black tracking-[0.18em] text-white sm:text-6xl">
            SIJI
          </h1>

          <div className="mt-4 h-px w-20 bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />

          <p className="siji-subtitle-enter mt-4 text-sm font-semibold tracking-[0.1em] text-emerald-50/90 sm:text-base">
            Sistem Informasi Keji
          </p>

          <div className="mt-10 w-52 overflow-hidden rounded-full bg-white/10 sm:w-60">
            <div className="siji-loading h-[3px] w-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-300 to-amber-200" />
          </div>
        </div>
      </div>
    </div>
  );
}