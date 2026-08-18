// components/admin/DeleteBeritaButton.tsx

'use client';

import { Trash2 } from 'lucide-react';

import {
  deleteBeritaAction,
} from '@/app/admin/berita/actions';

interface DeleteBeritaButtonProps {
  id: number;
  judul: string;
}

export default function DeleteBeritaButton({
  id,
  judul,
}: DeleteBeritaButtonProps) {
  return (
    <form
      action={deleteBeritaAction}
      onSubmit={(event) => {
        const confirmed =
          window.confirm(
            `Hapus berita "${judul}"? Tindakan ini tidak dapat dibatalkan.`
          );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input
        type="hidden"
        name="id"
        value={id}
      />

      <button
        type="submit"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 transition hover:border-red-200 hover:bg-red-100"
        aria-label="Hapus berita"
        title="Hapus berita"
      >
        <Trash2 size={16} />
      </button>
    </form>
  );
}