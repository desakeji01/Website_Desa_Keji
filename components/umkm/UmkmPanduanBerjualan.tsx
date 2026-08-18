// components/umkm/UmkmPanduanBerjualan.tsx

import {
  ExternalLink,
  Lightbulb,
} from 'lucide-react';

interface PanduanUmkm {
  judul: string;

  deskripsi: string;

  gambarUrl: string;
}

interface Props {
  panduan:
    PanduanUmkm;
}

export default function UmkmPanduanBerjualan({
  panduan,
}: Props) {
  return (
    <section
      id="panduan-sukses-berjualan"
      className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-xl shadow-slate-900/[0.06]"
    >
      <div className="grid lg:grid-cols-[370px_minmax(0,1fr)]">
        {/* GAMBAR */}

        <a
          href={
            panduan.gambarUrl
          }
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Buka ${panduan.judul}`}
          className="group relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f8dec9] via-[#fff0e4] to-emerald-50 p-6 sm:p-8"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(120,53,15,0.15) 1px, transparent 1px)',

              backgroundSize:
                '22px 22px',
            }}
          />

          <div className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl bg-white shadow-2xl transition duration-500 group-hover:-translate-y-1 group-hover:shadow-orange-950/20">
            <img
              src={
                panduan.gambarUrl
              }
              alt={
                panduan.judul
              }
              loading="lazy"
              className="h-auto w-full object-contain"
            />
          </div>

          <div className="pointer-events-none absolute inset-x-6 bottom-6 flex justify-center opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-950/90 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg backdrop-blur">
              <Lightbulb
                size={15}
              />

              Lihat Panduan
            </span>
          </div>
        </a>

        {/* INFORMASI */}

        <div className="relative flex flex-col p-6 sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-amber-100/70 blur-3xl"
          />

          <div className="relative flex flex-1 flex-col">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Lightbulb
                size={23}
              />
            </div>

            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-700">
              Edukasi Pelaku UMKM
            </p>

            <h2 className="mt-3 text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
              {
                panduan.judul
              }
            </h2>

            <p className="mt-5 flex-1 text-sm font-medium leading-8 text-slate-600 sm:text-base">
              {
                panduan.deskripsi
              }
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                Penataan Display
              </span>

              <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                Pelayanan Konsumen
              </span>

              <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                Panduan Praktis
              </span>
            </div>

            <a
              href={
                panduan.gambarUrl
              }
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white shadow-md transition hover:bg-emerald-800"
            >
              <Lightbulb
                size={18}
              />

              Buka Panduan

              <ExternalLink
                size={15}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}