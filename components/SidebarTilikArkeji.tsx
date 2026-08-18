// components/SidebarTilikArkeji.tsx

import Link from 'next/link';

import {
  Archive,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Landmark,
  Users,
  type LucideIcon,
} from 'lucide-react';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

interface JumlahArsip {
  kepalaDesa: number;
  penghargaan: number;
  ebookSejarah: number;
}

async function getJumlahArsip():
  Promise<JumlahArsip> {
  const [
    kepalaDesaResult,
    penghargaanResult,
    ebookResult,
  ] =
    await Promise.all([
      supabaseAdmin
        .from(
          'tilik_arkeji_mantan_kades'
        )
        .select(
          'id',
          {
            count:
              'exact',

            head:
              true,
          }
        )
        .eq(
          'aktif',
          true
        ),

      supabaseAdmin
        .from(
          'tilik_arkeji_penghargaan'
        )
        .select(
          'id',
          {
            count:
              'exact',

            head:
              true,
          }
        )
        .eq(
          'aktif',
          true
        ),

      supabaseAdmin
        .from(
          'desa_wisata_dokumen'
        )
        .select(
          'id',
          {
            count:
              'exact',

            head:
              true,
          }
        )
        .eq(
          'jenis',
          'ebook-sejarah'
        )
        .eq(
          'aktif',
          true
        ),
    ]);

  if (
    kepalaDesaResult.error
  ) {
    console.error(
      'Gagal menghitung biografi kepala desa:',
      kepalaDesaResult.error
    );
  }

  if (
    penghargaanResult.error
  ) {
    console.error(
      'Gagal menghitung penghargaan:',
      penghargaanResult.error
    );
  }

  if (
    ebookResult.error
  ) {
    console.error(
      'Gagal menghitung ebook sejarah:',
      ebookResult.error
    );
  }

  return {
    kepalaDesa:
      kepalaDesaResult.count ??
      0,

    penghargaan:
      penghargaanResult.count ??
      0,

    ebookSejarah:
      ebookResult.count ??
      0,
  };
}

export default async function SidebarTilikArkeji() {
  const jumlah =
    await getJumlahArsip();

  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-lg shadow-emerald-950/5">
      {/* HEADER */}

      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 p-5 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',

            backgroundSize:
              '23px 23px',
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border-[25px] border-white/[0.04]"
        />

        <div className="relative">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-600/30 text-emerald-50">
            <Archive
              size={22}
            />
          </div>

          <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-200">
            Arsip Desa Keji
          </p>

          <h2 className="mt-2 text-xl font-black">
            Tilik Arkeji
          </h2>

          <p className="mt-2 text-xs font-medium leading-5 text-emerald-50/80">
            Menelusuri sejarah,
            kepemimpinan dan
            pencapaian Desa Keji.
          </p>
        </div>
      </div>

      {/* MENU */}

      <div className="space-y-3 bg-gradient-to-b from-white to-emerald-50/40 p-4">
        <SidebarMenu
          href="/profil/tilik-arkeji#kepala-desa"
          icon={Users}
          title="Biografi Kepala Desa Keji"
          description="Mengenal tokoh yang pernah memimpin Desa Keji."
          count={`${jumlah.kepalaDesa} arsip aktif`}
        />

        <SidebarMenu
          href="/profil/tilik-arkeji#penghargaan"
          icon={
            BadgeCheck
          }
          title="Penghargaan Desa"
          description="Prestasi dan pencapaian Desa Keji."
          count={`${jumlah.penghargaan} penghargaan`}
        />

        <SidebarMenu
          href="/profil/sejarah#ebook-sejarah"
          icon={
            BookOpen
          }
          title="Ebook Sejarah"
          description="Baca Ebook Sejarah Desa Keji."
          count={`${jumlah.ebookSejarah} ebook aktif`}
        />

        <Link
          href="/profil/tilik-arkeji"
          className="group flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-800"
        >
          <Landmark
            size={15}
          />

          Lihat Arsip Desa

          <ArrowRight
            size={14}
            className="transition group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
}

function SidebarMenu({
  href,
  icon: Icon,
  title,
  description,
  count,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  count: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
        <Icon
          size={19}
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-black leading-5 text-slate-800">
          {title}
        </h3>

        <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
          {description}
        </p>

        <p className="mt-2 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
          {count}
        </p>
      </div>

      <ArrowRight
        size={16}
        className="mt-3 shrink-0 text-emerald-300 transition group-hover:translate-x-1"
      />
    </Link>
  );
}