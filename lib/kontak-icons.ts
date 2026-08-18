// lib/kontak-icons.ts

import {
  Building2,
  Headphones,
  HeartPulse,
  Landmark,
  Phone,
  ShieldCheck,
  Siren,
  Users,
  type LucideIcon,
} from 'lucide-react';

import type {
  KontakIconKey,
} from '@/types/kontak-desa';

export const KONTAK_ICON_MAP:
  Record<
    KontakIconKey,
    LucideIcon
  > = {
  LANDMARK:
    Landmark,

  BUILDING:
    Building2,

  SHIELD:
    ShieldCheck,

  HEALTH:
    HeartPulse,

  USERS:
    Users,

  PHONE:
    Phone,

  HEADPHONES:
    Headphones,

  SIREN:
    Siren,
};

export const KONTAK_ICON_OPTIONS: {
  value: KontakIconKey;
  label: string;
}[] = [
  {
    value: 'LANDMARK',
    label: 'Pemerintahan',
  },
  {
    value: 'BUILDING',
    label: 'Kantor',
  },
  {
    value: 'SHIELD',
    label: 'Keamanan',
  },
  {
    value: 'HEALTH',
    label: 'Kesehatan',
  },
  {
    value: 'USERS',
    label: 'Wilayah/Dusun',
  },
  {
    value: 'PHONE',
    label: 'Telepon',
  },
  {
    value: 'HEADPHONES',
    label: 'Pelayanan',
  },
  {
    value: 'SIREN',
    label: 'Darurat',
  },
];