// app/admin/beranda/actions.ts

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
  BerandaActionState,
} from '@/types/beranda';

const BERANDA_KEY = 'utama';

interface BerandaInput {
  hero_teks_1: string;
  hero_teks_2: string;
  hero_teks_3: string;
  hero_lokasi: string;
  hero_placeholder: string;
  background_url: string;
  logo_url: string;

  nama_kepala_desa: string;
  jabatan_kepala_desa: string;
  foto_kepala_desa_url: string;
  sambutan_kepala_desa: string;

  informasi_1: string;
  informasi_2: string;
  informasi_3: string;
  informasi_4: string;

  alamat_kantor: string;
  maps_embed_url: string;
  maps_link_url: string;

  sholat_subuh: string;
  sholat_dzuhur: string;
  sholat_ashar: string;
  sholat_maghrib: string;
  sholat_isya: string;

  jam_senin_kamis: string;
  jam_jumat: string;
  jam_akhir_pekan: string;
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
}

function getString(
  formData: FormData,
  key: string
) {
  return String(
    formData.get(key) ?? ''
  ).trim();
}

function parseFormData(
  formData: FormData
): BerandaInput {
  return {
    hero_teks_1:
      getString(
        formData,
        'hero_teks_1'
      ),

    hero_teks_2:
      getString(
        formData,
        'hero_teks_2'
      ),

    hero_teks_3:
      getString(
        formData,
        'hero_teks_3'
      ),

    hero_lokasi:
      getString(
        formData,
        'hero_lokasi'
      ),

    hero_placeholder:
      getString(
        formData,
        'hero_placeholder'
      ),

    background_url:
      getString(
        formData,
        'background_url'
      ),

    logo_url:
      getString(
        formData,
        'logo_url'
      ),

    nama_kepala_desa:
      getString(
        formData,
        'nama_kepala_desa'
      ),

    jabatan_kepala_desa:
      getString(
        formData,
        'jabatan_kepala_desa'
      ),

    foto_kepala_desa_url:
      getString(
        formData,
        'foto_kepala_desa_url'
      ),

    sambutan_kepala_desa:
      getString(
        formData,
        'sambutan_kepala_desa'
      ),

    informasi_1:
      getString(
        formData,
        'informasi_1'
      ),

    informasi_2:
      getString(
        formData,
        'informasi_2'
      ),

    informasi_3:
      getString(
        formData,
        'informasi_3'
      ),

    informasi_4:
      getString(
        formData,
        'informasi_4'
      ),

    alamat_kantor:
      getString(
        formData,
        'alamat_kantor'
      ),

    maps_embed_url:
      getString(
        formData,
        'maps_embed_url'
      ),

    maps_link_url:
      getString(
        formData,
        'maps_link_url'
      ),

    sholat_subuh:
      getString(
        formData,
        'sholat_subuh'
      ),

    sholat_dzuhur:
      getString(
        formData,
        'sholat_dzuhur'
      ),

    sholat_ashar:
      getString(
        formData,
        'sholat_ashar'
      ),

    sholat_maghrib:
      getString(
        formData,
        'sholat_maghrib'
      ),

    sholat_isya:
      getString(
        formData,
        'sholat_isya'
      ),

    jam_senin_kamis:
      getString(
        formData,
        'jam_senin_kamis'
      ),

    jam_jumat:
      getString(
        formData,
        'jam_jumat'
      ),

    jam_akhir_pekan:
      getString(
        formData,
        'jam_akhir_pekan'
      ),
  };
}

function isValidResourceUrl(
  value: string
) {
  return (
    value.startsWith('/') ||
    value.startsWith('https://') ||
    value.startsWith('http://')
  );
}

function isValidHttpUrl(
  value: string
) {
  return (
    value.startsWith('https://') ||
    value.startsWith('http://')
  );
}

function isValidTime(
  value: string
) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(
    value
  );
}

function validateData(
  data: BerandaInput
) {
  const requiredValues = [
    data.hero_teks_1,
    data.hero_teks_2,
    data.hero_teks_3,
    data.hero_lokasi,
    data.hero_placeholder,
    data.background_url,
    data.logo_url,
    data.nama_kepala_desa,
    data.jabatan_kepala_desa,
    data.foto_kepala_desa_url,
    data.sambutan_kepala_desa,
    data.informasi_1,
    data.alamat_kantor,
    data.maps_embed_url,
    data.maps_link_url,
    data.sholat_subuh,
    data.sholat_dzuhur,
    data.sholat_ashar,
    data.sholat_maghrib,
    data.sholat_isya,
    data.jam_senin_kamis,
    data.jam_jumat,
    data.jam_akhir_pekan,
  ];

  if (
    requiredValues.some(
      (value) =>
        value.length === 0
    )
  ) {
    return 'Semua kolom wajib harus diisi.';
  }

  if (
    data.hero_teks_1.length >
      100 ||
    data.hero_teks_2.length >
      100 ||
    data.hero_teks_3.length >
      100
  ) {
    return 'Setiap teks animasi hero maksimal 100 karakter.';
  }

  if (
    data.sambutan_kepala_desa
      .length < 20
  ) {
    return 'Sambutan kepala desa minimal 20 karakter.';
  }

  if (
    data.sambutan_kepala_desa
      .length > 3000
  ) {
    return 'Sambutan kepala desa maksimal 3.000 karakter.';
  }

  const informasi = [
    data.informasi_1,
    data.informasi_2,
    data.informasi_3,
    data.informasi_4,
  ];

  if (
    informasi.some(
      (value) =>
        value.length > 250
    )
  ) {
    return 'Setiap informasi berjalan maksimal 250 karakter.';
  }

  if (
    !isValidResourceUrl(
      data.background_url
    )
  ) {
    return 'Path gambar latar harus dimulai dengan /, http://, atau https://.';
  }

  if (
    !isValidResourceUrl(
      data.logo_url
    )
  ) {
    return 'Path logo harus dimulai dengan /, http://, atau https://.';
  }

  if (
    !isValidResourceUrl(
      data.foto_kepala_desa_url
    )
  ) {
    return 'Path foto kepala desa harus dimulai dengan /, http://, atau https://.';
  }

  if (
    !isValidHttpUrl(
      data.maps_embed_url
    ) ||
    !isValidHttpUrl(
      data.maps_link_url
    )
  ) {
    return 'URL Google Maps harus menggunakan http:// atau https://.';
  }

  const jadwal = [
    data.sholat_subuh,
    data.sholat_dzuhur,
    data.sholat_ashar,
    data.sholat_maghrib,
    data.sholat_isya,
  ];

  if (
    jadwal.some(
      (value) =>
        !isValidTime(value)
    )
  ) {
    return 'Format jadwal salat harus berupa HH:MM.';
  }

  return null;
}

export async function simpanBerandaAction(
  previousState:
    BerandaActionState,
  formData: FormData
): Promise<BerandaActionState> {
  void previousState;

  await requireAdmin();

  const input =
    parseFormData(formData);

  const validationError =
    validateData(input);

  if (validationError) {
    return {
      success: false,
      message:
        validationError,
    };
  }

  try {
    const {
      error,
    } = await supabaseAdmin
      .from('beranda_public')
      .upsert(
        {
          beranda_key:
            BERANDA_KEY,

          ...input,

          updated_at:
            new Date()
              .toISOString(),
        },
        {
          onConflict:
            'beranda_key',
        }
      );

    if (error) {
      console.error(
        'Gagal menyimpan beranda:',
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
        success: false,
        message:
          error.message ||
          'Konten beranda gagal disimpan.',
      };
    }

    revalidatePath('/');

    revalidatePath(
      '/admin/beranda'
    );

    return {
      success: true,
      message:
        'Konten beranda berhasil diperbarui.',
    };
  } catch (error) {
    console.error(
      'Kesalahan menyimpan beranda:',
      error
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat menyimpan konten beranda.',
    };
  }
}