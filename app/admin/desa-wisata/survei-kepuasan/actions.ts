// app/admin/desa-wisata/survei-kepuasan/actions.ts

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const ADMIN_PATH = '/admin/desa-wisata/survei-kepuasan';
const SURVEY_PATH = '/desa-wisata/survei-kepuasan';
const RESULT_PATH = '/desa-wisata/hasil-survei';
const SURVEY_START_YEAR = 2026;

/* =========================================================
   AUTH
========================================================= */

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

/* =========================================================
   HELPERS
========================================================= */

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
    getString(formData, key) === 'true'
  );
}

function getYearFromFormData(
  formData: FormData
) {
  const raw = getString(
    formData,
    'tahun'
  );

  const year = Number(raw);

  if (
    !/^\d{4}$/.test(raw) ||
    !Number.isInteger(year) ||
    year < SURVEY_START_YEAR ||
    year > 2100
  ) {
    return '';
  }

  return String(year);
}

function buildAdminUrl(
  type: 'success' | 'error',
  message: string,
  tahun?: string
) {
  const params = new URLSearchParams({
    [type]: message,
  });

  if (tahun) {
    params.set('tahun', tahun);
  }

  return `${ADMIN_PATH}?${params.toString()}`;
}

function revalidateSurvei() {
  revalidatePath(ADMIN_PATH);
  revalidatePath(SURVEY_PATH);
  revalidatePath(RESULT_PATH);
  revalidatePath('/desa-wisata/informasi-kunjungan');
  revalidatePath('/desa-wisata');
  revalidatePath('/admin');
}

/* =========================================================
   SETTINGS
========================================================= */

export async function simpanPengaturanSurveiAction(
  formData: FormData
) {
  await requireAdmin();

  const tahun = getYearFromFormData(
    formData
  );

  const judul = getString(
    formData,
    'judul'
  );

  const deskripsi = getString(
    formData,
    'deskripsi'
  );

  const surveiAktif = getBoolean(
    formData,
    'survei_aktif'
  );

  const hasilSurveiAktif = getBoolean(
    formData,
    'hasil_survei_aktif'
  );

  if (judul.length < 5) {
    redirect(
      buildAdminUrl(
        'error',
        'Judul minimal terdiri dari 5 karakter.',
        tahun
      )
    );
  }

  if (judul.length > 200) {
    redirect(
      buildAdminUrl(
        'error',
        'Judul terlalu panjang.',
        tahun
      )
    );
  }

  if (deskripsi.length < 20) {
    redirect(
      buildAdminUrl(
        'error',
        'Deskripsi minimal terdiri dari 20 karakter.',
        tahun
      )
    );
  }

  if (deskripsi.length > 1500) {
    redirect(
      buildAdminUrl(
        'error',
        'Deskripsi terlalu panjang.',
        tahun
      )
    );
  }

  const { error } = await supabaseAdmin
    .from('desa_wisata_survei_settings')
    .upsert(
      {
        setting_key: 'utama',
        judul,
        deskripsi,
        survei_aktif: surveiAktif,
        hasil_survei_aktif:
          hasilSurveiAktif,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'setting_key',
      }
    );

  if (error) {
    console.error(
      'Gagal menyimpan pengaturan survei:',
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
        tahun
      )
    );
  }

  revalidateSurvei();

  redirect(
    buildAdminUrl(
      'success',
      'Pengaturan survei berhasil disimpan.',
      tahun
    )
  );
}

/* =========================================================
   TOGGLE VALID
========================================================= */

export async function toggleValidResponSurveiAction(
  formData: FormData
) {
  await requireAdmin();

  const tahun = getYearFromFormData(
    formData
  );

  const id = getString(
    formData,
    'id'
  );

  const valid = getBoolean(
    formData,
    'valid'
  );

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID respons tidak valid.',
        tahun
      )
    );
  }

  const { error } = await supabaseAdmin
    .from('desa_wisata_survei_respon')
    .update({
      valid,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error(
      'Gagal mengubah status respons:',
      error
    );

    redirect(
      buildAdminUrl(
        'error',
        error.message,
        tahun
      )
    );
  }

  revalidateSurvei();

  redirect(
    buildAdminUrl(
      'success',
      valid
        ? 'Respons berhasil dimasukkan kembali ke perhitungan dashboard dan ulasan publik.'
        : 'Respons berhasil dikeluarkan dari dashboard dan ulasan publik.',
      tahun
    )
  );
}

/* =========================================================
   DELETE
========================================================= */

export async function hapusResponSurveiAction(
  formData: FormData
) {
  await requireAdmin();

  const tahun = getYearFromFormData(
    formData
  );

  const id = getString(
    formData,
    'id'
  );

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID respons tidak valid.',
        tahun
      )
    );
  }

  const { error } = await supabaseAdmin
    .from('desa_wisata_survei_respon')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(
      'Gagal menghapus respons survei:',
      error
    );

    redirect(
      buildAdminUrl(
        'error',
        error.message,
        tahun
      )
    );
  }

  revalidateSurvei();

  redirect(
    buildAdminUrl(
      'success',
      'Respons survei berhasil dihapus.',
      tahun
    )
  );
}