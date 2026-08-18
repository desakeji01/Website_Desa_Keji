// types/profil-desa.ts

export interface ProfilDesa {
  id: string;
  profil_key: string;
  jumlah_laki_laki: number;
  jumlah_perempuan: number;
  jumlah_dusun: number;
  jumlah_rw: number;
  jumlah_rt: number;
  tahun_data: number;
  updated_at: string;
}

export interface ProfilDesaActionState {
  error: string | null;
  success: string | null;
}