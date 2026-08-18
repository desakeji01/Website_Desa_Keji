// components/umkm/LapakDesaClient.tsx

'use client';

import {
  useMemo,
  useState,
  type FormEvent,
} from 'react';

import {
  BadgeCheck,
  BookOpen,
  ExternalLink,
  FileText,
  MapPin,
  PackageSearch,
  Search,
  ShoppingBag,
  ShoppingCart,
  Store,
  UserRound,
} from 'lucide-react';

import UmkmPanduanBerjualan from '@/components/umkm/UmkmPanduanBerjualan';

import type {
  ProdukUmkm,
} from '@/types/umkm';

/* =========================================================
   TYPES
========================================================= */

interface EcatalogUmkm {
  judul: string;
  deskripsi: string;
  url: string;
  coverUrl: string;
}

interface PanduanUmkm {
  judul: string;
  deskripsi: string;
  gambarUrl: string;
}

interface LapakDesaClientProps {
  produk:
    ProdukUmkm[];

  kategori:
    string[];

  ecatalog:
    | EcatalogUmkm
    | null;

  panduanUmkm:
    | PanduanUmkm
    | null;
}

/* =========================================================
   HELPERS
========================================================= */

function formatRupiah(
  value: number
): string {
  return new Intl.NumberFormat(
    'id-ID',
    {
      style:
        'currency',

      currency:
        'IDR',

      minimumFractionDigits:
        0,

      maximumFractionDigits:
        0,
    }
  ).format(
    Number.isFinite(value)
      ? value
      : 0
  );
}

function normalizeWhatsapp(
  value:
    | string
    | null
): string | null {
  if (!value) {
    return null;
  }

  let nomor =
    value.replace(
      /\D/g,
      ''
    );

  if (
    nomor.startsWith(
      '00'
    )
  ) {
    nomor =
      nomor.slice(2);
  }

  if (
    nomor.startsWith(
      '0'
    )
  ) {
    nomor =
      `62${nomor.slice(
        1
      )}`;
  } else if (
    nomor.startsWith(
      '8'
    )
  ) {
    nomor =
      `62${nomor}`;
  }

  if (
    !nomor.startsWith(
      '62'
    ) ||
    nomor.length < 10 ||
    nomor.length > 16
  ) {
    return null;
  }

  return nomor;
}

function getWhatsappUrl(
  item: ProdukUmkm
): string | null {
  const nomor =
    normalizeWhatsapp(
      item.nomor_whatsapp
    );

  if (!nomor) {
    return null;
  }

  const pesan = [
    'Halo, saya mendapatkan informasi produk dari Website Desa Keji.',
    '',
    `Saya tertarik membeli: ${item.nama_produk}`,
    `Harga: ${formatRupiah(
      item.harga
    )} / ${item.satuan}`,
    '',
    'Apakah produk masih tersedia?',
  ].join('\n');

  return `https://wa.me/${nomor}?text=${encodeURIComponent(
    pesan
  )}`;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function LapakDesaClient({
  produk,
  kategori,
  ecatalog,
  panduanUmkm,
}: LapakDesaClientProps) {
  const [
    kategoriAktif,
    setKategoriAktif,
  ] = useState(
    'Semua Kategori'
  );

  const [
    inputPencarian,
    setInputPencarian,
  ] = useState('');

  const [
    pencarian,
    setPencarian,
  ] = useState('');

  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setPencarian(
      inputPencarian.trim()
    );
  }

  function resetFilter() {
    setKategoriAktif(
      'Semua Kategori'
    );

    setInputPencarian(
      ''
    );

    setPencarian('');
  }

  const produkTersaring =
    useMemo(() => {
      const query =
        pencarian
          .trim()
          .toLowerCase();

      return produk.filter(
        (item) => {
          const sesuaiKategori =
            kategoriAktif ===
              'Semua Kategori' ||
            item.kategori ===
              kategoriAktif;

          const teksPencarian =
            [
              item.nama_produk,
              item.kategori,
              item.deskripsi ??
                '',
              item.nama_penjual,
              item.alamat ??
                '',
            ]
              .join(' ')
              .toLowerCase();

          const sesuaiPencarian =
            query.length ===
              0 ||
            teksPencarian.includes(
              query
            );

          return (
            sesuaiKategori &&
            sesuaiPencarian
          );
        }
      );
    }, [
      kategoriAktif,
      pencarian,
      produk,
    ]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          HEADER LAPAK
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)',

            backgroundSize:
              '26px 26px',
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-[430px] w-[430px] rounded-full border-[70px] border-white/[0.04]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 h-[380px] w-[380px] rounded-full bg-emerald-400/10 blur-[100px]"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex max-w-4xl items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <ShoppingBag
                size={27}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
                Produk Lokal Desa
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Lapak UMKM Desa Keji
              </h1>

              <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80 sm:text-base">
                Temukan produk makanan,
                minuman, kerajinan, dan
                berbagai hasil usaha
                masyarakat Desa Keji.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        {/* ===================================================
            E-CATALOG
        =================================================== */}

        {ecatalog && (
          <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-xl shadow-slate-900/[0.06]">
            <div className="grid lg:grid-cols-[370px_minmax(0,1fr)]">
              {/* Cover */}

              <a
                href={
                  ecatalog.url
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Buka ${ecatalog.judul}`}
                className="group relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f3e7d7] via-[#f9f0e4] to-emerald-50 p-6 sm:p-8"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, rgba(6,78,59,0.15) 1px, transparent 1px)',

                    backgroundSize:
                      '22px 22px',
                  }}
                />

                <div className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl bg-white shadow-2xl transition duration-500 group-hover:-translate-y-1 group-hover:shadow-emerald-950/20">
                  <img
                    src={
                      ecatalog.coverUrl
                    }
                    alt={`Sampul ${ecatalog.judul}`}
                    className="h-auto w-full object-contain"
                  />
                </div>

                <div className="pointer-events-none absolute inset-x-6 bottom-6 flex justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-950/90 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg backdrop-blur">
                    <BookOpen
                      size={15}
                    />

                    Buka E-Catalog
                  </span>
                </div>
              </a>

              {/* Informasi katalog */}

              <div className="relative flex flex-col p-6 sm:p-8 lg:p-10">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-100/70 blur-3xl"
                />

                <div className="relative flex flex-1 flex-col">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <FileText
                      size={23}
                    />
                  </div>

                  <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-700">
                    Katalog Digital UMKM
                  </p>

                  <h2 className="mt-3 text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
                    {
                      ecatalog.judul
                    }
                  </h2>

                  <p className="mt-5 flex-1 text-sm font-medium leading-8 text-slate-600 sm:text-base">
                    {
                      ecatalog.deskripsi
                    }
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                      Produk Lokal
                    </span>

                    <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                      Katalog Digital
                    </span>

                    <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                      Akses Gratis
                    </span>
                  </div>

                  <a
                    href={
                      ecatalog.url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white shadow-md transition hover:bg-emerald-800"
                  >
                    <BookOpen
                      size={18}
                    />

                    Buka E-Catalog

                    <ExternalLink
                      size={15}
                    />
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ===================================================
            PANDUAN SUKSES BERJUALAN
        =================================================== */}

        {panduanUmkm && (
          <UmkmPanduanBerjualan
            panduan={
              panduanUmkm
            }
          />
        )}

        {/* ===================================================
            DAFTAR PRODUK
        =================================================== */}

        <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-sm">
          <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white px-5 py-6 sm:px-7">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
              Produk UMKM
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              Daftar Produk Lokal
            </h2>

            <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-slate-500">
              Gunakan kategori dan
              pencarian untuk menemukan
              produk atau pelaku UMKM.
            </p>
          </div>

          {/* Filter */}

          <form
            onSubmit={
              handleSubmit
            }
            className="grid gap-3 border-b border-emerald-100 bg-slate-50/70 p-5 sm:p-7 md:grid-cols-[minmax(220px,0.75fr)_minmax(260px,1fr)_auto]"
          >
            <label
              htmlFor="kategori-umkm"
              className="sr-only"
            >
              Pilih kategori
            </label>

            <select
              id="kategori-umkm"
              value={
                kategoriAktif
              }
              onChange={(
                event
              ) =>
                setKategoriAktif(
                  event.target
                    .value
                )
              }
              className="h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="Semua Kategori">
                Semua Kategori
              </option>

              {kategori.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>

            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={
                  inputPencarian
                }
                onChange={(
                  event
                ) =>
                  setInputPencarian(
                    event.target
                      .value
                  )
                }
                placeholder="Cari produk atau penjual"
                className="h-12 w-full rounded-xl border-2 border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white shadow-md transition hover:bg-emerald-800"
            >
              <Search
                size={17}
              />

              Cari Produk
            </button>
          </form>

          {/* Ringkasan */}

          <div className="flex flex-col gap-2 px-5 pt-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p className="text-sm font-bold text-slate-700">
              Menampilkan{' '}

              <span className="text-emerald-700">
                {
                  produkTersaring.length
                }
              </span>{' '}

              dari{' '}

              <span className="text-emerald-700">
                {produk.length}
              </span>{' '}

              produk
            </p>

            {(pencarian ||
              kategoriAktif !==
                'Semua Kategori') && (
              <button
                type="button"
                onClick={
                  resetFilter
                }
                className="w-fit text-xs font-extrabold text-emerald-700 transition hover:text-emerald-900"
              >
                Hapus semua filter
              </button>
            )}
          </div>

          {/* Daftar Produk */}

          <div className="p-5 sm:p-7">
            {produkTersaring.length >
            0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {produkTersaring.map(
                  (item) => (
                    <ProdukCard
                      key={
                        item.id
                      }
                      item={
                        item
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <ProdukEmptyState />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProdukCard({
  item,
}: {
  item: ProdukUmkm;
}) {
  const whatsappUrl =
    getWhatsappUrl(
      item
    );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl">
      {/* Gambar produk */}

      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {item.gambar_url ? (
          <img
            src={
              item.gambar_url
            }
            alt={
              item.nama_produk
            }
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-slate-300">
            <ShoppingBag
              size={44}
            />

            <span className="mt-2 text-xs font-bold">
              Belum ada foto
            </span>
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700 shadow-sm backdrop-blur">
          {item.kategori}
        </span>

        {item.terverifikasi && (
          <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-md">
            <BadgeCheck
              size={19}
            />
          </span>
        )}
      </div>

      {/* Informasi */}

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-black leading-snug text-slate-900">
          {
            item.nama_produk
          }
        </h3>

        <div className="mt-2 flex flex-wrap items-end gap-1">
          <p className="text-xl font-black text-emerald-800">
            {formatRupiah(
              item.harga
            )}
          </p>

          <span className="pb-0.5 text-xs font-semibold text-slate-500">
            / {item.satuan}
          </span>
        </div>

        {item.deskripsi && (
          <p className="mt-3 line-clamp-4 text-sm font-medium leading-6 text-slate-600">
            {
              item.deskripsi
            }
          </p>
        )}

        <div className="mt-4 flex items-start gap-2">
          <UserRound
            size={15}
            className="mt-0.5 shrink-0 text-emerald-700"
          />

          <div className="min-w-0">
            <p className="truncate text-xs font-black uppercase tracking-wide text-slate-700">
              {
                item.nama_penjual
              }
            </p>

            {item.terverifikasi && (
              <p className="mt-1 text-[10px] font-bold text-emerald-700">
                UMKM Terverifikasi
              </p>
            )}
          </div>
        </div>

        {item.alamat && (
          <div className="mt-3 flex items-start gap-2 text-xs font-medium leading-5 text-slate-500">
            <Store
              size={14}
              className="mt-0.5 shrink-0 text-emerald-700"
            />

            <span>
              {item.alamat}
            </span>
          </div>
        )}

        {/* Tombol */}

        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          {whatsappUrl ? (
            <a
              href={
                whatsappUrl
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 text-xs font-extrabold text-white transition hover:bg-emerald-800"
            >
              <ShoppingCart
                size={15}
              />

              Beli
            </a>
          ) : (
            <span className="inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-200 px-3 text-xs font-extrabold text-slate-400">
              <ShoppingCart
                size={15}
              />

              Beli
            </span>
          )}

          {item.lokasi_url ? (
            <a
              href={
                item.lokasi_url
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-100"
            >
              <MapPin
                size={15}
              />

              Lokasi
            </a>
          ) : (
            <span className="inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 text-xs font-extrabold text-slate-400">
              <MapPin
                size={15}
              />

              Lokasi
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function ProdukEmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-emerald-200 bg-slate-50 px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-400">
        <PackageSearch
          size={34}
        />
      </div>

      <h2 className="mt-5 text-lg font-black text-slate-800">
        Produk tidak ditemukan
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-7 text-slate-500">
        Gunakan kata kunci lain atau
        pilih semua kategori untuk
        melihat produk yang tersedia.
      </p>
    </div>
  );
}