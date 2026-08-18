// app/admin/produk-hukum/actions.ts

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
  JENIS_PRODUK_HUKUM,
} from '@/types/produk-hukum';

import type {
  JenisProdukHukum,
  ProdukHukumActionState,
} from '@/types/produk-hukum';

const BUCKET_NAME =
  'produk-hukum';

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

  const filename =
    file.name.toLowerCase();

  const validType =
    file.type ===
      'application/pdf' ||
    filename.endsWith('.pdf');

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
      'Tanggal penetapan tidak valid.'
    );
  }

  const [
    tahun,
    bulan,
    tanggal,
  ] = value
    .split('-')
    .map(Number);

  const date = new Date(
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
      'Tanggal penetapan tidak valid.'
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
      'Gagal menghapus dokumen produk hukum:',
      error.message
    );
  }
}

function revalidateProdukHukumPages() {
  revalidatePath('/admin');

  revalidatePath(
    '/admin/produk-hukum'
  );

  revalidatePath(
    '/informasi-publik'
  );

  revalidatePath(
    '/informasi-publik/produk-hukum'
  );
}

export async function createProdukHukumAction(
  _previousState:
    ProdukHukumActionState,
  formData: FormData
): Promise<ProdukHukumActionState> {
  await requireAdmin();

  let uploadedPath = '';

  try {
    const judul =
      getFormString(
        formData,
        'judul'
      );

    const nomor =
      getFormString(
        formData,
        'nomor'
      );

    const jenis =
      getFormString(
        formData,
        'jenis'
      ) as JenisProdukHukum;

    const tahunString =
      getFormString(
        formData,
        'tahun'
      );

    const tanggalPenetapan =
      validateTanggal(
        getFormString(
          formData,
          'tanggal_penetapan'
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
        'Judul produk hukum harus terdiri dari 5 sampai 300 karakter.'
      );
    }

    if (
      nomor.length > 100
    ) {
      throw new Error(
        'Nomor dokumen maksimal 100 karakter.'
      );
    }

    if (
      !JENIS_PRODUK_HUKUM.includes(
        jenis
      )
    ) {
      throw new Error(
        'Jenis produk hukum tidak valid.'
      );
    }

    const tahun =
      Number(tahunString);

    if (
      !Number.isInteger(tahun) ||
      tahun < 2000 ||
      tahun > 2100
    ) {
      throw new Error(
        'Tahun produk hukum tidak valid.'
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
      'produk-hukum';

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
      .from('produk_hukum')
      .insert({
        judul,

        nomor:
          nomor || null,

        jenis,
        tahun,

        tanggal_penetapan:
          tanggalPenetapan,

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
        `Data produk hukum gagal disimpan: ${insertError.message}`
      );
    }

    revalidateProdukHukumPages();

    return {
      error: null,
      success:
        'Produk hukum berhasil ditambahkan.',
    };
  } catch (error) {
    if (uploadedPath) {
      await removeStorageFile(
        uploadedPath
      );
    }

    console.error(
      'Create produk hukum error:',
      error
    );

    return {
      error:
        error instanceof Error
          ? error.message
          : 'Produk hukum gagal ditambahkan.',

      success: null,
    };
  }
}

export async function toggleProdukHukumAction(
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
      'ID produk hukum tidak valid.'
    );
  }

  const {
    data,
    error,
  } = await supabaseAdmin
    .from('produk_hukum')
    .update({
      aktif: !aktif,
    })
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) {
    throw new Error(
      `Status produk hukum gagal diperbarui: ${error.message}`
    );
  }

  if (!data) {
    throw new Error(
      'Produk hukum tidak ditemukan.'
    );
  }

  revalidateProdukHukumPages();
}

export async function deleteProdukHukumAction(
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
      'ID produk hukum tidak valid.'
    );
  }

  const {
    data,
    error: readError,
  } = await supabaseAdmin
    .from('produk_hukum')
    .select(`
      id,
      file_path
    `)
    .eq('id', id)
    .maybeSingle();

  if (readError) {
    throw new Error(
      `Produk hukum gagal diperiksa: ${readError.message}`
    );
  }

  if (!data) {
    throw new Error(
      'Produk hukum tidak ditemukan.'
    );
  }

  const {
    error: deleteError,
  } = await supabaseAdmin
    .from('produk_hukum')
    .delete()
    .eq('id', id);

  if (deleteError) {
    throw new Error(
      `Produk hukum gagal dihapus: ${deleteError.message}`
    );
  }

  await removeStorageFile(
    String(
      data.file_path ?? ''
    )
  );

  revalidateProdukHukumPages();
}