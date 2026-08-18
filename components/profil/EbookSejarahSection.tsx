// components/profil/EbookSejarahSection.tsx

import {
  BookOpen,
  Download,
  ExternalLink,
  FileText,
} from 'lucide-react';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

/* =========================================================
   CONFIG
========================================================= */

const SETTINGS_KEY =
  'utama';

const JENIS_EBOOK =
  'ebook-sejarah';

/* =========================================================
   TYPES
========================================================= */

interface EbookSejarahPublik {
  id:
    string;

  judul:
    string;

  deskripsi:
    string;

  penyusun:
    string;

  tahun:
    number | null;

  jumlah_halaman:
    number | null;

  file_url:
    string;

  cover_url:
    string | null;

  urutan:
    number;
}

interface EbookSettings {
  label:
    string;

  judul:
    string;

  deskripsi:
    string;

  emptyJudul:
    string;

  emptyDeskripsi:
    string;
}

/* =========================================================
   DEFAULT
========================================================= */

const DEFAULT_SETTINGS:
  EbookSettings = {
  label:
    'Arsip Digital',

  judul:
    'Ebook Sejarah Desa Keji',

  deskripsi:
    'Baca dan unduh dokumentasi sejarah Desa Keji dalam bentuk buku digital.',

  emptyJudul:
    'Ebook sejarah sedang disiapkan',

  emptyDeskripsi:
    'Ebook akan ditampilkan setelah ditambahkan dan dipublikasikan melalui halaman administrator.',
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

function normalizeEbook(
  value:
    unknown
): EbookSejarahPublik | null {
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

  const deskripsi =
    safeString(
      row.deskripsi
    );

  const penyusun =
    safeString(
      row.penyusun
    );

  const fileUrl =
    safeString(
      row.file_url
    );

  const urutan =
    Number(
      row.urutan ??
        0
    );

  if (
    !id ||
    !judul ||
    !deskripsi ||
    !penyusun ||
    !fileUrl ||
    !Number.isInteger(
      urutan
    )
  ) {
    return null;
  }

  const tahun =
    row.tahun ===
      null ||
    row.tahun ===
      undefined
      ? null
      : Number(
          row.tahun
        );

  const halaman =
    row.jumlah_halaman ===
      null ||
    row.jumlah_halaman ===
      undefined
      ? null
      : Number(
          row.jumlah_halaman
        );

  return {
    id,

    judul,

    deskripsi,

    penyusun,

    tahun:
      tahun !==
        null &&
      Number.isInteger(
        tahun
      )
        ? tahun
        : null,

    jumlah_halaman:
      halaman !==
        null &&
      Number.isInteger(
        halaman
      )
        ? halaman
        : null,

    file_url:
      fileUrl,

    cover_url:
      safeString(
        row.cover_url
      ) ||
      null,

    urutan,
  };
}

/* =========================================================
   COMPONENT
========================================================= */

export default async function EbookSejarahSection() {
  const [
    settingsResult,
    ebookResult,
  ] =
    await Promise.all([
      supabaseAdmin
        .from(
          'profil_sejarah_settings'
        )
        .select(`
          ebook_label,
          ebook_judul,
          ebook_deskripsi,
          ebook_empty_judul,
          ebook_empty_deskripsi
        `)
        .eq(
          'setting_key',
          SETTINGS_KEY
        )
        .maybeSingle(),

      supabaseAdmin
        .from(
          'desa_wisata_dokumen'
        )
        .select(`
          id,
          judul,
          deskripsi,
          penyusun,
          tahun,
          jumlah_halaman,
          file_url,
          cover_url,
          urutan
        `)
        .eq(
          'jenis',
          JENIS_EBOOK
        )
        .eq(
          'aktif',
          true
        )
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

            nullsFirst:
              false,
          }
        ),
    ]);

  const settings:
    EbookSettings = {
    label:
      safeString(
        settingsResult.data
          ?.ebook_label
      ) ||
      DEFAULT_SETTINGS.label,

    judul:
      safeString(
        settingsResult.data
          ?.ebook_judul
      ) ||
      DEFAULT_SETTINGS.judul,

    deskripsi:
      safeString(
        settingsResult.data
          ?.ebook_deskripsi
      ) ||
      DEFAULT_SETTINGS.deskripsi,

    emptyJudul:
      safeString(
        settingsResult.data
          ?.ebook_empty_judul
      ) ||
      DEFAULT_SETTINGS.emptyJudul,

    emptyDeskripsi:
      safeString(
        settingsResult.data
          ?.ebook_empty_deskripsi
      ) ||
      DEFAULT_SETTINGS
        .emptyDeskripsi,
  };

  const daftarEbook =
    (
      ebookResult.data ??
      []
    )
      .map(
        normalizeEbook
      )
      .filter(
        (
          item
        ): item is EbookSejarahPublik =>
          item !==
          null
      );

  return (
    <section
      id="ebook-sejarah"
      className="mt-10 scroll-mt-28"
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
          <BookOpen
            size={23}
          />
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
            {
              settings.label
            }
          </p>

          <h2 className="mt-1 text-2xl font-black text-slate-900">
            {
              settings.judul
            }
          </h2>

          <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
            {
              settings.deskripsi
            }
          </p>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      {daftarEbook.length >
      0 ? (
        <div className="space-y-5">
          {daftarEbook.map(
            (
              ebook,
              index
            ) => (
              <EbookCard
                key={
                  ebook.id
                }
                ebook={
                  ebook
                }
                nomor={
                  index +
                  1
                }
              />
            )
          )}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <FileText
            size={46}
            className="mx-auto text-slate-300"
          />

          <h3 className="mt-4 text-lg font-black text-slate-800">
            {
              settings.emptyJudul
            }
          </h3>

          <p className="mx-auto mt-2 max-w-lg text-sm font-medium leading-6 text-slate-500">
            {
              settings.emptyDeskripsi
            }
          </p>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   EBOOK CARD
========================================================= */

function EbookCard({
  ebook,
  nomor,
}: {
  ebook:
    EbookSejarahPublik;

  nomor:
    number;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-lg">
      <div className="grid sm:grid-cols-[200px_minmax(0,1fr)]">
        {/* COVER */}

        <div className="relative min-h-72 overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700">
          {ebook.cover_url ? (
            <img
              src={
                ebook.cover_url
              }
              alt={`Cover ${ebook.judul}`}
              loading="lazy"
              className="h-full min-h-72 w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-72 flex-col items-center justify-center p-6 text-center text-white">
              <BookOpen
                size={52}
              />

              <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                Ebook Sejarah
              </p>

              <p className="mt-2 text-xl font-black">
                Desa Keji
              </p>
            </div>
          )}

          <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-black text-white backdrop-blur">
            {String(
              nomor
            ).padStart(
              2,
              '0'
            )}
          </span>
        </div>

        {/* CONTENT */}

        <div className="flex flex-col p-6">
          <div className="flex flex-wrap gap-2">
            {ebook.tahun && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-emerald-700">
                Tahun{' '}
                {
                  ebook.tahun
                }
              </span>
            )}

            {ebook.jumlah_halaman && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-[10px] font-extrabold text-blue-700">
                {
                  ebook.jumlah_halaman
                }{' '}
                halaman
              </span>
            )}
          </div>

          <h3 className="mt-4 text-2xl font-black leading-tight text-slate-900">
            {
              ebook.judul
            }
          </h3>

          <p className="mt-2 text-xs font-extrabold uppercase tracking-wider text-emerald-700">
            Disusun oleh{' '}
            {
              ebook.penyusun
            }
          </p>

          <p className="mt-4 flex-1 text-sm font-medium leading-7 text-slate-600">
            {
              ebook.deskripsi
            }
          </p>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
            <a
              href={
                ebook.file_url
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white transition hover:bg-emerald-800"
            >
              <FileText
                size={16}
              />

              Baca Ebook

              <ExternalLink
                size={13}
              />
            </a>

            <a
              href={
                ebook.file_url
              }
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-100"
            >
              <Download
                size={16}
              />

              Unduh PDF
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}