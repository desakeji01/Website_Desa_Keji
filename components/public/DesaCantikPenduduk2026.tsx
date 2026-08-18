'use client';

import { useMemo, useState } from 'react';

import {
  CalendarRange,
  Download,
  FileSpreadsheet,
  LoaderCircle,
  MapPinned,
  Table2,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { toPng } from 'html-to-image';

import type {
  NilaiPendudukUmur,
  PendudukKelompokUmur2026,
} from '@/lib/desa-cantik-penduduk-2026';

interface DesaCantikPenduduk2026Props {
  rows: PendudukKelompokUmur2026[];
  tahun: number;
  sumber: string;
}

interface RingkasanCardProps {
  icon: LucideIcon;
  label: string;
  nilai: string;
  keterangan: string;
  aksen?: 'emerald' | 'amber';
}

type WilayahKey = 'rw01' | 'rw02' | 'rw03' | 'total';

const DAFTAR_WILAYAH: Array<{
  key: WilayahKey;
  label: string;
}> = [
  { key: 'rw01', label: 'RW 01' },
  { key: 'rw02', label: 'RW 02' },
  { key: 'rw03', label: 'RW 03' },
  { key: 'total', label: 'Jumlah' },
];

function formatAngka(value: number) {
  return new Intl.NumberFormat('id-ID').format(value);
}

function formatPersen(value: number, total: number) {
  if (total === 0) {
    return '0%';
  }

  return `${new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 1,
  }).format((value / total) * 100)}%`;
}

function RingkasanCard({
  icon: Icon,
  label,
  nilai,
  keterangan,
  aksen = 'emerald',
}: RingkasanCardProps) {
  const kelasIkon =
    aksen === 'amber'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-emerald-100 text-emerald-700';

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
            {nilai}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${kelasIkon}`}
        >
          <Icon size={22} />
        </div>
      </div>

      <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
        {keterangan}
      </p>
    </article>
  );
}

function PiramidaPenduduk({
  rows,
  tahun,
}: {
  rows: PendudukKelompokUmur2026[];
  tahun: number;
}) {
  const urutanPiramida = [...rows].reverse();

  const nilaiMaksimum = Math.max(
    ...rows.flatMap((row) => [
      row.total.lakiLaki,
      row.total.perempuan,
    ]),
    1,
  );

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
          Komposisi Umur
        </p>

        <h3 className="mt-1 text-xl font-black text-slate-900">
          Piramida Penduduk Desa Keji Menurut Kelompok Umur Tahun{' '}
          {tahun}
        </h3>

        <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
          Perbandingan penduduk laki-laki dan perempuan pada setiap
          kelompok umur.
        </p>
      </div>

      <div className="mt-6 min-w-[560px]">
        <div className="mb-3 grid grid-cols-[minmax(0,1fr)_84px_minmax(0,1fr)] gap-2 text-center text-xs font-extrabold uppercase tracking-wider">
          <span className="text-emerald-700">Laki-laki</span>
          <span className="text-slate-400">Umur</span>
          <span className="text-amber-700">Perempuan</span>
        </div>

        <div className="space-y-2">
          {urutanPiramida.map((row) => {
            const lebarLakiLaki = Math.max(
              (row.total.lakiLaki / nilaiMaksimum) * 100,
              7,
            );

            const lebarPerempuan = Math.max(
              (row.total.perempuan / nilaiMaksimum) * 100,
              7,
            );

            return (
              <div
                key={row.id}
                className="grid grid-cols-[minmax(0,1fr)_84px_minmax(0,1fr)] items-center gap-2"
              >
                <div className="flex justify-end">
                  <div
                    className="flex h-7 items-center justify-start rounded-l-lg bg-emerald-700 px-2 text-[11px] font-black text-white"
                    style={{ width: `${lebarLakiLaki}%` }}
                    title={`${row.kelompokUmur}: ${formatAngka(
                      row.total.lakiLaki,
                    )} laki-laki`}
                  >
                    {formatAngka(row.total.lakiLaki)}
                  </div>
                </div>

                <span className="text-center text-[11px] font-extrabold text-slate-600">
                  {row.kelompokUmur.replace(' Tahun', '')}
                </span>

                <div>
                  <div
                    className="flex h-7 items-center justify-end rounded-r-lg bg-amber-500 px-2 text-[11px] font-black text-white"
                    style={{ width: `${lebarPerempuan}%` }}
                    title={`${row.kelompokUmur}: ${formatAngka(
                      row.total.perempuan,
                    )} perempuan`}
                  >
                    {formatAngka(row.total.perempuan)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}

function PersebaranWilayah({
  rows,
}: {
  rows: PendudukKelompokUmur2026[];
}) {
  const wilayah = [
    {
      label: 'RW 01',
      value: rows.reduce((total, row) => total + row.rw01.jumlah, 0),
    },
    {
      label: 'RW 02',
      value: rows.reduce((total, row) => total + row.rw02.jumlah, 0),
    },
    {
      label: 'RW 03',
      value: rows.reduce((total, row) => total + row.rw03.jumlah, 0),
    },
  ];

  const maksimum = Math.max(
    ...wilayah.map((item) => item.value),
    1,
  );

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
        Persebaran Wilayah
      </p>

      <h3 className="mt-1 text-xl font-black text-slate-900">
        Penduduk Menurut RW
      </h3>

      <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
        Akumulasi seluruh kelompok umur pada tiga RW.
      </p>

      <div className="mt-7 space-y-6">
        {wilayah.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-end justify-between gap-4">
              <span className="text-sm font-extrabold text-slate-700">
                {item.label}
              </span>

              <span className="text-sm font-black tabular-nums text-slate-900">
                {formatAngka(item.value)} jiwa
              </span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-500"
                style={{
                  width: `${(item.value / maksimum) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-emerald-50 p-4">
        <div className="flex items-start gap-3">
          <MapPinned
            className="mt-0.5 shrink-0 text-emerald-700"
            size={20}
          />

          <p className="text-sm font-bold leading-6 text-emerald-900">
            RW 01 memiliki jumlah penduduk terbanyak, yaitu{' '}
            {formatAngka(wilayah[0].value)} jiwa.
          </p>
        </div>
      </div>
    </article>
  );
}

function nilaiWilayah(
  row: PendudukKelompokUmur2026,
  key: WilayahKey,
): NilaiPendudukUmur {
  return row[key];
}

function TabelPasanganKelompokUmur({
  kelompok,
  index,
}: {
  kelompok: PendudukKelompokUmur2026[];
  index: number;
}) {
  const judul = index === 0 ? 'Tabel 1.1' : 'Lanjutan Tabel 1.1';

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5 md:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
              {judul}
            </p>

            <h3 className="mt-1 text-lg font-black leading-7 text-slate-900">
              Jumlah Penduduk Menurut Kelompok Umur di Desa Keji
            </h3>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-800">
            <Table2 size={14} />
            {kelompok.map((item) => item.kelompokUmur).join(' dan ')}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-emerald-800 text-white">
              <th
                rowSpan={2}
                className="sticky left-0 z-20 min-w-24 bg-emerald-800 px-4 py-4 font-extrabold"
              >
                RW
              </th>

              {kelompok.map((item) => (
                <th
                  key={item.id}
                  colSpan={3}
                  className="border-l border-white/15 px-4 py-3 text-center font-extrabold"
                >
                  {item.kelompokUmur}
                </th>
              ))}
            </tr>

            <tr className="bg-emerald-700 text-white">
              {kelompok.flatMap((item) => [
                <th
                  key={`${item.id}-laki-laki`}
                  className="border-l border-white/15 px-4 py-3 text-center text-xs font-extrabold"
                >
                  Laki-laki
                </th>,
                <th
                  key={`${item.id}-perempuan`}
                  className="px-4 py-3 text-center text-xs font-extrabold"
                >
                  Perempuan
                </th>,
                <th
                  key={`${item.id}-jumlah`}
                  className="px-4 py-3 text-center text-xs font-extrabold"
                >
                  Jumlah
                </th>,
              ])}
            </tr>
          </thead>

          <tbody>
            {DAFTAR_WILAYAH.map((wilayah, rowIndex) => {
              const adalahJumlah = wilayah.key === 'total';

              return (
                <tr
                  key={wilayah.key}
                  className={
                    adalahJumlah
                      ? 'bg-emerald-800 text-white'
                      : rowIndex % 2 === 0
                        ? 'bg-white text-slate-700'
                        : 'bg-emerald-50/70 text-slate-700'
                  }
                >
                  <th
                    className={`sticky left-0 z-10 whitespace-nowrap px-4 py-4 font-black ${
                      adalahJumlah
                        ? 'bg-emerald-800'
                        : 'bg-inherit'
                    }`}
                  >
                    {wilayah.label}
                  </th>

                  {kelompok.flatMap((item) => {
                    const nilai = nilaiWilayah(item, wilayah.key);

                    return [
                      <td
                        key={`${item.id}-${wilayah.key}-laki-laki`}
                        className="border-l border-slate-100/20 px-4 py-4 text-center font-bold tabular-nums"
                      >
                        {formatAngka(nilai.lakiLaki)}
                      </td>,
                      <td
                        key={`${item.id}-${wilayah.key}-perempuan`}
                        className="px-4 py-4 text-center font-bold tabular-nums"
                      >
                        {formatAngka(nilai.perempuan)}
                      </td>,
                      <td
                        key={`${item.id}-${wilayah.key}-jumlah`}
                        className="px-4 py-4 text-center font-black tabular-nums"
                      >
                        {formatAngka(nilai.jumlah)}
                      </td>,
                    ];
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DesaCantikPenduduk2026({
  rows,
  tahun,
  sumber,
}: DesaCantikPenduduk2026Props) {
  const [sedangMengunduh, setSedangMengunduh] = useState<
    string | null
  >(null);

  const ringkasan = useMemo(
    () =>
      rows.reduce(
        (total, row) => ({
          lakiLaki: total.lakiLaki + row.total.lakiLaki,
          perempuan: total.perempuan + row.total.perempuan,
          jumlah: total.jumlah + row.total.jumlah,
        }),
        { lakiLaki: 0, perempuan: 0, jumlah: 0 },
      ),
    [rows],
  );

  const kelompokTerbesar = useMemo(
    () =>
      rows.reduce<PendudukKelompokUmur2026 | null>(
        (terbesar, row) =>
          !terbesar || row.total.jumlah > terbesar.total.jumlah
            ? row
            : terbesar,
        null,
      ),
    [rows],
  );

  const pasanganKelompok = useMemo(() => {
    const hasil: PendudukKelompokUmur2026[][] = [];

    for (let index = 0; index < rows.length; index += 2) {
      hasil.push(rows.slice(index, index + 2));
    }

    return hasil;
  }, [rows]);

  const unduhPng = async (
    targetId: string,
    namaFile: string,
    id: string,
  ) => {
    const node = document.getElementById(targetId);

    if (!node || sedangMengunduh) {
      return;
    }

    setSedangMengunduh(id);

    try {
      const dataUrl = await toPng(node, {
        backgroundColor: '#f8fafc',
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = namaFile;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Gagal mengunduh gambar:', error);

      window.alert(
        'Gambar belum dapat diunduh. Silakan coba kembali.',
      );
    } finally {
      setSedangMengunduh(null);
    }
  };

  const tombolUnduh = (
    targetId: string,
    namaFile: string,
    id: string,
    label: string,
  ) => (
    <button
      type="button"
      onClick={() => unduhPng(targetId, namaFile, id)}
      disabled={Boolean(sedangMengunduh)}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-extrabold text-emerald-800 shadow-sm transition hover:border-emerald-700 hover:bg-emerald-700 hover:text-white disabled:cursor-wait disabled:opacity-60"
    >
      {sedangMengunduh === id ? (
        <LoaderCircle className="animate-spin" size={16} />
      ) : (
        <Download size={16} />
      )}

      {label}
    </button>
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <RingkasanCard
          icon={Users}
          label="Total Penduduk"
          nilai={formatAngka(ringkasan.jumlah)}
          keterangan="Jumlah penduduk pada seluruh kelompok umur dan wilayah."
        />

        <RingkasanCard
          icon={UserRound}
          label="Laki-laki"
          nilai={formatAngka(ringkasan.lakiLaki)}
          keterangan={`${formatPersen(
            ringkasan.lakiLaki,
            ringkasan.jumlah,
          )} dari total penduduk Desa Keji.`}
        />

        <RingkasanCard
          icon={UserRound}
          label="Perempuan"
          nilai={formatAngka(ringkasan.perempuan)}
          keterangan={`${formatPersen(
            ringkasan.perempuan,
            ringkasan.jumlah,
          )} dari total penduduk Desa Keji.`}
          aksen="amber"
        />

        <RingkasanCard
          icon={CalendarRange}
          label="Kelompok Terbesar"
          nilai={kelompokTerbesar?.kelompokUmur ?? '-'}
          keterangan={`${formatAngka(
            kelompokTerbesar?.total.jumlah ?? 0,
          )} jiwa tercatat pada kelompok umur ini.`}
        />
      </section>

      <section className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
              Data Penduduk {tahun}
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              Penduduk Desa Keji Menurut Kelompok Umur
            </h2>

            <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-600">
              Data mencakup {rows.length} kelompok umur, tiga RW, dan
              perbandingan penduduk menurut jenis kelamin.
            </p>
          </div>

          <a
            href="#tabel-penduduk-2026"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-extrabold text-emerald-800 transition hover:bg-emerald-700 hover:text-white"
          >
            <Table2 size={16} />
            Lihat Tabel Lengkap
          </a>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
              Ringkasan Visual
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-900">
              Struktur Penduduk Desa Keji
            </h2>
          </div>

          {tombolUnduh(
            'grafik-penduduk-2026',
            `grafik-penduduk-desa-keji-${tahun}.png`,
            'grafik-penduduk',
            'Unduh Grafik PNG',
          )}
        </div>

        <div
          id="grafik-penduduk-2026"
          className="grid gap-5 bg-slate-50 p-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]"
        >
          <div className="overflow-x-auto">
            <PiramidaPenduduk rows={rows} tahun={tahun} />
          </div>

          <PersebaranWilayah rows={rows} />
        </div>
      </section>

      <section id="tabel-penduduk-2026" className="scroll-mt-28">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Table2 size={24} />
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
              Tabel 1.1
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-900">
              Penduduk Menurut Kelompok Umur
            </h2>

            <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
              Tabel dibagi menjadi delapan bagian agar tetap terbaca pada
              layar kecil dan saat diunduh.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {pasanganKelompok.map((kelompok, index) => {
            const targetId = `tabel-penduduk-${kelompok
              .map((item) => item.id)
              .join('-')}`;

            const downloadId = `tabel-${index + 1}`;

            return (
              <article key={targetId}>
                <div id={targetId} className="bg-slate-50 p-1">
                  <TabelPasanganKelompokUmur
                    kelompok={kelompok}
                    index={index}
                  />

                  <p className="px-5 pb-3 pt-4 text-xs font-medium leading-5 text-slate-500 md:px-6">
                    Sumber: {sumber}
                  </p>
                </div>

                <div className="mt-3 flex justify-end">
                  {tombolUnduh(
                    targetId,
                    `tabel-penduduk-${kelompok
                      .map((item) => item.id)
                      .join('-')}-desa-keji-${tahun}.png`,
                    downloadId,
                    'Unduh Tabel PNG',
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center md:p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <FileSpreadsheet size={24} />
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
            Sumber Data
          </p>

          <p className="mt-1 text-sm font-bold leading-6 text-slate-700">
            {sumber}
          </p>
        </div>
      </section>
    </div>
  );
}
