// components/BukuPanduanWebsite.tsx

import {
  BookOpen,
  Download,
  ExternalLink,
  FileText,
} from 'lucide-react';

const COVER_URL =
  '/Cover%20buku%20panduan%20website.png';

const PDF_URL =
  '/Buku%20Panduan%20Penggunaan%20dan%20Pengelolaan%20Website.pdf';

export default function BukuPanduanWebsite() {
  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-slate-900/[0.05]">
      <div className="grid md:grid-cols-[260px_minmax(0,1fr)]">
        {/* =====================================================
            COVER
        ===================================================== */}

        <a
          href={PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Buka Buku Panduan Penggunaan dan Pengelolaan Website"
          className="group relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50 p-6"
        >
          {/* Pattern */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(30,64,175,0.14) 1px, transparent 1px)',

              backgroundSize:
                '22px 22px',
            }}
          />

          {/* Cover */}
          <div className="relative mx-auto w-full max-w-[205px] overflow-hidden rounded-xl bg-white shadow-2xl transition duration-500 group-hover:-translate-y-1 group-hover:shadow-blue-950/20">
            <img
              src={COVER_URL}
              alt="Cover Pedoman Hukum Pengelolaan dan Penggunaan Website Desa"
              loading="lazy"
              className="h-auto w-full object-contain"
            />
          </div>

          {/* Hover */}
          <div className="pointer-events-none absolute inset-x-5 bottom-5 flex justify-center opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-950/90 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg backdrop-blur">
              <BookOpen
                size={15}
              />

              Buka Buku
            </span>
          </div>
        </a>

        {/* =====================================================
            INFORMASI
        ===================================================== */}

        <div className="relative flex flex-col p-6 sm:p-7 lg:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-blue-100/60 blur-3xl"
          />

          <div className="relative flex flex-1 flex-col">
            {/* Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <FileText
                size={23}
              />
            </div>

            {/* Label */}
            <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">
              Pedoman Digital Desa
            </p>

            {/* Judul */}
            <h2 className="mt-2 text-2xl font-black leading-tight text-slate-900">
              Pedoman Hukum Pengelolaan
              dan Penggunaan Website Desa
            </h2>

            {/* Deskripsi */}
            <p className="mt-4 flex-1 text-sm font-medium leading-7 text-slate-600">
              Buku panduan sebagai
              pedoman dalam penggunaan,
              pengelolaan, dan
              pemanfaatan Website Desa
              Keji agar dapat dikelola
              secara tertib,
              berkelanjutan, dan sesuai
              dengan ketentuan yang
              berlaku.
            </p>

            {/* Badge */}
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                Panduan Website
              </span>

              <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                Dokumen PDF
              </span>

              <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                2026
              </span>
            </div>

            {/* Tombol */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={PDF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-xs font-extrabold text-white shadow-md transition hover:bg-emerald-800"
              >
                <BookOpen
                  size={16}
                />

                Baca Buku Panduan

                <ExternalLink
                  size={14}
                />
              </a>

              <a
                href={PDF_URL}
                download
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-100"
              >
                <Download
                  size={16}
                />

                Unduh PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}