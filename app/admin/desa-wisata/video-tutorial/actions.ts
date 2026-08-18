// app/admin/desa-wisata/video-tutorial/actions.ts

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const ADMIN_PATH =
  '/admin/desa-wisata/video-tutorial';

const PUBLIC_PATH =
  '/desa-wisata/video-tutorial';

interface VideoTutorialInput {
  judul: string;
  deskripsi: string;
  kategori: string;
  youtubeUrlInput: string;
  youtubeId: string;
  youtubeUrl: string;
  urutan: number;
  aktif: boolean;
}

async function requireAdmin() {
  const supabase =
    await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return user;
}

function getString(
  formData: FormData,
  key: string
) {
  return String(
    formData.get(key) ?? ''
  ).trim();
}

function getBoolean(
  formData: FormData,
  key: string
) {
  return (
    getString(formData, key) ===
    'true'
  );
}

function getInteger(
  formData: FormData,
  key: string
) {
  return Number(
    getString(formData, key)
  );
}

function isValidYoutubeId(
  value: string
) {
  return /^[A-Za-z0-9_-]{11}$/.test(
    value
  );
}

function extractYoutubeId(
  input: string
): string | null {
  const raw = input.trim();

  if (!raw) {
    return null;
  }

  if (isValidYoutubeId(raw)) {
    return raw;
  }

  let url: URL;

  try {
    url = new URL(
      /^https?:\/\//i.test(raw)
        ? raw
        : `https://${raw}`
    );
  } catch {
    return null;
  }

  const hostname = url.hostname
    .toLowerCase()
    .replace(/^www\./, '');

  if (hostname === 'youtu.be') {
    const videoId =
      url.pathname
        .split('/')
        .filter(Boolean)[0] ?? '';

    return isValidYoutubeId(videoId)
      ? videoId
      : null;
  }

  const allowedHosts = [
    'youtube.com',
    'm.youtube.com',
    'music.youtube.com',
    'youtube-nocookie.com',
  ];

  if (
    !allowedHosts.includes(hostname)
  ) {
    return null;
  }

  const queryVideoId =
    url.searchParams.get('v');

  if (
    queryVideoId &&
    isValidYoutubeId(queryVideoId)
  ) {
    return queryVideoId;
  }

  const pathParts =
    url.pathname
      .split('/')
      .filter(Boolean);

  const supportedPaths = [
    'shorts',
    'embed',
    'live',
  ];

  if (
    supportedPaths.includes(
      pathParts[0] ?? ''
    )
  ) {
    const videoId =
      pathParts[1] ?? '';

    return isValidYoutubeId(videoId)
      ? videoId
      : null;
  }

  return null;
}

function buildYoutubeUrl(
  youtubeId: string
) {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

function buildAdminUrl(
  type: 'success' | 'error',
  message: string,
  section = 'daftar-video'
) {
  const params =
    new URLSearchParams({
      [type]: message,
    });

  return `${ADMIN_PATH}?${params.toString()}#${section}`;
}

function revalidateVideoTutorial() {
  revalidatePath(ADMIN_PATH);
  revalidatePath(PUBLIC_PATH);
  revalidatePath('/desa-wisata');
  revalidatePath('/admin');
}

function parseVideoInput(
  formData: FormData
): VideoTutorialInput | null {
  const youtubeUrlInput =
    getString(
      formData,
      'youtube_url'
    );

  const youtubeId =
    extractYoutubeId(
      youtubeUrlInput
    );

  if (!youtubeId) {
    return null;
  }

  return {
    judul: getString(
      formData,
      'judul'
    ),

    deskripsi: getString(
      formData,
      'deskripsi'
    ),

    kategori: getString(
      formData,
      'kategori'
    ),

    youtubeUrlInput,
    youtubeId,

    youtubeUrl:
      buildYoutubeUrl(
        youtubeId
      ),

    urutan: getInteger(
      formData,
      'urutan'
    ),

    aktif: getBoolean(
      formData,
      'aktif'
    ),
  };
}

function validateVideoInput(
  input: VideoTutorialInput
) {
  if (input.judul.length < 5) {
    return 'Judul video minimal terdiri dari 5 karakter.';
  }

  if (
    input.deskripsi.length < 10
  ) {
    return 'Deskripsi video minimal terdiri dari 10 karakter.';
  }

  if (
    input.kategori.length < 3
  ) {
    return 'Kategori video minimal terdiri dari 3 karakter.';
  }

  if (
    !isValidYoutubeId(
      input.youtubeId
    )
  ) {
    return 'Link YouTube tidak valid.';
  }

  if (
    !Number.isInteger(
      input.urutan
    ) ||
    input.urutan < 0
  ) {
    return 'Nomor urutan harus berupa bilangan bulat minimal 0.';
  }

  return null;
}

function videoPayload(
  input: VideoTutorialInput
) {
  return {
    judul: input.judul,
    deskripsi: input.deskripsi,
    kategori: input.kategori,

    youtube_url:
      input.youtubeUrl,

    youtube_id:
      input.youtubeId,

    urutan: input.urutan,
    aktif: input.aktif,

    updated_at:
      new Date().toISOString(),
  };
}

async function cekVideo(
  id: string
): Promise<{
  valid: boolean;
  message?: string;
}> {
  const { data, error } =
    await supabaseAdmin
      .from(
        'desa_wisata_video'
      )
      .select('id')
      .eq('id', id)
      .maybeSingle();

  if (error) {
    return {
      valid: false,
      message: error.message,
    };
  }

  if (!data) {
    return {
      valid: false,
      message:
        'Video tutorial tidak ditemukan.',
    };
  }

  return {
    valid: true,
  };
}

export async function tambahVideoTutorialAction(
  formData: FormData
) {
  await requireAdmin();

  const input =
    parseVideoInput(
      formData
    );

  if (!input) {
    redirect(
      buildAdminUrl(
        'error',
        'Link YouTube tidak valid. Gunakan link video YouTube, YouTube Shorts, atau youtu.be.',
        'tambah-video'
      )
    );
  }

  const validationError =
    validateVideoInput(input);

  if (validationError) {
    redirect(
      buildAdminUrl(
        'error',
        validationError,
        'tambah-video'
      )
    );
  }

  const { error } =
    await supabaseAdmin
      .from(
        'desa_wisata_video'
      )
      .insert({
        ...videoPayload(input),

        created_at:
          new Date().toISOString(),
      });

  if (error) {
    console.error(
      'Gagal menambahkan video tutorial:',
      {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }
    );

    redirect(
      buildAdminUrl(
        'error',
        error.code === '23505'
          ? 'Video YouTube tersebut sudah pernah ditambahkan.'
          : error.message,
        'tambah-video'
      )
    );
  }

  revalidateVideoTutorial();

  redirect(
    buildAdminUrl(
      'success',
      'Video tutorial berhasil ditambahkan.'
    )
  );
}

export async function ubahVideoTutorialAction(
  formData: FormData
) {
  await requireAdmin();

  const id = getString(
    formData,
    'id'
  );

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID video tidak valid.'
      )
    );
  }

  const videoCheck =
    await cekVideo(id);

  if (!videoCheck.valid) {
    redirect(
      buildAdminUrl(
        'error',
        videoCheck.message ??
          'Video tutorial tidak ditemukan.'
      )
    );
  }

  const input =
    parseVideoInput(
      formData
    );

  if (!input) {
    redirect(
      buildAdminUrl(
        'error',
        'Link YouTube tidak valid.'
      )
    );
  }

  const validationError =
    validateVideoInput(input);

  if (validationError) {
    redirect(
      buildAdminUrl(
        'error',
        validationError
      )
    );
  }

  const { error } =
    await supabaseAdmin
      .from(
        'desa_wisata_video'
      )
      .update(
        videoPayload(input)
      )
      .eq('id', id);

  if (error) {
    console.error(
      'Gagal memperbarui video tutorial:',
      {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }
    );

    redirect(
      buildAdminUrl(
        'error',
        error.code === '23505'
          ? 'Video YouTube tersebut sudah digunakan oleh data lain.'
          : error.message
      )
    );
  }

  revalidateVideoTutorial();

  redirect(
    buildAdminUrl(
      'success',
      'Video tutorial berhasil diperbarui.'
    )
  );
}

export async function toggleVideoTutorialAction(
  formData: FormData
) {
  await requireAdmin();

  const id = getString(
    formData,
    'id'
  );

  const aktif = getBoolean(
    formData,
    'aktif'
  );

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID video tidak valid.'
      )
    );
  }

  const videoCheck =
    await cekVideo(id);

  if (!videoCheck.valid) {
    redirect(
      buildAdminUrl(
        'error',
        videoCheck.message ??
          'Video tutorial tidak ditemukan.'
      )
    );
  }

  const { error } =
    await supabaseAdmin
      .from(
        'desa_wisata_video'
      )
      .update({
        aktif,

        updated_at:
          new Date().toISOString(),
      })
      .eq('id', id);

  if (error) {
    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidateVideoTutorial();

  redirect(
    buildAdminUrl(
      'success',
      aktif
        ? 'Video berhasil dipublikasikan.'
        : 'Video berhasil disembunyikan.'
    )
  );
}

export async function hapusVideoTutorialAction(
  formData: FormData
) {
  await requireAdmin();

  const id = getString(
    formData,
    'id'
  );

  if (!id) {
    redirect(
      buildAdminUrl(
        'error',
        'ID video tidak valid.'
      )
    );
  }

  const videoCheck =
    await cekVideo(id);

  if (!videoCheck.valid) {
    redirect(
      buildAdminUrl(
        'error',
        videoCheck.message ??
          'Video tutorial tidak ditemukan.'
      )
    );
  }

  const { error } =
    await supabaseAdmin
      .from(
        'desa_wisata_video'
      )
      .delete()
      .eq('id', id);

  if (error) {
    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidateVideoTutorial();

  redirect(
    buildAdminUrl(
      'success',
      'Video tutorial berhasil dihapus.'
    )
  );
}