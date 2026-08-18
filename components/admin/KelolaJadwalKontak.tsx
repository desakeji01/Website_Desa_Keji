// components/admin/KelolaJadwalKontak.tsx

'use client';

import {
  useActionState,
  type FormEvent,
} from 'react';

import {
  LoaderCircle,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';

import {
  hapusJadwalAction,
  tambahJadwalAction,
  ubahJadwalAction,
} from '@/app/admin/kontak/actions';

import type {
  JadwalPelayananDesa,
  KontakActionState,
} from '@/types/kontak-desa';

const initialState:
  KontakActionState = {
    success: false,
    message: '',
  };

const inputClassName =
  'h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100';

export default function KelolaJadwalKontak({
  jadwal,
}: {
  jadwal:
    JadwalPelayananDesa[];
}) {
  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    tambahJadwalAction,
    initialState
  );

  return (
    <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-slate-900">
        Jadwal Pelayanan
      </h2>

      <form
        action={formAction}
        className="mt-5"
      >
        {state.message && (
          <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
            {state.message}
          </p>
        )}

        <JadwalFields />

        <button
          disabled={pending}
          className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 text-xs font-extrabold text-white"
        >
          <Plus size={16} />
          Tambah Jadwal
        </button>
      </form>

      <div className="mt-7 space-y-4">
        {jadwal.map(
          (item) => (
            <JadwalItem
              key={item.id}
              item={item}
            />
          )
        )}
      </div>
    </section>
  );
}

function JadwalItem({
  item,
}: {
  item:
    JadwalPelayananDesa;
}) {
  const updateAction =
    ubahJadwalAction.bind(
      null,
      item.id
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
        `Hapus jadwal ${item.hari}?`
      )
    ) {
      event.preventDefault();
    }
  }

  return (
    <details className="rounded-2xl border border-slate-200 bg-slate-50">
      <summary className="cursor-pointer p-4 font-bold text-slate-800">
        {item.hari} — {item.waktu}
      </summary>

      <div className="border-t border-slate-200 p-4">
        <form action={formAction}>
          {state.message && (
            <p className="mb-3 text-xs font-semibold text-red-700">
              {state.message}
            </p>
          )}

          <JadwalFields
            initialData={item}
          />

          <button
            disabled={pending}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-800 px-4 text-xs font-extrabold text-white"
          >
            <Save size={15} />
            Simpan
          </button>
        </form>

        <form
          action={hapusJadwalAction}
          onSubmit={confirmDelete}
          className="mt-3"
        >
          <input
            type="hidden"
            name="id"
            value={item.id}
          />

          <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-red-100 px-4 text-xs font-extrabold text-red-700">
            <Trash2 size={15} />
            Hapus
          </button>
        </form>
      </div>
    </details>
  );
}

function JadwalFields({
  initialData,
}: {
  initialData?:
    JadwalPelayananDesa;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <input
        name="hari"
        required
        placeholder="Hari"
        defaultValue={
          initialData?.hari ??
          ''
        }
        className={inputClassName}
      />

      <input
        name="waktu"
        required
        placeholder="Waktu"
        defaultValue={
          initialData?.waktu ??
          ''
        }
        className={inputClassName}
      />

      <input
        name="urutan"
        type="number"
        min={1}
        required
        defaultValue={
          initialData?.urutan ??
          1
        }
        className={inputClassName}
      />

      <Checkbox
        name="is_libur"
        label="Jadwal Libur"
        defaultChecked={
          initialData?.is_libur ??
          false
        }
      />

      <Checkbox
        name="aktif"
        label="Tampilkan"
        defaultChecked={
          initialData?.aktif ??
          true
        }
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
    <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={
          defaultChecked
        }
      />

      <span className="text-xs font-bold">
        {label}
      </span>
    </label>
  );
}