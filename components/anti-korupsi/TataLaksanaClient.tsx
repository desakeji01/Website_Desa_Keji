// components/anti-korupsi/TataLaksanaClient.tsx

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
  Clock3,
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

interface DokumenTataLaksana {
  id: string;

  judul: string;

  deskripsi: string;

  jenis:
    | 'Undangan'
    | 'Notulensi'
    | 'Daftar Hadir'
    | 'Dokumentasi'
    | 'Peraturan'
    | 'Laporan'
    | 'Infografis'
    | 'SOP'
    | 'Surat Keputusan'
    | 'Pakta Integritas'
    | 'Dokumen Lainnya';

  href?: string;
}

interface IndikatorTataLaksana {
  kode: string;

  judul: string;

  ringkasan: string;

  icon: LucideIcon;

  dokumen: DokumenTataLaksana[];
}

/*
 * Untuk menambahkan tautan dokumen lokal:
 *
 * {
 *   id: 'nama-dokumen',
 *   judul: 'Nama Dokumen',
 *   deskripsi: 'Deskripsi dokumen.',
 *   jenis: 'Peraturan',
 *   href:
 *     '/documents/anti-korupsi/tata-laksana/nama-file.pdf',
 * }
 *
 * Untuk Google Drive:
 *
 * href:
 *   'https://drive.google.com/file/d/ID_FILE/view'
 */

const indikatorTataLaksana:
  IndikatorTataLaksana[] = [
    /* =====================================================
       I.1
    ===================================================== */

    {
      kode: 'I.1',

      judul:
        'Keberadaan Perdes tentang Perencanaan, Pelaksanaan, Penatausahaan, dan Pertanggungjawaban APBDes',

      ringkasan:
        'Dokumen perencanaan, pelaksanaan, penatausahaan, pelaporan, dan pertanggungjawaban Anggaran Pendapatan dan Belanja Desa.',

      icon: ClipboardCheck,

      dokumen: [
        {
          id:
            'undangan-pakta-integritas-2025',

          judul:
            'Undangan Penandatanganan Pakta Integritas 2025',

          deskripsi:
            'Undangan pelaksanaan penandatanganan Pakta Integritas Pemerintah Desa Keji Tahun 2025.',

          jenis:
            'Undangan',
        },

        {
          id:
            'undangan-rpjmdes',

          judul:
            'Undangan Penyusunan Regulasi RPJMDes kepada Seluruh Aparatur Desa',

          deskripsi:
            'Undangan penyusunan regulasi Rencana Pembangunan Jangka Menengah Desa.',

          jenis:
            'Undangan',
        },

        {
          id:
            'undangan-musrenbangdes',

          judul:
            'Undangan Penyusunan Regulasi Musrenbangdes kepada Seluruh Aparatur Desa',

          deskripsi:
            'Undangan pelaksanaan musyawarah perencanaan pembangunan Desa Keji.',

          jenis:
            'Undangan',
        },

        {
          id:
            'undangan-rkpdes',

          judul:
            'Undangan Penyusunan Regulasi RKPDes kepada Seluruh Aparatur Desa',

          deskripsi:
            'Undangan penyusunan Rencana Kerja Pemerintah Desa.',

          jenis:
            'Undangan',
        },

        {
          id:
            'undangan-apbdes-perubahan',

          judul:
            'Undangan Penyusunan Regulasi APBDes Perubahan kepada Seluruh Aparatur Desa',

          deskripsi:
            'Undangan pembahasan dan penyusunan perubahan APBDes Desa Keji.',

          jenis:
            'Undangan',
        },

        {
          id:
            'undangan-apbdes',

          judul:
            'Undangan Penyusunan Regulasi APBDes kepada Seluruh Aparatur Desa',

          deskripsi:
            'Undangan pembahasan dan penyusunan APBDes Desa Keji.',

          jenis:
            'Undangan',
        },

        {
          id:
            'notulensi-rpjmdes',

          judul:
            'Notulensi Penyusunan Regulasi RPJMDes',

          deskripsi:
            'Catatan hasil pembahasan penyusunan regulasi RPJMDes.',

          jenis:
            'Notulensi',
        },

        {
          id:
            'notulensi-musrenbangdes',

          judul:
            'Notulensi Penyusunan Regulasi Musrenbangdes',

          deskripsi:
            'Catatan hasil pelaksanaan Musrenbangdes Desa Keji.',

          jenis:
            'Notulensi',
        },

        {
          id:
            'notulensi-rkpdes',

          judul:
            'Notulensi Penyusunan Regulasi RKPDes',

          deskripsi:
            'Catatan hasil pembahasan penyusunan RKPDes.',

          jenis:
            'Notulensi',
        },

        {
          id:
            'notulensi-apbdes',

          judul:
            'Notulensi Penyusunan Regulasi APBDes',

          deskripsi:
            'Catatan hasil pembahasan penyusunan APBDes Desa Keji.',

          jenis:
            'Notulensi',
        },

        {
          id:
            'daftar-hadir-musrenbangdes',

          judul:
            'Daftar Hadir Penyusunan Musrenbangdes',

          deskripsi:
            'Daftar kehadiran peserta dalam pelaksanaan Musrenbangdes.',

          jenis:
            'Daftar Hadir',
        },

        {
          id:
            'daftar-hadir-apbdes-perubahan',

          judul:
            'Daftar Hadir Penyusunan APBDes Perubahan',

          deskripsi:
            'Daftar kehadiran pembahasan perubahan APBDes.',

          jenis:
            'Daftar Hadir',
        },

        {
          id:
            'daftar-hadir-apbdes',

          judul:
            'Daftar Hadir Penyusunan APBDes',

          deskripsi:
            'Daftar kehadiran peserta penyusunan APBDes Desa Keji.',

          jenis:
            'Daftar Hadir',
        },

        {
          id:
            'daftar-hadir-rkpdes',

          judul:
            'Daftar Hadir Penyusunan RKPDes',

          deskripsi:
            'Daftar kehadiran peserta penyusunan RKPDes.',

          jenis:
            'Daftar Hadir',
        },

        {
          id:
            'dokumentasi-rkpdes',

          judul:
            'Dokumentasi Penyusunan Regulasi RKPDes',

          deskripsi:
            'Dokumentasi kegiatan pembahasan dan penyusunan RKPDes.',

          jenis:
            'Dokumentasi',
        },

        {
          id:
            'dokumentasi-rpjmdes',

          judul:
            'Dokumentasi Penyusunan Regulasi RPJMDes',

          deskripsi:
            'Dokumentasi kegiatan pembahasan dan penyusunan RPJMDes.',

          jenis:
            'Dokumentasi',
        },

        {
          id:
            'dokumentasi-apbdes-penetapan',

          judul:
            'Dokumentasi Penyusunan Regulasi APBDes Penetapan',

          deskripsi:
            'Dokumentasi pembahasan dan penetapan APBDes Desa Keji.',

          jenis:
            'Dokumentasi',
        },

        {
          id:
            'dokumentasi-apbdes-perubahan',

          judul:
            'Dokumentasi Penyusunan Regulasi APBDes Perubahan',

          deskripsi:
            'Dokumentasi pembahasan perubahan APBDes Desa Keji.',

          jenis:
            'Dokumentasi',
        },

        {
          id:
            'dokumentasi-musrenbangdes',

          judul:
            'Dokumentasi Penyusunan Regulasi Musrenbangdes',

          deskripsi:
            'Dokumentasi kegiatan Musrenbangdes Desa Keji.',

          jenis:
            'Dokumentasi',
        },

        {
          id:
            'laporan-pertanggungjawaban-bumdes',

          judul:
            'Laporan Tahunan Pertanggungjawaban BUM Desa',

          deskripsi:
            'Laporan tahunan pelaksanaan dan pertanggungjawaban pengelolaan BUM Desa.',

          jenis:
            'Laporan',
        },

        {
          id:
            'realisasi-apbdes-keji-2',

          judul:
            'Realisasi APBDes Keji 2',

          deskripsi:
            'Informasi realisasi APBDes Desa Keji tahun anggaran berjalan.',

          jenis:
            'Infografis',
        },

        {
          id:
            'realisasi-apbdes-keji',

          judul:
            'Realisasi APBDes Keji',

          deskripsi:
            'Informasi realisasi pendapatan dan belanja Desa Keji.',

          jenis:
            'Infografis',
        },

        {
          id:
            'apbdes-keji',

          judul:
            'APBDes Keji',

          deskripsi:
            'Informasi Anggaran Pendapatan dan Belanja Desa Keji.',

          jenis:
            'Infografis',
        },

        {
          id:
            'apbdes',

          judul:
            'APBDes',

          deskripsi:
            'Infografis APBDes Desa Keji tahun anggaran berjalan.',

          jenis:
            'Infografis',
        },

        {
          id:
            'infografis-apbdes',

          judul:
            'Infografis APBDes',

          deskripsi:
            'Infografis keterbukaan Anggaran Pendapatan dan Belanja Desa Keji.',

          jenis:
            'Infografis',
        },
      ],
    },

    /* =====================================================
       I.2
    ===================================================== */

    {
      kode: 'I.2',

      judul:
        'Keberadaan SOP mengenai Mekanisme Pengawasan dan Evaluasi Kinerja Perangkat Desa',

      ringkasan:
        'Dokumen regulasi, struktur organisasi, pelaksanaan evaluasi, serta bukti pendukung pengawasan dan penilaian kinerja perangkat Desa Keji.',

      icon:
        FileSearch,

      dokumen: [
        {
          id:
            'dokumentasi-penyusunan-regulasi-evaluasi',

          judul:
            'Dokumentasi Penyusunan Regulasi',

          deskripsi:
            'Dokumentasi kegiatan penyusunan regulasi mengenai pengawasan dan evaluasi kinerja perangkat Desa Keji.',

          jenis:
            'Dokumentasi',

          href:
            '/documents/anti-korupsi/tata-laksana/i-2/dokumentasi-penyusunan-regulasi-evaluasi.pdf',
        },

        {
          id:
            'daftar-hadir-penyusunan-regulasi-evaluasi',

          judul:
            'Daftar Hadir Penyusunan Regulasi',

          deskripsi:
            'Daftar hadir aparatur desa dalam kegiatan penyusunan regulasi pengawasan dan evaluasi kinerja perangkat desa.',

          jenis:
            'Daftar Hadir',
        },

        {
          id:
            'notulensi-penyusunan-regulasi-evaluasi',

          judul:
            'Notulensi Penyusunan Regulasi',

          deskripsi:
            'Notulensi hasil pembahasan penyusunan regulasi pengawasan dan evaluasi kinerja perangkat desa.',

          jenis:
            'Notulensi',
        },

        {
          id:
            'undangan-penyusunan-regulasi-evaluasi',

          judul:
            'Undangan Penyusunan Regulasi kepada Seluruh Aparatur Desa',

          deskripsi:
            'Undangan kepada seluruh aparatur desa untuk mengikuti penyusunan regulasi pengawasan dan evaluasi kinerja perangkat desa.',

          jenis:
            'Undangan',
        },

        {
          id:
            'perdes-nomor-4-tahun-2023-sotk',

          judul:
            'Perdes Nomor 4 Tahun 2023 tentang SOTK',

          deskripsi:
            'Peraturan Desa Keji Nomor 4 Tahun 2023 tentang Susunan Organisasi dan Tata Kerja Pemerintah Desa.',

          jenis:
            'Peraturan',
        },

        {
          id:
            'sotk-pemerintah-desa-keji',

          judul:
            'SOTK Pemerintah Desa Keji',

          deskripsi:
            'Bagan Susunan Organisasi dan Tata Kerja Pemerintah Desa Keji.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'perdes-nomor-9-tahun-2024',

          judul:
            'Peraturan Desa Keji Nomor 9 Tahun 2024',

          deskripsi:
            'Peraturan Desa Keji Nomor 9 Tahun 2024 tentang Pedoman Pelaksanaan Evaluasi Kinerja Perangkat Desa.',

          jenis:
            'Peraturan',
        },
      ],
    },

    /* =====================================================
       I.3
    ===================================================== */

    {
      kode: 'I.3',

      judul:
        'Keberadaan Perdes atau Keputusan Kepala Desa tentang Pengendalian Gratifikasi, Suap, dan Konflik Kepentingan',

      ringkasan:
        'Dokumen regulasi dan bukti pendukung mengenai pengendalian gratifikasi, pencegahan suap, serta penanganan benturan atau konflik kepentingan di lingkungan Pemerintah Desa Keji.',

      icon:
        ShieldCheck,

      dokumen: [
        {
          id:
            'format-lampiran-deklarasi-coi-1',

          judul:
            'Format Lampiran Deklarasi CoI (Conflict of Interest)',

          deskripsi:
            'Format lampiran deklarasi benturan atau konflik kepentingan bagi aparatur Pemerintah Desa Keji.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'format-lampiran-deklarasi-coi-2',

          judul:
            'Format Lampiran Deklarasi CoI (Conflict of Interest)',

          deskripsi:
            'Dokumen format pernyataan deklarasi conflict of interest dalam pelaksanaan tugas pemerintahan desa.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'format-lampiran-deklarasi-coi-3',

          judul:
            'Format Lampiran Deklarasi CoI (Conflict of Interest)',

          deskripsi:
            'Lampiran deklarasi konflik kepentingan sebagai bagian dari penerapan tata kelola pemerintahan yang berintegritas.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'daftar-hadir-penyusunan-regulasi-i-3',

          judul:
            'Daftar Hadir Penyusunan Regulasi',

          deskripsi:
            'Daftar kehadiran aparatur desa dalam kegiatan penyusunan regulasi pengendalian gratifikasi, suap, dan konflik kepentingan.',

          jenis:
            'Daftar Hadir',
        },

        {
          id:
            'dokumentasi-penyusunan-regulasi-i-3',

          judul:
            'Dokumentasi Penyusunan Regulasi',

          deskripsi:
            'Dokumentasi kegiatan penyusunan regulasi pengendalian gratifikasi, suap, dan konflik kepentingan.',

          jenis:
            'Dokumentasi',
        },

        {
          id:
            'notulensi-penyusunan-regulasi-i-3',

          judul:
            'Notulensi Penyusunan Regulasi',

          deskripsi:
            'Notulensi hasil pembahasan penyusunan regulasi pengendalian gratifikasi, suap, dan konflik kepentingan.',

          jenis:
            'Notulensi',
        },

        {
          id:
            'undangan-penyusunan-regulasi-i-3',

          judul:
            'Undangan Penyusunan Regulasi kepada Seluruh Aparatur Desa',

          deskripsi:
            'Undangan kepada seluruh aparatur desa untuk mengikuti kegiatan penyusunan regulasi pengendalian gratifikasi, suap, dan konflik kepentingan.',

          jenis:
            'Undangan',
        },

        {
          id:
            'pedoman-penanganan-benturan-kepentingan',

          judul:
            'Pedoman Penanganan Benturan Kepentingan',

          deskripsi:
            'Peraturan Desa Keji Nomor 10 Tahun 2024 tentang pedoman penanganan benturan atau konflik kepentingan.',

          jenis:
            'Peraturan',
        },

        {
          id:
            'perdes-nomor-11-tahun-2024',

          judul:
            'Peraturan Desa Keji Nomor 11 Tahun 2024',

          deskripsi:
            'Peraturan Desa Keji Nomor 11 Tahun 2024 tentang pengendalian suap dan gratifikasi.',

          jenis:
            'Peraturan',
        },
      ],
    },

    /* =====================================================
       I.4
    ===================================================== */

    {
      kode: 'I.4',

      judul:
        'Keberadaan Perjanjian Kerja Sama antara Pelaksana Kegiatan Anggaran dengan Penyedia setelah Proses Pengadaan',

      ringkasan:
        'Dokumen perencanaan pengadaan, pemilihan penyedia, penawaran, perjanjian kerja sama, pelaksanaan pekerjaan, hingga penyelesaian pembayaran kegiatan pengadaan barang dan jasa Desa Keji.',

      icon:
        Handshake,

      dokumen: [
        {
          id:
            'undangan-penyedia-jasa-dicky-trans',

          judul:
            'Undangan Penyedia Jasa Dicky Trans',

          deskripsi:
            'Undangan kepada penyedia jasa Dicky Trans dalam rangka pelaksanaan proses pengadaan barang atau jasa Desa Keji.',

          jenis:
            'Undangan',
        },

        {
          id:
            'surat-penawaran-penyedia-jasa',

          judul:
            'Surat Penawaran dari Penyedia Jasa',

          deskripsi:
            'Surat penawaran harga dan layanan yang disampaikan oleh penyedia jasa kepada Pemerintah Desa Keji.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'penyelesaian-pembayaran-2025',

          judul:
            '2025 Penyelesaian Pembayaran',

          deskripsi:
            'Dokumen penyelesaian pembayaran pekerjaan atau layanan penyedia jasa Tahun 2025.',

          jenis:
            'Laporan',
        },

        {
          id:
            'perjanjian-kerja-sama-dicky-trans',

          judul:
            'Perjanjian Kerja Sama Dicky Trans',

          deskripsi:
            'Dokumen perjanjian kerja sama antara pelaksana kegiatan anggaran Desa Keji dengan penyedia jasa Dicky Trans.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'spk-2025',

          judul:
            '2025 SPK',

          deskripsi:
            'Surat Perintah Kerja Tahun 2025 sebagai dasar pelaksanaan pekerjaan oleh penyedia barang atau jasa.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'sk-tim-pelaksana-kegiatan',

          judul:
            'SK Tim Pelaksana Kegiatan',

          deskripsi:
            'Surat Keputusan Kepala Desa mengenai penetapan Tim Pelaksana Kegiatan pengadaan barang dan jasa.',

          jenis:
            'Surat Keputusan',
        },

        {
          id:
            'kak-2025',

          judul:
            'KAK 2025',

          deskripsi:
            'Kerangka Acuan Kerja Tahun 2025 yang memuat latar belakang, ruang lingkup, target, dan ketentuan pelaksanaan kegiatan.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'rabk-2025',

          judul:
            '2025_RABK',

          deskripsi:
            'Rencana Anggaran Biaya Kegiatan Tahun 2025 sebagai dasar perhitungan kebutuhan biaya pelaksanaan pekerjaan.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'pengumuman-pbj-2025',

          judul:
            '2025 Pengumuman PBJ',

          deskripsi:
            'Dokumen pengumuman pelaksanaan Pengadaan Barang dan Jasa Desa Keji Tahun 2025.',

          jenis:
            'Dokumen Lainnya',
        },

        {
          id:
            'perencanaan-pbj-rabat-beton-suruhan-2025',

          judul:
            'Perencanaan PBJ Pembangunan Rabat Beton RT.3 RW.2 Dusun Suruhan 2025',

          deskripsi:
            'Dokumen perencanaan Pengadaan Barang dan Jasa untuk pembangunan rabat beton RT 3 RW 2 Dusun Suruhan Tahun 2025.',

          jenis:
            'Dokumen Lainnya',
        },
      ],
    },

    /* =====================================================
       I.5
    ===================================================== */

    {
      kode: 'I.5',

      judul:
        'Keberadaan Perdes, Keputusan Kepala Desa, atau SOP tentang Pakta Integritas dan Sejenisnya',

      ringkasan:
        'Dokumen regulasi, pelaksanaan, dan bukti pendukung penandatanganan Pakta Integritas sebagai bentuk komitmen aparatur Pemerintah Desa Keji dalam menjalankan pemerintahan yang jujur, transparan, akuntabel, dan bebas dari korupsi.',

      icon:
        BadgeCheck,

      dokumen: [
        {
          id:
            'dokumentasi-penandatanganan-pakta-integritas-2025',

          judul:
            'Dokumentasi Penandatanganan Pakta Integritas Tahun 2025',

          deskripsi:
            'Dokumentasi kegiatan penandatanganan Pakta Integritas oleh aparatur Pemerintah Desa Keji Tahun 2025.',

          jenis:
            'Dokumentasi',
        },

        {
          id:
            'daftar-hadir-pakta-integritas-2025',

          judul:
            'Daftar Hadir Pakta Integritas 2025',

          deskripsi:
            'Daftar kehadiran aparatur desa dalam kegiatan penandatanganan Pakta Integritas Tahun 2025.',

          jenis:
            'Daftar Hadir',
        },

        {
          id:
            'notulensi-pakta-integritas-2025',

          judul:
            'Notulensi Pakta Integritas 2025',

          deskripsi:
            'Notulensi pelaksanaan kegiatan dan pembahasan Pakta Integritas Pemerintah Desa Keji Tahun 2025.',

          jenis:
            'Notulensi',
        },

        {
          id:
            'pakta-integritas-aparat-desa',

          judul:
            'Penandatanganan Pakta Integritas yang Ditandatangani Aparat Desa',

          deskripsi:
            'Dokumen Pakta Integritas yang telah ditandatangani oleh aparatur Pemerintah Desa Keji sebagai bentuk komitmen terhadap tata kelola pemerintahan yang berintegritas.',

          jenis:
            'Pakta Integritas',
        },

        {
          id:
            'pakta-integritas-tahun-2025',

          judul:
            'Pakta Integritas Tahun 2025',

          deskripsi:
            'Peraturan dan dokumen pelaksanaan penandatanganan Pakta Integritas Pemerintah Desa Keji Tahun 2025.',

          jenis:
            'Pakta Integritas',
        },
      ],
    },
  ];

/* =========================================================
   CLIENT
========================================================= */

export default function TataLaksanaClient() {
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

  const indikator =
    indikatorTataLaksana[
      indikatorAktif
    ];

  /* =======================================================
     FILTER DOKUMEN
  ======================================================= */

  const dokumenTersaring =
    useMemo(
      () => {
        const query =
          pencarian
            .trim()
            .toLowerCase();

        if (!query) {
          return indikator
            .dokumen;
        }

        return indikator.dokumen.filter(
          (
            dokumen
          ) =>
            [
              dokumen.judul,
              dokumen.deskripsi,
              dokumen.jenis,
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
     PILIH INDIKATOR
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
     * Hanya HP/tablet yang
     * otomatis scroll ke daftar
     * bukti dukung.
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
              'bukti-dukung'
            )
            ?.scrollIntoView(
              {
                behavior:
                  'smooth',

                block:
                  'start',
              }
            );
        },
        80
      );
    }
  }

  return (
    <div className="min-w-0">
      {/* =====================================================
          NAVIGASI HP / TABLET
      ===================================================== */}

      <section className="print-hide mb-6 lg:hidden">
        <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
          {/* HEADER */}

          <div className="mb-3 flex items-center gap-3 px-2 pt-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <FolderOpen
                size={20}
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                Penguatan Tata
                Laksana
              </p>

              <h2 className="truncate text-base font-black text-slate-900">
                Pilih Indikator
              </h2>
            </div>
          </div>

          {/* HORIZONTAL MENU */}

          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {indikatorTataLaksana.map(
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
                    aria-pressed={
                      aktif
                    }
                    className={`shrink-0 rounded-xl border px-4 py-3 text-left transition ${
                      aktif
                        ? 'border-emerald-700 bg-emerald-700 text-white shadow-md'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    <p
                      className={`text-[10px] font-extrabold uppercase tracking-[0.14em] ${
                        aktif
                          ? 'text-emerald-100'
                          : 'text-emerald-700'
                      }`}
                    >
                      Indikator
                    </p>

                    <p className="mt-1 text-sm font-black">
                      {
                        item.kode
                      }
                    </p>

                    <p
                      className={`mt-1 text-[10px] font-semibold ${
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
                  </button>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          DESKTOP LAYOUT
      ===================================================== */}

      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[330px_minmax(0,1fr)] xl:gap-8">
        {/* ===================================================
            NAVIGASI INDIKATOR DESKTOP

            STATIC:
            tidak menggunakan sticky / top-24.
            Jadi sidebar ikut scroll normal bersama halaman.
        =================================================== */}

        <aside className="print-hide hidden min-w-0 self-start lg:block">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* HEADER */}

            <div className="border-b border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <FolderOpen
                    size={21}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Tata Laksana
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-900">
                    Kategori
                    Indikator
                  </h2>
                </div>
              </div>
            </div>

            {/* NAV */}

            <nav
              aria-label="Indikator Tata Laksana"
              className="space-y-2 p-3"
            >
              {indikatorTataLaksana.map(
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
                      aria-pressed={
                        aktif
                      }
                      className={`group flex w-full items-start gap-3 rounded-2xl border px-3.5 py-4 text-left transition ${
                        aktif
                          ? 'border-emerald-700 bg-emerald-700 text-white shadow-md'
                          : 'border-transparent bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      {/* ICON */}

                      <div
                        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                          aktif
                            ? 'bg-white/15 text-white'
                            : 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200'
                        }`}
                      >
                        <Icon
                          size={19}
                        />
                      </div>

                      {/* CONTENT */}

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-[10px] font-extrabold uppercase tracking-[0.14em] ${
                            aktif
                              ? 'text-emerald-100'
                              : 'text-emerald-700'
                          }`}
                        >
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
                        className={`mt-3 shrink-0 transition ${
                          aktif
                            ? 'translate-x-0.5 text-white'
                            : 'text-slate-300 group-hover:translate-x-0.5 group-hover:text-emerald-600'
                        }`}
                      />
                    </button>
                  );
                }
              )}
            </nav>
          </div>
        </aside>

        {/* ===================================================
            DAFTAR BUKTI DUKUNG
        =================================================== */}

        <section
          id="bukti-dukung"
          className="min-w-0 scroll-mt-28"
        >
          <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* =============================================
                HEADER CONTENT
            ============================================= */}

            <header className="border-b border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-white p-5 sm:p-6 xl:p-8">
              <div className="flex min-w-0 flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-md sm:h-12 sm:w-12 sm:rounded-2xl">
                    <CheckCircle2
                      size={22}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700 sm:text-xs">
                      Indikator{' '}
                      {
                        indikator.kode
                      }
                    </p>

                    <h2 className="mt-2 text-xl font-black leading-tight text-slate-900 sm:text-2xl">
                      Bukti Dukung
                    </h2>

                    <p className="mt-3 break-words text-sm font-bold leading-6 text-slate-700">
                      {
                        indikator.judul
                      }
                    </p>

                    <p className="mt-2 break-words text-sm font-medium leading-6 text-slate-500">
                      {
                        indikator.ringkasan
                      }
                    </p>
                  </div>
                </div>

                {/* COUNT */}

                <div className="w-fit shrink-0 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-sm sm:px-5 sm:py-4">
                  <p className="text-2xl font-black text-emerald-700">
                    {
                      indikator.dokumen
                        .length
                    }
                  </p>

                  <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500">
                    Dokumen tercatat
                  </p>
                </div>
              </div>

              {/* =============================================
                  SEARCH
              ============================================= */}

              <div className="print-hide relative mt-6">
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
                  placeholder="Cari nama atau jenis dokumen..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </header>

            {/* =============================================
                DOCUMENTS
            ============================================= */}

            <div className="min-w-0 p-4 sm:p-5 xl:p-7">
              {dokumenTersaring.length >
              0 ? (
                <div className="grid min-w-0 gap-4 xl:grid-cols-2">
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
                /* =========================================
                   EMPTY SEARCH
                ========================================= */

                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
                  <FileSearch
                    size={44}
                    className="mx-auto text-slate-300"
                  />

                  <h3 className="mt-4 text-lg font-black text-slate-800">
                    Dokumen tidak
                    ditemukan
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
                    Gunakan kata
                    kunci lain untuk
                    mencari dokumen
                    pada indikator
                    ini.
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
    DokumenTataLaksana;

  nomor:
    number;
}) {
  const external =
    Boolean(
      dokumen.href?.startsWith(
        'http'
      )
    );

  return (
    <article className="document-card group flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg sm:p-5">
      {/* ===================================================
          TYPE + NUMBER
      =================================================== */}

      <div className="flex min-w-0 items-start justify-between gap-3">
        <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-emerald-700">
          <FileText
            size={12}
            className="shrink-0"
          />

          <span className="truncate">
            {
              dokumen.jenis
            }
          </span>
        </span>

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

      <p className="mt-3 flex-1 break-words text-sm font-medium leading-6 text-slate-500">
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
            target={
              external
                ? '_blank'
                : undefined
            }
            rel={
              external
                ? 'noopener noreferrer'
                : undefined
            }
            className="inline-flex min-h-10 max-w-full items-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-800"
          >
            <FileCheck2
              size={15}
              className="shrink-0"
            />

            <span className="truncate">
              Buka Dokumen
            </span>

            {external && (
              <ExternalLink
                size={13}
                className="shrink-0"
              />
            )}
          </a>
        ) : (
          <span className="inline-flex min-h-10 max-w-full items-center gap-2 rounded-xl bg-slate-100 px-4 text-xs font-extrabold text-slate-500">
            <Clock3
              size={14}
              className="shrink-0"
            />

            <span className="truncate">
              Tautan belum
              ditambahkan
            </span>
          </span>
        )}
      </div>
    </article>
  );
}