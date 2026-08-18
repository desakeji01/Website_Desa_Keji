'use client';

import {
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  FileImage,
  ImagePlus,
  Images,
  LoaderCircle,
  MapPin,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

import {
  createAlbumAction,
} from '@/app/admin/galeri/actions';

import type {
  GaleriActionState,
  KategoriGaleri,
} from '@/types/galeri';

const INITIAL_STATE:
  GaleriActionState = {
  error: null,
  success: null,
};

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const MAX_ALBUM_PHOTOS = 8;

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

const KATEGORI_GALERI:
  KategoriGaleri[] = [
  'Pemerintahan',
  'Kegiatan Masyarakat',
  'Budaya dan Tradisi',
  'Pembangunan',
  'UMKM',
  'Desa Wisata',
  'Karang Taruna',
  'KKN dan Kolaborasi',
];

function formatFileSize(
  value: number
) {
  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return '0 KB';
  }

  if (
    value >=
    1024 * 1024
  ) {
    return `${(
      value /
      (1024 * 1024)
    ).toFixed(2)} MB`;
  }

  return `${Math.ceil(
    value / 1024
  )} KB`;
}

function getImageValidationError(
  file: File,
  label: string
): string | null {
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type
    )
  ) {
    return `${label} harus berformat JPG, PNG, atau WebP.`;
  }

  if (
    file.size >
    MAX_FILE_SIZE
  ) {
    return `${label} melebihi batas maksimal 5 MB.`;
  }

  return null;
}

export default function GaleriForm() {
  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    createAlbumAction,
    INITIAL_STATE
  );

  const formRef =
    useRef<HTMLFormElement | null>(
      null
    );

  const coverInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const albumInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const [
    coverFile,
    setCoverFile,
  ] = useState<File | null>(
    null
  );

  const [
    albumFiles,
    setAlbumFiles,
  ] = useState<File[]>([]);

  const [
    coverPreviewUrl,
    setCoverPreviewUrl,
  ] = useState<string | null>(
    null
  );

  const [
    albumPreviewUrls,
    setAlbumPreviewUrls,
  ] = useState<string[]>([]);

  const [
    clientError,
    setClientError,
  ] = useState<string | null>(
    null
  );

  /*
   * Membuat preview lokal untuk foto sampul.
   * File belum dikirim ke Supabase pada tahap ini.
   */
  useEffect(() => {
    if (!coverFile) {
      setCoverPreviewUrl(null);
      return;
    }

    const objectUrl =
      URL.createObjectURL(
        coverFile
      );

    setCoverPreviewUrl(
      objectUrl
    );

    return () => {
      URL.revokeObjectURL(
        objectUrl
      );
    };
  }, [coverFile]);

  /*
   * Membuat preview lokal untuk semua foto album.
   */
  useEffect(() => {
    if (
      albumFiles.length === 0
    ) {
      setAlbumPreviewUrls([]);
      return;
    }

    const objectUrls =
      albumFiles.map(
        (file) =>
          URL.createObjectURL(
            file
          )
      );

    setAlbumPreviewUrls(
      objectUrls
    );

    return () => {
      objectUrls.forEach(
        (url) => {
          URL.revokeObjectURL(
            url
          );
        }
      );
    };
  }, [albumFiles]);

  /*
   * Setelah Server Action berhasil, kosongkan form
   * dan preview. Album yang berhasil akan tampil
   * pada daftar album di bawah form.
   */
  useEffect(() => {
    if (!state.success) {
      return;
    }

    formRef.current?.reset();

    setCoverFile(null);
    setAlbumFiles([]);
    setClientError(null);

    if (
      coverInputRef.current
    ) {
      coverInputRef.current.value =
        '';
    }

    if (
      albumInputRef.current
    ) {
      albumInputRef.current.value =
        '';
    }
  }, [state.success]);

  function handleCoverChange(
    event:
      React.ChangeEvent<HTMLInputElement>
  ) {
    setClientError(null);

    const file =
      event.target.files?.[0] ??
      null;

    if (!file) {
      setCoverFile(null);
      return;
    }

    const validationError =
      getImageValidationError(
        file,
        'Foto sampul'
      );

    if (validationError) {
      event.target.value = '';
      setCoverFile(null);
      setClientError(
        validationError
      );
      return;
    }

    setCoverFile(file);
  }

  function handleAlbumChange(
    event:
      React.ChangeEvent<HTMLInputElement>
  ) {
    setClientError(null);

    const selectedFiles =
      Array.from(
        event.target.files ??
          []
      );

    if (
      selectedFiles.length === 0
    ) {
      setAlbumFiles([]);
      return;
    }

    if (
      selectedFiles.length >
      MAX_ALBUM_PHOTOS
    ) {
      event.target.value = '';
      setAlbumFiles([]);

      setClientError(
        `Maksimal ${MAX_ALBUM_PHOTOS} foto album dalam satu kali unggah.`
      );

      return;
    }

    for (
      let index = 0;
      index <
      selectedFiles.length;
      index += 1
    ) {
      const validationError =
        getImageValidationError(
          selectedFiles[index],
          `Foto album ke-${index + 1}`
        );

      if (validationError) {
        event.target.value =
          '';

        setAlbumFiles([]);

        setClientError(
          validationError
        );

        return;
      }
    }

    setAlbumFiles(
      selectedFiles
    );
  }

  function removeCover() {
    setCoverFile(null);
    setClientError(null);

    if (
      coverInputRef.current
    ) {
      coverInputRef.current.value =
        '';
    }
  }

  function removeAlbumPhoto(
    targetIndex: number
  ) {
    const remainingFiles =
      albumFiles.filter(
        (_, index) =>
          index !== targetIndex
      );

    setAlbumFiles(
      remainingFiles
    );

    const input =
      albumInputRef.current;

    if (!input) {
      return;
    }

    const dataTransfer =
      new DataTransfer();

    remainingFiles.forEach(
      (file) => {
        dataTransfer.items.add(
          file
        );
      }
    );

    input.files =
      dataTransfer.files;
  }

  function clearAlbumPhotos() {
    setAlbumFiles([]);
    setClientError(null);

    if (
      albumInputRef.current
    ) {
      albumInputRef.current.value =
        '';
    }
  }

  const totalAlbumSize =
    albumFiles.reduce(
      (total, file) =>
        total + file.size,
      0
    );

  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
      <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-6 md:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
          Album Baru
        </p>

        <h2 className="mt-2 text-xl font-black text-slate-900 md:text-2xl">
          Tambahkan Album Galeri
        </h2>

        <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500">
          Pilih foto untuk melihat
          pratinjau sebelum album
          diunggah ke penyimpanan
          galeri.
        </p>
      </div>

      <form
        ref={formRef}
        action={formAction}
        className="p-6 md:p-8"
      >
        {/* Informasi status */}
        <div
          aria-live="polite"
          className="mb-6 space-y-3"
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

              <div>
                <p className="text-sm font-black">
                  Album gagal diunggah
                </p>

                <p className="mt-1 text-sm font-medium leading-6">
                  {state.error}
                </p>
              </div>
            </div>
          ) : null}

          {state.success ? (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="text-sm font-black">
                  Unggahan berhasil
                </p>

                <p className="mt-1 text-sm font-medium leading-6">
                  {state.success}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {/* Informasi album */}
          <div className="space-y-5">
            <div>
              <label
                htmlFor="judul"
                className="text-sm font-black text-slate-700"
              >
                Judul Album
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                id="judul"
                name="judul"
                type="text"
                required
                minLength={3}
                maxLength={180}
                disabled={isPending}
                placeholder="Contoh: Kegiatan Bersih Desa 2026"
                className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="deskripsi"
                className="text-sm font-black text-slate-700"
              >
                Deskripsi Album
              </label>

              <textarea
                id="deskripsi"
                name="deskripsi"
                rows={6}
                maxLength={3000}
                disabled={isPending}
                placeholder="Jelaskan kegiatan atau dokumentasi dalam album."
                className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="kategori"
                  className="text-sm font-black text-slate-700"
                >
                  Kategori
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  id="kategori"
                  name="kategori"
                  required
                  defaultValue=""
                  disabled={isPending}
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option
                    value=""
                    disabled
                  >
                    Pilih kategori
                  </option>

                  {KATEGORI_GALERI.map(
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
                  htmlFor="tanggal_kegiatan"
                  className="text-sm font-black text-slate-700"
                >
                  Tanggal Kegiatan
                </label>

                <div className="relative mt-2">
                  <CalendarDays
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="tanggal_kegiatan"
                    name="tanggal_kegiatan"
                    type="date"
                    disabled={isPending}
                    className="min-h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="lokasi"
                className="text-sm font-black text-slate-700"
              >
                Lokasi Kegiatan
              </label>

              <div className="relative mt-2">
                <MapPin
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="lokasi"
                  name="lokasi"
                  type="text"
                  maxLength={250}
                  disabled={isPending}
                  placeholder="Contoh: Balai Desa Keji"
                  className="min-h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="urutan"
                  className="text-sm font-black text-slate-700"
                >
                  Urutan
                </label>

                <input
                  id="urutan"
                  name="urutan"
                  type="number"
                  min={0}
                  step={1}
                  defaultValue={0}
                  disabled={isPending}
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              <div className="flex items-end">
                <label className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4">
                  <div>
                    <p className="text-sm font-black text-emerald-900">
                      Publikasikan album
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-emerald-700">
                      Tampilkan pada halaman publik
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="aktif"
                    defaultChecked
                    disabled={isPending}
                    className="h-5 w-5 rounded border-emerald-300 text-emerald-700 accent-emerald-700"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Foto dan preview */}
          <div className="space-y-6">
            {/* Foto sampul */}
            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-black text-slate-900">
                    Foto Sampul
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </h3>

                  <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                    Digunakan sebagai gambar utama
                    pada kartu album.
                  </p>
                </div>

                {coverFile ? (
                  <button
                    type="button"
                    onClick={removeCover}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 text-xs font-extrabold text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                    Hapus
                  </button>
                ) : null}
              </div>

              <input
                ref={coverInputRef}
                id="foto_sampul"
                name="foto_sampul"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required
                disabled={isPending}
                onChange={handleCoverChange}
                className="sr-only"
              />

              {coverPreviewUrl &&
              coverFile ? (
                <div className="mt-4">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-emerald-200 bg-white">
                    <img
                      src={coverPreviewUrl}
                      alt="Pratinjau foto sampul"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-4 pt-10 text-white">
                      <p className="truncate text-sm font-black">
                        {coverFile.name}
                      </p>

                      <p className="mt-1 text-xs font-medium text-white/80">
                        {formatFileSize(
                          coverFile.size
                        )}{' '}
                        • Siap diunggah
                      </p>
                    </div>

                    <div className="absolute right-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow">
                      Sampul
                    </div>
                  </div>

                  <label
                    htmlFor="foto_sampul"
                    className="mt-3 inline-flex cursor-pointer items-center gap-2 text-xs font-extrabold text-emerald-700 transition hover:text-emerald-900"
                  >
                    <ImagePlus size={16} />
                    Ganti foto sampul
                  </label>
                </div>
              ) : (
                <label
                  htmlFor="foto_sampul"
                  className="mt-4 flex min-h-[230px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-white px-6 text-center transition hover:border-emerald-500 hover:bg-emerald-50"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <FileImage size={27} />
                  </div>

                  <p className="mt-4 text-sm font-black text-slate-800">
                    Pilih foto sampul
                  </p>

                  <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
                    JPG, PNG, atau WebP.
                    Maksimal 5 MB.
                  </p>

                  <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-extrabold text-white">
                    <Upload size={15} />
                    Pilih Gambar
                  </span>
                </label>
              )}
            </section>

            {/* Foto album */}
            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-black text-slate-900">
                    Foto Album
                  </h3>

                  <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                    Pilih maksimal delapan foto
                    dokumentasi dalam satu album.
                  </p>
                </div>

                {albumFiles.length >
                0 ? (
                  <button
                    type="button"
                    onClick={clearAlbumPhotos}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 text-xs font-extrabold text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                    Hapus semua
                  </button>
                ) : null}
              </div>

              <input
                ref={albumInputRef}
                id="foto_album"
                name="foto_album"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                disabled={isPending}
                onChange={handleAlbumChange}
                className="sr-only"
              />

              {albumFiles.length >
              0 ? (
                <div className="mt-4">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
                      {albumFiles.length} foto dipilih
                    </span>

                    <span className="rounded-full bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600">
                      Total{' '}
                      {formatFileSize(
                        totalAlbumSize
                      )}
                    </span>

                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-500">
                      Siap diunggah
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {albumFiles.map(
                      (file, index) => {
                        const previewUrl =
                          albumPreviewUrls[
                            index
                          ];

                        return (
                          <article
                            key={`${file.name}-${file.lastModified}-${index}`}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white"
                          >
                            <div className="relative aspect-square overflow-hidden bg-slate-100">
                              {previewUrl ? (
                                <img
                                  src={previewUrl}
                                  alt={`Pratinjau ${file.name}`}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <Images
                                    size={28}
                                    className="text-slate-300"
                                  />
                                </div>
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  removeAlbumPhoto(
                                    index
                                  )
                                }
                                disabled={isPending}
                                aria-label={`Hapus ${file.name}`}
                                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/75 text-white shadow transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <X size={16} />
                              </button>

                              <span className="absolute bottom-2 left-2 rounded-full bg-emerald-700 px-2.5 py-1 text-[10px] font-black text-white">
                                Foto {index + 1}
                              </span>
                            </div>

                            <div className="p-3">
                              <p className="truncate text-xs font-black text-slate-700">
                                {file.name}
                              </p>

                              <p className="mt-1 text-[10px] font-bold text-slate-400">
                                {formatFileSize(
                                  file.size
                                )}
                              </p>
                            </div>
                          </article>
                        );
                      }
                    )}

                    {albumFiles.length <
                    MAX_ALBUM_PHOTOS ? (
                      <label
                        htmlFor="foto_album"
                        className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-white p-4 text-center transition hover:border-emerald-500 hover:bg-emerald-50"
                      >
                        <ImagePlus
                          size={27}
                          className="text-emerald-700"
                        />

                        <p className="mt-3 text-xs font-black text-slate-700">
                          Ganti pilihan foto
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-slate-400">
                          Maksimal 8 foto
                        </p>
                      </label>
                    ) : null}
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="foto_album"
                  className="mt-4 flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-white px-6 text-center transition hover:border-emerald-500 hover:bg-emerald-50"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <Images size={27} />
                  </div>

                  <p className="mt-4 text-sm font-black text-slate-800">
                    Pilih foto album
                  </p>

                  <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
                    Maksimal 8 foto. Setiap
                    foto maksimal 5 MB.
                  </p>

                  <span className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-extrabold text-emerald-700">
                    <ImagePlus size={15} />
                    Pilih Beberapa Foto
                  </span>
                </label>
              )}
            </section>
          </div>
        </div>

        {/* Tombol simpan */}
        <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs font-medium leading-5 text-slate-500">
            <p>
              Foto sampul wajib dipilih.
              Foto album bersifat opsional.
            </p>

            <p className="mt-1">
              Album dianggap berhasil diunggah
              setelah notifikasi hijau muncul
              dan album tampil pada daftar.
            </p>
          </div>

          <button
            type="submit"
            disabled={
              isPending ||
              !coverFile
            }
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            {isPending ? (
              <>
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />

                Mengunggah album...
              </>
            ) : (
              <>
                <Save size={18} />
                Simpan dan Unggah
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}