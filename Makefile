.DEFAULT_GOAL := help

PORT = 8831

.PHONY: help
help:
	@echo ""
	@echo "  make serve    Dev server with CORS → http://localhost:$(PORT)"
	@echo "  make api      Regenerate api/v1/*.json from data/"
	@echo "  make previews              Fetch missing previews (OG meta)"
	@echo "  make previews-retry        Missing + screenshot/favicon fallbacks"
	@echo "  make previews-force        Re-download all (with fallbacks)"
	@echo "  make previews RETRY=1      Same as previews-retry"
	@echo "  make previews FORCE=1      Same as previews-force"
	@echo "  make kill     Stop server on port $(PORT)"
	@echo ""

.PHONY: serve
serve:
	@echo "Serving → http://localhost:$(PORT) (CORS enabled for hub dev)"
	@PORT=$(PORT) python3 scripts/serve-cors.py

.PHONY: api
api:
	@node scripts/build-api.mjs

.PHONY: previews previews-retry previews-force
# Use RETRY=1 / FORCE=1 — not make previews --retry (Make eats those flags)
PREVIEW_NODE_ARGS :=
ifeq ($(filter 1 true yes,$(RETRY)),1)
PREVIEW_NODE_ARGS += --retry
endif
ifeq ($(filter 1 true yes,$(FORCE)),1)
PREVIEW_NODE_ARGS += --force --retry
endif

previews:
	@node scripts/fetch-og-previews.mjs $(PREVIEW_NODE_ARGS)

previews-retry:
	@$(MAKE) previews RETRY=1

previews-force:
	@$(MAKE) previews FORCE=1

.PHONY: kill
kill:
	@lsof -ti :$(PORT) | xargs kill 2>/dev/null && echo "Stopped server on port $(PORT)" || echo "No server running on port $(PORT)"
