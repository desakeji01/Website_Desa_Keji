// app/admin/layanan/actions.ts

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
  LayananActionState,
} from '@/types/admin-layanan';

interface FormLayanan {
  nama: string;
  deskripsi: string;
  urutan: number;
  aktif: boolean;
  persyaratan: string[];
}

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

function createSlug(
  value: string
) {
  return value
    .normalize('NFKD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .toLowerCase()
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

function parsePersyaratan(
  value: string
) {
  const result =
    value
      .split(/\r?\n/)
      .map(
        (item) =>
          item.trim()
      )
      .filter(Boolean);

  return [
    ...new Set(result),
  ];
}

function parseFormLayanan(
  formData: FormData
): FormLayanan {
  const nama =
    getFormString(
      formData,
      'nama'
    );

  const deskripsi =
    getFormString(
      formData,
      'deskripsi'
    );

  const urutan =
    Number(
      getFormString(
        formData,
        'urutan'
      )
    );

  const aktif =
    getFormString(
      formData,
      'aktif'
    ) === 'true';

  const persyaratan =
    parsePersyaratan(
      getFormString(
        formData,
        'persyaratan'
      )
    );

  return {
    nama,
    deskripsi,
    urutan,
    aktif,
    persyaratan,
  };
}

function validateForm(
  data: FormLayanan
) {
  if (
    data.nama.length < 3
  ) {
    return 'Nama layanan minimal terdiri dari 3 karakter.';
  }

  if (
    data.nama.length > 150
  ) {
    return 'Nama layanan maksimal 150 karakter.';
  }

  if (
    data.deskripsi.length < 10
  ) {
    return 'Deskripsi layanan minimal terdiri dari 10 karakter.';
  }

  if (
    data.deskripsi.length >
    1000
  ) {
    return 'Deskripsi layanan maksimal 1.000 karakter.';
  }

  if (
    !Number.isInteger(
      data.urutan
    ) ||
    data.urutan < 1
  ) {
    return 'Urutan layanan harus berupa angka minimal 1.';
  }

  if (
    data.persyaratan.length >
    50
  ) {
    return 'Jumlah persyaratan maksimal 50 item.';
  }

  const syaratTerlaluPanjang =
    data.persyaratan.some(
      (item) =>
        item.length > 500
    );

  if (
    syaratTerlaluPanjang
  ) {
    return 'Setiap persyaratan maksimal terdiri dari 500 karakter.';
  }

  return null;
}

async function getUniqueSlug(
  nama: string,
  excludeId?: number
) {
  const baseSlug =
    createSlug(nama) ||
    `layanan-${Date.now()}`;

  let candidate =
    baseSlug;

  let counter = 2;

  while (true) {
    let query =
      supabaseAdmin
        .from('layanan')
        .select('id')
        .eq(
          'slug',
          candidate
        )
        .limit(1);

    if (
      excludeId
    ) {
      query =
        query.neq(
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
        `Gagal memeriksa slug layanan: ${error.message}`
      );
    }

    if (
      !data ||
      data.length === 0
    ) {
      return candidate;
    }

    candidate =
      `${baseSlug}-${counter}`;

    counter += 1;
  }
}

function revalidateLayanan() {
  revalidatePath(
    '/admin'
  );

  revalidatePath(
    '/admin/layanan'
  );

  revalidatePath(
    '/layanan'
  );

  revalidatePath(
    '/kontak'
  );
}

export async function tambahLayananAction(
  previousState:
    LayananActionState,
  formData: FormData
): Promise<LayananActionState> {
  void previousState;

  await requireAdmin();

  const data =
    parseFormLayanan(
      formData
    );

  const validationError =
    validateForm(data);

  if (
    validationError
  ) {
    return {
      success: false,
      message:
        validationError,
    };
  }

  let layananId:
    number | null = null;

  try {
    const slug =
      await getUniqueSlug(
        data.nama
      );

    const {
      data: layananBaru,
      error: layananError,
    } =
      await supabaseAdmin
        .from('layanan')
        .insert({
          nama:
            data.nama,

          slug,

          deskripsi:
            data.deskripsi,

          aktif:
            data.aktif,

          urutan:
            data.urutan,
        })
        .select('id')
        .single();

    if (
      layananError ||
      !layananBaru
    ) {
      return {
        success: false,
        message:
          layananError?.message ??
          'Layanan gagal ditambahkan.',
      };
    }

    layananId =
      Number(
        layananBaru.id
      );

    if (
      data.persyaratan.length >
      0
    ) {
      const rows =
        data.persyaratan.map(
          (
            persyaratan,
            index
          ) => ({
            layanan_id:
              layananId,

            persyaratan,

            urutan:
              index + 1,
          })
        );

      const {
        error:
          persyaratanError,
      } =
        await supabaseAdmin
          .from(
            'persyaratan_layanan'
          )
          .insert(rows);

      if (
        persyaratanError
      ) {
        /*
         * Hapus kembali layanan agar
         * tidak menyisakan data setengah jadi.
         */
        await supabaseAdmin
          .from('layanan')
          .delete()
          .eq(
            'id',
            layananId
          );

        return {
          success: false,
          message:
            `Persyaratan gagal disimpan: ${persyaratanError.message}`,
        };
      }
    }
  } catch (error) {
    console.error(
      'Gagal menambahkan layanan:',
      error
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat menambahkan layanan.',
    };
  }

  revalidateLayanan();

  redirect(
    '/admin/layanan?status=created'
  );
}

export async function ubahLayananAction(
  id: number,
  previousState:
    LayananActionState,
  formData: FormData
): Promise<LayananActionState> {
  void previousState;

  await requireAdmin();

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    return {
      success: false,
      message:
        'ID layanan tidak valid.',
    };
  }

  const data =
    parseFormLayanan(
      formData
    );

  const validationError =
    validateForm(data);

  if (
    validationError
  ) {
    return {
      success: false,
      message:
        validationError,
    };
  }

  try {
    const slug =
      await getUniqueSlug(
        data.nama,
        id
      );

    const {
      error:
        layananError,
    } =
      await supabaseAdmin
        .from('layanan')
        .update({
          nama:
            data.nama,

          slug,

          deskripsi:
            data.deskripsi,

          aktif:
            data.aktif,

          urutan:
            data.urutan,
        })
        .eq('id', id);

    if (
      layananError
    ) {
      return {
        success: false,
        message:
          layananError.message,
      };
    }

    const {
      error:
        hapusSyaratError,
    } =
      await supabaseAdmin
        .from(
          'persyaratan_layanan'
        )
        .delete()
        .eq(
          'layanan_id',
          id
        );

    if (
      hapusSyaratError
    ) {
      return {
        success: false,
        message:
          `Persyaratan lama gagal diperbarui: ${hapusSyaratError.message}`,
      };
    }

    if (
      data.persyaratan.length >
      0
    ) {
      const rows =
        data.persyaratan.map(
          (
            persyaratan,
            index
          ) => ({
            layanan_id:
              id,

            persyaratan,

            urutan:
              index + 1,
          })
        );

      const {
        error:
          insertSyaratError,
      } =
        await supabaseAdmin
          .from(
            'persyaratan_layanan'
          )
          .insert(rows);

      if (
        insertSyaratError
      ) {
        return {
          success: false,
          message:
            `Persyaratan baru gagal disimpan: ${insertSyaratError.message}`,
        };
      }
    }
  } catch (error) {
    console.error(
      'Gagal memperbarui layanan:',
      error
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat memperbarui layanan.',
    };
  }

  revalidateLayanan();

  redirect(
    '/admin/layanan?status=updated'
  );
}

export async function toggleStatusLayananAction(
  formData: FormData
) {
  await requireAdmin();

  const id =
    Number(
      formData.get('id')
    );

  const aktif =
    String(
      formData.get('aktif') ??
        ''
    ) === 'true';

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new Error(
      'ID layanan tidak valid.'
    );
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from('layanan')
      .update({
        aktif,
      })
      .eq('id', id);

  if (error) {
    console.error(
      'Gagal mengubah status layanan:',
      {
        message:
          error.message,
        code:
          error.code,
        details:
          error.details,
        hint:
          error.hint,
      }
    );

    throw new Error(
      'Status layanan gagal diperbarui.'
    );
  }

  revalidateLayanan();
}