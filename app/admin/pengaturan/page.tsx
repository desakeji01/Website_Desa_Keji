// app/admin/pengaturan/page.tsx

import Link from 'next/link';

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Database,
  ExternalLink,
  History,
  Save,
  Settings2,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react';

import EbookSejarahAdminSection from '@/components/admin/EbookSejarahAdminSection';
import ProfilDesaForm from '@/components/admin/ProfilDesaForm';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  ProfilDesa,
} from '@/types/profil-desa';

import {
  simpanSejarahDesaAction,
  simpanVisiMisiAction,
} from './actions';

/* =========================================================
   CONFIG
========================================================= */

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

const PROFIL_KEY =
  'utama';

/* =========================================================
   TYPES
========================================================= */

interface PageProps {
  searchParams:
    Promise<{
      success?: string;
      error?: string;
    }>;
}

interface SejarahSettings {
  judul_halaman: string;

  tanggal_publikasi: string;

  penulis: string;

  kategori: string;

  gambar_url: string;

  pengantar_utama: string;

  pengantar_kedua: string;

  updated_at:
    string | null;
}

interface MisiItem {
  id: number;

  bidang: string;

  tujuan: string;

  poin: string[];
}

interface VisiMisiSettings {
  judul_halaman: string;

  tanggal_publikasi: string;

  penulis: string;

  kategori: string;

  visi: string;

  misi: MisiItem[];

  updated_at:
    string | null;
}

/* =========================================================
   FALLBACK PROFIL
========================================================= */

const fallbackData:
  ProfilDesa = {
  id: '',

  profil_key:
    PROFIL_KEY,

  jumlah_laki_laki: 0,

  jumlah_perempuan: 0,

  jumlah_dusun: 0,

  jumlah_rw: 0,

  jumlah_rt: 0,

  tahun_data:
    new Date()
      .getFullYear(),

  updated_at:
    new Date()
      .toISOString(),
};

/* =========================================================
   FALLBACK SEJARAH
========================================================= */

const fallbackSejarah:
  SejarahSettings = {
  judul_halaman:
    'Sejarah dan Potensi Desa Keji',

  tanggal_publikasi:
    '2026-07-05',

  penulis:
    'Admin Desa',

  kategori:
    'Informasi Publik',

  gambar_url:
    '/background.png',

  pengantar_utama:
    'Desa Keji merupakan salah satu desa yang berada di Kecamatan Ungaran Barat, Kabupaten Semarang. Letaknya di kawasan lereng Gunung Ungaran memberikan Desa Keji potensi alam, budaya, kesenian, kuliner, usaha masyarakat, dan wisata yang beragam.',

  pengantar_kedua:
    'Berbagai potensi tersebut masih dipertahankan dan dikembangkan oleh masyarakat. Selain menjadi bagian dari kehidupan sehari-hari warga, potensi tersebut juga menjadi identitas Desa Keji dan modal pengembangan Desa Wisata Keji.',

  updated_at:
    null,
};

/* =========================================================
   FALLBACK MISI
========================================================= */

const fallbackMisi:
  MisiItem[] = [
    {
      id: 1,

      bidang:
        'PEMBERDAYAAN',

      tujuan:
        'Memberdayakan semua potensi yang ada di masyarakat yang meliputi:',

      poin: [
        'Pemberdayaan sumber daya manusia (SDM)',
        'Pemberdayaan sumber daya alam (SDA)',
        'Pemberdayaan ekonomi masyarakat',
        'Pemberdayaan pemuda, agama, seni budaya, dan olahraga',
      ],
    },

    {
      id: 2,

      bidang:
        'PEMBINAAN',

      tujuan:
        'Menciptakan kondisi masyarakat Desa Keji yang aman, tertib, guyup, dan rukun dalam kehidupan bermasyarakat, yang meliputi:',

      poin: [
        'Pembinaan pendidikan dan keagamaan',
        'Pembinaan kelembagaan masyarakat desa',
        'Pembinaan kewilayahan (tilik dusun)',
      ],
    },

    {
      id: 3,

      bidang:
        'PEMERINTAHAN',

      tujuan:
        'Optimalisasi penyelenggaraan Pemerintah Desa Keji, yang meliputi:',

      poin: [
        'Penyelenggaraan pemerintahan yang transparan dan akuntabel',
        'Pelayanan kepada masyarakat yang prima, yaitu cepat, tepat, dan benar',
        'Pelaksanaan pembangunan yang berkesinambungan dan mengedepankan partisipasi serta gotong royong masyarakat',
      ],
    },

    {
      id: 4,

      bidang:
        'PEMBANGUNAN',

      tujuan:
        'Bekerja sama dengan Pemerintah Daerah Kabupaten, Provinsi, dan Pusat dalam mewujudkan pembangunan infrastruktur di Desa Keji yang meliputi:',

      poin: [
        'Bankeu Kabupaten (Aspirasi APBD Kabupaten Semarang)',
        'Bankeu Provinsi (Aspirasi APBD Provinsi Jawa Tengah)',
        'Bankeu Pusat (Aspirasi APBN)',
      ],
    },
  ];

/* =========================================================
   FALLBACK VISI MISI
========================================================= */

const fallbackVisiMisi:
  VisiMisiSettings = {
  judul_halaman:
    'Visi dan Misi Pemerintah Desa',

  tanggal_publikasi:
    '2026-07-10',

  penulis:
    'Admin Desa',

  kategori:
    'Informasi Publik',

  visi:
    'Bersama membangun desa melalui tata kelola pemerintahan yang bersih, transparan, akuntabel, dan partisipatif menuju desa yang maju, mandiri, dan berbudaya berlandaskan perilaku terpuji.',

  misi:
    fallbackMisi,

  updated_at:
    null,
};

/* =========================================================
   HELPERS
========================================================= */

function safeString(
  value: unknown
) {
  return String(
    value ?? ''
  ).trim();
}

function formatTanggal(
  value:
    string |
    null |
    undefined
) {
  if (!value) {
    return 'Belum pernah diperbarui';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return 'Belum pernah diperbarui';
  }

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: '2-digit',

      month: 'long',

      year: 'numeric',

      hour: '2-digit',

      minute: '2-digit',

      hour12: false,

      timeZone:
        'Asia/Jakarta',
    }
  )
    .format(date)
    .replace(
      '.',
      ':'
    );
}

function formatAngka(
  value: number
) {
  return new Intl.NumberFormat(
    'id-ID'
  ).format(value);
}

/* =========================================================
   NORMALIZE SEJARAH
========================================================= */

function normalizeSejarah(
  value: unknown
): SejarahSettings {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(value)
  ) {
    return fallbackSejarah;
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  return {
    judul_halaman:
      safeString(
        row.judul_halaman
      ) ||
      fallbackSejarah
        .judul_halaman,

    tanggal_publikasi:
      safeString(
        row.tanggal_publikasi
      ) ||
      fallbackSejarah
        .tanggal_publikasi,

    penulis:
      safeString(
        row.penulis
      ) ||
      fallbackSejarah
        .penulis,

    kategori:
      safeString(
        row.kategori
      ) ||
      fallbackSejarah
        .kategori,

    gambar_url:
      safeString(
        row.gambar_url
      ) ||
      fallbackSejarah
        .gambar_url,

    pengantar_utama:
      safeString(
        row.pengantar_utama
      ) ||
      fallbackSejarah
        .pengantar_utama,

    pengantar_kedua:
      safeString(
        row.pengantar_kedua
      ) ||
      fallbackSejarah
        .pengantar_kedua,

    updated_at:
      safeString(
        row.updated_at
      ) ||
      null,
  };
}

/* =========================================================
   NORMALIZE MISI
========================================================= */

function normalizeMisi(
  value: unknown
): MisiItem[] {
  if (
    !Array.isArray(value)
  ) {
    return fallbackMisi;
  }

  const result =
    value
      .map(
        (
          item,
          index
        ) => {
          if (
            !item ||
            typeof item !==
              'object' ||
            Array.isArray(item)
          ) {
            return null;
          }

          const row =
            item as Record<
              string,
              unknown
            >;

          const bidang =
            safeString(
              row.bidang
            );

          const tujuan =
            safeString(
              row.tujuan
            );

          const poin =
            Array.isArray(
              row.poin
            )
              ? row.poin
                  .map(
                    (
                      poinItem
                    ) =>
                      safeString(
                        poinItem
                      )
                  )
                  .filter(Boolean)
              : [];

          if (
            !bidang ||
            !tujuan ||
            poin.length ===
              0
          ) {
            return null;
          }

          return {
            id:
              index + 1,

            bidang,

            tujuan,

            poin,
          };
        }
      )
      .filter(
        (
          item
        ): item is MisiItem =>
          item !== null
      );

  return result.length ===
    4
    ? result
    : fallbackMisi;
}

/* =========================================================
   NORMALIZE VISI MISI
========================================================= */

function normalizeVisiMisi(
  value: unknown
): VisiMisiSettings {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(value)
  ) {
    return fallbackVisiMisi;
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  return {
    judul_halaman:
      safeString(
        row.judul_halaman
      ) ||
      fallbackVisiMisi
        .judul_halaman,

    tanggal_publikasi:
      safeString(
        row.tanggal_publikasi
      ) ||
      fallbackVisiMisi
        .tanggal_publikasi,

    penulis:
      safeString(
        row.penulis
      ) ||
      fallbackVisiMisi
        .penulis,

    kategori:
      safeString(
        row.kategori
      ) ||
      fallbackVisiMisi
        .kategori,

    visi:
      safeString(
        row.visi
      ) ||
      fallbackVisiMisi.visi,

    misi:
      normalizeMisi(
        row.misi
      ),

    updated_at:
      safeString(
        row.updated_at
      ) ||
      null,
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function PengaturanPage({
  searchParams,
}: PageProps) {
  const [
    params,
    profilResult,
    sejarahResult,
    visiMisiResult,
  ] =
    await Promise.all([
      searchParams,

      /* ===================================================
         PROFIL DESA
      =================================================== */

      supabaseAdmin
        .from(
          'profil_desa'
        )
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
        .maybeSingle(),

      /* ===================================================
         SEJARAH
      =================================================== */

      supabaseAdmin
        .from(
          'profil_sejarah_settings'
        )
        .select(`
          judul_halaman,
          tanggal_publikasi,
          penulis,
          kategori,
          gambar_url,
          pengantar_utama,
          pengantar_kedua,
          updated_at
        `)
        .eq(
          'setting_key',
          PROFIL_KEY
        )
        .maybeSingle(),

      /* ===================================================
         VISI MISI
      =================================================== */

      supabaseAdmin
        .from(
          'profil_visi_misi_settings'
        )
        .select(`
          judul_halaman,
          tanggal_publikasi,
          penulis,
          kategori,
          visi,
          misi,
          updated_at
        `)
        .eq(
          'setting_key',
          PROFIL_KEY
        )
        .maybeSingle(),
    ]);

  /* =======================================================
     ERROR LOG
  ======================================================= */

  if (
    profilResult.error
  ) {
    console.error(
      'Gagal mengambil data profil desa:',
      profilResult.error
    );
  }

  if (
    sejarahResult.error
  ) {
    console.error(
      'Gagal mengambil pengaturan sejarah:',
      sejarahResult.error
    );
  }

  if (
    visiMisiResult.error
  ) {
    console.error(
      'Gagal mengambil pengaturan Visi dan Misi:',
      visiMisiResult.error
    );
  }

  /* =======================================================
     PROFIL DESA
  ======================================================= */

  const data =
    profilResult.data;

  const profilDesa:
    ProfilDesa =
    data
      ? {
          id:
            String(
              data.id ??
                ''
            ),

          profil_key:
            String(
              data.profil_key ??
                PROFIL_KEY
            ),

          jumlah_laki_laki:
            Number(
              data.jumlah_laki_laki ??
                0
            ),

          jumlah_perempuan:
            Number(
              data.jumlah_perempuan ??
                0
            ),

          jumlah_dusun:
            Number(
              data.jumlah_dusun ??
                0
            ),

          jumlah_rw:
            Number(
              data.jumlah_rw ??
                0
            ),

          jumlah_rt:
            Number(
              data.jumlah_rt ??
                0
            ),

          tahun_data:
            Number(
              data.tahun_data ??
                new Date()
                  .getFullYear()
            ),

          updated_at:
            String(
              data.updated_at ??
                new Date()
                  .toISOString()
            ),
        }
      : fallbackData;

  /* =======================================================
     SEJARAH
  ======================================================= */

  const sejarah =
    normalizeSejarah(
      sejarahResult.data
    );

  /* =======================================================
     VISI MISI
  ======================================================= */

  const visiMisi =
    normalizeVisiMisi(
      visiMisiResult.data
    );

  const totalPenduduk =
    profilDesa
      .jumlah_laki_laki +
    profilDesa
      .jumlah_perempuan;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="mx-auto max-w-[1500px] space-y-8">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 px-6 py-8 text-white shadow-xl sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,.55) 1px, transparent 1px)',

            backgroundSize:
              '26px 26px',
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[52px] border-white/[0.04]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 right-48 h-48 w-48 rounded-full bg-white/[0.04]"
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur-sm">
              <Settings2
                size={23}
                strokeWidth={2.2}
              />
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-emerald-200">
                Data Utama Desa
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                Pengaturan Profil Desa
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-emerald-50/80">
                Kelola data
                kependudukan, sejarah
                desa, Ebook Sejarah,
                serta Visi dan Misi
                Pemerintah Desa Keji.
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
            <CalendarDays
              size={18}
              className="shrink-0 text-emerald-200"
            />

            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-emerald-200/80">
                Profil terakhir
                diperbarui
              </p>

              <p className="mt-1 text-xs font-bold text-white">
                {formatTanggal(
                  profilDesa.updated_at
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MESSAGE
      ===================================================== */}

      {params.success && (
        <Message
          success
          text={
            params.success
          }
        />
      )}

      {params.error && (
        <Message
          text={
            params.error
          }
        />
      )}

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Penduduk"
          value={
            formatAngka(
              totalPenduduk
            )
          }
          description="Jiwa"
          icon={
            Users
          }
        />

        <SummaryCard
          label="Jumlah Dusun"
          value={
            formatAngka(
              profilDesa.jumlah_dusun
            )
          }
          description="Wilayah dusun"
          icon={
            Database
          }
        />

        <SummaryCard
          label="Sejarah Desa"
          value="Aktif"
          description="Konten profil"
          icon={
            History
          }
        />

        <SummaryCard
          label="Visi & Misi"
          value={String(
            visiMisi.misi.length
          )}
          description="Bidang misi"
          icon={
            Target
          }
        />
      </section>

      {/* =====================================================
          PROFIL DESA
      ===================================================== */}

      <section
        id="pengaturan-profil"
        className="scroll-mt-24 space-y-6"
      >
        <SectionTitle
          icon={
            Database
          }
          label="Data Profil"
          title="Kependudukan dan Wilayah"
          description="Kelola jumlah penduduk dan wilayah administrasi Desa Keji."
        />

        {profilResult.error && (
          <Message
            text="Data profil desa tidak berhasil dimuat dari database."
          />
        )}

        <section className="flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 sm:flex-row sm:items-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
            <Database
              size={20}
            />
          </div>

          <div>
            <h2 className="text-sm font-black text-emerald-900">
              Data
              tersinkronisasi
            </h2>

            <p className="mt-1 text-xs font-medium leading-relaxed text-emerald-800/70">
              Data pada form
              digunakan pada statistik
              halaman utama dan halaman
              Profil Desa.
            </p>
          </div>
        </section>

        <ProfilDesaForm
          initialData={
            profilDesa
          }
        />
      </section>

      {/* =====================================================
          SEJARAH DESA
      ===================================================== */}

      <form
        id="pengaturan-sejarah"
        action={
          simpanSejarahDesaAction
        }
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <FormHeader
          icon={
            History
          }
          label="Profil Desa"
          title="Sejarah Desa"
          description="Kelola informasi utama yang tampil pada halaman Sejarah dan Potensi Desa Keji."
          href="/profil/sejarah"
        />

        {sejarahResult.error && (
          <div className="border-b border-amber-100 bg-amber-50 px-6 py-4">
            <p className="text-xs font-bold leading-6 text-amber-800">
              Pengaturan sejarah
              gagal dimuat. Form
              sementara menggunakan
              data bawaan.
            </p>
          </div>
        )}

        <div className="grid gap-5 p-6 sm:p-7 md:grid-cols-2">
          <div className="md:col-span-2">
            <TextInput
              idPrefix="sejarah"
              name="judul_halaman"
              label="Judul Halaman"
              value={
                sejarah.judul_halaman
              }
            />
          </div>

          <TextInput
            idPrefix="sejarah"
            name="tanggal_publikasi"
            label="Tanggal Publikasi"
            type="date"
            value={
              sejarah.tanggal_publikasi
            }
          />

          <TextInput
            idPrefix="sejarah"
            name="penulis"
            label="Penulis"
            value={
              sejarah.penulis
            }
          />

          <TextInput
            idPrefix="sejarah"
            name="kategori"
            label="Kategori"
            value={
              sejarah.kategori
            }
          />

          <TextInput
            idPrefix="sejarah"
            name="gambar_url"
            label="Gambar Utama"
            value={
              sejarah.gambar_url
            }
            placeholder="/background.png"
          />

          <div className="md:col-span-2">
            <TextArea
              idPrefix="sejarah"
              name="pengantar_utama"
              label="Paragraf Pengantar Pertama"
              value={
                sejarah.pengantar_utama
              }
              rows={5}
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              idPrefix="sejarah"
              name="pengantar_kedua"
              label="Paragraf Pengantar Kedua"
              value={
                sejarah.pengantar_kedua
              }
              rows={5}
            />
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-5 md:col-span-2">
            <SaveButton
              text="Simpan Sejarah Desa"
            />
          </div>
        </div>
      </form>

      {/* =====================================================
          EBOOK SEJARAH
      ===================================================== */}

      <EbookSejarahAdminSection />

      {/* =====================================================
          VISI MISI
      ===================================================== */}

      <form
        id="pengaturan-visi-misi"
        action={
          simpanVisiMisiAction
        }
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <FormHeader
          icon={
            Target
          }
          label="Pemerintahan Desa"
          title="Visi dan Misi"
          description="Kelola visi serta empat bidang misi Pemerintah Desa Keji."
          href="/profil/visi-misi"
        />

        {visiMisiResult.error && (
          <div className="border-b border-amber-100 bg-amber-50 px-6 py-4">
            <p className="text-xs font-bold leading-6 text-amber-800">
              Data Visi dan Misi
              gagal dimuat. Form
              sementara menggunakan
              data bawaan.
            </p>
          </div>
        )}

        <div className="grid gap-5 p-6 sm:p-7 md:grid-cols-2">
          <div className="md:col-span-2">
            <TextInput
              idPrefix="visi-misi"
              name="judul_halaman"
              label="Judul Halaman"
              value={
                visiMisi.judul_halaman
              }
            />
          </div>

          <TextInput
            idPrefix="visi-misi"
            name="tanggal_publikasi"
            label="Tanggal Publikasi"
            type="date"
            value={
              visiMisi.tanggal_publikasi
            }
          />

          <TextInput
            idPrefix="visi-misi"
            name="penulis"
            label="Penulis"
            value={
              visiMisi.penulis
            }
          />

          <div className="md:col-span-2">
            <TextInput
              idPrefix="visi-misi"
              name="kategori"
              label="Kategori"
              value={
                visiMisi.kategori
              }
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              idPrefix="visi-misi"
              name="visi"
              label="Visi Pemerintah Desa"
              value={
                visiMisi.visi
              }
              rows={5}
            />
          </div>

          <div className="space-y-5 md:col-span-2">
            {visiMisi.misi.map(
              (
                item
              ) => (
                <MisiForm
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

          <div className="flex justify-end border-t border-slate-100 pt-5 md:col-span-2">
            <SaveButton
              text="Simpan Visi dan Misi"
            />
          </div>
        </div>
      </form>

      {/* =====================================================
          INFO
      ===================================================== */}

      <section className="flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 sm:flex-row sm:items-center">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
          <Database
            size={20}
          />
        </div>

        <div>
          <h2 className="text-sm font-black text-emerald-900">
            Data profil
            terintegrasi
          </h2>

          <p className="mt-1 text-xs font-medium leading-relaxed text-emerald-800/70">
            Profil Desa, Sejarah,
            Ebook Sejarah, serta Visi
            dan Misi dikelola melalui
            halaman Pengaturan ini.
          </p>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   MISI FORM
========================================================= */

function MisiForm({
  item,
}: {
  item: MisiItem;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-slate-50">
      <div className="flex items-center gap-3 border-b border-emerald-100 bg-emerald-50 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-sm font-black text-white">
          {
            item.id
          }
        </div>

        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-600">
            Misi{' '}
            {
              item.id
            }
          </p>

          <p className="font-black text-emerald-950">
            {
              item.bidang
            }
          </p>
        </div>
      </div>

      <div className="grid gap-5 p-5">
        <TextInput
          idPrefix={`misi-${item.id}`}
          name={`misi_${item.id}_bidang`}
          label="Bidang"
          value={
            item.bidang
          }
        />

        <TextArea
          idPrefix={`misi-${item.id}`}
          name={`misi_${item.id}_tujuan`}
          label="Tujuan"
          value={
            item.tujuan
          }
          rows={3}
        />

        <TextArea
          idPrefix={`misi-${item.id}`}
          name={`misi_${item.id}_poin`}
          label="Poin Misi"
          value={
            item.poin.join(
              '\n'
            )
          }
          rows={
            Math.max(
              4,
              item.poin.length +
                1
            )
          }
          hint="Tuliskan satu poin misi per baris."
        />
      </div>
    </section>
  );
}

/* =========================================================
   FORM HEADER
========================================================= */

function FormHeader({
  icon:
    Icon,
  label,
  title,
  description,
  href,
}: {
  icon: LucideIcon;

  label: string;

  title: string;

  description: string;

  href: string;
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-white p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
          <Icon
            size={22}
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

          <p className="mt-1 max-w-3xl text-sm font-medium leading-6 text-slate-500">
            {
              description
            }
          </p>
        </div>
      </div>

      <Link
        href={
          href
        }
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-50"
      >
        Lihat Publik

        <ExternalLink
          size={13}
        />
      </Link>
    </div>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  icon:
    Icon,
  label,
  title,
  description,
}: {
  icon: LucideIcon;

  label: string;

  title: string;

  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
        <Icon
          size={20}
        />
      </div>

      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
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
  );
}

/* =========================================================
   SUMMARY
========================================================= */

function SummaryCard({
  label,
  value,
  description,
  icon:
    Icon,
}: {
  label: string;

  value: string;

  description: string;

  icon: LucideIcon;
}) {
  return (
    <article className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-500">
            {
              label
            }
          </p>

          <p className="mt-2 text-2xl font-black text-slate-900">
            {
              value
            }
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-400">
            {
              description
            }
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon
            size={21}
          />
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   INPUT
========================================================= */

function TextInput({
  idPrefix,
  name,
  label,
  value,
  type =
    'text',
  placeholder,
}: {
  idPrefix: string;

  name: string;

  label: string;

  value: string;

  type?: string;

  placeholder?: string;
}) {
  const id =
    `${idPrefix}-${name}`;

  return (
    <label
      htmlFor={
        id
      }
      className="block"
    >
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
        {
          label
        }

        <span className="ml-1 text-red-500">
          *
        </span>
      </span>

      <input
        id={
          id
        }
        name={
          name
        }
        type={
          type
        }
        required
        defaultValue={
          value
        }
        placeholder={
          placeholder
        }
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function TextArea({
  idPrefix,
  name,
  label,
  value,
  rows,
  hint,
}: {
  idPrefix: string;

  name: string;

  label: string;

  value: string;

  rows: number;

  hint?: string;
}) {
  const id =
    `${idPrefix}-${name}`;

  return (
    <label
      htmlFor={
        id
      }
      className="block"
    >
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
        {
          label
        }

        <span className="ml-1 text-red-500">
          *
        </span>
      </span>

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
        required
        defaultValue={
          value
        }
        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium leading-7 text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />

      {hint && (
        <span className="mt-2 block text-[10px] font-medium text-slate-400">
          {
            hint
          }
        </span>
      )}
    </label>
  );
}

/* =========================================================
   SAVE
========================================================= */

function SaveButton({
  text,
}: {
  text: string;
}) {
  return (
    <button
      type="submit"
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800 sm:w-auto"
    >
      <Save
        size={16}
      />

      {
        text
      }
    </button>
  );
}

/* =========================================================
   MESSAGE
========================================================= */

function Message({
  success =
    false,
  text,
}: {
  success?: boolean;

  text: string;
}) {
  const Icon =
    success
      ? CheckCircle2
      : AlertCircle;

  return (
    <section
      className={`flex items-start gap-3 rounded-2xl border p-4 ${
        success
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-red-200 bg-red-50 text-red-700'
      }`}
    >
      <Icon
        size={19}
        className="mt-0.5 shrink-0"
      />

      <p className="text-sm font-semibold leading-6">
        {
          text
        }
      </p>
    </section>
  );
}