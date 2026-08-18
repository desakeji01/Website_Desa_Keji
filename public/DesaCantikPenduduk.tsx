'use client';

import {
  useRef,
  useState,
  type RefObject,
} from 'react';

import {
  Download,
  ImageDown,
  LoaderCircle,
  Mars,
  Users,
  Venus,
} from 'lucide-react';

import { toPng } from 'html-to-image';

import { hitungRingkasanPenduduk } from '@/lib/desa-cantik';

import type { PendudukKelompokUmur } from '@/types/desa-cantik';

interface DesaCantikPendudukProps {
  rows: PendudukKelompokUmur[];
  tahun: number;
  sumber: string;
}

function formatAngka(value: number) {
  return new Intl.NumberFormat('id-ID').format(value);
}

export default function DesaCantikPenduduk({
  rows,
  tahun,
  sumber,
}: DesaCantikPendudukProps) {
  const ringkasan = hitungRingkasanPenduduk(rows);

  const kelompokTerbesar = rows.reduce(
    (terbesar, row) =>
      row.total.jumlah > terbesar.total.jumlah ? row : terbesar,
    rows[0],
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <RingkasanCard
          label="Total Penduduk"
          value={ringkasan.jumlah}
          icon={Users}
          color="emerald"
        />

        <RingkasanCard
          label="Laki-Laki"
          value={ringkasan.lakiLaki}
          icon={Mars}
          color="blue"
        />

        <RingkasanCard
          label="Perempuan"
          value={ringkasan.perempuan}
          icon={Venus}
          color="rose"
        />

        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-700">
            Kelompok Terbanyak
          </p>

          <p className="mt-3 text-2xl font-black text-amber-950">
            {kelompokTerbesar.kelompokUmur}
          </p>

          <p className="mt-1 text-sm font-bold text-amber-700">
            {formatAngka(kelompokTerbesar.total.jumlah)} jiwa
          </p>
        </div>
      </section>

      <PiramidaPenduduk
        rows={rows}
        tahun={tahun}
        sumber={sumber}
      />

      <TabelPenduduk
        rows={rows}
        tahun={tahun}
        sumber={sumber}
      />
    </div>
  );
}

function RingkasanCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: typeof Users;
  color: 'emerald' | 'blue' | 'rose';
}) {
  const styles = {
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    rose: 'border-rose-100 bg-rose-50 text-rose-700',
  };

  return (
    <div className={`rounded-2xl border p-5 ${styles[color]}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em]">
          {label}
        </p>

        <Icon size={20} />
      </div>

      <p className="mt-4 text-3xl font-black">
        {formatAngka(value)}
      </p>

      <p className="mt-1 text-xs font-bold opacity-75">
        Jiwa
      </p>
    </div>
  );
}

function PiramidaPenduduk({
  rows,
  tahun,
  sumber,
}: DesaCantikPendudukProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const maxValue = Math.max(
    ...rows.flatMap((row) => [
      row.total.lakiLaki,
      row.total.perempuan,
    ]),
  );

  const rowsDesc = [...rows].reverse();

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
            Visualisasi Data
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-900">
            Piramida Penduduk Desa Keji
          </h2>
        </div>

        <DownloadPanelButton
          panelRef={panelRef}
          fileName={`piramida-penduduk-desa-keji-${tahun}.png`}
          label="Unduh Grafik"
        />
      </div>

      <div className="overflow-x-auto">
        <div
          ref={panelRef}
          className="min-w-[780px] bg-white p-6 md:p-8"
        >
          <div className="mb-7 text-center">
            <h3 className="text-2xl font-black text-slate-900">
              Piramida Penduduk Desa Keji
            </h3>

            <p className="mt-1 text-sm font-bold text-slate-500">
              Menurut Kelompok Umur Tahun {tahun}
            </p>
          </div>

          <div className="mb-4 grid grid-cols-[48px_1fr_112px_1fr_48px] items-center gap-2 text-xs font-extrabold uppercase tracking-wider">
            <span className="text-right text-blue-700">
              L
            </span>

            <span className="text-right text-blue-700">
              Laki-Laki
            </span>

            <span />

            <span className="text-rose-700">
              Perempuan
            </span>

            <span className="text-rose-700">
              P
            </span>
          </div>

          <div className="space-y-1.5">
            {rowsDesc.map((row) => (
              <div
                key={row.kelompokUmur}
                className="grid grid-cols-[48px_1fr_112px_1fr_48px] items-center gap-2"
              >
                <span className="text-right text-xs font-extrabold text-blue-800">
                  {row.total.lakiLaki}
                </span>

                <div className="flex h-6 justify-end overflow-hidden rounded-l bg-blue-50">
                  <div
                    className="h-full rounded-l bg-gradient-to-l from-blue-700 to-blue-500"
                    style={{
                      width: `${(row.total.lakiLaki / maxValue) * 100}%`,
                    }}
                  />
                </div>

                <span className="text-center text-xs font-extrabold text-slate-600">
                  {row.kelompokUmur}
                </span>

                <div className="flex h-6 overflow-hidden rounded-r bg-rose-50">
                  <div
                    className="h-full rounded-r bg-gradient-to-r from-rose-600 to-rose-400"
                    style={{
                      width: `${(row.total.perempuan / maxValue) * 100}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-extrabold text-rose-700">
                  {row.total.perempuan}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-7 border-t border-slate-200 pt-4 text-xs font-semibold text-slate-500">
            Sumber: {sumber}
          </p>
        </div>
      </div>
    </section>
  );
}

function TabelPenduduk({
  rows,
  tahun,
  sumber,
}: DesaCantikPendudukProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
            Tabel Data
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-900">
            Penduduk Menurut Kelompok Umur
          </h2>
        </div>

        <DownloadPanelButton
          panelRef={panelRef}
          fileName={`tabel-penduduk-menurut-umur-desa-keji-${tahun}.png`}
          label="Unduh Tabel"
        />
      </div>

      <div className="overflow-x-auto">
        <div
          ref={panelRef}
          className="min-w-[1280px] bg-white p-6"
        >
          <div className="mb-6 text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-700">
              Desa Keji dalam Angka
            </p>

            <h3 className="mt-2 text-2xl font-black text-slate-900">
              Jumlah Penduduk Menurut Kelompok Umur di Desa Keji
            </h3>

            <p className="mt-1 text-sm font-bold text-slate-500">
              Tahun {tahun}
            </p>
          </div>

          <table className="w-full border-collapse text-center text-sm">
            <thead>
              <tr className="bg-emerald-800 text-white">
                <th
                  rowSpan={2}
                  className="border border-emerald-700 px-3 py-4 text-left"
                >
                  Kelompok Umur
                </th>

                {['RW 01', 'RW 02', 'RW 03', 'Jumlah Desa'].map(
                  (label) => (
                    <th
                      key={label}
                      colSpan={3}
                      className="border border-emerald-700 px-3 py-3"
                    >
                      {label}
                    </th>
                  ),
                )}
              </tr>

              <tr className="bg-emerald-700 text-xs text-emerald-50">
                {Array.from({ length: 4 }).flatMap((_, groupIndex) =>
                  ['Laki-Laki', 'Perempuan', 'Jumlah'].map((label) => (
                    <th
                      key={`${groupIndex}-${label}`}
                      className="border border-emerald-600 px-2 py-3"
                    >
                      {label}
                    </th>
                  )),
                )}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.kelompokUmur}
                  className={
                    index % 2 === 0
                      ? 'bg-white'
                      : 'bg-emerald-50/70'
                  }
                >
                  <th className="border border-slate-200 px-3 py-3 text-left font-extrabold text-slate-800">
                    {row.kelompokUmur}
                  </th>

                  {[
                    row.rw01,
                    row.rw02,
                    row.rw03,
                    row.total,
                  ].flatMap((rincian, groupIndex) =>
                    [
                      rincian.lakiLaki,
                      rincian.perempuan,
                      rincian.jumlah,
                    ].map((value, valueIndex) => (
                      <td
                        key={`${groupIndex}-${valueIndex}`}
                        className={`border border-slate-200 px-2 py-3 ${
                          groupIndex === 3
                            ? 'font-extrabold text-emerald-800'
                            : 'font-semibold text-slate-600'
                        }`}
                      >
                        {value}
                      </td>
                    )),
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-5 border-t border-slate-200 pt-4 text-xs font-semibold text-slate-500">
            Sumber: {sumber}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs font-semibold text-slate-500">
        Geser tabel ke samping pada layar kecil. Tombol unduh akan menyimpan
        seluruh tabel sebagai gambar PNG.
      </div>
    </section>
  );
}

function DownloadPanelButton({
  panelRef,
  fileName,
  label,
}: {
  panelRef: RefObject<HTMLDivElement | null>;
  fileName: string;
  label: string;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleDownload() {
    const node = panelRef.current;

    if (!node || isDownloading) {
      return;
    }

    setIsDownloading(true);
    setErrorMessage('');

    try {
      const dataUrl = await toPng(node, {
        backgroundColor: '#ffffff',
        cacheBust: true,
        pixelRatio: 2,
        width: node.scrollWidth,
        height: node.scrollHeight,
      });

      const link = document.createElement('a');

      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error(
        'Gagal mengunduh data Desa Cantik:',
        error,
      );

      setErrorMessage(
        'Gagal mengunduh gambar. Silakan coba lagi.',
      );
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <button
        type="button"
        onClick={handleDownload}
        disabled={isDownloading}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-70"
      >
        {isDownloading ? (
          <LoaderCircle
            size={17}
            className="animate-spin"
          />
        ) : label === 'Unduh Tabel' ? (
          <ImageDown size={17} />
        ) : (
          <Download size={17} />
        )}

        {isDownloading ? 'Menyiapkan...' : label}
      </button>

      {errorMessage && (
        <p
          role="alert"
          className="text-xs font-semibold text-red-600"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}