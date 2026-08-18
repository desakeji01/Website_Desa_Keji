// components/admin/desa-cantik/DesaCantikDataEditor.tsx

'use client';

import {
  useActionState,
} from 'react';

import {
  AlertCircle,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  Info,
  Save,
} from 'lucide-react';

import {
  simpanDataStatistikDesaCantikAction,
} from '@/app/admin/desa-cantik/actions';

import type {
  KategoriDesaCantik,
} from '@/types/desa-cantik';

interface Props {
  kategori:
    KategoriDesaCantik;

  namaKategori:
    string;

  tahun:
    number;

  data:
    unknown[];
}

const INITIAL_STATE = {
  error:
    null,

  success:
    null,

  version:
    0,
};

/* =========================================================
   COMPONENT
========================================================= */

export default function DesaCantikDataEditor({
  kategori,
  namaKategori,
  tahun,
  data,
}: Props) {
  const [
    state,
    formAction,
    pending,
  ] =
    useActionState(
      simpanDataStatistikDesaCantikAction,
      INITIAL_STATE
    );

  const json =
    JSON.stringify(
      data,
      null,
      2
    );

  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
      {/* HEADER */}

      <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-white px-6 py-5 md:px-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
              <Database
                size={23}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                Database Statistik
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                Data {namaKategori}{' '}
                {tahun}
              </h2>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500">
                Data di bawah
                tersimpan sebagai JSON
                pada Supabase dan
                menjadi sumber angka
                untuk tabel, grafik,
                ringkasan, serta file
                Excel pada halaman
                publik.
              </p>
            </div>
          </div>

          {data.length >
            0 && (
            <a
              href={`/api/desa-cantik/${kategori}/${tahun}/excel`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-100"
            >
              <FileSpreadsheet
                size={17}
              />

              Cek Excel
            </a>
          )}
        </div>
      </div>

      {/* MESSAGE */}

      {state.success && (
        <div className="mx-6 mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 md:mx-7">
          <CheckCircle2
            size={19}
            className="mt-0.5 shrink-0"
          />

          <p className="text-sm font-semibold leading-6">
            {
              state.success
            }
          </p>
        </div>
      )}

      {state.error && (
        <div className="mx-6 mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 md:mx-7">
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <p className="text-sm font-semibold leading-6">
            {
              state.error
            }
          </p>
        </div>
      )}

      {/* FORM */}

      <form
        action={
          formAction
        }
        className="p-6 md:p-7"
      >
        <input
          type="hidden"
          name="kategori"
          value={
            kategori
          }
        />

        <input
          type="hidden"
          name="tahun"
          value={
            tahun
          }
        />

        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <Info
            size={18}
            className="mt-0.5 shrink-0 text-amber-700"
          />

          <div>
            <p className="text-xs font-extrabold text-amber-900">
              Perhatikan struktur
              data
            </p>

            <p className="mt-1 text-xs font-medium leading-5 text-amber-800">
              Angka boleh diubah,
              tetapi jangan menghapus
              nama properti seperti
              id, kolom, baris,
              nilai, jumlah, rw01,
              rw02, rw03, atau total.
              Sistem akan menolak
              struktur yang tidak
              sesuai.
            </p>
          </div>
        </div>

        <label
          htmlFor="data_json"
          className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
        >
          JSON Data Statistik
        </label>

        <textarea
          id="data_json"
          name="data_json"
          required
          defaultValue={
            json
          }
          spellCheck={
            false
          }
          className="min-h-[520px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-950 p-5 font-mono text-xs font-medium leading-6 text-emerald-100 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={
              pending
            }
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
          >
            <Save
              size={17}
            />

            {pending
              ? 'Menyimpan...'
              : 'Simpan Data Statistik'}
          </button>
        </div>
      </form>
    </section>
  );
}