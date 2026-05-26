# Bohemcars Svelte Finalization And Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current Bohemcars template adaptation into a proposal-ready SvelteKit product while preserving Auxero template fidelity.

**Architecture:** Use the current raw Auxero adapter as the visual contract, then migrate one route family at a time into typed SvelteKit pages and focused Svelte 5 components. Each migration must preserve the template DOM classes, typography, spacing, imagery, and responsive behavior before any cleanup or Bohemcars-specific improvements happen.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, TypeScript, server-only modules in `$lib/server`, feature components in `$lib/components`, Vitest, Playwright, Auxero static assets, Bohemcars data/assets.

---

## Current State Summary

The public routes currently render mostly through `src/lib/server/auxero-template.ts`, using raw HTML files from `.template-ref` plus server-side string adapters in `src/lib/server/auxero-*-data.ts`. The project also has an early Svelte component structure under `src/lib/components`, but the main public pages are not yet true Svelte page/component implementations.

The selected homepage source is `home-05.html`. `PROJECT_PLAN.md` now reflects this direction, replacing the older Homepage 09 decision.

The migration must not start by redesigning the site. The first success condition is exact visual stability, then modular Svelte architecture.

## Target File Structure

- Keep: `src/lib/server/auxero-template.ts` as the temporary compatibility renderer and template contract until each route family is migrated.
- Keep and narrow: `src/lib/server/auxero-home-data.ts`, `src/lib/server/auxero-listing-data.ts`, `src/lib/server/auxero-account-data.ts`, `src/lib/server/auxero-support-data.ts` while they still serve raw-template routes.
- Create: `src/lib/auxero/template-map.ts` for template-to-route source mapping.
- Create: `src/lib/auxero/fidelity.ts` for shared visual contract constants used by tests.
- Create: `src/lib/types/vehicle.ts`, `src/lib/types/agent.ts`, `src/lib/types/account.ts`.
- Create: `src/lib/components/auxero/AuxeroButton.svelte`, `src/lib/components/auxero/AuxeroSelect.svelte`, `src/lib/components/auxero/AuxeroTabs.svelte` only after repeated template controls prove they need reusable wrappers.
- Create or replace: `src/lib/components/home/HomeFiveHero.svelte`, `src/lib/components/home/HomeFiveSearch.svelte`, `src/lib/components/home/BrowseByType.svelte`.
- Keep and harden: `src/lib/components/layout/SiteHeader.svelte`, `src/lib/components/layout/SiteFooter.svelte`, `src/lib/state/garage.svelte.ts`.
- Convert routes gradually from `+server.ts` to `+page.server.ts` plus `+page.svelte` only after tests exist for the current rendered output.

## Template Source Map

| Product route                                                                                     | Template source                                                                 | Migration order |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------- |
| `/`                                                                                               | `home-05.html`                                                                  | 1               |
| `/inventory`                                                                                      | `listing-grid3-columns.html` plus `listing-grid4-columns.html` and map variants | 2               |
| `/inventory/[slug]`                                                                               | `listing-details-3.html`                                                        | 3               |
| `/compare`                                                                                        | `compare.html`                                                                  | 4               |
| `/agents` and `/agents/[slug]`                                                                    | `sale-agents.html`, `sale-agents-details.html`                                  | 5               |
| `/sell-your-car`, `/services`, `/contact`, `/about`, `/reviews`, `/calculator`, `/blog`, `/terms` | matching Auxero support pages                                                   | 6               |
| `/account/*`, `/admin/*`                                                                          | dashboard/account Auxero pages                                                  | 7               |

## Svelte 5 Rules For The Migration

- Use `$props()` for component inputs.
- Use `$derived` for values computed from props or state.
- Use `$state` only for UI state that actually updates rendered output.
- Use `$state.raw` for large reassigned data arrays if they ever become client-managed.
- Use keyed `{#each items as item (item.id)}` blocks for vehicle, brand, type, agent, and message lists.
- Use event attributes such as `onclick={handler}`, not legacy `on:click`.
- Use context for scoped garage/session UI state, not a global shared mutable module.
- Keep server-only modules under `$lib/server` so private/auth/data logic cannot leak to browser bundles.
- Avoid broad `:global` CSS overrides. If template CSS must be adjusted, scope it to a route body class or a component-owned wrapper.

---

### Task 1: Freeze The Visual Contract

**Files:**

- Modify: `docs/superpowers/plans/2026-05-26-auxero-template-fidelity-audit.md`
- Create: `docs/template-contract/route-source-map.md`
- Modify: `src/routes/project1.e2e.ts`

- [x] **Step 1: Create the route-source map document**

  Create `docs/template-contract/route-source-map.md` with this exact route contract:

  ```markdown
  # Bohemcars Auxero Route Source Map

  | Bohemcars route       | Auxero source                                             | Fidelity rule                                                                                                                             |
  | --------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
  | `/`                   | `home-05.html`                                            | Preserve section order, top bars, hero/search composition, brand strip, type gallery, featured cars, reviews, news, CTA, and footer.      |
  | `/inventory`          | `listing-grid3-columns.html`                              | Preserve toolbar, filters, 3-card desktop grid rhythm, card image ratio, badges, meta row, price row, compare action, and details action. |
  | `/inventory?view=4`   | `listing-grid4-columns.html`                              | Preserve dense desktop grid behavior and shared filters.                                                                                  |
  | `/inventory?view=map` | `listing-gridstyle-halfmap.html` or `listing-topmap.html` | Preserve map/list split or top-map layout when map data is enabled.                                                                       |
  | `/inventory/[slug]`   | `listing-details-3.html`                                  | Preserve light detail typography, media layout, overview/sidebar structure, contact form, related cars.                                   |
  | `/compare`            | `compare.html`                                            | Preserve comparison table/card structure and remove only demo vehicles.                                                                   |
  | `/agents`             | `sale-agents.html`                                        | Preserve consultant card layout and contact affordances.                                                                                  |
  | `/agents/[slug]`      | `sale-agents-details.html`                                | Preserve agent detail/contact layout.                                                                                                     |
  | `/account/*`          | dashboard/account templates                               | Preserve dashboard sidebar, cards, tables, forms, and message layout.                                                                     |
  | `/admin/*`            | dashboard/account templates                               | Preserve dashboard shell and replace content with role-aware Bohemcars data.                                                              |
  ```

- [x] **Step 2: Add visual-contract test helpers**

  In `src/routes/project1.e2e.ts`, add helper functions near the top of the file:

  ```ts
  async function cssValue(locator: Locator, property: string) {
  	return locator.evaluate(
  		(node, prop) => getComputedStyle(node).getPropertyValue(prop),
  		property
  	);
  }

  async function boxRatio(locator: Locator) {
  	const box = await locator.boundingBox();
  	if (!box) throw new Error('Expected element to have a box');
  	return Number((box.width / box.height).toFixed(2));
  }
  ```

  Add the missing import if needed:

  ```ts
  import { expect, type Locator, test } from '@playwright/test';
  ```

- [x] **Step 3: Add Home 05 fidelity assertions**

  Extend the homepage e2e test to assert:

  ```ts
  await expect(page.locator('.out-brand-2')).toHaveCount(12);
  await expect(page.locator('.brand-item-style-2')).toHaveCount(6);
  await expect(page.locator('img[src*="/assets/images/card/card-37.jpg"]').first()).toBeVisible();
  await expect(page.locator('.search-cars, .search-form-widget').first()).toBeVisible();
  ```

- [x] **Step 4: Verify the contract tests**

  Run:

  ```bash
  npx playwright test src/routes/project1.e2e.ts
  ```

  Expected: all route fidelity tests pass before any Svelte migration begins.

- [ ] **Step 5: Commit**

  ```bash
  git add docs/template-contract/route-source-map.md src/routes/project1.e2e.ts docs/superpowers/plans/2026-05-26-auxero-template-fidelity-audit.md
  git commit -m "test: freeze auxero visual contract"
  ```

### Task 2: Extract Template Contract Types

**Files:**

- Create: `src/lib/auxero/template-map.ts`
- Create: `src/lib/auxero/fidelity.ts`
- Test: `src/lib/auxero/template-map.spec.ts`

- [x] **Step 1: Write the failing route map test**

  Create `src/lib/auxero/template-map.spec.ts`:

  ```ts
  import { describe, expect, it } from 'vitest';
  import { productRouteSources, sourceForProductRoute } from './template-map';

  describe('productRouteSources', () => {
  	it('locks Home 05 as the homepage source', () => {
  		expect(sourceForProductRoute('/')).toBe('home-05.html');
  	});

  	it('locks inventory and detail template sources', () => {
  		expect(sourceForProductRoute('/inventory')).toBe('listing-grid3-columns.html');
  		expect(sourceForProductRoute('/inventory/21779200396408437')).toBe('listing-details-3.html');
  	});

  	it('does not expose blocked shop templates as product routes', () => {
  		expect(productRouteSources.some((item) => item.source === 'shop.html')).toBe(false);
  		expect(productRouteSources.some((item) => item.source === 'check-out.html')).toBe(false);
  	});
  });
  ```

- [ ] **Step 2: Run the failing test**

  ```bash
  npm run test:unit -- src/lib/auxero/template-map.spec.ts --run
  ```

  Expected: fail because `src/lib/auxero/template-map.ts` does not exist.

- [x] **Step 3: Implement the route map**

  Create `src/lib/auxero/template-map.ts`:

  ```ts
  export type ProductRouteSource = {
  	route: string;
  	source: string;
  	notes: string;
  };

  export const productRouteSources: ProductRouteSource[] = [
  	{ route: '/', source: 'home-05.html', notes: 'Primary Bohemcars homepage' },
  	{ route: '/inventory', source: 'listing-grid3-columns.html', notes: 'Default inventory grid' },
  	{
  		route: '/inventory?view=4',
  		source: 'listing-grid4-columns.html',
  		notes: 'Dense grid variant'
  	},
  	{
  		route: '/inventory?view=map',
  		source: 'listing-gridstyle-halfmap.html',
  		notes: 'Map/list variant'
  	},
  	{ route: '/inventory/[slug]', source: 'listing-details-3.html', notes: 'Vehicle detail page' },
  	{ route: '/compare', source: 'compare.html', notes: 'Buyer comparison' },
  	{ route: '/agents', source: 'sale-agents.html', notes: 'Consultant list' },
  	{ route: '/agents/[slug]', source: 'sale-agents-details.html', notes: 'Consultant profile' },
  	{ route: '/sell-your-car', source: 'sell-your-car.html', notes: 'Sell-car intake' },
  	{ route: '/services', source: 'services-center.html', notes: 'Services overview' },
  	{ route: '/contact', source: 'contact-us.html', notes: 'Contact page' },
  	{ route: '/account/*', source: 'dashboard.html', notes: 'Account dashboard family' },
  	{ route: '/admin/*', source: 'dashboard.html', notes: 'Admin dashboard family' }
  ];

  export function sourceForProductRoute(route: string) {
  	const pathname = route.split('?')[0];

  	if (/^\/inventory\/[^/]+$/.test(pathname)) return 'listing-details-3.html';
  	if (pathname.startsWith('/account/')) return 'dashboard.html';
  	if (pathname.startsWith('/admin/')) return 'dashboard.html';

  	return productRouteSources.find((item) => item.route === route || item.route === pathname)
  		?.source;
  }
  ```

- [x] **Step 4: Add fidelity constants**

  Create `src/lib/auxero/fidelity.ts`:

  ```ts
  export const auxeroFidelity = {
  	home05: {
  		brandCards: 12,
  		typeCards: 6,
  		typeImagePrefix: '/assets/images/card/card-'
  	},
  	detail3: {
  		titleColor: 'rgb(28, 28, 28)',
  		bodyTextColor: 'rgb(75, 75, 75)',
  		titleFontSize: '40px'
  	},
  	inventoryGrid3: {
  		desktopColumns: 3,
  		cardImageMinRatio: 1.25,
  		cardImageMaxRatio: 1.6
  	}
  } as const;
  ```

- [ ] **Step 5: Verify and commit**

  ```bash
  npm run test:unit -- src/lib/auxero/template-map.spec.ts --run
  git add src/lib/auxero/template-map.ts src/lib/auxero/fidelity.ts src/lib/auxero/template-map.spec.ts
  git commit -m "chore: add auxero template contract"
  ```

### Task 3: Migrate Home 05 To Svelte Components

**Files:**

- Create: `src/routes/+page.server.ts`
- Create: `src/routes/+page.svelte`
- Modify: `src/routes/+server.ts`
- Create or modify: `src/lib/components/home/HomeFiveHero.svelte`
- Create or modify: `src/lib/components/home/HomeFiveSearch.svelte`
- Create or modify: `src/lib/components/home/BrowseByType.svelte`
- Modify: `src/lib/components/home/BrandStrip.svelte`
- Modify: `src/lib/data/bohemcars.ts`
- Test: `src/routes/project1.e2e.ts`

- [x] **Step 1: Capture the current Home 05 DOM contract**

  Run:

  ```bash
  npx playwright test src/routes/project1.e2e.ts --grep "home"
  ```

  Expected: existing Home 05 tests pass before migration.

- [ ] **Step 2: Create typed page data**

  Create `src/routes/+page.server.ts`:

  ```ts
  import type { PageServerLoad } from './$types';
  import { bohemcarsBrand, bohemcarsContact, homeHeroSlides } from '$lib/data/bohemcars';
  import { vehicles } from '$lib/data/vehicles';

  export const load: PageServerLoad = () => ({
  	brand: bohemcarsBrand,
  	contact: bohemcarsContact,
  	heroSlides: homeHeroSlides,
  	featuredVehicles: vehicles.slice(0, 6)
  });
  ```

- [x] **Step 3: Convert the route from raw server response to Svelte page**

  Rename `src/routes/+server.ts` to `src/routes/+server.legacy.ts` or remove it only after `+page.svelte` renders the homepage. The root route must not have both a conflicting `+server.ts` response and the intended `+page.svelte` page for normal browser navigation.

  Current checkpoint: `src/routes/+server.ts` moved to `src/routes/root-server.legacy.ts`; `/` now renders through `+page.server.ts` and `+page.svelte` using a split, trusted Auxero Home 05 document. Section-by-section Svelte component replacement remains pending under the existing fidelity tests.

  Brand strip checkpoint: `src/lib/components/home/HomeFiveBrandStrip.svelte` now renders the Home 05 `Explore Our Brands` section from shared `homeFiveBrandCards` data. The rest of the page still streams through trusted Auxero fragments until each section is replaced under visual tests.

  Browse By Type checkpoint: `src/lib/components/home/HomeFiveTypeGallery.svelte` now renders the Home 05 type gallery from shared `homeFiveTypeCards` data while preserving the template dark band, horizontal gallery structure, `card-37.jpg` through `card-42.jpg` image family, active second card, and white 20px CTA arrow. The page shell also guards against swallowing template scripts by emitting a real closing body-class script tag, with Playwright coverage for local jQuery initialization.

  Compare section checkpoint: `src/lib/components/home/HomeFiveCompareSection.svelte` now renders the Home 05 `Compare Top Rated Vehicles` section from typed `HomeFiveComparePair` data derived in `+page.server.ts`. The section keeps the template `card-box-style-4` structure, two comparison slides, four vehicle images, compare CTA styling, pagination wrapper, and surrounding `type -> compare -> budget` order.

  Budget section checkpoint: `src/lib/components/home/HomeFiveBudgetSection.svelte` now renders the Home 05 `Bohemcars by Budget` section from typed `HomeFiveVehicleCardData` rows derived in `+page.server.ts`. `HomeFiveVehicleCard.svelte` preserves the template `card-box card-box-style-1` structure, highlight tags, image overlay meta, style2 specs row, price/finance row, compare action, and details link; the section keeps 5 budget tabs and 9 cards.

  Featured vehicles checkpoint: `src/lib/components/home/HomeFiveFeaturedVehicles.svelte` now renders the Home 05 `New Vehicles` carousel from typed `HomeFiveVehicleCardData` rows and reuses `HomeFiveVehicleCard.svelte` without the budget `style2` spec row. The route keeps Home 05 server-rendered with `src/routes/+page.ts` `csr = false` so Auxero's Swiper scripts initialize the final carousel DOM instead of being undone by hydration; Playwright now guards the desktop carousel density in addition to the 6 cards, pagination, and CTA contract.

  Hero/search checkpoint: `src/lib/components/home/HomeFiveHero.svelte` now renders the Home 05 `page-title-style-4` hero, Swiper background slides, synced text slides, tab row, primary search filters, advanced filter panel, and feature checks from typed `HomeFiveHeroData`. The route splits the exact `<!-- page-title -->` block before `New Vehicles`, preserving the Auxero first-viewport class structure while moving hero/search data shaping into `$lib/auxero/home-five.ts`.

  Reviews checkpoint: `src/lib/components/home/HomeFiveReviewsSection.svelte` now renders the Home 05 `Client Reviews` carousel from typed `HomeFiveReview` rows in `$lib/auxero/home-five.ts`. The split intentionally follows the post-processed Home 05 closing-comment markers, preserving the Auxero `swiper-testimonior`, `testimonior-box`, star icon, avatar, and pagination structure while keeping the section order `budget -> reviews -> news`.

  News checkpoint: `src/lib/components/home/HomeFiveNewsSection.svelte` now renders the Home 05 `Bohemcars notes` section from typed `HomeFiveNewsPost` rows derived from `$lib/data/blog`. The route now splits `<!-- News & Reviews -->` after the Svelte reviews band and preserves the Auxero `post-style-2` featured card, two `post-style-3` cards, post image ratios/classes, byline row, and footer handoff.

  Footer checkpoint: `src/lib/components/home/HomeFiveFooter.svelte` now renders the Home 05 footer from typed `HomeFiveFooterData`, preserving Auxero footer classes and column structure while replacing remaining template/footer contact and copyright data with Bohemcars values. The raw Home 05 tail now starts after the footer marker and still carries modals/scripts until their own migration pass.

  Header checkpoint: `src/lib/components/home/HomeFiveHeader.svelte` now renders the Home 05 public header from typed `HomeFiveHeaderData`, preserving Auxero header/topbar/nav/action classes and script hooks while replacing the raw header fragment in the root page split. The raw Home 05 body shell now keeps only the preload and wrapper opening before the Svelte header, with modals/scripts still carried by the post-footer compatibility tail.

  Modal checkpoint: `src/lib/components/home/HomeFiveModals.svelte` now renders the Home 05 Card, Login, Forgot Password, Search, Sign Up, and Compare modal stack from typed `HomeFiveModalsData`. The route split keeps the wrapper close before the Svelte modal component and the progress/script tail after it, preserving the Auxero post-footer order while replacing demo credentials and template-only links with Bohemcars product behavior.

- [x] **Step 4: Build `HomeFiveHero.svelte` with template classes**

  Implement with Svelte 5 props and keyed slides:

  ```svelte
  <script lang="ts">
  	type HeroSlide = {
  		src: string;
  		alt: string;
  		title: string;
  		subtitle: string;
  	};

  	let { slides }: { slides: HeroSlide[] } = $props();
  	let activeIndex = $state(0);
  	let activeSlide = $derived(slides[activeIndex] ?? slides[0]);

  	function showSlide(index: number) {
  		activeIndex = index;
  	}
  </script>

  <section class="slider home-five-slider">
  	{#if activeSlide}
  		<img src={activeSlide.src} alt={activeSlide.alt} class="slider__image" />
  		<div class="slider__content">
  			<h1>{activeSlide.title}</h1>
  			<p>{activeSlide.subtitle}</p>
  		</div>
  	{/if}

  	<div class="slider__dots" aria-label="Hero slides">
  		{#each slides as slide, index (slide.src)}
  			<button
  				type="button"
  				class={index === activeIndex ? 'active' : ''}
  				aria-label={`Show ${slide.alt}`}
  				onclick={() => showSlide(index)}
  			></button>
  		{/each}
  	</div>
  </section>
  ```

  Keep class names aligned with the real `home-05.html` section when implementing; the snippet defines the runes/event pattern, not a redesign.

- [x] **Step 5: Run Svelte autofixer**

  ```bash
  npx @sveltejs/mcp svelte-autofixer src/lib/components/home/HomeFiveHero.svelte
  npx @sveltejs/mcp svelte-autofixer src/routes/+page.svelte
  ```

  Expected: no Svelte 5 syntax issues.

- [x] **Step 6: Verify visual fidelity**

  Run:

  ```bash
  npm run check
  npm run test:unit -- --run
  npx playwright test src/routes/project1.e2e.ts --grep "home"
  ```

  Expected: Home 05 card counts, search visibility, and key images match the raw-template baseline.

- [ ] **Step 7: Commit**

  ```bash
  git add src/routes/+page.server.ts src/routes/+page.svelte src/routes/+server.legacy.ts src/lib/components/home src/lib/data/bohemcars.ts src/routes/project1.e2e.ts
  git commit -m "refactor: migrate home 05 to svelte"
  ```

### Task 4: Migrate Inventory Grid And Detail Route

**Files:**

- Create: `src/routes/inventory/+page.server.ts`
- Create: `src/routes/inventory/+page.svelte`
- Create: `src/routes/inventory/[slug]/+page.server.ts`
- Create: `src/routes/inventory/[slug]/+page.svelte`
- Modify: `src/lib/components/inventory/InventoryToolbar.svelte`
- Modify: `src/lib/components/inventory/InventoryGrid.svelte`
- Modify: `src/lib/components/inventory/VehicleCard.svelte`
- Modify: `src/lib/components/detail/DetailThreeLayout.svelte`
- Modify: `src/lib/components/detail/VehicleMediaSlider.svelte`
- Modify: `src/lib/components/detail/FinancePanel.svelte`
- Modify: `src/lib/components/detail/OverviewSpecs.svelte`
- Test: `src/routes/project1.e2e.ts`

- [ ] **Step 1: Add failing inventory card assertions before migration**

  Assert the current raw-template inventory page has visible filter button, sort select, three-card rhythm, image ratio, title, price, compare button, and details link.

  Inventory content checkpoint: `/inventory` now uses `+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`, replacing only the generated inventory content block with `AuxeroInventoryContent.svelte` and `AuxeroInventoryVehicleCard.svelte`. The previous endpoint is kept as `server.legacy.ts` for reference. The test now guards the 3-column, dense 4-column, and half-map view contracts before the rest of the inventory page is migrated.

- [ ] **Step 2: Move inventory filtering into typed server load**

  `src/routes/inventory/+page.server.ts` should return serializable data:

  ```ts
  import type { PageServerLoad } from './$types';
  import { filterVehicles, sortVehicles } from '$lib/server/inventory';

  export const load: PageServerLoad = ({ url }) => {
  	const filters = Object.fromEntries(url.searchParams);
  	const sorted = sortVehicles(filterVehicles(filters), filters.sort);

  	return {
  		filters,
  		view: url.searchParams.get('view') ?? 'grid',
  		vehicles: sorted
  	};
  };
  ```

- [ ] **Step 3: Render inventory with keyed vehicle cards**

  `InventoryGrid.svelte` should render:

  ```svelte
  <script lang="ts">
  	import VehicleCard from './VehicleCard.svelte';
  	import type { Vehicle } from '$lib/types/vehicle';

  	let { vehicles }: { vehicles: Vehicle[] } = $props();
  </script>

  <div class="row">
  	{#each vehicles as vehicle (vehicle.slug)}
  		<div class="col-xl-4 col-md-6">
  			<VehicleCard {vehicle} />
  		</div>
  	{/each}
  </div>
  ```

  Preserve the card internals and Auxero classes from `listing-grid3-columns.html`.

- [x] **Step 4: Render detail page from typed route data**

  `src/routes/inventory/[slug]/+page.server.ts` should load one vehicle and throw 404 when missing:

  ```ts
  import { error } from '@sveltejs/kit';
  import type { PageServerLoad } from './$types';
  import { vehicleBySlug, relatedVehiclesFor } from '$lib/server/inventory';

  export const load: PageServerLoad = ({ params }) => {
  	const vehicle = vehicleBySlug(params.slug);
  	if (!vehicle) error(404, 'Vehicle not found');

  	return {
  		vehicle,
  		relatedVehicles: relatedVehiclesFor(vehicle.slug)
  	};
  };
  ```

  Detail content checkpoint: `/inventory/[slug]` now uses `+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`; the previous endpoint is preserved as `server.legacy.ts`. The route loads a real vehicle by slug, returns 404 for missing vehicles, splits the rendered Listing Details 3 document at `listing-details[data-bohemcars-detail]`, and renders the detail block through typed Auxero Svelte components.

- [x] **Step 5: Run Svelte autofixer on changed components**

  ```bash
  npx @sveltejs/mcp svelte-autofixer src/routes/inventory/+page.svelte
  npx @sveltejs/mcp svelte-autofixer src/routes/inventory/[slug]/+page.svelte
  npx @sveltejs/mcp svelte-autofixer src/lib/components/inventory/InventoryGrid.svelte
  npx @sveltejs/mcp svelte-autofixer src/lib/components/inventory/VehicleCard.svelte
  npx @sveltejs/mcp svelte-autofixer src/lib/components/detail/DetailThreeLayout.svelte
  ```

  Current detail checkpoint autofixer targets were the new Auxero detail components: `AuxeroVehicleDetail.svelte`, `AuxeroVehicleDetailGallery.svelte`, `AuxeroVehicleFeatureTabs.svelte`, `AuxeroVehicleDetailSidebar.svelte`, `AuxeroVehicleOverview.svelte`, `AuxeroVehicleDetailStaticContent.svelte`, `VehicleDetailTemplatePage.svelte`, and the new route page.

- [x] **Step 6: Verify inventory and detail fidelity**

  ```bash
  npm run check
  npm run test:unit -- --run
  npx playwright test src/routes/project1.e2e.ts --grep "inventory|detail"
  ```

  Expected: inventory and detail still match template typography, card ratios, and route behavior.

  Detail checkpoint verification passed with `npm run lint`, `npm run check`, `npm run test:unit -- --run`, `npx playwright test src/routes/project1.e2e.ts`, and `npm run build`. Browser DOM QA verified the Svelte detail block on desktop and mobile; Browser screenshot capture timed out, so Playwright fallback screenshots were saved under `test-results/visual-contract/2026-05-26-detail-content-svelte/`.

- [x] **Step 7: Commit**

  ```bash
  git add src/routes/inventory src/lib/components/inventory src/lib/components/detail src/lib/server/inventory.ts src/routes/project1.e2e.ts
  git commit -m "refactor: migrate inventory and detail to svelte"
  ```

### Task 4A: Migrate Compare Page

**Checkpoint completed 2026-05-26:**

- `/compare` now uses `src/routes/compare/+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`.
- The page still renders the Auxero `compare.html` head, header, footer, modal stack, scripts, spacing, table classes, and responsive horizontal table behavior from the source template.
- The visible comparison table is rendered by `src/lib/components/compare/AuxeroCompareTable.svelte` from typed `AuxeroCompareVehicle` data in `src/lib/auxero/compare.ts`.
- `src/lib/server/auxero-page.ts` now has a generic element splitter so non-`div` Auxero slots, including compare tables, can be migrated safely.
- `src/routes/project1.e2e.ts` now freezes the compare table contract: visible Auxero table classes, 4 default columns, 12 rows, image/title cell structure, remove controls, and key spec rows.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/compare/AuxeroCompareTable.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/compare/CompareTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/compare/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified one visible compare table, 4 columns, 12 rows, header/footer visibility, Auxero body class, and no console errors. Browser screenshot capture timed out on the Auxero page, so Playwright fallback screenshots were saved under `test-results/visual-contract/2026-05-26-compare-content-svelte/`.

### Task 4B: Migrate Account Favorites Page

**Checkpoint completed 2026-05-26:**

- `/account/favorites` now uses `src/routes/account/favorites/+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`.
- The page still renders the Auxero `my-favorites.html` head, dashboard sidebar, account header, active menu item, pagination, modal stack, body classes, and script tail from the source template.
- The visible favorites grid is rendered by `src/lib/components/account/AccountFavoritesGrid.svelte` and `src/lib/components/account/AuxeroFavoriteVehicleCard.svelte` from typed `AuxeroFavoriteVehicleCard` data in `src/lib/auxero/favorites.ts`.
- `src/lib/server/garage.ts` now exposes favorite vehicles from the account garage state for route server loads without moving visual formatting into server-only code.
- `src/routes/project1.e2e.ts` now freezes the favorites page contract: visible Auxero 3-column grid, 3 saved cards, active dashboard menu item, active heart state, tag rows, compare actions, title/price classes, and detail links.
- `src/lib/server/auxero-page.spec.ts` now guards that the generated `my-favorites.html` grid can be split without dropping dashboard chrome, pagination, modal markup, or the runtime favorites hook.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/account/AuxeroFavoriteVehicleCard.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/account/AccountFavoritesGrid.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/account/AccountFavoritesTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/account/favorites/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified the account favorites route on desktop and mobile: 3 `card-box-style-1` favorites, 3 active hearts, 3 compare controls, `data-bohemcars-favorites-count="3"`, active Favorites sidebar item, Auxero dashboard body class, and no console errors. Playwright fallback screenshots were saved under `test-results/visual-contract/2026-05-26-account-favorites-svelte/` after waiting for the favorites card selector.

### Task 4C: Migrate Account Compare Page

**Checkpoint completed 2026-05-26:**

- `/account/compare` now uses `src/routes/account/compare/+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`.
- The page reuses `CompareTemplatePage.svelte` and `AuxeroCompareTable.svelte`, but resolves the account session before selecting the saved garage compare vehicles.
- The page still renders the Auxero `compare.html` head, public compare header/footer, modal stack, body classes, table classes, and responsive horizontal table behavior from the source template.
- `src/routes/project1.e2e.ts` now freezes the account compare contract: visible Auxero compare table, 2 saved account columns, 12 rows, 2 remove controls, and Mileage row presence.
- `src/lib/server/auxero-page.spec.ts` now guards that the account compare table can be split from `compare.html` without dropping the page chrome or modal stack.
- The Auxero runtime now preserves the server-rendered account compare table when no stored compare list exists, so account pages do not get repainted with the public four-car fallback in storage-limited contexts.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/routes/account/compare/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified the account compare route on desktop and mobile: 2 visible saved-compare columns, 12 table rows, 2 remove controls, the `card-details--table bohemcars-compare-table` classes, Auxero compare body class, and no console errors. Playwright fallback screenshots were saved under `test-results/visual-contract/2026-05-26-account-compare-svelte/` after waiting for the compare table selector.

### Task 5: Normalize Data And Server Boundaries

**Files:**

- Create: `src/lib/types/vehicle.ts`
- Create: `src/lib/types/agent.ts`
- Create: `src/lib/types/account.ts`
- Modify: `src/lib/data/vehicles.ts`
- Modify: `src/lib/data/agents.ts`
- Modify: `src/lib/server/inventory.ts`
- Modify: `src/lib/server/agents.ts`
- Modify: `src/lib/server/auth.ts`
- Test: `src/lib/server/backend.spec.ts`
- Test: `src/lib/data/vehicles.spec.ts`

- [ ] **Step 1: Create shared public types**

  `src/lib/types/vehicle.ts`:

  ```ts
  export type Vehicle = {
  	slug: string;
  	title: string;
  	brand: string;
  	model: string;
  	priceEur: number;
  	year: number;
  	mileageKm: number;
  	fuel: string;
  	transmission: string;
  	bodyType: string;
  	status: 'available' | 'new' | 'client' | 'reserved' | 'sold';
  	images: string[];
  	description: string;
  };
  ```

- [ ] **Step 2: Use server-only modules for mutations**

  Keep create/update/delete helpers in `$lib/server/inventory.ts`; do not import server modules from `.svelte` files. Client components receive data from `load` or call `/api/*` endpoints.

- [ ] **Step 3: Test filters and sorting**

  Add tests that verify:

  ```ts
  expect(filterVehicles({ brand: 'BMW' }).every((vehicle) => vehicle.brand === 'BMW')).toBe(true);
  expect(sortVehicles(vehicles, 'price-asc')[0].priceEur).toBeLessThanOrEqual(
  	sortVehicles(vehicles, 'price-asc')[1].priceEur
  );
  ```

- [ ] **Step 4: Verify**

  ```bash
  npm run test:unit -- src/lib/server/backend.spec.ts src/lib/data/vehicles.spec.ts --run
  npm run check
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add src/lib/types src/lib/data src/lib/server src/lib/**/*.spec.ts
  git commit -m "refactor: normalize bohemcars data boundaries"
  ```

### Task 6: Migrate Header, Footer, Garage State, And Forms

**Files:**

- Modify: `src/lib/components/layout/SiteHeader.svelte`
- Modify: `src/lib/components/layout/SiteFooter.svelte`
- Modify: `src/lib/state/garage.svelte.ts`
- Create: `src/lib/components/forms/InquiryForm.svelte`
- Create: `src/lib/components/forms/AuthModal.svelte`
- Test: `src/routes/project1.e2e.ts`

- [ ] **Step 1: Keep header behavior under tests**

  Assert:

  ```ts
  await expect(page.getByRole('link', { name: /inventory/i })).toBeVisible();
  await expect(
  	page.getByRole('button', { name: /sign in/i }).or(page.getByRole('link', { name: /sign in/i }))
  ).toBeVisible();
  await expect(page.getByRole('link', { name: /add listing/i })).toHaveCount(0);
  ```

- [ ] **Step 2: Keep scoped state in context**

  `GarageState` should continue using Svelte 5 class fields:

  ```ts
  favorites = $state<string[]>([]);
  compare = $state<string[]>([]);
  ```

  Computed state should use methods or `$derived` in consuming components, not `$effect`.

- [ ] **Step 3: Convert forms to reusable Svelte components**

  `InquiryForm.svelte` should submit through a handler or enhanced form and show a local status message with `$state`.

- [ ] **Step 4: Verify**

  ```bash
  npx @sveltejs/mcp svelte-autofixer src/lib/components/layout/SiteHeader.svelte
  npx @sveltejs/mcp svelte-autofixer src/lib/components/forms/InquiryForm.svelte
  npm run check
  npx playwright test src/routes/project1.e2e.ts --grep "header|garage|inquiry"
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add src/lib/components/layout src/lib/components/forms src/lib/state src/routes/project1.e2e.ts
  git commit -m "refactor: modularize layout and forms"
  ```

### Task 7: Migrate Support, Agent, Account, And Admin Pages

**Files:**

- Create or modify: `src/routes/agents/+page.server.ts`
- Create or modify: `src/routes/agents/+page.svelte`
- Create or modify: `src/routes/agents/[slug]/+page.server.ts`
- Create or modify: `src/routes/agents/[slug]/+page.svelte`
- Create or modify: `src/routes/services/+page.svelte`
- Create or modify: `src/routes/sell-your-car/+page.svelte`
- Create or modify: `src/routes/contact/+page.svelte`
- Create or modify: `src/routes/account/+layout.svelte`
- Create or modify: `src/routes/admin/+layout.svelte`
- Modify: `src/lib/server/auth.ts`
- Modify: `src/lib/server/roles.ts`
- Test: `src/routes/project1.e2e.ts`

- [ ] **Step 1: Migrate agents first**

  Agents are smaller than account/admin and prove the template card/detail pattern.

- [ ] **Step 2: Migrate public support pages**

  Convert one page at a time. Keep template class names and section order from the mapped Auxero source page.

- [ ] **Step 3: Migrate account/admin shells last**

  Keep role checks server-side and preserve dashboard/sidebar layout. Public users must not access admin routes.

- [ ] **Step 4: Verify role behavior**

  ```bash
  npx playwright test src/routes/project1.e2e.ts --grep "account|admin|agents"
  npm run test:unit -- src/lib/server/backend.spec.ts --run
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add src/routes/agents src/routes/services src/routes/sell-your-car src/routes/contact src/routes/account src/routes/admin src/lib/server/auth.ts src/lib/server/roles.ts src/routes/project1.e2e.ts
  git commit -m "refactor: migrate secondary routes to svelte"
  ```

### Task 8: Final Product Polish And Proposal Readiness

**Files:**

- Modify: `README.md`
- Modify: `PROJECT_PLAN.md`
- Create: `docs/QA_CHECKLIST.md`
- Modify: `src/routes/sitemap.xml/+server.ts`
- Modify: `src/lib/data/bohemcars.ts`
- Test: `src/routes/sitemap.xml/sitemap.spec.ts`
- Test: `src/routes/project1.e2e.ts`

- [ ] **Step 1: Add QA checklist**

  Create `docs/QA_CHECKLIST.md`:

  ```markdown
  # Bohemcars Proposal QA Checklist

  - [ ] Homepage desktop matches Home 05 baseline.
  - [ ] Homepage mobile has no text overlap.
  - [ ] Inventory desktop has correct card rhythm and filters.
  - [ ] Vehicle detail typography is dark Manrope on light template page.
  - [ ] Header logo is crisp and aligned with controls.
  - [ ] Compare/favorites work without login.
  - [ ] Inquiry forms show a success state.
  - [ ] Account/admin protected pages respond with correct role behavior.
  - [ ] Sitemap contains public proposal routes.
  - [ ] No ThemeForest/Aurexo/demo credentials remain visible.
  ```

- [ ] **Step 2: Audit visible copy**

  Search:

  ```bash
  rg -n "Aurexo|ThemeForest|Super Admin|themesflat|dummy|lorem|password:|Username:" src static docs README.md PROJECT_PLAN.md
  ```

  Expected: only intentional template-source documentation references remain.

- [ ] **Step 3: Run final verification**

  ```bash
  npm run lint
  npm run check
  npm run test:unit -- --run
  npm run build
  npx playwright test src/routes/project1.e2e.ts
  ```

- [ ] **Step 4: Save final screenshots**

  Save desktop and mobile screenshots for:

  ```text
  /
  /inventory
  /inventory/21779200396408437
  /compare
  /agents
  /sell-your-car
  /contact
  /account
  /admin
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add README.md PROJECT_PLAN.md docs/QA_CHECKLIST.md src/routes/sitemap.xml src/lib/data/bohemcars.ts src/routes/project1.e2e.ts
  git commit -m "chore: finalize bohemcars proposal readiness"
  ```

---

## Completion Criteria

- Home 05 is the stable homepage and is recognizably the Auxero template with Bohemcars branding.
- Public routes are SvelteKit pages/components rather than raw HTML responses, except where a deliberate compatibility adapter remains documented.
- Svelte files pass `svelte-autofixer`, `npm run check`, and the project lint/test suite.
- Visual fidelity tests cover the pages that previously regressed: homepage sections, inventory cards, detail typography, and header/logo alignment.
- The site is credible enough to show Bohemcars as a working proposal prototype, not a loose template demo.
