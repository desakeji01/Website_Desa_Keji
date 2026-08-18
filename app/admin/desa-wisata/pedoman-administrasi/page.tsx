// app/admin/desa-wisata/pedoman-administrasi/page.tsx

import Link from 'next/link';

import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileText,
  ImageIcon,
  Save,
} from 'lucide-react';

import {
  simpanPedomanAdministrasiAction,
} from '@/app/admin/desa-wisata/pedoman-administrasi/actions';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

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

interface PedomanSettings {
  judul:
    string;

  deskripsi:
    string;

  cover_url:
    | string
    | null;

  pdf_url:
    | string
    | null;

  tahun:
    number;

  aktif:
    boolean;

  updated_at:
    string;
}

/* =========================================================
   FALLBACK
========================================================= */

const fallbackSettings:
  PedomanSettings = {
  judul:
    'Pedoman Administrasi',

  deskripsi:
    'Buku pedoman administrasi sebagai panduan pengelolaan administrasi dalam mendukung tata kelola Desa Wisata Keji yang tertib dan terstruktur.',

  cover_url:
    '/desa-wisata/Cover Pokdarwis.png',

  pdf_url:
    '/desa-wisata/Green White Modern Agriculture Company Profile Booklet.pdf',

  tahun:
    2026,

  aktif:
    true,

  updated_at:
    '',
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

function normalizeSettings(
  value: unknown
): PedomanSettings {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(value)
  ) {
    return fallbackSettings;
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  const tahun =
    Number(
      row.tahun
    );

  return {
    judul:
      safeString(
        row.judul
      ) ||
      fallbackSettings.judul,

    deskripsi:
      safeString(
        row.deskripsi
      ) ||
      fallbackSettings.deskripsi,

    cover_url:
      safeString(
        row.cover_url
      ) ||
      fallbackSettings.cover_url,

    pdf_url:
      safeString(
        row.pdf_url
      ) ||
      fallbackSettings.pdf_url,

    tahun:
      Number.isInteger(
        tahun
      )
        ? tahun
        : fallbackSettings.tahun,

    aktif:
      row.aktif ===
        undefined ||
      row.aktif ===
        null
        ? true
        : Boolean(
            row.aktif
          ),

    updated_at:
      safeString(
        row.updated_at
      ),
  };
}

function formatTanggal(
  value:
    string
) {
  if (
    !value
  ) {
    return 'Belum diperbarui';
  }

  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return 'Belum diperbarui';
  }

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day:
        '2-digit',

      month:
        'long',

      year:
        'numeric',

      hour:
        '2-digit',

      minute:
        '2-digit',

      timeZone:
        'Asia/Jakarta',
    }
  ).format(
    date
  );
}

/* =========================================================
   PAGE
========================================================= */

export default async function AdminPedomanAdministrasiPage({
  searchParams,
}: PageProps) {
  const [
    params,
    settingsResult,
  ] =
    await Promise.all([
      searchParams,

      supabaseAdmin
        .from(
          'desa_wisata_pedoman_administrasi_settings'
        )
        .select(`
          judul,
          deskripsi,
          cover_url,
          pdf_url,
          tahun,
          aktif,
          updated_at
        `)
        .eq(
          'setting_key',
          'utama'
        )
        .maybeSingle(),
    ]);

  if (
    settingsResult.error
  ) {
    console.error(
      'Gagal mengambil Pedoman Administrasi:',
      {
        message:
          settingsResult.error
            .message,

        code:
          settingsResult.error
            .code,

        details:
          settingsResult.error
            .details,

        hint:
          settingsResult.error
            .hint,
      }
    );
  }

  const settings =
    normalizeSettings(
      settingsResult.data
    );

  return (
    <div className="mx-auto max-w-[1450px] space-y-7">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 px-6 py-8 text-white shadow-xl">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',

            backgroundSize:
              '26px 26px',
          }}
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <BookOpen
                size={27}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                Desa Wisata
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                Pedoman Administrasi
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                Kelola informasi buku
                Pedoman Administrasi
                yang ditampilkan pada
                halaman Desa Wisata
                Keji.
              </p>
            </div>
          </div>

          <Link
            href="/desa-wisata/pedoman-administrasi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white transition hover:bg-white/15"
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

      {settingsResult.error && (
        <Message
          type="error"
          text="Pengaturan Pedoman Administrasi gagal dimuat. Pastikan tabel Supabase sudah dibuat."
        />
      )}

      {/* =====================================================
          FORM
      ===================================================== */}

      <form
        action={
          simpanPedomanAdministrasiAction
        }
        className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        {/* Header */}

        <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white px-6 py-5 sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                Dokumen Desa Wisata
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                Pengaturan Pedoman
                Administrasi
              </h2>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold ${
                settings.aktif
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {settings.aktif ? (
                <CheckCircle2
                  size={15}
                />
              ) : (
                <AlertCircle
                  size={15}
                />
              )}

              {settings.aktif
                ? 'Tayang di Publik'
                : 'Disembunyikan'}
            </span>
          </div>
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="grid gap-7 p-6 sm:p-7 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* =================================================
              FIELDS
          ================================================= */}

          <div className="grid gap-5">
            <TextInput
              name="judul"
              label="Judul Pedoman"
              value={
                settings.judul
              }
            />

            <TextArea
              name="deskripsi"
              label="Deskripsi"
              value={
                settings.deskripsi
              }
              rows={5}
            />

            <TextInput
              name="cover_url"
              label="Path / URL Cover"
              value={
                settings.cover_url ??
                ''
              }
            />

            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                Cover Saat Ini
              </p>

              <p className="mt-1 break-all text-xs font-semibold leading-5 text-emerald-900">
                {
                  settings.cover_url
                }
              </p>

              <p className="mt-2 text-[10px] font-medium text-emerald-700/70">
                File baru:{' '}
                /desa-wisata/Cover
                Pokdarwis.png
              </p>
            </div>

            <TextInput
              name="pdf_url"
              label="Path / URL PDF"
              value={
                settings.pdf_url ??
                ''
              }
            />

            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                PDF Saat Ini
              </p>

              <p className="mt-1 break-all text-xs font-semibold leading-5 text-emerald-900">
                {
                  settings.pdf_url
                }
              </p>

              <p className="mt-2 text-[10px] font-medium leading-5 text-emerald-700/70">
                File baru:
                /desa-wisata/Green
                White Modern
                Agriculture Company
                Profile Booklet.pdf
              </p>
            </div>

            <TextInput
              name="tahun"
              label="Tahun"
              type="number"
              value={String(
                settings.tahun
              )}
            />

            <Checkbox
              id="pedoman-administrasi-aktif"
              name="aktif"
              label="Publikasikan Pedoman Administrasi"
              description="Jika aktif, card dan halaman Pedoman Administrasi akan tersedia pada bagian Desa Wisata."
              checked={
                settings.aktif
              }
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800 sm:w-auto"
              >
                <Save
                  size={17}
                />

                Simpan Pedoman
              </button>
            </div>
          </div>

          {/* =================================================
              PREVIEW
          ================================================= */}

          <aside className="h-fit overflow-hidden rounded-3xl border border-emerald-100 bg-slate-50">
            <div className="border-b border-emerald-100 bg-emerald-950 px-5 py-4 text-white">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-200">
                Pratinjau
              </p>

              <h3 className="mt-1 font-black">
                Pedoman Administrasi
              </h3>
            </div>

            {settings.cover_url ? (
              <div className="bg-gradient-to-br from-emerald-50 to-white p-5">
                <div className="mx-auto max-w-[220px] overflow-hidden rounded-2xl bg-white shadow-lg">
                  <img
                    src={
                      settings.cover_url
                    }
                    alt={
                      settings.judul
                    }
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="flex min-h-[260px] flex-col items-center justify-center text-slate-400">
                <ImageIcon
                  size={38}
                />

                <p className="mt-2 text-xs font-bold">
                  Cover belum tersedia
                </p>
              </div>
            )}

            <div className="p-5">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                Pedoman Desa Wisata
              </p>

              <h3 className="mt-2 text-lg font-black leading-6 text-slate-900">
                {
                  settings.judul
                }
              </h3>

              <p className="mt-2 line-clamp-4 text-xs font-medium leading-6 text-slate-500">
                {
                  settings.deskripsi
                }
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-700">
                <FileText
                  size={14}
                />

                PDF ·{' '}
                {
                  settings.tahun
                }
              </div>

              {settings.pdf_url && (
                <a
                  href={
                    settings.pdf_url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-100"
                >
                  <BookOpen
                    size={15}
                  />

                  Buka PDF

                  <ExternalLink
                    size={13}
                  />
                </a>
              )}

              <p className="mt-4 text-[10px] font-semibold text-slate-400">
                Diperbarui:{' '}
                {formatTanggal(
                  settings.updated_at
                )}
              </p>
            </div>
          </aside>
        </div>
      </form>
    </div>
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

      <p className="text-sm font-semibold">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   INPUT
========================================================= */

function TextInput({
  name,
  label,
  value,
  type =
    'text',
}: {
  name:
    string;

  label:
    string;

  value:
    string;

  type?:
    string;
}) {
  return (
    <div>
      <label
        htmlFor={
          name
        }
        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
      >
        {label}
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
        required
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
  name,
  label,
  value,
  rows =
    4,
}: {
  name:
    string;

  label:
    string;

  value:
    string;

  rows?:
    number;
}) {
  return (
    <div>
      <label
        htmlFor={
          name
        }
        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
      >
        {label}
      </label>

      <textarea
        id={
          name
        }
        name={
          name
        }
        required
        rows={
          rows
        }
        defaultValue={
          value
        }
        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-7 text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
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
}) {
  return (
    <label
      htmlFor={
        id
      }
      className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
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
        className="mt-1 h-4 w-4 shrink-0 accent-emerald-700"
      />

      <span>
        <span className="block text-sm font-extrabold text-slate-700">
          {label}
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