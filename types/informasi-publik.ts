// types/informasi-publik.ts

export interface InformasiPublikSettings {
  informasi_key: string;

  badge_text: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_description: string;

  summary_documents_label: string;
  summary_access_value: string;
  summary_access_label: string;
  summary_apbdes_label: string;

  menu_eyebrow: string;
  menu_title: string;
  menu_description: string;

  produk_hukum_title: string;
  produk_hukum_label: string;
  produk_hukum_description: string;

  informasi_umum_title: string;
  informasi_umum_label: string;
  informasi_umum_description: string;

  apbdes_eyebrow: string;
  apbdes_title: string;
  apbdes_description: string;

  commitment_eyebrow: string;
  commitment_title: string;
  commitment_description: string;

  commitment_1_title: string;
  commitment_1_description: string;

  commitment_2_title: string;
  commitment_2_description: string;

  commitment_3_title: string;
  commitment_3_description: string;

  cta_title: string;
  cta_description: string;
  cta_button_label: string;
  cta_button_href: string;

  updated_at: string;
}

export interface InformasiUmumItem {
  id: number;
  judul: string;
  kategori: string;
  tahun: number;
  tanggal_publikasi: string | null;
  deskripsi: string;
  file_url: string;
  file_path: string | null;
  aktif: boolean;
  urutan: number;
  created_at: string;
  updated_at: string;
}