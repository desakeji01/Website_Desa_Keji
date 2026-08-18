// app/admin/pemerintahan/actions.ts

'use server';

import {
  Buffer,
} from 'node:buffer';

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

import {
  KELOMPOK_PERANGKAT,
  type KelompokPerangkat,
  type PemerintahanActionState,
} from '@/types/pemerintahan';

/* =========================================================
   CONFIG
========================================================= */

const PEMERINTAHAN_KEY =
  'utama';

const STORAGE_BUCKET =
  'pemerintahan';

const STORAGE_FOLDER =
  'perangkat-desa';

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES =
  new Set<string>([
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

function getImageFile(
  formData:
    FormData
): File | null {
  const value =
    formData.get(
      'foto'
    );

  if (
    !(
      value instanceof
      File
    ) ||
    value.size <=
      0
  ) {
    return null;
  }

  return value;
}

/* =========================================================
   UUID
========================================================= */

function isValidUuid(
  value:
    string
) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

/* =========================================================
   IMAGE HELPERS
========================================================= */

function normalizeMimeType(
  value:
    string
) {
  return String(
    value ??
      ''
  )
    .trim()
    .toLowerCase();
}

function validateImage(
  file:
    File |
    null
) {
  if (
    !file
  ) {
    return null;
  }

  const mimeType =
    normalizeMimeType(
      file.type
    );

  if (
    !ALLOWED_IMAGE_TYPES.has(
      mimeType
    )
  ) {
    return (
      'Foto harus berformat JPG, PNG, atau WEBP. ' +
      `Format yang diterima browser: ${mimeType || 'tidak diketahui'}.`
    );
  }

  if (
    file.size <=
    0
  ) {
    return 'File foto kosong.';
  }

  if (
    file.size >
    MAX_IMAGE_SIZE
  ) {
    return 'Ukuran foto maksimal 5 MB.';
  }

  return null;
}

function extensionFromMime(
  mime:
    string
) {
  switch (
    normalizeMimeType(
      mime
    )
  ) {
    case 'image/png':
      return 'png';

    case 'image/webp':
      return 'webp';

    case 'image/jpeg':
    default:
      return 'jpg';
  }
}

/* =========================================================
   UPLOAD FOTO
========================================================= */

async function uploadFoto(
  file:
    File
) {
  /* =======================================================
     VALIDATION
  ======================================================= */

  const validationError =
    validateImage(
      file
    );

  if (
    validationError
  ) {
    throw new Error(
      validationError
    );
  }

  const mimeType =
    normalizeMimeType(
      file.type
    );

  const extension =
    extensionFromMime(
      mimeType
    );

  /* =======================================================
     PATH
  ======================================================= */

  const fileName =
    `${Date.now()}-` +
    `${randomUUID()}.` +
    extension;

  const storagePath =
    `${STORAGE_FOLDER}/${fileName}`;

  /* =======================================================
     CONVERT FILE -> BUFFER
  ======================================================= */

  let buffer:
    Buffer;

  try {
    const arrayBuffer =
      await file.arrayBuffer();

    buffer =
      Buffer.from(
        arrayBuffer
      );
  } catch (
    error
  ) {
    console.error(
      'Gagal membaca file foto perangkat:',
      error
    );

    throw new Error(
      'File foto tidak dapat dibaca oleh server.'
    );
  }

  /* =======================================================
     SAFETY
  ======================================================= */

  if (
    buffer.length ===
    0
  ) {
    throw new Error(
      'File foto kosong.'
    );
  }

  if (
    buffer.length >
    MAX_IMAGE_SIZE
  ) {
    throw new Error(
      'Ukuran foto maksimal 5 MB.'
    );
  }

  /* =======================================================
     DEBUG BEFORE UPLOAD
  ======================================================= */

  console.log(
    'Upload foto perangkat dimulai:',
    {
      originalName:
        file.name,

      browserMimeType:
        file.type,

      normalizedMimeType:
        mimeType,

      fileSize:
        file.size,

      bufferSize:
        buffer.length,

      bucket:
        STORAGE_BUCKET,

      storagePath,
    }
  );

  /* =======================================================
     UPLOAD
  ======================================================= */

  const {
    data:
      uploadData,

    error:
      uploadError,
  } =
    await supabaseAdmin
      .storage
      .from(
        STORAGE_BUCKET
      )
      .upload(
        storagePath,
        buffer,
        {
          contentType:
            mimeType,

          cacheControl:
            '3600',

          upsert:
            false,
        }
      );

  /* =======================================================
     ERROR
  ======================================================= */

  if (
    uploadError
  ) {
    const detail =
      uploadError as typeof uploadError & {
        error?:
          string;

        code?:
          string;

        status?:
          number;

        statusCode?:
          number |
          string;
      };

    console.error(
      'Upload foto perangkat gagal:',
      {
        name:
          detail.name,

        message:
          detail.message,

        error:
          detail.error,

        code:
          detail.code,

        status:
          detail.status,

        statusCode:
          detail.statusCode,

        originalFileName:
          file.name,

        mimeType,

        fileSize:
          file.size,

        bufferSize:
          buffer.length,

        bucket:
          STORAGE_BUCKET,

        storagePath,

        raw:
          uploadError,
      }
    );

    throw new Error(
      detail.message &&
      detail.message !==
        'Bad Request'
        ? `Upload foto gagal: ${detail.message}`
        : 'Upload foto gagal: Bad Request'
    );
  }

  /* =======================================================
     CHECK RESPONSE
  ======================================================= */

  if (
    !uploadData ||
    !uploadData.path
  ) {
    console.error(
      'Upload foto berhasil tetapi Supabase tidak mengembalikan path:',
      uploadData
    );

    throw new Error(
      'Upload foto gagal karena lokasi file tidak dikembalikan Supabase.'
    );
  }

  /* =======================================================
     PUBLIC URL
  ======================================================= */

  const {
    data:
      publicData,
  } =
    supabaseAdmin
      .storage
      .from(
        STORAGE_BUCKET
      )
      .getPublicUrl(
        uploadData.path
      );

  const publicUrl =
    String(
      publicData
        ?.publicUrl ??
        ''
    ).trim();

  if (
    !publicUrl
  ) {
    console.error(
      'Public URL foto tidak tersedia:',
      {
        path:
          uploadData.path,

        publicData,
      }
    );

    /* hapus file karena DB belum akan menyimpannya */
    await supabaseAdmin
      .storage
      .from(
        STORAGE_BUCKET
      )
      .remove([
        uploadData.path,
      ]);

    throw new Error(
      'URL publik foto gagal dibuat.'
    );
  }

  console.log(
    'Upload foto perangkat berhasil:',
    {
      bucket:
        STORAGE_BUCKET,

      path:
        uploadData.path,

      publicUrl,
    }
  );

  return {
    path:
      uploadData.path,

    url:
      publicUrl,
  };
}

/* =========================================================
   DELETE STORAGE
========================================================= */

async function hapusFotoStorage(
  path:
    string |
    null |
    undefined
) {
  const cleanPath =
    String(
      path ??
        ''
    ).trim();

  if (
    !cleanPath
  ) {
    return;
  }

  const {
    error,
  } =
    await supabaseAdmin
      .storage
      .from(
        STORAGE_BUCKET
      )
      .remove([
        cleanPath,
      ]);

  if (
    error
  ) {
    console.error(
      'Gagal menghapus foto perangkat dari Storage:',
      {
        bucket:
          STORAGE_BUCKET,

        path:
          cleanPath,

        error,
      }
    );
  }
}

/* =========================================================
   REVALIDATE
========================================================= */

function revalidatePemerintahan() {
  revalidatePath(
    '/admin/pemerintahan'
  );

  revalidatePath(
    '/pemerintahan'
  );

  revalidatePath(
    '/api/pemerintahan'
  );

  revalidatePath(
    '/admin'
  );

  revalidatePath(
    '/'
  );
}

/* =========================================================
   INFORMASI PEMERINTAHAN
========================================================= */

export async function simpanInformasiPemerintahanAction(
  previousState:
    PemerintahanActionState,

  formData:
    FormData
): Promise<PemerintahanActionState> {
  void previousState;

  await requireAdmin();

  const sekilasInfo =
    getString(
      formData,
      'sekilas_info'
    );

  const judulHalaman =
    getString(
      formData,
      'judul_halaman'
    );

  const judulSotk =
    getString(
      formData,
      'judul_sotk'
    );

  const lokasiPemerintahan =
    getString(
      formData,
      'lokasi_pemerintahan'
    );

  const tanggalPublikasi =
    getString(
      formData,
      'tanggal_publikasi'
    );

  const penulis =
    getString(
      formData,
      'penulis'
    );

  const deskripsiKepalaDesa =
    getString(
      formData,
      'deskripsi_kepala_desa'
    );

  const deskripsiPerangkat =
    getString(
      formData,
      'deskripsi_perangkat'
    );

  const catatan =
    getString(
      formData,
      'catatan'
    );

  /* =======================================================
     REQUIRED
  ======================================================= */

  const requiredValues = [
    sekilasInfo,
    judulHalaman,
    judulSotk,
    lokasiPemerintahan,
    tanggalPublikasi,
    penulis,
    deskripsiKepalaDesa,
    deskripsiPerangkat,
  ];

  if (
    requiredValues.some(
      (
        value
      ) =>
        !value
    )
  ) {
    return {
      success:
        false,

      message:
        'Semua kolom wajib harus diisi.',
    };
  }

  /* =======================================================
     LIMIT
  ======================================================= */

  if (
    sekilasInfo.length >
    500
  ) {
    return {
      success:
        false,

      message:
        'Sekilas informasi maksimal 500 karakter.',
    };
  }

  if (
    deskripsiKepalaDesa.length >
    2000
  ) {
    return {
      success:
        false,

      message:
        'Deskripsi Kepala Desa maksimal 2.000 karakter.',
    };
  }

  if (
    deskripsiPerangkat.length >
    2000
  ) {
    return {
      success:
        false,

      message:
        'Deskripsi perangkat maksimal 2.000 karakter.',
    };
  }

  if (
    catatan.length >
    2000
  ) {
    return {
      success:
        false,

      message:
        'Catatan maksimal 2.000 karakter.',
    };
  }

  /* =======================================================
     UPSERT
  ======================================================= */

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'pemerintahan_desa'
      )
      .upsert(
        {
          pemerintahan_key:
            PEMERINTAHAN_KEY,

          sekilas_info:
            sekilasInfo,

          judul_halaman:
            judulHalaman,

          judul_sotk:
            judulSotk,

          lokasi_pemerintahan:
            lokasiPemerintahan,

          tanggal_publikasi:
            tanggalPublikasi,

          penulis,

          deskripsi_kepala_desa:
            deskripsiKepalaDesa,

          deskripsi_perangkat:
            deskripsiPerangkat,

          catatan:
            catatan ||
            '',

          updated_at:
            new Date()
              .toISOString(),
        },
        {
          onConflict:
            'pemerintahan_key',
        }
      );

  if (
    error
  ) {
    console.error(
      'Gagal menyimpan informasi pemerintahan:',
      error
    );

    return {
      success:
        false,

      message:
        error.message ||
        'Informasi pemerintahan gagal disimpan.',
    };
  }

  revalidatePemerintahan();

  return {
    success:
      true,

    message:
      'Informasi pemerintahan berhasil diperbarui.',
  };
}

/* =========================================================
   PERANGKAT INPUT
========================================================= */

interface PerangkatInput {
  nama:
    string;

  jabatan:
    string;

  kelompok:
    string;

  nip:
    string;

  nomorTelepon:
    string;

  deskripsi:
    string;

  urutan:
    number;

  aktif:
    boolean;

  foto:
    File |
    null;

  hapusFoto:
    boolean;
}

/* =========================================================
   PARSE PERANGKAT
========================================================= */

function parsePerangkat(
  formData:
    FormData
): PerangkatInput {
  return {
    nama:
      getString(
        formData,
        'nama'
      ),

    jabatan:
      getString(
        formData,
        'jabatan'
      ),

    kelompok:
      getString(
        formData,
        'kelompok'
      ),

    nip:
      getString(
        formData,
        'nip'
      ),

    nomorTelepon:
      getString(
        formData,
        'nomor_telepon'
      ),

    deskripsi:
      getString(
        formData,
        'deskripsi'
      ),

    urutan:
      getNumber(
        formData,
        'urutan'
      ),

    aktif:
      getBoolean(
        formData,
        'aktif'
      ),

    foto:
      getImageFile(
        formData
      ),

    hapusFoto:
      getBoolean(
        formData,
        'hapus_foto'
      ),
  };
}

/* =========================================================
   VALIDATE PERANGKAT
========================================================= */

function validatePerangkat(
  input:
    PerangkatInput
) {
  if (
    input.nama.length <
    2
  ) {
    return 'Nama perangkat minimal terdiri dari 2 karakter.';
  }

  if (
    input.nama.length >
    150
  ) {
    return 'Nama perangkat maksimal 150 karakter.';
  }

  if (
    input.jabatan.length <
    2
  ) {
    return 'Jabatan minimal terdiri dari 2 karakter.';
  }

  if (
    input.jabatan.length >
    150
  ) {
    return 'Jabatan maksimal 150 karakter.';
  }

  if (
    !(
      KELOMPOK_PERANGKAT as readonly string[]
    ).includes(
      input.kelompok
    )
  ) {
    return 'Kelompok perangkat tidak valid.';
  }

  if (
    !Number.isInteger(
      input.urutan
    ) ||
    input.urutan <
      1
  ) {
    return 'Nomor urutan harus berupa angka bulat minimal 1.';
  }

  if (
    input.nip.length >
    50
  ) {
    return 'NIP maksimal 50 karakter.';
  }

  if (
    input.nomorTelepon.length >
    30
  ) {
    return 'Nomor telepon maksimal 30 karakter.';
  }

  if (
    input.deskripsi.length >
    2000
  ) {
    return 'Deskripsi perangkat maksimal 2.000 karakter.';
  }

  const imageError =
    validateImage(
      input.foto
    );

  if (
    imageError
  ) {
    return imageError;
  }

  return null;
}

/* =========================================================
   CREATE PERANGKAT
========================================================= */

export async function tambahPerangkatAction(
  previousState:
    PemerintahanActionState,

  formData:
    FormData
): Promise<PemerintahanActionState> {
  void previousState;

  await requireAdmin();

  const input =
    parsePerangkat(
      formData
    );

  const validationError =
    validatePerangkat(
      input
    );

  if (
    validationError
  ) {
    return {
      success:
        false,

      message:
        validationError,
    };
  }

  /* =======================================================
     UPLOAD FOTO
  ======================================================= */

  let uploaded:
    {
      url:
        string;

      path:
        string;
    } | null =
    null;

  if (
    input.foto
  ) {
    try {
      uploaded =
        await uploadFoto(
          input.foto
        );
    } catch (
      error
    ) {
      console.error(
        'Tambah perangkat - upload foto gagal:',
        error
      );

      return {
        success:
          false,

        message:
          error instanceof
          Error
            ? error.message
            : 'Upload foto gagal.',
      };
    }
  }

  /* =======================================================
     INSERT DATABASE
  ======================================================= */

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'perangkat_desa'
      )
      .insert({
        nama:
          input.nama,

        jabatan:
          input.jabatan,

        kelompok:
          input.kelompok as KelompokPerangkat,

        foto_url:
          uploaded?.url ??
          null,

        foto_path:
          uploaded?.path ??
          null,

        nip:
          input.nip ||
          null,

        nomor_telepon:
          input.nomorTelepon ||
          null,

        deskripsi:
          input.deskripsi ||
          null,

        urutan:
          input.urutan,

        aktif:
          input.aktif,

        updated_at:
          new Date()
            .toISOString(),
      });

  /* =======================================================
     DATABASE ERROR
  ======================================================= */

  if (
    error
  ) {
    if (
      uploaded
    ) {
      await hapusFotoStorage(
        uploaded.path
      );
    }

    console.error(
      'Gagal menambahkan perangkat desa:',
      error
    );

    return {
      success:
        false,

      message:
        error.message ||
        'Perangkat desa gagal ditambahkan.',
    };
  }

  revalidatePemerintahan();

  redirect(
    '/admin/pemerintahan?status=created'
  );
}

/* =========================================================
   UPDATE PERANGKAT
========================================================= */

export async function ubahPerangkatAction(
  id:
    string,

  previousState:
    PemerintahanActionState,

  formData:
    FormData
): Promise<PemerintahanActionState> {
  void previousState;

  await requireAdmin();

  const perangkatId =
    String(
      id ??
        ''
    ).trim();

  /* =======================================================
     VALIDATE UUID
  ======================================================= */

  if (
    !isValidUuid(
      perangkatId
    )
  ) {
    console.error(
      'ID perangkat tidak valid:',
      perangkatId
    );

    return {
      success:
        false,

      message:
        'ID perangkat tidak valid.',
    };
  }

  /* =======================================================
     FORM
  ======================================================= */

  const input =
    parsePerangkat(
      formData
    );

  const validationError =
    validatePerangkat(
      input
    );

  if (
    validationError
  ) {
    return {
      success:
        false,

      message:
        validationError,
    };
  }

  /* =======================================================
     GET CURRENT DATA
  ======================================================= */

  const {
    data:
      current,

    error:
      currentError,
  } =
    await supabaseAdmin
      .from(
        'perangkat_desa'
      )
      .select(`
        id,
        foto_url,
        foto_path
      `)
      .eq(
        'id',
        perangkatId
      )
      .maybeSingle();

  if (
    currentError
  ) {
    console.error(
      'Gagal mengambil data perangkat sebelum update:',
      currentError
    );

    return {
      success:
        false,

      message:
        currentError.message ||
        'Data perangkat gagal diperiksa.',
    };
  }

  if (
    !current
  ) {
    return {
      success:
        false,

      message:
        'Data perangkat tidak ditemukan.',
    };
  }

  /* =======================================================
     OLD PHOTO
  ======================================================= */

  const oldFotoUrl =
    String(
      current.foto_url ??
        ''
    ).trim() ||
    null;

  const oldFotoPath =
    String(
      current.foto_path ??
        ''
    ).trim() ||
    null;

  /* =======================================================
     UPLOAD NEW PHOTO
  ======================================================= */

  let uploaded:
    {
      url:
        string;

      path:
        string;
    } | null =
    null;

  if (
    input.foto
  ) {
    try {
      uploaded =
        await uploadFoto(
          input.foto
        );
    } catch (
      error
    ) {
      console.error(
        'Ubah perangkat - upload foto gagal:',
        error
      );

      return {
        success:
          false,

        message:
          error instanceof
          Error
            ? error.message
            : 'Upload foto gagal.',
      };
    }
  }

  /* =======================================================
     FINAL PHOTO
  ======================================================= */

  let fotoUrl =
    oldFotoUrl;

  let fotoPath =
    oldFotoPath;

  /*
   * Jika ada upload baru:
   * foto baru menggantikan foto lama.
   */

  if (
    uploaded
  ) {
    fotoUrl =
      uploaded.url;

    fotoPath =
      uploaded.path;
  }

  /*
   * Jika tidak upload baru,
   * tetapi checkbox hapus foto aktif:
   * foto menjadi NULL.
   */

  else if (
    input.hapusFoto
  ) {
    fotoUrl =
      null;

    fotoPath =
      null;
  }

  /* =======================================================
     UPDATE DATABASE
  ======================================================= */

  const {
    error:
      updateError,
  } =
    await supabaseAdmin
      .from(
        'perangkat_desa'
      )
      .update({
        nama:
          input.nama,

        jabatan:
          input.jabatan,

        kelompok:
          input.kelompok as KelompokPerangkat,

        foto_url:
          fotoUrl,

        foto_path:
          fotoPath,

        nip:
          input.nip ||
          null,

        nomor_telepon:
          input.nomorTelepon ||
          null,

        deskripsi:
          input.deskripsi ||
          null,

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
        perangkatId
      );

  /* =======================================================
     DATABASE ERROR
  ======================================================= */

  if (
    updateError
  ) {
    /*
     * Jika upload foto baru berhasil,
     * tetapi update DB gagal,
     * hapus upload baru supaya tidak
     * menjadi file yatim.
     */

    if (
      uploaded
    ) {
      await hapusFotoStorage(
        uploaded.path
      );
    }

    console.error(
      'Gagal memperbarui perangkat desa:',
      updateError
    );

    return {
      success:
        false,

      message:
        updateError.message ||
        'Perangkat desa gagal diperbarui.',
    };
  }

  /* =======================================================
     DELETE OLD PHOTO
  ======================================================= */

  if (
    oldFotoPath &&
    (
      uploaded ||
      input.hapusFoto
    )
  ) {
    /*
     * Pastikan tidak menghapus file
     * yang sama dengan upload baru.
     */

    if (
      oldFotoPath !==
      uploaded?.path
    ) {
      await hapusFotoStorage(
        oldFotoPath
      );
    }
  }

  /* =======================================================
     SUCCESS
  ======================================================= */

  revalidatePemerintahan();

  redirect(
    '/admin/pemerintahan?status=updated'
  );
}

/* =========================================================
   TOGGLE PERANGKAT
========================================================= */

export async function togglePerangkatAction(
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

  /* =======================================================
     UUID
  ======================================================= */

  if (
    !isValidUuid(
      id
    )
  ) {
    console.error(
      'Toggle perangkat menerima ID tidak valid:',
      id
    );

    throw new Error(
      'ID perangkat tidak valid.'
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
        'perangkat_desa'
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
    console.error(
      'Gagal mengubah status perangkat:',
      error
    );

    throw new Error(
      error.message ||
      'Status perangkat gagal diperbarui.'
    );
  }

  revalidatePemerintahan();
}

/* =========================================================
   DELETE PERANGKAT
========================================================= */

export async function hapusPerangkatAction(
  formData:
    FormData
) {
  await requireAdmin();

  const id =
    getString(
      formData,
      'id'
    );

  /* =======================================================
     UUID
  ======================================================= */

  if (
    !isValidUuid(
      id
    )
  ) {
    console.error(
      'Hapus perangkat menerima ID tidak valid:',
      id
    );

    throw new Error(
      'ID perangkat tidak valid.'
    );
  }

  /* =======================================================
     GET CURRENT
  ======================================================= */

  const {
    data:
      current,

    error:
      currentError,
  } =
    await supabaseAdmin
      .from(
        'perangkat_desa'
      )
      .select(`
        id,
        nama,
        foto_path
      `)
      .eq(
        'id',
        id
      )
      .maybeSingle();

  if (
    currentError
  ) {
    console.error(
      'Gagal mengambil perangkat sebelum dihapus:',
      currentError
    );

    throw new Error(
      currentError.message ||
      'Data perangkat gagal diperiksa.'
    );
  }

  if (
    !current
  ) {
    throw new Error(
      'Perangkat desa tidak ditemukan.'
    );
  }

  /* =======================================================
     DELETE DATABASE
  ======================================================= */

  const {
    error:
      deleteError,
  } =
    await supabaseAdmin
      .from(
        'perangkat_desa'
      )
      .delete()
      .eq(
        'id',
        id
      );

  if (
    deleteError
  ) {
    console.error(
      'Gagal menghapus perangkat desa:',
      deleteError
    );

    throw new Error(
      deleteError.message ||
      'Perangkat desa gagal dihapus.'
    );
  }

  /* =======================================================
     DELETE STORAGE
  ======================================================= */

  const fotoPath =
    String(
      current.foto_path ??
        ''
    ).trim();

  if (
    fotoPath
  ) {
    await hapusFotoStorage(
      fotoPath
    );
  }

  /* =======================================================
     SUCCESS
  ======================================================= */

  revalidatePemerintahan();
}