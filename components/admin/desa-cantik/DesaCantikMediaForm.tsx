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
  ImagePlus,
  LoaderCircle,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';

import {
  useRouter,
} from 'next/navigation';

import {
  simpanMediaDesaCantikAction,
} from '@/app/admin/desa-cantik/actions';

import type {
  KategoriDesaCantik,
} from '@/types/desa-cantik';

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

interface DesaCantikMediaFormProps {
  kategori:
    KategoriDesaCantik;

  namaKategori:
    string;

  tahun:
    number;

  sumber:
    string;

  infografisUrl:
    string | null;

  aktif:
    boolean;
}

export default function DesaCantikMediaForm({
  kategori,
  namaKategori,
  tahun,
  sumber,
  infografisUrl,
  aktif,
}: DesaCantikMediaFormProps) {
  const router =
    useRouter();

  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    simpanMediaDesaCantikAction,
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
    previewUrl,
    setPreviewUrl,
  ] = useState<string | null>(
    null
  );

  const [
    hapusInfografis,
    setHapusInfografis,
  ] = useState(false);

  const [
    clientError,
    setClientError,
  ] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl =
      URL.createObjectURL(
        selectedFile
      );

    setPreviewUrl(
      objectUrl
    );

    return () => {
      URL.revokeObjectURL(
        objectUrl
      );
    };
  }, [selectedFile]);

  useEffect(() => {
    if (!state.success) {
      return;
    }

    setSelectedFile(null);
    setHapusInfografis(false);

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

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      event.target.value =
        '';

      setSelectedFile(null);

      setClientError(
        'Infografis harus berformat JPG, PNG, atau WebP.'
      );

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      event.target.value =
        '';

      setSelectedFile(null);

      setClientError(
        'Ukuran infografis maksimal 5 MB.'
      );

      return;
    }

    setSelectedFile(
      file
    );

    setHapusInfografis(
      false
    );
  }

  function clearSelectedFile() {
    setSelectedFile(null);

    if (inputRef.current) {
      inputRef.current.value =
        '';
    }
  }

  const displayedImage =
    previewUrl ??
    (
      !hapusInfografis
        ? infografisUrl
        : null
    );

  return (
    <form
      action={formAction}
      className="space-y-6"
    >
      <input
        type="hidden"
        name="kategori"
        value={kategori}
      />

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
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-bold leading-6">
              {clientError}
            </p>
          </div>
        ) : null}

        {state.error ? (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-bold leading-6">
              {state.error}
            </p>
          </div>
        ) : null}

        {state.success ? (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-bold leading-6">
              {state.success}
            </p>
          </div>
        ) : null}
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-emerald-700">
          Informasi Data
        </p>

        <h2 className="mt-2 text-xl font-black text-slate-900">
          {namaKategori} Tahun {tahun}
        </h2>

        <div className="mt-6">
          <label
            htmlFor="sumber"
            className="text-sm font-black text-slate-700"
          >
            Sumber Data
          </label>

          <textarea
            id="sumber"
            name="sumber"
            rows={4}
            maxLength={1000}
            defaultValue={sumber}
            disabled={isPending}
            placeholder="Contoh: Pendataan Penyusunan Direktori Data Desa Keji Tahun 2026"
            className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium leading-6 text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
          />
        </div>

        <label className="mt-5 flex min-h-14 cursor-pointer items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div>
            <p className="text-sm font-black text-emerald-900">
              Tampilkan di website
            </p>

            <p className="mt-1 text-xs font-medium text-emerald-700">
              Data dapat dibuka pada halaman publik.
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
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-emerald-700">
            Infografis
          </p>

          <h2 className="mt-2 text-xl font-black text-slate-900">
            Gambar {namaKategori} {tahun}
          </h2>

          <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
            File baru akan menggantikan infografis yang digunakan sebelumnya.
          </p>
        </div>

        <input
          ref={inputRef}
          id="infografis"
          name="infografis"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={isPending}
          onChange={handleFileChange}
          className="sr-only"
        />

        {displayedImage ? (
          <div className="mt-5">
            <div className="flex max-h-[560px] items-center justify-center overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
              <img
                src={displayedImage}
                alt={`Pratinjau infografis ${namaKategori} ${tahun}`}
                className="h-auto max-h-[520px] max-w-full rounded-xl object-contain shadow-sm"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <label
                htmlFor="infografis"
                className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-extrabold text-white transition hover:bg-emerald-800"
              >
                <ImagePlus size={17} />
                Ganti Gambar
              </label>

              <a
                href={displayedImage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 transition hover:bg-slate-100"
              >
                <ExternalLink size={16} />
                Buka Gambar
              </a>

              {selectedFile ? (
                <button
                  type="button"
                  onClick={clearSelectedFile}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 transition hover:bg-slate-100"
                >
                  Batalkan Pilihan
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <label
            htmlFor="infografis"
            className="mt-5 flex min-h-[230px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 px-6 text-center transition hover:border-emerald-500 hover:bg-emerald-50"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Upload size={26} />
            </div>

            <p className="mt-4 text-sm font-black text-slate-800">
              Pilih infografis
            </p>

            <p className="mt-2 text-xs font-medium text-slate-500">
              JPG, PNG, atau WebP. Maksimal 5 MB.
            </p>
          </label>
        )}

        {infografisUrl ? (
          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <input
              type="checkbox"
              name="hapus_infografis"
              checked={hapusInfografis}
              onChange={(event) => {
                setHapusInfografis(
                  event.target.checked
                );

                if (
                  event.target.checked
                ) {
                  clearSelectedFile();
                }
              }}
              disabled={isPending}
              className="mt-0.5 h-4 w-4 accent-red-600"
            />

            <div>
              <p className="text-sm font-black text-red-700">
                Hapus infografis
              </p>

              <p className="mt-1 text-xs font-medium leading-5 text-red-600">
                Gambar tidak akan tampil setelah perubahan disimpan.
              </p>
            </div>
          </label>
        ) : null}
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-wait disabled:bg-slate-300"
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
              Simpan Perubahan
            </>
          )}
        </button>
      </div>
    </form>
  );
}