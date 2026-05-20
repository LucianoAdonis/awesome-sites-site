#!/usr/bin/env node
/**
 * Download preview images for catalog sites (OG → JSON-LD → icon → screenshot → favicon).
 *
 * Usage:
 *   node scripts/fetch-og-previews.mjs              # only sites missing preview file
 *   node scripts/fetch-og-previews.mjs --force      # re-fetch all
 *   node scripts/fetch-og-previews.mjs --retry        # missing file only, all fallbacks
 *   node scripts/fetch-og-previews.mjs --id=canva
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const sitesPath = path.join(root, 'data/sites.json');
const previewsDir = path.join(root, 'assets/previews');

const CHROME_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

const args = process.argv.slice(2);
const force = args.includes('--force');
const retry = args.includes('--retry') || force;
const idArg = args.find((a) => a.startsWith('--id='));
const onlyId = idArg ? idArg.slice('--id='.length) : null;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function hostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function extFromUrl(url, contentType) {
  try {
    const p = new URL(url).pathname.toLowerCase();
    if (p.endsWith('.png')) return '.png';
    if (p.endsWith('.webp')) return '.webp';
    if (p.endsWith('.gif')) return '.gif';
    if (p.endsWith('.jpg') || p.endsWith('.jpeg')) return '.jpg';
    if (p.endsWith('.ico')) return '.png';
  } catch {
    /* ignore */
  }
  if (contentType?.includes('image/png')) return '.png';
  if (contentType?.includes('image/webp')) return '.webp';
  if (contentType?.includes('image/gif')) return '.gif';
  return '.jpg';
}

function resolveUrl(raw, base) {
  try {
    return new URL(raw.trim(), base).href;
  } catch {
    return null;
  }
}

function isHttpsUrl(u) {
  try {
    return new URL(u).protocol === 'https:';
  } catch {
    return false;
  }
}

function extractMetaImages(html, pageUrl) {
  const found = [];
  const patterns = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/gi,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/gi,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(html)) !== null) {
      const u = resolveUrl(m[1], pageUrl);
      if (u && isHttpsUrl(u)) found.push(u);
    }
  }
  return [...new Set(found)];
}

function extractJsonLdImages(html, pageUrl) {
  const found = [];
  const blocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (!blocks) return found;
  for (const block of blocks) {
    const inner = block.replace(/<script[^>]*>|<\/script>/gi, '').trim();
    try {
      const data = JSON.parse(inner);
      collectJsonLdImages(data, pageUrl, found);
    } catch {
      /* ignore invalid JSON-LD */
    }
  }
  return [...new Set(found)];
}

function collectJsonLdImages(node, pageUrl, out) {
  if (!node) return;
  if (Array.isArray(node)) {
    node.forEach((n) => collectJsonLdImages(n, pageUrl, out));
    return;
  }
  if (typeof node !== 'object') return;
  if (typeof node.image === 'string') {
    const u = resolveUrl(node.image, pageUrl);
    if (u && isHttpsUrl(u)) out.push(u);
  } else if (node.image && typeof node.image === 'object') {
    const url = node.image.url || node.image['@id'];
    if (typeof url === 'string') {
      const u = resolveUrl(url, pageUrl);
      if (u && isHttpsUrl(u)) out.push(u);
    }
  }
  if (typeof node.thumbnailUrl === 'string') {
    const u = resolveUrl(node.thumbnailUrl, pageUrl);
    if (u && isHttpsUrl(u)) out.push(u);
  }
  for (const v of Object.values(node)) {
    if (v && typeof v === 'object') collectJsonLdImages(v, pageUrl, out);
  }
}

function extractIconImages(html, pageUrl) {
  const found = [];
  const re =
    /<link[^>]+rel=["'](?:apple-touch-icon|icon|shortcut icon)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const tag = m[0];
    const href = tag.match(/href=["']([^"']+)["']/i)?.[1];
    const sizes = tag.match(/sizes=["']([^"']+)["']/i)?.[1];
    if (!href) continue;
    const u = resolveUrl(href, pageUrl);
    if (!u || !isHttpsUrl(u)) continue;
    let rank = 0;
    if (sizes) {
      const nums = sizes.match(/(\d+)/g);
      if (nums?.length) rank = Math.max(...nums.map(Number));
    }
    if (tag.includes('apple-touch-icon')) rank += 64;
    found.push({ url: u, rank });
  }
  found.sort((a, b) => b.rank - a.rank);
  return found.map((f) => f.url);
}

function discoverCandidates(html, site) {
  const pageUrl = site.url;
  const host = hostname(site.url);
  const fromPage = [
    ...extractMetaImages(html, pageUrl),
    ...extractJsonLdImages(html, pageUrl),
    ...extractIconImages(html, pageUrl),
  ];
  const fallbacks = [];
  if (retry) {
    // SECURITY-REVIEW: screenshot/favicon URLs derived only from catalog site.url
    fallbacks.push(
      `https://s0.wp.com/mshots/v1/${encodeURIComponent(site.url)}?w=440&h=280`,
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=256`
    );
  }
  return [...new Set([...fromPage, ...fallbacks])];
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': CHROME_UA,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    signal: AbortSignal.timeout(25_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function downloadImage(imageUrl, destPath) {
  const res = await fetch(imageUrl, {
    redirect: 'follow',
    headers: {
      'User-Agent': CHROME_UA,
      Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    },
    signal: AbortSignal.timeout(35_000),
  });
  if (!res.ok) throw new Error(`image HTTP ${res.status}`);
  const type = res.headers.get('content-type') || '';
  if (!type.startsWith('image/')) throw new Error(`not an image (${type})`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 120) throw new Error('image too small');
  fs.writeFileSync(destPath, buf);
  return type;
}

function previewFileExists(site) {
  if (!site.preview) return false;
  return fs.existsSync(path.join(root, site.preview));
}

async function processSite(site) {
  if (!force && previewFileExists(site)) {
    return { id: site.id, status: 'skip', reason: 'preview on disk' };
  }

  let html = '';
  let pageError = null;
  try {
    html = await fetchHtml(site.url);
  } catch (err) {
    pageError = err.message;
    if (!retry) {
      return { id: site.id, status: 'fail', reason: `fetch page: ${pageError}` };
    }
  }

  const candidates = pageError ? discoverCandidates('', site) : discoverCandidates(html, site);
  if (!candidates.length) {
    return {
      id: site.id,
      status: 'fail',
      reason: pageError ? `fetch page: ${pageError}` : 'no image candidates',
    };
  }

  const errors = [];
  for (const imageUrl of candidates) {
    const ext = extFromUrl(imageUrl, '');
    const rel = `assets/previews/${site.id}${ext}`;
    const abs = path.join(root, rel);
    try {
      const contentType = await downloadImage(imageUrl, abs);
      const finalExt = extFromUrl(imageUrl, contentType);
      let finalRel = rel;
      if (finalExt !== ext) {
        const finalAbs = path.join(root, `assets/previews/${site.id}${finalExt}`);
        if (finalAbs !== abs && fs.existsSync(abs)) {
          fs.renameSync(abs, finalAbs);
          finalRel = `assets/previews/${site.id}${finalExt}`;
        }
      }
      site.preview = finalRel;
      const via = imageUrl.includes('mshots') ? 'screenshot' : imageUrl.includes('favicons') ? 'favicon' : 'og/meta';
      return { id: site.id, status: 'ok', preview: finalRel, reason: via };
    } catch (err) {
      errors.push(err.message);
      if (fs.existsSync(abs)) fs.unlinkSync(abs);
    }
  }

  return {
    id: site.id,
    status: 'fail',
    reason: pageError ? `page: ${pageError}; ${errors[0] || 'no image'}` : errors[0] || 'all candidates failed',
  };
}

async function main() {
  const payload = JSON.parse(fs.readFileSync(sitesPath, 'utf8'));
  const sites = payload.sites || [];
  fs.mkdirSync(previewsDir, { recursive: true });

  let targets = sites.filter((s) => force || !previewFileExists(s));
  if (onlyId) {
    targets = sites.filter((s) => s.id === onlyId);
    if (!targets.length) {
      console.error(`No site with id "${onlyId}"`);
      process.exit(1);
    }
  }

  if (!targets.length) {
    console.log('All sites already have preview files. Use --force to re-download.');
    return;
  }

  console.log(
    `Fetching ${targets.length} site(s)${retry ? ' (OG + screenshot + favicon fallbacks)' : ''}…\n`
  );

  const results = [];
  for (let i = 0; i < targets.length; i++) {
    const site = targets[i];
    const r = await processSite(site);
    results.push(r);
    const tag = r.status === 'ok' ? '✓' : r.status === 'skip' ? '·' : '✗';
    const extra = r.preview ? ` → ${r.preview}` : r.reason ? ` (${r.reason})` : '';
    console.log(`${tag} ${r.id}${extra}`);
    if (i < targets.length - 1) await sleep(500);
  }

  const changed = results.some((r) => r.status === 'ok');
  if (changed) {
    fs.writeFileSync(sitesPath, JSON.stringify(payload, null, 2) + '\n');
  }

  const ok = results.filter((r) => r.status === 'ok').length;
  const skip = results.filter((r) => r.status === 'skip').length;
  const fail = results.filter((r) => r.status === 'fail').length;
  const stillMissing = sites.filter((s) => !previewFileExists(s)).map((s) => s.id);

  console.log(`\nThis run: ${ok} saved, ${skip} skipped, ${fail} failed.`);
  if (stillMissing.length) {
    console.log(`Still missing preview (${stillMissing.length}): ${stillMissing.join(', ')}`);
    console.log('Tip: run `make previews-retry` for screenshot + favicon fallbacks.');
  } else {
    console.log('All sites have a preview file.');
  }
  if (changed) console.log(`Updated ${sitesPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
