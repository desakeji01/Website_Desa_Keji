import type {
  KategoriDesaCantik,
  TahunDesaCantik,
} from '@/types/desa-cantik';

export interface KolomPerekonomian {
  key: string;
  label: string;
}

export interface BarisPerekonomian {
  label: string;
  nilai: Record<string, number>;
}

export interface BagianKolomPerekonomian {
  judul: string;
  keys: string[];
}

export type KelompokTabelPerekonomian =
  | 'Aset Keluarga'
  | 'Peternakan'
  | 'Pendapatan Keluarga';

export interface TabelPerekonomian {
  id: string;
  nomor: string;
  judul: string;
  kelompok: KelompokTabelPerekonomian;
  labelBaris: string;
  kolom: KolomPerekonomian[];
  baris: BarisPerekonomian[];
  jumlah: Record<string, number>;
  bagianKolom?: BagianKolomPerekonomian[];
  satuan?: string;
  catatan?: string;
}

export const SUMBER_DATA_PEREKONOMIAN_2025 =
  'Pendataan Penyusunan Direktori Data Desa Keji Tahun 2025';

export const SUMBER_DATA_PEREKONOMIAN_2026 =
  'Pendataan Penyusunan Direktori Data Desa Keji Tahun 2026';

export const DATA_PEREKONOMIAN_2025: TabelPerekonomian[] = [
  {
    id: 'aset-bergerak',
    nomor: 'Tabel 5.1',
    judul: 'Jumlah Keluarga Menurut Aset Bergerak',
    kelompok: 'Aset Keluarga',
    labelBaris: 'RW',
    satuan: 'keluarga',
    kolom: [
      {
        key: 'tabungGasLebih5Kg',
        label: 'Tabung Gas 5,5 kg atau Lebih',
      },
      { key: 'lemariEs', label: 'Lemari Es/Kulkas' },
      { key: 'ac', label: 'AC' },
      { key: 'pemanasAir', label: 'Pemanas Air' },
      {
        key: 'teleponRumah',
        label: 'Telepon Rumah (PSTN)',
      },
      { key: 'televisi', label: 'Televisi' },
      {
        key: 'emasTabungan',
        label:
          'Emas/Perhiasan & Tabungan (Senilai 10 gram Emas)',
      },
      { key: 'komputerLaptop', label: 'Komputer/Laptop' },
      { key: 'sepeda', label: 'Sepeda' },
      { key: 'sepedaMotor', label: 'Sepeda Motor' },
      { key: 'mobil', label: 'Mobil' },
      { key: 'perahu', label: 'Perahu' },
      { key: 'motorTempel', label: 'Motor Tempel' },
      { key: 'perahuMotor', label: 'Perahu Motor' },
      { key: 'kapal', label: 'Kapal' },
    ],
    baris: [
      {
        label: 'RW 01',
        nilai: {
          tabungGasLebih5Kg: 29,
          lemariEs: 359,
          ac: 23,
          pemanasAir: 16,
          teleponRumah: 2,
          televisi: 361,
          emasTabungan: 40,
          komputerLaptop: 105,
          sepeda: 121,
          sepedaMotor: 403,
          mobil: 92,
          perahu: 0,
          motorTempel: 0,
          perahuMotor: 0,
          kapal: 0,
        },
      },
      {
        label: 'RW 02',
        nilai: {
          tabungGasLebih5Kg: 36,
          lemariEs: 275,
          ac: 54,
          pemanasAir: 16,
          teleponRumah: 1,
          televisi: 273,
          emasTabungan: 137,
          komputerLaptop: 136,
          sepeda: 95,
          sepedaMotor: 300,
          mobil: 110,
          perahu: 0,
          motorTempel: 0,
          perahuMotor: 0,
          kapal: 0,
        },
      },
      {
        label: 'RW 03',
        nilai: {
          tabungGasLebih5Kg: 1,
          lemariEs: 134,
          ac: 4,
          pemanasAir: 2,
          teleponRumah: 0,
          televisi: 156,
          emasTabungan: 43,
          komputerLaptop: 19,
          sepeda: 34,
          sepedaMotor: 148,
          mobil: 12,
          perahu: 0,
          motorTempel: 0,
          perahuMotor: 0,
          kapal: 0,
        },
      },
    ],
    jumlah: {
      tabungGasLebih5Kg: 66,
      lemariEs: 768,
      ac: 81,
      pemanasAir: 34,
      teleponRumah: 3,
      televisi: 790,
      emasTabungan: 220,
      komputerLaptop: 260,
      sepeda: 250,
      sepedaMotor: 851,
      mobil: 214,
      perahu: 0,
      motorTempel: 0,
      perahuMotor: 0,
      kapal: 0,
    },
    bagianKolom: [
      {
        judul: 'Peralatan Rumah Tangga dan Komunikasi',
        keys: [
          'tabungGasLebih5Kg',
          'lemariEs',
          'ac',
          'pemanasAir',
          'teleponRumah',
        ],
      },
      {
        judul: 'Elektronik, Simpanan, dan Kendaraan Ringan',
        keys: [
          'televisi',
          'emasTabungan',
          'komputerLaptop',
          'sepeda',
          'sepedaMotor',
        ],
      },
      {
        judul: 'Kendaraan dan Angkutan Air',
        keys: [
          'mobil',
          'perahu',
          'motorTempel',
          'perahuMotor',
          'kapal',
        ],
      },
    ],
  },
  {
    id: 'jenis-ternak',
    nomor: 'Tabel 5.2',
    judul: 'Jumlah Ternak Menurut Jenis Ternak',
    kelompok: 'Peternakan',
    labelBaris: 'RW',
    satuan: 'ekor',
    kolom: [
      { key: 'sapi', label: 'Sapi' },
      { key: 'kerbau', label: 'Kerbau' },
      { key: 'kuda', label: 'Kuda' },
      { key: 'babi', label: 'Babi' },
      { key: 'kambingDomba', label: 'Kambing/Domba' },
    ],
    baris: [
      {
        label: 'RW 01',
        nilai: {
          sapi: 12,
          kerbau: 0,
          kuda: 0,
          babi: 0,
          kambingDomba: 90,
        },
      },
      {
        label: 'RW 02',
        nilai: {
          sapi: 41,
          kerbau: 6,
          kuda: 0,
          babi: 0,
          kambingDomba: 75,
        },
      },
      {
        label: 'RW 03',
        nilai: {
          sapi: 6,
          kerbau: 2,
          kuda: 0,
          babi: 0,
          kambingDomba: 46,
        },
      },
    ],
    jumlah: {
      sapi: 59,
      kerbau: 8,
      kuda: 0,
      babi: 0,
      kambingDomba: 211,
    },
  },
  {
    id: 'rata-rata-pendapatan',
    nomor: 'Tabel 5.3',
    judul: 'Jumlah Keluarga Menurut Rata-Rata Pendapatan per Bulan',
    kelompok: 'Pendapatan Keluarga',
    labelBaris: 'RW',
    satuan: 'keluarga',
    kolom: [
      { key: 'kurang1Juta', label: '< Rp1.000.000' },
      {
        key: 'antara1Dan2Juta',
        label: 'Rp1.000.000–Rp2.000.000',
      },
      {
        key: 'antara2Dan4Juta',
        label: 'Rp2.000.000–Rp4.000.000',
      },
      { key: 'lebih4Juta', label: '> Rp4.000.000' },
    ],
    baris: [
      {
        label: 'RW 01',
        nilai: {
          kurang1Juta: 44,
          antara1Dan2Juta: 43,
          antara2Dan4Juta: 204,
          lebih4Juta: 194,
        },
      },
      {
        label: 'RW 02',
        nilai: {
          kurang1Juta: 33,
          antara1Dan2Juta: 10,
          antara2Dan4Juta: 86,
          lebih4Juta: 223,
        },
      },
      {
        label: 'RW 03',
        nilai: {
          kurang1Juta: 33,
          antara1Dan2Juta: 19,
          antara2Dan4Juta: 90,
          lebih4Juta: 45,
        },
      },
    ],
    jumlah: {
      kurang1Juta: 110,
      antara1Dan2Juta: 72,
      antara2Dan4Juta: 380,
      lebih4Juta: 462,
    },
  },
];

export const DATA_PEREKONOMIAN_2026: TabelPerekonomian[] = [
  {
    id: 'aset-bergerak',
    nomor: 'Tabel 5.1',
    judul: 'Jumlah Keluarga Menurut Aset Bergerak',
    kelompok: 'Aset Keluarga',
    labelBaris: 'RW',
    satuan: 'keluarga',
    kolom: [
      {
        key: 'tabungGasLebih5Kg',
        label: 'Tabung Gas 5,5 kg atau Lebih',
      },
      { key: 'lemariEs', label: 'Lemari Es/Kulkas' },
      { key: 'ac', label: 'AC' },
      { key: 'pemanasAir', label: 'Pemanas Air' },
      {
        key: 'teleponRumah',
        label: 'Telepon Rumah (PSTN)',
      },
      { key: 'televisi', label: 'Televisi' },
      {
        key: 'emasTabungan',
        label:
          'Emas/Perhiasan & Tabungan (Senilai 10 gram Emas)',
      },
      { key: 'komputerLaptop', label: 'Komputer/Laptop' },
      { key: 'sepeda', label: 'Sepeda' },
      { key: 'sepedaMotor', label: 'Sepeda Motor' },
      { key: 'mobil', label: 'Mobil' },
      { key: 'perahu', label: 'Perahu' },
      { key: 'motorTempel', label: 'Motor Tempel' },
      { key: 'perahuMotor', label: 'Perahu Motor' },
      { key: 'kapal', label: 'Kapal' },
    ],
    baris: [
      {
        label: 'RW 01',
        nilai: {
          tabungGasLebih5Kg: 29,
          lemariEs: 360,
          ac: 23,
          pemanasAir: 16,
          teleponRumah: 2,
          televisi: 362,
          emasTabungan: 40,
          komputerLaptop: 105,
          sepeda: 121,
          sepedaMotor: 404,
          mobil: 92,
          perahu: 0,
          motorTempel: 0,
          perahuMotor: 0,
          kapal: 0,
        },
      },
      {
        label: 'RW 02',
        nilai: {
          tabungGasLebih5Kg: 36,
          lemariEs: 281,
          ac: 54,
          pemanasAir: 16,
          teleponRumah: 1,
          televisi: 281,
          emasTabungan: 139,
          komputerLaptop: 138,
          sepeda: 95,
          sepedaMotor: 308,
          mobil: 113,
          perahu: 0,
          motorTempel: 0,
          perahuMotor: 0,
          kapal: 0,
        },
      },
      {
        label: 'RW 03',
        nilai: {
          tabungGasLebih5Kg: 1,
          lemariEs: 134,
          ac: 4,
          pemanasAir: 2,
          teleponRumah: 0,
          televisi: 156,
          emasTabungan: 43,
          komputerLaptop: 19,
          sepeda: 34,
          sepedaMotor: 148,
          mobil: 12,
          perahu: 0,
          motorTempel: 0,
          perahuMotor: 0,
          kapal: 0,
        },
      },
    ],
    jumlah: {
      tabungGasLebih5Kg: 66,
      lemariEs: 775,
      ac: 81,
      pemanasAir: 34,
      teleponRumah: 3,
      televisi: 799,
      emasTabungan: 222,
      komputerLaptop: 262,
      sepeda: 250,
      sepedaMotor: 860,
      mobil: 217,
      perahu: 0,
      motorTempel: 0,
      perahuMotor: 0,
      kapal: 0,
    },
    catatan:
      'Pada dokumen sumber, jumlah Televisi tertulis 799, sedangkan penjumlahan RW 01–03 menghasilkan 798. Nilai jumlah tetap ditampilkan sesuai dokumen sumber.',
    bagianKolom: [
      {
        judul: 'Peralatan Rumah Tangga dan Komunikasi',
        keys: [
          'tabungGasLebih5Kg',
          'lemariEs',
          'ac',
          'pemanasAir',
          'teleponRumah',
        ],
      },
      {
        judul: 'Elektronik, Simpanan, dan Kendaraan Ringan',
        keys: [
          'televisi',
          'emasTabungan',
          'komputerLaptop',
          'sepeda',
          'sepedaMotor',
        ],
      },
      {
        judul: 'Kendaraan dan Angkutan Air',
        keys: [
          'mobil',
          'perahu',
          'motorTempel',
          'perahuMotor',
          'kapal',
        ],
      },
    ],
  },
  {
    id: 'jenis-ternak',
    nomor: 'Tabel 5.2',
    judul: 'Jumlah Ternak Menurut Jenis Ternak',
    kelompok: 'Peternakan',
    labelBaris: 'RW',
    satuan: 'ekor',
    kolom: [
      { key: 'sapi', label: 'Sapi' },
      { key: 'kerbau', label: 'Kerbau' },
      { key: 'kuda', label: 'Kuda' },
      { key: 'babi', label: 'Babi' },
      { key: 'kambingDomba', label: 'Kambing/Domba' },
    ],
    baris: [
      {
        label: 'RW 01',
        nilai: {
          sapi: 12,
          kerbau: 0,
          kuda: 0,
          babi: 0,
          kambingDomba: 90,
        },
      },
      {
        label: 'RW 02',
        nilai: {
          sapi: 44,
          kerbau: 6,
          kuda: 0,
          babi: 0,
          kambingDomba: 82,
        },
      },
      {
        label: 'RW 03',
        nilai: {
          sapi: 6,
          kerbau: 2,
          kuda: 0,
          babi: 0,
          kambingDomba: 46,
        },
      },
    ],
    jumlah: {
      sapi: 62,
      kerbau: 8,
      kuda: 0,
      babi: 0,
      kambingDomba: 218,
    },
  },
  {
    id: 'rata-rata-pendapatan',
    nomor: 'Tabel 5.3',
    judul: 'Jumlah Keluarga Menurut Rata-Rata Pendapatan per Bulan',
    kelompok: 'Pendapatan Keluarga',
    labelBaris: 'RW',
    satuan: 'keluarga',
    kolom: [
      { key: 'kurang1Juta', label: '< Rp1.000.000' },
      {
        key: 'antara1Dan2Juta',
        label: 'Rp1.000.000–Rp2.000.000',
      },
      {
        key: 'antara2Dan4Juta',
        label: 'Rp2.000.000–Rp4.000.000',
      },
      { key: 'lebih4Juta', label: '> Rp4.000.000' },
    ],
    baris: [
      {
        label: 'RW 01',
        nilai: {
          kurang1Juta: 44,
          antara1Dan2Juta: 43,
          antara2Dan4Juta: 205,
          lebih4Juta: 194,
        },
      },
      {
        label: 'RW 02',
        nilai: {
          kurang1Juta: 32,
          antara1Dan2Juta: 11,
          antara2Dan4Juta: 81,
          lebih4Juta: 231,
        },
      },
      {
        label: 'RW 03',
        nilai: {
          kurang1Juta: 33,
          antara1Dan2Juta: 19,
          antara2Dan4Juta: 90,
          lebih4Juta: 45,
        },
      },
    ],
    jumlah: {
      kurang1Juta: 109,
      antara1Dan2Juta: 73,
      antara2Dan4Juta: 376,
      lebih4Juta: 470,
    },
  },
];

export function getDataPerekonomian(
  kategori: KategoriDesaCantik,
  tahun: TahunDesaCantik,
) {
  if (kategori !== 'perekonomian') {
    return [];
  }

  if (tahun === 2025) {
    return DATA_PEREKONOMIAN_2025;
  }

  if (tahun === 2026) {
    return DATA_PEREKONOMIAN_2026;
  }

  return [];
}
