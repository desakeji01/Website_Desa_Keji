// app/login/page.tsx

'use client';

import {
  useState,
  type FormEvent,
} from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Mail,
  Lock,
  LogIn,
  ArrowLeft,
  ShieldCheck,
  CircleAlert,
  LoaderCircle,
} from 'lucide-react';

import { createClient } from '@/lib/client';

const supabase = createClient();

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState('');

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const {
        data,
        error,
      } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error(
          'Supabase Auth Error:',
          error.code,
          error.message
        );

        if (
          error.code === 'invalid_credentials'
        ) {
          throw new Error(
            'Email atau kata sandi yang dimasukkan tidak benar.'
          );
        }

        if (
          error.code === 'email_not_confirmed'
        ) {
          throw new Error(
            'Email admin belum dikonfirmasi di Supabase.'
          );
        }

        if (
          error.code === 'over_request_rate_limit'
        ) {
          throw new Error(
            'Terlalu banyak percobaan login. Tunggu beberapa saat lalu coba kembali.'
          );
        }

        throw new Error(error.message);
      }

      if (!data.user || !data.session) {
        throw new Error(
          'Akun berhasil diperiksa, tetapi sesi login tidak berhasil dibuat.'
        );
      }

      /*
       * replace digunakan agar pengguna tidak kembali
       * ke halaman login ketika menekan tombol Back.
       */
      router.replace('/admin');

      /*
       * Memuat ulang Server Component agar layout admin
       * membaca cookie sesi Supabase yang baru.
       */
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat proses login.';

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-slate-50">
      {/* Background Aksen Hijau */}
      <div className="absolute left-0 top-0 h-64 w-full rounded-b-[20%] bg-emerald-800 shadow-lg md:rounded-b-[50%]" />

      {/* Dekorasi Background */}
      <div className="pointer-events-none absolute -right-24 top-16 h-64 w-64 rounded-full border-[45px] border-emerald-700/40" />

      <div className="pointer-events-none absolute -left-24 bottom-10 h-64 w-64 rounded-full bg-emerald-100/60 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-md px-4 sm:px-6">
        {/* Tombol Kembali */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-100 drop-shadow-md transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Kembali ke Beranda
        </Link>

        {/* Kartu Login */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-emerald-950/10">
          {/* Header Kartu */}
          <div className="border-b border-gray-100 bg-emerald-50/50 p-6 text-center md:p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-100 bg-white shadow-sm">
              <ShieldCheck
                size={32}
                className="text-emerald-600"
              />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-gray-800">
              Portal Admin
            </h1>

            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-emerald-600">
              Desa Keji – Kab. Semarang
            </p>
          </div>

          {/* Form Login */}
          <div className="p-6 md:p-8">
            {errorMessage && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                <CircleAlert
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <p>{errorMessage}</p>
              </div>
            )}

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Email Administrator
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Mail
                      size={18}
                      className="text-gray-400"
                    />
                  </div>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    disabled={isLoading}
                    value={email}
                    onChange={(event) => {
                      setEmail(
                        event.target.value
                      );

                      if (errorMessage) {
                        setErrorMessage('');
                      }
                    }}
                    className="w-full rounded-xl border border-gray-200 bg-slate-50 p-3 pl-10 text-sm font-medium text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                    placeholder="Masukkan email admin"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Kata Sandi
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Lock
                      size={18}
                      className="text-gray-400"
                    />
                  </div>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                    value={password}
                    onChange={(event) => {
                      setPassword(
                        event.target.value
                      );

                      if (errorMessage) {
                        setErrorMessage('');
                      }
                    }}
                    className="w-full rounded-xl border border-gray-200 bg-slate-50 p-3 pl-10 text-sm font-medium text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                    placeholder="Masukkan kata sandi"
                  />
                </div>
              </div>

              {/* Tombol Login */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !email.trim() ||
                    !password
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none disabled:hover:translate-y-0"
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                      Memverifikasi Akun...
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      Masuk ke Dashboard
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer Kartu */}
          <div className="border-t border-gray-100 bg-gray-50 p-4 text-center">
            <p className="text-[11px] font-semibold text-gray-500">
              Sistem Informasi Desa Keji
              &copy; 2026
              <br />
              Hanya untuk pengelola yang sah.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}