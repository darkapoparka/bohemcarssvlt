# Bohemcars Website Rebuild Plan

## Identity

Project path: `M:\bohemcars-svelte`

Project role: Bohemcars branded car reseller/showroom site with real inventory, customer
accounts, agent/admin workflows, comparison tools, and lead capture.

Source template: Auxero Car Dealer & Listing HTML5 Template

Template preview:
`https://preview.themeforest.net/item/auxero-car-dealer-listing-html5-template/full_screen_preview/61975406`

Direct demo base:
`https://tfaurexo.vercel.app/`

Source brand/data reference:
`M:\bohemcars-final`

## Template Preservation Rule

This rebuild must keep the Auxero template styling, layout language, and component structure as
intact as possible. The main work is branding, copy, assets, route decisions, real Bohemcars
inventory data, and backend wiring. Do not redesign the template, replace its visual system, or
rewrite large components unless required for auth/data behavior.

This rule also applies to dashboard, account, admin, messages, favorites, add-listing, and agents
pages. Keep those pages visually 1:1 with the Auxero template: same page structure, sidebar/header
composition, cards, forms, tables, spacing, and component behavior wherever possible. Replace demo
identity/data only: Aurexo branding, "Super Admin", dummy emails, fake stats, fake agent names,
template credentials, and generic marketplace copy become Bohemcars names, roles, listings,
messages, inquiries, and real or plausible data-backed values.

## Locked Visual Pages

This project must follow the selected Bohemcars visual set.

| Surface        | Required template page | Direct source URL                                        | Notes                                                                                                    |
| -------------- | ---------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Homepage       | Homepage 05            | `https://tfaurexo.vercel.app/home-05.html`               | Practical dealership/reseller homepage with multi-car hero, visible search/filter bar, brands, types, inventory, reviews, and news. |
| Main listing   | Listing Grid           | `https://tfaurexo.vercel.app/listing-grid3-columns.html` | Use the three-column card grid as the default inventory page.                                            |
| Vehicle detail | Listing Details 3      | `https://tfaurexo.vercel.app/listing-details-3.html`     | Use the detail layout with main vehicle media on the left and finance/overview panel on the right.       |
| Compare        | Compare                | `https://tfaurexo.vercel.app/compare.html`               | Keep buyer-side vehicle comparison as a first-class feature.                                             |
| Agents         | Sale Agents            | `https://tfaurexo.vercel.app/sale-agents.html`           | Rebrand as Bohemcars agents/consultants.                                                                |
| Account/admin  | Dashboard pages        | `https://tfaurexo.vercel.app/dashboard.html`             | Keep and wire to real customer, agent, and admin roles.                                                  |

Do not use Homepage 10 as the primary homepage because it is a single-car campaign layout. Do not
use Listing Details 6 as the primary vehicle detail page. Listing Grid 4 Columns and map/half-map
listing templates may be reused inside the inventory view switcher.

## Product Scope Decisions

Keep these surfaces and adapt them to Bohemcars:

- Homepage 05.
- Inventory listing grid, with view toggles for default grid, dense 4-card grid, and map/half-map.
- Vehicle detail 3.
- Compare.
- Agents and agent details, rebranded as Bohemcars consultants.
- Customer account dashboard, profile, change password, favorites, messages, and submitted listings.
- Admin dashboard, inventory management, add/edit listing, inquiries, messages, users, and agents.
- Sell-your-car intake.
- About, services, contact, FAQ, terms, reviews, calculator, and blog/SEO pages.

Do not expose these as product routes unless Bohemcars later needs them:

- Shop, product details, shopping cart, checkout.
- Coming soon.
- Generic multi-dealer marketplace pages as primary UX.
- All duplicate home pages. Home 09 can remain a visual reference only; it is not the primary homepage.
- All duplicate listing/detail layouts as separate nav destinations.
- Template demo credentials, fake admin names, fake marketplace copy, and raw ThemeForest branding.

## Tech Stack

- Svelte 5 with SvelteKit 2.
- TypeScript.
- Vite.
- Tailwind CSS v4 through `@tailwindcss/vite`.
- `@lucide/svelte` for icon components.
- `clsx` and `tailwind-merge` for class composition.
- ESLint and Prettier.
- Vitest for unit tests.
- Playwright for page and visual behavior checks.
- `@sveltejs/adapter-auto` until a final deployment target is chosen.

## App Architecture

Use SvelteKit routes for pages and focused Svelte components for reusable UI. Keep the template
conversion componentized instead of copying giant page files. Use backend-backed auth and data where
the feature implies accounts, admin state, messages, submissions, or listing management.

Primary route plan:

| Route                    | Purpose                                      | Template source                         |
| ------------------------ | -------------------------------------------- | --------------------------------------- |
| `/`                      | Bohemcars homepage                           | Homepage 05                             |
| `/inventory`             | Inventory with grid/dense/map view toggle    | Grid 3 Columns, Grid 4, Half Map/Topmap |
| `/inventory/[slug]`      | Vehicle detail                               | Listing Details 3                       |
| `/compare`               | Buyer vehicle comparison                     | Compare                                 |
| `/agents`                | Bohemcars consultants                        | Sale Agents                             |
| `/agents/[slug]`         | Consultant profile/contact                   | Sale Agents Detail                      |
| `/services`              | Services: import, check, documents, sell car | Services Center                         |
| `/sell-your-car`         | Public sell-car intake                       | Sell Your Car                           |
| `/about`                 | About/company page                           | About Us                                |
| `/reviews`               | Client reviews                               | Clients Reviews or Reviews              |
| `/calculator`            | Import/payment cost calculator               | Calculator                              |
| `/blog`                  | Blog/news/SEO list                           | Blog Grid Style 1                       |
| `/blog/[slug]`           | Blog detail                                  | Blog Details 1                          |
| `/contact`               | Contact/map page                             | Contact                                 |
| `/account`               | Customer dashboard                           | Dashboard                               |
| `/account/favorites`     | Saved vehicles                               | My Favorites                            |
| `/account/compare`       | Saved compare list                           | Compare                                 |
| `/account/messages`      | Customer-agent messages                      | Message                                 |
| `/account/listings`      | Customer sell-car submissions                | My Listings                             |
| `/account/profile`       | Customer profile                             | My Profile                              |
| `/account/password`      | Change password                              | Change Password                         |
| `/admin`                 | Admin dashboard                              | Dashboard                               |
| `/admin/inventory`       | Admin listing management                     | My Listings                             |
| `/admin/inventory/new`   | Admin add vehicle                            | Add Listings 2                          |
| `/admin/inquiries`       | Lead/inquiry queue                           | Dashboard/Message adapted               |
| `/admin/messages`        | Admin-agent-customer messages                | Message                                 |
| `/admin/agents`          | Agent management                             | Sale Agents                             |
| `/admin/users`           | User management                              | Dashboard adapted                       |
| `/terms`                 | Terms and usage notes                        | Terms                                   |

Raw template filenames remain available for internal reference during development, but public
navigation should point to the branded routes above.

## Inventory View Strategy

The inventory page should not be locked to a single layout. Use the existing Auxero listing
templates as the visual source for a view switcher:

| View              | User value                                | Template source                 | Default availability             |
| ----------------- | ----------------------------------------- | ------------------------------- | -------------------------------- |
| Comfortable grid  | Best default browsing experience          | `listing-grid3-columns.html`    | Default on desktop/tablet        |
| Dense grid        | Faster visual scanning on large screens   | `listing-grid4-columns.html`    | Toggle on desktop                |
| Map / half-map    | Location-aware browsing and route context | `listing-gridstyle-halfmap.html` or `listing-topmap.html` | Toggle when map data is available |
| Mobile list/cards | Readable mobile browsing                  | Responsive card layout from grid templates | Default on mobile                |

The toggle should preserve active filters, sort, pagination, favorites, and compare state. If an
individual vehicle lacks precise coordinates, map view can group by city/area such as Plovdiv and
show a clear "exact viewing location confirmed by appointment" note.

Use these filter/sort controls:

- Search by make, model, keyword, source ID, and location.
- Status: available, new listing, client vehicle, imported/on request if applicable.
- Make, body type, fuel, gearbox, year range, mileage range, price range.
- Sort by default, newest, price low/high, year, mileage.
- Compare and favorite actions on every card.

## Component Plan

Shared layout:

- `src/lib/components/layout/AuxeroPageShell.svelte`
- `src/lib/components/layout/SiteHeader.svelte` for non-Auxero fallback surfaces only.
- `src/lib/components/layout/SiteFooter.svelte` for non-Auxero fallback surfaces only.
- `src/lib/components/layout/ScrollTop.svelte` for non-Auxero fallback surfaces only.

Homepage 05 components:

- `src/lib/components/home/HomeFiveTemplatePage.svelte`
- `src/lib/components/home/HomeFiveHeader.svelte`
- `src/lib/components/home/HomeFiveHero.svelte`
- `src/lib/components/home/HomeFiveFeaturedVehicles.svelte`
- `src/lib/components/home/HomeFiveBrandStrip.svelte`
- `src/lib/components/home/HomeFiveTypeGallery.svelte`
- `src/lib/components/home/HomeFiveCompareSection.svelte`
- `src/lib/components/home/HomeFiveBudgetSection.svelte`
- `src/lib/components/home/HomeFiveReviewsSection.svelte`
- `src/lib/components/home/HomeFiveNewsSection.svelte`
- `src/lib/components/home/HomeFiveFooter.svelte`
- `src/lib/components/home/HomeFiveModals.svelte`
- `src/lib/components/home/HomeFiveVehicleCard.svelte`

Inventory grid components:

- `src/lib/components/inventory/InventoryTemplatePage.svelte`
- `src/lib/components/inventory/AuxeroInventoryContent.svelte`
- `src/lib/components/inventory/AuxeroInventoryVehicleCard.svelte`

Vehicle detail 3 components:

- `src/lib/components/detail/AuxeroVehicleDetail.svelte`
- `src/lib/components/detail/AuxeroVehicleDetailGallery.svelte`
- `src/lib/components/detail/AuxeroVehicleFeatureTabs.svelte`
- `src/lib/components/detail/AuxeroVehicleDetailSidebar.svelte`
- `src/lib/components/detail/AuxeroVehicleOverview.svelte`
- `src/lib/components/detail/AuxeroVehicleDetailStaticContent.svelte`
- `src/lib/components/detail/VehicleDetailTemplatePage.svelte`

Account/admin/agent components:

- `src/lib/components/account/AccountShell.svelte`
- `src/lib/components/account/AccountDashboard.svelte`
- `src/lib/components/account/FavoritesList.svelte`
- `src/lib/components/account/MessagesPanel.svelte`
- `src/lib/components/account/ProfileForm.svelte`
- `src/lib/components/admin/AdminShell.svelte`
- `src/lib/components/admin/AdminInventoryTable.svelte`
- `src/lib/components/admin/AdminListingForm.svelte`
- `src/lib/components/admin/InquiriesQueue.svelte`
- `src/lib/components/agents/AgentCard.svelte`
- `src/lib/components/agents/AgentContactPanel.svelte`

Data and utilities:

- `src/lib/data/vehicles.ts`
- `src/lib/data/dealers.ts`
- `src/lib/data/agents.ts`
- `src/lib/data/blog.ts`
- `src/lib/data/bohemcars.ts`
- `src/lib/data/bohemcars-listings.json`
- `src/lib/utils/cn.ts`
- `src/lib/utils/format.ts`

Backend/auth modules:

- `src/lib/server/auth.ts`
- `src/lib/server/agent-detail-state.ts`
- `src/lib/server/account-dashboard-state.ts`
- `src/lib/server/account-listings-state.ts`
- `src/lib/server/account-message-state.ts`
- `src/lib/server/account-profile-state.ts`
- `src/lib/server/blog-state.ts`
- `src/lib/server/db.ts`
- `src/lib/server/compare-state.ts`
- `src/lib/server/inventory-state.ts`
- `src/lib/server/inventory.ts`
- `src/lib/server/messages.ts`
- `src/lib/server/inquiries.ts`
- `src/lib/server/vehicle-detail-state.ts`
- `src/lib/server/roles.ts`

## 1:1 Visual Requirements

- Preserve Homepage 05 first viewport composition: dealer-style top contact bar, clear navigation, multi-car hero imagery, tabbed search/filter bar, lime accent, and the section order from `home-05.html`.
- Preserve listing grid density: large image cards, filter chips, sort dropdown, three-card desktop rhythm, dense four-card desktop rhythm, map/half-map option, and responsive card collapse.
- Preserve detail 3 structure: dark page body, left dominant vehicle gallery, right financing/overview card, circular favorite/share controls, and sticky feeling sidebar alignment.
- Use real raster vehicle imagery from the template assets or extracted equivalent assets, not plain placeholder blocks.
- Keep UI text code-native. Do not ship screenshots as UI.
- Use responsive rules that keep search fields, cards, and details readable at desktop, tablet, and mobile widths.
- Preserve account/admin dashboard visual patterns while replacing demo content with role-aware Bohemcars data.
- Preserve agents layout while replacing fake sales identities with real Bohemcars agents or role-based consultants until real staff assets are provided.
- Preserve admin/account/agent pages as template-faithful screens. The implementation should not
  simplify, restyle, or remove useful existing dashboard widgets, sidebars, actions, forms, or
  message/listing sections; it should rebrand and wire them.

## Account And Role Model

Accounts are part of the product, not demo-only pages.

Roles:

- Customer: favorites, compare list, messages, sell-car submissions, profile, password.
- Agent: assigned inquiries, customer messages, contact profile, vehicle notes if needed.
- Admin: inventory CRUD, lead queue, messages, agents, users, submissions, dashboard analytics.

Auth requirements:

- Email/password login.
- Password change.
- Protected routes for account/admin.
- Role-based access checks for admin and agent routes.
- Public compare can work without login, but logged-in users can persist compare/favorites.
- All inquiry/message actions should store enough context: vehicle, user/contact details, assigned agent, status, and timestamp.

## Implementation Sequence

1. Audit Auxero assets and save the image/font/icon inventory needed for Bohemcars.
2. Copy Bohemcars logo, generated imagery, brand assets, and listing data from `M:\bohemcars-final`.
3. Add a controlled template branding/data layer that preserves Auxero CSS/classes.
4. Replace ThemeForest/Aurexo/demo copy with Bohemcars copy, contacts, nav, metadata, and footer text.
5. Implement Homepage 05 as the branded home.
6. Implement inventory default grid and real Bohemcars listing data.
7. Add inventory view toggle: 3-grid, 4-grid, and map/half-map.
8. Implement Listing Details 3 with real listing details, contact actions, compare, and favorite.
9. Implement compare as a real buyer flow with public local state and optional account persistence.
10. Implement agents as Bohemcars consultants with contact routing.
11. Implement backend auth, sessions, roles, and route guards.
12. Implement customer account pages: dashboard, favorites, compare, messages, submissions, profile, password.
13. Implement admin pages: dashboard, inventory CRUD, add listing, inquiries, messages, agents, users.
14. Implement sell-your-car intake and store submissions for admin/agent review.
15. Add support pages using the same template visual system: services, about, reviews, calculator, FAQ, terms, blog, contact.
16. Wire filtering, sorting, favorites, comparison, calculator, tabs, forms, inquiry status, and message state.
17. Add unit tests for formatting, filtering, search, calculator, auth/role helpers, route data helpers, and view toggle state.
18. Add Playwright checks for homepage, inventory view toggle, map fallback, vehicle detail, compare, agents, account, admin, sell-your-car, and contact.
19. Run `npm run check`, `npm run lint`, `npm run test:unit -- --run`, `npm run build`, and browser QA.

## Acceptance Criteria

- The project installs and runs with `npm run dev`.
- Homepage 05 is recognizably preserved as the Bohemcars homepage.
- Inventory defaults to the listing grid layout and offers working 3-grid, 4-grid, and map/half-map view toggles where supported.
- Vehicle detail uses Listing Details 3, not Details 4 or Details 6.
- Compare is available from listing cards and vehicle detail without requiring login.
- Customer accounts support dashboard, favorites, compare, messages, submissions, profile, and password flows.
- Admin accounts support inventory management, add listing, inquiries, messages, agent management, and user management.
- Agents/consultants can be contacted from the public site and vehicle detail flow.
- All planned public, customer, agent, and admin routes exist and render useful, styled content.
- Core controls are interactive and data-backed enough for a production-direction prototype: search, filters, sort, view toggle, favorites, compare, calculator, tabs, forms, account state, role guards, inquiries, and messages.
- Desktop and mobile layouts are checked visually before handoff.

## Proposal Readiness Checkpoint

As of the 2026-05-27 finalization pass, the selected public, account, and admin route families are
rendered through SvelteKit pages with focused Svelte components for the migrated Auxero sections.
The remaining compatibility renderer is intentionally kept as the visual shell for Auxero head
assets, body classes, modals, and script tails while preserving the template 1:1. The handoff QA
checklist lives in `docs/QA_CHECKLIST.md`, and the public sitemap is limited to proposal-safe public
routes plus vehicle, consultant, and blog detail pages.
