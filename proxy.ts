// proxy.ts

import { createServerClient } from '@supabase/ssr';

import {
  NextResponse,
  type NextRequest,
} from 'next/server';

export async function proxy(
  request: NextRequest
) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseKey =
    process.env
      .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Mencegah aplikasi error jika environment variable
  // Supabase belum terbaca.
  if (!supabaseUrl || !supabaseKey) {
    console.error(
      'Konfigurasi Supabase untuk Proxy belum tersedia.'
    );

    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet, headers) {
          // Memasukkan cookie terbaru ke request.
          cookiesToSet.forEach(
            ({ name, value }) => {
              request.cookies.set(name, value);
            }
          );

          // Membuat respons baru dengan request
          // yang telah memiliki cookie terbaru.
          supabaseResponse = NextResponse.next({
            request,
          });

          // Mengirim cookie terbaru kembali ke browser.
          cookiesToSet.forEach(
            ({
              name,
              value,
              options,
            }) => {
              supabaseResponse.cookies.set(
                name,
                value,
                options
              );
            }
          );

          // Menyalin header tambahan dari Supabase.
          Object.entries(headers).forEach(
            ([key, value]) => {
              supabaseResponse.headers.set(
                key,
                value
              );
            }
          );
        },
      },
    }
  );

  // Memvalidasi sekaligus memperbarui sesi pengguna.
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/:path*'],
};