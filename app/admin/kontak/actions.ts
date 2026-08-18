// app/admin/kontak/actions.ts

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
  KONTAK_ICON_KEYS,
  type KontakActionState,
  type KontakIconKey,
} from '@/types/kontak-desa';

const KONTAK_KEY = 'utama';

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
    formData.get(key) ?? ''
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

function revalidateKontak() {
  revalidatePath(
    '/admin/kontak'
  );

  revalidatePath(
    '/kontak'
  );

  revalidatePath(
    '/admin'
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

export async function simpanPengaturanKontakAction(
  previousState:
    KontakActionState,
  formData: FormData
): Promise<KontakActionState> {
  void previousState;

  await requireAdmin();

  const input = {
    label_header:
      getString(
        formData,
        'label_header'
      ),

    judul_halaman:
      getString(
        formData,
        'judul_halaman'
      ),

    deskripsi_halaman:
      getString(
        formData,
        'deskripsi_halaman'
      ),

    judul_hero:
      getString(
        formData,
        'judul_hero'
      ),

    deskripsi_hero:
      getString(
        formData,
        'deskripsi_hero'
      ),

    alamat_kantor:
      getString(
        formData,
        'alamat_kantor'
      ),

    estimasi_pelayanan:
      getString(
        formData,
        'estimasi_pelayanan'
      ),

    label_biaya:
      getString(
        formData,
        'label_biaya'
      ),

    judul_daftar_kontak:
      getString(
        formData,
        'judul_daftar_kontak'
      ),

    deskripsi_daftar_kontak:
      getString(
        formData,
        'deskripsi_daftar_kontak'
      ),

    judul_poster:
      getString(
        formData,
        'judul_poster'
      ),

    deskripsi_poster:
      getString(
        formData,
        'deskripsi_poster'
      ),

    poster_url:
      getString(
        formData,
        'poster_url'
      ),

    poster_alt:
      getString(
        formData,
        'poster_alt'
      ),

    judul_jadwal:
      getString(
        formData,
        'judul_jadwal'
      ),

    judul_etika:
      getString(
        formData,
        'judul_etika'
      ),

    deskripsi_etika:
      getString(
        formData,
        'deskripsi_etika'
      ),

    judul_darurat:
      getString(
        formData,
        'judul_darurat'
      ),

    deskripsi_darurat:
      getString(
        formData,
        'deskripsi_darurat'
      ),
  };

  const requiredValues =
    Object.values(input);

  if (
    requiredValues.some(
      (value) =>
        value.length === 0
    )
  ) {
    return {
      success: false,
      message:
        'Semua kolom wajib harus diisi.',
    };
  }

  if (
    !isValidResourceUrl(
      input.poster_url
    )
  ) {
    return {
      success: false,
      message:
        'Path poster harus dimulai dengan /, http://, atau https://.',
    };
  }

  const {
    error,
  } = await supabaseAdmin
    .from('kontak_desa')
    .upsert(
      {
        kontak_key:
          KONTAK_KEY,

        ...input,

        updated_at:
          new Date()
            .toISOString(),
      },
      {
        onConflict:
          'kontak_key',
      }
    );

  if (error) {
    console.error(
      'Gagal menyimpan pengaturan kontak:',
      error
    );

    return {
      success: false,
      message:
        error.message ||
        'Pengaturan kontak gagal disimpan.',
    };
  }

  revalidateKontak();

  return {
    success: true,
    message:
      'Pengaturan halaman kontak berhasil diperbarui.',
  };
}

interface KontakInput {
  nama: string;
  jabatan: string;
  nomor: string;
  deskripsi: string;
  iconKey: string;
  featured: boolean;
  aktif: boolean;
  urutan: number;
}

function parseKontak(
  formData: FormData
): KontakInput {
  return {
    nama:
      getString(
        formData,
        'nama'
      ),

    jabatan:
      getString(
        formData,
        'jabatan'
      ),

    nomor:
      getString(
        formData,
        'nomor'
      ),

    deskripsi:
      getString(
        formData,
        'deskripsi'
      ),

    iconKey:
      getString(
        formData,
        'icon_key'
      ),

    featured:
      getBoolean(
        formData,
        'featured'
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

function validateKontak(
  input: KontakInput
) {
  if (
    input.nama.length < 2 ||
    input.jabatan.length < 2
  ) {
    return 'Nama dan jabatan minimal terdiri dari 2 karakter.';
  }

  if (
    input.nomor.replace(
      /\D/g,
      ''
    ).length < 8
  ) {
    return 'Nomor telepon tidak valid.';
  }

  if (
    input.deskripsi.length <
    10
  ) {
    return 'Deskripsi kontak minimal 10 karakter.';
  }

  if (
    !(
      KONTAK_ICON_KEYS as
        readonly string[]
    ).includes(
      input.iconKey
    )
  ) {
    return 'Ikon kontak tidak valid.';
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

function kontakPayload(
  input: KontakInput
) {
  return {
    nama:
      input.nama,

    jabatan:
      input.jabatan,

    nomor:
      input.nomor,

    deskripsi:
      input.deskripsi,

    icon_key:
      input.iconKey as
        KontakIconKey,

    featured:
      input.featured,

    aktif:
      input.aktif,

    urutan:
      input.urutan,

    updated_at:
      new Date()
        .toISOString(),
  };
}

export async function tambahKontakAction(
  previousState:
    KontakActionState,
  formData: FormData
): Promise<KontakActionState> {
  void previousState;

  await requireAdmin();

  const input =
    parseKontak(formData);

  const validationError =
    validateKontak(input);

  if (validationError) {
    return {
      success: false,
      message:
        validationError,
    };
  }

  const {
    error,
  } = await supabaseAdmin
    .from(
      'kontak_desa_item'
    )
    .insert(
      kontakPayload(input)
    );

  if (error) {
    return {
      success: false,
      message:
        error.message,
    };
  }

  revalidateKontak();

  redirect(
    '/admin/kontak?status=kontak-created'
  );
}

export async function ubahKontakAction(
  id: number,
  previousState:
    KontakActionState,
  formData: FormData
): Promise<KontakActionState> {
  void previousState;

  await requireAdmin();

  const input =
    parseKontak(formData);

  const validationError =
    validateKontak(input);

  if (validationError) {
    return {
      success: false,
      message:
        validationError,
    };
  }

  const {
    error,
  } = await supabaseAdmin
    .from(
      'kontak_desa_item'
    )
    .update(
      kontakPayload(input)
    )
    .eq('id', id);

  if (error) {
    return {
      success: false,
      message:
        error.message,
    };
  }

  revalidateKontak();

  redirect(
    '/admin/kontak?status=kontak-updated'
  );
}

export async function toggleKontakAction(
  formData: FormData
) {
  await requireAdmin();

  const id =
    Number(
      formData.get('id')
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
      'kontak_desa_item'
    )
    .update({
      aktif,
      updated_at:
        new Date()
          .toISOString(),
    })
    .eq('id', id);

  if (error) {
    throw new Error(
      'Status kontak gagal diperbarui.'
    );
  }

  revalidateKontak();
}

export async function hapusKontakAction(
  formData: FormData
) {
  await requireAdmin();

  const id =
    Number(
      formData.get('id')
    );

  const {
    error,
  } = await supabaseAdmin
    .from(
      'kontak_desa_item'
    )
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(
      'Kontak gagal dihapus.'
    );
  }

  revalidateKontak();
}

interface JadwalInput {
  hari: string;
  waktu: string;
  isLibur: boolean;
  aktif: boolean;
  urutan: number;
}

function parseJadwal(
  formData: FormData
): JadwalInput {
  return {
    hari:
      getString(
        formData,
        'hari'
      ),

    waktu:
      getString(
        formData,
        'waktu'
      ),

    isLibur:
      getBoolean(
        formData,
        'is_libur'
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

function validateJadwal(
  input: JadwalInput
) {
  if (
    input.hari.length < 2 ||
    input.waktu.length < 2
  ) {
    return 'Hari dan waktu pelayanan harus diisi.';
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

function jadwalPayload(
  input: JadwalInput
) {
  return {
    hari:
      input.hari,

    waktu:
      input.waktu,

    is_libur:
      input.isLibur,

    aktif:
      input.aktif,

    urutan:
      input.urutan,

    updated_at:
      new Date()
        .toISOString(),
  };
}

export async function tambahJadwalAction(
  previousState:
    KontakActionState,
  formData: FormData
): Promise<KontakActionState> {
  void previousState;

  await requireAdmin();

  const input =
    parseJadwal(formData);

  const validationError =
    validateJadwal(input);

  if (validationError) {
    return {
      success: false,
      message:
        validationError,
    };
  }

  const {
    error,
  } = await supabaseAdmin
    .from(
      'jadwal_pelayanan_desa'
    )
    .insert(
      jadwalPayload(input)
    );

  if (error) {
    return {
      success: false,
      message:
        error.message,
    };
  }

  revalidateKontak();

  redirect(
    '/admin/kontak?status=jadwal-created'
  );
}

export async function ubahJadwalAction(
  id: number,
  previousState:
    KontakActionState,
  formData: FormData
): Promise<KontakActionState> {
  void previousState;

  await requireAdmin();

  const input =
    parseJadwal(formData);

  const validationError =
    validateJadwal(input);

  if (validationError) {
    return {
      success: false,
      message:
        validationError,
    };
  }

  const {
    error,
  } = await supabaseAdmin
    .from(
      'jadwal_pelayanan_desa'
    )
    .update(
      jadwalPayload(input)
    )
    .eq('id', id);

  if (error) {
    return {
      success: false,
      message:
        error.message,
    };
  }

  revalidateKontak();

  redirect(
    '/admin/kontak?status=jadwal-updated'
  );
}

export async function hapusJadwalAction(
  formData: FormData
) {
  await requireAdmin();

  const id =
    Number(
      formData.get('id')
    );

  const {
    error,
  } = await supabaseAdmin
    .from(
      'jadwal_pelayanan_desa'
    )
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(
      'Jadwal gagal dihapus.'
    );
  }

  revalidateKontak();
}

interface EtikaInput {
  teks: string;
  aktif: boolean;
  urutan: number;
}

function parseEtika(
  formData: FormData
): EtikaInput {
  return {
    teks:
      getString(
        formData,
        'teks'
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

function validateEtika(
  input: EtikaInput
) {
  if (
    input.teks.length < 5
  ) {
    return 'Isi etika minimal 5 karakter.';
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

function etikaPayload(
  input: EtikaInput
) {
  return {
    teks:
      input.teks,

    aktif:
      input.aktif,

    urutan:
      input.urutan,

    updated_at:
      new Date()
        .toISOString(),
  };
}

export async function tambahEtikaAction(
  previousState:
    KontakActionState,
  formData: FormData
): Promise<KontakActionState> {
  void previousState;

  await requireAdmin();

  const input =
    parseEtika(formData);

  const validationError =
    validateEtika(input);

  if (validationError) {
    return {
      success: false,
      message:
        validationError,
    };
  }

  const {
    error,
  } = await supabaseAdmin
    .from(
      'etika_pelayanan_desa'
    )
    .insert(
      etikaPayload(input)
    );

  if (error) {
    return {
      success: false,
      message:
        error.message,
    };
  }

  revalidateKontak();

  redirect(
    '/admin/kontak?status=etika-created'
  );
}

export async function ubahEtikaAction(
  id: number,
  previousState:
    KontakActionState,
  formData: FormData
): Promise<KontakActionState> {
  void previousState;

  await requireAdmin();

  const input =
    parseEtika(formData);

  const validationError =
    validateEtika(input);

  if (validationError) {
    return {
      success: false,
      message:
        validationError,
    };
  }

  const {
    error,
  } = await supabaseAdmin
    .from(
      'etika_pelayanan_desa'
    )
    .update(
      etikaPayload(input)
    )
    .eq('id', id);

  if (error) {
    return {
      success: false,
      message:
        error.message,
    };
  }

  revalidateKontak();

  redirect(
    '/admin/kontak?status=etika-updated'
  );
}

export async function hapusEtikaAction(
  formData: FormData
) {
  await requireAdmin();

  const id =
    Number(
      formData.get('id')
    );

  const {
    error,
  } = await supabaseAdmin
    .from(
      'etika_pelayanan_desa'
    )
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(
      'Etika pelayanan gagal dihapus.'
    );
  }

  revalidateKontak();
}