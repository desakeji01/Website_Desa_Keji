// components/anti-korupsi/ModulAntiKorupsiClient.tsx

'use client';

import {
  useMemo,
  useState,
} from 'react';

import {
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ExternalLink,
  FileCheck2,
  FileSearch,
  FileText,
  FolderOpen,
  Handshake,
  Search,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

import type {
  DokumenAntiKorupsiPublik,
  IndikatorAntiKorupsiPublik,
} from '@/types/anti-korupsi-public';

import type {
  AntiKorupsiIconKey,
} from '@/types/anti-korupsi';

interface ModulAntiKorupsiClientProps {
  indikator:
    IndikatorAntiKorupsiPublik[];

  namaModul: string;
  labelIndikator: string;
}

const ICON_MAP: Record<
  AntiKorupsiIconKey,
  LucideIcon
> = {
  'clipboard-check':
    ClipboardCheck,

  'file-search':
    FileSearch,

  'shield-check':
    ShieldCheck,

  handshake:
    Handshake,

  'badge-check':
    BadgeCheck,
};

export default function ModulAntiKorupsiClient({
  indikator,
  namaModul,
  labelIndikator,
}: ModulAntiKorupsiClientProps) {
  const [
    indikatorAktifIndex,
    setIndikatorAktifIndex,
  ] = useState(0);

  const [
    pencarian,
    setPencarian,
  ] = useState('');

  const safeIndex =
    indikator.length > 0
      ? Math.min(
          indikatorAktifIndex,
          indikator.length - 1
        )
      : 0;

  const indikatorAktif =
    indikator[safeIndex] ??
    null;

  const dokumenTersaring =
    useMemo(() => {
      if (!indikatorAktif) {
        return [];
      }

      const query =
        pencarian
          .trim()
          .toLowerCase();

      if (!query) {
        return indikatorAktif.dokumen;
      }

      return indikatorAktif.dokumen.filter(
        (dokumen) =>
          [
            dokumen.judul,
            dokumen.deskripsi,
            dokumen.jenis,
            dokumen.tahun,
          ]
            .join(' ')
            .toLowerCase()
            .includes(query)
      );
    }, [
      indikatorAktif,
      pencarian,
    ]);

  function pilihIndikator(
    index: number
  ) {
    setIndikatorAktifIndex(
      index
    );

    setPencarian('');

    if (
      typeof window !==
        'undefined' &&
      window.innerWidth < 1024
    ) {
      window.setTimeout(() => {
        document
          .getElementById(
            'dokumen-anti-korupsi'
          )
          ?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
      }, 80);
    }
  }

  if (
    indikator.length === 0
  ) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <FileSearch
          size={48}
          className="mx-auto text-slate-300"
        />

        <h2 className="mt-4 text-lg font-black text-slate-800">
          Indikator belum tersedia
        </h2>

        <p className="mx-auto mt-2 max-w-lg text-sm font-medium leading-6 text-slate-500">
          Data {namaModul} akan
          ditampilkan setelah indikator
          dipublikasikan melalui halaman
          administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      {/* Navigasi mobile */}
      <section className="mb-6 lg:hidden">
        <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-3 flex items-center gap-3 px-2 pt-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <FolderOpen
                size={20}
              />
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                {namaModul}
              </p>

              <h2 className="text-base font-black text-slate-900">
                Pilih Indikator
              </h2>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {indikator.map(
              (
                item,
                index
              ) => {
                const aktif =
                  safeIndex ===
                  index;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      pilihIndikator(
                        index
                      )
                    }
                    className={`shrink-0 rounded-xl border px-4 py-3 text-left transition ${
                      aktif
                        ? 'border-emerald-700 bg-emerald-700 text-white shadow-md'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em]">
                      {labelIndikator}
                    </p>

                    <p className="mt-1 text-sm font-black">
                      {item.kode}
                    </p>

                    <p className="mt-1 text-[10px] font-semibold">
                      {
                        item.dokumen
                          .length
                      }{' '}
                      dokumen
                    </p>
                  </button>
                );
              }
            )}
          </div>
        </div>
      </section>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[330px_minmax(0,1fr)] xl:gap-8">
        {/* Navigasi desktop */}
        <aside className="hidden min-w-0 lg:block">
          <div className="sticky top-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <FolderOpen
                    size={21}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    {namaModul}
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-900">
                    Kategori Indikator
                  </h2>
                </div>
              </div>
            </div>

            <nav className="space-y-2 p-3">
              {indikator.map(
                (
                  item,
                  index
                ) => {
                  const Icon =
                    ICON_MAP[
                      item.iconKey
                    ];

                  const aktif =
                    safeIndex ===
                    index;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        pilihIndikator(
                          index
                        )
                      }
                      className={`group flex w-full items-start gap-3 rounded-2xl border px-3.5 py-4 text-left transition ${
                        aktif
                          ? 'border-emerald-700 bg-emerald-700 text-white shadow-md'
                          : 'border-transparent bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          aktif
                            ? 'bg-white/15 text-white'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        <Icon
                          size={19}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em]">
                          {labelIndikator}{' '}
                          {item.kode}
                        </p>

                        <p className="mt-1.5 break-words text-xs font-bold leading-5">
                          {item.judul}
                        </p>

                        <p className="mt-2 text-[10px] font-semibold">
                          {
                            item.dokumen
                              .length
                          }{' '}
                          dokumen
                        </p>
                      </div>

                      <ChevronRight
                        size={17}
                        className="mt-3 shrink-0"
                      />
                    </button>
                  );
                }
              )}
            </nav>
          </div>
        </aside>

        {/* Dokumen */}
        <section
          id="dokumen-anti-korupsi"
          className="min-w-0 scroll-mt-28"
        >
          {indikatorAktif && (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <header className="border-b border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-white p-5 sm:p-6 xl:p-8">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                      <CheckCircle2
                        size={22}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                        {labelIndikator}{' '}
                        {
                          indikatorAktif.kode
                        }
                      </p>

                      <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
                        Bukti Dukung
                      </h2>

                      <p className="mt-3 text-sm font-bold leading-6 text-slate-700">
                        {
                          indikatorAktif.judul
                        }
                      </p>

                      <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                        {
                          indikatorAktif.ringkasan
                        }
                      </p>
                    </div>
                  </div>

                  <div className="w-fit rounded-2xl border border-emerald-200 bg-white px-5 py-4 shadow-sm">
                    <p className="text-2xl font-black text-emerald-700">
                      {
                        indikatorAktif
                          .dokumen
                          .length
                      }
                    </p>

                    <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500">
                      Dokumen aktif
                    </p>
                  </div>
                </div>

                <div className="relative mt-6">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="search"
                    value={pencarian}
                    onChange={(
                      event
                    ) =>
                      setPencarian(
                        event.target
                          .value
                      )
                    }
                    placeholder="Cari nama, jenis, atau tahun dokumen..."
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </header>

              <div className="p-4 sm:p-5 xl:p-7">
                {dokumenTersaring.length >
                0 ? (
                  <div className="grid gap-4 xl:grid-cols-2">
                    {dokumenTersaring.map(
                      (
                        dokumen,
                        index
                      ) => (
                        <DokumenCard
                          key={
                            dokumen.id
                          }
                          dokumen={
                            dokumen
                          }
                          nomor={
                            index +
                            1
                          }
                        />
                      )
                    )}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
                    <FileSearch
                      size={44}
                      className="mx-auto text-slate-300"
                    />

                    <h3 className="mt-4 text-lg font-black text-slate-800">
                      Dokumen tidak
                      ditemukan
                    </h3>

                    <p className="mt-2 text-sm font-medium text-slate-500">
                      Belum ada dokumen
                      aktif atau kata
                      kunci tidak sesuai.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function DokumenCard({
  dokumen,
  nomor,
}: {
  dokumen:
    DokumenAntiKorupsiPublik;

  nomor: number;
}) {
  return (
    <article className="group flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-emerald-700">
            <FileText
              size={12}
            />

            {dokumen.jenis}
          </span>

          {dokumen.tahun && (
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-extrabold text-blue-700">
              {dokumen.tahun}
            </span>
          )}
        </div>

        <span className="shrink-0 text-xs font-black text-slate-300">
          {String(nomor).padStart(
            2,
            '0'
          )}
        </span>
      </div>

      <h3 className="mt-4 break-words text-base font-black leading-6 text-slate-900 group-hover:text-emerald-800">
        {dokumen.judul}
      </h3>

      <p className="mt-3 flex-1 text-sm font-medium leading-6 text-slate-500">
        {dokumen.deskripsi}
      </p>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <a
          href={dokumen.driveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-800"
        >
          <FileCheck2
            size={15}
          />

          Buka Dokumen

          <ExternalLink
            size={13}
          />
        </a>
      </div>
    </article>
  );
}