// components/admin/EbookSejarahAdminSection.tsx

import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Pencil,
  Plus,
  Power,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import {
  hapusEbookSejarahAction,
  simpanPengaturanEbookSejarahAction,
  tambahEbookSejarahAction,
  toggleEbookSejarahAction,
  ubahEbookSejarahAction,
} from '@/app/admin/pengaturan/ebook-sejarah/actions';

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

interface EbookAdmin {
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

  aktif:
    boolean;

  urutan:
    number;
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
): EbookAdmin | null {
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

    aktif:
      Boolean(
        row.aktif
      ),

    urutan,
  };
}

/* =========================================================
   COMPONENT
========================================================= */

export default async function EbookSejarahAdminSection() {
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
          aktif,
          urutan
        `)
        .eq(
          'jenis',
          JENIS_EBOOK
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

  /* =======================================================
     SETTINGS
  ======================================================= */

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

  /* =======================================================
     ITEMS
  ======================================================= */

  const ebooks =
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
        ): item is EbookAdmin =>
          item !==
          null
      );

  const jumlahAktif =
    ebooks.filter(
      (
        item
      ) =>
        item.aktif
    ).length;

  return (
    <section
      id="ebook-sejarah"
      className="scroll-mt-24 space-y-6"
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-6 text-white shadow-lg sm:p-7">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,.55) 1px, transparent 1px)',

            backgroundSize:
              '24px 24px',
          }}
        />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <BookOpen
                size={23}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                Arsip Digital
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Ebook Sejarah Desa
                Keji
              </h2>

              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-emerald-50/80">
                Kelola teks section,
                cover, PDF, informasi
                buku, urutan, dan
                status publikasi.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <span className="rounded-xl bg-white/10 px-4 py-3 text-xs font-extrabold">
              {
                ebooks.length
              }{' '}
              Ebook
            </span>

            <span className="rounded-xl bg-white/10 px-4 py-3 text-xs font-extrabold">
              {
                jumlahAktif
              }{' '}
              Aktif
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          SETTINGS
      ===================================================== */}

      <form
        action={
          simpanPengaturanEbookSejarahAction
        }
        className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <div className="border-b border-emerald-100 bg-emerald-50/60 p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-emerald-700">
            Tampilan Publik
          </p>

          <h3 className="mt-1 text-xl font-black text-slate-900">
            Pengaturan Section Ebook
          </h3>

          <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
            Teks berikut sama dengan
            teks yang tampil pada
            halaman Sejarah Desa.
          </p>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <TextInput
            name="ebook_label"
            label="Label Section"
            value={
              settings.label
            }
          />

          <TextInput
            name="ebook_judul"
            label="Judul Section"
            value={
              settings.judul
            }
          />

          <div className="md:col-span-2">
            <TextArea
              name="ebook_deskripsi"
              label="Deskripsi Section"
              value={
                settings.deskripsi
              }
              rows={
                3
              }
            />
          </div>

          <TextInput
            name="ebook_empty_judul"
            label="Judul Saat Ebook Kosong"
            value={
              settings.emptyJudul
            }
          />

          <div className="md:col-span-2">
            <TextArea
              name="ebook_empty_deskripsi"
              label="Deskripsi Saat Ebook Kosong"
              value={
                settings.emptyDeskripsi
              }
              rows={
                3
              }
            />
          </div>

          <div className="flex justify-end md:col-span-2">
            <SaveButton
              text="Simpan Tampilan Ebook"
            />
          </div>
        </div>
      </form>

      {/* =====================================================
          ADD EBOOK
      ===================================================== */}

      <form
        id="tambah-ebook-sejarah"
        action={
          tambahEbookSejarahAction
        }
        className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <Plus
                size={20}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                Tambah Dokumen
              </p>

              <h3 className="mt-1 text-xl font-black text-slate-900">
                Tambah Ebook Sejarah
              </h3>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Upload PDF dan cover
                langsung dari
                perangkat.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <TextInput
              name="judul"
              label="Judul Ebook"
              placeholder="Contoh: Sejarah Desa Keji"
            />
          </div>

          <TextInput
            name="penyusun"
            label="Penyusun"
            placeholder="Nama tim atau penyusun"
          />

          <NumberInput
            name="tahun"
            label="Tahun"
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
            name="jumlah_halaman"
            label="Jumlah Halaman"
            min={
              1
            }
            required={
              false
            }
          />

          <NumberInput
            name="urutan"
            label="Urutan"
            min={
              0
            }
            value={String(
              ebooks.length +
                1
            )}
          />

          <div className="md:col-span-2">
            <TextArea
              name="deskripsi"
              label="Deskripsi Ebook"
              placeholder="Tuliskan deskripsi singkat ebook sejarah."
              rows={
                4
              }
            />
          </div>

          <FileInput
            name="cover"
            label="Cover Ebook"
            accept="image/jpeg,image/png,image/webp"
            description="JPG, PNG, atau WebP. Maksimal 2 MB."
            required={
              false
            }
          />

          <FileInput
            name="file_pdf"
            label="File PDF"
            accept="application/pdf"
            description="PDF. Maksimal 7 MB."
            required
          />

          <Checkbox
            name="aktif"
            label="Publikasikan Ebook"
            description="Ebook langsung tampil pada halaman Sejarah Desa."
            checked
          />

          <div className="flex items-end justify-end">
            <SaveButton
              text="Tambah Ebook"
            />
          </div>
        </div>
      </form>

      {/* =====================================================
          LIST
      ===================================================== */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-emerald-700">
            Daftar Dokumen
          </p>

          <h3 className="mt-1 text-xl font-black text-slate-900">
            Ebook Sejarah Tersimpan
          </h3>
        </div>

        {ebooks.length ===
        0 ? (
          <div className="px-6 py-14 text-center">
            <FileText
              size={44}
              className="mx-auto text-slate-300"
            />

            <p className="mt-4 font-black text-slate-700">
              Belum ada ebook
            </p>
          </div>
        ) : (
          <div className="grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-3">
            {ebooks.map(
              (
                ebook
              ) => (
                <EbookCard
                  key={
                    ebook.id
                  }
                  ebook={
                    ebook
                  }
                />
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   EBOOK CARD
========================================================= */

function EbookCard({
  ebook,
}: {
  ebook:
    EbookAdmin;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
      {/* COVER */}

      <div className="relative aspect-[4/3] overflow-hidden bg-emerald-950">
        {ebook.cover_url ? (
          <img
            src={
              ebook.cover_url
            }
            alt={
              ebook.judul
            }
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-emerald-200">
            <ImageIcon
              size={40}
            />

            <p className="mt-3 text-xs font-extrabold uppercase">
              Tanpa Cover
            </p>
          </div>
        )}

        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-[9px] font-extrabold text-white ${
            ebook.aktif
              ? 'bg-emerald-700'
              : 'bg-slate-800'
          }`}
        >
          {ebook.aktif
            ? 'Aktif'
            : 'Nonaktif'}
        </span>
      </div>

      {/* INFO */}

      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {ebook.tahun && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-extrabold text-emerald-700">
              {
                ebook.tahun
              }
            </span>
          )}

          {ebook.jumlah_halaman && (
            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[9px] font-extrabold text-blue-700">
              {
                ebook.jumlah_halaman
              }{' '}
              halaman
            </span>
          )}
        </div>

        <h4 className="mt-3 text-lg font-black text-slate-900">
          {
            ebook.judul
          }
        </h4>

        <p className="mt-1 text-xs font-extrabold text-emerald-700">
          {
            ebook.penyusun
          }
        </p>

        <p className="mt-3 line-clamp-3 text-sm font-medium leading-6 text-slate-500">
          {
            ebook.deskripsi
          }
        </p>

        <a
          href={
            ebook.file_url
          }
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold text-emerald-700"
        >
          <BookOpen
            size={14}
          />

          Buka PDF

          <ExternalLink
            size={11}
          />
        </a>
      </div>

      {/* ACTION */}

      <div className="grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-4">
        <form
          action={
            toggleEbookSejarahAction
          }
        >
          <input
            type="hidden"
            name="id"
            value={
              ebook.id
            }
          />

          <input
            type="hidden"
            name="aktif"
            value={String(
              !ebook.aktif
            )}
          />

          <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-100 text-xs font-extrabold text-emerald-700">
            <Power
              size={14}
            />

            {ebook.aktif
              ? 'Sembunyikan'
              : 'Publikasikan'}
          </button>
        </form>

        <form
          action={
            hapusEbookSejarahAction
          }
        >
          <input
            type="hidden"
            name="id"
            value={
              ebook.id
            }
          />

          <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-red-100 text-xs font-extrabold text-red-700">
            <Trash2
              size={14}
            />

            Hapus
          </button>
        </form>
      </div>

      {/* EDIT */}

      <details className="border-t border-slate-200 bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-center gap-2 p-4 text-sm font-extrabold text-slate-700">
          <Pencil
            size={15}
          />

          Edit Ebook
        </summary>

        <form
          action={
            ubahEbookSejarahAction
          }
          className="grid gap-4 border-t border-slate-200 p-5"
        >
          <input
            type="hidden"
            name="id"
            value={
              ebook.id
            }
          />

          <TextInput
            name="judul"
            label="Judul"
            value={
              ebook.judul
            }
          />

          <TextInput
            name="penyusun"
            label="Penyusun"
            value={
              ebook.penyusun
            }
          />

          <TextArea
            name="deskripsi"
            label="Deskripsi"
            value={
              ebook.deskripsi
            }
            rows={
              4
            }
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <NumberInput
              name="tahun"
              label="Tahun"
              value={
                ebook.tahun
                  ? String(
                      ebook.tahun
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
              name="jumlah_halaman"
              label="Halaman"
              value={
                ebook.jumlah_halaman
                  ? String(
                      ebook.jumlah_halaman
                    )
                  : ''
              }
              min={
                1
              }
              required={
                false
              }
            />

            <NumberInput
              name="urutan"
              label="Urutan"
              value={String(
                ebook.urutan
              )}
              min={
                0
              }
            />
          </div>

          <FileInput
            name="cover"
            label="Ganti Cover"
            accept="image/jpeg,image/png,image/webp"
            description="Kosongkan jika tidak ingin mengganti."
            required={
              false
            }
          />

          <FileInput
            name="file_pdf"
            label="Ganti PDF"
            accept="application/pdf"
            description="Kosongkan jika PDF lama tetap digunakan."
            required={
              false
            }
          />

          {ebook.cover_url && (
            <Checkbox
              name="hapus_cover"
              label="Hapus Cover Lama"
              description="Gunakan tampilan cover default."
              checked={
                false
              }
              danger
            />
          )}

          <Checkbox
            name="aktif"
            label="Publikasikan Ebook"
            description="Tampilkan pada halaman publik."
            checked={
              ebook.aktif
            }
          />

          <SaveButton
            text="Simpan Perubahan"
          />
        </form>
      </details>
    </article>
  );
}

/* =========================================================
   INPUT
========================================================= */

function TextInput({
  name,
  label,
  value =
    '',
  placeholder,
}: {
  name:
    string;

  label:
    string;

  value?:
    string;

  placeholder?:
    string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
        {
          label
        }
      </span>

      <input
        name={
          name
        }
        required
        defaultValue={
          value
        }
        placeholder={
          placeholder
        }
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function NumberInput({
  name,
  label,
  value =
    '',
  min,
  max,
  required =
    true,
}: {
  name:
    string;

  label:
    string;

  value?:
    string;

  min:
    number;

  max?:
    number;

  required?:
    boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
        {
          label
        }
      </span>

      <input
        name={
          name
        }
        type="number"
        min={
          min
        }
        max={
          max
        }
        step="1"
        required={
          required
        }
        defaultValue={
          value
        }
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function TextArea({
  name,
  label,
  value =
    '',
  placeholder,
  rows,
}: {
  name:
    string;

  label:
    string;

  value?:
    string;

  placeholder?:
    string;

  rows:
    number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
        {
          label
        }
      </span>

      <textarea
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
        placeholder={
          placeholder
        }
        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium leading-6 outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function FileInput({
  name,
  label,
  accept,
  description,
  required,
}: {
  name:
    string;

  label:
    string;

  accept:
    string;

  description:
    string;

  required:
    boolean;
}) {
  return (
    <label className="block rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5">
      <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-600">
        <Upload
          size={15}
          className="text-emerald-700"
        />

        {
          label
        }
      </span>

      <input
        type="file"
        name={
          name
        }
        accept={
          accept
        }
        required={
          required
        }
        className="mt-4 block w-full text-xs font-semibold text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-700 file:px-4 file:py-2.5 file:text-xs file:font-extrabold file:text-white"
      />

      <span className="mt-2 block text-[10px] font-medium text-slate-400">
        {
          description
        }
      </span>
    </label>
  );
}

function Checkbox({
  name,
  label,
  description,
  checked,
  danger =
    false,
}: {
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
      className={`flex cursor-pointer gap-3 rounded-2xl border p-4 ${
        danger
          ? 'border-red-100 bg-red-50'
          : 'border-emerald-100 bg-emerald-50'
      }`}
    >
      <input
        type="checkbox"
        name={
          name
        }
        value="true"
        defaultChecked={
          checked
        }
        className="mt-1 h-4 w-4 accent-emerald-700"
      />

      <span>
        <span
          className={`block text-sm font-extrabold ${
            danger
              ? 'text-red-800'
              : 'text-emerald-900'
          }`}
        >
          {
            label
          }
        </span>

        <span className="mt-1 block text-xs font-medium text-slate-500">
          {
            description
          }
        </span>
      </span>
    </label>
  );
}

function SaveButton({
  text,
}: {
  text:
    string;
}) {
  return (
    <button
      type="submit"
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800"
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