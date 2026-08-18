// app/admin/umkm/actions.ts

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

const ADMIN_PATH =
  '/admin/umkm';

const SETTINGS_TABLE =
  'paket_wisata_settings';

const SETTINGS_KEY =
  'utama';

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
    formData.get(key) ??
      ''
  ).trim();
}

function getBoolean(
  formData: FormData,
  key: string
) {
  return (
    getString(
      formData,
      key
    ) === 'true'
  );
}

function getNumber(
  formData: FormData,
  key: string
) {
  return Number(
    getString(
      formData,
      key
    )
  );
}

function slugify(
  value: string
) {
  return value
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      '-'
    )
    .replace(
      /^-+|-+$/g,
      ''
    )
    .slice(0, 120);
}

function isValidImageUrl(
  value: string
) {
  if (!value) {
    return true;
  }

  return (
    value.startsWith('/') ||
    value.startsWith(
      'https://'
    ) ||
    value.startsWith(
      'http://'
    )
  );
}

function isValidExternalUrl(
  value: string
) {
  if (!value) {
    return true;
  }

  try {
    const url =
      new URL(value);

    return (
      url.protocol ===
        'https:' ||
      url.protocol ===
        'http:'
    );
  } catch {
    return false;
  }
}

function normalizeWhatsapp(
  value: string
) {
  if (!value) {
    return null;
  }

  let nomor =
    value.replace(
      /\D/g,
      ''
    );

  if (
    nomor.startsWith('0')
  ) {
    nomor =
      `62${nomor.slice(1)}`;
  } else if (
    nomor.startsWith('8')
  ) {
    nomor =
      `62${nomor}`;
  }

  if (
    nomor.length < 10 ||
    nomor.length > 15
  ) {
    return null;
  }

  return nomor;
}

function buildAdminUrl(
  type:
    | 'success'
    | 'error',
  message: string,
  section = 'produk-umkm'
) {
  const params =
    new URLSearchParams({
      [type]: message,
    });

  return `${ADMIN_PATH}?${params.toString()}#${section}`;
}

function revalidateUmkm() {
  revalidatePath(
    ADMIN_PATH
  );

  revalidatePath(
    '/umkm'
  );

  revalidatePath(
    '/profil/sejarah'
  );

  revalidatePath(
    '/desa-wisata/paket-wisata'
  );

  revalidatePath(
    '/admin'
  );
}

/* =========================================================
   E-CATALOG UMKM
========================================================= */

interface EcatalogInput {
  judul: string;
  deskripsi: string;
  url: string;
  aktif: boolean;
}

function parseEcatalogInput(
  formData: FormData
): EcatalogInput {
  return {
    judul:
      getString(
        formData,
        'ecatalog_judul'
      ),

    deskripsi:
      getString(
        formData,
        'ecatalog_deskripsi'
      ),

    url:
      getString(
        formData,
        'ecatalog_url'
      ),

    aktif:
      getBoolean(
        formData,
        'ecatalog_aktif'
      ),
  };
}

function validateEcatalog(
  input: EcatalogInput
) {
  if (
    input.judul.length < 5
  ) {
    return 'Judul E-Catalog minimal terdiri dari 5 karakter.';
  }

  if (
    input.deskripsi.length <
    10
  ) {
    return 'Deskripsi E-Catalog minimal terdiri dari 10 karakter.';
  }

  if (
    input.url &&
    !isValidExternalUrl(
      input.url
    )
  ) {
    return 'URL E-Catalog harus berupa alamat http:// atau https:// yang valid.';
  }

  if (
    input.aktif &&
    !input.url
  ) {
    return 'URL E-Catalog wajib diisi sebelum E-Catalog diaktifkan.';
  }

  return null;
}

export async function simpanEcatalogUmkmAction(
  formData: FormData
) {
  await requireAdmin();

  const input =
    parseEcatalogInput(
      formData
    );

  const validationError =
    validateEcatalog(
      input
    );

  if (validationError) {
    redirect(
      buildAdminUrl(
        'error',
        validationError,
        'ecatalog-umkm'
      )
    );
  }

  const {
    error,
  } = await supabaseAdmin
    .from(
      SETTINGS_TABLE
    )
    .upsert(
      {
        setting_key:
          SETTINGS_KEY,

        ecatalog_judul:
          input.judul,

        ecatalog_deskripsi:
          input.deskripsi,

        ecatalog_url:
          input.url ||
          null,

        ecatalog_aktif:
          input.aktif,

        updated_at:
          new Date()
            .toISOString(),
      },
      {
        onConflict:
          'setting_key',
      }
    );

  if (error) {
    console.error(
      'Gagal menyimpan pengaturan E-Catalog UMKM:',
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

    redirect(
      buildAdminUrl(
        'error',
        error.message,
        'ecatalog-umkm'
      )
    );
  }

  revalidateUmkm();

  redirect(
    buildAdminUrl(
      'success',
      input.aktif
        ? 'E-Catalog UMKM berhasil disimpan dan dipublikasikan.'
        : 'Pengaturan E-Catalog UMKM berhasil disimpan.',
      'ecatalog-umkm'
    )
  );
}

/* =========================================================
   PANDUAN SUKSES BERJUALAN
========================================================= */

interface PanduanUmkmInput {
  judul: string;
  deskripsi: string;
  gambarUrl: string;
  aktif: boolean;
}

function parsePanduanUmkmInput(
  formData: FormData
): PanduanUmkmInput {
  return {
    judul:
      getString(
        formData,
        'panduan_umkm_judul'
      ),

    deskripsi:
      getString(
        formData,
        'panduan_umkm_deskripsi'
      ),

    gambarUrl:
      getString(
        formData,
        'panduan_umkm_gambar_url'
      ),

    aktif:
      getBoolean(
        formData,
        'panduan_umkm_aktif'
      ),
  };
}

function validatePanduanUmkm(
  input: PanduanUmkmInput
) {
  if (
    input.judul.length < 5
  ) {
    return 'Judul panduan minimal terdiri dari 5 karakter.';
  }

  if (
    input.judul.length > 160
  ) {
    return 'Judul panduan maksimal terdiri dari 160 karakter.';
  }

  if (
    input.deskripsi.length < 10
  ) {
    return 'Deskripsi panduan minimal terdiri dari 10 karakter.';
  }

  if (
    input.deskripsi.length > 1000
  ) {
    return 'Deskripsi panduan maksimal terdiri dari 1000 karakter.';
  }

  if (
    input.gambarUrl &&
    !isValidImageUrl(
      input.gambarUrl
    )
  ) {
    return 'URL atau path gambar panduan tidak valid.';
  }

  if (
    input.aktif &&
    !input.gambarUrl
  ) {
    return 'Gambar panduan wajib diisi sebelum panduan dipublikasikan.';
  }

  return null;
}

export async function simpanPanduanUmkmAction(
  formData: FormData
) {
  await requireAdmin();

  const input =
    parsePanduanUmkmInput(
      formData
    );

  const validationError =
    validatePanduanUmkm(
      input
    );

  if (validationError) {
    redirect(
      buildAdminUrl(
        'error',
        validationError,
        'panduan-umkm'
      )
    );
  }

  const {
    error,
  } = await supabaseAdmin
    .from(
      SETTINGS_TABLE
    )
    .upsert(
      {
        setting_key:
          SETTINGS_KEY,

        panduan_umkm_judul:
          input.judul,

        panduan_umkm_deskripsi:
          input.deskripsi,

        panduan_umkm_gambar_url:
          input.gambarUrl ||
          null,

        panduan_umkm_aktif:
          input.aktif,

        updated_at:
          new Date()
            .toISOString(),
      },
      {
        onConflict:
          'setting_key',
      }
    );

  if (error) {
    console.error(
      'Gagal menyimpan Panduan UMKM:',
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

    redirect(
      buildAdminUrl(
        'error',
        error.message,
        'panduan-umkm'
      )
    );
  }

  revalidateUmkm();

  redirect(
    buildAdminUrl(
      'success',
      input.aktif
        ? 'Panduan Sukses Berjualan berhasil disimpan dan dipublikasikan.'
        : 'Panduan Sukses Berjualan berhasil disimpan.',
      'panduan-umkm'
    )
  );
}

/* =========================================================
   PRODUK UMKM
========================================================= */

interface ProdukInput {
  namaProduk: string;
  slug: string;
  kategori: string;
  harga: number;
  satuan: string;
  deskripsi: string;
  namaPenjual: string;
  nomorWhatsapp: string;
  alamat: string;
  lokasiUrl: string;
  gambarUrl: string;
  terverifikasi: boolean;
  aktif: boolean;
  urutan: number;
}

function parseProdukInput(
  formData: FormData
): ProdukInput {
  const namaProduk =
    getString(
      formData,
      'nama_produk'
    );

  const slugInput =
    getString(
      formData,
      'slug'
    );

  return {
    namaProduk,

    slug:
      slugify(
        slugInput ||
          namaProduk
      ),

    kategori:
      getString(
        formData,
        'kategori'
      ),

    harga:
      getNumber(
        formData,
        'harga'
      ),

    satuan:
      getString(
        formData,
        'satuan'
      ),

    deskripsi:
      getString(
        formData,
        'deskripsi'
      ),

    namaPenjual:
      getString(
        formData,
        'nama_penjual'
      ),

    nomorWhatsapp:
      getString(
        formData,
        'nomor_whatsapp'
      ),

    alamat:
      getString(
        formData,
        'alamat'
      ),

    lokasiUrl:
      getString(
        formData,
        'lokasi_url'
      ),

    gambarUrl:
      getString(
        formData,
        'gambar_url'
      ),

    terverifikasi:
      getBoolean(
        formData,
        'terverifikasi'
      ),

    aktif:
      getBoolean(
        formData,
        'aktif'
      ),

    urutan:
      getNumber(
        formData,
        'urutan'
      ),
  };
}

function validateProduk(
  input: ProdukInput
) {
  if (
    input.namaProduk.length <
    3
  ) {
    return 'Nama produk minimal terdiri dari 3 karakter.';
  }

  if (
    input.slug.length <
    3
  ) {
    return 'Slug produk tidak valid.';
  }

  if (
    input.kategori.length <
    2
  ) {
    return 'Kategori produk wajib diisi.';
  }

  if (
    !Number.isFinite(
      input.harga
    ) ||
    input.harga < 0
  ) {
    return 'Harga produk tidak valid.';
  }

  if (
    input.satuan.length <
    1
  ) {
    return 'Satuan produk wajib diisi.';
  }

  if (
    input.namaPenjual.length <
    2
  ) {
    return 'Nama penjual wajib diisi.';
  }

  if (
    input.nomorWhatsapp &&
    !normalizeWhatsapp(
      input.nomorWhatsapp
    )
  ) {
    return 'Nomor WhatsApp tidak valid.';
  }

  if (
    !isValidExternalUrl(
      input.lokasiUrl
    )
  ) {
    return 'URL lokasi harus berupa alamat http:// atau https:// yang valid.';
  }

  if (
    !isValidImageUrl(
      input.gambarUrl
    )
  ) {
    return 'URL gambar harus dimulai dengan /, http://, atau https://.';
  }

  if (
    !Number.isInteger(
      input.urutan
    ) ||
    input.urutan < 0
  ) {
    return 'Nomor urutan harus berupa bilangan bulat minimal 0.';
  }

  return null;
}

async function getUniqueSlug(
  requestedSlug: string,
  excludeId?: string
) {
  const baseSlug =
    slugify(
      requestedSlug
    ) || 'produk';

  let candidate =
    baseSlug;

  for (
    let index = 1;
    index <= 50;
    index += 1
  ) {
    const {
      data,
      error,
    } = await supabaseAdmin
      .from(
        'produk_umkm'
      )
      .select(`
        id
      `)
      .eq(
        'slug',
        candidate
      )
      .limit(1);

    if (error) {
      throw new Error(
        error.message
      );
    }

    const existing =
      data?.[0];

    if (
      !existing ||
      (
        excludeId &&
        String(
          existing.id
        ) === excludeId
      )
    ) {
      return candidate;
    }

    candidate =
      `${baseSlug}-${index + 1}`;
  }

  return `${baseSlug}-${Date.now()}`;
}

function produkPayload(
  input: ProdukInput,
  slug: string
) {
  return {
    nama_produk:
      input.namaProduk,

    slug,

    kategori:
      input.kategori,

    harga:
      input.harga,

    satuan:
      input.satuan,

    deskripsi:
      input.deskripsi ||
      null,

    nama_penjual:
      input.namaPenjual,

    nomor_whatsapp:
      normalizeWhatsapp(
        input.nomorWhatsapp
      ),

    alamat:
      input.alamat ||
      null,

    lokasi_url:
      input.lokasiUrl ||
      null,

    gambar_url:
      input.gambarUrl ||
      null,

    terverifikasi:
      input.terverifikasi,

    aktif:
      input.aktif,

    urutan:
      input.urutan,

    updated_at:
      new Date()
        .toISOString(),
  };
}

export async function tambahProdukUmkmAction(
  formData: FormData
) {
  await requireAdmin();

  const input =
    parseProdukInput(
      formData
    );

  const validationError =
    validateProduk(
      input
    );

  if (validationError) {
    redirect(
      buildAdminUrl(
        'error',
        validationError,
        'tambah-produk'
      )
    );
  }

  let uniqueSlug:
    string;

  try {
    uniqueSlug =
      await getUniqueSlug(
        input.slug
      );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Gagal memeriksa slug produk.';

    redirect(
      buildAdminUrl(
        'error',
        message,
        'tambah-produk'
      )
    );
  }

  const {
    error,
  } = await supabaseAdmin
    .from(
      'produk_umkm'
    )
    .insert({
      ...produkPayload(
        input,
        uniqueSlug
      ),

      created_at:
        new Date()
          .toISOString(),
    });

  if (error) {
    console.error(
      'Gagal menambahkan produk UMKM:',
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

    redirect(
      buildAdminUrl(
        'error',
        error.message,
        'tambah-produk'
      )
    );
  }

  revalidateUmkm();

  redirect(
    buildAdminUrl(
      'success',
      'Produk UMKM berhasil ditambahkan.'
    )
  );
}

export async function ubahProdukUmkmAction(
  formData: FormData
) {
  await requireAdmin();

  const id =
    getString(
      formData,
      'id'
    );

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID produk tidak valid.'
      )
    );
  }

  const input =
    parseProdukInput(
      formData
    );

  const validationError =
    validateProduk(
      input
    );

  if (validationError) {
    redirect(
      buildAdminUrl(
        'error',
        validationError
      )
    );
  }

  let uniqueSlug:
    string;

  try {
    uniqueSlug =
      await getUniqueSlug(
        input.slug,
        id
      );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Gagal memeriksa slug produk.';

    redirect(
      buildAdminUrl(
        'error',
        message
      )
    );
  }

  const {
    error,
  } = await supabaseAdmin
    .from(
      'produk_umkm'
    )
    .update(
      produkPayload(
        input,
        uniqueSlug
      )
    )
    .eq(
      'id',
      id
    );

  if (error) {
    console.error(
      'Gagal memperbarui produk UMKM:',
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

    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidateUmkm();

  redirect(
    buildAdminUrl(
      'success',
      'Produk UMKM berhasil diperbarui.'
    )
  );
}

export async function toggleAktifProdukUmkmAction(
  formData: FormData
) {
  await requireAdmin();

  const id =
    getString(
      formData,
      'id'
    );

  const aktif =
    getBoolean(
      formData,
      'aktif'
    );

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID produk tidak valid.'
      )
    );
  }

  const {
    error,
  } = await supabaseAdmin
    .from(
      'produk_umkm'
    )
    .update({
      aktif,

      updated_at:
        new Date()
          .toISOString(),
    })
    .eq(
      'id',
      id
    );

  if (error) {
    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidateUmkm();

  redirect(
    buildAdminUrl(
      'success',
      aktif
        ? 'Produk berhasil diaktifkan.'
        : 'Produk berhasil dinonaktifkan.'
    )
  );
}

export async function toggleVerifikasiProdukUmkmAction(
  formData: FormData
) {
  await requireAdmin();

  const id =
    getString(
      formData,
      'id'
    );

  const terverifikasi =
    getBoolean(
      formData,
      'terverifikasi'
    );

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID produk tidak valid.'
      )
    );
  }

  const {
    error,
  } = await supabaseAdmin
    .from(
      'produk_umkm'
    )
    .update({
      terverifikasi,

      updated_at:
        new Date()
          .toISOString(),
    })
    .eq(
      'id',
      id
    );

  if (error) {
    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidateUmkm();

  redirect(
    buildAdminUrl(
      'success',
      terverifikasi
        ? 'Produk berhasil diverifikasi.'
        : 'Status verifikasi produk berhasil dicabut.'
    )
  );
}

export async function hapusProdukUmkmAction(
  formData: FormData
) {
  await requireAdmin();

  const id =
    getString(
      formData,
      'id'
    );

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID produk tidak valid.'
      )
    );
  }

  const {
    error,
  } = await supabaseAdmin
    .from(
      'produk_umkm'
    )
    .delete()
    .eq(
      'id',
      id
    );

  if (error) {
    console.error(
      'Gagal menghapus produk UMKM:',
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

    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidateUmkm();

  redirect(
    buildAdminUrl(
      'success',
      'Produk UMKM berhasil dihapus.'
    )
  );
}