// app/admin/pengaturan/ebook-actions.ts

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
  '/admin/pengaturan';

const PUBLIC_PATH =
  '/profil/sejarah';

const TABLE =
  'desa_wisata_dokumen';

const SETTINGS_TABLE =
  'profil_sejarah_settings';

const SETTINGS_KEY =
  'utama';

const JENIS_EBOOK =
  'ebook-sejarah';

const BUCKET =
  'ebook-sejarah';

const MAX_COVER_SIZE =
  2 * 1024 * 1024;

const MAX_PDF_SIZE =
  7 * 1024 * 1024;

const COVER_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

/* =========================================================
   TYPES
========================================================= */

interface UploadResult {
  path:
    string;

  url:
    string;

  error:
    string | null;
}

interface EbookLama {
  id:
    string;

  file_path:
    string | null;

  file_url:
    string;

  cover_path:
    string | null;

  cover_url:
    string | null;
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

  if (
    !value
  ) {
    return null;
  }

  return Number(
    value
  );
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
      )
      .replace(
        /-{2,}/g,
        '-'
      ) ||
    'ebook-sejarah'
  );
}

function getImageExtension(
  mime:
    string
) {
  switch (
    mime
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

/* =========================================================
   REDIRECT
========================================================= */

function buildAdminUrl(
  type:
    | 'success'
    | 'error',

  message:
    string,

  section =
    'ebook-sejarah'
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

function revalidateEbook() {
  revalidatePath(
    ADMIN_PATH
  );

  revalidatePath(
    PUBLIC_PATH
  );

  revalidatePath(
    '/'
  );

  revalidatePath(
    '/admin'
  );
}

/* =========================================================
   STORAGE
========================================================= */

async function uploadFile(
  file:
    File,

  folder:
    string,

  nama:
    string,

  extension:
    string
): Promise<UploadResult> {
  const path =
    `${folder}/` +
    `${slugify(nama)}-` +
    `${Date.now()}-` +
    `${randomUUID()}.` +
    extension;

  const buffer =
    new Uint8Array(
      await file.arrayBuffer()
    );

  const {
    error,
  } =
    await supabaseAdmin
      .storage
      .from(
        BUCKET
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
        BUCKET
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

async function deleteFiles(
  paths:
    Array<
      string |
      null |
      undefined
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
        BUCKET
      )
      .remove(
        cleanPaths
      );

  if (
    error
  ) {
    console.error(
      'Gagal menghapus file Ebook Sejarah:',
      error
    );
  }
}

/* =========================================================
   VALIDATION FILE
========================================================= */

function validateCover(
  file:
    File
) {
  if (
    !COVER_TYPES.includes(
      file.type as
        (typeof COVER_TYPES)[number]
    )
  ) {
    return 'Cover harus berupa JPG, PNG, atau WebP.';
  }

  if (
    file.size >
    MAX_COVER_SIZE
  ) {
    return 'Ukuran cover maksimal 2 MB.';
  }

  return null;
}

function validatePdf(
  file:
    File
) {
  if (
    file.type !==
    'application/pdf'
  ) {
    return 'File ebook harus berupa PDF.';
  }

  if (
    file.size >
    MAX_PDF_SIZE
  ) {
    return 'Ukuran PDF maksimal 7 MB.';
  }

  return null;
}

/* =========================================================
   GET EXISTING EBOOK
========================================================= */

async function getEbookLama(
  id:
    string
): Promise<{
  data:
    EbookLama | null;

  error:
    string | null;
}> {
  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from(
        TABLE
      )
      .select(`
        id,
        file_path,
        file_url,
        cover_path,
        cover_url
      `)
      .eq(
        'id',
        id
      )
      .eq(
        'jenis',
        JENIS_EBOOK
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
        'Ebook sejarah tidak ditemukan.',
    };
  }

  return {
    data: {
      id:
        String(
          data.id
        ),

      file_path:
        data.file_path
          ? String(
              data.file_path
            )
          : null,

      file_url:
        String(
          data.file_url ??
            ''
        ),

      cover_path:
        data.cover_path
          ? String(
              data.cover_path
            )
          : null,

      cover_url:
        data.cover_url
          ? String(
              data.cover_url
            )
          : null,
    },

    error:
      null,
  };
}

/* =========================================================
   SETTINGS SECTION
========================================================= */

export async function simpanPengaturanEbookSejarahAction(
  formData:
    FormData
) {
  await requireAdmin();

  const label =
    getString(
      formData,
      'ebook_label'
    );

  const judul =
    getString(
      formData,
      'ebook_judul'
    );

  const deskripsi =
    getString(
      formData,
      'ebook_deskripsi'
    );

  const emptyJudul =
    getString(
      formData,
      'ebook_empty_judul'
    );

  const emptyDeskripsi =
    getString(
      formData,
      'ebook_empty_deskripsi'
    );

  /* =======================================================
     VALIDATION
  ======================================================= */

  if (
    label.length <
    2
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Label section minimal 2 karakter.'
      )
    );
  }

  if (
    judul.length <
    3
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Judul section minimal 3 karakter.'
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
        'Deskripsi section minimal 10 karakter.'
      )
    );
  }

  if (
    emptyJudul.length <
    3
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Judul keadaan kosong minimal 3 karakter.'
      )
    );
  }

  if (
    emptyDeskripsi.length <
    10
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Deskripsi keadaan kosong minimal 10 karakter.'
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
        SETTINGS_TABLE
      )
      .upsert(
        {
          setting_key:
            SETTINGS_KEY,

          ebook_label:
            label,

          ebook_judul:
            judul,

          ebook_deskripsi:
            deskripsi,

          ebook_empty_judul:
            emptyJudul,

          ebook_empty_deskripsi:
            emptyDeskripsi,

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
      'Gagal menyimpan pengaturan Ebook Sejarah:',
      error
    );

    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidateEbook();

  redirect(
    buildAdminUrl(
      'success',
      'Pengaturan Ebook Sejarah berhasil disimpan.'
    )
  );
}

/* =========================================================
   TAMBAH EBOOK
========================================================= */

export async function tambahEbookSejarahAction(
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

  const penyusun =
    getString(
      formData,
      'penyusun'
    );

  const tahun =
    getOptionalInteger(
      formData,
      'tahun'
    );

  const jumlahHalaman =
    getOptionalInteger(
      formData,
      'jumlah_halaman'
    );

  const urutan =
    getInteger(
      formData,
      'urutan'
    );

  const aktif =
    getBoolean(
      formData,
      'aktif'
    );

  const cover =
    getFile(
      formData,
      'cover'
    );

  const pdf =
    getFile(
      formData,
      'file_pdf'
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
        'Judul ebook minimal 3 karakter.',
        'tambah-ebook-sejarah'
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
        'Deskripsi ebook minimal 10 karakter.',
        'tambah-ebook-sejarah'
      )
    );
  }

  if (
    penyusun.length <
    2
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Nama penyusun minimal 2 karakter.',
        'tambah-ebook-sejarah'
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
      buildAdminUrl(
        'error',
        'Tahun ebook tidak valid.',
        'tambah-ebook-sejarah'
      )
    );
  }

  if (
    jumlahHalaman !==
      null &&
    (
      !Number.isInteger(
        jumlahHalaman
      ) ||
      jumlahHalaman <
        1
    )
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Jumlah halaman harus minimal 1.',
        'tambah-ebook-sejarah'
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
        'Nomor urutan harus berupa angka bulat minimal 0.',
        'tambah-ebook-sejarah'
      )
    );
  }

  if (
    !pdf
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'File PDF ebook wajib dipilih.',
        'tambah-ebook-sejarah'
      )
    );
  }

  const pdfError =
    validatePdf(
      pdf
    );

  if (
    pdfError
  ) {
    redirect(
      buildAdminUrl(
        'error',
        pdfError,
        'tambah-ebook-sejarah'
      )
    );
  }

  if (
    cover
  ) {
    const coverError =
      validateCover(
        cover
      );

    if (
      coverError
    ) {
      redirect(
        buildAdminUrl(
          'error',
          coverError,
          'tambah-ebook-sejarah'
        )
      );
    }
  }

  /* =======================================================
     UPLOAD PDF
  ======================================================= */

  const pdfUpload =
    await uploadFile(
      pdf,
      'pdf',
      judul,
      'pdf'
    );

  if (
    pdfUpload.error ||
    !pdfUpload.path ||
    !pdfUpload.url
  ) {
    redirect(
      buildAdminUrl(
        'error',
        pdfUpload.error ??
          'PDF gagal diunggah.',
        'tambah-ebook-sejarah'
      )
    );
  }

  /* =======================================================
     UPLOAD COVER
  ======================================================= */

  let coverUpload:
    UploadResult | null =
    null;

  if (
    cover
  ) {
    const extension =
      getImageExtension(
        cover.type
      );

    if (
      !extension
    ) {
      await deleteFiles([
        pdfUpload.path,
      ]);

      redirect(
        buildAdminUrl(
          'error',
          'Format cover tidak didukung.',
          'tambah-ebook-sejarah'
        )
      );
    }

    coverUpload =
      await uploadFile(
        cover,
        'cover',
        judul,
        extension
      );

    if (
      coverUpload.error ||
      !coverUpload.path ||
      !coverUpload.url
    ) {
      await deleteFiles([
        pdfUpload.path,
      ]);

      redirect(
        buildAdminUrl(
          'error',
          coverUpload.error ??
            'Cover gagal diunggah.',
          'tambah-ebook-sejarah'
        )
      );
    }
  }

  /* =======================================================
     DATABASE
  ======================================================= */

  const now =
    new Date()
      .toISOString();

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        TABLE
      )
      .insert({
        jenis:
          JENIS_EBOOK,

        judul,

        deskripsi,

        penyusun,

        tahun,

        jumlah_halaman:
          jumlahHalaman,

        file_url:
          pdfUpload.url,

        file_path:
          pdfUpload.path,

        cover_url:
          coverUpload?.url ??
          null,

        cover_path:
          coverUpload?.path ??
          null,

        urutan,

        aktif,

        created_at:
          now,

        updated_at:
          now,
      });

  if (
    error
  ) {
    await deleteFiles([
      pdfUpload.path,
      coverUpload?.path,
    ]);

    console.error(
      'Gagal menambahkan Ebook Sejarah:',
      error
    );

    redirect(
      buildAdminUrl(
        'error',
        error.message,
        'tambah-ebook-sejarah'
      )
    );
  }

  revalidateEbook();

  redirect(
    buildAdminUrl(
      'success',
      'Ebook Sejarah berhasil ditambahkan.'
    )
  );
}

/* =========================================================
   UBAH EBOOK
========================================================= */

export async function ubahEbookSejarahAction(
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
        'ID ebook tidak valid.'
      )
    );
  }

  const ebookResult =
    await getEbookLama(
      id
    );

  if (
    ebookResult.error ||
    !ebookResult.data
  ) {
    redirect(
      buildAdminUrl(
        'error',
        ebookResult.error ??
          'Ebook tidak ditemukan.'
      )
    );
  }

  const lama =
    ebookResult.data;

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

  const penyusun =
    getString(
      formData,
      'penyusun'
    );

  const tahun =
    getOptionalInteger(
      formData,
      'tahun'
    );

  const jumlahHalaman =
    getOptionalInteger(
      formData,
      'jumlah_halaman'
    );

  const urutan =
    getInteger(
      formData,
      'urutan'
    );

  const aktif =
    getBoolean(
      formData,
      'aktif'
    );

  const pdfBaru =
    getFile(
      formData,
      'file_pdf'
    );

  const coverBaru =
    getFile(
      formData,
      'cover'
    );

  const hapusCover =
    getBoolean(
      formData,
      'hapus_cover'
    );

  /* =======================================================
     VALIDATION
  ======================================================= */

  if (
    judul.length <
    3 ||
    deskripsi.length <
      10 ||
    penyusun.length <
      2
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Judul, deskripsi, atau penyusun belum valid.'
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
      buildAdminUrl(
        'error',
        'Tahun ebook tidak valid.'
      )
    );
  }

  if (
    jumlahHalaman !==
      null &&
    (
      !Number.isInteger(
        jumlahHalaman
      ) ||
      jumlahHalaman <
        1
    )
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Jumlah halaman tidak valid.'
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
        'Nomor urutan tidak valid.'
      )
    );
  }

  if (
    pdfBaru
  ) {
    const pdfError =
      validatePdf(
        pdfBaru
      );

    if (
      pdfError
    ) {
      redirect(
        buildAdminUrl(
          'error',
          pdfError
        )
      );
    }
  }

  if (
    coverBaru
  ) {
    const coverError =
      validateCover(
        coverBaru
      );

    if (
      coverError
    ) {
      redirect(
        buildAdminUrl(
          'error',
          coverError
        )
      );
    }
  }

  /* =======================================================
     INITIAL
  ======================================================= */

  let fileUrl =
    lama.file_url;

  let filePath =
    lama.file_path;

  let coverUrl =
    lama.cover_url;

  let coverPath =
    lama.cover_path;

  let pdfUpload:
    UploadResult | null =
    null;

  let coverUpload:
    UploadResult | null =
    null;

  /* =======================================================
     NEW PDF
  ======================================================= */

  if (
    pdfBaru
  ) {
    pdfUpload =
      await uploadFile(
        pdfBaru,
        'pdf',
        judul,
        'pdf'
      );

    if (
      pdfUpload.error ||
      !pdfUpload.path ||
      !pdfUpload.url
    ) {
      redirect(
        buildAdminUrl(
          'error',
          pdfUpload.error ??
            'PDF baru gagal diunggah.'
        )
      );
    }

    fileUrl =
      pdfUpload.url;

    filePath =
      pdfUpload.path;
  }

  /* =======================================================
     NEW COVER
  ======================================================= */

  if (
    coverBaru
  ) {
    const extension =
      getImageExtension(
        coverBaru.type
      );

    if (
      !extension
    ) {
      await deleteFiles([
        pdfUpload?.path,
      ]);

      redirect(
        buildAdminUrl(
          'error',
          'Format cover tidak didukung.'
        )
      );
    }

    coverUpload =
      await uploadFile(
        coverBaru,
        'cover',
        judul,
        extension
      );

    if (
      coverUpload.error ||
      !coverUpload.path ||
      !coverUpload.url
    ) {
      await deleteFiles([
        pdfUpload?.path,
      ]);

      redirect(
        buildAdminUrl(
          'error',
          coverUpload.error ??
            'Cover baru gagal diunggah.'
        )
      );
    }

    coverUrl =
      coverUpload.url;

    coverPath =
      coverUpload.path;
  } else if (
    hapusCover
  ) {
    coverUrl =
      null;

    coverPath =
      null;
  }

  /* =======================================================
     UPDATE DATABASE
  ======================================================= */

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        TABLE
      )
      .update({
        judul,

        deskripsi,

        penyusun,

        tahun,

        jumlah_halaman:
          jumlahHalaman,

        file_url:
          fileUrl,

        file_path:
          filePath,

        cover_url:
          coverUrl,

        cover_path:
          coverPath,

        urutan,

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
        'jenis',
        JENIS_EBOOK
      );

  if (
    error
  ) {
    await deleteFiles([
      pdfUpload?.path,
      coverUpload?.path,
    ]);

    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  /* =======================================================
     DELETE OLD FILE
  ======================================================= */

  if (
    pdfUpload
  ) {
    await deleteFiles([
      lama.file_path,
    ]);
  }

  if (
    coverUpload ||
    hapusCover
  ) {
    await deleteFiles([
      lama.cover_path,
    ]);
  }

  revalidateEbook();

  redirect(
    buildAdminUrl(
      'success',
      'Ebook Sejarah berhasil diperbarui.'
    )
  );
}

/* =========================================================
   TOGGLE
========================================================= */

export async function toggleEbookSejarahAction(
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
        'ID ebook tidak valid.'
      )
    );
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        TABLE
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
        'jenis',
        JENIS_EBOOK
      );

  if (
    error
  ) {
    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidateEbook();

  redirect(
    buildAdminUrl(
      'success',
      aktif
        ? 'Ebook berhasil dipublikasikan.'
        : 'Ebook berhasil disembunyikan.'
    )
  );
}

/* =========================================================
   DELETE
========================================================= */

export async function hapusEbookSejarahAction(
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
        'ID ebook tidak valid.'
      )
    );
  }

  const ebookResult =
    await getEbookLama(
      id
    );

  if (
    ebookResult.error ||
    !ebookResult.data
  ) {
    redirect(
      buildAdminUrl(
        'error',
        ebookResult.error ??
          'Ebook tidak ditemukan.'
      )
    );
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        TABLE
      )
      .delete()
      .eq(
        'id',
        id
      )
      .eq(
        'jenis',
        JENIS_EBOOK
      );

  if (
    error
  ) {
    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  await deleteFiles([
    ebookResult.data
      .file_path,

    ebookResult.data
      .cover_path,
  ]);

  revalidateEbook();

  redirect(
    buildAdminUrl(
      'success',
      'Ebook Sejarah berhasil dihapus.'
    )
  );
}