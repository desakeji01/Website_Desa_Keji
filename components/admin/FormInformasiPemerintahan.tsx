// components/admin/FormInformasiPemerintahan.tsx

'use client';

import {
  useActionState,
} from 'react';

import {
  Building2,
  CheckCircle2,
  CircleAlert,
  FileText,
  LoaderCircle,
  Save,
} from 'lucide-react';

import {
  simpanInformasiPemerintahanAction,
} from '@/app/admin/pemerintahan/actions';

import type {
  PemerintahanActionState,
  PemerintahanDesaData,
} from '@/types/pemerintahan';

interface Props {
  initialData:
    PemerintahanDesaData;
}

const initialState:
  PemerintahanActionState = {
    success: false,
    message: '',
  };

const inputClassName =
  'h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100';

export default function FormInformasiPemerintahan({
  initialData,
}: Props) {
  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    simpanInformasiPemerintahanAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="space-y-6"
    >
      {state.message && (
        <div
          className={`flex items-start gap-3 rounded-2xl border p-4 ${
            state.success
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {state.success ? (
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0"
            />
          ) : (
            <CircleAlert
              size={20}
              className="mt-0.5 shrink-0"
            />
          )}

          <p className="text-sm font-semibold leading-6">
            {state.message}
          </p>
        </div>
      )}

      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_12px_35px_rgba(6,78,59,0.07)]">
        <div className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50/80 to-white px-6 py-5 sm:px-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
              <Building2 size={23} />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                Informasi Publik
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                Informasi Pemerintahan
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Kelola judul, metadata, deskripsi SOTK,
                dan catatan halaman pemerintahan.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:p-7 md:grid-cols-2">
          <div className="md:col-span-2">
            <TextArea
              name="sekilas_info"
              label="Sekilas Informasi"
              defaultValue={
                initialData.sekilas_info
              }
              rows={3}
              maxLength={500}
              required
            />
          </div>

          <TextInput
            name="judul_halaman"
            label="Judul Halaman"
            defaultValue={
              initialData.judul_halaman
            }
            required
          />

          <TextInput
            name="judul_sotk"
            label="Judul SOTK"
            defaultValue={
              initialData.judul_sotk
            }
            required
          />

          <div className="md:col-span-2">
            <TextInput
              name="lokasi_pemerintahan"
              label="Lokasi Pemerintahan"
              defaultValue={
                initialData
                  .lokasi_pemerintahan
              }
              required
            />
          </div>

          <TextInput
            name="tanggal_publikasi"
            label="Tanggal Publikasi"
            type="date"
            defaultValue={
              initialData
                .tanggal_publikasi
            }
            required
          />

          <TextInput
            name="penulis"
            label="Penulis"
            defaultValue={
              initialData.penulis
            }
            required
          />

          <div className="md:col-span-2">
            <TextArea
              name="deskripsi_kepala_desa"
              label="Deskripsi Tugas Kepala Desa"
              defaultValue={
                initialData
                  .deskripsi_kepala_desa
              }
              rows={5}
              maxLength={2000}
              required
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              name="deskripsi_perangkat"
              label="Deskripsi Susunan Perangkat"
              defaultValue={
                initialData
                  .deskripsi_perangkat
              }
              rows={4}
              maxLength={2000}
              required
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              name="catatan"
              label="Catatan"
              defaultValue={
                initialData.catatan
              }
              rows={4}
              maxLength={2000}
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-7 text-sm font-extrabold text-white shadow-lg transition hover:bg-emerald-800 disabled:cursor-wait disabled:bg-slate-400 sm:w-auto"
        >
          {pending ? (
            <LoaderCircle
              size={18}
              className="animate-spin"
            />
          ) : (
            <Save size={18} />
          )}

          {pending
            ? 'Menyimpan...'
            : 'Simpan Informasi'}
        </button>
      </div>
    </form>
  );
}

function TextInput({
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
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className={inputClassName}
      />
    </div>
  );
}

function TextArea({
  name,
  label,
  defaultValue,
  rows,
  maxLength,
  required = false,
}: {
  name: string;
  label: string;
  defaultValue: string;
  rows: number;
  maxLength?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        maxLength={maxLength}
        defaultValue={defaultValue}
        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-7 text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}