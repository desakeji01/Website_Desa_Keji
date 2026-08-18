// components/admin/FormPetaDesa.tsx

'use client';

import {
  useActionState,
} from 'react';

import {
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  LoaderCircle,
  MapPinned,
  Save,
} from 'lucide-react';

import {
  simpanPetaDesaAction,
} from '@/app/admin/peta/actions';

import type {
  PetaActionState,
  PetaDesaData,
} from '@/types/peta';

interface FormPetaDesaProps {
  initialData:
    PetaDesaData;
}

const initialState:
  PetaActionState = {
    success: false,
    message: '',
  };

const inputClassName =
  'h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100';

export default function FormPetaDesa({
  initialData,
}: FormPetaDesaProps) {
  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    simpanPetaDesaAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="space-y-7"
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
              <MapPinned
                size={23}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                Informasi Wilayah
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                Pengaturan Peta Desa
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Kelola judul, deskripsi, tautan Google
                Maps, URL embed, dan ukuran peta.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:p-7 md:grid-cols-2">
          <TextInput
            name="label_seksi"
            label="Label Bagian"
            defaultValue={
              initialData.label_seksi
            }
            maxLength={100}
            required
          />

          <TextInput
            name="judul_halaman"
            label="Judul Halaman"
            defaultValue={
              initialData.judul_halaman
            }
            maxLength={200}
            required
          />

          <div className="md:col-span-2">
            <TextArea
              name="deskripsi"
              label="Deskripsi Halaman"
              defaultValue={
                initialData.deskripsi
              }
              rows={4}
              maxLength={1000}
              required
            />
          </div>

          <TextInput
            name="tombol_label"
            label="Tulisan Tombol"
            defaultValue={
              initialData.tombol_label
            }
            maxLength={100}
            required
          />

          <TextInput
            name="tinggi_peta"
            label="Tinggi Peta"
            type="number"
            defaultValue={String(
              initialData.tinggi_peta
            )}
            min={300}
            max={900}
            required
          />

          <div className="md:col-span-2">
            <TextInput
              name="maps_link_url"
              label="URL Aplikasi Google Maps"
              defaultValue={
                initialData.maps_link_url
              }
              icon
              required
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              name="maps_embed_url"
              label="URL Embed Google Maps"
              defaultValue={
                initialData.maps_embed_url
              }
              rows={7}
              required
            />
          </div>

          <div className="md:col-span-2">
            <TextInput
              name="iframe_title"
              label="Judul Iframe"
              defaultValue={
                initialData.iframe_title
              }
              maxLength={200}
              required
            />
          </div>
        </div>
      </section>

      <div className="sticky bottom-5 z-20 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-7 text-sm font-extrabold text-white shadow-xl shadow-emerald-950/20 transition hover:bg-emerald-800 disabled:cursor-wait disabled:bg-slate-400 sm:w-auto"
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
            : 'Simpan Peta Desa'}
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
  maxLength,
  min,
  max,
  icon = false,
}: {
  name: string;
  label: string;
  defaultValue: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  icon?: boolean;
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

      <div className="relative">
        {icon && (
          <ExternalLink
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700"
          />
        )}

        <input
          id={name}
          name={name}
          type={type}
          required={required}
          maxLength={maxLength}
          min={min}
          max={max}
          defaultValue={defaultValue}
          className={`${inputClassName} ${
            icon ? 'pl-11' : ''
          }`}
        />
      </div>
    </div>
  );
}

function TextArea({
  name,
  label,
  defaultValue,
  rows,
  required = false,
  maxLength,
}: {
  name: string;
  label: string;
  defaultValue: string;
  rows: number;
  required?: boolean;
  maxLength?: number;
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