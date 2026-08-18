// app/api/profil-desa/route.ts

import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PROFIL_KEY = 'utama';

const fallbackData = {
  id: '',
  profil_key: PROFIL_KEY,
  jumlah_laki_laki: 0,
  jumlah_perempuan: 0,
  jumlah_dusun: 0,
  jumlah_rw: 0,
  jumlah_rt: 0,
  tahun_data: new Date().getFullYear(),
  updated_at: '',
};

export async function GET() {
  try {
    const {
      data,
      error,
    } = await supabaseAdmin
      .from('profil_desa')
      .select(`
        id,
        profil_key,
        jumlah_laki_laki,
        jumlah_perempuan,
        jumlah_dusun,
        jumlah_rw,
        jumlah_rt,
        tahun_data,
        updated_at
      `)
      .eq(
        'profil_key',
        PROFIL_KEY
      )
      .maybeSingle();

    if (error) {
      console.error(
        'Supabase profil_desa error:',
        {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        }
      );

      return NextResponse.json(
        {
          message:
            'Data profil desa gagal dimuat.',
          detail:
            process.env.NODE_ENV ===
            'development'
              ? error.message
              : undefined,
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

    /*
     * Apabila data utama belum ada,
     * API tetap mengembalikan respons 200
     * supaya dashboard tidak mengalami error.
     */
    if (!data) {
      return NextResponse.json(
        {
          data: fallbackData,
          message:
            'Data profil desa belum tersedia.',
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

    const profilDesa = {
      id: String(data.id ?? ''),

      profil_key: String(
        data.profil_key ??
          PROFIL_KEY
      ),

      jumlah_laki_laki: Number(
        data.jumlah_laki_laki ?? 0
      ),

      jumlah_perempuan: Number(
        data.jumlah_perempuan ?? 0
      ),

      jumlah_dusun: Number(
        data.jumlah_dusun ?? 0
      ),

      jumlah_rw: Number(
        data.jumlah_rw ?? 0
      ),

      jumlah_rt: Number(
        data.jumlah_rt ?? 0
      ),

      tahun_data: Number(
        data.tahun_data ??
          new Date().getFullYear()
      ),

      updated_at: String(
        data.updated_at ?? ''
      ),
    };

    return NextResponse.json(
      {
        data: profilDesa,
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
      'API profil desa error:',
      error
    );

    return NextResponse.json(
      {
        message:
          'Terjadi kesalahan pada server saat memuat data profil desa.',

        detail:
          process.env.NODE_ENV ===
            'development' &&
          error instanceof Error
            ? error.message
            : undefined,
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