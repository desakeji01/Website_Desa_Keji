// app/admin/galeri/page.tsx

import {
  CalendarDays,
  Eye,
  EyeOff,
  Images,
  MapPin,
  Trash2,
} from 'lucide-react';

import GaleriForm from '@/components/admin/GaleriForm';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import {
  deleteAlbumAction,
  toggleAlbumAction,
} from './actions';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

interface AlbumAdminRow {
  id: string;
  judul: string;
  slug: string;
  kategori: string;

  tanggal_kegiatan:
    | string
    | null;

  lokasi:
    | string
    | null;

  foto_sampul_url:
    | string
    | null;

  aktif: boolean;
  urutan: number;
  created_at: string;

  foto_galeri:
    | {
        count: number;
      }[];
}

function formatTanggal(
  value:
    | string
    | null
) {
  if (!value) {
    return '-';
  }

  const date =
    new Date(value);

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

export default async function AdminGaleriPage() {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from('album_galeri')
    .select(`
      id,
      judul,
      slug,
      kategori,
      tanggal_kegiatan,
      lokasi,
      foto_sampul_url,
      aktif,
      urutan,
      created_at,
      foto_galeri(count)
    `)
    .order('urutan', {
      ascending: true,
    })
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    console.error(
      'Gagal mengambil album galeri:',
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

  const daftarAlbum =
    (data ?? []) as
      AlbumAdminRow[];

  const albumAktif =
    daftarAlbum.filter(
      (album) =>
        album.aktif
    ).length;

  const jumlahFoto =
    daftarAlbum.reduce(
      (total, album) =>
        total +
        Number(
          album.foto_galeri?.[0]
            ?.count ?? 0
        ),
      0
    );

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-600">
          Dokumentasi Desa
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
          Kelola Galeri
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
          Kelola album dan dokumentasi kegiatan
          Pemerintah Desa serta masyarakat Desa Keji.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatistikCard
          label="Jumlah Album"
          value={daftarAlbum.length}
        />

        <StatistikCard
          label="Album Aktif"
          value={albumAktif}
        />

        <StatistikCard
          label="Jumlah Foto"
          value={jumlahFoto}
        />
      </section>

      <GaleriForm />

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-black text-slate-900">
            Daftar Album
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Album yang telah dibuat oleh administrator.
          </p>
        </div>

        {daftarAlbum.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
            <Images
              size={42}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-black text-slate-700">
              Belum ada album
            </h3>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {daftarAlbum.map(
              (album) => {
                const fotoCount =
                  Number(
                    album
                      .foto_galeri?.[0]
                      ?.count ?? 0
                  );

                return (
                  <article
                    key={album.id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      {album.foto_sampul_url ? (
                        <img
                          src={
                            album.foto_sampul_url
                          }
                          alt={
                            album.judul
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Images
                            size={40}
                            className="text-slate-300"
                          />
                        </div>
                      )}

                      <span
                        className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-extrabold ${
                          album.aktif
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-700 text-white'
                        }`}
                      >
                        {album.aktif
                          ? 'Dipublikasikan'
                          : 'Disembunyikan'}
                      </span>
                    </div>

                    <div className="p-5">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700">
                        {album.kategori}
                      </span>

                      <h3 className="mt-2 text-lg font-black text-slate-900">
                        {album.judul}
                      </h3>

                      <div className="mt-4 space-y-2 text-xs font-medium text-slate-500">
                        <p className="flex items-center gap-2">
                          <CalendarDays
                            size={14}
                          />

                          {formatTanggal(
                            album.tanggal_kegiatan
                          )}
                        </p>

                        <p className="flex items-center gap-2">
                          <MapPin
                            size={14}
                          />

                          {album.lokasi ??
                            'Lokasi belum diisi'}
                        </p>

                        <p className="flex items-center gap-2">
                          <Images
                            size={14}
                          />

                          {fotoCount} foto
                        </p>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-2">
                        <form
                          action={
                            toggleAlbumAction
                          }
                        >
                          <input
                            type="hidden"
                            name="id"
                            value={album.id}
                          />

                          <input
                            type="hidden"
                            name="aktif"
                            value={String(
                              album.aktif
                            )}
                          />

                          <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700"
                          >
                            {album.aktif ? (
                              <EyeOff
                                size={15}
                              />
                            ) : (
                              <Eye
                                size={15}
                              />
                            )}

                            {album.aktif
                              ? 'Sembunyikan'
                              : 'Publikasikan'}
                          </button>
                        </form>

                        <form
                          action={
                            deleteAlbumAction
                          }
                        >
                          <input
                            type="hidden"
                            name="id"
                            value={album.id}
                          />

                          <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2
                              size={15}
                            />

                            Hapus
                          </button>
                        </form>
                      </div>
                    </div>
                  </article>
                );
              }
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
}: {
  label: string;
  value: number;
}) {
  return (
    <article className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-slate-900">
        {new Intl.NumberFormat(
          'id-ID'
        ).format(value)}
      </p>
    </article>
  );
}