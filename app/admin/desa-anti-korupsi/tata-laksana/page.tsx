// app/admin/desa-anti-korupsi/tata-laksana/page.tsx

import Link from 'next/link';

import {
  AlertCircle,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FilePlus2,
  FileSearch,
  FileText,
  Handshake,
  Pencil,
  Power,
  Save,
  ShieldCheck,
  Trash2,
  type LucideIcon,
} from 'lucide-react';

import {
  hapusDokumenTataLaksanaAction,
  hapusIndikatorTataLaksanaAction,
  tambahDokumenTataLaksanaAction,
  tambahIndikatorTataLaksanaAction,
  toggleDokumenTataLaksanaAction,
  toggleIndikatorTataLaksanaAction,
  ubahDokumenTataLaksanaAction,
  ubahIndikatorTataLaksanaAction,
} from '@/app/admin/desa-anti-korupsi/tata-laksana/actions';

import { supabaseAdmin } from '@/lib/supabase-admin';

import {
  ANTI_KORUPSI_ICON_OPTIONS,
  JENIS_DOKUMEN_ANTI_KORUPSI,
  type AntiKorupsiDokumen,
  type AntiKorupsiIconKey,
  type AntiKorupsiIndikator,
  type JenisDokumenAntiKorupsi,
} from '@/types/anti-korupsi';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SUB_SLUG = 'tata-laksana';

interface PageProps {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
}

const ICON_MAP: Record<
  AntiKorupsiIconKey,
  LucideIcon
> = {
  'clipboard-check':
    ClipboardCheck,

  'file-search':
    FileSearch,

  'shield-check':
    ShieldCheck,

  handshake:
    Handshake,

  'badge-check':
    BadgeCheck,
};

const ICON_LABELS: Record<
  AntiKorupsiIconKey,
  string
> = {
  'clipboard-check':
    'Clipboard Check',

  'file-search':
    'File Search',

  'shield-check':
    'Shield Check',

  handshake:
    'Handshake',

  'badge-check':
    'Badge Check',
};

function safeString(
  value: unknown
) {
  return String(
    value ?? ''
  ).trim();
}

function isIconKey(
  value: string
): value is AntiKorupsiIconKey {
  return (
    ANTI_KORUPSI_ICON_OPTIONS as readonly string[]
  ).includes(value);
}

function isJenisDokumen(
  value: string
): value is JenisDokumenAntiKorupsi {
  return (
    JENIS_DOKUMEN_ANTI_KORUPSI as readonly string[]
  ).includes(value);
}

function normalizeIndikator(
  value: unknown
): AntiKorupsiIndikator | null {
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
  const kode = safeString(row.kode);
  const judul = safeString(row.judul);

  const iconKey = safeString(
    row.icon_key
  );

  if (
    !id ||
    !kode ||
    !judul ||
    !isIconKey(iconKey)
  ) {
    return null;
  }

  return {
    id,

    sub_slug: safeString(
      row.sub_slug
    ),

    kode,
    judul,

    ringkasan: safeString(
      row.ringkasan
    ),

    icon_key: iconKey,

    urutan: Number(
      row.urutan ?? 0
    ),

    aktif: Boolean(row.aktif),

    created_at: safeString(
      row.created_at
    ),

    updated_at: safeString(
      row.updated_at
    ),
  };
}

function normalizeDokumen(
  value: unknown
): AntiKorupsiDokumen | null {
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

  const indikatorId =
    safeString(
      row.indikator_id
    );

  const judul =
    safeString(row.judul);

  const jenis =
    safeString(row.jenis);

  if (
    !id ||
    !indikatorId ||
    !judul ||
    !isJenisDokumen(jenis)
  ) {
    return null;
  }

  const rawTahun = row.tahun;

  const tahun =
    rawTahun === null ||
    rawTahun === undefined
      ? null
      : Number(rawTahun);

  return {
    id,

    indikator_id:
      indikatorId,

    judul,

    deskripsi: safeString(
      row.deskripsi
    ),

    jenis,

    tahun:
      tahun !== null &&
      Number.isInteger(tahun)
        ? tahun
        : null,

    drive_url: safeString(
      row.drive_url
    ),

    urutan: Number(
      row.urutan ?? 0
    ),

    aktif: Boolean(row.aktif),

    created_at: safeString(
      row.created_at
    ),

    updated_at: safeString(
      row.updated_at
    ),
  };
}

export default async function AdminTataLaksanaPage({
  searchParams,
}: PageProps) {
  const [params, indikatorResult] =
    await Promise.all([
      searchParams,

      supabaseAdmin
        .from(
          'anti_korupsi_indikator'
        )
        .select(`
          id,
          sub_slug,
          kode,
          judul,
          ringkasan,
          icon_key,
          urutan,
          aktif,
          created_at,
          updated_at
        `)
        .eq(
          'sub_slug',
          SUB_SLUG
        )
        .order('urutan', {
          ascending: true,
        })
        .order('created_at', {
          ascending: true,
        }),
    ]);

  if (indikatorResult.error) {
    console.error(
      'Gagal mengambil indikator Tata Laksana:',
      {
        message:
          indikatorResult.error
            .message,

        code:
          indikatorResult.error
            .code,

        details:
          indikatorResult.error
            .details,

        hint:
          indikatorResult.error
            .hint,
      }
    );
  }

  const daftarIndikator =
    (
      indikatorResult.data ?? []
    )
      .map(normalizeIndikator)
      .filter(
        (
          item
        ): item is AntiKorupsiIndikator =>
          item !== null
      );

  const indikatorIds =
    daftarIndikator.map(
      (item) => item.id
    );

  let daftarDokumen:
    AntiKorupsiDokumen[] = [];

  if (indikatorIds.length > 0) {
    const dokumenResult =
      await supabaseAdmin
        .from(
          'anti_korupsi_dokumen'
        )
        .select(`
          id,
          indikator_id,
          judul,
          deskripsi,
          jenis,
          tahun,
          drive_url,
          urutan,
          aktif,
          created_at,
          updated_at
        `)
        .in(
          'indikator_id',
          indikatorIds
        )
        .order('urutan', {
          ascending: true,
        })
        .order('created_at', {
          ascending: true,
        });

    if (dokumenResult.error) {
      console.error(
        'Gagal mengambil dokumen Tata Laksana:',
        {
          message:
            dokumenResult.error
              .message,

          code:
            dokumenResult.error
              .code,

          details:
            dokumenResult.error
              .details,

          hint:
            dokumenResult.error
              .hint,
        }
      );
    }

    daftarDokumen =
      (
        dokumenResult.data ?? []
      )
        .map(normalizeDokumen)
        .filter(
          (
            item
          ): item is AntiKorupsiDokumen =>
            item !== null
        );
  }

  const indikatorMap =
    new Map(
      daftarIndikator.map(
        (item) => [
          item.id,
          item,
        ]
      )
    );

  const jumlahIndikatorAktif =
    daftarIndikator.filter(
      (item) => item.aktif
    ).length;

  const jumlahDokumenAktif =
    daftarDokumen.filter(
      (item) => item.aktif
    ).length;

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

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <ClipboardCheck
                size={28}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                Desa Anti Korupsi
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                Penguatan Tata Laksana
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                Kelola indikator,
                deskripsi, urutan,
                status publikasi, serta
                dokumen bukti dukung
                Tata Laksana melalui
                tautan Google Drive.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/desa-anti-korupsi"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white transition hover:bg-white/15"
            >
              Dashboard Anti Korupsi
            </Link>

            <Link
              href="/desa-anti-korupsi/tata-laksana"
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

      {/* Statistik */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Indikator"
          value={
            daftarIndikator.length
          }
          description={`${jumlahIndikatorAktif} indikator aktif`}
          icon={ClipboardCheck}
        />

        <StatCard
          label="Total Dokumen"
          value={
            daftarDokumen.length
          }
          description={`${jumlahDokumenAktif} dokumen aktif`}
          icon={FileText}
        />

        <StatCard
          label="Dokumen Nonaktif"
          value={
            daftarDokumen.length -
            jumlahDokumenAktif
          }
          description="Tidak tampil di publik"
          icon={Power}
        />

        <StatCard
          label="Target Indikator"
          value={5}
          description="I.1 sampai I.5"
          icon={ShieldCheck}
        />
      </section>

      {/* Tambah indikator */}
      <form
        id="tambah-indikator"
        action={
          tambahIndikatorTataLaksanaAction
        }
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <SectionHeader
          eyebrow="Indikator I"
          title="Tambah Indikator Tata Laksana"
          description="Tambahkan kelompok indikator untuk menampung dokumen bukti dukung."
          icon={ClipboardCheck}
        />

        <div className="grid gap-5 p-6 sm:p-7 md:grid-cols-2">
          <TextInput
            idPrefix="indikator-baru"
            name="kode"
            label="Kode Indikator"
            placeholder="Contoh: I.1"
          />

          <NumberInput
            idPrefix="indikator-baru"
            name="urutan"
            label="Nomor Urutan"
            value={String(
              daftarIndikator.length +
                1
            )}
            min={0}
          />

          <div className="md:col-span-2">
            <TextInput
              idPrefix="indikator-baru"
              name="judul"
              label="Judul Indikator"
              placeholder="Masukkan judul indikator Tata Laksana"
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              idPrefix="indikator-baru"
              name="ringkasan"
              label="Ringkasan"
              placeholder="Masukkan penjelasan singkat indikator."
            />
          </div>

          <IconSelect
            idPrefix="indikator-baru"
            value="file-search"
          />

          <Checkbox
            id="indikator-baru-aktif"
            name="aktif"
            label="Indikator Aktif"
            description="Indikator ditampilkan pada halaman publik."
            checked
          />

          <div className="flex justify-end md:col-span-2">
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800 sm:w-auto"
            >
              <Save size={17} />

              Tambah Indikator
            </button>
          </div>
        </div>
      </form>

      {/* Daftar indikator */}
      <section
        id="daftar-indikator"
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <SectionHeader
          eyebrow="Tata Laksana"
          title="Daftar Indikator"
          description={`${daftarIndikator.length} indikator tersimpan.`}
          icon={FileSearch}
          variant="slate"
        />

        {daftarIndikator.length ===
        0 ? (
          <EmptyState
            title="Belum ada indikator"
            description="Tambahkan indikator melalui formulir di atas atau jalankan SQL seed."
            icon={ClipboardCheck}
          />
        ) : (
          <div className="grid gap-5 p-5 sm:p-7 xl:grid-cols-2">
            {daftarIndikator.map(
              (indikator) => {
                const Icon =
                  ICON_MAP[
                    indikator.icon_key
                  ];

                const jumlahDokumen =
                  daftarDokumen.filter(
                    (dokumen) =>
                      dokumen.indikator_id ===
                      indikator.id
                  ).length;

                return (
                  <article
                    key={indikator.id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50"
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                          <Icon size={22} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-emerald-700">
                              {
                                indikator.kode
                              }
                            </span>

                            <span
                              className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${
                                indikator.aktif
                                  ? 'bg-cyan-100 text-cyan-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {indikator.aktif
                                ? 'Aktif'
                                : 'Nonaktif'}
                            </span>
                          </div>

                          <h3 className="mt-3 font-black leading-6 text-slate-900">
                            {
                              indikator.judul
                            }
                          </h3>

                          <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                            {
                              indikator.ringkasan
                            }
                          </p>

                          <p className="mt-3 text-xs font-extrabold text-emerald-700">
                            {jumlahDokumen}{' '}
                            dokumen
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-4">
                      <form
                        action={
                          toggleIndikatorTataLaksanaAction
                        }
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={
                            indikator.id
                          }
                        />

                        <input
                          type="hidden"
                          name="aktif"
                          value={String(
                            !indikator.aktif
                          )}
                        />

                        <button
                          type="submit"
                          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-amber-100 px-3 text-xs font-extrabold text-amber-700 transition hover:bg-amber-200"
                        >
                          <Power size={15} />

                          {indikator.aktif
                            ? 'Sembunyikan'
                            : 'Publikasikan'}
                        </button>
                      </form>

                      <form
                        action={
                          hapusIndikatorTataLaksanaAction
                        }
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={
                            indikator.id
                          }
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

                        Edit Indikator
                      </summary>

                      <form
                        action={
                          ubahIndikatorTataLaksanaAction
                        }
                        className="grid gap-4 border-t border-slate-200 p-5"
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={
                            indikator.id
                          }
                        />

                        <TextInput
                          idPrefix={`edit-indikator-${indikator.id}`}
                          name="kode"
                          label="Kode"
                          value={
                            indikator.kode
                          }
                        />

                        <TextInput
                          idPrefix={`edit-indikator-${indikator.id}`}
                          name="judul"
                          label="Judul"
                          value={
                            indikator.judul
                          }
                        />

                        <TextArea
                          idPrefix={`edit-indikator-${indikator.id}`}
                          name="ringkasan"
                          label="Ringkasan"
                          value={
                            indikator.ringkasan
                          }
                        />

                        <IconSelect
                          idPrefix={`edit-indikator-${indikator.id}`}
                          value={
                            indikator.icon_key
                          }
                        />

                        <NumberInput
                          idPrefix={`edit-indikator-${indikator.id}`}
                          name="urutan"
                          label="Nomor Urutan"
                          value={String(
                            indikator.urutan
                          )}
                          min={0}
                        />

                        <Checkbox
                          id={`edit-indikator-${indikator.id}-aktif`}
                          name="aktif"
                          label="Indikator Aktif"
                          description="Tampilkan pada halaman publik."
                          checked={
                            indikator.aktif
                          }
                        />

                        <button
                          type="submit"
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-800 px-5 text-sm font-extrabold text-white transition hover:bg-slate-900"
                        >
                          <Save size={16} />

                          Simpan Perubahan
                        </button>
                      </form>
                    </details>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>

      {/* Tambah dokumen */}
      <form
        id="tambah-dokumen"
        action={
          tambahDokumenTataLaksanaAction
        }
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <SectionHeader
          eyebrow="Google Drive"
          title="Tambah Dokumen Tata Laksana"
          description="Masukkan tautan dokumen Google Drive tanpa mengunggah file ke website."
          icon={FilePlus2}
        />

        <div className="grid gap-5 p-6 sm:p-7 md:grid-cols-2">
          <IndikatorSelect
            idPrefix="dokumen-baru"
            indikator={
              daftarIndikator
            }
          />

          <JenisDokumenSelect
            idPrefix="dokumen-baru"
            value="Dokumen Lainnya"
          />

          <div className="md:col-span-2">
            <TextInput
              idPrefix="dokumen-baru"
              name="judul"
              label="Judul Dokumen"
              placeholder="Masukkan nama dokumen"
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              idPrefix="dokumen-baru"
              name="deskripsi"
              label="Deskripsi Dokumen"
              placeholder="Masukkan penjelasan singkat dokumen."
            />
          </div>

          <NumberInput
            idPrefix="dokumen-baru"
            name="tahun"
            label="Tahun Dokumen"
            value=""
            min={1900}
            max={2200}
            required={false}
          />

          <NumberInput
            idPrefix="dokumen-baru"
            name="urutan"
            label="Nomor Urutan"
            value={String(
              daftarDokumen.length +
                1
            )}
            min={0}
          />

          <div className="md:col-span-2">
            <TextInput
              idPrefix="dokumen-baru"
              name="drive_url"
              label="Link Google Drive"
              placeholder="https://drive.google.com/file/d/.../view"
            />
          </div>

          <Checkbox
            id="dokumen-baru-aktif"
            name="aktif"
            label="Dokumen Aktif"
            description="Dokumen ditampilkan pada halaman publik."
            checked
          />

          <div className="flex items-end justify-end">
            <button
              type="submit"
              disabled={
                daftarIndikator.length ===
                0
              }
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
            >
              <FilePlus2 size={17} />

              Tambah Dokumen
            </button>
          </div>
        </div>
      </form>

      {/* Daftar dokumen */}
      <section
        id="daftar-dokumen"
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <SectionHeader
          eyebrow="Bukti Dukung"
          title="Dokumen Tata Laksana"
          description={`${daftarDokumen.length} dokumen Google Drive tersimpan.`}
          icon={FileText}
          variant="slate"
        />

        {daftarDokumen.length ===
        0 ? (
          <EmptyState
            title="Belum ada dokumen"
            description="Tambahkan dokumen Google Drive melalui formulir di atas."
            icon={FileText}
          />
        ) : (
          <div className="grid gap-5 p-5 sm:p-7 xl:grid-cols-2">
            {daftarDokumen.map(
              (dokumen) => {
                const indikator =
                  indikatorMap.get(
                    dokumen.indikator_id
                  );

                return (
                  <article
                    key={dokumen.id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50"
                  >
                    <div className="p-5">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-emerald-700">
                          {dokumen.jenis}
                        </span>

                        {dokumen.tahun && (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-[10px] font-extrabold text-blue-700">
                            {dokumen.tahun}
                          </span>
                        )}

                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${
                            dokumen.aktif
                              ? 'bg-cyan-100 text-cyan-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {dokumen.aktif
                            ? 'Aktif'
                            : 'Nonaktif'}
                        </span>
                      </div>

                      <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                        {indikator?.kode ??
                          'Indikator'}
                      </p>

                      <h3 className="mt-2 font-black leading-6 text-slate-900">
                        {dokumen.judul}
                      </h3>

                      <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                        {
                          dokumen.deskripsi
                        }
                      </p>

                      <a
                        href={
                          dokumen.drive_url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-800"
                      >
                        <ExternalLink
                          size={15}
                        />

                        Buka Google Drive
                      </a>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-4">
                      <form
                        action={
                          toggleDokumenTataLaksanaAction
                        }
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={dokumen.id}
                        />

                        <input
                          type="hidden"
                          name="aktif"
                          value={String(
                            !dokumen.aktif
                          )}
                        />

                        <button
                          type="submit"
                          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-amber-100 px-3 text-xs font-extrabold text-amber-700 transition hover:bg-amber-200"
                        >
                          <Power size={15} />

                          {dokumen.aktif
                            ? 'Sembunyikan'
                            : 'Publikasikan'}
                        </button>
                      </form>

                      <form
                        action={
                          hapusDokumenTataLaksanaAction
                        }
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={dokumen.id}
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

                        Edit Dokumen
                      </summary>

                      <form
                        action={
                          ubahDokumenTataLaksanaAction
                        }
                        className="grid gap-4 border-t border-slate-200 p-5"
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={dokumen.id}
                        />

                        <IndikatorSelect
                          idPrefix={`edit-dokumen-${dokumen.id}`}
                          indikator={
                            daftarIndikator
                          }
                          value={
                            dokumen.indikator_id
                          }
                        />

                        <JenisDokumenSelect
                          idPrefix={`edit-dokumen-${dokumen.id}`}
                          value={
                            dokumen.jenis
                          }
                        />

                        <TextInput
                          idPrefix={`edit-dokumen-${dokumen.id}`}
                          name="judul"
                          label="Judul"
                          value={dokumen.judul}
                        />

                        <TextArea
                          idPrefix={`edit-dokumen-${dokumen.id}`}
                          name="deskripsi"
                          label="Deskripsi"
                          value={
                            dokumen.deskripsi
                          }
                        />

                        <NumberInput
                          idPrefix={`edit-dokumen-${dokumen.id}`}
                          name="tahun"
                          label="Tahun"
                          value={
                            dokumen.tahun
                              ? String(
                                  dokumen.tahun
                                )
                              : ''
                          }
                          min={1900}
                          max={2200}
                          required={false}
                        />

                        <NumberInput
                          idPrefix={`edit-dokumen-${dokumen.id}`}
                          name="urutan"
                          label="Nomor Urutan"
                          value={String(
                            dokumen.urutan
                          )}
                          min={0}
                        />

                        <TextInput
                          idPrefix={`edit-dokumen-${dokumen.id}`}
                          name="drive_url"
                          label="Link Google Drive"
                          value={
                            dokumen.drive_url
                          }
                        />

                        <Checkbox
                          id={`edit-dokumen-${dokumen.id}-aktif`}
                          name="aktif"
                          label="Dokumen Aktif"
                          description="Tampilkan pada halaman publik."
                          checked={
                            dokumen.aktif
                          }
                        />

                        <button
                          type="submit"
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-800 px-5 text-sm font-extrabold text-white transition hover:bg-slate-900"
                        >
                          <Save size={16} />

                          Simpan Perubahan
                        </button>
                      </form>
                    </details>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>
    </div>
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
        rows={4}
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
  const id = `${idPrefix}-${name}`;

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

function IconSelect({
  idPrefix,
  value,
}: {
  idPrefix: string;
  value: AntiKorupsiIconKey;
}) {
  const id =
    `${idPrefix}-icon_key`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
      >
        Ikon Indikator
      </label>

      <select
        id={id}
        name="icon_key"
        required
        defaultValue={value}
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      >
        {ANTI_KORUPSI_ICON_OPTIONS.map(
          (item) => (
            <option
              key={item}
              value={item}
            >
              {ICON_LABELS[item]}
            </option>
          )
        )}
      </select>
    </div>
  );
}

function IndikatorSelect({
  idPrefix,
  indikator,
  value,
}: {
  idPrefix: string;
  indikator:
    AntiKorupsiIndikator[];
  value?: string;
}) {
  const id =
    `${idPrefix}-indikator_id`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
      >
        Indikator

        <span className="ml-1 text-red-500">
          *
        </span>
      </label>

      <select
        id={id}
        name="indikator_id"
        required
        defaultValue={
          value ??
          indikator[0]?.id ??
          ''
        }
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      >
        {indikator.length === 0 ? (
          <option value="">
            Belum ada indikator
          </option>
        ) : (
          indikator.map(
            (item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.kode} —{' '}
                {item.judul}
              </option>
            )
          )
        )}
      </select>
    </div>
  );
}

function JenisDokumenSelect({
  idPrefix,
  value,
}: {
  idPrefix: string;
  value: JenisDokumenAntiKorupsi;
}) {
  const id =
    `${idPrefix}-jenis`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
      >
        Jenis Dokumen

        <span className="ml-1 text-red-500">
          *
        </span>
      </label>

      <select
        id={id}
        name="jenis"
        required
        defaultValue={value}
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      >
        {JENIS_DOKUMEN_ANTI_KORUPSI.map(
          (item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          )
        )}
      </select>
    </div>
  );
}

function EmptyState({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <Icon
        size={48}
        className="mx-auto text-slate-300"
      />

      <h3 className="mt-4 font-black text-slate-700">
        {title}
      </h3>

      <p className="mt-2 text-sm font-medium text-slate-500">
        {description}
      </p>
    </div>
  );
}