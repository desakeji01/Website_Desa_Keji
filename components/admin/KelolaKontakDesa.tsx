// components/admin/KelolaKontakDesa.tsx

'use client';

import {
  useActionState,
  type FormEvent,
} from 'react';

import {
  LoaderCircle,
  Pencil,
  Plus,
  Power,
  Save,
  Trash2,
} from 'lucide-react';

import {
  hapusKontakAction,
  tambahKontakAction,
  toggleKontakAction,
  ubahKontakAction,
} from '@/app/admin/kontak/actions';

import {
  KONTAK_ICON_OPTIONS,
} from '@/lib/kontak-icons';

import type {
  KontakActionState,
  KontakDesaItem,
} from '@/types/kontak-desa';

interface Props {
  daftarKontak:
    KontakDesaItem[];
}

const initialState:
  KontakActionState = {
    success: false,
    message: '',
  };

const inputClassName =
  'h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100';

export default function KelolaKontakDesa({
  daftarKontak,
}: Props) {
  return (
    <section className="space-y-6">
      <TambahKontakForm />

      <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
        <div className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50 to-white p-6">
          <h2 className="text-xl font-black text-slate-900">
            Daftar Kontak Pelayanan
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-500">
            {daftarKontak.length} kontak tersimpan.
          </p>
        </div>

        <div className="grid gap-5 p-6 xl:grid-cols-2">
          {daftarKontak.map(
            (kontak) => (
              <KontakCard
                key={kontak.id}
                kontak={kontak}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

function TambahKontakForm() {
  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    tambahKontakAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm"
    >
      <div className="mb-5 flex items-center gap-3">
        <Plus
          className="text-emerald-700"
        />

        <h2 className="text-xl font-black text-slate-900">
          Tambah Kontak
        </h2>
      </div>

      {state.message && (
        <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
          {state.message}
        </p>
      )}

      <KontakFields />

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 text-sm font-extrabold text-white disabled:bg-slate-400 sm:w-auto sm:px-6"
      >
        {pending ? (
          <LoaderCircle
            size={17}
            className="animate-spin"
          />
        ) : (
          <Plus size={17} />
        )}

        Tambah Kontak
      </button>
    </form>
  );
}

function KontakCard({
  kontak,
}: {
  kontak:
    KontakDesaItem;
}) {
  const updateAction =
    ubahKontakAction.bind(
      null,
      kontak.id
    );

  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    updateAction,
    initialState
  );

  function confirmDelete(
    event:
      FormEvent<HTMLFormElement>
  ) {
    if (
      !window.confirm(
        `Hapus kontak ${kontak.nama}?`
      )
    ) {
      event.preventDefault();
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700">
              Urutan {kontak.urutan}
            </span>

            {kontak.featured && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-extrabold text-amber-700">
                Utama
              </span>
            )}
          </div>

          <h3 className="mt-3 font-black text-slate-900">
            {kontak.nama}
          </h3>

          <p className="mt-1 text-sm font-bold text-emerald-700">
            {kontak.jabatan}
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-500">
            {kontak.nomor}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${
            kontak.aktif
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-200 text-slate-500'
          }`}
        >
          {kontak.aktif
            ? 'Aktif'
            : 'Nonaktif'}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <form
          action={toggleKontakAction}
        >
          <input
            type="hidden"
            name="id"
            value={kontak.id}
          />

          <input
            type="hidden"
            name="aktif"
            value={String(
              !kontak.aktif
            )}
          />

          <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-amber-100 text-xs font-extrabold text-amber-700">
            <Power size={15} />

            {kontak.aktif
              ? 'Nonaktifkan'
              : 'Aktifkan'}
          </button>
        </form>

        <form
          action={hapusKontakAction}
          onSubmit={confirmDelete}
        >
          <input
            type="hidden"
            name="id"
            value={kontak.id}
          />

          <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-red-100 text-xs font-extrabold text-red-700">
            <Trash2 size={15} />
            Hapus
          </button>
        </form>
      </div>

      <details className="mt-4 rounded-xl border border-slate-200 bg-white">
        <summary className="flex cursor-pointer items-center justify-center gap-2 p-3 text-xs font-extrabold text-slate-700">
          <Pencil size={15} />
          Edit Kontak
        </summary>

        <form
          action={formAction}
          className="border-t border-slate-200 p-4"
        >
          {state.message && (
            <p className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">
              {state.message}
            </p>
          )}

          <KontakFields
            initialData={kontak}
          />

          <button
            disabled={pending}
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-800 text-xs font-extrabold text-white disabled:bg-slate-400"
          >
            {pending ? (
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
            ) : (
              <Save size={16} />
            )}

            Simpan Perubahan
          </button>
        </form>
      </details>
    </article>
  );
}

function KontakFields({
  initialData,
}: {
  initialData?:
    KontakDesaItem;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormInput
        name="nama"
        label="Nama Kontak"
        defaultValue={
          initialData?.nama ??
          ''
        }
        required
      />

      <FormInput
        name="jabatan"
        label="Jabatan"
        defaultValue={
          initialData?.jabatan ??
          ''
        }
        required
      />

      <FormInput
        name="nomor"
        label="Nomor Telepon"
        defaultValue={
          initialData?.nomor ??
          ''
        }
        required
      />

      <div>
        <label className="mb-2 block text-xs font-extrabold uppercase text-slate-500">
          Ikon
        </label>

        <select
          name="icon_key"
          required
          defaultValue={
            initialData?.icon_key ??
            'PHONE'
          }
          className={inputClassName}
        >
          {KONTAK_ICON_OPTIONS.map(
            (option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            )
          )}
        </select>
      </div>

      <FormInput
        name="urutan"
        label="Urutan"
        type="number"
        defaultValue={String(
          initialData?.urutan ??
          1
        )}
        required
      />

      <div className="md:col-span-2">
        <label className="mb-2 block text-xs font-extrabold uppercase text-slate-500">
          Deskripsi
        </label>

        <textarea
          name="deskripsi"
          rows={4}
          required
          defaultValue={
            initialData?.deskripsi ??
            ''
          }
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
        />
      </div>

      <Checkbox
        name="featured"
        label="Kontak Utama"
        defaultChecked={
          initialData?.featured ??
          false
        }
      />

      <Checkbox
        name="aktif"
        label="Tampilkan di Publik"
        defaultChecked={
          initialData?.aktif ??
          true
        }
      />
    </div>
  );
}

function FormInput({
  name,
  label,
  defaultValue,
  type = 'text',
  required = false,
}: {
  name: string;
  label: string;
  defaultValue: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-extrabold uppercase text-slate-500">
        {label}
      </label>

      <input
        name={name}
        type={type}
        min={
          type === 'number'
            ? 1
            : undefined
        }
        required={required}
        defaultValue={defaultValue}
        className={inputClassName}
      />
    </div>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={
          defaultChecked
        }
        className="h-4 w-4 accent-emerald-700"
      />

      <span className="text-sm font-bold text-slate-700">
        {label}
      </span>
    </label>
  );
}