// app/admin/galeri/actions.ts

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

import type {
  GaleriActionState,
  KategoriGaleri,
} from '@/types/galeri';

const BUCKET_NAME = 'galeri';

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const MAX_ALBUM_PHOTOS = 8;

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

const ALLOWED_CATEGORIES:
  KategoriGaleri[] = [
    'Pemerintahan',
    'Kegiatan Masyarakat',
    'Budaya dan Tradisi',
    'Pembangunan',
    'UMKM',
    'Desa Wisata',
    'Karang Taruna',
    'KKN dan Kolaborasi',
  ];

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
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
}

function getFileExtension(
  file: File
) {
  const mimeExtensions:
    Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };

  return (
    mimeExtensions[file.type] ??
    'jpg'
  );
}

function validateImage(
  file: File,
  label: string
) {
  if (
    !file ||
    file.size === 0
  ) {
    throw new Error(
      `${label} belum dipilih.`
    );
  }

  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type
    )
  ) {
    throw new Error(
      `${label} harus berformat JPG, PNG, atau WebP.`
    );
  }

  if (
    file.size >
    MAX_FILE_SIZE
  ) {
    throw new Error(
      `${label} maksimal berukuran 5 MB.`
    );
  }
}

async function createUniqueSlug(
  title: string
) {
  const baseSlug =
    slugify(title);

  if (!baseSlug) {
    throw new Error(
      'Judul album tidak dapat digunakan sebagai slug.'
    );
  }

  const {
    data,
    error,
  } = await supabaseAdmin
    .from('album_galeri')
    .select('id')
    .eq('slug', baseSlug)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Slug album gagal diperiksa: ${error.message}`
    );
  }

  if (!data) {
    return baseSlug;
  }

  return `${baseSlug}-${Date.now()}`;
}

async function uploadImage(
  file: File,
  folder: string,
  prefix: string
) {
  validateImage(
    file,
    'Berkas gambar'
  );

  const extension =
    getFileExtension(file);

  const storagePath =
    `${folder}/${prefix}-${randomUUID()}.${extension}`;

  const buffer =
    Buffer.from(
      await file.arrayBuffer()
    );

  const {
    error,
  } = await supabaseAdmin
    .storage
    .from(BUCKET_NAME)
    .upload(
      storagePath,
      buffer,
      {
        contentType:
          file.type,

        cacheControl:
          '3600',

        upsert: false,
      }
    );

  if (error) {
    throw new Error(
      `Foto gagal diunggah: ${error.message}`
    );
  }

  const {
    data: publicUrlData,
  } = supabaseAdmin
    .storage
    .from(BUCKET_NAME)
    .getPublicUrl(
      storagePath
    );

  return {
    path:
      storagePath,

    url:
      publicUrlData.publicUrl,
  };
}

async function removeStorageFiles(
  paths: string[]
) {
  const validPaths =
    paths.filter(Boolean);

  if (
    validPaths.length === 0
  ) {
    return;
  }

  const {
    error,
  } = await supabaseAdmin
    .storage
    .from(BUCKET_NAME)
    .remove(validPaths);

  if (error) {
    console.error(
      'Gagal menghapus file galeri:',
      error.message
    );
  }
}

function revalidateGaleriPages(
  slug?: string
) {
  revalidatePath('/admin');
  revalidatePath('/admin/galeri');

  revalidatePath('/data-desa');
  revalidatePath(
    '/data-desa/galeri'
  );

  if (slug) {
    revalidatePath(
      `/data-desa/galeri/${slug}`
    );
  }
}

export async function createAlbumAction(
  _previousState:
    GaleriActionState,
  formData: FormData
): Promise<GaleriActionState> {
  await requireAdmin();

  const uploadedPaths:
    string[] = [];

  let createdAlbumId:
    string | null = null;

  try {
    const judul =
      getFormString(
        formData,
        'judul'
      );

    const deskripsi =
      getFormString(
        formData,
        'deskripsi'
      );

    const kategori =
      getFormString(
        formData,
        'kategori'
      ) as KategoriGaleri;

    const tanggalKegiatan =
      getFormString(
        formData,
        'tanggal_kegiatan'
      );

    const lokasi =
      getFormString(
        formData,
        'lokasi'
      );

    const urutanValue =
      getFormString(
        formData,
        'urutan'
      );

    const aktif =
      getFormString(
        formData,
        'aktif'
      ) === 'on';

    const sampulValue =
      formData.get(
        'foto_sampul'
      );

    const fotoValues =
      formData
        .getAll('foto_album')
        .filter(
          (
            item
          ): item is File =>
            item instanceof File &&
            item.size > 0
        );

    if (
      judul.length < 3 ||
      judul.length > 180
    ) {
      throw new Error(
        'Judul album harus terdiri dari 3 sampai 180 karakter.'
      );
    }

    if (
      deskripsi.length > 3000
    ) {
      throw new Error(
        'Deskripsi album maksimal 3000 karakter.'
      );
    }

    if (
      !ALLOWED_CATEGORIES.includes(
        kategori
      )
    ) {
      throw new Error(
        'Kategori galeri tidak valid.'
      );
    }

    if (
      !sampulValue ||
      !(sampulValue instanceof File)
    ) {
      throw new Error(
        'Foto sampul wajib dipilih.'
      );
    }

    validateImage(
      sampulValue,
      'Foto sampul'
    );

    if (
      fotoValues.length >
      MAX_ALBUM_PHOTOS
    ) {
      throw new Error(
        `Maksimal ${MAX_ALBUM_PHOTOS} foto dalam satu kali unggah.`
      );
    }

    fotoValues.forEach(
      (file, index) => {
        validateImage(
          file,
          `Foto album ke-${index + 1}`
        );
      }
    );

    const urutan =
      urutanValue
        ? Number(urutanValue)
        : 0;

    if (
      !Number.isInteger(urutan) ||
      urutan < 0
    ) {
      throw new Error(
        'Urutan album tidak valid.'
      );
    }

    const slug =
      await createUniqueSlug(
        judul
      );

    const sampul =
      await uploadImage(
        sampulValue,
        slug,
        'sampul'
      );

    uploadedPaths.push(
      sampul.path
    );

    const {
      data: album,
      error: albumError,
    } = await supabaseAdmin
      .from('album_galeri')
      .insert({
        judul,
        slug,

        deskripsi:
          deskripsi || null,

        kategori,

        tanggal_kegiatan:
          tanggalKegiatan ||
          null,

        lokasi:
          lokasi || null,

        foto_sampul_url:
          sampul.url,

        foto_sampul_path:
          sampul.path,

        aktif,
        urutan,
      })
      .select('id, slug')
      .single();

    if (
      albumError ||
      !album
    ) {
      throw new Error(
        `Album gagal disimpan: ${
          albumError?.message ??
          'data album tidak ditemukan'
        }`
      );
    }

    createdAlbumId =
      String(album.id);

    const fotoRows = [];

    for (
      let index = 0;
      index <
      fotoValues.length;
      index += 1
    ) {
      const uploaded =
        await uploadImage(
          fotoValues[index],
          slug,
          `foto-${index + 1}`
        );

      uploadedPaths.push(
        uploaded.path
      );

      fotoRows.push({
        album_id:
          createdAlbumId,

        url_foto:
          uploaded.url,

        storage_path:
          uploaded.path,

        caption: null,

        alt_text:
          `${judul} - Foto ${index + 1}`,

        urutan:
          index + 1,
      });
    }

    if (
      fotoRows.length > 0
    ) {
      const {
        error: fotoError,
      } = await supabaseAdmin
        .from('foto_galeri')
        .insert(fotoRows);

      if (fotoError) {
        throw new Error(
          `Daftar foto gagal disimpan: ${fotoError.message}`
        );
      }
    }

    revalidateGaleriPages(
      slug
    );

    return {
      error: null,
      success:
        'Album galeri berhasil dibuat.',
    };
  } catch (error) {
    if (createdAlbumId) {
      await supabaseAdmin
        .from('album_galeri')
        .delete()
        .eq(
          'id',
          createdAlbumId
        );
    }

    await removeStorageFiles(
      uploadedPaths
    );

    console.error(
      'Create album galeri error:',
      error
    );

    return {
      error:
        error instanceof Error
          ? error.message
          : 'Album galeri gagal dibuat.',

      success: null,
    };
  }
}

export async function toggleAlbumAction(
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
      'ID album tidak valid.'
    );
  }

  const {
    data,
    error,
  } = await supabaseAdmin
    .from('album_galeri')
    .update({
      aktif: !aktif,
    })
    .eq('id', id)
    .select('slug')
    .maybeSingle();

  if (error) {
    throw new Error(
      `Status album gagal diperbarui: ${error.message}`
    );
  }

  if (!data) {
    throw new Error(
      'Album galeri tidak ditemukan.'
    );
  }

  revalidateGaleriPages(
    String(data.slug)
  );
}

export async function deleteAlbumAction(
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
      'ID album tidak valid.'
    );
  }

  const [
    albumResult,
    fotoResult,
  ] = await Promise.all([
    supabaseAdmin
      .from('album_galeri')
      .select(`
        slug,
        foto_sampul_path
      `)
      .eq('id', id)
      .maybeSingle(),

    supabaseAdmin
      .from('foto_galeri')
      .select('storage_path')
      .eq('album_id', id),
  ]);

  if (albumResult.error) {
    throw new Error(
      `Album gagal diperiksa: ${albumResult.error.message}`
    );
  }

  if (!albumResult.data) {
    throw new Error(
      'Album galeri tidak ditemukan.'
    );
  }

  if (fotoResult.error) {
    throw new Error(
      `Foto album gagal diperiksa: ${fotoResult.error.message}`
    );
  }

  const storagePaths = [
    String(
      albumResult.data
        .foto_sampul_path ??
        ''
    ),

    ...(fotoResult.data ??
      []).map(
      (foto) =>
        String(
          foto.storage_path ??
            ''
        )
    ),
  ].filter(Boolean);

  const {
    error: deleteError,
  } = await supabaseAdmin
    .from('album_galeri')
    .delete()
    .eq('id', id);

  if (deleteError) {
    throw new Error(
      `Album gagal dihapus: ${deleteError.message}`
    );
  }

  await removeStorageFiles(
    storagePaths
  );

  revalidateGaleriPages(
    String(
      albumResult.data.slug
    )
  );
}