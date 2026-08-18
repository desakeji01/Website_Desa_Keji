export const TAHUN_DESA_CANTIK = [
  2025,
  2026,
] as const;

export type TahunDesaCantik =
  (typeof TAHUN_DESA_CANTIK)[number];

export const KATEGORI_DESA_CANTIK = [
  {
    slug: 'penduduk',
    nama: 'Penduduk',
    deskripsi:
      'Komposisi penduduk menurut kelompok umur, jenis kelamin, dan wilayah.',
  },
  {
    slug: 'pendidikan',
    nama: 'Pendidikan',
    deskripsi:
      'Data tingkat pendidikan, partisipasi sekolah, dan sarana pendidikan.',
  },
  {
    slug: 'kesehatan',
    nama: 'Kesehatan',
    deskripsi:
      'Data kesehatan masyarakat, fasilitas kesehatan, dan layanan kesehatan.',
  },
  {
    slug: 'perumahan',
    nama: 'Perumahan',
    deskripsi:
      'Kondisi rumah, sanitasi, air bersih, dan fasilitas tempat tinggal.',
  },
  {
    slug: 'perekonomian',
    nama: 'Perekonomian',
    deskripsi:
      'Data mata pencaharian, usaha masyarakat, dan aktivitas ekonomi desa.',
  },
] as const;

export type KategoriDesaCantik =
  (typeof KATEGORI_DESA_CANTIK)[number]['slug'];

export interface RincianRwPenduduk {
  lakiLaki: number;
  perempuan: number;
  jumlah: number;
}

export interface PendudukKelompokUmur {
  kelompokUmur: string;
  rw01: RincianRwPenduduk;
  rw02: RincianRwPenduduk;
  rw03: RincianRwPenduduk;
  total: RincianRwPenduduk;
}