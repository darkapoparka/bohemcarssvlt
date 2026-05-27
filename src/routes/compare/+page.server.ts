import type { PageServerLoad } from './$types';
import { compareVehiclesFromVehicles } from '$lib/auxero/compare';
import { getCompareVehicles } from '$lib/server/auxero-listing-data';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ request, url }) => {
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
		pageDocument,
		vehicles: compareVehiclesFromVehicles(getCompareVehicles(renderOptions))
	};
};
