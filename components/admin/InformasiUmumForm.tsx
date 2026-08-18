// components/admin/InformasiUmumForm.tsx

'use client';

import {
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  CircleAlert,
  FilePlus2,
  Info,
  LoaderCircle,
  Save,
} from 'lucide-react';

import {
  createInformasiUmumAction,
} from '@/app/admin/informasi-umum/actions';

import {
  KATEGORI_INFORMASI_UMUM,
} from '@/types/informasi-umum';

import type {
  InformasiUmumActionState,
} from '@/types/informasi-umum';

const initialState:
  InformasiUmumActionState = {
    error: null,
    success: null,
  };

export default function InformasiUmumForm() {
  const formRef =
    useRef<HTMLFormElement>(
      null
    );

  const [
    selectedFilename,
    setSelectedFilename,
  ] = useState('');

  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    createInformasiUmumAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setSelectedFilename('');
    }
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-6 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm md:p-8"
    >
      <div className="flex items-start gap-3 border-b border-slate-100 pb-5">
        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
          <Info size={24} />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900">
            Tambah Informasi Umum
          </h2>

          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            Unggah informasi publik
            Pemerintah Desa Keji dalam
            bentuk dokumen PDF.
          </p>
        </div>
      </div>

      {state.error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          <CircleAlert
            size={18}
            className="mt-0.5 shrink-0"
          />

          <p>{state.error}</p>
        </div>
      )}

      {state.success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          {state.success}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label
            htmlFor="judul"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Judul Informasi
          </label>

          <input
            id="judul"
            name="judul"
            type="text"
            required
            minLength={5}
            maxLength={300}
            disabled={isPending}
            placeholder="Contoh: Laporan Penyelenggaraan Pemerintahan Desa Tahun 2026"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor="kategori"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Kategori Informasi
          </label>

          <select
            id="kategori"
            name="kategori"
            required
            defaultValue=""
            disabled={isPending}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
          >
            <option
              value=""
              disabled
            >
              Pilih kategori informasi
            </option>

            {KATEGORI_INFORMASI_UMUM.map(
              (kategori) => (
                <option
                  key={kategori}
                  value={kategori}
                >
                  {kategori}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label
            htmlFor="tahun"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Tahun
          </label>

          <input
            id="tahun"
            name="tahun"
            type="number"
            min={2000}
            max={2100}
            required
            defaultValue={
              new Date().getFullYear()
            }
            disabled={isPending}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor="tanggal_dokumen"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Tanggal Dokumen
          </label>

          <input
            id="tanggal_dokumen"
            name="tanggal_dokumen"
            type="date"
            disabled={isPending}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="deskripsi"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Deskripsi
          </label>

          <textarea
            id="deskripsi"
            name="deskripsi"
            rows={4}
            maxLength={5000}
            disabled={isPending}
            placeholder="Tuliskan ringkasan isi informasi publik."
            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium leading-relaxed text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="file_pdf"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Dokumen PDF
          </label>

          <label className="flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 p-6 text-center transition hover:border-emerald-400 hover:bg-emerald-50">
            <FilePlus2
              size={34}
              className="text-emerald-700"
            />

            <span className="mt-3 text-sm font-bold text-slate-700">
              Pilih dokumen PDF
            </span>

            <span className="mt-1 text-xs text-slate-400">
              Maksimal 10 MB
            </span>

            {selectedFilename && (
              <span className="mt-3 max-w-full truncate rounded-full bg-white px-4 py-2 text-xs font-bold text-emerald-700 shadow-sm">
                {selectedFilename}
              </span>
            )}

            <input
              id="file_pdf"
              name="file_pdf"
              type="file"
              accept="application/pdf,.pdf"
              required
              disabled={isPending}
              className="sr-only"
              onChange={(event) => {
                setSelectedFilename(
                  event.currentTarget
                    .files?.[0]
                    ?.name ?? ''
                );
              }}
            />
          </label>
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 md:col-span-2">
          <input
            name="aktif"
            type="checkbox"
            defaultChecked
            disabled={isPending}
            className="mt-0.5 h-4 w-4 rounded border-emerald-300 text-emerald-700"
          />

          <span>
            <span className="block text-sm font-bold text-emerald-900">
              Publikasikan informasi
            </span>

            <span className="mt-1 block text-xs leading-relaxed text-emerald-700">
              Informasi langsung tampil
              pada halaman publik setelah
              berhasil disimpan.
            </span>
          </span>
        </label>
      </div>

      <div className="flex justify-end border-t border-slate-100 pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400 md:w-auto"
        >
          {isPending ? (
            <>
              <LoaderCircle
                size={18}
                className="animate-spin"
              />

              Mengunggah Informasi...
            </>
          ) : (
            <>
              <Save size={18} />
              Simpan Informasi
            </>
          )}
        </button>
      </div>
    </form>
  );
}