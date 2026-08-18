// app/(public)/informasi-publik/page.tsx

import type { Metadata } from 'next';

import Link from 'next/link';

import {
  ArrowRight,
  CalendarDays,
  FileText,
  Info,
  Landmark,
  Scale,
  ShieldCheck,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

import SidebarLayanan from '@/components/SidebarLayanan';
import SidebarTilikArkeji from '@/components/SidebarTilikArkeji';

import {
  INFORMASI_PUBLIK_DEFAULTS,
} from '@/lib/informasi-publik-defaults';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import {
  TAHUN_APBDES,
} from '@/types/apbdes';

import type {
  InformasiPublikSettings,
} from '@/types/informasi-publik';

import type {
  PilihanLayanan,
} from '@/types/layanan';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

export const metadata: Metadata = {
  title:
    'Informasi Publik | SIJI Desa Keji',

  description:
    'Pusat informasi publik Pemerintah Desa Keji.',
};

interface MenuInformasi {
  title: string;
  description: string;
  href: string;
  label: string;
  icon: LucideIcon;
}

interface ApbdesTahunRow {
  tahun:
    | number
    | string
    | null;
}

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

function safeString(
  value: unknown
) {
  return String(
    value ?? ''
  ).trim();
}

function normalizeSettings(
  data: unknown
): InformasiPublikSettings {
  if (
    !data ||
    typeof data !==
      'object' ||
    Array.isArray(data)
  ) {
    return {
      ...INFORMASI_PUBLIK_DEFAULTS,
    };
  }

  const row =
    data as Record<
      string,
      unknown
    >;

  const validEntries =
    Object.entries(
      row
    ).filter(
      ([, value]) => {
        if (
          value === null ||
          value === undefined
        ) {
          return false;
        }

        if (
          typeof value ===
          'string'
        ) {
          return (
            value.trim().length >
            0
          );
        }

        return true;
      }
    );

  return {
    ...INFORMASI_PUBLIK_DEFAULTS,

    ...Object.fromEntries(
      validEntries
    ),
  } as InformasiPublikSettings;
}

function getSafeInternalHref(
  value: unknown,
  fallback: string
) {
  if (
    typeof value !==
    'string'
  ) {
    return fallback;
  }

  const href =
    value.trim();

  if (
    href.length === 0 ||
    !href.startsWith('/') ||
    href.startsWith('//')
  ) {
    return fallback;
  }

  return href;
}

function getSafeText(
  value: unknown,
  fallback: string
) {
  if (
    typeof value !==
    'string'
  ) {
    return fallback;
  }

  const text =
    value.trim();

  return text || fallback;
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

export default async function InformasiPublikPage() {
  const [
    settingsResult,
    produkResult,
    informasiResult,
    apbdesResult,
    layananResult,
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
        'produk_hukum'
      )
      .select(
        'id',
        {
          count: 'exact',
          head: true,
        }
      )
      .eq('aktif', true),

    supabaseAdmin
      .from(
        'informasi_umum'
      )
      .select(
        'id',
        {
          count: 'exact',
          head: true,
        }
      )
      .eq('aktif', true),

    supabaseAdmin
      .from(
        'apbdes_realisasi'
      )
      .select(`
        tahun
      `)
      .eq('aktif', true)
      .order('tahun', {
        ascending: true,
      }),

    supabaseAdmin
      .from('layanan')
      .select(`
        id,
        nama,
        slug
      `)
      .eq('aktif', true)
      .order('urutan', {
        ascending: true,
        nullsFirst: false,
      })
      .order('nama', {
        ascending: true,
      }),
  ]);

  if (
    settingsResult.error
  ) {
    console.error(
      'Gagal mengambil pengaturan Informasi Publik:',
      {
        message:
          settingsResult.error
            .message,

        code:
          settingsResult.error
            .code,

        details:
          settingsResult.error
            .details,

        hint:
          settingsResult.error
            .hint,
      }
    );
  }

  if (
    produkResult.error
  ) {
    console.error(
      'Gagal menghitung Produk Hukum:',
      {
        message:
          produkResult.error
            .message,

        code:
          produkResult.error
            .code,

        details:
          produkResult.error
            .details,

        hint:
          produkResult.error
            .hint,
      }
    );
  }

  if (
    informasiResult.error
  ) {
    console.error(
      'Gagal menghitung Informasi Umum:',
      {
        message:
          informasiResult.error
            .message,

        code:
          informasiResult.error
            .code,

        details:
          informasiResult.error
            .details,

        hint:
          informasiResult.error
            .hint,
      }
    );
  }

  if (
    apbdesResult.error
  ) {
    console.error(
      'Gagal mengambil tahun APBDes:',
      {
        message:
          apbdesResult.error
            .message,

        code:
          apbdesResult.error
            .code,

        details:
          apbdesResult.error
            .details,

        hint:
          apbdesResult.error
            .hint,
      }
    );
  }

  if (
    layananResult.error
  ) {
    console.error(
      'Gagal mengambil daftar layanan:',
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

  const settings =
    normalizeSettings(
      settingsResult.data
    );

  const ctaButtonHref =
    getSafeInternalHref(
      settings.cta_button_href,
      INFORMASI_PUBLIK_DEFAULTS
        .cta_button_href
    );

  const ctaButtonLabel =
    getSafeText(
      settings.cta_button_label,
      INFORMASI_PUBLIK_DEFAULTS
        .cta_button_label
    );

  const totalDokumen =
    Number(
      produkResult.count ??
        0
    ) +
    Number(
      informasiResult.count ??
        0
    );

  const tahunDatabase =
    (
      (
        apbdesResult.data ??
        []
      ) as ApbdesTahunRow[]
    )
      .map((item) =>
        Number(
          item.tahun
        )
      )
      .filter(
        (
          tahun
        ): tahun is number =>
          Number.isInteger(
            tahun
          ) &&
          tahun >= 1900 &&
          tahun <= 2100
      );

  const daftarTahun = [
    ...new Set<number>([
      ...TAHUN_APBDES.map(
        (tahun) =>
          Number(tahun)
      ).filter(
        (tahun) =>
          Number.isInteger(
            tahun
          )
      ),

      ...tahunDatabase,
    ]),
  ].sort(
    (first, second) =>
      first - second
  );

  const tahunPertama =
    daftarTahun[0];

  const tahunTerakhir =
    daftarTahun[
      daftarTahun.length - 1
    ];

  const rentangTahun =
    daftarTahun.length === 0
      ? 'Belum tersedia'
      : daftarTahun.length ===
          1
        ? String(
            tahunPertama
          )
        : `${tahunPertama}–${tahunTerakhir}`;

  const daftarLayanan:
    PilihanLayanan[] = (
      (
        layananResult.data ??
        []
      ) as LayananRow[]
    )
      .map((layanan) => {
        const id =
          Number(
            layanan.id
          );

        const nama =
          safeString(
            layanan.nama
          );

        const slug =
          safeString(
            layanan.slug
          );

        return {
          id,
          nama,
          slug,
        };
      })
      .filter(
        (layanan) =>
          Number.isInteger(
            layanan.id
          ) &&
          layanan.id > 0 &&
          layanan.nama.length >
            0 &&
          layanan.slug.length >
            0
      );

  const menuInformasi:
    MenuInformasi[] = [
    {
      title:
        getSafeText(
          settings.produk_hukum_title,
          INFORMASI_PUBLIK_DEFAULTS
            .produk_hukum_title
        ),

      description:
        getSafeText(
          settings.produk_hukum_description,
          INFORMASI_PUBLIK_DEFAULTS
            .produk_hukum_description
        ),

      href:
        '/informasi-publik/produk-hukum',

      label:
        getSafeText(
          settings.produk_hukum_label,
          INFORMASI_PUBLIK_DEFAULTS
            .produk_hukum_label
        ),

      icon: Scale,
    },

    {
      title:
        getSafeText(
          settings.informasi_umum_title,
          INFORMASI_PUBLIK_DEFAULTS
            .informasi_umum_title
        ),

      description:
        getSafeText(
          settings.informasi_umum_description,
          INFORMASI_PUBLIK_DEFAULTS
            .informasi_umum_description
        ),

      href:
        '/informasi-publik/informasi-umum',

      label:
        getSafeText(
          settings.informasi_umum_label,
          INFORMASI_PUBLIK_DEFAULTS
            .informasi_umum_label
        ),

      icon: Info,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-emerald-950 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',

            backgroundSize:
              '28px 28px',
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full border-[64px] border-white/[0.04]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-44 -left-32 h-96 w-96 rounded-full bg-emerald-400/[0.08] blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-100 backdrop-blur">
              <ShieldCheck
                size={15}
              />

              {getSafeText(
                settings.badge_text,
                INFORMASI_PUBLIK_DEFAULTS
                  .badge_text
              )}
            </div>

            <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-300">
              {getSafeText(
                settings.hero_eyebrow,
                INFORMASI_PUBLIK_DEFAULTS
                  .hero_eyebrow
              )}
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              {getSafeText(
                settings.hero_title,
                INFORMASI_PUBLIK_DEFAULTS
                  .hero_title
              )}
            </h1>

            <p className="mt-6 max-w-3xl text-sm font-medium leading-7 text-emerald-50/85 sm:text-base sm:leading-8">
              {getSafeText(
                settings.hero_description,
                INFORMASI_PUBLIK_DEFAULTS
                  .hero_description
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Ringkasan */}
      <section className="relative z-10 -mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-slate-900/10 sm:grid-cols-3">
            <SummaryItem
              icon={FileText}
              value={`${formatAngka(
                totalDokumen
              )} Dokumen`}
              label={getSafeText(
                settings.summary_documents_label,
                INFORMASI_PUBLIK_DEFAULTS
                  .summary_documents_label
              )}
            />

            <SummaryItem
              icon={Landmark}
              value={getSafeText(
                settings.summary_access_value,
                INFORMASI_PUBLIK_DEFAULTS
                  .summary_access_value
              )}
              label={getSafeText(
                settings.summary_access_label,
                INFORMASI_PUBLIK_DEFAULTS
                  .summary_access_label
              )}
            />

            <SummaryItem
              icon={CalendarDays}
              value={rentangTahun}
              label={getSafeText(
                settings.summary_apbdes_label,
                INFORMASI_PUBLIK_DEFAULTS
                  .summary_apbdes_label
              )}
            />
          </div>
        </div>
      </section>

      {/* Layout utama */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Konten utama */}
          <main className="min-w-0 space-y-12 lg:w-2/3">
            {/* Menu informasi */}
            <section>
              <SectionHeading
                eyebrow={getSafeText(
                  settings.menu_eyebrow,
                  INFORMASI_PUBLIK_DEFAULTS
                    .menu_eyebrow
                )}
                title={getSafeText(
                  settings.menu_title,
                  INFORMASI_PUBLIK_DEFAULTS
                    .menu_title
                )}
                description={getSafeText(
                  settings.menu_description,
                  INFORMASI_PUBLIK_DEFAULTS
                    .menu_description
                )}
              />

              <div className="mt-7 grid gap-5">
                {menuInformasi.map(
                  (item) => (
                    <InformasiCard
                      key={
                        item.href
                      }
                      item={item}
                    />
                  )
                )}
              </div>
            </section>

            {/* APBDes */}
            <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <SectionHeading
                  eyebrow={getSafeText(
                    settings.apbdes_eyebrow,
                    INFORMASI_PUBLIK_DEFAULTS
                      .apbdes_eyebrow
                  )}
                  title={getSafeText(
                    settings.apbdes_title,
                    INFORMASI_PUBLIK_DEFAULTS
                      .apbdes_title
                  )}
                  description={getSafeText(
                    settings.apbdes_description,
                    INFORMASI_PUBLIK_DEFAULTS
                      .apbdes_description
                  )}
                />

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Wallet
                    size={27}
                  />
                </div>
              </div>

              {daftarTahun.length ===
              0 ? (
                <div className="mt-8 rounded-3xl border border-dashed border-emerald-200 bg-emerald-50 px-6 py-12 text-center">
                  <Wallet
                    size={42}
                    className="mx-auto text-emerald-300"
                  />

                  <h3 className="mt-4 font-black text-emerald-950">
                    Data APBDes belum
                    tersedia
                  </h3>

                  <p className="mt-2 text-sm font-medium text-emerald-700">
                    Belum ada tahun APBDes
                    yang dapat ditampilkan.
                  </p>
                </div>
              ) : (
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  {daftarTahun.map(
                    (tahun) => (
                      <ApbdesCard
                        key={tahun}
                        tahun={
                          tahun
                        }
                      />
                    )
                  )}
                </div>
              )}
            </section>

            {/* Komitmen */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 p-6 text-white shadow-xl sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.18]"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)',

                  backgroundSize:
                    '26px 26px',
                }}
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[50px] border-white/[0.05]"
              />

              <div className="relative">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-200">
                  {getSafeText(
                    settings.commitment_eyebrow,
                    INFORMASI_PUBLIK_DEFAULTS
                      .commitment_eyebrow
                  )}
                </p>

                <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
                  {getSafeText(
                    settings.commitment_title,
                    INFORMASI_PUBLIK_DEFAULTS
                      .commitment_title
                  )}
                </h2>

                <p className="mt-4 text-sm font-medium leading-7 text-emerald-50/85">
                  {getSafeText(
                    settings.commitment_description,
                    INFORMASI_PUBLIK_DEFAULTS
                      .commitment_description
                  )}
                </p>

                <div className="mt-7 grid gap-3">
                  <CommitmentItem
                    title={getSafeText(
                      settings.commitment_1_title,
                      INFORMASI_PUBLIK_DEFAULTS
                        .commitment_1_title
                    )}
                    description={getSafeText(
                      settings.commitment_1_description,
                      INFORMASI_PUBLIK_DEFAULTS
                        .commitment_1_description
                    )}
                  />

                  <CommitmentItem
                    title={getSafeText(
                      settings.commitment_2_title,
                      INFORMASI_PUBLIK_DEFAULTS
                        .commitment_2_title
                    )}
                    description={getSafeText(
                      settings.commitment_2_description,
                      INFORMASI_PUBLIK_DEFAULTS
                        .commitment_2_description
                    )}
                  />

                  <CommitmentItem
                    title={getSafeText(
                      settings.commitment_3_title,
                      INFORMASI_PUBLIK_DEFAULTS
                        .commitment_3_title
                    )}
                    description={getSafeText(
                      settings.commitment_3_description,
                      INFORMASI_PUBLIK_DEFAULTS
                        .commitment_3_description
                    )}
                  />
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="rounded-3xl border border-emerald-100 bg-white p-6 text-center shadow-sm sm:p-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <FileText
                  size={27}
                />
              </div>

              <h2 className="mt-5 text-2xl font-black text-slate-900">
                {getSafeText(
                  settings.cta_title,
                  INFORMASI_PUBLIK_DEFAULTS
                    .cta_title
                )}
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-500">
                {getSafeText(
                  settings.cta_description,
                  INFORMASI_PUBLIK_DEFAULTS
                    .cta_description
                )}
              </p>

              <Link
                href={
                  ctaButtonHref
                }
                className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-extrabold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-800"
              >
                {ctaButtonLabel}

                <ArrowRight
                  size={17}
                />
              </Link>
            </section>
          </main>

          {/* Sidebar kanan */}
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

function SummaryItem({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <article className="flex items-center gap-4 border-b border-emerald-100 p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
        <Icon size={23} />
      </div>

      <div className="min-w-0">
        <p className="text-lg font-black text-slate-900">
          {value}
        </p>

        <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
          {label}
        </p>
      </div>
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
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>

      <p className="mt-4 text-sm font-medium leading-7 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function InformasiCard({
  item,
}: {
  item: MenuInformasi;
}) {
  const Icon =
    item.icon;

  return (
    <Link
      href={item.href}
      className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-100 opacity-60 transition duration-300 group-hover:scale-125"
      />

      <div className="relative">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
          <Icon size={26} />
        </div>

        <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-600">
          {item.label}
        </p>

        <h3 className="mt-2 text-2xl font-black text-slate-900">
          {item.title}
        </h3>

        <p className="mt-4 text-sm font-medium leading-7 text-slate-500">
          {item.description}
        </p>

        <span className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-emerald-700">
          Lihat informasi

          <ArrowRight
            size={17}
            className="transition group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}

function ApbdesCard({
  tahun,
}: {
  tahun: number;
}) {
  return (
    <Link
      href={`/informasi-publik/apbdes/${tahun}`}
      className="group overflow-hidden rounded-3xl border border-emerald-100 bg-slate-50 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:bg-white hover:shadow-xl"
    >
      <div className="bg-gradient-to-br from-emerald-950 to-emerald-700 p-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <Wallet
              size={22}
            />
          </div>

          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-100">
            APBDes
          </span>
        </div>

        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
          Tahun Anggaran
        </p>

        <h3 className="mt-1 text-4xl font-black">
          {tahun}
        </h3>
      </div>

      <div className="p-5">
        <p className="text-sm font-medium leading-7 text-slate-500">
          Informasi anggaran,
          belanja, pembiayaan, dan
          realisasi APBDes Desa Keji
          tahun {tahun}.
        </p>

        <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-emerald-700">
          Lihat realisasi

          <ArrowRight
            size={16}
            className="transition group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}

function CommitmentItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-200">
          <ShieldCheck
            size={18}
          />
        </div>

        <div>
          <h3 className="font-black text-white">
            {title}
          </h3>

          <p className="mt-1 text-xs font-medium leading-6 text-emerald-50/75">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}