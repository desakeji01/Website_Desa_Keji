// components/admin/LayananForm.tsx

'use client';

import {
  useActionState,
} from 'react';

import Link from 'next/link';

import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  FileCheck2,
  LoaderCircle,
  Save,
  ShieldCheck,
} from 'lucide-react';

import {
  tambahLayananAction,
  ubahLayananAction,
} from '@/app/admin/layanan/actions';

import type {
  LayananActionState,
  LayananAdminData,
} from '@/types/admin-layanan';

interface LayananFormProps {
  mode:
    | 'tambah'
    | 'edit';

  layanan?:
    LayananAdminData;
}

type FormAction = (
  state:
    LayananActionState,
  formData:
    FormData
) =>
  Promise<LayananActionState>;

const initialState:
  LayananActionState = {
    success: false,
    message: '',
  };

export default function LayananForm({
  mode,
  layanan,
}: LayananFormProps) {
  const selectedAction:
    FormAction =
    mode === 'edit' &&
    layanan
      ? ubahLayananAction.bind(
          null,
          layanan.id
        )
      : tambahLayananAction;

  const [
    state,
    formAction,
    pending,
  ] =
    useActionState(
      selectedAction,
      initialState
    );

  const isEdit =
    mode === 'edit';

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
              size={19}
              className="mt-0.5 shrink-0"
            />
          ) : (
            <CircleAlert
              size={19}
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
              <FileCheck2
                size={23}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                Data Utama
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                Informasi Layanan
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Informasi ini akan ditampilkan pada halaman layanan publik.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:p-7 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <label
              htmlFor="nama"
              className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500"
            >
              Nama Layanan
            </label>

            <input
              id="nama"
              name="nama"
              type="text"
              required
              minLength={3}
              maxLength={150}
              defaultValue={
                layanan?.nama ??
                ''
              }
              placeholder="Contoh: Permohonan Surat Keterangan Usaha"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="deskripsi"
              className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500"
            >
              Deskripsi
            </label>

            <textarea
              id="deskripsi"
              name="deskripsi"
              required
              minLength={10}
              maxLength={1000}
              rows={5}
              defaultValue={
                layanan?.deskripsi ??
                ''
              }
              placeholder="Jelaskan fungsi dan tujuan layanan..."
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium leading-6 text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="urutan"
              className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500"
            >
              Nomor Urutan
            </label>

            <input
              id="urutan"
              name="urutan"
              type="number"
              required
              min={1}
              step={1}
              defaultValue={
                layanan?.urutan ??
                1
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />

            <p className="mt-2 text-xs font-medium leading-5 text-slate-400">
              Angka terkecil akan ditampilkan lebih dahulu.
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
              Status Publikasi
            </p>

            <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition hover:border-emerald-300 hover:bg-emerald-50">
              <input
                type="checkbox"
                name="aktif"
                value="true"
                defaultChecked={
                  layanan?.aktif ??
                  true
                }
                className="h-4 w-4 rounded border-slate-300 accent-emerald-700"
              />

              <span>
                <span className="block text-sm font-extrabold text-slate-800">
                  Tampilkan layanan
                </span>

                <span className="mt-0.5 block text-xs font-medium text-slate-500">
                  Layanan aktif muncul di website publik.
                </span>
              </span>
            </label>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_12px_35px_rgba(6,78,59,0.07)]">
        <div className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50/80 to-white px-6 py-5 sm:px-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <ShieldCheck
                size={23}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                Dokumen Pelayanan
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                Persyaratan Layanan
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Tuliskan satu persyaratan pada setiap baris.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-7">
          <label
            htmlFor="persyaratan"
            className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500"
          >
            Daftar Persyaratan
          </label>

          <textarea
            id="persyaratan"
            name="persyaratan"
            rows={12}
            defaultValue={
              layanan?.persyaratan.join(
                '\n'
              ) ?? ''
            }
            placeholder={`Fotokopi Kartu Keluarga\nFotokopi KTP\nSurat pengantar RT/RW\nDokumen pendukung lainnya`}
            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium leading-7 text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
          />

          <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs font-semibold leading-6 text-blue-900">
              Setiap baris akan disimpan sebagai satu item persyaratan. Urutan baris menentukan urutan tampil di halaman publik.
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/admin/layanan"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-extrabold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
        >
          <ArrowLeft
            size={17}
          />

          Kembali
        </Link>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-7 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-800 disabled:cursor-wait disabled:bg-slate-400"
        >
          {pending ? (
            <LoaderCircle
              size={18}
              className="animate-spin"
            />
          ) : (
            <Save
              size={18}
            />
          )}

          {pending
            ? 'Menyimpan...'
            : isEdit
              ? 'Simpan Perubahan'
              : 'Tambahkan Layanan'}
        </button>
      </div>
    </form>
  );
}