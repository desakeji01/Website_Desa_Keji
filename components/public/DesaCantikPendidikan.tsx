'use client';

import { useState } from 'react';

import {
  BookOpenCheck,
  BriefcaseBusiness,
  Download,
  FileSpreadsheet,
  GraduationCap,
  LoaderCircle,
  School,
  Table2,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { toPng } from 'html-to-image';

import type {
  KelompokTabelPendidikan,
  KolomPendidikan,
  TabelPendidikan,
} from '@/lib/desa-cantik-pendidikan';

interface DesaCantikPendidikanProps {
  data: TabelPendidikan[];
  tahun: number;
  sumber: string;
}

interface RingkasanCardProps {
  icon: LucideIcon;
  label: string;
  nilai: string;
  keterangan: string;
}

interface DataGrafikGaris {
  label: string;
  value: number;
}

const KELOMPOK_TABEL: Array<{
  id: string;
  nama: KelompokTabelPendidikan;
  icon: LucideIcon;
  deskripsi: string;
}> = [
  {
    id: 'pendidikan-formal',
    nama: 'Partisipasi dan Pendidikan Formal',
    icon: GraduationCap,
    deskripsi:
      'Partisipasi sekolah dan ijazah tertinggi yang dimiliki penduduk usia 5 tahun ke atas.',
  },
  {
    id: 'lapangan-usaha',
    nama: 'Lapangan Usaha',
    icon: BriefcaseBusiness,
    deskripsi:
      'Sebaran penduduk usia 5 tahun ke atas menurut bidang pekerjaan atau lapangan usaha.',
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

function pecahLabel(label: string, batas = 18) {
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

  return baris.slice(0, 4);
}

function GrafikGaris({
  title,
  subtitle,
  rows,
  className = '',
}: {
  title: string;
  subtitle: string;
  rows: DataGrafikGaris[];
  className?: string;
}) {
  const lebar = Math.max(720, rows.length * 108 + 130);
  const tinggi = 430;
  const margin = {
    atas: 48,
    kanan: 40,
    bawah: 112,
    kiri: 72,
  };
  const lebarPlot = lebar - margin.kiri - margin.kanan;
  const tinggiPlot = tinggi - margin.atas - margin.bawah;
  const nilaiTertinggi = Math.max(
    ...rows.map((row) => row.value),
    1,
  );
  const batasSumbu = cariBatasSumbu(nilaiTertinggi);
  const intervalSumbu = Array.from(
    { length: 6 },
    (_, index) => (batasSumbu / 5) * index,
  );
  const posisiX = (index: number) =>
    margin.kiri +
    (index / Math.max(rows.length - 1, 1)) * lebarPlot;
  const posisiY = (value: number) =>
    margin.atas +
    tinggiPlot -
    (value / batasSumbu) * tinggiPlot;
  const titik = rows.map((row, index) => ({
    ...row,
    x: posisiX(index),
    y: posisiY(row.value),
  }));
  const path = titik
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`,
    )
    .join(' ');

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

      {rows.length > 0 ? (
        <div className="overflow-x-auto p-4 pb-2 md:p-5 md:pb-3">
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
                    stroke="#e2e8f0"
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

            {titik.map((point) => (
              <line
                key={`grid-${point.label}`}
                x1={point.x}
                x2={point.x}
                y1={margin.atas}
                y2={margin.atas + tinggiPlot}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
            ))}

            <path
              d={path}
              fill="none"
              stroke="#059669"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {titik.map((point) => (
              <g key={point.label}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5.5"
                  fill="#059669"
                  stroke="#ffffff"
                  strokeWidth="3"
                />

                <text
                  x={point.x}
                  y={Math.max(point.y - 13, 18)}
                  textAnchor="middle"
                  fill="#064e3b"
                  stroke="#ffffff"
                  strokeWidth="4"
                  paintOrder="stroke"
                  fontSize="12"
                  fontWeight="900"
                >
                  {formatAngka(point.value)}
                </text>

                <text
                  x={point.x}
                  y={margin.atas + tinggiPlot + 27}
                  textAnchor="middle"
                  fill="#475569"
                  fontSize="11"
                  fontWeight="700"
                >
                  {pecahLabel(point.label).map((baris, index) => (
                    <tspan
                      key={`${point.label}-${baris}`}
                      x={point.x}
                      dy={index === 0 ? 0 : 15}
                    >
                      {baris}
                    </tspan>
                  ))}
                </text>
              </g>
            ))}

            <text
              x={lebar / 2}
              y={tinggi - 9}
              textAnchor="middle"
              fill="#64748b"
              fontSize="11"
              fontWeight="700"
            >
              Kategori data pendidikan
            </text>
          </svg>
        </div>
      ) : (
        <p className="p-6 text-sm font-semibold text-slate-500">
          Data grafik belum tersedia.
        </p>
      )}
    </article>
  );
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

function TabelBagian({
  tabel,
  kolom,
  judulBagian,
}: {
  tabel: TabelPendidikan;
  kolom: KolomPendidikan[];
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

function TabelData({ tabel }: { tabel: TabelPendidikan }) {
  const bagian = tabel.bagianKolom?.map((item) => ({
    judul: item.judul,
    kolom: item.keys
      .map((key) => tabel.kolom.find((kolom) => kolom.key === key))
      .filter((kolom): kolom is KolomPendidikan => Boolean(kolom)),
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
            3 RW
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

export default function DesaCantikPendidikan({
  data,
  tahun,
  sumber,
}: DesaCantikPendidikanProps) {
  const [sedangMengunduh, setSedangMengunduh] = useState<
    string | null
  >(null);

  const partisipasiSekolah = data.find(
    (tabel) => tabel.id === 'partisipasi-sekolah',
  );

  const ijazahTertinggi = data.find(
    (tabel) => tabel.id === 'ijazah-tertinggi',
  );

  const lapanganUsaha = data.find(
    (tabel) => tabel.id === 'lapangan-usaha',
  );

  const pendudukUsia5KeAtas = Object.values(
    partisipasiSekolah?.jumlah ?? {},
  ).reduce((total, nilai) => total + nilai, 0);

  const masihSekolah = partisipasiSekolah?.jumlah.masihSekolah ?? 0;

  const lulusanSma = ijazahTertinggi?.jumlah.smaSederajat ?? 0;

  const pendidikanTinggi =
    (ijazahTertinggi?.jumlah.diploma123 ?? 0) +
    (ijazahTertinggi?.jumlah.diploma4S1 ?? 0) +
    (ijazahTertinggi?.jumlah.s2S3 ?? 0);

  const lapanganUsahaRows =
    lapanganUsaha?.kolom.map((kolom) => ({
      label: kolom.label,
      value: lapanganUsaha.jumlah[kolom.key] ?? 0,
    })) ?? [];

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
          label="Penduduk Usia 5+"
          nilai={formatAngka(pendudukUsia5KeAtas)}
          keterangan="Penduduk usia 5 tahun ke atas yang tercatat pada data partisipasi sekolah."
        />

        <RingkasanCard
          icon={School}
          label="Masih Sekolah"
          nilai={formatAngka(masihSekolah)}
          keterangan="Penduduk usia 5 tahun ke atas yang masih mengikuti pendidikan."
        />

        <RingkasanCard
          icon={BookOpenCheck}
          label="SMA/Sederajat"
          nilai={formatAngka(lulusanSma)}
          keterangan="Penduduk dengan ijazah tertinggi pada jenjang SMA atau sederajat."
        />

        <RingkasanCard
          icon={GraduationCap}
          label="Pendidikan Tinggi"
          nilai={formatAngka(pendidikanTinggi)}
          keterangan="Gabungan pemilik ijazah D1/D2/D3, D4/S1, dan S2/S3."
        />
      </section>

      <section className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
              Daftar Isi Data
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              Pendidikan Desa Keji Tahun {tahun}
            </h2>

            <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-600">
              Data terdiri dari {data.length} tabel yang dikelompokkan
              agar lebih mudah dibaca dan dibandingkan antarwilayah.
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
              Gambaran Kondisi Pendidikan
            </h2>
          </div>

          {tombolUnduh(
            'grafik-pendidikan',
            `ringkasan-pendidikan-desa-keji-${tahun}.png`,
            'grafik',
            'Unduh Grafik PNG',
          )}
        </div>

        <div
          id="grafik-pendidikan"
          className="grid gap-5 bg-slate-50 p-1 xl:grid-cols-2"
        >
          <GrafikGaris
            title={`Partisipasi Sekolah Penduduk Usia 5 Tahun ke Atas Tahun ${tahun}`}
            subtitle="Jumlah penduduk pada setiap status partisipasi sekolah."
            rows={
              partisipasiSekolah?.kolom.map((kolom) => ({
                label: kolom.label,
                value: partisipasiSekolah.jumlah[kolom.key] ?? 0,
              })) ?? []
            }
          />

          <GrafikGaris
            title={`Ijazah Tertinggi Penduduk Usia 5 Tahun ke Atas Tahun ${tahun}`}
            subtitle="Jumlah penduduk menurut jenjang ijazah tertinggi yang dimiliki."
            rows={
              ijazahTertinggi?.kolom.map((kolom) => ({
                label: kolom.label,
                value: ijazahTertinggi.jumlah[kolom.key] ?? 0,
              })) ?? []
            }
          />

          <GrafikGaris
            className="xl:col-span-2"
            title={`Jumlah Penduduk Usia 5 Tahun ke Atas Menurut Lapangan Usaha Tahun ${tahun}`}
            subtitle="Seluruh lapangan usaha ditampilkan mengikuti urutan pada tabel sumber."
            rows={lapanganUsahaRows}
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
                    id={`tabel-pendidikan-${tabel.id}`}
                    className="bg-slate-50 p-1"
                  >
                    <TabelData tabel={tabel} />

                    <p className="px-5 pb-3 pt-4 text-xs font-medium leading-5 text-slate-500 md:px-6">
                      Sumber: {sumber}
                    </p>
                  </div>

                  <div className="mt-3 flex justify-end">
                    {tombolUnduh(
                      `tabel-pendidikan-${tabel.id}`,
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
