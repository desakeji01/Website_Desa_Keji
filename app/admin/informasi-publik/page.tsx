// app/admin/informasi-publik/page.tsx

import Link from 'next/link';

import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileText,
  Info,
  Landmark,
  Pencil,
  Plus,
  Power,
  Save,
  Scale,
  Trash2,
  Wallet,
} from 'lucide-react';

import {
  hapusInformasiUmumAction,
  simpanPengaturanInformasiPublikAction,
  tambahInformasiUmumAction,
  toggleInformasiUmumAction,
  ubahInformasiUmumAction,
} from '@/app/admin/informasi-publik/actions';

import {
  INFORMASI_PUBLIK_DEFAULTS,
} from '@/lib/informasi-publik-defaults';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  InformasiPublikSettings,
  InformasiUmumItem,
} from '@/types/informasi-publik';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
}

interface CountRow {
  id: string | number;
}

export default async function AdminInformasiPublikPage({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;

  const [
    settingsResult,
    informasiResult,
    produkResult,
    apbdesResult,
  ] = await Promise.all([
    supabaseAdmin
      .from(
        'informasi_publik_settings'
      )
      .select('*')
      .eq(
        'informasi_key',
        'utama'
      )
      .maybeSingle(),

    supabaseAdmin
      .from(
        'informasi_umum'
      )
      .select('*')
      .order('urutan', {
        ascending: true,
      })
      .order('tahun', {
        ascending: false,
      }),

    supabaseAdmin
      .from('produk_hukum')
      .select(
        'id',
        {
          count: 'exact',
        }
      )
      .eq('aktif', true),

    supabaseAdmin
      .from(
        'apbdes_realisasi'
      )
      .select(
        'id',
        {
          count: 'exact',
        }
      )
      .eq('aktif', true),
  ]);

  if (
    settingsResult.error
  ) {
    console.error(
      'Gagal mengambil pengaturan Informasi Publik:',
      settingsResult.error
    );
  }

  if (
    informasiResult.error
  ) {
    console.error(
      'Gagal mengambil informasi umum:',
      informasiResult.error
    );
  }

  const settings:
    InformasiPublikSettings = {
    ...INFORMASI_PUBLIK_DEFAULTS,

    ...(settingsResult.data ??
      {}),
  };

  const daftarInformasi =
    (
      informasiResult.data ??
      []
    ) as InformasiUmumItem[];

  const informasiAktif =
    daftarInformasi.filter(
      (item) =>
        item.aktif
    ).length;

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] px-6 py-8 text-white shadow-xl">
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
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <FileText
                size={27}
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                Publikasi Desa
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                Informasi Publik
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80">
                Kelola halaman utama, dokumen informasi
                umum, produk hukum, dan transparansi
                APBDes Desa Keji.
              </p>
            </div>
          </div>

          <Link
            href="/informasi-publik"
            target="_blank"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white transition hover:bg-white/15"
          >
            Lihat Halaman Publik

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

          <p className="text-sm font-semibold">
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

          <p className="text-sm font-semibold">
            {params.error}
          </p>
        </div>
      )}

      {/* Statistik */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Informasi Umum"
          value={
            daftarInformasi.length
          }
          description={`${informasiAktif} aktif`}
          icon={Info}
        />

        <StatCard
          label="Produk Hukum"
          value={
            produkResult.count ??
            0
          }
          description="Dokumen aktif"
          icon={Scale}
        />

        <StatCard
          label="Data APBDes"
          value={
            apbdesResult.count ??
            0
          }
          description="Tahun aktif"
          icon={Wallet}
        />

        <StatCard
          label="Kategori Informasi"
          value={
            new Set(
              daftarInformasi.map(
                (item) =>
                  item.kategori
              )
            ).size
          }
          description="Kategori tersimpan"
          icon={Landmark}
        />
      </section>

      {/* Navigasi pengelolaan */}
      <section className="grid gap-5 md:grid-cols-2">
        <PublicModuleCard
          title="Produk Hukum"
          description="Daftar peraturan desa, keputusan kepala desa, dan dokumen hukum resmi."
          href="/informasi-publik/produk-hukum"
          icon={Scale}
        />

        <PublicModuleCard
          title="Realisasi APBDes"
          description="Informasi anggaran, realisasi, infografis, dan dokumen APBDes."
          href="/informasi-publik/apbdes/2026"
          icon={Wallet}
        />
      </section>

      {/* Pengaturan halaman utama */}
      <form
        action={
          simpanPengaturanInformasiPublikAction
        }
        className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <div className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50 to-white px-6 py-5 sm:px-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
            Tampilan Publik
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-900">
            Pengaturan Halaman Informasi Publik
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-500">
            Kelola teks hero, kartu informasi, APBDes,
            komitmen keterbukaan, dan tombol PPID.
          </p>
        </div>

        <div className="space-y-8 p-6 sm:p-7">
          <FieldSection
            title="Hero Halaman"
          >
            <TextInput
              name="badge_text"
              label="Teks Badge"
              value={
                settings.badge_text
              }
            />

            <TextInput
              name="hero_eyebrow"
              label="Label Hero"
              value={
                settings.hero_eyebrow
              }
            />

            <div className="md:col-span-2">
              <TextInput
                name="hero_title"
                label="Judul Hero"
                value={
                  settings.hero_title
                }
              />
            </div>

            <div className="md:col-span-2">
              <TextArea
                name="hero_description"
                label="Deskripsi Hero"
                value={
                  settings.hero_description
                }
              />
            </div>
          </FieldSection>

          <FieldSection
            title="Ringkasan Informasi"
          >
            <TextInput
              name="summary_documents_label"
              label="Label Dokumen"
              value={
                settings.summary_documents_label
              }
            />

            <TextInput
              name="summary_access_value"
              label="Nilai Akses"
              value={
                settings.summary_access_value
              }
            />

            <TextInput
              name="summary_access_label"
              label="Label Akses"
              value={
                settings.summary_access_label
              }
            />

            <TextInput
              name="summary_apbdes_label"
              label="Label APBDes"
              value={
                settings.summary_apbdes_label
              }
            />
          </FieldSection>

          <FieldSection
            title="Menu Informasi"
          >
            <TextInput
              name="menu_eyebrow"
              label="Label Bagian"
              value={
                settings.menu_eyebrow
              }
            />

            <TextInput
              name="menu_title"
              label="Judul Bagian"
              value={
                settings.menu_title
              }
            />

            <div className="md:col-span-2">
              <TextArea
                name="menu_description"
                label="Deskripsi Bagian"
                value={
                  settings.menu_description
                }
              />
            </div>

            <TextInput
              name="produk_hukum_title"
              label="Judul Produk Hukum"
              value={
                settings.produk_hukum_title
              }
            />

            <TextInput
              name="produk_hukum_label"
              label="Label Produk Hukum"
              value={
                settings.produk_hukum_label
              }
            />

            <div className="md:col-span-2">
              <TextArea
                name="produk_hukum_description"
                label="Deskripsi Produk Hukum"
                value={
                  settings.produk_hukum_description
                }
              />
            </div>

            <TextInput
              name="informasi_umum_title"
              label="Judul Informasi Umum"
              value={
                settings.informasi_umum_title
              }
            />

            <TextInput
              name="informasi_umum_label"
              label="Label Informasi Umum"
              value={
                settings.informasi_umum_label
              }
            />

            <div className="md:col-span-2">
              <TextArea
                name="informasi_umum_description"
                label="Deskripsi Informasi Umum"
                value={
                  settings.informasi_umum_description
                }
              />
            </div>
          </FieldSection>

          <FieldSection
            title="Bagian APBDes"
          >
            <TextInput
              name="apbdes_eyebrow"
              label="Label APBDes"
              value={
                settings.apbdes_eyebrow
              }
            />

            <TextInput
              name="apbdes_title"
              label="Judul APBDes"
              value={
                settings.apbdes_title
              }
            />

            <div className="md:col-span-2">
              <TextArea
                name="apbdes_description"
                label="Deskripsi APBDes"
                value={
                  settings.apbdes_description
                }
              />
            </div>
          </FieldSection>

          <FieldSection
            title="Komitmen Keterbukaan"
          >
            <TextInput
              name="commitment_eyebrow"
              label="Label Komitmen"
              value={
                settings.commitment_eyebrow
              }
            />

            <TextInput
              name="commitment_title"
              label="Judul Komitmen"
              value={
                settings.commitment_title
              }
            />

            <div className="md:col-span-2">
              <TextArea
                name="commitment_description"
                label="Deskripsi Komitmen"
                value={
                  settings.commitment_description
                }
              />
            </div>

            <TextInput
              name="commitment_1_title"
              label="Komitmen 1"
              value={
                settings.commitment_1_title
              }
            />

            <TextArea
              name="commitment_1_description"
              label="Deskripsi Komitmen 1"
              value={
                settings.commitment_1_description
              }
            />

            <TextInput
              name="commitment_2_title"
              label="Komitmen 2"
              value={
                settings.commitment_2_title
              }
            />

            <TextArea
              name="commitment_2_description"
              label="Deskripsi Komitmen 2"
              value={
                settings.commitment_2_description
              }
            />

            <TextInput
              name="commitment_3_title"
              label="Komitmen 3"
              value={
                settings.commitment_3_title
              }
            />

            <TextArea
              name="commitment_3_description"
              label="Deskripsi Komitmen 3"
              value={
                settings.commitment_3_description
              }
            />
          </FieldSection>

          <FieldSection
            title="Ajakan PPID"
          >
            <TextInput
              name="cta_title"
              label="Judul Ajakan"
              value={
                settings.cta_title
              }
            />

            <TextInput
              name="cta_button_label"
              label="Tulisan Tombol"
              value={
                settings.cta_button_label
              }
            />

            <div className="md:col-span-2">
              <TextArea
                name="cta_description"
                label="Deskripsi Ajakan"
                value={
                  settings.cta_description
                }
              />
            </div>

            <div className="md:col-span-2">
              <TextInput
                name="cta_button_href"
                label="Tautan Tombol"
                value={
                  settings.cta_button_href
                }
              />
            </div>
          </FieldSection>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-7 text-sm font-extrabold text-white transition hover:bg-emerald-800 sm:w-auto"
            >
              <Save size={18} />
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </form>

      {/* Tambah informasi umum */}
      <form
        action={
          tambahInformasiUmumAction
        }
        className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      >
        <div className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50 to-white px-6 py-5 sm:px-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
            Dokumen Baru
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-900">
            Tambah Informasi Umum
          </h2>
        </div>

        <div className="grid gap-5 p-6 sm:p-7 md:grid-cols-2">
          <TextInput
            name="judul"
            label="Judul Dokumen"
          />

          <TextInput
            name="kategori"
            label="Kategori"
            placeholder="Contoh: Pemerintahan"
          />

          <TextInput
            name="tahun"
            label="Tahun"
            type="number"
            value={String(
              new Date()
                .getFullYear()
            )}
          />

          <TextInput
            name="tanggal_publikasi"
            label="Tanggal Publikasi"
            type="date"
          />

          <div className="md:col-span-2">
            <TextArea
              name="deskripsi"
              label="Deskripsi"
            />
          </div>

          <div className="md:col-span-2">
            <TextInput
              name="file_url"
              label="URL Dokumen"
              placeholder="/documents/informasi/nama-dokumen.pdf"
            />
          </div>

          <TextInput
            name="file_path"
            label="Path Penyimpanan"
            required={false}
          />

          <TextInput
            name="urutan"
            label="Urutan"
            type="number"
            value="1"
          />

          <Checkbox
            name="aktif"
            label="Tampilkan pada halaman publik"
            checked
          />

          <div className="md:col-span-2 flex justify-end">
            <button className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white sm:w-auto">
              <Plus size={17} />
              Tambah Informasi
            </button>
          </div>
        </div>
      </form>

      {/* Daftar informasi */}
      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
        <div className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50 to-white px-6 py-5 sm:px-7">
          <h2 className="text-xl font-black text-slate-900">
            Daftar Informasi Umum
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-500">
            {daftarInformasi.length} dokumen tersimpan.
          </p>
        </div>

        {daftarInformasi.length ===
        0 ? (
          <div className="px-6 py-14 text-center">
            <FileText
              size={44}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-black text-slate-700">
              Belum ada informasi umum
            </h3>
          </div>
        ) : (
          <div className="grid gap-5 p-5 sm:p-7 xl:grid-cols-2">
            {daftarInformasi.map(
              (item) => (
                <article
                  key={item.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-emerald-700">
                          {item.kategori}
                        </span>

                        <span className="rounded-full bg-slate-200 px-3 py-1 text-[10px] font-extrabold text-slate-600">
                          {item.tahun}
                        </span>
                      </div>

                      <h3 className="mt-3 font-black text-slate-900">
                        {item.judul}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-sm font-medium leading-6 text-slate-500">
                        {item.deskripsi}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${
                        item.aktif
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {item.aktif
                        ? 'Aktif'
                        : 'Nonaktif'}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <form
                      action={
                        toggleInformasiUmumAction
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

                      <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-amber-100 text-xs font-extrabold text-amber-700">
                        <Power size={15} />

                        {item.aktif
                          ? 'Nonaktifkan'
                          : 'Aktifkan'}
                      </button>
                    </form>

                    <form
                      action={
                        hapusInformasiUmumAction
                      }
                    >
                      <input
                        type="hidden"
                        name="id"
                        value={item.id}
                      />

                      <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-red-100 text-xs font-extrabold text-red-700">
                        <Trash2 size={15} />
                        Hapus
                      </button>
                    </form>
                  </div>

                  <details className="mt-4 rounded-2xl border border-slate-200 bg-white">
                    <summary className="flex cursor-pointer list-none items-center justify-center gap-2 p-3 text-xs font-extrabold text-slate-700">
                      <Pencil size={15} />
                      Edit Informasi
                    </summary>

                    <form
                      action={
                        ubahInformasiUmumAction
                      }
                      className="grid gap-4 border-t border-slate-200 p-4"
                    >
                      <input
                        type="hidden"
                        name="id"
                        value={item.id}
                      />

                      <TextInput
                        name="judul"
                        label="Judul"
                        value={item.judul}
                      />

                      <TextInput
                        name="kategori"
                        label="Kategori"
                        value={item.kategori}
                      />

                      <TextInput
                        name="tahun"
                        label="Tahun"
                        type="number"
                        value={String(
                          item.tahun
                        )}
                      />

                      <TextInput
                        name="tanggal_publikasi"
                        label="Tanggal Publikasi"
                        type="date"
                        value={
                          item.tanggal_publikasi ??
                          ''
                        }
                        required={false}
                      />

                      <TextArea
                        name="deskripsi"
                        label="Deskripsi"
                        value={
                          item.deskripsi
                        }
                      />

                      <TextInput
                        name="file_url"
                        label="URL Dokumen"
                        value={
                          item.file_url
                        }
                      />

                      <TextInput
                        name="file_path"
                        label="Path Penyimpanan"
                        value={
                          item.file_path ??
                          ''
                        }
                        required={false}
                      />

                      <TextInput
                        name="urutan"
                        label="Urutan"
                        type="number"
                        value={String(
                          item.urutan
                        )}
                      />

                      <Checkbox
                        name="aktif"
                        label="Tampilkan pada publik"
                        checked={
                          item.aktif
                        }
                      />

                      <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-800 text-xs font-extrabold text-white">
                        <Save size={16} />
                        Simpan Perubahan
                      </button>
                    </form>
                  </details>
                </article>
              )
            )}
          </div>
        )}
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
  icon: typeof Info;
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

          <p className="mt-2 text-xs font-bold text-emerald-700">
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

function PublicModuleCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: typeof Scale;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Icon size={22} />
        </div>

        <div>
          <h2 className="font-black text-slate-900">
            {title}
          </h2>

          <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
            {description}
          </p>

          <span className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-emerald-700">
            Lihat halaman
            <ExternalLink size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function FieldSection({
  title,
  children,
}: {
  title: string;
  children:
    React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-4 border-b border-slate-100 pb-3 text-sm font-black uppercase tracking-[0.1em] text-emerald-700">
        {title}
      </h3>

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
}: {
  name: string;
  label: string;
  value?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        min={
          type === 'number'
            ? 1
            : undefined
        }
        defaultValue={value}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}

function TextArea({
  name,
  label,
  value = '',
}: {
  name: string;
  label: string;
  value?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500"
      >
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        rows={4}
        required
        defaultValue={value}
        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-7 text-slate-800 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}

function Checkbox({
  name,
  label,
  checked,
}: {
  name: string;
  label: string;
  checked: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={checked}
        className="h-4 w-4 accent-emerald-700"
      />

      <span className="text-sm font-bold text-slate-700">
        {label}
      </span>
    </label>
  );
}