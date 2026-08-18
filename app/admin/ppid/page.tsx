// app/admin/ppid/page.tsx

import Link from 'next/link';

import type {
  ReactNode,
} from 'react';

import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileCheck2,
  FileLock2,
  FileSearch,
  Landmark,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Power,
  Save,
  Trash2,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';

import {
  hapusPengurusPpidAction,
  simpanPpidSettingsAction,
  simpanProfilPpidAction,
  tambahPengurusPpidAction,
  togglePengurusPpidAction,
  ubahPengurusPpidAction,
} from '@/app/admin/ppid/actions';

import {
  getPpidSettings,
} from '@/lib/ppid-settings';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  PengurusPpid,
  ProfilPpid,
} from '@/types/ppid';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
}

const PROFIL_DEFAULTS:
  ProfilPpid = {
  id: '',

  profil_key:
    'utama',

  judul:
    'Profil PPID Desa Keji',

  deskripsi:
    'Pejabat Pengelola Informasi dan Dokumentasi Desa Keji bertanggung jawab mengelola, mendokumentasikan, menyediakan, serta memberikan pelayanan informasi publik kepada masyarakat.',

  email: null,

  telepon: null,

  alamat:
    'Kantor Pemerintah Desa Keji, Kecamatan Ungaran Barat, Kabupaten Semarang',

  jam_layanan:
    'Senin–Kamis 08.00–15.00 WIB dan Jumat 08.00–11.30 WIB',

  aktif: true,

  created_at: '',

  updated_at: '',
};

function safeString(
  value: unknown,
  fallback = ''
) {
  if (
    typeof value !==
    'string'
  ) {
    return fallback;
  }

  return (
    value.trim() ||
    fallback
  );
}

function nullableString(
  value: unknown
) {
  if (
    typeof value !==
    'string'
  ) {
    return null;
  }

  return (
    value.trim() ||
    null
  );
}

function normalizeProfil(
  value: unknown
): ProfilPpid {
  if (
    !value ||
    typeof value !==
      'object' ||
    Array.isArray(value)
  ) {
    return {
      ...PROFIL_DEFAULTS,
    };
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  return {
    id:
      safeString(
        row.id,
        ''
      ),

    profil_key:
      safeString(
        row.profil_key,
        'utama'
      ),

    judul:
      safeString(
        row.judul,
        PROFIL_DEFAULTS.judul
      ),

    deskripsi:
      safeString(
        row.deskripsi,
        PROFIL_DEFAULTS.deskripsi
      ),

    email:
      nullableString(
        row.email
      ),

    telepon:
      nullableString(
        row.telepon
      ),

    alamat:
      nullableString(
        row.alamat
      ),

    jam_layanan:
      nullableString(
        row.jam_layanan
      ),

    aktif:
      typeof row.aktif ===
      'boolean'
        ? row.aktif
        : true,

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

function normalizePengurus(
  value: unknown
): PengurusPpid[] {
  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value
    .map(
      (
        item
      ): PengurusPpid => {
        const row =
          item as Record<
            string,
            unknown
          >;

        return {
          id:
            safeString(
              row.id
            ),

          nama:
            safeString(
              row.nama
            ),

          jabatan_desa:
            safeString(
              row.jabatan_desa
            ),

          jabatan_ppid:
            safeString(
              row.jabatan_ppid
            ),

          urutan:
            Number(
              row.urutan ??
                0
            ),

          aktif:
            typeof row.aktif ===
            'boolean'
              ? row.aktif
              : true,

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
    )
    .filter(
      (item) =>
        item.id.length > 0 &&
        item.nama.length > 0
    );
}

function getInitials(
  nama: string
) {
  const initials =
    nama
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (word) =>
          word
            .charAt(0)
            .toUpperCase()
      )
      .join('');

  return (
    initials ||
    'PP'
  );
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

export default async function AdminPpidPage({
  searchParams,
}: PageProps) {
  const [
    settings,
    params,
    profilResult,
    pengurusResult,
  ] = await Promise.all([
    getPpidSettings(),

    searchParams,

    supabaseAdmin
      .from(
        'profil_ppid'
      )
      .select(`
        id,
        profil_key,
        judul,
        deskripsi,
        email,
        telepon,
        alamat,
        jam_layanan,
        aktif,
        created_at,
        updated_at
      `)
      .eq(
        'profil_key',
        'utama'
      )
      .maybeSingle(),

    supabaseAdmin
      .from(
        'ppid_pengurus'
      )
      .select(`
        id,
        nama,
        jabatan_desa,
        jabatan_ppid,
        urutan,
        aktif,
        created_at,
        updated_at
      `)
      .order(
        'urutan',
        {
          ascending: true,
        }
      )
      .order(
        'created_at',
        {
          ascending: true,
        }
      ),
  ]);

  if (
    profilResult.error
  ) {
    console.error(
      'Gagal mengambil profil PPID pada admin:',
      {
        message:
          profilResult.error
            .message,

        code:
          profilResult.error
            .code,

        details:
          profilResult.error
            .details,

        hint:
          profilResult.error
            .hint,
      }
    );
  }

  if (
    pengurusResult.error
  ) {
    console.error(
      'Gagal mengambil pengurus PPID pada admin:',
      {
        message:
          pengurusResult.error
            .message,

        code:
          pengurusResult.error
            .code,

        details:
          pengurusResult.error
            .details,

        hint:
          pengurusResult.error
            .hint,
      }
    );
  }

  const profil =
    normalizeProfil(
      profilResult.data
    );

  const daftarPengurus =
    normalizePengurus(
      pengurusResult.data
    );

  const pengurusAktif =
    daftarPengurus.filter(
      (item) =>
        item.aktif
    ).length;

  const pengurusNonaktif =
    daftarPengurus.length -
    pengurusAktif;

  const jumlahJabatan =
    new Set(
      daftarPengurus
        .map(
          (item) =>
            item.jabatan_ppid
        )
        .filter(Boolean)
    ).size;

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] px-6 py-8 text-white shadow-xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.13) 1.5px, transparent 1.5px)',

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
              <FileSearch
                size={27}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                Keterbukaan Informasi
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                PPID Desa Keji
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                Kelola pengaturan umum,
                profil sekretariat,
                susunan pengurus, poster,
                formulir, dan tampilan
                seluruh halaman publik
                PPID.
              </p>
            </div>
          </div>

          <Link
            href="/ppid/profil"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white transition hover:bg-white/15"
          >
            Lihat Profil PPID

            <ExternalLink
              size={16}
            />
          </Link>
        </div>
      </section>

      {/* Status */}
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
          label="Total Pengurus"
          value={
            daftarPengurus.length
          }
          description="Seluruh data pengurus"
          icon={Users}
        />

        <StatCard
          label="Pengurus Aktif"
          value={pengurusAktif}
          description="Ditampilkan pada publik"
          icon={CheckCircle2}
        />

        <StatCard
          label="Pengurus Nonaktif"
          value={
            pengurusNonaktif
          }
          description="Tidak ditampilkan"
          icon={Power}
        />

        <StatCard
          label="Jabatan PPID"
          value={
            jumlahJabatan
          }
          description="Jenis jabatan tersimpan"
          icon={Building2}
        />
      </section>

      {/* Halaman publik */}
      <section>
        <div className="mb-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
            Halaman Publik
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-900">
            Daftar Halaman PPID
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <PageCard
            title="Profil PPID"
            description="Profil, kontak, dan struktur pengurus."
            href="/ppid/profil"
            icon={Users}
          />

          <PageCard
            title="Apa itu PPID"
            description="Pengertian, tujuan, tugas, dan dasar hukum."
            href="/ppid/apa-itu-ppid"
            icon={Landmark}
          />

          <PageCard
            title="Klasifikasi Informasi"
            description="Informasi terbuka dan dikecualikan."
            href="/ppid/klasifikasi-informasi"
            icon={FileLock2}
          />

          <PageCard
            title="Permohonan Informasi"
            description="Prosedur dan formulir permohonan."
            href="/ppid/permohonan-informasi"
            icon={FileCheck2}
          />

          <PageCard
            title="Pengajuan Keberatan"
            description="Prosedur dan formulir keberatan."
            href="/ppid/pengajuan-keberatan"
            icon={FileSearch}
          />
        </div>
      </section>

      {/* Profil PPID */}
      <form
        id="profil-ppid"
        action={
          simpanProfilPpidAction
        }
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-cyan-200 bg-white shadow-sm"
      >
        <div className="border-b border-cyan-100 bg-gradient-to-r from-cyan-50 to-white px-6 py-5 sm:px-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-700 text-white">
              <Landmark
                size={23}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-cyan-700">
                Profil Publik
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                Profil PPID
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Data ini disimpan pada tabel{' '}
                <code className="rounded bg-cyan-100 px-1.5 py-0.5 font-bold text-cyan-800">
                  profil_ppid
                </code>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-6 sm:p-7 md:grid-cols-2">
          <div className="md:col-span-2">
            <TextInput
              name="profil_judul"
              label="Judul Profil"
              value={
                profil.judul
              }
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              name="profil_deskripsi"
              label="Deskripsi Profil"
              value={
                profil.deskripsi
              }
              rows={6}
            />
          </div>

          <TextInput
            name="profil_email"
            label="Email Profil"
            type="email"
            value={
              profil.email ??
              ''
            }
            required={false}
          />

          <TextInput
            name="profil_telepon"
            label="Nomor Telepon"
            value={
              profil.telepon ??
              ''
            }
            required={false}
          />

          <div className="md:col-span-2">
            <TextArea
              name="profil_alamat"
              label="Alamat Sekretariat"
              value={
                profil.alamat ??
                settings.office_address
              }
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              name="profil_jam_layanan"
              label="Jam Pelayanan"
              value={
                profil.jam_layanan ??
                settings.office_hours
              }
              rows={3}
            />
          </div>

          <Checkbox
            name="profil_aktif"
            label="Aktifkan Profil PPID"
            description="Profil akan ditampilkan pada halaman publik."
            checked={
              profil.aktif
            }
          />

          <div className="flex items-end justify-start md:justify-end">
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-700 px-6 text-sm font-extrabold text-white transition hover:bg-cyan-800 md:w-auto"
            >
              <Save size={17} />

              Simpan Profil
            </button>
          </div>
        </div>
      </form>

      {/* Pengurus PPID */}
      <section
        id="pengurus-ppid"
        className="scroll-mt-24 space-y-6"
      >
        {/* Tambah pengurus */}
        <form
          action={
            tambahPengurusPpidAction
          }
          className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
        >
          <div className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50 to-white px-6 py-5 sm:px-7">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                <UserPlus
                  size={23}
                />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                  Struktur Organisasi
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900">
                  Tambah Pengurus PPID
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  Data disimpan pada tabel{' '}
                  <code className="rounded bg-emerald-100 px-1.5 py-0.5 font-bold text-emerald-800">
                    ppid_pengurus
                  </code>
                  .
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6 sm:p-7 md:grid-cols-2">
            <TextInput
              name="nama"
              label="Nama Pengurus"
              placeholder="Nama lengkap"
            />

            <TextInput
              name="jabatan_desa"
              label="Jabatan Desa"
              placeholder="Contoh: Kepala Desa"
            />

            <TextInput
              name="jabatan_ppid"
              label="Jabatan dalam PPID"
              placeholder="Contoh: Atasan PPID"
            />

            <TextInput
              name="urutan"
              label="Nomor Urutan"
              type="number"
              value={String(
                daftarPengurus.length +
                  1
              )}
              min={1}
            />

            <Checkbox
              name="aktif"
              label="Pengurus Aktif"
              description="Tampilkan pengurus pada halaman publik."
              checked
            />

            <div className="flex items-end justify-start md:justify-end">
              <button
                type="submit"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-800 md:w-auto"
              >
                <UserPlus
                  size={17}
                />

                Tambah Pengurus
              </button>
            </div>
          </div>
        </form>

        {/* Daftar pengurus */}
        <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50 to-white px-6 py-5 sm:px-7">
            <h2 className="text-xl font-black text-slate-900">
              Daftar Pengurus PPID
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-500">
              {daftarPengurus.length}{' '}
              pengurus tersimpan.
            </p>
          </div>

          {daftarPengurus.length ===
          0 ? (
            <div className="px-6 py-14 text-center">
              <Users
                size={46}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 font-black text-slate-700">
                Belum ada pengurus PPID
              </h3>

              <p className="mt-2 text-sm font-medium text-slate-500">
                Gunakan formulir di atas
                untuk menambahkan pengurus.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 p-5 sm:p-7 xl:grid-cols-2">
              {daftarPengurus.map(
                (
                  pengurus,
                  index
                ) => (
                  <article
                    key={
                      pengurus.id
                    }
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-sm font-black text-emerald-700">
                        {getInitials(
                          pengurus.nama
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-200 px-3 py-1 text-[10px] font-extrabold text-slate-600">
                            Urutan{' '}
                            {
                              pengurus.urutan
                            }
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${
                              pengurus.aktif
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {pengurus.aktif
                              ? 'Aktif'
                              : 'Nonaktif'}
                          </span>
                        </div>

                        <h3 className="mt-3 text-lg font-black text-slate-900">
                          {
                            pengurus.nama
                          }
                        </h3>

                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          {
                            pengurus.jabatan_desa
                          }
                        </p>

                        <p className="mt-3 inline-flex rounded-xl bg-cyan-100 px-3 py-2 text-xs font-extrabold text-cyan-700">
                          {
                            pengurus.jabatan_ppid
                          }
                        </p>

                        <p className="mt-3 text-[11px] font-semibold text-slate-400">
                          Data ke-{index +
                            1} · Diperbarui{' '}
                          {formatTanggal(
                            pengurus.updated_at
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Tombol status dan hapus */}
                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <form
                        action={
                          togglePengurusPpidAction
                        }
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={
                            pengurus.id
                          }
                        />

                        <input
                          type="hidden"
                          name="aktif"
                          value={String(
                            !pengurus.aktif
                          )}
                        />

                        <button
                          type="submit"
                          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-amber-100 px-3 text-xs font-extrabold text-amber-700 transition hover:bg-amber-200"
                        >
                          <Power
                            size={15}
                          />

                          {pengurus.aktif
                            ? 'Nonaktifkan'
                            : 'Aktifkan'}
                        </button>
                      </form>

                      <form
                        action={
                          hapusPengurusPpidAction
                        }
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={
                            pengurus.id
                          }
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
                    <details className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      <summary className="flex cursor-pointer list-none items-center justify-center gap-2 p-3 text-xs font-extrabold text-slate-700">
                        <Pencil
                          size={15}
                        />

                        Edit Pengurus
                      </summary>

                      <form
                        action={
                          ubahPengurusPpidAction
                        }
                        className="grid gap-4 border-t border-slate-200 p-4"
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={
                            pengurus.id
                          }
                        />

                        <TextInput
                          name="nama"
                          label="Nama Pengurus"
                          value={
                            pengurus.nama
                          }
                        />

                        <TextInput
                          name="jabatan_desa"
                          label="Jabatan Desa"
                          value={
                            pengurus.jabatan_desa
                          }
                        />

                        <TextInput
                          name="jabatan_ppid"
                          label="Jabatan dalam PPID"
                          value={
                            pengurus.jabatan_ppid
                          }
                        />

                        <TextInput
                          name="urutan"
                          label="Nomor Urutan"
                          type="number"
                          value={String(
                            pengurus.urutan
                          )}
                          min={1}
                        />

                        <Checkbox
                          name="aktif"
                          label="Pengurus Aktif"
                          description="Tampilkan pada halaman publik."
                          checked={
                            pengurus.aktif
                          }
                        />

                        <button
                          type="submit"
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-800 px-5 text-xs font-extrabold text-white transition hover:bg-slate-900"
                        >
                          <Save
                            size={16}
                          />

                          Simpan Perubahan
                        </button>
                      </form>
                    </details>
                  </article>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Pengaturan umum */}
      <form
        id="pengaturan-umum"
        action={
          simpanPpidSettingsAction
        }
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <div className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50 to-white px-6 py-5 sm:px-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
            Pengaturan Publik
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-900">
            Konten Umum Halaman PPID
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-500">
            Data berikut disimpan pada
            tabel{' '}
            <code className="rounded bg-emerald-100 px-1.5 py-0.5 font-bold text-emerald-800">
              ppid_settings
            </code>
            .
          </p>
        </div>

        <div className="space-y-10 p-6 sm:p-7">
          <FormSection
            title="Identitas Umum PPID"
            description="Digunakan pada seluruh halaman PPID dan sebagai fallback pada Profil PPID."
          >
            <TextInput
              name="header_label"
              label="Label Header"
              value={
                settings.header_label
              }
            />

            <TextInput
              name="office_name"
              label="Nama PPID"
              value={
                settings.office_name
              }
            />

            <div className="md:col-span-2">
              <TextArea
                name="office_address"
                label="Alamat Pelayanan"
                value={
                  settings.office_address
                }
              />
            </div>

            <TextInput
              name="office_email"
              label="Email"
              type="email"
              value={
                settings.office_email
              }
            />

            <TextInput
              name="office_phone"
              label="Nomor Telepon"
              value={
                settings.office_phone
              }
            />

            <div className="md:col-span-2">
              <TextArea
                name="office_hours"
                label="Jam Pelayanan"
                value={
                  settings.office_hours
                }
              />
            </div>
          </FormSection>

          <FormSection
            title="Halaman Apa itu PPID"
            description="Kelola judul, deskripsi halaman, dan bagian hero."
          >
            <TextInput
              name="apa_title"
              label="Judul Halaman"
              value={
                settings.apa_title
              }
            />

            <TextInput
              name="apa_hero_label"
              label="Label Hero"
              value={
                settings.apa_hero_label
              }
            />

            <div className="md:col-span-2">
              <TextArea
                name="apa_description"
                label="Deskripsi Halaman"
                value={
                  settings.apa_description
                }
              />
            </div>

            <div className="md:col-span-2">
              <TextInput
                name="apa_hero_title"
                label="Judul Hero"
                value={
                  settings.apa_hero_title
                }
              />
            </div>

            <div className="md:col-span-2">
              <TextArea
                name="apa_hero_description"
                label="Deskripsi Hero"
                value={
                  settings.apa_hero_description
                }
              />
            </div>
          </FormSection>

          <FormSection
            title="Halaman Klasifikasi Informasi"
            description="Kelola header dan hero klasifikasi informasi."
          >
            <TextInput
              name="klasifikasi_title"
              label="Judul Halaman"
              value={
                settings.klasifikasi_title
              }
            />

            <TextInput
              name="klasifikasi_hero_label"
              label="Label Hero"
              value={
                settings.klasifikasi_hero_label
              }
            />

            <div className="md:col-span-2">
              <TextArea
                name="klasifikasi_description"
                label="Deskripsi Halaman"
                value={
                  settings.klasifikasi_description
                }
              />
            </div>

            <div className="md:col-span-2">
              <TextInput
                name="klasifikasi_hero_title"
                label="Judul Hero"
                value={
                  settings.klasifikasi_hero_title
                }
              />
            </div>

            <div className="md:col-span-2">
              <TextArea
                name="klasifikasi_hero_description"
                label="Deskripsi Hero"
                value={
                  settings.klasifikasi_hero_description
                }
              />
            </div>
          </FormSection>

          <FormSection
            title="Halaman Permohonan Informasi"
            description="Kelola header, hero, poster, dan file formulir permohonan."
          >
            <TextInput
              name="permohonan_title"
              label="Judul Halaman"
              value={
                settings.permohonan_title
              }
            />

            <TextInput
              name="permohonan_hero_label"
              label="Label Hero"
              value={
                settings.permohonan_hero_label
              }
            />

            <div className="md:col-span-2">
              <TextArea
                name="permohonan_description"
                label="Deskripsi Halaman"
                value={
                  settings.permohonan_description
                }
              />
            </div>

            <div className="md:col-span-2">
              <TextInput
                name="permohonan_hero_title"
                label="Judul Hero"
                value={
                  settings.permohonan_hero_title
                }
              />
            </div>

            <div className="md:col-span-2">
              <TextArea
                name="permohonan_hero_description"
                label="Deskripsi Hero"
                value={
                  settings.permohonan_hero_description
                }
              />
            </div>

            <div className="md:col-span-2">
              <TextInput
                name="permohonan_poster_url"
                label="URL atau Path Poster"
                value={
                  settings.permohonan_poster_url
                }
              />
            </div>

            <div className="md:col-span-2">
              <TextInput
                name="permohonan_poster_alt"
                label="Alt Poster"
                value={
                  settings.permohonan_poster_alt
                }
              />
            </div>

            <div className="md:col-span-2">
              <TextInput
                name="permohonan_form_url"
                label="URL atau Path Formulir"
                value={
                  settings.permohonan_form_url
                }
              />
            </div>
          </FormSection>

          <FormSection
            title="Halaman Pengajuan Keberatan"
            description="Kelola header, hero, poster, dan file formulir keberatan."
          >
            <TextInput
              name="keberatan_title"
              label="Judul Halaman"
              value={
                settings.keberatan_title
              }
            />

            <TextInput
              name="keberatan_hero_label"
              label="Label Hero"
              value={
                settings.keberatan_hero_label
              }
            />

            <div className="md:col-span-2">
              <TextArea
                name="keberatan_description"
                label="Deskripsi Halaman"
                value={
                  settings.keberatan_description
                }
              />
            </div>

            <div className="md:col-span-2">
              <TextInput
                name="keberatan_hero_title"
                label="Judul Hero"
                value={
                  settings.keberatan_hero_title
                }
              />
            </div>

            <div className="md:col-span-2">
              <TextArea
                name="keberatan_hero_description"
                label="Deskripsi Hero"
                value={
                  settings.keberatan_hero_description
                }
              />
            </div>

            <div className="md:col-span-2">
              <TextInput
                name="keberatan_poster_url"
                label="URL atau Path Poster"
                value={
                  settings.keberatan_poster_url
                }
              />
            </div>

            <div className="md:col-span-2">
              <TextInput
                name="keberatan_poster_alt"
                label="Alt Poster"
                value={
                  settings.keberatan_poster_alt
                }
              />
            </div>

            <div className="md:col-span-2">
              <TextInput
                name="keberatan_form_url"
                label="URL atau Path Formulir"
                value={
                  settings.keberatan_form_url
                }
              />
            </div>
          </FormSection>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-7 text-sm font-extrabold text-white shadow-lg transition hover:bg-emerald-800 sm:w-auto"
            >
              <Save
                size={18}
              />

              Simpan Pengaturan Umum
            </button>
          </div>
        </div>
      </form>

      {/* Kontak ringkas */}
      <section className="grid gap-5 md:grid-cols-3">
        <InfoCard
          icon={MapPin}
          title="Alamat Pelayanan"
          description={
            settings.office_address
          }
        />

        <InfoCard
          icon={Mail}
          title="Email PPID"
          description={
            settings.office_email
          }
        />

        <InfoCard
          icon={Phone}
          title="Nomor Telepon"
          description={
            settings.office_phone
          }
        />
      </section>
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

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Icon
            size={22}
          />
        </div>
      </div>
    </article>
  );
}

function PageCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-h-[180px] flex-col rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
          <Icon
            size={21}
          />
        </div>

        <ExternalLink
          size={15}
          className="text-slate-300 transition group-hover:text-emerald-600"
        />
      </div>

      <h2 className="mt-4 font-black text-slate-900">
        {title}
      </h2>

      <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
        {description}
      </p>

      <span className="mt-auto pt-4 text-xs font-extrabold text-emerald-700">
        Lihat halaman
      </span>
    </Link>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-5 border-b border-slate-100 pb-4">
        <h3 className="text-sm font-black uppercase tracking-[0.12em] text-emerald-700">
          {title}
        </h3>

        <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function TextInput({
  name,
  label,
  value = '',
  placeholder,
  type = 'text',
  required = true,
  min,
}: {
  name: string;
  label: string;
  value?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: number;
}) {
  return (
    <div>
      <label
        htmlFor={name}
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
        id={name}
        name={name}
        type={type}
        required={required}
        min={min}
        defaultValue={value}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}

function TextArea({
  name,
  label,
  value = '',
  rows = 4,
  required = true,
}: {
  name: string;
  label: string;
  value?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
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
        id={name}
        name={name}
        rows={rows}
        required={required}
        defaultValue={value}
        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-7 text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}

function Checkbox({
  name,
  label,
  description,
  checked,
}: {
  name: string;
  label: string;
  description: string;
  checked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <input
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

function InfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
        <Icon
          size={21}
        />
      </div>

      <h2 className="mt-4 font-black text-slate-900">
        {title}
      </h2>

      <p className="mt-2 break-words text-sm font-medium leading-6 text-slate-500">
        {description}
      </p>
    </article>
  );
}