// app/admin/umkm/video-actions.ts

'use server';

import {
  revalidatePath,
} from 'next/cache';

import {
  redirect,
} from 'next/navigation';

import {
  createClient,
} from '@/lib/server';

import {
  supabaseAdmin,
} from '@/lib/supabase-admin';

const ADMIN_PATH =
  '/admin/umkm';

const VIDEO_TABLE =
  'umkm_video_tutorial';

/* =========================================================
   AUTH
========================================================= */

async function requireAdmin() {
  const supabase =
    await createClient();

  const {
    data: {
      user,
    },
    error,
  } =
    await supabase.auth.getUser();

  if (
    error ||
    !user
  ) {
    redirect(
      '/login'
    );
  }
}

/* =========================================================
   HELPERS
========================================================= */

function getString(
  formData:
    FormData,

  key:
    string
) {
  return String(
    formData.get(
      key
    ) ??
      ''
  ).trim();
}

function getBoolean(
  formData:
    FormData,

  key:
    string
) {
  return (
    getString(
      formData,
      key
    ) ===
    'true'
  );
}

function getNumber(
  formData:
    FormData,

  key:
    string
) {
  return Number(
    getString(
      formData,
      key
    )
  );
}

function buildAdminUrl(
  type:
    | 'success'
    | 'error',

  message:
    string
) {
  const params =
    new URLSearchParams({
      [type]:
        message,
    });

  return (
    `${ADMIN_PATH}?` +
    `${params.toString()}` +
    '#video-tutorial'
  );
}

function revalidateVideoUmkm() {
  revalidatePath(
    '/admin/umkm'
  );

  revalidatePath(
    '/umkm'
  );

  revalidatePath(
    '/admin'
  );
}

/* =========================================================
   YOUTUBE
========================================================= */

function extractYoutubeId(
  value:
    string
) {
  if (
    !value
  ) {
    return null;
  }

  let url:
    URL;

  try {
    url =
      new URL(
        value
      );
  } catch {
    return null;
  }

  if (
    url.protocol !==
      'https:' &&
    url.protocol !==
      'http:'
  ) {
    return null;
  }

  const hostname =
    url.hostname
      .toLowerCase()
      .replace(
        /^www\./,
        ''
      );

  let videoId =
    '';

  /* =======================================================
     youtu.be/VIDEO_ID
  ======================================================= */

  if (
    hostname ===
    'youtu.be'
  ) {
    const segments =
      url.pathname
        .split('/')
        .filter(
          Boolean
        );

    videoId =
      segments[0] ??
      '';
  }

  /* =======================================================
     youtube.com
  ======================================================= */

  else if (
    hostname ===
      'youtube.com' ||
    hostname.endsWith(
      '.youtube.com'
    ) ||
    hostname ===
      'youtube-nocookie.com' ||
    hostname.endsWith(
      '.youtube-nocookie.com'
    )
  ) {
    /* watch?v= */

    if (
      url.pathname ===
      '/watch'
    ) {
      videoId =
        url.searchParams.get(
          'v'
        ) ??
        '';
    } else {
      const segments =
        url.pathname
          .split('/')
          .filter(
            Boolean
          );

      const type =
        segments[0];

      /*
       * shorts/VIDEO_ID
       * embed/VIDEO_ID
       * live/VIDEO_ID
       */

      if (
        type ===
          'shorts' ||
        type ===
          'embed' ||
        type ===
          'live'
      ) {
        videoId =
          segments[1] ??
          '';
      }
    }
  }

  videoId =
    videoId.trim();

  if (
    !/^[A-Za-z0-9_-]{11}$/.test(
      videoId
    )
  ) {
    return null;
  }

  return videoId;
}

function canonicalYoutubeUrl(
  videoId:
    string
) {
  return (
    'https://www.youtube.com/watch?v=' +
    videoId
  );
}

/* =========================================================
   INPUT
========================================================= */

interface VideoInput {
  judul:
    string;

  deskripsi:
    string;

  youtubeUrl:
    string;

  youtubeId:
    string |
    null;

  urutan:
    number;

  aktif:
    boolean;
}

function parseVideoInput(
  formData:
    FormData
): VideoInput {
  const youtubeUrl =
    getString(
      formData,
      'youtube_url'
    );

  return {
    judul:
      getString(
        formData,
        'judul'
      ),

    deskripsi:
      getString(
        formData,
        'deskripsi'
      ),

    youtubeUrl,

    youtubeId:
      extractYoutubeId(
        youtubeUrl
      ),

    urutan:
      getNumber(
        formData,
        'urutan'
      ),

    aktif:
      getBoolean(
        formData,
        'aktif'
      ),
  };
}

/* =========================================================
   VALIDATION
========================================================= */

function validateVideo(
  input:
    VideoInput
) {
  if (
    input.judul.length <
    5
  ) {
    return 'Judul video minimal terdiri dari 5 karakter.';
  }

  if (
    input.judul.length >
    160
  ) {
    return 'Judul video maksimal terdiri dari 160 karakter.';
  }

  if (
    input.deskripsi.length >
    800
  ) {
    return 'Deskripsi video maksimal terdiri dari 800 karakter.';
  }

  if (
    !input.youtubeUrl
  ) {
    return 'URL video YouTube wajib diisi.';
  }

  if (
    !input.youtubeId
  ) {
    return (
      'URL YouTube tidak valid. ' +
      'Kolom ini khusus untuk link video individual, ' +
      'bukan link channel. Gunakan URL video YouTube, ' +
      'YouTube Shorts, Live, atau youtu.be.'
    );
  }

  if (
    !Number.isInteger(
      input.urutan
    ) ||
    input.urutan <
      0
  ) {
    return 'Nomor urutan harus berupa bilangan bulat minimal 0.';
  }

  return null;
}

/* =========================================================
   TAMBAH VIDEO
========================================================= */

export async function tambahVideoTutorialUmkmAction(
  formData:
    FormData
) {
  await requireAdmin();

  const input =
    parseVideoInput(
      formData
    );

  const validationError =
    validateVideo(
      input
    );

  if (
    validationError
  ) {
    redirect(
      buildAdminUrl(
        'error',
        validationError
      )
    );
  }

  const youtubeId =
    input.youtubeId;

  if (
    !youtubeId
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'ID video YouTube tidak valid.'
      )
    );
  }

  const now =
    new Date()
      .toISOString();

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        VIDEO_TABLE
      )
      .insert({
        judul:
          input.judul,

        deskripsi:
          input.deskripsi ||
          null,

        youtube_url:
          canonicalYoutubeUrl(
            youtubeId
          ),

        youtube_id:
          youtubeId,

        urutan:
          input.urutan,

        aktif:
          input.aktif,

        created_at:
          now,

        updated_at:
          now,
      });

  if (
    error
  ) {
    console.error(
      'Gagal menambahkan video tutorial UMKM:',
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

    const message =
      error.code ===
      '23505'
        ? 'Video YouTube tersebut sudah terdaftar.'
        : error.message;

    redirect(
      buildAdminUrl(
        'error',
        message
      )
    );
  }

  revalidateVideoUmkm();

  redirect(
    buildAdminUrl(
      'success',
      'Video tutorial UMKM berhasil ditambahkan.'
    )
  );
}

/* =========================================================
   UBAH VIDEO
========================================================= */

export async function ubahVideoTutorialUmkmAction(
  formData:
    FormData
) {
  await requireAdmin();

  const id =
    getString(
      formData,
      'id'
    );

  if (
    !id
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'ID video tidak valid.'
      )
    );
  }

  const input =
    parseVideoInput(
      formData
    );

  const validationError =
    validateVideo(
      input
    );

  if (
    validationError
  ) {
    redirect(
      buildAdminUrl(
        'error',
        validationError
      )
    );
  }

  const youtubeId =
    input.youtubeId;

  if (
    !youtubeId
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'ID video YouTube tidak valid.'
      )
    );
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        VIDEO_TABLE
      )
      .update({
        judul:
          input.judul,

        deskripsi:
          input.deskripsi ||
          null,

        youtube_url:
          canonicalYoutubeUrl(
            youtubeId
          ),

        youtube_id:
          youtubeId,

        urutan:
          input.urutan,

        aktif:
          input.aktif,

        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        'id',
        id
      );

  if (
    error
  ) {
    console.error(
      'Gagal memperbarui video tutorial UMKM:',
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

    const message =
      error.code ===
      '23505'
        ? 'Video YouTube tersebut sudah digunakan oleh video tutorial lainnya.'
        : error.message;

    redirect(
      buildAdminUrl(
        'error',
        message
      )
    );
  }

  revalidateVideoUmkm();

  redirect(
    buildAdminUrl(
      'success',
      'Video tutorial UMKM berhasil diperbarui.'
    )
  );
}

/* =========================================================
   STATUS VIDEO
========================================================= */

export async function toggleVideoTutorialUmkmAction(
  formData:
    FormData
) {
  await requireAdmin();

  const id =
    getString(
      formData,
      'id'
    );

  const aktif =
    getBoolean(
      formData,
      'aktif'
    );

  if (
    !id
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'ID video tidak valid.'
      )
    );
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        VIDEO_TABLE
      )
      .update({
        aktif,

        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        'id',
        id
      );

  if (
    error
  ) {
    console.error(
      'Gagal mengubah status video tutorial UMKM:',
      error
    );

    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidateVideoUmkm();

  redirect(
    buildAdminUrl(
      'success',
      aktif
        ? 'Video tutorial berhasil dipublikasikan.'
        : 'Video tutorial berhasil disembunyikan.'
    )
  );
}

/* =========================================================
   HAPUS VIDEO
========================================================= */

export async function hapusVideoTutorialUmkmAction(
  formData:
    FormData
) {
  await requireAdmin();

  const id =
    getString(
      formData,
      'id'
    );

  if (
    !id
  ) {
    redirect(
      buildAdminUrl(
        'error',
        'ID video tidak valid.'
      )
    );
  }

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        VIDEO_TABLE
      )
      .delete()
      .eq(
        'id',
        id
      );

  if (
    error
  ) {
    console.error(
      'Gagal menghapus video tutorial UMKM:',
      error
    );

    redirect(
      buildAdminUrl(
        'error',
        error.message
      )
    );
  }

  revalidateVideoUmkm();

  redirect(
    buildAdminUrl(
      'success',
      'Video tutorial UMKM berhasil dihapus.'
    )
  );
}