// app/admin/desa-cantik/actions.ts

'use server';

import {
  randomUUID,
} from 'node:crypto';

import {
  revalidatePath,
} from 'next/cache';

import {
  redirect,
} from 'next/navigation';

import {
  getStaticDesaCantikDataset,
} from '@/lib/desa-cantik-db';

import {
  isTahunDesaCantik,
} from '@/lib/desa-cantik';

import {
  createClient,
} from '@/lib/server';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import {
  TAHUN_DESA_CANTIK,
  type KategoriDesaCantik,
  type TahunDesaCantik,
} from '@/types/desa-cantik';

import type {
  DesaCantikAdminActionState,
} from '@/types/desa-cantik-admin';

/* =========================================================
   CONFIG
========================================================= */

const BUCKET_NAME =
  'desa-cantik';

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const MAX_PDF_SIZE =
  30 * 1024 * 1024;

const MAX_JSON_LENGTH =
  5_000_000;

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

const ALLOWED_CATEGORIES:
  KategoriDesaCantik[] = [
    'penduduk',
    'pendidikan',
    'kesehatan',
    'perumahan',
    'perekonomian',
  ];

/* =========================================================
   AUTH
========================================================= */

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
    redirect(
      '/login'
    );
  }

  return user;
}

/* =========================================================
   FORM HELPERS
========================================================= */

function getFormString(
  formData: FormData,
  key: string
): string {
  return String(
    formData.get(
      key
    ) ??
      ''
  ).trim();
}

function parseKategori(
  value: string
): KategoriDesaCantik {
  if (
    !ALLOWED_CATEGORIES.includes(
      value as KategoriDesaCantik
    )
  ) {
    throw new Error(
      'Kategori Desa Cantik tidak valid.'
    );
  }

  return value as KategoriDesaCantik;
}

function parseTahun(
  value: string
): TahunDesaCantik {
  const tahun =
    Number(
      value
    );

  if (
    !Number.isInteger(
      tahun
    ) ||
    !isTahunDesaCantik(
      tahun
    )
  ) {
    throw new Error(
      'Tahun Desa Cantik tidak valid.'
    );
  }

  return tahun;
}

/* =========================================================
   STORAGE HELPERS
========================================================= */

function getFileExtension(
  file: File
): string {
  const extensions:
    Record<
      string,
      string
    > = {
      'image/jpeg':
        'jpg',

      'image/png':
        'png',

      'image/webp':
        'webp',

      'application/pdf':
        'pdf',
    };

  return (
    extensions[
      file.type
    ] ??
    'bin'
  );
}

function validateImage(
  file: File
) {
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type
    )
  ) {
    throw new Error(
      'Infografis harus berformat JPG, PNG, atau WebP.'
    );
  }

  if (
    file.size >
    MAX_IMAGE_SIZE
  ) {
    throw new Error(
      'Ukuran infografis maksimal 5 MB.'
    );
  }
}

function validatePdf(
  file: File
) {
  if (
    file.type !==
    'application/pdf'
  ) {
    throw new Error(
      'Dokumen publikasi harus berformat PDF.'
    );
  }

  if (
    file.size >
    MAX_PDF_SIZE
  ) {
    throw new Error(
      'Ukuran dokumen PDF maksimal 30 MB.'
    );
  }
}

async function uploadFile({
  file,
  folder,
  prefix,
}: {
  file: File;

  folder: string;

  prefix: string;
}) {
  const extension =
    getFileExtension(
      file
    );

  const storagePath =
    `${folder}/${prefix}-${randomUUID()}.${extension}`;

  const buffer =
    Buffer.from(
      await file.arrayBuffer()
    );

  const {
    error,
  } =
    await supabaseAdmin.storage
      .from(
        BUCKET_NAME
      )
      .upload(
        storagePath,
        buffer,
        {
          contentType:
            file.type,

          cacheControl:
            '3600',

          upsert:
            false,
        }
      );

  if (error) {
    throw new Error(
      `Berkas gagal diunggah: ${error.message}`
    );
  }

  const {
    data,
  } =
    supabaseAdmin.storage
      .from(
        BUCKET_NAME
      )
      .getPublicUrl(
        storagePath
      );

  return {
    path:
      storagePath,

    url:
      data.publicUrl,
  };
}

async function removeStorageFile(
  storagePath:
    | string
    | null
    | undefined
) {
  const path =
    String(
      storagePath ??
        ''
    ).trim();

  if (!path) {
    return;
  }

  const {
    error,
  } =
    await supabaseAdmin.storage
      .from(
        BUCKET_NAME
      )
      .remove([
        path,
      ]);

  if (error) {
    console.error(
      'Berkas lama Desa Cantik gagal dihapus:',
      error.message
    );
  }
}

/* =========================================================
   DATA VALIDATION
========================================================= */

function isObject(
  value: unknown
): value is Record<
  string,
  unknown
> {
  return (
    Boolean(
      value
    ) &&
    typeof value ===
      'object' &&
    !Array.isArray(
      value
    )
  );
}

function isNumberRecord(
  value: unknown
) {
  if (
    !isObject(
      value
    )
  ) {
    return false;
  }

  return Object.values(
    value
  ).every(
    (item) =>
      typeof item ===
        'number' &&
      Number.isFinite(
        item
      )
  );
}

function validatePendudukData(
  data: unknown[]
) {
  for (
    const row of data
  ) {
    if (
      !isObject(
        row
      ) ||
      typeof row.kelompokUmur !==
        'string'
    ) {
      return false;
    }

    const wilayah = [
      'rw01',
      'rw02',
      'rw03',
      'total',
    ];

    for (
      const key of wilayah
    ) {
      const nilai =
        row[
          key
        ];

      if (
        !isObject(
          nilai
        )
      ) {
        return false;
      }

      const lakiLaki =
        nilai.lakiLaki;

      const perempuan =
        nilai.perempuan;

      const jumlah =
        nilai.jumlah;

      if (
        typeof lakiLaki !==
          'number' ||
        typeof perempuan !==
          'number' ||
        typeof jumlah !==
          'number'
      ) {
        return false;
      }
    }
  }

  return true;
}

function validateGenericTableData(
  data: unknown[]
) {
  for (
    const table of data
  ) {
    if (
      !isObject(
        table
      )
    ) {
      return false;
    }

    if (
      typeof table.id !==
        'string' ||
      typeof table.judul !==
        'string'
    ) {
      return false;
    }

    if (
      !Array.isArray(
        table.kolom
      ) ||
      !Array.isArray(
        table.baris
      ) ||
      !isNumberRecord(
        table.jumlah
      )
    ) {
      return false;
    }

    for (
      const column of
        table.kolom
    ) {
      if (
        !isObject(
          column
        ) ||
        typeof column.key !==
          'string' ||
        typeof column.label !==
          'string'
      ) {
        return false;
      }
    }

    for (
      const row of
        table.baris
    ) {
      if (
        !isObject(
          row
        ) ||
        !isNumberRecord(
          row.nilai
        )
      ) {
        return false;
      }

      const label =
        typeof row.label ===
          'string'
          ? row.label
          : typeof row.rw ===
                'string'
            ? row.rw
            : '';

      if (!label) {
        return false;
      }
    }
  }

  return true;
}

function validateStatistikData(
  kategori:
    KategoriDesaCantik,

  data:
    unknown[]
) {
  if (
    data.length === 0
  ) {
    return null;
  }

  if (
    kategori ===
    'penduduk'
  ) {
    return validatePendudukData(
      data
    )
      ? null
      : 'Struktur data penduduk tidak valid.';
  }

  return validateGenericTableData(
    data
  )
    ? null
    : `Struktur data ${kategori} tidak valid.`;
}

/* =========================================================
   REVALIDATE
========================================================= */

function revalidateDesaCantik(
  kategori:
    KategoriDesaCantik,

  tahun:
    number
) {
  revalidatePath(
    '/admin'
  );

  revalidatePath(
    '/admin/desa-cantik'
  );

  revalidatePath(
    `/admin/desa-cantik/${kategori}/${tahun}`
  );

  revalidatePath(
    '/desa-cantik'
  );

  revalidatePath(
    `/desa-cantik/${kategori}`
  );

  revalidatePath(
    `/desa-cantik/${kategori}/${tahun}`
  );
}

/* =========================================================
   MEDIA / SUMBER
========================================================= */

export async function simpanMediaDesaCantikAction(
  _previousState:
    DesaCantikAdminActionState,

  formData:
    FormData
): Promise<DesaCantikAdminActionState> {
  await requireAdmin();

  let uploadedPath:
    string | null =
    null;

  try {
    const kategori =
      parseKategori(
        getFormString(
          formData,
          'kategori'
        )
      );

    const tahun =
      parseTahun(
        getFormString(
          formData,
          'tahun'
        )
      );

    const sumber =
      getFormString(
        formData,
        'sumber'
      );

    const aktif =
      getFormString(
        formData,
        'aktif'
      ) ===
      'on';

    const hapusInfografis =
      getFormString(
        formData,
        'hapus_infografis'
      ) ===
      'on';

    const fileValue =
      formData.get(
        'infografis'
      );

    const file =
      fileValue instanceof
          File &&
      fileValue.size >
        0
        ? fileValue
        : null;

    if (
      sumber.length >
      1000
    ) {
      throw new Error(
        'Sumber data maksimal 1000 karakter.'
      );
    }

    const {
      data:
        existing,

      error:
        existingError,
    } =
      await supabaseAdmin
        .from(
          'desa_cantik_data'
        )
        .select(`
          id,
          infografis_url,
          infografis_path
        `)
        .eq(
          'kategori',
          kategori
        )
        .eq(
          'tahun',
          tahun
        )
        .maybeSingle();

    if (
      existingError
    ) {
      throw new Error(
        `Data Desa Cantik gagal diperiksa: ${existingError.message}`
      );
    }

    let infografisUrl =
      existing
        ?.infografis_url ??
      null;

    let infografisPath =
      existing
        ?.infografis_path ??
      null;

    if (file) {
      validateImage(
        file
      );

      const uploaded =
        await uploadFile({
          file,

          folder:
            `infografis/${kategori}/${tahun}`,

          prefix:
            `infografis-${kategori}-${tahun}`,
        });

      uploadedPath =
        uploaded.path;

      infografisUrl =
        uploaded.url;

      infografisPath =
        uploaded.path;
    } else if (
      hapusInfografis
    ) {
      infografisUrl =
        null;

      infografisPath =
        null;
    }

    const {
      error:
        saveError,
    } =
      await supabaseAdmin
        .from(
          'desa_cantik_data'
        )
        .upsert(
          {
            kategori,

            tahun,

            sumber,

            infografis_url:
              infografisUrl,

            infografis_path:
              infografisPath,

            aktif,

            updated_at:
              new Date()
                .toISOString(),
          },
          {
            onConflict:
              'kategori,tahun',
          }
        );

    if (
      saveError
    ) {
      if (
        uploadedPath
      ) {
        await removeStorageFile(
          uploadedPath
        );
      }

      throw new Error(
        `Data Desa Cantik gagal disimpan: ${saveError.message}`
      );
    }

    const oldPath =
      String(
        existing
          ?.infografis_path ??
          ''
      ).trim();

    if (
      oldPath &&
      oldPath !==
        infografisPath
    ) {
      await removeStorageFile(
        oldPath
      );
    }

    revalidateDesaCantik(
      kategori,
      tahun
    );

    return {
      error:
        null,

      success:
        `Media dan sumber data ${kategori} tahun ${tahun} berhasil disimpan.`,

      version:
        Date.now(),
    };
  } catch (error) {
    if (
      uploadedPath
    ) {
      await removeStorageFile(
        uploadedPath
      );
    }

    console.error(
      'Simpan media Desa Cantik error:',
      error
    );

    return {
      error:
        error instanceof
        Error
          ? error.message
          : 'Media Desa Cantik gagal disimpan.',

      success:
        null,

      version:
        Date.now(),
    };
  }
}

/* =========================================================
   DATA STATISTIK JSON
========================================================= */

export async function simpanDataStatistikDesaCantikAction(
  _previousState:
    DesaCantikAdminActionState,

  formData:
    FormData
): Promise<DesaCantikAdminActionState> {
  await requireAdmin();

  try {
    const kategori =
      parseKategori(
        getFormString(
          formData,
          'kategori'
        )
      );

    const tahun =
      parseTahun(
        getFormString(
          formData,
          'tahun'
        )
      );

    const rawJson =
      getFormString(
        formData,
        'data_json'
      ) ||
      '[]';

    if (
      rawJson.length >
      MAX_JSON_LENGTH
    ) {
      throw new Error(
        'Data statistik terlalu besar.'
      );
    }

    let parsed:
      unknown;

    try {
      parsed =
        JSON.parse(
          rawJson
        );
    } catch {
      throw new Error(
        'Format JSON tidak valid. Periksa tanda koma, kurung, dan tanda kutip.'
      );
    }

    if (
      !Array.isArray(
        parsed
      )
    ) {
      throw new Error(
        'Data statistik harus berupa array JSON.'
      );
    }

    const validationError =
      validateStatistikData(
        kategori,
        parsed
      );

    if (
      validationError
    ) {
      throw new Error(
        validationError
      );
    }

    const {
      error,
    } =
      await supabaseAdmin
        .from(
          'desa_cantik_data'
        )
        .upsert(
          {
            kategori,

            tahun,

            data:
              parsed,

            updated_at:
              new Date()
                .toISOString(),
          },
          {
            onConflict:
              'kategori,tahun',
          }
        );

    if (error) {
      throw new Error(
        `Data statistik gagal disimpan: ${error.message}`
      );
    }

    revalidateDesaCantik(
      kategori,
      tahun
    );

    return {
      error:
        null,

      success:
        `Data statistik ${kategori} tahun ${tahun} berhasil disimpan ke Supabase.`,

      version:
        Date.now(),
    };
  } catch (error) {
    console.error(
      'Simpan data statistik Desa Cantik error:',
      error
    );

    return {
      error:
        error instanceof
        Error
          ? error.message
          : 'Data statistik gagal disimpan.',

      success:
        null,

      version:
        Date.now(),
    };
  }
}

/* =========================================================
   MIGRASI DATA HARDCODED -> SUPABASE
========================================================= */

export async function migrasikanDataStatisDesaCantikAction(
  formData:
    FormData
) {
  await requireAdmin();

  const returnKategori =
    parseKategori(
      getFormString(
        formData,
        'return_kategori'
      )
    );

  const returnTahun =
    parseTahun(
      getFormString(
        formData,
        'return_tahun'
      )
    );

  let berhasil =
    0;

  let dilewati =
    0;

  for (
    const kategori of
      ALLOWED_CATEGORIES
  ) {
    for (
      const tahun of
        TAHUN_DESA_CANTIK
    ) {
      const fallback =
        getStaticDesaCantikDataset(
          kategori,
          tahun
        );

      if (
        fallback.data.length ===
        0
      ) {
        dilewati +=
          1;

        continue;
      }

      const {
        data:
          existing,

        error:
          existingError,
      } =
        await supabaseAdmin
          .from(
            'desa_cantik_data'
          )
          .select(`
            id,
            sumber,
            data
          `)
          .eq(
            'kategori',
            kategori
          )
          .eq(
            'tahun',
            tahun
          )
          .maybeSingle();

      if (
        existingError
      ) {
        console.error(
          'Migrasi Desa Cantik gagal memeriksa data:',
          existingError
        );

        continue;
      }

      const existingData =
        Array.isArray(
          existing?.data
        )
          ? existing.data
          : [];

      /*
       * Jangan menimpa data yang sudah diedit di Supabase.
       */
      if (
        existingData.length >
        0
      ) {
        dilewati +=
          1;

        continue;
      }

      if (
        existing
      ) {
        const {
          error,
        } =
          await supabaseAdmin
            .from(
              'desa_cantik_data'
            )
            .update({
              sumber:
                String(
                  existing.sumber ??
                    ''
                ).trim() ||
                fallback.sumber,

              data:
                fallback.data,

              updated_at:
                new Date()
                  .toISOString(),
            })
            .eq(
              'id',
              existing.id
            );

        if (error) {
          console.error(
            `Migrasi ${kategori} ${tahun} gagal:`,
            error
          );

          continue;
        }
      } else {
        const {
          error,
        } =
          await supabaseAdmin
            .from(
              'desa_cantik_data'
            )
            .insert({
              kategori,

              tahun,

              sumber:
                fallback.sumber,

              data:
                fallback.data,

              aktif:
                true,

              created_at:
                new Date()
                  .toISOString(),

              updated_at:
                new Date()
                  .toISOString(),
            });

        if (error) {
          console.error(
            `Migrasi ${kategori} ${tahun} gagal:`,
            error
          );

          continue;
        }
      }

      berhasil +=
        1;

      revalidateDesaCantik(
        kategori,
        tahun
      );
    }
  }

  const params =
    new URLSearchParams({
      success:
        `${berhasil} dataset berhasil dipindahkan ke Supabase. ${dilewati} dataset dilewati karena kosong atau sudah tersimpan.`,
    });

  redirect(
    `/admin/desa-cantik/${returnKategori}/${returnTahun}?${params.toString()}`
  );
}

/* =========================================================
   PUBLIKASI PDF
========================================================= */

export async function simpanPublikasiDesaCantikAction(
  _previousState:
    DesaCantikAdminActionState,

  formData:
    FormData
): Promise<DesaCantikAdminActionState> {
  await requireAdmin();

  let uploadedPath:
    string | null =
    null;

  try {
    const tahun =
      parseTahun(
        getFormString(
          formData,
          'tahun'
        )
      );

    const judul =
      getFormString(
        formData,
        'judul'
      );

    const deskripsi =
      getFormString(
        formData,
        'deskripsi'
      );

    const aktif =
      getFormString(
        formData,
        'aktif'
      ) ===
      'on';

    const hapusPdf =
      getFormString(
        formData,
        'hapus_pdf'
      ) ===
      'on';

    const fileValue =
      formData.get(
        'dokumen_pdf'
      );

    const file =
      fileValue instanceof
          File &&
      fileValue.size >
        0
        ? fileValue
        : null;

    if (
      judul.length <
        3 ||
      judul.length >
        250
    ) {
      throw new Error(
        'Judul publikasi harus terdiri dari 3 sampai 250 karakter.'
      );
    }

    if (
      deskripsi.length >
      2000
    ) {
      throw new Error(
        'Deskripsi publikasi maksimal 2000 karakter.'
      );
    }

    const {
      data:
        existing,

      error:
        existingError,
    } =
      await supabaseAdmin
        .from(
          'desa_cantik_publikasi'
        )
        .select(`
          id,
          pdf_url,
          pdf_path
        `)
        .eq(
          'tahun',
          tahun
        )
        .maybeSingle();

    if (
      existingError
    ) {
      throw new Error(
        `Publikasi gagal diperiksa: ${existingError.message}`
      );
    }

    let pdfUrl =
      existing
        ?.pdf_url ??
      null;

    let pdfPath =
      existing
        ?.pdf_path ??
      null;

    if (file) {
      validatePdf(
        file
      );

      const uploaded =
        await uploadFile({
          file,

          folder:
            `publikasi/${tahun}`,

          prefix:
            `publikasi-desa-keji-${tahun}`,
        });

      uploadedPath =
        uploaded.path;

      pdfUrl =
        uploaded.url;

      pdfPath =
        uploaded.path;
    } else if (
      hapusPdf
    ) {
      pdfUrl =
        null;

      pdfPath =
        null;
    }

    const {
      error:
        saveError,
    } =
      await supabaseAdmin
        .from(
          'desa_cantik_publikasi'
        )
        .upsert(
          {
            tahun,

            judul,

            deskripsi,

            pdf_url:
              pdfUrl,

            pdf_path:
              pdfPath,

            aktif,

            updated_at:
              new Date()
                .toISOString(),
          },
          {
            onConflict:
              'tahun',
          }
        );

    if (
      saveError
    ) {
      if (
        uploadedPath
      ) {
        await removeStorageFile(
          uploadedPath
        );
      }

      throw new Error(
        `Publikasi gagal disimpan: ${saveError.message}`
      );
    }

    const oldPath =
      String(
        existing
          ?.pdf_path ??
          ''
      ).trim();

    if (
      oldPath &&
      oldPath !==
        pdfPath
    ) {
      await removeStorageFile(
        oldPath
      );
    }

    revalidatePath(
      '/admin/desa-cantik'
    );

    revalidatePath(
      `/admin/desa-cantik/publikasi/${tahun}`
    );

    revalidatePath(
      '/desa-cantik'
    );

    return {
      error:
        null,

      success:
        `Publikasi Desa Keji Dalam Angka tahun ${tahun} berhasil disimpan.`,

      version:
        Date.now(),
    };
  } catch (error) {
    if (
      uploadedPath
    ) {
      await removeStorageFile(
        uploadedPath
      );
    }

    console.error(
      'Simpan publikasi Desa Cantik error:',
      error
    );

    return {
      error:
        error instanceof
        Error
          ? error.message
          : 'Publikasi Desa Cantik gagal disimpan.',

      success:
        null,

      version:
        Date.now(),
    };
  }
}