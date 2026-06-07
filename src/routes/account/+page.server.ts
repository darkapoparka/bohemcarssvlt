import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';
import { requireBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account';
	const session = requireBohemcarsPageSession(request, routePath, url.searchParams);

	if (session.role === 'admin') {
		redirect(302, '/admin');
	}

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};
	const { pageDocument, slot: recentSlot } = renderAuxeroPageSlot('dashboard.html', renderOptions, {
		marker: 'class="dashboard-content"',
		templateError: 'Account dashboard template could not be rendered',
		slotError: 'Account dashboard content slot could not be located'
	});

	return {
		afterRecentHtml: recentSlot.afterHtml,
		auxeroFullPage: true,
		beforeRecentHtml: recentSlot.beforeHtml,
		dashboardContentHtml: recentSlot.sectionHtml,
		dashboard: getAccountDashboardPageData('dashboard.html', renderOptions, {
			subtitle: 'Saved cars, listing submissions, and open Bohemcars conversations.',
			title: 'Account Dashboard'
		}),
		pageDocument
	};
};
