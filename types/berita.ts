// types/berita.ts

export type StatusBerita =
  | 'draft'
  | 'published';

export type KategoriBerita =
  | 'Berita Desa'
  | 'PPID'
  | 'Laporan Anggaran';

export interface BeritaActionState {
  error: string | null;
}

export interface BeritaFormInitialData {
  judul: string;
  kategori: KategoriBerita;
  kutipan: string;
  konten: string;
  penulis: string;
  status: StatusBerita;
  gambar_url?: string | null;
}

export interface BeritaPublik {
  id: number;
  judul: string;
  slug: string;
  kategori: KategoriBerita;
  kutipan: string;
  konten?: string;
  penulis: string;
  gambar_url: string;
  published_at: string | null;
  created_at: string;
}