#!/usr/bin/env node
/**
 * Regenerate api/v1/*.json from data/sites.json + data/lists.json.
 * Run: node scripts/build-api.mjs  (or make api)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const sitesPayload = JSON.parse(fs.readFileSync(path.join(root, 'data/sites.json'), 'utf8'));
const listsPayload = JSON.parse(fs.readFileSync(path.join(root, 'data/lists.json'), 'utf8'));

const sites = sitesPayload.sites || [];
const lists = listsPayload.lists || [];
const generated = new Date().toISOString().slice(0, 10);
const base = 'https://awesomesites.neorgon.com';

const meta = {
  version: '1.0.0',
  generated,
  description: 'Curated external services and shareable labeled lists for Awesome Sites.',
  endpoints: {
    sites: `${base}/api/v1/sites.json`,
    lists: `${base}/api/v1/lists.json`,
    catalog: `${base}/api/v1/catalog.json`,
  },
};

const hub = {
  sectionTitle: 'Awesome Sites',
  sectionColor: '#f97316',
  browseUrl: `${base}/`,
  featuredSiteIds: sites.filter((s) => s.featuredOnHub).map((s) => s.id),
};

fs.mkdirSync(path.join(root, 'api/v1'), { recursive: true });

fs.writeFileSync(
  path.join(root, 'api/v1/sites.json'),
  JSON.stringify({ meta, sites }, null, 2) + '\n'
);
fs.writeFileSync(
  path.join(root, 'api/v1/lists.json'),
  JSON.stringify({ meta, lists }, null, 2) + '\n'
);
fs.writeFileSync(
  path.join(root, 'api/v1/catalog.json'),
  JSON.stringify({ meta, sites, lists, hub }, null, 2) + '\n'
);

console.log(`Wrote api/v1/*.json (${sites.length} sites, ${lists.length} lists)`);
