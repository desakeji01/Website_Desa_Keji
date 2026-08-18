// app/api/pengaduan/route.ts

import {
  randomBytes,
} from 'node:crypto';

import {
  NextResponse,
} from 'next/server';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const KATEGORI_PENGADUAN = [
  'Pelayanan Administrasi',
  'Pembangunan Desa',
  'Lingkungan dan Ketertiban',
  'Aspirasi dan Saran',
  'Lainnya',
] as const;

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

function getString(
  formData: FormData,
  key: string
) {
  return String(
    formData.get(key) ?? ''
  ).trim();
}

function normalisasiWhatsApp(
  value: string
) {
  let nomor =
    value.replace(/\D/g, '');

  if (
    nomor.startsWith('62')
  ) {
    nomor =
      `0${nomor.slice(2)}`;
  } else if (
    nomor.startsWith('8')
  ) {
    nomor =
      `0${nomor}`;
  }

  return nomor;
}

function buatKodePengaduan() {
  const sekarang =
    new Date();

  const tanggal = [
    sekarang.getFullYear(),
    String(
      sekarang.getMonth() + 1
    ).padStart(2, '0'),
    String(
      sekarang.getDate()
    ).padStart(2, '0'),
  ].join('');

  const kodeAcak =
    randomBytes(3)
      .toString('hex')
      .toUpperCase();

  return `PGD-${tanggal}-${kodeAcak}`;
}

function getFileExtension(
  contentType: string
) {
  if (
    contentType ===
    'image/jpeg'
  ) {
    return 'jpg';
  }

  if (
    contentType ===
    'image/png'
  ) {
    return 'png';
  }

  if (
    contentType ===
    'image/webp'
  ) {
    return 'webp';
  }

  return 'pdf';
}

export async function POST(
  request: Request
) {
  let uploadedPath:
    string | null = null;

  try {
    const formData =
      await request.formData();

    /*
     * Honeypot untuk bot.
     */
    const website =
      getString(
        formData,
        'website'
      );

    if (website) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Permintaan tidak dapat diproses.',
        },
        {
          status: 400,
        }
      );
    }

    const anonim =
      getString(
        formData,
        'anonim'
      ) === 'true';

    const namaPelapor =
      getString(
        formData,
        'namaPelapor'
      );

    const nomorWhatsapp =
      normalisasiWhatsApp(
        getString(
          formData,
          'nomorWhatsapp'
        )
      );

    const kategori =
      getString(
        formData,
        'kategori'
      );

    const judul =
      getString(
        formData,
        'judul'
      );

    const isiPengaduan =
      getString(
        formData,
        'isiPengaduan'
      );

    const lokasi =
      getString(
        formData,
        'lokasi'
      );

    const tanggalKejadian =
      getString(
        formData,
        'tanggalKejadian'
      );

    if (
      !anonim &&
      namaPelapor.length < 3
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Nama pelapor minimal terdiri dari 3 karakter.',
        },
        {
          status: 400,
        }
      );
    }

    if (
      namaPelapor.length > 150
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Nama pelapor maksimal 150 karakter.',
        },
        {
          status: 400,
        }
      );
    }

    if (
      !/^08\d{8,12}$/.test(
        nomorWhatsapp
      )
    ) {
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

    if (
      !(
        KATEGORI_PENGADUAN as readonly string[]
      ).includes(kategori)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Kategori pengaduan tidak valid.',
        },
        {
          status: 400,
        }
      );
    }

    if (
      judul.length < 5 ||
      judul.length > 150
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Judul pengaduan harus terdiri dari 5–150 karakter.',
        },
        {
          status: 400,
        }
      );
    }

    if (
      isiPengaduan.length < 20 ||
      isiPengaduan.length > 3000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Isi pengaduan harus terdiri dari 20–3.000 karakter.',
        },
        {
          status: 400,
        }
      );
    }

    if (
      lokasi.length > 250
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Lokasi maksimal 250 karakter.',
        },
        {
          status: 400,
        }
      );
    }

    if (
      tanggalKejadian &&
      !/^\d{4}-\d{2}-\d{2}$/.test(
        tanggalKejadian
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Tanggal kejadian tidak valid.',
        },
        {
          status: 400,
        }
      );
    }

    const kodePengaduan =
      buatKodePengaduan();

    const bukti =
      formData.get('bukti');

    if (
      bukti instanceof File &&
      bukti.size > 0
    ) {
      if (
        bukti.size >
        MAX_FILE_SIZE
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              'Ukuran bukti maksimal 5 MB.',
          },
          {
            status: 400,
          }
        );
      }

      if (
        !ALLOWED_FILE_TYPES.includes(
          bukti.type
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              'Bukti hanya boleh berupa JPG, PNG, WebP, atau PDF.',
          },
          {
            status: 400,
          }
        );
      }

      const extension =
        getFileExtension(
          bukti.type
        );

      const sekarang =
        new Date();

      uploadedPath = [
        String(
          sekarang.getFullYear()
        ),
        String(
          sekarang.getMonth() + 1
        ).padStart(2, '0'),
        `${kodePengaduan}-${randomBytes(
          4
        ).toString('hex')}.${extension}`,
      ].join('/');

      const buffer =
        Buffer.from(
          await bukti.arrayBuffer()
        );

      const {
        error: uploadError,
      } =
        await supabaseAdmin.storage
          .from(
            'bukti-pengaduan'
          )
          .upload(
            uploadedPath,
            buffer,
            {
              contentType:
                bukti.type,
              upsert: false,
            }
          );

      if (uploadError) {
        console.error(
          'Gagal mengunggah bukti pengaduan:',
          uploadError
        );

        return NextResponse.json(
          {
            success: false,
            message:
              'Bukti pengaduan gagal diunggah.',
          },
          {
            status: 500,
          }
        );
      }
    }

    const {
      error: insertError,
    } =
      await supabaseAdmin
        .from('pengaduan')
        .insert({
          kode_pengaduan:
            kodePengaduan,

          nama_pelapor:
            anonim
              ? null
              : namaPelapor,

          anonim,

          nomor_whatsapp:
            nomorWhatsapp,

          kategori,

          judul,

          isi_pengaduan:
            isiPengaduan,

          lokasi:
            lokasi || null,

          tanggal_kejadian:
            tanggalKejadian ||
            null,

          bukti_path:
            uploadedPath,

          status:
            'Menunggu',
        });

    if (insertError) {
      if (uploadedPath) {
        await supabaseAdmin.storage
          .from(
            'bukti-pengaduan'
          )
          .remove([
            uploadedPath,
          ]);
      }

      console.error(
        'Gagal menyimpan pengaduan:',
        insertError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            insertError.message ||
            'Pengaduan gagal disimpan.',
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
          'Pengaduan berhasil dikirim.',
        kodePengaduan,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    if (uploadedPath) {
      await supabaseAdmin.storage
        .from(
          'bukti-pengaduan'
        )
        .remove([
          uploadedPath,
        ]);
    }

    console.error(
      'Kesalahan API pengaduan:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Pengaduan tidak dapat diproses.',
      },
      {
        status: 500,
      }
    );
  }
}