import DesaCantikPenduduk2026 from '@/components/public/DesaCantikPenduduk2026';

import type { PendudukKelompokUmur2026 } from '@/lib/desa-cantik-penduduk-2026';
import type { PendudukKelompokUmur } from '@/types/desa-cantik';

interface DesaCantikPendudukProps {
  rows: PendudukKelompokUmur[];
  tahun: number;
  sumber: string;
}

function buatIdKelompokUmur(
  kelompokUmur: string,
  index: number,
) {
  const id = kelompokUmur
    .replace(/\s*Tahun$/i, '')
    .replace(/\+/g, '-plus')
    .replace(/[–—]/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return id || `kelompok-${index + 1}`;
}

export default function DesaCantikPenduduk({
  rows,
  tahun,
  sumber,
}: DesaCantikPendudukProps) {
  const rowsBertema: PendudukKelompokUmur2026[] = rows.map(
    (row, index) => ({
      id: buatIdKelompokUmur(row.kelompokUmur, index),
      ...row,
    }),
  );

  return (
    <DesaCantikPenduduk2026
      rows={rowsBertema}
      tahun={tahun}
      sumber={sumber}
    />
  );
}
