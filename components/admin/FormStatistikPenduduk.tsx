// components/admin/FormStatistikPenduduk.tsx

'use client';

import {
  useActionState,
} from 'react';

import {
  CheckCircle2,
  CircleAlert,
  Database,
  House,
  LoaderCircle,
  Mars,
  Save,
  UsersRound,
  Venus,
} from 'lucide-react';

import {
  simpanStatistikPendudukAction,
  type StatistikPendudukActionState,
} from '@/app/admin/data-desa/penduduk/actions';

export interface StatistikPendudukFormData {
  tahunData: number;
  jumlahPenduduk: number;
  jumlahLakiLaki: number;
  jumlahPerempuan: number;
  jumlahKk: number;
  keterangan: string;
  aktif: boolean;
}

interface FormStatistikPendudukProps {
  initialData:
    StatistikPendudukFormData;
}

const initialState:
  StatistikPendudukActionState = {
    success: false,
    message: '',
  };

const inputClassName =
  'h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100';

export default function FormStatistikPenduduk({
  initialData,
}: FormStatistikPendudukProps) {
  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    simpanStatistikPendudukAction,
    initialState
  );

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
              size={20}
              className="mt-0.5 shrink-0"
            />
          ) : (
            <CircleAlert
              size={20}
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
              <Database size={23} />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                Data Beranda
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                Statistik Penduduk
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Data ini hanya digunakan untuk tampilan
                statistik pada beranda publik.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:p-7 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              htmlFor="tahun_data"
              className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500"
            >
              Tahun Data
            </label>

            <input
              id="tahun_data"
              name="tahun_data"
              type="number"
              required
              min={1900}
              max={2100}
              defaultValue={
                initialData.tahunData
              }
              className={inputClassName}
            />

            <p className="mt-2 text-xs font-medium text-slate-400">
              Tahun ini akan ditampilkan sebagai informasi
              sumber data pada beranda.
            </p>
          </div>

          <StatistikInput
            name="jumlah_penduduk"
            label="Jumlah Penduduk"
            defaultValue={
              initialData.jumlahPenduduk
            }
            icon={UsersRound}
          />

          <StatistikInput
            name="jumlah_kk"
            label="Jumlah Kepala Keluarga"
            defaultValue={
              initialData.jumlahKk
            }
            icon={House}
          />

          <StatistikInput
            name="jumlah_laki_laki"
            label="Penduduk Laki-laki"
            defaultValue={
              initialData.jumlahLakiLaki
            }
            icon={Mars}
          />

          <StatistikInput
            name="jumlah_perempuan"
            label="Penduduk Perempuan"
            defaultValue={
              initialData.jumlahPerempuan
            }
            icon={Venus}
          />

          <div className="md:col-span-2">
            <label
              htmlFor="keterangan"
              className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500"
            >
              Keterangan atau Sumber Data
            </label>

            <textarea
              id="keterangan"
              name="keterangan"
              rows={4}
              maxLength={500}
              defaultValue={
                initialData.keterangan
              }
              placeholder="Contoh: Data administrasi kependudukan Desa Keji tahun 2026."
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-200 hover:bg-emerald-50">
              <input
                type="checkbox"
                name="aktif"
                value="true"
                defaultChecked={
                  initialData.aktif
                }
                className="mt-1 h-4 w-4 accent-emerald-700"
              />

              <span>
                <span className="block text-sm font-black text-slate-800">
                  Tampilkan statistik di beranda
                </span>

                <span className="mt-1 block text-xs font-medium leading-5 text-slate-500">
                  Jika dinonaktifkan, komponen statistik
                  penduduk tidak akan muncul pada beranda
                  publik.
                </span>
              </span>
            </label>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-7 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-800 disabled:cursor-wait disabled:bg-slate-400 sm:w-auto"
        >
          {pending ? (
            <LoaderCircle
              size={18}
              className="animate-spin"
            />
          ) : (
            <Save size={18} />
          )}

          {pending
            ? 'Menyimpan...'
            : 'Simpan Statistik'}
        </button>
      </div>
    </form>
  );
}

function StatistikInput({
  name,
  label,
  defaultValue,
  icon: Icon,
}: {
  name: string;
  label: string;
  defaultValue: number;
  icon: typeof UsersRound;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500"
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700"
        />

        <input
          id={name}
          name={name}
          type="number"
          required
          min={0}
          step={1}
          defaultValue={defaultValue}
          className={`${inputClassName} pl-12`}
        />
      </div>
    </div>
  );
}