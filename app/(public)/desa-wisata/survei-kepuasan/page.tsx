// app/(public)/desa-wisata/survei-kepuasan/page.tsx

import type {
  Metadata,
} from 'next';

import type {
  ReactNode,
} from 'react';

import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Mail,
  Send,
} from 'lucide-react';

import SidebarInformasiWisata from '@/components/desa-wisata/SidebarInformasiWisata';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import {
  ASAL_WISATAWAN_OPTIONS,
  JENIS_KUNJUNGAN_OPTIONS,
  PAKET_WISATA_OPTIONS,
} from '@/lib/desa-wisata-survei';

import {
  kirimSurveiWisataAction,
} from './actions';

export const metadata:
  Metadata = {
  title:
    'Kuesioner Kepuasan Wisatawan Desa Keji | SIJI',

  description:
    'Kuesioner kepuasan wisatawan Desa Wisata Keji.',
};

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

const SURVEY_START_DATE =
  '2026-01-01';

interface PageProps {
  searchParams:
    Promise<{
      success?: string;
      error?: string;
    }>;
}

interface Settings {
  judul: string;
  deskripsi: string;
  surveiAktif: boolean;
}

const fallbackSettings:
  Settings = {
  judul:
    'Kuesioner Kepuasan Wisatawan Desa Keji',

  deskripsi:
    'Terima kasih sudah berkunjung ke Desa Wisata Keji! Kami ingin tahu bagaimana pengalaman Anda hari ini melalui survei singkat ini (kurang dari 3 menit). Masukan Anda akan sangat membantu kami untuk terus meningkatkan kualitas layanan dan pengalaman wisata di Desa Keji.',

  surveiAktif:
    true,
};

function safeString(
  value: unknown
) {
  return String(
    value ?? ''
  ).trim();
}

function normalizeSettings(
  value: unknown
): Settings {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(value)
  ) {
    return fallbackSettings;
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  return {
    judul:
      safeString(
        row.judul
      ) ||
      fallbackSettings.judul,

    deskripsi:
      safeString(
        row.deskripsi
      ) ||
      fallbackSettings.deskripsi,

    surveiAktif:
      row.survei_aktif ===
        null ||
      row.survei_aktif ===
        undefined
        ? true
        : Boolean(
            row.survei_aktif
          ),
  };
}

function getTodayJakarta() {
  const formatter =
    new Intl.DateTimeFormat(
      'en-CA',
      {
        year:
          'numeric',

        month:
          '2-digit',

        day:
          '2-digit',

        timeZone:
          'Asia/Jakarta',
      }
    );

  const parts =
    formatter.formatToParts(
      new Date()
    );

  const year =
    parts.find(
      (part) =>
        part.type ===
        'year'
    )?.value;

  const month =
    parts.find(
      (part) =>
        part.type ===
        'month'
    )?.value;

  const day =
    parts.find(
      (part) =>
        part.type ===
        'day'
    )?.value;

  return `${year}-${month}-${day}`;
}

export default async function SurveiKepuasanPage({
  searchParams,
}: PageProps) {
  const [
    params,
    settingsResult,
  ] =
    await Promise.all([
      searchParams,

      supabaseAdmin
        .from(
          'desa_wisata_survei_settings'
        )
        .select(`
          judul,
          deskripsi,
          survei_aktif
        `)
        .eq(
          'setting_key',
          'utama'
        )
        .maybeSingle(),
    ]);

  if (
    settingsResult.error
  ) {
    console.error(
      'Gagal mengambil pengaturan survei:',
      settingsResult.error
    );
  }

  const settings =
    normalizeSettings(
      settingsResult.data
    );

  const today =
    getTodayJakarta();

  const tahunSurvei =
    Number(
      today.slice(
        0,
        4
      )
    );

  return (
    <div className="min-h-screen bg-[#f5f2e8]">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-700 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',

            backgroundSize:
              '27px 27px',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <ClipboardCheck
              size={24}
            />
          </div>

          <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
            Survei Wisatawan
          </p>

          <h1 className="mt-2 max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            {
              settings.judul
            }
          </h1>

          <p className="mt-5 max-w-4xl text-sm font-medium leading-7 text-emerald-50/80 sm:text-base">
            {
              settings.deskripsi
            }
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold text-emerald-100 backdrop-blur">
            <CalendarDays
              size={14}
            />

            Periode Survei{' '}
            {
              tahunSurvei
            }
          </div>
        </div>
      </section>

      {/* =====================================================
          BODY
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar */}

          <aside>
            <div className="lg:sticky lg:top-24">
              <SidebarInformasiWisata
                activePath="/desa-wisata/survei-kepuasan"
              />
            </div>
          </aside>

          {/* Main */}

          <main className="min-w-0">
            {/* Message */}

            {params.success && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0"
                />

                <div>
                  <p className="text-sm font-extrabold">
                    Survei berhasil
                    dikirim
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {
                      params.success
                    }
                  </p>
                </div>
              </div>
            )}

            {params.error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                {
                  params.error
                }
              </div>
            )}

            {!settings.surveiAktif ? (
              <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                <ClipboardCheck
                  size={43}
                  className="mx-auto text-slate-300"
                />

                <h2 className="mt-5 text-xl font-black text-slate-800">
                  Survei sedang
                  ditutup
                </h2>

                <p className="mx-auto mt-2 max-w-lg text-sm font-medium leading-7 text-slate-500">
                  Pengisian kuesioner
                  kepuasan wisatawan
                  sedang tidak menerima
                  respons baru.
                </p>
              </div>
            ) : (
              <form
                action={
                  kirimSurveiWisataAction
                }
                className="space-y-6"
              >
                {/* Honeypot */}

                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />

                {/* ===========================================
                    BAGIAN 1
                =========================================== */}

                <SurveySection
                  number="01"
                  eyebrow="Data Pengunjung"
                  title="Informasi Kunjungan"
                  description="Ceritakan sedikit tentang kunjungan Anda ke Desa Wisata Keji."
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <InputField
                      name="email"
                      label="Email"
                      type="email"
                      required
                      placeholder="nama@email.com"
                      autoComplete="email"
                    />

                    <InputField
                      name="nama"
                      label="Nama"
                      required
                      placeholder="Masukkan nama Anda"
                      autoComplete="name"
                    />

                    <InputField
                      name="tanggal_kunjungan"
                      label="Tanggal Kunjungan"
                      type="date"
                      required
                      defaultValue={
                        today
                      }
                      min={
                        SURVEY_START_DATE
                      }
                      max={
                        today
                      }
                    />

                    <SelectField
                      name="asal"
                      label="Asal"
                      options={[
                        ...ASAL_WISATAWAN_OPTIONS,
                      ]}
                    />

                    <div className="sm:col-span-2">
                      <SelectField
                        name="jenis_kunjungan"
                        label="Jenis Kunjungan"
                        options={[
                          ...JENIS_KUNJUNGAN_OPTIONS,
                        ]}
                      />

                      <InputField
                        name="jenis_kunjungan_lainnya"
                        label="Jika memilih Lainnya"
                        placeholder="Tuliskan jenis kunjungan lainnya"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <YesNoField
                        name="kunjungan_pertama"
                        label="Apakah ini kunjungan pertama Anda?"
                      />
                    </div>
                  </div>
                </SurveySection>

                {/* ===========================================
                    BAGIAN 2
                =========================================== */}

                <SurveySection
                  number="02"
                  eyebrow="Penilaian Kunjungan"
                  title="Bagaimana pengalaman Anda?"
                  description="Silakan nilai beberapa aspek pelayanan yang Anda rasakan selama kunjungan ini. Setiap penilaian akan menjadi bahan evaluasi untuk menjadi lebih baik."
                >
                  <div>
                    <SelectField
                      name="paket_aktivitas"
                      label="Paket/aktivitas yang diikuti"
                      options={[
                        ...PAKET_WISATA_OPTIONS,
                      ]}
                    />

                    <InputField
                      name="paket_lainnya"
                      label="Jika memilih Lainnya"
                      placeholder="Tuliskan paket atau aktivitas lainnya"
                    />
                  </div>

                  <div className="mt-8 grid gap-7 xl:grid-cols-2">
                    <RatingField
                      name="kebersihan"
                      label="Kebersihan lokasi"
                      required
                    />

                    <RatingField
                      name="keramahan"
                      label="Keramahan pengelola/pemandu"
                      required
                    />

                    <RatingField
                      name="fasilitas"
                      label="Kualitas fasilitas"
                      required
                    />

                    <RatingField
                      name="kesesuaian_ekspektasi"
                      label="Kesesuaian aktivitas dengan ekspektasi"
                    />

                    <RatingField
                      name="kepuasan_keseluruhan"
                      label="Kepuasan keseluruhan hari ini?"
                      required
                    />
                  </div>

                  <div className="mt-8">
                    <YesNoField
                      name="merekomendasikan"
                      label="Apakah Anda akan merekomendasikan ke orang lain?"
                    />
                  </div>
                </SurveySection>

                {/* ===========================================
                    BAGIAN 3
                =========================================== */}

                <SurveySection
                  number="03"
                  eyebrow="Kesan dan Masukan"
                  title="Bantu kami menjadi lebih baik"
                  description="Sebagai bagian terakhir, kami mengundang Anda memberikan kesan dan saran perbaikan."
                >
                  <TextAreaField
                    name="paling_disukai"
                    label="Apa yang paling Anda sukai dari kunjungan ini?"
                    required
                    placeholder="Ceritakan bagian yang paling berkesan..."
                  />

                  <div className="mt-6">
                    <TextAreaField
                      name="saran"
                      label="Ada saran untuk perbaikan?"
                      required
                      placeholder="Tuliskan saran Anda..."
                    />
                  </div>

                  <div className="mt-7">
                    <YesNoField
                      name="boleh_dihubungi"
                      label="Boleh kami hubungi Anda untuk info wisata selanjutnya?"
                    />
                  </div>

                  <div className="mt-6">
                    <InputField
                      name="nomor_wa"
                      label="Jika ya, silakan tuliskan nomor WA Anda"
                      type="tel"
                      placeholder="Contoh: 0857xxxxxxxx"
                      autoComplete="tel"
                    />
                  </div>
                </SurveySection>

                {/* Submit */}

                <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <Mail
                        size={20}
                        className="mt-0.5 shrink-0 text-emerald-700"
                      />

                      <p className="max-w-2xl text-xs font-medium leading-6 text-slate-500">
                        Nama akan ditampilkan
                        secara ringkas pada
                        ulasan publik. Rating,
                        kesan, dan saran dapat
                        ditampilkan setelah
                        respons dinyatakan valid.
                        Email dan nomor WhatsApp
                        tidak akan ditampilkan
                        kepada publik.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-7 text-sm font-extrabold text-white shadow-md transition hover:bg-emerald-800"
                    >
                      <Send
                        size={17}
                      />

                      Kirim Survei
                    </button>
                  </div>
                </div>
              </form>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SECTION
========================================================= */

function SurveySection({
  number,
  eyebrow,
  title,
  description,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  children:
    ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-xs font-black text-white">
            {number}
          </span>

          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">
              {eyebrow}
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
              {title}
            </h2>

            <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-slate-500">
              {
                description
              }
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   INPUT
========================================================= */

function InputField({
  name,
  label,
  type = 'text',
  required = false,
  placeholder,
  defaultValue,
  min,
  max,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  min?: string;
  max?: string;
  autoComplete?: string;
}) {
  return (
    <div className="mt-5 first:mt-0">
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-extrabold text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required={
          required
        }
        placeholder={
          placeholder
        }
        defaultValue={
          defaultValue
        }
        min={min}
        max={max}
        autoComplete={
          autoComplete
        }
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}

/* =========================================================
   SELECT
========================================================= */

function SelectField({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: string[];
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-extrabold text-slate-700"
      >
        {label}

        <span className="ml-1 text-red-500">
          *
        </span>
      </label>

      <select
        id={name}
        name={name}
        required
        defaultValue=""
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      >
        <option
          value=""
          disabled
        >
          -- Pilih --
        </option>

        {options.map(
          (option) => (
            <option
              key={
                option
              }
              value={
                option
              }
            >
              {
                option
              }
            </option>
          )
        )}
      </select>
    </div>
  );
}

/* =========================================================
   RATING
========================================================= */

function RatingField({
  name,
  label,
  required = false,
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  const labels = [
    'Sangat Tidak Puas',
    'Tidak Puas',
    'Puas',
    'Sangat Puas',
  ];

  return (
    <fieldset>
      <legend className="text-sm font-extrabold leading-6 text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </legend>

      <p className="mt-1 text-[10px] font-medium text-slate-400">
        1 = sangat tidak
        puas, 4 = sangat
        puas
      </p>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map(
          (value) => (
            <label
              key={
                value
              }
              className="cursor-pointer"
            >
              <input
                type="radio"
                name={name}
                value={value}
                required={
                  required
                }
                className="peer sr-only"
              />

              <span className="flex min-h-[74px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-2 text-center text-slate-600 transition peer-checked:border-emerald-700 peer-checked:bg-emerald-700 peer-checked:text-white">
                <strong className="text-xl font-black">
                  {value}
                </strong>

                <span className="mt-1 hidden text-[8px] font-bold leading-3 sm:block">
                  {
                    labels[
                      value -
                        1
                    ]
                  }
                </span>
              </span>
            </label>
          )
        )}
      </div>
    </fieldset>
  );
}

/* =========================================================
   YES NO
========================================================= */

function YesNoField({
  name,
  label,
}: {
  name: string;
  label: string;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-extrabold leading-6 text-slate-700">
        {label}

        <span className="ml-1 text-red-500">
          *
        </span>
      </legend>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <RadioCard
          name={name}
          value="ya"
          label="Ya"
        />

        <RadioCard
          name={name}
          value="tidak"
          label="Tidak"
        />
      </div>
    </fieldset>
  );
}

function RadioCard({
  name,
  value,
  label,
}: {
  name: string;
  value: string;
  label: string;
}) {
  return (
    <label className="cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        required
        className="peer sr-only"
      />

      <span className="flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-extrabold text-slate-600 transition peer-checked:border-emerald-700 peer-checked:bg-emerald-700 peer-checked:text-white">
        {label}
      </span>
    </label>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function TextAreaField({
  name,
  label,
  placeholder,
  required = false,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-extrabold text-slate-700"
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
        required={
          required
        }
        rows={5}
        maxLength={2000}
        placeholder={
          placeholder
        }
        className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}