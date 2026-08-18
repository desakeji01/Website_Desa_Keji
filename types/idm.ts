// types/idm.ts

export const STATUS_IDM_OPTIONS = [
  'Sangat Tertinggal',
  'Tertinggal',
  'Berkembang',
  'Maju',
  'Mandiri',
] as const;

export type StatusIdm =
  (typeof STATUS_IDM_OPTIONS)[number];

export interface RiwayatIdm {
  id: string;

  tahun: number;
  nilai: number;
  status: StatusIdm;

  keterangan: string | null;

  aktif: boolean;

  created_at: string;
  updated_at: string;
}