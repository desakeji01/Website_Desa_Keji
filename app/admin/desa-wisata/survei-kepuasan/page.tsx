// app/admin/desa-wisata/survei-kepuasan/page.tsx

import Link from 'next/link';

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  Eye,
  EyeOff,
  Mail,
  Save,
  Trash2,
} from 'lucide-react';

import {
  redirect,
} from 'next/navigation';

import DashboardSurveiWisata from '@/components/desa-wisata/DashboardSurveiWisata';

import {
  createClient,
} from '@/lib/server';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import {
  hitungDashboardSurvei,
  normalizeSurveiRow,
  type SurveiRespon,
} from '@/lib/desa-wisata-survei';

import {
  hapusResponSurveiAction,
  simpanPengaturanSurveiAction,
  toggleValidResponSurveiAction,
} from './actions';

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

const ADMIN_PATH =
  '/admin/desa-wisata/survei-kepuasan';

interface PageProps {
  searchParams:
    Promise<{
      success?: string;
      error?: string;
      tahun?: string;
    }>;
}

interface Settings {
  judul: string;

  deskripsi: string;

  surveiAktif:
    boolean;

  hasilSurveiAktif:
    boolean;

  updatedAt: string;
}

const fallbackSettings:
  Settings = {
  judul:
    'Kuesioner Kepuasan Wisatawan Desa Keji',

  deskripsi:
    'Terima kasih sudah berkunjung ke Desa Wisata Keji! Kami ingin tahu bagaimana pengalaman Anda hari ini melalui survei singkat ini (kurang dari 3 menit). Masukan Anda akan sangat membantu kami untuk terus meningkatkan kualitas layanan dan pengalaman wisata di Desa Keji.',

  surveiAktif:
    true,

  hasilSurveiAktif:
    true,

  updatedAt:
    '',
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

    hasilSurveiAktif:
      row.hasil_survei_aktif ===
        null ||
      row.hasil_survei_aktif ===
        undefined
        ? true
        : Boolean(
            row.hasil_survei_aktif
          ),

    updatedAt:
      safeString(
        row.updated_at
      ),
  };
}

function formatTanggal(
  value: string
) {
  if (!value) {
    return '-';
  }

  const date =
    new Date(
      `${value}T00:00:00+07:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day:
        '2-digit',

      month:
        'long',

      year:
        'numeric',

      timeZone:
        'Asia/Jakarta',
    }
  ).format(date);
}

function formatDateTime(
  value: string
) {
  if (!value) {
    return 'Belum diperbarui';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return 'Belum diperbarui';
  }

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day:
        '2-digit',

      month:
        'long',

      year:
        'numeric',

      hour:
        '2-digit',

      minute:
        '2-digit',

      timeZone:
        'Asia/Jakarta',
    }
  ).format(date);
}

function getAverage(
  item:
    SurveiRespon
) {
  const values = [
    item.kebersihan,
    item.keramahan,
    item.fasilitas,
    item.kepuasanKeseluruhan,
  ];

  if (
    item.kesesuaianEkspektasi !==
    null
  ) {
    values.push(
      item.kesesuaianEkspektasi
    );
  }

  return (
    values.reduce(
      (
        sum,
        value
      ) =>
        sum +
        value,
      0
    ) /
    values.length
  ).toFixed(1);
}


const SURVEY_START_YEAR =
  2026;

function getCurrentYearJakarta() {
  return Number(
    new Intl.DateTimeFormat(
      'en-US',
      {
        year:
          'numeric',

        timeZone:
          'Asia/Jakarta',
      }
    ).format(
      new Date()
    )
  );
}

function getYearFromDate(
  value:
    string
) {
  const match =
    /^(\d{4})-\d{2}-\d{2}$/.exec(
      value
    );

  if (!match) {
    return null;
  }

  const year =
    Number(
      match[1]
    );

  if (
    !Number.isInteger(
      year
    ) ||
    year <
      SURVEY_START_YEAR ||
    year > 2100
  ) {
    return null;
  }

  return year;
}

function getAvailableYears(
  responses:
    SurveiRespon[],
  currentYear:
    number
) {
  const years =
    new Set<number>();

  if (
    currentYear >=
    SURVEY_START_YEAR
  ) {
    years.add(
      currentYear
    );
  }

  for (
    const item of responses
  ) {
    const year =
      getYearFromDate(
        item.tanggalKunjungan
      );

    if (
      year !== null
    ) {
      years.add(
        year
      );
    }
  }

  return Array.from(
    years
  ).sort(
    (first, second) =>
      second - first
  );
}

function resolveSelectedYear(
  rawYear:
    string | undefined,
  availableYears:
    number[],
  currentYear:
    number
) {
  const requestedYear =
    Number(
      rawYear
    );

  if (
    Number.isInteger(
      requestedYear
    ) &&
    availableYears.includes(
      requestedYear
    )
  ) {
    return requestedYear;
  }

  if (
    availableYears.includes(
      currentYear
    )
  ) {
    return currentYear;
  }

  return (
    availableYears[0] ??
    currentYear
  );
}

export default async function AdminSurveiKepuasanPage({
  searchParams,
}: PageProps) {
  /* =======================================================
     AUTH
  ======================================================= */

  const supabase =
    await createClient();

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      '/login'
    );
  }

  /* =======================================================
     DATA
  ======================================================= */

  const [
    params,
    settingsResult,
    responsesResult,
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
          survei_aktif,
          hasil_survei_aktif,
          updated_at
        `)
        .eq(
          'setting_key',
          'utama'
        )
        .maybeSingle(),

      supabaseAdmin
        .from(
          'desa_wisata_survei_respon'
        )
        .select(`
          id,
          email,
          nama,
          tanggal_kunjungan,
          asal,
          jenis_kunjungan,
          jenis_kunjungan_lainnya,
          kunjungan_pertama,
          paket_aktivitas,
          paket_lainnya,
          kebersihan,
          keramahan,
          fasilitas,
          kesesuaian_ekspektasi,
          kepuasan_keseluruhan,
          merekomendasikan,
          paling_disukai,
          saran,
          boleh_dihubungi,
          nomor_wa,
          valid,
          created_at
        `)
        .order(
          'created_at',
          {
            ascending:
              false,
          }
        ),
    ]);

  if (
    settingsResult.error
  ) {
    console.error(
      'Gagal mengambil pengaturan survei:',
      settingsResult.error
    );
  }

  if (
    responsesResult.error
  ) {
    console.error(
      'Gagal mengambil respons survei:',
      responsesResult.error
    );
  }

  const settings =
    normalizeSettings(
      settingsResult.data
    );

  const responses:
    SurveiRespon[] =
    (
      responsesResult.data ??
      []
    )
      .map(
        normalizeSurveiRow
      )
      .filter(
        (
          item
        ): item is SurveiRespon =>
          item !== null
      );

  const currentYear =
    getCurrentYearJakarta();

  const availableYears =
    getAvailableYears(
      responses,
      currentYear
    );

  const selectedYear =
    resolveSelectedYear(
      params.tahun,
      availableYears,
      currentYear
    );

  const responsesTahun =
    responses.filter(
      (item) =>
        getYearFromDate(
          item.tanggalKunjungan
        ) ===
        selectedYear
    );

  const validResponses =
    responsesTahun.filter(
      (item) =>
        item.valid
    );

  const dashboard =
    hitungDashboardSurvei(
      validResponses
    );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="mx-auto max-w-[1500px] space-y-8">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-7 text-white shadow-xl">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',

            backgroundSize:
              '26px 26px',
          }}
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <ClipboardCheck
                size={27}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                Desa Wisata
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                Survei Kepuasan
                Wisatawan
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                Kelola publikasi
                kuesioner, validasi
                respons wisatawan, dan
                pantau hasil survei
                Desa Wisata Keji.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/desa-wisata/survei-kepuasan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white transition hover:bg-white/15"
            >
              Form Publik

              <ExternalLink
                size={16}
              />
            </Link>

            <Link
              href={`/desa-wisata/hasil-survei?tahun=${selectedYear}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-900 transition hover:bg-emerald-50"
            >
              Hasil Survei

              <ExternalLink
                size={16}
              />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          MESSAGE
      ===================================================== */}

      {params.success && (
        <Message
          type="success"
          text={
            params.success
          }
        />
      )}

      {params.error && (
        <Message
          type="error"
          text={
            params.error
          }
        />
      )}

      {settingsResult.error && (
        <Message
          type="error"
          text="Pengaturan survei gagal dimuat. Pastikan tabel Supabase sudah dibuat."
        />
      )}

      {/* =====================================================
          SETTINGS
      ===================================================== */}

      <form
        action={
          simpanPengaturanSurveiAction
        }
        className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <input
          type="hidden"
          name="tahun"
          value={
            selectedYear
          }
        />

        <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-white px-6 py-5 sm:px-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
            Pengaturan
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-900">
            Publikasi Kuesioner
          </h2>

          <p className="mt-2 text-xs font-medium text-slate-400">
            Terakhir diperbarui:{' '}
            {formatDateTime(
              settings.updatedAt
            )}
          </p>
        </div>

        <div className="grid gap-5 p-6 sm:p-7">
          <div>
            <label
              htmlFor="judul"
              className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
            >
              Judul Kuesioner
            </label>

            <input
              id="judul"
              name="judul"
              required
              defaultValue={
                settings.judul
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="deskripsi"
              className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
            >
              Deskripsi
            </label>

            <textarea
              id="deskripsi"
              name="deskripsi"
              required
              rows={5}
              defaultValue={
                settings.deskripsi
              }
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-7 text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SettingCheckbox
              name="survei_aktif"
              label="Aktifkan pengisian survei"
              description="Wisatawan dapat mengirim respons baru melalui halaman survei."
              checked={
                settings.surveiAktif
              }
            />

            <SettingCheckbox
              name="hasil_survei_aktif"
              label="Tampilkan hasil survei"
              description="Dashboard hasil survei dapat dilihat oleh masyarakat."
              checked={
                settings.hasilSurveiAktif
              }
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800 sm:w-auto"
            >
              <Save
                size={17}
              />

              Simpan Pengaturan
            </button>
          </div>
        </div>
      </form>

      {/* =====================================================
          FILTER TAHUN
      ===================================================== */}

      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <CalendarDays
                size={20}
              />
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                Periode Data
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                Survei Tahun{' '}
                {
                  selectedYear
                }
              </h2>

              <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                Tahun ditentukan otomatis dari tanggal kunjungan wisatawan.
              </p>
            </div>
          </div>

          <p className="text-xs font-semibold text-slate-500">
            {
              responsesTahun.length
            }{' '}
            respons tahun ini ·{' '}
            {
              responses.length
            }{' '}
            seluruh tahun
          </p>
        </div>

        <div className="overflow-x-auto p-4 sm:p-5">
          <div className="flex min-w-max gap-2">
            {availableYears.map(
              (year) => (
                <Link
                  key={
                    year
                  }
                  href={`${ADMIN_PATH}?tahun=${year}`}
                  className={`inline-flex min-h-10 items-center justify-center rounded-xl px-4 text-xs font-extrabold transition ${
                    year ===
                    selectedYear
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  {
                    year
                  }
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          DASHBOARD
      ===================================================== */}

      <section>
        <div className="mb-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-emerald-700">
            Statistik
          </p>

          <h2 className="mt-1 text-2xl font-black text-slate-900">
            Dashboard Hasil Survei{' '}
            {
              selectedYear
            }
          </h2>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Hanya respons berstatus valid pada periode yang dipilih yang masuk ke perhitungan.
          </p>
        </div>

        <DashboardSurveiWisata
          dashboard={
            dashboard
          }
          showHero={
            false
          }
          periodeTahun={
            selectedYear
          }
          periodeBerjalan={
            selectedYear ===
            currentYear
          }
        />
      </section>

      {/* =====================================================
          RESPONSES
      ===================================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6 sm:p-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
            Data Survei
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-900">
            Respons Wisatawan
          </h2>

          <p className="mt-2 text-sm font-medium text-slate-500">
            {
              validResponses.length
            }{' '}
            respons valid dari{' '}
            {
              responsesTahun.length
            }{' '}
            total respons pada tahun{' '}
            {
              selectedYear
            }.
          </p>
        </div>

        {responsesTahun.length ===
        0 ? (
          <div className="px-6 py-16 text-center">
            <ClipboardCheck
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-black text-slate-700">
              Belum ada respons
            </h3>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Belum ada respons survei dengan tanggal kunjungan pada tahun{' '}
              {
                selectedYear
              }.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {responsesTahun.map(
              (
                item,
                index
              ) => (
                <ResponseCard
                  key={
                    item.id
                  }
                  item={
                    item
                  }
                  number={
                    index +
                    1
                  }
                  tahun={
                    selectedYear
                  }
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   RESPONSE CARD
========================================================= */

function ResponseCard({
  item,
  number,
  tahun,
}: {
  item:
    SurveiRespon;

  number:
    number;

  tahun:
    number;
}) {
  const jenis =
    item.jenisKunjungan ===
      'Lainnya' &&
    item.jenisKunjunganLainnya
      ? item.jenisKunjunganLainnya
      : item.jenisKunjungan;

  const paket =
    item.paketAktivitas ===
      'Lainnya' &&
    item.paketLainnya
      ? item.paketLainnya
      : item.paketAktivitas;

  return (
    <article
      className={`p-5 sm:p-6 ${
        item.valid
          ? 'bg-white'
          : 'bg-slate-50/80'
      }`}
    >
      <div className="grid gap-5 xl:grid-cols-[54px_minmax(0,1fr)_165px]">
        {/* Number */}

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-xs font-black text-emerald-700">
          {String(
            number
          ).padStart(
            2,
            '0'
          )}
        </div>

        {/* Main */}

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black text-slate-900">
              {
                item.nama
              }
            </h3>

            <span
              className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase ${
                item.valid
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {item.valid
                ? 'Valid'
                : 'Diabaikan'}
            </span>
          </div>

          {/* Email */}

          <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Mail
              size={14}
              className="shrink-0 text-emerald-700"
            />

            <span className="break-all">
              {
                item.email
              }
            </span>
          </div>

          {/* Meta */}

          <div className="mt-4 grid gap-2 text-xs font-medium text-slate-500 sm:grid-cols-2 lg:grid-cols-3">
            <p>
              <strong className="text-slate-700">
                Tanggal:
              </strong>{' '}
              {formatTanggal(
                item.tanggalKunjungan
              )}
            </p>

            <p>
              <strong className="text-slate-700">
                Asal:
              </strong>{' '}
              {
                item.asal
              }
            </p>

            <p>
              <strong className="text-slate-700">
                Jenis:
              </strong>{' '}
              {jenis}
            </p>

            <p>
              <strong className="text-slate-700">
                Pertama kali:
              </strong>{' '}
              {item.kunjunganPertama
                ? 'Ya'
                : 'Tidak'}
            </p>

            <p className="sm:col-span-2">
              <strong className="text-slate-700">
                Paket:
              </strong>{' '}
              {paket}
            </p>
          </div>

          {/* Ratings */}

          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <MiniRating
              label="Kebersihan"
              value={
                item.kebersihan
              }
            />

            <MiniRating
              label="Keramahan"
              value={
                item.keramahan
              }
            />

            <MiniRating
              label="Fasilitas"
              value={
                item.fasilitas
              }
            />

            <MiniRating
              label="Ekspektasi"
              value={
                item.kesesuaianEkspektasi
              }
            />

            <MiniRating
              label="Kepuasan"
              value={
                item.kepuasanKeseluruhan
              }
            />
          </div>

          {/* Feedback */}

          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            <FeedbackBox
              title="Paling Disukai"
              content={
                item.palingDisukai
              }
            />

            <FeedbackBox
              title="Saran"
              content={
                item.saran
              }
            />
          </div>

          {/* Contact */}

          <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-600">
              Rekomendasi:{' '}
              <strong
                className={
                  item.merekomendasikan
                    ? 'text-emerald-700'
                    : 'text-red-600'
                }
              >
                {item.merekomendasikan
                  ? 'Ya'
                  : 'Tidak'}
              </strong>
            </p>

            <p className="mt-1 text-xs font-semibold text-slate-600">
              Bersedia dihubungi:{' '}
              <strong>
                {item.bolehDihubungi
                  ? 'Ya'
                  : 'Tidak'}
              </strong>
            </p>

            {item.bolehDihubungi &&
              item.nomorWa && (
                <p className="mt-1 text-xs font-semibold text-slate-600">
                  WhatsApp:{' '}
                  <strong className="text-emerald-700">
                    {
                      item.nomorWa
                    }
                  </strong>
                </p>
              )}
          </div>
        </div>

        {/* Actions */}

        <div className="space-y-3">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-700">
              Rata-rata Nilai
            </p>

            <p className="mt-2 text-2xl font-black text-emerald-950">
              {getAverage(
                item
              )}

              <span className="ml-1 text-xs font-semibold text-emerald-600">
                /4
              </span>
            </p>
          </div>

          <form
            action={
              toggleValidResponSurveiAction
            }
          >
            <input
              type="hidden"
              name="id"
              value={
                item.id
              }
            />

            <input
              type="hidden"
              name="tahun"
              value={
                tahun
              }
            />

            <input
              type="hidden"
              name="valid"
              value={
                item.valid
                  ? 'false'
                  : 'true'
              }
            />

            <button
              type="submit"
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700"
            >
              {item.valid ? (
                <>
                  <EyeOff
                    size={15}
                  />

                  Abaikan
                </>
              ) : (
                <>
                  <Eye
                    size={15}
                  />

                  Validasi
                </>
              )}
            </button>
          </form>

          <form
            action={
              hapusResponSurveiAction
            }
          >
            <input
              type="hidden"
              name="id"
              value={
                item.id
              }
            />

            <input
              type="hidden"
              name="tahun"
              value={
                tahun
              }
            />

            <button
              type="submit"
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-extrabold text-red-700 transition hover:bg-red-100"
            >
              <Trash2
                size={15}
              />

              Hapus
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   MINI RATING
========================================================= */

function MiniRating({
  label,
  value,
}: {
  label: string;

  value:
    | number
    | null;
}) {
  return (
    <div className="rounded-xl bg-emerald-50 px-3 py-3 text-center">
      <p className="text-[9px] font-extrabold uppercase tracking-wide text-emerald-700">
        {label}
      </p>

      <p className="mt-1 font-black text-emerald-950">
        {value ??
          '—'}

        {value !==
          null && (
          <span className="text-[10px] font-semibold text-emerald-600">
            /4
          </span>
        )}
      </p>
    </div>
  );
}

/* =========================================================
   FEEDBACK
========================================================= */

function FeedbackBox({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <p className="mt-2 whitespace-pre-line text-xs font-medium leading-6 text-slate-600">
        {content}
      </p>
    </div>
  );
}

/* =========================================================
   SETTING CHECKBOX
========================================================= */

function SettingCheckbox({
  name,
  label,
  description,
  checked,
}: {
  name: string;
  label: string;
  description: string;
  checked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={
          checked
        }
        className="mt-1 h-4 w-4 shrink-0 accent-emerald-700"
      />

      <span>
        <span className="block text-sm font-extrabold text-slate-700">
          {label}
        </span>

        <span className="mt-1 block text-xs font-medium leading-5 text-slate-500">
          {description}
        </span>
      </span>
    </label>
  );
}

/* =========================================================
   MESSAGE
========================================================= */

function Message({
  type,
  text,
}: {
  type:
    | 'success'
    | 'error';

  text: string;
}) {
  const success =
    type ===
    'success';

  const Icon =
    success
      ? CheckCircle2
      : AlertCircle;

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 ${
        success
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-red-200 bg-red-50 text-red-700'
      }`}
    >
      <Icon
        size={20}
        className="mt-0.5 shrink-0"
      />

      <p className="text-sm font-semibold">
        {text}
      </p>
    </div>
  );
}