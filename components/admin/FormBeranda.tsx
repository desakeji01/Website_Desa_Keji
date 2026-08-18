// components/admin/FormBeranda.tsx

'use client';

import {
  useActionState,
  type ReactNode,
} from 'react';

import {
  Building2,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Image,
  LoaderCircle,
  MapPinned,
  Megaphone,
  Save,
  Sparkles,
  UserRound,
} from 'lucide-react';

import {
  simpanBerandaAction,
} from '@/app/admin/beranda/actions';

import type {
  BerandaActionState,
  BerandaPublicData,
} from '@/types/beranda';

interface FormBerandaProps {
  initialData:
    BerandaPublicData;
}

const initialState:
  BerandaActionState = {
    success: false,
    message: '',
  };

const inputClassName =
  'h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100';

export default function FormBeranda({
  initialData,
}: FormBerandaProps) {
  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    simpanBerandaAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="space-y-7"
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

      <FormSection
        eyebrow="Tampilan Utama"
        title="Hero Beranda"
        description="Kelola tulisan animasi, lokasi, pencarian, logo, dan gambar latar."
        icon={
          <Sparkles size={23} />
        }
      >
        <div className="grid gap-6 md:grid-cols-2">
          <TextInput
            name="hero_teks_1"
            label="Teks Animasi 1"
            defaultValue={
              initialData.hero_teks_1
            }
            maxLength={100}
            required
          />

          <TextInput
            name="hero_teks_2"
            label="Teks Animasi 2"
            defaultValue={
              initialData.hero_teks_2
            }
            maxLength={100}
            required
          />

          <TextInput
            name="hero_teks_3"
            label="Teks Animasi 3"
            defaultValue={
              initialData.hero_teks_3
            }
            maxLength={100}
            required
          />

          <TextInput
            name="hero_lokasi"
            label="Keterangan Lokasi"
            defaultValue={
              initialData.hero_lokasi
            }
            maxLength={200}
            required
          />

          <div className="md:col-span-2">
            <TextInput
              name="hero_placeholder"
              label="Placeholder Pencarian"
              defaultValue={
                initialData.hero_placeholder
              }
              maxLength={200}
              required
            />
          </div>

          <TextInput
            name="background_url"
            label="Path Gambar Latar"
            defaultValue={
              initialData.background_url
            }
            placeholder="/background.png"
            icon={
              <Image size={17} />
            }
            required
          />

          <TextInput
            name="logo_url"
            label="Path Logo Desa"
            defaultValue={
              initialData.logo_url
            }
            placeholder="/logodesakeji.png"
            icon={
              <Image size={17} />
            }
            required
          />
        </div>
      </FormSection>

      <FormSection
        eyebrow="Pemerintah Desa"
        title="Sambutan Kepala Desa"
        description="Kelola identitas, foto, dan isi sambutan kepala desa."
        icon={
          <UserRound size={23} />
        }
      >
        <div className="grid gap-6 md:grid-cols-2">
          <TextInput
            name="nama_kepala_desa"
            label="Nama Kepala Desa"
            defaultValue={
              initialData.nama_kepala_desa
            }
            maxLength={150}
            required
          />

          <TextInput
            name="jabatan_kepala_desa"
            label="Jabatan"
            defaultValue={
              initialData.jabatan_kepala_desa
            }
            maxLength={150}
            required
          />

          <div className="md:col-span-2">
            <TextInput
              name="foto_kepala_desa_url"
              label="Path Foto Kepala Desa"
              defaultValue={
                initialData.foto_kepala_desa_url
              }
              placeholder="/pakkades.png"
              icon={
                <Image size={17} />
              }
              required
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              name="sambutan_kepala_desa"
              label="Isi Sambutan"
              defaultValue={
                initialData.sambutan_kepala_desa
              }
              rows={9}
              maxLength={3000}
              required
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        eyebrow="Sekilas Desa"
        title="Informasi Berjalan"
        description="Informasi berikut akan bergerak secara horizontal pada beranda publik."
        icon={
          <Megaphone size={23} />
        }
      >
        <div className="grid gap-6 md:grid-cols-2">
          <TextInput
            name="informasi_1"
            label="Informasi 1"
            defaultValue={
              initialData.informasi_1
            }
            maxLength={250}
            required
          />

          <TextInput
            name="informasi_2"
            label="Informasi 2"
            defaultValue={
              initialData.informasi_2
            }
            maxLength={250}
          />

          <TextInput
            name="informasi_3"
            label="Informasi 3"
            defaultValue={
              initialData.informasi_3
            }
            maxLength={250}
          />

          <TextInput
            name="informasi_4"
            label="Informasi 4"
            defaultValue={
              initialData.informasi_4
            }
            maxLength={250}
          />
        </div>
      </FormSection>

      <FormSection
        eyebrow="Lokasi Kantor"
        title="Peta dan Alamat Desa"
        description="Kelola alamat kantor, URL embed Google Maps, dan tautan navigasi."
        icon={
          <MapPinned size={23} />
        }
      >
        <div className="space-y-6">
          <TextArea
            name="alamat_kantor"
            label="Alamat Kantor Desa"
            defaultValue={
              initialData.alamat_kantor
            }
            rows={3}
            maxLength={500}
            required
          />

          <TextArea
            name="maps_embed_url"
            label="URL Embed Google Maps"
            defaultValue={
              initialData.maps_embed_url
            }
            rows={5}
            required
          />

          <TextInput
            name="maps_link_url"
            label="URL Google Maps"
            defaultValue={
              initialData.maps_link_url
            }
            required
          />
        </div>
      </FormSection>

      <FormSection
        eyebrow="Informasi Harian"
        title="Jadwal Salat"
        description="Masukkan waktu menggunakan format 24 jam."
        icon={
          <Clock3 size={23} />
        }
      >
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
          <TextInput
            name="sholat_subuh"
            label="Subuh"
            type="time"
            defaultValue={
              initialData.sholat_subuh
            }
            required
          />

          <TextInput
            name="sholat_dzuhur"
            label="Dzuhur"
            type="time"
            defaultValue={
              initialData.sholat_dzuhur
            }
            required
          />

          <TextInput
            name="sholat_ashar"
            label="Ashar"
            type="time"
            defaultValue={
              initialData.sholat_ashar
            }
            required
          />

          <TextInput
            name="sholat_maghrib"
            label="Maghrib"
            type="time"
            defaultValue={
              initialData.sholat_maghrib
            }
            required
          />

          <TextInput
            name="sholat_isya"
            label="Isya"
            type="time"
            defaultValue={
              initialData.sholat_isya
            }
            required
          />
        </div>
      </FormSection>

      <FormSection
        eyebrow="Pelayanan Publik"
        title="Jam Kerja Kantor"
        description="Atur jam operasional pelayanan Pemerintah Desa Keji."
        icon={
          <Building2 size={23} />
        }
      >
        <div className="grid gap-6 md:grid-cols-3">
          <TextInput
            name="jam_senin_kamis"
            label="Senin–Kamis"
            defaultValue={
              initialData.jam_senin_kamis
            }
            required
          />

          <TextInput
            name="jam_jumat"
            label="Jumat"
            defaultValue={
              initialData.jam_jumat
            }
            required
          />

          <TextInput
            name="jam_akhir_pekan"
            label="Sabtu–Minggu"
            defaultValue={
              initialData.jam_akhir_pekan
            }
            required
          />
        </div>
      </FormSection>

      <div className="sticky bottom-5 z-20 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-7 text-sm font-extrabold text-white shadow-xl shadow-emerald-950/20 transition hover:bg-emerald-800 disabled:cursor-wait disabled:bg-slate-400 sm:w-auto"
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
            : 'Simpan Beranda'}
        </button>
      </div>
    </form>
  );
}

function FormSection({
  eyebrow,
  title,
  description,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_12px_35px_rgba(6,78,59,0.07)]">
      <div className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50/80 to-white px-6 py-5 sm:px-7">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
            {icon}
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
              {eyebrow}
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-900">
              {title}
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-500">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-7">
        {children}
      </div>
    </section>
  );
}

function TextInput({
  name,
  label,
  defaultValue,
  placeholder,
  icon,
  type = 'text',
  required = false,
  maxLength,
}: {
  name: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
  icon?: ReactNode;
  type?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700">
            {icon}
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          required={required}
          maxLength={maxLength}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={`${inputClassName} ${
            icon ? 'pl-11' : ''
          }`}
        />
      </div>
    </div>
  );
}

function TextArea({
  name,
  label,
  defaultValue,
  rows,
  required = false,
  maxLength,
}: {
  name: string;
  label: string;
  defaultValue: string;
  rows: number;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        maxLength={maxLength}
        defaultValue={defaultValue}
        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-7 text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}