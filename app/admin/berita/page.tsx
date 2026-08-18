// app/admin/berita/page.tsx

import Link from 'next/link';

import {
  CalendarDays,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Plus,
} from 'lucide-react';

import { supabaseAdmin } from '@/lib/supabase-admin';

import DeleteBeritaButton from '@/components/admin/DeleteBeritaButton';

import {
  toggleStatusBeritaAction,
} from './actions';

export const dynamic = 'force-dynamic';

interface BeritaAdmin {
  id: number;
  judul: string;
  slug: string;
  kategori: string | null;
  kutipan: string | null;
  penulis: string | null;
  gambar_url: string | null;
  status: 'draft' | 'published';
  created_at: string;
  published_at: string | null;
}

function normalizeText(
  value: string | null | undefined,
  fallback = '-'
) {
  const result = String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();

  return result || fallback;
}

function formatTanggal(
  value: string | null
) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  const tanggal =
    new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);

  const waktu =
    new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
      .format(date)
      .replace('.', ':');

  return `${tanggal}, ${waktu}`;
}

export default async function KelolaBeritaPage() {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from('berita')
    .select(`
      id,
      judul,
      slug,
      kategori,
      kutipan,
      penulis,
      gambar_url,
      status,
      created_at,
      published_at
    `)
    .order('created_at', {
      ascending: false,
    })
    .order('id', {
      ascending: false,
    });

  if (error) {
    console.error(
      'Gagal mengambil berita:',
      error.message
    );
  }

  const daftarBerita =
    (data ?? []) as BeritaAdmin[];

  const totalPublished =
    daftarBerita.filter(
      (berita) =>
        berita.status === 'published'
    ).length;

  const totalDraft =
    daftarBerita.length -
    totalPublished;

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] p-6 text-white shadow-xl sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[45px] border-white/[0.05]" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold">
              <FileText size={14} />
              Publikasi Desa
            </div>

            <h1 className="text-2xl font-black sm:text-3xl">
              Kelola Berita
            </h1>

            <p className="mt-2 max-w-xl text-sm font-medium text-emerald-50/80">
              Kelola berita yang ditampilkan
              pada halaman publik Desa Keji.
            </p>
          </div>

          <Link
            href="/admin/berita/tambah"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-emerald-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50"
          >
            <Plus size={18} />
            Tambah Berita
          </Link>
        </div>
      </section>

      {/* Statistik */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
            Total Berita
          </p>

          <p className="mt-1 text-2xl font-black text-slate-900">
            {daftarBerita.length}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
            Diterbitkan
          </p>

          <p className="mt-1 text-2xl font-black text-emerald-700">
            {totalPublished}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
            Draft
          </p>

          <p className="mt-1 text-2xl font-black text-slate-600">
            {totalDraft}
          </p>
        </div>
      </section>

      {/* Daftar Berita */}
      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
        {daftarBerita.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
              <FileText size={26} />
            </div>

            <h2 className="mt-4 text-lg font-black text-slate-800">
              Belum Ada Berita
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Tambahkan berita pertama untuk
              ditampilkan pada website publik.
            </p>
          </div>
        ) : (
          <>
            {/* Tampilan Desktop */}
            <table className="hidden w-full table-fixed lg:table">
              <colgroup>
                <col className="w-[39%]" />
                <col className="w-[13%]" />
                <col className="w-[15%]" />
                <col className="w-[10%]" />
                <col className="w-[23%]" />
              </colgroup>

              <thead>
                <tr className="border-b border-emerald-100 bg-emerald-50/70">
                  <th className="px-5 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.12em] text-emerald-800">
                    Berita
                  </th>

                  <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.12em] text-emerald-800">
                    Kategori
                  </th>

                  <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.12em] text-emerald-800">
                    Tanggal
                  </th>

                  <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.12em] text-emerald-800">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-[11px] font-extrabold uppercase tracking-[0.12em] text-emerald-800">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {daftarBerita.map(
                  (berita) => {
                    const judul =
                      normalizeText(
                        berita.judul,
                        'Tanpa Judul'
                      );

                    const kutipan =
                      normalizeText(
                        berita.kutipan,
                        'Belum ada ringkasan.'
                      );

                    const kategori =
                      normalizeText(
                        berita.kategori,
                        'Berita Desa'
                      );

                    const gambarUrl =
                      berita.gambar_url ||
                      '/background.png';

                    return (
                      <tr
                        key={berita.id}
                        className="transition-colors hover:bg-emerald-50/30"
                      >
                        {/* Berita */}
                        <td className="px-5 py-3.5">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-100">
                              <img
                                src={gambarUrl}
                                alt={judul}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p
                                title={judul}
                                className="truncate text-sm font-extrabold text-slate-800"
                              >
                                {judul}
                              </p>

                              <p
                                title={kutipan}
                                className="mt-1 truncate text-xs font-medium text-slate-500"
                              >
                                {kutipan}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Kategori */}
                        <td className="px-4 py-3.5">
                          <span className="inline-flex whitespace-nowrap rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[11px] font-extrabold text-emerald-700">
                            {kategori}
                          </span>
                        </td>

                        {/* Tanggal */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                            <CalendarDays
                              size={14}
                              className="shrink-0 text-emerald-500"
                            />

                            <span className="leading-5">
                              {formatTanggal(
                                berita.published_at ??
                                  berita.created_at
                              )}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          {berita.status ===
                          'published' ? (
                            <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-extrabold text-emerald-700">
                              <Eye size={12} />
                              Terbit
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-extrabold text-slate-600">
                              <EyeOff size={12} />
                              Draft
                            </span>
                          )}
                        </td>

                        {/* Aksi */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1.5">
                            {berita.status ===
                              'published' && (
                              <Link
                                href={`/berita/${berita.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Lihat berita"
                                aria-label={`Lihat berita ${judul}`}
                                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                              >
                                <Eye size={16} />
                              </Link>
                            )}

                            <form
                              action={
                                toggleStatusBeritaAction
                              }
                            >
                              <input
                                type="hidden"
                                name="id"
                                value={berita.id}
                              />

                              <button
                                type="submit"
                                className="inline-flex h-9 min-w-[96px] items-center justify-center whitespace-nowrap rounded-lg border border-emerald-100 bg-emerald-50 px-3 text-[11px] font-extrabold text-emerald-700 transition hover:bg-emerald-100"
                              >
                                {berita.status ===
                                'published'
                                  ? 'Jadikan Draft'
                                  : 'Terbitkan'}
                              </button>
                            </form>

                            <Link
                              href={`/admin/berita/${berita.id}/edit`}
                              title="Edit berita"
                              aria-label={`Edit berita ${judul}`}
                              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              <Edit3 size={16} />
                            </Link>

                            <DeleteBeritaButton
                              id={berita.id}
                              judul={judul}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>

            {/* Tampilan Tablet dan Mobile */}
            <div className="divide-y divide-slate-100 lg:hidden">
              {daftarBerita.map(
                (berita) => {
                  const judul =
                    normalizeText(
                      berita.judul,
                      'Tanpa Judul'
                    );

                  const kutipan =
                    normalizeText(
                      berita.kutipan,
                      'Belum ada ringkasan.'
                    );

                  const kategori =
                    normalizeText(
                      berita.kategori,
                      'Berita Desa'
                    );

                  const gambarUrl =
                    berita.gambar_url ||
                    '/background.png';

                  return (
                    <article
                      key={berita.id}
                      className="p-4"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={gambarUrl}
                          alt={judul}
                          className="h-16 w-24 shrink-0 rounded-xl object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <h2 className="line-clamp-2 text-sm font-extrabold leading-5 text-slate-800">
                            {judul}
                          </h2>

                          <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                            {kutipan}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-extrabold text-emerald-700">
                          {kategori}
                        </span>

                        {berita.status ===
                        'published' ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-extrabold text-emerald-700">
                            <Eye size={11} />
                            Terbit
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-extrabold text-slate-600">
                            <EyeOff size={11} />
                            Draft
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                          <CalendarDays size={12} />
                          {formatTanggal(
                            berita.published_at ??
                              berita.created_at
                          )}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {berita.status ===
                          'published' && (
                          <Link
                            href={`/berita/${berita.slug}`}
                            target="_blank"
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 text-xs font-bold text-emerald-700"
                          >
                            <Eye size={15} />
                            Lihat
                          </Link>
                        )}

                        <form
                          action={
                            toggleStatusBeritaAction
                          }
                        >
                          <input
                            type="hidden"
                            name="id"
                            value={berita.id}
                          />

                          <button
                            type="submit"
                            className="inline-flex h-9 items-center rounded-lg border border-emerald-100 bg-emerald-50 px-3 text-xs font-bold text-emerald-700"
                          >
                            {berita.status ===
                            'published'
                              ? 'Jadikan Draft'
                              : 'Terbitkan'}
                          </button>
                        </form>

                        <Link
                          href={`/admin/berita/${berita.id}/edit`}
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600"
                        >
                          <Edit3 size={15} />
                          Edit
                        </Link>

                        <DeleteBeritaButton
                          id={berita.id}
                          judul={judul}
                        />
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}