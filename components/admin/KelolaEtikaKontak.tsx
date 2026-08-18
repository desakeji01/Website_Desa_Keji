// components/admin/KelolaEtikaKontak.tsx

'use client';

import {
  useActionState,
  type FormEvent,
} from 'react';

import {
  Plus,
  Save,
  Trash2,
} from 'lucide-react';

import {
  hapusEtikaAction,
  tambahEtikaAction,
  ubahEtikaAction,
} from '@/app/admin/kontak/actions';

import type {
  EtikaPelayananDesa,
  KontakActionState,
} from '@/types/kontak-desa';

const initialState:
  KontakActionState = {
    success: false,
    message: '',
  };

export default function KelolaEtikaKontak({
  daftarEtika,
}: {
  daftarEtika:
    EtikaPelayananDesa[];
}) {
  const [
    state,
    formAction,
  ] = useActionState(
    tambahEtikaAction,
    initialState
  );

  return (
    <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-slate-900">
        Etika Pelayanan
      </h2>

      <form
        action={formAction}
        className="mt-5"
      >
        {state.message && (
          <p className="mb-3 text-sm font-semibold text-red-700">
            {state.message}
          </p>
        )}

        <EtikaFields />

        <button className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 text-xs font-extrabold text-white">
          <Plus size={16} />
          Tambah Etika
        </button>
      </form>

      <div className="mt-7 space-y-4">
        {daftarEtika.map(
          (item) => (
            <EtikaItem
              key={item.id}
              item={item}
            />
          )
        )}
      </div>
    </section>
  );
}

function EtikaItem({
  item,
}: {
  item:
    EtikaPelayananDesa;
}) {
  const updateAction =
    ubahEtikaAction.bind(
      null,
      item.id
    );

  const [
    state,
    formAction,
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
        'Hapus etika pelayanan ini?'
      )
    ) {
      event.preventDefault();
    }
  }

  return (
    <details className="rounded-2xl border border-slate-200 bg-slate-50">
      <summary className="cursor-pointer p-4 text-sm font-bold text-slate-800">
        {item.urutan}. {item.teks}
      </summary>

      <div className="border-t border-slate-200 p-4">
        <form action={formAction}>
          {state.message && (
            <p className="mb-3 text-xs font-semibold text-red-700">
              {state.message}
            </p>
          )}

          <EtikaFields
            initialData={item}
          />

          <button className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-800 px-4 text-xs font-extrabold text-white">
            <Save size={15} />
            Simpan
          </button>
        </form>

        <form
          action={hapusEtikaAction}
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

function EtikaFields({
  initialData,
}: {
  initialData?:
    EtikaPelayananDesa;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_120px]">
      <textarea
        name="teks"
        rows={3}
        required
        defaultValue={
          initialData?.teks ??
          ''
        }
        placeholder="Isi etika pelayanan"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
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
        className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold"
      />

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="aktif"
          value="true"
          defaultChecked={
            initialData?.aktif ??
            true
          }
        />

        <span className="text-xs font-bold">
          Tampilkan
        </span>
      </label>
    </div>
  );
}