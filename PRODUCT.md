# Awesome Sites — Product notes

## Purpose

A lightweight catalog of external sites worth keeping open — whiteboards, ops utilities, data tools, and misc tabs — organized with **curated labels/lists** instead of a rigid taxonomy.

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
