// app/layout.tsx

import type {
  Metadata,
} from 'next';

import {
  Geist,
  Geist_Mono,
} from 'next/font/google';

import './globals.css';

/* =========================================================
   FONT
========================================================= */

const geistSans =
  Geist({
    variable:
      '--font-geist-sans',

    subsets: [
      'latin',
    ],
  });

const geistMono =
  Geist_Mono({
    variable:
      '--font-geist-mono',

    subsets: [
      'latin',
    ],
  });

/* =========================================================
   METADATA WEBSITE & SEO
========================================================= */

export const metadata: Metadata = {
  metadataBase: new URL('https://desakeji-nyawiji.com'),

  title: {
    default:
      'Website Resmi Pemerintah Desa Keji | Kecamatan Ungaran Barat',
    template:
      '%s | Desa Keji - Ungaran Barat',
  },

  description:
    'Website Resmi Pemerintah Desa Keji, Kecamatan Ungaran Barat, Kabupaten Semarang, Jawa Tengah. Menyajikan informasi pemerintahan, pelayanan publik, data desa, PPID, desa wisata, potensi, dan informasi masyarakat Desa Keji.',

  applicationName:
    'Website Resmi Pemerintah Desa Keji',

  authors: [
    {
      name:
        'Pemerintah Desa Keji',
    },
  ],

  creator:
    'Pemerintah Desa Keji',

  publisher:
    'Pemerintah Desa Keji',

  alternates: {
    canonical:
      'https://desakeji-nyawiji.com',
  },

  robots: {
    index:
      true,

    follow:
      true,

    googleBot: {
      index:
        true,

      follow:
        true,

      'max-image-preview':
        'large',

      'max-snippet':
        -1,

      'max-video-preview':
        -1,
    },
  },

  openGraph: {
    type:
      'website',

    locale:
      'id_ID',

    url:
      'https://desakeji-nyawiji.com',

    siteName:
      'Website Resmi Pemerintah Desa Keji',

    title:
      'Website Resmi Pemerintah Desa Keji | Kecamatan Ungaran Barat',

    description:
      'Informasi resmi Pemerintah Desa Keji, Kecamatan Ungaran Barat, Kabupaten Semarang meliputi pemerintahan, pelayanan publik, data desa, PPID, desa wisata, potensi, dan informasi masyarakat.',

    images: [
      {
        url:
          '/logodesakeji.png',

        width:
          1200,

        height:
          630,

        alt:
          'Logo Pemerintah Desa Keji',
      },
    ],
  },

  twitter: {
    card:
      'summary_large_image',

    title:
      'Website Resmi Pemerintah Desa Keji | Kecamatan Ungaran Barat',

    description:
      'Website resmi Pemerintah Desa Keji, Kecamatan Ungaran Barat, Kabupaten Semarang.',

    images: [
      '/logodesakeji.png',
    ],
  },

  icons: {
    icon: [
      {
        url:
          '/logodesakeji.png',

        type:
          'image/png',
      },
    ],

    shortcut:
      '/logodesakeji.png',

    apple:
      '/logodesakeji.png',
  },
};

/* =========================================================
   ROOT LAYOUT
========================================================= */

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}