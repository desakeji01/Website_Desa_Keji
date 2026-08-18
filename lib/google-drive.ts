// lib/google-drive.ts

function safeString(
  value: unknown
) {
  return String(
    value ?? ''
  ).trim();
}

export function isValidHttpUrl(
  value: unknown
) {
  const rawUrl =
    safeString(value);

  if (!rawUrl) {
    return false;
  }

  try {
    const url =
      new URL(rawUrl);

    return (
      url.protocol === 'https:' ||
      url.protocol === 'http:'
    );
  } catch {
    return false;
  }
}

export function isGoogleDriveFolderUrl(
  value: unknown
) {
  const rawUrl =
    safeString(value);

  return (
    rawUrl.includes(
      'drive.google.com/drive/folders/'
    ) ||
    rawUrl.includes(
      'drive.google.com/drive/u/'
    ) &&
    rawUrl.includes('/folders/')
  );
}

export function getGoogleDriveFileId(
  value: unknown
): string | null {
  const rawUrl =
    safeString(value);

  if (!rawUrl) {
    return null;
  }

  const patterns = [
    /drive\.google\.com\/file\/d\/([^/?#]+)/i,
    /drive\.google\.com\/open\?id=([^&#]+)/i,
    /drive\.google\.com\/uc\?(?:[^#]*&)?id=([^&#]+)/i,
    /[?&]id=([^&#]+)/i,
  ];

  for (const pattern of patterns) {
    const match =
      rawUrl.match(pattern);

    const id =
      match?.[1]?.trim();

    if (id) {
      return id;
    }
  }

  return null;
}

export function getGoogleDriveImageUrl(
  value: unknown,
  width = 1600
): string | null {
  const rawUrl =
    safeString(value);

  if (!rawUrl) {
    return null;
  }

  const fileId =
    getGoogleDriveFileId(
      rawUrl
    );

  if (!fileId) {
    return rawUrl;
  }

  const safeWidth =
    Math.max(
      200,
      Math.min(
        Math.floor(width),
        3000
      )
    );

  return (
    'https://drive.google.com/thumbnail' +
    `?id=${encodeURIComponent(fileId)}` +
    `&sz=w${safeWidth}`
  );
}