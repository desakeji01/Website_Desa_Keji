'use client';

import { useState } from 'react';

import {
  Beef,
  Bike,
  Download,
  FileSpreadsheet,
  Landmark,
  LoaderCircle,
  PiggyBank,
  Table2,
  WalletCards,
  type LucideIcon,
} from 'lucide-react';
import { toPng } from 'html-to-image';

import type {
  KelompokTabelPerekonomian,
  KolomPerekonomian,
  TabelPerekonomian,
} from '@/lib/desa-cantik-perekonomian';

interface DesaCantikPerekonomianProps {
  data: TabelPerekonomian[];
  tahun: number;
  sumber: string;
}

interface RingkasanCardProps {
  icon: LucideIcon;
  label: string;
  nilai: string;
  keterangan: string;
}

interface BarData {
  label: string;
  value: number;
  color: string;
}

const KELOMPOK_TABEL: Array<{
  id: string;
  nama: KelompokTabelPerekonomian;
  icon: LucideIcon;
  deskripsi: string;
}> = [
  {
    id: 'aset-keluarga',
    nama: 'Aset Keluarga',
    icon: WalletCards,
    deskripsi:
      'Kepemilikan peralatan rumah tangga, barang elektronik, simpanan, dan kendaraan.',
  },
  {
    id: 'peternakan',
    nama: 'Peternakan',
    icon: Beef,
    deskripsi:
      'Jumlah ternak menurut jenis yang tercatat pada masing-masing wilayah RW.',
  },
  {
    id: 'pendapatan-keluarga',
    nama: 'Pendapatan Keluarga',
    icon: PiggyBank,
    deskripsi:
      'Sebaran keluarga menurut kelompok rata-rata pendapatan setiap bulan.',
  },
];

const WARNA_BAR = [
  'bg-emerald-700',
  'bg-emerald-500',
  'bg-lime-500',
  'bg-teal-500',
  'bg-green-600',
  'bg-lime-600',
  'bg-teal-700',
  'bg-emerald-400',
];

const GAYA_RW = [
  {
    titik: 'bg-emerald-700',
    garis: '#047857',
  },
  {
    titik: 'bg-amber-500',
    garis: '#f59e0b',
  },
  {
    titik: 'bg-slate-400',
    garis: '#64748b',
  },
];

const OFFSET_LABEL_GARIS = [
  { dx: 0, dy: -13 },
  { dx: -12, dy: 23 },
  { dx: 12, dy: 5 },
];

function formatAngka(value: number) {
  return new Intl.NumberFormat('id-ID').format(value);
}

function RingkasanCard({
  icon: Icon,
  label,
  nilai,
  keterangan,
}: RingkasanCardProps) {
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

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Icon size={22} />
        </div>
      </div>

      <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
        {keterangan}
      </p>
    </article>
  );
}

function GrafikBatang({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: BarData[];
}) {
  const maximum = Math.max(...rows.map((row) => row.value), 1);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h3 className="text-lg font-black text-slate-900">{title}</h3>

      <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
        {subtitle}
      </p>

      <div className="mt-6 space-y-5">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-2 flex items-end justify-between gap-4">
              <span className="text-sm font-bold leading-5 text-slate-700">
                {row.label}
              </span>

              <span className="shrink-0 text-sm font-black text-slate-900">
                {formatAngka(row.value)}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${row.color}`}
                style={{
                  width: `${Math.max(
                    (row.value / maximum) * 100,
                    row.value > 0 ? 2 : 0,
                  )}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function pecahLabelPendapatan(label: string) {
  if (!label.includes('–')) {
    return [label];
  }

  const [awal, akhir] = label.split('–');

  return [`${awal}–`, akhir];
}

function GrafikGarisPendapatan({
  tabel,
  tahun,
}: {
  tabel?: TabelPerekonomian;
  tahun: number;
}) {
  if (!tabel) {
    return null;
  }

  const lebar = 820;
  const tinggi = 380;
  const margin = {
    atas: 30,
    kanan: 70,
    bawah: 88,
    kiri: 74,
  };
  const lebarPlot = lebar - margin.kiri - margin.kanan;
  const tinggiPlot = tinggi - margin.atas - margin.bawah;

  const nilaiTertinggi = Math.max(
    ...tabel.baris.flatMap((baris) =>
      tabel.kolom.map((kolom) => baris.nilai[kolom.key] ?? 0),
    ),
    1,
  );
  const batasAtas = Math.max(
    50,
    Math.ceil(nilaiTertinggi / 50) * 50,
  );
  const intervalSumbu = Array.from(
    { length: 6 },
    (_, index) => (batasAtas / 5) * index,
  );

  const posisiX = (index: number) =>
    margin.kiri +
    (index / Math.max(tabel.kolom.length - 1, 1)) * lebarPlot;

  const posisiY = (value: number) =>
    margin.atas + tinggiPlot - (value / batasAtas) * tinggiPlot;

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h3 className="text-lg font-black text-slate-900">
        Jumlah Keluarga Menurut Rata-Rata Pendapatan per Bulan Tahun{' '}
        {tahun}
      </h3>

      <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
        Perbandingan empat kelompok pendapatan pada RW 01, RW 02, dan RW
        03, mengikuti bentuk grafik pada publikasi sumber.
      </p>

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
        {tabel.baris.map((baris, index) => (
          <span
            key={baris.label}
            className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-600"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                GAYA_RW[index % GAYA_RW.length].titik
              }`}
            />
            {baris.label}
          </span>
        ))}
      </div>

      <div className="mt-3 overflow-x-auto pb-1">
        <svg
          role="img"
          aria-label={`Grafik garis jumlah keluarga menurut rata-rata pendapatan per bulan tahun ${tahun}`}
          viewBox={`0 0 ${lebar} ${tinggi}`}
          className="min-w-[720px] w-full"
        >
          {intervalSumbu.map((nilai) => {
            const y = posisiY(nilai);

            return (
              <g key={nilai}>
                <line
                  x1={margin.kiri}
                  x2={lebar - margin.kanan}
                  y1={y}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />

                <text
                  x={margin.kiri - 14}
                  y={y + 5}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="13"
                  fontWeight="700"
                >
                  {formatAngka(nilai)}
                </text>
              </g>
            );
          })}

          {tabel.kolom.map((kolom, index) => {
            const x = posisiX(index);
            const labelLines = pecahLabelPendapatan(kolom.label);

            return (
              <g key={kolom.key}>
                <line
                  x1={x}
                  x2={x}
                  y1={margin.atas}
                  y2={margin.atas + tinggiPlot}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />

                <text
                  x={x}
                  y={margin.atas + tinggiPlot + 31}
                  textAnchor="middle"
                  fill="#475569"
                  fontSize="12"
                  fontWeight="700"
                >
                  {labelLines.map((line, lineIndex) => (
                    <tspan
                      key={line}
                      x={x}
                      dy={lineIndex === 0 ? 0 : 17}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}

          {tabel.baris.map((baris, indexBaris) => {
            const gaya = GAYA_RW[indexBaris % GAYA_RW.length];
            const offset =
              OFFSET_LABEL_GARIS[
                indexBaris % OFFSET_LABEL_GARIS.length
              ];
            const titik = tabel.kolom.map((kolom, indexKolom) => ({
              x: posisiX(indexKolom),
              y: posisiY(baris.nilai[kolom.key] ?? 0),
              value: baris.nilai[kolom.key] ?? 0,
              key: kolom.key,
            }));

            const path = titik
              .map((point, index) =>
                `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`,
              )
              .join(' ');

            return (
              <g key={baris.label}>
                <path
                  d={path}
                  fill="none"
                  stroke={gaya.garis}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {titik.map((point) => (
                  <g key={`${baris.label}-${point.key}`}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="6"
                      fill={gaya.garis}
                      stroke="#ffffff"
                      strokeWidth="3"
                    />

                    <text
                      x={point.x + offset.dx}
                      y={point.y + offset.dy}
                      textAnchor="middle"
                      fill={gaya.garis}
                      stroke="#ffffff"
                      strokeWidth="4"
                      paintOrder="stroke"
                      fontSize="13"
                      fontWeight="900"
                    >
                      {formatAngka(point.value)}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    </article>
  );
}

function TabelBagian({
  tabel,
  kolom,
  judulBagian,
}: {
  tabel: TabelPerekonomian;
  kolom: KolomPerekonomian[];
  judulBagian?: string;
}) {
  return (
    <div>
      {judulBagian ? (
        <div className="border-b border-emerald-900/10 bg-emerald-50 px-5 py-3 md:px-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-emerald-800">
            {judulBagian}
          </p>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-left text-sm">
          <thead>
            <tr className="bg-emerald-800 text-white">
              <th className="sticky left-0 z-20 min-w-24 bg-emerald-800 px-4 py-4 font-extrabold">
                {tabel.labelBaris}
              </th>

              {kolom.map((item) => (
                <th
                  key={item.key}
                  className="min-w-36 px-4 py-4 text-center font-extrabold"
                >
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tabel.baris.map((baris, index) => (
              <tr
                key={baris.label}
                className={
                  index % 2 === 0 ? 'bg-white' : 'bg-emerald-50/70'
                }
              >
                <th className="sticky left-0 z-10 whitespace-nowrap border-t border-slate-100 bg-inherit px-4 py-4 font-extrabold text-slate-800">
                  {baris.label}
                </th>

                {kolom.map((item) => (
                  <td
                    key={item.key}
                    className="border-t border-slate-100 px-4 py-4 text-center font-bold tabular-nums text-slate-700"
                  >
                    {formatAngka(baris.nilai[item.key] ?? 0)}
                  </td>
                ))}
              </tr>
            ))}

            <tr className="bg-emerald-800 text-white">
              <th className="sticky left-0 z-10 bg-emerald-800 px-4 py-4 font-black">
                Jumlah
              </th>

              {kolom.map((item) => (
                <td
                  key={item.key}
                  className="px-4 py-4 text-center font-black tabular-nums"
                >
                  {formatAngka(tabel.jumlah[item.key] ?? 0)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabelData({ tabel }: { tabel: TabelPerekonomian }) {
  const bagian = tabel.bagianKolom?.map((item) => ({
    judul: item.judul,
    kolom: item.keys
      .map((key) => tabel.kolom.find((kolom) => kolom.key === key))
      .filter((kolom): kolom is KolomPerekonomian => Boolean(kolom)),
  }));

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5 md:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
              {tabel.nomor}
            </p>

            <h3 className="mt-1 text-lg font-black leading-7 text-slate-900">
              {tabel.judul}
            </h3>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-800">
            <Table2 size={14} />
            3 RW · {tabel.satuan}
          </span>
        </div>
      </div>

      {bagian ? (
        <div className="divide-y-8 divide-slate-100">
          {bagian.map((item) => (
            <TabelBagian
              key={item.judul}
              tabel={tabel}
              kolom={item.kolom}
              judulBagian={item.judul}
            />
          ))}
        </div>
      ) : (
        <TabelBagian tabel={tabel} kolom={tabel.kolom} />
      )}

      {tabel.catatan ? (
        <p className="border-t border-slate-100 px-5 py-3 text-xs font-medium leading-5 text-slate-500 md:px-6">
          Catatan: {tabel.catatan}
        </p>
      ) : null}
    </div>
  );
}

export default function DesaCantikPerekonomian({
  data,
  tahun,
  sumber,
}: DesaCantikPerekonomianProps) {
  const [sedangMengunduh, setSedangMengunduh] = useState<
    string | null
  >(null);

  const asetBergerak = data.find(
    (tabel) => tabel.id === 'aset-bergerak',
  );

  const jenisTernak = data.find(
    (tabel) => tabel.id === 'jenis-ternak',
  );

  const pendapatan = data.find(
    (tabel) => tabel.id === 'rata-rata-pendapatan',
  );

  const keluargaTerdata = Object.values(
    pendapatan?.jumlah ?? {},
  ).reduce((total, nilai) => total + nilai, 0);

  const sepedaMotor = asetBergerak?.jumlah.sepedaMotor ?? 0;

  const totalTernak = Object.values(
    jenisTernak?.jumlah ?? {},
  ).reduce((total, nilai) => total + nilai, 0);

  const pendapatanLebih4Juta =
    pendapatan?.jumlah.lebih4Juta ?? 0;

  const asetTerbanyak =
    asetBergerak?.kolom
      .map((kolom) => ({
        label: kolom.label,
        value: asetBergerak.jumlah[kolom.key] ?? 0,
      }))
      .filter((row) => row.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 8) ?? [];

  const ternakTercatat =
    jenisTernak?.kolom
      .map((kolom) => ({
        label: kolom.label,
        value: jenisTernak.jumlah[kolom.key] ?? 0,
      }))
      .filter((row) => row.value > 0) ?? [];

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
          icon={Landmark}
          label="Keluarga Terdata"
          nilai={formatAngka(keluargaTerdata)}
          keterangan="Keluarga yang tercatat dalam pengelompokan rata-rata pendapatan bulanan."
        />

        <RingkasanCard
          icon={Bike}
          label="Memiliki Sepeda Motor"
          nilai={formatAngka(sepedaMotor)}
          keterangan="Keluarga yang tercatat memiliki aset berupa sepeda motor."
        />

        <RingkasanCard
          icon={Beef}
          label="Total Ternak"
          nilai={formatAngka(totalTernak)}
          keterangan="Total sapi, kerbau, kuda, babi, serta kambing atau domba yang tercatat."
        />

        <RingkasanCard
          icon={PiggyBank}
          label="Pendapatan > Rp4 Juta"
          nilai={formatAngka(pendapatanLebih4Juta)}
          keterangan="Keluarga dengan rata-rata pendapatan bulanan lebih dari Rp4.000.000."
        />
      </section>

      <section className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
              Daftar Isi Data
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              Perekonomian Desa Keji Tahun {tahun}
            </h2>

            <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-600">
              Data terdiri dari {data.length} tabel tentang aset keluarga,
              peternakan, dan pendapatan yang dapat dibandingkan antarwilayah.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {KELOMPOK_TABEL.map((kelompok) => {
              const Icon = kelompok.icon;

              return (
                <a
                  key={kelompok.id}
                  href={`#${kelompok.id}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-extrabold text-emerald-800 transition hover:bg-emerald-700 hover:text-white"
                >
                  <Icon size={15} />
                  {kelompok.nama}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
              Ringkasan Visual
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-900">
              Gambaran Kondisi Perekonomian
            </h2>
          </div>

          {tombolUnduh(
            'grafik-perekonomian',
            `ringkasan-perekonomian-desa-keji-${tahun}.png`,
            'grafik',
            'Unduh Grafik PNG',
          )}
        </div>

        <div
          id="grafik-perekonomian"
          className="space-y-5 bg-slate-50 py-1"
        >
          <GrafikGarisPendapatan tabel={pendapatan} tahun={tahun} />

          <div className="grid items-start gap-5 lg:grid-cols-2">
            <GrafikBatang
              title="Aset Bergerak Terbanyak"
              subtitle="Delapan jenis aset dengan jumlah keluarga tertinggi."
              rows={asetTerbanyak.map((row, index) => ({
                ...row,
                color: WARNA_BAR[index % WARNA_BAR.length],
              }))}
            />

            <GrafikBatang
              title="Ternak yang Tercatat"
              subtitle={`Jenis ternak yang memiliki nilai pada pendataan tahun ${tahun}.`}
              rows={ternakTercatat.map((row, index) => ({
                ...row,
                color: WARNA_BAR[index % WARNA_BAR.length],
              }))}
            />
          </div>
        </div>
      </section>

      {KELOMPOK_TABEL.map((kelompok) => {
        const Icon = kelompok.icon;

        const tabelKelompok = data.filter(
          (tabel) => tabel.kelompok === kelompok.nama,
        );

        return (
          <section
            key={kelompok.id}
            id={kelompok.id}
            className="scroll-mt-28"
          >
            <div className="mb-5 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Icon size={24} />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                  {tabelKelompok.length} Tabel
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  {kelompok.nama}
                </h2>

                <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
                  {kelompok.deskripsi}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {tabelKelompok.map((tabel) => (
                <article key={tabel.id}>
                  <div
                    id={`tabel-perekonomian-${tabel.id}`}
                    className="bg-slate-50 p-1"
                  >
                    <TabelData tabel={tabel} />

                    <p className="px-5 pb-3 pt-4 text-xs font-medium leading-5 text-slate-500 md:px-6">
                      Sumber: {sumber}
                    </p>
                  </div>

                  <div className="mt-3 flex justify-end">
                    {tombolUnduh(
                      `tabel-perekonomian-${tabel.id}`,
                      `${tabel.id}-desa-keji-${tahun}.png`,
                      tabel.id,
                      'Unduh Tabel PNG',
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}

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
