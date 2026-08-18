'use client';

import { useState } from 'react';

import {
  Bath,
  Download,
  FileSpreadsheet,
  Home,
  KeyRound,
  LoaderCircle,
  Table2,
  UtilityPole,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { toPng } from 'html-to-image';

import type {
  KelompokTabelPerumahan,
  TabelPerumahan,
} from '@/lib/desa-cantik-perumahan';

interface DesaCantikPerumahanProps {
  data: TabelPerumahan[];
  tahun: number;
  sumber: string;
}

interface RingkasanCardProps {
  icon: LucideIcon;
  label: string;
  nilai: string;
  keterangan: string;
}

const SERI_GRAFIK = [
  { label: 'RW 01', warna: '#075985' },
  { label: 'RW 02', warna: '#ea580c' },
  { label: 'RW 03', warna: '#15803d' },
  { label: 'Jumlah', warna: '#0ea5e9' },
];

const KELOMPOK_TABEL: Array<{
  id: string;
  nama: KelompokTabelPerumahan;
  icon: LucideIcon;
  deskripsi: string;
}> = [
  {
    id: 'hunian',
    nama: 'Hunian dan Kondisi Fisik',
    icon: Home,
    deskripsi:
      'Status hunian, luas lantai, serta material lantai, dinding, dan atap.',
  },
  {
    id: 'air-energi',
    nama: 'Air, Penerangan, dan Energi',
    icon: UtilityPole,
    deskripsi:
      'Sumber air minum, cara memperoleh air, penerangan, daya listrik, dan energi memasak.',
  },
  {
    id: 'sanitasi',
    nama: 'Sanitasi',
    icon: Bath,
    deskripsi:
      'Fasilitas buang air besar, jenis kloset, dan tempat pembuangan akhir tinja.',
  },
];

function formatAngka(value: number) {
  return new Intl.NumberFormat('id-ID').format(value);
}

function cariBatasSumbu(value: number) {
  if (value <= 0) {
    return 1;
  }

  const eksponen = Math.floor(Math.log10(value));
  const skala = 10 ** eksponen;
  const normal = value / skala;
  const pembulatan =
    normal <= 1
      ? 1
      : normal <= 2
        ? 2
        : normal <= 2.5
          ? 2.5
          : normal <= 5
            ? 5
            : 10;

  return pembulatan * skala;
}

function pecahLabel(label: string, batas = 16) {
  const kata = label.split(' ');
  const baris: string[] = [];

  kata.forEach((item) => {
    const terakhir = baris.at(-1);

    if (!terakhir || `${terakhir} ${item}`.length > batas) {
      baris.push(item);
    } else {
      baris[baris.length - 1] = `${terakhir} ${item}`;
    }
  });

  return baris.slice(0, 3);
}

function GrafikBatangKelompok({
  title,
  subtitle,
  tabel,
  className = '',
  sembunyikanKosong = false,
}: {
  title: string;
  subtitle: string;
  tabel?: TabelPerumahan;
  className?: string;
  sembunyikanKosong?: boolean;
}) {
  const kolom =
    tabel?.kolom.filter(
      (item) =>
        !sembunyikanKosong || (tabel.jumlah[item.key] ?? 0) > 0,
    ) ?? [];
  const seri = tabel
    ? [
        ...tabel.baris.map((baris) => ({
          label: baris.rw,
          nilai: baris.nilai,
        })),
        { label: 'Jumlah', nilai: tabel.jumlah },
      ]
    : [];
  const lebar = Math.max(720, kolom.length * 142 + 120);
  const tinggi = 450;
  const margin = {
    atas: 46,
    kanan: 35,
    bawah: 112,
    kiri: 68,
  };
  const lebarPlot = lebar - margin.kiri - margin.kanan;
  const tinggiPlot = tinggi - margin.atas - margin.bawah;
  const nilaiTertinggi = Math.max(
    ...seri.flatMap((item) =>
      kolom.map((kolomItem) => item.nilai[kolomItem.key] ?? 0),
    ),
    1,
  );
  const batasSumbu = cariBatasSumbu(nilaiTertinggi);
  const intervalSumbu = Array.from(
    { length: 6 },
    (_, index) => (batasSumbu / 5) * index,
  );
  const langkahX = lebarPlot / Math.max(kolom.length, 1);
  const jarakBatang = 4;
  const lebarBatang = Math.min(
    23,
    Math.max(
      12,
      (langkahX - 28 - jarakBatang * (seri.length - 1)) /
        Math.max(seri.length, 1),
    ),
  );
  const lebarGrup =
    seri.length * lebarBatang +
    Math.max(seri.length - 1, 0) * jarakBatang;
  const posisiY = (value: number) =>
    margin.atas +
    tinggiPlot -
    (value / batasSumbu) * tinggiPlot;

  return (
    <article
      className={`overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      <div className="border-b border-slate-100 px-5 py-5 md:px-6">
        <h3 className="text-center text-lg font-black leading-7 text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-center text-sm font-medium leading-6 text-slate-500">
          {subtitle}
        </p>
      </div>

      {kolom.length > 0 ? (
        <div className="p-4 md:p-5">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {SERI_GRAFIK.map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-600"
              >
                <span
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: item.warna }}
                />
                {item.label}
              </span>
            ))}
          </div>

          <div className="mt-3 overflow-x-auto pb-1">
            <svg
              role="img"
              aria-label={title}
              viewBox={`0 0 ${lebar} ${tinggi}`}
              className="w-full"
              style={{ minWidth: `${lebar}px` }}
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
                      stroke="#dbe3eb"
                      strokeWidth="1"
                    />

                    <text
                      x={margin.kiri - 12}
                      y={y + 5}
                      textAnchor="end"
                      fill="#64748b"
                      fontSize="12"
                      fontWeight="700"
                    >
                      {formatAngka(nilai)}
                    </text>
                  </g>
                );
              })}

              {kolom.map((item, indexKolom) => {
                const tengahGrup =
                  margin.kiri + langkahX * indexKolom + langkahX / 2;
                const awalGrup = tengahGrup - lebarGrup / 2;

                return (
                  <g key={item.key}>
                    {seri.map((seriItem, indexSeri) => {
                      const value = seriItem.nilai[item.key] ?? 0;
                      const x =
                        awalGrup +
                        indexSeri * (lebarBatang + jarakBatang);
                      const y = posisiY(value);
                      const tinggiBatang =
                        margin.atas + tinggiPlot - y;
                      const warna =
                        SERI_GRAFIK[indexSeri % SERI_GRAFIK.length]
                          .warna;

                      return (
                        <g key={`${item.key}-${seriItem.label}`}>
                          <rect
                            x={x}
                            y={y}
                            width={lebarBatang}
                            height={Math.max(tinggiBatang, 0)}
                            rx="2"
                            fill={warna}
                          />

                          <text
                            x={x + lebarBatang / 2}
                            y={Math.max(y - 7, 14)}
                            textAnchor="middle"
                            fill="#334155"
                            stroke="#ffffff"
                            strokeWidth="3"
                            paintOrder="stroke"
                            fontSize="10"
                            fontWeight="800"
                          >
                            {formatAngka(value)}
                          </text>
                        </g>
                      );
                    })}

                    <text
                      x={tengahGrup}
                      y={margin.atas + tinggiPlot + 25}
                      textAnchor="middle"
                      fill="#475569"
                      fontSize="11"
                      fontWeight="700"
                    >
                      {pecahLabel(item.label).map((baris, index) => (
                        <tspan
                          key={`${item.key}-${baris}`}
                          x={tengahGrup}
                          dy={index === 0 ? 0 : 15}
                        >
                          {baris}
                        </tspan>
                      ))}
                    </text>
                  </g>
                );
              })}

              <text
                x={lebar / 2}
                y={tinggi - 9}
                textAnchor="middle"
                fill="#64748b"
                fontSize="11"
                fontWeight="700"
              >
                Kategori data perumahan
              </text>
            </svg>
          </div>
        </div>
      ) : (
        <p className="p-6 text-sm font-semibold text-slate-500">
          Data grafik belum tersedia.
        </p>
      )}
    </article>
  );
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

function TabelData({ tabel }: { tabel: TabelPerumahan }) {
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
            3 RW
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-left text-sm">
          <thead>
            <tr className="bg-emerald-800 text-white">
              <th className="sticky left-0 z-10 min-w-24 bg-emerald-800 px-4 py-4 font-extrabold">
                RW
              </th>

              {tabel.kolom.map((kolom) => (
                <th
                  key={kolom.key}
                  className="min-w-32 px-4 py-4 text-center font-extrabold"
                >
                  {kolom.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tabel.baris.map((baris, index) => (
              <tr
                key={baris.rw}
                className={
                  index % 2 === 0
                    ? 'bg-white'
                    : 'bg-emerald-50/70'
                }
              >
                <th className="sticky left-0 z-10 whitespace-nowrap border-t border-slate-100 bg-inherit px-4 py-4 font-extrabold text-slate-800">
                  {baris.rw}
                </th>

                {tabel.kolom.map((kolom) => (
                  <td
                    key={kolom.key}
                    className="border-t border-slate-100 px-4 py-4 text-center font-bold tabular-nums text-slate-700"
                  >
                    {formatAngka(baris.nilai[kolom.key] ?? 0)}
                  </td>
                ))}
              </tr>
            ))}

            <tr className="bg-emerald-800 text-white">
              <th className="sticky left-0 z-10 bg-emerald-800 px-4 py-4 font-black">
                Jumlah
              </th>

              {tabel.kolom.map((kolom) => (
                <td
                  key={kolom.key}
                  className="px-4 py-4 text-center font-black tabular-nums"
                >
                  {formatAngka(tabel.jumlah[kolom.key] ?? 0)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {tabel.catatan ? (
        <p className="border-t border-slate-100 px-5 py-3 text-xs font-medium leading-5 text-slate-500 md:px-6">
          Catatan: {tabel.catatan}
        </p>
      ) : null}
    </div>
  );
}

export default function DesaCantikPerumahan({
  data,
  tahun,
  sumber,
}: DesaCantikPerumahanProps) {
  const [sedangMengunduh, setSedangMengunduh] = useState<
    string | null
  >(null);

  const statusPenguasaan = data.find(
    (tabel) => tabel.id === 'status-penguasaan',
  );

  const luasLantai = data.find(
    (tabel) => tabel.id === 'luas-lantai',
  );

  const sumberAir = data.find(
    (tabel) => tabel.id === 'sumber-air-minum',
  );

  const totalKeluarga = Object.values(
    statusPenguasaan?.jumlah ?? {},
  ).reduce((total, nilai) => total + nilai, 0);

  const milikSendiri =
    statusPenguasaan?.jumlah.milikSendiri ?? 0;

  const listrikPln =
    data.find(
      (tabel) => tabel.id === 'sumber-penerangan',
    )?.jumlah.listrikPln ?? 0;

  const fasilitasSendiri =
    data.find(
      (tabel) => tabel.id === 'fasilitas-bab',
    )?.jumlah.sendiri ?? 0;

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
          icon={Home}
          label="Total Keluarga"
          nilai={formatAngka(totalKeluarga)}
          keterangan="Keluarga yang tercatat pada data perumahan Desa Keji."
        />

        <RingkasanCard
          icon={KeyRound}
          label="Milik Sendiri"
          nilai={formatPersen(milikSendiri, totalKeluarga)}
          keterangan={`${formatAngka(
            milikSendiri,
          )} keluarga menempati rumah milik sendiri.`}
        />

        <RingkasanCard
          icon={Zap}
          label="Listrik PLN"
          nilai={formatPersen(listrikPln, totalKeluarga)}
          keterangan={`${formatAngka(
            listrikPln,
          )} keluarga menggunakan penerangan listrik PLN.`}
        />

        <RingkasanCard
          icon={Bath}
          label="Fasilitas BAB Sendiri"
          nilai={formatPersen(fasilitasSendiri, totalKeluarga)}
          keterangan={`${formatAngka(
            fasilitasSendiri,
          )} keluarga memiliki fasilitas BAB sendiri.`}
        />
      </section>

      <section className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
              Daftar Isi Data
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              Perumahan Desa Keji Tahun {tahun}
            </h2>

            <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-600">
              Data terdiri dari {data.length} tabel yang
              dikelompokkan agar lebih mudah dibaca dan
              dibandingkan antarwilayah.
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
              Gambaran Kondisi Perumahan
            </h2>
          </div>

          {tombolUnduh(
            'grafik-perumahan',
            `ringkasan-perumahan-desa-keji-${tahun}.png`,
            'grafik',
            'Unduh Grafik PNG',
          )}
        </div>

        <div
          id="grafik-perumahan"
          className="grid gap-5 bg-slate-50 p-1 xl:grid-cols-2"
        >
          <GrafikBatangKelompok
            title={`Status Penguasaan Bangunan Tempat Tinggal yang Ditempati Tahun ${tahun}`}
            subtitle="Perbandingan RW 01, RW 02, RW 03, dan jumlah desa."
            tabel={statusPenguasaan}
          />

          <GrafikBatangKelompok
            title={`Jumlah Keluarga Menurut Luas Lantai Tahun ${tahun}`}
            subtitle="Perbandingan kelompok luas lantai pada setiap RW dan jumlah desa."
            tabel={luasLantai}
          />

          <GrafikBatangKelompok
            className="xl:col-span-2"
            title={`Sumber Air Minum Utama Keluarga Tahun ${tahun}`}
            subtitle="Kategori bernilai ditampilkan untuk RW 01, RW 02, RW 03, dan jumlah desa."
            tabel={sumberAir}
            sembunyikanKosong
          />
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
                    id={`tabel-perumahan-${tabel.id}`}
                    className="bg-slate-50 p-1"
                  >
                    <TabelData tabel={tabel} />

                    <p className="px-5 pb-3 pt-4 text-xs font-medium leading-5 text-slate-500 md:px-6">
                      Sumber: {sumber}
                    </p>
                  </div>

                  <div className="mt-3 flex justify-end">
                    {tombolUnduh(
                      `tabel-perumahan-${tabel.id}`,
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
