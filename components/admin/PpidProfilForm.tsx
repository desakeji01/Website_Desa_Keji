// components/admin/PpidProfilForm.tsx

'use client';

import {
  Building2,
  LoaderCircle,
  Save,
} from 'lucide-react';

import {
  useFormStatus,
} from 'react-dom';

import {
  simpanProfilPpidAction,
} from '@/app/admin/ppid/actions';

import type {
  ProfilPpid,
} from '@/types/ppid';

interface PpidProfilFormProps {
  profil:
    ProfilPpid;
}

/* =========================================================
   FORM
========================================================= */

export default function PpidProfilForm({
  profil,
}: PpidProfilFormProps) {
  return (
    <form
      action={
        simpanProfilPpidAction
      }
      className="space-y-6 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm md:p-8"
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex items-start gap-3 border-b border-slate-100 pb-5">
        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
          <Building2
            size={24}
          />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900">
            Profil PPID
          </h2>

          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            Informasi ini
            ditampilkan pada halaman
            profil PPID Desa Keji.
          </p>
        </div>
      </div>

      {/* ===================================================
          INPUT
      =================================================== */}

      <div className="grid gap-5 md:grid-cols-2">
        {/* JUDUL */}

        <div className="md:col-span-2">
          <label
            htmlFor="profil_judul"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Judul Profil
          </label>

          <input
            id="profil_judul"
            name="profil_judul"
            type="text"
            required
            minLength={3}
            maxLength={180}
            defaultValue={
              profil.judul
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* DESKRIPSI */}

        <div className="md:col-span-2">
          <label
            htmlFor="profil_deskripsi"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Deskripsi PPID
          </label>

          <textarea
            id="profil_deskripsi"
            name="profil_deskripsi"
            rows={6}
            required
            minLength={20}
            maxLength={5000}
            defaultValue={
              profil.deskripsi
            }
            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium leading-relaxed text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* EMAIL */}

        <div>
          <label
            htmlFor="profil_email"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Email PPID
          </label>

          <input
            id="profil_email"
            name="profil_email"
            type="email"
            maxLength={150}
            defaultValue={
              profil.email ??
              ''
            }
            placeholder="ppid@desakeji.id"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* TELEPON */}

        <div>
          <label
            htmlFor="profil_telepon"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Nomor Telepon
          </label>

          <input
            id="profil_telepon"
            name="profil_telepon"
            type="tel"
            maxLength={20}
            defaultValue={
              profil.telepon ??
              ''
            }
            placeholder="081234567890"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* ALAMAT */}

        <div className="md:col-span-2">
          <label
            htmlFor="profil_alamat"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Alamat Sekretariat
          </label>

          <textarea
            id="profil_alamat"
            name="profil_alamat"
            rows={3}
            required
            minLength={5}
            maxLength={1000}
            defaultValue={
              profil.alamat ??
              ''
            }
            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* JAM LAYANAN */}

        <div className="md:col-span-2">
          <label
            htmlFor="profil_jam_layanan"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            Jam Pelayanan
          </label>

          <input
            id="profil_jam_layanan"
            name="profil_jam_layanan"
            type="text"
            required
            minLength={5}
            maxLength={180}
            defaultValue={
              profil.jam_layanan ??
              ''
            }
            placeholder="Senin–Kamis 08.00–15.00 WIB"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* AKTIF */}

        <label className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 md:col-span-2">
          <input
            name="profil_aktif"
            type="checkbox"
            value="true"
            defaultChecked={
              profil.aktif
            }
            className="mt-0.5 h-4 w-4 rounded border-emerald-300 text-emerald-700"
          />

          <span>
            <span className="block text-sm font-bold text-emerald-900">
              Tampilkan profil PPID
            </span>

            <span className="mt-1 block text-xs text-emerald-700">
              Profil PPID akan
              ditampilkan pada
              halaman publik.
            </span>
          </span>
        </label>
      </div>

      {/* ===================================================
          SUBMIT
      =================================================== */}

      <div className="flex justify-end border-t border-slate-100 pt-6">
        <SubmitButton />
      </div>
    </form>
  );
}

/* =========================================================
   SUBMIT BUTTON
========================================================= */

function SubmitButton() {
  const {
    pending,
  } =
    useFormStatus();

  return (
    <button
      type="submit"
      disabled={
        pending
      }
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-emerald-800 disabled:cursor-wait disabled:bg-slate-400 md:w-auto"
    >
      {pending ? (
        <>
          <LoaderCircle
            size={18}
            className="animate-spin"
          />

          Menyimpan...
        </>
      ) : (
        <>
          <Save
            size={18}
          />

          Simpan Profil PPID
        </>
      )}
    </button>
  );
}