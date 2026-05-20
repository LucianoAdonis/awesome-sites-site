#!/usr/bin/env node
/**
 * Batch-normalize all assets/previews/* to square 512×512 JPEG and sync sites.json.
 *
 * Usage: node scripts/normalize-previews.mjs [--id=siteId]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  normalizePreviewFile,
  previewRelPath,
  removeSiblingPreviews,
} from './preview-normalize.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const sitesPath = path.join(root, 'data/sites.json');
const previewsDir = path.join(root, 'assets/previews');

const idArg = process.argv.find((a) => a.startsWith('--id='));
const onlyId = idArg ? idArg.slice('--id='.length) : null;

function findSourceFile(siteId, hintRel) {
  if (hintRel) {
    const abs = path.join(root, hintRel);
    if (fs.existsSync(abs)) return abs;
  }
  const exts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
  for (const ext of exts) {
    const abs = path.join(previewsDir, siteId + ext);
    if (fs.existsSync(abs)) return abs;
  }
  return null;
}

async function main() {
  const payload = JSON.parse(fs.readFileSync(sitesPath, 'utf8'));
  const sites = payload.sites || [];
  fs.mkdirSync(previewsDir, { recursive: true });

  let targets = sites;
  if (onlyId) {
    targets = sites.filter((s) => s.id === onlyId);
    if (!targets.length) {
      console.error(`No site with id "${onlyId}"`);
      process.exit(1);
    }
  }

  let ok = 0;
  let skip = 0;
  let fail = 0;

  for (const site of targets) {
    const src = findSourceFile(site.id, site.preview);
    const rel = previewRelPath(site.id);
    const dest = path.join(root, rel);

    if (!src) {
      delete site.preview;
      console.log(`✗ ${site.id} (no source file)`);
      fail++;
      continue;
    }

    if (src === dest) {
      try {
        const buf = fs.readFileSync(dest);
        const { default: sharp } = await import('sharp');
        const meta = await sharp(buf).metadata();
        if (meta.width === 512 && meta.height === 512 && meta.format === 'jpeg') {
          site.preview = rel;
          console.log(`· ${site.id} (already ${rel})`);
          skip++;
          continue;
        }
      } catch {
        /* re-normalize */
      }
    }

    try {
      const tmp = dest + '.tmp';
      await normalizePreviewFile(src, tmp);
      fs.renameSync(tmp, dest);
      removeSiblingPreviews(previewsDir, site.id, dest);
      site.preview = rel;
      console.log(`✓ ${site.id} → ${rel}`);
      ok++;
    } catch (err) {
      console.log(`✗ ${site.id} (${err.message})`);
      fail++;
    }
  }

  fs.writeFileSync(sitesPath, JSON.stringify(payload, null, 2) + '\n');
  console.log(`\nDone: ${ok} normalized, ${skip} skipped, ${fail} failed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
