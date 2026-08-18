// components/anti-korupsi/PartisipasiMasyarakatClient.tsx

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
  Handshake,
  Search,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

/* =========================================================
   TYPES
========================================================= */

interface DokumenPartisipasi {
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
   * Isi href kalau dokumen sudah tersedia.
   *
   * File lokal:
   *
   * href:
   * '/documents/anti-korupsi/partisipasi/iv-1/nama-file.pdf'
   *
   * Google Drive:
   *
   * href:
   * 'https://drive.google.com/file/d/ID_FILE/view'
   */
  href?:
    string;
}

interface IndikatorPartisipasi {
  kode:
    string;

  judul:
    string;

  ringkasan:
    string;

  icon:
    LucideIcon;

  dokumen:
    DokumenPartisipasi[];
}

/* =========================================================
   DATA

   IV.1 = gambar pertama
   IV.2 = gambar kedua
   IV.3 = gambar ketiga

   IV.1 = 9 dokumen
   IV.2 = 11 dokumen
   IV.3 = 3 dokumen

   TOTAL = 23 DOKUMEN
========================================================= */

const indikatorPartisipasi:
  IndikatorPartisipasi[] = [
    /* =====================================================
       IV.1
       GAMBAR PERTAMA
    ===================================================== */

    {
      kode:
        'IV.1',

      judul:
        'Partisipasi Masyarakat dalam Perencanaan Desa',

      ringkasan:
        'Dokumen pendukung keterlibatan masyarakat dalam proses perencanaan Desa Keji melalui Musyawarah Desa, Musyawarah Dusun, serta penyusunan RKPDes.',

      icon:
        ClipboardCheck,

      dokumen: [
        {
          id:
            'iv-1-sk-tim-penyusun-rkpdes',

          judul:
            'SK Tim Penyusun RKPDes',

          deskripsi:
            'SK Tim Penyusun RKPDes.',

          jenis:
            'Surat Keputusan',
        },

        {
          id:
            'iv-1-dokumentasi-musyawarah-desa',

          judul:
            'Dokumentasi Musyawarah Desa',

          deskripsi:
            'Dokumentasi Musyawarah Desa.',

          jenis:
            'Dokumentasi',
        },

        {
          id:
            'iv-1-daftar-hadir-musyawarah-desa',

          judul:
            'Daftar Hadir Musyawarah Desa',

          deskripsi:
            'Daftar Hadir Musyawarah Desa.',

          jenis:
            'Daftar Hadir',
        },

        {
          id:
            'iv-1-notulensi-musyawarah-desa',

          judul:
            'Notulensi Musyawarah Desa',

          deskripsi:
            'Notulensi Musyawarah Desa.',

          jenis:
            'Notulensi',
        },

        {
          id:
            'iv-1-undangan-musyawarah-desa',

          judul:
            'Undangan Musyawarah Desa',

          deskripsi:
            'Undangan Musyawarah Desa.',

          jenis:
            'Undangan',
        },

        {
          id:
            'iv-1-dokumentasi-musyawarah-dusun',

          judul:
            'Dokumentasi Musyawarah Dusun',

          deskripsi:
            'Dokumentasi Musyawarah Dusun.',

          jenis:
            'Dokumentasi',
        },

        {
          id:
            'iv-1-daftar-hadir-musyawarah-dusun',

          judul:
            'Daftar Hadir Musyawarah Dusun',

          deskripsi:
            'Daftar Hadir Musyawarah Dusun.',

          jenis:
            'Daftar Hadir',
        },

        {
          id:
            'iv-1-notulensi-musyawarah-dusun',

          judul:
            'Notulensi Musyawarah Dusun',

          deskripsi:
            'Notulensi Musyawarah Dusun.',

          jenis:
            'Notulensi',
        },

        {
          id:
            'iv-1-undangan-musyawarah-dusun',

          judul:
            'Undangan Musyawarah Dusun',

          deskripsi:
            'Undangan Musyawarah Dusun.',

          jenis:
            'Undangan',
        },
      ],
    },

    /* =====================================================
       IV.2
       GAMBAR KEDUA
    ===================================================== */

    {
      kode:
        'IV.2',

      judul:
        'Partisipasi Masyarakat dalam Pencegahan Gratifikasi, Suap, dan Konflik Kepentingan',

      ringkasan:
        'Dokumen pendukung sosialisasi, deklarasi, survei, serta tindak lanjut yang melibatkan masyarakat dalam pencegahan gratifikasi, suap, dan konflik kepentingan.',

      icon:
        ShieldCheck,

      dokumen: [
        /* =================================================
           DEKLARASI 1
        ================================================= */

        {
          id:
            'iv-2-deklarasi-konflik-kepentingan-1',

          judul:
            'Deklarasi konflik kepentingan',

          deskripsi:
            'Deklarasi konflik kepentingan.',

          jenis:
            'Dokumen Lainnya',
        },

        /* =================================================
           DEKLARASI 2

           Pada sumber memang muncul dua dokumen
           dengan judul yang sama.
        ================================================= */

        {
          id:
            'iv-2-deklarasi-konflik-kepentingan-2',

          judul:
            'Deklarasi konflik kepentingan',

          deskripsi:
            'Deklarasi konflik kepentingan.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'iv-2-deklarasi-konflik-kepentingan-kepala-desa',

          judul:
            'Deklarasi konflik kepentingan kepala desa',

          deskripsi:
            'Deklarasi konflik kepentingan.',

          jenis:
            'Dokumen Lainnya',
        },

        /* =================================================
           DOKUMENTASI SOSIALISASI 1
        ================================================= */

        {
          id:
            'iv-2-dokumentasi-sosialisasi-1',

          judul:
            'Dokumentasi Sosialisasi perkades gratifikasi, suap dan konflik kepentingan kepada masyarakat',

          deskripsi:
            'Dokumentasi Sosialisasi perkades gratifikasi, suap dan konflik kepentingan kepada masyarakat.',

          jenis:
            'Dokumentasi',
        },

        /* =================================================
           DOKUMENTASI SOSIALISASI 2

           Pada sumber juga muncul dua dokumen
           dengan judul yang sama.
        ================================================= */

        {
          id:
            'iv-2-dokumentasi-sosialisasi-2',

          judul:
            'Dokumentasi Sosialisasi perkades gratifikasi, suap dan konflik kepentingan kepada masyarakat',

          deskripsi:
            'Dokumentasi Sosialisasi perkades gratifikasi, suap dan konflik kepentingan kepada masyarakat.',

          jenis:
            'Dokumentasi',
        },

        {
          id:
            'iv-2-notulensi-sosialisasi',

          judul:
            'Notulensi Sosialisasi perkades gratifikasi, suap dan konflik kepentingan kepada masyarakat',

          deskripsi:
            'Notulensi Sosialisasi perkades gratifikasi, suap dan konflik kepentingan kepada masyarakat.',

          jenis:
            'Notulensi',
        },

        {
          id:
            'iv-2-daftar-hadir-sosialisasi',

          judul:
            'Daftar Hadir Sosialisasi perkades gratifikasi, suap dan konflik kepentingan kepada masyarakat',

          deskripsi:
            'Daftar Hadir Sosialisasi perkades gratifikasi, suap dan konflik kepentingan kepada masyarakat.',

          jenis:
            'Daftar Hadir',
        },

        {
          id:
            'iv-2-surat-sosialisasi',

          judul:
            'surat Sosialisasi perkades gratifikasi, suap dan konflik kepentingan kepada masyarakat',

          deskripsi:
            'surat Sosialisasi perkades gratifikasi, suap dan konflik kepentingan kepada masyarakat.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'iv-2-surat-edaran',

          judul:
            'Surat edaran terkait gratifikasi, suap dan konflik kepentingan',

          deskripsi:
            'Surat edaran terkait gratifikasi, suap dan konflik kepentingan.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'iv-2-hasil-rekapitulasi-analisis-tindak-lanjut',

          judul:
            'Hasil rekapitulasi, analisis dan tindak lanjut',

          deskripsi:
            'Hasil rekapitulasi, analisis dan tindak lanjut.',

          jenis:
            'Laporan',
        },

        {
          id:
            'iv-2-survey-perilaku-masyarakat',

          judul:
            'Survey perilaku masyarakat tentang gratifikasi dan suap',

          deskripsi:
            'Survey perilaku masyarakat tentang gratifikasi dan suap.',

          jenis:
            'Laporan',
        },
      ],
    },

    /* =====================================================
       IV.3
       GAMBAR KETIGA
    ===================================================== */

    {
      kode:
        'IV.3',

      judul:
        'Partisipasi Masyarakat dalam Pelaksanaan Pembangunan Desa',

      ringkasan:
        'Dokumen pendukung keterlibatan masyarakat dalam pelaksanaan pembangunan Desa Keji, termasuk pelaksanaan pembangunan rabat beton Dusun Suruhan.',

      icon:
        Handshake,

      dokumen: [
        {
          id:
            'iv-3-landa-terima-pembayaran-pembangunan',

          /*
           * Judul mengikuti sumber yang diberikan.
           */
          judul:
            'Landa terima pembayaran pelanksanaan pembangunan Desa',

          deskripsi:
            'LPJ pelanksanaan pembangunan Desa.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'iv-3-notulensi-pembangunan-rabat-beton-suruhan',

          judul:
            'Notulensi pembangunan rabat beton Dusun Suruhan',

          deskripsi:
            'Notulensi pembangunan rabat beton Dusun Suruhan.',

          jenis:
            'Notulensi',
        },

        {
          id:
            'iv-3-undangan-pembangunan-rabat-beton-suruhan',

          judul:
            'Undangan pembangunan rabat beton Dusun Suruhan',

          deskripsi:
            'Undangan pembangunan rabat beton Dusun Suruhan.',

          jenis:
            'Undangan',
        },
      ],
    },
  ];

/* =========================================================
   COMPONENT
========================================================= */

export default function PartisipasiMasyarakatClient() {
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
    indikatorPartisipasi[
      indikatorAktif
    ] ??
    indikatorPartisipasi[
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
              'bukti-partisipasi'
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
          <div className="mb-3 flex items-center gap-3 px-2 pt-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <FolderOpen
                size={20}
              />
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                Partisipasi Masyarakat
              </p>

              <h2 className="text-base font-black text-slate-900">
                Pilih Indikator
              </h2>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {indikatorPartisipasi.map(
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
                    className={`min-w-[160px] shrink-0 rounded-xl border px-4 py-3 text-left transition ${
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
                    Partisipasi
                    Masyarakat
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-900">
                    Kategori Indikator
                  </h2>
                </div>
              </div>
            </div>

            {/* NAV */}

            <nav className="space-y-2 p-3">
              {indikatorPartisipasi.map(
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
            DOCUMENT CONTENT
        =================================================== */}

        <section
          id="bukti-partisipasi"
          className="min-w-0 scroll-mt-28"
        >
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* ===============================================
                HEADER
            =============================================== */}

            <header className="border-b border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-white p-5 sm:p-6 xl:p-8">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                {/* INFO */}

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
                      Partisipasi
                      Masyarakat
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
                DOCUMENTS
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
    DokumenPartisipasi;

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