// app/admin/desa-wisata/panduan-pelayanan/page.tsx

import Link from 'next/link';

import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Image as ImageIcon,
  Pencil,
  Power,
  Save,
  Trash2,
  Upload,
  type LucideIcon,
} from 'lucide-react';

import {
  hapusPanduanPelayananAction,
  tambahPanduanPelayananAction,
  togglePanduanPelayananAction,
  ubahPanduanPelayananAction,
} from '@/app/admin/desa-wisata/panduan-pelayanan/actions';

import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

const JENIS_DOKUMEN =
  'hospitality-pocket-book';

interface PageProps {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
}

interface PanduanPelayananAdmin {
  id: string;
  judul: string;
  slug: string;
  deskripsi: string;
  penyusun: string;
  tahun: number | null;
  jumlah_halaman: number | null;
  file_url: string;
  file_path: string;
  cover_url: string | null;
  cover_path: string | null;
  urutan: number;
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

function normalizePanduan(
  value: unknown
): PanduanPelayananAdmin | null {
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

  const judul =
    safeString(row.judul);

  const slug =
    safeString(row.slug);

  const deskripsi =
    safeString(
      row.deskripsi
    );

  const penyusun =
    safeString(
      row.penyusun
    );

  const fileUrl =
    safeString(
      row.file_url
    );

  const filePath =
    safeString(
      row.file_path
    );

  const tahun =
    row.tahun === null ||
    row.tahun === undefined
      ? null
      : Number(row.tahun);

  const jumlahHalaman =
    row.jumlah_halaman === null ||
    row.jumlah_halaman ===
      undefined
      ? null
      : Number(
          row.jumlah_halaman
        );

  const urutan =
    Number(
      row.urutan ?? 0
    );

  if (
    !id ||
    !judul ||
    !slug ||
    !deskripsi ||
    !penyusun ||
    !fileUrl ||
    !filePath ||
    !Number.isInteger(urutan)
  ) {
    return null;
  }

  const coverUrl =
    safeString(
      row.cover_url
    );

  const coverPath =
    safeString(
      row.cover_path
    );

  return {
    id,
    judul,
    slug,
    deskripsi,
    penyusun,

    tahun:
      tahun !== null &&
      Number.isInteger(tahun)
        ? tahun
        : null,

    jumlah_halaman:
      jumlahHalaman !== null &&
      Number.isInteger(
        jumlahHalaman
      )
        ? jumlahHalaman
        : null,

    file_url: fileUrl,
    file_path: filePath,

    cover_url:
      coverUrl || null,

    cover_path:
      coverPath || null,

    urutan,
    aktif: Boolean(row.aktif),

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

export default async function AdminPanduanPelayananPage({
  searchParams,
}: PageProps) {
  const [
    params,
    panduanResult,
  ] = await Promise.all([
    searchParams,

    supabaseAdmin
      .from(
        'desa_wisata_dokumen'
      )
      .select(`
        id,
        judul,
        slug,
        deskripsi,
        penyusun,
        tahun,
        jumlah_halaman,
        file_url,
        file_path,
        cover_url,
        cover_path,
        urutan,
        aktif,
        created_at,
        updated_at
      `)
      .eq(
        'jenis',
        JENIS_DOKUMEN
      )
      .order('urutan', {
        ascending: true,
      })
      .order('tahun', {
        ascending: false,
        nullsFirst: false,
      })
      .order('created_at', {
        ascending: false,
      }),
  ]);

  if (panduanResult.error) {
    console.error(
      'Gagal mengambil Hospitality Pocket Book:',
      {
        message:
          panduanResult.error.message,

        code:
          panduanResult.error.code,

        details:
          panduanResult.error.details,

        hint:
          panduanResult.error.hint,
      }
    );
  }

  const daftarPanduan =
    (
      panduanResult.data ?? []
    )
      .map(normalizePanduan)
      .filter(
        (
          item
        ): item is PanduanPelayananAdmin =>
          item !== null
      );

  const jumlahAktif =
    daftarPanduan.filter(
      (item) => item.aktif
    ).length;

  const jumlahNonaktif =
    daftarPanduan.length -
    jumlahAktif;

  const totalHalaman =
    daftarPanduan.reduce(
      (total, item) =>
        total +
        (
          item.jumlah_halaman ??
          0
        ),
      0
    );

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

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[52px] border-white/[0.05]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <BookOpen size={28} />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                Desa Wisata Keji
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                Panduan Pelayanan Wisata
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                Kelola Hospitality
                Pocket Book, cover,
                identitas penyusun,
                informasi penerbitan,
                dan file PDF panduan
                pelayanan wisata Desa
                Keji.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/desa-wisata"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white transition hover:bg-white/15"
            >
              Kelola Desa Wisata
            </Link>

            <Link
              href="/desa-wisata/panduan-pelayanan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-900 transition hover:bg-emerald-50"
            >
              Lihat Publik

              <ExternalLink
                size={16}
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Pesan */}
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

      {panduanResult.error && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="text-sm font-extrabold">
              Data buku gagal dimuat
            </p>

            <p className="mt-1 text-xs font-semibold leading-5">
              Pastikan tabel
              desa_wisata_dokumen dan
              Storage bucket sudah
              dibuat.
            </p>
          </div>
        </div>
      )}

      {/* Statistik */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Buku"
          value={
            daftarPanduan.length
          }
          description="Seluruh buku tersimpan"
          icon={BookOpen}
        />

        <StatCard
          label="Buku Aktif"
          value={jumlahAktif}
          description="Tampil pada halaman publik"
          icon={Eye}
        />

        <StatCard
          label="Buku Nonaktif"
          value={jumlahNonaktif}
          description="Disembunyikan dari publik"
          icon={EyeOff}
        />

        <StatCard
          label="Total Halaman"
          value={totalHalaman}
          description="Akumulasi halaman buku"
          icon={FileText}
        />
      </section>

      {/* Tambah buku */}
      <form
        id="tambah-buku"
        action={
          tambahPanduanPelayananAction
        }
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <SectionHeader
          eyebrow="Pocket Book Baru"
          title="Tambah Hospitality Pocket Book"
          description="Unggah file PDF, cover, dan informasi penerbitan buku."
          icon={BookOpen}
        />

        <div className="grid gap-5 p-6 sm:p-7 md:grid-cols-2">
          <div className="md:col-span-2">
            <TextInput
              idPrefix="tambah"
              name="judul"
              label="Judul Buku"
              value="Hospitality Pocket Book Desa Wisata Keji"
              placeholder="Masukkan judul buku"
            />
          </div>

          <TextInput
            idPrefix="tambah"
            name="penyusun"
            label="Penyusun"
            value="Najwaa"
            placeholder="Masukkan nama penyusun"
          />

          <NumberInput
            idPrefix="tambah"
            name="tahun"
            label="Tahun Terbit"
            value={String(
              tahunSekarang
            )}
            min={1900}
            max={2200}
            required={false}
          />

          <NumberInput
            idPrefix="tambah"
            name="jumlah_halaman"
            label="Jumlah Halaman"
            value=""
            min={1}
            required={false}
          />

          <NumberInput
            idPrefix="tambah"
            name="urutan"
            label="Nomor Urutan"
            value={String(
              daftarPanduan.length + 1
            )}
            min={0}
          />

          <div className="md:col-span-2">
            <TextArea
              idPrefix="tambah"
              name="deskripsi"
              label="Deskripsi Buku"
              placeholder="Panduan pelayanan wisata bagi pelaku wisata Desa Keji dalam menyambut dan melayani wisatawan."
            />
          </div>

          <div className="md:col-span-2">
            <FileInput
              id="tambah-file-pdf"
              name="file_pdf"
              label="File PDF"
              accept="application/pdf"
              description="Format PDF dengan ukuran maksimal 25 MB."
              required
            />
          </div>

          <div className="md:col-span-2">
            <FileInput
              id="tambah-cover"
              name="cover"
              label="Cover Buku"
              accept="image/jpeg,image/png,image/webp"
              description="Format JPG, PNG, atau WebP. Ukuran maksimal 5 MB."
              required={false}
            />
          </div>

          <Checkbox
            id="tambah-aktif"
            name="aktif"
            label="Publikasikan Buku"
            description="Buku langsung ditampilkan pada halaman publik."
            checked
          />

          <div className="flex items-end justify-end">
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800 sm:w-auto"
            >
              <Save size={17} />

              Tambah Buku
            </button>
          </div>
        </div>
      </form>

      {/* Daftar buku */}
      <section
        id="daftar-buku"
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <SectionHeader
          eyebrow="Daftar Pocket Book"
          title="Hospitality Pocket Book"
          description={`${daftarPanduan.length} buku tersimpan di database.`}
          icon={BookOpen}
          variant="slate"
        />

        {daftarPanduan.length ===
        0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-5 p-5 sm:p-7 xl:grid-cols-2">
            {daftarPanduan.map(
              (panduan) => (
                <PanduanCard
                  key={panduan.id}
                  panduan={panduan}
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function PanduanCard({
  panduan,
}: {
  panduan: PanduanPelayananAdmin;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
      <div className="grid sm:grid-cols-[190px_minmax(0,1fr)]">
        <div className="relative min-h-64 overflow-hidden bg-slate-200">
          {panduan.cover_url ? (
            <img
              src={panduan.cover_url}
              alt={`Cover ${panduan.judul}`}
              loading="lazy"
              className="h-full min-h-64 w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-64 flex-col items-center justify-center p-6 text-center text-slate-400">
              <ImageIcon size={42} />

              <p className="mt-3 text-xs font-extrabold uppercase tracking-wider">
                Belum ada cover
              </p>
            </div>
          )}

          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-[10px] font-extrabold text-white ${
              panduan.aktif
                ? 'bg-emerald-700'
                : 'bg-slate-800'
            }`}
          >
            {panduan.aktif
              ? 'Aktif'
              : 'Nonaktif'}
          </span>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {panduan.tahun && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-emerald-700">
                Tahun {panduan.tahun}
              </span>
            )}

            {panduan.jumlah_halaman && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-[10px] font-extrabold text-blue-700">
                {panduan.jumlah_halaman}{' '}
                halaman
              </span>
            )}

            <span className="rounded-full bg-slate-200 px-3 py-1 text-[10px] font-extrabold text-slate-700">
              Urutan {panduan.urutan}
            </span>
          </div>

          <h3 className="mt-4 text-xl font-black leading-7 text-slate-900">
            {panduan.judul}
          </h3>

          <p className="mt-2 text-xs font-extrabold uppercase tracking-wider text-emerald-700">
            Penyusun: {panduan.penyusun}
          </p>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-500">
            {panduan.deskripsi}
          </p>

          <p className="mt-4 text-xs font-semibold text-slate-400">
            Diperbarui{' '}
            {formatTanggal(
              panduan.updated_at
            )}
          </p>

          <a
            href={panduan.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-800"
          >
            <FileText size={15} />

            Buka PDF

            <ExternalLink
              size={13}
            />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-4">
        <form
          action={
            togglePanduanPelayananAction
          }
        >
          <input
            type="hidden"
            name="id"
            value={panduan.id}
          />

          <input
            type="hidden"
            name="aktif"
            value={String(
              !panduan.aktif
            )}
          />

          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-amber-100 px-3 text-xs font-extrabold text-amber-700 transition hover:bg-amber-200"
          >
            <Power size={15} />

            {panduan.aktif
              ? 'Sembunyikan'
              : 'Publikasikan'}
          </button>
        </form>

        <form
          action={
            hapusPanduanPelayananAction
          }
        >
          <input
            type="hidden"
            name="id"
            value={panduan.id}
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

      <details className="border-t border-slate-200 bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-center gap-2 p-4 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50">
          <Pencil size={16} />

          Edit Buku
        </summary>

        <form
          action={
            ubahPanduanPelayananAction
          }
          className="grid gap-5 border-t border-slate-200 p-5 md:grid-cols-2"
        >
          <input
            type="hidden"
            name="id"
            value={panduan.id}
          />

          <div className="md:col-span-2">
            <TextInput
              idPrefix={`edit-${panduan.id}`}
              name="judul"
              label="Judul Buku"
              value={panduan.judul}
            />
          </div>

          <TextInput
            idPrefix={`edit-${panduan.id}`}
            name="penyusun"
            label="Penyusun"
            value={panduan.penyusun}
          />

          <NumberInput
            idPrefix={`edit-${panduan.id}`}
            name="tahun"
            label="Tahun Terbit"
            value={
              panduan.tahun
                ? String(panduan.tahun)
                : ''
            }
            min={1900}
            max={2200}
            required={false}
          />

          <NumberInput
            idPrefix={`edit-${panduan.id}`}
            name="jumlah_halaman"
            label="Jumlah Halaman"
            value={
              panduan.jumlah_halaman
                ? String(
                    panduan.jumlah_halaman
                  )
                : ''
            }
            min={1}
            required={false}
          />

          <NumberInput
            idPrefix={`edit-${panduan.id}`}
            name="urutan"
            label="Nomor Urutan"
            value={String(
              panduan.urutan
            )}
            min={0}
          />

          <div className="md:col-span-2">
            <TextArea
              idPrefix={`edit-${panduan.id}`}
              name="deskripsi"
              label="Deskripsi Buku"
              value={panduan.deskripsi}
            />
          </div>

          <div className="md:col-span-2">
            <FileInput
              id={`edit-${panduan.id}-file-pdf`}
              name="file_pdf"
              label="Ganti File PDF"
              accept="application/pdf"
              description="Kosongkan apabila file PDF lama tetap digunakan."
              required={false}
            />
          </div>

          <div className="md:col-span-2">
            <FileInput
              id={`edit-${panduan.id}-cover`}
              name="cover"
              label="Ganti Cover Buku"
              accept="image/jpeg,image/png,image/webp"
              description="Kosongkan apabila cover lama tetap digunakan."
              required={false}
            />
          </div>

          {panduan.cover_url && (
            <div className="md:col-span-2">
              <Checkbox
                id={`edit-${panduan.id}-hapus-cover`}
                name="hapus_cover"
                label="Hapus Cover Lama"
                description="Centang untuk menghapus cover tanpa menggantinya."
                checked={false}
                variant="danger"
              />
            </div>
          )}

          <Checkbox
            id={`edit-${panduan.id}-aktif`}
            name="aktif"
            label="Publikasikan Buku"
            description="Tampilkan buku pada halaman publik."
            checked={panduan.aktif}
          />

          <div className="flex items-end justify-end">
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
}: {
  label: string;
  value: number;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-4xl font-black text-slate-900">
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
        type="text"
        required
        defaultValue={value}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
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

function NumberInput({
  idPrefix,
  name,
  label,
  value,
  min,
  max,
  required = true,
}: {
  idPrefix: string;
  name: string;
  label: string;
  value: string;
  min: number;
  max?: number;
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

      <input
        id={id}
        name={name}
        type="number"
        required={required}
        min={min}
        max={max}
        step="1"
        defaultValue={value}
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}

function FileInput({
  id,
  name,
  label,
  accept,
  description,
  required,
}: {
  id: string;
  name: string;
  label: string;
  accept: string;
  description: string;
  required: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
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
          Pilih file dari perangkat
        </p>

        <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
          {description}
        </p>

        <input
          id={id}
          name={name}
          type="file"
          accept={accept}
          required={required}
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
  const containerClass =
    variant === 'danger'
      ? 'border-red-200 bg-red-50'
      : 'border-slate-200 bg-slate-50';

  const inputClass =
    variant === 'danger'
      ? 'accent-red-600'
      : 'accent-emerald-700';

  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 ${containerClass}`}
    >
      <input
        id={id}
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={checked}
        className={`mt-1 h-4 w-4 shrink-0 ${inputClass}`}
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
        <BookOpen size={31} />
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-800">
        Belum ada Hospitality Pocket Book
      </h3>

      <p className="mx-auto mt-2 max-w-lg text-sm font-medium leading-6 text-slate-500">
        Tambahkan buku melalui
        formulir di atas agar dapat
        diakses oleh pelaku wisata Desa
        Keji.
      </p>
    </div>
  );
}