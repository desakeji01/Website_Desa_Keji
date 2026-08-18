// app/admin/apbdes/actions.ts

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
  TAHUN_APBDES,
} from '@/types/apbdes';

import type {
  ApbdesActionState,
  TahunApbdes,
} from '@/types/apbdes';

const BUCKET_NAME =
  'apbdes';

const MAX_PDF_SIZE =
  10 * 1024 * 1024;

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
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

function parseTahun(
  value: string
): TahunApbdes {
  const tahun =
    Number(value);

  if (
    !TAHUN_APBDES.includes(
      tahun as TahunApbdes
    )
  ) {
    throw new Error(
      'Tahun APBDes tidak valid.'
    );
  }

  return tahun as TahunApbdes;
}

function parseNominal(
  value: string,
  label: string
) {
  if (!value) {
    return 0;
  }

  const normalized =
    value
      .replace(/\s/g, '')
      .replace(/\./g, '')
      .replace(',', '.');

  const nominal =
    Number(normalized);

  if (
    !Number.isFinite(nominal) ||
    nominal < 0
  ) {
    throw new Error(
      `${label} tidak valid.`
    );
  }

  if (
    nominal >
    999999999999999
  ) {
    throw new Error(
      `${label} terlalu besar.`
    );
  }

  return Math.round(
    nominal * 100
  ) / 100;
}

function validatePdf(
  file: File
) {
  const validType =
    file.type ===
      'application/pdf' ||
    file.name
      .toLowerCase()
      .endsWith('.pdf');

  if (!validType) {
    throw new Error(
      'Dokumen APBDes harus berformat PDF.'
    );
  }

  if (
    file.size >
    MAX_PDF_SIZE
  ) {
    throw new Error(
      'Ukuran dokumen PDF maksimal 10 MB.'
    );
  }
}

function validateImage(
  file: File
) {
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type
    )
  ) {
    throw new Error(
      'Infografis harus berformat JPG, PNG, atau WebP.'
    );
  }

  if (
    file.size >
    MAX_IMAGE_SIZE
  ) {
    throw new Error(
      'Ukuran infografis maksimal 5 MB.'
    );
  }
}

function getImageExtension(
  file: File
) {
  const extensions:
    Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };

  return (
    extensions[file.type] ??
    'jpg'
  );
}

async function uploadFile({
  file,
  path,
  contentType,
}: {
  file: File;
  path: string;
  contentType: string;
}) {
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
      path,
      buffer,
      {
        contentType,
        cacheControl:
          '3600',
        upsert: false,
      }
    );

  if (error) {
    throw new Error(
      `Berkas gagal diunggah: ${error.message}`
    );
  }

  const {
    data,
  } = supabaseAdmin
    .storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return {
    path,
    url:
      data.publicUrl,
  };
}

async function removeFiles(
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
      'Gagal menghapus file APBDes:',
      {
        message:
          error.message,
      }
    );
  }
}

function revalidateApbdesPages(
  tahun: number
) {
  revalidatePath('/admin');
  revalidatePath(
    '/admin/apbdes'
  );

  revalidatePath(
    '/informasi-publik'
  );

  revalidatePath(
    `/informasi-publik/apbdes/${tahun}`
  );
}

export async function updateApbdesAction(
  _previousState:
    ApbdesActionState,
  formData: FormData
): Promise<ApbdesActionState> {
  await requireAdmin();

  const uploadedPaths:
    string[] = [];

  try {
    const tahun =
      parseTahun(
        getFormString(
          formData,
          'tahun'
        )
      );

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

    const aktif =
      getFormString(
        formData,
        'aktif'
      ) === 'on';

    if (
      judul.length < 5 ||
      judul.length > 200
    ) {
      throw new Error(
        'Judul harus terdiri dari 5 sampai 200 karakter.'
      );
    }

    if (
      deskripsi.length > 5000
    ) {
      throw new Error(
        'Deskripsi maksimal 5000 karakter.'
      );
    }

    const anggaranPendapatan =
      parseNominal(
        getFormString(
          formData,
          'anggaran_pendapatan'
        ),
        'Anggaran pendapatan'
      );

    const realisasiPendapatan =
      parseNominal(
        getFormString(
          formData,
          'realisasi_pendapatan'
        ),
        'Realisasi pendapatan'
      );

    const anggaranBelanja =
      parseNominal(
        getFormString(
          formData,
          'anggaran_belanja'
        ),
        'Anggaran belanja'
      );

    const realisasiBelanja =
      parseNominal(
        getFormString(
          formData,
          'realisasi_belanja'
        ),
        'Realisasi belanja'
      );

    const anggaranPembiayaan =
      parseNominal(
        getFormString(
          formData,
          'anggaran_pembiayaan'
        ),
        'Anggaran pembiayaan'
      );

    const realisasiPembiayaan =
      parseNominal(
        getFormString(
          formData,
          'realisasi_pembiayaan'
        ),
        'Realisasi pembiayaan'
      );

    const {
      data: existing,
      error: existingError,
    } = await supabaseAdmin
      .from(
        'apbdes_realisasi'
      )
      .select(`
        dokumen_url,
        dokumen_path,
        infografis_url,
        infografis_path
      `)
      .eq('tahun', tahun)
      .maybeSingle();

    if (existingError) {
      throw new Error(
        `Data APBDes gagal diperiksa: ${existingError.message}`
      );
    }

    let dokumenUrl =
      existing?.dokumen_url ??
      null;

    let dokumenPath =
      existing?.dokumen_path ??
      null;

    let infografisUrl =
      existing?.infografis_url ??
      null;

    let infografisPath =
      existing?.infografis_path ??
      null;

    const dokumenValue =
      formData.get(
        'dokumen_pdf'
      );

    if (
      dokumenValue instanceof File &&
      dokumenValue.size > 0
    ) {
      validatePdf(
        dokumenValue
      );

      const path =
        `${tahun}/dokumen-${randomUUID()}.pdf`;

      const uploaded =
        await uploadFile({
          file:
            dokumenValue,
          path,
          contentType:
            'application/pdf',
        });

      uploadedPaths.push(
        uploaded.path
      );

      dokumenUrl =
        uploaded.url;

      dokumenPath =
        uploaded.path;
    }

    const infografisValue =
      formData.get(
        'infografis'
      );

    if (
      infografisValue instanceof File &&
      infografisValue.size > 0
    ) {
      validateImage(
        infografisValue
      );

      const extension =
        getImageExtension(
          infografisValue
        );

      const path =
        `${tahun}/infografis-${randomUUID()}.${extension}`;

      const uploaded =
        await uploadFile({
          file:
            infografisValue,
          path,
          contentType:
            infografisValue.type,
        });

      uploadedPaths.push(
        uploaded.path
      );

      infografisUrl =
        uploaded.url;

      infografisPath =
        uploaded.path;
    }

    const {
      error: upsertError,
    } = await supabaseAdmin
      .from(
        'apbdes_realisasi'
      )
      .upsert(
        {
          tahun,
          judul,

          deskripsi:
            deskripsi || null,

          anggaran_pendapatan:
            anggaranPendapatan,

          realisasi_pendapatan:
            realisasiPendapatan,

          anggaran_belanja:
            anggaranBelanja,

          realisasi_belanja:
            realisasiBelanja,

          anggaran_pembiayaan:
            anggaranPembiayaan,

          realisasi_pembiayaan:
            realisasiPembiayaan,

          dokumen_url:
            dokumenUrl,

          dokumen_path:
            dokumenPath,

          infografis_url:
            infografisUrl,

          infografis_path:
            infografisPath,

          aktif,
        },
        {
          onConflict:
            'tahun',
        }
      );

    if (upsertError) {
      throw new Error(
        `Data APBDes gagal disimpan: ${upsertError.message}`
      );
    }

    const oldPaths: string[] = [];

    if (
      existing?.dokumen_path &&
      dokumenPath !==
        existing.dokumen_path
    ) {
      oldPaths.push(
        existing.dokumen_path
      );
    }

    if (
      existing?.infografis_path &&
      infografisPath !==
        existing.infografis_path
    ) {
      oldPaths.push(
        existing.infografis_path
      );
    }

    await removeFiles(
      oldPaths
    );

    revalidateApbdesPages(
      tahun
    );

    return {
      error: null,
      success:
        `Data APBDes ${tahun} berhasil diperbarui.`,
    };
  } catch (error) {
    await removeFiles(
      uploadedPaths
    );

    console.error(
      'Update APBDes error:',
      error
    );

    return {
      error:
        error instanceof Error
          ? error.message
          : 'Data APBDes gagal diperbarui.',

      success: null,
    };
  }
}