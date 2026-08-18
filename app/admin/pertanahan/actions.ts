// app/admin/pertanahan/actions.ts

'use server';

import {
  randomUUID,
} from 'node:crypto';

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
  '/admin/pertanahan';

const SETTINGS_KEY =
  'utama';

const STORAGE_BUCKET =
  'pertanahan';

const STORAGE_FOLDER =
  'album';

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

/*
 * Karena project menggunakan Server Actions
 * body limit sekitar 10 MB, total satu kali upload
 * kita jaga di bawah limit.
 */
const MAX_TOTAL_UPLOAD_SIZE =
  9 * 1024 * 1024;

const MAX_FILES_PER_UPLOAD =
  10;

const ALLOWED_IMAGE_TYPES =
  new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
  ]);

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

function nullableNumber(
  formData:
    FormData,

  key:
    string
) {
  const value =
    getString(
      formData,
      key
    );

  if (!value) {
    return null;
  }

  const parsed =
    Number(
      value
    );

  return Number.isFinite(
    parsed
  )
    ? parsed
    : null;
}

function nullableString(
  value:
    string
) {
  return value || null;
}

/* =========================================================
   URL
========================================================= */

function buildUrl(
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
   REVALIDATE
========================================================= */

function revalidatePertanahan() {
  revalidatePath(
    '/admin/pertanahan'
  );

  revalidatePath(
    '/data-desa/pertanahan'
  );

  revalidatePath(
    '/admin'
  );

  revalidatePath(
    '/data-desa'
  );
}

/* =========================================================
   SLUG
========================================================= */

function slugify(
  value:
    string
) {
  return (
    value
      .normalize(
        'NFKD'
      )
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        '-'
      )
      .replace(
        /^-+|-+$/g,
        ''
      ) ||
    'album-pertanahan'
  );
}

async function createUniqueSlug(
  title:
    string,

  currentId?:
    string
) {
  const base =
    slugify(
      title
    );

  let candidate =
    base;

  let number =
    2;

  while (
    number <
    1000
  ) {
    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          'pertanahan_album'
        )
        .select(
          'id'
        )
        .eq(
          'slug',
          candidate
        )
        .maybeSingle();

    if (error) {
      throw new Error(
        `Slug album gagal diperiksa: ${error.message}`
      );
    }

    if (
      !data ||
      data.id ===
        currentId
    ) {
      return candidate;
    }

    candidate =
      `${base}-${number}`;

    number +=
      1;
  }

  return `${base}-${randomUUID().slice(
    0,
    8
  )}`;
}

/* =========================================================
   IMAGE
========================================================= */

function getImageFiles(
  formData:
    FormData,

  field =
    'foto'
) {
  return formData
    .getAll(
      field
    )
    .filter(
      (
        value
      ): value is File =>
        value instanceof
          File &&
        value.size >
          0
    );
}

function validateImage(
  file:
    File
) {
  if (
    !ALLOWED_IMAGE_TYPES.has(
      file.type
    )
  ) {
    throw new Error(
      `${file.name}: format foto harus JPG, PNG, atau WEBP.`
    );
  }

  if (
    file.size >
    MAX_IMAGE_SIZE
  ) {
    throw new Error(
      `${file.name}: ukuran foto maksimal 5 MB.`
    );
  }
}

function validateImages(
  files:
    File[]
) {
  if (
    files.length ===
    0
  ) {
    throw new Error(
      'Pilih minimal satu foto.'
    );
  }

  if (
    files.length >
    MAX_FILES_PER_UPLOAD
  ) {
    throw new Error(
      `Maksimal ${MAX_FILES_PER_UPLOAD} foto dalam satu kali upload.`
    );
  }

  let totalSize =
    0;

  for (
    const file of
      files
  ) {
    validateImage(
      file
    );

    totalSize +=
      file.size;
  }

  if (
    totalSize >
    MAX_TOTAL_UPLOAD_SIZE
  ) {
    throw new Error(
      'Total ukuran file dalam satu kali upload maksimal sekitar 9 MB. Upload foto secara bertahap.'
    );
  }
}

function extensionFromMime(
  mime:
    string
) {
  switch (
    mime
  ) {
    case 'image/png':
      return 'png';

    case 'image/webp':
      return 'webp';

    default:
      return 'jpg';
  }
}

async function uploadImage(
  file:
    File,

  albumId:
    string
) {
  validateImage(
    file
  );

  const extension =
    extensionFromMime(
      file.type
    );

  const path =
    `${STORAGE_FOLDER}/${albumId}/${Date.now()}-${randomUUID()}.${extension}`;

  const buffer =
    Buffer.from(
      await file.arrayBuffer()
    );

  const {
    error,
  } =
    await supabaseAdmin.storage
      .from(
        STORAGE_BUCKET
      )
      .upload(
        path,
        buffer,
        {
          contentType:
            file.type,

          cacheControl:
            '3600',

          upsert:
            false,
        }
      );

  if (error) {
    throw new Error(
      `Upload foto gagal: ${error.message}`
    );
  }

  const {
    data,
  } =
    supabaseAdmin.storage
      .from(
        STORAGE_BUCKET
      )
      .getPublicUrl(
        path
      );

  return {
    path,

    url:
      data.publicUrl,
  };
}

async function removeStorageFiles(
  paths:
    string[]
) {
  const validPaths =
    paths
      .map(
        (
          path
        ) =>
          String(
            path ??
              ''
          ).trim()
      )
      .filter(
        Boolean
      );

  if (
    validPaths.length ===
    0
  ) {
    return;
  }

  const {
    error,
  } =
    await supabaseAdmin.storage
      .from(
        STORAGE_BUCKET
      )
      .remove(
        validPaths
      );

  if (error) {
    console.error(
      'Gagal menghapus foto Pertanahan dari Storage:',
      error.message
    );
  }
}

/* =========================================================
   SETTINGS
========================================================= */

export async function simpanPertanahanSettingsAction(
  formData:
    FormData
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

  const tahunData =
    nullableNumber(
      formData,
      'tahun_data'
    );

  const sumberData =
    getString(
      formData,
      'sumber_data'
    );

  const catatan =
    getString(
      formData,
      'catatan'
    );

  const aktif =
    getBoolean(
      formData,
      'aktif'
    );

  if (
    judul.length <
      3 ||
    deskripsi.length <
      10
  ) {
    redirect(
      buildUrl(
        'error',
        'Judul dan deskripsi wajib diisi.'
      )
    );
  }

  if (
    tahunData !==
      null &&
    (
      !Number.isInteger(
        tahunData
      ) ||
      tahunData <
        1900 ||
      tahunData >
        2200
    )
  ) {
    redirect(
      buildUrl(
        'error',
        'Tahun data tidak valid.'
      )
    );
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'pertanahan_settings'
      )
      .upsert(
        {
          setting_key:
            SETTINGS_KEY,

          judul,

          deskripsi,

          tahun_data:
            tahunData,

          sumber_data:
            nullableString(
              sumberData
            ),

          catatan:
            nullableString(
              catatan
            ),

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
    redirect(
      buildUrl(
        'error',
        error.message
      )
    );
  }

  revalidatePertanahan();

  redirect(
    buildUrl(
      'success',
      'Informasi Pertanahan berhasil diperbarui.'
    )
  );
}

/* =========================================================
   CREATE ALBUM
========================================================= */

export async function tambahAlbumPertanahanAction(
  formData:
    FormData
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

  const tahun =
    nullableNumber(
      formData,
      'tahun'
    );

  const urutan =
    getNumber(
      formData,
      'urutan'
    );

  const aktif =
    getBoolean(
      formData,
      'aktif'
    );

  if (
    judul.length <
      3
  ) {
    redirect(
      buildUrl(
        'error',
        'Judul album minimal 3 karakter.'
      )
    );
  }

  if (
    tahun !==
      null &&
    (
      !Number.isInteger(
        tahun
      ) ||
      tahun <
        1900 ||
      tahun >
        2200
    )
  ) {
    redirect(
      buildUrl(
        'error',
        'Tahun album tidak valid.'
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
      buildUrl(
        'error',
        'Urutan album tidak valid.'
      )
    );
  }

  const slug =
    await createUniqueSlug(
      judul
    );

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'pertanahan_album'
      )
      .insert({
        judul,

        slug,

        deskripsi:
          nullableString(
            deskripsi
          ),

        tahun,

        aktif,

        urutan,

        created_at:
          new Date()
            .toISOString(),

        updated_at:
          new Date()
            .toISOString(),
      });

  if (error) {
    redirect(
      buildUrl(
        'error',
        error.message
      )
    );
  }

  revalidatePertanahan();

  redirect(
    buildUrl(
      'success',
      'Album Pertanahan berhasil dibuat.'
    )
  );
}

/* =========================================================
   UPDATE ALBUM
========================================================= */

export async function ubahAlbumPertanahanAction(
  id:
    string,

  formData:
    FormData
) {
  await requireAdmin();

  const albumId =
    String(
      id ??
        ''
    ).trim();

  if (
    !albumId
  ) {
    redirect(
      buildUrl(
        'error',
        'ID album tidak valid.'
      )
    );
  }

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

  const tahun =
    nullableNumber(
      formData,
      'tahun'
    );

  const urutan =
    getNumber(
      formData,
      'urutan'
    );

  const aktif =
    getBoolean(
      formData,
      'aktif'
    );

  if (
    judul.length <
      3
  ) {
    redirect(
      buildUrl(
        'error',
        'Judul album minimal 3 karakter.'
      )
    );
  }

  if (
    tahun !==
      null &&
    (
      !Number.isInteger(
        tahun
      ) ||
      tahun <
        1900 ||
      tahun >
        2200
    )
  ) {
    redirect(
      buildUrl(
        'error',
        'Tahun album tidak valid.'
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
      buildUrl(
        'error',
        'Urutan album tidak valid.'
      )
    );
  }

  const slug =
    await createUniqueSlug(
      judul,
      albumId
    );

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'pertanahan_album'
      )
      .update({
        judul,

        slug,

        deskripsi:
          nullableString(
            deskripsi
          ),

        tahun,

        urutan,

        aktif,

        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        'id',
        albumId
      );

  if (error) {
    redirect(
      buildUrl(
        'error',
        error.message
      )
    );
  }

  revalidatePertanahan();

  redirect(
    buildUrl(
      'success',
      'Album Pertanahan berhasil diperbarui.'
    )
  );
}

/* =========================================================
   DELETE ALBUM
========================================================= */

export async function hapusAlbumPertanahanAction(
  formData:
    FormData
) {
  await requireAdmin();

  const id =
    getString(
      formData,
      'id'
    );

  if (
    !id
  ) {
    redirect(
      buildUrl(
        'error',
        'ID album tidak valid.'
      )
    );
  }

  const {
    data:
      photos,

    error:
      photoError,
  } =
    await supabaseAdmin
      .from(
        'pertanahan_foto'
      )
      .select(
        'foto_path'
      )
      .eq(
        'album_id',
        id
      );

  if (
    photoError
  ) {
    redirect(
      buildUrl(
        'error',
        photoError.message
      )
    );
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'pertanahan_album'
      )
      .delete()
      .eq(
        'id',
        id
      );

  if (error) {
    redirect(
      buildUrl(
        'error',
        error.message
      )
    );
  }

  await removeStorageFiles(
    (
      photos ??
      []
    ).map(
      (
        item
      ) =>
        item.foto_path
    )
  );

  revalidatePertanahan();

  redirect(
    buildUrl(
      'success',
      'Album dan seluruh fotonya berhasil dihapus.'
    )
  );
}

/* =========================================================
   ADD PHOTOS
========================================================= */

export async function tambahFotoPertanahanAction(
  albumId:
    string,

  formData:
    FormData
) {
  await requireAdmin();

  const id =
    String(
      albumId ??
        ''
    ).trim();

  if (
    !id
  ) {
    redirect(
      buildUrl(
        'error',
        'ID album tidak valid.'
      )
    );
  }

  const files =
    getImageFiles(
      formData,
      'foto'
    );

  const caption =
    getString(
      formData,
      'caption'
    );

  const urutanAwal =
    getNumber(
      formData,
      'urutan_awal'
    );

  if (
    !Number.isInteger(
      urutanAwal
    ) ||
    urutanAwal <
      0
  ) {
    redirect(
      buildUrl(
        'error',
        'Urutan awal foto tidak valid.'
      )
    );
  }

  try {
    validateImages(
      files
    );
  } catch (
    error
  ) {
    redirect(
      buildUrl(
        'error',
        error instanceof
        Error
          ? error.message
          : 'Foto tidak valid.'
      )
    );
  }

  const uploaded: Array<{
    path:
      string;

    url:
      string;
  }> = [];

  try {
    for (
      const file of
        files
    ) {
      const result =
        await uploadImage(
          file,
          id
        );

      uploaded.push(
        result
      );
    }

    const rows =
      uploaded.map(
        (
          item,
          index
        ) => ({
          album_id:
            id,

          foto_url:
            item.url,

          foto_path:
            item.path,

          caption:
            nullableString(
              caption
            ),

          urutan:
            urutanAwal +
            index,

          aktif:
            true,

          created_at:
            new Date()
              .toISOString(),

          updated_at:
            new Date()
              .toISOString(),
        })
      );

    const {
      error,
    } =
      await supabaseAdmin
        .from(
          'pertanahan_foto'
        )
        .insert(
          rows
        );

    if (error) {
      await removeStorageFiles(
        uploaded.map(
          (
            item
          ) =>
            item.path
        )
      );

      redirect(
        buildUrl(
          'error',
          error.message
        )
      );
    }
  } catch (
    error
  ) {
    await removeStorageFiles(
      uploaded.map(
        (
          item
        ) =>
          item.path
      )
    );

    redirect(
      buildUrl(
        'error',
        error instanceof
        Error
          ? error.message
          : 'Foto gagal diunggah.'
      )
    );
  }

  revalidatePertanahan();

  redirect(
    buildUrl(
      'success',
      `${uploaded.length} foto berhasil ditambahkan ke album.`
    )
  );
}

/* =========================================================
   UPDATE PHOTO
========================================================= */

export async function ubahFotoPertanahanAction(
  id:
    string,

  formData:
    FormData
) {
  await requireAdmin();

  const photoId =
    String(
      id ??
        ''
    ).trim();

  if (
    !photoId
  ) {
    redirect(
      buildUrl(
        'error',
        'ID foto tidak valid.'
      )
    );
  }

  const caption =
    getString(
      formData,
      'caption'
    );

  const urutan =
    getNumber(
      formData,
      'urutan'
    );

  const aktif =
    getBoolean(
      formData,
      'aktif'
    );

  if (
    !Number.isInteger(
      urutan
    ) ||
    urutan <
      0
  ) {
    redirect(
      buildUrl(
        'error',
        'Urutan foto tidak valid.'
      )
    );
  }

  const {
    data:
      current,

    error:
      currentError,
  } =
    await supabaseAdmin
      .from(
        'pertanahan_foto'
      )
      .select(`
        id,
        album_id,
        foto_url,
        foto_path
      `)
      .eq(
        'id',
        photoId
      )
      .maybeSingle();

  if (
    currentError ||
    !current
  ) {
    redirect(
      buildUrl(
        'error',
        currentError?.message ??
          'Foto tidak ditemukan.'
      )
    );
  }

  const replacement =
    getImageFiles(
      formData,
      'foto_pengganti'
    )[0] ??
    null;

  let newUrl =
    current.foto_url;

  let newPath =
    current.foto_path;

  let uploadedPath:
    string | null =
    null;

  if (
    replacement
  ) {
    try {
      validateImage(
        replacement
      );

      const uploaded =
        await uploadImage(
          replacement,
          current.album_id
        );

      newUrl =
        uploaded.url;

      newPath =
        uploaded.path;

      uploadedPath =
        uploaded.path;
    } catch (
      error
    ) {
      redirect(
        buildUrl(
          'error',
          error instanceof
          Error
            ? error.message
            : 'Foto pengganti gagal diunggah.'
        )
      );
    }
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'pertanahan_foto'
      )
      .update({
        foto_url:
          newUrl,

        foto_path:
          newPath,

        caption:
          nullableString(
            caption
          ),

        urutan,

        aktif,

        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        'id',
        photoId
      );

  if (
    error
  ) {
    if (
      uploadedPath
    ) {
      await removeStorageFiles([
        uploadedPath,
      ]);
    }

    redirect(
      buildUrl(
        'error',
        error.message
      )
    );
  }

  if (
    uploadedPath &&
    current.foto_path !==
      uploadedPath
  ) {
    await removeStorageFiles([
      current.foto_path,
    ]);
  }

  revalidatePertanahan();

  redirect(
    buildUrl(
      'success',
      'Foto berhasil diperbarui.'
    )
  );
}

/* =========================================================
   DELETE PHOTO
========================================================= */

export async function hapusFotoPertanahanAction(
  formData:
    FormData
) {
  await requireAdmin();

  const id =
    getString(
      formData,
      'id'
    );

  if (
    !id
  ) {
    redirect(
      buildUrl(
        'error',
        'ID foto tidak valid.'
      )
    );
  }

  const {
    data,
    error:
      selectError,
  } =
    await supabaseAdmin
      .from(
        'pertanahan_foto'
      )
      .select(
        'foto_path'
      )
      .eq(
        'id',
        id
      )
      .maybeSingle();

  if (
    selectError ||
    !data
  ) {
    redirect(
      buildUrl(
        'error',
        selectError?.message ??
          'Foto tidak ditemukan.'
      )
    );
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'pertanahan_foto'
      )
      .delete()
      .eq(
        'id',
        id
      );

  if (
    error
  ) {
    redirect(
      buildUrl(
        'error',
        error.message
      )
    );
  }

  await removeStorageFiles([
    data.foto_path,
  ]);

  revalidatePertanahan();

  redirect(
    buildUrl(
      'success',
      'Foto berhasil dihapus.'
    )
  );
}