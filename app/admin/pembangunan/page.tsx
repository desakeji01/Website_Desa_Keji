// app/admin/pembangunan/page.tsx

import Link from 'next/link';

import {
  AlertCircle,
  Banknote,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ExternalLink,
  Eye,
  EyeOff,
  FileImage,
  FilePlus2,
  FileText,
  Gauge,
  HardHat,
  Image as ImageIcon,
  MapPin,
  Pencil,
  Power,
  Save,
  Trash2,
  TrendingUp,
  Upload,
  XCircle,
  type LucideIcon,
} from 'lucide-react';

import {
  hapusProyekPembangunanAction,
  tambahProyekPembangunanAction,
  toggleAktifProyekPembangunanAction,
  ubahProyekPembangunanAction,
} from '@/app/admin/pembangunan/actions';

import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const STATUS_PEMBANGUNAN_OPTIONS = [
  'Perencanaan',
  'Berjalan',
  'Selesai',
] as const;

type StatusPembangunan =
  (typeof STATUS_PEMBANGUNAN_OPTIONS)[number];

interface PageProps {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
}

interface ProyekPembangunanAdmin {
  id: string;
  nama: string;
  lokasi: string;
  tahun: number;
  sumber_dana: string;
  anggaran: number;
  progres: number;
  status: StatusPembangunan;
  deskripsi: string;
  gambar_url: string | null;
  aktif: boolean;
  urutan: number;
  created_at: string;
  updated_at: string;
}

function safeString(value: unknown) {
  return String(value ?? '').trim();
}

function isStatusPembangunan(
  value: string
): value is StatusPembangunan {
  return (
    STATUS_PEMBANGUNAN_OPTIONS as readonly string[]
  ).includes(value);
}

function normalizeProyek(
  value: unknown
): ProyekPembangunanAdmin | null {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return null;
  }

  const row = value as Record<
    string,
    unknown
  >;

  const id = safeString(row.id);
  const nama = safeString(row.nama);
  const lokasi = safeString(row.lokasi);
  const sumberDana = safeString(
    row.sumber_dana
  );
  const status = safeString(row.status);

  const tahun = Number(row.tahun);
  const anggaran = Number(
    row.anggaran ?? 0
  );
  const progres = Number(
    row.progres ?? 0
  );
  const urutan = Number(
    row.urutan ?? 0
  );

  if (
    !id ||
    !nama ||
    !lokasi ||
    !sumberDana ||
    !Number.isInteger(tahun) ||
    !Number.isFinite(anggaran) ||
    !Number.isFinite(progres) ||
    !Number.isInteger(urutan) ||
    !isStatusPembangunan(status)
  ) {
    return null;
  }

  const gambarUrl = safeString(
    row.gambar_url
  );

  return {
    id,
    nama,
    lokasi,
    tahun,
    sumber_dana: sumberDana,
    anggaran,
    progres,
    status,

    deskripsi: safeString(
      row.deskripsi
    ),

    gambar_url:
      gambarUrl.length > 0
        ? gambarUrl
        : null,

    aktif: Boolean(row.aktif),
    urutan,

    created_at: safeString(
      row.created_at
    ),

    updated_at: safeString(
      row.updated_at
    ),
  };
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat(
    'id-ID',
    {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }
  ).format(value);
}

function formatAngka(value: number) {
  return new Intl.NumberFormat(
    'id-ID'
  ).format(value);
}

function formatTanggal(value: string) {
  if (!value) {
    return 'Belum diperbarui';
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return 'Belum diperbarui';
  }

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    }
  ).format(date);
}

function getStatusClass(
  status: StatusPembangunan
) {
  switch (status) {
    case 'Perencanaan':
      return 'border-blue-200 bg-blue-50 text-blue-700';

    case 'Berjalan':
      return 'border-amber-200 bg-amber-50 text-amber-700';

    case 'Selesai':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';

    default:
      return 'border-slate-200 bg-slate-50 text-slate-700';
  }
}

function getProgressClass(
  progres: number
) {
  if (progres >= 100) {
    return 'bg-emerald-600';
  }

  if (progres >= 50) {
    return 'bg-amber-500';
  }

  return 'bg-blue-600';
}

export default async function AdminPembangunanPage({
  searchParams,
}: PageProps) {
  const [
    params,
    proyekResult,
  ] = await Promise.all([
    searchParams,

    supabaseAdmin
      .from('proyek_pembangunan')
      .select(`
        id,
        nama,
        lokasi,
        tahun,
        sumber_dana,
        anggaran,
        progres,
        status,
        deskripsi,
        gambar_url,
        aktif,
        urutan,
        created_at,
        updated_at
      `)
      .order('tahun', {
        ascending: false,
      })
      .order('urutan', {
        ascending: true,
      })
      .order('created_at', {
        ascending: false,
      }),
  ]);

  if (proyekResult.error) {
    console.error(
      'Gagal mengambil proyek pembangunan:',
      {
        message:
          proyekResult.error.message,

        code:
          proyekResult.error.code,

        details:
          proyekResult.error.details,

        hint:
          proyekResult.error.hint,
      }
    );
  }

  const daftarProyek = (
    proyekResult.data ?? []
  )
    .map(normalizeProyek)
    .filter(
      (
        item
      ): item is ProyekPembangunanAdmin =>
        item !== null
    );

  const daftarAktif =
    daftarProyek.filter(
      (item) => item.aktif
    );

  const jumlahBerjalan =
    daftarProyek.filter(
      (item) =>
        item.status === 'Berjalan'
    ).length;

  const jumlahSelesai =
    daftarProyek.filter(
      (item) =>
        item.status === 'Selesai'
    ).length;

  const totalAnggaran =
    daftarProyek.reduce(
      (total, item) =>
        total + item.anggaran,
      0
    );

  const rataRataProgres =
    daftarProyek.length > 0
      ? Math.round(
          daftarProyek.reduce(
            (total, item) =>
              total + item.progres,
            0
          ) /
            daftarProyek.length
        )
      : 0;

  const tahunSekarang =
    new Date().getFullYear();

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 px-6 py-8 text-white shadow-xl sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.14) 1.5px, transparent 1.5px)',

            backgroundSize:
              '26px 26px',
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[52px] border-white/[0.05]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-emerald-300/10 blur-[100px]"
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur">
              <HardHat size={28} />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                Program dan Infrastruktur
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                Kelola Pembangunan Desa
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                Kelola nama kegiatan,
                lokasi, anggaran,
                progres, status
                pelaksanaan, dan
                dokumentasi proyek
                pembangunan Desa Keji.
              </p>
            </div>
          </div>

          <Link
            href="/pembangunan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/15"
          >
            Lihat Halaman Publik

            <ExternalLink size={16} />
          </Link>
        </div>
      </section>

      {/* Pesan sukses */}
      {params.success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0"
          />

          <p className="text-sm font-semibold leading-6">
            {params.success}
          </p>
        </div>
      )}

      {/* Pesan error */}
      {params.error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <p className="text-sm font-semibold leading-6">
            {params.error}
          </p>
        </div>
      )}

      {/* Error database */}
      {proyekResult.error && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="text-sm font-extrabold">
              Data pembangunan gagal
              dimuat
            </p>

            <p className="mt-1 text-xs font-semibold leading-5">
              Pastikan tabel
              proyek_pembangunan sudah
              tersedia dan konfigurasi
              Supabase benar.
            </p>
          </div>
        </div>
      )}

      {/* Statistik */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Proyek"
          value={formatAngka(
            daftarProyek.length
          )}
          description={`${daftarAktif.length} proyek dipublikasikan`}
          icon={Building2}
        />

        <StatCard
          label="Proyek Berjalan"
          value={formatAngka(
            jumlahBerjalan
          )}
          description={`${jumlahSelesai} proyek telah selesai`}
          icon={HardHat}
        />

        <StatCard
          label="Total Anggaran"
          value={formatRupiah(
            totalAnggaran
          )}
          description="Akumulasi seluruh proyek"
          icon={CircleDollarSign}
          compact
        />

        <StatCard
          label="Rata-rata Progres"
          value={`${rataRataProgres}%`}
          description="Berdasarkan seluruh proyek"
          icon={TrendingUp}
        />
      </section>

      {/* Tambah proyek */}
      <form
        id="tambah-pembangunan"
        action={
          tambahProyekPembangunanAction
        }
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <SectionHeader
          eyebrow="Data Baru"
          title="Tambah Proyek Pembangunan"
          description="Masukkan informasi proyek pembangunan dan unggah dokumentasi dari perangkat."
          icon={FilePlus2}
        />

        <div className="grid gap-5 p-6 sm:p-7 md:grid-cols-2">
          <div className="md:col-span-2">
            <TextInput
              idPrefix="tambah"
              name="nama"
              label="Nama Proyek"
              placeholder="Contoh: Pembangunan Jalan Lingkungan"
            />
          </div>

          <TextInput
            idPrefix="tambah"
            name="lokasi"
            label="Lokasi"
            placeholder="Contoh: Dusun Suruhan"
          />

          <TextInput
            idPrefix="tambah"
            name="sumber_dana"
            label="Sumber Dana"
            placeholder="Contoh: Dana Desa"
          />

          <NumberInput
            idPrefix="tambah"
            name="tahun"
            label="Tahun"
            value={String(
              tahunSekarang
            )}
            min={1900}
            max={2200}
            step="1"
          />

          <NumberInput
            idPrefix="tambah"
            name="anggaran"
            label="Anggaran"
            value="0"
            min={0}
            step="1"
            placeholder="Contoh: 100000000"
          />

          <NumberInput
            idPrefix="tambah"
            name="progres"
            label="Progres"
            value="0"
            min={0}
            max={100}
            step="1"
            suffix="%"
          />

          <StatusSelect
            idPrefix="tambah"
            value="Perencanaan"
          />

          <NumberInput
            idPrefix="tambah"
            name="urutan"
            label="Nomor Urutan"
            value={String(
              daftarProyek.length + 1
            )}
            min={0}
            step="1"
          />

          <Checkbox
            id="tambah-aktif"
            name="aktif"
            label="Publikasikan Proyek"
            description="Proyek akan ditampilkan pada halaman publik Pembangunan."
            checked
          />

          <div className="md:col-span-2">
            <TextArea
              idPrefix="tambah"
              name="deskripsi"
              label="Deskripsi Proyek"
              placeholder="Masukkan penjelasan mengenai tujuan, ruang lingkup, dan hasil proyek pembangunan."
            />
          </div>

          <div className="md:col-span-2">
            <FileInput
              id="tambah-gambar"
              name="gambar"
              label="Gambar Proyek"
              required={false}
            />
          </div>

          <div className="flex justify-end md:col-span-2">
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800 sm:w-auto"
            >
              <Save size={17} />

              Tambah Proyek
            </button>
          </div>
        </div>
      </form>

      {/* Daftar proyek */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <SectionHeader
          eyebrow="Daftar Pembangunan"
          title="Proyek Pembangunan Desa"
          description={`${daftarProyek.length} proyek tersimpan di database.`}
          icon={Building2}
          variant="slate"
        />

        {daftarProyek.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-5 p-5 sm:p-7 xl:grid-cols-2">
            {daftarProyek.map(
              (proyek) => (
                <ProyekCard
                  key={proyek.id}
                  proyek={proyek}
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function ProyekCard({
  proyek,
}: {
  proyek: ProyekPembangunanAdmin;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
      {/* Gambar */}
      <div className="relative h-56 overflow-hidden bg-slate-200">
        {proyek.gambar_url ? (
          <img
            src={proyek.gambar_url}
            alt={`Dokumentasi ${proyek.nama}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-400">
            <ImageIcon size={44} />

            <p className="mt-3 text-xs font-extrabold uppercase tracking-wider">
              Belum ada gambar
            </p>
          </div>
        )}

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span
            className={`rounded-full border px-3 py-1.5 text-[10px] font-extrabold backdrop-blur ${getStatusClass(
              proyek.status
            )}`}
          >
            {proyek.status}
          </span>

          <span
            className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold backdrop-blur ${
              proyek.aktif
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-800 text-white'
            }`}
          >
            {proyek.aktif
              ? 'Dipublikasikan'
              : 'Disembunyikan'}
          </span>
        </div>

        <span className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-extrabold text-white backdrop-blur">
          Urutan {proyek.urutan}
        </span>
      </div>

      {/* Isi */}
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
              Tahun {proyek.tahun}
            </p>

            <h3 className="mt-2 break-words text-xl font-black leading-7 text-slate-900">
              {proyek.nama}
            </h3>

            <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} />

                {proyek.lokasi}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Banknote size={14} />

                {proyek.sumber_dana}
              </span>
            </div>
          </div>

          <div className="shrink-0 rounded-2xl bg-emerald-700 px-4 py-3 text-right text-white">
            <p className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-200">
              Anggaran
            </p>

            <p className="mt-1 text-sm font-black">
              {formatRupiah(
                proyek.anggaran
              )}
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm font-medium leading-7 text-slate-600">
          {proyek.deskripsi}
        </p>

        {/* Progres */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Progres Pembangunan
            </p>

            <p className="text-sm font-black text-slate-900">
              {proyek.progres}%
            </p>
          </div>

          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all ${getProgressClass(
                proyek.progres
              )}`}
              style={{
                width: `${Math.min(
                  Math.max(
                    proyek.progres,
                    0
                  ),
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        <p className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
          <CalendarDays size={14} />

          Diperbarui{' '}
          {formatTanggal(
            proyek.updated_at
          )}
        </p>
      </div>

      {/* Aksi */}
      <div className="grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-4">
        <form
          action={
            toggleAktifProyekPembangunanAction
          }
        >
          <input
            type="hidden"
            name="id"
            value={proyek.id}
          />

          <input
            type="hidden"
            name="aktif"
            value={String(
              !proyek.aktif
            )}
          />

          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-amber-100 px-3 text-xs font-extrabold text-amber-700 transition hover:bg-amber-200"
          >
            {proyek.aktif ? (
              <EyeOff size={15} />
            ) : (
              <Eye size={15} />
            )}

            {proyek.aktif
              ? 'Sembunyikan'
              : 'Publikasikan'}
          </button>
        </form>

        <form
          action={
            hapusProyekPembangunanAction
          }
        >
          <input
            type="hidden"
            name="id"
            value={proyek.id}
          />

          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-red-100 px-3 text-xs font-extrabold text-red-700 transition hover:bg-red-200"
          >
            <Trash2 size={15} />

            Hapus
          </button>
        </form>
      </div>

      {/* Edit proyek */}
      <details className="border-t border-slate-200 bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-center gap-2 p-4 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50">
          <Pencil size={16} />

          Edit Proyek
        </summary>

        <form
          action={
            ubahProyekPembangunanAction
          }
          className="grid gap-5 border-t border-slate-200 p-5 md:grid-cols-2"
        >
          <input
            type="hidden"
            name="id"
            value={proyek.id}
          />

          <div className="md:col-span-2">
            <TextInput
              idPrefix={`edit-${proyek.id}`}
              name="nama"
              label="Nama Proyek"
              value={proyek.nama}
            />
          </div>

          <TextInput
            idPrefix={`edit-${proyek.id}`}
            name="lokasi"
            label="Lokasi"
            value={proyek.lokasi}
          />

          <TextInput
            idPrefix={`edit-${proyek.id}`}
            name="sumber_dana"
            label="Sumber Dana"
            value={proyek.sumber_dana}
          />

          <NumberInput
            idPrefix={`edit-${proyek.id}`}
            name="tahun"
            label="Tahun"
            value={String(
              proyek.tahun
            )}
            min={1900}
            max={2200}
            step="1"
          />

          <NumberInput
            idPrefix={`edit-${proyek.id}`}
            name="anggaran"
            label="Anggaran"
            value={String(
              proyek.anggaran
            )}
            min={0}
            step="1"
          />

          <NumberInput
            idPrefix={`edit-${proyek.id}`}
            name="progres"
            label="Progres"
            value={String(
              proyek.progres
            )}
            min={0}
            max={100}
            step="1"
            suffix="%"
          />

          <StatusSelect
            idPrefix={`edit-${proyek.id}`}
            value={proyek.status}
          />

          <NumberInput
            idPrefix={`edit-${proyek.id}`}
            name="urutan"
            label="Nomor Urutan"
            value={String(
              proyek.urutan
            )}
            min={0}
            step="1"
          />

          <Checkbox
            id={`edit-${proyek.id}-aktif`}
            name="aktif"
            label="Publikasikan Proyek"
            description="Tampilkan proyek pada halaman publik."
            checked={proyek.aktif}
          />

          <div className="md:col-span-2">
            <TextArea
              idPrefix={`edit-${proyek.id}`}
              name="deskripsi"
              label="Deskripsi Proyek"
              value={proyek.deskripsi}
            />
          </div>

          <div className="md:col-span-2">
            <FileInput
              id={`edit-${proyek.id}-gambar`}
              name="gambar"
              label="Ganti Gambar Proyek"
              description="Kosongkan bila gambar lama tetap digunakan."
              required={false}
            />
          </div>

          {proyek.gambar_url && (
            <div className="md:col-span-2">
              <Checkbox
                id={`edit-${proyek.id}-hapus-gambar`}
                name="hapus_gambar"
                label="Hapus Gambar Lama"
                description="Centang untuk menghapus gambar tanpa menggantinya."
                checked={false}
                variant="danger"
              />
            </div>
          )}

          <div className="flex justify-end md:col-span-2">
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-6 text-sm font-extrabold text-white transition hover:bg-slate-900 sm:w-auto"
            >
              <Save size={17} />

              Simpan Perubahan
            </button>
          </div>
        </form>
      </details>
    </article>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  variant = 'emerald',
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  variant?: 'emerald' | 'slate';
}) {
  const iconClass =
    variant === 'emerald'
      ? 'bg-emerald-700'
      : 'bg-slate-800';

  return (
    <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white px-6 py-5 sm:px-7">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white ${iconClass}`}
        >
          <Icon size={23} />
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
            {eyebrow}
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  compact = false,
}: {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  compact?: boolean;
}) {
  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p
            className={`mt-3 break-words font-black text-slate-900 ${
              compact
                ? 'text-xl leading-7'
                : 'text-4xl'
            }`}
          >
            {value}
          </p>

          <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Icon size={22} />
        </div>
      </div>
    </article>
  );
}

function TextInput({
  idPrefix,
  name,
  label,
  value = '',
  placeholder,
}: {
  idPrefix: string;
  name: string;
  label: string;
  value?: string;
  placeholder?: string;
}) {
  const id = `${idPrefix}-${name}`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
      >
        {label}

        <span className="ml-1 text-red-500">
          *
        </span>
      </label>

      <input
        id={id}
        name={name}
        type="text"
        required
        defaultValue={value}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}

function NumberInput({
  idPrefix,
  name,
  label,
  value,
  min,
  max,
  step,
  placeholder,
  suffix,
}: {
  idPrefix: string;
  name: string;
  label: string;
  value: string;
  min: number;
  max?: number;
  step: string;
  placeholder?: string;
  suffix?: string;
}) {
  const id = `${idPrefix}-${name}`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
      >
        {label}

        <span className="ml-1 text-red-500">
          *
        </span>
      </label>

      <div className="relative">
        <input
          id={id}
          name={name}
          type="number"
          required
          min={min}
          max={max}
          step={step}
          defaultValue={value}
          placeholder={placeholder}
          className={`h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 ${
            suffix ? 'pr-11' : ''
          }`}
        />

        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-extrabold text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function StatusSelect({
  idPrefix,
  value,
}: {
  idPrefix: string;
  value: StatusPembangunan;
}) {
  const id = `${idPrefix}-status`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
      >
        Status Pembangunan

        <span className="ml-1 text-red-500">
          *
        </span>
      </label>

      <select
        id={id}
        name="status"
        required
        defaultValue={value}
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      >
        {STATUS_PEMBANGUNAN_OPTIONS.map(
          (status) => (
            <option
              key={status}
              value={status}
            >
              {status}
            </option>
          )
        )}
      </select>
    </div>
  );
}

function TextArea({
  idPrefix,
  name,
  label,
  value = '',
  placeholder,
}: {
  idPrefix: string;
  name: string;
  label: string;
  value?: string;
  placeholder?: string;
}) {
  const id = `${idPrefix}-${name}`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
      >
        {label}

        <span className="ml-1 text-red-500">
          *
        </span>
      </label>

      <textarea
        id={id}
        name={name}
        rows={5}
        required
        defaultValue={value}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-7 text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}

function FileInput({
  id,
  name,
  label,
  description = 'Format JPG, PNG, atau WebP. Ukuran maksimal 5 MB.',
  required,
}: {
  id: string;
  name: string;
  label: string;
  description?: string;
  required: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <label
        htmlFor={id}
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-emerald-400 hover:bg-emerald-50"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
          <Upload size={22} />
        </div>

        <p className="mt-4 text-sm font-extrabold text-slate-700">
          Pilih gambar dari perangkat
        </p>

        <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
          {description}
        </p>

        <input
          id={id}
          name={name}
          type="file"
          required={required}
          accept="image/jpeg,image/png,image/webp"
          className="mt-5 block w-full max-w-md text-xs font-semibold text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-700 file:px-4 file:py-2.5 file:text-xs file:font-extrabold file:text-white hover:file:bg-emerald-800"
        />
      </label>
    </div>
  );
}

function Checkbox({
  id,
  name,
  label,
  description,
  checked,
  variant = 'default',
}: {
  id: string;
  name: string;
  label: string;
  description: string;
  checked: boolean;
  variant?: 'default' | 'danger';
}) {
  const styles =
    variant === 'danger'
      ? 'border-red-200 bg-red-50'
      : 'border-slate-200 bg-slate-50';

  const iconStyles =
    variant === 'danger'
      ? 'accent-red-600'
      : 'accent-emerald-700';

  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 ${styles}`}
    >
      <input
        id={id}
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={checked}
        className={`mt-1 h-4 w-4 shrink-0 ${iconStyles}`}
      />

      <span>
        <span
          className={`block text-sm font-extrabold ${
            variant === 'danger'
              ? 'text-red-800'
              : 'text-slate-700'
          }`}
        >
          {label}
        </span>

        <span
          className={`mt-1 block text-xs font-medium leading-5 ${
            variant === 'danger'
              ? 'text-red-600'
              : 'text-slate-500'
          }`}
        >
          {description}
        </span>
      </span>
    </label>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <HardHat size={30} />
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-800">
        Belum ada proyek pembangunan
      </h3>

      <p className="mx-auto mt-2 max-w-lg text-sm font-medium leading-6 text-slate-500">
        Tambahkan proyek melalui
        formulir di atas agar data dapat
        dikelola dan dipublikasikan.
      </p>
    </div>
  );
}