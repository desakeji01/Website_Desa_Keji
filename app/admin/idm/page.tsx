// app/admin/idm/page.tsx

import Link from 'next/link';

import {
  Activity,
  AlertCircle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Gauge,
  Pencil,
  PlusCircle,
  Save,
  Trash2,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

import {
  hapusRiwayatIdmAction,
  tambahRiwayatIdmAction,
  toggleAktifRiwayatIdmAction,
  ubahRiwayatIdmAction,
} from '@/app/admin/idm/actions';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import {
  STATUS_IDM_OPTIONS,
  type StatusIdm,
} from '@/types/idm';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
}

interface RiwayatIdmAdmin {
  id: string;
  tahun: number;
  nilai: number;
  status: StatusIdm;
  keterangan: string | null;
  aktif: boolean;
  created_at: string;
  updated_at: string;
}

function safeString(
  value: unknown
) {
  return String(
    value ?? ''
  ).trim();
}

function isStatusIdm(
  value: string
): value is StatusIdm {
  return (
    STATUS_IDM_OPTIONS as readonly string[]
  ).includes(value);
}

function normalizeRiwayatIdm(
  value: unknown
): RiwayatIdmAdmin | null {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return null;
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  const id =
    safeString(row.id);

  const tahun =
    Number(row.tahun);

  const nilai =
    Number(row.nilai);

  const status =
    safeString(row.status);

  if (
    !id ||
    !Number.isInteger(tahun) ||
    !Number.isFinite(nilai) ||
    !isStatusIdm(status)
  ) {
    return null;
  }

  return {
    id,
    tahun,
    nilai,
    status,

    keterangan:
      row.keterangan === null ||
      row.keterangan === undefined
        ? null
        : safeString(
            row.keterangan
          ),

    aktif:
      Boolean(row.aktif),

    created_at:
      safeString(
        row.created_at
      ),

    updated_at:
      safeString(
        row.updated_at
      ),
  };
}

function formatNilai(
  value: number
) {
  return new Intl.NumberFormat(
    'id-ID',
    {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }
  ).format(value);
}

function formatTanggal(
  value: string
) {
  if (!value) {
    return 'Belum diperbarui';
  }

  const date =
    new Date(value);

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
      timeZone:
        'Asia/Jakarta',
    }
  ).format(date);
}

function getStatusClass(
  status: StatusIdm
) {
  switch (status) {
    case 'Mandiri':
      return 'bg-emerald-100 text-emerald-700';

    case 'Maju':
      return 'bg-cyan-100 text-cyan-700';

    case 'Berkembang':
      return 'bg-blue-100 text-blue-700';

    case 'Tertinggal':
      return 'bg-amber-100 text-amber-700';

    case 'Sangat Tertinggal':
      return 'bg-red-100 text-red-700';

    default:
      return 'bg-slate-100 text-slate-700';
  }
}

export default async function AdminIdmPage({
  searchParams,
}: PageProps) {
  const [
    params,
    riwayatResult,
  ] = await Promise.all([
    searchParams,

    supabaseAdmin
      .from('idm_riwayat')
      .select(`
        id,
        tahun,
        nilai,
        status,
        keterangan,
        aktif,
        created_at,
        updated_at
      `)
      .order(
        'tahun',
        {
          ascending: false,
        }
      )
      .order(
        'created_at',
        {
          ascending: false,
        }
      ),
  ]);

  if (riwayatResult.error) {
    console.error(
      'Gagal mengambil riwayat IDM:',
      {
        message:
          riwayatResult.error
            .message,

        code:
          riwayatResult.error
            .code,

        details:
          riwayatResult.error
            .details,

        hint:
          riwayatResult.error
            .hint,
      }
    );
  }

  const daftarRiwayat =
    (
      riwayatResult.data ??
      []
    )
      .map(
        normalizeRiwayatIdm
      )
      .filter(
        (
          item
        ): item is RiwayatIdmAdmin =>
          item !== null
      );

  const daftarAktif =
    daftarRiwayat.filter(
      (item) =>
        item.aktif
    );

  const dataTerbaru =
    daftarAktif[0] ??
    daftarRiwayat[0] ??
    null;

  const nilaiTertinggi =
    daftarAktif.length > 0
      ? Math.max(
          ...daftarAktif.map(
            (item) =>
              item.nilai
          )
        )
      : 0;

  const tahunSekarang =
    new Date()
      .getFullYear();

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 px-6 py-8 text-white shadow-xl">
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

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <Gauge
                size={28}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                Indeks Desa
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                Indeks Desa Membangun
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                Kelola nilai, status,
                riwayat tahunan, dan
                publikasi data Indeks
                Desa Membangun Desa
                Keji.
              </p>
            </div>
          </div>

          <Link
            href="/idm"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white transition hover:bg-white/15"
          >
            Lihat Halaman IDM

            <ExternalLink
              size={16}
            />
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

      {/* Statistik */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Riwayat"
          value={String(
            daftarRiwayat.length
          )}
          description="Data tahun tersimpan"
          icon={BarChart3}
        />

        <StatCard
          label="Data Aktif"
          value={String(
            daftarAktif.length
          )}
          description="Ditampilkan di publik"
          icon={Eye}
        />

        <StatCard
          label="Nilai Terbaru"
          value={
            dataTerbaru
              ? formatNilai(
                  dataTerbaru.nilai
                )
              : '-'
          }
          description={
            dataTerbaru
              ? `Tahun ${dataTerbaru.tahun}`
              : 'Belum ada data'
          }
          icon={Activity}
          compact
        />

        <StatCard
          label="Nilai Tertinggi"
          value={
            daftarAktif.length >
            0
              ? formatNilai(
                  nilaiTertinggi
                )
              : '-'
          }
          description="Berdasarkan data aktif"
          icon={TrendingUp}
          compact
        />
      </section>

      {/* Tambah data */}
      <form
        id="tambah-idm"
        action={
          tambahRiwayatIdmAction
        }
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <SectionHeader
          eyebrow="Data Baru"
          title="Tambah Riwayat IDM"
          description="Masukkan nilai dan status IDM untuk tahun tertentu."
          icon={PlusCircle}
        />

        <div className="grid gap-5 p-6 sm:p-7 md:grid-cols-2">
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
            name="nilai"
            label="Nilai IDM"
            value=""
            min={0}
            max={1}
            step="0.0001"
            placeholder="Contoh: 0.8152"
          />

          <StatusSelect
            idPrefix="tambah"
            value={
              STATUS_IDM_OPTIONS[0]
            }
          />

          <Checkbox
            id="tambah-aktif"
            name="aktif"
            label="Publikasikan Data"
            description="Data akan ditampilkan pada halaman publik IDM."
            checked
          />

          <div className="md:col-span-2">
            <TextArea
              idPrefix="tambah"
              name="keterangan"
              label="Keterangan"
              value=""
              placeholder="Masukkan catatan atau keterangan mengenai status IDM."
              required={false}
            />
          </div>

          <div className="flex justify-end md:col-span-2">
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800 sm:w-auto"
            >
              <Save
                size={17}
              />

              Tambah Data IDM
            </button>
          </div>
        </div>
      </form>

      {/* Daftar data */}
      <section
        id="riwayat-idm"
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <SectionHeader
          eyebrow="Riwayat Tahunan"
          title="Data Indeks Desa Membangun"
          description={`${daftarRiwayat.length} data tersimpan dalam database.`}
          icon={FileText}
          variant="slate"
        />

        {daftarRiwayat.length ===
        0 ? (
          <div className="px-6 py-16 text-center">
            <Gauge
              size={48}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-black text-slate-700">
              Belum ada data IDM
            </h3>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Tambahkan data melalui
              formulir di atas.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 p-5 sm:p-7 xl:grid-cols-2">
            {daftarRiwayat.map(
              (item) => (
                <IdmCard
                  key={item.id}
                  item={item}
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function IdmCard({
  item,
}: {
  item: RiwayatIdmAdmin;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold ${getStatusClass(
                  item.status
                )}`}
              >
                {item.status}
              </span>

              <span
                className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold ${
                  item.aktif
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {item.aktif
                  ? 'Dipublikasikan'
                  : 'Disembunyikan'}
              </span>
            </div>

            <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
              Tahun IDM
            </p>

            <h3 className="mt-1 text-3xl font-black text-slate-900">
              {item.tahun}
            </h3>
          </div>

          <div className="rounded-2xl bg-emerald-700 px-5 py-4 text-right text-white">
            <p className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-200">
              Nilai IDM
            </p>

            <p className="mt-1 text-2xl font-black">
              {formatNilai(
                item.nilai
              )}
            </p>
          </div>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400"
            style={{
              width:
                `${Math.min(
                  Math.max(
                    item.nilai *
                      100,
                    0
                  ),
                  100
                )}%`,
            }}
          />
        </div>

        <div className="mt-5 rounded-2xl bg-white p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
            Keterangan
          </p>

          <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
            {item.keterangan ||
              'Belum ada keterangan tambahan.'}
          </p>
        </div>

        <p className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
          <CalendarDays
            size={14}
          />

          Diperbarui{' '}
          {formatTanggal(
            item.updated_at
          )}
        </p>
      </div>

      {/* Tombol aksi */}
      <div className="grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-4">
        <form
          action={
            toggleAktifRiwayatIdmAction
          }
        >
          <input
            type="hidden"
            name="id"
            value={item.id}
          />

          <input
            type="hidden"
            name="aktif"
            value={String(
              !item.aktif
            )}
          />

          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-amber-100 px-3 text-xs font-extrabold text-amber-700 transition hover:bg-amber-200"
          >
            {item.aktif ? (
              <EyeOff
                size={15}
              />
            ) : (
              <Eye
                size={15}
              />
            )}

            {item.aktif
              ? 'Sembunyikan'
              : 'Publikasikan'}
          </button>
        </form>

        <form
          action={
            hapusRiwayatIdmAction
          }
        >
          <input
            type="hidden"
            name="id"
            value={item.id}
          />

          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-red-100 px-3 text-xs font-extrabold text-red-700 transition hover:bg-red-200"
          >
            <Trash2
              size={15}
            />

            Hapus
          </button>
        </form>
      </div>

      {/* Edit */}
      <details className="border-t border-slate-200 bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-center gap-2 p-4 text-sm font-extrabold text-slate-700">
          <Pencil
            size={16}
          />

          Edit Data IDM
        </summary>

        <form
          action={
            ubahRiwayatIdmAction
          }
          className="grid gap-5 border-t border-slate-200 p-5 md:grid-cols-2"
        >
          <input
            type="hidden"
            name="id"
            value={item.id}
          />

          <NumberInput
            idPrefix={`edit-${item.id}`}
            name="tahun"
            label="Tahun"
            value={String(
              item.tahun
            )}
            min={1900}
            max={2200}
            step="1"
          />

          <NumberInput
            idPrefix={`edit-${item.id}`}
            name="nilai"
            label="Nilai IDM"
            value={String(
              item.nilai
            )}
            min={0}
            max={1}
            step="0.0001"
          />

          <StatusSelect
            idPrefix={`edit-${item.id}`}
            value={item.status}
          />

          <Checkbox
            id={`edit-${item.id}-aktif`}
            name="aktif"
            label="Publikasikan Data"
            description="Data ditampilkan pada halaman publik."
            checked={item.aktif}
          />

          <div className="md:col-span-2">
            <TextArea
              idPrefix={`edit-${item.id}`}
              name="keterangan"
              label="Keterangan"
              value={
                item.keterangan ??
                ''
              }
              required={false}
            />
          </div>

          <div className="flex justify-end md:col-span-2">
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-6 text-sm font-extrabold text-white transition hover:bg-slate-900 sm:w-auto"
            >
              <Save
                size={17}
              />

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
  variant?:
    | 'emerald'
    | 'slate';
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
          <Icon
            size={23}
          />
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
            {eyebrow}
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-500">
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
                ? 'text-2xl'
                : 'text-4xl'
            }`}
          >
            {value}
          </p>

          <p className="mt-2 text-xs font-semibold text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Icon
            size={22}
          />
        </div>
      </div>
    </article>
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
}: {
  idPrefix: string;
  name: string;
  label: string;
  value: string;
  min: number;
  max?: number;
  step: string;
  placeholder?: string;
}) {
  const id =
    `${idPrefix}-${name}`;

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
        type="number"
        required
        min={min}
        max={max}
        step={step}
        defaultValue={value}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}

function StatusSelect({
  idPrefix,
  value,
}: {
  idPrefix: string;
  value: StatusIdm;
}) {
  const id =
    `${idPrefix}-status`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
      >
        Status IDM

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
        {STATUS_IDM_OPTIONS.map(
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
  value,
  placeholder,
  required = true,
}: {
  idPrefix: string;
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
}) {
  const id =
    `${idPrefix}-${name}`;

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

      <textarea
        id={id}
        name={name}
        rows={4}
        required={required}
        defaultValue={value}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-7 text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}

function Checkbox({
  id,
  name,
  label,
  description,
  checked,
}: {
  id: string;
  name: string;
  label: string;
  description: string;
  checked: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
    >
      <input
        id={id}
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={checked}
        className="mt-1 h-4 w-4 shrink-0 accent-emerald-700"
      />

      <span>
        <span className="block text-sm font-extrabold text-slate-700">
          {label}
        </span>

        <span className="mt-1 block text-xs font-medium leading-5 text-slate-500">
          {description}
        </span>
      </span>
    </label>
  );
}