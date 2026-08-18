// components/anti-korupsi/PengawasanClient.tsx

'use client';

import {
  useMemo,
  useState,
} from 'react';

import {
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ExternalLink,
  FileCheck2,
  FileSearch,
  FileText,
  FolderOpen,
  Search,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

/* =========================================================
   TYPES
========================================================= */

interface DokumenPengawasan {
  id:
    string;

  judul:
    string;

  deskripsi:
    string;

  jenis:
    string;

  tahun?:
    number;

  /*
   * Isi href jika dokumen sudah tersedia.
   *
   * Contoh lokal:
   *
   * href:
   * '/documents/anti-korupsi/pengawasan/ii-1/file.pdf'
   *
   * Contoh Google Drive:
   *
   * href:
   * 'https://drive.google.com/file/d/ID_FILE/view'
   */
  href?:
    string;
}

interface IndikatorPengawasan {
  kode:
    string;

  judul:
    string;

  ringkasan:
    string;

  icon:
    LucideIcon;

  dokumen:
    DokumenPengawasan[];
}

/* =========================================================
   DATA PENGAWASAN

   INDIKATOR II — PENGUATAN PENGAWASAN

   II.1 = 5 dokumen
   II.2 = 4 dokumen
   II.3 = 5 dokumen

   TOTAL = 14 dokumen
========================================================= */

const indikatorPengawasan:
  IndikatorPengawasan[] = [
    /* =====================================================
       II.1
       EVALUASI KINERJA PERANGKAT DESA
    ===================================================== */

    {
      kode:
        'II.1',

      judul:
        'Evaluasi Kinerja Perangkat Desa',

      ringkasan:
        'Dokumen dan bukti pendukung pelaksanaan kegiatan pengawasan serta evaluasi kinerja perangkat Pemerintah Desa Keji.',

      icon:
        ClipboardCheck,

      dokumen: [
        {
          id:
            'ii-1-dokumentasi-kegiatan-evaluasi',

          judul:
            'Dokumentasi kegiatan evaluasi kinerja perangkat desa',

          deskripsi:
            'Dokumentasi kegiatan evaluasi kinerja perangkat desa.',

          jenis:
            'Dokumentasi',
        },

        {
          id:
            'ii-1-daftar-hadir-evaluasi',

          judul:
            'Daftar Hadir kegiatan evaluasi kinerja perangkat desa',

          deskripsi:
            'Daftar Hadir kegiatan evaluasi kinerja perangkat desa.',

          jenis:
            'Daftar Hadir',
        },

        {
          id:
            'ii-1-notulensi-rapat-evaluasi',

          judul:
            'Notulensi rapat evaluasi perangkat desa',

          deskripsi:
            'Notulensi rapat evaluasi perangkat desa.',

          jenis:
            'Notulensi',
        },

        {
          id:
            'ii-1-undangan-pengawasan-evaluasi',

          judul:
            'Undangan kegiatan pengawasan dan evaluasi kepada seluruh perangkat desa',

          deskripsi:
            'Undangan kegiatan pengawasan dan evaluasi kepada seluruh perangkat desa.',

          jenis:
            'Undangan',
        },

        {
          id:
            'ii-1-laporan-kinerja-perangkat-desa-2024',

          judul:
            'Laporan Kinerja Perangkat Desa Tahun 2024',

          deskripsi:
            'Laporan Pelaksanaan Pengawasan dan Evaluasi Kinerja Perangkat Desa Keji Tahun 2024.',

          jenis:
            'Laporan',

          tahun:
            2024,
        },
      ],
    },

    /* =====================================================
       II.2
       TINDAK LANJUT HASIL PENGAWASAN DAN AUDIT
    ===================================================== */

    {
      kode:
        'II.2',

      judul:
        'Tindak Lanjut Hasil Pengawasan dan Audit',

      ringkasan:
        'Dokumen dan bukti pendukung tindak lanjut hasil pengawasan, pemeriksaan, audit, pembahasan, dan penyelesaian hasil pemeriksaan Pemerintah Desa Keji.',

      icon:
        FileSearch,

      dokumen: [
        {
          id:
            'ii-2-surat-penyelesaian-ba-audit',

          judul:
            'Surat Penyelesaian dan BA tindak lanjut hasil audit',

          deskripsi:
            'Surat Penyelesaian dan BA tindak lanjut hasil audit.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'ii-2-surat-pernyataan',

          judul:
            'Surat Pernyataan',

          deskripsi:
            'Surat Pernyataan.',

          jenis:
            'Surat Pernyataan',
        },

        {
          id:
            'ii-2-dokumen-ba-pembahasan',

          judul:
            'Dokumen BA Pembahasan Desa Keji',

          deskripsi:
            'Dokumen BA Pembahasan Desa Keji.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'ii-2-dokumen-lhp-desa-keji',

          judul:
            'Dokumen LHP Desa Keji',

          deskripsi:
            'Dokumen LHP Desa Keji.',

          jenis:
            'Laporan',
        },
      ],
    },

    /* =====================================================
       II.3
       PENCEGAHAN TINDAK PIDANA KORUPSI
    ===================================================== */

    {
      kode:
        'II.3',

      judul:
        'Pencegahan Tindak Pidana Korupsi Aparatur Desa',

      ringkasan:
        'Dokumen dan bukti pendukung pencegahan tindak pidana korupsi serta penguatan integritas aparatur Pemerintah Desa Keji.',

      icon:
        ShieldCheck,

      dokumen: [
        {
          id:
            'ii-3-surat-keterangan-aph',

          judul:
            'Surat Keterangan dari APH aparatur Desa Keji Tidak Terlibat Tindak Pidana Korupsi',

          deskripsi:
            'Surat Keterangan dari APH aparatur Desa Keji Tidak Terlibat Tindak Pidana Korupsi.',

          jenis:
            'Surat Keterangan',
        },

        {
          id:
            'ii-3-surat-pernyataan-kades-1',

          judul:
            'Surat Pernyataan oleh kepala desa tidak adanya aparatur desa yang terlibat korupsi',

          deskripsi:
            'Surat Pernyataan oleh kepala desa tidak adanya aparatur desa yang terlibat korupsi.',

          jenis:
            'Surat Pernyataan',
        },

        {
          id:
            'ii-3-surat-pernyataan-kades-2',

          judul:
            'Surat Pernyataan oleh kepala desa tidak adanya aparatur desa yang terlibat korupsi',

          deskripsi:
            'Surat Pernyataan oleh kepala desa tidak adanya aparatur desa yang terlibat korupsi.',

          jenis:
            'Surat Pernyataan',
        },

        {
          id:
            'ii-3-sp-kades',

          judul:
            'SP KADES',

          deskripsi:
            'SP KADES.',

          jenis:
            'Surat Pernyataan',
        },

        {
          id:
            'ii-3-informasi-perangkat-desa-anti-korupsi',

          judul:
            'Informasi Perangkat Desa Anti Korupsi',

          deskripsi:
            'Informasi Perangkat Desa Anti Korupsi Desa Keji.',

          jenis:
            'Dokumen Lainnya',
        },
      ],
    },
  ];

/* =========================================================
   COMPONENT
========================================================= */

export default function PengawasanClient() {
  const [
    indikatorAktif,
    setIndikatorAktif,
  ] =
    useState(
      0
    );

  const [
    pencarian,
    setPencarian,
  ] =
    useState(
      ''
    );

  /* =======================================================
     CURRENT INDICATOR
  ======================================================= */

  const indikator =
    indikatorPengawasan[
      indikatorAktif
    ] ??
    indikatorPengawasan[
      0
    ];

  /* =======================================================
     SEARCH
  ======================================================= */

  const dokumenTersaring =
    useMemo(
      () => {
        const query =
          pencarian
            .trim()
            .toLowerCase();

        if (
          !query
        ) {
          return indikator.dokumen;
        }

        return indikator.dokumen.filter(
          (
            dokumen
          ) =>
            [
              dokumen.judul,
              dokumen.deskripsi,
              dokumen.jenis,
              dokumen.tahun,
            ]
              .join(
                ' '
              )
              .toLowerCase()
              .includes(
                query
              )
        );
      },
      [
        indikator,
        pencarian,
      ]
    );

  /* =======================================================
     CHANGE INDICATOR
  ======================================================= */

  function pilihIndikator(
    index:
      number
  ) {
    setIndikatorAktif(
      index
    );

    setPencarian(
      ''
    );

    /*
     * Mobile:
     * setelah memilih indikator,
     * scroll langsung ke konten.
     */

    if (
      typeof window !==
        'undefined' &&
      window.innerWidth <
        1024
    ) {
      window.setTimeout(
        () => {
          document
            .getElementById(
              'bukti-pengawasan'
            )
            ?.scrollIntoView({
              behavior:
                'smooth',

              block:
                'start',
            });
        },
        80
      );
    }
  }

  return (
    <div className="min-w-0">
      {/* =====================================================
          MOBILE NAVIGATION
      ===================================================== */}

      <section className="mb-6 lg:hidden">
        <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
          {/* HEADER */}

          <div className="mb-3 flex items-center gap-3 px-2 pt-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <FolderOpen
                size={20}
              />
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                Penguatan Pengawasan
              </p>

              <h2 className="text-base font-black text-slate-900">
                Pilih Indikator
              </h2>
            </div>
          </div>

          {/* ITEMS */}

          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {indikatorPengawasan.map(
              (
                item,
                index
              ) => {
                const aktif =
                  indikatorAktif ===
                  index;

                return (
                  <button
                    key={
                      item.kode
                    }
                    type="button"
                    onClick={() =>
                      pilihIndikator(
                        index
                      )
                    }
                    className={`min-w-[150px] shrink-0 rounded-xl border px-4 py-3 text-left transition ${
                      aktif
                        ? 'border-emerald-700 bg-emerald-700 text-white shadow-md'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50'
                    }`}
                  >
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em]">
                      Indikator
                    </p>

                    <p className="mt-1 text-sm font-black">
                      {
                        item.kode
                      }
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

      {/* =====================================================
          DESKTOP GRID
      ===================================================== */}

      <div className="grid min-w-0 gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[330px_minmax(0,1fr)] xl:gap-8">
        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside className="hidden min-w-0 lg:block">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* HEADER */}

            <div className="border-b border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <FolderOpen
                    size={21}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Pengawasan
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-900">
                    Kategori Indikator
                  </h2>
                </div>
              </div>
            </div>

            {/* NAVIGATION */}

            <nav className="space-y-2 p-3">
              {indikatorPengawasan.map(
                (
                  item,
                  index
                ) => {
                  const Icon =
                    item.icon;

                  const aktif =
                    indikatorAktif ===
                    index;

                  return (
                    <button
                      key={
                        item.kode
                      }
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
                      {/* ICON */}

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

                      {/* TEXT */}

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em]">
                          Indikator{' '}
                          {
                            item.kode
                          }
                        </p>

                        <p className="mt-1.5 break-words text-xs font-bold leading-5">
                          {
                            item.judul
                          }
                        </p>

                        <p
                          className={`mt-2 text-[10px] font-semibold ${
                            aktif
                              ? 'text-emerald-100'
                              : 'text-slate-400'
                          }`}
                        >
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

        {/* ===================================================
            DOCUMENT AREA
        =================================================== */}

        <section
          id="bukti-pengawasan"
          className="min-w-0 scroll-mt-28"
        >
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* ===============================================
                HEADER
            =============================================== */}

            <header className="border-b border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-white p-5 sm:p-6 xl:p-8">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                {/* TITLE */}

                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                    <CheckCircle2
                      size={22}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                      Indikator{' '}
                      {
                        indikator.kode
                      }
                    </p>

                    <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
                      Bukti Dukung
                      Pengawasan
                    </h2>

                    <p className="mt-3 text-sm font-bold leading-6 text-slate-700">
                      {
                        indikator.judul
                      }
                    </p>

                    <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500">
                      {
                        indikator.ringkasan
                      }
                    </p>
                  </div>
                </div>

                {/* COUNT */}

                <div className="w-fit shrink-0 rounded-2xl border border-emerald-200 bg-white px-5 py-4 shadow-sm">
                  <p className="text-2xl font-black text-emerald-700">
                    {
                      indikator.dokumen
                        .length
                    }
                  </p>

                  <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500">
                    Dokumen
                  </p>
                </div>
              </div>

              {/* ===============================================
                  SEARCH
              =============================================== */}

              <div className="relative mt-6">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={
                    pencarian
                  }
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

            {/* ===============================================
                DOCUMENT LIST
            =============================================== */}

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
                    Kata kunci
                    pencarian tidak
                    sesuai dengan
                    dokumen yang
                    tersedia.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   DOCUMENT CARD
========================================================= */

function DokumenCard({
  dokumen,
  nomor,
}: {
  dokumen:
    DokumenPengawasan;

  nomor:
    number;
}) {
  return (
    <article className="group flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg sm:p-5">
      {/* ===================================================
          TOP
      =================================================== */}

      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {/* TYPE */}

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-emerald-700">
            <FileText
              size={12}
            />

            {
              dokumen.jenis
            }
          </span>

          {/* YEAR */}

          {dokumen.tahun && (
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-extrabold text-blue-700">
              {
                dokumen.tahun
              }
            </span>
          )}
        </div>

        {/* NUMBER */}

        <span className="shrink-0 text-xs font-black text-slate-300">
          {String(
            nomor
          ).padStart(
            2,
            '0'
          )}
        </span>
      </div>

      {/* ===================================================
          TITLE
      =================================================== */}

      <h3 className="mt-4 break-words text-base font-black leading-6 text-slate-900 transition group-hover:text-emerald-800">
        {
          dokumen.judul
        }
      </h3>

      {/* ===================================================
          DESCRIPTION
      =================================================== */}

      <p className="mt-3 flex-1 text-sm font-medium leading-6 text-slate-500">
        {
          dokumen.deskripsi
        }
      </p>

      {/* ===================================================
          ACTION
      =================================================== */}

      <div className="mt-5 border-t border-slate-100 pt-4">
        {dokumen.href ? (
          <a
            href={
              dokumen.href
            }
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
        ) : (
          <span className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-extrabold text-slate-400">
            <FileText
              size={15}
            />

            Dokumen Belum Ditautkan
          </span>
        )}
      </div>
    </article>
  );
}