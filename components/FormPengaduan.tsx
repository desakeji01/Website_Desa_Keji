// components/FormPengaduan.tsx

'use client';

import {
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';

import {
  CheckCircle2,
  CircleAlert,
  FileUp,
  LoaderCircle,
  LockKeyhole,
  Megaphone,
  Send,
} from 'lucide-react';

interface ApiResponse {
  success?: boolean;
  message?: string;
  kodePengaduan?: string;
}

export default function FormPengaduan() {
  const [anonim, setAnonim] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState('');

  const [successData, setSuccessData] =
    useState<{
      kode: string;
      message: string;
    } | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = event.currentTarget;

    setErrorMessage('');
    setSuccessData(null);
    setSubmitting(true);

    try {
      const formData =
        new FormData(form);

      formData.set(
        'anonim',
        anonim ? 'true' : 'false'
      );

      const response = await fetch(
        '/api/pengaduan',
        {
          method: 'POST',
          body: formData,
        }
      );

      const responseText =
        await response.text();

      let result: ApiResponse;

      try {
        result = JSON.parse(
          responseText
        ) as ApiResponse;
      } catch {
        throw new Error(
          'Respons dari server tidak valid.'
        );
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ??
            'Pengaduan gagal dikirim.'
        );
      }

      setSuccessData({
        kode:
          result.kodePengaduan ??
          '-',

        message:
          result.message ??
          'Pengaduan berhasil dikirim.',
      });

      form.reset();
      setAnonim(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat mengirim pengaduan.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="form-pengaduan"
      className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-xl shadow-emerald-950/[0.07]"
    >
      {/* Header formulir */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-6 text-white sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',
            backgroundSize:
              '25px 25px',
          }}
        />

        <div className="relative flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <Megaphone size={26} />
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
              Pengaduan Online
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Kirim Pengaduan Masyarakat
            </h2>

            <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
              Isi informasi secara jelas agar laporan dapat
              diverifikasi dan diteruskan kepada pihak yang
              berwenang.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* Pesan error */}
        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <CircleAlert
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-semibold leading-6">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Pesan berhasil */}
        {successData && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={22}
                className="mt-0.5 shrink-0 text-emerald-600"
              />

              <div>
                <h3 className="font-black text-emerald-900">
                  Pengaduan berhasil dikirim
                </h3>

                <p className="mt-1 text-sm font-medium text-emerald-800">
                  {successData.message}
                </p>

                <p className="mt-2 text-sm font-medium text-emerald-800">
                  Simpan kode pengaduan berikut:
                </p>

                <p className="mt-3 inline-flex rounded-xl border border-emerald-200 bg-white px-4 py-3 font-black tracking-[0.08em] text-emerald-800 shadow-sm">
                  {successData.kode}
                </p>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-2"
        >
          {/* Honeypot antispam */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          {/* Anonim */}
          <div className="lg:col-span-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/50">
              <input
                type="checkbox"
                checked={anonim}
                onChange={(event) =>
                  setAnonim(
                    event.target.checked
                  )
                }
                className="mt-1 h-4 w-4 accent-emerald-700"
              />

              <span>
                <span className="block text-sm font-black text-slate-800">
                  Kirim sebagai anonim
                </span>

                <span className="mt-1 block text-xs font-medium leading-5 text-slate-500">
                  Nama pelapor tidak akan ditampilkan.
                  Nomor WhatsApp tetap diperlukan untuk
                  proses verifikasi dan tindak lanjut.
                </span>
              </span>
            </label>
          </div>

          {/* Nama */}
          <FormField
            label="Nama Pelapor"
            required={!anonim}
          >
            <input
              name="namaPelapor"
              type="text"
              required={!anonim}
              disabled={anonim}
              minLength={3}
              maxLength={150}
              placeholder={
                anonim
                  ? 'Pengaduan anonim'
                  : 'Masukkan nama lengkap'
              }
              className={inputClassName}
            />
          </FormField>

          {/* WhatsApp */}
          <FormField
            label="Nomor WhatsApp"
            required
          >
            <input
              name="nomorWhatsapp"
              type="tel"
              inputMode="tel"
              required
              maxLength={16}
              placeholder="Contoh: 081234567890"
              className={inputClassName}
            />
          </FormField>

          {/* Kategori */}
          <FormField
            label="Kategori Pengaduan"
            required
          >
            <select
              name="kategori"
              required
              defaultValue=""
              className={inputClassName}
            >
              <option value="" disabled>
                -- Pilih Kategori --
              </option>

              <option value="Pelayanan Administrasi">
                Pelayanan Administrasi
              </option>

              <option value="Pembangunan Desa">
                Pembangunan Desa
              </option>

              <option value="Lingkungan dan Ketertiban">
                Lingkungan dan Ketertiban
              </option>

              <option value="Aspirasi dan Saran">
                Aspirasi dan Saran
              </option>

              <option value="Lainnya">
                Lainnya
              </option>
            </select>
          </FormField>

          {/* Lokasi */}
          <FormField label="Lokasi Kejadian">
            <input
              name="lokasi"
              type="text"
              maxLength={250}
              placeholder="Dusun, RT/RW, atau lokasi kejadian"
              className={inputClassName}
            />
          </FormField>

          {/* Tanggal */}
          <FormField label="Tanggal Kejadian">
            <input
              name="tanggalKejadian"
              type="date"
              className={inputClassName}
            />
          </FormField>

          {/* Judul */}
          <FormField
            label="Judul Pengaduan"
            required
          >
            <input
              name="judul"
              type="text"
              required
              minLength={5}
              maxLength={150}
              placeholder="Ringkasan singkat pengaduan"
              className={inputClassName}
            />
          </FormField>

          {/* Isi */}
          <div className="lg:col-span-2">
            <FormField
              label="Isi Pengaduan"
              required
            >
              <textarea
                name="isiPengaduan"
                required
                minLength={20}
                maxLength={3000}
                rows={7}
                placeholder="Jelaskan kronologi, waktu, lokasi, kondisi, dan pihak yang berkaitan secara jelas..."
                className={`${inputClassName} min-h-[180px] resize-y py-3`}
              />
            </FormField>
          </div>

          {/* Bukti */}
          <div className="lg:col-span-2">
            <FormField label="Bukti Pendukung">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-emerald-400 hover:bg-emerald-50">
                <FileUp
                  size={30}
                  className="text-emerald-700"
                />

                <span className="mt-3 text-sm font-black text-slate-800">
                  Pilih foto atau dokumen
                </span>

                <span className="mt-1 text-xs font-medium text-slate-500">
                  JPG, PNG, WebP, atau PDF — maksimal 5 MB
                </span>

                <input
                  name="bukti"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  className="mt-4 block max-w-full text-xs text-slate-500"
                />
              </label>
            </FormField>
          </div>

          {/* Perlindungan data */}
          <div className="lg:col-span-2">
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <LockKeyhole
                size={19}
                className="mt-0.5 shrink-0 text-amber-700"
              />

              <p className="text-xs font-semibold leading-6 text-amber-900">
                Jangan mengirim kata sandi, nomor rekening,
                foto KTP lengkap, nomor KK lengkap, atau data
                sensitif yang tidak diperlukan.
              </p>
            </div>
          </div>

          {/* Persetujuan */}
          <div className="lg:col-span-2">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 accent-emerald-700"
              />

              <span className="text-xs font-semibold leading-6 text-slate-600">
                Saya menyatakan bahwa informasi yang
                dikirim benar dan dapat digunakan untuk
                proses verifikasi serta tindak lanjut
                pengaduan.
              </span>
            </label>
          </div>

          {/* Tombol */}
          <div className="lg:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-7 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-800 disabled:cursor-wait disabled:bg-slate-400 sm:w-auto"
            >
              {submitting ? (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Send size={18} />
              )}

              {submitting
                ? 'Mengirim Pengaduan...'
                : 'Kirim Pengaduan'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

const inputClassName =
  'min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500';

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}