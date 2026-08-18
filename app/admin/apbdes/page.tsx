// app/admin/apbdes/page.tsx

import {
  BarChart3,
  CalendarDays,
  FileText,
  Landmark,
} from 'lucide-react';

import type {
  LucideIcon,
} from 'lucide-react';

import ApbdesForm from '@/components/admin/ApbdesForm';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import {
  TAHUN_APBDES,
} from '@/types/apbdes';

import type {
  ApbdesRealisasi,
  TahunApbdes,
} from '@/types/apbdes';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

function normalizeRow(
  row: Record<
    string,
    unknown
  >
): ApbdesRealisasi {
  const tahun =
    Number(
      row.tahun
    ) as TahunApbdes;

  return {
    id:
      String(
        row.id ?? ''
      ),

    tahun,

    judul:
      String(
        row.judul ??
          `Realisasi APBDes Desa Keji Tahun ${tahun}`
      ),

    deskripsi:
      row.deskripsi
        ? String(
            row.deskripsi
          )
        : null,

    anggaran_pendapatan:
      Number(
        row.anggaran_pendapatan ??
          0
      ),

    realisasi_pendapatan:
      Number(
        row.realisasi_pendapatan ??
          0
      ),

    anggaran_belanja:
      Number(
        row.anggaran_belanja ??
          0
      ),

    realisasi_belanja:
      Number(
        row.realisasi_belanja ??
          0
      ),

    anggaran_pembiayaan:
      Number(
        row.anggaran_pembiayaan ??
          0
      ),

    realisasi_pembiayaan:
      Number(
        row.realisasi_pembiayaan ??
          0
      ),

    dokumen_url:
      row.dokumen_url
        ? String(
            row.dokumen_url
          )
        : null,

    dokumen_path:
      row.dokumen_path
        ? String(
            row.dokumen_path
          )
        : null,

    infografis_url:
      row.infografis_url
        ? String(
            row.infografis_url
          )
        : null,

    infografis_path:
      row.infografis_path
        ? String(
            row.infografis_path
          )
        : null,

    aktif:
      Boolean(
        row.aktif
      ),

    created_at:
      String(
        row.created_at ?? ''
      ),

    updated_at:
      String(
        row.updated_at ?? ''
      ),
  };
}

function createFallback(
  tahun: TahunApbdes
): ApbdesRealisasi {
  return {
    id: '',
    tahun,

    judul:
      `Realisasi APBDes Desa Keji Tahun ${tahun}`,

    deskripsi:
      `Informasi anggaran dan realisasi APBDes Desa Keji Tahun ${tahun}.`,

    anggaran_pendapatan:
      0,

    realisasi_pendapatan:
      0,

    anggaran_belanja:
      0,

    realisasi_belanja:
      0,

    anggaran_pembiayaan:
      0,

    realisasi_pembiayaan:
      0,

    dokumen_url:
      null,

    dokumen_path:
      null,

    infografis_url:
      null,

    infografis_path:
      null,

    aktif: false,

    created_at: '',
    updated_at: '',
  };
}

export default async function AdminApbdesPage() {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from(
      'apbdes_realisasi'
    )
    .select(`
      id,
      tahun,
      judul,
      deskripsi,
      anggaran_pendapatan,
      realisasi_pendapatan,
      anggaran_belanja,
      realisasi_belanja,
      anggaran_pembiayaan,
      realisasi_pembiayaan,
      dokumen_url,
      dokumen_path,
      infografis_url,
      infografis_path,
      aktif,
      created_at,
      updated_at
    `)
    .order('tahun', {
      ascending: false,
    });

  if (error) {
    console.error(
      'Gagal mengambil data APBDes:',
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

  const normalized =
    (
      (data ?? []) as Record<
        string,
        unknown
      >[]
    ).map(normalizeRow);

  const dataMap =
    new Map(
      normalized.map(
        (item) => [
          item.tahun,
          item,
        ]
      )
    );

  const daftarApbdes =
    TAHUN_APBDES
      .map(
        (tahun) =>
          dataMap.get(tahun) ??
          createFallback(tahun)
      )
      .sort(
        (a, b) =>
          b.tahun -
          a.tahun
      );

  const jumlahAktif =
    daftarApbdes.filter(
      (item) =>
        item.aktif
    ).length;

  const jumlahDokumen =
    daftarApbdes.filter(
      (item) =>
        Boolean(
          item.dokumen_url
        )
    ).length;

  const totalAnggaran =
    daftarApbdes.reduce(
      (total, item) =>
        total +
        item.anggaran_pendapatan +
        item.anggaran_belanja +
        item.anggaran_pembiayaan,
      0
    );

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-600">
          Transparansi Anggaran
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
          Kelola Realisasi APBDes
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
          Kelola informasi anggaran, realisasi,
          dokumen, dan infografis APBDes Desa Keji
          Tahun 2024 sampai 2026.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatistikCard
          label="Tahun Anggaran"
          value="3"
          description="2024–2026"
          icon={CalendarDays}
        />

        <StatistikCard
          label="Dipublikasikan"
          value={String(
            jumlahAktif
          )}
          description="Halaman aktif"
          icon={Landmark}
        />

        <StatistikCard
          label="Dokumen PDF"
          value={String(
            jumlahDokumen
          )}
          description="Dokumen tersedia"
          icon={FileText}
        />

        <StatistikCard
          label="Total Anggaran"
          value={
            totalAnggaran > 0
              ? formatRupiahRingkas(
                  totalAnggaran
                )
              : 'Rp0'
          }
          description="Seluruh tahun"
          icon={BarChart3}
        />
      </section>

      <section className="space-y-6">
        {daftarApbdes.map(
          (item) => (
            <ApbdesForm
              key={item.tahun}
              data={item}
            />
          )
        )}
      </section>
    </div>
  );
}

function formatRupiahRingkas(
  value: number
) {
  return new Intl.NumberFormat(
    'id-ID',
    {
      style: 'currency',
      currency: 'IDR',
      notation: 'compact',
      maximumFractionDigits: 1,
    }
  ).format(value);
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
  icon: LucideIcon;
}) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-emerald-50" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-2xl font-black text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs font-bold text-emerald-700">
            {description}
          </p>
        </div>

        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
          <Icon size={23} />
        </div>
      </div>
    </article>
  );
}