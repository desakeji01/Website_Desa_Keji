// app/admin/berita/tambah/page.tsx

import BeritaForm from '@/components/admin/BeritaForm';

import {
  createBeritaAction,
} from '../actions';

export default function TambahBeritaPage() {
  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <div>
        <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
          Tambah Berita
        </h1>

        <p className="mt-2 text-sm font-medium text-slate-500">
          Buat berita atau informasi baru
          untuk website Desa Keji.
        </p>
      </div>

      <BeritaForm
        action={createBeritaAction}
        submitLabel="Simpan Berita"
      />
    </div>
  );
}