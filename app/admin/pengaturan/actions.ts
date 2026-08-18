// app/admin/pengaturan/actions.ts

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

import type {
  ProfilDesaActionState,
} from '@/types/profil-desa';

/* =========================================================
   CONFIG
========================================================= */

const PROFIL_KEY =
  'utama';

const ADMIN_PATH =
  '/admin/pengaturan';

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

  return user;
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

function getRequiredInteger(
  formData:
    FormData,

  fieldName:
    string,

  fieldLabel:
    string,

  options?: {
    min?:
      number;

    max?:
      number;
  }
) {
  const rawValue =
    getString(
      formData,
      fieldName
    );

  if (
    !rawValue
  ) {
    throw new Error(
      `${fieldLabel} wajib diisi.`
    );
  }

  const value =
    Number(
      rawValue
    );

  if (
    !Number.isInteger(
      value
    )
  ) {
    throw new Error(
      `${fieldLabel} harus berupa angka bulat.`
    );
  }

  const minimum =
    options?.min ??
    0;

  if (
    value <
    minimum
  ) {
    throw new Error(
      `${fieldLabel} minimal ${minimum}.`
    );
  }

  if (
    options?.max !==
      undefined &&
    value >
      options.max
  ) {
    throw new Error(
      `${fieldLabel} maksimal ${options.max}.`
    );
  }

  return value;
}

function isValidDate(
  value:
    string
) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  ) {
    return false;
  }

  const date =
    new Date(
      `${value}T00:00:00Z`
    );

  return (
    !Number.isNaN(
      date.getTime()
    )
  );
}

function isValidImageLocation(
  value:
    string
) {
  if (
    value.startsWith(
      '/'
    )
  ) {
    return true;
  }

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

function buildAdminUrl(
  type:
    | 'success'
    | 'error',

  message:
    string,

  section:
    string
) {
  const params =
    new URLSearchParams({
      [type]:
        message,
    });

  return (
    `${ADMIN_PATH}?` +
    `${params.toString()}` +
    `#${section}`
  );
}

/* =========================================================
   REVALIDATE PROFIL DESA
========================================================= */

function revalidateProfilDesa() {
  revalidatePath(
    '/'
  );

  revalidatePath(
    '/profil/data'
  );

  revalidatePath(
    '/admin'
  );

  revalidatePath(
    ADMIN_PATH
  );

  revalidatePath(
    '/api/profil-desa'
  );
}

/* =========================================================
   REVALIDATE SEJARAH
========================================================= */

function revalidateSejarah() {
  revalidatePath(
    ADMIN_PATH
  );

  revalidatePath(
    '/profil/sejarah'
  );

  revalidatePath(
    '/admin'
  );
}

/* =========================================================
   REVALIDATE VISI MISI
========================================================= */

function revalidateVisiMisi() {
  revalidatePath(
    ADMIN_PATH
  );

  revalidatePath(
    '/profil/visi-misi'
  );

  revalidatePath(
    '/admin'
  );
}

/* =========================================================
   PROFIL DESA
========================================================= */

export async function updateProfilDesaAction(
  _previousState:
    ProfilDesaActionState,

  formData:
    FormData
): Promise<ProfilDesaActionState> {
  await requireAdmin();

  try {
    const jumlahLakiLaki =
      getRequiredInteger(
        formData,
        'jumlah_laki_laki',
        'Jumlah penduduk laki-laki'
      );

    const jumlahPerempuan =
      getRequiredInteger(
        formData,
        'jumlah_perempuan',
        'Jumlah penduduk perempuan'
      );

    const jumlahDusun =
      getRequiredInteger(
        formData,
        'jumlah_dusun',
        'Jumlah dusun'
      );

    const jumlahRw =
      getRequiredInteger(
        formData,
        'jumlah_rw',
        'Jumlah RW'
      );

    const jumlahRt =
      getRequiredInteger(
        formData,
        'jumlah_rt',
        'Jumlah RT'
      );

    const tahunData =
      getRequiredInteger(
        formData,
        'tahun_data',
        'Tahun data',
        {
          min:
            2000,

          max:
            2100,
        }
      );

    const updatedAt =
      new Date()
        .toISOString();

    /*
     * Cek apakah profil utama
     * sudah tersedia.
     *
     * Ini lebih aman daripada
     * mengirim randomUUID pada
     * setiap UPSERT.
     */

    const {
      data:
        existingProfile,

      error:
        existingError,
    } =
      await supabaseAdmin
        .from(
          'profil_desa'
        )
        .select(
          'id'
        )
        .eq(
          'profil_key',
          PROFIL_KEY
        )
        .maybeSingle();

    if (
      existingError
    ) {
      throw new Error(
        existingError.message
      );
    }

    let saveError:
      {
        message:
          string;
      } | null =
      null;

    if (
      existingProfile
    ) {
      const {
        error,
      } =
        await supabaseAdmin
          .from(
            'profil_desa'
          )
          .update({
            jumlah_laki_laki:
              jumlahLakiLaki,

            jumlah_perempuan:
              jumlahPerempuan,

            jumlah_dusun:
              jumlahDusun,

            jumlah_rw:
              jumlahRw,

            jumlah_rt:
              jumlahRt,

            tahun_data:
              tahunData,

            updated_at:
              updatedAt,
          })
          .eq(
            'profil_key',
            PROFIL_KEY
          );

      saveError =
        error;
    } else {
      const {
        error,
      } =
        await supabaseAdmin
          .from(
            'profil_desa'
          )
          .insert({
            id:
              randomUUID(),

            profil_key:
              PROFIL_KEY,

            jumlah_laki_laki:
              jumlahLakiLaki,

            jumlah_perempuan:
              jumlahPerempuan,

            jumlah_dusun:
              jumlahDusun,

            jumlah_rw:
              jumlahRw,

            jumlah_rt:
              jumlahRt,

            tahun_data:
              tahunData,

            updated_at:
              updatedAt,
          });

      saveError =
        error;
    }

    if (
      saveError
    ) {
      console.error(
        'Gagal memperbarui profil desa:',
        saveError
      );

      throw new Error(
        saveError.message
      );
    }

    revalidateProfilDesa();

    return {
      error:
        null,

      success:
        'Data profil desa berhasil diperbarui.',
    };
  } catch (
    error
  ) {
    console.error(
      'Update profil desa error:',
      error
    );

    return {
      error:
        error instanceof
        Error
          ? error.message
          : 'Terjadi kesalahan saat memperbarui data profil desa.',

      success:
        null,
    };
  }
}

/* =========================================================
   SEJARAH DESA
========================================================= */

export async function simpanSejarahDesaAction(
  formData:
    FormData
) {
  await requireAdmin();

  const judul =
    getString(
      formData,
      'judul_halaman'
    );

  const tanggal =
    getString(
      formData,
      'tanggal_publikasi'
    );

  const penulis =
    getString(
      formData,
      'penulis'
    );

  const kategori =
    getString(
      formData,
      'kategori'
    );

  const gambarUrl =
    getString(
      formData,
      'gambar_url'
    );

  const pengantarUtama =
    getString(
      formData,
      'pengantar_utama'
    );

  const pengantarKedua =
    getString(
      formData,
      'pengantar_kedua'
    );

  /* =======================================================
     VALIDATION
  ======================================================= */

  if (
    judul.length <
    5
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Judul halaman sejarah minimal 5 karakter.',
        'pengaturan-sejarah'
      )
    );
  }

  if (
    judul.length >
    200
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Judul halaman sejarah maksimal 200 karakter.',
        'pengaturan-sejarah'
      )
    );
  }

  if (
    !isValidDate(
      tanggal
    )
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Tanggal publikasi sejarah tidak valid.',
        'pengaturan-sejarah'
      )
    );
  }

  if (
    penulis.length <
    2
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Nama penulis minimal 2 karakter.',
        'pengaturan-sejarah'
      )
    );
  }

  if (
    kategori.length <
    2
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Kategori minimal 2 karakter.',
        'pengaturan-sejarah'
      )
    );
  }

  if (
    !gambarUrl ||
    !isValidImageLocation(
      gambarUrl
    )
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Lokasi gambar harus berupa path seperti /background.png atau URL http/https.',
        'pengaturan-sejarah'
      )
    );
  }

  if (
    pengantarUtama.length <
    20
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Paragraf pengantar pertama minimal 20 karakter.',
        'pengaturan-sejarah'
      )
    );
  }

  if (
    pengantarKedua.length <
    20
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Paragraf pengantar kedua minimal 20 karakter.',
        'pengaturan-sejarah'
      )
    );
  }

  /* =======================================================
     SAVE
  ======================================================= */

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'profil_sejarah_settings'
      )
      .upsert(
        {
          setting_key:
            PROFIL_KEY,

          judul_halaman:
            judul,

          tanggal_publikasi:
            tanggal,

          penulis,

          kategori,

          gambar_url:
            gambarUrl,

          pengantar_utama:
            pengantarUtama,

          pengantar_kedua:
            pengantarKedua,

          updated_at:
            new Date()
              .toISOString(),
        },
        {
          onConflict:
            'setting_key',
        }
      );

  if (
    error
  ) {
    console.error(
      'Gagal menyimpan pengaturan sejarah:',
      error
    );

    redirect(
      buildAdminUrl(
        'error',
        error.message,
        'pengaturan-sejarah'
      )
    );
  }

  revalidateSejarah();

  redirect(
    buildAdminUrl(
      'success',
      'Pengaturan halaman Sejarah Desa berhasil diperbarui.',
      'pengaturan-sejarah'
    )
  );
}

/* =========================================================
   VISI MISI
========================================================= */

function parsePoinMisi(
  value:
    string
) {
  return value
    .split(
      /\r?\n/
    )
    .map(
      (
        item
      ) =>
        item.trim()
    )
    .filter(
      Boolean
    );
}

export async function simpanVisiMisiAction(
  formData:
    FormData
) {
  await requireAdmin();

  const judul =
    getString(
      formData,
      'judul_halaman'
    );

  const tanggal =
    getString(
      formData,
      'tanggal_publikasi'
    );

  const penulis =
    getString(
      formData,
      'penulis'
    );

  const kategori =
    getString(
      formData,
      'kategori'
    );

  const visi =
    getString(
      formData,
      'visi'
    );

  /* =======================================================
     VALIDASI UTAMA
  ======================================================= */

  if (
    judul.length <
    5
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Judul halaman Visi dan Misi minimal 5 karakter.',
        'pengaturan-visi-misi'
      )
    );
  }

  if (
    !isValidDate(
      tanggal
    )
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Tanggal publikasi Visi dan Misi tidak valid.',
        'pengaturan-visi-misi'
      )
    );
  }

  if (
    penulis.length <
    2
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Nama penulis minimal 2 karakter.',
        'pengaturan-visi-misi'
      )
    );
  }

  if (
    kategori.length <
    2
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Kategori minimal 2 karakter.',
        'pengaturan-visi-misi'
      )
    );
  }

  if (
    visi.length <
    20
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'Visi minimal terdiri dari 20 karakter.',
        'pengaturan-visi-misi'
      )
    );
  }

  /* =======================================================
     MISSION
  ======================================================= */

  const misi =
    Array.from(
      {
        length:
          4,
      },
      (
        _,
        index
      ) => {
        const nomor =
          index +
          1;

        return {
          id:
            nomor,

          bidang:
            getString(
              formData,
              `misi_${nomor}_bidang`
            ),

          tujuan:
            getString(
              formData,
              `misi_${nomor}_tujuan`
            ),

          poin:
            parsePoinMisi(
              getString(
                formData,
                `misi_${nomor}_poin`
              )
            ),
        };
      }
    );

  for (
    const item of
    misi
  ) {
    if (
      item.bidang.length <
      2
    ) {
      redirect(
        buildAdminUrl(
          'error',
          `Nama bidang Misi ${item.id} minimal 2 karakter.`,
          'pengaturan-visi-misi'
        )
      );
    }

    if (
      item.tujuan.length <
      10
    ) {
      redirect(
        buildAdminUrl(
          'error',
          `Tujuan Misi ${item.id} minimal 10 karakter.`,
          'pengaturan-visi-misi'
        )
      );
    }

    if (
      item.poin.length ===
      0
    ) {
      redirect(
        buildAdminUrl(
          'error',
          `Misi ${item.id} minimal memiliki satu poin.`,
          'pengaturan-visi-misi'
        )
      );
    }
  }

  /* =======================================================
     SAVE
  ======================================================= */

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        'profil_visi_misi_settings'
      )
      .upsert(
        {
          setting_key:
            PROFIL_KEY,

          judul_halaman:
            judul,

          tanggal_publikasi:
            tanggal,

          penulis,

          kategori,

          visi,

          misi,

          updated_at:
            new Date()
              .toISOString(),
        },
        {
          onConflict:
            'setting_key',
        }
      );

  if (
    error
  ) {
    console.error(
      'Gagal menyimpan Visi dan Misi:',
      error
    );

    redirect(
      buildAdminUrl(
        'error',
        error.message,
        'pengaturan-visi-misi'
      )
    );
  }

  revalidateVisiMisi();

  redirect(
    buildAdminUrl(
      'success',
      'Visi dan Misi Pemerintah Desa berhasil diperbarui.',
      'pengaturan-visi-misi'
    )
  );
}