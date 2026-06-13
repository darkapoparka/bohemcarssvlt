import type { PageServerLoad } from './$types';
import { compareVehiclesFromVehicles } from '$lib/auxero/compare';
import { vehicles } from '$lib/data/vehicles';
import { resolveLocale } from '$lib/i18n/messages';
import { getCompareVehicles } from '$lib/server/compare-state';

// POC route: NO pageDocument → the theme app.css never loads → clean slate.
// Renders the clean Svelte 5 + Tailwind v4 compare with zero Auxero CSS.
export const load: PageServerLoad = ({ request, url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const renderOptions = { request, routePath: 'compare', searchParams: url.searchParams };

	return {
		auxeroFullPage: true,
		allVehicles: compareVehiclesFromVehicles(vehicles, locale),
		locale,
		vehicles: compareVehiclesFromVehicles(getCompareVehicles(renderOptions), locale)
	};
};
