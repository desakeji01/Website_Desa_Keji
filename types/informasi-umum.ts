// types/informasi-umum.ts

export const KATEGORI_INFORMASI_UMUM = [
  'Informasi Berkala',
  'Informasi Serta Merta',
  'Informasi Setiap Saat',
  'Informasi Publik Lainnya',
] as const;

export type KategoriInformasiUmum =
  (typeof KATEGORI_INFORMASI_UMUM)[number];

export interface InformasiUmum {
  id: string;

  judul: string;

  kategori:
    KategoriInformasiUmum;

  tahun: number;

  tanggal_dokumen:
    | string
    | null;

  deskripsi:
    | string
    | null;

  file_url: string;
  file_path: string;

  aktif: boolean;

  created_at: string;
  updated_at: string;
}

export interface InformasiUmumActionState {
  error: string | null;
  success: string | null;
}