import type {
  ReactNode,
} from 'react';

import Link from 'next/link';

import {
  ArrowUpRight,
  Clock3,
  ExternalLink,
  Globe2,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';

export default function Footer() {
  const currentYear =
    new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#052e25] text-white">
      {/* Garis aksen atas */}

      <div className="h-1 bg-gradient-to-r from-emerald-900 via-emerald-400 to-emerald-900" />

      {/* Motif batik tipis */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage: `
            radial-gradient(
              ellipse 15px 23px at 50% 0%,
              transparent 0 10px,
              rgba(167, 243, 208, 0.8) 11px 12px,
              transparent 13px
            ),
            radial-gradient(
              ellipse 15px 23px at 50% 100%,
              transparent 0 10px,
              rgba(167, 243, 208, 0.8) 11px 12px,
              transparent 13px
            ),
            radial-gradient(
              ellipse 23px 15px at 0% 50%,
              transparent 0 10px,
              rgba(167, 243, 208, 0.8) 11px 12px,
              transparent 13px
            ),
            radial-gradient(
              ellipse 23px 15px at 100% 50%,
              transparent 0 10px,
              rgba(167, 243, 208, 0.8) 11px 12px,
              transparent 13px
            )
          `,

          backgroundSize:
            '52px 52px',
        }}
      />

      {/* Ornamen latar */}

      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border-[44px] border-white/[0.025]" />

      <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full border-[52px] border-emerald-300/[0.025]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6 lg:px-8">
        <div className="grid gap-9 md:grid-cols-2 lg:grid-cols-12">
          {/* =================================================
              IDENTITAS DESA
          ================================================= */}

          <div className="lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white p-1.5 shadow-lg">
                <img
                  src="/logodesakeji.png"
                  alt="Logo Desa Keji"
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                  Pemerintah Desa
                </p>

                <h2 className="mt-0.5 text-xl font-black text-white">
                  Desa Keji
                </h2>

                <p className="mt-0.5 text-[11px] font-medium text-emerald-100/55">
                  Ungaran Barat · Kabupaten Semarang
                </p>
              </div>
            </Link>

            <p className="mt-4 max-w-lg text-sm leading-6 text-emerald-50/60">
              Website resmi Pemerintah Desa Keji sebagai pusat
              informasi, pelayanan publik, transparansi pemerintahan,
              dan publikasi kegiatan desa.
            </p>

            <div className="mt-5 max-w-lg rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3 backdrop-blur-sm">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-300">
                    Keji Berani
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    Keji Anti Korupsi
                  </p>
                </div>

                <p className="mt-2 text-xs italic text-emerald-100/55 sm:mt-0 sm:text-right">
                  “Makarti Nyawiji Mbangun Desa Keji”
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              KONTAK
          ================================================= */}

          <div className="lg:col-span-4">
            <FooterTitle
              title="Hubungi Kami"
            />

            <ul className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-1">
              <ContactItem
                icon={
                  MapPin
                }
                label="Alamat Kantor"
              >
                Kantor Kepala Desa Keji, Kecamatan Ungaran Barat,
                Kabupaten Semarang
              </ContactItem>

              <ContactItem
                icon={
                  Phone
                }
                label="Telepon"
                href="tel:+6281329442688"
              >
                +62 813-2944-2688
              </ContactItem>

              <ContactItem
                icon={
                  Mail
                }
                label="Email"
                href="mailto:desakeji01@gmail.com"
              >
                desakeji01@gmail.com
              </ContactItem>

              <ContactItem
                icon={
                  Globe2
                }
                label="Website"
                href="https://keji-ungaranbarat.semarangkab.go.id"
                external
              >
                keji-ungaranbarat.semarangkab.go.id
              </ContactItem>
            </ul>
          </div>

          {/* =================================================
              JAM PELAYANAN
          ================================================= */}

          <div className="md:col-span-2 lg:col-span-3">
            <FooterTitle
              title="Jam Pelayanan"
            />

            <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.045] backdrop-blur-sm">
              <ServiceTime
                day="Senin – Kamis"
                time="08.00 – 15.00"
              />

              <ServiceTime
                day="Jumat"
                time="08.00 – 11.30"
              />

              <ServiceTime
                day="Sabtu – Minggu"
                time="Libur"
                isClosed
                last
              />
            </div>

            <Link
              href="/layanan"
              className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.1em] text-emerald-300 transition hover:text-white"
            >
              Akses layanan desa

              <ArrowUpRight
                size={14}
              />
            </Link>

            <p className="mt-3 text-[10px] font-medium leading-relaxed text-emerald-100/35">
              Jam pelayanan dapat berubah pada hari libur nasional
              atau kegiatan khusus desa.
            </p>
          </div>
        </div>

        {/* ===================================================
            COPYRIGHT + PENGEMBANG
        =================================================== */}

        <div className="mt-9 border-t border-white/10 pt-5">
          <div className="flex flex-col gap-4 text-[11px] font-medium text-emerald-100/40 lg:flex-row lg:items-center lg:justify-between">
            {/* COPYRIGHT */}

            <p>
              © {currentYear} Pemerintah Desa Keji. Hak cipta
              dilindungi.
            </p>

            {/* PENGEMBANG */}

            <div className="flex flex-col gap-1.5 lg:items-end">
              <p>
                Dikembangkan oleh{' '}
                <span className="font-bold text-emerald-100/70">
                  Tim KKN-T UNDIP 2026
                </span>
              </p>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-emerald-100/40">
                  Contact Person:
                </span>

                <span className="font-extrabold text-emerald-200">
                  Izac Luthfi Pranowo
                </span>

                <span className="hidden text-emerald-100/25 sm:inline">
                  ·
                </span>

                <a
                  href="https://wa.me/6289620467214"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hubungi Izac Luthfi Pranowo melalui WhatsApp"
                  className="group inline-flex items-center gap-1.5 font-extrabold text-emerald-300 transition hover:text-white"
                >
                  <Phone
                    size={12}
                  />

                  0896-2046-7214

                  <ArrowUpRight
                    size={11}
                    className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   FOOTER TITLE
========================================================= */

function FooterTitle({
  title,
}: {
  title: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-black uppercase tracking-[0.12em] text-white">
        {title}
      </h3>

      <div className="mt-2 h-0.5 w-8 rounded-full bg-emerald-400" />
    </div>
  );
}

/* =========================================================
   CONTACT ITEM
========================================================= */

interface ContactItemProps {
  icon:
    typeof MapPin;

  label:
    string;

  children:
    ReactNode;

  href?:
    string;

  external?:
    boolean;
}

function ContactItem({
  icon:
    Icon,

  label,

  children,

  href,

  external =
    false,
}: ContactItemProps) {
  const content = (
    <div className="group flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-300/10 text-emerald-300">
        <Icon
          size={15}
        />
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-100/35">
          {label}
        </p>

        <p className="mt-0.5 break-words text-xs font-medium leading-5 text-emerald-50/65 transition group-hover:text-white">
          {children}
        </p>
      </div>

      {external && (
        <ExternalLink
          size={12}
          className="mt-2 shrink-0 text-emerald-300/40"
        />
      )}
    </div>
  );

  if (
    !href
  ) {
    return (
      <li>
        {content}
      </li>
    );
  }

  return (
    <li>
      <a
        href={
          href
        }
        target={
          external
            ? '_blank'
            : undefined
        }
        rel={
          external
            ? 'noopener noreferrer'
            : undefined
        }
      >
        {content}
      </a>
    </li>
  );
}

/* =========================================================
   SERVICE TIME
========================================================= */

interface ServiceTimeProps {
  day:
    string;

  time:
    string;

  isClosed?:
    boolean;

  last?:
    boolean;
}

function ServiceTime({
  day,

  time,

  isClosed =
    false,

  last =
    false,
}: ServiceTimeProps) {
  return (
    <div
      className={`flex items-center justify-between gap-4 px-4 py-3 ${
        !last
          ? 'border-b border-white/10'
          : ''
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Clock3
          size={14}
          className={
            isClosed
              ? 'text-emerald-100/30'
              : 'text-emerald-300'
          }
        />

        <span className="text-xs font-semibold text-emerald-50/70">
          {day}
        </span>
      </div>

      <span
        className={`text-right text-[11px] font-bold ${
          isClosed
            ? 'text-emerald-100/35'
            : 'text-white'
        }`}
      >
        {time}
      </span>
    </div>
  );
}