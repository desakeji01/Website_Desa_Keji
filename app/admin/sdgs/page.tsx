// app/admin/sdgs/page.tsx

import {
  BarChart3,
  CalendarDays,
  Gauge,
  Target,
} from 'lucide-react';

import SdgsForm from '@/components/admin/SdgsForm';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  SdgsDesa,
} from '@/types/sdgs';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

function normalizeSdgs(
  data: unknown
): SdgsDesa[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(
    (item) => {
      const row =
        item as Record<
          string,
          unknown
        >;

      return {
        id:
          Number(row.id),

        nama:
          String(
            row.nama ?? ''
          ),

        skor:
          Number(
            row.skor ?? 0
          ),

        warna:
          String(
            row.warna ??
              '#047857'
          ),

        tahun_data:
          Number(
            row.tahun_data ??
              new Date()
                .getFullYear()
          ),

        aktif:
          Boolean(
            row.aktif
          ),

        updated_at:
          String(
            row.updated_at ??
              ''
          ),
      };
    }
  );
}

function formatSkor(
  value: number
) {
  return new Intl.NumberFormat(
    'id-ID',
    {
      maximumFractionDigits: 2,
    }
  ).format(value);
}

export default async function AdminSdgsPage() {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from('sdgs_desa')
    .select(`
      id,
      nama,
      skor,
      warna,
      tahun_data,
      aktif,
      updated_at
    `)
    .order('id', {
      ascending: true,
    });

  if (error) {
    console.error(
      'Gagal mengambil data SDGs:',
      {
        message:
          error.message,
        code:
          error.code,
        details:
          error.details,
        hint:
          error.hint,
      }
    );
  }

  const daftarSdgs =
    normalizeSdgs(data);

  const tahunData =
    daftarSdgs[0]
      ?.tahun_data ??
    new Date().getFullYear();

  const rataRata =
    daftarSdgs.length > 0
      ? daftarSdgs.reduce(
          (
            total,
            item
          ) =>
            total +
            item.skor,
          0
        ) /
        daftarSdgs.length
      : 0;

  const skorTertinggi =
    daftarSdgs.length > 0
      ? Math.max(
          ...daftarSdgs.map(
            (item) =>
              item.skor
          )
        )
      : 0;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-600">
          Pembangunan Desa
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
          Pengelolaan SDGs Desa
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
          Kelola skor 18 tujuan
          pembangunan berkelanjutan
          Desa Keji yang akan
          ditampilkan pada halaman
          publik.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatistikCard
          label="Jumlah Goal"
          value="18"
          description="Tujuan SDGs Desa"
          icon={Target}
        />

        <StatistikCard
          label="Skor Rata-rata"
          value={formatSkor(
            rataRata
          )}
          description="Dari skala 0–100"
          icon={Gauge}
        />

        <StatistikCard
          label="Skor Tertinggi"
          value={formatSkor(
            skorTertinggi
          )}
          description="Pencapaian terbaik"
          icon={BarChart3}
        />

        <StatistikCard
          label="Tahun Data"
          value={String(
            tahunData
          )}
          description="Periode penilaian"
          icon={CalendarDays}
        />
      </section>

      {daftarSdgs.length === 0 ? (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
          <h2 className="font-black text-amber-900">
            Data SDGs belum tersedia
          </h2>

          <p className="mt-2 text-sm text-amber-700">
            Jalankan SQL seed 18
            tujuan SDGs terlebih
            dahulu.
          </p>
        </section>
      ) : (
        <SdgsForm
          daftarSdgs={
            daftarSdgs
          }
          tahunData={
            tahunData
          }
        />
      )}
    </div>
  );
}

function StatistikCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: typeof Target;
}) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-emerald-50" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs font-semibold text-emerald-700">
            {description}
          </p>
        </div>

        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
          <Icon size={24} />
        </div>
      </div>
    </article>
  );
}