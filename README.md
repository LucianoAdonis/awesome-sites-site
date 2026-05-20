# Awesome Sites

Curated external sites with labeled lists — the tabs you leave open. Static JSON catalog and API for the [Neorgon hub](https://neorgon.com/).

**Live:** [awesomesites.neorgon.com](https://awesomesites.neorgon.com/)

## Run locally

```bash
make serve   # http://localhost:8831 (CORS enabled for hub dev)
make api     # regenerate api/v1/*.json from data/
make previews # download OG images into assets/previews/ (requires network)
```

## Data

- `data/sites.json` — site entries (`id`, `name`, `url`, `description`, `labels`, `accent`, `featuredOnHub`)
- `data/lists.json` — curated lists (`id`, `label`, `description`, `siteIds`). Current lists: Video, Colors & fonts, Image edition/modification/cutting, Image & text content, Icons & GIFs, Sites, Music, Random (fun/dev/reviews), plus Whiteboard and DevOps.

### Preview images

Each site can set `"preview": "assets/previews/<id>.jpg"`. To pull Open Graph images from live sites:

```bash
make previews              # only sites missing a preview file (OG/meta)
make previews-retry        # missing sites + screenshot + favicon fallbacks
make previews-force        # re-download every preview (with fallbacks)
make previews RETRY=1      # same as previews-retry
make previews FORCE=1      # same as previews-force

# `make previews --retry` and `make previews --force` do NOT work — flags go to Make, not the script.
node scripts/fetch-og-previews.mjs --force --retry
node scripts/fetch-og-previews.mjs --id=convex
```

Previews are stored as **512×512 square JPEG** (`assets/previews/<id>.jpg`). To normalize existing files:

```bash
npm install   # once — installs sharp
make normalize-previews
```

Then run `make api` and commit `assets/previews/` with the data changes.

After editing data, run `make api` and commit the generated `api/v1/` files for GitHub Pages.

## API

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/catalog.json` | Sites, lists, and `hub` metadata for neorgon.com |
| `GET /api/v1/sites.json` | Sites only |
| `GET /api/v1/lists.json` | Lists only |

Cross-origin access: `_headers` sets `Access-Control-Allow-Origin: *` on `/api/*` (Cloudflare Pages). Local dev uses `scripts/serve-cors.py` via `make serve`.

## Hub integration

The hub loads `catalog.json` and renders featured external cards in the **Awesome Sites** section. Set `featuredOnHub: true` on sites you want on the hub.
