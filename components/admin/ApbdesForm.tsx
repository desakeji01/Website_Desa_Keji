// components/admin/ApbdesForm.tsx

'use client';

import {
  useActionState,
  useState,
} from 'react';

import {
  CircleAlert,
  FileText,
  ImagePlus,
  Landmark,
  LoaderCircle,
  Save,
} from 'lucide-react';

import {
  updateApbdesAction,
} from '@/app/admin/apbdes/actions';

import type {
  ApbdesActionState,
  ApbdesRealisasi,
} from '@/types/apbdes';

interface ApbdesFormProps {
  data: ApbdesRealisasi;
}

const initialState:
  ApbdesActionState = {
    error: null,
    success: null,
  };

function getNumberValue(
  value: number
) {
  if (
    !Number.isFinite(value)
  ) {
    return 0;
  }

  return value;
}

export default function ApbdesForm({
  data,
}: ApbdesFormProps) {
  const [
    pdfName,
    setPdfName,
  ] = useState('');

  const [
    imageName,
    setImageName,
  ] = useState('');

  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    updateApbdesAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
    >
      <input
        type="hidden"
        name="tahun"
        value={data.tahun}
      />

      <div className="flex items-start gap-4 border-b border-slate-100 p-6">
        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
          <Landmark size={24} />
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-600">
            Tahun Anggaran
          </p>

          <h2 className="mt-1 text-2xl font-black text-slate-900">
            APBDes {data.tahun}
          </h2>
        </div>
      </div>

      <div className="space-y-6 p-6">
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

        <div>
          <label
            htmlFor={`judul-${data.tahun}`}
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Judul Halaman
          </label>

          <input
            id={`judul-${data.tahun}`}
            name="judul"
            type="text"
            required
            minLength={5}
            maxLength={200}
            defaultValue={data.judul}
            disabled={isPending}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor={`deskripsi-${data.tahun}`}
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Deskripsi
          </label>

          <textarea
            id={`deskripsi-${data.tahun}`}
            name="deskripsi"
            rows={4}
            maxLength={5000}
            defaultValue={
              data.deskripsi ?? ''
            }
            disabled={isPending}
            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium leading-relaxed text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <section className="grid gap-5 md:grid-cols-2">
          <NominalInput
            id={`anggaran-pendapatan-${data.tahun}`}
            name="anggaran_pendapatan"
            label="Anggaran Pendapatan"
            value={getNumberValue(
              data.anggaran_pendapatan
            )}
            disabled={isPending}
          />

          <NominalInput
            id={`realisasi-pendapatan-${data.tahun}`}
            name="realisasi_pendapatan"
            label="Realisasi Pendapatan"
            value={getNumberValue(
              data.realisasi_pendapatan
            )}
            disabled={isPending}
          />

          <NominalInput
            id={`anggaran-belanja-${data.tahun}`}
            name="anggaran_belanja"
            label="Anggaran Belanja"
            value={getNumberValue(
              data.anggaran_belanja
            )}
            disabled={isPending}
          />

          <NominalInput
            id={`realisasi-belanja-${data.tahun}`}
            name="realisasi_belanja"
            label="Realisasi Belanja"
            value={getNumberValue(
              data.realisasi_belanja
            )}
            disabled={isPending}
          />

          <NominalInput
            id={`anggaran-pembiayaan-${data.tahun}`}
            name="anggaran_pembiayaan"
            label="Anggaran Pembiayaan Neto"
            value={getNumberValue(
              data.anggaran_pembiayaan
            )}
            disabled={isPending}
          />

          <NominalInput
            id={`realisasi-pembiayaan-${data.tahun}`}
            name="realisasi_pembiayaan"
            label="Realisasi Pembiayaan Neto"
            value={getNumberValue(
              data.realisasi_pembiayaan
            )}
            disabled={isPending}
          />
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-bold text-slate-700">
              Dokumen PDF
            </p>

            <label className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 p-5 text-center">
              <FileText
                size={30}
                className="text-emerald-700"
              />

              <span className="mt-3 text-sm font-bold text-slate-700">
                Pilih dokumen PDF
              </span>

              <span className="mt-1 text-xs text-slate-400">
                Maksimal 10 MB
              </span>

              {pdfName && (
                <span className="mt-3 max-w-full truncate text-xs font-bold text-emerald-700">
                  {pdfName}
                </span>
              )}

              <input
                name="dokumen_pdf"
                type="file"
                accept="application/pdf,.pdf"
                disabled={isPending}
                className="sr-only"
                onChange={(event) => {
                  setPdfName(
                    event.currentTarget
                      .files?.[0]
                      ?.name ?? ''
                  );
                }}
              />
            </label>

            {data.dokumen_url && (
              <a
                href={data.dokumen_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-xs font-bold text-emerald-700 underline"
              >
                Lihat dokumen saat ini
              </a>
            )}
          </div>

          <div>
            <p className="mb-2 text-sm font-bold text-slate-700">
              Infografis
            </p>

            <label className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-cyan-200 bg-cyan-50/50 p-5 text-center">
              <ImagePlus
                size={30}
                className="text-cyan-700"
              />

              <span className="mt-3 text-sm font-bold text-slate-700">
                Pilih gambar infografis
              </span>

              <span className="mt-1 text-xs text-slate-400">
                JPG, PNG, atau WebP
              </span>

              {imageName && (
                <span className="mt-3 max-w-full truncate text-xs font-bold text-cyan-700">
                  {imageName}
                </span>
              )}

              <input
                name="infografis"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={isPending}
                className="sr-only"
                onChange={(event) => {
                  setImageName(
                    event.currentTarget
                      .files?.[0]
                      ?.name ?? ''
                  );
                }}
              />
            </label>

            {data.infografis_url && (
              <a
                href={data.infografis_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-xs font-bold text-cyan-700 underline"
              >
                Lihat infografis saat ini
              </a>
            )}
          </div>
        </section>

        <label className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <input
            name="aktif"
            type="checkbox"
            defaultChecked={
              data.aktif
            }
            disabled={isPending}
            className="mt-0.5 h-4 w-4 rounded border-emerald-300 text-emerald-700"
          />

          <span>
            <span className="block text-sm font-bold text-emerald-900">
              Publikasikan APBDes {data.tahun}
            </span>

            <span className="mt-1 block text-xs text-emerald-700">
              Data akan tampil pada halaman publik.
            </span>
          </span>
        </label>

        <div className="flex justify-end border-t border-slate-100 pt-5">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-emerald-800 disabled:bg-slate-400 sm:w-auto"
          >
            {isPending ? (
              <>
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />

                Menyimpan...
              </>
            ) : (
              <>
                <Save size={18} />
                Simpan APBDes {data.tahun}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

function NominalInput({
  id,
  name,
  label,
  value,
  disabled,
}: {
  id: string;
  name: string;
  label: string;
  value: number;
  disabled: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-bold text-slate-400">
          Rp
        </span>

        <input
          id={id}
          name={name}
          type="number"
          min={0}
          step="0.01"
          required
          defaultValue={value}
          disabled={disabled}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        />
      </div>
    </div>
  );
}