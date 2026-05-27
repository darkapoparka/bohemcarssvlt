# Bohemcars Agent Styling Rules

Bohemcars uses the Auxero template as the visual source of truth. Keep the selected template pages
visually faithful before adding any product-specific refinements.

- Preserve Auxero typography, spacing, section order, card structures, image ratios, colors,
  buttons, forms, headers, footers, dashboard shells, and responsive behavior.
- Do not add image zoom hovers to vehicle, consultant, article, or support-page cards. Vehicle
  images should stay still on hover unless the source Auxero interaction is explicitly required.
- Prefer Auxero fill-style hover states over border-only or underline-heavy hovers. For pill-like
  controls, use the `car-box` / `menu-tab-style2` pattern with a soft grey fill on hover or active.
- Do not add global `.btn` overrides. Buttons must use Auxero's template classes, sizing, radius,
  typography, and built-in fill animation unless a route-scoped product reason is documented.
- Do not add global `.container` overrides. Auxero's container width is part of the template grid
  rhythm; scope any non-template container sizing to non-Auxero wrappers.
- Keep hover effects calm: background fill, subtle icon color changes, and existing Auxero button
  fills are acceptable; lift-up transforms, glows, scale, zoom, large shadows, and decorative motion
  are not.
- Add Svelte components under `src/lib/components` and keep data shaping in `src/lib/auxero` or
  `src/lib/server`, not inside visual components.
- Run `npx @sveltejs/mcp svelte-autofixer <file>` after editing Svelte files, then verify with
  `npm run lint`, `npm run check`, unit tests, Playwright, build, and Browser screenshots for
  touched pages.
