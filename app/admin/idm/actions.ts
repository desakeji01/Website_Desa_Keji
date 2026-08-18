// app/admin/idm/actions.ts

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

import {
  STATUS_IDM_OPTIONS,
  type StatusIdm,
} from '@/types/idm';

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
}

function getString(
  formData: FormData,
  key: string
) {
  return String(
    formData.get(key) ??
      ''
  ).trim();
}

function getBoolean(
  formData: FormData,
  key: string
) {
  return (
    getString(
      formData,
      key
    ) === 'true'
  );
}

function getNumber(
  formData: FormData,
  key: string
) {
  const value =
    getString(
      formData,
      key
    );

  return Number(value);
}

function isStatusIdm(
  value: string
): value is StatusIdm {
  return (
    STATUS_IDM_OPTIONS as readonly string[]
  ).includes(value);
}

function buildAdminUrl(
  type:
    | 'success'
    | 'error',
  message: string,
  section = 'riwayat-idm'
) {
  const params =
    new URLSearchParams({
      [type]: message,
    });

  return `/admin/idm?${params.toString()}#${section}`;
}

function revalidateIdm() {
  revalidatePath(
    '/admin/idm'
  );

  revalidatePath('/idm');

  revalidatePath('/admin');
}

interface IdmInput {
  tahun: number;
  nilai: number;
  status: string;
  keterangan: string;
  aktif: boolean;
}

function parseIdmInput(
  formData: FormData
): IdmInput {
  return {
    tahun:
      getNumber(
        formData,
        'tahun'
      ),

    nilai:
      getNumber(
        formData,
        'nilai'
      ),

    status:
      getString(
        formData,
        'status'
      ),

    keterangan:
      getString(
        formData,
        'keterangan'
      ),

    aktif:
      getBoolean(
        formData,
        'aktif'
      ),
  };
}

function validateIdmInput(
  input: IdmInput
) {
  if (
    !Number.isInteger(
      input.tahun
    ) ||
    input.tahun < 1900 ||
    input.tahun > 2200
  ) {
    return 'Tahun IDM harus berupa bilangan bulat antara 1900 sampai 2200.';
  }

  if (
    !Number.isFinite(
      input.nilai
    ) ||
    input.nilai < 0 ||
    input.nilai > 1
  ) {
    return 'Nilai IDM harus berada pada rentang 0 sampai 1.';
  }

  if (
    !isStatusIdm(
      input.status
    )
  ) {
    return 'Status IDM tidak valid.';
  }

  if (
    input.keterangan.length >
    1000
  ) {
    return 'Keterangan maksimal terdiri dari 1.000 karakter.';
  }

  return null;
}

async function tahunSudahAda(
  tahun: number,
  excludeId?: string
) {
  const baseQuery =
    supabaseAdmin
      .from('idm_riwayat')
      .select('id')
      .eq('tahun', tahun);

  const {
    data,
    error,
  } = excludeId
    ? await baseQuery
        .neq('id', excludeId)
        .limit(1)
    : await baseQuery.limit(1);

  if (error) {
    throw new Error(
      error.message
    );
  }

  return (
    data?.length ?? 0
  ) > 0;
}

function idmPayload(
  input: IdmInput
) {
  return {
    tahun:
      input.tahun,

    nilai:
      input.nilai,

    status:
      input.status as StatusIdm,

    keterangan:
      input.keterangan ||
      null,

    aktif:
      input.aktif,

    updated_at:
      new Date()
        .toISOString(),
  };
}

/* =========================================================
   TAMBAH DATA IDM
========================================================= */

export async function tambahRiwayatIdmAction(
  formData: FormData
) {
  await requireAdmin();

  const input =
    parseIdmInput(
      formData
    );

  const validationError =
    validateIdmInput(
      input
    );

  if (validationError) {
    redirect(
      buildAdminUrl(
        'error',
        validationError,
        'tambah-idm'
      )
    );
  }

  try {
    const exists =
      await tahunSudahAda(
        input.tahun
      );

    if (exists) {
      redirect(
        buildAdminUrl(
          'error',
          `Data IDM tahun ${input.tahun} sudah tersedia.`,
          'tambah-idm'
        )
      );
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Gagal memeriksa tahun IDM.';

    redirect(
      buildAdminUrl(
        'error',
        message,
        'tambah-idm'
      )
    );
  }

  const {
    error,
  } = await supabaseAdmin
    .from('idm_riwayat')
    .insert({
      ...idmPayload(input),

      created_at:
        new Date()
          .toISOString(),
    });

  if (error) {
    console.error(
      'Gagal menambahkan data IDM:',
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

    redirect(
      buildAdminUrl(
        'error',
        error.message,
        'tambah-idm'
      )
    );
  }

  revalidateIdm();

  redirect(
    buildAdminUrl(
      'success',
      `Data IDM tahun ${input.tahun} berhasil ditambahkan.`
    )
  );
}

/* =========================================================
   UBAH DATA IDM
========================================================= */

export async function ubahRiwayatIdmAction(
  formData: FormData
) {
  await requireAdmin();

  const id =
    getString(
      formData,
      'id'
    );

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID data IDM tidak valid.'
      )
    );
  }

  const input =
    parseIdmInput(
      formData
    );

  const validationError =
    validateIdmInput(
      input
    );

  if (validationError) {
    redirect(
      buildAdminUrl(
        'error',
        validationError
      )
    );
  }

  try {
    const exists =
      await tahunSudahAda(
        input.tahun,
        id
      );

    if (exists) {
      redirect(
        buildAdminUrl(
          'error',
          `Data IDM tahun ${input.tahun} sudah digunakan oleh data lain.`
        )
      );
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Gagal memeriksa tahun IDM.';

    redirect(
      buildAdminUrl(
        'error',
        message
      )
    );
  }

  const {
    error,
  } = await supabaseAdmin
    .from('idm_riwayat')
    .update(
      idmPayload(input)
    )
    .eq('id', id);

  if (error) {
    console.error(
      'Gagal memperbarui data IDM:',
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

    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidateIdm();

  redirect(
    buildAdminUrl(
      'success',
      `Data IDM tahun ${input.tahun} berhasil diperbarui.`
    )
  );
}

/* =========================================================
   AKTIF/NONAKTIF DATA IDM
========================================================= */

export async function toggleAktifRiwayatIdmAction(
  formData: FormData
) {
  await requireAdmin();

  const id =
    getString(
      formData,
      'id'
    );

  const aktif =
    getBoolean(
      formData,
      'aktif'
    );

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID data IDM tidak valid.'
      )
    );
  }

  const {
    error,
  } = await supabaseAdmin
    .from('idm_riwayat')
    .update({
      aktif,

      updated_at:
        new Date()
          .toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error(
      'Gagal mengubah status data IDM:',
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

    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidateIdm();

  redirect(
    buildAdminUrl(
      'success',
      aktif
        ? 'Data IDM berhasil dipublikasikan.'
        : 'Data IDM berhasil disembunyikan.'
    )
  );
}

/* =========================================================
   HAPUS DATA IDM
========================================================= */

export async function hapusRiwayatIdmAction(
  formData: FormData
) {
  await requireAdmin();

  const id =
    getString(
      formData,
      'id'
    );

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID data IDM tidak valid.'
      )
    );
  }

  const {
    error,
  } = await supabaseAdmin
    .from('idm_riwayat')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(
      'Gagal menghapus data IDM:',
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

    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidateIdm();

  redirect(
    buildAdminUrl(
      'success',
      'Data IDM berhasil dihapus.'
    )
  );
}