// components/admin/desa-wisata/AdminWisataCrud.tsx

import Link from 'next/link';

import {
  AlertCircle,
  Camera,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  ImageIcon,
  Pencil,
  Plus,
  Save,
  Trash2,
  type LucideIcon,
} from 'lucide-react';

import type {
  WisataAdminItem,
} from '@/lib/desa-wisata-admin';

/* =========================================================
   TYPES
========================================================= */

type FormAction = (
  formData: FormData
) => Promise<void>;

interface AdminConfig {
  eyebrow: string;

  title: string;

  description: string;

  publicHref: string;

  nameLabel: string;

  categoryLabel: string;

  itemName: string;

  icon: LucideIcon;

  showLocation?: boolean;

  showSchedule?: boolean;

  showDate?: boolean;
}

interface Props {
  config:
    AdminConfig;

  items:
    WisataAdminItem[];

  success?:
    string;

  error?:
    string;

  loadError?:
    string;

  addAction:
    FormAction;

  updateAction:
    FormAction;

  toggleAction:
    FormAction;

  deleteAction:
    FormAction;
}

/* =========================================================
   PAGE
========================================================= */

export default function AdminWisataCrud({
  config,
  items,
  success,
  error,
  loadError,
  addAction,
  updateAction,
  toggleAction,
  deleteAction,
}: Props) {
  const Icon =
    config.icon;

  const activeCount =
    items.filter(
      (item) =>
        item.aktif
    ).length;

  const imageCount =
    items.filter(
      (item) =>
        Boolean(
          item.gambarUrl
        )
    ).length;

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 px-6 py-8 text-white shadow-xl">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,.5) 1px, transparent 1px)',

            backgroundSize:
              '26px 26px',
          }}
        />

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[52px] border-white/[0.05]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <Icon
                size={27}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-200">
                {config.eyebrow}
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                {config.title}
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                {
                  config.description
                }
              </p>
            </div>
          </div>

          <Link
            href={
              config.publicHref
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold transition hover:bg-white/15"
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

      {success && (
        <Message
          type="success"
          text={success}
        />
      )}

      {error && (
        <Message
          type="error"
          text={error}
        />
      )}

      {loadError && (
        <Message
          type="error"
          text={loadError}
        />
      )}

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Data"
          value={
            items.length
          }
        />

        <StatCard
          label="Aktif"
          value={
            activeCount
          }
        />

        <StatCard
          label="Memiliki Foto"
          value={
            imageCount
          }
        />
      </section>

      {/* =====================================================
          ADD
      ===================================================== */}

      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
        <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <Plus
                size={21}
              />
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                Tambah Data
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                Tambah{' '}
                {
                  config.itemName
                }
              </h2>

              <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                Foto dapat langsung
                diunggah dari perangkat
                admin.
              </p>
            </div>
          </div>
        </div>

        <form
          action={
            addAction
          }
          className="p-6"
        >
          <CrudFields
            config={
              config
            }
          />

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800 sm:w-auto"
            >
              <Plus
                size={17}
              />

              Tambah Data
            </button>
          </div>
        </form>
      </section>

      {/* =====================================================
          LIST
      ===================================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
            Data Tersimpan
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-900">
            Daftar{' '}
            {
              config.itemName
            }
          </h2>
        </div>

        {items.length ===
        0 ? (
          <div className="px-6 py-16 text-center">
            <ImageIcon
              size={38}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-black text-slate-700">
              Belum ada data
            </h3>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Tambahkan data melalui
              formulir di atas.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map(
              (
                item,
                index
              ) => (
                <DataCard
                  key={
                    item.id
                  }
                  item={
                    item
                  }
                  number={
                    index +
                    1
                  }
                  config={
                    config
                  }
                  updateAction={
                    updateAction
                  }
                  toggleAction={
                    toggleAction
                  }
                  deleteAction={
                    deleteAction
                  }
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   DATA CARD
========================================================= */

function DataCard({
  item,
  number,
  config,
  updateAction,
  toggleAction,
  deleteAction,
}: {
  item:
    WisataAdminItem;

  number:
    number;

  config:
    AdminConfig;

  updateAction:
    FormAction;

  toggleAction:
    FormAction;

  deleteAction:
    FormAction;
}) {
  return (
    <article
      className={`p-5 sm:p-6 ${
        item.aktif
          ? 'bg-white'
          : 'bg-slate-50'
      }`}
    >
      <div className="grid gap-5 lg:grid-cols-[170px_minmax(0,1fr)_150px]">
        {/* IMAGE */}

        <ImagePreview
          url={
            item.gambarUrl
          }
          alt={
            item.nama
          }
        />

        {/* INFO */}

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-[10px] font-black text-emerald-700">
              {String(
                number
              ).padStart(
                2,
                '0'
              )}
            </span>

            <h3 className="text-lg font-black text-slate-900">
              {
                item.nama
              }
            </h3>

            <span
              className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase ${
                item.aktif
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {item.aktif
                ? 'Aktif'
                : 'Nonaktif'}
            </span>
          </div>

          <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.12em] text-emerald-700">
            {
              item.kategori
            }
          </p>

          {config.showLocation &&
            item.lokasi && (
              <p className="mt-2 text-xs font-semibold text-slate-500">
                Lokasi:{' '}
                {
                  item.lokasi
                }
              </p>
            )}

          {config.showSchedule &&
            item.jadwal && (
              <p className="mt-2 text-xs font-semibold text-slate-500">
                Jadwal:{' '}
                {
                  item.jadwal
                }
              </p>
            )}

          {config.showDate &&
            item.tanggal && (
              <p className="mt-2 text-xs font-semibold text-slate-500">
                Tanggal:{' '}
                {formatDate(
                  item.tanggal
                )}
              </p>
            )}

          <p className="mt-4 text-sm font-medium leading-7 text-slate-500">
            {
              item.deskripsi
            }
          </p>

          <p className="mt-3 text-[10px] font-bold text-slate-400">
            Urutan:{' '}
            {
              item.urutan
            }
          </p>

          {/* EDIT */}

          <details className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <summary className="flex cursor-pointer list-none items-center gap-2 p-4 text-xs font-extrabold text-emerald-700">
              <Pencil
                size={15}
              />

              Edit Data
            </summary>

            <form
              action={
                updateAction
              }
              className="border-t border-slate-200 bg-white p-5"
            >
              <input
                type="hidden"
                name="id"
                value={
                  item.id
                }
              />

              <CrudFields
                config={
                  config
                }
                item={
                  item
                }
              />

              {item.gambarUrl && (
                <label className="mt-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                  <input
                    type="checkbox"
                    name="hapus_gambar"
                    value="true"
                    className="mt-1 h-4 w-4 accent-red-600"
                  />

                  <span>
                    <span className="block text-xs font-extrabold text-red-700">
                      Hapus foto lama
                    </span>

                    <span className="mt-1 block text-[10px] font-medium leading-5 text-red-600">
                      Centang jika foto
                      ingin dihapus
                      tanpa menggantinya.
                    </span>
                  </span>
                </label>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-xs font-extrabold text-white hover:bg-emerald-800 sm:w-auto"
                >
                  <Save
                    size={15}
                  />

                  Simpan Perubahan
                </button>
              </div>
            </form>
          </details>
        </div>

        {/* ACTION */}

        <div className="space-y-2">
          <form
            action={
              toggleAction
            }
          >
            <input
              type="hidden"
              name="id"
              value={
                item.id
              }
            />

            <input
              type="hidden"
              name="aktif"
              value={
                item.aktif
                  ? 'false'
                  : 'true'
              }
            />

            <button
              type="submit"
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700"
            >
              {item.aktif ? (
                <>
                  <EyeOff
                    size={15}
                  />

                  Nonaktifkan
                </>
              ) : (
                <>
                  <Eye
                    size={15}
                  />

                  Aktifkan
                </>
              )}
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
                item.id
              }
            />

            <button
              type="submit"
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-extrabold text-red-700 transition hover:bg-red-100"
            >
              <Trash2
                size={15}
              />

              Hapus
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   FIELDS
========================================================= */

function CrudFields({
  config,
  item,
}: {
  config:
    AdminConfig;

  item?:
    WisataAdminItem;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <TextInput
        name="nama"
        label={
          config.nameLabel
        }
        value={
          item?.nama ??
          ''
        }
        placeholder={
          config.nameLabel
        }
      />

      <TextInput
        name="kategori"
        label={
          config.categoryLabel
        }
        value={
          item?.kategori ??
          ''
        }
        placeholder="Contoh: Potensi Alam"
      />

      {config.showLocation && (
        <TextInput
          name="lokasi"
          label="Lokasi"
          value={
            item?.lokasi ??
            ''
          }
          placeholder="Contoh: Dusun Suruhan"
          required={
            false
          }
        />
      )}

      {config.showSchedule && (
        <TextInput
          name="jadwal"
          label="Jadwal / Keterangan Waktu"
          value={
            item?.jadwal ??
            ''
          }
          placeholder="Contoh: Agustus · Sabtu Pahing"
        />
      )}

      {config.showDate && (
        <TextInput
          name="tanggal"
          label="Tanggal Spesifik"
          type="date"
          value={
            item?.tanggal ??
            ''
          }
          required={
            false
          }
        />
      )}

      <TextInput
        name="urutan"
        label="Urutan"
        type="number"
        min="0"
        value={String(
          item?.urutan ??
            0
        )}
      />

      <div className="md:col-span-2">
        <TextArea
          name="deskripsi"
          label="Deskripsi"
          value={
            item?.deskripsi ??
            ''
          }
        />
      </div>

      <div className="md:col-span-2">
        <label className="block">
          <span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Foto / Poster
          </span>

          <input
            type="file"
            name="gambar"
            accept="image/jpeg,image/png,image/webp"
            className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-100 file:px-4 file:py-2 file:text-xs file:font-extrabold file:text-emerald-700"
          />

          <span className="mt-2 block text-[10px] font-medium text-slate-400">
            JPG, PNG, atau WEBP.
            Maksimal 5 MB.
            Kosongkan jika foto lama
            tidak ingin diganti.
          </span>
        </label>
      </div>

      <div className="md:col-span-2">
        <label className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <input
            type="checkbox"
            name="aktif"
            value="true"
            defaultChecked={
              item
                ? item.aktif
                : true
            }
            className="mt-1 h-4 w-4 accent-emerald-700"
          />

          <span>
            <span className="block text-sm font-extrabold text-emerald-900">
              Aktif
            </span>

            <span className="mt-1 block text-xs font-medium text-emerald-800/70">
              Data ditampilkan pada
              halaman publik.
            </span>
          </span>
        </label>
      </div>
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
  placeholder,
  type = 'text',
  required = true,
  min,
}: {
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      <input
        name={name}
        type={type}
        required={
          required
        }
        min={min}
        defaultValue={
          value
        }
        placeholder={
          placeholder
        }
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function TextArea({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
        {label}

        <span className="ml-1 text-red-500">
          *
        </span>
      </span>

      <textarea
        name={name}
        rows={5}
        required
        defaultValue={
          value
        }
        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium leading-7 text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

/* =========================================================
   PREVIEW
========================================================= */

function ImagePreview({
  url,
  alt,
}: {
  url:
    | string
    | null;

  alt:
    string;
}) {
  if (url) {
    return (
      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 lg:aspect-auto lg:h-[150px]">
        <img
          src={url}
          alt={alt}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 lg:aspect-auto lg:h-[150px]">
      <div className="text-center">
        <Camera
          size={27}
          className="mx-auto text-emerald-400"
        />

        <p className="mt-2 text-[10px] font-extrabold text-emerald-700">
          Belum ada foto
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-emerald-950">
        {value}
      </p>
    </article>
  );
}

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
        size={19}
        className="mt-0.5 shrink-0"
      />

      <p className="text-sm font-semibold">
        {text}
      </p>
    </div>
  );
}

function formatDate(
  value: string
) {
  const date =
    new Date(
      `${value}T00:00:00+07:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
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

      timeZone:
        'Asia/Jakarta',
    }
  ).format(date);
}