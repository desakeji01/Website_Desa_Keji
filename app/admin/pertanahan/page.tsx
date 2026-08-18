// app/admin/pertanahan/page.tsx

import Link from 'next/link';

import {
  BarChart3,
  CheckCircle2,
  Database,
  ExternalLink,
  FolderOpen,
  Image as ImageIcon,
  Pencil,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';

import {
  hapusAlbumPertanahanAction,
  hapusFotoPertanahanAction,
  simpanPertanahanSettingsAction,
  tambahAlbumPertanahanAction,
  tambahFotoPertanahanAction,
  ubahAlbumPertanahanAction,
  ubahFotoPertanahanAction,
} from '@/app/admin/pertanahan/actions';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  PertanahanAlbum,
  PertanahanAlbumWithFotos,
  PertanahanFoto,
  PertanahanSettings,
} from '@/types/pertanahan';

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

/* =========================================================
   TYPES
========================================================= */

interface PageProps {
  searchParams:
    Promise<{
      success?:
        string;

      error?:
        string;
    }>;
}

/* =========================================================
   FALLBACK
========================================================= */

const fallbackSettings:
  PertanahanSettings = {
  setting_key:
    'utama',

  judul:
    'Album Pertanahan Desa Keji',

  deskripsi:
    'Dokumentasi pertanahan dan administrasi kewilayahan Desa Keji yang disajikan dalam bentuk album foto.',

  tahun_data:
    2026,

  sumber_data:
    'Pemerintah Desa Keji',

  catatan:
    'Dokumentasi ditampilkan untuk kepentingan informasi publik dan tidak memuat data pribadi pemilik tanah.',

  peta_url:
    null,

  aktif:
    true,

  updated_at:
    '',
};

/* =========================================================
   PAGE
========================================================= */

export default async function AdminPertanahanPage({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;

  const [
    settingsResult,
    albumResult,
    fotoResult,
  ] =
    await Promise.all([
      supabaseAdmin
        .from(
          'pertanahan_settings'
        )
        .select(`
          setting_key,
          judul,
          deskripsi,
          tahun_data,
          sumber_data,
          catatan,
          peta_url,
          aktif,
          created_at,
          updated_at
        `)
        .eq(
          'setting_key',
          'utama'
        )
        .maybeSingle(),

      supabaseAdmin
        .from(
          'pertanahan_album'
        )
        .select(`
          id,
          judul,
          slug,
          deskripsi,
          tahun,
          aktif,
          urutan,
          created_at,
          updated_at
        `)
        .order(
          'urutan',
          {
            ascending:
              true,
          }
        )
        .order(
          'created_at',
          {
            ascending:
              false,
          }
        ),

      supabaseAdmin
        .from(
          'pertanahan_foto'
        )
        .select(`
          id,
          album_id,
          foto_url,
          foto_path,
          caption,
          urutan,
          aktif,
          created_at,
          updated_at
        `)
        .order(
          'urutan',
          {
            ascending:
              true,
          }
        )
        .order(
          'created_at',
          {
            ascending:
              true,
          }
        ),
    ]);

  if (
    settingsResult.error
  ) {
    console.error(
      'Gagal mengambil settings Pertanahan:',
      settingsResult.error
    );
  }

  if (
    albumResult.error
  ) {
    console.error(
      'Gagal mengambil album Pertanahan:',
      albumResult.error
    );
  }

  if (
    fotoResult.error
  ) {
    console.error(
      'Gagal mengambil foto Pertanahan:',
      fotoResult.error
    );
  }

  const settings =
    {
      ...fallbackSettings,

      ...(settingsResult.data ??
        {}),
    } as PertanahanSettings;

  const foto =
    (
      fotoResult.data ??
      []
    ) as PertanahanFoto[];

  const albums =
    (
      albumResult.data ??
      []
    ).map(
      (
        album
      ) => ({
        ...album,

        fotos:
          foto.filter(
            (
              item
            ) =>
              item.album_id ===
              album.id
          ),
      })
    ) as PertanahanAlbumWithFotos[];

  const albumAktif =
    albums.filter(
      (
        album
      ) =>
        album.aktif
    );

  const fotoAktif =
    foto.filter(
      (
        item
      ) =>
        item.aktif
    );

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      {/* ===================================================
          HEADER
      =================================================== */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 px-6 py-8 text-white shadow-xl">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,.55) 1px, transparent 1px)',

            backgroundSize:
              '25px 25px',
          }}
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <FolderOpen
                size={27}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-200">
                Data Desa
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                Album Pertanahan
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                Buat album dan unggah
                dokumentasi
                pertanahan Desa Keji
                langsung dari
                perangkat.
              </p>
            </div>
          </div>

          <Link
            href="/data-desa/pertanahan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white transition hover:bg-white/15"
          >
            Lihat Halaman Publik

            <ExternalLink
              size={16}
            />
          </Link>
        </div>
      </section>

      {/* ===================================================
          MESSAGE
      =================================================== */}

      {params.success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle2
            size={19}
            className="mt-0.5 shrink-0"
          />

          <p className="text-sm font-semibold">
            {params.success}
          </p>
        </div>
      )}

      {params.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {params.error}
        </div>
      )}

      {/* ===================================================
          STATS
      =================================================== */}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Album"
          value={String(
            albums.length
          )}
        />

        <StatCard
          label="Album Aktif"
          value={String(
            albumAktif.length
          )}
        />

        <StatCard
          label="Total Foto"
          value={String(
            foto.length
          )}
        />

        <StatCard
          label="Foto Aktif"
          value={String(
            fotoAktif.length
          )}
        />
      </section>

      {/* ===================================================
          SETTINGS
      =================================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white">
              <Database
                size={22}
              />
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                Informasi Umum
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                Pengaturan Album
                Pertanahan
              </h2>
            </div>
          </div>
        </div>

        <form
          action={
            simpanPertanahanSettingsAction
          }
          className="grid gap-5 p-6 md:grid-cols-2"
        >
          <Input
            label="Judul Halaman"
            name="judul"
            value={
              settings.judul
            }
          />

          <Input
            label="Tahun Data"
            name="tahun_data"
            type="number"
            value={
              settings.tahun_data
                ? String(
                    settings.tahun_data
                  )
                : ''
            }
            required={
              false
            }
          />

          <div className="md:col-span-2">
            <Textarea
              label="Deskripsi"
              name="deskripsi"
              value={
                settings.deskripsi
              }
            />
          </div>

          <Input
            label="Sumber Data"
            name="sumber_data"
            value={
              settings.sumber_data ??
              ''
            }
            required={
              false
            }
          />

          <div className="md:col-span-2">
            <Textarea
              label="Catatan"
              name="catatan"
              value={
                settings.catatan ??
                ''
              }
              required={
                false
              }
            />
          </div>

          <div className="md:col-span-2">
            <ActiveField
              defaultChecked={
                settings.aktif
              }
              label="Aktifkan Halaman Pertanahan"
              description="Jika aktif, album Pertanahan dapat ditampilkan pada halaman publik."
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800"
            >
              <Save
                size={16}
              />

              Simpan Pengaturan
            </button>
          </div>
        </form>
      </section>

      {/* ===================================================
          CREATE ALBUM
      =================================================== */}

      <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-emerald-50 shadow-sm">
        <details>
          <summary className="flex cursor-pointer list-none items-center gap-3 p-6 text-sm font-extrabold text-emerald-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <Plus
                size={18}
              />
            </div>

            Buat Album Pertanahan Baru
          </summary>

          <form
            action={
              tambahAlbumPertanahanAction
            }
            className="grid gap-5 border-t border-emerald-100 bg-white p-6 md:grid-cols-2"
          >
            <AlbumFields />

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800"
              >
                <Plus
                  size={16}
                />

                Buat Album
              </button>
            </div>
          </form>
        </details>
      </section>

      {/* ===================================================
          ALBUM LIST
      =================================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">
            Dokumentasi
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-900">
            Daftar Album Pertanahan
          </h2>

          <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
            Foto pertama berdasarkan
            nomor urutan akan
            digunakan sebagai cover
            album pada halaman
            publik.
          </p>
        </div>

        {albums.length ===
        0 ? (
          <div className="px-6 py-16 text-center">
            <FolderOpen
              size={44}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-black text-slate-700">
              Belum ada album
              Pertanahan
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm font-medium leading-6 text-slate-500">
              Buat album terlebih
              dahulu, kemudian unggah
              foto dari perangkat.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {albums.map(
              (
                album
              ) => (
                <AlbumAdminCard
                  key={
                    album.id
                  }
                  album={
                    album
                  }
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   ALBUM CARD
========================================================= */

function AlbumAdminCard({
  album,
}: {
  album:
    PertanahanAlbumWithFotos;
}) {
  const cover =
    album.fotos.find(
      (
        foto
      ) =>
        foto.aktif
    ) ??
    album.fotos[0] ??
    null;

  return (
    <article className="p-6">
      <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
        {/* COVER */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          {cover ? (
            <img
              src={
                cover.foto_url
              }
              alt={
                album.judul
              }
              className="aspect-[4/3] h-full min-h-[180px] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] min-h-[180px] items-center justify-center">
              <ImageIcon
                size={38}
                className="text-slate-300"
              />
            </div>
          )}
        </div>

        {/* INFO */}

        <div className="min-w-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                {album.tahun && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-emerald-700">
                    {
                      album.tahun
                    }
                  </span>
                )}

                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-extrabold text-slate-600">
                  {album.fotos.length}{' '}
                  Foto
                </span>

                {!album.aktif && (
                  <span className="rounded-full bg-slate-200 px-3 py-1 text-[10px] font-extrabold text-slate-500">
                    Nonaktif
                  </span>
                )}

                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-extrabold text-slate-500">
                  Urutan{' '}
                  {
                    album.urutan
                  }
                </span>
              </div>

              <h3 className="mt-3 text-xl font-black text-slate-900">
                {
                  album.judul
                }
              </h3>

              {album.deskripsi && (
                <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-slate-500">
                  {
                    album.deskripsi
                  }
                </p>
              )}
            </div>

            <form
              action={
                hapusAlbumPertanahanAction
              }
            >
              <input
                type="hidden"
                name="id"
                value={
                  album.id
                }
              />

              <button
                type="submit"
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-extrabold text-red-700 transition hover:bg-red-100"
              >
                <Trash2
                  size={15}
                />

                Hapus Album
              </button>
            </form>
          </div>

          {/* EDIT ALBUM */}

          <details className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <summary className="flex cursor-pointer list-none items-center gap-2 p-4 text-xs font-extrabold text-emerald-700">
              <Pencil
                size={15}
              />

              Edit Album
            </summary>

            <form
              action={ubahAlbumPertanahanAction.bind(
                null,
                album.id
              )}
              className="grid gap-5 border-t border-slate-200 bg-white p-5 md:grid-cols-2"
            >
              <AlbumFields
                album={
                  album
                }
              />

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 text-xs font-extrabold text-white"
                >
                  <Save
                    size={15}
                  />

                  Simpan Perubahan
                </button>
              </div>
            </form>
          </details>

          {/* UPLOAD FOTO */}

          <details className="mt-4 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50">
            <summary className="flex cursor-pointer list-none items-center gap-2 p-4 text-xs font-extrabold text-emerald-800">
              <Plus
                size={15}
              />

              Upload Foto ke Album
            </summary>

            <form
              action={tambahFotoPertanahanAction.bind(
                null,
                album.id
              )}
              className="grid gap-5 border-t border-emerald-100 bg-white p-5 md:grid-cols-2"
            >
              <div className="md:col-span-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Pilih Foto dari
                    Perangkat
                  </span>

                  <input
                    type="file"
                    name="foto"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    required
                    className="block w-full rounded-xl border border-dashed border-emerald-300 bg-emerald-50 p-4 text-sm font-semibold text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-4 file:py-2 file:text-xs file:font-extrabold file:text-white"
                  />

                  <p className="mt-2 text-xs font-medium leading-5 text-slate-400">
                    Bisa memilih
                    beberapa foto.
                    Maksimal 5 MB per
                    foto dan total
                    sekitar 9 MB per
                    sekali upload.
                  </p>
                </label>
              </div>

              <Input
                label="Urutan Awal"
                name="urutan_awal"
                type="number"
                min="0"
                value={String(
                  album.fotos.length
                )}
              />

              <Input
                label="Caption Default"
                name="caption"
                value=""
                required={
                  false
                }
                placeholder="Opsional"
              />

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800"
                >
                  <ImageIcon
                    size={16}
                  />

                  Upload Foto
                </button>
              </div>
            </form>
          </details>

          {/* FOTO LIST */}

          {album.fotos.length >
            0 && (
            <div className="mt-6">
              <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                Foto Dalam Album
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {album.fotos.map(
                  (
                    foto
                  ) => (
                    <PhotoAdminCard
                      key={
                        foto.id
                      }
                      foto={
                        foto
                      }
                    />
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   PHOTO CARD
========================================================= */

function PhotoAdminCard({
  foto,
}: {
  foto:
    PertanahanFoto;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="relative">
        <img
          src={
            foto.foto_url
          }
          alt={
            foto.caption ??
            'Dokumentasi Pertanahan'
          }
          className="aspect-[4/3] w-full object-cover"
        />

        {!foto.aktif && (
          <span className="absolute left-3 top-3 rounded-full bg-slate-950/70 px-3 py-1 text-[9px] font-extrabold text-white backdrop-blur">
            Nonaktif
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs font-bold text-slate-600">
          {foto.caption ||
            'Tanpa caption'}
        </p>

        <p className="mt-1 text-[10px] font-semibold text-slate-400">
          Urutan{' '}
          {
            foto.urutan
          }
        </p>

        <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50">
          <summary className="cursor-pointer list-none p-3 text-xs font-extrabold text-emerald-700">
            Edit Foto
          </summary>

          <form
            action={ubahFotoPertanahanAction.bind(
              null,
              foto.id
            )}
            className="space-y-4 border-t border-slate-200 bg-white p-4"
          >
            <Input
              label="Caption"
              name="caption"
              value={
                foto.caption ??
                ''
              }
              required={
                false
              }
            />

            <Input
              label="Urutan"
              name="urutan"
              type="number"
              min="0"
              value={String(
                foto.urutan
              )}
            />

            <label className="block">
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Ganti Foto
              </span>

              <input
                type="file"
                name="foto_pengganti"
                accept="image/jpeg,image/png,image/webp"
                className="block w-full text-xs"
              />
            </label>

            <ActiveField
              defaultChecked={
                foto.aktif
              }
              label="Tampilkan Foto"
              description="Foto aktif akan tampil pada album publik."
            />

            <button
              type="submit"
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white"
            >
              <Save
                size={14}
              />

              Simpan Foto
            </button>
          </form>
        </details>

        <form
          action={
            hapusFotoPertanahanAction
          }
          className="mt-2"
        >
          <input
            type="hidden"
            name="id"
            value={
              foto.id
            }
          />

          <button
            type="submit"
            className="inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-extrabold text-red-700 transition hover:bg-red-100"
          >
            <Trash2
              size={14}
            />

            Hapus Foto
          </button>
        </form>
      </div>
    </article>
  );
}

/* =========================================================
   ALBUM FIELDS
========================================================= */

function AlbumFields({
  album,
}: {
  album?:
    PertanahanAlbum;
}) {
  return (
    <>
      <Input
        label="Judul Album"
        name="judul"
        value={
          album?.judul ??
          ''
        }
        placeholder="Contoh: Dokumentasi Sertifikasi Tanah"
      />

      <Input
        label="Tahun"
        name="tahun"
        type="number"
        min="1900"
        value={
          album?.tahun
            ? String(
                album.tahun
              )
            : ''
        }
        required={
          false
        }
      />

      <Input
        label="Urutan"
        name="urutan"
        type="number"
        min="0"
        value={String(
          album?.urutan ??
            0
        )}
      />

      <div className="md:col-span-2">
        <Textarea
          label="Deskripsi Album"
          name="deskripsi"
          value={
            album?.deskripsi ??
            ''
          }
          required={
            false
          }
        />
      </div>

      <div className="md:col-span-2">
        <ActiveField
          defaultChecked={
            album
              ? album.aktif
              : true
          }
          label="Publikasikan Album"
          description="Album aktif akan tampil pada halaman Pertanahan."
        />
      </div>
    </>
  );
}

/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  name,
  value,
  type =
    'text',
  required =
    true,
  placeholder,
  min,
}: {
  label:
    string;

  name:
    string;

  value:
    string;

  type?:
    string;

  required?:
    boolean;

  placeholder?:
    string;

  min?:
    string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <input
        type={
          type
        }
        name={
          name
        }
        required={
          required
        }
        defaultValue={
          value
        }
        placeholder={
          placeholder
        }
        min={
          min
        }
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function Textarea({
  label,
  name,
  value,
  required =
    true,
}: {
  label:
    string;

  name:
    string;

  value:
    string;

  required?:
    boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <textarea
        name={
          name
        }
        required={
          required
        }
        defaultValue={
          value
        }
        rows={4}
        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium leading-7 text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

/* =========================================================
   ACTIVE
========================================================= */

function ActiveField({
  defaultChecked,
  label,
  description,
}: {
  defaultChecked:
    boolean;

  label:
    string;

  description:
    string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
      <input
        type="checkbox"
        name="aktif"
        value="true"
        defaultChecked={
          defaultChecked
        }
        className="mt-1 h-4 w-4 accent-emerald-700"
      />

      <span>
        <span className="block text-sm font-extrabold text-emerald-900">
          {label}
        </span>

        <span className="mt-1 block text-xs font-medium leading-5 text-emerald-700">
          {description}
        </span>
      </span>
    </label>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
      <BarChart3
        size={21}
        className="text-emerald-700"
      />

      <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-slate-900">
        {value}
      </p>
    </article>
  );
}