// components/admin/WargaForm.tsx

'use client';

import {
  useActionState,
  useEffect,
  useRef,
} from 'react';

import {
  CircleAlert,
  LoaderCircle,
  Save,
  ShieldCheck,
} from 'lucide-react';

import {
  createWargaAction,
} from '@/app/admin/warga/actions';

import type {
  WargaActionState,
} from '@/types/warga';

const initialState: WargaActionState = {
  error: null,
  success: null,
};

const DAFTAR_DUSUN = [
  'Dusun Keji',
  'Dusun Suruhan',
  'Dusun Sitoyo',
] as const;

export default function WargaForm() {
  const formRef =
    useRef<HTMLFormElement>(null);

  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    createWargaAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-6 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm md:p-8"
    >
      {/* Header Form */}
      <div className="flex items-start gap-3 border-b border-slate-100 pb-5">
        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
          <ShieldCheck size={24} />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900">
            Tambah Data Warga
          </h2>

          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            Masukkan data warga Desa Keji. NIK dan nomor
            Kartu Keluarga akan diamankan sebelum disimpan
            ke database.
          </p>
        </div>
      </div>

      {/* Pesan Error */}
      {state.error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          <CircleAlert
            size={18}
            className="mt-0.5 shrink-0"
          />

          <p>{state.error}</p>
        </div>
      )}

      {/* Pesan Berhasil */}
      {state.success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          {state.success}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {/* NIK */}
        <div>
          <label
            htmlFor="nik"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            NIK
          </label>

          <input
            id="nik"
            name="nik"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            required
            minLength={16}
            maxLength={16}
            pattern="[0-9]{16}"
            disabled={isPending}
            placeholder="Masukkan 16 digit NIK"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
            onInput={(event) => {
              event.currentTarget.value =
                event.currentTarget.value
                  .replace(/\D/g, '')
                  .slice(0, 16);
            }}
          />

          <p className="mt-2 text-xs text-slate-400">
            NIK tidak akan ditampilkan secara lengkap setelah
            disimpan.
          </p>
        </div>

        {/* Nomor KK */}
        <div>
          <label
            htmlFor="no_kk"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Nomor Kartu Keluarga
          </label>

          <input
            id="no_kk"
            name="no_kk"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            required
            minLength={16}
            maxLength={16}
            pattern="[0-9]{16}"
            disabled={isPending}
            placeholder="Masukkan 16 digit nomor KK"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
            onInput={(event) => {
              event.currentTarget.value =
                event.currentTarget.value
                  .replace(/\D/g, '')
                  .slice(0, 16);
            }}
          />

          <p className="mt-2 text-xs text-slate-400">
            Digunakan untuk menghitung jumlah keluarga pada
            setiap wilayah.
          </p>
        </div>

        {/* Nama Lengkap */}
        <div>
          <label
            htmlFor="nama_lengkap"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Nama Lengkap
          </label>

          <input
            id="nama_lengkap"
            name="nama_lengkap"
            type="text"
            required
            minLength={3}
            maxLength={150}
            disabled={isPending}
            placeholder="Nama sesuai dokumen kependudukan"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {/* Jenis Kelamin */}
        <div>
          <label
            htmlFor="jenis_kelamin"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Jenis Kelamin
          </label>

          <select
            id="jenis_kelamin"
            name="jenis_kelamin"
            required
            defaultValue=""
            disabled={isPending}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option
              value=""
              disabled
            >
              Pilih jenis kelamin
            </option>

            <option value="L">
              Laki-laki
            </option>

            <option value="P">
              Perempuan
            </option>
          </select>
        </div>

        {/* Dusun */}
        <div>
          <label
            htmlFor="dusun"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Dusun
          </label>

          <select
            id="dusun"
            name="dusun"
            required
            defaultValue=""
            disabled={isPending}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option
              value=""
              disabled
            >
              Pilih dusun
            </option>

            {DAFTAR_DUSUN.map((dusun) => (
              <option
                key={dusun}
                value={dusun}
              >
                {dusun}
              </option>
            ))}
          </select>
        </div>

        {/* RW dan RT */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="rw"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              RW
            </label>

            <input
              id="rw"
              name="rw"
              type="text"
              inputMode="numeric"
              required
              maxLength={3}
              disabled={isPending}
              placeholder="001"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              onInput={(event) => {
                event.currentTarget.value =
                  event.currentTarget.value
                    .replace(/\D/g, '')
                    .slice(0, 3);
              }}
            />
          </div>

          <div>
            <label
              htmlFor="rt"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              RT
            </label>

            <input
              id="rt"
              name="rt"
              type="text"
              inputMode="numeric"
              required
              maxLength={3}
              disabled={isPending}
              placeholder="001"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              onInput={(event) => {
                event.currentTarget.value =
                  event.currentTarget.value
                    .replace(/\D/g, '')
                    .slice(0, 3);
              }}
            />
          </div>
        </div>

        {/* Tanggal Lahir */}
<div>
  <label
    htmlFor="tanggal_lahir"
    className="mb-2 block text-sm font-bold text-slate-700"
  >
    Tanggal Lahir
  </label>

  <input
    id="tanggal_lahir"
    name="tanggal_lahir"
    type="date"
    required
    disabled={isPending}
    max={new Date().toISOString().slice(0, 10)}
    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
  />

  <p className="mt-2 text-xs text-slate-400">
    Digunakan untuk menghitung rentang umur secara otomatis.
  </p>
</div>

        {/* Nomor WhatsApp */}
        <div>
          <label
            htmlFor="nomor_whatsapp"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Nomor WhatsApp
          </label>

          <input
            id="nomor_whatsapp"
            name="nomor_whatsapp"
            type="tel"
            inputMode="numeric"
            minLength={10}
            maxLength={15}
            disabled={isPending}
            placeholder="Contoh: 081234567890"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
            onInput={(event) => {
              event.currentTarget.value =
                event.currentTarget.value
                  .replace(/\D/g, '')
                  .slice(0, 15);
            }}
          />

          <p className="mt-2 text-xs text-slate-400">
            Nomor WhatsApp bersifat opsional dan digunakan
            untuk keperluan pelayanan warga.
          </p>
        </div>

        {/* Status Penduduk */}
<div>
  <label
    htmlFor="status_penduduk"
    className="mb-2 block text-sm font-bold text-slate-700"
  >
    Status Penduduk
  </label>

  <select
    id="status_penduduk"
    name="status_penduduk"
    required
    defaultValue=""
    disabled={isPending}
    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
  >
    <option
      value=""
      disabled
    >
      Pilih status penduduk
    </option>

    <option value="TETAP">
      Penduduk Tetap
    </option>

    <option value="TIDAK_TETAP">
      Penduduk Tidak Tetap
    </option>
  </select>

  <p className="mt-2 text-xs text-slate-400">
    Status digunakan untuk penyajian statistik
    kependudukan Desa Keji.
  </p>
</div>

        {/* Alamat */}
        <div className="md:col-span-2">
          <label
            htmlFor="alamat"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Alamat Lengkap
          </label>

          <textarea
            id="alamat"
            name="alamat"
            rows={3}
            maxLength={500}
            disabled={isPending}
            placeholder="Masukkan alamat lengkap warga Desa Keji"
            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium leading-relaxed text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      {/* Tombol Simpan */}
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

              Menyimpan Data...
            </>
          ) : (
            <>
              <Save size={18} />
              Simpan Data Warga
            </>
          )}
        </button>
      </div>
    </form>
  );
}