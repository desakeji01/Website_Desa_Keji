// app/admin/peta/actions.ts

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
  PetaActionState,
} from '@/types/peta';

const PETA_KEY =
  'utama';

/* =========================================================
   AUTH
========================================================= */

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
    redirect(
      '/login'
    );
  }
}

/* =========================================================
   HELPERS
========================================================= */

function getString(
  formData:
    FormData,

  key:
    string
) {
  return String(
    formData.get(
      key
    ) ??
      ''
  ).trim();
}

function getBoolean(
  formData:
    FormData,

  key:
    string
) {
  return (
    getString(
      formData,
      key
    ) ===
    'true'
  );
}

function isHttpUrl(
  value:
    string
) {
  try {
    const url =
      new URL(
        value
      );

    return (
      url.protocol ===
        'http:' ||
      url.protocol ===
        'https:'
    );
  } catch {
    return false;
  }
}

function revalidatePeta() {
  revalidatePath(
    '/admin/peta'
  );

  revalidatePath(
    '/peta'
  );

  revalidatePath(
    '/admin'
  );
}

/* =========================================================
   PETA DESA UTAMA
========================================================= */

export async function simpanPetaDesaAction(
  previousState:
    PetaActionState,

  formData:
    FormData
): Promise<PetaActionState> {
  void previousState;

  await requireAdmin();

  const labelSekseksi =
    getString(
      formData,
      'label_seksi'
    );

  const judulHalaman =
    getString(
      formData,
      'judul_halaman'
    );

  const deskripsi =
    getString(
      formData,
      'deskripsi'
    );

  const tombolLabel =
    getString(
      formData,
      'tombol_label'
    );

  const mapsLinkUrl =
    getString(
      formData,
      'maps_link_url'
    );

  const mapsEmbedUrl =
    getString(
      formData,
      'maps_embed_url'
    );

  const iframeTitle =
    getString(
      formData,
      'iframe_title'
    );

  const tinggiPeta =
    Number(
      getString(
        formData,
        'tinggi_peta'
      )
    );

  const requiredValues = [
    labelSekseksi,
    judulHalaman,
    deskripsi,
    tombolLabel,
    mapsLinkUrl,
    mapsEmbedUrl,
    iframeTitle,
  ];

  if (
    requiredValues.some(
      (
        value
      ) =>
        value.length ===
        0
    )
  ) {
    return {
      success:
        false,

      message:
        'Semua kolom wajib harus diisi.',
    };
  }

  if (
    labelSekseksi.length >
    100
  ) {
    return {
      success:
        false,

      message:
        'Label bagian maksimal 100 karakter.',
    };
  }

  if (
    judulHalaman.length >
    200
  ) {
    return {
      success:
        false,

      message:
        'Judul halaman maksimal 200 karakter.',
    };
  }

  if (
    deskripsi.length >
    1000
  ) {
    return {
      success:
        false,

      message:
        'Deskripsi maksimal 1.000 karakter.',
    };
  }

  if (
    tombolLabel.length >
    100
  ) {
    return {
      success:
        false,

      message:
        'Label tombol maksimal 100 karakter.',
    };
  }

  if (
    iframeTitle.length >
    200
  ) {
    return {
      success:
        false,

      message:
        'Judul iframe maksimal 200 karakter.',
    };
  }

  if (
    !isHttpUrl(
      mapsLinkUrl
    )
  ) {
    return {
      success:
        false,

      message:
        'URL aplikasi Maps tidak valid.',
    };
  }

  if (
    !isHttpUrl(
      mapsEmbedUrl
    )
  ) {
    return {
      success:
        false,

      message:
        'URL embed Google Maps tidak valid.',
    };
  }

  if (
    !Number.isInteger(
      tinggiPeta
    ) ||
    tinggiPeta <
      300 ||
    tinggiPeta >
      900
  ) {
    return {
      success:
        false,

      message:
        'Tinggi peta harus berupa angka antara 300 sampai 900 piksel.',
    };
  }

  try {
    const {
      error,
    } =
      await supabaseAdmin
        .from(
          'peta_desa'
        )
        .upsert(
          {
            peta_key:
              PETA_KEY,

            label_seksi:
              labelSekseksi,

            judul_halaman:
              judulHalaman,

            deskripsi,

            tombol_label:
              tombolLabel,

            maps_link_url:
              mapsLinkUrl,

            maps_embed_url:
              mapsEmbedUrl,

            iframe_title:
              iframeTitle,

            tinggi_peta:
              tinggiPeta,

            updated_at:
              new Date()
                .toISOString(),
          },
          {
            onConflict:
              'peta_key',
          }
        );

    if (
      error
    ) {
      console.error(
        'Gagal menyimpan peta desa:',
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

      return {
        success:
          false,

        message:
          error.message ||
          'Konfigurasi peta gagal disimpan.',
      };
    }

    revalidatePeta();

    return {
      success:
        true,

      message:
        'Konfigurasi peta desa berhasil diperbarui.',
    };
  } catch (
    error
  ) {
    console.error(
      'Kesalahan menyimpan peta desa:',
      error
    );

    return {
      success:
        false,

      message:
        error instanceof
        Error
          ? error.message
          : 'Terjadi kesalahan saat menyimpan peta desa.',
    };
  }
}

/* =========================================================
   UPDATE TITIK PETA ADMINISTRASI
========================================================= */

export async function simpanLokasiAdministrasiAction(
  formData:
    FormData
) {
  await requireAdmin();

  const id =
    getString(
      formData,
      'id'
    );

  const nama =
    getString(
      formData,
      'nama'
    );

  const kategori =
    getString(
      formData,
      'kategori'
    );

  const mapsUrl =
    getString(
      formData,
      'maps_url'
    );

  const posisiX =
    Number(
      getString(
        formData,
        'posisi_x'
      )
    );

  const posisiY =
    Number(
      getString(
        formData,
        'posisi_y'
      )
    );

  const urutan =
    Number(
      getString(
        formData,
        'urutan'
      )
    );

  const aktif =
    getBoolean(
      formData,
      'aktif'
    );

  if (!id) {
    throw new Error(
      'ID lokasi tidak valid.'
    );
  }

  if (
    nama.length <
      2 ||
    nama.length >
      150
  ) {
    throw new Error(
      'Nama lokasi harus terdiri dari 2 sampai 150 karakter.'
    );
  }

  if (
    kategori.length <
      2 ||
    kategori.length >
      100
  ) {
    throw new Error(
      'Kategori lokasi harus terdiri dari 2 sampai 100 karakter.'
    );
  }

  if (
    mapsUrl &&
    !isHttpUrl(
      mapsUrl
    )
  ) {
    throw new Error(
      'URL Google Maps lokasi tidak valid.'
    );
  }

  if (
    !Number.isFinite(
      posisiX
    ) ||
    posisiX <
      0 ||
    posisiX >
      100
  ) {
    throw new Error(
      'Posisi X harus berada antara 0 sampai 100.'
    );
  }

  if (
    !Number.isFinite(
      posisiY
    ) ||
    posisiY <
      0 ||
    posisiY >
      100
  ) {
    throw new Error(
      'Posisi Y harus berada antara 0 sampai 100.'
    );
  }

  if (
    !Number.isInteger(
      urutan
    ) ||
    urutan <
      0
  ) {
    throw new Error(
      'Urutan lokasi tidak valid.'
    );
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'peta_administrasi_lokasi'
      )
      .update({
        nama,

        kategori,

        maps_url:
          mapsUrl ||
          null,

        posisi_x:
          posisiX,

        posisi_y:
          posisiY,

        aktif,

        urutan,

        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        'id',
        id
      );

  if (
    error
  ) {
    throw new Error(
      `Lokasi gagal diperbarui: ${error.message}`
    );
  }

  revalidatePeta();

  redirect(
    '/admin/peta?status=lokasi-updated#lokasi-administrasi'
  );
}

/* =========================================================
   TAMBAH TITIK ADMINISTRASI
========================================================= */

export async function tambahLokasiAdministrasiAction(
  formData:
    FormData
) {
  await requireAdmin();

  const kode =
    getString(
      formData,
      'kode'
    )
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        '-'
      )
      .replace(
        /^-+|-+$/g,
        ''
      );

  const nama =
    getString(
      formData,
      'nama'
    );

  const kategori =
    getString(
      formData,
      'kategori'
    );

  const mapsUrl =
    getString(
      formData,
      'maps_url'
    );

  const posisiX =
    Number(
      getString(
        formData,
        'posisi_x'
      )
    );

  const posisiY =
    Number(
      getString(
        formData,
        'posisi_y'
      )
    );

  const urutan =
    Number(
      getString(
        formData,
        'urutan'
      )
    );

  if (
    !kode ||
    !nama ||
    !kategori
  ) {
    throw new Error(
      'Kode, nama, dan kategori wajib diisi.'
    );
  }

  if (
    mapsUrl &&
    !isHttpUrl(
      mapsUrl
    )
  ) {
    throw new Error(
      'URL Google Maps tidak valid.'
    );
  }

  if (
    !Number.isFinite(
      posisiX
    ) ||
    posisiX <
      0 ||
    posisiX >
      100 ||
    !Number.isFinite(
      posisiY
    ) ||
    posisiY <
      0 ||
    posisiY >
      100
  ) {
    throw new Error(
      'Posisi titik harus berada antara 0 sampai 100 persen.'
    );
  }

  if (
    !Number.isInteger(
      urutan
    ) ||
    urutan <
      0
  ) {
    throw new Error(
      'Urutan lokasi tidak valid.'
    );
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'peta_administrasi_lokasi'
      )
      .insert({
        kode,

        nama,

        kategori,

        maps_url:
          mapsUrl ||
          null,

        posisi_x:
          posisiX,

        posisi_y:
          posisiY,

        aktif:
          true,

        urutan,

        created_at:
          new Date()
            .toISOString(),

        updated_at:
          new Date()
            .toISOString(),
      });

  if (
    error
  ) {
    throw new Error(
      error.code ===
      '23505'
        ? 'Kode lokasi sudah digunakan.'
        : `Lokasi gagal ditambahkan: ${error.message}`
    );
  }

  revalidatePeta();

  redirect(
    '/admin/peta?status=lokasi-created#lokasi-administrasi'
  );
}

/* =========================================================
   HAPUS TITIK
========================================================= */

export async function hapusLokasiAdministrasiAction(
  formData:
    FormData
) {
  await requireAdmin();

  const id =
    getString(
      formData,
      'id'
    );

  if (!id) {
    throw new Error(
      'ID lokasi tidak valid.'
    );
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'peta_administrasi_lokasi'
      )
      .delete()
      .eq(
        'id',
        id
      );

  if (
    error
  ) {
    throw new Error(
      `Lokasi gagal dihapus: ${error.message}`
    );
  }

  revalidatePeta();

  redirect(
    '/admin/peta?status=lokasi-deleted#lokasi-administrasi'
  );
}