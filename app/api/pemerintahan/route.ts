// app/api/pemerintahan/route.ts

import {
  NextResponse,
} from 'next/server';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

const PEMERINTAHAN_KEY = 'utama';

export async function GET() {
  try {
    const [
      pemerintahanResult,
      perangkatResult,
    ] = await Promise.all([
      supabaseAdmin
        .from(
          'pemerintahan_desa'
        )
        .select(`
          pemerintahan_key,
          sekilas_info,
          judul_halaman,
          judul_sotk,
          lokasi_pemerintahan,
          tanggal_publikasi,
          penulis,
          deskripsi_kepala_desa,
          deskripsi_perangkat,
          catatan,
          updated_at
        `)
        .eq(
          'pemerintahan_key',
          PEMERINTAHAN_KEY
        )
        .maybeSingle(),

      supabaseAdmin
        .from('perangkat_desa')
        .select(`
          id,
          nama,
          jabatan,
          kelompok,
          foto_url,
          nip,
          nomor_telepon,
          deskripsi,
          urutan,
          aktif,
          created_at,
          updated_at
        `)
        .eq('aktif', true)
        .order(
          'urutan',
          {
            ascending: true,
          }
        )
        .order(
          'nama',
          {
            ascending: true,
          }
        ),
    ]);

    if (
      pemerintahanResult.error
    ) {
      throw pemerintahanResult.error;
    }

    if (
      perangkatResult.error
    ) {
      throw perangkatResult.error;
    }

    return NextResponse.json(
      {
        data: {
          pemerintahan:
            pemerintahanResult.data,

          perangkat:
            perangkatResult.data ??
            [],
        },
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
      'API pemerintahan error:',
      error
    );

    return NextResponse.json(
      {
        message:
          'Data pemerintahan gagal dimuat.',
      },
      {
        status: 500,

        headers: {
          'Cache-Control':
            'no-store, max-age=0',
        },
      }
    );
  }
}