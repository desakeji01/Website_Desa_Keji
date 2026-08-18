'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

import {
  ANTI_KORUPSI_ICON_OPTIONS,
  JENIS_DOKUMEN_ANTI_KORUPSI,
  type AntiKorupsiIconKey,
  type JenisDokumenAntiKorupsi,
} from '@/types/anti-korupsi';

const SUB_SLUG = 'pengawasan';

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
  const value = getString(
    formData,
    key
  );

  if (!value) {
    return null;
  }

  return Number(value);
}

function isIconKey(
  value: string
): value is AntiKorupsiIconKey {
  return (
    ANTI_KORUPSI_ICON_OPTIONS as readonly string[]
  ).includes(value);
}

function isJenisDokumen(
  value: string
): value is JenisDokumenAntiKorupsi {
  return (
    JENIS_DOKUMEN_ANTI_KORUPSI as readonly string[]
  ).includes(value);
}

function isGoogleDriveUrl(
  value: string
) {
  try {
    const url = new URL(value);

    if (url.protocol !== 'https:') {
      return false;
    }

    return (
      url.hostname ===
        'drive.google.com' ||
      url.hostname ===
        'docs.google.com'
    );
  } catch {
    return false;
  }
}

function buildAdminUrl(
  type: 'success' | 'error',
  message: string,
  section = 'daftar-indikator'
) {
  const params =
    new URLSearchParams({
      [type]: message,
    });

  return `/admin/desa-anti-korupsi/pengawasan?${params.toString()}#${section}`;
}

function revalidatePengawasan() {
  revalidatePath(
    '/admin/desa-anti-korupsi'
  );

  revalidatePath(
    '/admin/desa-anti-korupsi/pengawasan'
  );

  revalidatePath(
    '/desa-anti-korupsi'
  );

  revalidatePath(
    '/desa-anti-korupsi/pengawasan'
  );

  revalidatePath('/admin');
}

async function indikatorPengawasanAda(
  id: string
) {
  const { data, error } =
    await supabaseAdmin
      .from(
        'anti_korupsi_indikator'
      )
      .select('id')
      .eq('id', id)
      .eq('sub_slug', SUB_SLUG)
      .maybeSingle();

  if (error) {
    return {
      exists: false,
      error: error.message,
    };
  }

  return {
    exists: Boolean(data),
    error: null,
  };
}

/* =========================================================
   INDIKATOR PENGAWASAN
========================================================= */

interface IndikatorInput {
  kode: string;
  judul: string;
  ringkasan: string;
  iconKey: string;
  urutan: number;
  aktif: boolean;
}

function parseIndikatorInput(
  formData: FormData
): IndikatorInput {
  return {
    kode: getString(
      formData,
      'kode'
    ),

    judul: getString(
      formData,
      'judul'
    ),

    ringkasan: getString(
      formData,
      'ringkasan'
    ),

    iconKey: getString(
      formData,
      'icon_key'
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

function validateIndikatorInput(
  input: IndikatorInput
) {
  if (input.kode.length < 2) {
    return 'Kode indikator minimal terdiri dari 2 karakter.';
  }

  if (input.judul.length < 5) {
    return 'Judul indikator minimal terdiri dari 5 karakter.';
  }

  if (
    input.ringkasan.length < 10
  ) {
    return 'Ringkasan indikator minimal terdiri dari 10 karakter.';
  }

  if (!isIconKey(input.iconKey)) {
    return 'Ikon indikator tidak valid.';
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

function indikatorPayload(
  input: IndikatorInput
) {
  return {
    sub_slug: SUB_SLUG,

    kode: input.kode,
    judul: input.judul,
    ringkasan: input.ringkasan,

    icon_key:
      input.iconKey as AntiKorupsiIconKey,

    urutan: input.urutan,
    aktif: input.aktif,

    updated_at:
      new Date().toISOString(),
  };
}

export async function tambahIndikatorPengawasanAction(
  formData: FormData
) {
  await requireAdmin();

  const input =
    parseIndikatorInput(formData);

  const validationError =
    validateIndikatorInput(input);

  if (validationError) {
    redirect(
      buildAdminUrl(
        'error',
        validationError,
        'tambah-indikator'
      )
    );
  }

  const { error } =
    await supabaseAdmin
      .from(
        'anti_korupsi_indikator'
      )
      .insert({
        ...indikatorPayload(input),
        created_at:
          new Date().toISOString(),
      });

  if (error) {
    console.error(
      'Gagal menambahkan indikator Pengawasan:',
      error
    );

    redirect(
      buildAdminUrl(
        'error',
        error.code === '23505'
          ? `Kode indikator ${input.kode} sudah digunakan.`
          : error.message,
        'tambah-indikator'
      )
    );
  }

  revalidatePengawasan();

  redirect(
    buildAdminUrl(
      'success',
      'Indikator Pengawasan berhasil ditambahkan.'
    )
  );
}

export async function ubahIndikatorPengawasanAction(
  formData: FormData
) {
  await requireAdmin();

  const id = getString(
    formData,
    'id'
  );

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID indikator tidak valid.'
      )
    );
  }

  const input =
    parseIndikatorInput(formData);

  const validationError =
    validateIndikatorInput(input);

  if (validationError) {
    redirect(
      buildAdminUrl(
        'error',
        validationError
      )
    );
  }

  const { error } =
    await supabaseAdmin
      .from(
        'anti_korupsi_indikator'
      )
      .update(
        indikatorPayload(input)
      )
      .eq('id', id)
      .eq('sub_slug', SUB_SLUG);

  if (error) {
    redirect(
      buildAdminUrl(
        'error',
        error.code === '23505'
          ? `Kode indikator ${input.kode} sudah digunakan.`
          : error.message
      )
    );
  }

  revalidatePengawasan();

  redirect(
    buildAdminUrl(
      'success',
      'Indikator Pengawasan berhasil diperbarui.'
    )
  );
}

export async function toggleIndikatorPengawasanAction(
  formData: FormData
) {
  await requireAdmin();

  const id = getString(
    formData,
    'id'
  );

  const aktif = getBoolean(
    formData,
    'aktif'
  );

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID indikator tidak valid.'
      )
    );
  }

  const { error } =
    await supabaseAdmin
      .from(
        'anti_korupsi_indikator'
      )
      .update({
        aktif,
        updated_at:
          new Date().toISOString(),
      })
      .eq('id', id)
      .eq('sub_slug', SUB_SLUG);

  if (error) {
    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidatePengawasan();

  redirect(
    buildAdminUrl(
      'success',
      aktif
        ? 'Indikator berhasil dipublikasikan.'
        : 'Indikator berhasil disembunyikan.'
    )
  );
}

export async function hapusIndikatorPengawasanAction(
  formData: FormData
) {
  await requireAdmin();

  const id = getString(
    formData,
    'id'
  );

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID indikator tidak valid.'
      )
    );
  }

  const { count, error: countError } =
    await supabaseAdmin
      .from(
        'anti_korupsi_dokumen'
      )
      .select('id', {
        count: 'exact',
        head: true,
      })
      .eq('indikator_id', id);

  if (countError) {
    redirect(
      buildAdminUrl(
        'error',
        countError.message
      )
    );
  }

  if ((count ?? 0) > 0) {
    redirect(
      buildAdminUrl(
        'error',
        'Indikator masih memiliki dokumen. Hapus dokumennya terlebih dahulu.'
      )
    );
  }

  const { error } =
    await supabaseAdmin
      .from(
        'anti_korupsi_indikator'
      )
      .delete()
      .eq('id', id)
      .eq('sub_slug', SUB_SLUG);

  if (error) {
    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidatePengawasan();

  redirect(
    buildAdminUrl(
      'success',
      'Indikator Pengawasan berhasil dihapus.'
    )
  );
}

/* =========================================================
   DOKUMEN GOOGLE DRIVE
========================================================= */

interface DokumenInput {
  indikatorId: string;

  judul: string;
  deskripsi: string;

  jenis: string;
  tahun: number | null;

  driveUrl: string;

  urutan: number;
  aktif: boolean;
}

function parseDokumenInput(
  formData: FormData
): DokumenInput {
  return {
    indikatorId: getString(
      formData,
      'indikator_id'
    ),

    judul: getString(
      formData,
      'judul'
    ),

    deskripsi: getString(
      formData,
      'deskripsi'
    ),

    jenis: getString(
      formData,
      'jenis'
    ),

    tahun: getOptionalInteger(
      formData,
      'tahun'
    ),

    driveUrl: getString(
      formData,
      'drive_url'
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
  if (!input.indikatorId) {
    return 'Indikator wajib dipilih.';
  }

  if (input.judul.length < 3) {
    return 'Judul dokumen minimal terdiri dari 3 karakter.';
  }

  if (
    input.deskripsi.length < 10
  ) {
    return 'Deskripsi dokumen minimal terdiri dari 10 karakter.';
  }

  if (
    !isJenisDokumen(input.jenis)
  ) {
    return 'Jenis dokumen tidak valid.';
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
    return 'Tahun dokumen harus berada pada rentang 1900 sampai 2200.';
  }

  if (
    !isGoogleDriveUrl(
      input.driveUrl
    )
  ) {
    return 'Link dokumen harus menggunakan Google Drive atau Google Docs.';
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

function dokumenPayload(
  input: DokumenInput
) {
  return {
    indikator_id:
      input.indikatorId,

    judul: input.judul,
    deskripsi: input.deskripsi,

    jenis:
      input.jenis as JenisDokumenAntiKorupsi,

    tahun: input.tahun,

    drive_url:
      input.driveUrl,

    urutan: input.urutan,
    aktif: input.aktif,

    updated_at:
      new Date().toISOString(),
  };
}

export async function tambahDokumenPengawasanAction(
  formData: FormData
) {
  await requireAdmin();

  const input =
    parseDokumenInput(formData);

  const validationError =
    validateDokumenInput(input);

  if (validationError) {
    redirect(
      buildAdminUrl(
        'error',
        validationError,
        'tambah-dokumen'
      )
    );
  }

  const indikatorCheck =
    await indikatorPengawasanAda(
      input.indikatorId
    );

  if (
    indikatorCheck.error ||
    !indikatorCheck.exists
  ) {
    redirect(
      buildAdminUrl(
        'error',
        indikatorCheck.error ??
          'Indikator Pengawasan tidak ditemukan.',
        'tambah-dokumen'
      )
    );
  }

  const { error } =
    await supabaseAdmin
      .from(
        'anti_korupsi_dokumen'
      )
      .insert({
        ...dokumenPayload(input),

        created_at:
          new Date().toISOString(),
      });

  if (error) {
    console.error(
      'Gagal menambahkan dokumen Pengawasan:',
      error
    );

    redirect(
      buildAdminUrl(
        'error',
        error.message,
        'tambah-dokumen'
      )
    );
  }

  revalidatePengawasan();

  redirect(
    buildAdminUrl(
      'success',
      'Dokumen Google Drive berhasil ditambahkan.',
      'daftar-dokumen'
    )
  );
}

export async function ubahDokumenPengawasanAction(
  formData: FormData
) {
  await requireAdmin();

  const id = getString(
    formData,
    'id'
  );

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID dokumen tidak valid.',
        'daftar-dokumen'
      )
    );
  }

  const input =
    parseDokumenInput(formData);

  const validationError =
    validateDokumenInput(input);

  if (validationError) {
    redirect(
      buildAdminUrl(
        'error',
        validationError,
        'daftar-dokumen'
      )
    );
  }

  const indikatorCheck =
    await indikatorPengawasanAda(
      input.indikatorId
    );

  if (
    indikatorCheck.error ||
    !indikatorCheck.exists
  ) {
    redirect(
      buildAdminUrl(
        'error',
        indikatorCheck.error ??
          'Indikator Pengawasan tidak ditemukan.',
        'daftar-dokumen'
      )
    );
  }

  const { error } =
    await supabaseAdmin
      .from(
        'anti_korupsi_dokumen'
      )
      .update(
        dokumenPayload(input)
      )
      .eq('id', id);

  if (error) {
    redirect(
      buildAdminUrl(
        'error',
        error.message,
        'daftar-dokumen'
      )
    );
  }

  revalidatePengawasan();

  redirect(
    buildAdminUrl(
      'success',
      'Dokumen Google Drive berhasil diperbarui.',
      'daftar-dokumen'
    )
  );
}

export async function toggleDokumenPengawasanAction(
  formData: FormData
) {
  await requireAdmin();

  const id = getString(
    formData,
    'id'
  );

  const aktif = getBoolean(
    formData,
    'aktif'
  );

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID dokumen tidak valid.',
        'daftar-dokumen'
      )
    );
  }

  const { error } =
    await supabaseAdmin
      .from(
        'anti_korupsi_dokumen'
      )
      .update({
        aktif,
        updated_at:
          new Date().toISOString(),
      })
      .eq('id', id);

  if (error) {
    redirect(
      buildAdminUrl(
        'error',
        error.message,
        'daftar-dokumen'
      )
    );
  }

  revalidatePengawasan();

  redirect(
    buildAdminUrl(
      'success',
      aktif
        ? 'Dokumen berhasil dipublikasikan.'
        : 'Dokumen berhasil disembunyikan.',
      'daftar-dokumen'
    )
  );
}

export async function hapusDokumenPengawasanAction(
  formData: FormData
) {
  await requireAdmin();

  const id = getString(
    formData,
    'id'
  );

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID dokumen tidak valid.',
        'daftar-dokumen'
      )
    );
  }

  const { error } =
    await supabaseAdmin
      .from(
        'anti_korupsi_dokumen'
      )
      .delete()
      .eq('id', id);

  if (error) {
    redirect(
      buildAdminUrl(
        'error',
        error.message,
        'daftar-dokumen'
      )
    );
  }

  revalidatePengawasan();

  redirect(
    buildAdminUrl(
      'success',
      'Dokumen Pengawasan berhasil dihapus.',
      'daftar-dokumen'
    )
  );
}