// components/SidebarLayanan.tsx

'use client';

import {
  useEffect,
  useState,
  type FormEvent,
} from 'react';

import {
  CheckCircle2,
  CircleAlert,
  Info,
  MessageCircle,
  RotateCcw,
  Send,
  ShieldCheck,
} from 'lucide-react';

import type {
  PilihanLayanan,
} from '@/types/layanan';

/* =========================================================
   CONFIG
========================================================= */

const WHATSAPP_PENGURUS =
  '6285741514010';

const WHATSAPP_MESSAGE =
  'Halo Pengurus Desa Keji, saya ingin menanyakan terkait layanan administrasi melalui Website Desa Keji.';

const WHATSAPP_URL =
  `https://wa.me/${WHATSAPP_PENGURUS}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

/* =========================================================
   TYPES
========================================================= */

interface SidebarLayananProps {
  daftarLayanan:
    PilihanLayanan[];

  /**
   * Mengatur apakah SidebarLayanan memiliki
   * posisi sticky sendiri.
   *
   * Gunakan sticky={false} apabila sidebar
   * ingin mengikuti alur halaman secara normal.
   */
  sticky?: boolean;
}

interface ApiResponse {
  success?: boolean;
  valid?: boolean;
  message?: string;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function SidebarLayanan({
  daftarLayanan,
  sticky = false,
}: SidebarLayananProps) {
  const [
    nik,
    setNik,
  ] = useState('');

  const [
    noWa,
    setNoWa,
  ] = useState('');

  const [
    layananId,
    setLayananId,
  ] = useState('');

  const [
    isNikVerified,
    setIsNikVerified,
  ] = useState(false);

  const [
    isVerifying,
    setIsVerifying,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    isSuccess,
    setIsSuccess,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  /* =======================================================
     RESET
  ======================================================= */

  const resetForm = () => {
    setNik('');
    setNoWa('');
    setLayananId('');
    setIsNikVerified(false);
    setErrorMessage('');
  };

  /* =======================================================
     RESET SETELAH BERHASIL
  ======================================================= */

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    const timeout =
      window.setTimeout(
        () => {
          resetForm();
          setIsSuccess(false);
        },
        5000
      );

    return () => {
      window.clearTimeout(
        timeout
      );
    };
  }, [isSuccess]);

  /* =======================================================
     FORMAT NIK
  ======================================================= */

  const formatNik = (
    value: string
  ) => {
    return value
      .replace(
        /\D/g,
        ''
      )
      .slice(
        0,
        16
      );
  };

  const maskNik = (
    value: string
  ) => {
    if (
      value.length !==
      16
    ) {
      return value;
    }

    return `${value.slice(
      0,
      4
    )}********${value.slice(
      -4
    )}`;
  };

  /* =======================================================
     VERIFIKASI NIK
  ======================================================= */

  const handleVerifikasiNik =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      setErrorMessage('');

      if (
        !/^\d{16}$/.test(
          nik
        )
      ) {
        setErrorMessage(
          'NIK harus terdiri dari tepat 16 angka.'
        );

        return;
      }

      setIsVerifying(
        true
      );

      try {
        const response =
          await fetch(
            '/api/warga/verifikasi',
            {
              method:
                'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify(
                  {
                    nik,
                  }
                ),
            }
          );

        const result =
          (await response.json()) as ApiResponse;

        if (
          !response.ok ||
          !result.valid
        ) {
          throw new Error(
            result.message ??
              'NIK tidak dapat diverifikasi.'
          );
        }

        setIsNikVerified(
          true
        );
      } catch (error) {
        const message =
          error instanceof
          Error
            ? error.message
            : 'Terjadi kesalahan saat memverifikasi NIK.';

        setErrorMessage(
          message
        );

        setIsNikVerified(
          false
        );
      } finally {
        setIsVerifying(
          false
        );
      }
    };

  /* =======================================================
     KIRIM PERMOHONAN
  ======================================================= */

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      setErrorMessage('');

      if (
        !isNikVerified
      ) {
        setErrorMessage(
          'Verifikasi NIK terlebih dahulu.'
        );

        return;
      }

      if (
        !layananId
      ) {
        setErrorMessage(
          'Pilih layanan terlebih dahulu.'
        );

        return;
      }

      if (
        !noWa.trim()
      ) {
        setErrorMessage(
          'Nomor WhatsApp wajib diisi.'
        );

        return;
      }

      setIsSubmitting(
        true
      );

      try {
        const response =
          await fetch(
            '/api/permohonan',
            {
              method:
                'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify(
                  {
                    nik,

                    noWa:
                      noWa.trim(),

                    layananId:
                      Number(
                        layananId
                      ),
                  }
                ),
            }
          );

        const result =
          (await response.json()) as ApiResponse;

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ??
              'Permohonan gagal dikirim.'
          );
        }

        setIsSuccess(
          true
        );
      } catch (error) {
        const message =
          error instanceof
          Error
            ? error.message
            : 'Terjadi kesalahan saat mengirim permohonan.';

        setErrorMessage(
          message
        );
      } finally {
        setIsSubmitting(
          false
        );
      }
    };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-emerald-700 bg-emerald-800 shadow-lg ${
        sticky
          ? 'sticky top-24'
          : 'relative'
      }`}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="relative overflow-hidden bg-emerald-600 p-5 text-center">
        <h3 className="relative z-10 text-xl font-extrabold text-white">
          Layanan Cepat
        </h3>

        <div className="absolute -bottom-8 -left-4 h-12 w-[120%] rotate-3 rounded-t-[50%] bg-emerald-800" />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-20 p-6">
        {/* ===================================================
            INFORMASI
        =================================================== */}

        <div className="mb-6 flex items-start gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-[11px] font-bold text-emerald-800 shadow-inner">
          <Info
            size={16}
            className="mt-0.5 shrink-0 text-emerald-600"
          />

          <p className="leading-5">
            Masukkan NIK yang
            terdaftar pada data warga
            Desa Keji. Setelah
            terverifikasi, pilih
            layanan yang ingin
            diajukan.
          </p>
        </div>

        {/* ===================================================
            ERROR
        =================================================== */}

        {errorMessage && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
            <CircleAlert
              size={17}
              className="mt-0.5 shrink-0"
            />

            <p className="leading-6">
              {
                errorMessage
              }
            </p>
          </div>
        )}

        {/* ===================================================
            BERHASIL
        =================================================== */}

        {isSuccess ? (
          <div className="rounded-xl border border-emerald-100 bg-white px-6 py-10 text-center shadow-inner">
            <CheckCircle2
              size={48}
              className="mx-auto mb-4 text-emerald-500"
            />

            <h4 className="mb-2 text-lg font-extrabold text-emerald-800">
              Permohonan Berhasil
              Dikirim
            </h4>

            <p className="text-sm font-medium leading-relaxed text-gray-600">
              Permohonan sudah masuk
              ke sistem desa. Admin
              akan menghubungi Anda
              melalui nomor WhatsApp
              yang telah dimasukkan.
            </p>
          </div>
        ) : !isNikVerified ? (
          /* =================================================
             FORM VERIFIKASI NIK
          ================================================= */

          <form
            onSubmit={
              handleVerifikasiNik
            }
            className="space-y-4"
          >
            {/* NIK */}

            <div>
              <label
                htmlFor="sidebar-nik"
                className="mb-1.5 block text-sm font-semibold text-white"
              >
                NIK Warga
              </label>

              <input
                id="sidebar-nik"
                name="nik"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={16}
                required
                value={nik}
                onChange={(
                  event
                ) => {
                  setNik(
                    formatNik(
                      event.target
                        .value
                    )
                  );

                  setErrorMessage(
                    ''
                  );
                }}
                className="w-full rounded-lg border-none bg-white p-2.5 text-sm font-medium text-gray-800 shadow-inner outline-none transition focus:ring-2 focus:ring-amber-400"
                placeholder="Masukkan 16 digit NIK"
              />

              <p className="mt-1.5 text-xs leading-5 text-emerald-100">
                NIK digunakan untuk
                memeriksa status warga
                Desa Keji.
              </p>
            </div>

            {/* Tombol Verifikasi */}

            <button
              type="submit"
              disabled={
                isVerifying ||
                nik.length !==
                  16
              }
              className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 font-extrabold text-white shadow-md transition-all ${
                isVerifying ||
                nik.length !==
                  16
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-amber-500 hover:-translate-y-0.5 hover:bg-amber-600 hover:shadow-lg'
              }`}
            >
              <ShieldCheck
                size={17}
              />

              {isVerifying
                ? 'Memverifikasi NIK...'
                : 'Verifikasi NIK'}
            </button>

            {/* ===============================================
                KONTAK WHATSAPP PENGURUS DESA
            =============================================== */}

            <div className="pt-1">
              <div className="mb-2 flex items-center gap-3">
                <div className="h-px flex-1 bg-emerald-600/70" />

                <span className="text-[9px] font-extrabold uppercase tracking-[0.13em] text-emerald-200">
                  Butuh Bantuan?
                </span>

                <div className="h-px flex-1 bg-emerald-600/70" />
              </div>

              <a
                href={
                  WHATSAPP_URL
                }
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:bg-emerald-950/50"
              >
                {/* Icon WA */}

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-md transition group-hover:scale-105">
                  <MessageCircle
                    size={20}
                    strokeWidth={
                      2.5
                    }
                  />
                </div>

                {/* Informasi */}

                <div className="min-w-0 flex-1">
  <p className="text-[10px] font-extrabold uppercase tracking-[0.11em] text-emerald-200">
    Kontak WhatsApp
  </p>

  <p className="mt-0.5 text-sm font-extrabold text-white">
    Pengurus Desa
  </p>
</div>

                <span className="shrink-0 rounded-lg bg-white/10 px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-wide text-emerald-100 transition group-hover:bg-[#25D366] group-hover:text-white">
                  Chat
                </span>
              </a>

              <p className="mt-2 text-center text-[10px] font-medium leading-4 text-emerald-100/70">
                Hubungi pengurus desa
                apabila mengalami
                kendala pada layanan
                atau verifikasi NIK.
              </p>
            </div>
          </form>
        ) : (
          /* =================================================
             FORM PERMOHONAN
          ================================================= */

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-4"
          >
            {/* Status NIK */}

            <div className="rounded-lg border border-emerald-200 bg-white p-3">
              <div className="flex items-start gap-2">
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-emerald-500"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-emerald-800">
                    NIK terverifikasi
                  </p>

                  <p className="mt-0.5 text-xs font-medium text-gray-500">
                    {
                      maskNik(
                        nik
                      )
                    }
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    resetForm
                  }
                  className="flex shrink-0 items-center gap-1 text-xs font-bold text-gray-500 transition hover:text-emerald-700"
                >
                  <RotateCcw
                    size={13}
                  />

                  Ganti
                </button>
              </div>
            </div>

            {/* Nomor WhatsApp */}

            <div>
              <label
                htmlFor="sidebar-no-wa"
                className="mb-1.5 block text-sm font-semibold text-white"
              >
                Nomor WhatsApp
              </label>

              <input
                id="sidebar-no-wa"
                name="no-wa"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                value={noWa}
                onChange={(
                  event
                ) => {
                  setNoWa(
                    event.target
                      .value
                  );

                  setErrorMessage(
                    ''
                  );
                }}
                className="w-full rounded-lg border-none bg-white p-2.5 text-sm font-medium text-gray-800 shadow-inner outline-none transition focus:ring-2 focus:ring-amber-400"
                placeholder="Contoh: 081234567890"
              />
            </div>

            {/* Pilihan layanan */}

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <label
                  htmlFor="sidebar-layanan"
                  className="block text-sm font-semibold text-white"
                >
                  Pilih Layanan
                </label>

                <span className="rounded-full border border-emerald-300/20 bg-white/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-emerald-100">
                  {
                    daftarLayanan.length
                  }{' '}
                  pilihan
                </span>
              </div>

              <select
                id="sidebar-layanan"
                name="layanan"
                required
                value={
                  layananId
                }
                onChange={(
                  event
                ) => {
                  setLayananId(
                    event.target
                      .value
                  );

                  setErrorMessage(
                    ''
                  );
                }}
                disabled={
                  daftarLayanan.length ===
                  0
                }
                className="min-h-12 w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-inner outline-none transition focus:ring-4 focus:ring-amber-400/30 disabled:cursor-not-allowed disabled:bg-slate-200"
              >
                <option
                  value=""
                  disabled
                >
                  {daftarLayanan.length ===
                  0
                    ? 'Layanan belum tersedia'
                    : '-- Pilih Jenis Pelayanan --'}
                </option>

                {daftarLayanan.map(
                  (
                    layanan,
                    index
                  ) => (
                    <option
                      key={
                        layanan.id
                      }
                      value={
                        layanan.id
                      }
                    >
                      {index +
                        1}
                      .{' '}
                      {
                        layanan.nama
                      }
                    </option>
                  )
                )}
              </select>

              <p className="mt-2 text-xs font-medium leading-5 text-emerald-100/80">
                Pilih jenis pelayanan
                sesuai dokumen atau
                keperluan administrasi
                yang akan diajukan.
              </p>
            </div>

            {/* Tombol Kirim */}

            <button
              type="submit"
              disabled={
                isSubmitting ||
                daftarLayanan.length ===
                  0
              }
              className={`mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-3 font-extrabold text-white shadow-md transition-all ${
                isSubmitting ||
                daftarLayanan.length ===
                  0
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-amber-500 hover:-translate-y-0.5 hover:bg-amber-600 hover:shadow-lg'
              }`}
            >
              <Send
                size={16}
              />

              {isSubmitting
                ? 'Mengirim Permohonan...'
                : 'Kirim Permohonan'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}