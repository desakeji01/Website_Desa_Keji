// types/peta.ts

export interface PetaDesaData {
  peta_key: string;
  label_seksi: string;
  judul_halaman: string;
  deskripsi: string;
  tombol_label: string;
  maps_link_url: string;
  maps_embed_url: string;
  iframe_title: string;
  tinggi_peta: number;
  updated_at: string;
}

export interface PetaActionState {
  success: boolean;
  message: string;
}