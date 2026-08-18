// app/admin/informasi-publik/actions.ts

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

const INFORMASI_KEY =
  'utama';

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

function getNumber(
  formData: FormData,
  key: string
) {
  return Number(
    getString(
      formData,
      key
    )
  );
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

function isValidResourceUrl(
  value: string
) {
  return (
    value.startsWith('/') ||
    value.startsWith(
      'https://'
    ) ||
    value.startsWith(
      'http://'
    )
  );
}

function isValidInternalPath(
  value: string
) {
  return (
    value.startsWith('/') &&
    !value.startsWith('//')
  );
}

function buildAdminUrl(
  type:
    | 'success'
    | 'error',
  message: string
) {
  const params =
    new URLSearchParams({
      [type]:
        message,
    });

  return `/admin/informasi-publik?${params.toString()}`;
}

function revalidateInformasiPublik() {
  revalidatePath(
    '/admin/informasi-publik'
  );

  revalidatePath(
    '/informasi-publik'
  );

  revalidatePath(
    '/informasi-publik/informasi-umum'
  );

  revalidatePath(
    '/informasi-publik/produk-hukum'
  );

  revalidatePath(
    '/admin'
  );
}

export async function simpanPengaturanInformasiPublikAction(
  formData: FormData
) {
  await requireAdmin();

  const input = {
    badge_text:
      getString(
        formData,
        'badge_text'
      ),

    hero_eyebrow:
      getString(
        formData,
        'hero_eyebrow'
      ),

    hero_title:
      getString(
        formData,
        'hero_title'
      ),

    hero_description:
      getString(
        formData,
        'hero_description'
      ),

    summary_documents_label:
      getString(
        formData,
        'summary_documents_label'
      ),

    summary_access_value:
      getString(
        formData,
        'summary_access_value'
      ),

    summary_access_label:
      getString(
        formData,
        'summary_access_label'
      ),

    summary_apbdes_label:
      getString(
        formData,
        'summary_apbdes_label'
      ),

    menu_eyebrow:
      getString(
        formData,
        'menu_eyebrow'
      ),

    menu_title:
      getString(
        formData,
        'menu_title'
      ),

    menu_description:
      getString(
        formData,
        'menu_description'
      ),

    produk_hukum_title:
      getString(
        formData,
        'produk_hukum_title'
      ),

    produk_hukum_label:
      getString(
        formData,
        'produk_hukum_label'
      ),

    produk_hukum_description:
      getString(
        formData,
        'produk_hukum_description'
      ),

    informasi_umum_title:
      getString(
        formData,
        'informasi_umum_title'
      ),

    informasi_umum_label:
      getString(
        formData,
        'informasi_umum_label'
      ),

    informasi_umum_description:
      getString(
        formData,
        'informasi_umum_description'
      ),

    apbdes_eyebrow:
      getString(
        formData,
        'apbdes_eyebrow'
      ),

    apbdes_title:
      getString(
        formData,
        'apbdes_title'
      ),

    apbdes_description:
      getString(
        formData,
        'apbdes_description'
      ),

    commitment_eyebrow:
      getString(
        formData,
        'commitment_eyebrow'
      ),

    commitment_title:
      getString(
        formData,
        'commitment_title'
      ),

    commitment_description:
      getString(
        formData,
        'commitment_description'
      ),

    commitment_1_title:
      getString(
        formData,
        'commitment_1_title'
      ),

    commitment_1_description:
      getString(
        formData,
        'commitment_1_description'
      ),

    commitment_2_title:
      getString(
        formData,
        'commitment_2_title'
      ),

    commitment_2_description:
      getString(
        formData,
        'commitment_2_description'
      ),

    commitment_3_title:
      getString(
        formData,
        'commitment_3_title'
      ),

    commitment_3_description:
      getString(
        formData,
        'commitment_3_description'
      ),

    cta_title:
      getString(
        formData,
        'cta_title'
      ),

    cta_description:
      getString(
        formData,
        'cta_description'
      ),

    cta_button_label:
      getString(
        formData,
        'cta_button_label'
      ),

    cta_button_href:
      getString(
        formData,
        'cta_button_href'
      ),
  };

  if (
    Object.values(input).some(
      (value) =>
        value.length === 0
    )
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Semua kolom pengaturan wajib diisi.'
      )
    );
  }

  if (
    !isValidInternalPath(
      input.cta_button_href
    )
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Tautan tombol PPID harus berupa path internal yang dimulai dengan /.'
      )
    );
  }

  const {
    error,
  } = await supabaseAdmin
    .from(
      'informasi_publik_settings'
    )
    .upsert(
      {
        informasi_key:
          INFORMASI_KEY,

        ...input,

        updated_at:
          new Date()
            .toISOString(),
      },
      {
        onConflict:
          'informasi_key',
      }
    );

  if (error) {
    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidateInformasiPublik();

  redirect(
    buildAdminUrl(
      'success',
      'Pengaturan Informasi Publik berhasil diperbarui.'
    )
  );
}

interface InformasiUmumInput {
  judul: string;
  kategori: string;
  tahun: number;
  tanggalPublikasi: string;
  deskripsi: string;
  fileUrl: string;
  filePath: string;
  aktif: boolean;
  urutan: number;
}

function parseInformasiUmum(
  formData: FormData
): InformasiUmumInput {
  return {
    judul:
      getString(
        formData,
        'judul'
      ),

    kategori:
      getString(
        formData,
        'kategori'
      ),

    tahun:
      getNumber(
        formData,
        'tahun'
      ),

    tanggalPublikasi:
      getString(
        formData,
        'tanggal_publikasi'
      ),

    deskripsi:
      getString(
        formData,
        'deskripsi'
      ),

    fileUrl:
      getString(
        formData,
        'file_url'
      ),

    filePath:
      getString(
        formData,
        'file_path'
      ),

    aktif:
      getBoolean(
        formData,
        'aktif'
      ),

    urutan:
      getNumber(
        formData,
        'urutan'
      ),
  };
}

function validateInformasiUmum(
  input:
    InformasiUmumInput
) {
  if (
    input.judul.length < 5
  ) {
    return 'Judul minimal 5 karakter.';
  }

  if (
    input.kategori.length < 2
  ) {
    return 'Kategori harus diisi.';
  }

  if (
    !Number.isInteger(
      input.tahun
    ) ||
    input.tahun < 1900 ||
    input.tahun > 2100
  ) {
    return 'Tahun dokumen tidak valid.';
  }

  if (
    input.deskripsi.length <
    10
  ) {
    return 'Deskripsi minimal 10 karakter.';
  }

  if (
    !isValidResourceUrl(
      input.fileUrl
    )
  ) {
    return 'URL dokumen harus dimulai dengan /, http://, atau https://.';
  }

  if (
    !Number.isInteger(
      input.urutan
    ) ||
    input.urutan < 1
  ) {
    return 'Nomor urutan minimal 1.';
  }

  return null;
}

function informasiUmumPayload(
  input:
    InformasiUmumInput
) {
  return {
    judul:
      input.judul,

    kategori:
      input.kategori,

    tahun:
      input.tahun,

    tanggal_publikasi:
      input.tanggalPublikasi ||
      null,

    deskripsi:
      input.deskripsi,

    file_url:
      input.fileUrl,

    file_path:
      input.filePath ||
      null,

    aktif:
      input.aktif,

    urutan:
      input.urutan,

    updated_at:
      new Date()
        .toISOString(),
  };
}

export async function tambahInformasiUmumAction(
  formData: FormData
) {
  await requireAdmin();

  const input =
    parseInformasiUmum(
      formData
    );

  const validationError =
    validateInformasiUmum(
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

  const {
    error,
  } = await supabaseAdmin
    .from(
      'informasi_umum'
    )
    .insert(
      informasiUmumPayload(
        input
      )
    );

  if (error) {
    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidateInformasiPublik();

  redirect(
    buildAdminUrl(
      'success',
      'Informasi umum berhasil ditambahkan.'
    )
  );
}

export async function ubahInformasiUmumAction(
  formData: FormData
) {
  await requireAdmin();

  const id =
    getNumber(
      formData,
      'id'
    );

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'ID informasi tidak valid.'
      )
    );
  }

  const input =
    parseInformasiUmum(
      formData
    );

  const validationError =
    validateInformasiUmum(
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

  const {
    error,
  } = await supabaseAdmin
    .from(
      'informasi_umum'
    )
    .update(
      informasiUmumPayload(
        input
      )
    )
    .eq('id', id);

  if (error) {
    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidateInformasiPublik();

  redirect(
    buildAdminUrl(
      'success',
      'Informasi umum berhasil diperbarui.'
    )
  );
}

export async function toggleInformasiUmumAction(
  formData: FormData
) {
  await requireAdmin();

  const id =
    getNumber(
      formData,
      'id'
    );

  const aktif =
    getBoolean(
      formData,
      'aktif'
    );

  const {
    error,
  } = await supabaseAdmin
    .from(
      'informasi_umum'
    )
    .update({
      aktif,

      updated_at:
        new Date()
          .toISOString(),
    })
    .eq('id', id);

  if (error) {
    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidateInformasiPublik();

  redirect(
    buildAdminUrl(
      'success',
      'Status informasi umum berhasil diperbarui.'
    )
  );
}

export async function hapusInformasiUmumAction(
  formData: FormData
) {
  await requireAdmin();

  const id =
    getNumber(
      formData,
      'id'
    );

  const {
    error,
  } = await supabaseAdmin
    .from(
      'informasi_umum'
    )
    .delete()
    .eq('id', id);

  if (error) {
    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidateInformasiPublik();

  redirect(
    buildAdminUrl(
      'success',
      'Informasi umum berhasil dihapus.'
    )
  );
}