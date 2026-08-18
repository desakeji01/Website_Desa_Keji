// app/admin/profil/ebook-sejarah/page.tsx

import Link from 'next/link';

import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Download,
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
  hapusEbookSejarahAction,
  tambahEbookSejarahAction,
  toggleEbookSejarahAction,
  ubahEbookSejarahAction,
} from '@/app/admin/profil/ebook-sejarah/actions';

import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

const JENIS_DOKUMEN =
  'ebook-sejarah';

const EBOOK_UTAMA_PDF =
  '/BUKU%20SEJARAH%20DESA%20KEJI.pdf';

const EBOOK_UTAMA_COVER =
  '/cover%20sejarah.png';

interface PageProps {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
}

interface EbookSejarahAdmin {
  id: string;
  judul: string;
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

function normalizeEbook(
  value: unknown
): EbookSejarahAdmin | null {
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

  const urutan =
    Number(
      row.urutan ?? 0
    );

  if (
    !id ||
    !judul ||
    !deskripsi ||
    !penyusun ||
    !fileUrl ||
    !filePath ||
    !Number.isInteger(
      urutan
    )
  ) {
    return null;
  }

  const tahun =
    row.tahun === null ||
    row.tahun === undefined
      ? null
      : Number(row.tahun);

  const jumlahHalaman =
    row.jumlah_halaman === null ||
    row.jumlah_halaman === undefined
      ? null
      : Number(
          row.jumlah_halaman
        );

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

export default async function AdminEbookSejarahPage({
  searchParams,
}: PageProps) {
  const [
    params,
    ebookResult,
  ] = await Promise.all([
    searchParams,

    supabaseAdmin
      .from(
        'desa_wisata_dokumen'
      )
      .select(`
        id,
        judul,
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

  if (ebookResult.error) {
    console.error(
      'Gagal mengambil ebook sejarah:',
      {
        message:
          ebookResult.error.message,

        code:
          ebookResult.error.code,

        details:
          ebookResult.error.details,

        hint:
          ebookResult.error.hint,
      }
    );
  }

  const daftarEbook =
    (
      ebookResult.data ?? []
    )
      .map(normalizeEbook)
      .filter(
        (
          item
        ): item is EbookSejarahAdmin =>
          item !== null
      );

  const jumlahAktif =
    daftarEbook.filter(
      (item) => item.aktif
    ).length;

  const jumlahNonaktif =
    daftarEbook.length -
    jumlahAktif;

  const totalHalaman =
    daftarEbook.reduce(
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
                Profil Desa Keji
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                Kelola Ebook Sejarah
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                Kelola file PDF, cover,
                penyusun, tahun terbit,
                dan informasi Ebook
                Sejarah Desa Keji.
              </p>
            </div>
          </div>

          <Link
            href="/profil/sejarah#ebook-sejarah"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-900 transition hover:bg-emerald-50"
          >
            Lihat Halaman Publik

            <ExternalLink size={16} />
          </Link>
        </div>
      </section>

      {params.success && (
        <Message
          type="success"
          text={params.success}
        />
      )}

      {params.error && (
        <Message
          type="error"
          text={params.error}
        />
      )}

      {ebookResult.error && (
        <Message
          type="error"
          text="Data ebook gagal dimuat. Pastikan tabel desa_wisata_dokumen sudah tersedia."
        />
      )}

      {/* Statistik */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Ebook"
          value={daftarEbook.length + 1}
          description="Termasuk ebook utama bawaan"
          icon={BookOpen}
        />

        <StatCard
          label="Ebook Aktif"
          value={jumlahAktif + 1}
          description="Termasuk ebook utama aktif"
          icon={Eye}
        />

        <StatCard
          label="Ebook Nonaktif"
          value={jumlahNonaktif}
          description="Disembunyikan dari publik"
          icon={EyeOff}
        />

        <StatCard
          label="Total Halaman"
          value={totalHalaman}
          description="Halaman ebook tambahan terdata"
          icon={FileText}
        />
      </section>

      {/* Ebook utama bawaan */}

      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
        <SectionHeader
          label="Ebook Utama"
          title="Buku Sejarah Desa Keji"
          description="Dokumen utama sejarah Desa Keji yang tersimpan langsung di folder public website."
          icon={BookOpen}
        />

        <div className="grid gap-8 p-6 sm:p-7 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-center">
          {/* COVER */}

          <div className="relative mx-auto w-full max-w-[250px]">
            <div className="absolute -bottom-4 left-1/2 h-8 w-[75%] -translate-x-1/2 rounded-full bg-emerald-950/20 blur-xl" />

            <a
              href={
                EBOOK_UTAMA_PDF
              }
              target="_blank"
              rel="noopener noreferrer"
              className="relative block overflow-hidden rounded-2xl bg-white p-2 shadow-xl transition duration-300 hover:-translate-y-1"
            >
              <img
                src={
                  EBOOK_UTAMA_COVER
                }
                alt="Cover Buku Sejarah Desa Keji"
                loading="lazy"
                className="h-auto w-full rounded-xl object-contain"
              />
            </a>
          </div>

          {/* INFO */}

          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.13em] text-emerald-700">
                Aktif
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.13em] text-slate-600">
                Dokumen Bawaan
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-black leading-tight text-slate-900">
              Sejarah Desa Keji
              Kabupaten Semarang
            </h3>

            <p className="mt-2 text-sm font-extrabold text-emerald-700">
              Mengungkap Jejak Sejarah,
              Budaya, dan Perkembangan
              Desa
            </p>

            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-slate-500">
              Ebook utama ini langsung
              ditampilkan pada halaman
              publik Sejarah Desa Keji.
              Cover dan file PDF
              tersimpan di folder
              public, sehingga tidak
              memerlukan upload ulang
              ke Supabase.
            </p>

            <div className="mt-6 grid gap-3 xl:grid-cols-2">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-700">
                  Cover
                </p>

                <p className="mt-2 break-all font-mono text-[11px] font-semibold leading-5 text-slate-600">
                  public/cover sejarah.png
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-700">
                  PDF
                </p>

                <p className="mt-2 break-all font-mono text-[11px] font-semibold leading-5 text-slate-600">
                  public/BUKU SEJARAH DESA KEJI.pdf
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={
                  EBOOK_UTAMA_PDF
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800"
              >
                <BookOpen
                  size={16}
                />

                Buka Ebook

                <ExternalLink
                  size={13}
                />
              </a>

              <a
                href={
                  EBOOK_UTAMA_PDF
                }
                download="BUKU SEJARAH DESA KEJI.pdf"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-6 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-100"
              >
                <Download
                  size={16}
                />

                Unduh PDF
              </a>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-semibold leading-6 text-amber-800">
                Ebook utama bersifat
                statis. Jika dokumen
                atau cover diperbarui,
                cukup ganti file pada
                folder public dengan
                nama file yang sama.
                Form di bawah tetap
                dapat digunakan untuk
                menambahkan ebook
                sejarah lainnya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tambah ebook */}
      <form
        id="tambah-ebook"
        action={
          tambahEbookSejarahAction
        }
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <SectionHeader
          label="Dokumen Baru"
          title="Tambah Ebook Sejarah"
          description="Unggah file PDF, cover, dan identitas Ebook Sejarah Desa Keji."
          icon={BookOpen}
        />

        <div className="grid gap-5 p-6 sm:p-7 md:grid-cols-2">
          <div className="md:col-span-2">
            <TextInput
              idPrefix="ebook-baru"
              name="judul"
              label="Judul Ebook"
              value="Ebook Sejarah Desa Keji"
              placeholder="Masukkan judul ebook"
            />
          </div>

          <TextInput
            idPrefix="ebook-baru"
            name="penyusun"
            label="Penyusun"
            value="Umi"
            placeholder="Masukkan nama penyusun"
          />

          <NumberInput
            idPrefix="ebook-baru"
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
            idPrefix="ebook-baru"
            name="jumlah_halaman"
            label="Jumlah Halaman"
            value=""
            min={1}
            required={false}
          />

          <NumberInput
            idPrefix="ebook-baru"
            name="urutan"
            label="Nomor Urutan"
            value={String(
              daftarEbook.length + 1
            )}
            min={0}
          />

          <div className="md:col-span-2">
            <TextArea
              idPrefix="ebook-baru"
              name="deskripsi"
              label="Deskripsi Ebook"
              placeholder="Tuliskan ringkasan isi Ebook Sejarah Desa Keji."
            />
          </div>

          <div className="md:col-span-2">
            <FileInput
              id="ebook-baru-pdf"
              name="file_pdf"
              label="File PDF"
              accept="application/pdf"
              description="Format PDF dengan ukuran maksimal 25 MB."
              required
            />
          </div>

          <div className="md:col-span-2">
            <FileInput
              id="ebook-baru-cover"
              name="cover"
              label="Cover Ebook"
              accept="image/jpeg,image/png,image/webp"
              description="Format JPG, PNG, atau WebP. Maksimal 5 MB."
              required={false}
            />
          </div>

          <Checkbox
            id="ebook-baru-aktif"
            name="aktif"
            label="Publikasikan Ebook"
            description="Ebook langsung ditampilkan pada halaman Sejarah Desa."
            checked
          />

          <div className="flex items-end justify-end">
            <SubmitButton text="Tambah Ebook" />
          </div>
        </div>
      </form>

      {/* Daftar ebook */}
      <section
        id="daftar-ebook"
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <SectionHeader
          label="Daftar Dokumen"
          title="Ebook Sejarah Desa Keji"
          description={`${daftarEbook.length} ebook tersimpan di database.`}
          icon={BookOpen}
          dark
        />

        {daftarEbook.length ===
        0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-5 p-5 sm:p-7 xl:grid-cols-2">
            {daftarEbook.map(
              (ebook) => (
                <EbookAdminCard
                  key={ebook.id}
                  ebook={ebook}
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function EbookAdminCard({
  ebook,
}: {
  ebook: EbookSejarahAdmin;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
      <div className="grid sm:grid-cols-[190px_minmax(0,1fr)]">
        <div className="relative min-h-64 overflow-hidden bg-gradient-to-br from-emerald-950 to-emerald-700">
          {ebook.cover_url ? (
            <img
              src={ebook.cover_url}
              alt={`Cover ${ebook.judul}`}
              loading="lazy"
              className="h-full min-h-64 w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-64 flex-col items-center justify-center p-6 text-center text-white">
              <BookOpen size={44} />

              <p className="mt-3 text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                Ebook Sejarah
              </p>
            </div>
          )}

          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-[10px] font-extrabold text-white ${
              ebook.aktif
                ? 'bg-emerald-700'
                : 'bg-slate-800'
            }`}
          >
            {ebook.aktif
              ? 'Aktif'
              : 'Nonaktif'}
          </span>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {ebook.tahun && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-emerald-700">
                Tahun {ebook.tahun}
              </span>
            )}

            {ebook.jumlah_halaman && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-[10px] font-extrabold text-blue-700">
                {ebook.jumlah_halaman}{' '}
                halaman
              </span>
            )}

            <span className="rounded-full bg-slate-200 px-3 py-1 text-[10px] font-extrabold text-slate-700">
              Urutan {ebook.urutan}
            </span>
          </div>

          <h3 className="mt-4 text-xl font-black leading-7 text-slate-900">
            {ebook.judul}
          </h3>

          <p className="mt-2 text-xs font-extrabold uppercase tracking-wider text-emerald-700">
            Penyusun: {ebook.penyusun}
          </p>

          <p className="mt-3 line-clamp-4 text-sm font-medium leading-7 text-slate-500">
            {ebook.deskripsi}
          </p>

          <p className="mt-4 text-xs font-semibold text-slate-400">
            Diperbarui{' '}
            {formatTanggal(
              ebook.updated_at
            )}
          </p>

          <a
            href={ebook.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-800"
          >
            <FileText size={15} />

            Buka PDF

            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-4">
        <form
          action={
            toggleEbookSejarahAction
          }
        >
          <input
            type="hidden"
            name="id"
            value={ebook.id}
          />

          <input
            type="hidden"
            name="aktif"
            value={String(
              !ebook.aktif
            )}
          />

          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-amber-100 px-3 text-xs font-extrabold text-amber-700 transition hover:bg-amber-200"
          >
            <Power size={15} />

            {ebook.aktif
              ? 'Sembunyikan'
              : 'Publikasikan'}
          </button>
        </form>

        <form
          action={
            hapusEbookSejarahAction
          }
        >
          <input
            type="hidden"
            name="id"
            value={ebook.id}
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
        <summary className="flex cursor-pointer list-none items-center justify-center gap-2 p-4 text-sm font-extrabold text-slate-700">
          <Pencil size={16} />

          Edit Ebook
        </summary>

        <form
          action={
            ubahEbookSejarahAction
          }
          className="grid gap-5 border-t border-slate-200 p-5 md:grid-cols-2"
        >
          <input
            type="hidden"
            name="id"
            value={ebook.id}
          />

          <div className="md:col-span-2">
            <TextInput
              idPrefix={`edit-${ebook.id}`}
              name="judul"
              label="Judul Ebook"
              value={ebook.judul}
            />
          </div>

          <TextInput
            idPrefix={`edit-${ebook.id}`}
            name="penyusun"
            label="Penyusun"
            value={ebook.penyusun}
          />

          <NumberInput
            idPrefix={`edit-${ebook.id}`}
            name="tahun"
            label="Tahun Terbit"
            value={
              ebook.tahun
                ? String(ebook.tahun)
                : ''
            }
            min={1900}
            max={2200}
            required={false}
          />

          <NumberInput
            idPrefix={`edit-${ebook.id}`}
            name="jumlah_halaman"
            label="Jumlah Halaman"
            value={
              ebook.jumlah_halaman
                ? String(
                    ebook.jumlah_halaman
                  )
                : ''
            }
            min={1}
            required={false}
          />

          <NumberInput
            idPrefix={`edit-${ebook.id}`}
            name="urutan"
            label="Nomor Urutan"
            value={String(
              ebook.urutan
            )}
            min={0}
          />

          <div className="md:col-span-2">
            <TextArea
              idPrefix={`edit-${ebook.id}`}
              name="deskripsi"
              label="Deskripsi Ebook"
              value={ebook.deskripsi}
            />
          </div>

          <div className="md:col-span-2">
            <FileInput
              id={`edit-${ebook.id}-pdf`}
              name="file_pdf"
              label="Ganti File PDF"
              accept="application/pdf"
              description="Kosongkan apabila file PDF lama tetap digunakan."
              required={false}
            />
          </div>

          <div className="md:col-span-2">
            <FileInput
              id={`edit-${ebook.id}-cover`}
              name="cover"
              label="Ganti Cover"
              accept="image/jpeg,image/png,image/webp"
              description="Kosongkan apabila cover lama tetap digunakan."
              required={false}
            />
          </div>

          {ebook.cover_url && (
            <div className="md:col-span-2">
              <Checkbox
                id={`edit-${ebook.id}-hapus-cover`}
                name="hapus_cover"
                label="Hapus Cover Lama"
                description="Centang untuk menghapus cover tanpa menggantinya."
                checked={false}
                danger
              />
            </div>
          )}

          <Checkbox
            id={`edit-${ebook.id}-aktif`}
            name="aktif"
            label="Publikasikan Ebook"
            description="Tampilkan ebook pada halaman Sejarah Desa."
            checked={ebook.aktif}
          />

          <div className="flex items-end justify-end">
            <SubmitButton
              text="Simpan Perubahan"
              dark
            />
          </div>
        </form>
      </details>
    </article>
  );
}

function SectionHeader({
  label,
  title,
  description,
  icon: Icon,
  dark = false,
}: {
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  dark?: boolean;
}) {
  return (
    <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white px-6 py-5 sm:px-7">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white ${
            dark
              ? 'bg-slate-800'
              : 'bg-emerald-700'
          }`}
        >
          <Icon size={23} />
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
            {label}
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

          <p className="mt-2 text-xs font-semibold text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Icon size={22} />
        </div>
      </div>
    </article>
  );
}

function Message({
  type,
  text,
}: {
  type: 'success' | 'error';
  text: string;
}) {
  const success =
    type === 'success';

  const Icon =
    success
      ? CheckCircle2
      : AlertCircle;

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 ${
        success
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-red-200 bg-red-50 text-red-700'
      }`}
    >
      <Icon
        size={20}
        className="mt-0.5 shrink-0"
      />

      <p className="text-sm font-semibold leading-6">
        {text}
      </p>
    </div>
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
        rows={6}
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
        <Upload
          size={24}
          className="text-emerald-700"
        />

        <p className="mt-3 text-sm font-extrabold text-slate-700">
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
          className="mt-5 block w-full max-w-md text-xs font-semibold text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-700 file:px-4 file:py-2.5 file:text-xs file:font-extrabold file:text-white"
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
  danger = false,
}: {
  id: string;
  name: string;
  label: string;
  description: string;
  checked: boolean;
  danger?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 ${
        danger
          ? 'border-red-200 bg-red-50'
          : 'border-slate-200 bg-slate-50'
      }`}
    >
      <input
        id={id}
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={checked}
        className={`mt-1 h-4 w-4 shrink-0 ${
          danger
            ? 'accent-red-600'
            : 'accent-emerald-700'
        }`}
      />

      <span>
        <span
          className={`block text-sm font-extrabold ${
            danger
              ? 'text-red-800'
              : 'text-slate-700'
          }`}
        >
          {label}
        </span>

        <span className="mt-1 block text-xs font-medium leading-5 text-slate-500">
          {description}
        </span>
      </span>
    </label>
  );
}

function SubmitButton({
  text,
  dark = false,
}: {
  text: string;
  dark?: boolean;
}) {
  return (
    <button
      type="submit"
      className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-extrabold text-white transition sm:w-auto ${
        dark
          ? 'bg-slate-800 hover:bg-slate-900'
          : 'bg-emerald-700 hover:bg-emerald-800'
      }`}
    >
      <Save size={17} />

      {text}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-16 text-center">
      <ImageIcon
        size={48}
        className="mx-auto text-slate-300"
      />

      <h3 className="mt-4 text-lg font-black text-slate-800">
        Belum ada Ebook Sejarah
      </h3>

      <p className="mx-auto mt-2 max-w-lg text-sm font-medium leading-6 text-slate-500">
        Tambahkan ebook melalui
        formulir di atas agar dapat
        diakses pada halaman Sejarah
        Desa Keji.
      </p>
    </div>
  );
}