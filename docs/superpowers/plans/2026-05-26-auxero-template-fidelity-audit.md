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

- [x] Verify public header uses one white `Sign In` CTA, centered nav, and no public `Add Listing`.
- [ ] Verify account/admin headers still expose role-appropriate listing actions.
- [x] Keep logo dimensions aligned with header controls at desktop and mobile widths.

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
- Home featured vehicles checkpoint: `new Bohemcars vehicles` now renders through `HomeFiveFeaturedVehicles.svelte` and the shared `HomeFiveVehicleCard.svelte` card markup. Browser screenshots and DOM summary saved under `test-results/visual-contract/2026-05-26-home-featured-vehicles/`; desktop and mobile checks reported 6 slides, 6 `card-box-style-1` cards, 6 favorite controls, 6 compare controls, 6 detail links, one `pagination-swiper-card-5` wrapper, no budget `style2` rows, section order `hero -> featured -> brand`, no fresh console issues, and desktop carousel density 5.24 after keeping the route server-rendered so Auxero Swiper initialization remains intact.
- Home hero/search checkpoint: `page-title-style-4` now renders through `HomeFiveHero.svelte` with typed Home 05 hero/search data. Playwright fallback screenshots and DOM summary saved under `test-results/visual-contract/2026-05-26-home-hero-section/` because the in-app Browser runtime had no available `iab` browser in this continuation; desktop and mobile checks reported initialized `page-title--slider sw-single`, 4 synced text slides, 3 tabs with 1 active tab, 4 primary selects, 3 advanced selects, 8 feature checks, 1 previous and 1 next control, `/inventory` form action, section order `hero -> featured -> brand`, working jQuery/Swiper globals, and no console issues.
- Home reviews checkpoint: `Client Reviews` now renders through `HomeFiveReviewsSection.svelte` with typed Home 05 review data shared with the raw adapter. Playwright fallback screenshots and DOM summary saved under `test-results/visual-contract/2026-05-26-home-reviews-section/` because the in-app Browser runtime again reported no available `iab` browser; desktop and mobile checks reported one initialized `swiper-testimonior` carousel, 6 testimonial slides, 30 star icons, 6 reviewer avatars, one `pagination-swiper-testimonior` wrapper, section order `budget -> reviews -> news`, and no console issues.
- Home news checkpoint: `Bohemcars notes` now renders through `HomeFiveNewsSection.svelte` with typed Home 05 blog-card data. Browser screenshots and DOM summary saved under `test-results/visual-contract/2026-05-26-home-news-section/`; after the first Browser navigation call timed out but reached the loaded `Bohemcars` tab, desktop and mobile captures reported 1 `post-style-2` featured card, 2 `post-style-3` stacked cards, 3 post images, 3 `by Bohemcars` bylines, one news section, and section order `reviews -> news` with the footer still present.
- Home footer checkpoint: Home 05 footer now renders through `HomeFiveFooter.svelte` with typed Bohemcars footer data while preserving the Auxero `footer`, `footer-top`, `form-footer`, collapse link columns, contact/social block, app badge row, divider, and `footer-bottom-links` structure. Browser screenshots and DOM summary saved under `test-results/visual-contract/2026-05-26-home-footer-section/`; desktop and mobile captures reported one footer, 2 collapse columns, 14 footer link items, newsletter input, 6 social icons, 3 legal links, phone/address text present, no `Aurexo` or `ThemeForest` footer text, and no duplicate raw footer.
- Home header checkpoint: Home 05 public header now renders through `HomeFiveHeader.svelte` with typed Bohemcars header data while preserving the Auxero `header-wrapper-style-4`, topbar, logo slots, centered `main-nav-wrapper`, modal sign-in CTA, search toggle, compare/wishlist icons, mobile button, and hidden public Add Listing behavior. Browser screenshots and DOM summary saved under `test-results/visual-contract/2026-05-26-home-header-section/`; desktop and mobile captures reported one header, 7 nav items, active Home item, grid desktop nav, 52px desktop logo, visible Sign In/search/mobile menu controls, zero visible Add Listing links, and hero/featured/footer still present.
- Home modal checkpoint: Home 05 modal stack now renders through `HomeFiveModals.svelte` with typed Bohemcars modal vehicle data while preserving the Auxero modal IDs, overlay/container classes, login/forgot/signup/search structures, comparison table, bottom compare tray, and post-footer progress/script tail. Browser screenshots and DOM summary saved under `test-results/visual-contract/2026-05-26-home-modals-section/`; desktop and mobile captures reported one instance each of `CardModal`, `LoginModal`, `ForgotPasswordModal`, `SearchModal`, `SignUpModal`, and `CompareModal`, 10 CardModal spec rows, 3 compare preview items, `/inventory` search action with `q`, one wrapper, one progress control, no visible demo credentials, and the Sign In control opening an active Login modal.
- Inventory content checkpoint: `/inventory` now renders as a SvelteKit page with `AuxeroInventoryContent.svelte` and `AuxeroInventoryVehicleCard.svelte` replacing only the `bohemcars-inventory-content` block while preserving the raw Auxero toolbar, filter drawer, map fallback, header/footer, modals, and script tail. Browser DOM QA reported one inventory content block, 42 template cards, 3 view toggles, preserved title/price classes, filter sidebar, and no console issues across 3-column, 4-column, map, and mobile views. Browser screenshot capture timed out on the inventory page, so Playwright fallback screenshots were saved under `test-results/visual-contract/2026-05-26-inventory-content-svelte/` and visually checked for desktop grid, dense grid, half-map, and mobile grid fidelity.
- Vehicle detail content checkpoint: `/inventory/[slug]` now renders as a SvelteKit page with `AuxeroVehicleDetail.svelte`, gallery, feature-tab, sidebar, overview, and static-detail Svelte components replacing the generated `listing-details[data-bohemcars-detail]` block while preserving the raw Auxero breadcrumb, related vehicles, header/footer, modals, and script tail. Browser DOM QA reported one detail block, one content column, one sidebar, 7 main gallery items, 7 thumbnails, 6 feature tabs, 2 finance tabs, 10 overview rows, the Bohemcars consultant badge, the inquiry form, 4 related cards, and mobile title/gallery boxes at 390px. Browser screenshot capture timed out, so Playwright fallback screenshots were saved under `test-results/visual-contract/2026-05-26-detail-content-svelte/` and visually checked for desktop and mobile Details 3 fidelity.
- Account favorites checkpoint: `/account/favorites` now renders as a SvelteKit page with `AccountFavoritesGrid.svelte` and `AuxeroFavoriteVehicleCard.svelte` replacing only the generated `data-bohemcars-favorites-grid` block while preserving the Auxero `my-favorites.html` dashboard shell, active sidebar menu, account header, pagination, modals, and runtime hooks. Browser DOM QA reported 3 favorite cards, 3 active hearts, 3 compare controls, preserved title/price classes, the Auxero dashboard body class, and no console errors at desktop and mobile widths. Playwright fallback screenshots were saved under `test-results/visual-contract/2026-05-26-account-favorites-svelte/` after waiting for the favorites card selector.
- Account compare checkpoint: `/account/compare` now renders as a SvelteKit page reusing `CompareTemplatePage.svelte` and `AuxeroCompareTable.svelte` while resolving saved account garage vehicles on the server. Browser DOM QA reported the visible compare table with 2 saved columns, 12 rows, 2 remove controls, preserved `card-details--table bohemcars-compare-table` classes, the Auxero compare body class, and no console errors at desktop and mobile widths. Playwright fallback screenshots were saved under `test-results/visual-contract/2026-05-26-account-compare-svelte/` after waiting for the compare table selector.
- Repository publishing is tracked separately from the fidelity audit so this plan stays focused on visual regressions.
