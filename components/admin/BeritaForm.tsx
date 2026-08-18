// components/admin/BeritaForm.tsx

'use client';

import {
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';

import Link from 'next/link';

import {
  ArrowLeft,
  FileImage,
  ImagePlus,
  LoaderCircle,
  Save,
  TriangleAlert,
  XCircle,
} from 'lucide-react';

import type {
  BeritaActionState,
  BeritaFormInitialData,
} from '@/types/berita';

interface BeritaFormProps {
  action: (
    state: BeritaActionState,
    formData: FormData
  ) => Promise<BeritaActionState>;

  initialData?: BeritaFormInitialData;

  submitLabel: string;
}

const initialState: BeritaActionState = {
  error: null,
};

const MAX_IMAGE_SIZE_BYTES =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

function formatFileSize(
  bytes: number
) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(2)} MB`;
}

export default function BeritaForm({
  action,
  initialData,
  submitLabel,
}: BeritaFormProps) {
  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    action,
    initialState
  );

  const initialPreview =
    initialData?.gambar_url ?? '';

  const [
    preview,
    setPreview,
  ] = useState(initialPreview);

  const [
    fileError,
    setFileError,
  ] = useState<string | null>(
    null
  );

  const [
    selectedFileName,
    setSelectedFileName,
  ] = useState('');

  const [
    selectedFileSize,
    setSelectedFileSize,
  ] = useState('');

  const objectUrlRef =
    useRef<string | null>(
      null
    );

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  function revokeObjectUrl() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(
        objectUrlRef.current
      );

      objectUrlRef.current =
        null;
    }
  }

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(
          objectUrlRef.current
        );
      }
    };
  }, []);

  function resetSelectedImage() {
    revokeObjectUrl();

    if (fileInputRef.current) {
      fileInputRef.current.value =
        '';
    }

    setPreview(initialPreview);
    setFileError(null);
    setSelectedFileName('');
    setSelectedFileSize('');
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    setFileError(null);

    if (!file) {
      resetSelectedImage();
      return;
    }

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type
      )
    ) {
      revokeObjectUrl();

      event.target.value = '';

      setPreview(initialPreview);

      setSelectedFileName('');
      setSelectedFileSize('');

      setFileError(
        'Format gambar harus JPG, PNG, atau WEBP.'
      );

      return;
    }

    if (
      file.size >
      MAX_IMAGE_SIZE_BYTES
    ) {
      revokeObjectUrl();

      event.target.value = '';

      setPreview(initialPreview);

      setSelectedFileName('');
      setSelectedFileSize('');

      setFileError(
        `Ukuran gambar ${formatFileSize(
          file.size
        )}. Maksimal ukuran gambar adalah 5 MB.`
      );

      return;
    }

    if (file.size <= 0) {
      revokeObjectUrl();

      event.target.value = '';

      setPreview(initialPreview);

      setSelectedFileName('');
      setSelectedFileSize('');

      setFileError(
        'File gambar tidak valid atau kosong.'
      );

      return;
    }

    revokeObjectUrl();

    const objectUrl =
      URL.createObjectURL(file);

    objectUrlRef.current =
      objectUrl;

    setPreview(objectUrl);

    setSelectedFileName(
      file.name
    );

    setSelectedFileSize(
      formatFileSize(
        file.size
      )
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-6"
    >
      {/* Error Server Action */}
      {state.error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
        >
          <TriangleAlert
            size={19}
            className="mt-0.5 shrink-0"
          />

          <p>{state.error}</p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Konten Utama */}
        <div className="space-y-6 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm md:p-8">
          {/* Judul */}
          <div>
            <label
              htmlFor="judul"
              className="mb-2 block text-sm font-extrabold text-slate-700"
            >
              Judul Berita
            </label>

            <input
              id="judul"
              name="judul"
              type="text"
              required
              minLength={5}
              maxLength={200}
              disabled={isPending}
              defaultValue={
                initialData?.judul ?? ''
              }
              placeholder="Masukkan judul berita"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-2 text-xs text-slate-400">
              Minimal 5 karakter dan maksimal
              200 karakter.
            </p>
          </div>

          {/* Ringkasan */}
          <div>
            <label
              htmlFor="kutipan"
              className="mb-2 block text-sm font-extrabold text-slate-700"
            >
              Ringkasan Berita
            </label>

            <textarea
              id="kutipan"
              name="kutipan"
              required
              minLength={20}
              maxLength={500}
              rows={4}
              disabled={isPending}
              defaultValue={
                initialData?.kutipan ?? ''
              }
              placeholder="Ringkasan singkat yang tampil pada kartu berita..."
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium leading-relaxed text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-2 text-xs text-slate-400">
              Minimal 20 karakter dan maksimal
              500 karakter.
            </p>
          </div>

          {/* Konten */}
          <div>
            <label
              htmlFor="konten"
              className="mb-2 block text-sm font-extrabold text-slate-700"
            >
              Isi Lengkap Berita
            </label>

            <textarea
              id="konten"
              name="konten"
              required
              minLength={50}
              rows={16}
              disabled={isPending}
              defaultValue={
                initialData?.konten ?? ''
              }
              placeholder="Tuliskan isi lengkap berita di sini..."
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium leading-7 text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-2 text-xs text-slate-400">
              Isi berita minimal terdiri dari
              50 karakter.
            </p>
          </div>
        </div>

        {/* Pengaturan Samping */}
        <aside className="space-y-6">
          {/* Pengaturan Publikasi */}
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-base font-black text-slate-900">
              Pengaturan Publikasi
            </h2>

            <div className="space-y-5">
              {/* Kategori */}
              <div>
                <label
                  htmlFor="kategori"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Kategori
                </label>

                <select
                  id="kategori"
                  name="kategori"
                  required
                  disabled={isPending}
                  defaultValue={
                    initialData?.kategori ??
                    'Berita Desa'
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="Berita Desa">
                    Berita Desa
                  </option>

                  <option value="PPID">
                    PPID
                  </option>

                  <option value="Laporan Anggaran">
                    Laporan Anggaran
                  </option>
                </select>
              </div>

              {/* Penulis */}
              <div>
                <label
                  htmlFor="penulis"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Penulis
                </label>

                <input
                  id="penulis"
                  name="penulis"
                  type="text"
                  required
                  maxLength={100}
                  disabled={isPending}
                  defaultValue={
                    initialData?.penulis ??
                    'Admin Desa'
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  required
                  disabled={isPending}
                  defaultValue={
                    initialData?.status ??
                    'draft'
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="draft">
                    Simpan sebagai Draft
                  </option>

                  <option value="published">
                    Terbitkan ke Publik
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Gambar Utama */}
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <label
              htmlFor="gambar"
              className="mb-3 block text-sm font-black text-slate-800"
            >
              Gambar Utama
            </label>

            {/* Preview */}
            {preview ? (
              <div className="relative mb-4 h-44 overflow-hidden rounded-2xl border border-emerald-100 bg-slate-100">
                <img
                  src={preview}
                  alt="Pratinjau gambar berita"
                  className="h-full w-full object-cover"
                />

                {selectedFileName && (
                  <button
                    type="button"
                    onClick={
                      resetSelectedImage
                    }
                    disabled={isPending}
                    title="Batalkan gambar yang dipilih"
                    aria-label="Batalkan gambar yang dipilih"
                    className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/30 bg-black/55 text-white shadow-lg backdrop-blur-md transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <XCircle
                      size={18}
                    />
                  </button>
                )}
              </div>
            ) : (
              <div className="mb-4 flex h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 text-emerald-500">
                <ImagePlus size={34} />

                <p className="mt-2 text-xs font-bold">
                  Belum ada gambar
                </p>
              </div>
            )}

            {/* File yang dipilih */}
            {selectedFileName && (
              <div className="mb-4 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                <FileImage
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-700"
                />

                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-700">
                    {selectedFileName}
                  </p>

                  <p className="mt-1 text-[11px] font-medium text-slate-500">
                    {selectedFileSize}
                  </p>
                </div>
              </div>
            )}

            {/* Input Gambar */}
            <input
              ref={fileInputRef}
              id="gambar"
              name="gambar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required={
                !initialData?.gambar_url
              }
              disabled={isPending}
              onChange={
                handleImageChange
              }
              aria-describedby="gambar-keterangan gambar-error"
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-100 file:px-3 file:py-2 file:text-xs file:font-bold file:text-emerald-700 hover:file:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
            />

            {/* Error File */}
            {fileError && (
              <div
                id="gambar-error"
                role="alert"
                className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3"
              >
                <TriangleAlert
                  size={16}
                  className="mt-0.5 shrink-0 text-red-600"
                />

                <p className="text-xs font-semibold leading-relaxed text-red-700">
                  {fileError}
                </p>
              </div>
            )}

            <p
              id="gambar-keterangan"
              className="mt-3 text-xs leading-relaxed text-slate-400"
            >
              Format JPG, PNG, atau WEBP.
              Ukuran maksimal 5 MB.
              Disarankan menggunakan rasio
              gambar 16:9.
            </p>

            {initialData?.gambar_url &&
              !selectedFileName && (
                <p className="mt-2 text-[11px] font-semibold text-emerald-600">
                  Kosongkan input apabila tidak
                  ingin mengganti gambar lama.
                </p>
              )}
          </div>
        </aside>
      </div>

      {/* Tombol Form */}
      <div className="flex flex-col-reverse gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin/berita"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-extrabold text-slate-600 transition hover:bg-slate-50"
        >
          <ArrowLeft size={17} />
          Kembali
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isPending ? (
            <>
              <LoaderCircle
                size={17}
                className="animate-spin"
              />

              Menyimpan...
            </>
          ) : (
            <>
              <Save size={17} />
              {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
}