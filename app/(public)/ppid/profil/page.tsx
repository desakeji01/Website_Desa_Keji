// app/(public)/ppid/profil/page.tsx

import type {
  Metadata,
} from 'next';

import {
  Building2,
  Clock3,
  FileCheck2,
  FileSearch,
  Landmark,
  Mail,
  MapPin,
  Network,
  Phone,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';

import SidebarLayanan from '@/components/SidebarLayanan';
import SidebarTilikArkeji from '@/components/SidebarTilikArkeji';

import {
  getPpidSettings,
} from '@/lib/ppid-settings';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  PilihanLayanan,
} from '@/types/layanan';

import type {
  PengurusPpid,
  ProfilPpid,
} from '@/types/ppid';

export const metadata: Metadata = {
  title:
    'Profil PPID Desa Keji | SIJI',

  description:
    'Profil, tugas, struktur organisasi, pengurus, dan pelayanan PPID Desa Keji.',
};

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

interface LayananRow {
  id:
    | number
    | string
    | null;

  nama:
    | string
    | null;

  slug:
    | string
    | null;
}

interface TugasPpid {
  title: string;
  description: string;
  icon: LucideIcon;
}

const tugasPpid:
  TugasPpid[] = [
  {
    title:
      'Pengumpulan Informasi',

    description:
      'Menghimpun informasi dan dokumentasi dari setiap bagian Pemerintah Desa Keji.',

    icon: FileSearch,
  },
  {
    title:
      'Pengelolaan Dokumen',

    description:
      'Menyimpan, menata, dan memutakhirkan dokumen informasi publik secara berkala.',

    icon: FileCheck2,
  },
  {
    title:
      'Pelayanan Informasi',

    description:
      'Memberikan informasi yang dibutuhkan masyarakat sesuai prosedur pelayanan.',

    icon: Users,
  },
  {
    title:
      'Perlindungan Informasi',

    description:
      'Menjaga informasi pribadi dan informasi yang dikecualikan berdasarkan ketentuan.',

    icon: ShieldCheck,
  },
];

const fallbackProfil:
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
  value: unknown
) {
  return String(
    value ?? ''
  ).trim();
}

function getSafeString(
  value: unknown,
  fallback: string
) {
  const text =
    safeString(value);

  return text || fallback;
}

function getNullableString(
  value: unknown
) {
  const text =
    safeString(value);

  return text || null;
}

function safeInteger(
  value: unknown,
  fallback = 0
) {
  const number =
    Number(value);

  if (
    !Number.isInteger(
      number
    ) ||
    number < 0
  ) {
    return fallback;
  }

  return number;
}

function normalizeProfil(
  data: unknown
): ProfilPpid {
  if (
    !data ||
    typeof data !==
      'object' ||
    Array.isArray(data)
  ) {
    return {
      ...fallbackProfil,
    };
  }

  const row =
    data as Record<
      string,
      unknown
    >;

  return {
    id:
      getSafeString(
        row.id,
        fallbackProfil.id
      ),

    profil_key:
      getSafeString(
        row.profil_key,
        fallbackProfil.profil_key
      ),

    judul:
      getSafeString(
        row.judul,
        fallbackProfil.judul
      ),

    deskripsi:
      getSafeString(
        row.deskripsi,
        fallbackProfil.deskripsi
      ),

    email:
      getNullableString(
        row.email
      ),

    telepon:
      getNullableString(
        row.telepon
      ),

    alamat:
      getNullableString(
        row.alamat
      ),

    jam_layanan:
      getNullableString(
        row.jam_layanan
      ),

    aktif:
      typeof row.aktif ===
      'boolean'
        ? row.aktif
        : fallbackProfil.aktif,

    created_at:
      getSafeString(
        row.created_at,
        ''
      ),

    updated_at:
      getSafeString(
        row.updated_at,
        ''
      ),
  };
}

function normalizePengurus(
  data: unknown
): PengurusPpid[] {
  if (
    !Array.isArray(data)
  ) {
    return [];
  }

  return data
    .map((item) => {
      if (
        !item ||
        typeof item !==
          'object' ||
        Array.isArray(item)
      ) {
        return null;
      }

      const row =
        item as Record<
          string,
          unknown
        >;

      const id =
        safeString(
          row.id
        );

      const nama =
        safeString(
          row.nama
        );

      if (
        !id ||
        !nama
      ) {
        return null;
      }

      const pengurus:
        PengurusPpid = {
        id,

        nama,

        jabatan_desa:
          getSafeString(
            row.jabatan_desa,
            'Jabatan desa belum tersedia'
          ),

        jabatan_ppid:
          getSafeString(
            row.jabatan_ppid,
            'Pengurus PPID'
          ),

        urutan:
          safeInteger(
            row.urutan
          ),

        aktif:
          typeof row.aktif ===
          'boolean'
            ? row.aktif
            : true,

        created_at:
          getSafeString(
            row.created_at,
            ''
          ),

        updated_at:
          getSafeString(
            row.updated_at,
            ''
          ),
      };

      return pengurus;
    })
    .filter(
      (
        item
      ): item is PengurusPpid =>
        item !== null
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
      .map((kata) =>
        kata
          .charAt(0)
          .toUpperCase()
      )
      .join('');

  return initials || 'PP';
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

function formatAngka(
  value: number
) {
  return new Intl.NumberFormat(
    'id-ID'
  ).format(
    Number.isFinite(value)
      ? value
      : 0
  );
}

export default async function ProfilPpidPage() {
  const [
    ppid,
    profilResult,
    pengurusResult,
    layananResult,
  ] = await Promise.all([
    getPpidSettings(),

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
      .eq(
        'aktif',
        true
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
      .eq(
        'aktif',
        true
      )
      .order(
        'urutan',
        {
          ascending: true,
          nullsFirst: false,
        }
      )
      .order(
        'created_at',
        {
          ascending: true,
        }
      ),

    supabaseAdmin
      .from('layanan')
      .select(`
        id,
        nama,
        slug
      `)
      .eq(
        'aktif',
        true
      )
      .order(
        'urutan',
        {
          ascending: true,
          nullsFirst: false,
        }
      )
      .order(
        'nama',
        {
          ascending: true,
        }
      ),
  ]);

  if (
    profilResult.error
  ) {
    console.error(
      'Gagal mengambil profil PPID:',
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
      'Gagal mengambil pengurus PPID:',
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

  if (
    layananResult.error
  ) {
    console.error(
      'Gagal mengambil layanan pada halaman Profil PPID:',
      {
        message:
          layananResult.error
            .message,

        code:
          layananResult.error
            .code,

        details:
          layananResult.error
            .details,

        hint:
          layananResult.error
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

  const daftarLayanan:
    PilihanLayanan[] = (
      (
        layananResult.data ??
        []
      ) as LayananRow[]
    )
      .map((item) => {
        const id =
          Number(item.id);

        const nama =
          safeString(
            item.nama
          );

        const slug =
          safeString(
            item.slug
          );

        return {
          id,
          nama,
          slug,
        };
      })
      .filter(
        (item) =>
          Number.isInteger(
            item.id
          ) &&
          item.id > 0 &&
          item.nama.length >
            0 &&
          item.slug.length >
            0
      );

  const jumlahBidang =
    new Set(
      daftarPengurus
        .map((item) =>
          safeString(
            item.jabatan_ppid
          )
        )
        .filter(Boolean)
    ).size;

  const alamatPpid =
    safeString(
      profil.alamat
    ) ||
    safeString(
      ppid.office_address
    ) ||
    'Kantor Pemerintah Desa Keji';

  const emailPpid =
    safeString(
      profil.email
    ) ||
    safeString(
      ppid.office_email
    ) ||
    'Belum tersedia';

  const teleponPpid =
    safeString(
      profil.telepon
    ) ||
    safeString(
      ppid.office_phone
    ) ||
    'Belum tersedia';

  const jamLayananPpid =
    safeString(
      profil.jam_layanan
    ) ||
    safeString(
      ppid.office_hours
    ) ||
    'Belum tersedia';

  const namaKantor =
    safeString(
      ppid.office_name
    ) ||
    'PPID Desa Keji';

  const labelHeader =
    safeString(
      ppid.header_label
    ) ||
    'Pejabat Pengelola Informasi dan Dokumentasi';

  const statusPpid =
    profil.aktif
      ? 'Aktif'
      : 'Nonaktif';

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Halaman */}
        <header className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 px-6 py-8 text-white shadow-lg sm:px-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',

              backgroundSize:
                '25px 25px',
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[52px] border-white/[0.04]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-emerald-400/[0.06] blur-2xl"
          />

          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <Landmark
                size={24}
              />
            </div>

            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
              {labelHeader}
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              {profil.judul}
            </h1>

            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-emerald-50/80 sm:text-base">
              Profil, struktur organisasi,
              tugas, pengurus, serta
              pelayanan informasi publik{' '}
              {namaKantor}.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <HeaderBadge
                label={`${formatAngka(
                  daftarPengurus.length
                )} pengurus aktif`}
              />

              <HeaderBadge
                label={`${formatAngka(
                  jumlahBidang
                )} jabatan PPID`}
              />

              <HeaderBadge
                label={`Status ${statusPpid}`}
              />
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Konten Utama */}
          <main className="min-w-0 space-y-8 lg:w-2/3">
            {/* Hero Profil */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 p-6 text-white shadow-xl sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,0.23) 1px, transparent 1px)',

                  backgroundSize:
                    '26px 26px',
                }}
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[46px] border-white/[0.05]"
              />

              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur">
                  <Network
                    size={31}
                  />
                </div>

                <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-200">
                  {namaKantor}
                </p>

                <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
                  {profil.judul}
                </h2>

                <p className="mt-4 max-w-3xl whitespace-pre-line text-sm font-medium leading-7 text-emerald-50/85 sm:text-base sm:leading-8">
                  {profil.deskripsi}
                </p>

                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  <HeroStat
                    label="Pengurus Aktif"
                    value={
                      daftarPengurus.length
                    }
                    icon={Users}
                  />

                  <HeroStat
                    label="Jabatan PPID"
                    value={
                      jumlahBidang
                    }
                    icon={Building2}
                  />

                  <HeroStat
                    label="Status"
                    value={
                      statusPpid
                    }
                    icon={ShieldCheck}
                  />
                </div>
              </div>
            </section>

            {/* Tentang PPID */}
            <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Landmark
                    size={23}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                    Tentang Kami
                  </p>

                  <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
                    {namaKantor}
                  </h2>

                  <div className="mt-4 space-y-4 text-sm font-medium leading-7 text-slate-600">
                    <p>
                      PPID Desa Keji
                      merupakan unsur
                      Pemerintah Desa yang
                      bertanggung jawab
                      terhadap pengelolaan
                      dan pelayanan informasi
                      publik.
                    </p>

                    <p>
                      Pelayanan PPID
                      bertujuan memberikan
                      akses informasi yang
                      mudah, cepat, tepat,
                      dan dapat
                      dipertanggungjawabkan
                      kepada masyarakat.
                    </p>

                    <p>
                      Informasi yang dikelola
                      meliputi informasi
                      pemerintahan,
                      pembangunan, pelayanan
                      publik, produk hukum,
                      anggaran, dan informasi
                      desa lainnya.
                    </p>
                  </div>

                  <p className="mt-5 text-xs font-semibold text-slate-400">
                    Terakhir diperbarui:{' '}
                    {formatTanggal(
                      profil.updated_at
                    )}
                  </p>
                </div>
              </div>
            </section>

            {/* Tugas PPID */}
            <section>
              <SectionHeading
                eyebrow="Tugas dan Fungsi"
                title="Tugas Utama PPID"
                description="Fungsi PPID dalam mendukung pengelolaan dan pelayanan informasi publik Desa Keji."
              />

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {tugasPpid.map(
                  (item) => (
                    <TugasCard
                      key={
                        item.title
                      }
                      item={item}
                    />
                  )
                )}
              </div>
            </section>

            {/* Susunan Organisasi */}
            <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
              <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-md">
                    <Users
                      size={23}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                      Struktur Organisasi
                    </p>

                    <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
                      Susunan PPID Desa
                      Keji
                    </h2>

                    <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                      Daftar pejabat dan
                      petugas pengelola
                      informasi publik.
                    </p>
                  </div>
                </div>
              </div>

              {daftarPengurus.length ===
              0 ? (
                <PengurusEmptyState />
              ) : (
                <>
                  {/* Tampilan Desktop */}
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[760px] border-collapse text-left">
                      <thead>
                        <tr className="bg-emerald-950 text-white">
                          <th
                            scope="col"
                            className="w-[70px] px-4 py-4 text-center text-xs font-extrabold uppercase tracking-wider"
                          >
                            No
                          </th>

                          <th
                            scope="col"
                            className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider"
                          >
                            Nama
                          </th>

                          <th
                            scope="col"
                            className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider"
                          >
                            Jabatan Desa
                          </th>

                          <th
                            scope="col"
                            className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider"
                          >
                            Jabatan PPID
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-200">
                        {daftarPengurus.map(
                          (
                            pengurus,
                            index
                          ) => (
                            <PengurusTableRow
                              key={
                                pengurus.id
                              }
                              pengurus={
                                pengurus
                              }
                              nomor={
                                index + 1
                              }
                            />
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Tampilan Mobile */}
                  <div className="grid gap-4 p-4 md:hidden">
                    {daftarPengurus.map(
                      (
                        pengurus,
                        index
                      ) => (
                        <PengurusMobileCard
                          key={
                            pengurus.id
                          }
                          pengurus={
                            pengurus
                          }
                          nomor={
                            index + 1
                          }
                        />
                      )
                    )}
                  </div>
                </>
              )}
            </section>

            {/* Kontak */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white shadow-xl">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,0.24) 1px, transparent 1px)',

                  backgroundSize:
                    '25px 25px',
                }}
              />

              <div className="relative border-b border-white/10 p-6 sm:p-8">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-300">
                  Kontak dan Pelayanan
                </p>

                <h2 className="mt-2 text-xl font-black sm:text-2xl">
                  Sekretariat{' '}
                  {namaKantor}
                </h2>

                <p className="mt-2 text-sm font-medium leading-7 text-emerald-50/75">
                  Hubungi atau kunjungi
                  sekretariat PPID untuk
                  memperoleh informasi
                  lebih lanjut.
                </p>
              </div>

              <div className="relative grid gap-px bg-white/10 sm:grid-cols-2">
                <ContactItem
                  icon={MapPin}
                  label="Alamat"
                  value={
                    alamatPpid
                  }
                />

                <ContactItem
                  icon={Clock3}
                  label="Jam Pelayanan"
                  value={
                    jamLayananPpid
                  }
                />

                <ContactItem
                  icon={Phone}
                  label="Telepon"
                  value={
                    teleponPpid
                  }
                />

                <ContactItem
                  icon={Mail}
                  label="Email"
                  value={
                    emailPpid
                  }
                />
              </div>
            </section>
          </main>

          {/* Sidebar Kanan */}
          <aside className="min-w-0 lg:w-1/3">
            <div className="flex flex-col gap-8 lg:sticky lg:top-24">
              <SidebarLayanan
                daftarLayanan={
                  daftarLayanan
                }
                sticky={false}
              />

              <SidebarTilikArkeji />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function HeaderBadge({
  label,
}: {
  label: string;
}) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-emerald-50 backdrop-blur">
      {label}
    </span>
  );
}

function HeroStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value:
    | number
    | string;
  icon: LucideIcon;
}) {
  return (
    <article className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
      <Icon
        size={19}
        className="text-emerald-200"
      />

      <p className="mt-3 text-2xl font-black text-white">
        {value}
      </p>

      <p className="mt-1 text-xs font-bold text-emerald-100/80">
        {label}
      </p>
    </article>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-black text-slate-900">
        {title}
      </h2>

      <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function TugasCard({
  item,
}: {
  item: TugasPpid;
}) {
  const Icon =
    item.icon;

  return (
    <article className="group rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
        <Icon
          size={23}
        />
      </div>

      <h3 className="mt-4 font-black text-slate-900">
        {item.title}
      </h3>

      <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
        {item.description}
      </p>
    </article>
  );
}

function PengurusTableRow({
  pengurus,
  nomor,
}: {
  pengurus: PengurusPpid;
  nomor: number;
}) {
  return (
    <tr className="transition odd:bg-white even:bg-slate-50/80 hover:bg-emerald-50/70">
      <td className="px-4 py-4 text-center text-sm font-semibold text-slate-500">
        {nomor}
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xs font-black text-emerald-700">
            {getInitials(
              pengurus.nama
            )}
          </div>

          <p className="font-extrabold text-slate-800">
            {pengurus.nama}
          </p>
        </div>
      </td>

      <td className="px-5 py-4 text-sm font-semibold leading-6 text-slate-600">
        {pengurus.jabatan_desa}
      </td>

      <td className="px-5 py-4">
        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
          {pengurus.jabatan_ppid}
        </span>
      </td>
    </tr>
  );
}

function PengurusMobileCard({
  pengurus,
  nomor,
}: {
  pengurus: PengurusPpid;
  nomor: number;
}) {
  return (
    <article className="rounded-2xl border border-emerald-100 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xs font-black text-emerald-700">
          {getInitials(
            pengurus.nama
          )}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">
            Pengurus {nomor}
          </p>

          <h3 className="mt-1 font-black text-slate-800">
            {pengurus.nama}
          </h3>

          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
            {pengurus.jabatan_desa}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-emerald-100 px-4 py-3 text-xs font-extrabold leading-6 text-emerald-800">
        {pengurus.jabatan_ppid}
      </div>
    </article>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <article className="bg-emerald-950/80 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
          <Icon
            size={19}
          />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-200/70">
            {label}
          </p>

          <p className="mt-2 break-words text-sm font-bold leading-6 text-white">
            {value}
          </p>
        </div>
      </div>
    </article>
  );
}

function PengurusEmptyState() {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-300">
        <Users
          size={34}
        />
      </div>

      <h3 className="mt-5 font-black text-slate-800">
        Susunan pengurus belum tersedia
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
        Data pengurus PPID belum
        dimasukkan atau belum
        dipublikasikan oleh
        administrator.
      </p>
    </div>
  );
}