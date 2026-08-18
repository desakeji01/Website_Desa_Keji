// app/admin/berita/actions.ts

'use server';

import { randomUUID } from 'node:crypto';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

import type {
  BeritaActionState,
  KategoriBerita,
  StatusBerita,
} from '@/types/berita';

const BUCKET_NAME = 'berita';

const MAX_IMAGE_SIZE_BYTES =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

const ALLOWED_CATEGORIES: KategoriBerita[] = [
  'Berita Desa',
  'PPID',
  'Laporan Anggaran',
];

/**
 * Memastikan pengguna yang menjalankan
 * Server Action sudah login.
 */
async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return user;
}

/**
 * Mengambil nilai string dari FormData.
 */
function getFormString(
  formData: FormData,
  key: string
) {
  return String(
    formData.get(key) ?? ''
  ).trim();
}

/**
 * Membuat slug URL dari judul berita.
 */
function createSlug(value: string) {
  return value
    .normalize('NFKD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

/**
 * Mencari slug yang belum digunakan.
 */
async function getUniqueSlug(
  judul: string,
  excludeId?: number
) {
  const baseSlug =
    createSlug(judul) ||
    `berita-${Date.now()}`;

  let candidate = baseSlug;
  let counter = 2;

  while (true) {
    let query = supabaseAdmin
      .from('berita')
      .select('id')
      .eq('slug', candidate)
      .limit(1);

    if (excludeId !== undefined) {
      query = query.neq(
        'id',
        excludeId
      );
    }

    const {
      data,
      error,
    } = await query;

    if (error) {
      throw new Error(
        `Gagal memeriksa slug berita: ${error.message}`
      );
    }

    if (!data || data.length === 0) {
      return candidate;
    }

    candidate =
      `${baseSlug}-${counter}`;

    counter += 1;
  }
}

/**
 * Validasi seluruh kolom teks berita.
 */
function validateFields(
  judul: string,
  kategori: string,
  kutipan: string,
  konten: string,
  penulis: string,
  status: string
) {
  if (judul.length < 5) {
    throw new Error(
      'Judul minimal terdiri dari 5 karakter.'
    );
  }

  if (judul.length > 200) {
    throw new Error(
      'Judul maksimal terdiri dari 200 karakter.'
    );
  }

  if (
    !ALLOWED_CATEGORIES.includes(
      kategori as KategoriBerita
    )
  ) {
    throw new Error(
      'Kategori berita tidak valid.'
    );
  }

  if (kutipan.length < 20) {
    throw new Error(
      'Ringkasan minimal terdiri dari 20 karakter.'
    );
  }

  if (kutipan.length > 500) {
    throw new Error(
      'Ringkasan maksimal terdiri dari 500 karakter.'
    );
  }

  if (konten.length < 50) {
    throw new Error(
      'Isi berita minimal terdiri dari 50 karakter.'
    );
  }

  if (!penulis) {
    throw new Error(
      'Nama penulis wajib diisi.'
    );
  }

  if (penulis.length > 100) {
    throw new Error(
      'Nama penulis maksimal 100 karakter.'
    );
  }

  if (
    status !== 'draft' &&
    status !== 'published'
  ) {
    throw new Error(
      'Status berita tidak valid.'
    );
  }
}

/**
 * Validasi gambar sebelum diunggah.
 */
function validateImageFile(
  file: File
) {
  if (file.size <= 0) {
    throw new Error(
      'File gambar tidak valid.'
    );
  }

  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as
        | 'image/jpeg'
        | 'image/png'
        | 'image/webp'
    )
  ) {
    throw new Error(
      'Gambar hanya boleh menggunakan format JPG, PNG, atau WEBP.'
    );
  }

  if (
    file.size >
    MAX_IMAGE_SIZE_BYTES
  ) {
    throw new Error(
      'Ukuran gambar maksimal 5 MB.'
    );
  }
}

/**
 * Menentukan ekstensi berdasarkan MIME type.
 */
function getImageExtension(
  mimeType: string
) {
  switch (mimeType) {
    case 'image/png':
      return 'png';

    case 'image/webp':
      return 'webp';

    case 'image/jpeg':
    default:
      return 'jpg';
  }
}

/**
 * Mengunggah gambar ke Supabase Storage.
 */
async function uploadGambar(
  file: File
) {
  validateImageFile(file);

  const extension =
    getImageExtension(file.type);

  const currentYear =
    new Date().getFullYear();

  const path =
    `${currentYear}/${randomUUID()}.${extension}`;

  const fileBytes =
    await file.arrayBuffer();

  const {
    error: uploadError,
  } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(path, fileBytes, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(
      `Gagal mengunggah gambar: ${uploadError.message}`
    );
  }

  const {
    data: publicUrlData,
  } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  if (!publicUrlData.publicUrl) {
    await removeGambar(path);

    throw new Error(
      'URL gambar tidak berhasil dibuat.'
    );
  }

  return {
    path,
    publicUrl:
      publicUrlData.publicUrl,
  };
}

/**
 * Menghapus gambar dari Storage.
 */
async function removeGambar(
  path?: string | null
) {
  if (!path) {
    return;
  }

  const {
    error,
  } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .remove([path]);

  if (error) {
    console.error(
      'Gagal menghapus gambar:',
      error.message
    );
  }
}

/**
 * Memperbarui cache semua halaman berita.
 */
function revalidateBeritaPages(
  slug?: string
) {
  revalidatePath('/');
  revalidatePath('/berita');
  revalidatePath('/admin');
  revalidatePath('/admin/berita');

  if (slug) {
    revalidatePath(
      `/berita/${slug}`
    );
  }
}

/**
 * Membuat berita baru.
 */
export async function createBeritaAction(
  _previousState: BeritaActionState,
  formData: FormData
): Promise<BeritaActionState> {
  await requireAdmin();

  const judul =
    getFormString(
      formData,
      'judul'
    );

  const kategori =
    getFormString(
      formData,
      'kategori'
    );

  const kutipan =
    getFormString(
      formData,
      'kutipan'
    );

  const konten =
    getFormString(
      formData,
      'konten'
    );

  const penulis =
    getFormString(
      formData,
      'penulis'
    );

  const status =
    getFormString(
      formData,
      'status'
    );

  const gambar =
    formData.get('gambar');

  let uploadedPath:
    | string
    | null = null;

  try {
    validateFields(
      judul,
      kategori,
      kutipan,
      konten,
      penulis,
      status
    );

    if (
      !(gambar instanceof File) ||
      gambar.size <= 0
    ) {
      throw new Error(
        'Gambar utama wajib dipilih.'
      );
    }

    validateImageFile(gambar);

    const slug =
      await getUniqueSlug(judul);

    const uploadedImage =
      await uploadGambar(gambar);

    uploadedPath =
      uploadedImage.path;

    const now =
      new Date().toISOString();

    const {
      error: insertError,
    } = await supabaseAdmin
      .from('berita')
      .insert({
        judul,
        slug,
        kategori,
        kutipan,
        konten,
        penulis,

        gambar_url:
          uploadedImage.publicUrl,

        gambar_path:
          uploadedImage.path,

        status:
          status as StatusBerita,

        published_at:
          status === 'published'
            ? now
            : null,

        updated_at: now,
      });

    if (insertError) {
      throw new Error(
        `Berita gagal disimpan: ${insertError.message}`
      );
    }

    revalidateBeritaPages(slug);
  } catch (error) {
    if (uploadedPath) {
      await removeGambar(
        uploadedPath
      );
    }

    console.error(
      'Create berita error:',
      error
    );

    return {
      error:
        error instanceof Error
          ? error.message
          : 'Berita gagal disimpan.',
    };
  }

  redirect('/admin/berita');
}

/**
 * Memperbarui berita.
 */
export async function updateBeritaAction(
  id: number,
  _previousState: BeritaActionState,
  formData: FormData
): Promise<BeritaActionState> {
  await requireAdmin();

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    return {
      error:
        'ID berita tidak valid.',
    };
  }

  const judul =
    getFormString(
      formData,
      'judul'
    );

  const kategori =
    getFormString(
      formData,
      'kategori'
    );

  const kutipan =
    getFormString(
      formData,
      'kutipan'
    );

  const konten =
    getFormString(
      formData,
      'konten'
    );

  const penulis =
    getFormString(
      formData,
      'penulis'
    );

  const status =
    getFormString(
      formData,
      'status'
    );

  const gambar =
    formData.get('gambar');

  let newUploadedPath:
    | string
    | null = null;

  try {
    validateFields(
      judul,
      kategori,
      kutipan,
      konten,
      penulis,
      status
    );

    const {
      data: currentBerita,
      error: currentError,
    } = await supabaseAdmin
      .from('berita')
      .select(`
        id,
        slug,
        gambar_url,
        gambar_path,
        published_at
      `)
      .eq('id', id)
      .maybeSingle();

    if (
      currentError ||
      !currentBerita
    ) {
      throw new Error(
        currentError?.message ??
          'Data berita tidak ditemukan.'
      );
    }

    const slug =
      await getUniqueSlug(
        judul,
        id
      );

    let gambarUrl =
      currentBerita.gambar_url;

    let gambarPath =
      currentBerita.gambar_path;

    if (
      gambar instanceof File &&
      gambar.size > 0
    ) {
      validateImageFile(gambar);

      const uploadedImage =
        await uploadGambar(gambar);

      newUploadedPath =
        uploadedImage.path;

      gambarUrl =
        uploadedImage.publicUrl;

      gambarPath =
        uploadedImage.path;
    }

    if (!gambarUrl) {
      throw new Error(
        'Gambar utama berita belum tersedia.'
      );
    }

    const now =
      new Date().toISOString();

    const publishedAt =
      status === 'published'
        ? currentBerita
            .published_at ??
          now
        : null;

    const {
      error: updateError,
    } = await supabaseAdmin
      .from('berita')
      .update({
        judul,
        slug,
        kategori,
        kutipan,
        konten,
        penulis,

        gambar_url:
          gambarUrl,

        gambar_path:
          gambarPath,

        status:
          status as StatusBerita,

        published_at:
          publishedAt,

        updated_at:
          now,
      })
      .eq('id', id);

    if (updateError) {
      throw new Error(
        `Berita gagal diperbarui: ${updateError.message}`
      );
    }

    if (
      newUploadedPath &&
      currentBerita.gambar_path &&
      currentBerita.gambar_path !==
        newUploadedPath
    ) {
      await removeGambar(
        currentBerita.gambar_path
      );
    }

    revalidateBeritaPages(
      currentBerita.slug
    );

    if (
      slug !==
      currentBerita.slug
    ) {
      revalidateBeritaPages(slug);
    }
  } catch (error) {
    if (newUploadedPath) {
      await removeGambar(
        newUploadedPath
      );
    }

    console.error(
      'Update berita error:',
      error
    );

    return {
      error:
        error instanceof Error
          ? error.message
          : 'Berita gagal diperbarui.',
    };
  }

  redirect('/admin/berita');
}

/**
 * Menghapus berita.
 */
export async function deleteBeritaAction(
  formData: FormData
) {
  await requireAdmin();

  const id = Number(
    formData.get('id')
  );

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new Error(
      'ID berita tidak valid.'
    );
  }

  const {
    data: berita,
    error: readError,
  } = await supabaseAdmin
    .from('berita')
    .select(`
      id,
      slug,
      gambar_path
    `)
    .eq('id', id)
    .maybeSingle();

  if (
    readError ||
    !berita
  ) {
    throw new Error(
      readError?.message ??
        'Berita tidak ditemukan.'
    );
  }

  const {
    error: deleteError,
  } = await supabaseAdmin
    .from('berita')
    .delete()
    .eq('id', id);

  if (deleteError) {
    throw new Error(
      `Berita gagal dihapus: ${deleteError.message}`
    );
  }

  await removeGambar(
    berita.gambar_path
  );

  revalidateBeritaPages(
    berita.slug
  );
}

/**
 * Mengubah status draft atau published.
 */
export async function toggleStatusBeritaAction(
  formData: FormData
) {
  await requireAdmin();

  const id = Number(
    formData.get('id')
  );

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new Error(
      'ID berita tidak valid.'
    );
  }

  const {
    data: berita,
    error: readError,
  } = await supabaseAdmin
    .from('berita')
    .select(`
      status,
      slug,
      published_at
    `)
    .eq('id', id)
    .maybeSingle();

  if (
    readError ||
    !berita
  ) {
    throw new Error(
      readError?.message ??
        'Berita tidak ditemukan.'
    );
  }

  const nextStatus:
    StatusBerita =
    berita.status ===
    'published'
      ? 'draft'
      : 'published';

  const now =
    new Date().toISOString();

  const {
    error: updateError,
  } = await supabaseAdmin
    .from('berita')
    .update({
      status: nextStatus,

      published_at:
        nextStatus ===
        'published'
          ? berita.published_at ??
            now
          : null,

      updated_at:
        now,
    })
    .eq('id', id);

  if (updateError) {
    throw new Error(
      `Status berita gagal diperbarui: ${updateError.message}`
    );
  }

  revalidateBeritaPages(
    berita.slug
  );
}