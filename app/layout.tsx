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
   METADATA WEBSITE
========================================================= */

export const metadata:
  Metadata = {
  title:
    'Sistem Informasi Desa Keji',

  description:
    'Sistem Informasi Desa Keji sebagai pusat informasi, layanan publik, pemerintahan, potensi desa, desa wisata, dan informasi masyarakat Desa Keji, Kecamatan Ungaran Barat, Kabupaten Semarang.',

  applicationName:
    'Sistem Informasi Desa Keji',

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