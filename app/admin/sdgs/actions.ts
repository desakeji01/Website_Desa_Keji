// app/admin/sdgs/actions.ts

'use server';

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
  SdgsActionState,
} from '@/types/sdgs';

const JUMLAH_GOAL_SDGS = 18;

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

function parseSkor(
  value: string,
  nomorGoal: number
) {
  if (!value) {
    throw new Error(
      `Skor SDGs nomor ${nomorGoal} wajib diisi.`
    );
  }

  const skor =
    Number(
      value.replace(',', '.')
    );

  if (
    !Number.isFinite(skor)
  ) {
    throw new Error(
      `Skor SDGs nomor ${nomorGoal} tidak valid.`
    );
  }

  if (
    skor < 0 ||
    skor > 100
  ) {
    throw new Error(
      `Skor SDGs nomor ${nomorGoal} harus berada pada rentang 0 sampai 100.`
    );
  }

  return Math.round(
    skor * 100
  ) / 100;
}

function parseTahunData(
  value: string
) {
  const tahun =
    Number(value);

  if (
    !Number.isInteger(tahun) ||
    tahun < 2000 ||
    tahun > 2100
  ) {
    throw new Error(
      'Tahun data SDGs tidak valid.'
    );
  }

  return tahun;
}

function revalidateSdgsPages() {
  revalidatePath('/admin');
  revalidatePath('/admin/sdgs');

  revalidatePath('/data-desa');
  revalidatePath(
    '/data-desa/sdgs'
  );
}

export async function updateSdgsAction(
  _previousState:
    SdgsActionState,
  formData: FormData
): Promise<SdgsActionState> {
  await requireAdmin();

  try {
    const tahunData =
      parseTahunData(
        getFormString(
          formData,
          'tahun_data'
        )
      );

    const daftarSkor =
      Array.from(
        {
          length:
            JUMLAH_GOAL_SDGS,
        },
        (_, index) => {
          const id =
            index + 1;

          return {
            id,

            skor:
              parseSkor(
                getFormString(
                  formData,
                  `skor_${id}`
                ),
                id
              ),
          };
        }
      );

    const hasilPembaruan =
      await Promise.all(
        daftarSkor.map(
          async (item) => {
            const {
              data,
              error,
            } =
              await supabaseAdmin
                .from(
                  'sdgs_desa'
                )
                .update({
                  skor:
                    item.skor,

                  tahun_data:
                    tahunData,
                })
                .eq(
                  'id',
                  item.id
                )
                .select('id')
                .maybeSingle();

            return {
              id:
                item.id,
              data,
              error,
            };
          }
        )
      );

    const hasilGagal =
      hasilPembaruan.find(
        (hasil) =>
          hasil.error ||
          !hasil.data
      );

    if (hasilGagal) {
      if (
        hasilGagal.error
      ) {
        throw new Error(
          `Skor SDGs nomor ${hasilGagal.id} gagal diperbarui: ${hasilGagal.error.message}`
        );
      }

      throw new Error(
        `Data SDGs nomor ${hasilGagal.id} tidak ditemukan.`
      );
    }

    revalidateSdgsPages();

    return {
      error: null,
      success:
        'Seluruh skor SDGs Desa berhasil diperbarui.',
    };
  } catch (error) {
    console.error(
      'Update SDGs error:',
      error
    );

    return {
      error:
        error instanceof Error
          ? error.message
          : 'Data SDGs gagal diperbarui.',

      success: null,
    };
  }
}