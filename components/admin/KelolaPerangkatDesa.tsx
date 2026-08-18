// components/admin/KelolaPerangkatDesa.tsx

'use client';

import {
  useActionState,
  useId,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';

import {
  CheckCircle2,
  CircleAlert,
  Image as ImageIcon,
  LoaderCircle,
  Pencil,
  Plus,
  Power,
  Save,
  Trash2,
  Upload,
  UserRound,
  UsersRound,
} from 'lucide-react';

import {
  hapusPerangkatAction,
  tambahPerangkatAction,
  togglePerangkatAction,
  ubahPerangkatAction,
} from '@/app/admin/pemerintahan/actions';

import {
  KELOMPOK_PERANGKAT,
  type PemerintahanActionState,
  type PerangkatDesaData,
} from '@/types/pemerintahan';

/* =========================================================
   TYPES
========================================================= */

interface Props {
  perangkat:
    PerangkatDesaData[];
}

/* =========================================================
   CONFIG
========================================================= */

const initialState:
  PemerintahanActionState = {
    success:
      false,

    message:
      '',
  };

const inputClassName =
  'h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100';

/* =========================================================
   MAIN
========================================================= */

export default function KelolaPerangkatDesa({
  perangkat,
}: Props) {
  return (
    <div className="space-y-7">
      {/* ===================================================
          TAMBAH PERANGKAT
      =================================================== */}

      <TambahPerangkatForm />

      {/* ===================================================
          DAFTAR PERANGKAT
      =================================================== */}

      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_12px_35px_rgba(6,78,59,0.07)]">
        {/* HEADER */}

        <div className="flex flex-col gap-3 border-b border-emerald-50 bg-gradient-to-r from-emerald-50/80 to-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
              Struktur Organisasi
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-900">
              Daftar Perangkat Desa
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Kelola identitas,
              jabatan, foto,
              kelompok, urutan,
              serta status perangkat
              desa.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-white px-4 py-2 text-xs font-extrabold text-emerald-700">
            {perangkat.length}{' '}
            perangkat
          </div>
        </div>

        {/* CONTENT */}

        {perangkat.length ===
        0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <UsersRound
                size={30}
              />
            </div>

            <h3 className="mt-4 font-black text-slate-800">
              Belum ada perangkat
              desa
            </h3>

            <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-slate-500">
              Tambahkan Kepala Desa
              dan perangkat lainnya
              melalui formulir di
              atas.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 p-5 sm:p-7 xl:grid-cols-2">
            {perangkat.map(
              (
                item
              ) => (
                <PerangkatCard
                  key={
                    item.id
                  }
                  perangkat={
                    item
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
   TAMBAH PERANGKAT
========================================================= */

function TambahPerangkatForm() {
  const [
    state,
    formAction,
    pending,
  ] =
    useActionState(
      tambahPerangkatAction,
      initialState
    );

  return (
    <form
      action={formAction}
      className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_12px_35px_rgba(6,78,59,0.07)]"
    >
      {/* HEADER */}

      <div className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50/80 to-white px-6 py-5 sm:px-7">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
            <Plus
              size={23}
            />
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
              Perangkat Baru
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-900">
              Tambah Perangkat
              Desa
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Masukkan informasi
              perangkat dan upload
              foto langsung dari
              perangkat.
            </p>
          </div>
        </div>
      </div>

      {/* FORM */}

      <div className="p-6 sm:p-7">
        {state.message && (
          <ActionMessage
            state={
              state
            }
          />
        )}

        <PerangkatFields />

        {/* SUBMIT */}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={
              pending
            }
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-7 text-sm font-extrabold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
          >
            {pending ? (
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
            ) : (
              <Plus
                size={18}
              />
            )}

            {pending
              ? 'Menambahkan...'
              : 'Tambah Perangkat'}
          </button>
        </div>
      </div>
    </form>
  );
}

/* =========================================================
   PERANGKAT CARD
========================================================= */

function PerangkatCard({
  perangkat,
}: {
  perangkat:
    PerangkatDesaData;
}) {
  const action =
    ubahPerangkatAction.bind(
      null,
      perangkat.id
    );

  const [
    state,
    formAction,
    pending,
  ] =
    useActionState(
      action,
      initialState
    );

  function handleDelete(
    event:
      FormEvent<HTMLFormElement>
  ) {
    const confirmed =
      window.confirm(
        `Hapus ${perangkat.nama} dari daftar perangkat desa?`
      );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-md">
      {/* =================================================
          IDENTITAS
      ================================================= */}

      <div className="flex items-start gap-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50/80 to-white p-5">
        {/* FOTO */}

        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-100 shadow-sm">
          {perangkat.foto_url ? (
            <img
              src={
                perangkat.foto_url
              }
              alt={
                perangkat.nama
              }
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-emerald-700">
              <UserRound
                size={30}
              />
            </div>
          )}
        </div>

        {/* INFO */}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] ${
                perangkat.aktif
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {perangkat.aktif
                ? 'Aktif'
                : 'Nonaktif'}
            </span>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-extrabold text-slate-500">
              Urutan{' '}
              {
                perangkat.urutan
              }
            </span>
          </div>

          <h3 className="mt-3 truncate text-lg font-black text-slate-900">
            {
              perangkat.nama
            }
          </h3>

          <p className="mt-1 text-sm font-bold text-emerald-700">
            {
              perangkat.jabatan
            }
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-500">
            {
              perangkat.kelompok
            }
          </p>
        </div>
      </div>

      {/* =================================================
          BODY
      ================================================= */}

      <div className="p-5">
        {perangkat.deskripsi && (
          <p className="line-clamp-3 text-sm font-medium leading-6 text-slate-500">
            {
              perangkat.deskripsi
            }
          </p>
        )}

        {/* ACTION */}

        <div className="mt-5 grid grid-cols-2 gap-2">
          {/* TOGGLE */}

          <form
            action={
              togglePerangkatAction
            }
          >
            <input
              type="hidden"
              name="id"
              value={
                perangkat.id
              }
            />

            <input
              type="hidden"
              name="aktif"
              value={String(
                !perangkat.aktif
              )}
            />

            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 text-xs font-extrabold text-amber-700 transition hover:bg-amber-100"
            >
              <Power
                size={15}
              />

              {perangkat.aktif
                ? 'Nonaktifkan'
                : 'Aktifkan'}
            </button>
          </form>

          {/* DELETE */}

          <form
            action={
              hapusPerangkatAction
            }
            onSubmit={
              handleDelete
            }
          >
            <input
              type="hidden"
              name="id"
              value={
                perangkat.id
              }
            />

            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-xs font-extrabold text-red-700 transition hover:bg-red-100"
            >
              <Trash2
                size={15}
              />

              Hapus
            </button>
          </form>
        </div>

        {/* =================================================
            EDIT
        ================================================= */}

        <details className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <summary className="flex cursor-pointer list-none items-center justify-center gap-2 px-4 py-3 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100">
            <Pencil
              size={15}
            />

            Edit Perangkat
          </summary>

          <form
            action={
              formAction
            }
            className="border-t border-slate-200 bg-white p-4"
          >
            {state.message && (
              <ActionMessage
                state={
                  state
                }
              />
            )}

            <PerangkatFields
              initialData={
                perangkat
              }
            />

            <button
              type="submit"
              disabled={
                pending
              }
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-800 text-xs font-extrabold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {pending ? (
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Save
                  size={16}
                />
              )}

              {pending
                ? 'Menyimpan...'
                : 'Simpan Perubahan'}
            </button>
          </form>
        </details>
      </div>
    </article>
  );
}

/* =========================================================
   PERANGKAT FIELDS
========================================================= */

function PerangkatFields({
  initialData,
}: {
  initialData?:
    PerangkatDesaData;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {/* NAMA */}

      <FormInput
        name="nama"
        label="Nama Lengkap"
        defaultValue={
          initialData?.nama ??
          ''
        }
        placeholder="Nama lengkap perangkat"
        required
      />

      {/* JABATAN */}

      <FormInput
        name="jabatan"
        label="Jabatan"
        defaultValue={
          initialData?.jabatan ??
          ''
        }
        placeholder="Contoh: Sekretaris Desa"
        required
      />

      {/* KELOMPOK */}

      <div>
        <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">
          Kelompok Jabatan
        </label>

        <select
          name="kelompok"
          required
          defaultValue={
            initialData?.kelompok ??
            ''
          }
          className={
            inputClassName
          }
        >
          <option
            value=""
            disabled
          >
            Pilih kelompok
          </option>

          {KELOMPOK_PERANGKAT.map(
            (
              kelompok
            ) => (
              <option
                key={
                  kelompok
                }
                value={
                  kelompok
                }
              >
                {
                  kelompok
                }
              </option>
            )
          )}
        </select>
      </div>

      {/* URUTAN */}

      <FormInput
        name="urutan"
        label="Nomor Urutan"
        type="number"
        defaultValue={String(
          initialData?.urutan ??
          1
        )}
        required
      />

      {/* =================================================
          UPLOAD FOTO
      ================================================= */}

      <div className="md:col-span-2">
        <FotoUploadField
          initialData={
            initialData
          }
        />
      </div>

      {/* NIP */}

      <FormInput
        name="nip"
        label="NIP"
        defaultValue={
          initialData?.nip ??
          ''
        }
        placeholder="Opsional"
      />

      {/* TELEPON */}

      <FormInput
        name="nomor_telepon"
        label="Nomor Telepon"
        defaultValue={
          initialData
            ?.nomor_telepon ??
          ''
        }
        placeholder="Opsional"
      />

      {/* DESKRIPSI */}

      <div className="md:col-span-2">
        <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">
          Deskripsi
        </label>

        <textarea
          name="deskripsi"
          rows={4}
          maxLength={
            2000
          }
          defaultValue={
            initialData?.deskripsi ??
            ''
          }
          placeholder="Deskripsi singkat perangkat desa..."
          className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
        />

        <p className="mt-2 text-[11px] font-medium text-slate-400">
          Maksimal 2.000
          karakter.
        </p>
      </div>

      {/* STATUS */}

      <div className="md:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 transition hover:bg-emerald-50">
          <input
            type="checkbox"
            name="aktif"
            value="true"
            defaultChecked={
              initialData?.aktif ??
              true
            }
            className="mt-1 h-4 w-4 accent-emerald-700"
          />

          <span>
            <span className="block text-sm font-black text-slate-800">
              Tampilkan di
              halaman publik
            </span>

            <span className="mt-1 block text-xs font-medium leading-5 text-slate-500">
              Perangkat aktif akan
              ditampilkan pada
              halaman pemerintahan
              dan bagian perangkat
              desa di beranda.
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}

/* =========================================================
   FOTO UPLOAD FIELD
========================================================= */

function FotoUploadField({
  initialData,
}: {
  initialData?:
    PerangkatDesaData;
}) {
  const inputId =
    useId();

  const existingFoto =
    initialData?.foto_url ??
    null;

  const [
    previewUrl,
    setPreviewUrl,
  ] =
    useState<
      string | null
    >(
      existingFoto
    );

  const [
    selectedName,
    setSelectedName,
  ] =
    useState('');

  const [
    hapusFoto,
    setHapusFoto,
  ] =
    useState(false);

  function handleFileChange(
    event:
      ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target
        .files?.[0];

    if (!file) {
      setSelectedName(
        ''
      );

      setPreviewUrl(
        hapusFoto
          ? null
          : existingFoto
      );

      return;
    }

    if (
      previewUrl?.startsWith(
        'blob:'
      )
    ) {
      URL.revokeObjectURL(
        previewUrl
      );
    }

    const objectUrl =
      URL.createObjectURL(
        file
      );

    setPreviewUrl(
      objectUrl
    );

    setSelectedName(
      file.name
    );

    setHapusFoto(
      false
    );
  }

  function handleHapusFoto(
    checked:
      boolean
  ) {
    setHapusFoto(
      checked
    );

    if (checked) {
      setPreviewUrl(
        null
      );
    } else {
      setPreviewUrl(
        existingFoto
      );
    }
  }

  return (
    <div>
      <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">
        Foto Perangkat
      </label>

      <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white">
        <div className="grid gap-5 p-5 sm:grid-cols-[130px_minmax(0,1fr)] sm:items-center">
          {/* PREVIEW */}

          <div className="mx-auto w-full max-w-[130px] sm:mx-0">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
              {previewUrl ? (
                <img
                  src={
                    previewUrl
                  }
                  alt="Preview foto perangkat"
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-emerald-50 text-emerald-700">
                  <ImageIcon
                    size={30}
                  />

                  <span className="text-[9px] font-extrabold uppercase tracking-[0.12em]">
                    Belum Ada
                    Foto
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* UPLOAD */}

          <div className="min-w-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-md">
              <Upload
                size={20}
              />
            </div>

            <h4 className="mt-3 text-sm font-black text-slate-800">
              Upload Foto
            </h4>

            <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
              Pilih foto perangkat
              langsung dari komputer
              atau HP.
            </p>

            <label
              htmlFor={
                inputId
              }
              className="mt-4 inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-800"
            >
              <Upload
                size={15}
              />

              {existingFoto
                ? 'Ganti Foto'
                : 'Pilih Foto'}
            </label>

            <input
              id={
                inputId
              }
              name="foto"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={
                handleFileChange
              }
              className="sr-only"
            />

            {selectedName && (
              <div className="mt-3 rounded-xl border border-emerald-100 bg-white px-3 py-2">
                <p className="truncate text-[11px] font-bold text-emerald-700">
                  {
                    selectedName
                  }
                </p>
              </div>
            )}

            <p className="mt-3 text-[10px] font-semibold leading-5 text-slate-400">
              Format JPG, PNG,
              atau WEBP. Ukuran
              maksimal 5 MB.
            </p>
          </div>
        </div>

        {/* HAPUS FOTO LAMA */}

        {existingFoto && (
          <div className="border-t border-emerald-100 bg-white px-5 py-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="hapus_foto"
                value="true"
                checked={
                  hapusFoto
                }
                onChange={(
                  event
                ) =>
                  handleHapusFoto(
                    event.target
                      .checked
                  )
                }
                className="mt-1 h-4 w-4 accent-red-600"
              />

              <span>
                <span className="block text-xs font-extrabold text-slate-700">
                  Hapus foto
                  saat ini
                </span>

                <span className="mt-1 block text-[11px] font-medium leading-5 text-slate-400">
                  Centang jika foto
                  lama ingin
                  dihapus tanpa
                  menggantinya
                  dengan foto baru.
                </span>
              </span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   FORM INPUT
========================================================= */

function FormInput({
  name,
  label,
  defaultValue,
  placeholder,
  type =
    'text',
  required =
    false,
}: {
  name:
    string;

  label:
    string;

  defaultValue:
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
      <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">
        {label}
      </label>

      <input
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
          type ===
          'number'
            ? 1
            : undefined
        }
        defaultValue={
          defaultValue
        }
        placeholder={
          placeholder
        }
        className={
          inputClassName
        }
      />
    </div>
  );
}

/* =========================================================
   ACTION MESSAGE
========================================================= */

function ActionMessage({
  state,
}: {
  state:
    PemerintahanActionState;
}) {
  return (
    <div
      className={`mb-5 flex items-start gap-3 rounded-xl border p-3 ${
        state.success
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-red-200 bg-red-50 text-red-700'
      }`}
    >
      {state.success ? (
        <CheckCircle2
          size={18}
          className="mt-0.5 shrink-0"
        />
      ) : (
        <CircleAlert
          size={18}
          className="mt-0.5 shrink-0"
        />
      )}

      <p className="text-xs font-semibold leading-5">
        {
          state.message
        }
      </p>
    </div>
  );
}