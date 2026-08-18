// app/admin/pengaduan/actions.ts

'use server';

import {
  revalidatePath,
} from 'next/cache';

import {
  createClient,
} from '@/lib/server';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

const STATUS_PENGADUAN = [
  'Menunggu',
  'Diproses',
  'Selesai',
  'Ditolak',
] as const;

async function requireAdmin() {
  const supabase =
    await createClient();

  const {
    data: {
      user,
    },
    error,
  } =
    await supabase.auth.getUser();

  if (
    error ||
    !user
  ) {
    throw new Error(
      'Sesi admin tidak ditemukan.'
    );
  }
}

function revalidatePengaduan() {
  revalidatePath(
    '/admin'
  );

  revalidatePath(
    '/admin/pengaduan'
  );
}

export async function ubahStatusPengaduan(
  formData: FormData
) {
  await requireAdmin();

  const id =
    Number(
      formData.get('id')
    );

  const status =
    String(
      formData.get('status') ??
        ''
    );

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new Error(
      'ID pengaduan tidak valid.'
    );
  }

  if (
    !(
      STATUS_PENGADUAN as readonly string[]
    ).includes(status)
  ) {
    throw new Error(
      'Status pengaduan tidak valid.'
    );
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from('pengaduan')
      .update({
        status,
        updated_at:
          new Date().toISOString(),
      })
      .eq('id', id);

  if (error) {
    console.error(
      'Gagal memperbarui status pengaduan:',
      error
    );

    throw new Error(
      'Status pengaduan gagal diperbarui.'
    );
  }

  revalidatePengaduan();
}

export async function simpanCatatanPengaduan(
  formData: FormData
) {
  await requireAdmin();

  const id =
    Number(
      formData.get('id')
    );

  const catatan =
    String(
      formData.get(
        'catatan_admin'
      ) ?? ''
    ).trim();

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new Error(
      'ID pengaduan tidak valid.'
    );
  }

  if (
    catatan.length > 2000
  ) {
    throw new Error(
      'Catatan maksimal 2.000 karakter.'
    );
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from('pengaduan')
      .update({
        catatan_admin:
          catatan || null,

        updated_at:
          new Date().toISOString(),
      })
      .eq('id', id);

  if (error) {
    console.error(
      'Gagal menyimpan catatan pengaduan:',
      error
    );

    throw new Error(
      'Catatan pengaduan gagal disimpan.'
    );
  }

  revalidatePengaduan();
}