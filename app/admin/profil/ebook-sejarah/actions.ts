// app/admin/profil/ebook-sejarah/actions.ts

'use server';

import { randomUUID } from 'node:crypto';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const BUCKET_NAME = 'desa-wisata-dokumen';
const JENIS_DOKUMEN = 'ebook-sejarah';

const ADMIN_PATH =
  '/admin/profil/ebook-sejarah';

const PUBLIC_PATH =
  '/profil/sejarah';

const MAX_PDF_SIZE =
  25 * 1024 * 1024;

const MAX_COVER_SIZE =
  5 * 1024 * 1024;

const PDF_TYPES = [
  'application/pdf',
] as const;

const COVER_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

interface EbookInput {
  judul: string;
  deskripsi: string;
  penyusun: string;
  tahun: number | null;
  jumlahHalaman: number | null;
  urutan: number;
  aktif: boolean;
}

interface EbookLama {
  id: string;
  file_path: string;
  file_url: string;
  cover_path: string | null;
  cover_url: string | null;
}

interface UploadResult {
  path: string;
  url: string;
  error: string | null;
}

async function requireAdmin() {
  const supabase =
    await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }
}

function getString(
  formData: FormData,
  key: string
) {
  return String(
    formData.get(key) ?? ''
  ).trim();
}

function getBoolean(
  formData: FormData,
  key: string
) {
  return (
    getString(formData, key) ===
    'true'
  );
}

function getInteger(
  formData: FormData,
  key: string
) {
  return Number(
    getString(formData, key)
  );
}

function getOptionalInteger(
  formData: FormData,
  key: string
) {
  const value =
    getString(formData, key);

  if (!value) {
    return null;
  }

  return Number(value);
}

function getFile(
  formData: FormData,
  key: string
): File | null {
  const value =
    formData.get(key);

  if (
    !(value instanceof File) ||
    value.size === 0
  ) {
    return null;
  }

  return value;
}

function slugify(value: string) {
  const slug = value
    .normalize('NFKD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

  return slug || 'ebook-sejarah';
}

function buildSlug(
  judul: string,
  tahun: number | null
) {
  return slugify(
    tahun
      ? `${judul}-${tahun}`
      : judul
  );
}

function getCoverExtension(
  mimeType: string
) {
  switch (mimeType) {
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

function validatePdf(file: File) {
  if (
    !PDF_TYPES.includes(
      file.type as
        (typeof PDF_TYPES)[number]
    )
  ) {
    return 'File ebook harus berformat PDF.';
  }

  if (file.size > MAX_PDF_SIZE) {
    return 'Ukuran file PDF maksimal 25 MB.';
  }

  return null;
}

function validateCover(file: File) {
  if (
    !COVER_TYPES.includes(
      file.type as
        (typeof COVER_TYPES)[number]
    )
  ) {
    return 'Cover harus berformat JPG, PNG, atau WebP.';
  }

  if (file.size > MAX_COVER_SIZE) {
    return 'Ukuran cover maksimal 5 MB.';
  }

  return null;
}

function parseInput(
  formData: FormData
): EbookInput {
  return {
    judul: getString(
      formData,
      'judul'
    ),

    deskripsi: getString(
      formData,
      'deskripsi'
    ),

    penyusun: getString(
      formData,
      'penyusun'
    ),

    tahun: getOptionalInteger(
      formData,
      'tahun'
    ),

    jumlahHalaman:
      getOptionalInteger(
        formData,
        'jumlah_halaman'
      ),

    urutan: getInteger(
      formData,
      'urutan'
    ),

    aktif: getBoolean(
      formData,
      'aktif'
    ),
  };
}

function validateInput(
  input: EbookInput
) {
  if (input.judul.length < 5) {
    return 'Judul ebook minimal terdiri dari 5 karakter.';
  }

  if (
    input.deskripsi.length < 10
  ) {
    return 'Deskripsi ebook minimal terdiri dari 10 karakter.';
  }

  if (
    input.penyusun.length < 2
  ) {
    return 'Nama penyusun minimal terdiri dari 2 karakter.';
  }

  if (
    input.tahun !== null &&
    (
      !Number.isInteger(
        input.tahun
      ) ||
      input.tahun < 1900 ||
      input.tahun > 2200
    )
  ) {
    return 'Tahun terbit harus berada pada rentang 1900 sampai 2200.';
  }

  if (
    input.jumlahHalaman !== null &&
    (
      !Number.isInteger(
        input.jumlahHalaman
      ) ||
      input.jumlahHalaman < 1
    )
  ) {
    return 'Jumlah halaman minimal 1.';
  }

  if (
    !Number.isInteger(
      input.urutan
    ) ||
    input.urutan < 0
  ) {
    return 'Nomor urutan harus berupa bilangan bulat minimal 0.';
  }

  return null;
}

function buildAdminUrl(
  type: 'success' | 'error',
  message: string,
  section = 'daftar-ebook'
) {
  const params =
    new URLSearchParams({
      [type]: message,
    });

  return `${ADMIN_PATH}?${params.toString()}#${section}`;
}

function revalidateEbookSejarah() {
  revalidatePath(ADMIN_PATH);
  revalidatePath(PUBLIC_PATH);
  revalidatePath('/profil/tilik-arkeji');
  revalidatePath('/admin');
}

async function deleteStorageFiles(
  paths: Array<
    string | null | undefined
  >
) {
  const cleanPaths = [
    ...new Set(
      paths.filter(
        (
          path
        ): path is string =>
          Boolean(path)
      )
    ),
  ];

  if (cleanPaths.length === 0) {
    return;
  }

  const { error } =
    await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove(cleanPaths);

  if (error) {
    console.error(
      'Gagal menghapus file ebook:',
      {
        message: error.message,
        paths: cleanPaths,
      }
    );
  }
}

async function uploadPdf(
  file: File,
  slug: string
): Promise<UploadResult> {
  const path =
    `${JENIS_DOKUMEN}/${slug}/` +
    `${Date.now()}-${randomUUID()}.pdf`;

  const fileBuffer =
    new Uint8Array(
      await file.arrayBuffer()
    );

  const { error } =
    await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(
        path,
        fileBuffer,
        {
          contentType:
            'application/pdf',

          cacheControl: '3600',
          upsert: false,
        }
      );

  if (error) {
    return {
      path: '',
      url: '',
      error: error.message,
    };
  }

  const { data } =
    supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);

  return {
    path,
    url: data.publicUrl,
    error: null,
  };
}

async function uploadCover(
  file: File,
  slug: string
): Promise<UploadResult> {
  const extension =
    getCoverExtension(
      file.type
    );

  if (!extension) {
    return {
      path: '',
      url: '',
      error:
        'Format cover tidak didukung.',
    };
  }

  const path =
    `${JENIS_DOKUMEN}/${slug}/` +
    `${Date.now()}-${randomUUID()}.${extension}`;

  const fileBuffer =
    new Uint8Array(
      await file.arrayBuffer()
    );

  const { error } =
    await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(
        path,
        fileBuffer,
        {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false,
        }
      );

  if (error) {
    return {
      path: '',
      url: '',
      error: error.message,
    };
  }

  const { data } =
    supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);

  return {
    path,
    url: data.publicUrl,
    error: null,
  };
}

async function getEbookLama(
  id: string
): Promise<{
  data: EbookLama | null;
  error: string | null;
}> {
  const { data, error } =
    await supabaseAdmin
      .from(
        'desa_wisata_dokumen'
      )
      .select(`
        id,
        file_path,
        file_url,
        cover_path,
        cover_url
      `)
      .eq('id', id)
      .eq(
        'jenis',
        JENIS_DOKUMEN
      )
      .maybeSingle();

  if (error) {
    return {
      data: null,
      error: error.message,
    };
  }

  if (!data) {
    return {
      data: null,
      error:
        'Ebook sejarah tidak ditemukan.',
    };
  }

  return {
    data: {
      id: String(data.id),

      file_path:
        String(
          data.file_path ?? ''
        ),

      file_url:
        String(
          data.file_url ?? ''
        ),

      cover_path:
        data.cover_path
          ? String(data.cover_path)
          : null,

      cover_url:
        data.cover_url
          ? String(data.cover_url)
          : null,
    },

    error: null,
  };
}

export async function tambahEbookSejarahAction(
  formData: FormData
) {
  await requireAdmin();

  const input =
    parseInput(formData);

  const inputError =
    validateInput(input);

  if (inputError) {
    redirect(
      buildAdminUrl(
        'error',
        inputError,
        'tambah-ebook'
      )
    );
  }

  const filePdf =
    getFile(
      formData,
      'file_pdf'
    );

  if (!filePdf) {
    redirect(
      buildAdminUrl(
        'error',
        'File PDF ebook sejarah wajib dipilih.',
        'tambah-ebook'
      )
    );
  }

  const pdfError =
    validatePdf(filePdf);

  if (pdfError) {
    redirect(
      buildAdminUrl(
        'error',
        pdfError,
        'tambah-ebook'
      )
    );
  }

  const cover =
    getFile(
      formData,
      'cover'
    );

  if (cover) {
    const coverError =
      validateCover(cover);

    if (coverError) {
      redirect(
        buildAdminUrl(
          'error',
          coverError,
          'tambah-ebook'
        )
      );
    }
  }

  const slug =
    buildSlug(
      input.judul,
      input.tahun
    );

  const uploadedPdf =
    await uploadPdf(
      filePdf,
      slug
    );

  if (
    uploadedPdf.error ||
    !uploadedPdf.path ||
    !uploadedPdf.url
  ) {
    redirect(
      buildAdminUrl(
        'error',
        uploadedPdf.error ??
          'File PDF gagal diunggah.',
        'tambah-ebook'
      )
    );
  }

  let uploadedCover:
    UploadResult | null = null;

  if (cover) {
    uploadedCover =
      await uploadCover(
        cover,
        slug
      );

    if (
      uploadedCover.error ||
      !uploadedCover.path ||
      !uploadedCover.url
    ) {
      await deleteStorageFiles([
        uploadedPdf.path,
      ]);

      redirect(
        buildAdminUrl(
          'error',
          uploadedCover.error ??
            'Cover gagal diunggah.',
          'tambah-ebook'
        )
      );
    }
  }

  const now =
    new Date().toISOString();

  const { error } =
    await supabaseAdmin
      .from(
        'desa_wisata_dokumen'
      )
      .insert({
        jenis:
          JENIS_DOKUMEN,

        judul: input.judul,
        slug,

        deskripsi:
          input.deskripsi,

        penyusun:
          input.penyusun,

        tahun: input.tahun,

        jumlah_halaman:
          input.jumlahHalaman,

        file_url:
          uploadedPdf.url,

        file_path:
          uploadedPdf.path,

        cover_url:
          uploadedCover?.url ??
          null,

        cover_path:
          uploadedCover?.path ??
          null,

        urutan: input.urutan,
        aktif: input.aktif,

        created_at: now,
        updated_at: now,
      });

  if (error) {
    await deleteStorageFiles([
      uploadedPdf.path,
      uploadedCover?.path,
    ]);

    console.error(
      'Gagal menambahkan ebook sejarah:',
      {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }
    );

    redirect(
      buildAdminUrl(
        'error',
        error.code === '23505'
          ? 'Judul dan tahun ebook tersebut sudah digunakan.'
          : error.message,
        'tambah-ebook'
      )
    );
  }

  revalidateEbookSejarah();

  redirect(
    buildAdminUrl(
      'success',
      'Ebook sejarah berhasil ditambahkan.'
    )
  );
}

export async function ubahEbookSejarahAction(
  formData: FormData
) {
  await requireAdmin();

  const id =
    getString(
      formData,
      'id'
    );

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID ebook tidak valid.'
      )
    );
  }

  const ebookLamaResult =
    await getEbookLama(id);

  if (
    ebookLamaResult.error ||
    !ebookLamaResult.data
  ) {
    redirect(
      buildAdminUrl(
        'error',
        ebookLamaResult.error ??
          'Ebook sejarah tidak ditemukan.'
      )
    );
  }

  const ebookLama =
    ebookLamaResult.data;

  const input =
    parseInput(formData);

  const inputError =
    validateInput(input);

  if (inputError) {
    redirect(
      buildAdminUrl(
        'error',
        inputError
      )
    );
  }

  const filePdfBaru =
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

  if (filePdfBaru) {
    const pdfError =
      validatePdf(
        filePdfBaru
      );

    if (pdfError) {
      redirect(
        buildAdminUrl(
          'error',
          pdfError
        )
      );
    }
  }

  if (coverBaru) {
    const coverError =
      validateCover(
        coverBaru
      );

    if (coverError) {
      redirect(
        buildAdminUrl(
          'error',
          coverError
        )
      );
    }
  }

  const slug =
    buildSlug(
      input.judul,
      input.tahun
    );

  let filePath =
    ebookLama.file_path;

  let fileUrl =
    ebookLama.file_url;

  let coverPath =
    ebookLama.cover_path;

  let coverUrl =
    ebookLama.cover_url;

  let uploadedPdf:
    UploadResult | null = null;

  let uploadedCover:
    UploadResult | null = null;

  if (filePdfBaru) {
    uploadedPdf =
      await uploadPdf(
        filePdfBaru,
        slug
      );

    if (
      uploadedPdf.error ||
      !uploadedPdf.path ||
      !uploadedPdf.url
    ) {
      redirect(
        buildAdminUrl(
          'error',
          uploadedPdf.error ??
            'File PDF baru gagal diunggah.'
        )
      );
    }

    filePath =
      uploadedPdf.path;

    fileUrl =
      uploadedPdf.url;
  }

  if (coverBaru) {
    uploadedCover =
      await uploadCover(
        coverBaru,
        slug
      );

    if (
      uploadedCover.error ||
      !uploadedCover.path ||
      !uploadedCover.url
    ) {
      await deleteStorageFiles([
        uploadedPdf?.path,
      ]);

      redirect(
        buildAdminUrl(
          'error',
          uploadedCover.error ??
            'Cover baru gagal diunggah.'
        )
      );
    }

    coverPath =
      uploadedCover.path;

    coverUrl =
      uploadedCover.url;
  } else if (hapusCover) {
    coverPath = null;
    coverUrl = null;
  }

  const { error } =
    await supabaseAdmin
      .from(
        'desa_wisata_dokumen'
      )
      .update({
        judul: input.judul,
        slug,

        deskripsi:
          input.deskripsi,

        penyusun:
          input.penyusun,

        tahun: input.tahun,

        jumlah_halaman:
          input.jumlahHalaman,

        file_url: fileUrl,
        file_path: filePath,

        cover_url: coverUrl,
        cover_path: coverPath,

        urutan: input.urutan,
        aktif: input.aktif,

        updated_at:
          new Date().toISOString(),
      })
      .eq('id', id)
      .eq(
        'jenis',
        JENIS_DOKUMEN
      );

  if (error) {
    await deleteStorageFiles([
      uploadedPdf?.path,
      uploadedCover?.path,
    ]);

    console.error(
      'Gagal memperbarui ebook sejarah:',
      {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }
    );

    redirect(
      buildAdminUrl(
        'error',
        error.code === '23505'
          ? 'Judul dan tahun ebook tersebut sudah digunakan.'
          : error.message
      )
    );
  }

  const oldFilesToDelete:
    Array<
      string | null | undefined
    > = [];

  if (uploadedPdf) {
    oldFilesToDelete.push(
      ebookLama.file_path
    );
  }

  if (uploadedCover) {
    oldFilesToDelete.push(
      ebookLama.cover_path
    );
  } else if (hapusCover) {
    oldFilesToDelete.push(
      ebookLama.cover_path
    );
  }

  await deleteStorageFiles(
    oldFilesToDelete
  );

  revalidateEbookSejarah();

  redirect(
    buildAdminUrl(
      'success',
      'Ebook sejarah berhasil diperbarui.'
    )
  );
}

export async function toggleEbookSejarahAction(
  formData: FormData
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

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID ebook tidak valid.'
      )
    );
  }

  const { data, error: checkError } =
    await supabaseAdmin
      .from(
        'desa_wisata_dokumen'
      )
      .select('id')
      .eq('id', id)
      .eq(
        'jenis',
        JENIS_DOKUMEN
      )
      .maybeSingle();

  if (checkError || !data) {
    redirect(
      buildAdminUrl(
        'error',
        checkError?.message ??
          'Ebook sejarah tidak ditemukan.'
      )
    );
  }

  const { error } =
    await supabaseAdmin
      .from(
        'desa_wisata_dokumen'
      )
      .update({
        aktif,

        updated_at:
          new Date().toISOString(),
      })
      .eq('id', id)
      .eq(
        'jenis',
        JENIS_DOKUMEN
      );

  if (error) {
    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidateEbookSejarah();

  redirect(
    buildAdminUrl(
      'success',
      aktif
        ? 'Ebook berhasil dipublikasikan.'
        : 'Ebook berhasil disembunyikan.'
    )
  );
}

export async function hapusEbookSejarahAction(
  formData: FormData
) {
  await requireAdmin();

  const id =
    getString(
      formData,
      'id'
    );

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID ebook tidak valid.'
      )
    );
  }

  const ebookLamaResult =
    await getEbookLama(id);

  if (
    ebookLamaResult.error ||
    !ebookLamaResult.data
  ) {
    redirect(
      buildAdminUrl(
        'error',
        ebookLamaResult.error ??
          'Ebook sejarah tidak ditemukan.'
      )
    );
  }

  const ebookLama =
    ebookLamaResult.data;

  const { error } =
    await supabaseAdmin
      .from(
        'desa_wisata_dokumen'
      )
      .delete()
      .eq('id', id)
      .eq(
        'jenis',
        JENIS_DOKUMEN
      );

  if (error) {
    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  await deleteStorageFiles([
    ebookLama.file_path,
    ebookLama.cover_path,
  ]);

  revalidateEbookSejarah();

  redirect(
    buildAdminUrl(
      'success',
      'Ebook sejarah berhasil dihapus.'
    )
  );
}