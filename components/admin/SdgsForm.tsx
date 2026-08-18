// components/admin/SdgsForm.tsx

'use client';

import {
  useActionState,
} from 'react';

import {
  CircleAlert,
  Gauge,
  LoaderCircle,
  Save,
} from 'lucide-react';

import {
  updateSdgsAction,
} from '@/app/admin/sdgs/actions';

import type {
  SdgsActionState,
  SdgsDesa,
} from '@/types/sdgs';

interface SdgsFormProps {
  daftarSdgs: SdgsDesa[];
  tahunData: number;
}

const initialState:
  SdgsActionState = {
    error: null,
    success: null,
  };

function formatSkor(
  value: number
) {
  return new Intl.NumberFormat(
    'id-ID',
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  ).format(value);
}

export default function SdgsForm({
  daftarSdgs,
  tahunData,
}: SdgsFormProps) {
  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    updateSdgsAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="space-y-6"
    >
      <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <Gauge size={23} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Nilai SDGs Desa
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Masukkan nilai 0
                  sampai 100 untuk
                  setiap tujuan SDGs.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-[180px]">
            <label
              htmlFor="tahun_data"
              className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
            >
              Tahun Data
            </label>

            <input
              id="tahun_data"
              name="tahun_data"
              type="number"
              min={2000}
              max={2100}
              required
              defaultValue={
                tahunData
              }
              disabled={isPending}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
            />
          </div>
        </div>
      </section>

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

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {daftarSdgs.map(
          (item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div
                className="relative flex min-h-[180px] flex-col justify-between overflow-hidden p-5 text-white"
                style={{
                  background: `
                    linear-gradient(
                      135deg,
                      ${item.warna},
                      ${item.warna}CC
                    )
                  `,
                }}
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border-[24px] border-white/10" />

                <div className="relative">
                  <p className="text-5xl font-black leading-none text-white/30">
                    {String(
                      item.id
                    ).padStart(
                      2,
                      '0'
                    )}
                  </p>

                  <h3 className="mt-4 text-lg font-black leading-snug text-white drop-shadow-sm">
                    {item.nama}
                  </h3>
                </div>

                <p className="relative mt-4 text-xs font-bold uppercase tracking-widest text-white/75">
                  Goal SDGs Desa
                </p>
              </div>

              <div className="p-5">
                <label
                  htmlFor={`skor_${item.id}`}
                  className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
                >
                  Nilai Goal{' '}
                  {item.id}
                </label>

                <div className="relative">
                  <input
                    id={`skor_${item.id}`}
                    name={`skor_${item.id}`}
                    type="number"
                    min={0}
                    max={100}
                    step="0.01"
                    required
                    defaultValue={
                      item.skor
                    }
                    disabled={
                      isPending
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-16 text-lg font-black text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
                  />

                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-extrabold text-slate-400">
                    / 100
                  </span>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-xs font-bold text-slate-500">
                    <span>
                      Pencapaian
                    </span>

                    <span>
                      {formatSkor(
                        item.skor
                      )}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width:
                          `${Math.min(
                            Math.max(
                              item.skor,
                              0
                            ),
                            100
                          )}%`,

                        backgroundColor:
                          item.warna,
                      }}
                    />
                  </div>
                </div>
              </div>
            </article>
          )
        )}
      </section>

      <div className="sticky bottom-4 z-20 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-7 py-4 text-sm font-extrabold text-white shadow-xl shadow-emerald-900/20 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
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
              Simpan Seluruh Nilai
            </>
          )}
        </button>
      </div>
    </form>
  );
}