// types/beranda.ts

export interface BerandaPublicData {
  beranda_key: string;

  hero_teks_1: string;
  hero_teks_2: string;
  hero_teks_3: string;
  hero_lokasi: string;
  hero_placeholder: string;
  background_url: string;
  logo_url: string;

  nama_kepala_desa: string;
  jabatan_kepala_desa: string;
  foto_kepala_desa_url: string;
  sambutan_kepala_desa: string;

  informasi_1: string;
  informasi_2: string;
  informasi_3: string;
  informasi_4: string;

  alamat_kantor: string;
  maps_embed_url: string;
  maps_link_url: string;

  sholat_subuh: string;
  sholat_dzuhur: string;
  sholat_ashar: string;
  sholat_maghrib: string;
  sholat_isya: string;

  jam_senin_kamis: string;
  jam_jumat: string;
  jam_akhir_pekan: string;

  updated_at: string;
}

export interface BerandaActionState {
  success: boolean;
  message: string;
}