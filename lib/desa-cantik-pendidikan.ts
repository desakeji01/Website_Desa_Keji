import type {
  KategoriDesaCantik,
  TahunDesaCantik,
} from '@/types/desa-cantik';

export interface KolomPendidikan {
  key: string;
  label: string;
}

export interface BarisPendidikan {
  label: string;
  nilai: Record<string, number>;
}

export interface BagianKolomPendidikan {
  judul: string;
  keys: string[];
}

export type KelompokTabelPendidikan =
  | 'Partisipasi dan Pendidikan Formal'
  | 'Lapangan Usaha';

export interface TabelPendidikan {
  id: string;
  nomor: string;
  judul: string;
  kelompok: KelompokTabelPendidikan;
  labelBaris: string;
  kolom: KolomPendidikan[];
  baris: BarisPendidikan[];
  jumlah: Record<string, number>;
  bagianKolom?: BagianKolomPendidikan[];
  catatan?: string;
}

export const SUMBER_DATA_PENDIDIKAN_2026 =
  'Pendataan Penyusunan Direktori Data Desa Keji Tahun 2026';

export const SUMBER_DATA_PENDIDIKAN_2025 =
  'Pendataan Penyusunan Direktori Data Desa Keji Tahun 2025';

export const DATA_PENDIDIKAN_2025: TabelPendidikan[] = [
  {
    id: 'partisipasi-sekolah',
    nomor: 'Tabel 4.1',
    judul:
      'Jumlah Penduduk Usia 5 Tahun ke Atas Menurut Partisipasi Sekolah',
    kelompok: 'Partisipasi dan Pendidikan Formal',
    labelBaris: 'RW',
    kolom: [
      {
        key: 'tidakBelumPernahSekolah',
        label: 'Tidak/Belum Pernah Sekolah',
      },
      { key: 'masihSekolah', label: 'Masih Sekolah' },
      {
        key: 'tidakBersekolahLagi',
        label: 'Tidak Bersekolah Lagi',
      },
    ],
    baris: [
      {
        label: 'RW 01',
        nilai: {
          tidakBelumPernahSekolah: 31,
          masihSekolah: 335,
          tidakBersekolahLagi: 985,
        },
      },
      {
        label: 'RW 02',
        nilai: {
          tidakBelumPernahSekolah: 85,
          masihSekolah: 183,
          tidakBersekolahLagi: 697,
        },
      },
      {
        label: 'RW 03',
        nilai: {
          tidakBelumPernahSekolah: 32,
          masihSekolah: 106,
          tidakBersekolahLagi: 385,
        },
      },
    ],
    jumlah: {
      tidakBelumPernahSekolah: 148,
      masihSekolah: 624,
      tidakBersekolahLagi: 2067,
    },
  },
  {
    id: 'ijazah-tertinggi',
    nomor: 'Tabel 4.2',
    judul:
      'Jumlah Penduduk Usia 5 Tahun ke Atas Menurut Ijazah Tertinggi yang Dimiliki',
    kelompok: 'Partisipasi dan Pendidikan Formal',
    labelBaris: 'RW',
    kolom: [
      { key: 'tidakPunyaIjazah', label: 'Tidak Punya Ijazah' },
      { key: 'sdSederajat', label: 'SD/Sederajat' },
      { key: 'smpSederajat', label: 'SMP/Sederajat' },
      { key: 'smaSederajat', label: 'SMA/Sederajat' },
      { key: 'diploma123', label: 'D1/D2/D3' },
      { key: 'diploma4S1', label: 'D4/S1' },
      { key: 's2S3', label: 'S2/S3' },
    ],
    baris: [
      {
        label: 'RW 01',
        nilai: {
          tidakPunyaIjazah: 175,
          sdSederajat: 278,
          smpSederajat: 320,
          smaSederajat: 404,
          diploma123: 19,
          diploma4S1: 105,
          s2S3: 13,
        },
      },
      {
        label: 'RW 02',
        nilai: {
          tidakPunyaIjazah: 99,
          sdSederajat: 171,
          smpSederajat: 160,
          smaSederajat: 252,
          diploma123: 36,
          diploma4S1: 151,
          s2S3: 10,
        },
      },
      {
        label: 'RW 03',
        nilai: {
          tidakPunyaIjazah: 96,
          sdSederajat: 116,
          smpSederajat: 111,
          smaSederajat: 128,
          diploma123: 11,
          diploma4S1: 14,
          s2S3: 3,
        },
      },
    ],
    jumlah: {
      tidakPunyaIjazah: 370,
      sdSederajat: 565,
      smpSederajat: 591,
      smaSederajat: 784,
      diploma123: 66,
      diploma4S1: 270,
      s2S3: 26,
    },
  },
  {
    id: 'lapangan-usaha',
    nomor: 'Tabel 4.3',
    judul:
      'Jumlah Penduduk Usia 5 Tahun ke Atas Menurut Lapangan Usaha',
    kelompok: 'Lapangan Usaha',
    labelBaris: 'RW',
    kolom: [
      {
        key: 'pertanianPadiPalawija',
        label: 'Pertanian Tanaman Padi & Palawija',
      },
      { key: 'hortikultura', label: 'Hortikultura' },
      { key: 'perkebunan', label: 'Perkebunan' },
      { key: 'perikananTangkap', label: 'Perikanan Tangkap' },
      { key: 'perikananBudidaya', label: 'Perikanan Budidaya' },
      { key: 'peternakan', label: 'Peternakan' },
      {
        key: 'kehutananPertanianLainnya',
        label: 'Kehutanan & Pertanian Lainnya',
      },
      {
        key: 'pertambanganPenggalian',
        label: 'Pertambangan/Penggalian',
      },
      { key: 'industriPengolahan', label: 'Industri Pengolahan' },
      { key: 'listrikGas', label: 'Listrik & Gas' },
      {
        key: 'bangunanKonstruksi',
        label: 'Bangunan/Konstruksi',
      },
      { key: 'perdagangan', label: 'Perdagangan' },
      { key: 'hotelRumahMakan', label: 'Hotel & Rumah Makan' },
      {
        key: 'transportasiPergudangan',
        label: 'Transportasi & Pergudangan',
      },
      {
        key: 'informasiKomunikasi',
        label: 'Informasi & Komunikasi',
      },
      {
        key: 'keuanganAsuransi',
        label: 'Keuangan & Asuransi',
      },
      { key: 'jasaPendidikan', label: 'Jasa Pendidikan' },
      { key: 'jasaKesehatan', label: 'Jasa Kesehatan' },
      {
        key: 'jasaKemasyarakatan',
        label: 'Jasa Kemasyarakatan, Pemerintah, & Perorangan',
      },
      { key: 'pemulung', label: 'Pemulung' },
      { key: 'tki', label: 'TKI' },
      { key: 'lainnya', label: 'Lainnya' },
    ],
    baris: [
      {
        label: 'RW 01',
        nilai: {
          pertanianPadiPalawija: 15,
          hortikultura: 1,
          perkebunan: 0,
          perikananTangkap: 1,
          perikananBudidaya: 2,
          peternakan: 6,
          kehutananPertanianLainnya: 1,
          pertambanganPenggalian: 4,
          industriPengolahan: 173,
          listrikGas: 3,
          bangunanKonstruksi: 55,
          perdagangan: 133,
          hotelRumahMakan: 16,
          transportasiPergudangan: 31,
          informasiKomunikasi: 4,
          keuanganAsuransi: 9,
          jasaPendidikan: 39,
          jasaKesehatan: 7,
          jasaKemasyarakatan: 279,
          pemulung: 2,
          tki: 1,
          lainnya: 6,
        },
      },
      {
        label: 'RW 02',
        nilai: {
          pertanianPadiPalawija: 21,
          hortikultura: 3,
          perkebunan: 4,
          perikananTangkap: 2,
          perikananBudidaya: 0,
          peternakan: 9,
          kehutananPertanianLainnya: 0,
          pertambanganPenggalian: 0,
          industriPengolahan: 134,
          listrikGas: 6,
          bangunanKonstruksi: 62,
          perdagangan: 80,
          hotelRumahMakan: 23,
          transportasiPergudangan: 40,
          informasiKomunikasi: 12,
          keuanganAsuransi: 18,
          jasaPendidikan: 58,
          jasaKesehatan: 12,
          jasaKemasyarakatan: 101,
          pemulung: 3,
          tki: 3,
          lainnya: 1,
        },
      },
      {
        label: 'RW 03',
        nilai: {
          pertanianPadiPalawija: 41,
          hortikultura: 0,
          perkebunan: 1,
          perikananTangkap: 0,
          perikananBudidaya: 0,
          peternakan: 2,
          kehutananPertanianLainnya: 0,
          pertambanganPenggalian: 0,
          industriPengolahan: 108,
          listrikGas: 3,
          bangunanKonstruksi: 64,
          perdagangan: 24,
          hotelRumahMakan: 5,
          transportasiPergudangan: 11,
          informasiKomunikasi: 0,
          keuanganAsuransi: 2,
          jasaPendidikan: 7,
          jasaKesehatan: 0,
          jasaKemasyarakatan: 36,
          pemulung: 2,
          tki: 0,
          lainnya: 1,
        },
      },
    ],
    jumlah: {
      pertanianPadiPalawija: 77,
      hortikultura: 4,
      perkebunan: 5,
      perikananTangkap: 3,
      perikananBudidaya: 2,
      peternakan: 17,
      kehutananPertanianLainnya: 1,
      pertambanganPenggalian: 4,
      industriPengolahan: 415,
      listrikGas: 12,
      bangunanKonstruksi: 181,
      perdagangan: 237,
      hotelRumahMakan: 44,
      transportasiPergudangan: 82,
      informasiKomunikasi: 16,
      keuanganAsuransi: 29,
      jasaPendidikan: 104,
      jasaKesehatan: 19,
      jasaKemasyarakatan: 416,
      pemulung: 7,
      tki: 4,
      lainnya: 8,
    },
    bagianKolom: [
      {
        judul: 'Pertanian, Perikanan, dan Perkebunan',
        keys: [
          'pertanianPadiPalawija',
          'hortikultura',
          'perkebunan',
          'perikananTangkap',
          'perikananBudidaya',
        ],
      },
      {
        judul: 'Peternakan, Sumber Daya, dan Industri',
        keys: [
          'peternakan',
          'kehutananPertanianLainnya',
          'pertambanganPenggalian',
          'industriPengolahan',
          'listrikGas',
        ],
      },
      {
        judul: 'Konstruksi, Perdagangan, dan Jasa Penunjang',
        keys: [
          'bangunanKonstruksi',
          'perdagangan',
          'hotelRumahMakan',
          'transportasiPergudangan',
          'informasiKomunikasi',
          'keuanganAsuransi',
        ],
      },
      {
        judul: 'Jasa dan Pekerjaan Lainnya',
        keys: [
          'jasaPendidikan',
          'jasaKesehatan',
          'jasaKemasyarakatan',
          'pemulung',
          'tki',
          'lainnya',
        ],
      },
    ],
  },
];

export const DATA_PENDIDIKAN_2026: TabelPendidikan[] = [
  {
    id: 'partisipasi-sekolah',
    nomor: 'Tabel 4.1',
    judul:
      'Jumlah Penduduk Usia 5 Tahun ke Atas Menurut Partisipasi Sekolah',
    kelompok: 'Partisipasi dan Pendidikan Formal',
    labelBaris: 'RW',
    kolom: [
      {
        key: 'tidakBelumPernahSekolah',
        label: 'Tidak/Belum Pernah Sekolah',
      },
      { key: 'masihSekolah', label: 'Masih Sekolah' },
      {
        key: 'tidakBersekolahLagi',
        label: 'Tidak Bersekolah Lagi',
      },
    ],
    baris: [
      {
        label: 'RW 01',
        nilai: {
          tidakBelumPernahSekolah: 31,
          masihSekolah: 332,
          tidakBersekolahLagi: 984,
        },
      },
      {
        label: 'RW 02',
        nilai: {
          tidakBelumPernahSekolah: 89,
          masihSekolah: 181,
          tidakBersekolahLagi: 698,
        },
      },
      {
        label: 'RW 03',
        nilai: {
          tidakBelumPernahSekolah: 32,
          masihSekolah: 106,
          tidakBersekolahLagi: 385,
        },
      },
    ],
    jumlah: {
      tidakBelumPernahSekolah: 152,
      masihSekolah: 619,
      tidakBersekolahLagi: 2067,
    },
  },
  {
    id: 'ijazah-tertinggi',
    nomor: 'Tabel 4.2',
    judul:
      'Jumlah Penduduk Usia 5 Tahun ke Atas Menurut Ijazah Tertinggi yang Dimiliki',
    kelompok: 'Partisipasi dan Pendidikan Formal',
    labelBaris: 'RW',
    kolom: [
      { key: 'tidakPunyaIjazah', label: 'Tidak Punya Ijazah' },
      { key: 'sdSederajat', label: 'SD/Sederajat' },
      { key: 'smpSederajat', label: 'SMP/Sederajat' },
      { key: 'smaSederajat', label: 'SMA/Sederajat' },
      { key: 'diploma123', label: 'D1/D2/D3' },
      { key: 'diploma4S1', label: 'D4/S1' },
      { key: 's2S3', label: 'S2/S3' },
    ],
    baris: [
      {
        label: 'RW 01',
        nilai: {
          tidakPunyaIjazah: 173,
          sdSederajat: 275,
          smpSederajat: 318,
          smaSederajat: 408,
          diploma123: 19,
          diploma4S1: 106,
          s2S3: 13,
        },
      },
      {
        label: 'RW 02',
        nilai: {
          tidakPunyaIjazah: 97,
          sdSederajat: 173,
          smpSederajat: 157,
          smaSederajat: 252,
          diploma123: 36,
          diploma4S1: 153,
          s2S3: 11,
        },
      },
      {
        label: 'RW 03',
        nilai: {
          tidakPunyaIjazah: 96,
          sdSederajat: 116,
          smpSederajat: 111,
          smaSederajat: 128,
          diploma123: 11,
          diploma4S1: 14,
          s2S3: 3,
        },
      },
    ],
    jumlah: {
      tidakPunyaIjazah: 366,
      sdSederajat: 564,
      smpSederajat: 584,
      smaSederajat: 788,
      diploma123: 66,
      diploma4S1: 273,
      s2S3: 27,
    },
    catatan:
      'Pada dokumen sumber, jumlah SMP/Sederajat tertulis 584, sedangkan penjumlahan RW 01–03 menghasilkan 586. Nilai jumlah tetap ditampilkan sesuai dokumen sumber.',
  },
  {
    id: 'lapangan-usaha',
    nomor: 'Tabel 4.3',
    judul:
      'Jumlah Penduduk Usia 5 Tahun ke Atas Menurut Lapangan Usaha',
    kelompok: 'Lapangan Usaha',
    labelBaris: 'RW',
    kolom: [
      {
        key: 'pertanianPadiPalawija',
        label: 'Pertanian Tanaman Padi & Palawija',
      },
      { key: 'hortikultura', label: 'Hortikultura' },
      { key: 'perkebunan', label: 'Perkebunan' },
      { key: 'perikananTangkap', label: 'Perikanan Tangkap' },
      { key: 'perikananBudidaya', label: 'Perikanan Budidaya' },
      { key: 'peternakan', label: 'Peternakan' },
      {
        key: 'kehutananPertanianLainnya',
        label: 'Kehutanan & Pertanian Lainnya',
      },
      {
        key: 'pertambanganPenggalian',
        label: 'Pertambangan/Penggalian',
      },
      { key: 'industriPengolahan', label: 'Industri Pengolahan' },
      { key: 'listrikGas', label: 'Listrik & Gas' },
      {
        key: 'bangunanKonstruksi',
        label: 'Bangunan/Konstruksi',
      },
      { key: 'perdagangan', label: 'Perdagangan' },
      { key: 'hotelRumahMakan', label: 'Hotel & Rumah Makan' },
      {
        key: 'transportasiPergudangan',
        label: 'Transportasi & Pergudangan',
      },
      {
        key: 'informasiKomunikasi',
        label: 'Informasi & Komunikasi',
      },
      {
        key: 'keuanganAsuransi',
        label: 'Keuangan & Asuransi',
      },
      { key: 'jasaPendidikan', label: 'Jasa Pendidikan' },
      { key: 'jasaKesehatan', label: 'Jasa Kesehatan' },
      {
        key: 'jasaKemasyarakatan',
        label: 'Jasa Kemasyarakatan, Pemerintah, & Perorangan',
      },
      { key: 'pemulung', label: 'Pemulung' },
      { key: 'tki', label: 'TKI' },
      { key: 'lainnya', label: 'Lainnya' },
    ],
    baris: [
      {
        label: 'RW 01',
        nilai: {
          pertanianPadiPalawija: 15,
          hortikultura: 1,
          perkebunan: 0,
          perikananTangkap: 1,
          perikananBudidaya: 2,
          peternakan: 5,
          kehutananPertanianLainnya: 1,
          pertambanganPenggalian: 4,
          industriPengolahan: 176,
          listrikGas: 3,
          bangunanKonstruksi: 55,
          perdagangan: 133,
          hotelRumahMakan: 15,
          transportasiPergudangan: 31,
          informasiKomunikasi: 4,
          keuanganAsuransi: 9,
          jasaPendidikan: 39,
          jasaKesehatan: 7,
          jasaKemasyarakatan: 280,
          pemulung: 2,
          tki: 1,
          lainnya: 6,
        },
      },
      {
        label: 'RW 02',
        nilai: {
          pertanianPadiPalawija: 20,
          hortikultura: 3,
          perkebunan: 4,
          perikananTangkap: 2,
          perikananBudidaya: 0,
          peternakan: 9,
          kehutananPertanianLainnya: 0,
          pertambanganPenggalian: 0,
          industriPengolahan: 137,
          listrikGas: 6,
          bangunanKonstruksi: 62,
          perdagangan: 79,
          hotelRumahMakan: 25,
          transportasiPergudangan: 41,
          informasiKomunikasi: 12,
          keuanganAsuransi: 18,
          jasaPendidikan: 57,
          jasaKesehatan: 12,
          jasaKemasyarakatan: 100,
          pemulung: 3,
          tki: 3,
          lainnya: 1,
        },
      },
      {
        label: 'RW 03',
        nilai: {
          pertanianPadiPalawija: 41,
          hortikultura: 0,
          perkebunan: 1,
          perikananTangkap: 0,
          perikananBudidaya: 0,
          peternakan: 2,
          kehutananPertanianLainnya: 0,
          pertambanganPenggalian: 0,
          industriPengolahan: 108,
          listrikGas: 3,
          bangunanKonstruksi: 64,
          perdagangan: 24,
          hotelRumahMakan: 5,
          transportasiPergudangan: 11,
          informasiKomunikasi: 0,
          keuanganAsuransi: 2,
          jasaPendidikan: 7,
          jasaKesehatan: 0,
          jasaKemasyarakatan: 36,
          pemulung: 2,
          tki: 0,
          lainnya: 1,
        },
      },
    ],
    jumlah: {
      pertanianPadiPalawija: 76,
      hortikultura: 4,
      perkebunan: 5,
      perikananTangkap: 3,
      perikananBudidaya: 2,
      peternakan: 16,
      kehutananPertanianLainnya: 1,
      pertambanganPenggalian: 4,
      industriPengolahan: 421,
      listrikGas: 12,
      bangunanKonstruksi: 181,
      perdagangan: 236,
      hotelRumahMakan: 45,
      transportasiPergudangan: 83,
      informasiKomunikasi: 16,
      keuanganAsuransi: 29,
      jasaPendidikan: 103,
      jasaKesehatan: 19,
      jasaKemasyarakatan: 416,
      pemulung: 7,
      tki: 4,
      lainnya: 8,
    },
    bagianKolom: [
      {
        judul: 'Pertanian, Perikanan, dan Perkebunan',
        keys: [
          'pertanianPadiPalawija',
          'hortikultura',
          'perkebunan',
          'perikananTangkap',
          'perikananBudidaya',
        ],
      },
      {
        judul: 'Peternakan, Sumber Daya, dan Industri',
        keys: [
          'peternakan',
          'kehutananPertanianLainnya',
          'pertambanganPenggalian',
          'industriPengolahan',
          'listrikGas',
        ],
      },
      {
        judul: 'Konstruksi, Perdagangan, dan Jasa Penunjang',
        keys: [
          'bangunanKonstruksi',
          'perdagangan',
          'hotelRumahMakan',
          'transportasiPergudangan',
          'informasiKomunikasi',
          'keuanganAsuransi',
        ],
      },
      {
        judul: 'Jasa dan Pekerjaan Lainnya',
        keys: [
          'jasaPendidikan',
          'jasaKesehatan',
          'jasaKemasyarakatan',
          'pemulung',
          'tki',
          'lainnya',
        ],
      },
    ],
  },
];

export function getDataPendidikan(
  kategori: KategoriDesaCantik,
  tahun: TahunDesaCantik,
) {
  if (kategori === 'pendidikan' && tahun === 2026) {
    return DATA_PENDIDIKAN_2026;
  }

  if (kategori === 'pendidikan' && tahun === 2025) {
    return DATA_PENDIDIKAN_2025;
  }

  return [];
}
