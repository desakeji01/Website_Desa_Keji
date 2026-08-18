'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Search,
  ToggleLeft,
  ToggleRight,
  UserRound,
  X,
} from 'lucide-react';

import {
  toggleStatusWargaAction,
} from '@/app/admin/warga/actions';

import type {
  Warga,
} from '@/types/warga';

const DATA_PER_PAGE = 50;

interface WargaTableProps {
  daftarWarga: Warga[];
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
      month: 'short',
      year: 'numeric',
      timeZone:
        'Asia/Jakarta',
    }
  ).format(date);
}

function formatTanggalExcel(
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
      month: '2-digit',
      year: 'numeric',
      timeZone:
        'Asia/Jakarta',
    }
  ).format(date);
}

function maskNomor(
  lastFourDigits:
    | string
    | null
) {
  if (!lastFourDigits) {
    return '-';
  }

  return `************${lastFourDigits}`;
}

function formatJenisKelamin(
  value:
    | 'L'
    | 'P'
    | null
) {
  if (value === 'L') {
    return 'Laki-laki';
  }

  if (value === 'P') {
    return 'Perempuan';
  }

  return 'Belum diisi';
}

function formatStatusPenduduk(
  value:
    | 'TETAP'
    | 'TIDAK_TETAP'
    | null
) {
  if (value === 'TETAP') {
    return 'Penduduk Tetap';
  }

  if (
    value ===
    'TIDAK_TETAP'
  ) {
    return 'Penduduk Tidak Tetap';
  }

  return 'Belum diisi';
}

function getStatusPendudukClass(
  value:
    | 'TETAP'
    | 'TIDAK_TETAP'
    | null
) {
  if (value === 'TETAP') {
    return 'bg-emerald-100 text-emerald-700';
  }

  if (
    value ===
    'TIDAK_TETAP'
  ) {
    return 'bg-amber-100 text-amber-700';
  }

  return 'bg-slate-100 text-slate-500';
}

function formatKodeWilayah(
  value:
    | string
    | null
) {
  if (!value) {
    return '-';
  }

  const number =
    Number(value);

  if (
    Number.isNaN(number)
  ) {
    return value;
  }

  return String(number);
}

function normalizeSearch(
  value:
    | string
    | null
    | undefined
) {
  return String(
    value ?? ''
  )
    .toLowerCase()
    .trim();
}

function buatDaftarHalaman(
  halamanAktif: number,
  totalHalaman: number
) {
  if (
    totalHalaman <= 7
  ) {
    return Array.from(
      {
        length:
          totalHalaman,
      },
      (_, index) =>
        index + 1
    );
  }

  const hasil: Array<
    number | 'ellipsis'
  > = [];

  if (
    halamanAktif <= 4
  ) {
    hasil.push(
      1,
      2,
      3,
      4,
      5,
      'ellipsis',
      totalHalaman
    );

    return hasil;
  }

  if (
    halamanAktif >=
    totalHalaman - 3
  ) {
    hasil.push(
      1,
      'ellipsis',
      totalHalaman - 4,
      totalHalaman - 3,
      totalHalaman - 2,
      totalHalaman - 1,
      totalHalaman
    );

    return hasil;
  }

  hasil.push(
    1,
    'ellipsis',
    halamanAktif - 1,
    halamanAktif,
    halamanAktif + 1,
    'ellipsis',
    totalHalaman
  );

  return hasil;
}

export default function WargaTable({
  daftarWarga,
}: WargaTableProps) {
  const [
    kataKunci,
    setKataKunci,
  ] = useState('');

  const [
    halamanAktif,
    setHalamanAktif,
  ] = useState(1);

  const [
    sedangDownload,
    setSedangDownload,
  ] = useState(false);

  const daftarTerfilter =
    useMemo(
      () => {
        const keyword =
          normalizeSearch(
            kataKunci
          );

        if (!keyword) {
          return daftarWarga;
        }

        return daftarWarga.filter(
          (warga) => {
            const searchableText = [
              warga.nama_lengkap,

              warga.nik_empat_terakhir,

              warga.no_kk_empat_terakhir,

              warga.jenis_kelamin,

              formatJenisKelamin(
                warga.jenis_kelamin
              ),

              warga.status_penduduk,

              formatStatusPenduduk(
                warga.status_penduduk
              ),

              warga.dusun,

              warga.rw,

              warga.rt,

              formatKodeWilayah(
                warga.rw
              ),

              formatKodeWilayah(
                warga.rt
              ),

              warga.alamat,

              warga.nomor_whatsapp,

              warga.tanggal_lahir,
            ]
              .map(
                normalizeSearch
              )
              .join(' ');

            return searchableText.includes(
              keyword
            );
          }
        );
      },
      [
        daftarWarga,
        kataKunci,
      ]
    );

  const totalData =
    daftarTerfilter.length;

  const totalHalaman =
    Math.max(
      1,
      Math.ceil(
        totalData /
          DATA_PER_PAGE
      )
    );

  useEffect(() => {
    setHalamanAktif(1);
  }, [kataKunci]);

  useEffect(() => {
    if (
      halamanAktif >
      totalHalaman
    ) {
      setHalamanAktif(
        totalHalaman
      );
    }
  }, [
    halamanAktif,
    totalHalaman,
  ]);

  const indexAwal =
    (halamanAktif - 1) *
    DATA_PER_PAGE;

  const indexAkhir =
    Math.min(
      indexAwal +
        DATA_PER_PAGE,
      totalData
    );

  const wargaHalamanIni =
    daftarTerfilter.slice(
      indexAwal,
      indexAkhir
    );

  const daftarHalaman =
    buatDaftarHalaman(
      halamanAktif,
      totalHalaman
    );

  function pindahHalaman(
    halaman: number
  ) {
    if (
      halaman < 1 ||
      halaman >
        totalHalaman
    ) {
      return;
    }

    setHalamanAktif(
      halaman
    );

    const tableElement =
      document.getElementById(
        'daftar-warga'
      );

    if (tableElement) {
      const top =
        tableElement.getBoundingClientRect()
          .top +
        window.scrollY -
        110;

      window.scrollTo({
        top,
        behavior:
          'smooth',
      });
    }
  }

  async function downloadExcel() {
    if (
      daftarTerfilter.length ===
      0
    ) {
      return;
    }

    setSedangDownload(
      true
    );

    try {
      const XLSX =
        await import('xlsx');

      const dataExcel =
        daftarTerfilter.map(
          (
            warga,
            index
          ) => ({
            No:
              index + 1,

            'Nama Lengkap':
              warga.nama_lengkap,

            NIK:
              maskNomor(
                warga.nik_empat_terakhir
              ),

            'Nomor KK':
              maskNomor(
                warga.no_kk_empat_terakhir
              ),

            'Jenis Kelamin':
              formatJenisKelamin(
                warga.jenis_kelamin
              ),

            'Tanggal Lahir':
              formatTanggalExcel(
                warga.tanggal_lahir
              ),

            'Status Penduduk':
              formatStatusPenduduk(
                warga.status_penduduk
              ),

            Dusun:
              warga.dusun ??
              '-',

            RT:
              formatKodeWilayah(
                warga.rt
              ),

            RW:
              formatKodeWilayah(
                warga.rw
              ),

            Alamat:
              warga.alamat ??
              '-',

            WhatsApp:
              warga.nomor_whatsapp ??
              '-',

            'Status Akses':
              warga.aktif
                ? 'Aktif'
                : 'Nonaktif',

            'Tanggal Terdaftar':
              formatTanggalExcel(
                warga.created_at
              ),
          })
        );

      const worksheet =
        XLSX.utils.json_to_sheet(
          dataExcel
        );

      worksheet['!cols'] = [
        {
          wch: 7,
        },
        {
          wch: 32,
        },
        {
          wch: 20,
        },
        {
          wch: 20,
        },
        {
          wch: 18,
        },
        {
          wch: 16,
        },
        {
          wch: 22,
        },
        {
          wch: 20,
        },
        {
          wch: 8,
        },
        {
          wch: 8,
        },
        {
          wch: 38,
        },
        {
          wch: 18,
        },
        {
          wch: 15,
        },
        {
          wch: 20,
        },
      ];

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Data Warga'
      );

      const sekarang =
        new Date();

      const tanggalFile =
        [
          sekarang.getFullYear(),

          String(
            sekarang.getMonth() +
              1
          ).padStart(
            2,
            '0'
          ),

          String(
            sekarang.getDate()
          ).padStart(
            2,
            '0'
          ),
        ].join('-');

      const suffix =
        kataKunci.trim()
          ? '-hasil-pencarian'
          : '';

      XLSX.writeFile(
        workbook,
        `data-warga-desa-keji${suffix}-${tanggalFile}.xlsx`
      );
    } catch (error) {
      console.error(
        'Download Excel gagal:',
        error
      );

      window.alert(
        'File Excel belum dapat dibuat. Silakan coba kembali.'
      );
    } finally {
      setSedangDownload(
        false
      );
    }
  }

  return (
    <section
      id="daftar-warga"
      className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
    >
      {/* =====================================================
          HEADER TABEL
      ===================================================== */}

      <div className="border-b border-slate-100 p-5 md:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
              <UserRound
                size={21}
              />
            </div>

            <div>
              <h2 className="font-black text-slate-900">
                Daftar Warga
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                NIK dan nomor KK
                ditampilkan dalam
                bentuk tersamarkan.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* SEARCH */}

            <div className="relative min-w-0 sm:w-[340px]">
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={
                  kataKunci
                }
                onChange={(
                  event
                ) =>
                  setKataKunci(
                    event.target
                      .value
                  )
                }
                placeholder="Cari nama, NIK, KK, RT, RW, alamat..."
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />

              {kataKunci ? (
                <button
                  type="button"
                  onClick={() =>
                    setKataKunci(
                      ''
                    )
                  }
                  aria-label="Hapus pencarian"
                  className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                >
                  <X
                    size={15}
                  />
                </button>
              ) : null}
            </div>

            {/* DOWNLOAD */}

            <button
              type="button"
              onClick={
                downloadExcel
              }
              disabled={
                sedangDownload ||
                daftarTerfilter.length ===
                  0
              }
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {sedangDownload ? (
                <>
                  <FileSpreadsheet
                    size={17}
                    className="animate-pulse"
                  />

                  Membuat Excel...
                </>
              ) : (
                <>
                  <Download
                    size={17}
                  />

                  Download Excel
                </>
              )}
            </button>
          </div>
        </div>

        {/* INFORMASI HASIL */}

        <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-slate-500">
            {kataKunci ? (
              <>
                Ditemukan{' '}
                <span className="font-black text-emerald-700">
                  {new Intl.NumberFormat(
                    'id-ID'
                  ).format(
                    totalData
                  )}
                </span>{' '}
                warga untuk pencarian{' '}
                <span className="font-black text-slate-700">
                  &quot;
                  {
                    kataKunci
                  }
                  &quot;
                </span>
              </>
            ) : (
              <>
                Total{' '}
                <span className="font-black text-emerald-700">
                  {new Intl.NumberFormat(
                    'id-ID'
                  ).format(
                    totalData
                  )}
                </span>{' '}
                data warga
              </>
            )}
          </p>

          {totalData >
          0 ? (
            <p className="font-semibold text-slate-400">
              Menampilkan{' '}
              <span className="font-black text-slate-600">
                {new Intl.NumberFormat(
                  'id-ID'
                ).format(
                  indexAwal +
                    1
                )}
              </span>
              {' – '}
              <span className="font-black text-slate-600">
                {new Intl.NumberFormat(
                  'id-ID'
                ).format(
                  indexAkhir
                )}
              </span>{' '}
              dari{' '}
              <span className="font-black text-slate-600">
                {new Intl.NumberFormat(
                  'id-ID'
                ).format(
                  totalData
                )}
              </span>
            </p>
          ) : null}
        </div>
      </div>

      {/* =====================================================
          DATA KOSONG
      ===================================================== */}

      {daftarWarga.length ===
      0 ? (
        <EmptyState
          title="Belum ada data warga"
          description="Belum ada data warga yang ditambahkan ke database."
        />
      ) : totalData ===
        0 ? (
        <EmptyState
          title="Warga tidak ditemukan"
          description={`Tidak ada data yang cocok dengan pencarian "${kataKunci}".`}
          showReset
          onReset={() =>
            setKataKunci(
              ''
            )
          }
        />
      ) : (
        <>
          {/* =================================================
              DESKTOP TABLE
          ================================================= */}

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1250px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="w-[70px] px-5 py-4 text-center">
                    No
                  </th>

                  <th className="px-5 py-4">
                    Warga
                  </th>

                  <th className="px-5 py-4">
                    Identitas
                  </th>

                  <th className="px-5 py-4">
                    Demografi
                  </th>

                  <th className="px-5 py-4">
                    Wilayah
                  </th>

                  <th className="px-5 py-4">
                    WhatsApp
                  </th>

                  <th className="px-5 py-4">
                    Terdaftar
                  </th>

                  <th className="px-5 py-4 text-center">
                    Akses
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {wargaHalamanIni.map(
                  (
                    warga,
                    index
                  ) => (
                    <tr
                      key={
                        warga.id
                      }
                      className="align-top transition hover:bg-slate-50/70"
                    >
                      {/* NOMOR */}

                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-slate-100 px-2 text-xs font-black tabular-nums text-slate-500">
                          {indexAwal +
                            index +
                            1}
                        </span>
                      </td>

                      {/* WARGA */}

                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-800">
                          {
                            warga.nama_lengkap
                          }
                        </p>

                        <p className="mt-1 max-w-[240px] text-xs leading-relaxed text-slate-400">
                          {warga.alamat ??
                            'Alamat belum diisi'}
                        </p>
                      </td>

                      {/* IDENTITAS */}

                      <td className="px-5 py-4">
                        <div className="space-y-2">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              NIK
                            </p>

                            <p className="mt-0.5 font-mono text-xs text-slate-600">
                              {maskNomor(
                                warga.nik_empat_terakhir
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Nomor KK
                            </p>

                            <p className="mt-0.5 font-mono text-xs text-slate-600">
                              {maskNomor(
                                warga.no_kk_empat_terakhir
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* DEMOGRAFI */}

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-700">
                          {formatJenisKelamin(
                            warga.jenis_kelamin
                          )}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Lahir:{' '}
                          {formatTanggal(
                            warga.tanggal_lahir
                          )}
                        </p>

                        <span
                          className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${getStatusPendudukClass(
                            warga.status_penduduk
                          )}`}
                        >
                          {formatStatusPenduduk(
                            warga.status_penduduk
                          )}
                        </span>
                      </td>

                      {/* WILAYAH */}

                      <td className="px-5 py-4 text-sm text-slate-600">
                        <p className="font-semibold">
                          {warga.dusun ??
                            '-'}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          RT{' '}
                          {formatKodeWilayah(
                            warga.rt
                          )}{' '}
                          / RW{' '}
                          {formatKodeWilayah(
                            warga.rw
                          )}
                        </p>
                      </td>

                      {/* WHATSAPP */}

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {warga.nomor_whatsapp ??
                          '-'}
                      </td>

                      {/* TERDAFTAR */}

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatTanggal(
                          warga.created_at
                        )}
                      </td>

                      {/* AKSES */}

                      <td className="px-5 py-4">
                        <form
                          action={
                            toggleStatusWargaAction
                          }
                          className="flex justify-center"
                        >
                          <input
                            type="hidden"
                            name="id"
                            value={
                              warga.id
                            }
                          />

                          <input
                            type="hidden"
                            name="aktif"
                            value={String(
                              warga.aktif
                            )}
                          />

                          <button
                            type="submit"
                            title={
                              warga.aktif
                                ? 'Nonaktifkan akses layanan'
                                : 'Aktifkan akses layanan'
                            }
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                              warga.aktif
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {warga.aktif ? (
                              <ToggleRight
                                size={
                                  18
                                }
                              />
                            ) : (
                              <ToggleLeft
                                size={
                                  18
                                }
                              />
                            )}

                            {warga.aktif
                              ? 'Aktif'
                              : 'Nonaktif'}
                          </button>
                        </form>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* =================================================
              MOBILE
          ================================================= */}

          <div className="grid gap-4 p-4 lg:hidden">
            {wargaHalamanIni.map(
              (
                warga,
                index
              ) => (
                <article
                  key={
                    warga.id
                  }
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 px-2 text-xs font-black text-emerald-700">
                        {indexAwal +
                          index +
                          1}
                      </span>

                      <div className="min-w-0">
                        <h3 className="truncate font-black text-slate-800">
                          {
                            warga.nama_lengkap
                          }
                        </h3>

                        <p className="mt-1 font-mono text-xs text-slate-500">
                          NIK:{' '}
                          {maskNomor(
                            warga.nik_empat_terakhir
                          )}
                        </p>

                        <p className="mt-1 font-mono text-xs text-slate-500">
                          KK:{' '}
                          {maskNomor(
                            warga.no_kk_empat_terakhir
                          )}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        warga.aktif
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {warga.aktif
                        ? 'Aktif'
                        : 'Nonaktif'}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 rounded-xl border border-slate-100 bg-white p-3 text-xs text-slate-500">
                    <div>
                      <p className="font-bold text-slate-700">
                        Data Demografi
                      </p>

                      <p className="mt-1">
                        Jenis kelamin:{' '}
                        {formatJenisKelamin(
                          warga.jenis_kelamin
                        )}
                      </p>

                      <p className="mt-1">
                        Tanggal lahir:{' '}
                        {formatTanggal(
                          warga.tanggal_lahir
                        )}
                      </p>

                      <p className="mt-1">
                        Status:{' '}
                        {formatStatusPenduduk(
                          warga.status_penduduk
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-700">
                        Wilayah
                      </p>

                      <p className="mt-1">
                        Dusun:{' '}
                        {warga.dusun ??
                          '-'}
                      </p>

                      <p className="mt-1">
                        RT{' '}
                        {formatKodeWilayah(
                          warga.rt
                        )}{' '}
                        / RW{' '}
                        {formatKodeWilayah(
                          warga.rw
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-700">
                        Kontak
                      </p>

                      <p className="mt-1">
                        WhatsApp:{' '}
                        {warga.nomor_whatsapp ??
                          '-'}
                      </p>

                      <p className="mt-1">
                        Terdaftar:{' '}
                        {formatTanggal(
                          warga.created_at
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-700">
                        Alamat
                      </p>

                      <p className="mt-1 leading-relaxed">
                        {warga.alamat ??
                          'Alamat belum diisi'}
                      </p>
                    </div>
                  </div>

                  <form
                    action={
                      toggleStatusWargaAction
                    }
                    className="mt-4"
                  >
                    <input
                      type="hidden"
                      name="id"
                      value={
                        warga.id
                      }
                    />

                    <input
                      type="hidden"
                      name="aktif"
                      value={String(
                        warga.aktif
                      )}
                    />

                    <button
                      type="submit"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700"
                    >
                      {warga.aktif
                        ? 'Nonaktifkan Akses Warga'
                        : 'Aktifkan Akses Warga'}
                    </button>
                  </form>
                </article>
              )
            )}
          </div>

          {/* =================================================
              PAGINATION
          ================================================= */}

          <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-5 sm:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-600">
                  Halaman{' '}
                  <span className="font-black text-emerald-700">
                    {
                      halamanAktif
                    }
                  </span>{' '}
                  dari{' '}
                  <span className="font-black text-slate-700">
                    {
                      totalHalaman
                    }
                  </span>
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Maksimal{' '}
                  {
                    DATA_PER_PAGE
                  }{' '}
                  data warga setiap
                  halaman.
                </p>
              </div>

              <nav
                aria-label="Navigasi halaman data warga"
                className="flex flex-wrap items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() =>
                    pindahHalaman(
                      halamanAktif -
                        1
                    )
                  }
                  disabled={
                    halamanAktif ===
                    1
                  }
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft
                    size={16}
                  />

                  <span className="hidden sm:inline">
                    Sebelumnya
                  </span>
                </button>

                {daftarHalaman.map(
                  (
                    item,
                    index
                  ) =>
                    item ===
                    'ellipsis' ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="flex h-10 min-w-8 items-center justify-center px-1 text-sm font-black text-slate-400"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={
                          item
                        }
                        type="button"
                        onClick={() =>
                          pindahHalaman(
                            item
                          )
                        }
                        aria-current={
                          halamanAktif ===
                          item
                            ? 'page'
                            : undefined
                        }
                        className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-xs font-black transition ${
                          halamanAktif ===
                          item
                            ? 'bg-emerald-700 text-white shadow-sm'
                            : 'border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
                        }`}
                      >
                        {
                          item
                        }
                      </button>
                    )
                )}

                <button
                  type="button"
                  onClick={() =>
                    pindahHalaman(
                      halamanAktif +
                        1
                    )
                  }
                  disabled={
                    halamanAktif ===
                    totalHalaman
                  }
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="hidden sm:inline">
                    Selanjutnya
                  </span>

                  <ChevronRight
                    size={16}
                  />
                </button>
              </nav>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function EmptyState({
  title,
  description,
  showReset = false,
  onReset,
}: {
  title: string;
  description: string;
  showReset?: boolean;
  onReset?: () => void;
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
        <Search size={25} />
      </div>

      <h3 className="mt-4 text-lg font-black text-slate-800">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
        {description}
      </p>

      {showReset &&
      onReset ? (
        <button
          type="button"
          onClick={
            onReset
          }
          className="mt-5 inline-flex min-h-10 items-center justify-center rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-800"
        >
          Tampilkan Semua Warga
        </button>
      ) : null}
    </div>
  );
}