# Awesome Sites

Curated external sites with labeled lists — the tabs you leave open. Static JSON catalog and API for the [Neorgon hub](https://neorgon.com/).

**Live:** [awesomesites.neorgon.com](https://awesomesites.neorgon.com/)

## Run locally

```bash
make serve   # http://localhost:8831 (CORS enabled for hub dev)
make api     # regenerate api/v1/*.json from data/
```

## Data

- `data/sites.json` — site entries (`id`, `name`, `url`, `description`, `labels`, `accent`, `featuredOnHub`)
- `data/lists.json` — curated lists (`id`, `label`, `description`, `siteIds`). Current lists: Video, Colors & fonts, Image edition/modification/cutting, Image & text content, Icons & GIFs, Sites, Music, Random (fun/dev/reviews), plus Whiteboard and Dev & ops.

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
