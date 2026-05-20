.DEFAULT_GOAL := help

PORT = 8831

.PHONY: help
help:
	@echo ""
	@echo "  make serve    Dev server with CORS → http://localhost:$(PORT)"
	@echo "  make api      Regenerate api/v1/*.json from data/"
	@echo "  make previews       Fetch missing previews (OG meta)"
	@echo "  make previews-retry Missing previews + screenshot/favicon fallbacks"
	@echo "  make kill     Stop server on port $(PORT)"
	@echo ""

.PHONY: serve
serve:
	@echo "Serving → http://localhost:$(PORT) (CORS enabled for hub dev)"
	@PORT=$(PORT) python3 scripts/serve-cors.py

.PHONY: api
api:
	@node scripts/build-api.mjs

.PHONY: previews
previews:
	@node scripts/fetch-og-previews.mjs

.PHONY: previews-force
previews-force:
	@node scripts/fetch-og-previews.mjs --force

.PHONY: kill
kill:
	@lsof -ti :$(PORT) | xargs kill 2>/dev/null && echo "Stopped server on port $(PORT)" || echo "No server running on port $(PORT)"
