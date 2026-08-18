// app/(public)/desa-anti-korupsi/page.tsx

import Link from 'next/link';

import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Building2,
  CheckCircle2,
  FileSearch,
  HandCoins,
  Landmark,
  Megaphone,
  Scale,
  ShieldCheck,
  Siren,
  Users,
  WalletCards,
  type LucideIcon,
} from 'lucide-react';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

/* =========================================================
   TYPES
========================================================= */

interface RincianAnggaran {
  nama: string;
  nominal: number;
}

interface BidangBelanja {
  nama: string;
  nominal: number;
  icon: LucideIcon;
  rincian:
    RincianAnggaran[];
}

/* =========================================================
   DATA UTAMA APBDES 2026
========================================================= */

const TOTAL_PENDAPATAN =
  1_727_081_000;

const TOTAL_BELANJA =
  1_810_178_246;

const DEFISIT =
  83_097_246;

const TOTAL_PEMBIAYAAN =
  83_097_246;

/* =========================================================
   PENDAPATAN DESA
========================================================= */

const pendapatanDesa = [
  {
    nama:
      'Pendapatan Asli Desa',

    nominal:
      172_790_000,

    rincian: [],
  },

  {
    nama:
      'Pendapatan Transfer',

    nominal:
      1_554_291_000,

    rincian: [
      {
        nama:
          'Dana Desa',

        nominal:
          373_456_000,
      },

      {
        nama:
          'Bagi Hasil Pajak dan Retribusi',

        nominal:
          196_059_000,
      },

      {
        nama:
          'Alokasi Dana Desa',

        nominal:
          419_776_000,
      },

      {
        nama:
          'Bantuan Keuangan Provinsi',

        nominal:
          500_000_000,
      },

      {
        nama:
          'Bantuan Keuangan Kabupaten/Kota',

        nominal:
          65_000_000,
      },
    ],
  },
];

/* =========================================================
   BELANJA DESA
========================================================= */

const bidangBelanja:
  BidangBelanja[] = [
    {
      nama:
        'Penyelenggaraan Pemerintahan Desa',

      nominal:
        787_286_316,

      icon:
        Building2,

      rincian: [
        {
          nama:
            'Penyelenggaraan Belanja Siltap, Tunjangan, dan Operasional Pemerintah Desa',

          nominal:
            742_836_316,
        },

        {
          nama:
            'Pengelolaan Administrasi Kependudukan, Pencatatan Sipil, Statistik, dan Kearsipan',

          nominal:
            5_000_000,
        },

        {
          nama:
            'Penyelenggaraan Tata Praja Pemerintahan, Perencanaan, Keuangan, dan Pelaporan',

          nominal:
            39_450_000,
        },
      ],
    },

    {
      nama:
        'Pelaksanaan Pembangunan Desa',

      nominal:
        677_650_965,

      icon:
        Landmark,

      rincian: [
        {
          nama:
            'Subbidang Pendidikan',

          nominal:
            15_150_965,
        },

        {
          nama:
            'Subbidang Kesehatan',

          nominal:
            97_500_000,
        },

        {
          nama:
            'Subbidang Pekerjaan Umum dan Penataan Ruang',

          nominal:
            560_000_000,
        },

        {
          nama:
            'Subbidang Kawasan Permukiman',

          nominal:
            5_000_000,
        },
      ],
    },

    {
      nama:
        'Pembinaan Kemasyarakatan',

      nominal:
        237_483_378,

      icon:
        Users,

      rincian: [
        {
          nama:
            'Subbidang Ketenteraman, Ketertiban Umum, dan Perlindungan Masyarakat',

          nominal:
            10_000_000,
        },

        {
          nama:
            'Subbidang Kebudayaan dan Keagamaan',

          nominal:
            35_000_000,
        },

        {
          nama:
            'Subbidang Kepemudaan dan Olahraga',

          nominal:
            152_483_378,
        },

        {
          nama:
            'Subbidang Kelembagaan Masyarakat',

          nominal:
            40_000_000,
        },
      ],
    },

    {
      nama:
        'Pemberdayaan Masyarakat',

      nominal:
        59_557_587,

      icon:
        HandCoins,

      rincian: [
        {
          nama:
            'Subbidang Peningkatan Kapasitas Aparatur Desa',

          nominal:
            50_107_587,
        },

        {
          nama:
            'Subbidang Koperasi, Usaha Mikro Kecil dan Menengah (UMKM)',

          nominal:
            9_450_000,
        },
      ],
    },

    {
      nama:
        'Penanggulangan Bencana, Darurat, dan Mendesak',

      nominal:
        48_200_000,

      icon:
        Siren,

      rincian: [
        {
          nama:
            'Subbidang Penanggulangan Bencana',

          nominal:
            5_000_000,
        },

        {
          nama:
            'Subbidang Keadaan Mendesak',

          nominal:
            43_200_000,
        },
      ],
    },
  ];

/* =========================================================
   PEMBIAYAAN
========================================================= */

const pembiayaanDesa = [
  {
    nama:
      'Penerimaan Pembiayaan',

    nominal:
      123_097_246,
  },

  {
    nama:
      'Pengeluaran Pembiayaan',

    nominal:
      40_000_000,
  },
];

/* =========================================================
   PRINSIP ANTI KORUPSI
========================================================= */

const prinsipAntiKorupsi = [
  {
    title:
      'Transparansi Anggaran',

    description:
      'Informasi pendapatan, belanja, pembiayaan, dan realisasi anggaran disampaikan secara terbuka.',

    icon:
      FileSearch,
  },

  {
    title:
      'Pelayanan Tanpa Pungutan',

    description:
      'Pelayanan administrasi desa diberikan sesuai ketentuan dan tidak dipungut biaya.',

    icon:
      BadgeCheck,
  },

  {
    title:
      'Akuntabilitas Pemerintahan',

    description:
      'Pengelolaan program dan anggaran desa harus dapat dipertanggungjawabkan kepada masyarakat.',

    icon:
      Scale,
  },

  {
    title:
      'Kanal Pengaduan Terbuka',

    description:
      'Masyarakat dapat menyampaikan laporan, kritik, dan pengaduan melalui saluran resmi Desa Keji.',

    icon:
      Megaphone,
  },
];

/* =========================================================
   HELPERS
========================================================= */

function formatRupiah(
  value: number
) {
  return new Intl.NumberFormat(
    'id-ID',
    {
      style:
        'currency',

      currency:
        'IDR',

      minimumFractionDigits:
        0,

      maximumFractionDigits:
        0,
    }
  ).format(value);
}

function formatPersentase(
  nominal: number,
  total: number
) {
  if (
    total <= 0
  ) {
    return '0%';
  }

  return (
    new Intl.NumberFormat(
      'id-ID',
      {
        minimumFractionDigits:
          1,

        maximumFractionDigits:
          1,
      }
    ).format(
      (
        nominal /
        total
      ) * 100
    ) + '%'
  );
}

function getBarWidth(
  nominal: number,
  total: number
) {
  if (
    total <= 0
  ) {
    return 0;
  }

  return Math.min(
    Math.max(
      (
        nominal /
        total
      ) * 100,
      0
    ),
    100
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function DesaAntiKorupsiPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          HERO UTAMA
      ===================================================== */}

      <section className="relative isolate min-h-[650px] overflow-hidden bg-emerald-950 text-white">
        {/* Background image */}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/images/anti-korupsi/hero-anti-korupsi.jpg'), url('/background.png')",
          }}
        />

        {/* Overlay */}

        <div className="absolute inset-0 bg-gradient-to-r from-[#021b16] via-emerald-950/90 to-emerald-900/45" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#021b16] via-transparent to-black/25" />

        {/* Pattern */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',

            backgroundSize:
              '28px 28px',
          }}
        />

        {/* Dekorasi */}

        <div className="pointer-events-none absolute -left-36 -top-36 h-[480px] w-[480px] rounded-full bg-emerald-400/10 blur-[110px]" />

        <div className="pointer-events-none absolute -bottom-48 right-0 h-[520px] w-[520px] rounded-full bg-amber-300/[0.06] blur-[120px]" />

        <div className="pointer-events-none absolute -right-32 -top-32 h-[430px] w-[430px] rounded-full border-[76px] border-white/[0.035]" />

        {/* Content */}

        <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-center px-4 pb-24 pt-16 sm:px-6 md:pb-28 md:pt-20 lg:px-8">
          <div className="grid w-full gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            {/* Hero text */}

            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.19em] text-emerald-100 shadow-lg backdrop-blur-md sm:text-xs">
                <ShieldCheck
                  size={15}
                />

                Pemerintah Desa Keji
              </div>

              <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.24em] text-emerald-300">
                Desa Berintegritas
              </p>

              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.07] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Desa Keji

                <span className="block text-emerald-300">
                  Anti Korupsi
                </span>
              </h1>

              <p className="mt-7 max-w-3xl text-sm font-medium leading-7 text-emerald-50/90 sm:text-base md:text-lg md:leading-9">
                Mewujudkan pemerintahan
                desa yang transparan,
                akuntabel, jujur, dan
                berorientasi pada
                pelayanan masyarakat
                melalui keterbukaan
                informasi serta
                partisipasi aktif
                seluruh warga.
              </p>

              {/* CTA */}

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/desa-anti-korupsi/tata-laksana"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-sm font-extrabold text-emerald-950 shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-emerald-300"
                >
                  <FileSearch
                    size={18}
                  />

                  Lihat Bukti
                  Implementasi
                </Link>

                <Link
                  href="/kontak"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-extrabold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  <Megaphone
                    size={18}
                  />

                  Kanal Pengaduan
                </Link>
              </div>

              {/* Nilai */}

              <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
                <HeroValue
                  title="Transparan"
                  description="Informasi Terbuka"
                />

                <HeroValue
                  title="Akuntabel"
                  description="Dapat Dipertanggungjawabkan"
                />

                <HeroValue
                  title="Tanpa Pungutan"
                  description="Pelayanan Masyarakat"
                />
              </div>
            </div>

            {/* =================================================
                HERO APBDES CARD
            ================================================= */}

            <aside className="relative hidden lg:block">
              <div className="absolute -inset-5 rounded-[2.4rem] bg-emerald-300/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-black/25 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',

                    backgroundSize:
                      '22px 22px',
                  }}
                />

                <div className="relative">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-300">
                        Transparansi
                        Anggaran
                      </p>

                      <h2 className="mt-2 text-2xl font-black text-white">
                        APBDes 2026
                      </h2>
                    </div>

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-emerald-200">
                      <WalletCards
                        size={25}
                      />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <HeroBudgetItem
                      label="Pendapatan Desa"
                      value={
                        TOTAL_PENDAPATAN
                      }
                      icon={
                        Banknote
                      }
                    />

                    <HeroBudgetItem
                      label="Belanja Desa"
                      value={
                        TOTAL_BELANJA
                      }
                      icon={
                        WalletCards
                      }
                    />

                    <HeroBudgetItem
                      label="Pembiayaan Neto"
                      value={
                        TOTAL_PEMBIAYAAN
                      }
                      icon={
                        HandCoins
                      }
                    />
                  </div>

                  <div className="mt-5 rounded-2xl border border-amber-200/15 bg-amber-300/10 p-4">
                    <div className="flex items-start gap-3">
                      <Scale
                        size={19}
                        className="mt-0.5 shrink-0 text-amber-200"
                      />

                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-amber-200">
                          Defisit
                          Anggaran
                        </p>

                        <p className="mt-2 text-lg font-black text-white">
                          {formatRupiah(
                            DEFISIT
                          )}
                        </p>

                        <p className="mt-1 text-xs font-medium leading-5 text-amber-50/70">
                          Ditutup melalui
                          pembiayaan neto
                          tahun anggaran
                          2026.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/informasi-publik/apbdes/2026"
                    className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-emerald-900 transition hover:bg-emerald-50"
                  >
                    Lihat Detail APBDes

                    <ArrowRight
                      size={17}
                    />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* =====================================================
          NAVIGASI INDIKATOR
      ===================================================== */}

      <section className="relative z-20 -mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-5">
              <AntiKorupsiMenu
                href="/desa-anti-korupsi/tata-laksana"
                title="Tata Laksana"
                description="Penguatan sistem dan prosedur pemerintahan."
                icon={
                  FileSearch
                }
              />

              <AntiKorupsiMenu
                href="/desa-anti-korupsi/pengawasan"
                title="Pengawasan"
                description="Evaluasi dan tindak lanjut pengawasan desa."
                icon={
                  ShieldCheck
                }
              />

              <AntiKorupsiMenu
                href="/desa-anti-korupsi/pelayanan-publik"
                title="Pelayanan Publik"
                description="Pelayanan terbuka dan tanpa pungutan."
                icon={
                  BadgeCheck
                }
              />

              <AntiKorupsiMenu
                href="/desa-anti-korupsi/partisipasi-masyarakat"
                title="Partisipasi"
                description="Keterlibatan aktif masyarakat Desa Keji."
                icon={
                  Users
                }
              />

              <AntiKorupsiMenu
                href="/desa-anti-korupsi/kearifan-lokal"
                title="Kearifan Lokal"
                description="Budaya lokal sebagai penguatan integritas."
                icon={
                  Landmark
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          KONTEN UTAMA — FULL WIDTH
      ===================================================== */}

      <main className="mx-auto max-w-7xl space-y-10 px-4 pb-20 pt-14 sm:px-6 lg:px-8">
        {/* ===================================================
            RINGKASAN APBDES
        =================================================== */}

        <section>
          <SectionHeading
            eyebrow="Ringkasan Anggaran"
            title="APBDes Desa Keji 2026"
            description="Ringkasan nilai utama Anggaran Pendapatan dan Belanja Desa Keji tahun anggaran 2026."
          />

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              label="Pendapatan"
              value={
                TOTAL_PENDAPATAN
              }
              description="Total pendapatan desa"
              icon={
                Banknote
              }
              variant="emerald"
            />

            <SummaryCard
              label="Belanja"
              value={
                TOTAL_BELANJA
              }
              description="Total belanja desa"
              icon={
                WalletCards
              }
              variant="slate"
            />

            <SummaryCard
              label="Defisit"
              value={
                DEFISIT
              }
              description="Selisih pendapatan dan belanja"
              icon={
                Scale
              }
              variant="amber"
            />

            <SummaryCard
              label="Pembiayaan Neto"
              value={
                TOTAL_PEMBIAYAAN
              }
              description="Pembiayaan untuk menutup defisit"
              icon={
                HandCoins
              }
              variant="cyan"
            />
          </div>
        </section>

        {/* ===================================================
            PENDAPATAN
        =================================================== */}

        <section className="overflow-hidden rounded-[2rem] border border-emerald-200 bg-white shadow-sm">
          {/* Header */}

          <div className="relative overflow-hidden border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-white p-6 md:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-100/70 blur-3xl"
            />

            <div className="relative flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-md">
                <Banknote
                  size={23}
                />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-600">
                  Bagian I
                </p>

                <h2 className="mt-2 text-xl font-black text-slate-900 md:text-2xl">
                  Pendapatan Desa
                </h2>

                <p className="mt-2 text-sm font-medium text-slate-500">
                  Total{' '}

                  <span className="font-extrabold text-emerald-700">
                    {formatRupiah(
                      TOTAL_PENDAPATAN
                    )}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Pendapatan cards */}

          <div className="grid gap-5 p-5 lg:grid-cols-2 md:p-8">
            {pendapatanDesa.map(
              (item) => (
                <article
                  key={
                    item.nama
                  }
                  className="flex flex-col rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-black leading-6 text-slate-900">
                        {item.nama}
                      </h3>

                      <p className="mt-1 text-xs font-bold text-emerald-700">
                        {formatPersentase(
                          item.nominal,
                          TOTAL_PENDAPATAN
                        )}{' '}
                        dari pendapatan
                      </p>
                    </div>

                    <p className="shrink-0 text-lg font-black text-slate-800">
                      {formatRupiah(
                        item.nominal
                      )}
                    </p>
                  </div>

                  <BudgetBar
                    nominal={
                      item.nominal
                    }
                    total={
                      TOTAL_PENDAPATAN
                    }
                  />

                  {item.rincian.length >
                    0 && (
                    <div className="mt-5 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      {item.rincian.map(
                        (
                          rincian
                        ) => (
                          <RincianRow
                            key={
                              rincian.nama
                            }
                            item={
                              rincian
                            }
                          />
                        )
                      )}
                    </div>
                  )}
                </article>
              )
            )}
          </div>
        </section>

        {/* ===================================================
            BELANJA
        =================================================== */}

        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          {/* Header */}

          <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-r from-slate-100 via-white to-white p-6 md:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-slate-200/70 blur-3xl"
            />

            <div className="relative flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-800 text-white shadow-md">
                <WalletCards
                  size={23}
                />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-600">
                  Bagian II
                </p>

                <h2 className="mt-2 text-xl font-black text-slate-900 md:text-2xl">
                  Belanja Desa
                </h2>

                <p className="mt-2 text-sm font-medium text-slate-500">
                  Total{' '}

                  <span className="font-extrabold text-slate-800">
                    {formatRupiah(
                      TOTAL_BELANJA
                    )}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5 md:p-8">
            {bidangBelanja.map(
              (bidang) => (
                <BelanjaCard
                  key={
                    bidang.nama
                  }
                  bidang={
                    bidang
                  }
                />
              )
            )}
          </div>
        </section>

        {/* ===================================================
            DEFISIT + PEMBIAYAAN
        =================================================== */}

        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Defisit */}

          <article className="relative overflow-hidden rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-white p-6 shadow-sm md:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl"
            />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
                <Scale
                  size={23}
                />
              </div>

              <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-amber-700">
                Surplus / Defisit
              </p>

              <h2 className="mt-2 text-xl font-black text-amber-950">
                Defisit Anggaran
              </h2>

              <p className="mt-3 text-3xl font-black tracking-tight text-amber-900">
                {formatRupiah(
                  DEFISIT
                )}
              </p>

              <p className="mt-4 max-w-xl text-sm font-semibold leading-7 text-amber-800">
                Belanja lebih besar
                daripada pendapatan.
                Selisih tersebut ditutup
                melalui pembiayaan neto
                pada tahun anggaran
                2026.
              </p>
            </div>
          </article>

          {/* Pembiayaan */}

          <article className="overflow-hidden rounded-[2rem] border border-cyan-200 bg-white shadow-sm">
            <div className="border-b border-cyan-100 bg-gradient-to-r from-cyan-50 via-white to-white p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-700 text-white shadow-md">
                  <HandCoins
                    size={23}
                  />
                </div>

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-700">
                    Bagian III
                  </p>

                  <h2 className="mt-2 text-xl font-black text-slate-900 md:text-2xl">
                    Pembiayaan Desa
                  </h2>

                  <p className="mt-2 text-sm font-medium text-slate-500">
                    Pembiayaan neto{' '}

                    <span className="font-extrabold text-cyan-700">
                      {formatRupiah(
                        TOTAL_PEMBIAYAAN
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2 md:p-8">
              {pembiayaanDesa.map(
                (item) => (
                  <article
                    key={
                      item.nama
                    }
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">
                      {item.nama}
                    </p>

                    <p className="mt-3 text-xl font-black text-slate-900">
                      {formatRupiah(
                        item.nominal
                      )}
                    </p>
                  </article>
                )
              )}
            </div>

            <div className="border-t border-cyan-100 bg-cyan-50 px-5 py-5 md:px-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-black text-cyan-950">
                  Pembiayaan Neto
                </p>

                <p className="text-xl font-black text-cyan-800">
                  {formatRupiah(
                    TOTAL_PEMBIAYAAN
                  )}
                </p>
              </div>
            </div>
          </article>
        </section>

        {/* ===================================================
            PRINSIP ANTI KORUPSI
        =================================================== */}

        <section>
          <SectionHeading
            eyebrow="Komitmen Integritas"
            title="Prinsip Desa Anti Korupsi"
            description="Komitmen Pemerintah Desa Keji dalam membangun tata kelola pemerintahan yang bersih, terbuka, dan dapat dipertanggungjawabkan."
          />

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {prinsipAntiKorupsi.map(
              (item) => (
                <PrinsipCard
                  key={
                    item.title
                  }
                  item={
                    item
                  }
                />
              )
            )}
          </div>
        </section>

        {/* ===================================================
            KETERBUKAAN INFORMASI
        =================================================== */}

        <section className="relative overflow-hidden rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-6 text-white shadow-xl md:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',

              backgroundSize:
                '25px 25px',
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border-[60px] border-white/[0.04]"
          />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-3xl items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-emerald-200">
                <CheckCircle2
                  size={23}
                />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
                  Keterbukaan
                  Informasi
                </p>

                <h2 className="mt-2 text-xl font-black sm:text-2xl">
                  Masyarakat dapat ikut
                  mengawasi penggunaan
                  anggaran
                </h2>

                <p className="mt-3 text-sm font-medium leading-7 text-emerald-50/80">
                  Informasi APBDes
                  disampaikan agar
                  masyarakat memahami
                  sumber pendapatan,
                  arah belanja, serta
                  pembiayaan Desa Keji.
                  Pertanyaan dan
                  pengaduan dapat
                  disampaikan melalui
                  saluran resmi
                  Pemerintah Desa.
                </p>
              </div>
            </div>

            <Link
              href="/kontak"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-extrabold text-emerald-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50"
            >
              <Megaphone
                size={17}
              />

              Sampaikan Pengaduan

              <ArrowRight
                size={16}
              />
            </Link>
          </div>
        </section>

        {/* ===================================================
            NAVIGASI BAWAH
        =================================================== */}

        <section className="grid gap-5 sm:grid-cols-2">
          <Link
            href="/informasi-publik/apbdes/2026"
            className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-100/50 opacity-0 blur-2xl transition group-hover:opacity-100" />

            <div className="relative flex items-center justify-between gap-5">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-600">
                  Transparansi
                </p>

                <h2 className="mt-2 text-lg font-black text-slate-900">
                  APBDes 2026
                </h2>

                <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                  Lihat informasi
                  lengkap APBDes Desa
                  Keji tahun 2026.
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
                <ArrowRight
                  size={20}
                  className="transition group-hover:translate-x-0.5"
                />
              </div>
            </div>
          </Link>

          <Link
            href="/kontak"
            className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-100/50 opacity-0 blur-2xl transition group-hover:opacity-100" />

            <div className="relative flex items-center justify-between gap-5">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-600">
                  Pengawasan
                </p>

                <h2 className="mt-2 text-lg font-black text-slate-900">
                  Layanan Aduan
                </h2>

                <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                  Sampaikan laporan,
                  kritik, atau
                  pengaduan melalui
                  saluran resmi desa.
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
                <ArrowRight
                  size={20}
                  className="transition group-hover:translate-x-0.5"
                />
              </div>
            </div>
          </Link>
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

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
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <span className="h-1 w-8 rounded-full bg-emerald-600" />

        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-600">
          {eyebrow}
        </p>
      </div>

      <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>

      <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-slate-500">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  variant,
}: {
  label: string;
  value: number;
  description: string;
  icon: LucideIcon;

  variant:
    | 'emerald'
    | 'slate'
    | 'amber'
    | 'cyan';
}) {
  const styles = {
    emerald: {
      card:
        'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white',

      icon:
        'bg-emerald-700 text-white',

      label:
        'text-emerald-700',
    },

    slate: {
      card:
        'border-slate-200 bg-gradient-to-br from-slate-50 to-white',

      icon:
        'bg-slate-800 text-white',

      label:
        'text-slate-600',
    },

    amber: {
      card:
        'border-amber-200 bg-gradient-to-br from-amber-50 to-white',

      icon:
        'bg-amber-500 text-white',

      label:
        'text-amber-700',
    },

    cyan: {
      card:
        'border-cyan-200 bg-gradient-to-br from-cyan-50 to-white',

      icon:
        'bg-cyan-700 text-white',

      label:
        'text-cyan-700',
    },
  };

  const style =
    styles[variant];

  return (
    <article
      className={`group relative overflow-hidden rounded-[1.75rem] border p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${style.card}`}
    >
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-slate-900/[0.03]" />

      <div className="relative">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ${style.icon}`}
        >
          <Icon
            size={23}
          />
        </div>

        <p
          className={`mt-5 text-[11px] font-extrabold uppercase tracking-[0.15em] ${style.label}`}
        >
          {label}
        </p>

        <p className="mt-2 text-xl font-black tracking-tight text-slate-900 xl:text-[1.35rem]">
          {formatRupiah(
            value
          )}
        </p>

        <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </article>
  );
}

/* =========================================================
   BUDGET BAR
========================================================= */

function BudgetBar({
  nominal,
  total,
}: {
  nominal: number;
  total: number;
}) {
  return (
    <div className="mt-4">
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500"
          style={{
            width:
              `${getBarWidth(
                nominal,
                total
              )}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   RINCIAN ROW
========================================================= */

function RincianRow({
  item,
}: {
  item:
    RincianAnggaran;
}) {
  return (
    <div className="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-start sm:justify-between">
      <p className="text-sm font-semibold leading-6 text-slate-600">
        {item.nama}
      </p>

      <p className="shrink-0 text-sm font-black text-slate-800">
        {formatRupiah(
          item.nominal
        )}
      </p>
    </div>
  );
}

/* =========================================================
   BELANJA CARD
========================================================= */

function BelanjaCard({
  bidang,
}: {
  bidang:
    BidangBelanja;
}) {
  const Icon =
    bidang.icon;

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 transition duration-300 hover:border-emerald-200 hover:shadow-md">
      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Icon
                size={21}
              />
            </div>

            <div>
              <h3 className="font-black leading-relaxed text-slate-900">
                {bidang.nama}
              </h3>

              <p className="mt-1 text-xs font-bold text-emerald-700">
                {formatPersentase(
                  bidang.nominal,
                  TOTAL_BELANJA
                )}{' '}
                dari total belanja
              </p>
            </div>
          </div>

          <p className="shrink-0 text-lg font-black text-slate-800">
            {formatRupiah(
              bidang.nominal
            )}
          </p>
        </div>

        <BudgetBar
          nominal={
            bidang.nominal
          }
          total={
            TOTAL_BELANJA
          }
        />
      </div>

      <div className="divide-y divide-slate-200 border-t border-slate-200 bg-white">
        {bidang.rincian.map(
          (item) => (
            <RincianRow
              key={
                item.nama
              }
              item={
                item
              }
            />
          )
        )}
      </div>
    </article>
  );
}

/* =========================================================
   PRINSIP CARD
========================================================= */

function PrinsipCard({
  item,
}: {
  item: {
    title: string;
    description:
      string;
    icon:
      LucideIcon;
  };
}) {
  const Icon =
    item.icon;

  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-100/60 opacity-0 blur-2xl transition group-hover:opacity-100" />

      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
          <Icon
            size={23}
          />
        </div>

        <h3 className="mt-5 font-black leading-6 text-slate-900">
          {item.title}
        </h3>

        <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
          {item.description}
        </p>
      </div>
    </article>
  );
}

/* =========================================================
   HERO VALUE
========================================================= */

function HeroValue({
  title,
  description,
}: {
  title: string;
  description:
    string;
}) {
  return (
    <article className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
      <p className="text-sm font-black text-white">
        {title}
      </p>

      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-emerald-200">
        {description}
      </p>
    </article>
  );
}

/* =========================================================
   HERO BUDGET ITEM
========================================================= */

function HeroBudgetItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.08] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-300/15 text-emerald-200">
          <Icon
            size={19}
          />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-100/65">
            {label}
          </p>

          <p className="mt-1 truncate text-base font-black text-white">
            {formatRupiah(
              value
            )}
          </p>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   MENU INDIKATOR
========================================================= */

function AntiKorupsiMenu({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description:
    string;
  icon: LucideIcon;
}) {
  return (
    <Link
      href={href}
      className="group relative flex min-h-[190px] flex-col border-b border-slate-200 bg-white p-5 transition duration-300 last:border-b-0 hover:bg-emerald-50 sm:border-b sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:border-r lg:[&:nth-child(2n)]:border-r lg:last:border-r-0"
    >
      <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-emerald-100/50 opacity-0 transition group-hover:opacity-100" />

      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
        <Icon
          size={21}
        />
      </div>

      <h2 className="relative mt-5 font-black text-slate-900">
        {title}
      </h2>

      <p className="relative mt-2 flex-1 text-xs font-medium leading-5 text-slate-500">
        {description}
      </p>

      <span className="relative mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
        Lihat dokumen

        <ArrowRight
          size={14}
          className="transition group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}