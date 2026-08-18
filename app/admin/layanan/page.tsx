// app/admin/layanan/page.tsx

import Link from 'next/link';

import {
  ArrowUpRight,
  CheckCircle2,
  CircleSlash2,
  Eye,
  FileCheck2,
  FileText,
  ListChecks,
  Pencil,
  Plus,
  Power,
  ShieldCheck,
} from 'lucide-react';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import {
  toggleStatusLayananAction,
} from './actions';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

interface LayananRow {
  id: number;
  nama: string;
  slug: string;
  deskripsi: string | null;
  aktif: boolean;
  urutan: number | null;
}

interface PersyaratanRow {
  layanan_id: number;
}

interface PermohonanRow {
  layanan_id: number;
}

export default async function AdminLayananPage({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;

  const [
    layananResult,
    persyaratanResult,
    permohonanResult,
  ] =
    await Promise.all([
      supabaseAdmin
        .from('layanan')
        .select(`
          id,
          nama,
          slug,
          deskripsi,
          aktif,
          urutan
        `)
        .order(
          'urutan',
          {
            ascending: true,
            nullsFirst: false,
          }
        )
        .order(
          'nama',
          {
            ascending: true,
          }
        ),

      supabaseAdmin
        .from(
          'persyaratan_layanan'
        )
        .select(
          'layanan_id'
        ),

      supabaseAdmin
        .from('permohonan')
        .select(
          'layanan_id'
        ),
    ]);

  if (
    layananResult.error
  ) {
    console.error(
      'Gagal mengambil layanan:',
      layananResult.error
    );
  }

  if (
    persyaratanResult.error
  ) {
    console.error(
      'Gagal mengambil jumlah persyaratan:',
      persyaratanResult.error
    );
  }

  if (
    permohonanResult.error
  ) {
    console.error(
      'Gagal mengambil jumlah permohonan per layanan:',
      permohonanResult.error
    );
  }

  const daftarLayanan =
    (
      layananResult.data ??
      []
    ) as LayananRow[];

  const persyaratanRows =
    (
      persyaratanResult.data ??
      []
    ) as PersyaratanRow[];

  const permohonanRows =
    (
      permohonanResult.data ??
      []
    ) as PermohonanRow[];

  const jumlahPersyaratan =
    new Map<number, number>();

  persyaratanRows.forEach(
    (item) => {
      jumlahPersyaratan.set(
        item.layanan_id,
        (
          jumlahPersyaratan.get(
            item.layanan_id
          ) ?? 0
        ) + 1
      );
    }
  );

  const jumlahPermohonan =
    new Map<number, number>();

  permohonanRows.forEach(
    (item) => {
      jumlahPermohonan.set(
        item.layanan_id,
        (
          jumlahPermohonan.get(
            item.layanan_id
          ) ?? 0
        ) + 1
      );
    }
  );

  const totalAktif =
    daftarLayanan.filter(
      (item) =>
        item.aktif
    ).length;

  const totalNonaktif =
    daftarLayanan.length -
    totalAktif;

  const successMessage =
    params.status ===
    'created'
      ? 'Layanan baru berhasil ditambahkan.'
      : params.status ===
          'updated'
        ? 'Data layanan berhasil diperbarui.'
        : '';

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] px-6 py-7 text-white shadow-xl shadow-emerald-950/10 sm:px-8 sm:py-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.13) 1.5px, transparent 1.5px)',
            backgroundSize:
              '26px 26px',
          }}
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-emerald-50 backdrop-blur-md">
              <ShieldCheck
                size={14}
              />

              Pengelolaan pelayanan desa
            </div>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Layanan Desa
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-emerald-50/80 sm:text-base">
              Tambah dan perbarui jenis layanan, deskripsi, urutan, status publikasi, serta persyaratan administrasi.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/layanan"
              target="_blank"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/15"
            >
              <Eye
                size={17}
              />

              Halaman Publik
            </Link>

            <Link
              href="/admin/layanan/tambah"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-800 transition hover:bg-emerald-50"
            >
              <Plus
                size={18}
              />

              Tambah Layanan
            </Link>
          </div>
        </div>
      </section>

      {successMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0"
          />

          <p className="text-sm font-semibold">
            {successMessage}
          </p>
        </div>
      )}

      {/* Statistik */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatistikCard
          label="Total Layanan"
          value={
            daftarLayanan.length
          }
          description="Seluruh layanan dalam sistem"
          icon={
            FileCheck2
          }
          iconClassName="bg-slate-100 text-slate-700"
        />

        <StatistikCard
          label="Layanan Aktif"
          value={
            totalAktif
          }
          description="Tampil pada website publik"
          icon={
            CheckCircle2
          }
          iconClassName="bg-emerald-100 text-emerald-700"
        />

        <StatistikCard
          label="Nonaktif"
          value={
            totalNonaktif
          }
          description="Tidak tampil pada website"
          icon={
            CircleSlash2
          }
          iconClassName="bg-amber-100 text-amber-700"
        />

        <StatistikCard
          label="Persyaratan"
          value={
            persyaratanRows.length
          }
          description="Total item dokumen layanan"
          icon={
            ListChecks
          }
          iconClassName="bg-blue-100 text-blue-700"
        />
      </section>

      {/* Daftar layanan */}
      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_12px_35px_rgba(6,78,59,0.07)]">
        <div className="flex flex-col gap-3 border-b border-emerald-50 bg-gradient-to-r from-emerald-50/70 to-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Daftar Layanan
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Urutan layanan mengikuti nilai urutan yang telah ditetapkan.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-white px-4 py-2 text-xs font-extrabold text-emerald-700">
            {
              daftarLayanan.length
            } layanan
          </div>
        </div>

        {daftarLayanan.length ===
        0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <FileText
                size={28}
              />
            </div>

            <h3 className="mt-5 font-black text-slate-800">
              Belum ada layanan
            </h3>

            <p className="mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
              Tambahkan jenis layanan administrasi yang akan ditampilkan pada website Desa Keji.
            </p>

            <Link
              href="/admin/layanan/tambah"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white"
            >
              <Plus
                size={17}
              />

              Tambah Layanan
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-2">
            {daftarLayanan.map(
              (
                layanan,
                index
              ) => (
                <article
                  key={
                    layanan.id
                  }
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-lg"
                >
                  <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50/80 to-white p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-sm font-black text-white">
                        {String(
                          layanan.urutan ??
                            index + 1
                        ).padStart(
                          2,
                          '0'
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] ${
                              layanan.aktif
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {layanan.aktif
                              ? 'Aktif'
                              : 'Nonaktif'}
                          </span>

                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-extrabold text-slate-500">
                            ID #{layanan.id}
                          </span>
                        </div>

                        <h3 className="mt-3 text-lg font-black leading-7 text-slate-900">
                          {layanan.nama}
                        </h3>

                        <p className="mt-1 break-all text-xs font-semibold text-emerald-700">
                          /{layanan.slug}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="line-clamp-3 min-h-[66px] text-sm font-medium leading-6 text-slate-500">
                      {layanan.deskripsi ||
                        'Deskripsi belum tersedia.'}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xl font-black text-slate-900">
                          {jumlahPersyaratan.get(
                            layanan.id
                          ) ?? 0}
                        </p>

                        <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-500">
                          Persyaratan
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xl font-black text-slate-900">
                          {jumlahPermohonan.get(
                            layanan.id
                          ) ?? 0}
                        </p>

                        <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-500">
                          Permohonan
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-[1fr_auto_auto] gap-2 border-t border-slate-100 pt-5">
                      <Link
                        href={`/admin/layanan/${layanan.id}/edit`}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-800"
                      >
                        <Pencil
                          size={15}
                        />

                        Edit
                      </Link>

                      <Link
                        href={`/layanan#${layanan.slug}`}
                        target="_blank"
                        title="Lihat pada halaman publik"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <ArrowUpRight
                          size={16}
                        />
                      </Link>

                      <form
                        action={
                          toggleStatusLayananAction
                        }
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={
                            layanan.id
                          }
                        />

                        <input
                          type="hidden"
                          name="aktif"
                          value={String(
                            !layanan.aktif
                          )}
                        />

                        <button
                          type="submit"
                          title={
                            layanan.aktif
                              ? 'Nonaktifkan layanan'
                              : 'Aktifkan layanan'
                          }
                          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                            layanan.aktif
                              ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                              : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          <Power
                            size={16}
                          />
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function StatistikCard({
  label,
  value,
  description,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: number;
  description: string;
  icon:
    typeof FileCheck2;
  iconClassName: string;
}) {
  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_12px_35px_rgba(6,78,59,0.07)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
            {label}
          </p>

          <p className="mt-4 text-4xl font-black text-slate-900">
            {value.toLocaleString(
              'id-ID'
            )}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconClassName}`}
        >
          <Icon
            size={23}
          />
        </div>
      </div>

      <p className="mt-5 border-t border-slate-100 pt-4 text-sm font-medium text-slate-500">
        {description}
      </p>
    </article>
  );
}