// app/admin/pembangunan/actions.ts

'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

import {
  STATUS_PEMBANGUNAN_OPTIONS,
  type StatusPembangunan,
} from '@/types/pembangunan';

const STORAGE_BUCKET = 'pembangunan';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES: readonly string[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }
}

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function getBoolean(formData: FormData, key: string) {
  return getString(formData, key) === 'true';
}

function getNumber(formData: FormData, key: string) {
  return Number(getString(formData, key));
}

function getImageFile(formData: FormData): File | null {
  const value = formData.get('gambar_file');

  if (
    !value ||
    typeof value === 'string' ||
    value.size === 0
  ) {
    return null;
  }

  return value;
}

function isStatusPembangunan(
  value: string
): value is StatusPembangunan {
  return (
    STATUS_PEMBANGUNAN_OPTIONS as readonly string[]
  ).includes(value);
}

function buildAdminUrl(
  type: 'success' | 'error',
  message: string,
  section = 'daftar-pembangunan'
) {
  const params = new URLSearchParams({
    [type]: message,
  });

  return `/admin/pembangunan?${params.toString()}#${section}`;
}

function revalidatePembangunan() {
  revalidatePath('/admin/pembangunan');
  revalidatePath('/pembangunan');
  revalidatePath('/admin');
}

interface PembangunanInput {
  nama: string;
  lokasi: string;
  tahun: number;

  sumberDana: string;
  anggaran: number;

  progres: number;
  status: string;

  deskripsi: string;

  aktif: boolean;
  urutan: number;

  hapusGambar: boolean;
}

function parsePembangunanInput(
  formData: FormData
): PembangunanInput {
  return {
    nama: getString(formData, 'nama'),
    lokasi: getString(formData, 'lokasi'),
    tahun: getNumber(formData, 'tahun'),

    sumberDana: getString(formData, 'sumber_dana'),
    anggaran: getNumber(formData, 'anggaran'),

    progres: getNumber(formData, 'progres'),
    status: getString(formData, 'status'),

    deskripsi: getString(formData, 'deskripsi'),

    aktif: getBoolean(formData, 'aktif'),
    urutan: getNumber(formData, 'urutan'),

    hapusGambar: getBoolean(
      formData,
      'hapus_gambar'
    ),
  };
}

function validatePembangunanInput(
  input: PembangunanInput
) {
  if (input.nama.length < 3) {
    return 'Nama kegiatan minimal terdiri dari 3 karakter.';
  }

  if (input.lokasi.length < 2) {
    return 'Lokasi kegiatan wajib diisi.';
  }

  if (
    !Number.isInteger(input.tahun) ||
    input.tahun < 1900 ||
    input.tahun > 2200
  ) {
    return 'Tahun pembangunan harus berada pada rentang 1900 sampai 2200.';
  }

  if (input.sumberDana.length < 2) {
    return 'Sumber dana wajib diisi.';
  }

  if (
    !Number.isSafeInteger(input.anggaran) ||
    input.anggaran < 0
  ) {
    return 'Anggaran harus berupa bilangan bulat minimal 0.';
  }

  if (
    !Number.isInteger(input.progres) ||
    input.progres < 0 ||
    input.progres > 100
  ) {
    return 'Progres harus berupa bilangan bulat antara 0 sampai 100.';
  }

  if (!isStatusPembangunan(input.status)) {
    return 'Status pembangunan tidak valid.';
  }

  if (input.deskripsi.length < 10) {
    return 'Deskripsi kegiatan minimal terdiri dari 10 karakter.';
  }

  if (input.deskripsi.length > 3000) {
    return 'Deskripsi kegiatan maksimal terdiri dari 3.000 karakter.';
  }

  if (
    !Number.isInteger(input.urutan) ||
    input.urutan < 0
  ) {
    return 'Nomor urutan harus berupa bilangan bulat minimal 0.';
  }

  return null;
}

function validateImageFile(file: File | null) {
  if (!file) {
    return null;
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Format gambar harus JPG, PNG, atau WebP.';
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return 'Ukuran gambar maksimal 5 MB.';
  }

  return null;
}

function getImageExtension(mimeType: string) {
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

async function uploadGambarPembangunan(
  file: File
) {
  const extension = getImageExtension(file.type);

  const filePath =
    `proyek/${Date.now()}-${randomUUID()}.${extension}`;

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  const { error: uploadError } =
    await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, bytes, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

  if (uploadError) {
    throw new Error(
      `Gagal mengunggah gambar: ${uploadError.message}`
    );
  }

  const { data } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  const publicUrl = data.publicUrl;

  if (!publicUrl) {
    await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    throw new Error(
      'URL publik gambar gagal dibuat.'
    );
  }

  return publicUrl;
}

function getStoragePathFromUrl(
  imageUrl: string | null
) {
  if (!imageUrl) {
    return null;
  }

  const marker =
    `/storage/v1/object/public/${STORAGE_BUCKET}/`;

  const markerIndex = imageUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  const rawPath = imageUrl
    .slice(markerIndex + marker.length)
    .split('?')[0]
    .split('#')[0];

  if (!rawPath) {
    return null;
  }

  try {
    return rawPath
      .split('/')
      .map((segment) => decodeURIComponent(segment))
      .join('/');
  } catch {
    return rawPath;
  }
}

async function deleteStorageImage(
  imageUrl: string | null
) {
  const filePath = getStoragePathFromUrl(
    imageUrl
  );

  if (!filePath) {
    return;
  }

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .remove([filePath]);

  if (error) {
    console.error(
      'Gagal menghapus gambar pembangunan dari Storage:',
      {
        message: error.message,
        filePath,
      }
    );
  }
}

async function getCurrentImage(id: string) {
  const { data, error } = await supabaseAdmin
    .from('proyek_pembangunan')
    .select(`
      id,
      gambar_url
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error(
      'Data proyek pembangunan tidak ditemukan.'
    );
  }

  return data.gambar_url
    ? String(data.gambar_url)
    : null;
}

function pembangunanPayload(
  input: PembangunanInput,
  gambarUrl: string | null
) {
  return {
    nama: input.nama,
    lokasi: input.lokasi,
    tahun: input.tahun,

    sumber_dana: input.sumberDana,
    anggaran: input.anggaran,

    progres: input.progres,
    status: input.status as StatusPembangunan,

    deskripsi: input.deskripsi,
    gambar_url: gambarUrl,

    aktif: input.aktif,
    urutan: input.urutan,

    updated_at: new Date().toISOString(),
  };
}

/* =========================================================
   TAMBAH PROYEK
========================================================= */

export async function tambahProyekPembangunanAction(
  formData: FormData
) {
  await requireAdmin();

  const input = parsePembangunanInput(formData);
  const imageFile = getImageFile(formData);

  const validationError =
    validatePembangunanInput(input);

  if (validationError) {
    redirect(
      buildAdminUrl(
        'error',
        validationError,
        'tambah-pembangunan'
      )
    );
  }

  const imageValidationError =
    validateImageFile(imageFile);

  if (imageValidationError) {
    redirect(
      buildAdminUrl(
        'error',
        imageValidationError,
        'tambah-pembangunan'
      )
    );
  }

  let uploadedImageUrl: string | null = null;

  if (imageFile) {
    try {
      uploadedImageUrl =
        await uploadGambarPembangunan(
          imageFile
        );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Gagal mengunggah gambar pembangunan.';

      redirect(
        buildAdminUrl(
          'error',
          message,
          'tambah-pembangunan'
        )
      );
    }
  }

  const { error } = await supabaseAdmin
    .from('proyek_pembangunan')
    .insert({
      ...pembangunanPayload(
        input,
        uploadedImageUrl
      ),

      created_at: new Date().toISOString(),
    });

  if (error) {
    if (uploadedImageUrl) {
      await deleteStorageImage(
        uploadedImageUrl
      );
    }

    console.error(
      'Gagal menambahkan proyek pembangunan:',
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
        error.message,
        'tambah-pembangunan'
      )
    );
  }

  revalidatePembangunan();

  redirect(
    buildAdminUrl(
      'success',
      'Proyek pembangunan berhasil ditambahkan.'
    )
  );
}

/* =========================================================
   UBAH PROYEK
========================================================= */

export async function ubahProyekPembangunanAction(
  formData: FormData
) {
  await requireAdmin();

  const id = getString(formData, 'id');

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID proyek pembangunan tidak valid.'
      )
    );
  }

  const input = parsePembangunanInput(formData);
  const imageFile = getImageFile(formData);

  const validationError =
    validatePembangunanInput(input);

  if (validationError) {
    redirect(
      buildAdminUrl(
        'error',
        validationError
      )
    );
  }

  const imageValidationError =
    validateImageFile(imageFile);

  if (imageValidationError) {
    redirect(
      buildAdminUrl(
        'error',
        imageValidationError
      )
    );
  }

  let currentImageUrl: string | null = null;

  try {
    currentImageUrl = await getCurrentImage(id);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Gagal mengambil gambar proyek saat ini.';

    redirect(
      buildAdminUrl(
        'error',
        message
      )
    );
  }

  let uploadedImageUrl: string | null = null;
  let nextImageUrl = currentImageUrl;

  if (imageFile) {
    try {
      uploadedImageUrl =
        await uploadGambarPembangunan(
          imageFile
        );

      nextImageUrl = uploadedImageUrl;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Gagal mengunggah gambar pembangunan.';

      redirect(
        buildAdminUrl(
          'error',
          message
        )
      );
    }
  } else if (input.hapusGambar) {
    nextImageUrl = null;
  }

  const { error } = await supabaseAdmin
    .from('proyek_pembangunan')
    .update(
      pembangunanPayload(
        input,
        nextImageUrl
      )
    )
    .eq('id', id);

  if (error) {
    if (uploadedImageUrl) {
      await deleteStorageImage(
        uploadedImageUrl
      );
    }

    console.error(
      'Gagal memperbarui proyek pembangunan:',
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
        error.message
      )
    );
  }

  if (
    currentImageUrl &&
    currentImageUrl !== nextImageUrl
  ) {
    await deleteStorageImage(
      currentImageUrl
    );
  }

  revalidatePembangunan();

  redirect(
    buildAdminUrl(
      'success',
      'Proyek pembangunan berhasil diperbarui.'
    )
  );
}

/* =========================================================
   AKTIF / NONAKTIF
========================================================= */

export async function toggleAktifProyekPembangunanAction(
  formData: FormData
) {
  await requireAdmin();

  const id = getString(formData, 'id');
  const aktif = getBoolean(formData, 'aktif');

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID proyek pembangunan tidak valid.'
      )
    );
  }

  const { error } = await supabaseAdmin
    .from('proyek_pembangunan')
    .update({
      aktif,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error(
      'Gagal mengubah status publikasi proyek pembangunan:',
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
        error.message
      )
    );
  }

  revalidatePembangunan();

  redirect(
    buildAdminUrl(
      'success',
      aktif
        ? 'Proyek pembangunan berhasil dipublikasikan.'
        : 'Proyek pembangunan berhasil disembunyikan.'
    )
  );
}

/* =========================================================
   HAPUS PROYEK
========================================================= */

export async function hapusProyekPembangunanAction(
  formData: FormData
) {
  await requireAdmin();

  const id = getString(formData, 'id');

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID proyek pembangunan tidak valid.'
      )
    );
  }

  let currentImageUrl: string | null = null;

  try {
    currentImageUrl = await getCurrentImage(id);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Data proyek pembangunan tidak ditemukan.';

    redirect(
      buildAdminUrl(
        'error',
        message
      )
    );
  }

  const { error } = await supabaseAdmin
    .from('proyek_pembangunan')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(
      'Gagal menghapus proyek pembangunan:',
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
        error.message
      )
    );
  }

  if (currentImageUrl) {
    await deleteStorageImage(
      currentImageUrl
    );
  }

  revalidatePembangunan();

  redirect(
    buildAdminUrl(
      'success',
      'Proyek pembangunan berhasil dihapus.'
    )
  );
}