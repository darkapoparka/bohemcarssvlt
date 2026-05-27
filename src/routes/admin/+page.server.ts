import type { PageServerLoad } from './$types';
import { getAccountDashboardRecentData } from '$lib/server/account-dashboard-state';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';
import { requireBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'admin';
	const session = requireBohemcarsPageSession(request, routePath, url.searchParams);

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};
	const { pageDocument, slot: recentSlot } = renderAuxeroPageSlot('dashboard.html', renderOptions, {
		marker: 'data-bohemcars-dashboard-recent',
		templateError: 'Admin dashboard template could not be rendered',
		slotError: 'Admin dashboard recent slot could not be located'
	});

	return {
		afterRecentHtml: recentSlot.afterHtml,
		auxeroFullPage: true,
		beforeRecentHtml: recentSlot.beforeHtml,
		pageDocument,
		recent: getAccountDashboardRecentData('dashboard.html', renderOptions)
	};
};
