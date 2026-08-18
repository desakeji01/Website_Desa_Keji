// app/admin/informasi-umum/actions.ts

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

import {
  KATEGORI_INFORMASI_UMUM,
} from '@/types/informasi-umum';

import type {
  InformasiUmumActionState,
  KategoriInformasiUmum,
} from '@/types/informasi-umum';

const BUCKET_NAME =
  'informasi-umum';

const MAX_FILE_SIZE =
  10 * 1024 * 1024;

async function requireAdmin() {
  const supabase =
    await createClient();

  const {
    data: {
      user,
    },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return user;
}

function getFormString(
  formData: FormData,
  key: string
) {
  return String(
    formData.get(key) ?? ''
  ).trim();
}

function slugify(
  value: string
) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .replace(
      /[^a-z0-9]+/g,
      '-'
    )
    .replace(
      /^-+|-+$/g,
      ''
    )
    .slice(0, 120);
}

function validatePdf(
  file: File
) {
  if (
    !file ||
    file.size === 0
  ) {
    throw new Error(
      'Dokumen PDF wajib dipilih.'
    );
  }

  const fileName =
    file.name.toLowerCase();

  const validType =
    file.type ===
      'application/pdf' ||
    fileName.endsWith('.pdf');

  if (!validType) {
    throw new Error(
      'Dokumen harus berformat PDF.'
    );
  }

  if (
    file.size >
    MAX_FILE_SIZE
  ) {
    throw new Error(
      'Ukuran dokumen maksimal 10 MB.'
    );
  }
}

function validateTanggal(
  value: string
) {
  if (!value) {
    return null;
  }

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  ) {
    throw new Error(
      'Tanggal dokumen tidak valid.'
    );
  }

  const [
    tahun,
    bulan,
    tanggal,
  ] = value
    .split('-')
    .map(Number);

  const date =
    new Date(
      Date.UTC(
        tahun,
        bulan - 1,
        tanggal
      )
    );

  const valid =
    date.getUTCFullYear() ===
      tahun &&
    date.getUTCMonth() ===
      bulan - 1 &&
    date.getUTCDate() ===
      tanggal;

  if (!valid) {
    throw new Error(
      'Tanggal dokumen tidak valid.'
    );
  }

  return value;
}

async function removeStorageFile(
  path: string
) {
  if (!path) {
    return;
  }

  const {
    error,
  } = await supabaseAdmin
    .storage
    .from(BUCKET_NAME)
    .remove([path]);

  if (error) {
    console.error(
      'Dokumen informasi umum gagal dihapus:',
      {
        message:
          error.message,
      }
    );
  }
}

function revalidateInformasiUmumPages() {
  revalidatePath('/admin');

  revalidatePath(
    '/admin/informasi-umum'
  );

  revalidatePath(
    '/informasi-publik'
  );

  revalidatePath(
    '/informasi-publik/informasi-umum'
  );
}

export async function createInformasiUmumAction(
  _previousState:
    InformasiUmumActionState,
  formData: FormData
): Promise<InformasiUmumActionState> {
  await requireAdmin();

  let uploadedPath = '';

  try {
    const judul =
      getFormString(
        formData,
        'judul'
      );

    const kategori =
      getFormString(
        formData,
        'kategori'
      ) as KategoriInformasiUmum;

    const tahunValue =
      getFormString(
        formData,
        'tahun'
      );

    const tanggalDokumen =
      validateTanggal(
        getFormString(
          formData,
          'tanggal_dokumen'
        )
      );

    const deskripsi =
      getFormString(
        formData,
        'deskripsi'
      );

    const aktif =
      getFormString(
        formData,
        'aktif'
      ) === 'on';

    const fileValue =
      formData.get(
        'file_pdf'
      );

    if (
      judul.length < 5 ||
      judul.length > 300
    ) {
      throw new Error(
        'Judul informasi harus terdiri dari 5 sampai 300 karakter.'
      );
    }

    if (
      !KATEGORI_INFORMASI_UMUM.includes(
        kategori
      )
    ) {
      throw new Error(
        'Kategori informasi tidak valid.'
      );
    }

    const tahun =
      Number(tahunValue);

    if (
      !Number.isInteger(tahun) ||
      tahun < 2000 ||
      tahun > 2100
    ) {
      throw new Error(
        'Tahun informasi tidak valid.'
      );
    }

    if (
      deskripsi.length > 5000
    ) {
      throw new Error(
        'Deskripsi maksimal 5000 karakter.'
      );
    }

    if (
      !fileValue ||
      !(fileValue instanceof File)
    ) {
      throw new Error(
        'Dokumen PDF wajib dipilih.'
      );
    }

    validatePdf(fileValue);

    const fileSlug =
      slugify(judul) ||
      'informasi-umum';

    uploadedPath =
      `${tahun}/${fileSlug}-${randomUUID()}.pdf`;

    const buffer =
      Buffer.from(
        await fileValue.arrayBuffer()
      );

    const {
      error: uploadError,
    } = await supabaseAdmin
      .storage
      .from(BUCKET_NAME)
      .upload(
        uploadedPath,
        buffer,
        {
          contentType:
            'application/pdf',

          cacheControl:
            '3600',

          upsert: false,
        }
      );

    if (uploadError) {
      throw new Error(
        `Dokumen gagal diunggah: ${uploadError.message}`
      );
    }

    const {
      data: publicUrlData,
    } = supabaseAdmin
      .storage
      .from(BUCKET_NAME)
      .getPublicUrl(
        uploadedPath
      );

    const {
      error: insertError,
    } = await supabaseAdmin
      .from('informasi_umum')
      .insert({
        judul,
        kategori,
        tahun,

        tanggal_dokumen:
          tanggalDokumen,

        deskripsi:
          deskripsi || null,

        file_url:
          publicUrlData.publicUrl,

        file_path:
          uploadedPath,

        aktif,
      });

    if (insertError) {
      throw new Error(
        `Data informasi umum gagal disimpan: ${insertError.message}`
      );
    }

    revalidateInformasiUmumPages();

    return {
      error: null,
      success:
        'Informasi umum berhasil ditambahkan.',
    };
  } catch (error) {
    if (uploadedPath) {
      await removeStorageFile(
        uploadedPath
      );
    }

    console.error(
      'Create informasi umum error:',
      error
    );

    return {
      error:
        error instanceof Error
          ? error.message
          : 'Informasi umum gagal ditambahkan.',

      success: null,
    };
  }
}

export async function toggleInformasiUmumAction(
  formData: FormData
) {
  await requireAdmin();

  const id =
    getFormString(
      formData,
      'id'
    );

  const aktif =
    getFormString(
      formData,
      'aktif'
    ) === 'true';

  if (!id) {
    throw new Error(
      'ID informasi tidak valid.'
    );
  }

  const {
    data,
    error,
  } = await supabaseAdmin
    .from('informasi_umum')
    .update({
      aktif: !aktif,
    })
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) {
    throw new Error(
      `Status informasi gagal diperbarui: ${error.message}`
    );
  }

  if (!data) {
    throw new Error(
      'Informasi umum tidak ditemukan.'
    );
  }

  revalidateInformasiUmumPages();
}

export async function deleteInformasiUmumAction(
  formData: FormData
) {
  await requireAdmin();

  const id =
    getFormString(
      formData,
      'id'
    );

  if (!id) {
    throw new Error(
      'ID informasi tidak valid.'
    );
  }

  const {
    data,
    error: readError,
  } = await supabaseAdmin
    .from('informasi_umum')
    .select(`
      id,
      file_path
    `)
    .eq('id', id)
    .maybeSingle();

  if (readError) {
    throw new Error(
      `Informasi gagal diperiksa: ${readError.message}`
    );
  }

  if (!data) {
    throw new Error(
      'Informasi umum tidak ditemukan.'
    );
  }

  const {
    error: deleteError,
  } = await supabaseAdmin
    .from('informasi_umum')
    .delete()
    .eq('id', id);

  if (deleteError) {
    throw new Error(
      `Informasi umum gagal dihapus: ${deleteError.message}`
    );
  }

  await removeStorageFile(
    String(
      data.file_path ?? ''
    )
  );

  revalidateInformasiUmumPages();
}