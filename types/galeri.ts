// types/galeri.ts

export type KategoriGaleri =
  | 'Pemerintahan'
  | 'Kegiatan Masyarakat'
  | 'Budaya dan Tradisi'
  | 'Pembangunan'
  | 'UMKM'
  | 'Desa Wisata'
  | 'Karang Taruna'
  | 'KKN dan Kolaborasi';

export interface AlbumGaleri {
  id: string;
  judul: string;
  slug: string;

  deskripsi:
    | string
    | null;

  kategori: KategoriGaleri;

  tanggal_kegiatan:
    | string
    | null;

  lokasi:
    | string
    | null;

  foto_sampul_url:
    | string
    | null;

  foto_sampul_path:
    | string
    | null;

  aktif: boolean;
  urutan: number;

  created_at: string;
  updated_at: string;
}

export interface FotoGaleri {
  id: string;
  album_id: string;

  url_foto: string;
  storage_path: string;

  caption:
    | string
    | null;

  alt_text:
    | string
    | null;

  urutan: number;
  created_at: string;
}

export interface GaleriActionState {
  error: string | null;
  success: string | null;
}