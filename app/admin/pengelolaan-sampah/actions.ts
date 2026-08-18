// app/admin/pengelolaan-sampah/actions.ts

'use server';

import {
  revalidatePath,
} from 'next/cache';

import {
  redirect,
} from 'next/navigation';

import {
  createClient,
} from '@/lib/server';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

/* =========================================================
   CONFIG
========================================================= */

const ADMIN_PATH =
  '/admin/pengelolaan-sampah';

const PUBLIC_PATH =
  '/pengelolaan-sampah';

const TABLE =
  'pengelolaan_sampah_lokasi';

const SETTINGS_TABLE =
  'pengelolaan_sampah_settings';

const SETTINGS_KEY =
  'utama';

const ALLOWED_TYPES = [
  'TPS',
  'Pengepul',
] as const;

type JenisLokasi =
  (typeof ALLOWED_TYPES)[number];

/* =========================================================
   AUTH
========================================================= */

async function requireAdmin() {
  const supabase =
    await createClient();

  const {
    data: {
      user,
    },
    error,
  } =
    await supabase.auth.getUser();

  if (
    error ||
    !user
  ) {
    redirect(
      '/login'
    );
  }

  return user;
}

/* =========================================================
   FORM HELPERS
========================================================= */

function getString(
  formData:
    FormData,

  key:
    string
) {
  return String(
    formData.get(
      key
    ) ??
      ''
  ).trim();
}

function getBoolean(
  formData:
    FormData,

  key:
    string
) {
  return (
    getString(
      formData,
      key
    ) ===
    'true'
  );
}

function getNumber(
  formData:
    FormData,

  key:
    string
) {
  return Number(
    getString(
      formData,
      key
    )
  );
}

/* =========================================================
   VALIDATION
========================================================= */

function isJenisLokasi(
  value:
    string
): value is JenisLokasi {
  return (
    ALLOWED_TYPES as readonly string[]
  ).includes(
    value
  );
}

function isValidExternalUrl(
  value:
    string
) {
  if (
    !value
  ) {
    return true;
  }

  try {
    const url =
      new URL(
        value
      );

    return (
      url.protocol ===
        'https:' ||
      url.protocol ===
        'http:'
    );
  } catch {
    return false;
  }
}

/* =========================================================
   REDIRECT
========================================================= */

function buildAdminUrl(
  type:
    | 'success'
    | 'error',

  message:
    string,

  anchor?:
    string
) {
  const params =
    new URLSearchParams({
      [type]:
        message,
    });

  return (
    `${ADMIN_PATH}?` +
    `${params.toString()}` +
    `${
      anchor
        ? `#${anchor}`
        : ''
    }`
  );
}

/* =========================================================
   REVALIDATE
========================================================= */

function revalidatePengelolaanSampah() {
  revalidatePath(
    ADMIN_PATH
  );

  revalidatePath(
    PUBLIC_PATH
  );

  revalidatePath(
    '/admin'
  );

  revalidatePath(
    '/'
  );
}

/* =========================================================
   UPDATE BOOKLET
========================================================= */

export async function simpanBookletPengelolaanSampahAction(
  formData:
    FormData
) {
  await requireAdmin();

  const judul =
    getString(
      formData,
      'booklet_judul'
    );

  const deskripsi =
    getString(
      formData,
      'booklet_deskripsi'
    );

  const aktif =
    getBoolean(
      formData,
      'booklet_aktif'
    );

  /* =======================================================
     VALIDATION
  ======================================================= */

  if (
    judul.length <
    3
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Judul booklet minimal terdiri dari 3 karakter.',
        'booklet-pengepul'
      )
    );
  }

  if (
    judul.length >
    200
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Judul booklet maksimal 200 karakter.',
        'booklet-pengepul'
      )
    );
  }

  if (
    deskripsi.length <
    10
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Deskripsi booklet minimal terdiri dari 10 karakter.',
        'booklet-pengepul'
      )
    );
  }

  if (
    deskripsi.length >
    1500
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Deskripsi booklet maksimal 1.500 karakter.',
        'booklet-pengepul'
      )
    );
  }

  /* =======================================================
     UPSERT
  ======================================================= */

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        SETTINGS_TABLE
      )
      .upsert(
        {
          setting_key:
            SETTINGS_KEY,

          booklet_judul:
            judul,

          booklet_deskripsi:
            deskripsi,

          booklet_aktif:
            aktif,

          updated_at:
            new Date()
              .toISOString(),
        },
        {
          onConflict:
            'setting_key',
        }
      );

  if (
    error
  ) {
    console.error(
      'Gagal menyimpan pengaturan booklet pengepul:',
      error
    );

    redirect(
      buildAdminUrl(
        'error',
        error.message ||
          'Pengaturan booklet gagal disimpan.',
        'booklet-pengepul'
      )
    );
  }

  revalidatePengelolaanSampah();

  redirect(
    buildAdminUrl(
      'success',
      'Pengaturan Booklet Pengepul berhasil diperbarui.',
      'booklet-pengepul'
    )
  );
}

/* =========================================================
   UPDATE LOCATION
========================================================= */

export async function simpanLokasiPengelolaanSampahAction(
  formData:
    FormData
) {
  await requireAdmin();

  const id =
    getString(
      formData,
      'id'
    );

  const nama =
    getString(
      formData,
      'nama'
    );

  const jenis =
    getString(
      formData,
      'jenis'
    );

  const mapsUrl =
    getString(
      formData,
      'maps_url'
    );

  const keterangan =
    getString(
      formData,
      'keterangan'
    );

  const aktif =
    getBoolean(
      formData,
      'aktif'
    );

  const urutan =
    getNumber(
      formData,
      'urutan'
    );

  /* =======================================================
     VALIDATION
  ======================================================= */

  if (
    !id
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'ID lokasi tidak valid.'
      )
    );
  }

  if (
    nama.length <
    3
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Nama lokasi minimal terdiri dari 3 karakter.'
      )
    );
  }

  if (
    nama.length >
    150
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Nama lokasi maksimal 150 karakter.'
      )
    );
  }

  if (
    !isJenisLokasi(
      jenis
    )
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Jenis lokasi tidak valid.'
      )
    );
  }

  if (
    mapsUrl &&
    !isValidExternalUrl(
      mapsUrl
    )
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'URL Google Maps tidak valid.'
      )
    );
  }

  if (
    keterangan.length >
    1000
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Keterangan maksimal 1000 karakter.'
      )
    );
  }

  if (
    !Number.isInteger(
      urutan
    ) ||
    urutan <
      0
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Urutan harus berupa bilangan bulat minimal 0.'
      )
    );
  }

  /* =======================================================
     UPDATE
  ======================================================= */

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        TABLE
      )
      .update({
        nama,

        jenis,

        maps_url:
          mapsUrl ||
          null,

        keterangan:
          keterangan ||
          null,

        aktif,

        urutan,

        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        'id',
        id
      );

  if (
    error
  ) {
    console.error(
      'Gagal memperbarui lokasi pengelolaan sampah:',
      error
    );

    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidatePengelolaanSampah();

  redirect(
    buildAdminUrl(
      'success',
      `${nama} berhasil diperbarui.`
    )
  );
}