// app/admin/desa-wisata/video-tutorial/page.tsx

import Link from 'next/link';

import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  Film,
  ListVideo,
  Pencil,
  PlayCircle,
  Power,
  Save,
  Trash2,
  type LucideIcon,
} from 'lucide-react';

import {
  hapusVideoTutorialAction,
  tambahVideoTutorialAction,
  toggleVideoTutorialAction,
  ubahVideoTutorialAction,
} from '@/app/admin/desa-wisata/video-tutorial/actions';

import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
}

interface VideoTutorialAdmin {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: string;
  youtube_url: string;
  youtube_id: string;
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

function isValidYoutubeId(
  value: string
) {
  return /^[A-Za-z0-9_-]{11}$/.test(
    value
  );
}

function normalizeVideo(
  value: unknown
): VideoTutorialAdmin | null {
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

  const deskripsi =
    safeString(
      row.deskripsi
    );

  const kategori =
    safeString(
      row.kategori
    );

  const youtubeUrl =
    safeString(
      row.youtube_url
    );

  const youtubeId =
    safeString(
      row.youtube_id
    );

  const urutan =
    Number(
      row.urutan ?? 0
    );

  if (
    !id ||
    !judul ||
    !deskripsi ||
    !kategori ||
    !youtubeUrl ||
    !isValidYoutubeId(
      youtubeId
    ) ||
    !Number.isInteger(
      urutan
    )
  ) {
    return null;
  }

  return {
    id,
    judul,
    deskripsi,
    kategori,

    youtube_url:
      youtubeUrl,

    youtube_id:
      youtubeId,

    urutan,
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

function getThumbnailUrl(
  youtubeId: string
) {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
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

export default async function AdminVideoTutorialPage({
  searchParams,
}: PageProps) {
  const [
    params,
    videoResult,
  ] = await Promise.all([
    searchParams,

    supabaseAdmin
      .from(
        'desa_wisata_video'
      )
      .select(`
        id,
        judul,
        deskripsi,
        kategori,
        youtube_url,
        youtube_id,
        urutan,
        aktif,
        created_at,
        updated_at
      `)
      .order('urutan', {
        ascending: true,
      })
      .order('created_at', {
        ascending: false,
      }),
  ]);

  if (videoResult.error) {
    console.error(
      'Gagal mengambil video tutorial:',
      {
        message:
          videoResult.error
            .message,

        code:
          videoResult.error
            .code,

        details:
          videoResult.error
            .details,

        hint:
          videoResult.error
            .hint,
      }
    );
  }

  const daftarVideo =
    (
      videoResult.data ?? []
    )
      .map(normalizeVideo)
      .filter(
        (
          item
        ): item is VideoTutorialAdmin =>
          item !== null
      );

  const jumlahAktif =
    daftarVideo.filter(
      (item) => item.aktif
    ).length;

  const jumlahNonaktif =
    daftarVideo.length -
    jumlahAktif;

  const jumlahKategori =
    new Set(
      daftarVideo.map(
        (item) =>
          item.kategori
            .trim()
            .toLowerCase()
      )
    ).size;

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
              <PlayCircle size={29} />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                Desa Wisata Keji
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                Video Tutorial
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                Kelola video panduan,
                edukasi, dan tutorial
                Desa Wisata Keji yang
                telah diunggah ke
                YouTube.
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
              href="/desa-wisata/video-tutorial"
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

      {videoResult.error && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="text-sm font-extrabold">
              Data video gagal dimuat
            </p>

            <p className="mt-1 text-xs font-semibold leading-5">
              Pastikan tabel
              desa_wisata_video sudah
              dibuat di Supabase.
            </p>
          </div>
        </div>
      )}

      {/* Statistik */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Video"
          value={
            daftarVideo.length
          }
          description="Seluruh video tersimpan"
          icon={ListVideo}
        />

        <StatCard
          label="Video Aktif"
          value={jumlahAktif}
          description="Tampil di halaman publik"
          icon={Eye}
        />

        <StatCard
          label="Video Nonaktif"
          value={jumlahNonaktif}
          description="Disembunyikan dari publik"
          icon={EyeOff}
        />

        <StatCard
          label="Kategori"
          value={jumlahKategori}
          description="Kategori video tersimpan"
          icon={Film}
        />
      </section>

      {/* Tambah video */}
      <form
        id="tambah-video"
        action={
          tambahVideoTutorialAction
        }
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <SectionHeader
  eyebrow="Video Baru"
  title="Tambah Video Tutorial"
  description="Masukkan tautan YouTube. Thumbnail akan diambil secara otomatis dari video."
  icon={PlayCircle}
/>

        <div className="grid gap-5 p-6 sm:p-7 md:grid-cols-2">
          <div className="md:col-span-2">
            <TextInput
              idPrefix="tambah-video"
              name="judul"
              label="Judul Video"
              placeholder="Contoh: Tutorial Pelayanan Wisata Desa Keji"
            />
          </div>

          <TextInput
            idPrefix="tambah-video"
            name="kategori"
            label="Kategori"
            value="Panduan Desa Wisata"
            placeholder="Contoh: Pelayanan Wisata"
          />

          <NumberInput
            idPrefix="tambah-video"
            name="urutan"
            label="Nomor Urutan"
            value={String(
              daftarVideo.length +
                1
            )}
            min={0}
          />

          <div className="md:col-span-2">
            <TextInput
              idPrefix="tambah-video"
              name="youtube_url"
              label="Link YouTube"
              placeholder="https://www.youtube.com/watch?v=xxxxxxxxxxx"
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              idPrefix="tambah-video"
              name="deskripsi"
              label="Deskripsi Video"
              placeholder="Masukkan penjelasan singkat mengenai isi dan tujuan video."
            />
          </div>

          <Checkbox
            id="tambah-video-aktif"
            name="aktif"
            label="Publikasikan Video"
            description="Video langsung ditampilkan pada halaman publik."
            checked
          />

          <div className="flex items-end justify-end">
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800 sm:w-auto"
            >
              <Save size={17} />

              Tambah Video
            </button>
          </div>
        </div>
      </form>

      {/* Daftar video */}
      <section
        id="daftar-video"
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <SectionHeader
          eyebrow="Daftar Video"
          title="Video Tutorial Desa Wisata"
          description={`${daftarVideo.length} video tersimpan di database.`}
          icon={ListVideo}
          variant="slate"
        />

        {daftarVideo.length ===
        0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-5 p-5 sm:p-7 xl:grid-cols-2">
            {daftarVideo.map(
              (video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function VideoCard({
  video,
}: {
  video: VideoTutorialAdmin;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        <img
          src={getThumbnailUrl(
            video.youtube_id
          )}
          alt={`Thumbnail ${video.judul}`}
          loading="lazy"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white backdrop-blur">
            <PlayCircle
              size={34}
            />
          </div>
        </div>

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold text-emerald-700 shadow-sm">
            {video.kategori}
          </span>

          <span
            className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold text-white ${
              video.aktif
                ? 'bg-emerald-700'
                : 'bg-slate-800'
            }`}
          >
            {video.aktif
              ? 'Aktif'
              : 'Nonaktif'}
          </span>
        </div>

        <span className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-extrabold text-white backdrop-blur">
          Urutan {video.urutan}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-black leading-7 text-slate-900">
          {video.judul}
        </h3>

        <p className="mt-3 text-sm font-medium leading-7 text-slate-500">
          {video.deskripsi}
        </p>

        <p className="mt-4 text-xs font-semibold text-slate-400">
          Diperbarui{' '}
          {formatTanggal(
            video.updated_at
          )}
        </p>

        <a
          href={video.youtube_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-red-600 px-4 text-xs font-extrabold text-white transition hover:bg-red-700"
        >
          <PlayCircle size={16} />

          Buka di YouTube

          <ExternalLink
            size={13}
          />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-4">
        <form
          action={
            toggleVideoTutorialAction
          }
        >
          <input
            type="hidden"
            name="id"
            value={video.id}
          />

          <input
            type="hidden"
            name="aktif"
            value={String(
              !video.aktif
            )}
          />

          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-amber-100 px-3 text-xs font-extrabold text-amber-700 transition hover:bg-amber-200"
          >
            <Power size={15} />

            {video.aktif
              ? 'Sembunyikan'
              : 'Publikasikan'}
          </button>
        </form>

        <form
          action={
            hapusVideoTutorialAction
          }
        >
          <input
            type="hidden"
            name="id"
            value={video.id}
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

          Edit Video
        </summary>

        <form
          action={
            ubahVideoTutorialAction
          }
          className="grid gap-5 border-t border-slate-200 p-5 md:grid-cols-2"
        >
          <input
            type="hidden"
            name="id"
            value={video.id}
          />

          <div className="md:col-span-2">
            <TextInput
              idPrefix={`edit-${video.id}`}
              name="judul"
              label="Judul Video"
              value={video.judul}
            />
          </div>

          <TextInput
            idPrefix={`edit-${video.id}`}
            name="kategori"
            label="Kategori"
            value={video.kategori}
          />

          <NumberInput
            idPrefix={`edit-${video.id}`}
            name="urutan"
            label="Nomor Urutan"
            value={String(
              video.urutan
            )}
            min={0}
          />

          <div className="md:col-span-2">
            <TextInput
              idPrefix={`edit-${video.id}`}
              name="youtube_url"
              label="Link YouTube"
              value={
                video.youtube_url
              }
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              idPrefix={`edit-${video.id}`}
              name="deskripsi"
              label="Deskripsi Video"
              value={
                video.deskripsi
              }
            />
          </div>

          <Checkbox
            id={`edit-${video.id}-aktif`}
            name="aktif"
            label="Publikasikan Video"
            description="Tampilkan video pada halaman publik."
            checked={video.aktif}
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

function NumberInput({
  idPrefix,
  name,
  label,
  value,
  min,
}: {
  idPrefix: string;
  name: string;
  label: string;
  value: string;
  min: number;
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
        step="1"
        defaultValue={value}
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

function EmptyState() {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <PlayCircle size={31} />
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-800">
        Belum ada video tutorial
      </h3>

      <p className="mx-auto mt-2 max-w-lg text-sm font-medium leading-6 text-slate-500">
        Tambahkan video melalui
        formulir di atas. Video harus
        sudah diunggah ke YouTube.
      </p>
    </div>
  );
}