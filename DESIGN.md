---
name: Awesome Sites
description: Curated external links you leave open — preview-led catalog on the Neorgon dark shell
colors:
  ink-night: "#0a0c12"
  elevated-slate: "#12151c"
  surface-glass: "#1a1d26"
  border-whisper: "#ffffff1a"
  text-primary: "#f7f7f9"
  text-secondary: "#c4c6cf"
  text-muted: "#8e9099"
  signal-amber: "#f97316"
  signal-amber-soft: "#f9731624"
  hub-magenta: "#b015b0"
  hub-violet: "#3d0080"
  error-coral: "#fca5a5"
typography:
  display:
    fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.2em"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.5px"
  body:
    fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
  title:
    fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "14px"
spacing:
  sm: "8px"
  md: "14px"
  lg: "18px"
  xl: "24px"
  page: "32px"
components:
  list-pill:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
  list-pill-active:
    backgroundColor: "{colors.signal-amber-soft}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
  btn-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
  site-row:
    backgroundColor: "{colors.elevated-slate}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "18px 20px"
---

# Design System: Awesome Sites

## Overview

**Creative North Star: "The Open Tab Shelf"**

Awesome Sites is a bookmark shelf for external tools, not a marketing landing page. The interface should feel like a personal reading list: each entry shows what the site looks like (preview first), then the name, domain, and a short reason to keep the tab. Density is comfortable but not sparse; the user scans vertically through a feed, filters by curated list, and opens links in a new tab.

The system inherits the Neorgon hub shell (violet header gradient, dark ink body, amber accent) but refuses the generic "AI catalog" patterns: no uniform icon grids, no neon hover halos, no dashed placeholder cards, no "EXTERNAL" badges on every row. Depth comes from elevated surfaces and a single hover lift, not glass blur or gradient text.

**Key Characteristics:**
- Preview-led horizontal rows (160px square 1:1 thumbnail + copy), inspired by Team Play resource cards
- Committed amber accent on filters, kicker, links, and hub badges only
- OKLCH-tinted neutrals on a violet-ink night background
- Sidebar list navigation on desktop; wrapped pills on mobile
- API/editor notes relegated to a collapsed details panel

## Colors

Warm violet ink at rest, signal amber for action and selection, Neorgon magenta in the header only.

### Primary
- **Signal Amber** (#f97316 / oklch(0.72 0.17 45)): Intro kicker, active list filter, hub badge text, API links, focus rings. The only saturated hue in the main canvas.
- **Signal Amber Soft** (#f9731624 / oklch(0.72 0.17 45 / 0.14)): Active list pill background and border tint.

### Neutral
- **Ink Night** (#0a0c12 / oklch(0.12 0.02 280)): Page background. Never pure black.
- **Elevated Slate** (#12151c / oklch(0.16 0.018 280)): Site row surfaces.
- **Surface Glass** (#1a1d26 / oklch(0.2 0.015 280 / 0.55)): Search field, API panel, idle pill hover.
- **Border Whisper** (#ffffff1a / oklch(0.92 0.01 280 / 0.1)): Row borders, inputs, dividers.
- **Text Primary** (#f7f7f9 / oklch(0.97 0.01 280)): Titles, active labels.
- **Text Secondary** (#c4c6cf / oklch(0.78 0.02 280)): Descriptions, intro lede.
- **Text Muted** (#8e9099 / oklch(0.62 0.02 280)): Domain, tags, footer, placeholders.

### Tertiary
- **Hub Magenta** (#b015b0): Header gradient start only (Neorgon brand bar).
- **Hub Violet** (#3d0080): Header gradient mid-stop.
- **Error Coral** (#fca5a5 / oklch(0.75 0.12 25)): Catalog load errors only.

### Named Rules
**The Preview Carries Color Rule.** Per-site accent colors from JSON are not painted across entire cards. Visual interest comes from screenshot or SVG previews, not from per-card neon glow variables.

**The Amber Budget Rule.** Signal amber appears on selection state, metadata kicker, hub chip, and links. It never fills large background areas except the soft active pill wash.

## Typography

**Display Font:** Avenir Next (with system-ui stack)
**Body Font:** Avenir Next (with system-ui stack)

**Character:** Humanist sans throughout, matching other Neorgon tools. No display serif; hierarchy is scale and weight, not font pairing.

### Hierarchy
- **Display** (600, 1.2em, 1.2): Header product title only.
- **Title** (700, 1.15rem, 1.25): Site name on each row. Tight letter-spacing (-0.02em).
- **Body** (400, 1rem, 1.6): Intro lede, descriptions, API panel. Cap prose near 52–65ch in intro.
- **Label** (700, 0.72rem, uppercase 0.08em tracking): "Lists" sidebar label, hub badge.

### Named Rules
**The Domain Stays Quiet Rule.** Domain names use muted 0.78rem tabular numerals. Never uppercase accent treatment; the site title owns emphasis.

## Elevation

Flat-by-default surfaces with one structural hover lift. No ambient glass, no gradient halos on cards.

Depth is conveyed by:
- `elevated-slate` rows on `ink-night` page
- Subtle radial washes (amber top, violet bottom corner) on `body` only
- Hover: 2px translateY + `0 12px 32px oklch(0 0 0 / 0.35)` on site rows

### Shadow Vocabulary
- **Row hover lift** (`box-shadow: 0 12px 32px oklch(0 0 0 / 0.35)`): Site row only, on hover. Never at rest.

### Named Rules
**The Flat-By-Default Rule.** Site rows have no glow pseudo-elements, no dashed borders, and no gradient overlays. Motion and shadow appear only on hover or focus.

## Components

### Header (Neorgon standard)
- **Height:** 68px sticky bar
- **Background:** `linear-gradient(135deg, #B015B0 0%, #3D0080 50%, #070a12 100%)` with `backdrop-filter: blur(12px)`
- **Logo:** 36px, inverted, spring hover scale(1.14) rotate(-9deg)
- **Home control:** 34px icon, margin-left auto

### List filter pills
- **Layout:** Vertical stack in 200px sidebar (desktop); horizontal wrap below 820px
- **Default:** Transparent background, secondary text
- **Active:** Amber-soft fill, stronger border tint, primary text, weight 600
- **Shape:** 8px radius, full-width buttons on desktop

### Search toolbar
- **Field:** Glass surface, 12px radius, icon + input, no border on input itself
- **Clear:** Ghost button (border whisper, transparent fill)
- **Count:** Muted small text, right-aligned on desktop

### Site row (signature component)
- **Layout:** CSS grid `160px 1fr` (square preview column); stacks full-width 1:1 preview above body under 600px
- **Preview:** `object-fit: cover`, min-height 148px; fallback panel if image fails
- **Body:** 18px 20px padding; meta row (domain + optional "On hub" chip), title, 2-line clamped description, label tags
- **Hover:** Border strongens, -2px Y, shadow lift
- **Focus:** 2px amber outline, 2px offset

### Tags
- **Style:** Small muted chips on elevated neutral wash; not accent-tinted per label

### API panel
- **Pattern:** Native `<details>`; surface glass background; collapsed by default
- **Links:** Signal amber, underline on hover

### Chips / Cards
- **Not used:** No generic card grid. The site row is the only container pattern.

## Do's and Don'ts

### Do:
- **Do** lead each external site with a square preview (`assets/previews/<id>.jpg`, 512×512 source) and fall back to a neutral placeholder on error.
- **Do** use horizontal preview + copy rows for the main feed (Team Play resource-card pattern).
- **Do** keep list filters in a sticky sidebar on viewports ≥820px.
- **Do** use OKLCH for CSS custom properties; tint every neutral toward violet ink (chroma ~0.02).
- **Do** limit amber accent to selection, links, kicker, and hub metadata.
- **Do** collapse editor/API documentation into the bottom details panel.

### Don't:
- **Don't** use identical auto-fill card grids with icon + heading + blurb repeats.
- **Don't** add dashed borders, gradient `::before` glows, or per-card `--card-glow` neon halos.
- **Don't** put "EXTERNAL" or letter-avatar badges on every row.
- **Don't** use glassmorphism on catalog surfaces (header blur is Neorgon-standard only).
- **Don't** use gradient text, hero metric blocks, or uppercase shouting domains.
- **Don't** use colored left-border stripes greater than 1px on rows or callouts.
- **Don't** park `make api` / `data/sites.json` instructions in the main intro; that belongs in API details.
- **Don't** animate layout properties; only border-color, transform, and box-shadow on rows (180–200ms ease-out).
