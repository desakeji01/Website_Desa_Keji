// components/public/BeritaTerbaru.tsx

'use client';

import {
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';

import {
  Calendar,
  ChevronRight,
  FileText,
  User,
} from 'lucide-react';

import type {
  BeritaPublik,
} from '@/types/berita';

const categories = [
  'Semua',
  'Berita Desa',
  'PPID',
  'Laporan Anggaran',
];

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

export default function BeritaTerbaru() {
  const [activeCategory, setActiveCategory] =
    useState('Semua');

  const [berita, setBerita] =
    useState<BeritaPublik[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState('');

  useEffect(() => {
    const controller =
      new AbortController();

    async function loadBerita() {
      setIsLoading(true);
      setErrorMessage('');

      const params =
        new URLSearchParams({
          limit: '3',
        });

      if (
        activeCategory !== 'Semua'
      ) {
        params.set(
          'category',
          activeCategory
        );
      }

      try {
        const response =
          await fetch(
            `/api/berita?${params.toString()}`,
            {
              cache: 'no-store',
              signal:
                controller.signal,
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ??
              'Berita gagal dimuat.'
          );
        }

        setBerita(result.data ?? []);
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === 'AbortError'
        ) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Berita gagal dimuat.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadBerita();

    return () => {
      controller.abort();
    };
  }, [activeCategory]);

  return (
    <section className="mx-auto mt-12 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h2 className="flex items-center gap-2 text-2xl font-extrabold text-gray-800">
          <FileText
            className="text-emerald-600"
            size={28}
          />
          Berita Desa
        </h2>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(
            (category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setActiveCategory(
                    category
                  )
                }
                className={`shrink-0 rounded-lg border px-5 py-2 text-sm font-bold shadow-sm transition ${
                  activeCategory ===
                  category
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:text-emerald-600'
                }`}
              >
                {category === 'Semua'
                  ? 'Terbaru'
                  : category}
              </button>
            )
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="h-52 animate-pulse bg-emerald-50" />

              <div className="space-y-3 p-5">
                <div className="h-5 w-4/5 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-2/5 animate-pulse rounded bg-gray-100" />
                <div className="h-16 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : berita.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-emerald-100 bg-white px-6 text-center shadow-sm">
          <FileText
            size={36}
            className="text-emerald-300"
          />

          <h3 className="mt-4 text-lg font-extrabold text-gray-800">
            Belum Ada Berita
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Belum ada berita pada
            kategori ini.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {berita.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={item.gambar_url}
                  alt={item.judul}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute right-3 top-3 rounded-md bg-white/90 px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur-sm">
                  {item.kategori}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-3 line-clamp-2 text-[17px] font-extrabold leading-snug text-gray-800 transition-colors group-hover:text-emerald-600">
                  <Link
                    href={`/berita/${item.slug}`}
                  >
                    {item.judul}
                  </Link>
                </h3>

                <div className="mb-4 flex items-center gap-4 border-b border-gray-100 pb-4 text-xs font-semibold text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar
                      size={14}
                      className="text-emerald-500"
                    />

                    {formatTanggal(
                      item.published_at ??
                        item.created_at
                    )}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <User
                      size={14}
                      className="text-emerald-500"
                    />

                    {item.penulis}
                  </span>
                </div>

                <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
                  {item.kutipan}
                </p>

                <Link
                  href={`/berita/${item.slug}`}
                  className="flex items-center gap-1 text-sm font-bold text-emerald-600 transition-colors hover:text-emerald-800"
                >
                  Selengkapnya
                  <ChevronRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/berita"
          className="inline-block rounded-full border-2 border-emerald-600 bg-white px-8 py-3 font-bold text-emerald-600 shadow-sm transition-colors hover:bg-emerald-600 hover:text-white hover:shadow-md"
        >
          Lihat Semua Berita
        </Link>
      </div>
    </section>
  );
}