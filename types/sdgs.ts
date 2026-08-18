// types/sdgs.ts

export interface SdgsDesa {
  id: number;
  nama: string;
  skor: number;
  warna: string;
  tahun_data: number;
  aktif: boolean;
  updated_at: string;
}

export interface SdgsActionState {
  error: string | null;
  success: string | null;
}