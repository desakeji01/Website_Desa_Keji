// app/api/permohonan/route.ts

import { createHmac } from 'node:crypto';

import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RequestBody {
  nik?: unknown;
  layananId?: unknown;
  noWa?: unknown;
}

interface WargaRow {
  id: number;
  nama_lengkap: string;
  nik_hash: string;
  nik_empat_terakhir: string;
  aktif: boolean;
}

interface LayananRow {
  id: number;
  nama: string;
  aktif: boolean;
}

function normalisasiNik(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16);
}

function normalisasiWhatsApp(value: string) {
  let digits = value.replace(/\D/g, '');

  if (digits.startsWith('62')) {
    digits = `0${digits.slice(2)}`;
  } else if (digits.startsWith('8')) {
    digits = `0${digits}`;
  }

  return digits;
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
      'NIK_HASH_SECRET minimal terdiri dari 32 karakter.'
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

    const layananId = Number(
      body.layananId
    );

    const noWa = normalisasiWhatsApp(
      String(body.noWa ?? '')
    );

    /*
     * Validasi NIK.
     */
    if (!/^\d{16}$/.test(nik)) {
      return NextResponse.json(
        {
          success: false,
          message:
            'NIK harus terdiri dari tepat 16 angka.',
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Validasi layanan.
     */
    if (
      !Number.isInteger(layananId) ||
      layananId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Layanan yang dipilih tidak valid.',
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Validasi nomor WhatsApp.
     */
    if (!/^08\d{8,12}$/.test(noWa)) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Nomor WhatsApp tidak valid.',
        },
        {
          status: 400,
        }
      );
    }

    /*
     * NIK diverifikasi kembali di server.
     * Proses ini harus sama dengan:
     * app/api/warga/verifikasi/route.ts
     */
    const nikHash = hashNik(nik);

    const {
      data: wargaData,
      error: wargaError,
    } = await supabaseAdmin
      .from('warga')
      .select(`
        id,
        nama_lengkap,
        nik_hash,
        nik_empat_terakhir,
        aktif
      `)
      .eq('nik_hash', nikHash)
      .eq('aktif', true)
      .maybeSingle();

    if (wargaError) {
      console.error(
        'Kesalahan membaca data warga saat mengirim permohonan:',
        {
          message: wargaError.message,
          code: wargaError.code,
          details: wargaError.details,
          hint: wargaError.hint,
        }
      );

      return NextResponse.json(
        {
          success: false,
          message:
            wargaError.message ||
            'Data warga tidak dapat diverifikasi.',
        },
        {
          status: 500,
        }
      );
    }

    const warga =
      wargaData as WargaRow | null;

    if (!warga) {
      return NextResponse.json(
        {
          success: false,
          message:
            'NIK tidak terdaftar sebagai warga aktif Desa Keji.',
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Periksa apakah layanan masih aktif.
     */
    const {
      data: layananData,
      error: layananError,
    } = await supabaseAdmin
      .from('layanan')
      .select(`
        id,
        nama,
        aktif
      `)
      .eq('id', layananId)
      .eq('aktif', true)
      .maybeSingle();

    if (layananError) {
      console.error(
        'Kesalahan membaca data layanan:',
        {
          message: layananError.message,
          code: layananError.code,
          details: layananError.details,
          hint: layananError.hint,
        }
      );

      return NextResponse.json(
        {
          success: false,
          message:
            'Data layanan tidak dapat diperiksa.',
        },
        {
          status: 500,
        }
      );
    }

    const layanan =
      layananData as LayananRow | null;

    if (!layanan) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Layanan tidak tersedia atau sudah dinonaktifkan.',
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Periksa permohonan aktif dengan
     * NIK dan layanan yang sama.
     *
     * Tabel yang digunakan tetap:
     * public.permohonan
     */
    const {
      data: permohonanAktif,
      error: duplikasiError,
    } = await supabaseAdmin
      .from('permohonan')
      .select('id')
      .eq('warga_nik', nik)
      .eq('layanan_id', layananId)
      .in('status', [
        'Menunggu',
        'Diproses',
      ])
      .limit(1)
      .maybeSingle();

    if (duplikasiError) {
      console.error(
        'Kesalahan memeriksa duplikasi permohonan:',
        {
          message: duplikasiError.message,
          code: duplikasiError.code,
          details: duplikasiError.details,
          hint: duplikasiError.hint,
        }
      );

      return NextResponse.json(
        {
          success: false,
          message:
            'Permohonan sebelumnya tidak dapat diperiksa.',
        },
        {
          status: 500,
        }
      );
    }

    if (permohonanAktif) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Anda masih memiliki permohonan layanan yang sama dengan status Menunggu atau Diproses.',
        },
        {
          status: 409,
        }
      );
    }

    /*
     * Simpan permohonan.
     *
     * warga_nik tetap digunakan karena
     * tabel permohonan milikmu saat ini
     * memakai kolom tersebut.
     */
    const {
      data: permohonanBaru,
      error: insertError,
    } = await supabaseAdmin
      .from('permohonan')
      .insert({
        warga_nik: nik,
        layanan_id: layananId,
        no_wa: noWa,
        status: 'Menunggu',
      })
      .select(`
        id,
        status,
        created_at
      `)
      .single();

    if (insertError) {
      if (
        insertError.code === '23505'
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              'Anda masih memiliki permohonan layanan yang sama dengan status Menunggu.',
          },
          {
            status: 409,
          }
        );
      }

      console.error(
        'Kesalahan menyimpan permohonan:',
        {
          message: insertError.message,
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint,
        }
      );

      return NextResponse.json(
        {
          success: false,
          message:
            insertError.message ||
            'Permohonan gagal disimpan.',
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Segarkan dashboard dan halaman admin.
     */
    revalidatePath('/admin');
    revalidatePath(
      '/admin/permohonan'
    );

    return NextResponse.json(
      {
        success: true,
        message:
          'Permohonan berhasil dikirim.',
        permohonan: {
          id: permohonanBaru.id,
          status:
            permohonanBaru.status,
          layanan:
            layanan.nama,
          namaPemohon:
            warga.nama_lengkap,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      'Kesalahan API permohonan:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Permintaan tidak dapat diproses.',
      },
      {
        status: 500,
      }
    );
  }
}