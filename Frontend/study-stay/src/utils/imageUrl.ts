/**
 * Google Drive "share" links are not directly embeddable in an <img> tag —
 * they render an HTML preview page instead of the raw image bytes. This
 * helper detects every common Google Drive share URL format, pulls out the
 * file id, and rewrites it into a URL that actually serves the image.
 *
 * Supported input formats:
 *   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *   https://drive.google.com/file/d/FILE_ID/view?usp=drive_link
 *   https://drive.google.com/open?id=FILE_ID
 *   https://drive.google.com/uc?id=FILE_ID&export=download
 *   https://drive.google.com/uc?export=view&id=FILE_ID
 *   https://docs.google.com/uc?id=FILE_ID
 *   https://drive.google.com/thumbnail?id=FILE_ID
 *
 * Any other URL (regular http(s) image links, relative /uploads/... paths
 * from our own backend, base64 data URLs, etc.) is returned unchanged.
 */

const DRIVE_HOST_PATTERN = /(drive|docs)\.google\.com/i;

// Our backend serves uploaded files (profile pictures, payment proofs, etc.)
// as relative paths like "/uploads/profiles/xxx.jpg". Those need to resolve
// against the API server's origin, not the frontend dev server's origin.
const getApiOrigin = (): string => {
  const base = (import.meta as unknown as { env: Record<string, string | undefined> }).env
    ?.VITE_API_BASE_URL || 'http://localhost:5000/api';
  return base.replace(/\/api\/?$/, '');
};

const extractDriveFileId = (url: string): string | null => {
  if (!DRIVE_HOST_PATTERN.test(url)) return null;

  // /file/d/FILE_ID/... or /d/FILE_ID/...
  const pathMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (pathMatch) return pathMatch[1];

  // ?id=FILE_ID or &id=FILE_ID (open?id=, uc?id=, thumbnail?id=)
  try {
    const parsed = new URL(url);
    const idParam = parsed.searchParams.get('id');
    if (idParam) return idParam;
  } catch {
    // Not a fully-qualified URL — fall through to regex fallback below.
    const queryMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (queryMatch) return queryMatch[1];
  }

  return null;
};

/**
 * Converts a Google Drive share link into a direct image URL. Non-Drive
 * URLs (or falsy values) are returned as-is.
 */
export const resolveImageUrl = (url?: string | null): string => {
  if (!url) return '';
  const fileId = extractDriveFileId(url);
  if (fileId) {
    // The Google "thumbnail" endpoint reliably serves raw image bytes (unlike
    // uc?export=view, which increasingly triggers a virus-scan interstitial
    // for larger files) and lets us request a sensible max size.
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  }
  if (url.startsWith('/uploads')) {
    return `${getApiOrigin()}${url}`;
  }
  return url;
};

/** Convenience helper for arrays of image URLs (e.g. property galleries). */
export const resolveImageUrls = (urls?: (string | null | undefined)[]): string[] =>
  (urls || []).map((url) => resolveImageUrl(url)).filter(Boolean);
