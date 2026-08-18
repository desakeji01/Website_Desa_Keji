// app/admin/desa-wisata/paket-wisata/actions.ts

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

const ADMIN_PATH =
  '/admin/desa-wisata/paket-wisata';

const TABLE_NAME =
  'desa_wisata_paket_settings';

const SETTINGS_KEY =
  'utama';

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
}

/* =========================================================
   HELPERS
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
    ) ?? ''
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

function isValidExternalUrl(
  value: string
) {
  if (!value) {
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

function buildAdminUrl(
  type:
    | 'success'
    | 'error',
  message:
    string
) {
  const params =
    new URLSearchParams({
      [type]:
        message,
    });

  return `${ADMIN_PATH}?${params.toString()}`;
}

/* =========================================================
   ACTION
========================================================= */

export async function simpanPaketWisataAction(
  formData:
    FormData
) {
  await requireAdmin();

  const judul =
    getString(
      formData,
      'judul'
    );

  const subjudul =
    getString(
      formData,
      'subjudul'
    );

  const deskripsi =
    getString(
      formData,
      'deskripsi'
    );

  const linktreeUrl =
    getString(
      formData,
      'linktree_url'
    );

  const tombolLabel =
    getString(
      formData,
      'tombol_label'
    );

  const aktif =
    getBoolean(
      formData,
      'aktif'
    );

  /* =======================================================
     VALIDATION
  ======================================================= */

  if (
    judul.length < 5
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Judul minimal terdiri dari 5 karakter.'
      )
    );
  }

  if (
    subjudul.length <
    10
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Subjudul minimal terdiri dari 10 karakter.'
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
        'Deskripsi minimal terdiri dari 10 karakter.'
      )
    );
  }

  if (
    tombolLabel.length <
    3
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Label tombol minimal terdiri dari 3 karakter.'
      )
    );
  }

  if (
    linktreeUrl &&
    !isValidExternalUrl(
      linktreeUrl
    )
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'URL Linktree harus berupa alamat http:// atau https:// yang valid.'
      )
    );
  }

  if (
    aktif &&
    !linktreeUrl
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'URL Linktree wajib diisi sebelum Paket Wisata dipublikasikan.'
      )
    );
  }

  /* =======================================================
     SAVE
  ======================================================= */

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        TABLE_NAME
      )
      .upsert(
        {
          setting_key:
            SETTINGS_KEY,

          judul,

          subjudul,

          deskripsi,

          linktree_url:
            linktreeUrl ||
            null,

          tombol_label:
            tombolLabel,

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

  if (error) {
    console.error(
      'Gagal menyimpan Paket Wisata:',
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
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidatePath(
    ADMIN_PATH
  );

  revalidatePath(
    '/desa-wisata/paket-wisata'
  );

  revalidatePath(
    '/desa-wisata'
  );

  redirect(
    buildAdminUrl(
      'success',
      aktif
        ? 'Paket Wisata berhasil disimpan dan dipublikasikan.'
        : 'Pengaturan Paket Wisata berhasil disimpan.'
    )
  );
}