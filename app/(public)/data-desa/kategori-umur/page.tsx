// app/(public)/data-desa/kategori-umur/page.tsx

import {
  Baby,
  CalendarDays,
  CircleAlert,
  Database,
  Info,
  PieChart,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';

import SidebarLayanan from '@/components/SidebarLayanan';
import SidebarTilikArkeji from '@/components/SidebarTilikArkeji';
import KategoriUmurCharts, {
  type StatistikKategoriUmur,
} from '@/components/public/KategoriUmurCharts';
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { PilihanLayanan } from '@/types/layanan';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface WargaKategoriUmurRow {
  tanggal_lahir: string | null;
  jenis_kelamin: 'L' | 'P' | null;
}

interface LayananRow {
  id: number | string | null;
  nama: string | null;
  slug: string | null;
}

interface ProfilDesaRow {
  tahun_data: number | string | null;
}

interface DefinisiKategoriUmur {
  key: string;
  label: string;
  rentang: string;
  min: number;
  max: number;
}

interface TanggalSekarang {
  tahun: number;
  bulan: number;
  tanggal: number;
}

const DEFINISI_KATEGORI: DefinisiKategoriUmur[] = [
  {
    key: 'balita',
    label: 'Balita',
    rentang: '0–4 tahun',
    min: 0,
    max: 4,
  },
  {
    key: 'anak',
    label: 'Anak-anak',
    rentang: '5–14 tahun',
    min: 5,
    max: 14,
  },
  {
    key: 'dewasa',
    label: 'Dewasa',
    rentang: '15–44 tahun',
    min: 15,
    max: 44,
  },
  {
    key: 'pra-lansia',
    label: 'Tua / Pra-Lansia',
    rentang: '45–59 tahun',
    min: 45,
    max: 59,
  },
  {
    key: 'lansia',
    label: 'Lansia',
    rentang: '60 tahun ke atas',
    min: 60,
    max: 150,
  },
];

function safeString(value: unknown): string {
  return String(value ?? '').trim();
}

async function getAllWargaKategoriUmur(): Promise<WargaKategoriUmurRow[]> {
  const result: WargaKategoriUmurRow[] = [];
  const pageSize = 1000;
  let from = 0;

  while (true) {
    const { data, error } = await supabaseAdmin
      .from('warga')
      .select(`
        tanggal_lahir,
        jenis_kelamin
      `)
      .eq('aktif', true)
      .range(from, from + pageSize - 1);

    if (error) {
      console.error('Gagal mengambil data kategori umur:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      return result;
    }

    const rows = (data ?? []) as WargaKategoriUmurRow[];
    result.push(...rows);

    if (rows.length < pageSize) {
      break;
    }

    from += pageSize;
  }

  return result;
}

function getTanggalJakarta(): TanggalSekarang {
  const bagian = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  function getValue(type: 'year' | 'month' | 'day'): number {
    return Number(
      bagian.find((item) => item.type === type)?.value ?? 0
    );
  }

  return {
    tahun: getValue('year'),
    bulan: getValue('month'),
    tanggal: getValue('day'),
  };
}

function isTanggalValid(
  tahun: number,
  bulan: number,
  tanggal: number
): boolean {
  if (
    !Number.isInteger(tahun) ||
    !Number.isInteger(bulan) ||
    !Number.isInteger(tanggal) ||
    tahun < 1800 ||
    bulan < 1 ||
    bulan > 12 ||
    tanggal < 1 ||
    tanggal > 31
  ) {
    return false;
  }

  const date = new Date(Date.UTC(tahun, bulan - 1, tanggal));

  return (
    date.getUTCFullYear() === tahun &&
    date.getUTCMonth() === bulan - 1 &&
    date.getUTCDate() === tanggal
  );
}

function hitungUmur(
  tanggalLahir: string | null,
  tanggalSekarang: TanggalSekarang
): number | null {
  const value = safeString(tanggalLahir);

  if (!value) {
    return null;
  }

  const bagian = value.split('-');

  if (bagian.length !== 3) {
    return null;
  }

  const tahunLahir = Number(bagian[0]);
  const bulanLahir = Number(bagian[1]);
  const hariLahir = Number(bagian[2]);

  if (!isTanggalValid(tahunLahir, bulanLahir, hariLahir)) {
    return null;
  }

  let umur = tanggalSekarang.tahun - tahunLahir;

  const belumUlangTahun =
    tanggalSekarang.bulan < bulanLahir ||
    (tanggalSekarang.bulan === bulanLahir &&
      tanggalSekarang.tanggal < hariLahir);

  if (belumUlangTahun) {
    umur -= 1;
  }

  if (umur < 0 || umur > 150) {
    return null;
  }

  return umur;
}

function kelompokkanKategoriUmur(
  wargaRows: WargaKategoriUmurRow[]
): StatistikKategoriUmur[] {
  const tanggalSekarang = getTanggalJakarta();

  const statistik: StatistikKategoriUmur[] = DEFINISI_KATEGORI.map(
    (kategori) => ({
      key: kategori.key,
      label: kategori.label,
      rentang: kategori.rentang,
      jumlah: 0,
      lakiLaki: 0,
      perempuan: 0,
    })
  );

  const belumMengisi: StatistikKategoriUmur = {
    key: 'belum-mengisi',
    label: 'Belum Mengisi',
    rentang: 'Tanggal lahir belum tersedia atau tidak valid',
    jumlah: 0,
    lakiLaki: 0,
    perempuan: 0,
  };

  wargaRows.forEach((warga) => {
    const umur = hitungUmur(warga.tanggal_lahir, tanggalSekarang);
    let target: StatistikKategoriUmur;

    if (umur === null) {
      target = belumMengisi;
    } else {
      const index = DEFINISI_KATEGORI.findIndex(
        (kategori) => umur >= kategori.min && umur <= kategori.max
      );

      target = index >= 0 ? statistik[index] : belumMengisi;
    }

    target.jumlah += 1;

    if (warga.jenis_kelamin === 'L') {
      target.lakiLaki += 1;
    }

    if (warga.jenis_kelamin === 'P') {
      target.perempuan += 1;
    }
  });

  return [...statistik, belumMengisi];
}

function formatAngka(value: number): string {
  return new Intl.NumberFormat('id-ID').format(
    Number.isFinite(value) ? value : 0
  );
}

export default async function KategoriUmurPage() {
  const [wargaRows, layananResult, profilResult] = await Promise.all([
    getAllWargaKategoriUmur(),

    supabaseAdmin
      .from('layanan')
      .select(`
        id,
        nama,
        slug
      `)
      .eq('aktif', true)
      .order('urutan', {
        ascending: true,
        nullsFirst: false,
      })
      .order('nama', {
        ascending: true,
      }),

    supabaseAdmin
      .from('profil_desa')
      .select('tahun_data')
      .eq('profil_key', 'utama')
      .maybeSingle(),
  ]);

  if (layananResult.error) {
    console.error('Gagal mengambil daftar layanan:', {
      message: layananResult.error.message,
      code: layananResult.error.code,
      details: layananResult.error.details,
      hint: layananResult.error.hint,
    });
  }

  if (profilResult.error) {
    console.error('Gagal mengambil tahun data:', {
      message: profilResult.error.message,
      code: profilResult.error.code,
      details: profilResult.error.details,
      hint: profilResult.error.hint,
    });
  }

  const daftarLayanan: PilihanLayanan[] = (
    (layananResult.data ?? []) as LayananRow[]
  )
    .map((layanan) => {
      const id = Number(layanan.id);
      const nama = safeString(layanan.nama);
      const slug = safeString(layanan.slug);

      return {
        id,
        nama,
        slug,
      };
    })
    .filter(
      (layanan) =>
        Number.isInteger(layanan.id) &&
        layanan.id > 0 &&
        layanan.nama.length > 0 &&
        layanan.slug.length > 0
    );

  const profilData = profilResult.data as ProfilDesaRow | null;
  const tahunDataRaw = Number(profilData?.tahun_data);

  const tahunData =
    Number.isInteger(tahunDataRaw) &&
    tahunDataRaw >= 1900 &&
    tahunDataRaw <= 2200
      ? tahunDataRaw
      : new Date().getFullYear();

  const statistik = kelompokkanKategoriUmur(wargaRows);
  const totalPenduduk = wargaRows.length;

  const belumMengisi =
    statistik.find((item) => item.key === 'belum-mengisi')?.jumlah ?? 0;

  const dataUmurTerisi = Math.max(totalPenduduk - belumMengisi, 0);

  const kategoriTerbanyak = statistik
    .filter((item) => item.key !== 'belum-mengisi')
    .reduce<StatistikKategoriUmur | null>((terbesar, item) => {
      if (!terbesar || item.jumlah > terbesar.jumlah) {
        return item;
      }

      return terbesar;
    }, null);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 px-6 py-8 text-white shadow-lg sm:px-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
              backgroundSize: '25px 25px',
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[52px] border-white/[0.04]"
          />

          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <Baby size={24} />
            </div>

            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
              Data Desa Keji
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Kategori Umur Penduduk
            </h1>

            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80 sm:text-base">
              Informasi kelompok umur penduduk Desa Keji mulai dari balita,
              anak-anak, dewasa, pra-lansia, hingga lansia pada tahun{' '}
              {tahunData}.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <HeaderBadge label={`${formatAngka(totalPenduduk)} penduduk`} />
              <HeaderBadge
                label={`${formatAngka(dataUmurTerisi)} data umur terisi`}
              />
              <HeaderBadge
                label={`${formatAngka(belumMengisi)} belum lengkap`}
              />
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <main className="min-w-0 space-y-7 lg:w-2/3">
            <section className="grid gap-4 sm:grid-cols-2">
              <StatistikCard
                label="Total Penduduk"
                value={formatAngka(totalPenduduk)}
                description="Seluruh warga aktif"
                icon={Users}
              />

              <StatistikCard
                label="Data Umur Terisi"
                value={formatAngka(dataUmurTerisi)}
                description="Tanggal lahir valid"
                icon={CalendarDays}
              />

              <StatistikCard
                label="Belum Mengisi"
                value={formatAngka(belumMengisi)}
                description="Kosong atau tidak valid"
                icon={CircleAlert}
              />

              <StatistikCard
                label="Kategori Terbanyak"
                value={kategoriTerbanyak?.label ?? '-'}
                description={
                  kategoriTerbanyak
                    ? `${formatAngka(kategoriTerbanyak.jumlah)} jiwa`
                    : 'Belum ada data'
                }
                icon={PieChart}
                smallValue
              />
            </section>

            <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
                  <Database size={21} />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Informasi Sistem
                  </p>

                  <h2 className="mt-1 font-black text-emerald-950">
                    Perhitungan Kategori Umur Otomatis
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-emerald-800">
                    Kategori umur dihitung otomatis berdasarkan tanggal lahir
                    warga aktif. Perubahan data melalui halaman administrator
                    akan langsung memengaruhi ringkasan, grafik, dan tabel.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
                  <PieChart size={21} />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Pengelompokan Umur
                  </p>

                  <h2 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
                    Definisi Kategori Umur
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                    Pengelompokan digunakan untuk menyederhanakan persebaran
                    umur penduduk Desa Keji.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {DEFINISI_KATEGORI.map((kategori, index) => (
                  <KategoriInfoCard
                    key={kategori.key}
                    nomor={index + 1}
                    title={kategori.label}
                    rentang={kategori.rentang}
                  />
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-6 flex items-start gap-4 border-b border-emerald-100 pb-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
                  <PieChart size={21} />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Visualisasi Data
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-900">
                    Statistik Kategori Umur Penduduk
                  </h2>

                  <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                    Perbandingan jumlah penduduk berdasarkan kategori umur dan
                    jenis kelamin.
                  </p>
                </div>
              </div>

              <KategoriUmurCharts
                data={statistik}
                totalPenduduk={totalPenduduk}
                tahunData={tahunData}
              />
            </section>

            <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                    Sumber dan Privasi
                  </p>

                  <h2 className="mt-1 font-black text-slate-900">
                    Data Administrasi Warga Desa Keji
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                    Halaman publik hanya menampilkan hasil pengelompokan
                    statistik. Tanggal lahir lengkap, nama, NIK, nomor KK,
                    alamat, dan nomor WhatsApp tidak ditampilkan kepada publik.
                  </p>
                </div>
              </div>
            </section>

            {belumMengisi > 0 && (
              <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                    <Info size={21} />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                      Catatan Data
                    </p>

                    <h2 className="mt-1 font-black text-emerald-950">
                      Terdapat Data yang Belum Lengkap
                    </h2>

                    <p className="mt-2 text-sm font-medium leading-7 text-emerald-800">
                      Sebanyak {formatAngka(belumMengisi)} warga belum mempunyai
                      tanggal lahir yang valid, sehingga dimasukkan ke kategori
                      Belum Mengisi.
                    </p>
                  </div>
                </div>
              </section>
            )}
          </main>

          <aside className="min-w-0 lg:w-1/3">
            <div className="flex flex-col gap-8 lg:sticky lg:top-24">
              <SidebarLayanan daftarLayanan={daftarLayanan} sticky={false} />
              <SidebarTilikArkeji />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function HeaderBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-emerald-50 backdrop-blur">
      {label}
    </span>
  );
}

function StatistikCard({
  label,
  value,
  description,
  icon: Icon,
  smallValue = false,
}: {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  smallValue?: boolean;
}) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-emerald-50"
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
            {label}
          </p>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
            <Icon size={20} />
          </div>
        </div>

        <p
          className={`mt-3 font-black text-slate-900 ${
            smallValue ? 'text-base leading-snug' : 'text-3xl'
          }`}
        >
          {value}
        </p>

        <p className="mt-2 text-xs font-semibold text-slate-500">
          {description}
        </p>
      </div>
    </article>
  );
}

function KategoriInfoCard({
  nomor,
  title,
  rentang,
}: {
  nomor: number;
  title: string;
  rentang: string;
}) {
  return (
    <article className="group flex items-center gap-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm font-black text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
        {String(nomor).padStart(2, '0')}
      </div>

      <div className="min-w-0">
        <h3 className="font-black text-slate-900">{title}</h3>
        <p className="mt-1 text-xs font-semibold text-emerald-700">
          {rentang}
        </p>
      </div>
    </article>
  );
}