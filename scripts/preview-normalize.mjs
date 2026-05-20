/**
 * Center-crop and resize catalog previews to a square JPEG (default 512×512).
 */
import fs from 'node:fs';
import path from 'node:path';

export const PREVIEW_PX = 512;
export const PREVIEW_EXT = '.jpg';
export const PREVIEW_QUALITY = 82;

let sharpModule;

async function getSharp() {
  if (sharpModule) return sharpModule;
  try {
    sharpModule = (await import('sharp')).default;
    return sharpModule;
  } catch {
    throw new Error(
      'sharp is required. Run: npm install (from awesome-sites-site/)'
    );
  }
}

/**
 * @param {string} inputPath absolute path to any image
 * @param {string} outputPath absolute path for square JPEG
 */
export async function normalizePreviewFile(inputPath, outputPath) {
  const sharp = await getSharp();
  await sharp(inputPath)
    .rotate()
    .resize(PREVIEW_PX, PREVIEW_PX, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: PREVIEW_QUALITY, mozjpeg: true })
    .toFile(outputPath);
}

/**
 * @param {string} previewsDir
 * @param {string} siteId
 * @returns {string} relative path assets/previews/<id>.jpg
 */
export function previewRelPath(siteId) {
  return `assets/previews/${siteId}${PREVIEW_EXT}`;
}

/**
 * Remove other extensions for the same site id after normalizing.
 */
export function removeSiblingPreviews(previewsDir, siteId, keepAbs) {
  const exts = ['.png', '.gif', '.webp', '.jpeg', '.jpg', '.svg'];
  for (const ext of exts) {
    const p = path.join(previewsDir, siteId + ext);
    if (p !== keepAbs && fs.existsSync(p)) fs.unlinkSync(p);
  }
}
