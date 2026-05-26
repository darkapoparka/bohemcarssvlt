# Bohemcars Svelte rebuild

SvelteKit 2 / Svelte 5 rebuild of the Bohemcars site using the Auxero car dealer template as the visual source. The project preserves the selected Auxero pages and rebrands/wires them with Bohemcars inventory, contact data, consultants, account/admin surfaces, compare, support pages, and local prototype interactions.

## Source of truth

- Rebuild plan: `PROJECT_PLAN.md`
- Brand and inventory source: `M:\bohemcars-final`
- Primary template surfaces: Home 09, Listing Grid 3 Columns, Listing Details 3, Compare, Sale Agents, and Dashboard pages

## Commands

```sh
npm install
npm run check
npm run test:unit -- --run
npm run build
```

Playwright is configured for the route QA suite, but it starts a temporary preview server. Only run it when local ports are approved:

```sh
npm run test:e2e
```

## Route shape

Public routes are served through SvelteKit server endpoints that adapt the preserved Auxero HTML templates at request time. Branded routes include `/`, `/inventory`, `/inventory/[slug]`, `/compare`, `/agents`, `/services`, `/sell-your-car`, `/about`, `/reviews`, `/calculator`, `/faqs`, `/blog`, `/contact`, `/terms`, `/account/*`, and `/admin/*`.

Shop/cart/checkout/product/coming-soon pages are intentionally blocked from public routing.
