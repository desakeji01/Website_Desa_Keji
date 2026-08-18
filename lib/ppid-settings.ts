// lib/ppid-settings.ts

import 'server-only';

import {
  PPID_DEFAULTS,
} from '@/lib/ppid-defaults';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

import type {
  PpidSettings,
} from '@/types/ppid';

function normalizePpidSettings(
  value: unknown
): PpidSettings {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return {
      ...PPID_DEFAULTS,
    };
  }

  const data =
    value as Record<
      string,
      unknown
    >;

  const validEntries =
    Object.entries(data).filter(
      ([, item]) => {
        if (
          item === null ||
          item === undefined
        ) {
          return false;
        }

        if (
          typeof item === 'string'
        ) {
          return (
            item.trim().length > 0
          );
        }

        return true;
      }
    );

  return {
    ...PPID_DEFAULTS,

    ...Object.fromEntries(
      validEntries
    ),
  } as PpidSettings;
}

export async function getPpidSettings():
  Promise<PpidSettings> {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from('ppid_settings')
    .select(`
      ppid_key,
      header_label,
      office_name,
      office_address,
      office_email,
      office_phone,
      office_hours,

      apa_title,
      apa_description,
      apa_hero_label,
      apa_hero_title,
      apa_hero_description,

      klasifikasi_title,
      klasifikasi_description,
      klasifikasi_hero_label,
      klasifikasi_hero_title,
      klasifikasi_hero_description,

      permohonan_title,
      permohonan_description,
      permohonan_hero_label,
      permohonan_hero_title,
      permohonan_hero_description,
      permohonan_poster_url,
      permohonan_poster_alt,
      permohonan_form_url,

      keberatan_title,
      keberatan_description,
      keberatan_hero_label,
      keberatan_hero_title,
      keberatan_hero_description,
      keberatan_poster_url,
      keberatan_poster_alt,
      keberatan_form_url,

      created_at,
      updated_at
    `)
    .eq(
      'ppid_key',
      'utama'
    )
    .maybeSingle();

  if (error) {
    console.error(
      'Gagal mengambil pengaturan PPID:',
      {
        message:
          error.message,

        code:
          error.code,

        details:
          error.details,

        hint:
          error.hint,
      }
    );

    return {
      ...PPID_DEFAULTS,
    };
  }

  return normalizePpidSettings(
    data
  );
}