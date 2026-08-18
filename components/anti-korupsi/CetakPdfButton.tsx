// components/anti-korupsi/CetakPdfButton.tsx

'use client';

import {
  FileDown,
} from 'lucide-react';

export default function CetakPdfButton() {
  function handlePrint() {
    window.print();
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="print-hide inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-emerald-800"
    >
      <FileDown size={18} />

      Cetak / Simpan PDF
    </button>
  );
}