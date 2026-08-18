'use client';

import { useState } from 'react';

import {
  Accessibility,
  Baby,
  Download,
  Droplets,
  FileSpreadsheet,
  HeartPulse,
  IdCard,
  LoaderCircle,
  Syringe,
  Table2,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { toPng } from 'html-to-image';

import type {
  KelompokTabelKesehatan,
  KolomKesehatan,
  TabelKesehatan,
} from '@/lib/desa-cantik-kesehatan';

interface DesaCantikKesehatanProps {
  data: TabelKesehatan[];
  tahun: number;
  sumber: string;
}

interface RingkasanCardProps {
  icon: LucideIcon;
  label: string;
  nilai: string;
  keterangan: string;
}

interface GrupKolom {
  label: string;
  jumlah: number;
}

interface DataGrafikLingkaran {
  label: string;
  value: number;
}

const WARNA_PAI = [
  '#0f3d5e',
  '#f97316',
  '#15803d',
  '#0284c7',
  '#a21caf',
  '#0891b2',
  '#164e63',
  '#9a3412',
  '#166534',
  '#65a30d',
  '#475569',
  '#0d9488',
];

const KELOMPOK_TABEL: Array<{
  id: string;
  nama: KelompokTabelKesehatan;
  icon: LucideIcon;
  deskripsi: string;
}> = [
  {
    id: 'kependudukan-identitas',
    nama: 'Kependudukan dan Identitas',
    icon: IdCard,
    deskripsi:
      'Status perkawinan menurut umur dan jenis kelamin serta kepemilikan kartu identitas.',
  },
  {
    id: 'ibu-keluarga-berencana',
    nama: 'Kesehatan Ibu dan Keluarga Berencana',
    icon: Baby,
    deskripsi:
      'Status kehamilan dan penggunaan alat keluarga berencana pada penduduk yang tercatat.',
  },
  {
    id: 'disabilitas-penyakit',
    nama: 'Disabilitas dan Penyakit',
    icon: HeartPulse,
    deskripsi:
      'Jenis disabilitas, sebaran menurut umur, serta penyakit kronis atau menahun.',
  },
  {
    id: 'darah-vaksinasi',
    nama: 'Golongan Darah dan Vaksinasi',
    icon: Droplets,
    deskripsi:
      'Golongan darah penduduk dan capaian vaksinasi pada setiap RW.',
  },
];

function formatAngka(value: number) {
  return new Intl.NumberFormat('id-ID').format(value);
}

function titikLingkaran(
  cx: number,
  cy: number,
  radius: number,
  sudut: number,
) {
  const radian = ((sudut - 90) * Math.PI) / 180;

  return {
    x: cx + radius * Math.cos(radian),
    y: cy + radius * Math.sin(radian),
  };
}

function pathIrisan(
  cx: number,
  cy: number,
  radius: number,
  awal: number,
  akhir: number,
) {
  const mulai = titikLingkaran(cx, cy, radius, awal);
  const selesai = titikLingkaran(cx, cy, radius, akhir);
  const busurBesar = akhir - awal > 180 ? 1 : 0;

  return [
    `M ${cx} ${cy}`,
    `L ${mulai.x} ${mulai.y}`,
    `A ${radius} ${radius} 0 ${busurBesar} 1 ${selesai.x} ${selesai.y}`,
    'Z',
  ].join(' ');
}

function GrafikLingkaran({
  title,
  subtitle,
  rows,
  className = '',
}: {
  title: string;
  subtitle: string;
  rows: DataGrafikLingkaran[];
  className?: string;
}) {
  const total = rows.reduce((jumlah, row) => jumlah + row.value, 0);
  const irisan = rows
    .reduce<{
      sudut: number;
      items: Array<
        DataGrafikLingkaran & {
          awal: number;
          akhir: number;
          besarSudut: number;
          warna: string;
        }
      >;
    }>(
      (hasil, row, index) => {
      const besarSudut = total > 0 ? (row.value / total) * 360 : 0;
        const awal = hasil.sudut;
        const akhir = hasil.sudut + besarSudut;

        return {
          sudut: akhir,
          items: [
            ...hasil.items,
            {
              ...row,
              awal,
              akhir,
              besarSudut,
              warna: WARNA_PAI[index % WARNA_PAI.length],
            },
          ],
        };
      },
      { sudut: 0, items: [] },
    )
    .items
    .filter((row) => row.value > 0);

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

      {total > 0 ? (
        <div className="grid items-center gap-4 p-5 md:grid-cols-[minmax(280px,0.9fr)_minmax(260px,1.1fr)] md:p-6">
          <svg
            role="img"
            aria-label={title}
            viewBox="0 0 340 340"
            className="mx-auto w-full max-w-[360px]"
          >
            {irisan.length === 1 ? (
              <circle
                cx="170"
                cy="170"
                r="126"
                fill={irisan[0].warna}
                stroke="#ffffff"
                strokeWidth="2"
              />
            ) : (
              irisan.map((row) => (
                <path
                  key={`slice-${row.label}`}
                  d={pathIrisan(
                    170,
                    170,
                    126,
                    row.awal,
                    row.akhir,
                  )}
                  fill={row.warna}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              ))
            )}

            {irisan.map((row, index) => {
              const tengah = (row.awal + row.akhir) / 2;
              const kecil = row.besarSudut < 32;
              const titikAwal = titikLingkaran(
                170,
                170,
                kecil ? 118 : 80,
                tengah,
              );
              const titikLabel = titikLingkaran(
                170,
                170,
                kecil ? 145 + (index % 2) * 8 : 80,
                tengah,
              );

              return (
                <g key={`label-${row.label}`}>
                  {kecil ? (
                    <line
                      x1={titikAwal.x}
                      y1={titikAwal.y}
                      x2={titikLabel.x}
                      y2={titikLabel.y}
                      stroke={row.warna}
                      strokeWidth="1.5"
                    />
                  ) : null}

                  <text
                    x={titikLabel.x}
                    y={titikLabel.y + 4}
                    textAnchor="middle"
                    fill={kecil ? row.warna : '#ffffff'}
                    stroke={kecil ? '#ffffff' : row.warna}
                    strokeWidth={kecil ? 4 : 3}
                    paintOrder="stroke"
                    fontSize="13"
                    fontWeight="900"
                  >
                    {formatAngka(row.value)}
                  </text>
                </g>
              );
            })}
          </svg>

          <div>
            <div className="space-y-2.5">
              {rows.map((row, index) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[12px_minmax(0,1fr)_auto] items-start gap-2 text-xs"
                >
                  <span
                    className="mt-0.5 h-3 w-3 rounded-sm"
                    style={{
                      backgroundColor:
                        WARNA_PAI[index % WARNA_PAI.length],
                    }}
                  />

                  <span className="font-semibold leading-4 text-slate-600">
                    {row.label}
                  </span>

                  <span className="font-black tabular-nums text-slate-900">
                    {formatAngka(row.value)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-center gap-3 rounded-xl border border-emerald-700 bg-emerald-50 px-4 py-3 text-emerald-950">
              <span className="text-sm font-bold">Total</span>
              <span className="text-xl font-black tabular-nums">
                {formatAngka(total)}
              </span>
              <span className="text-xs font-bold">orang</span>
            </div>
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

function kelompokkanKolom(kolom: KolomKesehatan[]) {
  return kolom.reduce<GrupKolom[]>((grup, item) => {
    const grupTerakhir = grup.at(-1);

    if (grupTerakhir?.label === item.grup) {
      grupTerakhir.jumlah += 1;
    } else {
      grup.push({ label: item.grup, jumlah: 1 });
    }

    return grup;
  }, []);
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

function TabelData({ tabel }: { tabel: TabelKesehatan }) {
  const grupKolom = kelompokkanKolom(tabel.kolom);

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
            {tabel.baris.length} Baris
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-left text-sm">
          <thead className="bg-emerald-800 text-white">
            <tr>
              <th
                rowSpan={2}
                className="sticky left-0 z-20 min-w-32 border-r border-white/10 bg-emerald-800 px-4 py-4 font-extrabold"
              >
                {tabel.labelBaris}
              </th>

              {grupKolom.map((grup) => (
                <th
                  key={grup.label}
                  colSpan={grup.jumlah}
                  className="border-b border-white/15 px-4 py-3 text-center font-extrabold"
                >
                  {grup.label}
                </th>
              ))}
            </tr>

            <tr>
              {tabel.kolom.map((kolom) => (
                <th
                  key={kolom.key}
                  className="min-w-32 px-4 py-3 text-center font-extrabold"
                >
                  {kolom.label}
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

export default function DesaCantikKesehatan({
  data,
  tahun,
  sumber,
}: DesaCantikKesehatanProps) {
  const [sedangMengunduh, setSedangMengunduh] = useState<
    string | null
  >(null);

  const statusKehamilan = data.find(
    (tabel) => tabel.id === 'status-kehamilan',
  );

  const penggunaanKb = data.find(
    (tabel) => tabel.id === 'penggunaan-alat-kb',
  );

  const jenisDisabilitas = data.find(
    (tabel) => tabel.id === 'jenis-disabilitas',
  );

  const penyakitKronis = data.find(
    (tabel) => tabel.id === 'penyakit-kronis',
  );

  const vaksinasi = data.find(
    (tabel) => tabel.id === 'vaksinasi',
  );

  const ibuHamil = statusKehamilan?.jumlah.ya ?? 0;

  const totalPenggunaKb = Object.values(
    penggunaanKb?.jumlah ?? {},
  ).reduce((total, nilai) => total + nilai, 0);

  const totalDisabilitas = Object.entries(
    jenisDisabilitas?.jumlah ?? {},
  ).reduce(
    (total, [key, nilai]) =>
      key === 'tidakCacat' ? total : total + nilai,
    0,
  );

  const vaksinDosis2 = vaksinasi?.jumlah.dosis2 ?? 0;

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
          icon={Baby}
          label="Ibu Hamil"
          nilai={formatAngka(ibuHamil)}
          keterangan="Penduduk wanita umur 10–49 tahun berstatus kawin yang tercatat hamil."
        />

        <RingkasanCard
          icon={Users}
          label="Pengguna Alat KB"
          nilai={formatAngka(totalPenggunaKb)}
          keterangan="Total penggunaan alat KB dari seluruh jenis yang tercatat."
        />

        <RingkasanCard
          icon={Accessibility}
          label="Penduduk Disabilitas"
          nilai={formatAngka(totalDisabilitas)}
          keterangan="Jumlah penduduk pada seluruh kategori disabilitas di Tabel 3.5."
        />

        <RingkasanCard
          icon={Syringe}
          label="Vaksin Dosis 2"
          nilai={formatAngka(vaksinDosis2)}
          keterangan="Penduduk yang tercatat pada kategori vaksin dosis kedua."
        />
      </section>

      <section className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
              Daftar Isi Data
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              Kesehatan Desa Keji Tahun {tahun}
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
              Gambaran Kondisi Kesehatan
            </h2>
          </div>

          {tombolUnduh(
            'grafik-kesehatan',
            `ringkasan-kesehatan-desa-keji-${tahun}.png`,
            'grafik',
            'Unduh Grafik PNG',
          )}
        </div>

        <div
          id="grafik-kesehatan"
          className="grid gap-5 bg-slate-50 p-1 xl:grid-cols-2"
        >
          <GrafikLingkaran
            title={`Penggunaan Alat KB Tahun ${tahun}`}
            subtitle="Jumlah pengguna berdasarkan jenis alat atau metode KB."
            rows={
              penggunaanKb?.kolom
                .map((kolom) => ({
                  label: kolom.label,
                  value: penggunaanKb.jumlah[kolom.key] ?? 0,
                })) ?? []
            }
          />

          <GrafikLingkaran
            title={`Penyakit Kronis/Menahun Tahun ${tahun}`}
            subtitle="Jumlah penduduk menurut jenis penyakit yang tercatat."
            rows={
              penyakitKronis?.kolom
                .map((kolom) => ({
                  label: kolom.label,
                  value: penyakitKronis.jumlah[kolom.key] ?? 0,
                }))
                .filter((row) => row.value > 0) ?? []
            }
          />

          <GrafikLingkaran
            className="xl:col-span-2"
            title={`Status Vaksinasi Penduduk Tahun ${tahun}`}
            subtitle="Jumlah penduduk pada setiap kategori vaksinasi."
            rows={
              vaksinasi?.kolom.map((kolom) => ({
                label: kolom.label,
                value: vaksinasi.jumlah[kolom.key] ?? 0,
              })) ?? []
            }
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
                    id={`tabel-kesehatan-${tabel.id}`}
                    className="bg-slate-50 p-1"
                  >
                    <TabelData tabel={tabel} />

                    <p className="px-5 pb-3 pt-4 text-xs font-medium leading-5 text-slate-500 md:px-6">
                      Sumber: {sumber}
                    </p>
                  </div>

                  <div className="mt-3 flex justify-end">
                    {tombolUnduh(
                      `tabel-kesehatan-${tabel.id}`,
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
