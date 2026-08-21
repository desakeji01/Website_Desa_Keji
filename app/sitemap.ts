import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://desakeji-nyawiji.com'
  const lastModified = new Date()

  return [
    // =========================
    // BERANDA
    // =========================
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },

    // =========================
    // PROFIL DESA
    // =========================
    {
      url: `${baseUrl}/profil`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/profil/sejarah`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/profil/visi-misi`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/profil/peta-desa`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // =========================
    // PEMERINTAH DESA
    // =========================
    {
      url: `${baseUrl}/pemerintah-desa`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // =========================
    // DATA DESA
    // =========================
    {
      url: `${baseUrl}/data-desa`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/data-desa/populasi-per-wilayah`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/data-desa/data-penduduk`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/data-desa/rentang-umur`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/data-desa/kategori-umur`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/data-desa/status-penduduk`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/data-desa/jenis-kelamin`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/data-desa/galeri`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/data-desa/pertanahan`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    // =========================
    // INFORMASI PUBLIK
    // =========================
    {
      url: `${baseUrl}/informasi-publik`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/informasi-publik/produk-hukum`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/informasi-publik/informasi-umum`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/informasi-publik/realisasi-apbdes/2024`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/informasi-publik/realisasi-apbdes/2025`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/informasi-publik/realisasi-apbdes/2026`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // =========================
    // PPID
    // =========================
    {
      url: `${baseUrl}/ppid`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ppid/apa-itu-ppid`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ppid/profil`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ppid/klasifikasi-informasi`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ppid/permohonan-informasi-publik`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ppid/pengajuan-keberatan`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    // =========================
    // LAYANAN
    // =========================
    {
      url: `${baseUrl}/layanan`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/layanan/umkm`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/layanan/desa-cantik`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/layanan/penduduk`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/layanan/pendidikan`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/layanan/kesehatan`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/layanan/perumahan`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/layanan/perekonomian`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // =========================
    // DESA WISATA
    // =========================
    {
      url: `${baseUrl}/desa-wisata`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/desa-wisata/destinasi-potensi`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/desa-wisata/budaya-tradisi`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/desa-wisata/kuliner-umkm`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/desa-wisata/agenda-wisata`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/desa-wisata/galeri`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/desa-wisata/survey-kepuasan`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/desa-wisata/video-tutorial`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/desa-wisata/panduan-pelayanan`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/desa-wisata/buku-pedoman-administrasi`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/desa-wisata/paket-wisata`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // =========================
    // DESA ANTI KORUPSI
    // =========================
    {
      url: `${baseUrl}/desa-anti-korupsi`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/desa-anti-korupsi/tata-laksana`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/desa-anti-korupsi/pengawasan`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/desa-anti-korupsi/pelayanan-publik`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/desa-anti-korupsi/partisipasi-masyarakat`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/desa-anti-korupsi/kearifan-lokal`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // =========================
    // KONTAK
    // =========================
    {
      url: `${baseUrl}/kontak`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}