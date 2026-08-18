// types/anti-korupsi-public.ts

import type {
  AntiKorupsiIconKey,
  JenisDokumenAntiKorupsi,
} from '@/types/anti-korupsi';

export interface DokumenAntiKorupsiPublik {
  id: string;
  judul: string;
  deskripsi: string;
  jenis: JenisDokumenAntiKorupsi;
  tahun: number | null;
  driveUrl: string;
}

export interface IndikatorAntiKorupsiPublik {
  id: string;
  kode: string;
  judul: string;
  ringkasan: string;
  iconKey: AntiKorupsiIconKey;
  dokumen: DokumenAntiKorupsiPublik[];
}