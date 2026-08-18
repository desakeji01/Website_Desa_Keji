// app/admin/warga/actions.ts

'use server';

import {
  createHmac,
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
  WargaActionState,
} from '@/types/warga';

const ALLOWED_DUSUN = [
  'Dusun Keji',
  'Dusun Suruhan',
  'Dusun Sitoyo',
] as const;

const ALLOWED_JENIS_KELAMIN = [
  'L',
  'P',
] as const;

const ALLOWED_STATUS_PENDUDUK = [
  'TETAP',
  'TIDAK_TETAP',
] as const;

function getNikHashSecret() {
  const secret =
    process.env.NIK_HASH_SECRET;

  if (!secret) {
    throw new Error(
      'NIK_HASH_SECRET belum dikonfigurasi di .env.local.'
    );
  }

  if (secret.length < 32) {
    throw new Error(
      'NIK_HASH_SECRET minimal harus terdiri dari 32 karakter.'
    );
  }

  return secret;
}

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

function normalizeAngka(
  value: string
) {
  return value.replace(
    /\D/g,
    ''
  );
}

function normalizeNomorWilayah(
  value: string
) {
  const result =
    normalizeAngka(value);

  if (!result) {
    return null;
  }

  return result
    .slice(0, 3)
    .padStart(3, '0');
}

function hashNik(
  nik: string
) {
  return createHmac(
    'sha256',
    getNikHashSecret()
  )
    .update(nik)
    .digest('hex');
}

function hashNoKk(
  noKk: string
) {
  return createHmac(
    'sha256',
    getNikHashSecret()
  )
    .update(`kk:${noKk}`)
    .digest('hex');
}

function validateTanggalLahir(
  value: string
) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  ) {
    throw new Error(
      'Tanggal lahir wajib diisi.'
    );
  }

  const [
    tahun,
    bulan,
    tanggal,
  ] = value
    .split('-')
    .map(Number);

  const date =
    new Date(
      Date.UTC(
        tahun,
        bulan - 1,
        tanggal
      )
    );

  const tanggalValid =
    date.getUTCFullYear() ===
      tahun &&
    date.getUTCMonth() ===
      bulan - 1 &&
    date.getUTCDate() ===
      tanggal;

  if (!tanggalValid) {
    throw new Error(
      'Tanggal lahir tidak valid.'
    );
  }

  if (tahun < 1900) {
    throw new Error(
      'Tahun lahir tidak boleh kurang dari 1900.'
    );
  }

  const hariIni =
    new Date();

  const tanggalHariIni =
    Date.UTC(
      hariIni.getUTCFullYear(),
      hariIni.getUTCMonth(),
      hariIni.getUTCDate()
    );

  if (
    date.getTime() >
    tanggalHariIni
  ) {
    throw new Error(
      'Tanggal lahir tidak boleh melebihi tanggal hari ini.'
    );
  }

  const umurPerkiraan =
    hariIni.getUTCFullYear() -
    tahun;

  if (umurPerkiraan > 150) {
    throw new Error(
      'Tanggal lahir tidak valid karena usia melebihi 150 tahun.'
    );
  }
}

function validateWargaData({
  nik,
  noKk,
  namaLengkap,
  jenisKelamin,
  tanggalLahir,
  statusPenduduk,
  dusun,
  rw,
  rt,
  alamat,
  nomorWhatsApp,
}: {
  nik: string;
  noKk: string;
  namaLengkap: string;
  jenisKelamin: string;
  tanggalLahir: string;
  statusPenduduk: string;
  dusun: string;
  rw: string | null;
  rt: string | null;
  alamat: string;
  nomorWhatsApp: string;
}) {
  if (!/^\d{16}$/.test(nik)) {
    throw new Error(
      'NIK harus terdiri dari tepat 16 angka.'
    );
  }

  if (!/^\d{16}$/.test(noKk)) {
    throw new Error(
      'Nomor KK harus terdiri dari tepat 16 angka.'
    );
  }

  if (
    namaLengkap.length < 3 ||
    namaLengkap.length > 150
  ) {
    throw new Error(
      'Nama lengkap harus terdiri dari 3 sampai 150 karakter.'
    );
  }

  if (
    !ALLOWED_JENIS_KELAMIN.includes(
      jenisKelamin as
        (typeof ALLOWED_JENIS_KELAMIN)[number]
    )
  ) {
    throw new Error(
      'Jenis kelamin tidak valid.'
    );
  }

  validateTanggalLahir(
    tanggalLahir
  );

  if (
    !ALLOWED_STATUS_PENDUDUK.includes(
      statusPenduduk as
        (typeof ALLOWED_STATUS_PENDUDUK)[number]
    )
  ) {
    throw new Error(
      'Status penduduk tidak valid.'
    );
  }

  if (
    !ALLOWED_DUSUN.includes(
      dusun as
        (typeof ALLOWED_DUSUN)[number]
    )
  ) {
    throw new Error(
      'Dusun yang dipilih tidak valid.'
    );
  }

  if (!rw) {
    throw new Error(
      'RW wajib diisi.'
    );
  }

  if (!rt) {
    throw new Error(
      'RT wajib diisi.'
    );
  }

  if (
    alamat.length > 500
  ) {
    throw new Error(
      'Alamat maksimal terdiri dari 500 karakter.'
    );
  }

  if (
    nomorWhatsApp &&
    !/^\d{10,15}$/.test(
      nomorWhatsApp
    )
  ) {
    throw new Error(
      'Nomor WhatsApp harus terdiri dari 10 sampai 15 angka.'
    );
  }
}

function revalidateWargaPages() {
  revalidatePath('/admin');
  revalidatePath('/admin/warga');

  revalidatePath('/data-desa');

  revalidatePath(
    '/data-desa/penduduk'
  );

  revalidatePath(
    '/data-desa/populasi-wilayah'
  );

  revalidatePath(
    '/data-desa/rentang-umur'
  );

  revalidatePath(
    '/data-desa/kategori-umur'
  );

  revalidatePath(
    '/data-desa/status-penduduk'
  );

  revalidatePath(
    '/data-desa/jenis-kelamin'
  );
}

export async function createWargaAction(
  _previousState: WargaActionState,
  formData: FormData
): Promise<WargaActionState> {
  await requireAdmin();

  try {
    const nik =
      normalizeAngka(
        getFormString(
          formData,
          'nik'
        )
      );

    const noKk =
      normalizeAngka(
        getFormString(
          formData,
          'no_kk'
        )
      );

    const namaLengkap =
      getFormString(
        formData,
        'nama_lengkap'
      );

    const jenisKelamin =
      getFormString(
        formData,
        'jenis_kelamin'
      );

    const tanggalLahir =
      getFormString(
        formData,
        'tanggal_lahir'
      );

    const statusPenduduk =
      getFormString(
        formData,
        'status_penduduk'
      );

    const dusun =
      getFormString(
        formData,
        'dusun'
      );

    const rw =
      normalizeNomorWilayah(
        getFormString(
          formData,
          'rw'
        )
      );

    const rt =
      normalizeNomorWilayah(
        getFormString(
          formData,
          'rt'
        )
      );

    const alamat =
      getFormString(
        formData,
        'alamat'
      );

    const nomorWhatsApp =
      normalizeAngka(
        getFormString(
          formData,
          'nomor_whatsapp'
        )
      );

    validateWargaData({
      nik,
      noKk,
      namaLengkap,
      jenisKelamin,
      tanggalLahir,
      statusPenduduk,
      dusun,
      rw,
      rt,
      alamat,
      nomorWhatsApp,
    });

    const {
      error,
    } = await supabaseAdmin
      .from('warga')
      .insert({
        nik_hash:
          hashNik(nik),

        nik_empat_terakhir:
          nik.slice(-4),

        no_kk_hash:
          hashNoKk(noKk),

        no_kk_empat_terakhir:
          noKk.slice(-4),

        nama_lengkap:
          namaLengkap,

        jenis_kelamin:
          jenisKelamin,

        tanggal_lahir:
          tanggalLahir,

        status_penduduk:
          statusPenduduk,

        dusun,
        rw,
        rt,

        alamat:
          alamat || null,

        nomor_whatsapp:
          nomorWhatsApp || null,

        aktif:
          true,
      });

    if (error) {
      if (
        error.code ===
        '23505'
      ) {
        return {
          error:
            'NIK tersebut sudah terdaftar dalam database warga.',
          success: null,
        };
      }

      throw new Error(
        `Data warga gagal disimpan: ${error.message}`
      );
    }

    revalidateWargaPages();

    return {
      error: null,
      success:
        'Data warga berhasil ditambahkan.',
    };
  } catch (error) {
    console.error(
      'Create warga error:',
      error
    );

    return {
      error:
        error instanceof Error
          ? error.message
          : 'Data warga gagal disimpan.',

      success: null,
    };
  }
}

export async function toggleStatusWargaAction(
  formData: FormData
) {
  await requireAdmin();

  const id =
    getFormString(
      formData,
      'id'
    );

  const aktif =
    getFormString(
      formData,
      'aktif'
    ) === 'true';

  if (!id) {
    throw new Error(
      'ID warga tidak valid.'
    );
  }

  const {
    data,
    error,
  } = await supabaseAdmin
    .from('warga')
    .update({
      aktif: !aktif,
    })
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) {
    throw new Error(
      `Status akses warga gagal diperbarui: ${error.message}`
    );
  }

  if (!data) {
    throw new Error(
      'Data warga tidak ditemukan.'
    );
  }

  revalidateWargaPages();
}