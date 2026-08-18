// lib/admin-navigation.ts

import {
  Archive,
  BarChart3,
  Building2,
  Database,
  FileText,
  Hammer,
  Home,
  Recycle,
  Images,
  Info,
  Landmark,
  LayoutDashboard,
  Map,
  MessageCircle,
  Newspaper,
  ScrollText,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface AdminNavigationItem {
  id: string;
  label: string;
  description: string;
  href: string;
  publicHref?: string;
  icon: LucideIcon;
  enabled: boolean;
}

export interface AdminNavigationGroup {
  label: string;
  items: AdminNavigationItem[];
}

/*
 * enabled: true
 * berarti halaman admin sudah tersedia.
 *
 * enabled: false
 * berarti menu tetap ditampilkan, tetapi belum dapat dibuka
 * agar tidak mengarah ke halaman 404.
 */

export const dashboardMenu: AdminNavigationItem = {
  id: 'dashboard',

  label: 'Dashboard',

  description:
    'Ringkasan seluruh data dan konten website desa.',

  href: '/admin',

  icon: LayoutDashboard,

  enabled: true,
};

export const dataWargaMenu: AdminNavigationItem = {
  id: 'warga',

  label: 'Data Warga',

  description:
    'Kelola database warga yang menggunakan layanan desa.',

  href: '/admin/warga',

  icon: Users,

  enabled: true,
};

export const permohonanMenu: AdminNavigationItem = {
  id: 'permohonan',

  label: 'Permohonan Layanan',

  description:
    'Kelola permohonan administrasi yang masuk dari warga.',

  href: '/admin/permohonan',

  icon: FileText,

  enabled: true,
};

export const sdgsMenu: AdminNavigationItem = {
  id: 'sdgs',

  label: 'SDGs Desa',

  description:
    'Kelola data dan indikator SDGs Desa Keji.',

  href: '/admin/sdgs',

  icon: Target,

  enabled: true,
};

export const publicContentModules: AdminNavigationItem[] = [
  {
    id: 'beranda',

    label: 'Beranda Publik',

    description:
      'Kelola hero, sambutan kepala desa, informasi berjalan, jadwal, dan konten utama beranda.',

    href: '/admin/beranda',

    publicHref: '/',

    icon: Home,

    enabled: true,
  },

  {
    id: 'profil',

    label: 'Profil & Pengaturan',

    description:
      'Kelola profil desa, statistik penduduk, identitas desa, dan konfigurasi website.',

    href: '/admin/pengaturan',

    publicHref: '/profil',

    icon: Settings,

    enabled: true,
  },

  {
    id: 'pemerintahan',

    label: 'Pemerintahan Desa',

    description:
      'Kelola struktur organisasi, perangkat desa, visi, misi, dan informasi pemerintahan.',

    href: '/admin/pemerintahan',

    publicHref: '/pemerintahan',

    icon: Landmark,

    enabled: true,
  },

  {
    id: 'tilik-arkeji',

    label: 'Tilik Arkeji',

    description:
      'Kelola biografi kepala desa, penghargaan, struktur organisasi, galeri, gambar, dan tautan arsip Desa Keji.',

    href: '/admin/tilik-arkeji',

    publicHref: '/profil/tilik-arkeji',

    icon: Archive,

    enabled: true,
  },

  {
    id: 'data-desa',

    label: 'Data Desa',

    description:
      'Kelola data populasi, umur, pendidikan, pekerjaan, wilayah, dan statistik desa.',

    href: '/admin/data-desa',

    publicHref: '/data-desa',

    icon: Database,

    enabled: true,
  },

  {
    id: 'berita',

    label: 'Kelola Berita',

    description:
      'Tambah, ubah, hapus, dan publikasikan berita Desa Keji.',

    href: '/admin/berita',

    publicHref: '/berita',

    icon: Newspaper,

    enabled: true,
  },

  {
    id: 'galeri',

    label: 'Kelola Galeri',

    description:
      'Kelola album, foto kegiatan, dokumentasi, dan kategori galeri desa.',

    href: '/admin/galeri',

    publicHref: '/data-desa/galeri',

    icon: Images,

    enabled: true,
  },

  {
    id: 'produk-hukum',

    label: 'Produk Hukum',

    description:
      'Kelola Peraturan Desa, Peraturan Kepala Desa, dan Keputusan Kepala Desa.',

    href: '/admin/produk-hukum',

    publicHref: '/informasi-publik/produk-hukum',

    icon: ScrollText,

    enabled: true,
  },

  {
    id: 'informasi-publik',

    label: 'Informasi Publik',

    description:
      'Kelola informasi umum, APBDes, dokumen publik, dan arsip informasi.',

    href: '/admin/informasi-publik',

    publicHref: '/informasi-publik',

    icon: Info,

    enabled: true,
  },

  {
    id: 'ppid',

    label: 'PPID',

    description:
      'Kelola profil PPID, daftar informasi publik, formulir, dan dokumen PPID.',

    href: '/admin/ppid',

    publicHref: '/ppid/apa-itu-ppid',

    icon: FileText,

    enabled: true,
  },

  {
    id: 'layanan',

    label: 'Layanan Desa',

    description:
      'Kelola jenis layanan, deskripsi, persyaratan, urutan, dan status layanan.',

    href: '/admin/layanan',

    publicHref: '/layanan',

    icon: FileText,

    enabled: true,
  },

  {
    id: 'umkm',

    label: 'Lapak UMKM',

    description:
      'Kelola produk UMKM, foto, harga, kontak penjual, E-Catalog, dan status publikasi.',

    href: '/admin/umkm',

    publicHref: '/umkm',

    icon: ShoppingCart,

    enabled: true,
  },

  {
    id: 'pembangunan',

    label: 'Pembangunan',

    description:
      'Kelola proyek, lokasi, sumber dana, anggaran, progres, dan dokumentasi.',

    href: '/admin/pembangunan',

    publicHref: '/pembangunan',

    icon: Hammer,

    enabled: true,
  },

  {
    id: 'idm',

    label: 'Status IDM',

    description:
      'Kelola nilai IDM, status desa, tahun data, dimensi, dan riwayat perkembangan.',

    href: '/admin/idm',

    publicHref: '/idm',

    icon: BarChart3,

    enabled: true,
  },

  {
    id: 'desa-cantik',

    label: 'Desa Cantik',

    description:
      'Kelola sumber data, infografis, status publikasi, dokumen tahunan, dan data statistik Desa Cantik.',

    href: '/admin/desa-cantik',

    publicHref: '/desa-cantik',

    icon: BarChart3,

    enabled: true,
  },

  {
    id: 'desa-wisata',

    label: 'Desa Wisata',

    description:
      'Kelola destinasi, agenda, budaya, kuliner, galeri, dan informasi kunjungan.',

    href: '/admin/desa-wisata',

    publicHref: '/desa-wisata',

    icon: Map,

    enabled: true,
  },

  {
    id: 'anti-korupsi',

    label: 'Desa Anti Korupsi',

    description:
      'Kelola dokumen tata laksana, pengawasan, pelayanan, partisipasi, dan kearifan lokal.',

    href: '/admin/desa-anti-korupsi',

    publicHref: '/desa-anti-korupsi',

    icon: ShieldCheck,

    enabled: true,
  },

  {
    id: 'pengaduan',

    label: 'Pengaduan',

    description:
      'Kelola kanal pengaduan, kategori laporan, informasi pelayanan, dan tindak lanjut.',

    href: '/admin/pengaduan',

    publicHref: '/pengaduan',

    icon: MessageCircle,

    enabled: true,
  },

  {
    id: 'peta',

    label: 'Peta Desa',

    description:
      'Kelola koordinat, tautan peta, lokasi kantor, dan informasi wilayah.',

    href: '/admin/peta',

    publicHref: '/peta',

    icon: Map,

    enabled: true,
  },

  {
    id: 'kontak',

    label: 'Kontak Desa',

    description:
      'Kelola nomor perangkat desa, Babinsa, Bhabinkamtibmas, Kadus, dan jam pelayanan.',

    href: '/admin/kontak',

    publicHref: '/kontak',

    icon: Building2,

    enabled: true,
  },
  {
  id: 'pertanahan',

  label: 'Data Pertanahan',

  description:
    'Kelola informasi penggunaan lahan, luas tanah, jumlah bidang, sumber data, dan informasi pertanahan Desa Keji.',

  href:
    '/admin/pertanahan',

  publicHref:
    '/data-desa/pertanahan',

  icon:
    Map,

  enabled:
    true,
},

{
  id: 'pengelolaan-sampah',

  label:
    'Pengelolaan Sampah',

  description:
    'Kelola lokasi TPS, pengepul, tautan Google Maps, keterangan, urutan, dan status lokasi pengelolaan sampah.',

  href:
    '/admin/pengelolaan-sampah',

  publicHref:
    '/pengelolaan-sampah',

  icon:
    Recycle,

  enabled:
    true,
},
];

function getPublicModule(id: string): AdminNavigationItem {
  const module = publicContentModules.find(
    (item) => item.id === id
  );

  if (!module) {
    throw new Error(
      `Modul admin tidak ditemukan: ${id}`
    );
  }

  return module;
}

export const adminMenuGroups: AdminNavigationGroup[] = [
  {
    label: 'Menu Utama',

    items: [
      dashboardMenu,
    ],
  },

  {
    label: 'Administrasi Warga',

    items: [
      dataWargaMenu,

      permohonanMenu,

      getPublicModule('layanan'),

      getPublicModule('pengaduan'),
    ],
  },

  {
    label: 'Publikasi Desa',

    items: [
      getPublicModule('beranda'),

      getPublicModule('berita'),

      getPublicModule('galeri'),

      getPublicModule('produk-hukum'),

      getPublicModule('informasi-publik'),

      getPublicModule('ppid'),
    ],
  },

  {
  label: 'Data dan Pemerintahan',

  items: [
    getPublicModule(
      'profil'
    ),

    getPublicModule(
      'pemerintahan'
    ),

    getPublicModule(
      'tilik-arkeji'
    ),

    getPublicModule(
      'data-desa'
    ),

    getPublicModule(
      'pertanahan'
    ),

    getPublicModule(
      'pengelolaan-sampah'
    ),

    sdgsMenu,

    getPublicModule(
      'peta'
    ),

    getPublicModule(
      'kontak'
    ),
  ],
},

  {
    label: 'Program dan Potensi',

    items: [
      getPublicModule('umkm'),

      getPublicModule('pembangunan'),

      getPublicModule('idm'),

      getPublicModule('desa-cantik'),

      getPublicModule('desa-wisata'),

      getPublicModule('anti-korupsi'),
    ],
  },
];