// types/admin-layanan.ts

export interface LayananAdminData {
  id: number;
  nama: string;
  slug: string;
  deskripsi: string;
  aktif: boolean;
  urutan: number;
  persyaratan: string[];
}

export interface LayananActionState {
  success: boolean;
  message: string;
}