// app/admin/pengaduan/page.tsx

import Link from 'next/link';

import {
  CalendarDays,
  CheckCircle2,
  CircleEllipsis,
  Clock3,
  ExternalLink,
  FileText,
  Filter,
  MapPin,
  MessageCircle,
  Save,
  Search,
  ShieldCheck,
  UserRound,
  XCircle,
} from 'lucide-react';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import {
  simpanCatatanPengaduan,
  ubahStatusPengaduan,
} from './actions';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

type StatusPengaduan =
  | 'Menunggu'
  | 'Diproses'
  | 'Selesai'
  | 'Ditolak';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
}

interface PengaduanRow {
  id: number;
  kode_pengaduan: string;
  nama_pelapor: string | null;
  anonim: boolean;
  nomor_whatsapp: string;
  kategori: string;
  judul: string;
  isi_pengaduan: string;
  lokasi: string | null;
  tanggal_kejadian: string | null;
  bukti_path: string | null;
  status: StatusPengaduan;
  catatan_admin: string | null;
  created_at: string;
}

interface PengaduanView
  extends PengaduanRow {
  buktiUrl: string | null;
}

function formatTanggal(
  value: string | null
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
      hour:
        value.includes('T')
          ? '2-digit'
          : undefined,
      minute:
        value.includes('T')
          ? '2-digit'
          : undefined,
      timeZone:
        'Asia/Jakarta',
    }
  ).format(date);
}

function formatWhatsApp(
  value: string
) {
  const nomor =
    value.replace(/\D/g, '');

  if (
    nomor.startsWith('0')
  ) {
    return `62${nomor.slice(1)}`;
  }

  if (
    nomor.startsWith('8')
  ) {
    return `62${nomor}`;
  }

  return nomor;
}

export default async function AdminPengaduanPage({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;

  const q =
    String(
      params.q ?? ''
    )
      .trim()
      .toLowerCase();

  const statusFilter =
    String(
      params.status ??
        'semua'
    ).toLowerCase();

  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from('pengaduan')
      .select(`
        id,
        kode_pengaduan,
        nama_pelapor,
        anonim,
        nomor_whatsapp,
        kategori,
        judul,
        isi_pengaduan,
        lokasi,
        tanggal_kejadian,
        bukti_path,
        status,
        catatan_admin,
        created_at
      `)
      .order(
        'created_at',
        {
          ascending: false,
        }
      );

  if (error) {
    console.error(
      'Gagal mengambil pengaduan:',
      error
    );
  }

  const rows =
    (data ?? []) as PengaduanRow[];

  const pengaduanDenganBukti:
    PengaduanView[] =
    await Promise.all(
      rows.map(
        async (item) => {
          if (
            !item.bukti_path
          ) {
            return {
              ...item,
              buktiUrl: null,
            };
          }

          const {
            data:
              signedData,
            error:
              signedError,
          } =
            await supabaseAdmin
              .storage
              .from(
                'bukti-pengaduan'
              )
              .createSignedUrl(
                item.bukti_path,
                3600
              );

          if (signedError) {
            console.error(
              'Gagal membuat signed URL bukti:',
              signedError
            );
          }

          return {
            ...item,
            buktiUrl:
              signedData
                ?.signedUrl ??
              null,
          };
        }
      )
    );

  const total =
    pengaduanDenganBukti.length;

  const totalMenunggu =
    pengaduanDenganBukti.filter(
      (item) =>
        item.status ===
        'Menunggu'
    ).length;

  const totalDiproses =
    pengaduanDenganBukti.filter(
      (item) =>
        item.status ===
        'Diproses'
    ).length;

  const totalSelesai =
    pengaduanDenganBukti.filter(
      (item) =>
        item.status ===
        'Selesai'
    ).length;

  const filtered =
    pengaduanDenganBukti.filter(
      (item) => {
        const cocokPencarian =
          !q ||
          item.kode_pengaduan
            .toLowerCase()
            .includes(q) ||
          (
            item.nama_pelapor ??
            ''
          )
            .toLowerCase()
            .includes(q) ||
          item.nomor_whatsapp.includes(
            q
          ) ||
          item.judul
            .toLowerCase()
            .includes(q) ||
          item.kategori
            .toLowerCase()
            .includes(q);

        const cocokStatus =
          statusFilter ===
            'semua' ||
          item.status
            .toLowerCase() ===
            statusFilter;

        return (
          cocokPencarian &&
          cocokStatus
        );
      }
    );

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] px-6 py-7 text-white shadow-xl sm:px-8 sm:py-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.13) 1.5px, transparent 1.5px)',
            backgroundSize:
              '26px 26px',
          }}
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold">
              <ShieldCheck
                size={14}
              />

              Aspirasi masyarakat
            </div>

            <h1 className="mt-3 text-2xl font-black sm:text-3xl">
              Pengaduan Masyarakat
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
              Verifikasi laporan, hubungi pelapor, perbarui status, dan simpan catatan tindak lanjut pengaduan.
            </p>
          </div>

          <Link
            href="/pengaduan"
            target="_blank"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-800"
          >
            Halaman Publik

            <ExternalLink
              size={16}
            />
          </Link>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Statistik
          label="Total Pengaduan"
          value={total}
          icon={
            FileText
          }
        />

        <Statistik
          label="Menunggu"
          value={
            totalMenunggu
          }
          icon={
            Clock3
          }
        />

        <Statistik
          label="Diproses"
          value={
            totalDiproses
          }
          icon={
            CircleEllipsis
          }
        />

        <Statistik
          label="Selesai"
          value={
            totalSelesai
          }
          icon={
            CheckCircle2
          }
        />
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
        <form
          method="get"
          className="grid gap-4 lg:grid-cols-[1fr_220px_auto]"
        >
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              name="q"
              defaultValue={
                params.q ?? ''
              }
              placeholder="Cari kode, nama, WhatsApp, kategori, atau judul..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold outline-none focus:border-emerald-400"
            />
          </div>

          <select
            name="status"
            defaultValue={
              statusFilter
            }
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold"
          >
            <option value="semua">
              Semua Status
            </option>

            <option value="menunggu">
              Menunggu
            </option>

            <option value="diproses">
              Diproses
            </option>

            <option value="selesai">
              Selesai
            </option>

            <option value="ditolak">
              Ditolak
            </option>
          </select>

          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white"
          >
            <Filter
              size={17}
            />

            Terapkan
          </button>
        </form>
      </section>

      {filtered.length === 0 ? (
        <section className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-white p-8 text-center">
          <FileText
            size={32}
            className="text-emerald-600"
          />

          <h2 className="mt-4 font-black text-slate-800">
            Belum ada pengaduan
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Pengaduan yang dikirim masyarakat akan muncul di halaman ini.
          </p>
        </section>
      ) : (
        <section className="space-y-5">
          {filtered.map(
            (item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white p-5 sm:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                        <UserRound
                          size={21}
                        />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-emerald-700">
                            {
                              item.kategori
                            }
                          </span>

                          <StatusBadge
                            status={
                              item.status
                            }
                          />
                        </div>

                        <h2 className="mt-3 text-xl font-black text-slate-900">
                          {item.judul}
                        </h2>

                        <p className="mt-2 text-xs font-bold text-slate-500">
                          {
                            item.kode_pengaduan
                          }{' '}
                          ·{' '}
                          {formatTanggal(
                            item.created_at
                          )}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/${formatWhatsApp(
                        item.nomor_whatsapp
                      )}?text=${encodeURIComponent(
                        `Halo ${item.anonim ? 'Pelapor' : item.nama_pelapor}, pengaduan dengan kode ${item.kode_pengaduan} sedang kami tindak lanjuti oleh Pemerintah Desa Keji.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 text-xs font-extrabold text-emerald-700"
                    >
                      <MessageCircle
                        size={15}
                      />

                      Hubungi Pelapor
                    </a>
                  </div>
                </div>

                <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[1fr_330px]">
                  <div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <InfoItem
                        label="Pelapor"
                        value={
                          item.anonim
                            ? 'Anonim'
                            : item.nama_pelapor ??
                              '-'
                        }
                      />

                      <InfoItem
                        label="Nomor WhatsApp"
                        value={
                          item.nomor_whatsapp
                        }
                      />

                      <InfoItem
                        label="Lokasi"
                        value={
                          item.lokasi ||
                          'Tidak dicantumkan'
                        }
                        icon={
                          MapPin
                        }
                      />

                      <InfoItem
                        label="Tanggal Kejadian"
                        value={
                          formatTanggal(
                            item.tanggal_kejadian
                          )
                        }
                        icon={
                          CalendarDays
                        }
                      />
                    </div>

                    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                        Isi Pengaduan
                      </p>

                      <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-7 text-slate-700">
                        {
                          item.isi_pengaduan
                        }
                      </p>
                    </div>

                    {item.buktiUrl && (
                      <a
                        href={
                          item.buktiUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-800 px-4 text-xs font-extrabold text-white"
                      >
                        <ExternalLink
                          size={15}
                        />

                        Buka Bukti Pendukung
                      </a>
                    )}
                  </div>

                  <aside className="space-y-4">
                    <form
                      action={
                        ubahStatusPengaduan
                      }
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <input
                        type="hidden"
                        name="id"
                        value={
                          item.id
                        }
                      />

                      <label className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                        Status Penanganan
                      </label>

                      <select
                        name="status"
                        defaultValue={
                          item.status
                        }
                        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold"
                      >
                        <option value="Menunggu">
                          Menunggu
                        </option>

                        <option value="Diproses">
                          Diproses
                        </option>

                        <option value="Selesai">
                          Selesai
                        </option>

                        <option value="Ditolak">
                          Ditolak
                        </option>
                      </select>

                      <button
                        type="submit"
                        className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 text-xs font-extrabold text-white"
                      >
                        <Save
                          size={15}
                        />

                        Simpan Status
                      </button>
                    </form>

                    <form
                      action={
                        simpanCatatanPengaduan
                      }
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <input
                        type="hidden"
                        name="id"
                        value={
                          item.id
                        }
                      />

                      <label className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                        Catatan Admin
                      </label>

                      <textarea
                        name="catatan_admin"
                        defaultValue={
                          item.catatan_admin ??
                          ''
                        }
                        maxLength={
                          2000
                        }
                        rows={5}
                        placeholder="Catatan tindak lanjut internal..."
                        className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium outline-none"
                      />

                      <button
                        type="submit"
                        className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-800 text-xs font-extrabold text-white"
                      >
                        <Save
                          size={15}
                        />

                        Simpan Catatan
                      </button>
                    </form>
                  </aside>
                </div>
              </article>
            )
          )}
        </section>
      )}
    </div>
  );
}

function Statistik({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon:
    typeof FileText;
}) {
  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
            {label}
          </p>

          <p className="mt-4 text-4xl font-black text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Icon size={22} />
        </div>
      </div>
    </article>
  );
}

function InfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?:
    typeof MapPin;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
        {Icon && (
          <Icon size={13} />
        )}

        {label}
      </p>

      <p className="mt-2 text-sm font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: StatusPengaduan;
}) {
  const classes = {
    Menunggu:
      'bg-amber-100 text-amber-700',

    Diproses:
      'bg-blue-100 text-blue-700',

    Selesai:
      'bg-emerald-100 text-emerald-700',

    Ditolak:
      'bg-red-100 text-red-700',
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${classes[status]}`}
    >
      {status}
    </span>
  );
}