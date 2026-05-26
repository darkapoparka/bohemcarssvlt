import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { compareVehiclesFromVehicles } from '$lib/auxero/compare';
import { getCompareVehicles } from '$lib/server/auxero-listing-data';
import { splitAuxeroDocument, splitAuxeroElementBlockByMarker } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';
import { canAccessBohemcarsRoute, resolveBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account/compare';
	const session = resolveBohemcarsPageSession(request, routePath, url.searchParams);

	if (!session) {
		error(401, 'Bohemcars account session is required');
	}

	if (!canAccessBohemcarsRoute(session, routePath)) {
		error(403, 'Bohemcars account role cannot access this route');
	}

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};
	const html = renderAuxeroTemplate('compare.html', renderOptions);

	if (!html) {
		error(500, 'Account compare template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const compareSlot = splitAuxeroElementBlockByMarker(
		pageDocument.bodyHtml,
		'data-bohemcars-compare-table',
		'table'
	);

	if (!compareSlot) {
		error(500, 'Account compare table slot could not be located');
	}

	return {
		afterCompareHtml: compareSlot.afterHtml,
		auxeroFullPage: true,
		beforeCompareHtml: compareSlot.beforeHtml,
		pageDocument,
		vehicles: compareVehiclesFromVehicles(getCompareVehicles(renderOptions))
	};
};
