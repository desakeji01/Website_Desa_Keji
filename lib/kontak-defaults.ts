// lib/kontak-defaults.ts

import type {
  EtikaPelayananDesa,
  JadwalPelayananDesa,
  KontakDesaItem,
  KontakDesaSettings,
} from '@/types/kontak-desa';

export const KONTAK_DESA_DEFAULTS:
  KontakDesaSettings = {
  kontak_key: 'utama',

  label_header:
    'Pemerintah Desa Keji',

  judul_halaman:
    'Kontak dan Layanan Aduan',

  deskripsi_halaman:
    'Hubungi Pemerintah Desa Keji untuk memperoleh informasi pelayanan, menyampaikan pengaduan, atau berkoordinasi dengan perangkat wilayah.',

  judul_hero:
    'Pemerintah Desa Keji siap menerima informasi, pertanyaan, dan aduan masyarakat',

  deskripsi_hero:
    'Pilih kontak yang sesuai dengan kebutuhan Anda. Gunakan layanan telepon atau WhatsApp secara bertanggung jawab dan sampaikan informasi dengan jelas.',

  alamat_kantor:
    'Desa Keji, Kecamatan Ungaran Barat, Kabupaten Semarang, Jawa Tengah.',

  estimasi_pelayanan:
    '10 Menit',

  label_biaya:
    'Gratis',

  judul_daftar_kontak:
    'Layanan Aduan Masyarakat',

  deskripsi_daftar_kontak:
    'Hubungi petugas sesuai bidang atau wilayah pelayanan yang dibutuhkan.',

  judul_poster:
    'Daftar Layanan Aduan Desa Keji',

  deskripsi_poster:
    'Poster daftar nomor kontak Pemerintah Desa dan petugas wilayah.',

  poster_url:
    '/images/kontak/Layanan-Aduan-Masyarakat.png',

  poster_alt:
    'Poster layanan aduan masyarakat Desa Keji',

  judul_jadwal:
    'Jadwal Operasional Kantor Desa',

  judul_etika:
    'Sampaikan aduan dengan jelas dan bertanggung jawab',

  deskripsi_etika:
    'Gunakan layanan kontak desa secara bertanggung jawab dan sesuai kebutuhan pelayanan.',

  judul_darurat:
    'Terdapat kejadian yang membahayakan masyarakat?',

  deskripsi_darurat:
    'Segera hubungi Bhabinkamtibmas, Babinsa, Kepala Dusun, atau Pemerintah Desa sesuai lokasi kejadian.',

  updated_at: '',
};

export const KONTAK_ITEM_DEFAULTS:
  KontakDesaItem[] = [
  {
    id: 1,
    nama: 'Kepala Desa',
    jabatan:
      'Pimpinan Pemerintah Desa',
    nomor:
      '0813-2944-2688',
    deskripsi:
      'Layanan pengaduan umum, koordinasi pemerintahan, dan kebijakan desa.',
    icon_key:
      'LANDMARK',
    featured: true,
    aktif: true,
    urutan: 1,
    created_at: '',
    updated_at: '',
  },
  {
    id: 2,
    nama:
      'Sekretaris Desa',
    jabatan:
      'Administrasi Pemerintah Desa',
    nomor:
      '0822-2022-5538',
    deskripsi:
      'Informasi administrasi, surat-menyurat, dan pelayanan pemerintahan desa.',
    icon_key:
      'BUILDING',
    featured: true,
    aktif: true,
    urutan: 2,
    created_at: '',
    updated_at: '',
  },
];

export const JADWAL_PELAYANAN_DEFAULTS:
  JadwalPelayananDesa[] = [
  {
    id: 1,
    hari:
      'Senin–Kamis',
    waktu:
      '08.00–15.00 WIB',
    is_libur: false,
    aktif: true,
    urutan: 1,
    created_at: '',
    updated_at: '',
  },
  {
    id: 2,
    hari: 'Jumat',
    waktu:
      '08.00–11.30 WIB',
    is_libur: false,
    aktif: true,
    urutan: 2,
    created_at: '',
    updated_at: '',
  },
  {
    id: 3,
    hari: 'Istirahat',
    waktu:
      '12.00–13.00 WIB',
    is_libur: false,
    aktif: true,
    urutan: 3,
    created_at: '',
    updated_at: '',
  },
  {
    id: 4,
    hari:
      'Sabtu, Minggu, dan Tanggal Merah',
    waktu: 'Libur',
    is_libur: true,
    aktif: true,
    urutan: 4,
    created_at: '',
    updated_at: '',
  },
];

export const ETIKA_PELAYANAN_DEFAULTS:
  EtikaPelayananDesa[] = [
  {
    id: 1,
    teks:
      'Sampaikan nama, wilayah, dan keperluan secara jelas.',
    aktif: true,
    urutan: 1,
    created_at: '',
    updated_at: '',
  },
  {
    id: 2,
    teks:
      'Jelaskan lokasi dan waktu kejadian apabila menyampaikan pengaduan.',
    aktif: true,
    urutan: 2,
    created_at: '',
    updated_at: '',
  },
];