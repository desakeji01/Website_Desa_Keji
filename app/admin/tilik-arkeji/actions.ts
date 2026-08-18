// app/admin/tilik-arkeji/actions.ts

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

const BUCKET_NAME =
  'tilik-arkeji';

const ADMIN_PATH =
  '/admin/tilik-arkeji';

const PUBLIC_PATH =
  '/profil/tilik-arkeji';

const SETTINGS_KEY =
  'utama';

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

/* =========================================================
   TYPES
========================================================= */

type NamaTabelArsip =
  | 'tilik_arkeji_mantan_kades'
  | 'tilik_arkeji_penghargaan';

interface HasilUpload {
  path:
    string;

  url:
    string;

  error:
    string | null;
}

interface ArsipLama {
  id:
    string;

  foto_path:
    string | null;

  foto_url:
    string | null;
}

interface MediaLama {
  id:
    string;

  gambar_path:
    string | null;

  gambar_url:
    string | null;
}

interface KepalaDesaInput {
  nama:
    string;

  periodeMulai:
    number;

  periodeSelesai:
    number | null;

  biografi:
    string;

  urutan:
    number;

  aktif:
    boolean;
}

interface PenghargaanInput {
  namaPenghargaan:
    string;

  tahun:
    number;

  tingkat:
    string;

  penyelenggara:
    string;

  deskripsi:
    string;

  urutan:
    number;

  aktif:
    boolean;
}

interface StrukturInput {
  judul:
    string;

  deskripsi:
    string;

  urutan:
    number;

  aktif:
    boolean;
}

interface PengaturanInput {
  judul:
    string;

  deskripsi:
    string;
}

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

function getInteger(
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

function getOptionalInteger(
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

  return value
    ? Number(value)
    : null;
}

function getFile(
  formData:
    FormData,

  key:
    string
): File | null {
  const value =
    formData.get(
      key
    );

  if (
    !(
      value instanceof
      File
    ) ||
    value.size ===
      0
  ) {
    return null;
  }

  return value;
}

/* =========================================================
   UTILITIES
========================================================= */

function slugify(
  value:
    string
) {
  const slug =
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
      )
      .replace(
        /-{2,}/g,
        '-'
      );

  return (
    slug ||
    'arsip'
  );
}

function getImageExtension(
  mimeType:
    string
) {
  switch (
    mimeType
  ) {
    case 'image/jpeg':
      return 'jpg';

    case 'image/png':
      return 'png';

    case 'image/webp':
      return 'webp';

    default:
      return null;
  }
}

function validateImage(
  file:
    File
) {
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as
        (typeof ALLOWED_IMAGE_TYPES)[number]
    )
  ) {
    return 'Gambar harus berformat JPG, PNG, atau WebP.';
  }

  if (
    file.size >
    MAX_IMAGE_SIZE
  ) {
    return 'Ukuran gambar maksimal 5 MB.';
  }

  return null;
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

  section:
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
    `#${section}`
  );
}

/* =========================================================
   REVALIDATE
========================================================= */

function revalidateTilikArkeji() {
  revalidatePath(
    ADMIN_PATH
  );

  revalidatePath(
    PUBLIC_PATH
  );

  revalidatePath(
    '/profil/sejarah'
  );

  revalidatePath(
    '/profil/data'
  );

  revalidatePath(
    '/admin'
  );

  revalidatePath(
    '/'
  );
}

/* =========================================================
   STORAGE
========================================================= */

async function uploadImage(
  file:
    File,

  folder:
    string,

  nama:
    string
): Promise<HasilUpload> {
  const extension =
    getImageExtension(
      file.type
    );

  if (
    !extension
  ) {
    return {
      path:
        '',

      url:
        '',

      error:
        'Format gambar tidak didukung.',
    };
  }

  const path =
    `${folder}/` +
    `${slugify(nama)}-` +
    `${Date.now()}-` +
    `${randomUUID()}.` +
    extension;

  const fileBuffer =
    new Uint8Array(
      await file.arrayBuffer()
    );

  const {
    error,
  } =
    await supabaseAdmin
      .storage
      .from(
        BUCKET_NAME
      )
      .upload(
        path,
        fileBuffer,
        {
          contentType:
            file.type,

          cacheControl:
            '3600',

          upsert:
            false,
        }
      );

  if (
    error
  ) {
    return {
      path:
        '',

      url:
        '',

      error:
        error.message,
    };
  }

  const {
    data,
  } =
    supabaseAdmin
      .storage
      .from(
        BUCKET_NAME
      )
      .getPublicUrl(
        path
      );

  return {
    path,

    url:
      data.publicUrl,

    error:
      null,
  };
}

async function deleteStorageFiles(
  paths:
    Array<
      | string
      | null
      | undefined
    >
) {
  const cleanPaths = [
    ...new Set(
      paths.filter(
        (
          path
        ): path is string =>
          Boolean(
            path
          )
      )
    ),
  ];

  if (
    cleanPaths.length ===
    0
  ) {
    return;
  }

  const {
    error,
  } =
    await supabaseAdmin
      .storage
      .from(
        BUCKET_NAME
      )
      .remove(
        cleanPaths
      );

  if (
    error
  ) {
    console.error(
      'Gagal menghapus gambar Tilik Arkeji:',
      {
        message:
          error.message,

        paths:
          cleanPaths,
      }
    );
  }
}

/* =========================================================
   GET EXISTING ARCHIVE
========================================================= */

async function getArsipLama(
  table:
    NamaTabelArsip,

  id:
    string
): Promise<{
  data:
    ArsipLama | null;

  error:
    string | null;
}> {
  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from(
        table
      )
      .select(`
        id,
        foto_path,
        foto_url
      `)
      .eq(
        'id',
        id
      )
      .maybeSingle();

  if (
    error
  ) {
    return {
      data:
        null,

      error:
        error.message,
    };
  }

  if (
    !data
  ) {
    return {
      data:
        null,

      error:
        'Data arsip tidak ditemukan.',
    };
  }

  return {
    data: {
      id:
        String(
          data.id
        ),

      foto_path:
        data.foto_path
          ? String(
              data.foto_path
            )
          : null,

      foto_url:
        data.foto_url
          ? String(
              data.foto_url
            )
          : null,
    },

    error:
      null,
  };
}

/* =========================================================
   GET EXISTING STRUCTURE
========================================================= */

async function getMediaLama(
  id:
    string
): Promise<{
  data:
    MediaLama | null;

  error:
    string | null;
}> {
  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from(
        'tilik_arkeji_media'
      )
      .select(`
        id,
        gambar_path,
        gambar_url
      `)
      .eq(
        'id',
        id
      )
      .eq(
        'kategori',
        'struktur-organisasi'
      )
      .maybeSingle();

  if (
    error
  ) {
    return {
      data:
        null,

      error:
        error.message,
    };
  }

  if (
    !data
  ) {
    return {
      data:
        null,

      error:
        'Data struktur organisasi tidak ditemukan.',
    };
  }

  return {
    data: {
      id:
        String(
          data.id
        ),

      gambar_path:
        data.gambar_path
          ? String(
              data.gambar_path
            )
          : null,

      gambar_url:
        data.gambar_url
          ? String(
              data.gambar_url
            )
          : null,
    },

    error:
      null,
  };
}

/* =========================================================
   PENGATURAN HALAMAN

   TIDAK ADA GOOGLE DRIVE
========================================================= */

function parsePengaturanInput(
  formData:
    FormData
): PengaturanInput {
  return {
    judul:
      getString(
        formData,
        'judul_halaman'
      ),

    deskripsi:
      getString(
        formData,
        'deskripsi_halaman'
      ),
  };
}

function validatePengaturan(
  input:
    PengaturanInput
) {
  if (
    input.judul.length <
    3
  ) {
    return 'Judul halaman minimal terdiri dari 3 karakter.';
  }

  if (
    input.judul.length >
    200
  ) {
    return 'Judul halaman maksimal 200 karakter.';
  }

  if (
    input.deskripsi.length <
    10
  ) {
    return 'Deskripsi halaman minimal terdiri dari 10 karakter.';
  }

  if (
    input.deskripsi.length >
    1500
  ) {
    return 'Deskripsi halaman maksimal 1.500 karakter.';
  }

  return null;
}

export async function simpanPengaturanTilikAction(
  formData:
    FormData
) {
  await requireAdmin();

  const input =
    parsePengaturanInput(
      formData
    );

  const validationError =
    validatePengaturan(
      input
    );

  if (
    validationError
  ) {
    redirect(
      buildAdminUrl(
        'error',
        validationError,
        'pengaturan-tilik'
      )
    );
  }

  /*
   * Hanya update judul dan deskripsi.
   *
   * Kolom Google Drive lama tidak dibaca,
   * tidak divalidasi, dan tidak ditulis.
   */

  const {
    data:
      existingSettings,

    error:
      existingError,
  } =
    await supabaseAdmin
      .from(
        'tilik_arkeji_settings'
      )
      .select(
        'setting_key'
      )
      .eq(
        'setting_key',
        SETTINGS_KEY
      )
      .maybeSingle();

  if (
    existingError
  ) {
    redirect(
      buildAdminUrl(
        'error',
        existingError.message,
        'pengaturan-tilik'
      )
    );
  }

  if (
    existingSettings
  ) {
    const {
      error,
    } =
      await supabaseAdmin
        .from(
          'tilik_arkeji_settings'
        )
        .update({
          judul:
            input.judul,

          deskripsi:
            input.deskripsi,

          updated_at:
            new Date()
              .toISOString(),
        })
        .eq(
          'setting_key',
          SETTINGS_KEY
        );

    if (
      error
    ) {
      redirect(
        buildAdminUrl(
          'error',
          error.message,
          'pengaturan-tilik'
        )
      );
    }
  } else {
    const {
      error,
    } =
      await supabaseAdmin
        .from(
          'tilik_arkeji_settings'
        )
        .insert({
          setting_key:
            SETTINGS_KEY,

          judul:
            input.judul,

          deskripsi:
            input.deskripsi,

          updated_at:
            new Date()
              .toISOString(),
        });

    if (
      error
    ) {
      redirect(
        buildAdminUrl(
          'error',
          error.message,
          'pengaturan-tilik'
        )
      );
    }
  }

  revalidateTilikArkeji();

  redirect(
    buildAdminUrl(
      'success',
      'Pengaturan Tilik Arkeji berhasil disimpan.',
      'pengaturan-tilik'
    )
  );
}

/* =========================================================
   BIOGRAFI KEPALA DESA
========================================================= */

function parseKepalaDesaInput(
  formData:
    FormData
): KepalaDesaInput {
  return {
    nama:
      getString(
        formData,
        'nama'
      ),

    periodeMulai:
      getInteger(
        formData,
        'periode_mulai'
      ),

    periodeSelesai:
      getOptionalInteger(
        formData,
        'periode_selesai'
      ),

    biografi:
      getString(
        formData,
        'biografi'
      ),

    urutan:
      getInteger(
        formData,
        'urutan'
      ),

    aktif:
      getBoolean(
        formData,
        'aktif'
      ),
  };
}

function validateKepalaDesaInput(
  input:
    KepalaDesaInput
) {
  if (
    input.nama.length <
    3
  ) {
    return 'Nama kepala desa minimal terdiri dari 3 karakter.';
  }

  if (
    !Number.isInteger(
      input.periodeMulai
    ) ||
    input.periodeMulai <
      1900 ||
    input.periodeMulai >
      2200
  ) {
    return 'Tahun awal masa jabatan tidak valid.';
  }

  if (
    input.periodeSelesai !==
      null &&
    (
      !Number.isInteger(
        input.periodeSelesai
      ) ||
      input.periodeSelesai <
        input.periodeMulai ||
      input.periodeSelesai >
        2200
    )
  ) {
    return 'Tahun akhir masa jabatan tidak valid.';
  }

  if (
    input.biografi.length <
    20
  ) {
    return 'Biografi minimal terdiri dari 20 karakter.';
  }

  if (
    !Number.isInteger(
      input.urutan
    ) ||
    input.urutan <
      0
  ) {
    return 'Nomor urutan harus berupa bilangan bulat minimal 0.';
  }

  return null;
}

/* =========================================================
   ADD KEPALA DESA

   Nama action dipertahankan agar import lama tidak rusak.
========================================================= */

export async function tambahMantanKadesAction(
  formData:
    FormData
) {
  await requireAdmin();

  const input =
    parseKepalaDesaInput(
      formData
    );

  const validationError =
    validateKepalaDesaInput(
      input
    );

  if (
    validationError
  ) {
    redirect(
      buildAdminUrl(
        'error',
        validationError,
        'tambah-kepala-desa'
      )
    );
  }

  const foto =
    getFile(
      formData,
      'foto'
    );

  if (
    foto
  ) {
    const imageError =
      validateImage(
        foto
      );

    if (
      imageError
    ) {
      redirect(
        buildAdminUrl(
          'error',
          imageError,
          'tambah-kepala-desa'
        )
      );
    }
  }

  let hasilFoto:
    HasilUpload | null =
    null;

  if (
    foto
  ) {
    hasilFoto =
      await uploadImage(
        foto,
        'kepala-desa',
        input.nama
      );

    if (
      hasilFoto.error ||
      !hasilFoto.path ||
      !hasilFoto.url
    ) {
      redirect(
        buildAdminUrl(
          'error',
          hasilFoto.error ??
            'Foto gagal diunggah.',
          'tambah-kepala-desa'
        )
      );
    }
  }

  const now =
    new Date()
      .toISOString();

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'tilik_arkeji_mantan_kades'
      )
      .insert({
        nama:
          input.nama,

        periode_mulai:
          input.periodeMulai,

        periode_selesai:
          input.periodeSelesai,

        biografi:
          input.biografi,

        foto_url:
          hasilFoto?.url ??
          null,

        foto_path:
          hasilFoto?.path ??
          null,

        urutan:
          input.urutan,

        aktif:
          input.aktif,

        created_at:
          now,

        updated_at:
          now,
      });

  if (
    error
  ) {
    await deleteStorageFiles([
      hasilFoto?.path,
    ]);

    redirect(
      buildAdminUrl(
        'error',
        error.code ===
        '23505'
          ? 'Nama dan periode kepala desa tersebut sudah tersedia.'
          : error.message,
        'tambah-kepala-desa'
      )
    );
  }

  revalidateTilikArkeji();

  redirect(
    buildAdminUrl(
      'success',
      'Biografi Kepala Desa Keji berhasil ditambahkan.',
      'daftar-kepala-desa'
    )
  );
}

/* =========================================================
   UPDATE KEPALA DESA
========================================================= */

export async function ubahMantanKadesAction(
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
      buildAdminUrl(
        'error',
        'ID kepala desa tidak valid.',
        'daftar-kepala-desa'
      )
    );
  }

  const arsipLamaResult =
    await getArsipLama(
      'tilik_arkeji_mantan_kades',
      id
    );

  if (
    arsipLamaResult.error ||
    !arsipLamaResult.data
  ) {
    redirect(
      buildAdminUrl(
        'error',
        arsipLamaResult.error ??
          'Data kepala desa tidak ditemukan.',
        'daftar-kepala-desa'
      )
    );
  }

  const arsipLama =
    arsipLamaResult.data;

  const input =
    parseKepalaDesaInput(
      formData
    );

  const validationError =
    validateKepalaDesaInput(
      input
    );

  if (
    validationError
  ) {
    redirect(
      buildAdminUrl(
        'error',
        validationError,
        'daftar-kepala-desa'
      )
    );
  }

  const fotoBaru =
    getFile(
      formData,
      'foto'
    );

  const hapusFoto =
    getBoolean(
      formData,
      'hapus_foto'
    );

  if (
    fotoBaru
  ) {
    const imageError =
      validateImage(
        fotoBaru
      );

    if (
      imageError
    ) {
      redirect(
        buildAdminUrl(
          'error',
          imageError,
          'daftar-kepala-desa'
        )
      );
    }
  }

  let fotoPath =
    arsipLama.foto_path;

  let fotoUrl =
    arsipLama.foto_url;

  let hasilFotoBaru:
    HasilUpload | null =
    null;

  if (
    fotoBaru
  ) {
    hasilFotoBaru =
      await uploadImage(
        fotoBaru,
        'kepala-desa',
        input.nama
      );

    if (
      hasilFotoBaru.error ||
      !hasilFotoBaru.path ||
      !hasilFotoBaru.url
    ) {
      redirect(
        buildAdminUrl(
          'error',
          hasilFotoBaru.error ??
            'Foto baru gagal diunggah.',
          'daftar-kepala-desa'
        )
      );
    }

    fotoPath =
      hasilFotoBaru.path;

    fotoUrl =
      hasilFotoBaru.url;
  } else if (
    hapusFoto
  ) {
    fotoPath =
      null;

    fotoUrl =
      null;
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'tilik_arkeji_mantan_kades'
      )
      .update({
        nama:
          input.nama,

        periode_mulai:
          input.periodeMulai,

        periode_selesai:
          input.periodeSelesai,

        biografi:
          input.biografi,

        foto_url:
          fotoUrl,

        foto_path:
          fotoPath,

        urutan:
          input.urutan,

        aktif:
          input.aktif,

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
    await deleteStorageFiles([
      hasilFotoBaru?.path,
    ]);

    redirect(
      buildAdminUrl(
        'error',
        error.code ===
        '23505'
          ? 'Nama dan periode tersebut sudah digunakan.'
          : error.message,
        'daftar-kepala-desa'
      )
    );
  }

  if (
    hasilFotoBaru ||
    hapusFoto
  ) {
    await deleteStorageFiles([
      arsipLama.foto_path,
    ]);
  }

  revalidateTilikArkeji();

  redirect(
    buildAdminUrl(
      'success',
      'Biografi Kepala Desa Keji berhasil diperbarui.',
      'daftar-kepala-desa'
    )
  );
}

/* =========================================================
   TOGGLE KEPALA DESA
========================================================= */

export async function toggleMantanKadesAction(
  formData:
    FormData
) {
  await requireAdmin();

  const id =
    getString(
      formData,
      'id'
    );

  const aktif =
    getBoolean(
      formData,
      'aktif'
    );

  if (
    !id
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'ID data tidak valid.',
        'daftar-kepala-desa'
      )
    );
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'tilik_arkeji_mantan_kades'
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

  if (
    error
  ) {
    redirect(
      buildAdminUrl(
        'error',
        error.message,
        'daftar-kepala-desa'
      )
    );
  }

  revalidateTilikArkeji();

  redirect(
    buildAdminUrl(
      'success',
      aktif
        ? 'Biografi Kepala Desa berhasil dipublikasikan.'
        : 'Biografi Kepala Desa berhasil disembunyikan.',
      'daftar-kepala-desa'
    )
  );
}

/* =========================================================
   DELETE KEPALA DESA
========================================================= */

export async function hapusMantanKadesAction(
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
      buildAdminUrl(
        'error',
        'ID kepala desa tidak valid.',
        'daftar-kepala-desa'
      )
    );
  }

  const arsipLamaResult =
    await getArsipLama(
      'tilik_arkeji_mantan_kades',
      id
    );

  if (
    arsipLamaResult.error ||
    !arsipLamaResult.data
  ) {
    redirect(
      buildAdminUrl(
        'error',
        arsipLamaResult.error ??
          'Data kepala desa tidak ditemukan.',
        'daftar-kepala-desa'
      )
    );
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'tilik_arkeji_mantan_kades'
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
      buildAdminUrl(
        'error',
        error.message,
        'daftar-kepala-desa'
      )
    );
  }

  await deleteStorageFiles([
    arsipLamaResult.data
      .foto_path,
  ]);

  revalidateTilikArkeji();

  redirect(
    buildAdminUrl(
      'success',
      'Biografi Kepala Desa berhasil dihapus.',
      'daftar-kepala-desa'
    )
  );
}

/* =========================================================
   PENGHARGAAN
========================================================= */

function parsePenghargaanInput(
  formData:
    FormData
): PenghargaanInput {
  return {
    namaPenghargaan:
      getString(
        formData,
        'nama_penghargaan'
      ),

    tahun:
      getInteger(
        formData,
        'tahun'
      ),

    tingkat:
      getString(
        formData,
        'tingkat'
      ),

    penyelenggara:
      getString(
        formData,
        'penyelenggara'
      ),

    deskripsi:
      getString(
        formData,
        'deskripsi'
      ),

    urutan:
      getInteger(
        formData,
        'urutan'
      ),

    aktif:
      getBoolean(
        formData,
        'aktif'
      ),
  };
}

function validatePenghargaanInput(
  input:
    PenghargaanInput
) {
  if (
    input.namaPenghargaan.length <
    5
  ) {
    return 'Nama penghargaan minimal terdiri dari 5 karakter.';
  }

  if (
    !Number.isInteger(
      input.tahun
    ) ||
    input.tahun <
      1900 ||
    input.tahun >
      2200
  ) {
    return 'Tahun penghargaan tidak valid.';
  }

  if (
    input.tingkat.length <
    2
  ) {
    return 'Tingkat penghargaan minimal terdiri dari 2 karakter.';
  }

  if (
    input.penyelenggara.length <
    2
  ) {
    return 'Nama penyelenggara minimal terdiri dari 2 karakter.';
  }

  if (
    input.deskripsi.length <
    10
  ) {
    return 'Deskripsi penghargaan minimal terdiri dari 10 karakter.';
  }

  if (
    !Number.isInteger(
      input.urutan
    ) ||
    input.urutan <
      0
  ) {
    return 'Nomor urutan harus berupa bilangan bulat minimal 0.';
  }

  return null;
}

/* =========================================================
   ADD PENGHARGAAN
========================================================= */

export async function tambahPenghargaanAction(
  formData:
    FormData
) {
  await requireAdmin();

  const input =
    parsePenghargaanInput(
      formData
    );

  const validationError =
    validatePenghargaanInput(
      input
    );

  if (
    validationError
  ) {
    redirect(
      buildAdminUrl(
        'error',
        validationError,
        'tambah-penghargaan'
      )
    );
  }

  const foto =
    getFile(
      formData,
      'foto'
    );

  if (
    foto
  ) {
    const imageError =
      validateImage(
        foto
      );

    if (
      imageError
    ) {
      redirect(
        buildAdminUrl(
          'error',
          imageError,
          'tambah-penghargaan'
        )
      );
    }
  }

  let hasilFoto:
    HasilUpload | null =
    null;

  if (
    foto
  ) {
    hasilFoto =
      await uploadImage(
        foto,
        'penghargaan',
        input.namaPenghargaan
      );

    if (
      hasilFoto.error ||
      !hasilFoto.path ||
      !hasilFoto.url
    ) {
      redirect(
        buildAdminUrl(
          'error',
          hasilFoto.error ??
            'Foto penghargaan gagal diunggah.',
          'tambah-penghargaan'
        )
      );
    }
  }

  const now =
    new Date()
      .toISOString();

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'tilik_arkeji_penghargaan'
      )
      .insert({
        nama_penghargaan:
          input.namaPenghargaan,

        tahun:
          input.tahun,

        tingkat:
          input.tingkat,

        penyelenggara:
          input.penyelenggara,

        deskripsi:
          input.deskripsi,

        foto_url:
          hasilFoto?.url ??
          null,

        foto_path:
          hasilFoto?.path ??
          null,

        urutan:
          input.urutan,

        aktif:
          input.aktif,

        created_at:
          now,

        updated_at:
          now,
      });

  if (
    error
  ) {
    await deleteStorageFiles([
      hasilFoto?.path,
    ]);

    redirect(
      buildAdminUrl(
        'error',
        error.code ===
        '23505'
          ? 'Nama dan tahun penghargaan tersebut sudah tersedia.'
          : error.message,
        'tambah-penghargaan'
      )
    );
  }

  revalidateTilikArkeji();

  redirect(
    buildAdminUrl(
      'success',
      'Penghargaan Desa Keji berhasil ditambahkan.',
      'daftar-penghargaan'
    )
  );
}

/* =========================================================
   UPDATE PENGHARGAAN
========================================================= */

export async function ubahPenghargaanAction(
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
      buildAdminUrl(
        'error',
        'ID penghargaan tidak valid.',
        'daftar-penghargaan'
      )
    );
  }

  const arsipLamaResult =
    await getArsipLama(
      'tilik_arkeji_penghargaan',
      id
    );

  if (
    arsipLamaResult.error ||
    !arsipLamaResult.data
  ) {
    redirect(
      buildAdminUrl(
        'error',
        arsipLamaResult.error ??
          'Penghargaan tidak ditemukan.',
        'daftar-penghargaan'
      )
    );
  }

  const arsipLama =
    arsipLamaResult.data;

  const input =
    parsePenghargaanInput(
      formData
    );

  const validationError =
    validatePenghargaanInput(
      input
    );

  if (
    validationError
  ) {
    redirect(
      buildAdminUrl(
        'error',
        validationError,
        'daftar-penghargaan'
      )
    );
  }

  const fotoBaru =
    getFile(
      formData,
      'foto'
    );

  const hapusFoto =
    getBoolean(
      formData,
      'hapus_foto'
    );

  if (
    fotoBaru
  ) {
    const imageError =
      validateImage(
        fotoBaru
      );

    if (
      imageError
    ) {
      redirect(
        buildAdminUrl(
          'error',
          imageError,
          'daftar-penghargaan'
        )
      );
    }
  }

  let fotoPath =
    arsipLama.foto_path;

  let fotoUrl =
    arsipLama.foto_url;

  let hasilFotoBaru:
    HasilUpload | null =
    null;

  if (
    fotoBaru
  ) {
    hasilFotoBaru =
      await uploadImage(
        fotoBaru,
        'penghargaan',
        input.namaPenghargaan
      );

    if (
      hasilFotoBaru.error ||
      !hasilFotoBaru.path ||
      !hasilFotoBaru.url
    ) {
      redirect(
        buildAdminUrl(
          'error',
          hasilFotoBaru.error ??
            'Foto baru gagal diunggah.',
          'daftar-penghargaan'
        )
      );
    }

    fotoPath =
      hasilFotoBaru.path;

    fotoUrl =
      hasilFotoBaru.url;
  } else if (
    hapusFoto
  ) {
    fotoPath =
      null;

    fotoUrl =
      null;
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'tilik_arkeji_penghargaan'
      )
      .update({
        nama_penghargaan:
          input.namaPenghargaan,

        tahun:
          input.tahun,

        tingkat:
          input.tingkat,

        penyelenggara:
          input.penyelenggara,

        deskripsi:
          input.deskripsi,

        foto_url:
          fotoUrl,

        foto_path:
          fotoPath,

        urutan:
          input.urutan,

        aktif:
          input.aktif,

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
    await deleteStorageFiles([
      hasilFotoBaru?.path,
    ]);

    redirect(
      buildAdminUrl(
        'error',
        error.code ===
        '23505'
          ? 'Nama dan tahun penghargaan tersebut sudah digunakan.'
          : error.message,
        'daftar-penghargaan'
      )
    );
  }

  if (
    hasilFotoBaru ||
    hapusFoto
  ) {
    await deleteStorageFiles([
      arsipLama.foto_path,
    ]);
  }

  revalidateTilikArkeji();

  redirect(
    buildAdminUrl(
      'success',
      'Penghargaan Desa Keji berhasil diperbarui.',
      'daftar-penghargaan'
    )
  );
}

/* =========================================================
   TOGGLE PENGHARGAAN
========================================================= */

export async function togglePenghargaanAction(
  formData:
    FormData
) {
  await requireAdmin();

  const id =
    getString(
      formData,
      'id'
    );

  const aktif =
    getBoolean(
      formData,
      'aktif'
    );

  if (
    !id
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'ID penghargaan tidak valid.',
        'daftar-penghargaan'
      )
    );
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'tilik_arkeji_penghargaan'
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

  if (
    error
  ) {
    redirect(
      buildAdminUrl(
        'error',
        error.message,
        'daftar-penghargaan'
      )
    );
  }

  revalidateTilikArkeji();

  redirect(
    buildAdminUrl(
      'success',
      aktif
        ? 'Penghargaan berhasil dipublikasikan.'
        : 'Penghargaan berhasil disembunyikan.',
      'daftar-penghargaan'
    )
  );
}

/* =========================================================
   DELETE PENGHARGAAN
========================================================= */

export async function hapusPenghargaanAction(
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
      buildAdminUrl(
        'error',
        'ID penghargaan tidak valid.',
        'daftar-penghargaan'
      )
    );
  }

  const arsipLamaResult =
    await getArsipLama(
      'tilik_arkeji_penghargaan',
      id
    );

  if (
    arsipLamaResult.error ||
    !arsipLamaResult.data
  ) {
    redirect(
      buildAdminUrl(
        'error',
        arsipLamaResult.error ??
          'Penghargaan tidak ditemukan.',
        'daftar-penghargaan'
      )
    );
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'tilik_arkeji_penghargaan'
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
      buildAdminUrl(
        'error',
        error.message,
        'daftar-penghargaan'
      )
    );
  }

  await deleteStorageFiles([
    arsipLamaResult.data
      .foto_path,
  ]);

  revalidateTilikArkeji();

  redirect(
    buildAdminUrl(
      'success',
      'Penghargaan Desa Keji berhasil dihapus.',
      'daftar-penghargaan'
    )
  );
}

/* =========================================================
   STRUKTUR ORGANISASI

   HANYA STRUKTUR.
   Galeri Desa dikelola oleh Admin Galeri.
========================================================= */

function parseStrukturInput(
  formData:
    FormData
): StrukturInput {
  return {
    judul:
      getString(
        formData,
        'judul'
      ),

    deskripsi:
      getString(
        formData,
        'deskripsi'
      ),

    urutan:
      getInteger(
        formData,
        'urutan'
      ),

    aktif:
      getBoolean(
        formData,
        'aktif'
      ),
  };
}

function validateStrukturInput(
  input:
    StrukturInput
) {
  if (
    input.judul.length <
    3
  ) {
    return 'Judul struktur organisasi minimal terdiri dari 3 karakter.';
  }

  if (
    input.deskripsi &&
    input.deskripsi.length <
      5
  ) {
    return 'Deskripsi minimal terdiri dari 5 karakter atau dikosongkan.';
  }

  if (
    !Number.isInteger(
      input.urutan
    ) ||
    input.urutan <
      0
  ) {
    return 'Nomor urutan harus berupa bilangan bulat minimal 0.';
  }

  return null;
}

/* =========================================================
   ADD STRUKTUR
========================================================= */

export async function tambahMediaTilikAction(
  formData:
    FormData
) {
  await requireAdmin();

  const input =
    parseStrukturInput(
      formData
    );

  const validationError =
    validateStrukturInput(
      input
    );

  if (
    validationError
  ) {
    redirect(
      buildAdminUrl(
        'error',
        validationError,
        'tambah-struktur'
      )
    );
  }

  const gambar =
    getFile(
      formData,
      'gambar'
    );

  if (
    !gambar
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Gambar struktur organisasi wajib dipilih.',
        'tambah-struktur'
      )
    );
  }

  const imageError =
    validateImage(
      gambar
    );

  if (
    imageError
  ) {
    redirect(
      buildAdminUrl(
        'error',
        imageError,
        'tambah-struktur'
      )
    );
  }

  const hasilGambar =
    await uploadImage(
      gambar,
      'struktur-organisasi',
      input.judul
    );

  if (
    hasilGambar.error ||
    !hasilGambar.path ||
    !hasilGambar.url
  ) {
    redirect(
      buildAdminUrl(
        'error',
        hasilGambar.error ??
          'Gambar struktur gagal diunggah.',
        'tambah-struktur'
      )
    );
  }

  const now =
    new Date()
      .toISOString();

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'tilik_arkeji_media'
      )
      .insert({
        kategori:
          'struktur-organisasi',

        judul:
          input.judul,

        deskripsi:
          input.deskripsi ||
          null,

        gambar_url:
          hasilGambar.url,

        gambar_path:
          hasilGambar.path,

        urutan:
          input.urutan,

        aktif:
          input.aktif,

        created_at:
          now,

        updated_at:
          now,
      });

  if (
    error
  ) {
    await deleteStorageFiles([
      hasilGambar.path,
    ]);

    redirect(
      buildAdminUrl(
        'error',
        error.message,
        'tambah-struktur'
      )
    );
  }

  revalidateTilikArkeji();

  redirect(
    buildAdminUrl(
      'success',
      'Struktur organisasi berhasil ditambahkan.',
      'daftar-struktur'
    )
  );
}

/* =========================================================
   UPDATE STRUKTUR
========================================================= */

export async function ubahMediaTilikAction(
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
      buildAdminUrl(
        'error',
        'ID struktur organisasi tidak valid.',
        'daftar-struktur'
      )
    );
  }

  const mediaLamaResult =
    await getMediaLama(
      id
    );

  if (
    mediaLamaResult.error ||
    !mediaLamaResult.data
  ) {
    redirect(
      buildAdminUrl(
        'error',
        mediaLamaResult.error ??
          'Struktur organisasi tidak ditemukan.',
        'daftar-struktur'
      )
    );
  }

  const input =
    parseStrukturInput(
      formData
    );

  const validationError =
    validateStrukturInput(
      input
    );

  if (
    validationError
  ) {
    redirect(
      buildAdminUrl(
        'error',
        validationError,
        'daftar-struktur'
      )
    );
  }

  const gambarBaru =
    getFile(
      formData,
      'gambar'
    );

  const hapusGambar =
    getBoolean(
      formData,
      'hapus_gambar'
    );

  if (
    gambarBaru
  ) {
    const imageError =
      validateImage(
        gambarBaru
      );

    if (
      imageError
    ) {
      redirect(
        buildAdminUrl(
          'error',
          imageError,
          'daftar-struktur'
        )
      );
    }
  }

  let gambarPath =
    mediaLamaResult.data
      .gambar_path;

  let gambarUrl =
    mediaLamaResult.data
      .gambar_url;

  let hasilGambarBaru:
    HasilUpload | null =
    null;

  if (
    gambarBaru
  ) {
    hasilGambarBaru =
      await uploadImage(
        gambarBaru,
        'struktur-organisasi',
        input.judul
      );

    if (
      hasilGambarBaru.error ||
      !hasilGambarBaru.path ||
      !hasilGambarBaru.url
    ) {
      redirect(
        buildAdminUrl(
          'error',
          hasilGambarBaru.error ??
            'Gambar baru gagal diunggah.',
          'daftar-struktur'
        )
      );
    }

    gambarPath =
      hasilGambarBaru.path;

    gambarUrl =
      hasilGambarBaru.url;
  } else if (
    hapusGambar
  ) {
    gambarPath =
      null;

    gambarUrl =
      null;
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'tilik_arkeji_media'
      )
      .update({
        kategori:
          'struktur-organisasi',

        judul:
          input.judul,

        deskripsi:
          input.deskripsi ||
          null,

        gambar_url:
          gambarUrl,

        gambar_path:
          gambarPath,

        urutan:
          input.urutan,

        aktif:
          input.aktif,

        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        'id',
        id
      )
      .eq(
        'kategori',
        'struktur-organisasi'
      );

  if (
    error
  ) {
    await deleteStorageFiles([
      hasilGambarBaru?.path,
    ]);

    redirect(
      buildAdminUrl(
        'error',
        error.message,
        'daftar-struktur'
      )
    );
  }

  if (
    hasilGambarBaru ||
    hapusGambar
  ) {
    await deleteStorageFiles([
      mediaLamaResult.data
        .gambar_path,
    ]);
  }

  revalidateTilikArkeji();

  redirect(
    buildAdminUrl(
      'success',
      'Struktur organisasi berhasil diperbarui.',
      'daftar-struktur'
    )
  );
}

/* =========================================================
   TOGGLE STRUKTUR
========================================================= */

export async function toggleMediaTilikAction(
  formData:
    FormData
) {
  await requireAdmin();

  const id =
    getString(
      formData,
      'id'
    );

  const aktif =
    getBoolean(
      formData,
      'aktif'
    );

  if (
    !id
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'ID struktur organisasi tidak valid.',
        'daftar-struktur'
      )
    );
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'tilik_arkeji_media'
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
      )
      .eq(
        'kategori',
        'struktur-organisasi'
      );

  if (
    error
  ) {
    redirect(
      buildAdminUrl(
        'error',
        error.message,
        'daftar-struktur'
      )
    );
  }

  revalidateTilikArkeji();

  redirect(
    buildAdminUrl(
      'success',
      aktif
        ? 'Struktur organisasi berhasil dipublikasikan.'
        : 'Struktur organisasi berhasil disembunyikan.',
      'daftar-struktur'
    )
  );
}

/* =========================================================
   DELETE STRUKTUR
========================================================= */

export async function hapusMediaTilikAction(
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
      buildAdminUrl(
        'error',
        'ID struktur organisasi tidak valid.',
        'daftar-struktur'
      )
    );
  }

  const mediaLamaResult =
    await getMediaLama(
      id
    );

  if (
    mediaLamaResult.error ||
    !mediaLamaResult.data
  ) {
    redirect(
      buildAdminUrl(
        'error',
        mediaLamaResult.error ??
          'Struktur organisasi tidak ditemukan.',
        'daftar-struktur'
      )
    );
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'tilik_arkeji_media'
      )
      .delete()
      .eq(
        'id',
        id
      )
      .eq(
        'kategori',
        'struktur-organisasi'
      );

  if (
    error
  ) {
    redirect(
      buildAdminUrl(
        'error',
        error.message,
        'daftar-struktur'
      )
    );
  }

  await deleteStorageFiles([
    mediaLamaResult.data
      .gambar_path,
  ]);

  revalidateTilikArkeji();

  redirect(
    buildAdminUrl(
      'success',
      'Struktur organisasi berhasil dihapus.',
      'daftar-struktur'
    )
  );
}