// app/admin/desa-wisata/destinasi/actions.ts

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
    'desa_wisata_destinasi',

  adminPath:
    '/admin/desa-wisata/destinasi',

  publicPath:
    '/desa-wisata/destinasi',

  storageFolder:
    'destinasi',

  allowLocation:
    true,

  allowSchedule:
    false,

  allowDate:
    false,
} satisfies WisataCrudConfig;

export async function tambahDestinasiAction(
  formData: FormData
) {
  await createWisataCrudItem(
    formData,
    CONFIG
  );
}

export async function ubahDestinasiAction(
  formData: FormData
) {
  await updateWisataCrudItem(
    formData,
    CONFIG
  );
}

export async function toggleDestinasiAction(
  formData: FormData
) {
  await toggleWisataCrudItem(
    formData,
    CONFIG
  );
}

export async function hapusDestinasiAction(
  formData: FormData
) {
  await deleteWisataCrudItem(
    formData,
    CONFIG
  );
}