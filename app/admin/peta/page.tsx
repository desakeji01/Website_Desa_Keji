// app/admin/peta/page.tsx

import Link from 'next/link';

import {
  CheckCircle2,
  ExternalLink,
  FileText,
  MapPin,
  MapPinned,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';

import FormPetaDesa from '@/components/admin/FormPetaDesa';

import {
  PETA_DESA_DEFAULTS,
} from '@/lib/peta-defaults';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  PetaDesaData,
} from '@/types/peta';

import {
  hapusLokasiAdministrasiAction,
  simpanLokasiAdministrasiAction,
  tambahLokasiAdministrasiAction,
} from './actions';

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

const PETA_KEY =
  'utama';

const PETA_ADMINISTRASI =
  '/Administrasi%20Desa%20Keji.png';

const PETA_ADMINISTRASI_PDF =
  '/Administrasi%20Desa%20Keji.pdf';

/* =========================================================
   TYPES
========================================================= */

interface PageProps {
  searchParams:
    Promise<{
      status?: string;
    }>;
}

interface LokasiAdministrasiRow {
  id:
    string | number;

  kode:
    string;

  nama:
    string;

  kategori:
    string;

  maps_url:
    string | null;

  posisi_x:
    number | string;

  posisi_y:
    number | string;

  aktif:
    boolean;

  urutan:
    number;

  created_at:
    string;

  updated_at:
    string;
}

/* =========================================================
   PAGE
========================================================= */

export default async function AdminPetaDesaPage({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;

  const [
    petaResult,
    lokasiResult,
  ] =
    await Promise.all([
      /* ===================================================
         PETA DESA
      =================================================== */

      supabaseAdmin
        .from(
          'peta_desa'
        )
        .select(`
          peta_key,
          label_seksi,
          judul_halaman,
          deskripsi,
          tombol_label,
          maps_link_url,
          maps_embed_url,
          iframe_title,
          tinggi_peta,
          updated_at
        `)
        .eq(
          'peta_key',
          PETA_KEY
        )
        .maybeSingle(),

      /* ===================================================
         LOKASI ADMINISTRASI
      =================================================== */

      supabaseAdmin
        .from(
          'peta_administrasi_lokasi'
        )
        .select(`
          id,
          kode,
          nama,
          kategori,
          maps_url,
          posisi_x,
          posisi_y,
          aktif,
          urutan,
          created_at,
          updated_at
        `)
        .order(
          'urutan',
          {
            ascending:
              true,
          }
        )
        .order(
          'nama',
          {
            ascending:
              true,
          }
        ),
    ]);

  /* =======================================================
     ERRORS
  ======================================================= */

  if (
    petaResult.error
  ) {
    console.error(
      'Gagal mengambil konfigurasi peta desa:',
      {
        message:
          petaResult.error
            .message,

        code:
          petaResult.error
            .code,

        details:
          petaResult.error
            .details,

        hint:
          petaResult.error
            .hint,
      }
    );
  }

  if (
    lokasiResult.error
  ) {
    console.error(
      'Gagal mengambil titik peta administrasi:',
      {
        message:
          lokasiResult.error
            .message,

        code:
          lokasiResult.error
            .code,

        details:
          lokasiResult.error
            .details,

        hint:
          lokasiResult.error
            .hint,
      }
    );
  }

  /* =======================================================
     DATA
  ======================================================= */

  const initialData:
    PetaDesaData = {
    ...PETA_DESA_DEFAULTS,

    ...(
      petaResult.data ??
      {}
    ),
  };

  const daftarLokasi =
    (
      lokasiResult.data ??
      []
    ) as LokasiAdministrasiRow[];

  const lokasiAktif =
    daftarLokasi.filter(
      (
        item
      ) =>
        item.aktif
    ).length;

  const mapsTerisi =
    daftarLokasi.filter(
      (
        item
      ) =>
        Boolean(
          item.maps_url
        )
    ).length;

  const successMessage =
    params.status ===
    'lokasi-updated'
      ? 'Lokasi peta administrasi berhasil diperbarui.'
      : params.status ===
        'lokasi-created'
        ? 'Lokasi baru berhasil ditambahkan.'
        : params.status ===
          'lokasi-deleted'
          ? 'Lokasi berhasil dihapus.'
          : '';

  return (
    <div className="space-y-8">
      {/* ===================================================
          HEADER
      =================================================== */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 px-6 py-8 text-white shadow-xl">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.13) 1.5px, transparent 1.5px)',

            backgroundSize:
              '26px 26px',
          }}
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <MapPinned
                size={27}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                Data dan
                Pemerintahan
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                Peta Desa
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                Kelola peta
                interaktif, titik
                lokasi Peta
                Administrasi, dan
                tautan Google Maps
                Desa Keji.
              </p>
            </div>
          </div>

          <Link
            href="/peta"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white transition hover:bg-white/15"
          >
            Lihat Peta Publik

            <ExternalLink
              size={16}
            />
          </Link>
        </div>
      </section>

      {/* ===================================================
          MESSAGE
      =================================================== */}

      {successMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0"
          />

          <p className="text-sm font-semibold">
            {
              successMessage
            }
          </p>
        </div>
      )}

      {/* ===================================================
          MAIN MAP SETTINGS
      =================================================== */}

      {petaResult.error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
          Konfigurasi lama gagal
          dimuat. Formulir
          menggunakan data bawaan.
        </div>
      )}

      <FormPetaDesa
        initialData={
          initialData
        }
      />

      {/* ===================================================
          ADMINISTRATION MAP
      =================================================== */}

      <section
        id="lokasi-administrasi"
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_12px_35px_rgba(6,78,59,0.07)]"
      >
        {/* HEADER */}

        <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50/80 to-white p-6 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                <MapPin
                  size={23}
                />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                  Peta Administrasi
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900">
                  Titik Lokasi
                  Administrasi
                </h2>

                <p className="mt-1 max-w-3xl text-sm font-medium leading-6 text-slate-500">
                  Atur nama lokasi,
                  kategori, Google
                  Maps, posisi titik
                  pada gambar, dan
                  status publikasi.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={
                  PETA_ADMINISTRASI
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 text-xs font-extrabold text-emerald-700"
              >
                <ExternalLink
                  size={14}
                />

                Lihat PNG
              </a>

              <a
                href={
                  PETA_ADMINISTRASI_PDF
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 text-xs font-extrabold text-emerald-700"
              >
                <FileText
                  size={14}
                />

                Lihat PDF
              </a>
            </div>
          </div>

          {/* STATS */}

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <AdminStat
              label="Total Titik"
              value={
                daftarLokasi.length
              }
            />

            <AdminStat
              label="Titik Aktif"
              value={
                lokasiAktif
              }
            />

            <AdminStat
              label="Maps Terisi"
              value={
                mapsTerisi
              }
            />
          </div>
        </div>

        {/* =================================================
            PREVIEW
        ================================================= */}

        <div className="border-b border-emerald-100 p-5 sm:p-7">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.13em] text-slate-500">
            Preview Posisi Titik
          </p>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200">
            <img
              src={
                PETA_ADMINISTRASI
              }
              alt="Preview Peta Administrasi Desa Keji"
              className="block h-auto w-full"
            />

            {daftarLokasi.map(
              (
                lokasi
              ) => (
                <span
                  key={
                    String(
                      lokasi.id
                    )
                  }
                  title={
                    lokasi.nama
                  }
                  className={`absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-[7px] font-black text-white shadow-md sm:h-7 sm:w-7 ${
                    lokasi.aktif
                      ? 'bg-emerald-700'
                      : 'bg-slate-400'
                  }`}
                  style={{
                    left:
                      `${Number(
                        lokasi.posisi_x
                      )}%`,

                    top:
                      `${Number(
                        lokasi.posisi_y
                      )}%`,
                  }}
                >
                  <MapPin
                    size={11}
                  />
                </span>
              )
            )}
          </div>
        </div>

        {/* =================================================
            LOCATION FORMS
        ================================================= */}

        <div className="grid gap-5 p-5 sm:p-7 xl:grid-cols-2">
          {daftarLokasi.map(
            (
              lokasi
            ) => (
              <LokasiEditForm
                key={
                  String(
                    lokasi.id
                  )
                }
                lokasi={
                  lokasi
                }
              />
            )
          )}
        </div>
      </section>

      {/* ===================================================
          ADD LOCATION
      =================================================== */}

      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
        <div className="border-b border-emerald-100 bg-emerald-50/70 p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <Plus
                size={20}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                Titik Baru
              </p>

              <h2 className="mt-1 text-lg font-black text-slate-900">
                Tambah Lokasi
                Administrasi
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Gunakan jika ada
                lokasi tambahan yang
                ingin ditampilkan
                pada Peta
                Administrasi.
              </p>
            </div>
          </div>
        </div>

        <form
          action={
            tambahLokasiAdministrasiAction
          }
          className="grid gap-5 p-6 sm:p-7 md:grid-cols-2"
        >
          <AdminInput
            name="kode"
            label="Kode Lokasi"
            placeholder="contoh: balai-desa"
            required
          />

          <AdminInput
            name="nama"
            label="Nama Lokasi"
            placeholder="Nama lokasi"
            required
          />

          <AdminInput
            name="kategori"
            label="Kategori"
            placeholder="Contoh: Masjid"
            required
          />

          <AdminInput
            name="maps_url"
            label="Link Google Maps"
            placeholder="https://maps.app.goo.gl/..."
          />

          <AdminInput
            name="posisi_x"
            label="Posisi X (%)"
            type="number"
            placeholder="50"
            step="0.01"
            min="0"
            max="100"
            required
          />

          <AdminInput
            name="posisi_y"
            label="Posisi Y (%)"
            type="number"
            placeholder="50"
            step="0.01"
            min="0"
            max="100"
            required
          />

          <AdminInput
            name="urutan"
            label="Urutan"
            type="number"
            placeholder="1"
            min="0"
            required
          />

          <div className="flex items-end">
            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white transition hover:bg-emerald-800"
            >
              <Plus
                size={17}
              />

              Tambah Lokasi
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

/* =========================================================
   EDIT LOCATION
========================================================= */

function LokasiEditForm({
  lokasi,
}: {
  lokasi:
    LokasiAdministrasiRow;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
      {/* HEADER */}

      <div className="flex items-start gap-3 border-b border-slate-200 bg-white p-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            lokasi.aktif
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-100 text-slate-400'
          }`}
        >
          <MapPin
            size={18}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-emerald-700">
            {
              lokasi.kategori
            }
          </p>

          <h3 className="mt-1 truncate text-sm font-black text-slate-900">
            {
              lokasi.nama
            }
          </h3>

          <p className="mt-1 text-[10px] font-semibold text-slate-400">
            Kode:{' '}
            {
              lokasi.kode
            }
          </p>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase ${
            lokasi.aktif
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          {lokasi.aktif
            ? 'Aktif'
            : 'Nonaktif'}
        </span>
      </div>

      {/* EDIT */}

      <form
        action={
          simpanLokasiAdministrasiAction
        }
        className="grid gap-4 p-4 sm:grid-cols-2"
      >
        <input
          type="hidden"
          name="id"
          value={
            String(
              lokasi.id
            )
          }
        />

        <AdminInput
          name="nama"
          label="Nama Lokasi"
          defaultValue={
            lokasi.nama
          }
          required
        />

        <AdminInput
          name="kategori"
          label="Kategori"
          defaultValue={
            lokasi.kategori
          }
          required
        />

        <div className="sm:col-span-2">
          <AdminInput
            name="maps_url"
            label="Link Google Maps"
            defaultValue={
              lokasi.maps_url ??
              ''
            }
            placeholder="https://maps.app.goo.gl/..."
          />
        </div>

        <AdminInput
          name="posisi_x"
          label="Posisi X (%)"
          type="number"
          defaultValue={String(
            lokasi.posisi_x
          )}
          step="0.01"
          min="0"
          max="100"
          required
        />

        <AdminInput
          name="posisi_y"
          label="Posisi Y (%)"
          type="number"
          defaultValue={String(
            lokasi.posisi_y
          )}
          step="0.01"
          min="0"
          max="100"
          required
        />

        <AdminInput
          name="urutan"
          label="Urutan"
          type="number"
          defaultValue={String(
            lokasi.urutan
          )}
          min="0"
          required
        />

        <div>
          <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">
            Status
          </label>

          <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4">
            <input
              type="checkbox"
              name="aktif"
              value="true"
              defaultChecked={
                lokasi.aktif
              }
              className="h-4 w-4 accent-emerald-700"
            />

            <span className="text-xs font-bold text-slate-700">
              Tampilkan di
              halaman publik
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-800 sm:col-span-2"
        >
          <Save
            size={15}
          />

          Simpan Perubahan
        </button>
      </form>

      {/* DELETE */}

      <form
        action={
          hapusLokasiAdministrasiAction
        }
        className="border-t border-slate-200 bg-white p-4"
      >
        <input
          type="hidden"
          name="id"
          value={
            String(
              lokasi.id
            )
          }
        />

        <button
          type="submit"
          className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-extrabold text-red-600 transition hover:bg-red-100"
        >
          <Trash2
            size={14}
          />

          Hapus Titik
        </button>
      </form>
    </article>
  );
}

/* =========================================================
   INPUT
========================================================= */

function AdminInput({
  name,
  label,
  defaultValue,
  placeholder,
  type =
    'text',
  required =
    false,
  min,
  max,
  step,
}: {
  name:
    string;

  label:
    string;

  defaultValue?:
    string;

  placeholder?:
    string;

  type?:
    string;

  required?:
    boolean;

  min?:
    string;

  max?:
    string;

  step?:
    string;
}) {
  return (
    <div>
      <label
        htmlFor={
          name
        }
        className="mb-2 block text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500"
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
          name
        }
        name={
          name
        }
        type={
          type
        }
        required={
          required
        }
        min={
          min
        }
        max={
          max
        }
        step={
          step
        }
        defaultValue={
          defaultValue
        }
        placeholder={
          placeholder
        }
        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}

/* =========================================================
   STAT
========================================================= */

function AdminStat({
  label,
  value,
}: {
  label:
    string;

  value:
    number;
}) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-4">
      <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
        {
          label
        }
      </p>

      <p className="mt-2 text-2xl font-black text-slate-900">
        {
          value.toLocaleString(
            'id-ID'
          )
        }
      </p>
    </div>
  );
}