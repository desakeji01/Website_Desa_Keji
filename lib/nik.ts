// lib/nik.ts

import 'server-only';

import {
  createHmac,
} from 'node:crypto';

export function normalisasiNik(
  value: string
) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16);
}

export function hashNik(
  nik: string
) {
  const normalizedNik =
    normalisasiNik(nik);

  if (
    !/^\d{16}$/.test(
      normalizedNik
    )
  ) {
    throw new Error(
      'NIK harus terdiri dari 16 angka.'
    );
  }

  const secret =
    process.env
      .NIK_HASH_SECRET;

  if (
    !secret ||
    secret.length < 32
  ) {
    throw new Error(
      'NIK_HASH_SECRET belum tersedia atau kurang dari 32 karakter.'
    );
  }

  return createHmac(
    'sha256',
    secret
  )
    .update(normalizedNik)
    .digest('hex');
}