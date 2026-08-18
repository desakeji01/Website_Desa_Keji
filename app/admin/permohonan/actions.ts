// app/admin/permohonan/actions.ts

'use server';

import { revalidatePath } from 'next/cache';

import { supabaseAdmin } from '@/lib/supabase-admin';

const STATUS_PERMOHONAN = [
  'Menunggu',
  'Diproses',
  'Selesai',
  'Ditolak',
] as const;

type StatusPermohonan =
  (typeof STATUS_PERMOHONAN)[number];

function isStatusPermohonan(
  value: string
): value is StatusPermohonan {
  return (
    STATUS_PERMOHONAN as readonly string[]
  ).includes(value);
}

export async function ubahStatusPermohonan(
  formData: FormData
) {
  const id = Number(
    formData.get('id')
  );

  const status = String(
    formData.get('status') ?? ''
  );

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new Error(
      'ID permohonan tidak valid.'
    );
  }

  if (!isStatusPermohonan(status)) {
    throw new Error(
      'Status permohonan tidak valid.'
    );
  }

  const {
    error,
  } = await supabaseAdmin
    .from('permohonan')
    .update({
      status,
    })
    .eq('id', id);

  if (error) {
    console.error(
      'Gagal memperbarui status permohonan:',
      {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }
    );

    throw new Error(
      'Status permohonan gagal diperbarui.'
    );
  }

  revalidatePath('/admin');
  revalidatePath('/admin/permohonan');
}