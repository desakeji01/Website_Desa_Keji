// components/admin/AdminShell.tsx

'use client';

import {
  useState,
  type ReactNode,
} from 'react';

import Link from 'next/link';
import {
  usePathname,
} from 'next/navigation';

import {
  ChevronRight,
  Landmark,
  LogOut,
  Menu,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';

import {
  signOutAction,
} from '@/app/admin/actions';

import NotifikasiPermohonan from '@/components/admin/NotifikasiPermohonan';

import {
  adminMenuGroups,
} from '@/lib/admin-navigation';

interface AdminShellProps {
  children: ReactNode;
  email: string;
  displayName: string;
}

export default function AdminShell({
  children,
  email,
  displayName,
}: AdminShellProps) {
  const pathname =
    usePathname();

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  function isMenuActive(
    href: string
  ) {
    if (href === '/admin') {
      return pathname === '/admin';
    }

    return (
      pathname === href ||
      pathname.startsWith(
        `${href}/`
      )
    );
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#f2f7f5]">
      <style>{`
        @keyframes admin-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .admin-marquee-track {
          width: max-content;
          animation: admin-marquee 28s linear infinite;
        }

        .admin-marquee-container:hover
        .admin-marquee-track {
          animation-play-state: paused;
        }

        .admin-sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color:
            rgba(167, 243, 208, 0.28)
            transparent;
        }

        .admin-sidebar-scroll::-webkit-scrollbar {
          width: 5px;
        }

        .admin-sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .admin-sidebar-scroll::-webkit-scrollbar-thumb {
          border-radius: 999px;
          background:
            rgba(167, 243, 208, 0.25);
        }

        .admin-sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background:
            rgba(167, 243, 208, 0.42);
        }

        @media (prefers-reduced-motion: reduce) {
          .admin-marquee-track {
            animation: none;
          }
        }
      `}</style>

      {/* Overlay sidebar mobile */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={
            closeSidebar
          }
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-[285px]
          flex-col
          overflow-hidden
          border-r
          border-emerald-300/10
          bg-gradient-to-b
          from-[#033f32]
          via-[#065f46]
          to-[#022c22]
          text-white
          shadow-2xl
          transition-transform
          duration-300
          lg:translate-x-0
          ${
            sidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >
        {/* Lapisan warna dasar */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.025] via-transparent to-black/[0.08]" />

        {/* Motif batik kawung */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.24]"
          style={{
            backgroundImage: `
              radial-gradient(
                ellipse 18px 28px at 50% 0%,
                transparent 0 13px,
                rgba(167, 243, 208, 0.48) 14px 15px,
                transparent 16px
              ),
              radial-gradient(
                ellipse 18px 28px at 50% 100%,
                transparent 0 13px,
                rgba(167, 243, 208, 0.48) 14px 15px,
                transparent 16px
              ),
              radial-gradient(
                ellipse 28px 18px at 0% 50%,
                transparent 0 13px,
                rgba(167, 243, 208, 0.48) 14px 15px,
                transparent 16px
              ),
              radial-gradient(
                ellipse 28px 18px at 100% 50%,
                transparent 0 13px,
                rgba(167, 243, 208, 0.48) 14px 15px,
                transparent 16px
              ),
              radial-gradient(
                circle at 50% 50%,
                rgba(209, 250, 229, 0.48) 0 2px,
                transparent 3px 9px,
                rgba(110, 231, 183, 0.28) 10px 11px,
                transparent 12px
              )
            `,
            backgroundSize:
              '58px 58px',
            backgroundPosition:
              '0 0, 0 0, 0 0, 0 0, 0 0',
          }}
        />

        {/* Motif batik lapisan kedua */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage: `
              radial-gradient(
                ellipse 16px 25px at 50% 0%,
                transparent 0 11px,
                rgba(255, 255, 255, 0.48) 12px 13px,
                transparent 14px
              ),
              radial-gradient(
                ellipse 16px 25px at 50% 100%,
                transparent 0 11px,
                rgba(255, 255, 255, 0.48) 12px 13px,
                transparent 14px
              ),
              radial-gradient(
                ellipse 25px 16px at 0% 50%,
                transparent 0 11px,
                rgba(255, 255, 255, 0.48) 12px 13px,
                transparent 14px
              ),
              radial-gradient(
                ellipse 25px 16px at 100% 50%,
                transparent 0 11px,
                rgba(255, 255, 255, 0.48) 12px 13px,
                transparent 14px
              )
            `,
            backgroundSize:
              '58px 58px',
            backgroundPosition:
              '29px 29px, 29px 29px, 29px 29px, 29px 29px',
          }}
        />

        {/* Isen-isen diagonal */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent 0,
                transparent 22px,
                rgba(255, 255, 255, 0.28) 23px,
                transparent 24px,
                transparent 46px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent 0,
                transparent 22px,
                rgba(110, 231, 183, 0.25) 23px,
                transparent 24px,
                transparent 46px
              )
            `,
          }}
        />

        {/* Ornamen sidebar */}
        <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rotate-12 rounded-[42%] border-[48px] border-emerald-200/[0.045]" />

        <div className="pointer-events-none absolute -bottom-40 -left-36 h-96 w-96 -rotate-12 rounded-[42%] border-[64px] border-white/[0.035]" />

        {/* Gradasi sidebar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-[#033f32]/80 to-transparent" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#022c22]/90 to-transparent" />

        <div className="pointer-events-none absolute bottom-28 right-0 top-40 w-px bg-gradient-to-b from-transparent via-emerald-200/25 to-transparent" />

        {/* Header sidebar */}
        <div className="relative flex h-[84px] shrink-0 items-center justify-between border-b border-white/10 bg-[#033f32]/25 px-5 backdrop-blur-[2px]">
          <Link
            href="/admin"
            onClick={
              closeSidebar
            }
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur-md">
              <Landmark
                size={23}
                strokeWidth={2.1}
                className="text-emerald-100"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold uppercase tracking-[0.14em] text-white">
                Admin Panel
              </p>

              <p className="mt-0.5 truncate text-[11px] font-medium text-emerald-100/70">
                Pemerintah Desa Keji
              </p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Tutup sidebar"
            onClick={
              closeSidebar
            }
            className="rounded-xl p-2 text-emerald-100 transition hover:bg-white/10 lg:hidden"
          >
            <X size={21} />
          </button>
        </div>

        {/* Profil admin */}
        <div className="relative shrink-0 px-4 pt-5">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#064e3b]/70 p-3.5 shadow-lg shadow-black/10 backdrop-blur-md">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent" />

            <div className="relative flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-200/20 bg-emerald-100/10 text-emerald-50 shadow-lg">
                <UserRound
                  size={21}
                  strokeWidth={2.2}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-white">
                  {displayName}
                </p>

                <p
                  title={email}
                  className="mt-0.5 truncate text-[11px] font-medium text-emerald-100/70"
                >
                  {email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigasi sidebar */}
        <nav className="admin-sidebar-scroll relative min-h-0 flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-6">
            {adminMenuGroups.map(
              (group) => (
                <section
                  key={group.label}
                >
                  <div className="mb-3 flex items-center gap-2 px-3">
                    <Sparkles
                      size={12}
                      className="text-emerald-200/70"
                    />

                    <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-100/60">
                      {group.label}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    {group.items.map(
                      (item) => {
                        const Icon =
                          item.icon;

                        const active =
                          item.enabled &&
                          isMenuActive(
                            item.href
                          );

                        /*
                         * Modul yang belum memiliki halaman
                         * admin tetap ditampilkan agar seluruh
                         * konten publik terlihat pada sidebar.
                         */
                        if (
                          !item.enabled
                        ) {
                          return (
                            <div
                              key={
                                item.id
                              }
                              title="Halaman pengelolaan admin belum dibuat"
                              aria-disabled="true"
                              className="group relative flex cursor-not-allowed items-center gap-3 overflow-hidden rounded-xl bg-[#064e3b]/15 px-3.5 py-3 text-sm font-semibold text-emerald-50/45"
                            >
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.045] text-emerald-200/45">
                                <Icon
                                  size={18}
                                  strokeWidth={2.1}
                                />
                              </span>

                              <span className="min-w-0 flex-1 truncate">
                                {item.label}
                              </span>

                              <span className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.05] px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.1em] text-emerald-100/40">
                                Segera
                              </span>
                            </div>
                          );
                        }

                        return (
                          <Link
                            key={
                              item.id
                            }
                            href={
                              item.href
                            }
                            onClick={
                              closeSidebar
                            }
                            className={`
                              group
                              relative
                              flex
                              items-center
                              gap-3
                              overflow-hidden
                              rounded-xl
                              px-3.5
                              py-3
                              text-sm
                              font-semibold
                              transition-all
                              duration-200
                              ${
                                active
                                  ? 'bg-white text-emerald-900 shadow-xl shadow-black/10'
                                  : 'bg-[#064e3b]/20 text-emerald-50/90 hover:bg-white/10 hover:text-white'
                              }
                            `}
                          >
                            {active && (
                              <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-emerald-600" />
                            )}

                            <span
                              className={`
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                transition
                                ${
                                  active
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-white/[0.07] text-emerald-200 group-hover:bg-white/10'
                                }
                              `}
                            >
                              <Icon
                                size={18}
                                strokeWidth={2.1}
                              />
                            </span>

                            <span className="min-w-0 flex-1 truncate">
                              {item.label}
                            </span>

                            <ChevronRight
                              size={16}
                              className={`
                                shrink-0
                                transition
                                ${
                                  active
                                    ? 'translate-x-0 text-emerald-600'
                                    : '-translate-x-1 text-emerald-100/40 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                                }
                              `}
                            />
                          </Link>
                        );
                      }
                    )}
                  </div>
                </section>
              )
            )}
          </div>
        </nav>

        {/* Logout */}
        <div className="relative shrink-0 border-t border-white/10 bg-[#022c22]/50 p-4 backdrop-blur-sm">
          <form
            action={
              signOutAction
            }
          >
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-bold text-emerald-50 transition hover:border-emerald-200/20 hover:bg-white/10"
            >
              <LogOut size={18} />

              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Area konten admin */}
      <div className="min-h-screen lg:pl-[285px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-[84px] items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 shadow-sm backdrop-blur-xl sm:gap-4 sm:px-6 lg:px-9">
          {/* Tombol sidebar mobile */}
          <button
            type="button"
            aria-label="Buka sidebar"
            onClick={() =>
              setSidebarOpen(
                true
              )
            }
            className="shrink-0 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 lg:hidden"
          >
            <Menu size={21} />
          </button>

          {/* Teks berjalan */}
          <div className="admin-marquee-container relative min-w-0 flex-1 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white via-white/90 to-transparent" />

            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white via-white/90 to-transparent" />

            <div className="admin-marquee-track flex items-center">
              <div className="flex shrink-0 items-center gap-5 pr-20">
                <span className="text-[13px] font-semibold uppercase tracking-[0.32em] text-slate-700">
                  Sistem Informasi Desa Keji
                </span>

                <span className="h-[5px] w-[5px] rounded-full bg-emerald-500/70" />

                <span className="text-[13px] font-semibold uppercase tracking-[0.32em] text-slate-700">
                  Portal Administrasi Pemerintah Desa
                </span>

                <span className="h-[5px] w-[5px] rounded-full bg-emerald-500/70" />

                <span className="text-[13px] font-semibold uppercase tracking-[0.32em] text-slate-700">
                  Cepat · Aman · Terintegrasi
                </span>
              </div>

              <div
                aria-hidden="true"
                className="flex shrink-0 items-center gap-5 pr-20"
              >
                <span className="text-[13px] font-semibold uppercase tracking-[0.32em] text-slate-700">
                  Sistem Informasi Desa Keji
                </span>

                <span className="h-[5px] w-[5px] rounded-full bg-emerald-500/70" />

                <span className="text-[13px] font-semibold uppercase tracking-[0.32em] text-slate-700">
                  Portal Administrasi Pemerintah Desa
                </span>

                <span className="h-[5px] w-[5px] rounded-full bg-emerald-500/70" />

                <span className="text-[13px] font-semibold uppercase tracking-[0.32em] text-slate-700">
                  Cepat · Aman · Terintegrasi
                </span>
              </div>
            </div>
          </div>

          {/* Notifikasi permohonan */}
          <NotifikasiPermohonan />

          {/* Informasi akun */}
          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-2 py-2 shadow-sm sm:px-3">
            <div className="hidden max-w-[210px] text-right md:block">
              <p className="truncate text-sm font-extrabold leading-tight text-slate-800">
                {displayName}
              </p>

              <p
                title={email}
                className="mt-0.5 truncate text-[11px] font-semibold text-emerald-700"
              >
                {email}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-md shadow-emerald-900/20">
              <UserRound
                size={20}
                strokeWidth={2.2}
              />
            </div>
          </div>
        </header>

        {/* Isi halaman admin */}
        <main className="p-4 sm:p-6 lg:p-9">
          {children}
        </main>
      </div>
    </div>
  );
}