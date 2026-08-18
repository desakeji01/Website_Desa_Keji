// app/admin/tilik-arkeji/page.tsx

import type {
  ReactNode,
} from 'react';

import Link from 'next/link';

import {
  AlertCircle,
  Archive,
  BadgeCheck,
  CheckCircle2,
  ExternalLink,
  Image as ImageIcon,
  Images,
  Landmark,
  Pencil,
  Power,
  Save,
  Trash2,
  Upload,
  Users,
  type LucideIcon,
} from 'lucide-react';

import {
  hapusMantanKadesAction,
  hapusMediaTilikAction,
  hapusPenghargaanAction,
  simpanPengaturanTilikAction,
  tambahMantanKadesAction,
  tambahMediaTilikAction,
  tambahPenghargaanAction,
  toggleMantanKadesAction,
  toggleMediaTilikAction,
  togglePenghargaanAction,
  ubahMantanKadesAction,
  ubahMediaTilikAction,
  ubahPenghargaanAction,
} from '@/app/admin/tilik-arkeji/actions';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

/* =========================================================
   CONFIG
========================================================= */

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

/* =========================================================
   TYPES
========================================================= */

interface PageProps {
  searchParams:
    Promise<{
      success?:
        string;

      error?:
        string;
    }>;
}

interface PengaturanTilik {
  judul:
    string;

  deskripsi:
    string;
}

interface KepalaDesaAdmin {
  id:
    string;

  nama:
    string;

  periode_mulai:
    number;

  periode_selesai:
    number | null;

  biografi:
    string;

  foto_url:
    string | null;

  urutan:
    number;

  aktif:
    boolean;
}

interface PenghargaanAdmin {
  id:
    string;

  nama_penghargaan:
    string;

  tahun:
    number;

  tingkat:
    string;

  penyelenggara:
    string;

  deskripsi:
    string;

  foto_url:
    string | null;

  urutan:
    number;

  aktif:
    boolean;
}

interface StrukturAdmin {
  id:
    string;

  judul:
    string;

  deskripsi:
    string;

  gambar_url:
    string | null;

  urutan:
    number;

  aktif:
    boolean;
}

/* =========================================================
   FALLBACK
========================================================= */

const fallbackPengaturan:
  PengaturanTilik = {
  judul:
    'Tilik Arkeji',

  deskripsi:
    'Arsip digital kepemimpinan, struktur organisasi, dan pencapaian Desa Keji.',
};

/* =========================================================
   HELPERS
========================================================= */

function safeString(
  value:
    unknown
) {
  return String(
    value ??
      ''
  ).trim();
}

function nullableString(
  value:
    unknown
) {
  const result =
    safeString(
      value
    );

  return (
    result ||
    null
  );
}

/* =========================================================
   NORMALIZE SETTINGS
========================================================= */

function normalizePengaturan(
  value:
    unknown
): PengaturanTilik {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(
      value
    )
  ) {
    return (
      fallbackPengaturan
    );
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  return {
    judul:
      safeString(
        row.judul
      ) ||
      fallbackPengaturan
        .judul,

    deskripsi:
      safeString(
        row.deskripsi
      ) ||
      fallbackPengaturan
        .deskripsi,
  };
}

/* =========================================================
   NORMALIZE KEPALA DESA
========================================================= */

function normalizeKepalaDesa(
  value:
    unknown
): KepalaDesaAdmin | null {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(
      value
    )
  ) {
    return null;
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  const id =
    safeString(
      row.id
    );

  const nama =
    safeString(
      row.nama
    );

  const biografi =
    safeString(
      row.biografi
    );

  const periodeMulai =
    Number(
      row.periode_mulai
    );

  const periodeSelesai =
    row.periode_selesai ===
      null ||
    row.periode_selesai ===
      undefined
      ? null
      : Number(
          row.periode_selesai
        );

  const urutan =
    Number(
      row.urutan ??
        0
    );

  if (
    !id ||
    !nama ||
    !biografi ||
    !Number.isInteger(
      periodeMulai
    ) ||
    !Number.isInteger(
      urutan
    )
  ) {
    return null;
  }

  return {
    id,

    nama,

    periode_mulai:
      periodeMulai,

    periode_selesai:
      periodeSelesai !==
        null &&
      Number.isInteger(
        periodeSelesai
      )
        ? periodeSelesai
        : null,

    biografi,

    foto_url:
      nullableString(
        row.foto_url
      ),

    urutan,

    aktif:
      Boolean(
        row.aktif
      ),
  };
}

/* =========================================================
   NORMALIZE PENGHARGAAN
========================================================= */

function normalizePenghargaan(
  value:
    unknown
): PenghargaanAdmin | null {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(
      value
    )
  ) {
    return null;
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  const id =
    safeString(
      row.id
    );

  const namaPenghargaan =
    safeString(
      row.nama_penghargaan
    );

  const tahun =
    Number(
      row.tahun
    );

  const tingkat =
    safeString(
      row.tingkat
    );

  const penyelenggara =
    safeString(
      row.penyelenggara
    );

  const deskripsi =
    safeString(
      row.deskripsi
    );

  const urutan =
    Number(
      row.urutan ??
        0
    );

  if (
    !id ||
    !namaPenghargaan ||
    !tingkat ||
    !penyelenggara ||
    !deskripsi ||
    !Number.isInteger(
      tahun
    ) ||
    !Number.isInteger(
      urutan
    )
  ) {
    return null;
  }

  return {
    id,

    nama_penghargaan:
      namaPenghargaan,

    tahun,

    tingkat,

    penyelenggara,

    deskripsi,

    foto_url:
      nullableString(
        row.foto_url
      ),

    urutan,

    aktif:
      Boolean(
        row.aktif
      ),
  };
}

/* =========================================================
   NORMALIZE STRUKTUR
========================================================= */

function normalizeStruktur(
  value:
    unknown
): StrukturAdmin | null {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(
      value
    )
  ) {
    return null;
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  const id =
    safeString(
      row.id
    );

  const judul =
    safeString(
      row.judul
    );

  const urutan =
    Number(
      row.urutan ??
        0
    );

  if (
    !id ||
    !judul ||
    !Number.isInteger(
      urutan
    )
  ) {
    return null;
  }

  return {
    id,

    judul,

    deskripsi:
      safeString(
        row.deskripsi
      ),

    gambar_url:
      nullableString(
        row.gambar_url
      ),

    urutan,

    aktif:
      Boolean(
        row.aktif
      ),
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function AdminTilikArkejiPage({
  searchParams,
}: PageProps) {
  const [
    params,
    pengaturanResult,
    kepalaDesaResult,
    penghargaanResult,
    strukturResult,
  ] =
    await Promise.all([
      searchParams,

      /* ===================================================
         SETTINGS
      =================================================== */

      supabaseAdmin
        .from(
          'tilik_arkeji_settings'
        )
        .select(`
          judul,
          deskripsi
        `)
        .eq(
          'setting_key',
          'utama'
        )
        .maybeSingle(),

      /* ===================================================
         KEPALA DESA
      =================================================== */

      supabaseAdmin
        .from(
          'tilik_arkeji_mantan_kades'
        )
        .select(`
          id,
          nama,
          periode_mulai,
          periode_selesai,
          biografi,
          foto_url,
          urutan,
          aktif
        `)
        .order(
          'urutan',
          {
            ascending:
              true,
          }
        )
        .order(
          'periode_mulai',
          {
            ascending:
              true,
          }
        ),

      /* ===================================================
         PENGHARGAAN
      =================================================== */

      supabaseAdmin
        .from(
          'tilik_arkeji_penghargaan'
        )
        .select(`
          id,
          nama_penghargaan,
          tahun,
          tingkat,
          penyelenggara,
          deskripsi,
          foto_url,
          urutan,
          aktif
        `)
        .order(
          'urutan',
          {
            ascending:
              true,
          }
        )
        .order(
          'tahun',
          {
            ascending:
              false,
          }
        ),

      /* ===================================================
         STRUKTUR

         Hanya kategori struktur-organisasi.
         Galeri tidak lagi dikelola dari Tilik Arkeji.
      =================================================== */

      supabaseAdmin
        .from(
          'tilik_arkeji_media'
        )
        .select(`
          id,
          judul,
          deskripsi,
          gambar_url,
          urutan,
          aktif
        `)
        .eq(
          'kategori',
          'struktur-organisasi'
        )
        .order(
          'urutan',
          {
            ascending:
              true,
          }
        )
        .order(
          'created_at',
          {
            ascending:
              false,
          }
        ),
    ]);

  /* =======================================================
     ERRORS
  ======================================================= */

  if (
    pengaturanResult.error
  ) {
    console.error(
      'Gagal mengambil pengaturan Tilik Arkeji:',
      pengaturanResult.error
    );
  }

  if (
    kepalaDesaResult.error
  ) {
    console.error(
      'Gagal mengambil data kepala desa:',
      kepalaDesaResult.error
    );
  }

  if (
    penghargaanResult.error
  ) {
    console.error(
      'Gagal mengambil penghargaan:',
      penghargaanResult.error
    );
  }

  if (
    strukturResult.error
  ) {
    console.error(
      'Gagal mengambil struktur organisasi:',
      strukturResult.error
    );
  }

  /* =======================================================
     DATA
  ======================================================= */

  const pengaturan =
    normalizePengaturan(
      pengaturanResult.data
    );

  const daftarKepalaDesa =
    (
      kepalaDesaResult.data ??
      []
    )
      .map(
        normalizeKepalaDesa
      )
      .filter(
        (
          item
        ): item is KepalaDesaAdmin =>
          item !==
          null
      );

  const daftarPenghargaan =
    (
      penghargaanResult.data ??
      []
    )
      .map(
        normalizePenghargaan
      )
      .filter(
        (
          item
        ): item is PenghargaanAdmin =>
          item !==
          null
      );

  const daftarStruktur =
    (
      strukturResult.data ??
      []
    )
      .map(
        normalizeStruktur
      )
      .filter(
        (
          item
        ): item is StrukturAdmin =>
          item !==
          null
      );

  const tahunSekarang =
    new Date()
      .getFullYear();

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 px-6 py-8 text-white shadow-xl sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.16) 1.5px, transparent 1.5px)',

            backgroundSize:
              '26px 26px',
          }}
        />

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[52px] border-white/[0.04]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <Archive
                size={28}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                Arsip Digital Desa
                Keji
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                Kelola Tilik
                Arkeji
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                Kelola Biografi
                Kepala Desa Keji,
                Struktur Organisasi,
                dan Penghargaan Desa
                melalui data dan
                unggahan gambar
                langsung.
              </p>
            </div>
          </div>

          <Link
            href="/profil/tilik-arkeji"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-900 transition hover:bg-emerald-50"
          >
            Lihat Halaman Publik

            <ExternalLink
              size={16}
            />
          </Link>
        </div>
      </section>

      {/* =====================================================
          MESSAGE
      ===================================================== */}

      {params.success && (
        <Message
          type="success"
          text={
            params.success
          }
        />
      )}

      {params.error && (
        <Message
          type="error"
          text={
            params.error
          }
        />
      )}

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="grid gap-5 md:grid-cols-3">
        <StatCard
          label="Kepala Desa"
          value={
            daftarKepalaDesa.length
          }
          description={`${
            daftarKepalaDesa.filter(
              (
                item
              ) =>
                item.aktif
            ).length
          } data aktif`}
          icon={
            Users
          }
        />

        <StatCard
          label="Struktur Organisasi"
          value={
            daftarStruktur.length
          }
          description={`${
            daftarStruktur.filter(
              (
                item
              ) =>
                item.aktif
            ).length
          } gambar aktif`}
          icon={
            Landmark
          }
        />

        <StatCard
          label="Penghargaan"
          value={
            daftarPenghargaan.length
          }
          description={`${
            daftarPenghargaan.filter(
              (
                item
              ) =>
                item.aktif
            ).length
          } data aktif`}
          icon={
            BadgeCheck
          }
        />
      </section>

      {/* =====================================================
          INFO GALERI
      ===================================================== */}

      <section className="flex flex-col gap-5 rounded-3xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Images
              size={20}
            />
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-700">
              Galeri Desa
            </p>

            <h2 className="mt-1 font-black text-blue-950">
              Galeri dikelola
              terpisah
            </h2>

            <p className="mt-1 max-w-3xl text-sm font-medium leading-6 text-blue-800/80">
              Dokumentasi galeri
              tidak lagi dikelola
              melalui Tilik Arkeji.
              Gunakan halaman Admin
              Galeri untuk membuat
              album dan memasukkan
              foto.
            </p>
          </div>
        </div>

        <Link
          href="/admin/galeri"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-xs font-extrabold text-white transition hover:bg-blue-700"
        >
          Buka Admin Galeri

          <ExternalLink
            size={14}
          />
        </Link>
      </section>

      {/* =====================================================
          SETTINGS
      ===================================================== */}

      <form
        id="pengaturan-tilik"
        action={
          simpanPengaturanTilikAction
        }
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <SectionHeader
          label="Pengaturan Halaman"
          title="Judul dan Deskripsi Tilik Arkeji"
          description="Atur informasi utama yang tampil pada halaman publik Tilik Arkeji."
          icon={
            Archive
          }
        />

        <div className="grid gap-5 p-6 sm:p-7">
          <TextInput
            idPrefix="pengaturan"
            name="judul_halaman"
            label="Judul Halaman"
            value={
              pengaturan.judul
            }
          />

          <TextArea
            idPrefix="pengaturan"
            name="deskripsi_halaman"
            label="Deskripsi Halaman"
            value={
              pengaturan.deskripsi
            }
            rows={
              4
            }
          />

          <div className="flex justify-end">
            <SubmitButton
              text="Simpan Pengaturan"
            />
          </div>
        </div>
      </form>

      {/* =====================================================
          TAMBAH KEPALA DESA
      ===================================================== */}

      <form
        id="tambah-kepala-desa"
        action={
          tambahMantanKadesAction
        }
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <SectionHeader
          label="Arsip Kepemimpinan"
          title="Tambah Biografi Kepala Desa Keji"
          description="Masukkan biografi dan unggah foto kepala desa langsung dari perangkat."
          icon={
            Users
          }
        />

        <div className="grid gap-5 p-6 sm:p-7 md:grid-cols-2">
          <div className="md:col-span-2">
            <TextInput
              idPrefix="kepala-desa-baru"
              name="nama"
              label="Nama Lengkap"
              placeholder="Masukkan nama kepala desa"
            />
          </div>

          <NumberInput
            idPrefix="kepala-desa-baru"
            name="periode_mulai"
            label="Awal Masa Jabatan"
            value=""
            min={
              1900
            }
            max={
              2200
            }
          />

          <NumberInput
            idPrefix="kepala-desa-baru"
            name="periode_selesai"
            label="Akhir Masa Jabatan"
            value=""
            min={
              1900
            }
            max={
              2200
            }
            required={
              false
            }
          />

          <NumberInput
            idPrefix="kepala-desa-baru"
            name="urutan"
            label="Nomor Urutan"
            value={String(
              daftarKepalaDesa.length +
                1
            )}
            min={
              0
            }
          />

          <Checkbox
            id="kepala-desa-baru-aktif"
            name="aktif"
            label="Publikasikan Biografi"
            description="Biografi langsung tampil pada halaman publik."
            checked
          />

          <div className="md:col-span-2">
            <TextArea
              idPrefix="kepala-desa-baru"
              name="biografi"
              label="Biografi"
              placeholder="Tuliskan riwayat, kontribusi, dan pencapaian selama menjabat."
            />
          </div>

          <div className="md:col-span-2">
            <FileInput
              id="kepala-desa-baru-foto"
              name="foto"
              label="Foto Kepala Desa"
              required={
                false
              }
            />
          </div>

          <div className="flex justify-end md:col-span-2">
            <SubmitButton
              text="Tambah Biografi"
            />
          </div>
        </div>
      </form>

      {/* =====================================================
          DAFTAR KEPALA DESA
      ===================================================== */}

      <DataSection
        id="daftar-kepala-desa"
        label="Biografi"
        title="Biografi Kepala Desa Keji"
        description={`${daftarKepalaDesa.length} data tersimpan.`}
        icon={
          Users
        }
      >
        {daftarKepalaDesa.length ===
        0 ? (
          <EmptyState
            icon={
              Users
            }
            text="Belum ada Biografi Kepala Desa Keji."
          />
        ) : (
          <div className="grid gap-5 p-5 sm:p-7 xl:grid-cols-2">
            {daftarKepalaDesa.map(
              (
                item
              ) => (
                <KepalaDesaAdminCard
                  key={
                    item.id
                  }
                  item={
                    item
                  }
                />
              )
            )}
          </div>
        )}
      </DataSection>

      {/* =====================================================
          TAMBAH STRUKTUR
      ===================================================== */}

      <form
        id="tambah-struktur"
        action={
          tambahMediaTilikAction
        }
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <SectionHeader
          label="Pemerintahan Desa"
          title="Tambah Struktur Organisasi"
          description="Unggah gambar struktur organisasi langsung dari perangkat. Tidak menggunakan link Google Drive."
          icon={
            Landmark
          }
        />

        <div className="grid gap-5 p-6 sm:p-7 md:grid-cols-2">
          <div className="md:col-span-2">
            <TextInput
              idPrefix="struktur-baru"
              name="judul"
              label="Judul Struktur"
              placeholder="Contoh: Struktur Organisasi Pemerintah Desa Keji"
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              idPrefix="struktur-baru"
              name="deskripsi"
              label="Deskripsi"
              placeholder="Tuliskan keterangan singkat struktur organisasi."
              required={
                false
              }
              rows={
                4
              }
            />
          </div>

          <NumberInput
            idPrefix="struktur-baru"
            name="urutan"
            label="Nomor Urutan"
            value={String(
              daftarStruktur.length +
                1
            )}
            min={
              0
            }
          />

          <Checkbox
            id="struktur-baru-aktif"
            name="aktif"
            label="Publikasikan Struktur"
            description="Gambar langsung ditampilkan pada halaman publik."
            checked
          />

          <div className="md:col-span-2">
            <FileInput
              id="struktur-baru-gambar"
              name="gambar"
              label="Gambar Struktur Organisasi"
              required
            />
          </div>

          <div className="flex justify-end md:col-span-2">
            <SubmitButton
              text="Tambah Struktur"
            />
          </div>
        </div>
      </form>

      {/* =====================================================
          DAFTAR STRUKTUR
      ===================================================== */}

      <DataSection
        id="daftar-struktur"
        label="Struktur Organisasi"
        title="Daftar Struktur Organisasi"
        description={`${daftarStruktur.length} gambar tersimpan.`}
        icon={
          Landmark
        }
      >
        {daftarStruktur.length ===
        0 ? (
          <EmptyState
            icon={
              Landmark
            }
            text="Belum ada gambar Struktur Organisasi."
          />
        ) : (
          <div className="grid gap-5 p-5 sm:p-7 xl:grid-cols-2">
            {daftarStruktur.map(
              (
                item
              ) => (
                <StrukturAdminCard
                  key={
                    item.id
                  }
                  item={
                    item
                  }
                />
              )
            )}
          </div>
        )}
      </DataSection>

      {/* =====================================================
          TAMBAH PENGHARGAAN
      ===================================================== */}

      <form
        id="tambah-penghargaan"
        action={
          tambahPenghargaanAction
        }
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <SectionHeader
          label="Arsip Prestasi"
          title="Tambah Penghargaan Desa Keji"
          description="Masukkan informasi penghargaan dan unggah dokumentasi langsung dari perangkat."
          icon={
            BadgeCheck
          }
        />

        <div className="grid gap-5 p-6 sm:p-7 md:grid-cols-2">
          <div className="md:col-span-2">
            <TextInput
              idPrefix="penghargaan-baru"
              name="nama_penghargaan"
              label="Nama Penghargaan"
              placeholder="Masukkan nama penghargaan"
            />
          </div>

          <NumberInput
            idPrefix="penghargaan-baru"
            name="tahun"
            label="Tahun"
            value={String(
              tahunSekarang
            )}
            min={
              1900
            }
            max={
              2200
            }
          />

          <NumberInput
            idPrefix="penghargaan-baru"
            name="urutan"
            label="Nomor Urutan"
            value={String(
              daftarPenghargaan.length +
                1
            )}
            min={
              0
            }
          />

          <TextInput
            idPrefix="penghargaan-baru"
            name="tingkat"
            label="Tingkat"
            placeholder="Kabupaten, Provinsi, Nasional"
          />

          <TextInput
            idPrefix="penghargaan-baru"
            name="penyelenggara"
            label="Penyelenggara"
            placeholder="Nama lembaga atau instansi"
          />

          <div className="md:col-span-2">
            <TextArea
              idPrefix="penghargaan-baru"
              name="deskripsi"
              label="Deskripsi"
              placeholder="Jelaskan latar belakang dan pencapaian penghargaan."
            />
          </div>

          <div className="md:col-span-2">
            <FileInput
              id="penghargaan-baru-foto"
              name="foto"
              label="Foto atau Dokumentasi"
              required={
                false
              }
            />
          </div>

          <Checkbox
            id="penghargaan-baru-aktif"
            name="aktif"
            label="Publikasikan Penghargaan"
            description="Penghargaan ditampilkan pada halaman publik."
            checked
          />

          <div className="flex items-end justify-end">
            <SubmitButton
              text="Tambah Penghargaan"
            />
          </div>
        </div>
      </form>

      {/* =====================================================
          DAFTAR PENGHARGAAN
      ===================================================== */}

      <DataSection
        id="daftar-penghargaan"
        label="Prestasi Desa"
        title="Penghargaan Desa Keji"
        description={`${daftarPenghargaan.length} penghargaan tersimpan.`}
        icon={
          BadgeCheck
        }
      >
        {daftarPenghargaan.length ===
        0 ? (
          <EmptyState
            icon={
              BadgeCheck
            }
            text="Belum ada Penghargaan Desa Keji."
          />
        ) : (
          <div className="grid gap-5 p-5 sm:p-7 xl:grid-cols-2">
            {daftarPenghargaan.map(
              (
                item
              ) => (
                <PenghargaanAdminCard
                  key={
                    item.id
                  }
                  item={
                    item
                  }
                />
              )
            )}
          </div>
        )}
      </DataSection>
    </div>
  );
}

/* =========================================================
   KEPALA DESA CARD
========================================================= */

function KepalaDesaAdminCard({
  item,
}: {
  item:
    KepalaDesaAdmin;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
      <PreviewImage
        src={
          item.foto_url
        }
        alt={
          item.nama
        }
        aktif={
          item.aktif
        }
      />

      <div className="p-5">
        <p className="text-xs font-extrabold text-emerald-700">
          {
            item.periode_mulai
          }{' '}
          –{' '}
          {
            item.periode_selesai ??
            'Sekarang'
          }
        </p>

        <h3 className="mt-2 text-xl font-black text-slate-900">
          {
            item.nama
          }
        </h3>

        <p className="mt-3 line-clamp-4 whitespace-pre-line text-sm font-medium leading-7 text-slate-500">
          {
            item.biografi
          }
        </p>
      </div>

      <CardActions
        id={
          item.id
        }
        aktif={
          item.aktif
        }
        toggleAction={
          toggleMantanKadesAction
        }
        deleteAction={
          hapusMantanKadesAction
        }
      />

      <details className="border-t border-slate-200 bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-center gap-2 p-4 text-sm font-extrabold text-slate-700">
          <Pencil
            size={16}
          />

          Edit Biografi
        </summary>

        <form
          action={
            ubahMantanKadesAction
          }
          className="grid gap-5 border-t border-slate-200 p-5 md:grid-cols-2"
        >
          <input
            type="hidden"
            name="id"
            value={
              item.id
            }
          />

          <div className="md:col-span-2">
            <TextInput
              idPrefix={`edit-kepala-${item.id}`}
              name="nama"
              label="Nama Lengkap"
              value={
                item.nama
              }
            />
          </div>

          <NumberInput
            idPrefix={`edit-kepala-${item.id}`}
            name="periode_mulai"
            label="Awal Masa Jabatan"
            value={String(
              item.periode_mulai
            )}
            min={
              1900
            }
            max={
              2200
            }
          />

          <NumberInput
            idPrefix={`edit-kepala-${item.id}`}
            name="periode_selesai"
            label="Akhir Masa Jabatan"
            value={
              item.periode_selesai
                ? String(
                    item.periode_selesai
                  )
                : ''
            }
            min={
              1900
            }
            max={
              2200
            }
            required={
              false
            }
          />

          <NumberInput
            idPrefix={`edit-kepala-${item.id}`}
            name="urutan"
            label="Nomor Urutan"
            value={String(
              item.urutan
            )}
            min={
              0
            }
          />

          <Checkbox
            id={`edit-kepala-${item.id}-aktif`}
            name="aktif"
            label="Publikasikan Biografi"
            description="Tampilkan pada halaman publik."
            checked={
              item.aktif
            }
          />

          <div className="md:col-span-2">
            <TextArea
              idPrefix={`edit-kepala-${item.id}`}
              name="biografi"
              label="Biografi"
              value={
                item.biografi
              }
            />
          </div>

          <div className="md:col-span-2">
            <FileInput
              id={`edit-kepala-${item.id}-foto`}
              name="foto"
              label="Ganti Foto"
              required={
                false
              }
            />
          </div>

          {item.foto_url && (
            <div className="md:col-span-2">
              <Checkbox
                id={`edit-kepala-${item.id}-hapus-foto`}
                name="hapus_foto"
                label="Hapus Foto Lama"
                description="Centang untuk menghapus foto tanpa menggantinya."
                checked={
                  false
                }
                danger
              />
            </div>
          )}

          <div className="flex justify-end md:col-span-2">
            <SubmitButton
              text="Simpan Perubahan"
              dark
            />
          </div>
        </form>
      </details>
    </article>
  );
}

/* =========================================================
   STRUKTUR CARD
========================================================= */

function StrukturAdminCard({
  item,
}: {
  item:
    StrukturAdmin;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
      <PreviewImage
        src={
          item.gambar_url
        }
        alt={
          item.judul
        }
        aktif={
          item.aktif
        }
        contain
      />

      <div className="p-5">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700">
          Struktur Organisasi
        </span>

        <h3 className="mt-4 text-xl font-black text-slate-900">
          {
            item.judul
          }
        </h3>

        <p className="mt-3 text-sm font-medium leading-7 text-slate-500">
          {item.deskripsi ||
            'Tidak ada deskripsi.'}
        </p>

        <p className="mt-3 text-xs font-extrabold text-emerald-700">
          Urutan{' '}
          {
            item.urutan
          }
        </p>
      </div>

      <CardActions
        id={
          item.id
        }
        aktif={
          item.aktif
        }
        toggleAction={
          toggleMediaTilikAction
        }
        deleteAction={
          hapusMediaTilikAction
        }
      />

      <details className="border-t border-slate-200 bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-center gap-2 p-4 text-sm font-extrabold text-slate-700">
          <Pencil
            size={16}
          />

          Edit Struktur
        </summary>

        <form
          action={
            ubahMediaTilikAction
          }
          className="grid gap-5 border-t border-slate-200 p-5 md:grid-cols-2"
        >
          <input
            type="hidden"
            name="id"
            value={
              item.id
            }
          />

          <div className="md:col-span-2">
            <TextInput
              idPrefix={`edit-struktur-${item.id}`}
              name="judul"
              label="Judul Struktur"
              value={
                item.judul
              }
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              idPrefix={`edit-struktur-${item.id}`}
              name="deskripsi"
              label="Deskripsi"
              value={
                item.deskripsi
              }
              required={
                false
              }
              rows={
                4
              }
            />
          </div>

          <NumberInput
            idPrefix={`edit-struktur-${item.id}`}
            name="urutan"
            label="Nomor Urutan"
            value={String(
              item.urutan
            )}
            min={
              0
            }
          />

          <Checkbox
            id={`edit-struktur-${item.id}-aktif`}
            name="aktif"
            label="Publikasikan Struktur"
            description="Tampilkan pada halaman publik."
            checked={
              item.aktif
            }
          />

          <div className="md:col-span-2">
            <FileInput
              id={`edit-struktur-${item.id}-gambar`}
              name="gambar"
              label="Ganti Gambar Struktur"
              required={
                false
              }
            />
          </div>

          {item.gambar_url && (
            <div className="md:col-span-2">
              <Checkbox
                id={`edit-struktur-${item.id}-hapus-gambar`}
                name="hapus_gambar"
                label="Hapus Gambar Lama"
                description="Centang untuk menghapus gambar tanpa menggantinya."
                checked={
                  false
                }
                danger
              />
            </div>
          )}

          <div className="flex justify-end md:col-span-2">
            <SubmitButton
              text="Simpan Perubahan"
              dark
            />
          </div>
        </form>
      </details>
    </article>
  );
}

/* =========================================================
   PENGHARGAAN CARD
========================================================= */

function PenghargaanAdminCard({
  item,
}: {
  item:
    PenghargaanAdmin;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
      <PreviewImage
        src={
          item.foto_url
        }
        alt={
          item.nama_penghargaan
        }
        aktif={
          item.aktif
        }
      />

      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-emerald-700">
            {
              item.tahun
            }
          </span>

          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-emerald-700">
            Tingkat{' '}
            {
              item.tingkat
            }
          </span>
        </div>

        <h3 className="mt-4 text-xl font-black text-slate-900">
          {
            item.nama_penghargaan
          }
        </h3>

        <p className="mt-2 text-xs font-extrabold text-emerald-700">
          {
            item.penyelenggara
          }
        </p>

        <p className="mt-3 line-clamp-4 text-sm font-medium leading-7 text-slate-500">
          {
            item.deskripsi
          }
        </p>
      </div>

      <CardActions
        id={
          item.id
        }
        aktif={
          item.aktif
        }
        toggleAction={
          togglePenghargaanAction
        }
        deleteAction={
          hapusPenghargaanAction
        }
      />

      <details className="border-t border-slate-200 bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-center gap-2 p-4 text-sm font-extrabold text-slate-700">
          <Pencil
            size={16}
          />

          Edit Penghargaan
        </summary>

        <form
          action={
            ubahPenghargaanAction
          }
          className="grid gap-5 border-t border-slate-200 p-5 md:grid-cols-2"
        >
          <input
            type="hidden"
            name="id"
            value={
              item.id
            }
          />

          <div className="md:col-span-2">
            <TextInput
              idPrefix={`edit-award-${item.id}`}
              name="nama_penghargaan"
              label="Nama Penghargaan"
              value={
                item.nama_penghargaan
              }
            />
          </div>

          <NumberInput
            idPrefix={`edit-award-${item.id}`}
            name="tahun"
            label="Tahun"
            value={String(
              item.tahun
            )}
            min={
              1900
            }
            max={
              2200
            }
          />

          <NumberInput
            idPrefix={`edit-award-${item.id}`}
            name="urutan"
            label="Nomor Urutan"
            value={String(
              item.urutan
            )}
            min={
              0
            }
          />

          <TextInput
            idPrefix={`edit-award-${item.id}`}
            name="tingkat"
            label="Tingkat"
            value={
              item.tingkat
            }
          />

          <TextInput
            idPrefix={`edit-award-${item.id}`}
            name="penyelenggara"
            label="Penyelenggara"
            value={
              item.penyelenggara
            }
          />

          <div className="md:col-span-2">
            <TextArea
              idPrefix={`edit-award-${item.id}`}
              name="deskripsi"
              label="Deskripsi"
              value={
                item.deskripsi
              }
            />
          </div>

          <div className="md:col-span-2">
            <FileInput
              id={`edit-award-${item.id}-foto`}
              name="foto"
              label="Ganti Dokumentasi"
              required={
                false
              }
            />
          </div>

          {item.foto_url && (
            <div className="md:col-span-2">
              <Checkbox
                id={`edit-award-${item.id}-hapus-foto`}
                name="hapus_foto"
                label="Hapus Foto Lama"
                description="Centang untuk menghapus foto tanpa menggantinya."
                checked={
                  false
                }
                danger
              />
            </div>
          )}

          <Checkbox
            id={`edit-award-${item.id}-aktif`}
            name="aktif"
            label="Publikasikan Penghargaan"
            description="Tampilkan pada halaman publik."
            checked={
              item.aktif
            }
          />

          <div className="flex items-end justify-end">
            <SubmitButton
              text="Simpan Perubahan"
              dark
            />
          </div>
        </form>
      </details>
    </article>
  );
}

/* =========================================================
   DATA SECTION
========================================================= */

function DataSection({
  id,
  label,
  title,
  description,
  icon,
  children,
}: {
  id:
    string;

  label:
    string;

  title:
    string;

  description:
    string;

  icon:
    LucideIcon;

  children:
    ReactNode;
}) {
  return (
    <section
      id={
        id
      }
      className="scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      <SectionHeader
        label={
          label
        }
        title={
          title
        }
        description={
          description
        }
        icon={
          icon
        }
        dark
      />

      {
        children
      }
    </section>
  );
}

/* =========================================================
   CARD ACTIONS
========================================================= */

function CardActions({
  id,
  aktif,
  toggleAction,
  deleteAction,
}: {
  id:
    string;

  aktif:
    boolean;

  toggleAction:
    (
      formData:
        FormData
    ) => Promise<void>;

  deleteAction:
    (
      formData:
        FormData
    ) => Promise<void>;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-4">
      <form
        action={
          toggleAction
        }
      >
        <input
          type="hidden"
          name="id"
          value={
            id
          }
        />

        <input
          type="hidden"
          name="aktif"
          value={String(
            !aktif
          )}
        />

        <button
          type="submit"
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-100 px-3 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-200"
        >
          <Power
            size={15}
          />

          {aktif
            ? 'Sembunyikan'
            : 'Publikasikan'}
        </button>
      </form>

      <form
        action={
          deleteAction
        }
      >
        <input
          type="hidden"
          name="id"
          value={
            id
          }
        />

        <button
          type="submit"
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-red-100 px-3 text-xs font-extrabold text-red-700 transition hover:bg-red-200"
        >
          <Trash2
            size={15}
          />

          Hapus
        </button>
      </form>
    </div>
  );
}

/* =========================================================
   PREVIEW
========================================================= */

function PreviewImage({
  src,
  alt,
  aktif,
  contain =
    false,
}: {
  src:
    string | null;

  alt:
    string;

  aktif:
    boolean;

  contain?:
    boolean;
}) {
  return (
    <div className="relative aspect-[16/9] overflow-hidden bg-emerald-950">
      {src ? (
        <img
          src={
            src
          }
          alt={
            alt
          }
          loading="lazy"
          className={
            contain
              ? 'h-full w-full bg-white object-contain p-3'
              : 'h-full w-full object-cover'
          }
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center text-emerald-200">
          <ImageIcon
            size={40}
          />

          <p className="mt-3 text-xs font-extrabold uppercase tracking-wider">
            Belum ada gambar
          </p>
        </div>
      )}

      <span
        className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[10px] font-extrabold text-white ${
          aktif
            ? 'bg-emerald-700'
            : 'bg-slate-800'
        }`}
      >
        {aktif
          ? 'Aktif'
          : 'Nonaktif'}
      </span>
    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  label,
  title,
  description,
  icon: Icon,
  dark =
    false,
}: {
  label:
    string;

  title:
    string;

  description:
    string;

  icon:
    LucideIcon;

  dark?:
    boolean;
}) {
  return (
    <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white px-6 py-5 sm:px-7">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white ${
            dark
              ? 'bg-emerald-900'
              : 'bg-emerald-700'
          }`}
        >
          <Icon
            size={23}
          />
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
            {
              label
            }
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-900">
            {
              title
            }
          </h2>

          <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
            {
              description
            }
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STAT
========================================================= */

function StatCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label:
    string;

  value:
    number;

  description:
    string;

  icon:
    LucideIcon;
}) {
  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            {
              label
            }
          </p>

          <p className="mt-3 text-4xl font-black text-slate-900">
            {
              value
            }
          </p>

          <p className="mt-2 text-xs font-semibold text-slate-500">
            {
              description
            }
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Icon
            size={22}
          />
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   MESSAGE
========================================================= */

function Message({
  type,
  text,
}: {
  type:
    | 'success'
    | 'error';

  text:
    string;
}) {
  const success =
    type ===
    'success';

  const Icon =
    success
      ? CheckCircle2
      : AlertCircle;

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 ${
        success
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-red-200 bg-red-50 text-red-700'
      }`}
    >
      <Icon
        size={20}
        className="mt-0.5 shrink-0"
      />

      <p className="text-sm font-semibold leading-6">
        {
          text
        }
      </p>
    </div>
  );
}

/* =========================================================
   TEXT INPUT
========================================================= */

function TextInput({
  idPrefix,
  name,
  label,
  value =
    '',
  placeholder,
}: {
  idPrefix:
    string;

  name:
    string;

  label:
    string;

  value?:
    string;

  placeholder?:
    string;
}) {
  const id =
    `${idPrefix}-${name}`;

  return (
    <div>
      <label
        htmlFor={
          id
        }
        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
      >
        {
          label
        }

        <span className="ml-1 text-red-500">
          *
        </span>
      </label>

      <input
        id={
          id
        }
        name={
          name
        }
        type="text"
        required
        defaultValue={
          value
        }
        placeholder={
          placeholder
        }
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}

/* =========================================================
   NUMBER INPUT
========================================================= */

function NumberInput({
  idPrefix,
  name,
  label,
  value,
  min,
  max,
  required =
    true,
}: {
  idPrefix:
    string;

  name:
    string;

  label:
    string;

  value:
    string;

  min:
    number;

  max?:
    number;

  required?:
    boolean;
}) {
  const id =
    `${idPrefix}-${name}`;

  return (
    <div>
      <label
        htmlFor={
          id
        }
        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
      >
        {
          label
        }

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        id={
          id
        }
        name={
          name
        }
        type="number"
        required={
          required
        }
        min={
          min
        }
        max={
          max
        }
        step="1"
        defaultValue={
          value
        }
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function TextArea({
  idPrefix,
  name,
  label,
  value =
    '',
  placeholder,
  rows =
    6,
  required =
    true,
}: {
  idPrefix:
    string;

  name:
    string;

  label:
    string;

  value?:
    string;

  placeholder?:
    string;

  rows?:
    number;

  required?:
    boolean;
}) {
  const id =
    `${idPrefix}-${name}`;

  return (
    <div>
      <label
        htmlFor={
          id
        }
        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
      >
        {
          label
        }

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <textarea
        id={
          id
        }
        name={
          name
        }
        rows={
          rows
        }
        required={
          required
        }
        defaultValue={
          value
        }
        placeholder={
          placeholder
        }
        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-7 text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}

/* =========================================================
   FILE INPUT
========================================================= */

function FileInput({
  id,
  name,
  label,
  required,
}: {
  id:
    string;

  name:
    string;

  label:
    string;

  required:
    boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
        {
          label
        }

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <label
        htmlFor={
          id
        }
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-7 text-center transition hover:border-emerald-400 hover:bg-emerald-50"
      >
        <Upload
          size={24}
          className="text-emerald-700"
        />

        <p className="mt-3 text-sm font-extrabold text-slate-700">
          Pilih gambar dari
          perangkat
        </p>

        <p className="mt-1 text-xs font-medium text-slate-500">
          JPG, PNG, atau WebP.
          Maksimal 5 MB.
        </p>

        <input
          id={
            id
          }
          name={
            name
          }
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required={
            required
          }
          className="mt-4 block w-full max-w-md text-xs font-semibold text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-700 file:px-4 file:py-2.5 file:text-xs file:font-extrabold file:text-white"
        />
      </label>
    </div>
  );
}

/* =========================================================
   CHECKBOX
========================================================= */

function Checkbox({
  id,
  name,
  label,
  description,
  checked,
  danger =
    false,
}: {
  id:
    string;

  name:
    string;

  label:
    string;

  description:
    string;

  checked:
    boolean;

  danger?:
    boolean;
}) {
  return (
    <label
      htmlFor={
        id
      }
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 ${
        danger
          ? 'border-red-200 bg-red-50'
          : 'border-emerald-100 bg-emerald-50/60'
      }`}
    >
      <input
        id={
          id
        }
        type="checkbox"
        name={
          name
        }
        value="true"
        defaultChecked={
          checked
        }
        className={`mt-1 h-4 w-4 shrink-0 ${
          danger
            ? 'accent-red-600'
            : 'accent-emerald-700'
        }`}
      />

      <span>
        <span
          className={`block text-sm font-extrabold ${
            danger
              ? 'text-red-800'
              : 'text-slate-700'
          }`}
        >
          {
            label
          }
        </span>

        <span className="mt-1 block text-xs font-medium leading-5 text-slate-500">
          {
            description
          }
        </span>
      </span>
    </label>
  );
}

/* =========================================================
   SUBMIT
========================================================= */

function SubmitButton({
  text,
  dark =
    false,
}: {
  text:
    string;

  dark?:
    boolean;
}) {
  return (
    <button
      type="submit"
      className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-extrabold text-white transition sm:w-auto ${
        dark
          ? 'bg-emerald-900 hover:bg-emerald-950'
          : 'bg-emerald-700 hover:bg-emerald-800'
      }`}
    >
      <Save
        size={17}
      />

      {
        text
      }
    </button>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon: Icon,
  text,
}: {
  icon:
    LucideIcon;

  text:
    string;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <Icon
        size={48}
        className="mx-auto text-slate-300"
      />

      <p className="mt-4 text-sm font-bold text-slate-500">
        {
          text
        }
      </p>
    </div>
  );
}