// app/admin/desa-wisata/paket-wisata/page.tsx

import Image from 'next/image';

import Link from 'next/link';

import {
  AlertCircle,
  BookOpen,
  Calculator,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Link2,
  MapPinned,
  Save,
} from 'lucide-react';

import {
  simpanPaketWisataAction,
} from '@/app/admin/desa-wisata/paket-wisata/actions';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

/* =========================================================
   CONFIG
========================================================= */

const HPP_COVER_IMAGE =
  '/desa-wisata/Cover%20HPP.png';

const HPP_GUIDE_PDF =
  '/desa-wisata/Buku%20Panduan%20Perhitungan%20Harga%20Pokok%20%28HPP%29%20Paket%20Wisata%20Desa%20Keji.pdf';

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

interface PaketWisataSettings {
  judul:
    string;

  subjudul:
    string;

  deskripsi:
    string;

  linktree_url:
    | string
    | null;

  tombol_label:
    string;

  aktif:
    boolean;

  updated_at:
    string;
}

/* =========================================================
   FALLBACK
========================================================= */

const fallbackSettings:
  PaketWisataSettings = {
  judul:
    'Paket Wisata Desa Keji',

  subjudul:
    'Temukan pengalaman wisata, budaya, kuliner, dan aktivitas menarik di Desa Keji.',

  deskripsi:
    'Seluruh informasi Paket Wisata Desa Keji tersedia melalui satu tautan yang mudah diakses.',

  linktree_url:
    null,

  tombol_label:
    'Lihat Paket Wisata',

  aktif:
    true,

  updated_at:
    '',
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

function normalizeSettings(
  value:
    unknown
): PaketWisataSettings {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(
      value
    )
  ) {
    return fallbackSettings;
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
      fallbackSettings
        .judul,

    subjudul:
      safeString(
        row.subjudul
      ) ||
      fallbackSettings
        .subjudul,

    deskripsi:
      safeString(
        row.deskripsi
      ) ||
      fallbackSettings
        .deskripsi,

    linktree_url:
      safeString(
        row.linktree_url
      ) ||
      null,

    tombol_label:
      safeString(
        row.tombol_label
      ) ||
      fallbackSettings
        .tombol_label,

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

function isExternalUrl(
  value:
    string |
    null
) {
  if (
    !value
  ) {
    return false;
  }

  try {
    const url =
      new URL(
        value
      );

    return (
      url.protocol ===
        'http:' ||
      url.protocol ===
        'https:'
    );
  } catch {
    return false;
  }
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

export default async function AdminPaketWisataPage({
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
          'desa_wisata_paket_settings'
        )
        .select(`
          judul,
          subjudul,
          deskripsi,
          linktree_url,
          tombol_label,
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
      'Gagal mengambil Paket Wisata:',
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

  const urlValid =
    isExternalUrl(
      settings.linktree_url
    );

  const tayang =
    settings.aktif &&
    urlValid;

  return (
    <div className="mx-auto max-w-[1450px] space-y-7">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 px-6 py-8 text-white shadow-xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)',

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
                Desa Wisata
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                Kelola Paket Wisata
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                Kelola informasi
                Paket Wisata Desa
                Keji dan lihat
                dokumen Buku Panduan
                Perhitungan Harga
                Pokok Paket Wisata.
              </p>
            </div>
          </div>

          <Link
            href="/desa-wisata/paket-wisata"
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

      {/* MESSAGE */}

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
          text="Pengaturan Paket Wisata gagal dimuat."
        />
      )}

      {/* =====================================================
          FORM SETTINGS
      ===================================================== */}

      <form
        action={
          simpanPaketWisataAction
        }
        className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white px-6 py-5 sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                Paket Wisata
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                Informasi Publik
              </h2>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold ${
                tayang
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {tayang ? (
                <CheckCircle2
                  size={15}
                />
              ) : (
                <AlertCircle
                  size={15}
                />
              )}

              {tayang
                ? 'Tayang di Publik'
                : 'Belum Tayang'}
            </span>
          </div>
        </div>

        <div className="grid gap-7 p-6 sm:p-7 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* FIELDS */}

          <div className="grid gap-5">
            <TextInput
              name="judul"
              label="Judul Halaman"
              value={
                settings.judul
              }
              placeholder="Paket Wisata Desa Keji"
            />

            <TextArea
              name="subjudul"
              label="Subjudul"
              value={
                settings.subjudul
              }
              rows={3}
            />

            <TextArea
              name="deskripsi"
              label="Deskripsi"
              value={
                settings.deskripsi
              }
              rows={4}
            />

            <TextInput
              name="linktree_url"
              label="URL Paket Wisata"
              type="url"
              value={
                settings.linktree_url ??
                ''
              }
              placeholder="https://..."
              required={
                false
              }
            />

            <TextInput
              name="tombol_label"
              label="Teks Tombol"
              value={
                settings.tombol_label
              }
              placeholder="Lihat Paket Wisata"
            />

            <Checkbox
              id="paket-wisata-aktif"
              name="aktif"
              label="Publikasikan Paket Wisata"
              description="Jika aktif dan URL valid, tombol Paket Wisata akan tersedia pada halaman publik."
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

                Simpan Paket Wisata
              </button>
            </div>
          </div>

          {/* PREVIEW */}

          <aside className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 text-white shadow-lg">
            <div className="p-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-lg">
                <MapPinned
                  size={27}
                />
              </div>

              <p className="mt-5 text-center text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                Pratinjau
              </p>

              <h3 className="mt-2 text-center text-xl font-black leading-7">
                {
                  settings.judul
                }
              </h3>

              <p className="mt-3 text-center text-xs font-medium leading-6 text-emerald-50/75">
                {
                  settings.subjudul
                }
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200">
                  URL Paket Wisata
                </p>

                <div className="mt-2 flex items-start gap-2">
                  <Link2
                    size={15}
                    className="mt-0.5 shrink-0 text-emerald-200"
                  />

                  <p className="break-all text-xs font-semibold leading-5 text-white/75">
                    {settings.linktree_url ||
                      'URL belum dimasukkan'}
                  </p>
                </div>
              </div>

              {urlValid ? (
                <a
                  href={
                    settings.linktree_url ??
                    '#'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-900 transition hover:bg-emerald-50"
                >
                  {
                    settings
                      .tombol_label
                  }

                  <ExternalLink
                    size={15}
                  />
                </a>
              ) : (
                <span className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-white/15 bg-white/10 px-5 text-xs font-extrabold text-emerald-100">
                  Link Belum Tersedia
                </span>
              )}

              <p className="mt-5 text-center text-[10px] font-semibold text-emerald-100/50">
                Diperbarui{' '}
                {formatTanggal(
                  settings.updated_at
                )}
              </p>
            </div>
          </aside>
        </div>
      </form>

      {/* =====================================================
          HPP DOCUMENT
      ===================================================== */}

      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
        {/* HEADER */}

        <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-white px-6 py-5 sm:px-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
              <Calculator
                size={23}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                Dokumen Pendukung
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                Buku Panduan HPP
                Paket Wisata
              </h2>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500">
                Cover dan Buku
                Panduan Perhitungan
                Harga Pokok Paket
                Wisata yang tampil
                pada halaman publik.
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT */}

        <div className="grid gap-8 p-6 sm:p-7 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-center">
          {/* COVER */}

          <div className="relative mx-auto w-full max-w-[250px]">
            <div className="absolute -bottom-4 left-1/2 h-8 w-[75%] -translate-x-1/2 rounded-full bg-emerald-950/20 blur-xl" />

            <a
              href={
                HPP_GUIDE_PDF
              }
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-2xl bg-white p-2 shadow-xl transition duration-300 hover:-translate-y-1"
            >
              <div className="overflow-hidden rounded-xl">
                <Image
                  src={
                    HPP_COVER_IMAGE
                  }
                  alt="Cover Buku Panduan HPP Paket Wisata Desa Keji"
                  width={
                    900
                  }
                  height={
                    1270
                  }
                  className="h-auto w-full object-contain"
                />
              </div>
            </a>
          </div>

          {/* INFORMATION */}

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">
              <FileText
                size={13}
              />

              PDF Aktif
            </div>

            <h3 className="mt-4 max-w-3xl text-2xl font-black leading-tight text-slate-900">
              Buku Panduan
              Perhitungan Harga Pokok
              (HPP) Paket Wisata
              Desa Keji
            </h3>

            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-slate-500">
              Buku panduan ini
              ditampilkan langsung
              pada halaman Paket
              Wisata. Pengunjung
              dapat membuka dokumen
              melalui browser atau
              mengunduh file PDF.
            </p>

            {/* FILE INFO */}

            <div className="mt-6 grid gap-3 xl:grid-cols-2">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-700">
                  Cover
                </p>

                <p className="mt-2 break-all font-mono text-[11px] font-semibold leading-5 text-slate-600">
                  public/desa-wisata/Cover HPP.png
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-700">
                  Dokumen
                </p>

                <p className="mt-2 break-all font-mono text-[11px] font-semibold leading-5 text-slate-600">
                  Buku Panduan
                  Perhitungan Harga
                  Pokok (HPP) Paket
                  Wisata Desa Keji.pdf
                </p>
              </div>
            </div>

            {/* ACTION */}

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={
                  HPP_GUIDE_PDF
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800"
              >
                <BookOpen
                  size={16}
                />

                Buka PDF

                <ExternalLink
                  size={13}
                />
              </a>

              <a
                href={
                  HPP_GUIDE_PDF
                }
                download="Buku Panduan Perhitungan Harga Pokok (HPP) Paket Wisata Desa Keji.pdf"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-6 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-100"
              >
                <Download
                  size={16}
                />

                Unduh PDF
              </a>
            </div>
          </div>
        </div>
      </section>
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

      <p className="text-sm font-semibold leading-6">
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
  value = '',
  placeholder,
  type =
    'text',
  required =
    true,
}: {
  name:
    string;

  label:
    string;

  value?:
    string;

  placeholder?:
    string;

  type?:
    string;

  required?:
    boolean;
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
   TEXTAREA
========================================================= */

function TextArea({
  name,
  label,
  value = '',
  rows =
    4,
}: {
  name:
    string;

  label:
    string;

  value?:
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

        <span className="ml-1 text-red-500">
          *
        </span>
      </label>

      <textarea
        id={
          name
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
          {description}
        </span>
      </span>
    </label>
  );
}