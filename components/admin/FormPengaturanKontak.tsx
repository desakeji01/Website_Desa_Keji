// components/admin/FormPengaturanKontak.tsx

'use client';

import {
  useActionState,
} from 'react';

import {
  CheckCircle2,
  CircleAlert,
  ContactRound,
  LoaderCircle,
  Save,
} from 'lucide-react';

import {
  simpanPengaturanKontakAction,
} from '@/app/admin/kontak/actions';

import type {
  KontakActionState,
  KontakDesaSettings,
} from '@/types/kontak-desa';

interface Props {
  initialData:
    KontakDesaSettings;
}

const initialState:
  KontakActionState = {
    success: false,
    message: '',
  };

const inputClassName =
  'h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100';

export default function FormPengaturanKontak({
  initialData,
}: Props) {
  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    simpanPengaturanKontakAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="space-y-6"
    >
      {state.message && (
        <ActionMessage
          state={state}
        />
      )}

      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
        <div className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50 to-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white">
              <ContactRound
                size={23}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                Halaman Publik
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                Pengaturan Kontak Desa
              </h2>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <TextInput
            name="label_header"
            label="Label Header"
            defaultValue={
              initialData.label_header
            }
            required
          />

          <TextInput
            name="judul_halaman"
            label="Judul Halaman"
            defaultValue={
              initialData.judul_halaman
            }
            required
          />

          <div className="md:col-span-2">
            <TextArea
              name="deskripsi_halaman"
              label="Deskripsi Halaman"
              defaultValue={
                initialData.deskripsi_halaman
              }
              rows={4}
              required
            />
          </div>

          <div className="md:col-span-2">
            <TextInput
              name="judul_hero"
              label="Judul Hero"
              defaultValue={
                initialData.judul_hero
              }
              required
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              name="deskripsi_hero"
              label="Deskripsi Hero"
              defaultValue={
                initialData.deskripsi_hero
              }
              rows={4}
              required
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              name="alamat_kantor"
              label="Alamat Kantor"
              defaultValue={
                initialData.alamat_kantor
              }
              rows={3}
              required
            />
          </div>

          <TextInput
            name="estimasi_pelayanan"
            label="Estimasi Pelayanan"
            defaultValue={
              initialData.estimasi_pelayanan
            }
            required
          />

          <TextInput
            name="label_biaya"
            label="Label Biaya"
            defaultValue={
              initialData.label_biaya
            }
            required
          />

          <TextInput
            name="judul_daftar_kontak"
            label="Judul Daftar Kontak"
            defaultValue={
              initialData.judul_daftar_kontak
            }
            required
          />

          <TextInput
            name="judul_jadwal"
            label="Judul Jadwal"
            defaultValue={
              initialData.judul_jadwal
            }
            required
          />

          <div className="md:col-span-2">
            <TextArea
              name="deskripsi_daftar_kontak"
              label="Deskripsi Daftar Kontak"
              defaultValue={
                initialData.deskripsi_daftar_kontak
              }
              rows={3}
              required
            />
          </div>

          <TextInput
            name="judul_poster"
            label="Judul Poster"
            defaultValue={
              initialData.judul_poster
            }
            required
          />

          <TextInput
            name="poster_alt"
            label="Alt Poster"
            defaultValue={
              initialData.poster_alt
            }
            required
          />

          <div className="md:col-span-2">
            <TextArea
              name="deskripsi_poster"
              label="Deskripsi Poster"
              defaultValue={
                initialData.deskripsi_poster
              }
              rows={3}
              required
            />
          </div>

          <div className="md:col-span-2">
            <TextInput
              name="poster_url"
              label="Path Poster"
              defaultValue={
                initialData.poster_url
              }
              required
            />
          </div>

          <TextInput
            name="judul_etika"
            label="Judul Etika"
            defaultValue={
              initialData.judul_etika
            }
            required
          />

          <TextInput
            name="judul_darurat"
            label="Judul Darurat"
            defaultValue={
              initialData.judul_darurat
            }
            required
          />

          <div className="md:col-span-2">
            <TextArea
              name="deskripsi_etika"
              label="Deskripsi Etika"
              defaultValue={
                initialData.deskripsi_etika
              }
              rows={3}
              required
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              name="deskripsi_darurat"
              label="Deskripsi Darurat"
              defaultValue={
                initialData.deskripsi_darurat
              }
              rows={3}
              required
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-7 text-sm font-extrabold text-white disabled:bg-slate-400 sm:w-auto"
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
            : 'Simpan Pengaturan'}
        </button>
      </div>
    </form>
  );
}

function TextInput({
  name,
  label,
  defaultValue,
  required = false,
}: {
  name: string;
  label: string;
  defaultValue: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
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
  required = false,
}: {
  name: string;
  label: string;
  defaultValue: string;
  rows: number;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
      >
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-7 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}

function ActionMessage({
  state,
}: {
  state:
    KontakActionState;
}) {
  return (
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
        />
      ) : (
        <CircleAlert
          size={20}
        />
      )}

      <p className="text-sm font-semibold">
        {state.message}
      </p>
    </div>
  );
}