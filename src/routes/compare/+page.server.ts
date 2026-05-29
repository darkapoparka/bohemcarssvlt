import type { PageServerLoad } from './$types';
import { compareVehiclesFromVehicles } from '$lib/auxero/compare';
import { resolveLocale } from '$lib/i18n/messages';
import { getCompareVehicles } from '$lib/server/compare-state';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ request, url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const renderOptions = {
		request,
		routePath: 'compare',
		searchParams: url.searchParams
	};
	const { pageDocument, slot: compareSlot } = renderAuxeroPageSlot('compare.html', renderOptions, {
		marker: 'data-bohemcars-compare-table',
		tagName: 'table',
		templateError: 'Compare template could not be rendered',
		slotError: 'Compare table slot could not be located'
	});

	return {
		afterCompareHtml: compareSlot.afterHtml,
		auxeroFullPage: true,
		beforeCompareHtml: compareSlot.beforeHtml,
		locale,
		pageDocument,
		vehicles: compareVehiclesFromVehicles(getCompareVehicles(renderOptions), locale)
	};
};
