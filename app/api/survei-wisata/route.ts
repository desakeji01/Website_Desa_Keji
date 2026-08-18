// app/api/survei-wisata/route.ts

import {
  timingSafeEqual,
} from 'node:crypto';

import {
  NextResponse,
} from 'next/server';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

export const runtime =
  'nodejs';

export const dynamic =
  'force-dynamic';

type RequestBody =
  Record<string, unknown>;

function amanBandingkanSecret(
  value: string,
  expected: string
) {
  const valueBuffer =
    Buffer.from(value);

  const expectedBuffer =
    Buffer.from(expected);

  if (
    valueBuffer.length !==
    expectedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    valueBuffer,
    expectedBuffer
  );
}

function ambilTeks(
  value: unknown,
  maksimal = 1000
) {
  if (
    typeof value !==
    'string'
  ) {
    return '';
  }

  return value
    .trim()
    .slice(0, maksimal);
}

function ambilTeksOpsional(
  value: unknown,
  maksimal = 1000
) {
  const hasil =
    ambilTeks(
      value,
      maksimal
    );

  return hasil || null;
}

function ambilBoolean(
  value: unknown
): boolean | null {
  return typeof value ===
    'boolean'
    ? value
    : null;
}

function ambilNilai(
  value: unknown,
  wajib: boolean
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return wajib
      ? null
      : null;
  }

  const angka =
    Number(value);

  if (
    !Number.isInteger(
      angka
    ) ||
    angka < 1 ||
    angka > 4
  ) {
    return null;
  }

  return angka;
}

function tanggalValid(
  value: string
) {
  return /^\d{4}-\d{2}-\d{2}$/.test(
    value
  );
}

function tanggalWaktuValid(
  value: string
) {
  return !Number.isNaN(
    Date.parse(value)
  );
}

function normalisasiWhatsapp(
  value: unknown
) {
  const nomor =
    ambilTeks(value, 30)
      .replace(/\D/g, '');

  if (!nomor) {
    return null;
  }

  if (
    nomor.startsWith('0')
  ) {
    return `62${nomor.slice(
      1
    )}`;
  }

  if (
    nomor.startsWith('8')
  ) {
    return `62${nomor}`;
  }

  return nomor;
}

export async function POST(
  request: Request
) {
  try {
    const secretDiterima =
      request.headers.get(
        'x-survei-secret'
      ) ?? '';

    const secretServer =
      process.env
        .SURVEI_WEBHOOK_SECRET ??
      '';

    if (
      !secretServer ||
      !amanBandingkanSecret(
        secretDiterima,
        secretServer
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Webhook tidak memiliki izin.',
        },
        {
          status: 401,
        }
      );
    }

    const body =
      (await request.json()) as RequestBody;

    const responseId =
      ambilTeks(
        body.response_id,
        300
      );

    const submittedAt =
      ambilTeks(
        body.submitted_at,
        100
      );

    const email =
      ambilTeks(
        body.email,
        320
      );

    const nama =
      ambilTeks(
        body.nama,
        200
      );

    const tanggalKunjungan =
      ambilTeks(
        body.tanggal_kunjungan,
        20
      );

    const asal =
      ambilTeks(
        body.asal,
        200
      );

    const jenisKunjungan =
      ambilTeks(
        body.jenis_kunjungan,
        200
      );

    const kunjunganPertama =
      ambilBoolean(
        body.kunjungan_pertama
      );

    const paketAktivitas =
      ambilTeks(
        body.paket_aktivitas,
        300
      );

    const nilaiKebersihan =
      ambilNilai(
        body.nilai_kebersihan,
        true
      );

    const nilaiKeramahan =
      ambilNilai(
        body.nilai_keramahan,
        true
      );

    const nilaiFasilitas =
      ambilNilai(
        body.nilai_fasilitas,
        true
      );

    const nilaiKesesuaian =
      ambilNilai(
        body.nilai_kesesuaian,
        false
      );

    const nilaiKepuasan =
      ambilNilai(
        body.nilai_kepuasan,
        true
      );

    const merekomendasikan =
      ambilBoolean(
        body.merekomendasikan
      );

    const halDisukai =
      ambilTeks(
        body.hal_disukai,
        3000
      );

    const saranPerbaikan =
      ambilTeks(
        body.saran_perbaikan,
        3000
      );

    const bolehDihubungi =
      ambilBoolean(
        body.boleh_dihubungi
      );

    const nomorWhatsapp =
      normalisasiWhatsapp(
        body.nomor_wa
      );

    const sheetRow =
      Number(
        body.sheet_row
      );

    const dataTidakLengkap =
      !responseId ||
      !submittedAt ||
      !tanggalWaktuValid(
        submittedAt
      ) ||
      !email ||
      !nama ||
      !tanggalKunjungan ||
      !tanggalValid(
        tanggalKunjungan
      ) ||
      !asal ||
      !jenisKunjungan ||
      kunjunganPertama ===
        null ||
      !paketAktivitas ||
      nilaiKebersihan ===
        null ||
      nilaiKeramahan ===
        null ||
      nilaiFasilitas ===
        null ||
      nilaiKepuasan ===
        null ||
      merekomendasikan ===
        null ||
      !halDisukai ||
      !saranPerbaikan ||
      bolehDihubungi ===
        null;

    if (
      dataTidakLengkap
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Data respons tidak lengkap atau tidak valid.',
        },
        {
          status: 422,
        }
      );
    }

    const payload = {
      response_id:
        responseId,

      sheet_row:
        Number.isInteger(
          sheetRow
        ) &&
        sheetRow > 0
          ? sheetRow
          : null,

      submitted_at:
        new Date(
          submittedAt
        ).toISOString(),

      email,
      nama,

      tanggal_kunjungan:
        tanggalKunjungan,

      asal,

      jenis_kunjungan:
        jenisKunjungan,

      kunjungan_pertama:
        kunjunganPertama,

      paket_aktivitas:
        paketAktivitas,

      nilai_kebersihan:
        nilaiKebersihan,

      nilai_keramahan:
        nilaiKeramahan,

      nilai_fasilitas:
        nilaiFasilitas,

      nilai_kesesuaian:
        nilaiKesesuaian,

      nilai_kepuasan:
        nilaiKepuasan,

      merekomendasikan,

      hal_disukai:
        halDisukai,

      saran_perbaikan:
        saranPerbaikan,

      boleh_dihubungi:
        bolehDihubungi,

      nomor_wa:
        bolehDihubungi
          ? nomorWhatsapp
          : null,

      aktif: true,
    };

    const {
      error,
    } = await supabaseAdmin
      .from(
        'survei_kepuasan_wisata'
      )
      .upsert(
        payload,
        {
          onConflict:
            'response_id',
        }
      );

    if (error) {
      console.error(
        'Gagal menyimpan survei wisata:',
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

      return NextResponse.json(
        {
          success: false,
          message:
            'Respons gagal disimpan.',
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          'Respons berhasil disimpan.',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      'Kesalahan webhook survei wisata:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          'Terjadi kesalahan pada server.',
      },
      {
        status: 500,
      }
    );
  }
}