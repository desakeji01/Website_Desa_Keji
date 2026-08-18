// types/apbdes.ts

export const TAHUN_APBDES = [
  2024,
  2025,
  2026,
] as const;

export type TahunApbdes =
  (typeof TAHUN_APBDES)[number];

export interface ApbdesRealisasi {
  id: string;
  tahun: TahunApbdes;

  judul: string;

  deskripsi:
    | string
    | null;

  anggaran_pendapatan: number;
  realisasi_pendapatan: number;

  anggaran_belanja: number;
  realisasi_belanja: number;

  anggaran_pembiayaan: number;
  realisasi_pembiayaan: number;

  dokumen_url:
    | string
    | null;

  dokumen_path:
    | string
    | null;

  infografis_url:
    | string
    | null;

  infografis_path:
    | string
    | null;

  aktif: boolean;

  created_at: string;
  updated_at: string;
}

export interface ApbdesActionState {
  error: string | null;
  success: string | null;
}