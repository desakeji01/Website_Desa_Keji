// app/admin/desa-wisata/panduan-pelayanan/actions.ts

'use server';

import { randomUUID } from 'node:crypto';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const BUCKET_NAME = 'desa-wisata-dokumen';

const JENIS_DOKUMEN =
  'hospitality-pocket-book';

const ADMIN_PATH =
  '/admin/desa-wisata/panduan-pelayanan';

const PUBLIC_PATH =
  '/desa-wisata/panduan-pelayanan';

const MAX_PDF_SIZE =
  25 * 1024 * 1024;

const MAX_COVER_SIZE =
  5 * 1024 * 1024;

const PDF_MIME_TYPES = [
  'application/pdf',
] as const;

const COVER_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

interface DokumenInput {
  judul: string;
  deskripsi: string;
  penyusun: string;
  tahun: number | null;
  jumlahHalaman: number | null;
  urutan: number;
  aktif: boolean;
}

interface DokumenLama {
  id: string;
  file_path: string;
  file_url: string;
  cover_path: string | null;
  cover_url: string | null;
}

interface HasilUpload {
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

  return user;
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

  return slug || 'dokumen';
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

function validatePdf(
  file: File
) {
  if (
    !PDF_MIME_TYPES.includes(
      file.type as
        (typeof PDF_MIME_TYPES)[number]
    )
  ) {
    return 'File buku harus berformat PDF.';
  }

  if (file.size > MAX_PDF_SIZE) {
    return 'Ukuran file PDF maksimal 25 MB.';
  }

  return null;
}

function validateCover(
  file: File
) {
  if (
    !COVER_MIME_TYPES.includes(
      file.type as
        (typeof COVER_MIME_TYPES)[number]
    )
  ) {
    return 'Cover harus berformat JPG, PNG, atau WebP.';
  }

  if (file.size > MAX_COVER_SIZE) {
    return 'Ukuran cover maksimal 5 MB.';
  }

  return null;
}

function parseDokumenInput(
  formData: FormData
): DokumenInput {
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

function validateDokumenInput(
  input: DokumenInput
) {
  if (input.judul.length < 5) {
    return 'Judul buku minimal terdiri dari 5 karakter.';
  }

  if (
    input.deskripsi.length < 10
  ) {
    return 'Deskripsi buku minimal terdiri dari 10 karakter.';
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
    return 'Tahun harus berada pada rentang 1900 sampai 2200.';
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
  section = 'daftar-buku'
) {
  const params =
    new URLSearchParams({
      [type]: message,
    });

  return `${ADMIN_PATH}?${params.toString()}#${section}`;
}

function revalidatePanduanPelayanan() {
  revalidatePath(ADMIN_PATH);
  revalidatePath(PUBLIC_PATH);
  revalidatePath('/desa-wisata');
  revalidatePath('/admin');
}

async function hapusFileStorage(
  paths: Array<
    string | null | undefined
  >
) {
  const daftarPath = [
    ...new Set(
      paths.filter(
        (
          path
        ): path is string =>
          Boolean(path)
      )
    ),
  ];

  if (daftarPath.length === 0) {
    return;
  }

  const { error } =
    await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove(daftarPath);

  if (error) {
    console.error(
      'Gagal menghapus file Storage:',
      {
        message: error.message,
        paths: daftarPath,
      }
    );
  }
}

async function uploadPdf(
  file: File,
  slug: string
): Promise<HasilUpload> {
  const path =
    `${JENIS_DOKUMEN}/${slug}/` +
    `${Date.now()}-${randomUUID()}.pdf`;

  const arrayBuffer =
    await file.arrayBuffer();

  const { error } =
    await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(
        path,
        Buffer.from(arrayBuffer),
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
): Promise<HasilUpload> {
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

  const arrayBuffer =
    await file.arrayBuffer();

  const { error } =
    await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(
        path,
        Buffer.from(arrayBuffer),
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

async function getDokumenLama(
  id: string
): Promise<{
  data: DokumenLama | null;
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
        'Hospitality Pocket Book tidak ditemukan.',
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

export async function tambahPanduanPelayananAction(
  formData: FormData
) {
  await requireAdmin();

  const input =
    parseDokumenInput(
      formData
    );

  const validationError =
    validateDokumenInput(input);

  if (validationError) {
    redirect(
      buildAdminUrl(
        'error',
        validationError,
        'tambah-buku'
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
        'File PDF Hospitality Pocket Book wajib dipilih.',
        'tambah-buku'
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
        'tambah-buku'
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
          'tambah-buku'
        )
      );
    }
  }

  const slug =
    buildSlug(
      input.judul,
      input.tahun
    );

  const hasilPdf =
    await uploadPdf(
      filePdf,
      slug
    );

  if (
    hasilPdf.error ||
    !hasilPdf.path ||
    !hasilPdf.url
  ) {
    redirect(
      buildAdminUrl(
        'error',
        hasilPdf.error ??
          'File PDF gagal diunggah.',
        'tambah-buku'
      )
    );
  }

  let hasilCover:
    HasilUpload | null = null;

  if (cover) {
    hasilCover =
      await uploadCover(
        cover,
        slug
      );

    if (
      hasilCover.error ||
      !hasilCover.path ||
      !hasilCover.url
    ) {
      await hapusFileStorage([
        hasilPdf.path,
      ]);

      redirect(
        buildAdminUrl(
          'error',
          hasilCover.error ??
            'Cover gagal diunggah.',
          'tambah-buku'
        )
      );
    }
  }

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
          hasilPdf.url,

        file_path:
          hasilPdf.path,

        cover_url:
          hasilCover?.url ?? null,

        cover_path:
          hasilCover?.path ?? null,

        urutan: input.urutan,
        aktif: input.aktif,

        created_at:
          new Date().toISOString(),

        updated_at:
          new Date().toISOString(),
      });

  if (error) {
    await hapusFileStorage([
      hasilPdf.path,
      hasilCover?.path,
    ]);

    console.error(
      'Gagal menambahkan Hospitality Pocket Book:',
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
          ? 'Judul dan tahun buku tersebut sudah digunakan.'
          : error.message,
        'tambah-buku'
      )
    );
  }

  revalidatePanduanPelayanan();

  redirect(
    buildAdminUrl(
      'success',
      'Hospitality Pocket Book berhasil ditambahkan.'
    )
  );
}

export async function ubahPanduanPelayananAction(
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
        'ID buku tidak valid.'
      )
    );
  }

  const dokumenLamaResult =
    await getDokumenLama(id);

  if (
    dokumenLamaResult.error ||
    !dokumenLamaResult.data
  ) {
    redirect(
      buildAdminUrl(
        'error',
        dokumenLamaResult.error ??
          'Hospitality Pocket Book tidak ditemukan.'
      )
    );
  }

  const dokumenLama =
    dokumenLamaResult.data;

  const input =
    parseDokumenInput(
      formData
    );

  const validationError =
    validateDokumenInput(input);

  if (validationError) {
    redirect(
      buildAdminUrl(
        'error',
        validationError
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
      validatePdf(filePdfBaru);

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
      validateCover(coverBaru);

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
    dokumenLama.file_path;

  let fileUrl =
    dokumenLama.file_url;

  let coverPath =
    dokumenLama.cover_path;

  let coverUrl =
    dokumenLama.cover_url;

  let hasilPdfBaru:
    HasilUpload | null = null;

  let hasilCoverBaru:
    HasilUpload | null = null;

  if (filePdfBaru) {
    hasilPdfBaru =
      await uploadPdf(
        filePdfBaru,
        slug
      );

    if (
      hasilPdfBaru.error ||
      !hasilPdfBaru.path ||
      !hasilPdfBaru.url
    ) {
      redirect(
        buildAdminUrl(
          'error',
          hasilPdfBaru.error ??
            'File PDF baru gagal diunggah.'
        )
      );
    }

    filePath =
      hasilPdfBaru.path;

    fileUrl =
      hasilPdfBaru.url;
  }

  if (coverBaru) {
    hasilCoverBaru =
      await uploadCover(
        coverBaru,
        slug
      );

    if (
      hasilCoverBaru.error ||
      !hasilCoverBaru.path ||
      !hasilCoverBaru.url
    ) {
      await hapusFileStorage([
        hasilPdfBaru?.path,
      ]);

      redirect(
        buildAdminUrl(
          'error',
          hasilCoverBaru.error ??
            'Cover baru gagal diunggah.'
        )
      );
    }

    coverPath =
      hasilCoverBaru.path;

    coverUrl =
      hasilCoverBaru.url;
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
    await hapusFileStorage([
      hasilPdfBaru?.path,
      hasilCoverBaru?.path,
    ]);

    console.error(
      'Gagal memperbarui Hospitality Pocket Book:',
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
          ? 'Judul dan tahun buku tersebut sudah digunakan.'
          : error.message
      )
    );
  }

  const fileLamaYangDihapus:
    Array<
      string | null | undefined
    > = [];

  if (
    hasilPdfBaru &&
    dokumenLama.file_path !==
      hasilPdfBaru.path
  ) {
    fileLamaYangDihapus.push(
      dokumenLama.file_path
    );
  }

  if (
    hasilCoverBaru &&
    dokumenLama.cover_path !==
      hasilCoverBaru.path
  ) {
    fileLamaYangDihapus.push(
      dokumenLama.cover_path
    );
  } else if (
    hapusCover &&
    !coverBaru
  ) {
    fileLamaYangDihapus.push(
      dokumenLama.cover_path
    );
  }

  await hapusFileStorage(
    fileLamaYangDihapus
  );

  revalidatePanduanPelayanan();

  redirect(
    buildAdminUrl(
      'success',
      'Hospitality Pocket Book berhasil diperbarui.'
    )
  );
}

export async function togglePanduanPelayananAction(
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
        'ID buku tidak valid.'
      )
    );
  }

  const { data, error: cekError } =
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

  if (cekError || !data) {
    redirect(
      buildAdminUrl(
        'error',
        cekError?.message ??
          'Hospitality Pocket Book tidak ditemukan.'
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

  revalidatePanduanPelayanan();

  redirect(
    buildAdminUrl(
      'success',
      aktif
        ? 'Buku berhasil dipublikasikan.'
        : 'Buku berhasil disembunyikan.'
    )
  );
}

export async function hapusPanduanPelayananAction(
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
        'ID buku tidak valid.'
      )
    );
  }

  const dokumenLamaResult =
    await getDokumenLama(id);

  if (
    dokumenLamaResult.error ||
    !dokumenLamaResult.data
  ) {
    redirect(
      buildAdminUrl(
        'error',
        dokumenLamaResult.error ??
          'Hospitality Pocket Book tidak ditemukan.'
      )
    );
  }

  const dokumenLama =
    dokumenLamaResult.data;

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

  await hapusFileStorage([
    dokumenLama.file_path,
    dokumenLama.cover_path,
  ]);

  revalidatePanduanPelayanan();

  redirect(
    buildAdminUrl(
      'success',
      'Hospitality Pocket Book berhasil dihapus.'
    )
  );
}