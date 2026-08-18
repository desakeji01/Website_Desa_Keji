// app/admin/ppid/actions.ts

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

const PPID_KEY =
  'utama';

const PROFIL_KEY =
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
  return Number(
    getString(
      formData,
      key
    )
  );
}

function isValidEmail(
  value: string
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
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

function buildUrl(
  type:
    | 'success'
    | 'error',
  message: string,
  section?: string
) {
  const params =
    new URLSearchParams({
      [type]: message,
    });

  const anchor =
    section
      ? `#${section}`
      : '';

  return `/admin/ppid?${params.toString()}${anchor}`;
}

function revalidatePpid() {
  revalidatePath(
    '/admin/ppid'
  );

  revalidatePath(
    '/ppid'
  );

  revalidatePath(
    '/ppid/profil'
  );

  revalidatePath(
    '/ppid/apa-itu-ppid'
  );

  revalidatePath(
    '/ppid/klasifikasi-informasi'
  );

  revalidatePath(
    '/ppid/permohonan-informasi'
  );

  revalidatePath(
    '/ppid/pengajuan-keberatan'
  );

  revalidatePath(
    '/admin'
  );
}

/* =========================================================
   PENGATURAN UMUM PPID
========================================================= */

export async function simpanPpidSettingsAction(
  formData: FormData
) {
  await requireAdmin();

  const input = {
    header_label:
      getString(
        formData,
        'header_label'
      ),

    office_name:
      getString(
        formData,
        'office_name'
      ),

    office_address:
      getString(
        formData,
        'office_address'
      ),

    office_email:
      getString(
        formData,
        'office_email'
      ),

    office_phone:
      getString(
        formData,
        'office_phone'
      ),

    office_hours:
      getString(
        formData,
        'office_hours'
      ),

    apa_title:
      getString(
        formData,
        'apa_title'
      ),

    apa_description:
      getString(
        formData,
        'apa_description'
      ),

    apa_hero_label:
      getString(
        formData,
        'apa_hero_label'
      ),

    apa_hero_title:
      getString(
        formData,
        'apa_hero_title'
      ),

    apa_hero_description:
      getString(
        formData,
        'apa_hero_description'
      ),

    klasifikasi_title:
      getString(
        formData,
        'klasifikasi_title'
      ),

    klasifikasi_description:
      getString(
        formData,
        'klasifikasi_description'
      ),

    klasifikasi_hero_label:
      getString(
        formData,
        'klasifikasi_hero_label'
      ),

    klasifikasi_hero_title:
      getString(
        formData,
        'klasifikasi_hero_title'
      ),

    klasifikasi_hero_description:
      getString(
        formData,
        'klasifikasi_hero_description'
      ),

    permohonan_title:
      getString(
        formData,
        'permohonan_title'
      ),

    permohonan_description:
      getString(
        formData,
        'permohonan_description'
      ),

    permohonan_hero_label:
      getString(
        formData,
        'permohonan_hero_label'
      ),

    permohonan_hero_title:
      getString(
        formData,
        'permohonan_hero_title'
      ),

    permohonan_hero_description:
      getString(
        formData,
        'permohonan_hero_description'
      ),

    permohonan_poster_url:
      getString(
        formData,
        'permohonan_poster_url'
      ),

    permohonan_poster_alt:
      getString(
        formData,
        'permohonan_poster_alt'
      ),

    permohonan_form_url:
      getString(
        formData,
        'permohonan_form_url'
      ),

    keberatan_title:
      getString(
        formData,
        'keberatan_title'
      ),

    keberatan_description:
      getString(
        formData,
        'keberatan_description'
      ),

    keberatan_hero_label:
      getString(
        formData,
        'keberatan_hero_label'
      ),

    keberatan_hero_title:
      getString(
        formData,
        'keberatan_hero_title'
      ),

    keberatan_hero_description:
      getString(
        formData,
        'keberatan_hero_description'
      ),

    keberatan_poster_url:
      getString(
        formData,
        'keberatan_poster_url'
      ),

    keberatan_poster_alt:
      getString(
        formData,
        'keberatan_poster_alt'
      ),

    keberatan_form_url:
      getString(
        formData,
        'keberatan_form_url'
      ),
  };

  if (
    Object.values(input).some(
      (value) =>
        value.length === 0
    )
  ) {
    redirect(
      buildUrl(
        'error',
        'Semua kolom pengaturan umum PPID wajib diisi.',
        'pengaturan-umum'
      )
    );
  }

  if (
    !isValidEmail(
      input.office_email
    )
  ) {
    redirect(
      buildUrl(
        'error',
        'Alamat email PPID tidak valid.',
        'pengaturan-umum'
      )
    );
  }

  const resourceUrls = [
    input.permohonan_poster_url,
    input.permohonan_form_url,
    input.keberatan_poster_url,
    input.keberatan_form_url,
  ];

  if (
    resourceUrls.some(
      (value) =>
        !isValidResourceUrl(
          value
        )
    )
  ) {
    redirect(
      buildUrl(
        'error',
        'URL poster dan formulir harus dimulai dengan /, http://, atau https://.',
        'pengaturan-umum'
      )
    );
  }

  const {
    error,
  } = await supabaseAdmin
    .from(
      'ppid_settings'
    )
    .upsert(
      {
        ppid_key:
          PPID_KEY,

        ...input,

        updated_at:
          new Date()
            .toISOString(),
      },
      {
        onConflict:
          'ppid_key',
      }
    );

  if (error) {
    console.error(
      'Gagal menyimpan pengaturan umum PPID:',
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
      buildUrl(
        'error',
        error.message,
        'pengaturan-umum'
      )
    );
  }

  revalidatePpid();

  redirect(
    buildUrl(
      'success',
      'Pengaturan umum PPID berhasil diperbarui.',
      'pengaturan-umum'
    )
  );
}

/* =========================================================
   PROFIL PPID
========================================================= */

interface ProfilPpidInput {
  judul: string;
  deskripsi: string;
  email: string;
  telepon: string;
  alamat: string;
  jamLayanan: string;
  aktif: boolean;
}

function parseProfilPpid(
  formData: FormData
): ProfilPpidInput {
  return {
    judul:
      getString(
        formData,
        'profil_judul'
      ),

    deskripsi:
      getString(
        formData,
        'profil_deskripsi'
      ),

    email:
      getString(
        formData,
        'profil_email'
      ),

    telepon:
      getString(
        formData,
        'profil_telepon'
      ),

    alamat:
      getString(
        formData,
        'profil_alamat'
      ),

    jamLayanan:
      getString(
        formData,
        'profil_jam_layanan'
      ),

    aktif:
      getBoolean(
        formData,
        'profil_aktif'
      ),
  };
}

function validateProfilPpid(
  input: ProfilPpidInput
) {
  if (
    input.judul.length < 3
  ) {
    return 'Judul profil minimal terdiri dari 3 karakter.';
  }

  if (
    input.deskripsi.length <
    20
  ) {
    return 'Deskripsi profil minimal terdiri dari 20 karakter.';
  }

  if (
    input.email &&
    !isValidEmail(
      input.email
    )
  ) {
    return 'Alamat email profil PPID tidak valid.';
  }

  if (
    input.alamat.length < 5
  ) {
    return 'Alamat pelayanan minimal terdiri dari 5 karakter.';
  }

  if (
    input.jamLayanan.length <
    5
  ) {
    return 'Jam pelayanan harus diisi dengan benar.';
  }

  return null;
}

export async function simpanProfilPpidAction(
  formData: FormData
) {
  await requireAdmin();

  const input =
    parseProfilPpid(
      formData
    );

  const validationError =
    validateProfilPpid(
      input
    );

  if (validationError) {
    redirect(
      buildUrl(
        'error',
        validationError,
        'profil-ppid'
      )
    );
  }

  const {
    error,
  } = await supabaseAdmin
    .from(
      'profil_ppid'
    )
    .upsert(
      {
        profil_key:
          PROFIL_KEY,

        judul:
          input.judul,

        deskripsi:
          input.deskripsi,

        email:
          input.email ||
          null,

        telepon:
          input.telepon ||
          null,

        alamat:
          input.alamat,

        jam_layanan:
          input.jamLayanan,

        aktif:
          input.aktif,

        updated_at:
          new Date()
            .toISOString(),
      },
      {
        onConflict:
          'profil_key',
      }
    );

  if (error) {
    console.error(
      'Gagal menyimpan profil PPID:',
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
      buildUrl(
        'error',
        error.message,
        'profil-ppid'
      )
    );
  }

  revalidatePpid();

  redirect(
    buildUrl(
      'success',
      'Profil PPID berhasil diperbarui.',
      'profil-ppid'
    )
  );
}

/* =========================================================
   PENGURUS PPID
========================================================= */

interface PengurusPpidInput {
  nama: string;
  jabatanDesa: string;
  jabatanPpid: string;
  urutan: number;
  aktif: boolean;
}

function parsePengurusPpid(
  formData: FormData
): PengurusPpidInput {
  return {
    nama:
      getString(
        formData,
        'nama'
      ),

    jabatanDesa:
      getString(
        formData,
        'jabatan_desa'
      ),

    jabatanPpid:
      getString(
        formData,
        'jabatan_ppid'
      ),

    urutan:
      getNumber(
        formData,
        'urutan'
      ),

    aktif:
      getBoolean(
        formData,
        'aktif'
      ),
  };
}

function validatePengurusPpid(
  input: PengurusPpidInput
) {
  if (
    input.nama.length < 2
  ) {
    return 'Nama pengurus minimal terdiri dari 2 karakter.';
  }

  if (
    input.jabatanDesa.length <
    2
  ) {
    return 'Jabatan desa harus diisi.';
  }

  if (
    input.jabatanPpid.length <
    2
  ) {
    return 'Jabatan dalam PPID harus diisi.';
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

function pengurusPayload(
  input: PengurusPpidInput
) {
  return {
    nama:
      input.nama,

    jabatan_desa:
      input.jabatanDesa,

    jabatan_ppid:
      input.jabatanPpid,

    urutan:
      input.urutan,

    aktif:
      input.aktif,

    updated_at:
      new Date()
        .toISOString(),
  };
}

export async function tambahPengurusPpidAction(
  formData: FormData
) {
  await requireAdmin();

  const input =
    parsePengurusPpid(
      formData
    );

  const validationError =
    validatePengurusPpid(
      input
    );

  if (validationError) {
    redirect(
      buildUrl(
        'error',
        validationError,
        'pengurus-ppid'
      )
    );
  }

  const {
    error,
  } = await supabaseAdmin
    .from(
      'ppid_pengurus'
    )
    .insert(
      pengurusPayload(
        input
      )
    );

  if (error) {
    console.error(
      'Gagal menambahkan pengurus PPID:',
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
      buildUrl(
        'error',
        error.message,
        'pengurus-ppid'
      )
    );
  }

  revalidatePpid();

  redirect(
    buildUrl(
      'success',
      'Pengurus PPID berhasil ditambahkan.',
      'pengurus-ppid'
    )
  );
}

export async function ubahPengurusPpidAction(
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
      buildUrl(
        'error',
        'ID pengurus PPID tidak valid.',
        'pengurus-ppid'
      )
    );
  }

  const input =
    parsePengurusPpid(
      formData
    );

  const validationError =
    validatePengurusPpid(
      input
    );

  if (validationError) {
    redirect(
      buildUrl(
        'error',
        validationError,
        'pengurus-ppid'
      )
    );
  }

  const {
    error,
  } = await supabaseAdmin
    .from(
      'ppid_pengurus'
    )
    .update(
      pengurusPayload(
        input
      )
    )
    .eq(
      'id',
      id
    );

  if (error) {
    console.error(
      'Gagal memperbarui pengurus PPID:',
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
      buildUrl(
        'error',
        error.message,
        'pengurus-ppid'
      )
    );
  }

  revalidatePpid();

  redirect(
    buildUrl(
      'success',
      'Pengurus PPID berhasil diperbarui.',
      'pengurus-ppid'
    )
  );
}

export async function togglePengurusPpidAction(
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
      buildUrl(
        'error',
        'ID pengurus PPID tidak valid.',
        'pengurus-ppid'
      )
    );
  }

  const {
    error,
  } = await supabaseAdmin
    .from(
      'ppid_pengurus'
    )
    .update({
      aktif,

      updated_at:
        new Date()
          .toISOString(),
    })
    .eq(
      'id',
      id
    );

  if (error) {
    console.error(
      'Gagal mengubah status pengurus PPID:',
      error
    );

    redirect(
      buildUrl(
        'error',
        error.message,
        'pengurus-ppid'
      )
    );
  }

  revalidatePpid();

  redirect(
    buildUrl(
      'success',
      aktif
        ? 'Pengurus PPID berhasil diaktifkan.'
        : 'Pengurus PPID berhasil dinonaktifkan.',
      'pengurus-ppid'
    )
  );
}

export async function hapusPengurusPpidAction(
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
      buildUrl(
        'error',
        'ID pengurus PPID tidak valid.',
        'pengurus-ppid'
      )
    );
  }

  const {
    error,
  } = await supabaseAdmin
    .from(
      'ppid_pengurus'
    )
    .delete()
    .eq(
      'id',
      id
    );

  if (error) {
    console.error(
      'Gagal menghapus pengurus PPID:',
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
      buildUrl(
        'error',
        error.message,
        'pengurus-ppid'
      )
    );
  }

  revalidatePpid();

  redirect(
    buildUrl(
      'success',
      'Pengurus PPID berhasil dihapus.',
      'pengurus-ppid'
    )
  );
}