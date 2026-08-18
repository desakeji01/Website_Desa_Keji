// types/produk-hukum.ts

export const JENIS_PRODUK_HUKUM = [
  'Peraturan Desa',
  'Peraturan Kepala Desa',
  'Keputusan Kepala Desa',
  'Peraturan Bersama Kepala Desa',
  'Surat Keputusan',
  'Lainnya',
] as const;

export type JenisProdukHukum =
  (typeof JENIS_PRODUK_HUKUM)[number];

export interface ProdukHukum {
  id: string;

  judul: string;

  nomor:
    | string
    | null;

  jenis: JenisProdukHukum;

  tahun: number;

  tanggal_penetapan:
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

export interface ProdukHukumActionState {
  error: string | null;
  success: string | null;
}