// components/profil/SejarahEditableContent.tsx

import {
  Calendar,
  Eye,
  User,
} from 'lucide-react';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

/* =========================================================
   CONFIG
========================================================= */

const SETTINGS_KEY =
  'utama';

/* =========================================================
   TYPES
========================================================= */

interface SejarahSettings {
  judul:
    string;

  tanggal:
    string;

  penulis:
    string;

  kategori:
    string;

  gambarUrl:
    string;

  pengantarUtama:
    string;

  pengantarKedua:
    string;
}

/* =========================================================
   DEFAULT
========================================================= */

const DEFAULT_SETTINGS:
  SejarahSettings = {
  judul:
    'Sejarah dan Potensi Desa Keji',

  tanggal:
    '2026-07-05',

  penulis:
    'Admin Desa',

  kategori:
    'Informasi Publik',

  gambarUrl:
    '/background.png',

  pengantarUtama:
    'Desa Keji merupakan salah satu desa yang berada di Kecamatan Ungaran Barat, Kabupaten Semarang. Letaknya di kawasan lereng Gunung Ungaran memberikan Desa Keji potensi alam, budaya, kesenian, kuliner, usaha masyarakat, dan wisata yang beragam.',

  pengantarKedua:
    'Berbagai potensi tersebut masih dipertahankan dan dikembangkan oleh masyarakat. Selain menjadi bagian dari kehidupan sehari-hari warga, potensi tersebut juga menjadi identitas Desa Keji dan modal pengembangan Desa Wisata Keji.',
};

/* =========================================================
   HELPERS
========================================================= */

function safeString(
  value:
    unknown
) {
  return String(
    value ??
      ''
  ).trim();
}

function formatTanggal(
  value:
    string
) {
  const date =
    new Date(
      `${value}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return '05 Juli 2026';
  }

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day:
        '2-digit',

      month:
        'long',

      year:
        'numeric',
    }
  ).format(
    date
  );
}

/* =========================================================
   DATA
========================================================= */

async function getSettings():
  Promise<SejarahSettings> {
  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from(
        'profil_sejarah_settings'
      )
      .select(`
        judul_halaman,
        tanggal_publikasi,
        penulis,
        kategori,
        gambar_url,
        pengantar_utama,
        pengantar_kedua
      `)
      .eq(
        'setting_key',
        SETTINGS_KEY
      )
      .maybeSingle();

  if (
    error
  ) {
    console.error(
      'Gagal mengambil pengaturan halaman sejarah:',
      {
        message:
          error.message,

        code:
          error.code,

        details:
          error.details,

        hint:
          error.hint,
      }
    );

    return (
      DEFAULT_SETTINGS
    );
  }

  if (
    !data
  ) {
    return (
      DEFAULT_SETTINGS
    );
  }

  return {
    judul:
      safeString(
        data.judul_halaman
      ) ||
      DEFAULT_SETTINGS
        .judul,

    tanggal:
      safeString(
        data.tanggal_publikasi
      ) ||
      DEFAULT_SETTINGS
        .tanggal,

    penulis:
      safeString(
        data.penulis
      ) ||
      DEFAULT_SETTINGS
        .penulis,

    kategori:
      safeString(
        data.kategori
      ) ||
      DEFAULT_SETTINGS
        .kategori,

    gambarUrl:
      safeString(
        data.gambar_url
      ) ||
      DEFAULT_SETTINGS
        .gambarUrl,

    pengantarUtama:
      safeString(
        data.pengantar_utama
      ) ||
      DEFAULT_SETTINGS
        .pengantarUtama,

    pengantarKedua:
      safeString(
        data.pengantar_kedua
      ) ||
      DEFAULT_SETTINGS
        .pengantarKedua,
  };
}

/* =========================================================
   COMPONENT
========================================================= */

export default async function SejarahEditableContent() {
  const settings =
    await getSettings();

  return (
    <>
      {/* =====================================================
          TITLE
      ===================================================== */}

      <div className="mb-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
          Profil Desa Keji
        </p>

        <h1 className="mt-2 text-2xl font-extrabold leading-tight text-gray-800 md:text-3xl">
          {
            settings.judul
          }
        </h1>
      </div>

      {/* =====================================================
          METADATA
      ===================================================== */}

      <div className="mb-6 flex flex-wrap gap-4 border-b border-gray-100 pb-4 text-xs font-semibold text-gray-500">
        <span className="flex items-center gap-1.5">
          <Calendar
            size={14}
            className="text-emerald-500"
          />

          {formatTanggal(
            settings.tanggal
          )}
        </span>

        <span className="flex items-center gap-1.5">
          <User
            size={14}
            className="text-emerald-500"
          />

          {
            settings.penulis
          }
        </span>

        <span className="flex items-center gap-1.5">
          <Eye
            size={14}
            className="text-emerald-500"
          />

          {
            settings.kategori
          }
        </span>
      </div>

      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div className="mb-8 h-[300px] w-full overflow-hidden rounded-xl shadow-sm md:h-[400px]">
        <img
          src={
            settings.gambarUrl
          }
          alt={
            settings.judul
          }
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <div className="prose prose-emerald max-w-none text-justify leading-relaxed text-gray-700">
        <p className="mb-5 text-lg font-medium text-gray-800">
          {
            settings.pengantarUtama
          }
        </p>

        <p>
          {
            settings.pengantarKedua
          }
        </p>
      </div>
    </>
  );
}