# Awesome Sites — Product notes

## Purpose

A lightweight catalog of **edition and content tools** — video, colors, image work, stock assets, icons, music, meta/SEO helpers, and misc tabs — organized with **curated lists** instead of a rigid taxonomy.

## Decisions

| Topic | Choice |
|-------|--------|
| Storage | JSON files in repo (not Convex) |
| Organization | Curated lists with labels; sites can appear in multiple lists |
| Hosting | Static site + static API on `awesomesites.neorgon.com` |
| Hub | `GET /api/v1/catalog.json`; featured cards on neorgon.com |
| Brand | **Awesome Sites** (not “Shelf” / registry naming) |

## Non-goals (for now)

- User accounts or submissions UI
- Convex / real-time sync
- Automatic link checking
