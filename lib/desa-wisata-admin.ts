// lib/desa-wisata-admin.ts

import 'server-only';

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

export const DESA_WISATA_BUCKET =
  'desa-wisata';

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES =
  new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
  ]);

/* =========================================================
   TYPES
========================================================= */

export interface WisataAdminItem {
  id: string;

  nama: string;

  kategori: string;

  lokasi:
    | string
    | null;

  jadwal:
    | string
    | null;

  tanggal:
    | string
    | null;

  deskripsi: string;

  gambarUrl:
    | string
    | null;

  gambarPath:
    | string
    | null;

  aktif: boolean;

  urutan: number;

  createdAt: string;

  updatedAt: string;
}

export interface WisataCrudConfig {
  table: string;

  adminPath: string;

  publicPath: string;

  storageFolder: string;

  allowLocation?: boolean;

  allowSchedule?: boolean;

  allowDate?: boolean;
}

/* =========================================================
   AUTH
========================================================= */

export async function requireDesaWisataAdmin() {
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
    redirect('/login');
  }

  return user;
}

/* =========================================================
   FORM HELPERS
========================================================= */

export function getFormString(
  formData: FormData,
  key: string
) {
  return String(
    formData.get(key) ??
      ''
  ).trim();
}

export function getFormBoolean(
  formData: FormData,
  key: string
) {
  return (
    getFormString(
      formData,
      key
    ) === 'true'
  );
}

export function getFormNumber(
  formData: FormData,
  key: string
) {
  return Number(
    getFormString(
      formData,
      key
    )
  );
}

export function getImageFile(
  formData: FormData,
  key = 'gambar'
): File | null {
  const value =
    formData.get(key);

  if (
    !(value instanceof File) ||
    value.size <= 0
  ) {
    return null;
  }

  return value;
}

/* =========================================================
   URL
========================================================= */

export function isHttpUrl(
  value: string
) {
  if (!value) {
    return true;
  }

  try {
    const url =
      new URL(value);

    return (
      url.protocol ===
        'http:' ||
      url.protocol ===
        'https:'
    );
  } catch {
    return false;
  }
}

/* =========================================================
   IMAGE
========================================================= */

function getExtension(
  mimeType: string
) {
  switch (
    mimeType
  ) {
    case 'image/png':
      return 'png';

    case 'image/webp':
      return 'webp';

    default:
      return 'jpg';
  }
}

export function validateImageFile(
  file: File | null
) {
  if (!file) {
    return null;
  }

  if (
    !ALLOWED_IMAGE_TYPES.has(
      file.type
    )
  ) {
    return 'Format foto harus JPG, PNG, atau WEBP.';
  }

  if (
    file.size >
    MAX_IMAGE_SIZE
  ) {
    return 'Ukuran foto maksimal 5 MB.';
  }

  return null;
}

export async function uploadDesaWisataImage(
  file: File,
  folder: string
) {
  const validation =
    validateImageFile(file);

  if (validation) {
    throw new Error(
      validation
    );
  }

  const extension =
    getExtension(
      file.type
    );

  const safeFolder =
    folder
      .replace(
        /[^a-z0-9/_-]/gi,
        '-'
      )
      .replace(
        /^\/+|\/+$/g,
        ''
      );

  const path =
    `${safeFolder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const buffer =
    await file.arrayBuffer();

  const {
    error,
  } =
    await supabaseAdmin.storage
      .from(
        DESA_WISATA_BUCKET
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
        DESA_WISATA_BUCKET
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

export async function deleteDesaWisataImage(
  path:
    | string
    | null
    | undefined
) {
  if (!path) {
    return;
  }

  const {
    error,
  } =
    await supabaseAdmin.storage
      .from(
        DESA_WISATA_BUCKET
      )
      .remove([
        path,
      ]);

  if (error) {
    console.error(
      'Gagal menghapus gambar Desa Wisata:',
      error
    );
  }
}

/* =========================================================
   NORMALIZE
========================================================= */

function safeString(
  value: unknown
) {
  return String(
    value ?? ''
  ).trim();
}

function nullableString(
  value: unknown
) {
  const valueString =
    safeString(value);

  return (
    valueString ||
    null
  );
}

export function normalizeWisataAdminRow(
  value: unknown
): WisataAdminItem | null {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(value)
  ) {
    return null;
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  const id =
    safeString(
      row.id
    );

  const nama =
    safeString(
      row.nama
    );

  if (
    !id ||
    !nama
  ) {
    return null;
  }

  const urutanRaw =
    Number(
      row.urutan ?? 0
    );

  return {
    id,

    nama,

    kategori:
      safeString(
        row.kategori
      ),

    lokasi:
      nullableString(
        row.lokasi
      ),

    jadwal:
      nullableString(
        row.jadwal
      ),

    tanggal:
      nullableString(
        row.tanggal
      ),

    deskripsi:
      safeString(
        row.deskripsi
      ),

    gambarUrl:
      nullableString(
        row.gambar_url
      ),

    gambarPath:
      nullableString(
        row.gambar_path
      ),

    aktif:
      Boolean(
        row.aktif
      ),

    urutan:
      Number.isFinite(
        urutanRaw
      )
        ? urutanRaw
        : 0,

    createdAt:
      safeString(
        row.created_at
      ),

    updatedAt:
      safeString(
        row.updated_at
      ),
  };
}

/* =========================================================
   REDIRECT / REVALIDATE
========================================================= */

function buildAdminUrl(
  path: string,
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

  return `${path}?${params.toString()}`;
}

export function revalidateWisataPaths(
  paths: string[]
) {
  const uniquePaths =
    new Set([
      ...paths,
      '/desa-wisata',
      '/admin/desa-wisata',
      '/admin',
    ]);

  uniquePaths.forEach(
    (path) => {
      revalidatePath(
        path
      );
    }
  );
}

/* =========================================================
   COMMON INPUT
========================================================= */

interface CommonInput {
  nama: string;

  kategori: string;

  lokasi: string;

  jadwal: string;

  tanggal: string;

  deskripsi: string;

  aktif: boolean;

  urutan: number;

  imageFile:
    | File
    | null;
}

function parseCommonInput(
  formData: FormData
): CommonInput {
  return {
    nama:
      getFormString(
        formData,
        'nama'
      ),

    kategori:
      getFormString(
        formData,
        'kategori'
      ),

    lokasi:
      getFormString(
        formData,
        'lokasi'
      ),

    jadwal:
      getFormString(
        formData,
        'jadwal'
      ),

    tanggal:
      getFormString(
        formData,
        'tanggal'
      ),

    deskripsi:
      getFormString(
        formData,
        'deskripsi'
      ),

    aktif:
      getFormBoolean(
        formData,
        'aktif'
      ),

    urutan:
      getFormNumber(
        formData,
        'urutan'
      ),

    imageFile:
      getImageFile(
        formData
      ),
  };
}

function validateCommonInput(
  input: CommonInput,
  config:
    WisataCrudConfig
) {
  if (
    input.nama.length <
    3
  ) {
    return 'Nama minimal terdiri dari 3 karakter.';
  }

  if (
    input.nama.length >
    200
  ) {
    return 'Nama maksimal 200 karakter.';
  }

  if (
    input.kategori.length <
    2
  ) {
    return 'Kategori wajib diisi.';
  }

  if (
    input.kategori.length >
    120
  ) {
    return 'Kategori maksimal 120 karakter.';
  }

  if (
    input.deskripsi.length <
    10
  ) {
    return 'Deskripsi minimal terdiri dari 10 karakter.';
  }

  if (
    input.deskripsi.length >
    5000
  ) {
    return 'Deskripsi maksimal 5000 karakter.';
  }

  if (
    config.allowLocation &&
    input.lokasi.length >
      300
  ) {
    return 'Lokasi maksimal 300 karakter.';
  }

  if (
    config.allowSchedule &&
    input.jadwal.length <
      2
  ) {
    return 'Jadwal wajib diisi.';
  }

  if (
    config.allowSchedule &&
    input.jadwal.length >
      300
  ) {
    return 'Jadwal maksimal 300 karakter.';
  }

  if (
    config.allowDate &&
    input.tanggal &&
    !/^\d{4}-\d{2}-\d{2}$/.test(
      input.tanggal
    )
  ) {
    return 'Tanggal tidak valid.';
  }

  if (
    !Number.isInteger(
      input.urutan
    ) ||
    input.urutan < 0
  ) {
    return 'Urutan harus berupa bilangan bulat minimal 0.';
  }

  const imageError =
    validateImageFile(
      input.imageFile
    );

  if (imageError) {
    return imageError;
  }

  return null;
}

function commonPayload(
  input: CommonInput,
  config:
    WisataCrudConfig
) {
  const payload:
    Record<
      string,
      unknown
    > = {
    nama:
      input.nama,

    kategori:
      input.kategori,

    deskripsi:
      input.deskripsi,

    aktif:
      input.aktif,

    urutan:
      input.urutan,

    updated_at:
      new Date()
        .toISOString(),
  };

  if (
    config.allowLocation
  ) {
    payload.lokasi =
      input.lokasi ||
      null;
  }

  if (
    config.allowSchedule
  ) {
    payload.jadwal =
      input.jadwal;
  }

  if (
    config.allowDate
  ) {
    payload.tanggal =
      input.tanggal ||
      null;
  }

  return payload;
}

/* =========================================================
   CREATE
========================================================= */

export async function createWisataCrudItem(
  formData: FormData,
  config:
    WisataCrudConfig
) {
  await requireDesaWisataAdmin();

  const input =
    parseCommonInput(
      formData
    );

  const validationError =
    validateCommonInput(
      input,
      config
    );

  if (
    validationError
  ) {
    redirect(
      buildAdminUrl(
        config.adminPath,
        'error',
        validationError
      )
    );
  }

  let uploaded:
    | {
        path: string;
        url: string;
      }
    | null = null;

  if (
    input.imageFile
  ) {
    try {
      uploaded =
        await uploadDesaWisataImage(
          input.imageFile,
          config.storageFolder
        );
    } catch (
      error
    ) {
      redirect(
        buildAdminUrl(
          config.adminPath,
          'error',
          error instanceof Error
            ? error.message
            : 'Upload foto gagal.'
        )
      );
    }
  }

  const payload = {
    ...commonPayload(
      input,
      config
    ),

    gambar_url:
      uploaded?.url ??
      null,

    gambar_path:
      uploaded?.path ??
      null,

    created_at:
      new Date()
        .toISOString(),
  };

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        config.table
      )
      .insert(
        payload
      );

  if (error) {
    if (uploaded) {
      await deleteDesaWisataImage(
        uploaded.path
      );
    }

    console.error(
      `Gagal menambahkan data ${config.table}:`,
      error
    );

    redirect(
      buildAdminUrl(
        config.adminPath,
        'error',
        error.message
      )
    );
  }

  revalidateWisataPaths([
    config.adminPath,
    config.publicPath,
  ]);

  redirect(
    buildAdminUrl(
      config.adminPath,
      'success',
      'Data berhasil ditambahkan.'
    )
  );
}

/* =========================================================
   UPDATE
========================================================= */

export async function updateWisataCrudItem(
  formData: FormData,
  config:
    WisataCrudConfig
) {
  await requireDesaWisataAdmin();

  const id =
    getFormString(
      formData,
      'id'
    );

  if (!id) {
    redirect(
      buildAdminUrl(
        config.adminPath,
        'error',
        'ID data tidak valid.'
      )
    );
  }

  const input =
    parseCommonInput(
      formData
    );

  const validationError =
    validateCommonInput(
      input,
      config
    );

  if (
    validationError
  ) {
    redirect(
      buildAdminUrl(
        config.adminPath,
        'error',
        validationError
      )
    );
  }

  const hapusGambar =
    getFormBoolean(
      formData,
      'hapus_gambar'
    );

  const {
    data:
      currentRow,
    error:
      currentError,
  } =
    await supabaseAdmin
      .from(
        config.table
      )
      .select(`
        gambar_url,
        gambar_path
      `)
      .eq(
        'id',
        id
      )
      .maybeSingle();

  if (
    currentError ||
    !currentRow
  ) {
    redirect(
      buildAdminUrl(
        config.adminPath,
        'error',
        currentError
          ?.message ??
          'Data tidak ditemukan.'
      )
    );
  }

  const oldPath =
    String(
      currentRow
        .gambar_path ??
        ''
    ).trim() ||
    null;

  const oldUrl =
    String(
      currentRow
        .gambar_url ??
        ''
    ).trim() ||
    null;

  let newImage:
    | {
        path: string;
        url: string;
      }
    | null = null;

  if (
    input.imageFile
  ) {
    try {
      newImage =
        await uploadDesaWisataImage(
          input.imageFile,
          config.storageFolder
        );
    } catch (
      error
    ) {
      redirect(
        buildAdminUrl(
          config.adminPath,
          'error',
          error instanceof Error
            ? error.message
            : 'Upload foto gagal.'
        )
      );
    }
  }

  let gambarUrl =
    oldUrl;

  let gambarPath =
    oldPath;

  if (
    newImage
  ) {
    gambarUrl =
      newImage.url;

    gambarPath =
      newImage.path;
  } else if (
    hapusGambar
  ) {
    gambarUrl =
      null;

    gambarPath =
      null;
  }

  const payload = {
    ...commonPayload(
      input,
      config
    ),

    gambar_url:
      gambarUrl,

    gambar_path:
      gambarPath,
  };

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        config.table
      )
      .update(
        payload
      )
      .eq(
        'id',
        id
      );

  if (error) {
    if (
      newImage
    ) {
      await deleteDesaWisataImage(
        newImage.path
      );
    }

    redirect(
      buildAdminUrl(
        config.adminPath,
        'error',
        error.message
      )
    );
  }

  if (
    (
      newImage ||
      hapusGambar
    ) &&
    oldPath &&
    oldPath !==
      newImage?.path
  ) {
    await deleteDesaWisataImage(
      oldPath
    );
  }

  revalidateWisataPaths([
    config.adminPath,
    config.publicPath,
  ]);

  redirect(
    buildAdminUrl(
      config.adminPath,
      'success',
      'Data berhasil diperbarui.'
    )
  );
}

/* =========================================================
   TOGGLE
========================================================= */

export async function toggleWisataCrudItem(
  formData: FormData,
  config:
    WisataCrudConfig
) {
  await requireDesaWisataAdmin();

  const id =
    getFormString(
      formData,
      'id'
    );

  const aktif =
    getFormBoolean(
      formData,
      'aktif'
    );

  if (!id) {
    redirect(
      buildAdminUrl(
        config.adminPath,
        'error',
        'ID data tidak valid.'
      )
    );
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        config.table
      )
      .update({
        aktif,

        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        'id',
        id
      );

  if (error) {
    redirect(
      buildAdminUrl(
        config.adminPath,
        'error',
        error.message
      )
    );
  }

  revalidateWisataPaths([
    config.adminPath,
    config.publicPath,
  ]);

  redirect(
    buildAdminUrl(
      config.adminPath,
      'success',
      aktif
        ? 'Data berhasil diaktifkan.'
        : 'Data berhasil dinonaktifkan.'
    )
  );
}

/* =========================================================
   DELETE
========================================================= */

export async function deleteWisataCrudItem(
  formData: FormData,
  config:
    WisataCrudConfig
) {
  await requireDesaWisataAdmin();

  const id =
    getFormString(
      formData,
      'id'
    );

  if (!id) {
    redirect(
      buildAdminUrl(
        config.adminPath,
        'error',
        'ID data tidak valid.'
      )
    );
  }

  const {
    data,
    error:
      readError,
  } =
    await supabaseAdmin
      .from(
        config.table
      )
      .select(
        'gambar_path'
      )
      .eq(
        'id',
        id
      )
      .maybeSingle();

  if (
    readError
  ) {
    redirect(
      buildAdminUrl(
        config.adminPath,
        'error',
        readError.message
      )
    );
  }

  const gambarPath =
    String(
      data?.gambar_path ??
      ''
    ).trim() ||
    null;

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        config.table
      )
      .delete()
      .eq(
        'id',
        id
      );

  if (error) {
    redirect(
      buildAdminUrl(
        config.adminPath,
        'error',
        error.message
      )
    );
  }

  await deleteDesaWisataImage(
    gambarPath
  );

  revalidateWisataPaths([
    config.adminPath,
    config.publicPath,
  ]);

  redirect(
    buildAdminUrl(
      config.adminPath,
      'success',
      'Data berhasil dihapus.'
    )
  );
}