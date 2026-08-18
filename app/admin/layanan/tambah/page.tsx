// app/admin/layanan/tambah/page.tsx

import {
  FilePlus2,
} from 'lucide-react';

import LayananForm from '@/components/admin/LayananForm';

export default function TambahLayananPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] px-6 py-7 text-white shadow-xl sm:px-8 sm:py-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.13) 1.5px, transparent 1.5px)',
            backgroundSize:
              '26px 26px',
          }}
        />

        <div className="relative flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <FilePlus2
              size={26}
            />
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-200">
              Layanan Desa
            </p>

            <h1 className="mt-2 text-2xl font-black sm:text-3xl">
              Tambah Layanan
            </h1>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-emerald-50/80">
              Tambahkan jenis pelayanan administrasi dan persyaratan yang perlu disiapkan oleh masyarakat.
            </p>
          </div>
        </div>
      </section>

      <LayananForm
        mode="tambah"
      />
    </div>
  );
}