// app/(public)/berita/page.tsx

import Link from 'next/link';

import {
  Archive,
  Calendar,
  ChevronRight,
  FileText,
  User,
} from 'lucide-react';

import { createClient } from '@/lib/server';

export const dynamic = 'force-dynamic';

const categories = [
  'Semua',
  'Berita Desa',
  'PPID',
  'Laporan Anggaran',
];

interface BeritaPageProps {
  searchParams: Promise<{
    kategori?: string;
  }>;
}

function formatTanggal(
  value: string | null
) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }
  ).format(new Date(value));
}

export default async function ArsipBeritaPage({
  searchParams,
}: BeritaPageProps) {
  const params = await searchParams;

  const activeCategory =
    params.kategori ?? 'Semua';

  const supabase =
    await createClient();

  let query = supabase
    .from('berita')
    .select(`
      id,
      judul,
      slug,
      kategori,
      kutipan,
      penulis,
      gambar_url,
      published_at,
      created_at
    `)
    .eq('status', 'published')
    .order(
      'published_at',
      {
        ascending: false,
      }
    );

  if (
    activeCategory !== 'Semua'
  ) {
    query = query.eq(
      'kategori',
      activeCategory
    );
  }

  const {
    data,
    error,
  } = await query;

  if (error) {
    console.error(
      'Gagal mengambil arsip berita:',
      error
    );
  }

  const daftarBerita =
    data ?? [];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] p-8 text-white shadow-xl md:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[45px] border-white/[0.05]" />

          <div className="relative">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <Archive size={24} />
            </div>

            <h1 className="text-3xl font-black md:text-4xl">
              Arsip Berita Desa
            </h1>

            <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-emerald-50/80 md:text-base">
              Informasi, kegiatan,
              pengumuman, dan laporan resmi
              Pemerintah Desa Keji.
            </p>
          </div>
        </section>

        <div className="my-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map(
            (category) => {
              const href =
                category === 'Semua'
                  ? '/berita'
                  : `/berita?kategori=${encodeURIComponent(
                      category
                    )}`;

              return (
                <Link
                  key={category}
                  href={href}
                  className={`shrink-0 rounded-xl border px-5 py-2.5 text-sm font-bold transition ${
                    activeCategory ===
                    category
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-md'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:text-emerald-700'
                  }`}
                >
                  {category}
                </Link>
              );
            }
          )}
        </div>

        {daftarBerita.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-white text-center shadow-sm">
            <FileText
              size={40}
              className="text-emerald-300"
            />

            <h2 className="mt-5 text-xl font-black text-gray-800">
              Belum Ada Berita
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Belum ada berita yang
              diterbitkan pada kategori ini.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {daftarBerita.map(
              (berita) => (
                <article
                  key={berita.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={
                        berita.gambar_url
                      }
                      alt={berita.judul}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />

                    <span className="absolute right-3 top-3 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur">
                      {berita.kategori}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="line-clamp-2 text-lg font-black leading-snug text-gray-800 transition group-hover:text-emerald-700">
                      <Link
                        href={`/berita/${berita.slug}`}
                      >
                        {berita.judul}
                      </Link>
                    </h2>

                    <div className="my-4 flex flex-wrap gap-4 border-b border-gray-100 pb-4 text-xs font-semibold text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar
                          size={14}
                          className="text-emerald-500"
                        />

                        {formatTanggal(
                          berita.published_at ??
                            berita.created_at
                        )}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <User
                          size={14}
                          className="text-emerald-500"
                        />

                        {berita.penulis}
                      </span>
                    </div>

                    <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
                      {berita.kutipan}
                    </p>

                    <Link
                      href={`/berita/${berita.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-extrabold text-emerald-600 hover:text-emerald-800"
                    >
                      Baca Selengkapnya
                      <ChevronRight
                        size={16}
                      />
                    </Link>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}