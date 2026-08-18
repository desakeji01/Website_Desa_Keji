// app/(public)/berita/[slug]/page.tsx

import Link from 'next/link';

import { notFound } from 'next/navigation';

import {
  ArrowLeft,
  Calendar,
  User,
} from 'lucide-react';

import { createClient } from '@/lib/server';

export const dynamic = 'force-dynamic';

interface DetailBeritaPageProps {
  params: Promise<{
    slug: string;
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
      hour: '2-digit',
      minute: '2-digit',
    }
  ).format(new Date(value));
}

export default async function DetailBeritaPage({
  params,
}: DetailBeritaPageProps) {
  const { slug } = await params;

  const supabase =
    await createClient();

  const {
    data: berita,
    error,
  } = await supabase
    .from('berita')
    .select(`
      id,
      judul,
      slug,
      kategori,
      kutipan,
      konten,
      penulis,
      gambar_url,
      published_at,
      created_at
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error || !berita) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <article className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/berita"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:text-emerald-900"
        >
          <ArrowLeft size={17} />
          Kembali ke Arsip Berita
        </Link>

        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg">
          <div className="relative h-[280px] overflow-hidden sm:h-[420px] lg:h-[520px]">
            <img
              src={berita.gambar_url}
              alt={berita.judul}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

            <span className="absolute bottom-5 left-5 rounded-xl border border-white/20 bg-white/90 px-4 py-2 text-xs font-extrabold text-emerald-700 shadow-lg backdrop-blur-sm">
              {berita.kategori}
            </span>
          </div>

          <div className="p-6 md:p-10">
            <h1 className="text-2xl font-black leading-tight text-gray-900 md:text-4xl">
              {berita.judul}
            </h1>

            <div className="mt-5 flex flex-wrap gap-5 border-b border-gray-100 pb-6 text-sm font-semibold text-gray-500">
              <span className="flex items-center gap-2">
                <Calendar
                  size={16}
                  className="text-emerald-500"
                />

                {formatTanggal(
                  berita.published_at ??
                    berita.created_at
                )}
              </span>

              <span className="flex items-center gap-2">
                <User
                  size={16}
                  className="text-emerald-500"
                />

                {berita.penulis}
              </span>
            </div>

            <p className="mt-7 text-lg font-semibold leading-relaxed text-gray-700">
              {berita.kutipan}
            </p>

            <div className="mt-8 whitespace-pre-line text-justify text-base leading-8 text-gray-700">
              {berita.konten}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}