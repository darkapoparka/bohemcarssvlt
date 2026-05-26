import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAuxeroDashboardRecentData } from '$lib/server/auxero-account-data';
import { splitAuxeroDivBlockByMarker, splitAuxeroDocument } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';
import { canAccessBohemcarsRoute, resolveBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'admin';
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
	const html = renderAuxeroTemplate('dashboard.html', renderOptions);

	if (!html) {
		error(500, 'Admin dashboard template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const recentSlot = splitAuxeroDivBlockByMarker(
		pageDocument.bodyHtml,
		'data-bohemcars-dashboard-recent'
	);

	if (!recentSlot) {
		error(500, 'Admin dashboard recent slot could not be located');
	}

	return {
		afterRecentHtml: recentSlot.afterHtml,
		auxeroFullPage: true,
		beforeRecentHtml: recentSlot.beforeHtml,
		pageDocument,
		recent: getAuxeroDashboardRecentData('dashboard.html', renderOptions)
	};
};
