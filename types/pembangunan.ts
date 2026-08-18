// types/pembangunan.ts

export const STATUS_PEMBANGUNAN_OPTIONS = [
  'Perencanaan',
  'Berjalan',
  'Selesai',
] as const;

export type StatusPembangunan =
  (typeof STATUS_PEMBANGUNAN_OPTIONS)[number];

export interface ProyekPembangunan {
  id: string;

  nama: string;
  lokasi: string;
  tahun: number;

  sumber_dana: string;
  anggaran: number;

  progres: number;
  status: StatusPembangunan;

  deskripsi: string;
  gambar_url: string | null;

  aktif: boolean;
  urutan: number;

  created_at: string;
  updated_at: string;
}