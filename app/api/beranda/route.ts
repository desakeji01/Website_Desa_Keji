// app/api/beranda/route.ts

import {
  NextResponse,
} from 'next/server';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import {
  BERANDA_DEFAULTS,
} from '@/lib/beranda-defaults';

import type {
  BerandaPublicData,
} from '@/types/beranda';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

const BERANDA_KEY = 'utama';

function getString(
  value: unknown,
  fallback: string
) {
  if (
    typeof value !== 'string' ||
    value.trim() === ''
  ) {
    return fallback;
  }

  return value.trim();
}

function normalisasiBeranda(
  row:
    | Partial<BerandaPublicData>
    | null
    | undefined
): BerandaPublicData {
  return {
    beranda_key:
      getString(
        row?.beranda_key,
        BERANDA_DEFAULTS.beranda_key
      ),

    hero_teks_1:
      getString(
        row?.hero_teks_1,
        BERANDA_DEFAULTS.hero_teks_1
      ),

    hero_teks_2:
      getString(
        row?.hero_teks_2,
        BERANDA_DEFAULTS.hero_teks_2
      ),

    hero_teks_3:
      getString(
        row?.hero_teks_3,
        BERANDA_DEFAULTS.hero_teks_3
      ),

    hero_lokasi:
      getString(
        row?.hero_lokasi,
        BERANDA_DEFAULTS.hero_lokasi
      ),

    hero_placeholder:
      getString(
        row?.hero_placeholder,
        BERANDA_DEFAULTS.hero_placeholder
      ),

    background_url:
      getString(
        row?.background_url,
        BERANDA_DEFAULTS.background_url
      ),

    logo_url:
      getString(
        row?.logo_url,
        BERANDA_DEFAULTS.logo_url
      ),

    nama_kepala_desa:
      getString(
        row?.nama_kepala_desa,
        BERANDA_DEFAULTS.nama_kepala_desa
      ),

    jabatan_kepala_desa:
      getString(
        row?.jabatan_kepala_desa,
        BERANDA_DEFAULTS.jabatan_kepala_desa
      ),

    foto_kepala_desa_url:
      getString(
        row?.foto_kepala_desa_url,
        BERANDA_DEFAULTS.foto_kepala_desa_url
      ),

    sambutan_kepala_desa:
      getString(
        row?.sambutan_kepala_desa,
        BERANDA_DEFAULTS.sambutan_kepala_desa
      ),

    informasi_1:
      getString(
        row?.informasi_1,
        BERANDA_DEFAULTS.informasi_1
      ),

    informasi_2:
      getString(
        row?.informasi_2,
        BERANDA_DEFAULTS.informasi_2
      ),

    informasi_3:
      getString(
        row?.informasi_3,
        BERANDA_DEFAULTS.informasi_3
      ),

    informasi_4:
      getString(
        row?.informasi_4,
        BERANDA_DEFAULTS.informasi_4
      ),

    alamat_kantor:
      getString(
        row?.alamat_kantor,
        BERANDA_DEFAULTS.alamat_kantor
      ),

    maps_embed_url:
      getString(
        row?.maps_embed_url,
        BERANDA_DEFAULTS.maps_embed_url
      ),

    maps_link_url:
      getString(
        row?.maps_link_url,
        BERANDA_DEFAULTS.maps_link_url
      ),

    sholat_subuh:
      getString(
        row?.sholat_subuh,
        BERANDA_DEFAULTS.sholat_subuh
      ),

    sholat_dzuhur:
      getString(
        row?.sholat_dzuhur,
        BERANDA_DEFAULTS.sholat_dzuhur
      ),

    sholat_ashar:
      getString(
        row?.sholat_ashar,
        BERANDA_DEFAULTS.sholat_ashar
      ),

    sholat_maghrib:
      getString(
        row?.sholat_maghrib,
        BERANDA_DEFAULTS.sholat_maghrib
      ),

    sholat_isya:
      getString(
        row?.sholat_isya,
        BERANDA_DEFAULTS.sholat_isya
      ),

    jam_senin_kamis:
      getString(
        row?.jam_senin_kamis,
        BERANDA_DEFAULTS.jam_senin_kamis
      ),

    jam_jumat:
      getString(
        row?.jam_jumat,
        BERANDA_DEFAULTS.jam_jumat
      ),

    jam_akhir_pekan:
      getString(
        row?.jam_akhir_pekan,
        BERANDA_DEFAULTS.jam_akhir_pekan
      ),

    updated_at:
      getString(
        row?.updated_at,
        BERANDA_DEFAULTS.updated_at
      ),
  };
}

export async function GET() {
  try {
    const {
      data,
      error,
    } = await supabaseAdmin
      .from('beranda_public')
      .select(`
        beranda_key,
        hero_teks_1,
        hero_teks_2,
        hero_teks_3,
        hero_lokasi,
        hero_placeholder,
        background_url,
        logo_url,
        nama_kepala_desa,
        jabatan_kepala_desa,
        foto_kepala_desa_url,
        sambutan_kepala_desa,
        informasi_1,
        informasi_2,
        informasi_3,
        informasi_4,
        alamat_kantor,
        maps_embed_url,
        maps_link_url,
        sholat_subuh,
        sholat_dzuhur,
        sholat_ashar,
        sholat_maghrib,
        sholat_isya,
        jam_senin_kamis,
        jam_jumat,
        jam_akhir_pekan,
        updated_at
      `)
      .eq(
        'beranda_key',
        BERANDA_KEY
      )
      .maybeSingle();

    if (error) {
      console.error(
        'Supabase beranda_public error:',
        {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        }
      );

      return NextResponse.json(
        {
          data:
            BERANDA_DEFAULTS,

          message:
            'Data beranda gagal dimuat. Data bawaan digunakan.',
        },
        {
          status: 200,
          headers: {
            'Cache-Control':
              'no-store, max-age=0',
          },
        }
      );
    }

    return NextResponse.json(
      {
        data:
          normalisasiBeranda(
            data
          ),
      },
      {
        status: 200,
        headers: {
          'Cache-Control':
            'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error(
      'API beranda error:',
      error
    );

    return NextResponse.json(
      {
        data:
          BERANDA_DEFAULTS,

        message:
          'Terjadi kesalahan server. Data bawaan digunakan.',
      },
      {
        status: 200,
        headers: {
          'Cache-Control':
            'no-store, max-age=0',
        },
      }
    );
  }
}