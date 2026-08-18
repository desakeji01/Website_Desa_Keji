// components/admin/ProfilDesaForm.tsx

'use client';

import {
  useActionState,
  useMemo,
  useState,
} from 'react';

import {
  Building2,
  CheckCircle2,
  LoaderCircle,
  Save,
  TriangleAlert,
  Users,
} from 'lucide-react';

import {
  updateProfilDesaAction,
} from '@/app/admin/pengaturan/actions';

import type {
  ProfilDesa,
  ProfilDesaActionState,
} from '@/types/profil-desa';

interface ProfilDesaFormProps {
  initialData: ProfilDesa;
}

const initialState: ProfilDesaActionState = {
  error: null,
  success: null,
};

export default function ProfilDesaForm({
  initialData,
}: ProfilDesaFormProps) {
  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    updateProfilDesaAction,
    initialState
  );

  const [
    lakiLaki,
    setLakiLaki,
  ] = useState(
    String(
      initialData.jumlah_laki_laki
    )
  );

  const [
    perempuan,
    setPerempuan,
  ] = useState(
    String(
      initialData.jumlah_perempuan
    )
  );

  const totalPenduduk =
    useMemo(() => {
      return (
        Number(lakiLaki || 0) +
        Number(perempuan || 0)
      );
    }, [
      lakiLaki,
      perempuan,
    ]);

  const formatNumber = (
    value: number
  ) =>
    new Intl.NumberFormat(
      'id-ID'
    ).format(value);

  return (
    <form
      action={formAction}
      className="space-y-6"
    >
      {state.error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          <TriangleAlert
            size={19}
            className="mt-0.5 shrink-0"
          />

          <p>{state.error}</p>
        </div>
      )}

      {state.success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          <CheckCircle2
            size={19}
            className="mt-0.5 shrink-0"
          />

          <p>{state.success}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Data Penduduk */}
        <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="flex items-center gap-4 border-b border-emerald-100 bg-emerald-50/60 p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white">
              <Users size={21} />
            </div>

            <div>
              <h2 className="font-black text-slate-900">
                Data Penduduk
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Jumlah penduduk berdasarkan
                jenis kelamin.
              </p>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <NumberInput
              id="jumlah_laki_laki"
              label="Jumlah Laki-laki"
              value={lakiLaki}
              onChange={setLakiLaki}
            />

            <NumberInput
              id="jumlah_perempuan"
              label="Jumlah Perempuan"
              value={perempuan}
              onChange={setPerempuan}
            />

            <div className="rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 p-5 text-white">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-emerald-200">
                Total Penduduk
              </p>

              <p className="mt-2 text-3xl font-black">
                {formatNumber(
                  totalPenduduk
                )}
              </p>

              <p className="mt-1 text-xs text-emerald-100/70">
                Dihitung otomatis dari
                laki-laki dan perempuan.
              </p>
            </div>
          </div>
        </section>

        {/* Wilayah Administrasi */}
        <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="flex items-center gap-4 border-b border-emerald-100 bg-emerald-50/60 p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white">
              <Building2 size={21} />
            </div>

            <div>
              <h2 className="font-black text-slate-900">
                Wilayah Administrasi
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Data dusun, RW, dan RT
                Desa Keji.
              </p>
            </div>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <NumberInput
              id="jumlah_dusun"
              label="Jumlah Dusun"
              defaultValue={
                initialData.jumlah_dusun
              }
            />

            <NumberInput
              id="jumlah_rw"
              label="Jumlah RW"
              defaultValue={
                initialData.jumlah_rw
              }
            />

            <NumberInput
              id="jumlah_rt"
              label="Jumlah RT"
              defaultValue={
                initialData.jumlah_rt
              }
            />

            <NumberInput
              id="tahun_data"
              label="Tahun Data"
              defaultValue={
                initialData.tahun_data
              }
              min={2000}
              max={2100}
            />
          </div>
        </section>
      </div>

      <div className="flex justify-end rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
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
              Simpan Perubahan
            </>
          )}
        </button>
      </div>
    </form>
  );
}

interface NumberInputProps {
  id: string;
  label: string;
  defaultValue?: number;
  value?: string;
  onChange?: (
    value: string
  ) => void;
  min?: number;
  max?: number;
}

function NumberInput({
  id,
  label,
  defaultValue,
  value,
  onChange,
  min = 0,
  max,
}: NumberInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-extrabold text-slate-700"
      >
        {label}
      </label>

      <input
        id={id}
        name={id}
        type="number"
        required
        min={min}
        max={max}
        value={value}
        defaultValue={
          value === undefined
            ? defaultValue
            : undefined
        }
        onChange={
          onChange
            ? (event) =>
                onChange(
                  event.target.value
                )
            : undefined
        }
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}