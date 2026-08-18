// types/kontak-desa.ts

export const KONTAK_ICON_KEYS = [
  'LANDMARK',
  'BUILDING',
  'SHIELD',
  'HEALTH',
  'USERS',
  'PHONE',
  'HEADPHONES',
  'SIREN',
] as const;

export type KontakIconKey =
  (typeof KONTAK_ICON_KEYS)[number];

export interface KontakDesaSettings {
  kontak_key: string;

  label_header: string;
  judul_halaman: string;
  deskripsi_halaman: string;

  judul_hero: string;
  deskripsi_hero: string;

  alamat_kantor: string;
  estimasi_pelayanan: string;
  label_biaya: string;

  judul_daftar_kontak: string;
  deskripsi_daftar_kontak: string;

  judul_poster: string;
  deskripsi_poster: string;
  poster_url: string;
  poster_alt: string;

  judul_jadwal: string;

  judul_etika: string;
  deskripsi_etika: string;

  judul_darurat: string;
  deskripsi_darurat: string;

  updated_at: string;
}

export interface KontakDesaItem {
  id: number;
  nama: string;
  jabatan: string;
  nomor: string;
  deskripsi: string;
  icon_key: KontakIconKey;
  featured: boolean;
  aktif: boolean;
  urutan: number;
  created_at: string;
  updated_at: string;
}

export interface JadwalPelayananDesa {
  id: number;
  hari: string;
  waktu: string;
  is_libur: boolean;
  aktif: boolean;
  urutan: number;
  created_at: string;
  updated_at: string;
}

export interface EtikaPelayananDesa {
  id: number;
  teks: string;
  aktif: boolean;
  urutan: number;
  created_at: string;
  updated_at: string;
}

export interface KontakActionState {
  success: boolean;
  message: string;
}