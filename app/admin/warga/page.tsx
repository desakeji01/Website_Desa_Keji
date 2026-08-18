// app/admin/warga/page.tsx

import {
  House,
  MapPin,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';

import WargaForm from '@/components/admin/WargaForm';
import WargaTable from '@/components/admin/WargaTable';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  Warga,
} from '@/types/warga';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

export default async function AdminWargaPage() {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from('warga')
    .select(`
      id,
      nik_empat_terakhir,
      no_kk_empat_terakhir,
      nama_lengkap,
      jenis_kelamin,
      tanggal_lahir,
      status_penduduk,
      dusun,
      rw,
      rt,
      alamat,
      nomor_whatsapp,
      aktif,
      created_at,
      updated_at
    `)
    .order(
      'created_at',
      {
        ascending: false,
      }
    );

  if (error) {
    console.error(
      'Gagal mengambil data warga:',
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

  const daftarWarga =
    (data ?? []) as Warga[];

  const jumlahAktif =
    daftarWarga.filter(
      (warga) =>
        warga.aktif
    ).length;

  const jumlahTetap =
    daftarWarga.filter(
      (warga) =>
        warga.aktif &&
        warga.status_penduduk ===
          'TETAP'
    ).length;

  const jumlahTidakTetap =
    daftarWarga.filter(
      (warga) =>
        warga.aktif &&
        warga.status_penduduk ===
          'TIDAK_TETAP'
    ).length;

  return (
    <div className="space-y-8">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header>
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-600">
          Administrasi Warga
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
          Database Warga Desa
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          Kelola data warga yang
          diperbolehkan menggunakan
          Layanan Cepat serta menjadi
          sumber statistik kependudukan
          Desa Keji.
        </p>
      </header>

      {/* =====================================================
          STATISTIK
      ===================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatistikCard
          label="Total Warga"
          value={
            daftarWarga.length
          }
          description="Seluruh data warga"
          icon={Users}
        />

        <StatistikCard
          label="Warga Aktif"
          value={jumlahAktif}
          description="Dapat menggunakan layanan"
          icon={ShieldCheck}
        />

        <StatistikCard
          label="Penduduk Tetap"
          value={jumlahTetap}
          description="Berdomisili tetap"
          icon={House}
        />

        <StatistikCard
          label="Tidak Tetap"
          value={
            jumlahTidakTetap
          }
          description="Domisili tidak tetap"
          icon={MapPin}
        />
      </section>

      {/* =====================================================
          FORM TAMBAH WARGA
      ===================================================== */}

      <WargaForm />

      {/* =====================================================
          TABEL WARGA
      ===================================================== */}

      <WargaTable
        daftarWarga={
          daftarWarga
        }
      />
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
  value: number;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-emerald-50" />

      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black text-slate-900">
            {new Intl.NumberFormat(
              'id-ID'
            ).format(value)}
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