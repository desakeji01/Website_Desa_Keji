// types/ppid.ts

export interface PpidSettings {
  ppid_key: string;

  header_label: string;

  office_name: string;
  office_address: string;
  office_email: string;
  office_phone: string;
  office_hours: string;

  apa_title: string;
  apa_description: string;
  apa_hero_label: string;
  apa_hero_title: string;
  apa_hero_description: string;

  klasifikasi_title: string;
  klasifikasi_description: string;
  klasifikasi_hero_label: string;
  klasifikasi_hero_title: string;
  klasifikasi_hero_description: string;

  permohonan_title: string;
  permohonan_description: string;
  permohonan_hero_label: string;
  permohonan_hero_title: string;
  permohonan_hero_description: string;
  permohonan_poster_url: string;
  permohonan_poster_alt: string;
  permohonan_form_url: string;

  keberatan_title: string;
  keberatan_description: string;
  keberatan_hero_label: string;
  keberatan_hero_title: string;
  keberatan_hero_description: string;
  keberatan_poster_url: string;
  keberatan_poster_alt: string;
  keberatan_form_url: string;

  created_at: string;
  updated_at: string;
}

export interface ProfilPpid {
  id: string;
  profil_key: string;

  judul: string;
  deskripsi: string;

  email: string | null;
  telepon: string | null;
  alamat: string | null;
  jam_layanan: string | null;

  aktif: boolean;

  created_at: string;
  updated_at: string;
}

export interface PengurusPpid {
  id: string;

  nama: string;
  jabatan_desa: string;
  jabatan_ppid: string;

  urutan: number;
  aktif: boolean;

  created_at: string;
  updated_at: string;
}