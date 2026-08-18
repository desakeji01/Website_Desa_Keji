// app/admin/desa-wisata/pedoman-administrasi/actions.ts

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
  '/admin/desa-wisata/pedoman-administrasi';

const PUBLIC_PATH =
  '/desa-wisata/pedoman-administrasi';

const TABLE_NAME =
  'desa_wisata_pedoman_administrasi_settings';

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

function getBoolean(
  formData: FormData,
  key: string
) {
  return (
    getString(
      formData,
      key
    ) === 'true'
  );
}

function isValidResourceUrl(
  value: string
) {
  if (!value) {
    return false;
  }

  if (
    value.startsWith('/') &&
    !value.startsWith('//')
  ) {
    return true;
  }

  try {
    const url =
      new URL(value);

    return (
      url.protocol === 'https:' ||
      url.protocol === 'http:'
    );
  } catch {
    return false;
  }
}

function buildAdminUrl(
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

  return `${ADMIN_PATH}?${params.toString()}`;
}

/* =========================================================
   ACTION
========================================================= */

export async function simpanPedomanAdministrasiAction(
  formData: FormData
) {
  await requireAdmin();

  const judul =
    getString(
      formData,
      'judul'
    );

  const deskripsi =
    getString(
      formData,
      'deskripsi'
    );

  const coverUrl =
    getString(
      formData,
      'cover_url'
    );

  const pdfUrl =
    getString(
      formData,
      'pdf_url'
    );

  const tahun =
    Number(
      getString(
        formData,
        'tahun'
      )
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
        'Judul minimal 5 karakter.'
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
        'Deskripsi minimal 10 karakter.'
      )
    );
  }

  if (
    !isValidResourceUrl(
      coverUrl
    )
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Path atau URL cover tidak valid.'
      )
    );
  }

  if (
    !isValidResourceUrl(
      pdfUrl
    )
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Path atau URL PDF tidak valid.'
      )
    );
  }

  if (
    !Number.isInteger(
      tahun
    ) ||
    tahun < 2000 ||
    tahun > 2200
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Tahun dokumen tidak valid.'
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

          deskripsi,

          cover_url:
            coverUrl,

          pdf_url:
            pdfUrl,

          tahun,

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
      'Gagal menyimpan Pedoman Administrasi:',
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
    PUBLIC_PATH
  );

  revalidatePath(
    '/desa-wisata'
  );

  redirect(
    buildAdminUrl(
      'success',
      aktif
        ? 'Pedoman Administrasi berhasil disimpan dan dipublikasikan.'
        : 'Pedoman Administrasi berhasil disimpan dan disembunyikan.'
    )
  );
}