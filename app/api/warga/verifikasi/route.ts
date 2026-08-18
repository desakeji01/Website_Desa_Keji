// app/api/warga/verifikasi/route.ts

import { createHmac } from 'node:crypto';

import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RequestBody {
  nik?: unknown;
}

interface WargaRow {
  id: number;
  nama_lengkap: string;
  nik_empat_terakhir: string;
  aktif: boolean;
}

function normalisasiNik(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16);
}

function hashNik(nik: string) {
  const secret = process.env.NIK_HASH_SECRET;

  if (!secret) {
    throw new Error(
      'NIK_HASH_SECRET belum tersedia di .env.local.'
    );
  }

  if (secret.length < 32) {
    throw new Error(
      'NIK_HASH_SECRET minimal harus terdiri dari 32 karakter.'
    );
  }

  return createHmac('sha256', secret)
    .update(nik)
    .digest('hex');
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as RequestBody;

    const nik = normalisasiNik(
      String(body.nik ?? '')
    );

    if (!/^\d{16}$/.test(nik)) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          message:
            'NIK harus terdiri dari tepat 16 angka.',
        },
        {
          status: 400,
        }
      );
    }

    const nikHash = hashNik(nik);

    const {
      data,
      error,
    } = await supabaseAdmin
      .from('warga')
      .select(`
        id,
        nama_lengkap,
        nik_empat_terakhir,
        aktif
      `)
      .eq('nik_hash', nikHash)
      .eq('aktif', true)
      .maybeSingle();

    if (error) {
      console.error(
        'Gagal memverifikasi NIK warga:',
        {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        }
      );

      return NextResponse.json(
        {
          success: false,
          valid: false,
          message:
            error.message ||
            'Data warga tidak dapat diverifikasi.',
        },
        {
          status: 500,
        }
      );
    }

    const warga =
      data as WargaRow | null;

    if (!warga) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          message:
            'NIK tidak terdaftar sebagai warga aktif Desa Keji.',
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        valid: true,
        message:
          'NIK berhasil diverifikasi.',
        warga: {
          nama:
            warga.nama_lengkap,

          nikEmpatTerakhir:
            warga.nik_empat_terakhir,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      'Kesalahan API verifikasi NIK:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        valid: false,
        message:
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan saat memverifikasi NIK.',
      },
      {
        status: 500,
      }
    );
  }
}