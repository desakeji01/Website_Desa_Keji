// components/anti-korupsi/PelayananPublikClient.tsx

'use client';

import {
  useMemo,
  useState,
} from 'react';

import {
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ExternalLink,
  FileCheck2,
  FileSearch,
  FileText,
  FolderOpen,
  Megaphone,
  Search,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

/* =========================================================
   TYPES
========================================================= */

interface DokumenPelayanan {
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
   * FILE LOKAL:
   *
   * href:
   * '/documents/anti-korupsi/pelayanan-publik/iii-1/file.pdf'
   *
   * GOOGLE DRIVE:
   *
   * href:
   * 'https://drive.google.com/file/d/ID_FILE/view'
   *
   * WEBSITE:
   *
   * href:
   * 'https://keji-ungaranbarat.semarangkab.go.id'
   */
  href?:
    string;
}

interface IndikatorPelayanan {
  kode:
    string;

  judul:
    string;

  ringkasan:
    string;

  icon:
    LucideIcon;

  dokumen:
    DokumenPelayanan[];
}

/* =========================================================
   DATA

   III.1 = GAMBAR 1 = 3 DOKUMEN
   III.2 = GAMBAR 2 = 1 DOKUMEN
   III.3 = GAMBAR 3 = 12 DOKUMEN
   III.4 = GAMBAR 4 = 5 DOKUMEN
   III.5 = GAMBAR 5 = 3 DOKUMEN

   TOTAL = 24 DOKUMEN
========================================================= */

const indikatorPelayanan:
  IndikatorPelayanan[] = [
    /* =====================================================
       III.1
       GAMBAR PERTAMA
    ===================================================== */

    {
      kode:
        'III.1',

      judul:
        'Survei Kepuasan Masyarakat terhadap Pelayanan Desa',

      ringkasan:
        'Dokumen pendukung pelaksanaan Survei Kepuasan Masyarakat sebagai bahan evaluasi dan peningkatan kualitas pelayanan Pemerintah Desa Keji.',

      icon:
        BarChart3,

      dokumen: [
        {
          id:
            'iii-1-pedoman-survey-kepuasan-masyarakat',

          judul:
            'Pedoman Penyusunan survey kepuasan masyarakat',

          deskripsi:
            'Pedoman Penyusunan survey kepuasan masyarakat.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'iii-1-hasil-survey-kepuasan-pelayanan',

          judul:
            'Hasil survey kepuasan pelayanan Desa Keji',

          deskripsi:
            'Hasil survey kepuasan pelayanan Desa Keji.',

          jenis:
            'Laporan',
        },

        {
          id:
            'iii-1-survey-kepuasan-pelayanan',

          judul:
            'survey kepuasan pelayanan',

          deskripsi:
            'survey kepuasan pelayanan.',

          jenis:
            'Dokumen Lainnya',
        },
      ],
    },

    /* =====================================================
       III.2
       GAMBAR KEDUA
    ===================================================== */

    {
      kode:
        'III.2',

      judul:
        'Media Informasi Standar Pelayanan',

      ringkasan:
        'Media informasi pelayanan digunakan untuk memberikan keterbukaan informasi mengenai standar dan mekanisme pelayanan kepada masyarakat Desa Keji.',

      icon:
        FileSearch,

      dokumen: [
        {
          id:
            'iii-2-media-informasi-spm',

          judul:
            'Media Informasi SPM',

          deskripsi:
            'Media Informasi SPM.',

          jenis:
            'Dokumen Lainnya',
        },
      ],
    },

    /* =====================================================
       III.3
       GAMBAR KETIGA

       Sumber menampilkan 12 dokumen dengan
       judul yang sama. Semua tetap dipertahankan
       sebagai item berbeda.
    ===================================================== */

    {
      kode:
        'III.3',

      judul:
        'Keterbukaan Informasi APBDes melalui Baliho atau Poster',

      ringkasan:
        'Bukti publikasi informasi APBDes Desa Keji melalui baliho atau poster sebagai bentuk transparansi informasi anggaran kepada masyarakat.',

      icon:
        ClipboardCheck,

      dokumen: [
        {
          id:
            'iii-3-poster-apbdes-01',

          judul:
            'Baliho / poster APBDES DESA KEJI',

          deskripsi:
            'Baliho / poster APBDES DESA KEJI.',

          jenis:
            'Infografis',
        },

        {
          id:
            'iii-3-poster-apbdes-02',

          judul:
            'Baliho / poster APBDES DESA KEJI',

          deskripsi:
            'Baliho / poster APBDES DESA KEJI.',

          jenis:
            'Infografis',
        },

        {
          id:
            'iii-3-poster-apbdes-03',

          judul:
            'Baliho / poster APBDES DESA KEJI',

          deskripsi:
            'Baliho / poster APBDES DESA KEJI.',

          jenis:
            'Infografis',
        },

        {
          id:
            'iii-3-poster-apbdes-04',

          judul:
            'Baliho / poster APBDES DESA KEJI',

          deskripsi:
            'Baliho / poster APBDES DESA KEJI.',

          jenis:
            'Infografis',
        },

        {
          id:
            'iii-3-poster-apbdes-05',

          judul:
            'Baliho / poster APBDES DESA KEJI',

          deskripsi:
            'Baliho / poster APBDES DESA KEJI.',

          jenis:
            'Infografis',
        },

        {
          id:
            'iii-3-poster-apbdes-06',

          judul:
            'Baliho / poster APBDES DESA KEJI',

          deskripsi:
            'Baliho / poster APBDES DESA KEJI.',

          jenis:
            'Infografis',
        },

        {
          id:
            'iii-3-poster-apbdes-07',

          judul:
            'Baliho / poster APBDES DESA KEJI',

          deskripsi:
            'Baliho / poster APBDES DESA KEJI.',

          jenis:
            'Infografis',
        },

        {
          id:
            'iii-3-poster-apbdes-08',

          judul:
            'Baliho / poster APBDES DESA KEJI',

          deskripsi:
            'Baliho / poster APBDES DESA KEJI.',

          jenis:
            'Infografis',
        },

        {
          id:
            'iii-3-poster-apbdes-09',

          judul:
            'Baliho / poster APBDES DESA KEJI',

          deskripsi:
            'Baliho / poster APBDES DESA KEJI.',

          jenis:
            'Infografis',
        },

        {
          id:
            'iii-3-poster-apbdes-10',

          judul:
            'Baliho / poster APBDES DESA KEJI',

          deskripsi:
            'Baliho / poster APBDES DESA KEJI.',

          jenis:
            'Infografis',
        },

        {
          id:
            'iii-3-poster-apbdes-11',

          judul:
            'Baliho / poster APBDES DESA KEJI',

          deskripsi:
            'Baliho / poster APBDES DESA KEJI.',

          jenis:
            'Infografis',
        },

        {
          id:
            'iii-3-poster-apbdes-12',

          judul:
            'Baliho / poster APBDES DESA KEJI',

          deskripsi:
            'Baliho / poster APBDES DESA KEJI.',

          jenis:
            'Infografis',
        },
      ],
    },

    /* =====================================================
       III.4
       GAMBAR KEEMPAT
    ===================================================== */

    {
      kode:
        'III.4',

      judul:
        'Maklumat Pelayanan Pemerintah Desa Keji',

      ringkasan:
        'Dokumen maklumat pelayanan sebagai bentuk komitmen Pemerintah Desa Keji dalam memberikan pelayanan yang berkualitas, transparan, dan sesuai ketentuan.',

      icon:
        BadgeCheck,

      dokumen: [
        {
          id:
            'iii-4-maklumat-pelayanan-01',

          judul:
            'Maklumat Pelayanan',

          deskripsi:
            'Maklumat Pelayanan.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'iii-4-maklumat-pelayanan-02',

          judul:
            'Maklumat Pelayanan',

          deskripsi:
            'Maklumat Pelayanan.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'iii-4-maklumat-pelayanan-03',

          judul:
            'Maklumat Pelayanan',

          deskripsi:
            'Maklumat Pelayanan.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'iii-4-maklumat-pelayanan-desa-keji',

          judul:
            'Maklumat Pelayanan Desa Keji',

          deskripsi:
            'MAKLUMAT PELAYANAN.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'iii-4-maklumat-pelayanan-desa-keji-kades',

          judul:
            'Maklumat Pelayanan Desa Keji Kades',

          deskripsi:
            'MAKLUMAT PELAYANAN Desa Keji.',

          jenis:
            'Dokumen Lainnya',
        },
      ],
    },

    /* =====================================================
       III.5
       GAMBAR KELIMA
    ===================================================== */

    {
      kode:
        'III.5',

      judul:
        'Prosedur, Media, dan Saluran Pengaduan Masyarakat',

      ringkasan:
        'Dokumen pendukung prosedur pengaduan, media informasi pengaduan, serta kanal pelayanan dan tindak lanjut pengaduan masyarakat Desa Keji.',

      icon:
        Megaphone,

      dokumen: [
        {
          id:
            'iii-5-prosedur-baku-saluran-pengaduan',

          judul:
            'Prosedur Baku dan Saluran Pengaduan',

          deskripsi:
            'Prosedur Baku dan Saluran Pengaduan.',

          jenis:
            'SOP',
        },

        {
          id:
            'iii-5-media-informasi-pengaduan',

          judul:
            'Media Informasi Pengaduan',

          deskripsi:
            'Media Informasi Pengaduan.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'iii-5-website-pelayanan-pengaduan',

          judul:
            'https://keji-ungaranbarat.semarangkab.go.id',

          deskripsi:
            'PROSEDUR PELAYANAN, PENGADUAN DAN TINDAK LANJUT KEJI.',

          jenis:
            'Dokumen Lainnya',

          href:
            'https://keji-ungaranbarat.semarangkab.go.id',
        },
      ],
    },
  ];

/* =========================================================
   COMPONENT
========================================================= */

export default function PelayananPublikClient() {
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
     ACTIVE INDICATOR
  ======================================================= */

  const indikator =
    indikatorPelayanan[
      indikatorAktif
    ] ??
    indikatorPelayanan[
      0
    ];

  /* =======================================================
     FILTER
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
     SELECT INDICATOR
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
              'bukti-pelayanan-publik'
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
          MOBILE NAV
      ===================================================== */}

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
                Pelayanan Publik
              </p>

              <h2 className="text-base font-black text-slate-900">
                Pilih Indikator
              </h2>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {indikatorPelayanan.map(
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
            <div className="border-b border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <FolderOpen
                    size={21}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Pelayanan Publik
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-900">
                    Kategori Indikator
                  </h2>
                </div>
              </div>
            </div>

            <nav className="space-y-2 p-3">
              {indikatorPelayanan.map(
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
            CONTENT
        =================================================== */}

        <section
          id="bukti-pelayanan-publik"
          className="min-w-0 scroll-mt-28"
        >
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* HEADER */}

            <header className="border-b border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-white p-5 sm:p-6 xl:p-8">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
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
                      Pelayanan Publik
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

              {/* SEARCH */}

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

            {/* DOCUMENT LIST */}

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
    DokumenPelayanan;

  nomor:
    number;
}) {
  return (
    <article className="group flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg sm:p-5">
      {/* TOP */}

      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-emerald-700">
            <FileText
              size={12}
            />

            {
              dokumen.jenis
            }
          </span>

          {dokumen.tahun && (
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-extrabold text-blue-700">
              {
                dokumen.tahun
              }
            </span>
          )}
        </div>

        <span className="shrink-0 text-xs font-black text-slate-300">
          {String(
            nomor
          ).padStart(
            2,
            '0'
          )}
        </span>
      </div>

      {/* TITLE */}

      <h3 className="mt-4 break-words text-base font-black leading-6 text-slate-900 transition group-hover:text-emerald-800">
        {
          dokumen.judul
        }
      </h3>

      {/* DESCRIPTION */}

      <p className="mt-3 flex-1 text-sm font-medium leading-6 text-slate-500">
        {
          dokumen.deskripsi
        }
      </p>

      {/* ACTION */}

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