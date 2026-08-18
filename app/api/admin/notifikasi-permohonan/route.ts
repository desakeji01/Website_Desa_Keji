// app/api/admin/notifikasi-permohonan/route.ts

import { createHmac } from 'node:crypto';

import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { createClient } from '@/lib/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PermohonanRow {
  id: number;
  warga_nik: string;
  layanan_id: number;
  no_wa: string;
  status: string;
  created_at: string;
}

interface WargaRow {
  nik_hash: string;
  nama_lengkap: string;
}

interface LayananRow {
  id: number;
  nama: string;
}

function normalisasiNik(value: string) {
  return value.replace(/\D/g, '').slice(0, 16);
}

function hashNik(
  nik: string,
  secret: string
) {
  return createHmac('sha256', secret)
    .update(nik)
    .digest('hex');
}

function parseSeenId(
  value: string | null
) {
  const parsed = Number(value ?? 0);

  if (
    !Number.isInteger(parsed) ||
    parsed < 0
  ) {
    return 0;
  }

  return parsed;
}

export async function GET(
  request: NextRequest
) {
  try {
    const supabase =
      await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Sesi admin tidak ditemukan.',
        },
        {
          status: 401,
        }
      );
    }

    const seenId = parseSeenId(
      request.nextUrl.searchParams.get(
        'seenId'
      )
    );

    const {
      data: permohonanData,
      error: permohonanError,
    } = await supabaseAdmin
      .from('permohonan')
      .select(`
        id,
        warga_nik,
        layanan_id,
        no_wa,
        status,
        created_at
      `)
      .order('id', {
        ascending: false,
      })
      .limit(15);

    if (permohonanError) {
      console.error(
        'Gagal mengambil notifikasi permohonan:',
        permohonanError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            'Notifikasi permohonan tidak dapat dimuat.',
        },
        {
          status: 500,
        }
      );
    }

    const {
      count: unreadCount,
      error: unreadError,
    } = await supabaseAdmin
      .from('permohonan')
      .select('id', {
        count: 'exact',
        head: true,
      })
      .gt('id', seenId);

    if (unreadError) {
      console.error(
        'Gagal menghitung notifikasi:',
        unreadError
      );
    }

    const {
      count: totalMenunggu,
      error: menungguError,
    } = await supabaseAdmin
      .from('permohonan')
      .select('id', {
        count: 'exact',
        head: true,
      })
      .eq('status', 'Menunggu');

    if (menungguError) {
      console.error(
        'Gagal menghitung permohonan menunggu:',
        menungguError
      );
    }

    const permohonanRows =
      (permohonanData ??
        []) as PermohonanRow[];

    const secret =
      process.env.NIK_HASH_SECRET;

    const nikHashMap =
      new Map<string, string>();

    if (
      secret &&
      secret.length >= 32
    ) {
      permohonanRows.forEach(
        (item) => {
          const nik =
            normalisasiNik(
              item.warga_nik
            );

          if (
            /^\d{16}$/.test(nik)
          ) {
            nikHashMap.set(
              nik,
              hashNik(
                nik,
                secret
              )
            );
          }
        }
      );
    } else {
      console.error(
        'NIK_HASH_SECRET belum tersedia atau kurang dari 32 karakter.'
      );
    }

    const daftarNikHash = [
      ...new Set(
        nikHashMap.values()
      ),
    ];

    const daftarLayananId = [
      ...new Set(
        permohonanRows
          .map(
            (item) =>
              Number(
                item.layanan_id
              )
          )
          .filter(
            (id) =>
              Number.isInteger(id) &&
              id > 0
          )
      ),
    ];

    let wargaRows: WargaRow[] = [];
    let layananRows:
      LayananRow[] = [];

    if (
      daftarNikHash.length > 0
    ) {
      const {
        data,
        error,
      } = await supabaseAdmin
        .from('warga')
        .select(`
          nik_hash,
          nama_lengkap
        `)
        .in(
          'nik_hash',
          daftarNikHash
        );

      if (error) {
        console.error(
          'Gagal mengambil warga untuk notifikasi:',
          error
        );
      } else {
        wargaRows =
          (data ?? []) as WargaRow[];
      }
    }

    if (
      daftarLayananId.length > 0
    ) {
      const {
        data,
        error,
      } = await supabaseAdmin
        .from('layanan')
        .select(`
          id,
          nama
        `)
        .in(
          'id',
          daftarLayananId
        );

      if (error) {
        console.error(
          'Gagal mengambil layanan untuk notifikasi:',
          error
        );
      } else {
        layananRows =
          (data ??
            []) as LayananRow[];
      }
    }

    const wargaMap = new Map(
      wargaRows.map(
        (warga) => [
          warga.nik_hash,
          warga.nama_lengkap,
        ]
      )
    );

    const layananMap = new Map(
      layananRows.map(
        (layanan) => [
          Number(layanan.id),
          layanan.nama,
        ]
      )
    );

    const items =
      permohonanRows.map(
        (item) => {
          const nik =
            normalisasiNik(
              item.warga_nik
            );

          const nikHash =
            nikHashMap.get(nik) ??
            '';

          return {
            id: Number(item.id),

            namaPemohon:
              wargaMap.get(
                nikHash
              ) ??
              'Warga Desa Keji',

            nikLast4:
              nik.length >= 4
                ? nik.slice(-4)
                : '----',

            layanan:
              layananMap.get(
                Number(
                  item.layanan_id
                )
              ) ??
              'Layanan administrasi',

            noWa:
              String(
                item.no_wa ??
                  ''
              ),

            status:
              String(
                item.status ??
                  'Menunggu'
              ),

            createdAt:
              item.created_at,
          };
        }
      );

    return NextResponse.json(
      {
        success: true,

        latestId:
          items[0]?.id ?? 0,

        unreadCount:
          unreadError
            ? 0
            : unreadCount ?? 0,

        totalMenunggu:
          menungguError
            ? 0
            : totalMenunggu ?? 0,

        items,
      },
      {
        status: 200,
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error(
      'Kesalahan API notifikasi admin:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Notifikasi admin tidak dapat diproses.',
      },
      {
        status: 500,
      }
    );
  }
}