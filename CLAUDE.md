# CLAUDE.md — Awesome Sites

Curated external bookmarks with labeled lists and a static JSON API for the Neorgon hub.

**Live:** awesomesites.neorgon.com  
**Port:** 8831 (`make serve` uses CORS-enabled Python server)

## Architecture

Modular ES modules, no build step.

| File | Role |
|------|------|
| `data/sites.json`, `data/lists.json` | Source of truth |
| `scripts/build-api.mjs` | Writes `api/v1/*.json` including `catalog.json` |
| `scripts/fetch-og-previews.mjs` | Downloads `og:image` into `assets/previews/` (`make previews`) |
| `js/app.js` | Entry |
| `js/data.js` | Loads catalog, filters |
| `js/render.js` | List pills + site cards |
| `js/events.js` | Search and list filters |
| `js/state.js`, `js/utils.js` | Shared helpers |

## Hub contract

`api/v1/catalog.json` includes:

```json
{
  "hub": {
    "sectionTitle": "Awesome Sites",
    "sectionColor": "#f97316",
    "browseUrl": "https://awesomesites.neorgon.com/",
    "featuredSiteIds": ["excalidraw", "tldraw", "..."]
  }
}
```

Hub consumer: `neorgon-site/js/awesome-sites-hub.js` (cards use `data-card-id="as-{id}"`).

## Workflow

1. Edit `data/sites.json` or `data/lists.json`
2. `make previews` (optional) to pull OG images for new sites
3. `make api`
4. Test with `make serve` and hub on port 8800
