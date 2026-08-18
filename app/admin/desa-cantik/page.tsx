import Link from 'next/link';

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  FileText,
  GraduationCap,
  HeartPulse,
  Home,
  Image as ImageIcon,
  Landmark,
  Users,
  type LucideIcon,
} from 'lucide-react';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import {
  KATEGORI_DESA_CANTIK,
  TAHUN_DESA_CANTIK,
  type KategoriDesaCantik,
} from '@/types/desa-cantik';

import type {
  DesaCantikAdminRecord,
  DesaCantikPublikasiRecord,
} from '@/types/desa-cantik-admin';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

const ikonKategori:
  Record<
    KategoriDesaCantik,
    LucideIcon
  > = {
    penduduk:
      Users,

    pendidikan:
      GraduationCap,

    kesehatan:
      HeartPulse,

    perumahan:
      Home,

    perekonomian:
      Landmark,
  };

async function getAdminData() {
  const [
    dataResult,
    publikasiResult,
  ] = await Promise.all([
    supabaseAdmin
      .from(
        'desa_cantik_data'
      )
      .select(`
        id,
        kategori,
        tahun,
        sumber,
        data,
        infografis_url,
        infografis_path,
        aktif,
        created_at,
        updated_at
      `)
      .order(
        'kategori',
        {
          ascending:
            true,
        }
      )
      .order(
        'tahun',
        {
          ascending:
            true,
        }
      ),

    supabaseAdmin
      .from(
        'desa_cantik_publikasi'
      )
      .select(`
        id,
        tahun,
        judul,
        deskripsi,
        pdf_url,
        pdf_path,
        aktif,
        created_at,
        updated_at
      `)
      .order(
        'tahun',
        {
          ascending:
            true,
        }
      ),
  ]);

  if (dataResult.error) {
    console.error(
      'Gagal mengambil admin Desa Cantik:',
      dataResult.error
    );
  }

  if (
    publikasiResult.error
  ) {
    console.error(
      'Gagal mengambil publikasi Desa Cantik:',
      publikasiResult.error
    );
  }

  return {
    records:
      (
        dataResult.data ??
        []
      ) as DesaCantikAdminRecord[],

    publications:
      (
        publikasiResult.data ??
        []
      ) as DesaCantikPublikasiRecord[],
  };
}

export default async function AdminDesaCantikPage() {
  const {
    records,
    publications,
  } = await getAdminData();

  const recordMap =
    new Map(
      records.map(
        (record) => [
          `${record.kategori}-${record.tahun}`,
          record,
        ]
      )
    );

  const publicationMap =
    new Map(
      publications.map(
        (publication) => [
          publication.tahun,
          publication,
        ]
      )
    );

  const totalAktif =
    records.filter(
      (record) =>
        record.aktif
    ).length;

  const totalInfografis =
    records.filter(
      (record) =>
        Boolean(
          record.infografis_url
        )
    ).length;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 p-6 text-white shadow-xl md:p-8">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

        <div className="relative">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
            Pengelolaan Statistik Desa
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Admin Desa Cantik
          </h1>

          <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-emerald-50">
            Kelola sumber data, infografis, status publikasi, dan dokumen
            Desa Keji Dalam Angka berdasarkan kategori serta tahun.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={BarChart3}
          label="Data Kategori"
          value={String(
            records.length
          )}
          description="Kombinasi kategori dan tahun."
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Data Aktif"
          value={String(
            totalAktif
          )}
          description="Data yang ditampilkan di website."
        />

        <SummaryCard
          icon={ImageIcon}
          label="Infografis"
          value={String(
            totalInfografis
          )}
          description="Infografis yang telah tersedia."
        />
      </section>

      <section>
        <div className="mb-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
            Kategori Statistik
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-900">
            Kelola Data per Kategori
          </h2>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {KATEGORI_DESA_CANTIK.map(
            (kategori) => {
              const Icon =
                ikonKategori[
                  kategori.slug
                ];

              return (
                <article
                  key={
                    kategori.slug
                  }
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <Icon size={24} />
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        {kategori.nama}
                      </h3>

                      <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                        {
                          kategori.deskripsi
                        }
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {TAHUN_DESA_CANTIK.map(
                      (tahun) => {
                        const record =
                          recordMap.get(
                            `${kategori.slug}-${tahun}`
                          );

                        return (
                          <Link
                            key={tahun}
                            href={`/admin/desa-cantik/${kategori.slug}/${tahun}`}
                            className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                  Tahun
                                </p>

                                <p className="mt-1 text-2xl font-black text-slate-900">
                                  {tahun}
                                </p>
                              </div>

                              <ArrowRight
                                size={18}
                                className="text-emerald-700 transition group-hover:translate-x-1"
                              />
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <StatusBadge
                                active={
                                  record?.aktif ??
                                  false
                                }
                              />

                              <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold text-slate-500">
                                {record?.infografis_url
                                  ? 'Ada Infografis'
                                  : 'Belum Ada Infografis'}
                              </span>
                            </div>
                          </Link>
                        );
                      }
                    )}
                  </div>
                </article>
              );
            }
          )}
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
            Dokumen Tahunan
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-900">
            Publikasi Desa Keji Dalam Angka
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {TAHUN_DESA_CANTIK.map(
            (tahun) => {
              const publication =
                publicationMap.get(
                  tahun
                );

              return (
                <Link
                  key={tahun}
                  href={`/admin/desa-cantik/publikasi/${tahun}`}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <BookOpen
                        size={23}
                      />
                    </div>

                    <ArrowRight
                      size={18}
                      className="text-emerald-700 transition group-hover:translate-x-1"
                    />
                  </div>

                  <p className="mt-5 text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                    Publikasi {tahun}
                  </p>

                  <h3 className="mt-2 text-lg font-black text-slate-900">
                    {publication?.judul ??
                      `Desa Keji Dalam Angka ${tahun}`}
                  </h3>

                  <div className="mt-4 flex gap-2">
                    <StatusBadge
                      active={
                        publication?.aktif ??
                        false
                      }
                    />

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold text-slate-500">
                      {publication?.pdf_url
                        ? 'PDF Tersedia'
                        : 'PDF Belum Ada'}
                    </span>
                  </div>
                </Link>
              );
            }
          )}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon:
    LucideIcon;

  label:
    string;

  value:
    string;

  description:
    string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
        <Icon size={22} />
      </div>

      <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-sm font-medium text-slate-500">
        {description}
      </p>
    </article>
  );
}

function StatusBadge({
  active,
}: {
  active:
    boolean;
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
        active
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-slate-200 text-slate-500'
      }`}
    >
      {active
        ? 'Aktif'
        : 'Nonaktif'}
    </span>
  );
}