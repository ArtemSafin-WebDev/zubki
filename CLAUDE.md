# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Start Vite dev server
npm run build     # TypeScript check + production build (run after significant changes)
npm run preview   # Preview production build
```

**Before finishing any task:** `npm run build` must pass without errors.

## Architecture

Multi-page static site: Vite + TypeScript (strict) + SCSS + Handlebars templating. No SPA framework, no client-side router.

**Entry point:** `src/js/main.ts` — calls `ui()`, `sections()`, `initForms()` to initialize all components.

**Key directories:**
- `pages/*.html` — HTML pages, each is a separate Vite entry point
- `pages-data/*.js` — per-page Handlebars context (title, lists, etc.)
- `partials/` — reusable Handlebars partials
- `src/js/classes/components/` — UI component classes (Modal, Select, Accordion, etc.)
- `src/js/classes/facades/` — high-level facades (FormValidator)
- `src/js/classes/services/` — business logic (Validator, InputMasks)
- `src/js/ui/` — component initialization functions
- `src/js/forms/` — form wiring (validation + AJAX)
- `src/scss/` — layered styles: `tokens → base → layout → components → sections → utilities`
- `src/icons/` — SVG icons for sprite generation
- `public/` — static assets (fonts, images)

**Routing:** URL `/page-name.html` maps to `/pages/page-name.html`. The `vite.config.js` flattens the `/pages` directory in `dist` and routes dev requests automatically.

## Component Pattern

All UI components inherit from the abstract `Component` base class:
- Instance registry via `WeakMap` — retrieve with `SomeComponent.getInstanceFor(element)`
- Call `this.unregister()` and clean up event listeners in `destroy()`
- Components communicate via DOM events (e.g., `document.dispatchEvent(new Event("select:update"))`)

## Forms

Use existing abstractions:
- `FormValidator` (`src/js/classes/facades/FormValidator.ts`) for validation
- `AJAXForm` (`src/js/classes/components/AJAXForm.ts`) for async submission

## TypeScript Rules

- Strict mode, `noUnusedLocals`, `noUnusedParameters` are all enabled
- Avoid `any` unless absolutely necessary
- ESM only (`type: "module"` in package.json)

## SCSS Rules

- Maintain layered structure with `@layer` and `@use`
- Add new design tokens to `src/scss/tokens/*`
- Do not break `:root` variables
- Scale: `1rem = 10px`

## Figma / Layout Rules

- Follow Figma specs exactly — take sizes, spacing, typography, colors from the design
- Do NOT implement responsive/adaptive layout unless explicitly requested; if requested, only implement mobile breakpoint
- For repeating blocks (lists, sliders): extract a card partial and render via `pages-data` + Handlebars loop, not by duplicating HTML manually

## Images & Icons

- Raster images: `webp` format only, exported at 2× (retina) size
- Store images in `public/images/<component-name>/` (e.g., `public/images/news-card/1.webp`)
- SVG icons: store in `src/icons/`, reference via `<use>` (SVG sprite). Remove inline `fill` attributes so icons can be styled via CSS
- Do not convert SVGs to raster formats

## Vite Config Cautions

Do not modify plugin behavior unless explicitly asked:
- `cssRelativePublicUrls`
- `flattenPagesPlugin`
- `vite-plugin-handlebars`
- `vite-plugin-svg-icons`

Do not remove existing public APIs (e.g., `window.innoApi.Validator`).

Only edit source files (`src`, `pages`, `partials`, `pages-data`, `public`) — never `dist` or `node_modules`.
