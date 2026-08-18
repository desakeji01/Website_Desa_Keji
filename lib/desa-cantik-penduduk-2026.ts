import type {
  KategoriDesaCantik,
  TahunDesaCantik,
} from '@/types/desa-cantik';

export interface NilaiPendudukUmur {
  lakiLaki: number;
  perempuan: number;
  jumlah: number;
}

export interface PendudukKelompokUmur2026 {
  id: string;
  kelompokUmur: string;
  rw01: NilaiPendudukUmur;
  rw02: NilaiPendudukUmur;
  rw03: NilaiPendudukUmur;
  total: NilaiPendudukUmur;
}

export const SUMBER_DATA_PENDUDUK_2026 =
  'Pendataan Penyusunan Direktori Data Desa Keji Tahun 2026';

export const DATA_PENDUDUK_2026: PendudukKelompokUmur2026[] = [
  {
    id: '0-4',
    kelompokUmur: '0–4 Tahun',
    rw01: { lakiLaki: 41, perempuan: 41, jumlah: 82 },
    rw02: { lakiLaki: 53, perempuan: 27, jumlah: 80 },
    rw03: { lakiLaki: 15, perempuan: 17, jumlah: 32 },
    total: { lakiLaki: 109, perempuan: 85, jumlah: 194 },
  },
  {
    id: '5-9',
    kelompokUmur: '5–9 Tahun',
    rw01: { lakiLaki: 49, perempuan: 45, jumlah: 94 },
    rw02: { lakiLaki: 58, perempuan: 37, jumlah: 95 },
    rw03: { lakiLaki: 19, perempuan: 26, jumlah: 45 },
    total: { lakiLaki: 126, perempuan: 108, jumlah: 234 },
  },
  {
    id: '10-14',
    kelompokUmur: '10–14 Tahun',
    rw01: { lakiLaki: 58, perempuan: 65, jumlah: 123 },
    rw02: { lakiLaki: 33, perempuan: 40, jumlah: 73 },
    rw03: { lakiLaki: 20, perempuan: 24, jumlah: 44 },
    total: { lakiLaki: 111, perempuan: 129, jumlah: 240 },
  },
  {
    id: '15-19',
    kelompokUmur: '15–19 Tahun',
    rw01: { lakiLaki: 49, perempuan: 56, jumlah: 105 },
    rw02: { lakiLaki: 30, perempuan: 24, jumlah: 54 },
    rw03: { lakiLaki: 18, perempuan: 24, jumlah: 42 },
    total: { lakiLaki: 97, perempuan: 104, jumlah: 201 },
  },
  {
    id: '20-24',
    kelompokUmur: '20–24 Tahun',
    rw01: { lakiLaki: 60, perempuan: 51, jumlah: 111 },
    rw02: { lakiLaki: 35, perempuan: 31, jumlah: 66 },
    rw03: { lakiLaki: 15, perempuan: 16, jumlah: 31 },
    total: { lakiLaki: 110, perempuan: 98, jumlah: 208 },
  },
  {
    id: '25-29',
    kelompokUmur: '25–29 Tahun',
    rw01: { lakiLaki: 51, perempuan: 55, jumlah: 106 },
    rw02: { lakiLaki: 39, perempuan: 46, jumlah: 85 },
    rw03: { lakiLaki: 22, perempuan: 26, jumlah: 48 },
    total: { lakiLaki: 112, perempuan: 127, jumlah: 239 },
  },
  {
    id: '30-34',
    kelompokUmur: '30–34 Tahun',
    rw01: { lakiLaki: 55, perempuan: 55, jumlah: 110 },
    rw02: { lakiLaki: 63, perempuan: 71, jumlah: 134 },
    rw03: { lakiLaki: 22, perempuan: 23, jumlah: 45 },
    total: { lakiLaki: 140, perempuan: 149, jumlah: 289 },
  },
  {
    id: '35-39',
    kelompokUmur: '35–39 Tahun',
    rw01: { lakiLaki: 62, perempuan: 60, jumlah: 122 },
    rw02: { lakiLaki: 55, perempuan: 50, jumlah: 105 },
    rw03: { lakiLaki: 23, perempuan: 14, jumlah: 37 },
    total: { lakiLaki: 140, perempuan: 124, jumlah: 264 },
  },
  {
    id: '40-44',
    kelompokUmur: '40–44 Tahun',
    rw01: { lakiLaki: 59, perempuan: 55, jumlah: 114 },
    rw02: { lakiLaki: 42, perempuan: 42, jumlah: 84 },
    rw03: { lakiLaki: 18, perempuan: 14, jumlah: 32 },
    total: { lakiLaki: 119, perempuan: 111, jumlah: 230 },
  },
  {
    id: '45-49',
    kelompokUmur: '45–49 Tahun',
    rw01: { lakiLaki: 51, perempuan: 49, jumlah: 100 },
    rw02: { lakiLaki: 36, perempuan: 36, jumlah: 72 },
    rw03: { lakiLaki: 19, perempuan: 27, jumlah: 46 },
    total: { lakiLaki: 106, perempuan: 112, jumlah: 218 },
  },
  {
    id: '50-54',
    kelompokUmur: '50–54 Tahun',
    rw01: { lakiLaki: 45, perempuan: 43, jumlah: 88 },
    rw02: { lakiLaki: 30, perempuan: 27, jumlah: 57 },
    rw03: { lakiLaki: 19, perempuan: 16, jumlah: 35 },
    total: { lakiLaki: 94, perempuan: 86, jumlah: 180 },
  },
  {
    id: '55-59',
    kelompokUmur: '55–59 Tahun',
    rw01: { lakiLaki: 44, perempuan: 49, jumlah: 93 },
    rw02: { lakiLaki: 22, perempuan: 25, jumlah: 47 },
    rw03: { lakiLaki: 18, perempuan: 19, jumlah: 37 },
    total: { lakiLaki: 84, perempuan: 93, jumlah: 177 },
  },
  {
    id: '60-64',
    kelompokUmur: '60–64 Tahun',
    rw01: { lakiLaki: 41, perempuan: 42, jumlah: 83 },
    rw02: { lakiLaki: 19, perempuan: 27, jumlah: 46 },
    rw03: { lakiLaki: 14, perempuan: 15, jumlah: 29 },
    total: { lakiLaki: 74, perempuan: 84, jumlah: 158 },
  },
  {
    id: '65-69',
    kelompokUmur: '65–69 Tahun',
    rw01: { lakiLaki: 30, perempuan: 25, jumlah: 55 },
    rw02: { lakiLaki: 19, perempuan: 16, jumlah: 35 },
    rw03: { lakiLaki: 14, perempuan: 11, jumlah: 25 },
    total: { lakiLaki: 63, perempuan: 52, jumlah: 115 },
  },
  {
    id: '70-74',
    kelompokUmur: '70–74 Tahun',
    rw01: { lakiLaki: 13, perempuan: 13, jumlah: 26 },
    rw02: { lakiLaki: 7, perempuan: 7, jumlah: 14 },
    rw03: { lakiLaki: 5, perempuan: 9, jumlah: 14 },
    total: { lakiLaki: 25, perempuan: 29, jumlah: 54 },
  },
  {
    id: '75-plus',
    kelompokUmur: '75+ Tahun',
    rw01: { lakiLaki: 15, perempuan: 13, jumlah: 28 },
    rw02: { lakiLaki: 4, perempuan: 8, jumlah: 12 },
    rw03: { lakiLaki: 10, perempuan: 10, jumlah: 20 },
    total: { lakiLaki: 29, perempuan: 31, jumlah: 60 },
  },
];

export function getDataPenduduk2026(
  kategori: KategoriDesaCantik,
  tahun: TahunDesaCantik,
) {
  if (kategori === 'penduduk' && tahun === 2026) {
    return DATA_PENDUDUK_2026;
  }

  return [];
}
