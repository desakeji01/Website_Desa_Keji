// types/pemerintahan.ts

export const KELOMPOK_PERANGKAT = [
  'Pimpinan',
  'Sekretariat Desa',
  'Pelaksana Teknis',
  'Pelaksana Kewilayahan',
] as const;

export type KelompokPerangkat =
  (typeof KELOMPOK_PERANGKAT)[number];

export interface PemerintahanDesaData {
  pemerintahan_key: string;

  sekilas_info: string;

  judul_halaman: string;

  judul_sotk: string;

  lokasi_pemerintahan: string;

  tanggal_publikasi: string;

  penulis: string;

  deskripsi_kepala_desa: string;

  deskripsi_perangkat: string;

  catatan: string;

  updated_at: string;
}

export interface PerangkatDesaData {
  id: string;

  nama: string;

  jabatan: string;

  kelompok: KelompokPerangkat;

  foto_url:
    | string
    | null;

  foto_path:
    | string
    | null;

  nip:
    | string
    | null;

  nomor_telepon:
    | string
    | null;

  deskripsi:
    | string
    | null;

  urutan: number;

  aktif: boolean;

  created_at: string;

  updated_at: string;
}

export interface PemerintahanActionState {
  success: boolean;

  message: string;
}

export const INITIAL_PEMERINTAHAN_ACTION_STATE:
  PemerintahanActionState = {
  success: false,

  message: '',
};