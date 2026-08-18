// app/(public)/desa-wisata/survei-kepuasan/actions.ts

'use server';

import {
  revalidatePath,
} from 'next/cache';

import {
  redirect,
} from 'next/navigation';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import {
  isAsalWisatawan,
  isJenisKunjungan,
  isPaketWisata,
} from '@/lib/desa-wisata-survei';

const PUBLIC_PATH =
  '/desa-wisata/survei-kepuasan';

const RESULT_PATH =
  '/desa-wisata/hasil-survei';

const ADMIN_PATH =
  '/admin/desa-wisata/survei-kepuasan';

const SURVEY_START_DATE =
  '2026-01-01';

/* =========================================================
   HELPERS
========================================================= */

function getString(
  formData: FormData,
  key: string
) {
  return String(
    formData.get(
      key
    ) ??
      ''
  ).trim();
}

function getNumber(
  formData: FormData,
  key: string
) {
  return Number(
    getString(
      formData,
      key
    )
  );
}

function buildUrl(
  type:
    | 'success'
    | 'error',

  message: string
) {
  const params =
    new URLSearchParams({
      [type]:
        message,
    });

  return `${PUBLIC_PATH}?${params.toString()}`;
}

function validEmail(
  value: string
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  );
}

function validRating(
  value: number
) {
  return (
    Number.isInteger(
      value
    ) &&
    value >= 1 &&
    value <= 4
  );
}

function parseYaTidak(
  value: string
):
  | boolean
  | null {
  if (
    value === 'ya'
  ) {
    return true;
  }

  if (
    value === 'tidak'
  ) {
    return false;
  }

  return null;
}

function getTodayJakarta() {
  const formatter =
    new Intl.DateTimeFormat(
      'en-CA',
      {
        year:
          'numeric',

        month:
          '2-digit',

        day:
          '2-digit',

        timeZone:
          'Asia/Jakarta',
      }
    );

  const parts =
    formatter.formatToParts(
      new Date()
    );

  const year =
    parts.find(
      (part) =>
        part.type ===
        'year'
    )?.value;

  const month =
    parts.find(
      (part) =>
        part.type ===
        'month'
    )?.value;

  const day =
    parts.find(
      (part) =>
        part.type ===
        'day'
    )?.value;

  return `${year}-${month}-${day}`;
}

/* =========================================================
   ACTION
========================================================= */

export async function kirimSurveiWisataAction(
  formData: FormData
) {
  /* =======================================================
     HONEYPOT
  ======================================================= */

  const website =
    getString(
      formData,
      'website'
    );

  if (website) {
    redirect(
      buildUrl(
        'success',
        'Terima kasih atas partisipasinya.'
      )
    );
  }

  /* =======================================================
     CEK STATUS SURVEI
  ======================================================= */

  const {
    data:
      settings,
    error:
      settingsError,
  } =
    await supabaseAdmin
      .from(
        'desa_wisata_survei_settings'
      )
      .select(
        'survei_aktif'
      )
      .eq(
        'setting_key',
        'utama'
      )
      .maybeSingle();

  if (
    settingsError
  ) {
    console.error(
      'Gagal mengecek status survei:',
      settingsError
    );
  }

  if (
    settings &&
    !settings.survei_aktif
  ) {
    redirect(
      buildUrl(
        'error',
        'Survei sedang tidak menerima respons baru.'
      )
    );
  }

  /* =======================================================
     DATA RESPONDEN
  ======================================================= */

  const email =
    getString(
      formData,
      'email'
    );

  const nama =
    getString(
      formData,
      'nama'
    );

  const tanggalKunjungan =
    getString(
      formData,
      'tanggal_kunjungan'
    );

  const asal =
    getString(
      formData,
      'asal'
    );

  const jenisKunjungan =
    getString(
      formData,
      'jenis_kunjungan'
    );

  const jenisKunjunganLainnya =
    getString(
      formData,
      'jenis_kunjungan_lainnya'
    );

  const kunjunganPertama =
    parseYaTidak(
      getString(
        formData,
        'kunjungan_pertama'
      )
    );

  /* =======================================================
     PAKET
  ======================================================= */

  const paketAktivitas =
    getString(
      formData,
      'paket_aktivitas'
    );

  const paketLainnya =
    getString(
      formData,
      'paket_lainnya'
    );

  /* =======================================================
     RATING
  ======================================================= */

  const kebersihan =
    getNumber(
      formData,
      'kebersihan'
    );

  const keramahan =
    getNumber(
      formData,
      'keramahan'
    );

  const fasilitas =
    getNumber(
      formData,
      'fasilitas'
    );

  const ekspektasiRaw =
    getString(
      formData,
      'kesesuaian_ekspektasi'
    );

  const kesesuaianEkspektasi =
    ekspektasiRaw
      ? Number(
          ekspektasiRaw
        )
      : null;

  const kepuasanKeseluruhan =
    getNumber(
      formData,
      'kepuasan_keseluruhan'
    );

  const merekomendasikan =
    parseYaTidak(
      getString(
        formData,
        'merekomendasikan'
      )
    );

  /* =======================================================
     FEEDBACK
  ======================================================= */

  const palingDisukai =
    getString(
      formData,
      'paling_disukai'
    );

  const saran =
    getString(
      formData,
      'saran'
    );

  const bolehDihubungi =
    parseYaTidak(
      getString(
        formData,
        'boleh_dihubungi'
      )
    );

  const nomorWa =
    getString(
      formData,
      'nomor_wa'
    );

  /* =======================================================
     VALIDATION
  ======================================================= */

  if (
    !validEmail(
      email
    ) ||
    email.length > 254
  ) {
    redirect(
      buildUrl(
        'error',
        'Alamat email tidak valid.'
      )
    );
  }

  if (
    nama.length < 2 ||
    nama.length > 120
  ) {
    redirect(
      buildUrl(
        'error',
        'Nama wajib diisi dengan benar.'
      )
    );
  }

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      tanggalKunjungan
    )
  ) {
    redirect(
      buildUrl(
        'error',
        'Tanggal kunjungan tidak valid.'
      )
    );
  }

  if (
    tanggalKunjungan <
    SURVEY_START_DATE
  ) {
    redirect(
      buildUrl(
        'error',
        'Tanggal kunjungan minimal 1 Januari 2026.'
      )
    );
  }

  if (
    tanggalKunjungan >
    getTodayJakarta()
  ) {
    redirect(
      buildUrl(
        'error',
        'Tanggal kunjungan tidak boleh melebihi hari ini.'
      )
    );
  }

  if (
    !isAsalWisatawan(
      asal
    )
  ) {
    redirect(
      buildUrl(
        'error',
        'Asal wisatawan tidak valid.'
      )
    );
  }

  if (
    !isJenisKunjungan(
      jenisKunjungan
    )
  ) {
    redirect(
      buildUrl(
        'error',
        'Jenis kunjungan tidak valid.'
      )
    );
  }

  if (
    jenisKunjungan ===
      'Lainnya' &&
    !jenisKunjunganLainnya
  ) {
    redirect(
      buildUrl(
        'error',
        'Silakan tuliskan jenis kunjungan lainnya.'
      )
    );
  }

  if (
    jenisKunjunganLainnya.length >
    200
  ) {
    redirect(
      buildUrl(
        'error',
        'Jenis kunjungan lainnya terlalu panjang.'
      )
    );
  }

  if (
    kunjunganPertama ===
    null
  ) {
    redirect(
      buildUrl(
        'error',
        'Silakan pilih apakah ini kunjungan pertama Anda.'
      )
    );
  }

  if (
    !isPaketWisata(
      paketAktivitas
    )
  ) {
    redirect(
      buildUrl(
        'error',
        'Paket atau aktivitas tidak valid.'
      )
    );
  }

  if (
    paketAktivitas ===
      'Lainnya' &&
    !paketLainnya
  ) {
    redirect(
      buildUrl(
        'error',
        'Silakan tuliskan paket atau aktivitas lainnya.'
      )
    );
  }

  if (
    paketLainnya.length >
    200
  ) {
    redirect(
      buildUrl(
        'error',
        'Nama paket lainnya terlalu panjang.'
      )
    );
  }

  if (
    !validRating(
      kebersihan
    ) ||
    !validRating(
      keramahan
    ) ||
    !validRating(
      fasilitas
    ) ||
    !validRating(
      kepuasanKeseluruhan
    )
  ) {
    redirect(
      buildUrl(
        'error',
        'Penilaian wajib berada pada skala 1 sampai 4.'
      )
    );
  }

  if (
    kesesuaianEkspektasi !==
      null &&
    !validRating(
      kesesuaianEkspektasi
    )
  ) {
    redirect(
      buildUrl(
        'error',
        'Nilai kesesuaian ekspektasi tidak valid.'
      )
    );
  }

  if (
    merekomendasikan ===
    null
  ) {
    redirect(
      buildUrl(
        'error',
        'Silakan pilih apakah Anda akan merekomendasikan Desa Wisata Keji.'
      )
    );
  }

  if (
    palingDisukai.length <
    2
  ) {
    redirect(
      buildUrl(
        'error',
        'Ceritakan hal yang paling Anda sukai dari kunjungan ini.'
      )
    );
  }

  if (
    palingDisukai.length >
    2000
  ) {
    redirect(
      buildUrl(
        'error',
        'Jawaban yang paling disukai maksimal 2000 karakter.'
      )
    );
  }

  if (
    saran.length < 2
  ) {
    redirect(
      buildUrl(
        'error',
        'Saran perbaikan wajib diisi.'
      )
    );
  }

  if (
    saran.length >
    2000
  ) {
    redirect(
      buildUrl(
        'error',
        'Saran maksimal 2000 karakter.'
      )
    );
  }

  if (
    bolehDihubungi ===
    null
  ) {
    redirect(
      buildUrl(
        'error',
        'Silakan pilih apakah Anda bersedia dihubungi kembali.'
      )
    );
  }

  if (
    bolehDihubungi &&
    !nomorWa
  ) {
    redirect(
      buildUrl(
        'error',
        'Nomor WhatsApp wajib diisi jika Anda bersedia dihubungi.'
      )
    );
  }

  if (
    nomorWa.length >
    30
  ) {
    redirect(
      buildUrl(
        'error',
        'Nomor WhatsApp tidak valid.'
      )
    );
  }

  /* =======================================================
     INSERT
  ======================================================= */

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'desa_wisata_survei_respon'
      )
      .insert({
        email,

        nama,

        tanggal_kunjungan:
          tanggalKunjungan,

        asal,

        jenis_kunjungan:
          jenisKunjungan,

        jenis_kunjungan_lainnya:
          jenisKunjungan ===
          'Lainnya'
            ? jenisKunjunganLainnya
            : null,

        kunjungan_pertama:
          kunjunganPertama,

        paket_aktivitas:
          paketAktivitas,

        paket_lainnya:
          paketAktivitas ===
          'Lainnya'
            ? paketLainnya
            : null,

        kebersihan,

        keramahan,

        fasilitas,

        kesesuaian_ekspektasi:
          kesesuaianEkspektasi,

        kepuasan_keseluruhan:
          kepuasanKeseluruhan,

        merekomendasikan,

        paling_disukai:
          palingDisukai,

        saran,

        boleh_dihubungi:
          bolehDihubungi,

        nomor_wa:
          bolehDihubungi
            ? nomorWa
            : null,

        valid:
          true,
      });

  if (error) {
    console.error(
      'Gagal menyimpan Survei Desa Wisata:',
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

    redirect(
      buildUrl(
        'error',
        'Survei gagal dikirim. Silakan mencoba kembali.'
      )
    );
  }

  revalidatePath(
    PUBLIC_PATH
  );

  revalidatePath(
    RESULT_PATH
  );

  revalidatePath(
    ADMIN_PATH
  );

  redirect(
    buildUrl(
      'success',
      'Terima kasih. Respons survei Anda berhasil dikirim.'
    )
  );
}