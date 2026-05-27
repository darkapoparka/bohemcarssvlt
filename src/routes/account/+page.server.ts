import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAuxeroDashboardRecentData } from '$lib/server/auxero-account-data';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';
import { canAccessBohemcarsRoute, resolveBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account';
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
	const { pageDocument, slot: recentSlot } = renderAuxeroPageSlot('dashboard.html', renderOptions, {
		marker: 'data-bohemcars-dashboard-recent',
		templateError: 'Account dashboard template could not be rendered',
		slotError: 'Account dashboard recent slot could not be located'
	});

	return {
		afterRecentHtml: recentSlot.afterHtml,
		auxeroFullPage: true,
		beforeRecentHtml: recentSlot.beforeHtml,
		pageDocument,
		recent: getAuxeroDashboardRecentData('dashboard.html', renderOptions)
	};
};
