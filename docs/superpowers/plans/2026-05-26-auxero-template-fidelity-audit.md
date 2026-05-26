# Auxero Template Fidelity Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore Bohemcars pages to faithful Auxero template typography, spacing, cards, and section behavior while keeping Bohemcars data, routes, and forms.

**Architecture:** Bohemcars renders raw Auxero HTML through server-side adapters in `src/lib/server`. Fixes should preserve the original template class structure first, then inject narrowly scoped CSS only where Bohemcars data requires it. Browser screenshots and DOM metrics compare `http://127.0.0.1:5173/*.html` template pages against `http://127.0.0.1:5199/*` Bohemcars routes.

**Tech Stack:** SvelteKit server routes, TypeScript HTML adapters, Auxero static CSS/JS, Playwright visual checks, Vitest unit tests.

---

### Task 1: Vehicle Detail Typography And Layout

**Files:**

- Modify: `src/lib/server/auxero-listing-data.ts`
- Modify if needed: `src/lib/server/auxero-template.ts`
- Test: `src/routes/project1.e2e.ts`

- [x] Capture `http://127.0.0.1:5173/listing-details-3.html` and `http://127.0.0.1:5199/inventory/21779200396408437` at desktop.
- [x] Compare computed font family, font size, line height, color, and class names for the detail title, price, sidebar headings, overview values, and related cards.
- [x] Fix the root cause in the detail data adapter or shared adapter so replaced Bohemcars markup keeps the template heading classes and text wrappers.
- [x] Remove or narrow any global injected CSS that overrides detail typography away from the template.
- [x] Add e2e assertions for the detail title class, price class, sidebar overview value class, and absence of obvious oversized/wrong-font detail text.

### Task 2: Home 05 Section Fidelity

**Files:**

- Modify: `src/lib/server/auxero-home-data.ts`
- Test: `src/routes/project1.e2e.ts`

- [x] Keep the fixed Home 05 brand strip at 12 template-style cards unless there is an explicit design decision to replace the whole section.
- [x] Keep Browse By Type on the template `card-37.jpg` through `card-42.jpg` gallery image family.
- [ ] Verify featured cards, compare cards, reviews, news, and CTA sections keep the same visible structure as `home-05.html`.
- [x] Add e2e assertions for section card counts and key image families where prior regressions happened.

### Task 3: Inventory Listing Fidelity

**Files:**

- Modify: `src/lib/server/auxero-listing-data.ts`
- Modify if needed: `src/lib/server/auxero-template.ts`
- Test: `src/routes/project1.e2e.ts`

- [ ] Compare `listing-grid3-columns.html` with `/inventory` for card typography, badge size, meta spacing, price row, compare button, and view details link.
- [ ] Keep Bohemcars dark inventory styling only if it still follows the template component proportions.
- [x] Add e2e assertions for card image ratio, title class, price class, and toolbar visibility.

### Task 4: Header And Logo Regression Guard

**Files:**

- Modify if needed: `src/lib/server/auxero-template.ts`
- Test: `src/routes/project1.e2e.ts`

- [ ] Verify public header uses one white `Sign In` CTA, centered nav, and no public `Add Listing`.
- [ ] Verify account/admin headers still expose role-appropriate listing actions.
- [ ] Keep logo dimensions aligned with header controls at desktop and mobile widths.

### Task 5: Verification Loop

**Files:**

- Test: `src/routes/project1.e2e.ts`
- Test: `src/lib/server/auxero-template.spec.ts`

- [x] Run `npm run lint`.
- [x] Run `npm run check`.
- [x] Run `npm run test:unit -- --run`.
- [x] Run `npx playwright test src/routes/project1.e2e.ts`.
- [x] Save desktop and mobile screenshots for any page touched in the current pass.
- [x] Record remaining mismatches in this plan before moving to the next template.

---

## Current Pass Notes

- Start with Task 1 because `/inventory/21779200396408437` is the reported broken page.
- Detail typography root cause: broad CSS in `src/lib/server/auxero-template.ts` forced detail headings, sidebar values, and generic Bohemcars cards to white on an `is_light` page.
- Detail typography fix: remove detail and generic card selectors from that broad dark-text override; keep the original template light typography.
- Detail verification: title is `40px/48px Manrope` and `rgb(28, 28, 28)`, sidebar price is `rgb(28, 28, 28)`, overview label is `rgb(75, 75, 75)`.
- Home 05 visual contract now has route-source documentation plus e2e guards for 12 brand cards, 6 type cards, the `card-37.jpg` type gallery family, and the template search widget.
- Inventory grid contract now checks the first card image ratio remains within the Auxero 3-column card proportions.
- Template contract types now lock `/`, inventory view variants, detail, agents, account, and admin route families to their selected Auxero source files.
- Browser screenshots saved under `test-results/visual-contract/2026-05-26-checkpoint-1/` for Bohemcars home, inventory, and detail at desktop and mobile widths. The in-app Browser loaded the app routes but returned `ERR_BLOCKED_BY_CLIENT` for the raw local template reference server, so raw-template screenshot comparison remains covered by route-source mapping plus Playwright DOM/CSS assertions until a Browser-accessible template host is available.
- Home route migration checkpoint: `/` now uses SvelteKit `+page.server.ts` and `+page.svelte` while preserving the Auxero Home 05 body, head assets, and body page class. Browser screenshots saved under `test-results/visual-contract/2026-05-26-home-route-migration/`; desktop and mobile checks reported 12 brand cards, 6 type cards, visible `card-37.jpg`, the Auxero header present, and no Svelte layout header overlay.
- Home brand strip checkpoint: `Explore Our Brands` now renders through `HomeFiveBrandStrip.svelte` with shared Home 05 data. Browser screenshots saved under `test-results/visual-contract/2026-05-26-home-brand-strip/`; desktop and mobile checks reported 12 brand cards, first brand `BMW`, 6 type cards still present, visible `card-37.jpg`, and no Svelte layout header overlay.
- Home type gallery checkpoint: `Browse By Type` now renders through `HomeFiveTypeGallery.svelte` with shared Home 05 type-card data. Browser screenshots and DOM summary saved under `test-results/visual-contract/2026-05-26-home-type-gallery/`; desktop and mobile checks reported 12 brand cards, 6 type cards, `card-37.jpg` and `card-42.jpg`, one active card, the white 20px CTA arrow, section order `brand -> type -> compare`, and no fresh console errors after the route-shell script closing fix.
- Home compare section checkpoint: `Compare Top Rated Vehicles` now renders through `HomeFiveCompareSection.svelte` with typed comparison-pair data. Browser screenshots and DOM summary saved under `test-results/visual-contract/2026-05-26-home-compare-section/`; desktop and mobile checks reported 2 `card-box-style-4` cards, 4 vehicle images, compare links to `/compare?ids=...`, the `/compare` View All CTA, preserved pagination wrapper, section order `type -> compare -> budget`, and no fresh console errors.
- Home budget section checkpoint: `Bohemcars by Budget` now renders through `HomeFiveBudgetSection.svelte` and shared `HomeFiveVehicleCard.svelte` card markup. Browser screenshots and DOM summary saved under `test-results/visual-contract/2026-05-26-home-budget-section/`; desktop and mobile checks reported 5 budget tabs, 1 active tab, 9 `card-box-style-1` cards, 9 style2 spec rows, 9 favorite controls, 9 compare controls, 9 detail links, section order `compare -> budget -> reviews`, and no fresh console errors.
- Repository publishing is tracked separately from the fidelity audit so this plan stays focused on visual regressions.
