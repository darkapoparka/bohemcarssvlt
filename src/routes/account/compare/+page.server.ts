import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { compareVehiclesFromVehicles } from '$lib/auxero/compare';
import { getCompareVehicles } from '$lib/server/auxero-listing-data';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';
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
	const { pageDocument, slot: compareSlot } = renderAuxeroPageSlot('compare.html', renderOptions, {
		marker: 'data-bohemcars-compare-table',
		tagName: 'table',
		templateError: 'Account compare template could not be rendered',
		slotError: 'Account compare table slot could not be located'
	});

	return {
		afterCompareHtml: compareSlot.afterHtml,
		auxeroFullPage: true,
		beforeCompareHtml: compareSlot.beforeHtml,
		pageDocument,
		vehicles: compareVehiclesFromVehicles(getCompareVehicles(renderOptions))
	};
};
