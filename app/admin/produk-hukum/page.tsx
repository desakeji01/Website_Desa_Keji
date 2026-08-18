// app/admin/produk-hukum/page.tsx

import {
  CalendarDays,
  Eye,
  EyeOff,
  ExternalLink,
  FileCheck2,
  FileText,
  Scale,
  Trash2,
} from 'lucide-react';

import ProdukHukumForm from '@/components/admin/ProdukHukumForm';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import {
  deleteProdukHukumAction,
  toggleProdukHukumAction,
} from './actions';

import type {
  ProdukHukum,
} from '@/types/produk-hukum';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

function formatTanggal(
  value:
    | string
    | null
) {
  if (!value) {
    return '-';
  }

  const date =
    new Date(
      `${value}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return '-';
  }

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone:
        'Asia/Jakarta',
    }
  ).format(date);
}

export default async function AdminProdukHukumPage() {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from('produk_hukum')
    .select(`
      id,
      judul,
      nomor,
      jenis,
      tahun,
      tanggal_penetapan,
      deskripsi,
      file_url,
      file_path,
      aktif,
      created_at,
      updated_at
    `)
    .order('tahun', {
      ascending: false,
    })
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    console.error(
      'Gagal mengambil produk hukum:',
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

  const daftarProdukHukum =
    (data ?? []) as ProdukHukum[];

  const jumlahAktif =
    daftarProdukHukum.filter(
      (item) =>
        item.aktif
    ).length;

  const jumlahJenis =
    new Set(
      daftarProdukHukum.map(
        (item) =>
          item.jenis
      )
    ).size;

  const tahunTerbaru =
    daftarProdukHukum.length > 0
      ? Math.max(
          ...daftarProdukHukum.map(
            (item) =>
              item.tahun
          )
        )
      : new Date().getFullYear();

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-600">
          Informasi Publik
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
          Kelola Produk Hukum
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
          Kelola dan publikasikan peraturan,
          keputusan, serta dokumen hukum
          Pemerintah Desa Keji.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatistikCard
          label="Total Dokumen"
          value={
            daftarProdukHukum.length
          }
          icon={FileText}
        />

        <StatistikCard
          label="Dokumen Aktif"
          value={jumlahAktif}
          icon={FileCheck2}
        />

        <StatistikCard
          label="Jenis Dokumen"
          value={jumlahJenis}
          icon={Scale}
        />

        <StatistikCard
          label="Tahun Terbaru"
          value={tahunTerbaru}
          icon={CalendarDays}
        />
      </section>

      <ProdukHukumForm />

      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-xl font-black text-slate-900">
            Daftar Produk Hukum
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Dokumen yang telah disimpan
            oleh administrator.
          </p>
        </div>

        {daftarProdukHukum.length ===
        0 ? (
          <div className="p-12 text-center">
            <FileText
              size={46}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-black text-slate-700">
              Belum ada produk hukum
            </h3>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="bg-slate-50 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-4">
                      Dokumen
                    </th>

                    <th className="px-5 py-4">
                      Jenis
                    </th>

                    <th className="px-5 py-4 text-center">
                      Tahun
                    </th>

                    <th className="px-5 py-4">
                      Penetapan
                    </th>

                    <th className="px-5 py-4 text-center">
                      Status
                    </th>

                    <th className="px-5 py-4 text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {daftarProdukHukum.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="align-top transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <p className="max-w-[430px] font-bold leading-relaxed text-slate-800">
                            {item.judul}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {item.nomor ??
                              'Nomor tidak dicantumkan'}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                          {item.jenis}
                        </td>

                        <td className="px-5 py-4 text-center text-sm font-bold text-slate-700">
                          {item.tahun}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {formatTanggal(
                            item.tanggal_penetapan
                          )}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-extrabold ${
                              item.aktif
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {item.aktif
                              ? 'Dipublikasikan'
                              : 'Disembunyikan'}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-center gap-2">
                            <a
                              href={item.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Lihat PDF"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-200 text-cyan-700 transition hover:bg-cyan-50"
                            >
                              <ExternalLink
                                size={16}
                              />
                            </a>

                            <form
                              action={
                                toggleProdukHukumAction
                              }
                            >
                              <input
                                type="hidden"
                                name="id"
                                value={item.id}
                              />

                              <input
                                type="hidden"
                                name="aktif"
                                value={String(
                                  item.aktif
                                )}
                              />

                              <button
                                type="submit"
                                title={
                                  item.aktif
                                    ? 'Sembunyikan'
                                    : 'Publikasikan'
                                }
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-amber-200 text-amber-700 transition hover:bg-amber-50"
                              >
                                {item.aktif ? (
                                  <EyeOff
                                    size={16}
                                  />
                                ) : (
                                  <Eye
                                    size={16}
                                  />
                                )}
                              </button>
                            </form>

                            <form
                              action={
                                deleteProdukHukumAction
                              }
                            >
                              <input
                                type="hidden"
                                name="id"
                                value={item.id}
                              />

                              <button
                                type="submit"
                                title="Hapus"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50"
                              >
                                <Trash2
                                  size={16}
                                />
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-4 lg:hidden">
              {daftarProdukHukum.map(
                (item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
                        <FileText
                          size={20}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-black leading-relaxed text-slate-800">
                          {item.judul}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {item.jenis}
                          {' · '}
                          {item.tahun}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {item.nomor ??
                            'Tanpa nomor dokumen'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-white px-3 py-2.5 text-xs font-bold text-cyan-700"
                      >
                        <ExternalLink
                          size={14}
                        />
                        Lihat
                      </a>

                      <form
                        action={
                          toggleProdukHukumAction
                        }
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={item.id}
                        />

                        <input
                          type="hidden"
                          name="aktif"
                          value={String(
                            item.aktif
                          )}
                        />

                        <button
                          type="submit"
                          className="h-full w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-xs font-bold text-amber-700"
                        >
                          {item.aktif
                            ? 'Sembunyikan'
                            : 'Publikasikan'}
                        </button>
                      </form>

                      <form
                        action={
                          deleteProdukHukumAction
                        }
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={item.id}
                        />

                        <button
                          type="submit"
                          className="h-full w-full rounded-xl border border-red-200 bg-white px-3 py-2.5 text-xs font-bold text-red-600"
                        >
                          Hapus
                        </button>
                      </form>
                    </div>
                  </article>
                )
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function StatistikCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof FileText;
}) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-emerald-50" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black text-slate-900">
            {new Intl.NumberFormat(
              'id-ID'
            ).format(value)}
          </p>
        </div>

        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
          <Icon size={23} />
        </div>
      </div>
    </article>
  );
}