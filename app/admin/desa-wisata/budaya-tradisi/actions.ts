// app/admin/desa-wisata/budaya-tradisi/actions.ts

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
    'desa_wisata_budaya',

  adminPath:
    '/admin/desa-wisata/budaya-tradisi',

  publicPath:
    '/desa-wisata/budaya-tradisi',

  storageFolder:
    'budaya-tradisi',

  allowLocation:
    false,

  allowSchedule:
    false,

  allowDate:
    false,
} satisfies WisataCrudConfig;

export async function tambahBudayaAction(
  formData: FormData
) {
  await createWisataCrudItem(
    formData,
    CONFIG
  );
}

export async function ubahBudayaAction(
  formData: FormData
) {
  await updateWisataCrudItem(
    formData,
    CONFIG
  );
}

export async function toggleBudayaAction(
  formData: FormData
) {
  await toggleWisataCrudItem(
    formData,
    CONFIG
  );
}

export async function hapusBudayaAction(
  formData: FormData
) {
  await deleteWisataCrudItem(
    formData,
    CONFIG
  );
}