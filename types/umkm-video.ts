// types/umkm-video.ts

export interface UmkmVideoTutorial {
  id: string;
  judul: string;
  deskripsi: string | null;
  youtube_url: string;
  youtube_id: string;
  urutan: number;
  aktif: boolean;
  created_at: string;
  updated_at: string;
}