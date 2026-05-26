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
