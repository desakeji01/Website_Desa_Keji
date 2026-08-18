import type {
  KategoriDesaCantik,
} from '@/types/desa-cantik';

export interface DesaCantikAdminActionState {
  error: string | null;
  success: string | null;
  version: number;
}

export interface DesaCantikAdminRecord {
  id: string;
  kategori: KategoriDesaCantik;
  tahun: number;
  sumber: string;
  data: unknown;
  infografis_url: string | null;
  infografis_path: string | null;
  aktif: boolean;
  created_at: string;
  updated_at: string;
}

export interface DesaCantikPublikasiRecord {
  id: string;
  tahun: number;
  judul: string;
  deskripsi: string;
  pdf_url: string | null;
  pdf_path: string | null;
  aktif: boolean;
  created_at: string;
  updated_at: string;
}