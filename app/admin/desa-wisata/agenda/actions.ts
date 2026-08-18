// app/admin/desa-wisata/agenda/actions.ts

'use server';

import {
  createWisataCrudItem,
  deleteWisataCrudItem,
  toggleWisataCrudItem,
  updateWisataCrudItem,
  type WisataCrudConfig,
} from '@/lib/desa-wisata-admin';

const CONFIG = {
  table:
    'desa_wisata_agenda',

  adminPath:
    '/admin/desa-wisata/agenda',

  publicPath:
    '/desa-wisata/agenda',

  storageFolder:
    'agenda',

  allowLocation:
    true,

  allowSchedule:
    true,

  allowDate:
    true,
} satisfies WisataCrudConfig;

export async function tambahAgendaAction(
  formData: FormData
) {
  await createWisataCrudItem(
    formData,
    CONFIG
  );
}

export async function ubahAgendaAction(
  formData: FormData
) {
  await updateWisataCrudItem(
    formData,
    CONFIG
  );
}

export async function toggleAgendaAction(
  formData: FormData
) {
  await toggleWisataCrudItem(
    formData,
    CONFIG
  );
}

export async function hapusAgendaAction(
  formData: FormData
) {
  await deleteWisataCrudItem(
    formData,
    CONFIG
  );
}