// app/admin/data-desa/penduduk/actions.ts

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export interface StatistikPendudukActionState {
  success: boolean;
  message: string;
}

interface StatistikPendudukInput {
  tahunData: number;
  jumlahPenduduk: number;
  jumlahLakiLaki: number;
  jumlahPerempuan: number;
  jumlahKk: number;
  keterangan: string;
  aktif: boolean;
}

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
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

function getFormNumber(
  formData: FormData,
  key: string
) {
  const rawValue = getFormString(
    formData,
    key
  );

  const parsedValue = Number(
    rawValue
  );

  return parsedValue;
}

function parseFormData(
  formData: FormData
): StatistikPendudukInput {
  return {
    tahunData: getFormNumber(
      formData,
      'tahun_data'
    ),

    jumlahPenduduk: getFormNumber(
      formData,
      'jumlah_penduduk'
    ),

    jumlahLakiLaki: getFormNumber(
      formData,
      'jumlah_laki_laki'
    ),

    jumlahPerempuan: getFormNumber(
      formData,
      'jumlah_perempuan'
    ),

    jumlahKk: getFormNumber(
      formData,
      'jumlah_kk'
    ),

    keterangan: getFormString(
      formData,
      'keterangan'
    ),

    aktif:
      getFormString(
        formData,
        'aktif'
      ) === 'true',
  };
}

function validasiData(
  data: StatistikPendudukInput
) {
  if (
    !Number.isInteger(
      data.tahunData
    ) ||
    data.tahunData < 1900 ||
    data.tahunData > 2100
  ) {
    return 'Tahun data tidak valid.';
  }

  const angkaStatistik = [
    data.jumlahPenduduk,
    data.jumlahLakiLaki,
    data.jumlahPerempuan,
    data.jumlahKk,
  ];

  const adaAngkaTidakValid =
    angkaStatistik.some(
      (value) =>
        !Number.isInteger(value) ||
        value < 0
    );

  if (adaAngkaTidakValid) {
    return 'Seluruh data statistik harus berupa angka bulat minimal 0.';
  }

  const totalBerdasarkanJenisKelamin =
    data.jumlahLakiLaki +
    data.jumlahPerempuan;

  if (
    totalBerdasarkanJenisKelamin !==
    data.jumlahPenduduk
  ) {
    return `Jumlah laki-laki dan perempuan harus sama dengan jumlah penduduk. Saat ini totalnya ${totalBerdasarkanJenisKelamin.toLocaleString(
      'id-ID'
    )}.`;
  }

  if (
    data.jumlahKk >
    data.jumlahPenduduk
  ) {
    return 'Jumlah kepala keluarga tidak boleh melebihi jumlah penduduk.';
  }

  if (
    data.keterangan.length > 500
  ) {
    return 'Keterangan maksimal terdiri dari 500 karakter.';
  }

  return null;
}

export async function simpanStatistikPendudukAction(
  previousState:
    StatistikPendudukActionState,
  formData: FormData
): Promise<StatistikPendudukActionState> {
  void previousState;

  await requireAdmin();

  const input =
    parseFormData(formData);

  const validationError =
    validasiData(input);

  if (validationError) {
    return {
      success: false,
      message: validationError,
    };
  }

  const {
    error,
  } = await supabaseAdmin
    .from(
      'statistik_penduduk_beranda'
    )
    .upsert(
      {
        id: 1,

        tahun_data:
          input.tahunData,

        jumlah_penduduk:
          input.jumlahPenduduk,

        jumlah_laki_laki:
          input.jumlahLakiLaki,

        jumlah_perempuan:
          input.jumlahPerempuan,

        jumlah_kk:
          input.jumlahKk,

        keterangan:
          input.keterangan || null,

        aktif:
          input.aktif,

        updated_at:
          new Date().toISOString(),
      },
      {
        onConflict: 'id',
      }
    );

  if (error) {
    console.error(
      'Gagal menyimpan statistik penduduk:',
      {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }
    );

    return {
      success: false,
      message:
        error.message ||
        'Statistik penduduk gagal disimpan.',
    };
  }

  revalidatePath('/');
  revalidatePath(
    '/admin/data-desa/penduduk'
  );

  return {
    success: true,
    message:
      'Statistik penduduk berhasil diperbarui dan ditampilkan pada beranda.',
  };
}