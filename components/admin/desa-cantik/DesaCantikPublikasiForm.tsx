'use client';

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';

import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileText,
  LoaderCircle,
  Save,
  Upload,
} from 'lucide-react';

import {
  useRouter,
} from 'next/navigation';

import {
  simpanPublikasiDesaCantikAction,
} from '@/app/admin/desa-cantik/actions';

import type {
  DesaCantikAdminActionState,
} from '@/types/desa-cantik-admin';

const INITIAL_STATE:
  DesaCantikAdminActionState = {
  error:
    null,

  success:
    null,

  version:
    0,
};

interface DesaCantikPublikasiFormProps {
  tahun:
    number;

  judul:
    string;

  deskripsi:
    string;

  pdfUrl:
    string | null;

  aktif:
    boolean;
}

export default function DesaCantikPublikasiForm({
  tahun,
  judul,
  deskripsi,
  pdfUrl,
  aktif,
}: DesaCantikPublikasiFormProps) {
  const router =
    useRouter();

  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    simpanPublikasiDesaCantikAction,
    INITIAL_STATE
  );

  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const [
    selectedFile,
    setSelectedFile,
  ] = useState<File | null>(
    null
  );

  const [
    hapusPdf,
    setHapusPdf,
  ] = useState(false);

  const [
    clientError,
    setClientError,
  ] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!state.success) {
      return;
    }

    setSelectedFile(null);
    setHapusPdf(false);

    if (inputRef.current) {
      inputRef.current.value =
        '';
    }

    router.refresh();
  }, [
    router,
    state.success,
    state.version,
  ]);

  function handleFileChange(
    event:
      ChangeEvent<HTMLInputElement>
  ) {
    setClientError(null);

    const file =
      event.target.files?.[0] ??
      null;

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (
      file.type !==
      'application/pdf'
    ) {
      event.target.value =
        '';

      setSelectedFile(null);

      setClientError(
        'Dokumen harus berformat PDF.'
      );

      return;
    }

    if (
      file.size >
      30 * 1024 * 1024
    ) {
      event.target.value =
        '';

      setSelectedFile(null);

      setClientError(
        'Ukuran PDF maksimal 30 MB.'
      );

      return;
    }

    setSelectedFile(
      file
    );

    setHapusPdf(
      false
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-6"
    >
      <input
        type="hidden"
        name="tahun"
        value={tahun}
      />

      <div
        aria-live="polite"
        className="space-y-3"
      >
        {clientError ? (
          <StatusBox
            type="error"
            message={clientError}
          />
        ) : null}

        {state.error ? (
          <StatusBox
            type="error"
            message={state.error}
          />
        ) : null}

        {state.success ? (
          <StatusBox
            type="success"
            message={state.success}
          />
        ) : null}
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-emerald-700">
          Informasi Publikasi
        </p>

        <h2 className="mt-2 text-xl font-black text-slate-900">
          Publikasi Tahun {tahun}
        </h2>

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="judul"
              className="text-sm font-black text-slate-700"
            >
              Judul
            </label>

            <input
              id="judul"
              name="judul"
              type="text"
              required
              minLength={3}
              maxLength={250}
              defaultValue={judul}
              disabled={isPending}
              className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 text-sm font-medium outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="deskripsi"
              className="text-sm font-black text-slate-700"
            >
              Deskripsi
            </label>

            <textarea
              id="deskripsi"
              name="deskripsi"
              rows={5}
              maxLength={2000}
              defaultValue={deskripsi}
              disabled={isPending}
              className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium leading-6 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
            />
          </div>

          <label className="flex min-h-14 cursor-pointer items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div>
              <p className="text-sm font-black text-emerald-900">
                Tampilkan publikasi
              </p>

              <p className="mt-1 text-xs font-medium text-emerald-700">
                Publikasi akan tampil pada halaman Desa Cantik.
              </p>
            </div>

            <input
              type="checkbox"
              name="aktif"
              defaultChecked={aktif}
              disabled={isPending}
              className="h-5 w-5 accent-emerald-700"
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-emerald-700">
          Dokumen PDF
        </p>

        <input
          ref={inputRef}
          id="dokumen_pdf"
          name="dokumen_pdf"
          type="file"
          accept="application/pdf"
          disabled={isPending}
          onChange={handleFileChange}
          className="sr-only"
        />

        <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
              <FileText size={23} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-black text-slate-900">
                {selectedFile
                  ? selectedFile.name
                  : pdfUrl
                    ? `Publikasi Desa Keji ${tahun}.pdf`
                    : 'Belum ada dokumen PDF'}
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500">
                {selectedFile
                  ? `${(
                      selectedFile.size /
                      (1024 * 1024)
                    ).toFixed(2)} MB · Siap diunggah`
                  : 'Ukuran maksimal 30 MB.'}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <label
                  htmlFor="dokumen_pdf"
                  className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-800"
                >
                  <Upload size={15} />
                  {pdfUrl
                    ? 'Ganti PDF'
                    : 'Pilih PDF'}
                </label>

                {pdfUrl &&
                !selectedFile &&
                !hapusPdf ? (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100"
                  >
                    <ExternalLink size={14} />
                    Buka PDF
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {pdfUrl ? (
          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <input
              type="checkbox"
              name="hapus_pdf"
              checked={hapusPdf}
              onChange={(event) => {
                setHapusPdf(
                  event.target.checked
                );

                if (
                  event.target.checked
                ) {
                  setSelectedFile(null);

                  if (
                    inputRef.current
                  ) {
                    inputRef.current.value =
                      '';
                  }
                }
              }}
              disabled={isPending}
              className="mt-0.5 h-4 w-4 accent-red-600"
            />

            <div>
              <p className="text-sm font-black text-red-700">
                Hapus dokumen PDF
              </p>

              <p className="mt-1 text-xs font-medium text-red-600">
                Dokumen tidak akan tampil setelah disimpan.
              </p>
            </div>
          </label>
        ) : null}
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:bg-slate-300"
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
              Simpan Publikasi
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function StatusBox({
  type,
  message,
}: {
  type:
    | 'error'
    | 'success';

  message:
    string;
}) {
  const success =
    type === 'success';

  const Icon =
    success
      ? CheckCircle2
      : AlertCircle;

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 ${
        success
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-red-200 bg-red-50 text-red-700'
      }`}
    >
      <Icon
        size={20}
        className="mt-0.5 shrink-0"
      />

      <p className="text-sm font-bold leading-6">
        {message}
      </p>
    </div>
  );
}