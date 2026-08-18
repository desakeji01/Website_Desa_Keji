import type {
  KategoriDesaCantik,
  TahunDesaCantik,
} from '@/types/desa-cantik';

export interface KolomPerumahan {
  key: string;
  label: string;
}

export interface BarisPerumahan {
  rw: 'RW 01' | 'RW 02' | 'RW 03';
  nilai: Record<string, number>;
}

export type KelompokTabelPerumahan =
  | 'Hunian dan Kondisi Fisik'
  | 'Air, Penerangan, dan Energi'
  | 'Sanitasi';

export interface TabelPerumahan {
  id: string;
  nomor: string;
  judul: string;
  kelompok: KelompokTabelPerumahan;
  kolom: KolomPerumahan[];
  baris: BarisPerumahan[];
  jumlah: Record<string, number>;
  catatan?: string;
}

export const SUMBER_DATA_PERUMAHAN_2025 =
  'Pendataan Penyusunan Direktori Data Desa Keji Tahun 2025';

export const SUMBER_DATA_PERUMAHAN_2026 =
  'Pendataan Penyusunan Direktori Data Desa Keji Tahun 2026';

export const DATA_PERUMAHAN_2026: TabelPerumahan[] = [
  {
    id: 'status-penguasaan',
    nomor: 'Tabel 2.1',
    judul:
      'Status Penguasaan Bangunan Tempat Tinggal yang Ditempati',
    kelompok: 'Hunian dan Kondisi Fisik',
    kolom: [
      { key: 'milikSendiri', label: 'Milik Sendiri' },
      { key: 'kontrakSewa', label: 'Kontrak/Sewa' },
      { key: 'bebasSewa', label: 'Bebas Sewa' },
      { key: 'dinas', label: 'Dinas' },
      { key: 'lainnya', label: 'Lainnya' },
    ],
    baris: [
      {
        rw: 'RW 01',
        nilai: {
          milikSendiri: 376,
          kontrakSewa: 15,
          bebasSewa: 98,
          dinas: 0,
          lainnya: 0,
        },
      },
      {
        rw: 'RW 02',
        nilai: {
          milikSendiri: 281,
          kontrakSewa: 11,
          bebasSewa: 70,
          dinas: 0,
          lainnya: 0,
        },
      },
      {
        rw: 'RW 03',
        nilai: {
          milikSendiri: 178,
          kontrakSewa: 1,
          bebasSewa: 20,
          dinas: 0,
          lainnya: 0,
        },
      },
    ],
    jumlah: {
      milikSendiri: 835,
      kontrakSewa: 27,
      bebasSewa: 188,
      dinas: 0,
      lainnya: 0,
    },
  },
  {
    id: 'luas-lantai',
    nomor: 'Tabel 2.2',
    judul: 'Jumlah Keluarga Menurut Luas Lantai',
    kelompok: 'Hunian dan Kondisi Fisik',
    kolom: [
      { key: 'kurang50', label: '< 50 m²' },
      { key: 'antara50Dan100', label: '50–100 m²' },
      { key: 'lebih100', label: '> 100 m²' },
    ],
    baris: [
      {
        rw: 'RW 01',
        nilai: {
          kurang50: 164,
          antara50Dan100: 263,
          lebih100: 62,
        },
      },
      {
        rw: 'RW 02',
        nilai: {
          kurang50: 73,
          antara50Dan100: 240,
          lebih100: 48,
        },
      },
      {
        rw: 'RW 03',
        nilai: {
          kurang50: 101,
          antara50Dan100: 88,
          lebih100: 10,
        },
      },
    ],
    jumlah: {
      kurang50: 338,
      antara50Dan100: 591,
      lebih100: 120,
    },
  },
  {
    id: 'jenis-lantai',
    nomor: 'Tabel 2.3',
    judul: 'Jumlah Keluarga Menurut Jenis Lantai Terluas',
    kelompok: 'Hunian dan Kondisi Fisik',
    kolom: [
      { key: 'marmerGranit', label: 'Marmer/Granit' },
      { key: 'keramik', label: 'Keramik' },
      {
        key: 'parketVinilPermadani',
        label: 'Parket/Vinil/Permadani',
      },
      { key: 'ubinTegelTeraso', label: 'Ubin/Tegel/Teraso' },
      {
        key: 'kayuKualitasTinggi',
        label: 'Kayu/Papan Kualitas Tinggi',
      },
      { key: 'semenBataMerah', label: 'Semen/Bata Merah' },
      { key: 'bambu', label: 'Bambu' },
      {
        key: 'kayuKualitasRendah',
        label: 'Kayu/Papan Kualitas Rendah',
      },
      { key: 'tanah', label: 'Tanah' },
      { key: 'lainnya', label: 'Lainnya' },
    ],
    baris: [
      {
        rw: 'RW 01',
        nilai: {
          marmerGranit: 21,
          keramik: 375,
          parketVinilPermadani: 0,
          ubinTegelTeraso: 25,
          kayuKualitasTinggi: 0,
          semenBataMerah: 67,
          bambu: 0,
          kayuKualitasRendah: 0,
          tanah: 1,
          lainnya: 0,
        },
      },
      {
        rw: 'RW 02',
        nilai: {
          marmerGranit: 3,
          keramik: 299,
          parketVinilPermadani: 0,
          ubinTegelTeraso: 3,
          kayuKualitasTinggi: 0,
          semenBataMerah: 51,
          bambu: 0,
          kayuKualitasRendah: 0,
          tanah: 6,
          lainnya: 0,
        },
      },
      {
        rw: 'RW 03',
        nilai: {
          marmerGranit: 2,
          keramik: 155,
          parketVinilPermadani: 0,
          ubinTegelTeraso: 7,
          kayuKualitasTinggi: 0,
          semenBataMerah: 29,
          bambu: 0,
          kayuKualitasRendah: 0,
          tanah: 6,
          lainnya: 0,
        },
      },
    ],
    jumlah: {
      marmerGranit: 26,
      keramik: 829,
      parketVinilPermadani: 0,
      ubinTegelTeraso: 35,
      kayuKualitasTinggi: 0,
      semenBataMerah: 147,
      bambu: 0,
      kayuKualitasRendah: 0,
      tanah: 13,
      lainnya: 0,
    },
  },
  {
    id: 'jenis-dinding',
    nomor: 'Tabel 2.4',
    judul: 'Jumlah Keluarga Menurut Jenis Dinding Terluas',
    kelompok: 'Hunian dan Kondisi Fisik',
    kolom: [
      { key: 'tembok', label: 'Tembok' },
      {
        key: 'plesteranAnyaman',
        label: 'Plesteran Anyaman Bambu/Kawat',
      },
      { key: 'kayu', label: 'Kayu' },
      { key: 'anyamanBambu', label: 'Anyaman Bambu' },
      { key: 'batangKayu', label: 'Batang Kayu' },
      { key: 'bambu', label: 'Bambu' },
      { key: 'lainnya', label: 'Lainnya' },
    ],
    baris: [
      {
        rw: 'RW 01',
        nilai: {
          tembok: 475,
          plesteranAnyaman: 0,
          kayu: 14,
          anyamanBambu: 0,
          batangKayu: 0,
          bambu: 0,
          lainnya: 0,
        },
      },
      {
        rw: 'RW 02',
        nilai: {
          tembok: 341,
          plesteranAnyaman: 0,
          kayu: 20,
          anyamanBambu: 0,
          batangKayu: 0,
          bambu: 0,
          lainnya: 0,
        },
      },
      {
        rw: 'RW 03',
        nilai: {
          tembok: 198,
          plesteranAnyaman: 0,
          kayu: 1,
          anyamanBambu: 0,
          batangKayu: 0,
          bambu: 0,
          lainnya: 0,
        },
      },
    ],
    jumlah: {
      tembok: 1014,
      plesteranAnyaman: 0,
      kayu: 35,
      anyamanBambu: 0,
      batangKayu: 0,
      bambu: 0,
      lainnya: 0,
    },
  },
  {
    id: 'jenis-atap',
    nomor: 'Tabel 2.5',
    judul: 'Jumlah Keluarga Menurut Jenis Atap Terluas',
    kelompok: 'Hunian dan Kondisi Fisik',
    kolom: [
      { key: 'beton', label: 'Beton/Genteng Beton' },
      { key: 'gentengKeramik', label: 'Genteng Keramik' },
      { key: 'gentengMetal', label: 'Genteng Metal' },
      { key: 'gentengTanahLiat', label: 'Genteng Tanah Liat' },
      { key: 'asbes', label: 'Asbes' },
      { key: 'seng', label: 'Seng' },
      { key: 'sirap', label: 'Sirap' },
      { key: 'bambu', label: 'Bambu' },
      {
        key: 'jeramiIjuksDaun',
        label: 'Jerami/Ijuk/Daun-Daunan/Rumbia',
      },
      { key: 'lainnya', label: 'Lainnya' },
    ],
    baris: [
      {
        rw: 'RW 01',
        nilai: {
          beton: 12,
          gentengKeramik: 0,
          gentengMetal: 23,
          gentengTanahLiat: 359,
          asbes: 93,
          seng: 2,
          sirap: 0,
          bambu: 0,
          jeramiIjuksDaun: 0,
          lainnya: 0,
        },
      },
      {
        rw: 'RW 02',
        nilai: {
          beton: 4,
          gentengKeramik: 2,
          gentengMetal: 130,
          gentengTanahLiat: 190,
          asbes: 35,
          seng: 0,
          sirap: 0,
          bambu: 0,
          jeramiIjuksDaun: 0,
          lainnya: 0,
        },
      },
      {
        rw: 'RW 03',
        nilai: {
          beton: 6,
          gentengKeramik: 0,
          gentengMetal: 1,
          gentengTanahLiat: 112,
          asbes: 75,
          seng: 5,
          sirap: 0,
          bambu: 0,
          jeramiIjuksDaun: 0,
          lainnya: 0,
        },
      },
    ],
    jumlah: {
      beton: 22,
      gentengKeramik: 2,
      gentengMetal: 154,
      gentengTanahLiat: 661,
      asbes: 203,
      seng: 7,
      sirap: 0,
      bambu: 0,
      jeramiIjuksDaun: 0,
      lainnya: 0,
    },
  },
  {
    id: 'sumber-air-minum',
    nomor: 'Tabel 2.6',
    judul: 'Jumlah Keluarga Menurut Sumber Air Minum',
    kelompok: 'Air, Penerangan, dan Energi',
    kolom: [
      {
        key: 'airKemasanBermerek',
        label: 'Air Kemasan Bermerek',
      },
      { key: 'airIsiUlang', label: 'Air Isi Ulang' },
      { key: 'ledingMeteran', label: 'Leding Meteran' },
      { key: 'ledingEceran', label: 'Leding Eceran' },
      { key: 'sumurBorPompa', label: 'Sumur Bor/Pompa' },
      { key: 'sumurTerlindung', label: 'Sumur Terlindung' },
      {
        key: 'sumurTakTerlindung',
        label: 'Sumur Tak Terlindung',
      },
      {
        key: 'mataAirTerlindung',
        label: 'Mata Air Terlindung',
      },
      {
        key: 'mataAirTakTerlindung',
        label: 'Mata Air Tak Terlindung',
      },
      {
        key: 'airSungaiDanau',
        label: 'Air Sungai/Danau/Waduk',
      },
      { key: 'airHujan', label: 'Air Hujan' },
      { key: 'lainnya', label: 'Lainnya' },
    ],
    baris: [
      {
        rw: 'RW 01',
        nilai: {
          airKemasanBermerek: 9,
          airIsiUlang: 26,
          ledingMeteran: 0,
          ledingEceran: 0,
          sumurBorPompa: 1,
          sumurTerlindung: 0,
          sumurTakTerlindung: 0,
          mataAirTerlindung: 453,
          mataAirTakTerlindung: 0,
          airSungaiDanau: 0,
          airHujan: 0,
          lainnya: 0,
        },
      },
      {
        rw: 'RW 02',
        nilai: {
          airKemasanBermerek: 71,
          airIsiUlang: 29,
          ledingMeteran: 0,
          ledingEceran: 0,
          sumurBorPompa: 24,
          sumurTerlindung: 0,
          sumurTakTerlindung: 0,
          mataAirTerlindung: 237,
          mataAirTakTerlindung: 0,
          airSungaiDanau: 0,
          airHujan: 0,
          lainnya: 0,
        },
      },
      {
        rw: 'RW 03',
        nilai: {
          airKemasanBermerek: 0,
          airIsiUlang: 4,
          ledingMeteran: 0,
          ledingEceran: 0,
          sumurBorPompa: 0,
          sumurTerlindung: 0,
          sumurTakTerlindung: 0,
          mataAirTerlindung: 195,
          mataAirTakTerlindung: 0,
          airSungaiDanau: 0,
          airHujan: 0,
          lainnya: 0,
        },
      },
    ],
    jumlah: {
      airKemasanBermerek: 80,
      airIsiUlang: 59,
      ledingMeteran: 0,
      ledingEceran: 0,
      sumurBorPompa: 25,
      sumurTerlindung: 0,
      sumurTakTerlindung: 0,
      mataAirTerlindung: 885,
      mataAirTakTerlindung: 0,
      airSungaiDanau: 0,
      airHujan: 0,
      lainnya: 0,
    },
  },
  {
    id: 'cara-memperoleh-air',
    nomor: 'Tabel 2.7',
    judul: 'Jumlah Keluarga Menurut Cara Memperoleh Air Minum',
    kelompok: 'Air, Penerangan, dan Energi',
    kolom: [
      { key: 'membeliEceran', label: 'Membeli Eceran' },
      { key: 'langganan', label: 'Langganan' },
      { key: 'tidakMembeli', label: 'Tidak Membeli' },
    ],
    baris: [
      {
        rw: 'RW 01',
        nilai: {
          membeliEceran: 23,
          langganan: 464,
          tidakMembeli: 2,
        },
      },
      {
        rw: 'RW 02',
        nilai: {
          membeliEceran: 97,
          langganan: 264,
          tidakMembeli: 1,
        },
      },
      {
        rw: 'RW 03',
        nilai: {
          membeliEceran: 4,
          langganan: 190,
          tidakMembeli: 5,
        },
      },
    ],
    jumlah: {
      membeliEceran: 124,
      langganan: 921,
      tidakMembeli: 8,
    },
  },
  {
    id: 'sumber-penerangan',
    nomor: 'Tabel 2.8',
    judul: 'Jumlah Keluarga Menurut Sumber Penerangan Utama',
    kelompok: 'Air, Penerangan, dan Energi',
    kolom: [
      { key: 'listrikPln', label: 'Listrik PLN' },
      { key: 'listrikNonPln', label: 'Listrik Non-PLN' },
      { key: 'bukanListrik', label: 'Bukan Listrik' },
    ],
    baris: [
      {
        rw: 'RW 01',
        nilai: {
          listrikPln: 489,
          listrikNonPln: 0,
          bukanListrik: 0,
        },
      },
      {
        rw: 'RW 02',
        nilai: {
          listrikPln: 362,
          listrikNonPln: 0,
          bukanListrik: 0,
        },
      },
      {
        rw: 'RW 03',
        nilai: {
          listrikPln: 199,
          listrikNonPln: 0,
          bukanListrik: 0,
        },
      },
    ],
    jumlah: {
      listrikPln: 1050,
      listrikNonPln: 0,
      bukanListrik: 0,
    },
  },
  {
    id: 'daya-listrik',
    nomor: 'Tabel 2.9',
    judul:
      'Jumlah Keluarga Menurut Daya Terpasang Sumber Penerangan Listrik PLN',
    kelompok: 'Air, Penerangan, dan Energi',
    kolom: [
      { key: 'watt450', label: '450 watt' },
      { key: 'watt900', label: '900 watt' },
      { key: 'watt1300', label: '1.300 watt' },
      { key: 'watt2200', label: '2.200 watt' },
      { key: 'lebih2200', label: '> 2.200 watt' },
      { key: 'tanpaMeteran', label: 'Tanpa Meteran' },
    ],
    baris: [
      {
        rw: 'RW 01',
        nilai: {
          watt450: 140,
          watt900: 270,
          watt1300: 49,
          watt2200: 10,
          lebih2200: 5,
          tanpaMeteran: 15,
        },
      },
      {
        rw: 'RW 02',
        nilai: {
          watt450: 76,
          watt900: 120,
          watt1300: 133,
          watt2200: 5,
          lebih2200: 1,
          tanpaMeteran: 27,
        },
      },
      {
        rw: 'RW 03',
        nilai: {
          watt450: 105,
          watt900: 81,
          watt1300: 7,
          watt2200: 1,
          lebih2200: 1,
          tanpaMeteran: 4,
        },
      },
    ],
    jumlah: {
      watt450: 321,
      watt900: 471,
      watt1300: 189,
      watt2200: 16,
      lebih2200: 7,
      tanpaMeteran: 46,
    },
  },
  {
    id: 'bahan-bakar-memasak',
    nomor: 'Tabel 2.10',
    judul:
      'Jumlah Keluarga Menurut Bahan Bakar/Energi Utama untuk Memasak',
    kelompok: 'Air, Penerangan, dan Energi',
    kolom: [
      { key: 'listrik', label: 'Listrik' },
      { key: 'gasLebih3Kg', label: 'Gas > 3 kg' },
      { key: 'gas3Kg', label: 'Gas 3 kg' },
      { key: 'gasKotaBiogas', label: 'Gas Kota/Biogas' },
      { key: 'minyakTanah', label: 'Minyak Tanah' },
      { key: 'briket', label: 'Briket' },
      { key: 'arang', label: 'Arang' },
      { key: 'kayuBakar', label: 'Kayu Bakar' },
      {
        key: 'tidakMemasak',
        label: 'Tidak Memasak di Rumah',
      },
    ],
    baris: [
      {
        rw: 'RW 01',
        nilai: {
          listrik: 1,
          gasLebih3Kg: 12,
          gas3Kg: 460,
          gasKotaBiogas: 0,
          minyakTanah: 0,
          briket: 0,
          arang: 0,
          kayuBakar: 7,
          tidakMemasak: 9,
        },
      },
      {
        rw: 'RW 02',
        nilai: {
          listrik: 1,
          gasLebih3Kg: 13,
          gas3Kg: 330,
          gasKotaBiogas: 0,
          minyakTanah: 0,
          briket: 0,
          arang: 0,
          kayuBakar: 10,
          tidakMemasak: 8,
        },
      },
      {
        rw: 'RW 03',
        nilai: {
          listrik: 0,
          gasLebih3Kg: 0,
          gas3Kg: 177,
          gasKotaBiogas: 0,
          minyakTanah: 0,
          briket: 0,
          arang: 0,
          kayuBakar: 16,
          tidakMemasak: 6,
        },
      },
    ],
    jumlah: {
      listrik: 2,
      gasLebih3Kg: 25,
      gas3Kg: 967,
      gasKotaBiogas: 0,
      minyakTanah: 0,
      briket: 0,
      arang: 0,
      kayuBakar: 33,
      tidakMemasak: 23,
    },
  },
  {
    id: 'fasilitas-bab',
    nomor: 'Tabel 2.11',
    judul:
      'Jumlah Keluarga Menurut Penggunaan Fasilitas Tempat Buang Air Besar',
    kelompok: 'Sanitasi',
    kolom: [
      { key: 'sendiri', label: 'Sendiri' },
      { key: 'bersama', label: 'Bersama' },
      { key: 'umum', label: 'Umum' },
      { key: 'tidakAda', label: 'Tidak Ada' },
    ],
    baris: [
      {
        rw: 'RW 01',
        nilai: {
          sendiri: 481,
          bersama: 8,
          umum: 0,
          tidakAda: 0,
        },
      },
      {
        rw: 'RW 02',
        nilai: {
          sendiri: 357,
          bersama: 5,
          umum: 0,
          tidakAda: 0,
        },
      },
      {
        rw: 'RW 03',
        nilai: {
          sendiri: 198,
          bersama: 1,
          umum: 0,
          tidakAda: 0,
        },
      },
    ],
    jumlah: {
      sendiri: 1036,
      bersama: 14,
      umum: 0,
      tidakAda: 0,
    },
  },
  {
    id: 'jenis-kloset',
    nomor: 'Tabel 2.12',
    judul: 'Jumlah Keluarga Menurut Jenis Kloset',
    kelompok: 'Sanitasi',
    kolom: [
      { key: 'leherAngsa', label: 'Leher Angsa' },
      { key: 'plengsengan', label: 'Plengsengan' },
      { key: 'cemplungCubluk', label: 'Cemplung/Cubluk' },
      { key: 'tidakPakai', label: 'Tidak Pakai' },
    ],
    baris: [
      {
        rw: 'RW 01',
        nilai: {
          leherAngsa: 489,
          plengsengan: 0,
          cemplungCubluk: 0,
          tidakPakai: 0,
        },
      },
      {
        rw: 'RW 02',
        nilai: {
          leherAngsa: 362,
          plengsengan: 0,
          cemplungCubluk: 0,
          tidakPakai: 0,
        },
      },
      {
        rw: 'RW 03',
        nilai: {
          leherAngsa: 199,
          plengsengan: 0,
          cemplungCubluk: 0,
          tidakPakai: 0,
        },
      },
    ],
    jumlah: {
      leherAngsa: 1050,
      plengsengan: 0,
      cemplungCubluk: 0,
      tidakPakai: 0,
    },
  },
  {
    id: 'pembuangan-tinja',
    nomor: 'Tabel 2.13',
    judul:
      'Jumlah Keluarga Menurut Tempat Pembuangan Akhir Tinja',
    kelompok: 'Sanitasi',
    kolom: [
      { key: 'tangki', label: 'Tangki' },
      { key: 'spal', label: 'SPAL' },
      { key: 'lubangTanah', label: 'Lubang Tanah' },
      {
        key: 'kolamSawahSungai',
        label: 'Kolam/Sawah/Sungai/Danau/Laut',
      },
      {
        key: 'pantaiTanahLapang',
        label: 'Pantai/Tanah Lapang/Kebun',
      },
      { key: 'lainnya', label: 'Lainnya' },
    ],
    baris: [
      {
        rw: 'RW 01',
        nilai: {
          tangki: 489,
          spal: 0,
          lubangTanah: 0,
          kolamSawahSungai: 0,
          pantaiTanahLapang: 0,
          lainnya: 0,
        },
      },
      {
        rw: 'RW 02',
        nilai: {
          tangki: 362,
          spal: 0,
          lubangTanah: 0,
          kolamSawahSungai: 0,
          pantaiTanahLapang: 0,
          lainnya: 0,
        },
      },
      {
        rw: 'RW 03',
        nilai: {
          tangki: 199,
          spal: 0,
          lubangTanah: 0,
          kolamSawahSungai: 0,
          pantaiTanahLapang: 0,
          lainnya: 0,
        },
      },
    ],
    jumlah: {
      tangki: 1050,
      spal: 0,
      lubangTanah: 0,
      kolamSawahSungai: 0,
      pantaiTanahLapang: 0,
      lainnya: 0,
    },
  },
];

interface NilaiTabelPerumahanTahunan {
  baris: [
    Record<string, number>,
    Record<string, number>,
    Record<string, number>,
  ];
  jumlah: Record<string, number>;
  catatan?: string;
}

const NILAI_PERUMAHAN_2025: Record<
  string,
  NilaiTabelPerumahanTahunan
> = {
  'status-penguasaan': {
    baris: [
      {
        milikSendiri: 375,
        kontrakSewa: 15,
        bebasSewa: 98,
        dinas: 0,
        lainnya: 0,
      },
      {
        milikSendiri: 279,
        kontrakSewa: 11,
        bebasSewa: 71,
        dinas: 0,
        lainnya: 0,
      },
      {
        milikSendiri: 178,
        kontrakSewa: 1,
        bebasSewa: 20,
        dinas: 0,
        lainnya: 0,
      },
    ],
    jumlah: {
      milikSendiri: 832,
      kontrakSewa: 27,
      bebasSewa: 189,
      dinas: 0,
      lainnya: 0,
    },
  },
  'luas-lantai': {
    baris: [
      {
        kurang50: 163,
        antara50Dan100: 263,
        lebih100: 62,
      },
      {
        kurang50: 75,
        antara50Dan100: 237,
        lebih100: 48,
      },
      {
        kurang50: 101,
        antara50Dan100: 88,
        lebih100: 10,
      },
    ],
    jumlah: {
      kurang50: 339,
      antara50Dan100: 588,
      lebih100: 120,
    },
  },
  'jenis-lantai': {
    baris: [
      {
        marmerGranit: 21,
        keramik: 375,
        parketVinilPermadani: 0,
        ubinTegelTeraso: 24,
        kayuKualitasTinggi: 0,
        semenBataMerah: 67,
        bambu: 0,
        kayuKualitasRendah: 0,
        tanah: 1,
        lainnya: 0,
      },
      {
        marmerGranit: 3,
        keramik: 298,
        parketVinilPermadani: 0,
        ubinTegelTeraso: 3,
        kayuKualitasTinggi: 0,
        semenBataMerah: 51,
        bambu: 0,
        kayuKualitasRendah: 0,
        tanah: 6,
        lainnya: 0,
      },
      {
        marmerGranit: 2,
        keramik: 155,
        parketVinilPermadani: 0,
        ubinTegelTeraso: 7,
        kayuKualitasTinggi: 0,
        semenBataMerah: 29,
        bambu: 0,
        kayuKualitasRendah: 0,
        tanah: 6,
        lainnya: 0,
      },
    ],
    jumlah: {
      marmerGranit: 26,
      keramik: 828,
      parketVinilPermadani: 0,
      ubinTegelTeraso: 34,
      kayuKualitasTinggi: 0,
      semenBataMerah: 147,
      bambu: 0,
      kayuKualitasRendah: 0,
      tanah: 13,
      lainnya: 0,
    },
  },
  'jenis-dinding': {
    baris: [
      {
        tembok: 474,
        plesteranAnyaman: 0,
        kayu: 14,
        anyamanBambu: 0,
        batangKayu: 0,
        bambu: 0,
        lainnya: 0,
      },
      {
        tembok: 340,
        plesteranAnyaman: 0,
        kayu: 20,
        anyamanBambu: 0,
        batangKayu: 0,
        bambu: 0,
        lainnya: 0,
      },
      {
        tembok: 198,
        plesteranAnyaman: 0,
        kayu: 1,
        anyamanBambu: 0,
        batangKayu: 0,
        bambu: 0,
        lainnya: 0,
      },
    ],
    jumlah: {
      tembok: 1012,
      plesteranAnyaman: 0,
      kayu: 35,
      anyamanBambu: 0,
      batangKayu: 0,
      bambu: 0,
      lainnya: 0,
    },
  },
  'jenis-atap': {
    baris: [
      {
        beton: 12,
        gentengKeramik: 0,
        gentengMetal: 23,
        gentengTanahLiat: 359,
        asbes: 92,
        seng: 2,
        sirap: 0,
        bambu: 0,
        jeramiIjuksDaun: 0,
        lainnya: 0,
      },
      {
        beton: 4,
        gentengKeramik: 2,
        gentengMetal: 131,
        gentengTanahLiat: 188,
        asbes: 35,
        seng: 0,
        sirap: 0,
        bambu: 0,
        jeramiIjuksDaun: 0,
        lainnya: 0,
      },
      {
        beton: 6,
        gentengKeramik: 0,
        gentengMetal: 1,
        gentengTanahLiat: 112,
        asbes: 75,
        seng: 5,
        sirap: 0,
        bambu: 0,
        jeramiIjuksDaun: 0,
        lainnya: 0,
      },
    ],
    jumlah: {
      beton: 22,
      gentengKeramik: 2,
      gentengMetal: 155,
      gentengTanahLiat: 659,
      asbes: 202,
      seng: 7,
      sirap: 0,
      bambu: 0,
      jeramiIjuksDaun: 0,
      lainnya: 0,
    },
  },
  'sumber-air-minum': {
    baris: [
      {
        airKemasanBermerek: 9,
        airIsiUlang: 26,
        ledingMeteran: 0,
        ledingEceran: 0,
        sumurBorPompa: 1,
        sumurTerlindung: 0,
        sumurTakTerlindung: 0,
        mataAirTerlindung: 452,
        mataAirTakTerlindung: 0,
        airSungaiDanau: 0,
        airHujan: 0,
        lainnya: 0,
      },
      {
        airKemasanBermerek: 71,
        airIsiUlang: 30,
        ledingMeteran: 0,
        ledingEceran: 0,
        sumurBorPompa: 24,
        sumurTerlindung: 0,
        sumurTakTerlindung: 0,
        mataAirTerlindung: 236,
        mataAirTakTerlindung: 0,
        airSungaiDanau: 0,
        airHujan: 0,
        lainnya: 0,
      },
      {
        airKemasanBermerek: 0,
        airIsiUlang: 4,
        ledingMeteran: 0,
        ledingEceran: 0,
        sumurBorPompa: 0,
        sumurTerlindung: 0,
        sumurTakTerlindung: 0,
        mataAirTerlindung: 195,
        mataAirTakTerlindung: 0,
        airSungaiDanau: 0,
        airHujan: 0,
        lainnya: 0,
      },
    ],
    jumlah: {
      airKemasanBermerek: 80,
      airIsiUlang: 60,
      ledingMeteran: 0,
      ledingEceran: 0,
      sumurBorPompa: 25,
      sumurTerlindung: 0,
      sumurTakTerlindung: 0,
      mataAirTerlindung: 883,
      mataAirTakTerlindung: 0,
      airSungaiDanau: 0,
      airHujan: 0,
      lainnya: 0,
    },
  },
  'cara-memperoleh-air': {
    baris: [
      {
        membeliEceran: 23,
        langganan: 463,
        tidakMembeli: 2,
      },
      {
        membeliEceran: 98,
        langganan: 263,
        tidakMembeli: 0,
      },
      {
        membeliEceran: 4,
        langganan: 190,
        tidakMembeli: 5,
      },
    ],
    jumlah: {
      membeliEceran: 125,
      langganan: 919,
      tidakMembeli: 7,
    },
    catatan:
      'Baris Jumlah pada kolom Langganan tertulis 919 di dokumen sumber, sedangkan penjumlahan RW 01–03 menghasilkan 916. Nilai 919 dipertahankan agar sama dengan sumber.',
  },
  'sumber-penerangan': {
    baris: [
      {
        listrikPln: 488,
        listrikNonPln: 0,
        bukanListrik: 0,
      },
      {
        listrikPln: 361,
        listrikNonPln: 0,
        bukanListrik: 0,
      },
      {
        listrikPln: 199,
        listrikNonPln: 0,
        bukanListrik: 0,
      },
    ],
    jumlah: {
      listrikPln: 1048,
      listrikNonPln: 0,
      bukanListrik: 0,
    },
  },
  'daya-listrik': {
    baris: [
      {
        watt450: 139,
        watt900: 270,
        watt1300: 49,
        watt2200: 10,
        lebih2200: 5,
        tanpaMeteran: 15,
      },
      {
        watt450: 75,
        watt900: 119,
        watt1300: 134,
        watt2200: 5,
        lebih2200: 1,
        tanpaMeteran: 27,
      },
      {
        watt450: 105,
        watt900: 81,
        watt1300: 7,
        watt2200: 1,
        lebih2200: 1,
        tanpaMeteran: 4,
      },
    ],
    jumlah: {
      watt450: 319,
      watt900: 470,
      watt1300: 190,
      watt2200: 16,
      lebih2200: 7,
      tanpaMeteran: 46,
    },
  },
  'bahan-bakar-memasak': {
    baris: [
      {
        listrik: 1,
        gasLebih3Kg: 12,
        gas3Kg: 459,
        gasKotaBiogas: 0,
        minyakTanah: 0,
        briket: 0,
        arang: 0,
        kayuBakar: 7,
        tidakMemasak: 9,
      },
      {
        listrik: 1,
        gasLebih3Kg: 13,
        gas3Kg: 329,
        gasKotaBiogas: 0,
        minyakTanah: 0,
        briket: 0,
        arang: 0,
        kayuBakar: 10,
        tidakMemasak: 8,
      },
      {
        listrik: 0,
        gasLebih3Kg: 0,
        gas3Kg: 177,
        gasKotaBiogas: 0,
        minyakTanah: 0,
        briket: 0,
        arang: 0,
        kayuBakar: 16,
        tidakMemasak: 6,
      },
    ],
    jumlah: {
      listrik: 2,
      gasLebih3Kg: 25,
      gas3Kg: 965,
      gasKotaBiogas: 0,
      minyakTanah: 0,
      briket: 0,
      arang: 0,
      kayuBakar: 33,
      tidakMemasak: 23,
    },
  },
  'fasilitas-bab': {
    baris: [
      {
        sendiri: 480,
        bersama: 8,
        umum: 0,
        tidakAda: 0,
      },
      {
        sendiri: 356,
        bersama: 5,
        umum: 0,
        tidakAda: 0,
      },
      {
        sendiri: 198,
        bersama: 1,
        umum: 0,
        tidakAda: 0,
      },
    ],
    jumlah: {
      sendiri: 1034,
      bersama: 14,
      umum: 0,
      tidakAda: 0,
    },
  },
  'jenis-kloset': {
    baris: [
      {
        leherAngsa: 488,
        plengsengan: 0,
        cemplungCubluk: 0,
        tidakPakai: 0,
      },
      {
        leherAngsa: 361,
        plengsengan: 0,
        cemplungCubluk: 0,
        tidakPakai: 0,
      },
      {
        leherAngsa: 199,
        plengsengan: 0,
        cemplungCubluk: 0,
        tidakPakai: 0,
      },
    ],
    jumlah: {
      leherAngsa: 1048,
      plengsengan: 0,
      cemplungCubluk: 0,
      tidakPakai: 0,
    },
  },
  'pembuangan-tinja': {
    baris: [
      {
        tangki: 488,
        spal: 0,
        lubangTanah: 0,
        kolamSawahSungai: 0,
        pantaiTanahLapang: 0,
        lainnya: 0,
      },
      {
        tangki: 361,
        spal: 0,
        lubangTanah: 0,
        kolamSawahSungai: 0,
        pantaiTanahLapang: 0,
        lainnya: 0,
      },
      {
        tangki: 199,
        spal: 0,
        lubangTanah: 0,
        kolamSawahSungai: 0,
        pantaiTanahLapang: 0,
        lainnya: 0,
      },
    ],
    jumlah: {
      tangki: 1048,
      spal: 0,
      lubangTanah: 0,
      kolamSawahSungai: 0,
      pantaiTanahLapang: 0,
      lainnya: 0,
    },
  },
};

export const DATA_PERUMAHAN_2025: TabelPerumahan[] =
  DATA_PERUMAHAN_2026.map((tabel) => {
    const nilaiTahun = NILAI_PERUMAHAN_2025[tabel.id];

    if (!nilaiTahun) {
      throw new Error(
        `Data Perumahan 2025 untuk ${tabel.id} belum tersedia.`,
      );
    }

    return {
      ...tabel,
      baris: tabel.baris.map((baris, index) => ({
        rw: baris.rw,
        nilai: nilaiTahun.baris[index],
      })),
      jumlah: nilaiTahun.jumlah,
      catatan: nilaiTahun.catatan,
    };
  });

export function getDataPerumahan(
  kategori: KategoriDesaCantik,
  tahun: TahunDesaCantik,
) {
  if (kategori !== 'perumahan') {
    return [];
  }

  if (tahun === 2025) {
    return DATA_PERUMAHAN_2025;
  }

  if (tahun === 2026) {
    return DATA_PERUMAHAN_2026;
  }

  return [];
}
