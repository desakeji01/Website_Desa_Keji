// lib/anti-korupsi-public.ts

import { supabaseAdmin } from '@/lib/supabase-admin';

import {
  ANTI_KORUPSI_ICON_OPTIONS,
  JENIS_DOKUMEN_ANTI_KORUPSI,
  type AntiKorupsiIconKey,
  type JenisDokumenAntiKorupsi,
} from '@/types/anti-korupsi';

import type {
  DokumenAntiKorupsiPublik,
  IndikatorAntiKorupsiPublik,
} from '@/types/anti-korupsi-public';

function safeString(
  value: unknown
) {
  return String(
    value ?? ''
  ).trim();
}

function isIconKey(
  value: string
): value is AntiKorupsiIconKey {
  return (
    ANTI_KORUPSI_ICON_OPTIONS as readonly string[]
  ).includes(value);
}

function isJenisDokumen(
  value: string
): value is JenisDokumenAntiKorupsi {
  return (
    JENIS_DOKUMEN_ANTI_KORUPSI as readonly string[]
  ).includes(value);
}

function isValidExternalUrl(
  value: string
) {
  try {
    const url = new URL(value);

    return (
      url.protocol === 'https:' &&
      (
        url.hostname === 'drive.google.com' ||
        url.hostname === 'docs.google.com'
      )
    );
  } catch {
    return false;
  }
}

export async function getModulAntiKorupsiPublik(
  subSlug: string
): Promise<IndikatorAntiKorupsiPublik[]> {
  const indikatorResult =
    await supabaseAdmin
      .from('anti_korupsi_indikator')
      .select(`
        id,
        kode,
        judul,
        ringkasan,
        icon_key,
        urutan,
        created_at
      `)
      .eq('sub_slug', subSlug)
      .eq('aktif', true)
      .order('urutan', {
        ascending: true,
      })
      .order('created_at', {
        ascending: true,
      });

  if (indikatorResult.error) {
    console.error(
      `Gagal mengambil indikator ${subSlug}:`,
      {
        message:
          indikatorResult.error.message,

        code:
          indikatorResult.error.code,

        details:
          indikatorResult.error.details,

        hint:
          indikatorResult.error.hint,
      }
    );

    return [];
  }

  const indikatorDasar = (
    indikatorResult.data ?? []
  )
    .map((row) => {
      const id =
        safeString(row.id);

      const kode =
        safeString(row.kode);

      const judul =
        safeString(row.judul);

      const iconKey =
        safeString(row.icon_key);

      if (
        !id ||
        !kode ||
        !judul ||
        !isIconKey(iconKey)
      ) {
        return null;
      }

      return {
        id,
        kode,
        judul,

        ringkasan:
          safeString(
            row.ringkasan
          ),

        iconKey,
      };
    })
    .filter(
      (
        item
      ): item is Omit<
        IndikatorAntiKorupsiPublik,
        'dokumen'
      > => item !== null
    );

  const indikatorIds =
    indikatorDasar.map(
      (item) => item.id
    );

  if (
    indikatorIds.length === 0
  ) {
    return [];
  }

  const dokumenResult =
    await supabaseAdmin
      .from('anti_korupsi_dokumen')
      .select(`
        id,
        indikator_id,
        judul,
        deskripsi,
        jenis,
        tahun,
        drive_url,
        urutan,
        created_at
      `)
      .in(
        'indikator_id',
        indikatorIds
      )
      .eq('aktif', true)
      .order('urutan', {
        ascending: true,
      })
      .order('created_at', {
        ascending: true,
      });

  if (dokumenResult.error) {
    console.error(
      `Gagal mengambil dokumen ${subSlug}:`,
      {
        message:
          dokumenResult.error.message,

        code:
          dokumenResult.error.code,

        details:
          dokumenResult.error.details,

        hint:
          dokumenResult.error.hint,
      }
    );
  }

  const dokumenMap =
    new Map<
      string,
      DokumenAntiKorupsiPublik[]
    >();

  for (
    const row of
      dokumenResult.data ?? []
  ) {
    const id =
      safeString(row.id);

    const indikatorId =
      safeString(
        row.indikator_id
      );

    const judul =
      safeString(row.judul);

    const jenis =
      safeString(row.jenis);

    const driveUrl =
      safeString(
        row.drive_url
      );

    if (
      !id ||
      !indikatorId ||
      !judul ||
      !isJenisDokumen(jenis) ||
      !isValidExternalUrl(driveUrl)
    ) {
      continue;
    }

    const rawTahun =
      row.tahun;

    const tahun =
      rawTahun === null ||
      rawTahun === undefined
        ? null
        : Number(rawTahun);

    const dokumen:
      DokumenAntiKorupsiPublik = {
      id,
      judul,

      deskripsi:
        safeString(
          row.deskripsi
        ),

      jenis,

      tahun:
        tahun !== null &&
        Number.isInteger(tahun)
          ? tahun
          : null,

      driveUrl,
    };

    const daftar =
      dokumenMap.get(
        indikatorId
      ) ?? [];

    daftar.push(dokumen);

    dokumenMap.set(
      indikatorId,
      daftar
    );
  }

  return indikatorDasar.map(
    (indikator) => ({
      ...indikator,

      dokumen:
        dokumenMap.get(
          indikator.id
        ) ?? [],
    })
  );
}