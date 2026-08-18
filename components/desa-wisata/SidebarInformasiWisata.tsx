// components/desa-wisata/SidebarInformasiWisata.tsx

import Link from 'next/link';

import {
  BookOpen,
  ClipboardCheck,
  MapPinned,
  PieChart,
  type LucideIcon,
} from 'lucide-react';

interface Props {
  activePath: string;
}

interface MenuItem {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

const menuItems:
  MenuItem[] = [
    {
      label:
        'Informasi Kunjungan',

      description:
        'Panduan sebelum berkunjung',

      href:
        '/desa-wisata/informasi-kunjungan',

      icon:
        MapPinned,
    },

    {
      label:
        'Isi Survei Kepuasan',

      description:
        'Bagikan pengalaman kunjungan',

      href:
        '/desa-wisata/survei-kepuasan',

      icon:
        ClipboardCheck,
    },

    {
      label:
        'Hasil Survei',

      description:
        'Dashboard kepuasan wisatawan',

      href:
        '/desa-wisata/hasil-survei',

      icon:
        PieChart,
    },

    {
      label:
        'Paket Wisata',

      description:
        'Lihat pilihan paket wisata',

      href:
        '/desa-wisata/paket-wisata',

      icon:
        BookOpen,
    },
  ];

export default function SidebarInformasiWisata({
  activePath,
}: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-emerald-900/10 bg-emerald-950 text-white shadow-xl shadow-emerald-950/10">
      {/* Header */}

      <div className="border-b border-white/10 px-5 py-5">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-emerald-300">
          Desa Wisata Keji
        </p>

        <h2 className="mt-2 text-lg font-black">
          Informasi Wisata
        </h2>

        <p className="mt-2 text-xs font-medium leading-5 text-emerald-100/65">
          Informasi kunjungan dan
          evaluasi pengalaman
          wisatawan.
        </p>
      </div>

      {/* Menu */}

      <nav className="space-y-1 p-3">
        {menuItems.map(
          (item) => {
            const Icon =
              item.icon;

            const active =
              activePath ===
              item.href;

            return (
              <Link
                key={
                  item.href
                }
                href={
                  item.href
                }
                className={`group flex items-start gap-3 rounded-2xl px-4 py-3.5 transition ${
                  active
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-emerald-50/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                    active
                      ? 'bg-white/15'
                      : 'bg-white/[0.07] group-hover:bg-white/10'
                  }`}
                >
                  <Icon
                    size={17}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-extrabold">
                    {
                      item.label
                    }
                  </p>

                  <p
                    className={`mt-1 text-[10px] font-medium leading-4 ${
                      active
                        ? 'text-emerald-100'
                        : 'text-emerald-100/50'
                    }`}
                  >
                    {
                      item.description
                    }
                  </p>
                </div>
              </Link>
            );
          }
        )}
      </nav>

      {/* Footer */}

      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-[10px] font-medium leading-5 text-emerald-100/50">
          Makarti Nyawiji
          · Desa Keji
        </p>
      </div>
    </div>
  );
}