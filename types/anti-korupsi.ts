// types/anti-korupsi.ts

export const ANTI_KORUPSI_ICON_OPTIONS = [
  'clipboard-check',
  'file-search',
  'shield-check',
  'handshake',
  'badge-check',
] as const;

export type AntiKorupsiIconKey =
  (typeof ANTI_KORUPSI_ICON_OPTIONS)[number];

export const JENIS_DOKUMEN_ANTI_KORUPSI = [
  'Undangan',
  'Notulensi',
  'Daftar Hadir',
  'Dokumentasi',
  'Peraturan',
  'Laporan',
  'Infografis',
  'SOP',
  'Surat Keputusan',
  'Pakta Integritas',
  'Dokumen Lainnya',
] as const;

export type JenisDokumenAntiKorupsi =
  (typeof JENIS_DOKUMEN_ANTI_KORUPSI)[number];

export interface AntiKorupsiSettings {
  id: string;
  settings_key: string;

  hero_badge: string;
  hero_eyebrow: string;
  hero_title_primary: string;
  hero_title_accent: string;
  hero_description: string;

  cta_primary_label: string;
  cta_primary_href: string;

  cta_secondary_label: string;
  cta_secondary_href: string;

  created_at: string;
  updated_at: string;
}

export interface AntiKorupsiIndikator {
  id: string;

  sub_slug: string;

  kode: string;
  judul: string;
  ringkasan: string;

  icon_key: AntiKorupsiIconKey;

  urutan: number;
  aktif: boolean;

  created_at: string;
  updated_at: string;
}

export interface AntiKorupsiDokumen {
  id: string;
  indikator_id: string;

  judul: string;
  deskripsi: string;

  jenis: JenisDokumenAntiKorupsi;
  tahun: number | null;

  drive_url: string;

  urutan: number;
  aktif: boolean;

  created_at: string;
  updated_at: string;
}