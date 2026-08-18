// app/api/berita/route.ts

import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { createClient } from '@/lib/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest
) {
  const supabase =
    await createClient();

  const searchParams =
    request.nextUrl.searchParams;

  const requestedLimit =
    Number(
      searchParams.get('limit') ?? 3
    );

  const limit =
    Number.isInteger(requestedLimit)
      ? Math.min(
          Math.max(
            requestedLimit,
            1
          ),
          50
        )
      : 3;

  const category =
    searchParams.get('category');

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
    )
    .limit(limit);

  if (
    category &&
    category !== 'Semua'
  ) {
    query = query.eq(
      'kategori',
      category
    );
  }

  const {
    data,
    error,
  } = await query;

  if (error) {
    console.error(
      'Gagal mengambil berita publik:',
      error
    );

    return NextResponse.json(
      {
        message:
          'Berita tidak dapat dimuat.',
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(
    {
      data: data ?? [],
    },
    {
      headers: {
        'Cache-Control':
          'no-store, max-age=0',
      },
    }
  );
}