import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { compareVehiclesFromVehicles } from '$lib/auxero/compare';
import { getCompareVehicles } from '$lib/server/auxero-listing-data';
import { splitAuxeroDocument, splitAuxeroElementBlockByMarker } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';

export const load: PageServerLoad = ({ request, url }) => {
	const renderOptions = {
		request,
		routePath: 'compare',
		searchParams: url.searchParams
	};
	const html = renderAuxeroTemplate('compare.html', renderOptions);

	if (!html) {
		error(500, 'Compare template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const compareSlot = splitAuxeroElementBlockByMarker(
		pageDocument.bodyHtml,
		'data-bohemcars-compare-table',
		'table'
	);

	if (!compareSlot) {
		error(500, 'Compare table slot could not be located');
	}

	return {
		afterCompareHtml: compareSlot.afterHtml,
		auxeroFullPage: true,
		beforeCompareHtml: compareSlot.beforeHtml,
		pageDocument,
		vehicles: compareVehiclesFromVehicles(getCompareVehicles(renderOptions))
	};
};
