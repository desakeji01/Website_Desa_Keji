// app/(public)/desa-wisata/hasil-survei/page.tsx

import type { Metadata } from 'next';

import Link from 'next/link';

import {
  BadgeCheck,
  CalendarDays,
  MapPin,
  PieChart,
  Quote,
  Star,
  ThumbsUp,
} from 'lucide-react';

import DashboardSurveiWisata from '@/components/desa-wisata/DashboardSurveiWisata';
import SidebarInformasiWisata from '@/components/desa-wisata/SidebarInformasiWisata';

import { supabaseAdmin } from '@/lib/supabase-admin';

import {
  hitungDashboardSurvei,
  normalizeSurveiRow,
  type SurveiRespon,
} from '@/lib/desa-wisata-survei';

export const metadata: Metadata = {
  title: 'Hasil Survei Wisatawan Desa Keji | SIJI',
  description:
    'Dashboard hasil survei kepuasan dan ulasan wisatawan Desa Wisata Keji.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SURVEY_START_YEAR = 2026;

interface PageProps {
  searchParams: Promise<{
    tahun?: string;
  }>;
}

/* =========================================================
   HELPERS
========================================================= */

function getCurrentYearJakarta() {
  return Number(
    new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    }).format(new Date())
  );
}

function getYearFromDate(value: string) {
  const match = /^(\d{4})-\d{2}-\d{2}$/.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);

  if (
    !Number.isInteger(year) ||
    year < SURVEY_START_YEAR ||
    year > 2100
  ) {
    return null;
  }

  return year;
}

function getAvailableYears(
  responses: SurveiRespon[],
  currentYear: number
) {
  const years = new Set<number>();

  if (currentYear >= SURVEY_START_YEAR) {
    years.add(currentYear);
  }

  for (const item of responses) {
    const year = getYearFromDate(item.tanggalKunjungan);

    if (year !== null) {
      years.add(year);
    }
  }

  return Array.from(years).sort((a, b) => b - a);
}

function resolveSelectedYear(
  rawYear: string | undefined,
  availableYears: number[],
  currentYear: number
) {
  const requestedYear = Number(rawYear);

  if (
    Number.isInteger(requestedYear) &&
    availableYears.includes(requestedYear)
  ) {
    return requestedYear;
  }

  if (availableYears.includes(currentYear)) {
    return currentYear;
  }

  return availableYears[0] ?? currentYear;
}

function formatTanggal(value: string) {
  if (!value) {
    return '-';
  }

  const date = new Date(`${value}T00:00:00+07:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(date);
}

function formatNamaPublik(value: string) {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return 'Wisatawan';
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return `${parts[0]} ${parts
    .slice(1)
    .map((part) => `${part.charAt(0).toUpperCase()}.`)
    .join(' ')}`;
}

function getInitial(value: string) {
  const clean = value.trim();
  return clean ? clean.charAt(0).toUpperCase() : 'W';
}

function getPaketLabel(item: SurveiRespon) {
  if (
    item.paketAktivitas === 'Lainnya' &&
    item.paketLainnya
  ) {
    return item.paketLainnya;
  }

  if (item.paketAktivitas.startsWith('Paket 1')) {
    return 'Sedina Nyawiji';
  }

  if (item.paketAktivitas.startsWith('Paket 2')) {
    return 'Kangen Deso';
  }

  return item.paketAktivitas;
}

function getAverageOverall(responses: SurveiRespon[]) {
  if (responses.length === 0) {
    return 0;
  }

  return (
    responses.reduce(
      (total, item) => total + item.kepuasanKeseluruhan,
      0
    ) / responses.length
  );
}

/* =========================================================
   PAGE
========================================================= */

export default async function HasilSurveiPage({
  searchParams,
}: PageProps) {
  const [params, settingsResult, responsesResult] =
    await Promise.all([
      searchParams,

      supabaseAdmin
        .from('desa_wisata_survei_settings')
        .select('hasil_survei_aktif')
        .eq('setting_key', 'utama')
        .maybeSingle(),

      supabaseAdmin
        .from('desa_wisata_survei_respon')
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
        .eq('valid', true)
        .order('tanggal_kunjungan', {
          ascending: false,
        })
        .order('created_at', {
          ascending: false,
        }),
    ]);

  if (settingsResult.error) {
    console.error(
      'Gagal mengambil settings hasil survei:',
      settingsResult.error
    );
  }

  if (responsesResult.error) {
    console.error(
      'Gagal mengambil hasil survei:',
      responsesResult.error
    );
  }

  const hasilAktif =
    settingsResult.data?.hasil_survei_aktif === undefined ||
    settingsResult.data?.hasil_survei_aktif === null
      ? true
      : Boolean(settingsResult.data.hasil_survei_aktif);

  const responses: SurveiRespon[] = (responsesResult.data ?? [])
    .map(normalizeSurveiRow)
    .filter((item): item is SurveiRespon => item !== null);

  const currentYear = getCurrentYearJakarta();
  const availableYears = getAvailableYears(responses, currentYear);
  const selectedYear = resolveSelectedYear(
    params.tahun,
    availableYears,
    currentYear
  );

  const responsesTahun = responses.filter(
    (item) => getYearFromDate(item.tanggalKunjungan) === selectedYear
  );

  const dashboard = hitungDashboardSurvei(responsesTahun);
  const rataUlasan = getAverageOverall(responsesTahun);

  return (
    <div className="min-h-screen bg-[#f5f2e8]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar */}

          <aside>
            <div className="lg:sticky lg:top-24">
              <SidebarInformasiWisata
                activePath="/desa-wisata/hasil-survei"
              />
            </div>
          </aside>

          {/* Content */}

          <main className="min-w-0">
            {!hasilAktif ? (
              <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                <PieChart
                  size={44}
                  className="mx-auto text-slate-300"
                />

                <h1 className="mt-5 text-xl font-black text-slate-800">
                  Hasil survei belum dipublikasikan
                </h1>

                <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-7 text-slate-500">
                  Dashboard hasil survei wisatawan sedang tidak
                  ditampilkan untuk publik.
                </p>
              </div>
            ) : (
              <div className="space-y-7">
                {/* ===========================================
                    FILTER TAHUN
                =========================================== */}

                <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-sm">
                  <div className="flex flex-col gap-5 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
                        <CalendarDays size={20} />
                      </div>

                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                          Periode Survei
                        </p>

                        <h1 className="mt-1 text-xl font-black text-slate-900">
                          Hasil Survei Tahun {selectedYear}
                        </h1>

                        <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                          Data dikelompokkan otomatis berdasarkan tahun
                          pada tanggal kunjungan wisatawan.
                        </p>
                      </div>
                    </div>

                    <span className="w-fit rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold text-emerald-700">
                      {responsesTahun.length.toLocaleString('id-ID')} respons
                      valid
                    </span>
                  </div>

                  <div className="overflow-x-auto p-4 sm:p-5">
                    <div className="flex min-w-max gap-2">
                      {availableYears.map((year) => (
                        <Link
                          key={year}
                          href={`/desa-wisata/hasil-survei?tahun=${year}`}
                          className={`inline-flex min-h-10 items-center justify-center rounded-xl px-4 text-xs font-extrabold transition ${
                            year === selectedYear
                              ? 'bg-emerald-700 text-white shadow-sm'
                              : 'border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          {year}
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>

                {/* ===========================================
                    DASHBOARD
                =========================================== */}

                <DashboardSurveiWisata
                  dashboard={dashboard}
                  periodeTahun={selectedYear}
                  periodeBerjalan={selectedYear === currentYear}
                />

                {/* ===========================================
                    ULASAN WISATAWAN
                =========================================== */}

                <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                  <div className="grid gap-6 border-b border-slate-100 bg-gradient-to-r from-amber-50 via-white to-white p-6 sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-amber-600">
                        Ulasan Wisatawan
                      </p>

                      <h2 className="mt-2 text-2xl font-black text-slate-900">
                        Pengalaman Pengunjung Tahun {selectedYear}
                      </h2>

                      <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-slate-500">
                        Ulasan berikut berasal dari respons survei yang
                        berstatus valid. Email dan nomor WhatsApp tidak
                        pernah ditampilkan pada halaman publik.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-amber-200 bg-white px-5 py-4 shadow-sm">
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-black text-slate-900">
                          {responsesTahun.length > 0
                            ? rataUlasan.toFixed(1)
                            : '—'}
                        </span>

                        <span className="pb-1 text-sm font-bold text-slate-400">
                          /4
                        </span>
                      </div>

                      <div className="mt-2">
                        <StarRating
                          value={rataUlasan}
                          empty={responsesTahun.length === 0}
                        />
                      </div>

                      <p className="mt-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        {responsesTahun.length.toLocaleString('id-ID')} ulasan
                      </p>
                    </div>
                  </div>

                  {responsesTahun.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                      <Quote
                        size={42}
                        className="mx-auto text-slate-300"
                      />

                      <h3 className="mt-4 text-lg font-black text-slate-800">
                        Belum ada ulasan pada tahun {selectedYear}
                      </h3>

                      <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-6 text-slate-500">
                        Ulasan akan muncul setelah ada respons survei valid
                        dengan tanggal kunjungan pada tahun ini.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-2">
                      {responsesTahun.map((item) => (
                        <ReviewCard
                          key={item.id}
                          item={item}
                        />
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   REVIEW CARD
========================================================= */

function ReviewCard({
  item,
}: {
  item: SurveiRespon;
}) {
  const publicName = formatNamaPublik(item.nama);
  const paket = getPaketLabel(item);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-700 to-teal-600 text-sm font-black text-white shadow-sm">
          {getInitial(publicName)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black text-slate-900">
              {publicName}
            </h3>

            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-extrabold text-emerald-700">
              <BadgeCheck size={11} />
              Respons valid
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold text-slate-400">
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={12} />
              {formatTanggal(item.tanggalKunjungan)}
            </span>

            <span className="inline-flex items-center gap-1">
              <MapPin size={12} />
              {item.asal}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <StarRating value={item.kepuasanKeseluruhan} />

        <span className="text-xs font-black text-slate-700">
          {item.kepuasanKeseluruhan}/4
        </span>

        {item.merekomendasikan && (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-extrabold text-blue-700">
            <ThumbsUp size={11} />
            Merekomendasikan
          </span>
        )}
      </div>

      <div className="mt-5">
        <Quote
          size={20}
          className="text-emerald-200"
        />

        <p className="mt-2 whitespace-pre-line text-sm font-medium leading-7 text-slate-700">
          {item.palingDisukai}
        </p>
      </div>

      {item.saran && (
        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
          <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
            Saran Pengunjung
          </p>

          <p className="mt-2 whitespace-pre-line text-xs font-medium leading-6 text-slate-600">
            {item.saran}
          </p>
        </div>
      )}

      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
        <MiniScore
          label="Kebersihan"
          value={item.kebersihan}
        />

        <MiniScore
          label="Keramahan"
          value={item.keramahan}
        />

        <MiniScore
          label="Fasilitas"
          value={item.fasilitas}
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <span className="text-[10px] font-semibold text-slate-400">
          Aktivitas / paket
        </span>

        <span className="max-w-[65%] text-right text-[10px] font-extrabold text-emerald-700">
          {paket}
        </span>
      </div>
    </article>
  );
}

/* =========================================================
   STAR RATING
========================================================= */

function StarRating({
  value,
  empty = false,
}: {
  value: number;
  empty?: boolean;
}) {
  const rounded = empty
    ? 0
    : Math.max(0, Math.min(4, Math.round(value)));

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={
        empty
          ? 'Belum ada rating'
          : `Rating ${value.toFixed(1)} dari 4`
      }
    >
      {[1, 2, 3, 4].map((star) => (
        <Star
          key={star}
          size={17}
          className={
            star <= rounded
              ? 'fill-amber-400 text-amber-400'
              : 'fill-slate-100 text-slate-200'
          }
        />
      ))}
    </div>
  );
}

/* =========================================================
   MINI SCORE
========================================================= */

function MiniScore({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-emerald-50 px-2 py-3 text-center">
      <p className="text-[8px] font-extrabold uppercase tracking-wide text-emerald-700">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-emerald-950">
        {value}
        <span className="text-[9px] font-semibold text-emerald-600">
          /4
        </span>
      </p>
    </div>
  );
}